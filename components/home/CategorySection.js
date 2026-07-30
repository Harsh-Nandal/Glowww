'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Reveal from '@/components/ui/Reveal'

const CATEGORIES = [
  { name: 'Juices & Shots', slug: 'juices-shots', count: 18, tint: 'rgba(15,107,68,0.85)', image: 'https://images.pexels.com/photos/29851973/pexels-photo-29851973.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { name: 'Tablets & Capsules', slug: 'tablets-capsules', count: 24, tint: 'rgba(7,59,38,0.85)', image: 'https://images.pexels.com/photos/17820729/pexels-photo-17820729.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { name: 'Powders & Mixes', slug: 'powders-mixes', count: 14, tint: 'rgba(63,168,113,0.85)', image: 'https://images.pexels.com/photos/13779116/pexels-photo-13779116.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { name: 'Oils & Extracts', slug: 'oils-extracts', count: 12, tint: 'rgba(203,161,53,0.75)', image: 'https://images.pexels.com/photos/7795762/pexels-photo-7795762.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { name: 'Combos', slug: 'combos', count: 9, tint: 'rgba(15,107,68,0.85)', image: 'https://images.pexels.com/photos/13787561/pexels-photo-13787561.jpeg?auto=compress&cs=tinysrgb&w=900' },
]

export default function CategorySection() {
  return (
    <section className="section">
      <Reveal>
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-eyebrow">Browse by Type</div>
          <h2 className="section-title">
            Find Your <em>Perfect</em> Ritual
          </h2>
        </div>
      </Reveal>

      <div
        className="category-grid"
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: '1.5rem' }}
      >
        {CATEGORIES.map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 0.08} style={{ gridColumn: i === 0 ? 'span 2' : 'span 1' }}>
            <motion.div whileHover={{ y: -4 }}>
              <Link
                href={`/shop?category=${cat.slug}`}
                style={{ position: 'relative', overflow: 'hidden', display: 'block', borderRadius: 'var(--radius)', aspectRatio: i === 0 ? '16/9' : '4/5', textDecoration: 'none', boxShadow: 'var(--shadow)' }}
              >
                <div
                  style={{
                    position: 'absolute', inset: 0, transition: 'transform 0.6s ease',
                    backgroundImage: `linear-gradient(135deg, ${cat.tint} 0%, rgba(7,59,38,0.75) 100%), url(${cat.image})`,
                    backgroundBlendMode: 'multiply', backgroundSize: 'cover', backgroundPosition: 'center',
                  }}
                  className="cat-bg"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 30%, transparent)' }} />
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: i === 0 ? '1.6rem' : '1.1rem', fontWeight: 500, color: 'var(--white)', marginBottom: '0.3rem' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--soft-yellow)' }}>
                    {cat.count} products
                  </div>
                </div>
              </Link>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <style>{`
        .cat-bg { transform-origin: center; }
        a:hover .cat-bg { transform: scale(1.06); }
        @media (max-width: 768px) { .category-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </section>
  )
}
