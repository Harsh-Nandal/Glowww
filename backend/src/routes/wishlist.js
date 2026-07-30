import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { successResponse, errorResponse } from '../utils/response.js'

const router = Router()

// Note: like cart.js, these endpoints are new — the frontend's wishlistSlice
// already expected them but the original Next.js API never implemented them.

function toWishlistItem(product) {
  return {
    productId: product._id,
    name: product.name,
    image: product.images?.[0] || '',
    price: product.salePrice || product.price,
    slug: product.slug,
  }
}

router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name slug images price salePrice').lean()
  const wishlist = (user?.wishlist || []).map(toWishlistItem)
  return successResponse(res, { wishlist })
}))

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { productId } = req.body
  if (!productId) return errorResponse(res, 'Product ID is required')

  const user = await User.findById(req.user.id)
  const idx = user.wishlist.findIndex((id) => id.toString() === productId)

  if (idx >= 0) {
    user.wishlist.splice(idx, 1)
  } else {
    user.wishlist.push(productId)
  }
  await user.save()

  const populated = await User.findById(req.user.id).populate('wishlist', 'name slug images price salePrice').lean()
  const wishlist = (populated.wishlist || []).map(toWishlistItem)

  return successResponse(res, { wishlist })
}))

export default router
