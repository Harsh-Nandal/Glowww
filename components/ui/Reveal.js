'use client'

import { motion } from 'framer-motion'

// Shared scroll-reveal wrapper used across homepage sections — fade + slide up,
// triggers once when it enters the viewport.
export default function Reveal({ children, delay = 0, y = 24, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
