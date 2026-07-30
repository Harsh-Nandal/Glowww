'use client'

import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import MagneticButton from '@/components/ui/MagneticButton'

export default function CTASection() {
  return (
    <section style={{ background: 'var(--gradient-primary)', padding: '100px 6vw', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-mesh)', pointerEvents: 'none' }} />

      <Reveal>
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--soft-yellow)', marginBottom: '1.5rem' }}>
            Start Your Ritual
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Ready to Feel
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--soft-yellow)' }}>Your Best?</em>
          </h2>

          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 300, lineHeight: 1.8, marginBottom: '3rem' }}>
            Explore 50+ clean-label wellness products from GLOWW. Lab-tested, plant-powered, and ready to ship — delivered across India with expert guidance at every step.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton>
              <Link
                href="/shop"
                style={{ background: 'var(--gradient-gold)', color: 'var(--emerald-dark)', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, padding: '0 2.5rem', height: '56px', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-gold)' }}
              >
                Shop Now →
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/contact"
                className="glass"
                style={{ color: 'var(--white)', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500, padding: '0 2.5rem', height: '56px', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', borderRadius: 'var(--radius-full)' }}
              >
                Request a Sample
              </Link>
            </MagneticButton>
          </div>

          <p style={{ marginTop: '2rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-ui)', letterSpacing: '0.05em' }}>
            Free delivery on orders above ₹999 · Subscribe & save 15% · Pan India shipping
          </p>
        </div>
      </Reveal>
    </section>
  )
}
