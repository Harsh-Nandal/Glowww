import { Router } from 'express'
import { Contact } from '../models/index.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

router.post('/', asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body

  if (!name || !email || !message) {
    return errorResponse(res, 'Name, email, and message are required')
  }

  const contact = await Contact.create({ name, email, phone, subject, message })
  return successResponse(res, { contact, message: 'Message sent successfully. We will get back to you soon.' }, 201)
}))

export default router
