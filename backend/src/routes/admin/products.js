import { Router } from 'express'
import Product from '../../models/Product.js'
import '../../models/Category.js'
import '../../models/Brand.js'
import { requireAdmin } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { successResponse, notFound, paginatedResponse } from '../../utils/response.js'
import { cacheBumpVersion } from '../../config/redis.js'

const router = Router()
router.use(requireAdmin)

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const skip = (page - 1) * limit

  const query = {}
  const { search, category, brand, status, featured } = req.query

  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { sku: { $regex: search, $options: 'i' } },
  ]
  if (category) query.category = category
  if (brand) query.brand = brand
  if (status === 'active') query.isActive = true
  if (status === 'inactive') query.isActive = false
  if (featured === 'true') query.isFeatured = true

  const sort = req.query.sort || '-createdAt'
  const sortObj = sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 }

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .populate('brand', 'name logo')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ])

  return paginatedResponse(res, products, total, page, limit)
}))

router.post('/', asyncHandler(async (req, res) => {
  const body = { ...req.body }

  if (!body.slug && body.name) {
    body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
  if (!body.sku && body.name) {
    body.sku = `SKU-${Date.now()}`
  }

  if (body.type === 'variable' && Array.isArray(body.variants) && body.variants.length > 0) {
    const dv = body.variants.find(v => v.isDefault) || body.variants[0]
    body.price = Number(dv.price) || 0
    const sp = Number(dv.salePrice)
    body.salePrice = (dv.salePrice && !isNaN(sp) && sp > 0 && sp < body.price) ? sp : null
  }

  const product = await Product.create(body)
  const populated = await Product.findById(product._id)
    .populate('category', 'name slug')
    .populate('brand', 'name logo')
    .lean()

  await cacheBumpVersion('products')
  return successResponse(res, { product: populated }, 201)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('brand', 'name logo')
    .lean()

  if (!product) return notFound(res, 'Product')
  return successResponse(res, { product })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const body = { ...req.body }

  if (body.name && !body.slug) {
    const existing = await Product.findById(req.params.id).select('slug').lean()
    if (!existing?.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
  }

  if (body.type === 'variable' && Array.isArray(body.variants) && body.variants.length > 0) {
    const dv = body.variants.find(v => v.isDefault) || body.variants[0]
    body.price = Number(dv.price) || 0
    const sp = Number(dv.salePrice)
    body.salePrice = (dv.salePrice && !isNaN(sp) && sp > 0 && sp < body.price) ? sp : null
  }

  const product = await Product.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
    .populate('category', 'name slug')
    .populate('brand', 'name logo')
    .lean()

  if (!product) return notFound(res, 'Product')
  await cacheBumpVersion('products')
  return successResponse(res, { product })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return notFound(res, 'Product')
  await cacheBumpVersion('products')
  return successResponse(res, { message: 'Product deleted successfully' })
}))

export default router
