// Firebase Configuration

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "API_KEY_HERE",
    authDomain: "scensor-a620a.firebaseapp.com",
    databaseURL: "https://scensor-a620a-default-rtdb.firebaseio.com",
    projectId: "scensor-a620a",
    storageBucket: "scensor-a620a.firebasestorage.app",
    messagingSenderId: "353469780357",
    appId: "1:353469780357:android:e11b8f6d48f78d860334ec"
};

// Initialize Firebase
let app;
let database;

try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    const auth = getAuth(app);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

export { database, auth };
export default app;

