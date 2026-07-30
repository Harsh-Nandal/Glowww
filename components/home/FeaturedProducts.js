'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import ProductSkeleton from '@/components/product/ProductSkeleton'
import Reveal from '@/components/ui/Reveal'

const TABS = [
  { label: 'Featured', param: 'featured=true' },
  { label: 'New Arrivals', param: 'newArrival=true' },
  { label: 'Best Sellers', param: 'bestSeller=true' },
]

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/api/products?${TABS[activeTab].param}&limit=8`)
        setProducts(data.data || [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [activeTab])

  return (
    <section className="section" style={{ background: 'var(--ivory)' }}>
      {/* Header */}
      <Reveal>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div>
            <div className="section-eyebrow">Our Collection</div>
            <h2 className="section-title">
              Crafted for <em>Excellence</em>
            </h2>
          </div>

          {/* Tabs */}
          <div className="glass" style={{ display: 'flex', gap: '0.25rem', padding: '0.3rem', borderRadius: 'var(--radius-full)' }}>
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.65rem 1.3rem',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  background: activeTab === i ? 'var(--gradient-primary)' : 'transparent',
                  color: activeTab === i ? 'var(--white)' : 'var(--grey-dark)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontWeight: 500,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
        }}
        className="products-grid"
      >
        {loading ? (
          <ProductSkeleton count={8} />
        ) : products.length > 0 ? (
          products.map((product, i) => (
            <Reveal key={product._id} delay={Math.min(i * 0.06, 0.3)}>
              <ProductCard product={product} />
            </Reveal>
          ))
        ) : (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '4rem',
              color: 'var(--grey-text)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1rem' }}>
              No products found
            </p>
            <Link href="/shop" style={{ color: 'var(--emerald)' }}>
              Browse all products →
            </Link>
          </div>
        )}
      </div>

      {/* View all */}
      <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
        <Link
          href="/shop"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--white)',
            background: 'var(--gradient-primary)',
            textDecoration: 'none',
            padding: '0.9rem 2rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-emerald)',
          }}
        >
          View All Products
          <ArrowRight size={15} />
        </Link>
      </div>

      <style>{`
        @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .products-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
