'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'

const footerLinks = {
  Collections: [
    { label: 'Juices & Shots', href: '/shop?category=juices-shots' },
    { label: 'Tablets & Capsules', href: '/shop?category=tablets-capsules' },
    { label: 'Powders & Mixes', href: '/shop?category=powders-mixes' },
    { label: 'Oils & Extracts', href: '/shop?category=oils-extracts' },
    { label: 'Combos', href: '/shop?category=combos' },
    { label: 'New Arrivals', href: '/shop?newArrival=true' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Support: [
    { label: 'How It Works', href: '/install-guide' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Info', href: '/faq#shipping' },
    { label: 'Returns', href: '/faq#returns' },
    { label: 'Track Order', href: '/orders' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
}

export default function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  const isAdminRoute = pathname?.startsWith('/admin')
  if (isAdminRoute) return null

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribing(true)
    try {
      await axios.post('/api/newsletter', { email })
      toast.success('Subscribed to the GLOWW newsletter!')
      setEmail('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer style={{ background: 'var(--gradient-primary)', color: 'var(--white)', paddingTop: '80px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 15% 0%, rgba(183,245,216,0.12) 0%, transparent 45%)', pointerEvents: 'none' }} />
      <div style={{ padding: '0 6vw 60px', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '4rem' }}>
          {/* Brand col */}
          <div>
            <Link
              href="/"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 500, color: 'var(--white)', textDecoration: 'none', display: 'block', marginBottom: '1.5rem' }}
            >
              GL<span className="gradient-text">OWW</span>
            </Link>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.55)', fontWeight: 300, marginBottom: '1.5rem' }}>
              Plant-powered juices, tablets, and wellness essentials crafted for modern, healthy living. Clean-label, lab-tested, and sourced with intention — every bottle built for lasting wellbeing.
            </p>

            {[
              { Icon: MapPin, text: 'SCO 215, Sector 34-A, Chandigarh – 160022' },
              { Icon: Phone, text: '+91 98765 43210' },
              { Icon: Mail, text: 'info@gloww.in' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                <item.Icon size={15} strokeWidth={1.75} style={{ color: 'var(--soft-yellow)', marginTop: '0.15rem', flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>{item.text}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {['in', 'ig', 'fb', 'yt'].map((s) => (
                <a key={s} href="#"
                  style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.65)', fontSize: '0.68rem', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--soft-yellow)'; e.currentTarget.style.color = 'var(--soft-yellow)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--soft-yellow)', marginBottom: '1.5rem' }}>
                {title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontWeight: 300, transition: 'color 0.3s' }}
                      onMouseEnter={(e) => (e.target.style.color = 'var(--soft-yellow)')}
                      onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass-dark" style={{ borderRadius: 'var(--radius-lg)', padding: '3rem', marginTop: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--white)', marginBottom: '0.5rem' }}>
              Stay <em style={{ fontStyle: 'italic', color: 'var(--soft-yellow)' }}>Inspired</em>
            </div>
            <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
              New products, wellness tips, and exclusive offers — straight to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.6rem', minWidth: '320px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              style={{ flex: 1, height: '50px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 'var(--radius-full)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', padding: '0 1.25rem', outline: 'none' }}
            />
            <button type="submit" disabled={subscribing}
              style={{ height: '50px', padding: '0 1.75rem', background: 'var(--gradient-gold)', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--emerald-dark)', transition: 'transform 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {subscribing ? '...' : <>Subscribe <ArrowRight size={14} /></>}
            </button>
          </form>
        </div>

        <div style={{ paddingTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
            © {new Date().getFullYear()} <span className="gradient-text" style={{ fontWeight: 600 }}>GLOWW</span>. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[['Privacy Policy', '/privacy'], ['Terms', '/terms'], ['Sitemap', '/sitemap']].map(([label, href]) => (
              <Link key={href} href={href}
                style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--soft-yellow)')}
                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.4)')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 3rem !important; } }
        @media (max-width: 640px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  )
}
