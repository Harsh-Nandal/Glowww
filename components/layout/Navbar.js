'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Search, Heart, ShoppingBag, Menu } from 'lucide-react'
import { toggleCart } from '@/store/slices/cartSlice'
import { toggleMobileMenu, toggleSearch } from '@/store/slices/uiSlice'
import { selectCartCount } from '@/store/slices/cartSlice'
import MobileMenu from './MobileMenu'
import SearchOverlay from '../ui/SearchOverlay'
import CartDrawer from '../cart/CartDrawer'

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Shop by Concern', href: '/shop?view=concern' },
  { label: 'Best Sellers', href: '/shop?bestSeller=true' },
  { label: 'Our Story', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const dispatch = useDispatch()
  const pathname = usePathname()
  const cartCount = useSelector(selectCartCount)
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isAdminRoute = pathname?.startsWith('/admin')
  if (isAdminRoute) return null

  // Only transparent on the home page (which has a dark hero). All other pages get a glass-dark nav.
  const isHomePage = pathname === '/'
  const navBg = scrolled
    ? 'rgba(255,255,255,0.85)'
    : isHomePage
      ? 'transparent'
      : 'rgba(11,31,23,0.75)'
  const iconColor = scrolled ? 'var(--charcoal)' : 'var(--white)'
  const linkColor = scrolled ? 'var(--grey-dark)' : 'rgba(255,255,255,0.85)'

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '0 6vw',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 0.4s ease, box-shadow 0.4s ease',
          background: navBg,
          boxShadow: scrolled ? '0 8px 32px rgba(11,31,23,0.08)' : 'none',
          backdropFilter: scrolled || !isHomePage ? 'blur(18px)' : 'none',
          WebkitBackdropFilter: scrolled || !isHomePage ? 'blur(18px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(11,31,23,0.06)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: scrolled ? 'var(--charcoal)' : 'var(--white)',
            textDecoration: 'none',
            transition: 'color 0.4s',
          }}
        >
          GL<span className="gradient-text">OWW</span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', margin: 0, padding: 0 }} className="nav-links-desktop">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500, color: linkColor, textDecoration: 'none', transition: 'color 0.3s' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.target.style.color = scrolled ? 'var(--grey-dark)' : 'rgba(255,255,255,0.85)')}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.35rem' }}>
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => dispatch(toggleSearch())}
            aria-label="Search"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, display: 'flex', alignItems: 'center', transition: 'color 0.3s' }}
          >
            <Search size={18} strokeWidth={1.75} />
          </motion.button>

          <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.94 }}>
            <Link href="/wishlist" aria-label="Wishlist" style={{ color: iconColor, display: 'flex', transition: 'color 0.3s' }}>
              <Heart size={18} strokeWidth={1.75} />
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => dispatch(toggleCart())}
            aria-label={`Cart (${cartCount} items)`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: iconColor, display: 'flex', alignItems: 'center', transition: 'color 0.3s' }}
          >
            <ShoppingBag size={18} strokeWidth={1.75} />
            {mounted && cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-10px', background: 'var(--gradient-primary)', color: 'var(--white)', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.62rem', fontFamily: 'var(--font-ui)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </motion.button>

          {isAuthenticated ? (
            <Link
              href="/account"
              style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: iconColor, textDecoration: 'none', transition: 'color 0.3s' }}
            >
              {user?.name?.split(' ')[0]}
            </Link>
          ) : (
            <Link
              href="/auth/login"
              style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'var(--gradient-primary)', color: 'var(--white)', borderRadius: 'var(--radius-full)', padding: '0.6rem 1.4rem', fontWeight: 500, textDecoration: 'none', display: 'none', boxShadow: 'var(--shadow-emerald)' }}
              className="nav-login-btn"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Menu"
            className="hamburger-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', color: iconColor, padding: '4px' }}
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .nav-login-btn { display: none !important; }
        }
        @media (min-width: 769px) {
          .nav-login-btn { display: inline-flex !important; }
        }
      `}</style>

      <MobileMenu links={navLinks} />
      <SearchOverlay />
      <CartDrawer />
    </>
  )
}
