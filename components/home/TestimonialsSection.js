'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    title: 'Nutritionist — Delhi NCR',
    rating: 5,
    text: 'I recommend GLOWW\'s sea buckthorn juice to clients who need an antioxidant boost without the sugar crash of regular juices. The clean label and third-party test reports make it easy to trust and prescribe.',
    project: 'Recommends This Product',
    avatarSeed: 'Ananya-Sharma',
  },
  {
    name: 'Rohit Verma',
    title: 'Home User, Mumbai',
    rating: 5,
    text: 'Started the moringa tablets three months ago for my energy levels and honestly didn\'t expect much — but the difference by week three was real. No bloating, no weird aftertaste, just consistent energy through the day.',
    project: 'Repeat Customer',
    avatarSeed: 'Rohit-Verma',
  },
  {
    name: 'Kavya Reddy',
    title: 'Fitness Coach — Hyderabad',
    rating: 5,
    text: 'I stock GLOWW\'s protein and greens powders for all my clients. Mixability is great, taste doesn\'t feel like a compromise, and the ingredient sourcing story is something clients actually care about these days.',
    project: 'Trade Partner',
    avatarSeed: 'Kavya-Reddy',
  },
  {
    name: 'Meera Iyer',
    title: 'New Mother, Bangalore',
    rating: 5,
    text: 'Switched my whole family to GLOWW\'s combos after reading the labels on our old supplements. My kids actually like the taste of the juices, and I like that I can pronounce every ingredient on the bottle.',
    project: 'Subscriber',
    avatarSeed: 'Meera-Iyer',
  },
]

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="section">
      <Reveal>
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-eyebrow">Customer Stories</div>
          <h2 className="section-title">
            Love That <em>Keeps Us Going</em>
          </h2>
        </div>
      </Reveal>

      <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div
              onClick={() => setActive(i)}
              style={{
                padding: '2.5rem',
                height: '100%',
                borderRadius: 'var(--radius)',
                background: active === i ? 'var(--white)' : 'var(--ivory)',
                boxShadow: active === i ? 'var(--shadow-lg)' : 'var(--shadow)',
                border: active === i ? '1.5px solid var(--emerald-light)' : '1.5px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ display: 'flex', gap: '3px', marginBottom: '1.5rem' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="var(--gold)" style={{ color: 'var(--gold)' }} />
                ))}
              </div>
              <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 300, lineHeight: 1.7, color: 'var(--charcoal)', marginBottom: '2rem', fontStyle: 'italic' }}>
                "{t.text}"
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--gradient-primary)', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatarSeed}`} alt={t.name} width={44} height={44} style={{ display: 'block', width: '100%', height: '100%' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--grey-text)', fontFamily: 'var(--font-ui)' }}>{t.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--emerald)', fontFamily: 'var(--font-ui)', letterSpacing: '0.1em', marginTop: '2px' }}>{t.project}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) { .testimonials-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
