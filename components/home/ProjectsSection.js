'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const COLLECTIONS = [
  { title: 'Sea Buckthorn', location: 'Omega 3-7-9 · Antioxidant Rich', type: 'Bestselling Ingredient', year: '2026', span: 2, image: 'https://images.pexels.com/photos/8750912/pexels-photo-8750912.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { title: 'Moringa', location: 'Iron & Plant Protein', type: 'Daily Greens', year: '2026', span: 1, image: 'https://images.pexels.com/photos/9742861/pexels-photo-9742861.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { title: 'Ashwagandha', location: 'Stress & Sleep Support', type: 'Adaptogen', year: '2026', span: 1, image: 'https://images.pexels.com/photos/17820710/pexels-photo-17820710.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { title: 'Amla', location: 'Vitamin C & Immunity', type: 'Superfruit', year: '2026', span: 1, image: 'https://images.pexels.com/photos/8679338/pexels-photo-8679338.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { title: 'Turmeric', location: 'Curcumin Complex', type: 'Anti-Inflammatory', year: '2026', span: 1, image: 'https://images.pexels.com/photos/6220709/pexels-photo-6220709.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { title: 'Spirulina', location: 'Complete Plant Protein', type: 'Algae Superfood', year: '2026', span: 2, image: 'https://images.pexels.com/photos/7149595/pexels-photo-7149595.jpeg?auto=compress&cs=tinysrgb&w=900' },
]

export default function CollectionsSection() {
  return (
    <section className="section" style={{ background: 'var(--ivory)' }} id="collections">
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="section-eyebrow">Explore Our Range</div>
            <h2 className="section-title">
              Ingredients That <em>Work</em>
            </h2>
          </div>
          <Link href="/shop?view=ingredients" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--emerald)', textDecoration: 'none', fontWeight: 600 }}>
            All Ingredients <ArrowRight size={14} />
          </Link>
        </div>
      </Reveal>

      <div className="masonry-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {COLLECTIONS.map((col, i) => (
          <Reveal key={col.title} delay={i * 0.06} className={col.span === 2 ? 'span-2' : ''} style={{ gridColumn: `span ${col.span}` }}>
            <motion.div
              className="project-tile"
              whileHover={{ y: -4 }}
              style={{ position: 'relative', aspectRatio: col.span === 2 ? '16/9' : '4/5', overflow: 'hidden', borderRadius: 'var(--radius)', cursor: 'pointer', boxShadow: 'var(--shadow)' }}
            >
              <div style={{
                position: 'absolute', inset: 0, transition: 'transform 0.6s ease',
                backgroundImage: `linear-gradient(${135 + i * 15}deg, rgba(15,107,68,0.55) 0%, rgba(7,59,38,0.85) 100%), url(${col.image})`,
                backgroundBlendMode: 'multiply', backgroundSize: 'cover', backgroundPosition: 'center',
              }} className="project-bg" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--soft-yellow)', marginBottom: '0.4rem' }}>
                  {col.type} · New {col.year}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: col.span === 2 ? '1.4rem' : '1rem', color: 'var(--white)', fontWeight: 500 }}>
                  {col.title}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.25rem' }}>
                  {col.location}
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <style>{`
        .project-bg { transform-origin: center; }
        .project-tile:hover .project-bg { transform: scale(1.06); }
        @media (max-width: 768px) {
          .masonry-grid { grid-template-columns: 1fr 1fr !important; }
          .masonry-grid .span-2 { grid-column: span 2 !important; }
        }
      `}</style>
    </section>
  )
}
