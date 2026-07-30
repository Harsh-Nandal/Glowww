import { Router } from 'express'
import Brand from '../../models/Brand.js'
import Product from '../../models/Product.js'
import { requireAdmin } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { successResponse, errorResponse, notFound, paginatedResponse } from '../../utils/response.js'

const router = Router()
router.use(requireAdmin)

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const skip = (page - 1) * limit
  const search = req.query.search
  const all = req.query.all === 'true'

  const query = {}
  if (search) query.name = { $regex: search, $options: 'i' }

  if (all) {
    const brands = await Brand.find(query).sort({ name: 1 }).lean()
    return successResponse(res, { brands })
  }

  const [brands, total] = await Promise.all([
    Brand.find(query).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Brand.countDocuments(query),
  ])

  return paginatedResponse(res, brands, total, page, limit)
}))

router.post('/', asyncHandler(async (req, res) => {
  const body = { ...req.body }

  if (!body.slug && body.name) {
    body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const existing = await Brand.findOne({ slug: body.slug })
  if (existing) return errorResponse(res, 'A brand with this name/slug already exists')

  const brand = await Brand.create(body)
  return successResponse(res, { brand }, 201)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id).lean()
  if (!brand) return notFound(res, 'Brand')
  return successResponse(res, { brand })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean()
  if (!brand) return notFound(res, 'Brand')
  return successResponse(res, { brand })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({ brand: req.params.id })
  if (productCount > 0) {
    return errorResponse(res, `Cannot delete: ${productCount} product(s) use this brand`)
  }

  const brand = await Brand.findByIdAndDelete(req.params.id)
  if (!brand) return notFound(res, 'Brand')

  return successResponse(res, { message: 'Brand deleted successfully' })
}))

export default router
