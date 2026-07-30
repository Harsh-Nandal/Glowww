import { Router } from 'express'
import { Contact } from '../../models/index.js'
import { requireAdmin } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { successResponse, notFound, paginatedResponse } from '../../utils/response.js'

const router = Router()
router.use(requireAdmin)

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const skip = (page - 1) * limit
  const { status, search } = req.query

  const query = {}
  if (status) query.status = status
  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { subject: { $regex: search, $options: 'i' } },
  ]

  const [contacts, total] = await Promise.all([
    Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(query),
  ])

  return paginatedResponse(res, contacts, total, page, limit)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id).lean()
  if (!contact) return notFound(res, 'Contact')
  return successResponse(res, { contact })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status, adminNote },
    { new: true }
  ).lean()

  if (!contact) return notFound(res, 'Contact')
  return successResponse(res, { contact })
}))

export default router
