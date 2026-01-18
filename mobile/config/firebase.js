import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "scensor-a620a.firebaseapp.com",
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || "https://scensor-a620a-default-rtdb.firebaseio.com",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "scensor-a620a",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "scensor-a620a.firebasestorage.app",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "353469780357",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:353469780357:android:e11b8f6d48f78d860334ec"
};

let app;
let database;
let auth;

try {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "") {
        app = initializeApp(firebaseConfig);
        database = getDatabase(app);
        auth = getAuth(app);
        console.log('Firebase initialized successfully');
    } else {
        console.warn('⚠️ Firebase API key not configured. Please add your API key in config/firebase.js');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
}

export { database, auth };
export default app;
