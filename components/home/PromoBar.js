'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Counts down to midnight (local time) so the urgency is real and resets
// naturally every day without needing a backend-driven campaign end date.
function getRemaining() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const diff = Math.max(0, midnight - now)
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { h, m, s }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function PromoBar() {
  const [time, setTime] = useState(null)

  useEffect(() => {
    setTime(getRemaining())
    const timer = setInterval(() => setTime(getRemaining()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Link
      href="/shop?category=combos"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap',
        padding: '0.65rem 1rem', textAlign: 'center', textDecoration: 'none',
        background: 'var(--gradient-gold)', color: 'var(--emerald-dark)',
        fontFamily: 'var(--font-ui)', fontSize: '0.75rem', letterSpacing: '0.03em', fontWeight: 600,
      }}
    >
      <span>Buy 2, Get 1 Free on Combos — Ends in</span>
      {time && (
        <span style={{ display: 'inline-flex', gap: '0.3rem', fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ background: 'rgba(7,59,38,0.15)', borderRadius: '4px', padding: '0.1rem 0.4rem' }}>{pad(time.h)}</span>:
          <span style={{ background: 'rgba(7,59,38,0.15)', borderRadius: '4px', padding: '0.1rem 0.4rem' }}>{pad(time.m)}</span>:
          <span style={{ background: 'rgba(7,59,38,0.15)', borderRadius: '4px', padding: '0.1rem 0.4rem' }}>{pad(time.s)}</span>
        </span>
      )}
    </Link>
  )
}
