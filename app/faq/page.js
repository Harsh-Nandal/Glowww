'use client'

import { useState } from 'react'

export default function FAQPage() {
  const [open, setOpen] = useState(null)

  const FAQS = [
    {
      q: 'What makes GLOWW products different?',
      a: 'GLOWW products are clean-label by design — no added sugar, artificial colours, or unnecessary fillers. We formulate with whole-food actives like sea buckthorn, moringa, and ashwagandha, and every batch is third-party lab-tested for purity and potency.',
    },
    {
      q: 'Are your products vegan and safe for daily use?',
      a: 'Yes. Our entire range is 100% vegan, non-GMO, and formulated for daily use at recommended dosages. If you\'re pregnant, nursing, or on medication, we recommend checking with your doctor before starting any new supplement.',
    },
    {
      q: 'Are your products FSSAI certified?',
      a: 'Yes. All GLOWW products are manufactured in FSSAI-licensed facilities and meet safety standards for nutraceuticals and functional foods sold in India.',
    },
    {
      q: 'How should I store juices, powders, and tablets?',
      a: 'Juices and shots should be refrigerated after opening and consumed within the printed window. Tablets, capsules, and powders should be stored in a cool, dry place away from direct sunlight, with the cap tightly closed.',
    },
    {
      q: 'Do you offer subscriptions?',
      a: 'Yes. Subscribe to your favourite products for automatic monthly delivery and save 15% on every order, with the flexibility to pause, skip, or cancel anytime from your account.',
    },
    {
      q: 'How long does delivery take?',
      a: 'Standard delivery across India takes 3–6 business days. Temperature-sensitive products ship in insulated packaging to protect potency and freshness in transit.',
    },
    {
      q: 'What is your return policy?',
      a: 'For food safety reasons, we can only accept returns for products that arrive damaged, defective, or incorrect — please share unboxing photos within 48 hours of delivery so we can help quickly.',
    },
    {
      q: 'Do you offer samples or trial packs?',
      a: 'Yes. Several products are available in a smaller trial size, and we occasionally include sachet samples with orders so you can try before committing to a full-size bottle.',
    },
    {
      q: 'Do you supply to gyms, clinics, or retailers?',
      a: 'Absolutely. We have a dedicated trade programme with volume pricing for nutritionists, gyms, clinics, and retailers. Contact sales@gloww.in for trade enquiries.',
    },
  ]

  return (
    <div style={{ paddingTop: '72px' }}>
      <div className="page-header">
        <div className="page-header-eyebrow">Help Centre</div>
        <h1 className="page-header-title">
          Frequently Asked <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Questions</em>
        </h1>
      </div>

      <div className="section" style={{ maxWidth: '760px', margin: '0 auto' }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--grey-mid)' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', textAlign: 'left', padding: '1.5rem 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--charcoal)', fontWeight: 400 }}>{faq.q}</span>
              <span style={{ color: 'var(--gold)', fontSize: '1.2rem', flexShrink: 0, transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {open === i && (
              <p style={{ fontSize: '0.9rem', color: 'var(--grey-text)', lineHeight: 1.8, paddingBottom: '1.5rem', fontWeight: 300 }}>
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
