import { Router } from 'express'
import { Review } from '../models/index.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const productId = req.query.product
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const query = { isApproved: true }
  if (productId) query.product = productId

  const [reviews, total] = await Promise.all([
    Review.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Review.countDocuments(query),
  ])

  return paginatedResponse(res, reviews, total, page, limit)
}))

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body

  if (!productId || !rating || !comment) {
    return errorResponse(res, 'Product, rating, and comment are required')
  }

  const existing = await Review.findOne({ product: productId, user: req.user.id })
  if (existing) return errorResponse(res, 'You have already reviewed this product')

  const review = await Review.create({
    product: productId,
    user: req.user.id,
    rating,
    title,
    comment,
  })

  const stats = await Review.aggregate([
    { $match: { product: review.product, isApproved: true } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avg * 10) / 10,
      reviewCount: stats[0].count,
    })
  }

  return successResponse(res, { review, message: 'Review submitted and pending approval' }, 201)
}))

export default router
