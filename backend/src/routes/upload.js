import { Router } from 'express'
import multer from 'multer'
import { uploadImage } from '../utils/cloudinary.js'
import { requireAdmin } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { successResponse, errorResponse } from '../utils/response.js'

const upload = multer({ storage: multer.memoryStorage() })
const router = Router()

router.post('/', requireAdmin, upload.single('file'), asyncHandler(async (req, res) => {
  const folder = req.body.folder || 'gloww'

  if (!req.file) return errorResponse(res, 'No file provided', 500)

  const result = await uploadImage(req.file.buffer, folder)
  return successResponse(res, { url: result.url, publicId: result.publicId })
}))

export default router
