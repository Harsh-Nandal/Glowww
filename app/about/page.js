export const metadata = {
  title: 'About Us',
  description: 'Learn about GLOWW — clean-label wellness products crafted in India, from sea buckthorn juice to moringa tablets.',
}

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '72px' }}>
      <div className="page-header">
        <div className="page-header-eyebrow">Our Story</div>
        <h1 className="page-header-title">
          Crafting <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Better Wellness</em>
        </h1>
        <p className="page-header-sub">Since 2021 · Chandigarh, India</p>
      </div>

      <div className="section" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div className="gold-rule" style={{ marginBottom: '2.5rem' }} />
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 300, lineHeight: 1.8, color: 'var(--charcoal)', marginBottom: '2rem' }}>
          GLOWW started with a simple belief — that everyday wellness shouldn't mean compromising on what's actually inside the bottle.
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--grey-text)', lineHeight: 1.9, fontWeight: 300, marginBottom: '1.5rem' }}>
          Founded in 2021 in Chandigarh, we began by asking a simple question: why do most "healthy" juices and supplements read like a chemistry list? We set out to build a range built entirely on whole-food actives — sea buckthorn, moringa, ashwagandha, amla — with nothing to hide on the label.
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--grey-text)', lineHeight: 1.9, fontWeight: 300, marginBottom: '1.5rem' }}>
          Every product we make is formulated in FSSAI-licensed facilities and third-party lab-tested for purity and potency. Our range is 100% vegan, non-GMO, and free from added sugar, artificial colours, and unnecessary fillers.
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--grey-text)', lineHeight: 1.9, fontWeight: 300 }}>
          With 50+ products across juices & shots, tablets & capsules, powders & mixes, oils & extracts, and gifting combos — we have a ritual for every wellness goal and every budget.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--grey-mid)' }}>
          {[
            { value: '5+', label: 'Years Crafting Wellness' },
            { value: '50+', label: 'Wellness Products' },
            { value: '1M+', label: 'Bottles Sold' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--grey-text)', marginTop: '0.5rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
