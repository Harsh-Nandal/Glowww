import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { cacheGet, cacheSet } from '../config/redis.js'

const router = Router()

// Free India Post pincode lookup — used to autofill City/State on checkout.
// Proxied server-side (not called directly from the browser) to avoid CORS
// issues and so the result can be cached (pincode-to-city/state is static).
router.get('/pincode/:code', asyncHandler(async (req, res) => {
  const { code } = req.params
  if (!/^\d{6}$/.test(code)) return errorResponse(res, 'Invalid pincode', 400)

  const cacheKey = `pincode:${code}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(res, cached)

  let json
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
      signal: AbortSignal.timeout(5000),
    })
    json = await response.json()
  } catch (err) {
    return errorResponse(res, 'Could not verify pincode', 502)
  }

  const result = json?.[0]
  const postOffice = result?.Status === 'Success' ? result.PostOffice?.[0] : null

  const payload = postOffice
    ? { found: true, city: postOffice.District, state: postOffice.State }
    : { found: false, city: null, state: null }

  await cacheSet(cacheKey, payload, 30 * 24 * 60 * 60)
  return successResponse(res, payload)
}))

export default router
