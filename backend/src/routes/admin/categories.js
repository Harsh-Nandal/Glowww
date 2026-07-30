import { Router } from 'express'
import Category from '../../models/Category.js'
import Product from '../../models/Product.js'
import { requireAdmin } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { successResponse, errorResponse, notFound, paginatedResponse } from '../../utils/response.js'
import { cacheBumpVersion } from '../../config/redis.js'

const router = Router()
router.use(requireAdmin)

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 50
  const skip = (page - 1) * limit
  const search = req.query.search
  const all = req.query.all === 'true'

  const query = {}
  if (search) query.name = { $regex: search, $options: 'i' }

  if (all) {
    const categories = await Category.find(query).populate('parent', 'name slug').sort({ displayOrder: 1, name: 1 }).lean()
    return successResponse(res, { categories })
  }

  const [categories, total] = await Promise.all([
    Category.find(query).populate('parent', 'name slug').sort({ displayOrder: 1, name: 1 }).skip(skip).limit(limit).lean(),
    Category.countDocuments(query),
  ])

  return paginatedResponse(res, categories, total, page, limit)
}))

router.post('/', asyncHandler(async (req, res) => {
  const body = { ...req.body }

  if (!body.slug && body.name) {
    body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const existing = await Category.findOne({ slug: body.slug })
  if (existing) return errorResponse(res, 'A category with this name/slug already exists')

  const category = await Category.create(body)
  const populated = await Category.findById(category._id).populate('parent', 'name slug').lean()
  await cacheBumpVersion('categories')
  return successResponse(res, { category: populated }, 201)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate('parent', 'name slug').lean()
  if (!category) return notFound(res, 'Category')
  return successResponse(res, { category })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('parent', 'name slug')
    .lean()

  if (!category) return notFound(res, 'Category')
  await cacheBumpVersion('categories')
  return successResponse(res, { category })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({ category: req.params.id })
  if (productCount > 0) {
    return errorResponse(res, `Cannot delete: ${productCount} product(s) use this category`)
  }

  const childCount = await Category.countDocuments({ parent: req.params.id })
  if (childCount > 0) {
    return errorResponse(res, `Cannot delete: ${childCount} sub-category(ies) exist under this category`)
  }

  const category = await Category.findByIdAndDelete(req.params.id)
  if (!category) return notFound(res, 'Category')

  await cacheBumpVersion('categories')
  return successResponse(res, { message: 'Category deleted successfully' })
}))

export default router
