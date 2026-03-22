import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Log config for debugging
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + '...' : 'MISSING',
  projectId: firebaseConfig.projectId || 'MISSING',
  authDomain: firebaseConfig.authDomain || 'MISSING',
})

let app, auth, db, storage, functions

try {
  // Check if all required fields are present
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.authDomain) {
    throw new Error('Missing required Firebase configuration. Check environment variables.')
  }
  
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  functions = getFunctions(app)
  
  console.log('✓ Firebase initialized successfully')
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message)
  console.error('Available env variables:', Object.keys(import.meta.env))
  // Don't throw - allow app to load even without Firebase
}

export { auth, db, storage, functions }
export default app
