import Redis from 'ioredis'

// Optional cache layer — every export here is safe to call unconditionally.
// If REDIS_URL isn't set, or the connection is ever down, callers get a clean
// no-op (null/undefined) instead of a crash or a slow hang. Caching is a
// speed optimization, never a hard dependency — a Redis outage must never
// make product pages slower than having no cache at all.

let client = null
let attempted = false
let loggedReady = false

export function connectRedis() {
  if (attempted) return client
  attempted = true

  const url = process.env.REDIS_URL
  if (!url) {
    console.warn('[redis] REDIS_URL not set — caching disabled')
    return null
  }

  client = new Redis(url, {
    maxRetriesPerRequest: 1,
    // Commands fail immediately (instead of queuing/waiting) whenever the
    // client isn't connected — this is what keeps a broken Redis connection
    // from ever slowing down page loads. Without this, every cacheGet/
    // cacheSet call blocks until the retry budget above is exhausted.
    enableOfflineQueue: false,
    retryStrategy: (times) => Math.min(times * 500, 10000),
  })
  client.on('error', (err) => {
    // ioredis emits 'error' on every failed reconnect attempt too — only
    // surface it once per outage instead of spamming the console.
    if (loggedReady) console.warn('[redis] connection lost:', err.message)
    loggedReady = false
  })
  client.on('ready', () => {
    if (!loggedReady) console.log('[redis] connected')
    loggedReady = true
  })

  return client
}

export function getRedisClient() {
  return client && client.status === 'ready' ? client : null
}

export async function cacheGet(key) {
  const c = getRedisClient()
  if (!c) return null
  try {
    const raw = await c.get(key)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.warn('[redis] cacheGet failed:', err.message)
    return null
  }
}

export async function cacheSet(key, value, ttlSeconds) {
  const c = getRedisClient()
  if (!c) return
  try {
    await c.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch (err) {
    console.warn('[redis] cacheSet failed:', err.message)
  }
}

// Returns the current version for a namespace (defaults to 1 if unset) —
// used to build cache keys like `products:list:v{n}:...`.
export async function cacheGetVersion(namespace) {
  const c = getRedisClient()
  if (!c) return 1
  try {
    const v = await c.get(`v:${namespace}`)
    return v ? Number(v) : 1
  } catch (err) {
    console.warn('[redis] cacheGetVersion failed:', err.message)
    return 1
  }
}

// Bumps a namespace's version, invalidating every cache key built from the
// previous version (they simply expire via TTL and are never read again).
export async function cacheBumpVersion(namespace) {
  const c = getRedisClient()
  if (!c) return
  try {
    await c.incr(`v:${namespace}`)
  } catch (err) {
    console.warn('[redis] cacheBumpVersion failed:', err.message)
  }
}
