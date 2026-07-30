'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

// Wraps any element (typically a button/Link) and makes it "magnetically"
// follow the cursor within a small radius — releases with a spring on leave.
export default function MagneticButton({ children, strength = 0.35, style, ...props }) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block', transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1)', ...style }}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
