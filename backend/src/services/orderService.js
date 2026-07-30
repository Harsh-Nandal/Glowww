import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { Coupon } from '../models/index.js'
import { generateOrderNumber } from '../utils/generateOrderNumber.js'
import { getStoreSettings } from '../utils/getStoreSettings.js'

class OrderValidationError extends Error {}

// Re-validates cart items against live product/variant data, applies a coupon,
// computes shipping/tax/total, creates the Order, and decrements stock.
// Shared by POST /api/orders (COD) and POST /api/payment/razorpay/verify (paid).
export async function createOrderFromCart({
  userId,
  items,
  shippingAddress,
  paymentMethod = 'cod',
  paymentStatus = 'pending',
  paymentId,
  couponCode,
  notes,
  statusNote,
}) {
  if (!items?.length) throw new OrderValidationError('Cart is empty')
  if (!shippingAddress) throw new OrderValidationError('Shipping address is required')

  let subtotal = 0
  const orderItems = []

  for (const item of items) {
    const product = await Product.findById(item.productId)
    if (!product || !product.isActive) {
      throw new OrderValidationError(`Product "${item.name}" is no longer available`)
    }

    let price = product.salePrice || product.price
    let stock = product.stock

    if (item.variantId && product.type === 'variable') {
      const variant = product.variants.id(item.variantId)
      if (!variant) throw new OrderValidationError('Product variant not found')
      price = variant.salePrice || variant.price
      stock = variant.stock
    }

    if (stock < item.quantity) {
      throw new OrderValidationError(`Insufficient stock for "${product.name}"`)
    }

    orderItems.push({
      product: product._id,
      variantId: item.variantId || undefined,
      name: product.name,
      image: product.images?.[0] || '',
      price,
      quantity: item.quantity,
      variant: item.variant || undefined,
    })
    subtotal += price * item.quantity
  }

  let discount = 0
  let couponInfo = null

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    })

    if (!coupon) throw new OrderValidationError('Invalid or expired coupon')
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      throw new OrderValidationError(`Minimum order value ₹${coupon.minOrderValue} required for this coupon`)
    }

    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
    } else {
      discount = Math.min(coupon.value, subtotal)
    }

    couponInfo = { code: coupon.code, discount }
    await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } })
  }

  const { shippingCharge: baseShipping, freeShippingThreshold, taxRate } = await getStoreSettings()
  const shippingCharge = subtotal >= freeShippingThreshold ? 0 : baseShipping
  const tax = Math.round((subtotal - discount) * (taxRate / 100))
  const total = subtotal - discount + shippingCharge + tax

  const orderNumber = await generateOrderNumber()

  const order = await Order.create({
    user: userId,
    orderNumber,
    items: orderItems,
    shippingAddress,
    subtotal,
    discount,
    shippingCharge,
    tax,
    total,
    coupon: couponInfo,
    paymentMethod,
    paymentStatus,
    paymentId,
    notes,
    statusHistory: [{ status: 'placed', note: statusNote || 'Order placed by customer' }],
  })

  // Decrement stock
  for (const item of items) {
    if (item.variantId) {
      await Product.updateOne(
        { _id: item.productId, 'variants._id': item.variantId },
        { $inc: { 'variants.$.stock': -item.quantity, soldCount: item.quantity } }
      )
    } else {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      })
    }
  }

  return order
}

export { OrderValidationError }
