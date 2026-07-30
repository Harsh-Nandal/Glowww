import { Router } from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import Product from '../models/Product.js'
import { Coupon } from '../models/index.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { getStoreSettings } from '../utils/getStoreSettings.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { createOrderFromCart, OrderValidationError } from '../services/orderService.js'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const router = Router()

router.post('/create-order', requireAuth, asyncHandler(async (req, res) => {
  const { items, couponCode } = req.body

  if (!items?.length) return errorResponse(res, 'Cart is empty')

  let subtotal = 0
  for (const item of items) {
    const product = await Product.findById(item.productId)
    if (!product || !product.isActive) {
      return errorResponse(res, `Product "${item.name}" is no longer available`)
    }

    let price = product.salePrice || product.price
    if (item.variantId && product.type === 'variable') {
      const variant = product.variants.id(item.variantId)
      if (!variant) return errorResponse(res, 'Product variant not found')
      price = variant.salePrice || variant.price
    }

    subtotal += price * item.quantity
  }

  let discount = 0
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    })
    if (coupon) {
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
      } else {
        discount = Math.min(coupon.value, subtotal)
      }
    }
  }

  const { shippingCharge: baseShipping, freeShippingThreshold, taxRate } = await getStoreSettings()
  const shippingCharge = subtotal >= freeShippingThreshold ? 0 : baseShipping
  const tax = Math.round((subtotal - discount) * (taxRate / 100))
  const total = Math.round(subtotal - discount + shippingCharge + tax)

  const rzpOrder = await razorpay.orders.create({
    amount: total * 100,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
  })

  return successResponse(res, {
    orderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  })
}))

router.post('/verify', requireAuth, asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    shippingAddress,
    paymentMethod,
    couponCode,
    notes,
  } = req.body

  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  const expected = Buffer.from(expectedSignature)
  const received = Buffer.from(razorpay_signature || '')
  const signatureValid =
    expected.length === received.length && crypto.timingSafeEqual(expected, received)

  if (!signatureValid) {
    return errorResponse(res, 'Payment verification failed. Invalid signature.', 400)
  }

  try {
    const order = await createOrderFromCart({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
      couponCode,
      notes,
      statusNote: 'Order placed and payment received via Razorpay',
    })
    return successResponse(res, { order, message: 'Payment verified and order placed successfully' }, 201)
  } catch (err) {
    if (err instanceof OrderValidationError) return errorResponse(res, err.message)
    throw err
  }
}))

export default router
