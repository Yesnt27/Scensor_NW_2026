// Firebase Configuration

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtHJfENFfuagPlaiXbpCdFmgZ-KtLzYqc",
  authDomain: "scensor-28457.firebaseapp.com",
  databaseURL: "https://scensor-28457-default-rtdb.firebaseio.com",
  projectId: "scensor-28457",
  storageBucket: "scensor-28457.firebasestorage.app",
  messagingSenderId: "245035409975",
  appId: "1:245035409975:web:32876b234428c22aef55b2",
  measurementId: "G-2KDPPME9H4"
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

