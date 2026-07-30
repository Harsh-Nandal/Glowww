import { Router } from 'express'
import User from '../../models/User.js'
import Order from '../../models/Order.js'
import { requireAdmin } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { successResponse, notFound, paginatedResponse } from '../../utils/response.js'

const router = Router()
router.use(requireAdmin)

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const skip = (page - 1) * limit
  const { search, status } = req.query

  const query = { role: 'user' }
  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { phone: { $regex: search, $options: 'i' } },
  ]
  if (status === 'active') query.isActive = true
  if (status === 'inactive') query.isActive = false

  const [users, total] = await Promise.all([
    User.find(query).select('-password -resetPasswordToken -resetPasswordExpire').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(query),
  ])

  const userIds = users.map(u => u._id)
  const orderCounts = await Order.aggregate([
    { $match: { user: { $in: userIds } } },
    { $group: { _id: '$user', count: { $sum: 1 }, total: { $sum: '$total' } } },
  ])
  const orderMap = {}
  orderCounts.forEach(o => { orderMap[o._id.toString()] = o })

  const enriched = users.map(u => ({
    ...u,
    orderCount: orderMap[u._id.toString()]?.count || 0,
    totalSpent: orderMap[u._id.toString()]?.total || 0,
  }))

  return paginatedResponse(res, enriched, total, page, limit)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpire').lean()
  if (!user) return notFound(res, 'Customer')

  const orders = await Order.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return successResponse(res, { customer: { ...user, orders, totalSpent } })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const { isActive } = req.body

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  ).select('-password').lean()

  if (!user) return notFound(res, 'Customer')
  return successResponse(res, { customer: user })
}))

export default router
