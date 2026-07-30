'use client'

import Reveal from '@/components/ui/Reveal'

const PRESS = ['Vogue', 'Elle', 'Cosmopolitan', 'Femina', 'GQ']

export default function PressLogosSection() {
  return (
    <section style={{ background: 'var(--white)', padding: '60px 6vw', borderTop: '1px solid var(--grey-mid)', borderBottom: '1px solid var(--grey-mid)' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--grey-dark)', maxWidth: '560px', margin: '0 auto' }}>
            "GLOWW is redefining what everyday wellness looks like — clean, potent, and refreshingly honest."
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(2rem, 6vw, 5rem)', flexWrap: 'wrap' }}>
          {PRESS.map((name) => (
            <span
              key={name}
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 500, color: 'var(--grey-text)', letterSpacing: '0.02em', opacity: 0.7 }}
            >
              {name}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
