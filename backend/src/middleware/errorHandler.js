import { serverErrorResponse } from '../utils/response.js'

// Wraps an async Express handler so rejected promises reach the error middleware
// instead of crashing the process (Express 4 does not do this automatically).
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

// Centralized fallback — individual controllers already catch and format most
// errors via serverErrorResponse, this exists as a last-resort net.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)
  serverErrorResponse(res, err)
}

export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Not found' })
}
