/**
 * One-time admin seeder API route.
 *
 * SETUP:
 *   1. Add  ADMIN_SEED_SECRET=some-long-random-string  to backend/.env
 *   2. Call POST /api/admin/seed  with header  x-seed-secret: <your-secret>
 *   3. After the admin is created, REMOVE this file (or remove ADMIN_SEED_SECRET
 *      from .env) so it cannot be called again.
 *
 * This route deliberately does NOT use requireAdmin so it can bootstrap the
 * very first admin before any JWT exists.
 */

import { Router } from 'express'
import User from '../../models/User.js'
import { successResponse, errorResponse } from '../../utils/response.js'
import { asyncHandler } from '../../middleware/errorHandler.js'

const router = Router()

router.post('/', asyncHandler(async (req, res) => {
  const SEED_SECRET = process.env.ADMIN_SEED_SECRET

  if (!SEED_SECRET) {
    return errorResponse(res, 'ADMIN_SEED_SECRET is not configured. Add it to backend/.env before using this endpoint.', 503)
  }

  const supplied = req.headers['x-seed-secret']
  if (!supplied || supplied !== SEED_SECRET) {
    return errorResponse(res, 'Not found', 404)
  }

  const body = req.body || {}

  const name = body.name || process.env.ADMIN_NAME || 'Admin'
  const email = body.email || process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = body.password || process.env.ADMIN_PASSWORD || 'Admin@123'

  const existing = await User.findOne({ email: email.toLowerCase() })

  if (existing) {
    if (existing.role === 'admin') {
      return successResponse(res, {
        message: 'Admin already exists — no changes made.',
        email: existing.email,
        alreadyAdmin: true,
      })
    }

    existing.role = 'admin'
    existing.isVerified = true
    existing.isActive = true
    await existing.save()

    return successResponse(res, {
      message: 'Existing account promoted to admin.',
      email: existing.email,
      id: existing._id,
    })
  }

  // Password is intentionally passed in plaintext — the UserSchema pre-save
  // hook (bcrypt, rounds=12) hashes it before writing to MongoDB.
  const admin = await User.create({
    name,
    email,
    password,
    role: 'admin',
    isVerified: true,
    isActive: true,
  })

  return successResponse(res, {
    message: 'Admin account created successfully.',
    name: admin.name,
    email: admin.email,
    role: admin.role,
    id: admin._id,
    warning: 'Remove this route (or ADMIN_SEED_SECRET from .env) now that seeding is done.',
  }, 201)
}))

// Explicitly block GET/PUT/DELETE — only POST is allowed
router.get('/', (req, res) => errorResponse(res, 'Not found', 404))
router.put('/', (req, res) => errorResponse(res, 'Not found', 404))
router.delete('/', (req, res) => errorResponse(res, 'Not found', 404))

export default router
