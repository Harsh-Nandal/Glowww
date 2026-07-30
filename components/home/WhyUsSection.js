'use client'

import { motion } from 'framer-motion'
import { FlaskConical, Sprout, ShieldCheck, Recycle, Truck, Award } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const WHY_US = [
  {
    Icon: FlaskConical,
    title: 'Lab-Tested Purity',
    desc: 'Every batch is third-party tested for potency and contaminants before it ships — full certificates of analysis available on request.',
  },
  {
    Icon: Sprout,
    title: 'Clean-Label Ingredients',
    desc: 'No added sugar, artificial colours, or fillers. Just sea buckthorn, moringa, and other whole-food actives — nothing to hide on the label.',
  },
  {
    Icon: ShieldCheck,
    title: '100% Vegan & Non-GMO',
    desc: 'Every product in our range is plant-based, non-GMO, and cruelty-free — safe for the whole family and kind to the planet.',
  },
  {
    Icon: Award,
    title: 'FSSAI Certified',
    desc: 'Manufactured in FSSAI-licensed facilities under strict quality protocols, meeting safety norms for nutraceuticals and functional foods.',
  },
  {
    Icon: Recycle,
    title: 'Sustainably Sourced',
    desc: 'Ingredients are sourced directly from growers with fair-trade practices, and packaging is recyclable wherever possible.',
  },
  {
    Icon: Truck,
    title: 'Cold-Chain Delivery',
    desc: 'Temperature-sensitive products ship in insulated packaging so potency and freshness are locked in until they reach your door.',
  },
]

export default function WhyUsSection() {
  return (
    <section className="section" id="why">
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div className="section-eyebrow">Why GLOWW</div>
            <h2 className="section-title">
              Built for <em>Better Wellness</em>
            </h2>
          </div>
          <p className="section-subtitle">
            Every product we make goes through rigorous quality checks before it leaves our facility.
          </p>
        </div>
      </Reveal>

      <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {WHY_US.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <motion.div
              whileHover={{ y: -6 }}
              style={{ padding: '2.5rem', height: '100%', borderRadius: 'var(--radius)', background: i % 2 === 0 ? 'var(--ivory)' : 'var(--white)', boxShadow: 'var(--shadow)', transition: 'box-shadow 0.3s', cursor: 'default' }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.4rem', boxShadow: 'var(--shadow-emerald)',
              }}>
                <item.Icon size={24} strokeWidth={1.75} color="var(--white)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--grey-text)', lineHeight: 1.8, fontWeight: 300 }}>{item.desc}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) { .why-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .why-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
