import { Router } from 'express'
import products from './products.js'
import categories from './categories.js'
import brands from './brands.js'
import orders from './orders.js'
import customers from './customers.js'
import reviews from './reviews.js'
import coupons from './coupons.js'
import banners from './banners.js'
import contacts from './contacts.js'
import settings from './settings.js'
import stats from './stats.js'
import seed from './seed.js'

const router = Router()

// seed is mounted first and handles its own auth (bootstraps the first admin)
router.use('/seed', seed)

router.use('/products', products)
router.use('/categories', categories)
router.use('/brands', brands)
router.use('/orders', orders)
router.use('/customers', customers)
router.use('/reviews', reviews)
router.use('/coupons', coupons)
router.use('/banners', banners)
router.use('/contacts', contacts)
router.use('/settings', settings)
router.use('/stats', stats)

export default router
