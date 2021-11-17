/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.toString(),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.toString(),
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL?.toString(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.toString(),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.toString(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID?.toString(),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.toString(),
  measurementId: import.meta.env.VITE_FIREBASE_MEASURMENT_ID?.toString(),
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const analytics = getAnalytics(app)
