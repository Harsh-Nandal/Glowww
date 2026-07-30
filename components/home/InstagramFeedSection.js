'use client'

import { Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import Reveal from '@/components/ui/Reveal'

const TILES = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  tint: [
    'rgba(15,107,68,0.8)', 'rgba(203,161,53,0.7)', 'rgba(63,168,113,0.75)',
    'rgba(7,59,38,0.85)', 'rgba(183,245,216,0.6)', 'rgba(15,107,68,0.8)',
  ][i],
}))

export default function InstagramFeedSection() {
  return (
    <section className="section" style={{ paddingBottom: '80px' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>Follow Along</div>
          <h2 className="section-title">Follow Us on <em>Instagram</em></h2>
          <p style={{ marginTop: '0.75rem', color: 'var(--grey-text)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem' }}>
            Tag <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>@gloww.wellness</span> to get featured
          </p>
        </div>
      </Reveal>

      <div className="insta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
        {TILES.map((tile, i) => (
          <Reveal key={tile.id} delay={i * 0.05}>
            <motion.a
              href="#"
              whileHover={{ scale: 1.04 }}
              style={{
                position: 'relative', display: 'block', aspectRatio: '1/1', borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                backgroundImage: `linear-gradient(160deg, ${tile.tint} 0%, rgba(7,59,38,0.7) 100%), url(https://picsum.photos/seed/insta-${tile.id}/500/500)`,
                backgroundBlendMode: 'multiply', backgroundSize: 'cover', backgroundPosition: 'center',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }} className="insta-overlay">
                <Camera size={20} color="var(--white)" />
              </div>
            </motion.a>
          </Reveal>
        ))}
      </div>

      <style>{`
        a:hover .insta-overlay { opacity: 1 !important; }
        @media (max-width: 900px) { .insta-grid { grid-template-columns: repeat(3, 1fr) !important; } }
      `}</style>
    </section>
  )
}
