'use client'

import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { X } from 'lucide-react'
import { closeMobileMenu } from '@/store/slices/uiSlice'

export default function MobileMenu({ links }) {
  const dispatch = useDispatch()
  const { mobileMenuOpen } = useSelector((s) => s.ui)

  return (
    <>
      <div
        onClick={() => dispatch(closeMobileMenu())}
        style={{ position: 'fixed', inset: 0, background: 'rgba(11,31,23,0.55)', backdropFilter: 'blur(4px)', zIndex: 1099, opacity: mobileMenuOpen ? 1 : 0, pointerEvents: mobileMenuOpen ? 'all' : 'none', transition: 'opacity 0.3s' }}
      />
      <div
        className="glass-dark"
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '300px', background: 'var(--gradient-primary)', zIndex: 1100, transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)', padding: '6rem 2rem 3rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        <button
          onClick={() => dispatch(closeMobileMenu())}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--white)', marginBottom: '2rem' }}>
          GL<span className="gradient-text">OWW</span>
        </div>

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => dispatch(closeMobileMenu())}
            style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', padding: '0.9rem 0', borderBottom: '1px solid rgba(255,255,255,0.12)', transition: 'color 0.3s' }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--soft-yellow)')}
            onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.75)')}
          >
            {link.label}
          </Link>
        ))}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link
            href="/auth/login"
            onClick={() => dispatch(closeMobileMenu())}
            style={{ background: 'var(--white)', color: 'var(--emerald-dark)', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, padding: '1rem', borderRadius: 'var(--radius-full)', textAlign: 'center', textDecoration: 'none' }}
          >
            Login / Register
          </Link>
        </div>
      </div>
    </>
  )
}
