/**
 * Admin seeder — run once to create the initial admin account.
 *
 *   npm run seed:admin   (from backend/)
 *
 * Override defaults with environment variables (or edit .env):
 *   ADMIN_NAME="Admin"  ADMIN_EMAIL="you@example.com"  ADMIN_PASSWORD="Str0ng!" \
 *     node scripts/seed-admin.mjs
 *
 * The script is idempotent: running it again when the email already exists is safe.
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../src/models/User.js'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('\nMONGODB_URI is not set. Add it to backend/.env or export it before running.\n')
  process.exit(1)
}

const DEFAULTS = {
  name: process.env.ADMIN_NAME || 'Admin',
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123',
}

async function seed() {
  console.log('\nConnecting to MongoDB…')
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10_000 })
  console.log('Connected.\n')

  const existing = await User.findOne({ email: DEFAULTS.email.toLowerCase() })

  if (existing) {
    if (existing.role === 'admin') {
      console.log(`Admin already exists: ${existing.email} (role: ${existing.role})`)
      console.log('No changes made.\n')
    } else {
      existing.role = 'admin'
      existing.isVerified = true
      existing.isActive = true
      await existing.save()
      console.log(`Upgraded existing account to admin: ${existing.email}\n`)
    }
    return
  }

  const admin = await User.create({
    name: DEFAULTS.name,
    email: DEFAULTS.email,
    password: DEFAULTS.password, // hashed by pre-save middleware
    role: 'admin',
    isVerified: true,
    isActive: true,
  })

  console.log('Admin account created!')
  console.log(`  Name  : ${admin.name}`)
  console.log(`  Email : ${admin.email}`)
  console.log(`  Role  : ${admin.role}`)
  console.log(`  ID    : ${admin._id}\n`)
  console.log('You can now log in with the credentials above.')
  console.log('Change the password immediately after first login.\n')
}

seed()
  .catch(err => {
    console.error('\nSeed failed:', err.message, '\n')
    process.exit(1)
  })
  .finally(() => mongoose.disconnect())
