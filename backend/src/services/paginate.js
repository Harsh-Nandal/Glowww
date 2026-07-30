// Shared list+count runner — the exact { find, countDocuments } Promise.all pattern
// was duplicated across every paginated route in the original Next.js API.
export async function paginate(Model, query, { sort, skip, limit, populate = [], select } = {}) {
  let find = Model.find(query)
  for (const p of populate) find = find.populate(...(Array.isArray(p) ? p : [p]))
  if (select) find = find.select(select)
  if (sort) find = find.sort(sort)
  if (typeof skip === 'number') find = find.skip(skip)
  if (typeof limit === 'number') find = find.limit(limit)

  const [data, total] = await Promise.all([
    find.lean(),
    Model.countDocuments(query),
  ])

  return { data, total }
}

export function parsePagination(query, { defaultLimit = 20 } = {}) {
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || defaultLimit
  const skip = (page - 1) * limit
  return { page, limit, skip }
}
