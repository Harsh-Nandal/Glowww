import { Router } from 'express'
import Category from '../models/Category.js'
import { successResponse } from '../utils/response.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { cacheGet, cacheSet, cacheGetVersion, cacheBumpVersion } from '../config/redis.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const ver = await cacheGetVersion('categories')
  const cacheKey = `categories:list:v${ver}`
  const cached = await cacheGet(cacheKey)
  if (cached) return res.status(200).json(cached)

  const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 }).lean()
  const payload = { success: true, data: categories }
  await cacheSet(cacheKey, payload, 600)
  return res.status(200).json(payload)
}))

router.post('/', asyncHandler(async (req, res) => {
  const body = { ...req.body }
  if (!body.slug && body.name) {
    body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
  const category = await Category.create(body)
  await cacheBumpVersion('categories')
  return successResponse(res, { category }, 201)
}))

export default router
