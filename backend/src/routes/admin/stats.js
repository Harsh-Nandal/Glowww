import { Router } from 'express'
import User from '../../models/User.js'
import Product from '../../models/Product.js'
import Order from '../../models/Order.js'
import { Review, Contact } from '../../models/index.js'
import { requireAdmin } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { successResponse } from '../../utils/response.js'

const router = Router()
router.use(requireAdmin)

router.get('/', asyncHandler(async (req, res) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalOrders,
    monthOrders,
    totalRevenue,
    monthRevenue,
    totalProducts,
    totalUsers,
    pendingReviews,
    newContacts,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'user' }),
    Review.countDocuments({ isApproved: false }),
    Contact.countDocuments({ status: 'new' }),
  ])

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .lean()

  const revenueChart = await Order.aggregate([
    { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
    { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ])

  return successResponse(res, {
    stats: {
      totalOrders,
      monthOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      totalProducts,
      totalUsers,
      pendingReviews,
      newContacts,
    },
    recentOrders,
    revenueChart,
  })
}))

export default router
