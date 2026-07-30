import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'
export const COOKIE_NAME = 'lw_token'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production'
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/',
  })
}

export function clearAuthCookie(res) {
  res.cookie(COOKIE_NAME, '', { httpOnly: true, maxAge: 0, path: '/' })
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  return req.cookies?.[COOKIE_NAME] || null
}

export function getAuthUser(req) {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyToken(token)
}
