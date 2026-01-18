import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app;
let database;
let auth = null;

// Initialize app and database immediately
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

database = getDatabase(app);

// Lazy load auth - only when first accessed
const initAuth = async () => {
  if (auth !== null) return auth;
  
  try {
    const { getAuth } = await import('firebase/auth');
    auth = getAuth(app);
    console.log('[Firebase] Auth loaded');
    return auth;
  } catch (error) {
    console.error('[Firebase] Failed to load auth:', error.message);
    throw error;
  }
};

export { database, app, initAuth };
export const getAuthInstance = () => auth;
