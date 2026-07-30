import { Router } from 'express'
import { Coupon } from '../models/index.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

router.post('/validate', asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body

  if (!code) return errorResponse(res, 'Coupon code is required')

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  })

  if (!coupon) return errorResponse(res, 'Invalid or expired coupon code')

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return errorResponse(res, 'This coupon has reached its usage limit')
  }

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return errorResponse(res, `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`)
  }

  return successResponse(res, {
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount,
      description: coupon.description,
    },
  })
}))

export default router
