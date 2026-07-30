import { Router } from 'express'
import { Banner } from '../../models/index.js'
import { requireAdmin } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { successResponse, notFound } from '../../utils/response.js'

const router = Router()
router.use(requireAdmin)

router.get('/', asyncHandler(async (req, res) => {
  const position = req.query.position
  const query = {}
  if (position) query.position = position

  const banners = await Banner.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean()
  return successResponse(res, { banners })
}))

router.post('/', asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body)
  return successResponse(res, { banner }, 201)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id).lean()
  if (!banner) return notFound(res, 'Banner')
  return successResponse(res, { banner })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean()
  if (!banner) return notFound(res, 'Banner')
  return successResponse(res, { banner })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id)
  if (!banner) return notFound(res, 'Banner')
  return successResponse(res, { message: 'Banner deleted' })
}))

export default router
