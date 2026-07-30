'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/slices/cartSlice'
import { toggleWishlistLocal } from '@/store/slices/wishlistSlice'
import { selectIsInWishlist } from '@/store/slices/wishlistSlice'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const [hovered, setHovered] = useState(false)
  const isWishlisted = useSelector(selectIsInWishlist(product._id))

  if (!product) return null

  let price, originalPrice, hasDiscount, discountPct, pricePrefix

  if (product.type === 'variable' && product.variants?.length > 0) {
    const hasExplicitDefault = product.variants.some(v => v.isDefault)
    // product.price/salePrice are synced from default variant on save.
    // Fall back to reading variants directly for products saved before this sync was added.
    const src = product.price > 0
      ? product
      : (product.variants.find(v => v.isDefault) || product.variants[0])
    price = src.salePrice || src.price
    originalPrice = src.price
    hasDiscount = src.salePrice && src.salePrice < src.price
    discountPct = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
    pricePrefix = !hasExplicitDefault ? 'From ' : ''
  } else {
    price = product.salePrice || product.price
    originalPrice = product.price
    hasDiscount = product.salePrice && product.salePrice < product.price
    discountPct = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
    pricePrefix = ''
  }

  const image = product.thumbnail || product.images?.[0] || ''
  const image2 = product.images?.[1] || ''

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (product.type === 'variable') {
      window.location.href = `/product/${product.slug}`
      return
    }
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    dispatch(toggleWishlistLocal({ product }))
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <motion.article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        style={{
          position: 'relative',
          background: 'var(--white)',
          borderRadius: 'var(--radius)',
          padding: '0.75rem',
          boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow)',
          transition: 'box-shadow 0.35s ease',
        }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '3/4',
            overflow: 'hidden',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--grey)',
            marginBottom: '1.1rem',
          }}
        >
          {image ? (
            <img
              src={hovered && image2 ? image2 : image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s ease, opacity 0.3s ease',
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
              }}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--gradient-mesh), var(--grey)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--emerald)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-ui)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              GLOWW
            </div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {product.isNewArrival && (
              <span
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                }}
              >
                New
              </span>
            )}
            {hasDiscount && (
              <span
                style={{
                  background: 'var(--gradient-gold)',
                  color: 'var(--emerald-dark)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                }}
              >
                −{discountPct}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="glass"
            style={{
              position: 'absolute',
              top: '0.85rem',
              right: '0.85rem',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: hovered || isWishlisted ? 1 : 0,
              transition: 'opacity 0.3s, color 0.3s, transform 0.2s',
              color: isWishlisted ? '#e0577a' : 'var(--grey-dark)',
            }}
          >
            <Heart size={16} strokeWidth={1.75} fill={isWishlisted ? '#e0577a' : 'none'} />
          </button>

          {/* Quick add */}
          <button
            onClick={handleAddToCart}
            style={{
              position: 'absolute',
              bottom: '0.6rem',
              left: '0.6rem',
              right: '0.6rem',
              background: 'var(--gradient-primary)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.66rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
              padding: '0.85rem',
              boxShadow: 'var(--shadow-emerald)',
              transform: hovered ? 'translateY(0)' : 'translateY(120%)',
              opacity: hovered ? 1 : 0,
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
            }}
          >
            {product.type === 'variable' ? 'Select Options' : 'Add to Cart'}
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '0 0.4rem 0.4rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--grey-text)',
              marginBottom: '0.4rem',
            }}
          >
            {product.category?.name || 'Panel'}
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: 500,
              marginBottom: '0.5rem',
              lineHeight: 1.3,
              color: 'var(--charcoal)',
            }}
          >
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: hasDiscount ? 'var(--emerald)' : 'var(--charcoal)',
              }}
            >
              {pricePrefix}₹{price?.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  color: 'var(--grey-text)',
                  textDecoration: 'line-through',
                }}
              >
                ₹{originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    strokeWidth={1.5}
                    fill={star <= Math.round(product.rating) ? 'var(--gold)' : 'none'}
                    style={{ color: star <= Math.round(product.rating) ? 'var(--gold)' : 'var(--grey-mid)' }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--grey-text)', fontFamily: 'var(--font-ui)' }}>
                ({product.reviewCount})
              </span>
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  )
}
