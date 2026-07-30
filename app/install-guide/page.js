export const metadata = {
  title: 'How It Works',
  description: 'How to build a GLOWW wellness ritual — from choosing a product to daily use.',
}

const STEPS = [
  {
    num: '01',
    title: 'Choose Your Focus',
    desc: 'Start with what you want to feel — more energy, stronger immunity, better gut health, or a natural glow. Our Shop by Concern page groups products by goal, so you can find the right fit fast.',
  },
  {
    num: '02',
    title: 'Check the Label',
    desc: 'Every GLOWW product page lists the full ingredient panel, recommended dosage, and a link to the third-party lab report for that batch — no guesswork, no hidden fillers.',
  },
  {
    num: '03',
    title: 'Start Low & Steady',
    desc: 'For tablets, capsules, and powders, start with the recommended serving size and take consistently at the same time each day. Most adaptogens and whole-food actives build up benefits over 3–6 weeks.',
  },
  {
    num: '04',
    title: 'Store It Right',
    desc: 'Refrigerate juices and shots after opening and finish within the printed window. Keep tablets, capsules, and powders in a cool, dry place away from direct sunlight with the cap tightly closed.',
  },
  {
    num: '05',
    title: 'Make It a Ritual',
    desc: 'Pair your product with an existing habit — your morning coffee, post-workout shake, or bedtime routine — so it sticks. Consistency matters more than perfect timing.',
  },
  {
    num: '06',
    title: 'Subscribe & Save',
    desc: 'Once you find what works, subscribe for automatic monthly delivery, save 15% on every order, and never run out — pause, skip, or cancel anytime from your account.',
  },
]

export default function HowItWorksPage() {
  return (
    <div style={{ paddingTop: '72px' }}>
      <div className="page-header">
        <div className="page-header-eyebrow">How To</div>
        <h1 className="page-header-title">
          How It <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Works</em>
        </h1>
        <p className="page-header-sub">Building a wellness ritual that actually sticks</p>
      </div>

      <div className="section" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="gold-rule" style={{ marginBottom: '3rem' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {STEPS.map((step) => (
            <div key={step.num} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2.5rem', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1, opacity: 0.6 }}>
                {step.num}
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.75rem' }}>{step.title}</h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--grey-text)', lineHeight: 1.85, fontWeight: 300 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '5rem', padding: '2.5rem', background: 'var(--gradient-primary)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--soft-yellow)' }}>Need Help?</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--white)', fontWeight: 300 }}>Our team is happy to help you choose the right products for your goals.</p>
          <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--soft-yellow)', textDecoration: 'none', marginTop: '0.5rem' }}>
            Contact Us →
          </a>
        </div>
      </div>
    </div>
  )
}
