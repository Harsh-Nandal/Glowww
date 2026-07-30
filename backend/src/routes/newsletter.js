import { Router } from 'express'
import { Newsletter } from '../models/index.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

router.post('/', asyncHandler(async (req, res) => {
  const { email } = req.body

  if (!email) return errorResponse(res, 'Email is required')

  const existing = await Newsletter.findOne({ email: email.toLowerCase() })
  if (existing) return errorResponse(res, 'This email is already subscribed')

  await Newsletter.create({ email })
  return successResponse(res, { message: 'Subscribed successfully. Welcome to GLOWW!' }, 201)
}))

export default router
