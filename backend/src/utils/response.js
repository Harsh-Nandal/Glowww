export function successResponse(res, data, status = 200) {
  return res.status(status).json({ success: true, ...data })
}

export function errorResponse(res, message, status = 400) {
  return res.status(status).json({ success: false, message })
}

export function notFound(res, entity = 'Resource') {
  return errorResponse(res, `${entity} not found`, 404)
}

export function unauthorizedResponse(res) {
  return errorResponse(res, 'Not authorized', 401)
}

export function forbiddenResponse(res) {
  return errorResponse(res, 'Access forbidden', 403)
}

export function serverErrorResponse(res, err) {
  console.error('API Error:', err)
  return errorResponse(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    500
  )
}

export function paginatedResponse(res, data, total, page, limit) {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  })
}
