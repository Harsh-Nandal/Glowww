import { Router } from 'express'
import Order from '../models/Order.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { successResponse, errorResponse, notFound, paginatedResponse } from '../utils/response.js'
import { createOrderFromCart, OrderValidationError } from '../services/orderService.js'

const router = Router()

router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments({ user: req.user.id }),
  ])

  return paginatedResponse(res, orders, total, page, limit)
}))

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, couponCode, notes } = req.body

  try {
    const order = await createOrderFromCart({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      couponCode,
      notes,
    })
    return successResponse(res, { order, message: 'Order placed successfully' }, 201)
  } catch (err) {
    if (err instanceof OrderValidationError) return errorResponse(res, err.message)
    throw err
  }
}))

router.get('/:id', requireAuth, asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).lean()
  if (!order) return notFound(res, 'Order')
  return successResponse(res, { order })
}))

export default router
