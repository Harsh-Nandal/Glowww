/**
 * Seeds demo categories + products so the storefront has real content to show.
 *
 *   npm run seed:products   (from backend/)
 *
 * Idempotent: upserts categories by slug, and skips products whose slug
 * already exists so re-running is always safe.
 *
 * Images are curated real stock photography (Pexels, free-to-use) matched to
 * each category/product — swap for real product photography via the admin
 * panel whenever it's available.
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import Category from '../src/models/Category.js'
import Product from '../src/models/Product.js'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('\nMONGODB_URI is not set. Add it to backend/.env before running.\n')
  process.exit(1)
}

// Curated Pexels photo IDs matched to each category/product slug.
const PHOTO_IDS = {
  'cat-juices-shots': 29851973,
  'cat-tablets-capsules': 17820729,
  'cat-powders-mixes': 13779116,
  'cat-oils-extracts': 7795762,
  'cat-combos': 13787561,

  'sea-buckthorn-juice': 8750912,
  'amla-immunity-shot': 8679338,
  'wheatgrass-detox-shot': 28843844,
  'moringa-tablets': 9742861,
  'ashwagandha-capsules': 17820710,
  'vitamin-c-effervescent': 5722880,
  'spirulina-powder': 7149595,
  'plant-protein-chocolate': 13779108,
  'turmeric-curcumin-mix': 6220709,
  'mct-oil': 3737656,
  'moringa-seed-oil': 4465830,
  'black-seed-oil': 18708752,
  'immunity-combo-kit': 7795755,
  'gut-health-starter-kit': 9871626,
}

const img = (seed, w = 900) => `https://images.pexels.com/photos/${PHOTO_IDS[seed]}/pexels-photo-${PHOTO_IDS[seed]}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

const CATEGORIES = [
  { name: 'Juices & Shots', slug: 'juices-shots', displayOrder: 1 },
  { name: 'Tablets & Capsules', slug: 'tablets-capsules', displayOrder: 2 },
  { name: 'Powders & Mixes', slug: 'powders-mixes', displayOrder: 3 },
  { name: 'Oils & Extracts', slug: 'oils-extracts', displayOrder: 4 },
  { name: 'Combos', slug: 'combos', displayOrder: 5 },
]

const PRODUCTS = [
  {
    name: 'Sea Buckthorn Juice', slug: 'sea-buckthorn-juice', category: 'juices-shots',
    price: 599, salePrice: 499, isFeatured: true, isBestSeller: true, rating: 4.8, reviewCount: 214, soldCount: 3400,
    shortDescription: 'Cold-pressed sea buckthorn with Omega 3-7-9 and no added sugar.',
    description: 'Our bestselling cold-pressed sea buckthorn juice, packed with Omega 3-7-9 fatty acids and antioxidants. No added sugar, no preservatives — just fruit, lab-tested for purity.',
    tags: ['immunity', 'antioxidant', 'bestseller'],
  },
  {
    name: 'Amla Immunity Shot', slug: 'amla-immunity-shot', category: 'juices-shots',
    price: 349, isNewArrival: true, rating: 4.6, reviewCount: 88, soldCount: 1200,
    shortDescription: 'A concentrated daily shot of Vitamin C from whole Indian gooseberry.',
    description: 'A concentrated daily shot of Vitamin C from whole Indian gooseberry (amla), traditionally used to support immunity and skin health. No added sugar.',
    tags: ['immunity', 'vitamin-c'],
  },
  {
    name: 'Wheatgrass Detox Shot', slug: 'wheatgrass-detox-shot', category: 'juices-shots',
    price: 379, rating: 4.4, reviewCount: 52, soldCount: 640,
    shortDescription: 'Chlorophyll-rich wheatgrass shot for a gentle daily detox.',
    description: 'Cold-pressed from fresh wheatgrass, this chlorophyll-rich shot is a staple for a gentle daily detox ritual. Best taken first thing in the morning.',
    tags: ['detox', 'greens'],
  },
  {
    name: 'Moringa Tablets', slug: 'moringa-tablets', category: 'tablets-capsules',
    price: 449, salePrice: 399, isFeatured: true, rating: 4.7, reviewCount: 176, soldCount: 2800,
    shortDescription: '100% moringa leaf tablets — iron, plant protein, and daily greens.',
    description: '100% pure moringa leaf tablets, a whole-food source of iron and plant protein. A simple way to add daily greens without the taste of green powders.',
    tags: ['energy', 'greens', 'iron'],
  },
  {
    name: 'Ashwagandha Capsules', slug: 'ashwagandha-capsules', category: 'tablets-capsules',
    price: 599, isBestSeller: true, rating: 4.8, reviewCount: 231, soldCount: 3100,
    shortDescription: 'KSM-66 ashwagandha for stress support and better sleep.',
    description: 'Formulated with KSM-66 ashwagandha extract, clinically studied to support stress response and sleep quality. Third-party tested for potency.',
    tags: ['stress', 'sleep', 'adaptogen'],
  },
  {
    name: 'Vitamin C Effervescent Tablets', slug: 'vitamin-c-effervescent', category: 'tablets-capsules',
    price: 299, isNewArrival: true, rating: 4.5, reviewCount: 64, soldCount: 900,
    shortDescription: 'Fast-dissolving Vitamin C with zinc for daily immunity.',
    description: 'A fizzy, fast-dissolving Vitamin C and zinc tablet for daily immune support — just drop one in water for a refreshing citrus drink.',
    tags: ['immunity', 'vitamin-c'],
  },
  {
    name: 'Spirulina Powder', slug: 'spirulina-powder', category: 'powders-mixes',
    price: 799, salePrice: 699, isFeatured: true, rating: 4.6, reviewCount: 143, soldCount: 1900,
    shortDescription: 'Complete plant protein algae superfood, mixes into any smoothie.',
    description: 'A nutrient-dense blue-green algae superfood packed with complete plant protein, iron, and B vitamins. Mixes easily into smoothies, juices, or water.',
    tags: ['protein', 'greens', 'superfood'],
  },
  {
    name: 'Plant Protein Powder — Chocolate', slug: 'plant-protein-chocolate', category: 'powders-mixes',
    price: 1499, isBestSeller: true, rating: 4.7, reviewCount: 268, soldCount: 2600,
    shortDescription: '22g plant protein per scoop, no added sugar, real cocoa.',
    description: 'A smooth, real-cocoa chocolate protein blend delivering 22g of plant protein per scoop from pea and brown rice — no added sugar, no chalky aftertaste.',
    tags: ['protein', 'fitness'],
  },
  {
    name: 'Turmeric Curcumin Mix', slug: 'turmeric-curcumin-mix', category: 'powders-mixes',
    price: 549, rating: 4.5, reviewCount: 71, soldCount: 800,
    shortDescription: 'High-curcumin turmeric with black pepper for better absorption.',
    description: 'A high-curcumin turmeric blend paired with black pepper extract for better absorption — stir into warm milk or water for a daily golden ritual.',
    tags: ['anti-inflammatory', 'turmeric'],
  },
  {
    name: 'MCT Oil', slug: 'mct-oil', category: 'oils-extracts',
    price: 899, isNewArrival: true, rating: 4.4, reviewCount: 58, soldCount: 700,
    shortDescription: 'Odourless coconut-derived MCT oil for coffee, smoothies, or salads.',
    description: 'Odourless, flavourless MCT oil derived from coconut, ideal for adding to coffee, smoothies, or salad dressings for sustained energy.',
    tags: ['energy', 'keto'],
  },
  {
    name: 'Moringa Seed Oil', slug: 'moringa-seed-oil', category: 'oils-extracts',
    price: 649, rating: 4.3, reviewCount: 39, soldCount: 420,
    shortDescription: 'Cold-pressed moringa seed oil for skin and hair.',
    description: 'A lightweight, cold-pressed moringa seed oil rich in antioxidants — nourishes skin and hair without leaving a greasy residue.',
    tags: ['skin', 'hair', 'glow'],
  },
  {
    name: 'Black Seed Oil', slug: 'black-seed-oil', category: 'oils-extracts',
    price: 599, isFeatured: true, rating: 4.6, reviewCount: 97, soldCount: 1100,
    shortDescription: 'Cold-pressed Nigella sativa oil for immunity and skin.',
    description: 'Cold-pressed from premium Nigella sativa seeds, this traditional oil is used daily for immunity and skin support — take directly or mix with honey.',
    tags: ['immunity', 'skin'],
  },
  {
    name: 'Immunity Combo Kit', slug: 'immunity-combo-kit', category: 'combos',
    price: 1299, salePrice: 1099, isFeatured: true, isBestSeller: true, rating: 4.9, reviewCount: 156, soldCount: 1800,
    shortDescription: 'Amla shot + Moringa tablets + Vitamin C — our complete immunity ritual.',
    description: 'Our complete immunity ritual, bundled and discounted: Amla Immunity Shot, Moringa Tablets, and Vitamin C Effervescent Tablets. Everything you need in one order.',
    tags: ['combo', 'immunity', 'gifting'],
  },
  {
    name: 'Gut Health Starter Kit', slug: 'gut-health-starter-kit', category: 'combos',
    price: 1599, isNewArrival: true, rating: 4.5, reviewCount: 42, soldCount: 380,
    shortDescription: 'Wheatgrass shot + Turmeric mix + Probiotic-friendly fibre blend.',
    description: 'A gentle, three-part starter kit for gut health — Wheatgrass Detox Shot, Turmeric Curcumin Mix, and a daily fibre blend, designed to be taken together for two weeks.',
    tags: ['combo', 'gut-health'],
  },
]

async function seed() {
  console.log('\nConnecting to MongoDB…')
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10_000 })
  console.log('Connected.\n')

  const categoryIds = {}
  for (const cat of CATEGORIES) {
    const doc = await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: { name: cat.name, slug: cat.slug, displayOrder: cat.displayOrder, isActive: true, image: img(`cat-${cat.slug}`, 800) } },
      { new: true, upsert: true }
    )
    categoryIds[cat.slug] = doc._id
    console.log(`Category ready: ${doc.name}`)
  }

  let created = 0
  let skipped = 0

  for (const p of PRODUCTS) {
    const existing = await Product.findOne({ slug: p.slug })
    if (existing) { skipped++; continue }

    await Product.create({
      name: p.name,
      slug: p.slug,
      sku: `GLW-${p.slug.toUpperCase()}`,
      type: 'simple',
      category: categoryIds[p.category],
      tags: p.tags || [],
      description: p.description,
      shortDescription: p.shortDescription,
      images: [img(p.slug)],
      thumbnail: img(p.slug),
      price: p.price,
      salePrice: p.salePrice,
      stock: 150,
      isFeatured: !!p.isFeatured,
      isNewArrival: !!p.isNewArrival,
      isBestSeller: !!p.isBestSeller,
      isActive: true,
      rating: p.rating || 0,
      reviewCount: p.reviewCount || 0,
      soldCount: p.soldCount || 0,
    })
    created++
    console.log(`Product created: ${p.name}`)
  }

  console.log(`\nDone. ${created} product(s) created, ${skipped} already existed.\n`)
}

seed()
  .catch(err => {
    console.error('\nSeed failed:', err.message, '\n')
    process.exit(1)
  })
  .finally(() => mongoose.disconnect())
