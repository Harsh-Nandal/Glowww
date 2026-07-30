import { Router } from 'express'
import { jwtVerify, createRemoteJWKSet } from 'jose'
import User from '../models/User.js'
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/jwt.js'
import { requireAuth, attachUser } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { successResponse, errorResponse } from '../utils/response.js'

// Firebase ID tokens are RS256-signed; verifying them against Firebase's own
// public JWKS lets us trust the phone_number claim without needing a
// firebase-admin service-account key. createRemoteJWKSet caches/refreshes
// the key set internally.
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
)

const router = Router()

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return errorResponse(res, 'Email and password are required')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user) return errorResponse(res, 'Invalid email or password', 401)
  if (!user.isActive) return errorResponse(res, 'Account has been deactivated', 403)

  const isMatch = await user.comparePassword(password)
  if (!isMatch) return errorResponse(res, 'Invalid email or password', 401)

  const token = signToken({ id: user._id, role: user.role })
  const userObj = user.toJSON()

  setAuthCookie(res, token)
  return successResponse(res, { user: userObj, token, message: 'Login successful' })
}))

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  if (!name || !email || !password) {
    return errorResponse(res, 'Name, email, and password are required')
  }
  if (password.length < 6) {
    return errorResponse(res, 'Password must be at least 6 characters')
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) return errorResponse(res, 'An account with this email already exists', 409)

  const user = await User.create({ name, email, phone, password })
  const token = signToken({ id: user._id, role: user.role })

  setAuthCookie(res, token)
  return successResponse(res, { user, token, message: 'Account created successfully' }, 201)
}))

router.post('/logout', (req, res) => {
  clearAuthCookie(res)
  return successResponse(res, { message: 'Logged out successfully' })
})

router.get('/profile', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name slug images price salePrice')
  if (!user) return errorResponse(res, 'User not found', 404)
  return successResponse(res, { user })
}))

router.put('/profile', requireAuth, asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  )
  return successResponse(res, { user, message: 'Profile updated successfully' })
}))

// Verifies a Firebase phone-auth ID token and marks the caller's phone as
// genuine/verified. Uses attachUser (not requireAuth) so it still works
// before/without a full login session — but on this storefront checkout
// already requires auth, so req.user is expected to be present here.
router.post('/verify-phone', attachUser, asyncHandler(async (req, res) => {
  const { idToken } = req.body
  if (!idToken) return errorResponse(res, 'idToken is required')

  const projectId = process.env.FIREBASE_PROJECT_ID
  if (!projectId) return errorResponse(res, 'Phone verification is not configured', 503)

  let payload
  try {
    ;({ payload } = await jwtVerify(idToken, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    }))
  } catch (err) {
    return errorResponse(res, 'Invalid or expired verification token', 401)
  }

  const phone = payload.phone_number
  if (!phone) return errorResponse(res, 'Token does not contain a verified phone number')

  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, { phone, isPhoneVerified: true })
  }

  return successResponse(res, { phone, verified: true })
}))

export default router
