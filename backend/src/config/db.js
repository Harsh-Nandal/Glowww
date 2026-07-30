import mongoose from 'mongoose'

let connected = false

export async function connectDB() {
  if (connected) return mongoose.connection

  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env')
  }

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  connected = true
  console.log('MongoDB connected')
  return mongoose.connection
}

export default connectDB
