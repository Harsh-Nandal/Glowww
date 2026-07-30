import { Router } from 'express'
import { Settings } from '../../models/index.js'
import { requireAdmin } from '../../middleware/auth.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { successResponse } from '../../utils/response.js'

const router = Router()
router.use(requireAdmin)

router.get('/', asyncHandler(async (req, res) => {
  const settings = await Settings.find().lean()

  const map = {}
  settings.forEach(s => { map[s.key] = s.value })
  return successResponse(res, { settings: map, raw: settings })
}))

router.post('/', asyncHandler(async (req, res) => {
  const { settings } = req.body // array of { key, value, group }

  const ops = settings.map(({ key, value, group }) => ({
    updateOne: {
      filter: { key },
      update: { $set: { key, value, group: group || 'general' } },
      upsert: true,
    },
  }))

  await Settings.bulkWrite(ops)

  const updated = await Settings.find().lean()
  const map = {}
  updated.forEach(s => { map[s.key] = s.value })

  return successResponse(res, { settings: map })
}))

export default router
