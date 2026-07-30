'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const CONCERNS = [
  { label: 'Energy & Focus', slug: 'energy-focus', tint: 'rgba(203,161,53,0.55)', image: 'https://images.pexels.com/photos/13779108/pexels-photo-13779108.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { label: 'Immunity', slug: 'immunity', tint: 'rgba(15,107,68,0.6)', image: 'https://images.pexels.com/photos/8679338/pexels-photo-8679338.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { label: 'Gut Health', slug: 'gut-health', tint: 'rgba(63,168,113,0.55)', image: 'https://images.pexels.com/photos/9871626/pexels-photo-9871626.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { label: 'Glow & Skin', slug: 'glow-skin', tint: 'rgba(183,245,216,0.5)', image: 'https://images.pexels.com/photos/4465830/pexels-photo-4465830.jpeg?auto=compress&cs=tinysrgb&w=700' },
]

export default function ShopByConcernSection() {
  return (
    <section className="section" style={{ background: 'var(--gradient-primary)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-mesh)', pointerEvents: 'none' }} />

      <Reveal>
        <div style={{ marginBottom: '3rem', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--soft-yellow)', marginBottom: '0.75rem' }}>
            Shop By Concern
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, color: 'var(--white)' }}>
            Wellness, <em style={{ fontStyle: 'italic', color: 'var(--soft-yellow)' }}>Targeted</em>
          </h2>
        </div>
      </Reveal>

      <div className="concern-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }}>
        {CONCERNS.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.08}>
            <motion.div whileHover={{ y: -6 }}>
              <Link
                href={`/shop?concern=${c.slug}`}
                style={{ position: 'relative', display: 'block', aspectRatio: '3/4', borderRadius: 'var(--radius)', overflow: 'hidden', textDecoration: 'none', boxShadow: 'var(--shadow-lg)' }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `linear-gradient(160deg, ${c.tint} 0%, rgba(7,59,38,0.8) 100%), url(${c.image})`,
                  backgroundBlendMode: 'multiply', backgroundSize: 'cover', backgroundPosition: 'center',
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 20%, transparent)' }} />
                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 500, color: 'var(--white)', lineHeight: 1.2 }}>
                    {c.label}
                  </div>
                  <div className="glass" style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ArrowUpRight size={15} color="var(--white)" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) { .concern-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  )
}
