'use client'

import { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

// Skips the 3D canvas entirely for prefers-reduced-motion users and on first
// paint (mounts client-side only) so it never affects initial page weight/SSR.
export default function HeroSceneLoader() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduceMotion) setEnabled(true)
  }, [])

  if (!enabled) return null

  return (
    <Suspense fallback={null}>
      <HeroScene />
    </Suspense>
  )
}
