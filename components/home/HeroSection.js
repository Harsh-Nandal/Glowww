'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import PromoBar from './PromoBar'

const TRUST_STRIP = [
  { value: '50+', label: 'Wellness Products' },
  { value: '1M+', label: 'Bottles Sold' },
  { value: '4.9★', label: 'Avg. Rating' },
  { value: '₹999+', label: 'Free Shipping' },
]

const SLIDES = [
  {
    seed: 'hero-nourish',
    image: 'https://images.pexels.com/photos/2994/healthy-fruits-morning-kitchen.jpg?auto=compress&cs=tinysrgb&w=1600',
    pill: 'Bestseller',
    title: ['Nourish From', 'Within, Daily'],
    subtitle: 'Cold-pressed juices & clean-label tablets — sea buckthorn, moringa and more, lab-tested for purity.',
    cta: { label: 'Shop Now', href: '/shop' },
  },
  {
    seed: 'hero-combo',
    image: 'https://images.pexels.com/photos/3850692/pexels-photo-3850692.jpeg?auto=compress&cs=tinysrgb&w=1600',
    pill: 'Limited Time',
    title: ['Buy 2, Get 1', 'Free on Combos'],
    subtitle: 'Stock up on our bestselling wellness combo kits — this week only.',
    cta: { label: 'Shop Combos', href: '/shop?category=combos' },
  },
  {
    seed: 'hero-gut',
    image: 'https://images.pexels.com/photos/33864616/pexels-photo-33864616.jpeg?auto=compress&cs=tinysrgb&w=1600',
    pill: 'New Launch',
    title: ['Gut Health', 'Starter Kit'],
    subtitle: 'A gentle 3-part ritual for a happier gut, delivered together.',
    cta: { label: 'Explore Kit', href: '/product/gut-health-starter-kit' },
  },
]

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}
const wordChild = {
  hidden: { y: 40, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function HeroSection() {
  const bannerRef = useRef(null)
  const [slide, setSlide] = useState(0)
  const current = SLIDES[slide]

  const { scrollYProgress } = useScroll({ target: bannerRef, offset: ['start start', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setSlide((s) => (s + 1) % SLIDES.length)
  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)

  return (
    <section style={{ background: 'var(--charcoal)', paddingTop: '72px' }}>
      <PromoBar />

      <div ref={bannerRef} className="hero-banner" style={{ position: 'relative', width: '100%', height: 'clamp(460px, 62vw, 640px)', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.seed}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0, y: parallaxY }}
          >
            <img
              src={current.image}
              alt={current.title.join(' ')}
              style={{ width: '100%', height: '120%', objectFit: 'cover' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Brand-colour scrim for legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(7,59,38,0.88) 0%, rgba(7,59,38,0.55) 40%, rgba(15,107,68,0.15) 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-mesh)', mixBlendMode: 'overlay' }} />

        {/* Text content */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', padding: '0 6vw', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ maxWidth: '560px' }}>
            <AnimatePresence mode="wait">
              <motion.div key={current.seed} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }}>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: 'inline-block', marginBottom: '1.25rem', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)',
                    background: 'var(--gradient-gold)', color: 'var(--emerald-dark)', fontFamily: 'var(--font-ui)',
                    fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
                  }}
                >
                  {current.pill}
                </motion.span>

                <motion.h1
                  variants={wordContainer}
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)', fontWeight: 300, lineHeight: 1.05, color: 'var(--white)', marginBottom: '1.25rem' }}
                >
                  {current.title.map((line, li) => (
                    <span key={li} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.1em' }}>
                      {line.split(' ').map((word, wi) => (
                        <motion.span key={wi} variants={wordChild} style={{ display: 'inline-block', marginRight: '0.28em', fontStyle: li === 1 ? 'italic' : 'normal', color: li === 1 ? 'var(--soft-yellow)' : 'var(--white)' }}>
                          {word}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontWeight: 300, marginBottom: '2.25rem' }}
                >
                  {current.subtitle}
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                  <MagneticButton>
                    <Link
                      href={current.cta.href}
                      style={{
                        background: 'var(--gradient-gold)', color: 'var(--emerald-dark)', fontFamily: 'var(--font-ui)', fontSize: '0.75rem',
                        letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, padding: '0 2.2rem', height: '54px',
                        display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-gold)',
                      }}
                    >
                      {current.cta.label} →
                    </Link>
                  </MagneticButton>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Arrows */}
        <button onClick={prev} aria-label="Previous banner" className="hero-arrow" style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} aria-label="Next banner" className="hero-arrow" style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Show banner ${i + 1}`}
              style={{
                width: i === slide ? '22px' : '7px', height: '7px', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
                background: i === slide ? 'var(--soft-yellow)' : 'rgba(255,255,255,0.45)', transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ background: 'var(--gradient-primary)', padding: '1.5rem 6vw' }} className="trust-strip">
        {TRUST_STRIP.map((stat, i) => (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--white)', fontWeight: 500 }}>{stat.value}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>{stat.label}</span>
            {i < TRUST_STRIP.length - 1 && <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', marginLeft: '0.5rem' }} />}
          </div>
        ))}
      </div>

      <style>{`
        .hero-arrow {
          width: 44px; height: 44px; border-radius: 50%; border: none; cursor: pointer;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); color: var(--white);
          display: flex; align-items: center; justify-content: center; transition: background 0.3s;
        }
        .hero-arrow:hover { background: rgba(255,255,255,0.3); }
        .trust-strip { display: flex; align-items: center; justify-content: center; gap: 2.5rem; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .hero-arrow { display: none; }
          .trust-strip { gap: 1.5rem; }
        }
      `}</style>
    </section>
  )
}
