import { Router } from 'express'
import { Review } from '../../models/index.js'
import Product from '../../models/Product.js'
import { requireAdmin } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { successResponse, notFound, paginatedResponse } from '../../utils/response.js'

const router = Router()
router.use(requireAdmin)

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const skip = (page - 1) * limit
  const { status, rating } = req.query

  const query = {}
  if (status === 'pending') query.isApproved = false
  if (status === 'approved') query.isApproved = true
  if (rating) query.rating = Number(rating)

  const [reviews, total] = await Promise.all([
    Review.find(query)
      .populate('product', 'name slug thumbnail')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(query),
  ])

  return paginatedResponse(res, reviews, total, page, limit)
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const { isApproved } = req.body

  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved }, { new: true })
    .populate('product', 'name slug')
    .populate('user', 'name email')
    .lean()

  if (!review) return notFound(res, 'Review')

  const productId = review.product?._id || review.product
  if (productId) {
    const stats = await Review.aggregate([
      { $match: { product: productId, isApproved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])
    await Product.findByIdAndUpdate(productId, {
      rating: stats[0]?.avg || 0,
      reviewCount: stats[0]?.count || 0,
    })
  }

  return successResponse(res, { review })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id)
  if (!review) return notFound(res, 'Review')

  return successResponse(res, { message: 'Review deleted' })
}))

export default router
