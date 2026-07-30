import { Router } from 'express'
import Product from '../models/Product.js'
import '../models/Category.js'
import '../models/Brand.js'
import { successResponse, notFound, paginatedResponse } from '../utils/response.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { cacheGet, cacheSet, cacheGetVersion, cacheBumpVersion } from '../config/redis.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12
  const skip = (page - 1) * limit

  const ver = await cacheGetVersion('products')
  const cacheKey = `products:list:v${ver}:` + Object.entries(req.query).sort().map(([k, v]) => `${k}=${v}`).join('&')
  const cached = await cacheGet(cacheKey)
  if (cached) return res.status(200).json(cached)

  const query = { isActive: true }

  const { category, brand, featured, newArrival, bestSeller, search, minPrice, maxPrice, tags, sort } = req.query

  if (category) query.category = category
  if (brand) query.brand = brand
  if (featured === 'true') query.isFeatured = true
  if (newArrival === 'true') query.isNewArrival = true
  if (bestSeller === 'true') query.isBestSeller = true
  if (search) query.$text = { $search: search }
  if (tags) query.tags = { $in: tags.split(',') }
  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }

  let sortOption = { createdAt: -1 }
  if (sort === 'price_asc') sortOption = { price: 1 }
  else if (sort === 'price_desc') sortOption = { price: -1 }
  else if (sort === 'rating') sortOption = { rating: -1 }
  else if (sort === 'popular') sortOption = { soldCount: -1 }
  else if (sort === 'newest') sortOption = { createdAt: -1 }

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .populate('brand', 'name logo')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ])

  const payload = {
    success: true,
    data: products,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  }
  await cacheSet(cacheKey, payload, 60)
  return res.status(200).json(payload)
}))

router.post('/', asyncHandler(async (req, res) => {
  const body = { ...req.body }

  if (!body.slug && body.name) {
    body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const product = await Product.create(body)
  await cacheBumpVersion('products')
  return successResponse(res, { product }, 201)
}))

router.get('/:slug', asyncHandler(async (req, res) => {
  const ver = await cacheGetVersion('products')
  const cacheKey = `products:slug:v${ver}:${req.params.slug}`
  const cached = await cacheGet(cacheKey)
  if (cached) return res.status(200).json(cached)

  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate('brand', 'name logo')
    .lean()

  if (!product) return notFound(res, 'Product')
  const payload = { success: true, product }
  await cacheSet(cacheKey, payload, 300)
  return res.status(200).json(payload)
}))

router.put('/:slug', asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true, runValidators: true }
  )
  if (!product) return notFound(res, 'Product')
  await cacheBumpVersion('products')
  return successResponse(res, { product })
}))

router.delete('/:slug', asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { slug: req.params.slug },
    { isActive: false },
    { new: true }
  )
  if (!product) return notFound(res, 'Product')
  await cacheBumpVersion('products')
  return successResponse(res, { message: 'Product deleted successfully' })
}))

export default router
