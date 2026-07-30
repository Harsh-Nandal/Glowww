import { Router } from 'express'
import User from '../models/User.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { successResponse, errorResponse, notFound } from '../utils/response.js'

const router = Router()

// Note: these endpoints did not exist in the original Next.js API even though the
// frontend's cartSlice already calls them — implemented here to match that
// pre-existing contract (GET returns {cart}, mutations return the updated {cart}).

router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('cart').lean()
  return successResponse(res, { cart: user?.cart || [] })
}))

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body

  const product = await Product.findById(productId)
  if (!product || !product.isActive) return errorResponse(res, 'Product not found')

  let price = product.salePrice || product.price
  let stock = product.stock
  let variantSnapshot = null

  if (variantId && product.type === 'variable') {
    const variant = product.variants.id(variantId)
    if (!variant) return errorResponse(res, 'Product variant not found')
    price = variant.salePrice || variant.price
    stock = variant.stock
    variantSnapshot = { label: variant.label, sku: variant.sku }
  }

  const user = await User.findById(req.user.id)
  const existing = user.cart.find(
    (i) => i.productId.toString() === productId && (i.variantId?.toString() || null) === (variantId || null)
  )

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, stock || 99)
  } else {
    user.cart.push({
      productId,
      variantId: variantId || null,
      name: product.name,
      image: product.images?.[0] || '',
      price,
      variant: variantSnapshot,
      quantity,
      stock,
    })
  }

  await user.save()
  return successResponse(res, { cart: user.cart })
}))

router.put('/:itemId', requireAuth, asyncHandler(async (req, res) => {
  const { quantity } = req.body

  const user = await User.findById(req.user.id)
  const item = user.cart.id(req.params.itemId)
  if (!item) return notFound(res, 'Cart item')

  item.quantity = Math.max(1, Math.min(quantity, item.stock || 99))
  await user.save()

  return successResponse(res, { cart: user.cart })
}))

router.delete('/:itemId', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  user.cart.pull({ _id: req.params.itemId })
  await user.save()

  return successResponse(res, { cart: user.cart })
}))

export default router
