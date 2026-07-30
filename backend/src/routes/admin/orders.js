import { Router } from 'express'
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

  const query = {}
  const { status, paymentStatus, search, from, to } = req.query

  if (status) query.status = status
  if (paymentStatus) query.paymentStatus = paymentStatus
  if (from || to) {
    query.createdAt = {}
    if (from) query.createdAt.$gte = new Date(from)
    if (to) query.createdAt.$lte = new Date(to)
  }
  if (search) query.$or = [
    { orderNumber: { $regex: search, $options: 'i' } },
  ]

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(query),
  ])

  return paginatedResponse(res, orders, total, page, limit)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone addresses')
    .populate('items.product', 'name slug thumbnail')
    .lean()

  if (!order) return notFound(res, 'Order')
  return successResponse(res, { order })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const { status, paymentStatus, tracking, notes, cancelReason } = req.body

  const order = await Order.findById(req.params.id)
  if (!order) return notFound(res, 'Order')

  if (status && status !== order.status) {
    order.statusHistory.push({ status, note: notes || '', timestamp: new Date() })
    order.status = status
  }
  if (paymentStatus) order.paymentStatus = paymentStatus
  if (tracking) order.tracking = { ...order.tracking, ...tracking }
  if (notes) order.notes = notes
  if (cancelReason) order.cancelReason = cancelReason

  await order.save()

  const updated = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.product', 'name slug thumbnail')
    .lean()

  return successResponse(res, { order: updated })
}))

export default router
