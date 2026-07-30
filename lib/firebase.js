import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { isFirebaseConfigured } from './firebaseConfig'

export { isFirebaseConfigured }

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app = null
let auth = null

export function getFirebaseApp() {
  if (!isFirebaseConfigured) return null
  if (!app) app = getApps()[0] || initializeApp(firebaseConfig)
  return app
}

export function getFirebaseAuth() {
  if (!isFirebaseConfigured) return null
  if (!auth) auth = getAuth(getFirebaseApp())
  return auth
}
