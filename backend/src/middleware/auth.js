import { getAuthUser } from '../utils/jwt.js'
import { unauthorizedResponse, forbiddenResponse } from '../utils/response.js'

// Attaches req.user ({id, role}) if a valid token is present, but never blocks the request.
export function attachUser(req, res, next) {
  req.user = getAuthUser(req)
  next()
}

export function requireAuth(req, res, next) {
  const decoded = getAuthUser(req)
  if (!decoded) return unauthorizedResponse(res)
  req.user = decoded
  next()
}

export function requireAdmin(req, res, next) {
  const decoded = getAuthUser(req)
  if (!decoded) return unauthorizedResponse(res)
  if (decoded.role !== 'admin') return forbiddenResponse(res)
  req.user = decoded
  next()
}
