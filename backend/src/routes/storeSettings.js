import { Router } from 'express'
import { getStoreSettings } from '../utils/getStoreSettings.js'
import { successResponse } from '../utils/response.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

// Public endpoint — returns only the commerce settings needed by the frontend
router.get('/', asyncHandler(async (req, res) => {
  const settings = await getStoreSettings()
  return successResponse(res, { settings })
}))

export default router
