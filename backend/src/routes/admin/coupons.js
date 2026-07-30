import { Router } from 'express'
import { Coupon } from '../../models/index.js'
import { requireAdmin } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { successResponse, errorResponse, notFound, paginatedResponse } from '../../utils/response.js'

const router = Router()
router.use(requireAdmin)

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const skip = (page - 1) * limit
  const { search, status } = req.query

  const query = {}
  if (search) query.code = { $regex: search, $options: 'i' }
  if (status === 'active') query.isActive = true
  if (status === 'inactive') query.isActive = false
  if (status === 'expired') query.endDate = { $lt: new Date() }

  const [coupons, total] = await Promise.all([
    Coupon.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Coupon.countDocuments(query),
  ])

  return paginatedResponse(res, coupons, total, page, limit)
}))

router.post('/', asyncHandler(async (req, res) => {
  const body = { ...req.body }

  const existing = await Coupon.findOne({ code: body.code?.toUpperCase() })
  if (existing) return errorResponse(res, 'A coupon with this code already exists')

  const coupon = await Coupon.create(body)
  return successResponse(res, { coupon }, 201)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id).lean()
  if (!coupon) return notFound(res, 'Coupon')
  return successResponse(res, { coupon })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const body = { ...req.body }
  delete body.code // code cannot be changed

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }).lean()
  if (!coupon) return notFound(res, 'Coupon')
  return successResponse(res, { coupon })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id)
  if (!coupon) return notFound(res, 'Coupon')
  return successResponse(res, { message: 'Coupon deleted' })
}))

export default router
