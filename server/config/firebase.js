// Firebase Admin SDK Configuration for Node.js Server
const admin = require('firebase-admin');

// Initialize Firebase Admin
// Note: You'll need to download your service account key from Firebase Console
// and save it as 'serviceAccountKey.json' in this directory

let database;

try {
    // Option 1: Use service account key file (recommended for production)
    // Uncomment and configure this if you have a service account key:
    /*
    const serviceAccount = require('./serviceAccountKey.json');
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://scensor-a620a-default-rtdb.firebaseio.com"
    });
    */

    // Option 2: Use environment variables (alternative)
    // For now, we'll use the database URL directly
    // You can set FIREBASE_DATABASE_URL in .env file

    if (!admin.apps.length) {
        admin.initializeApp({
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://scensor-a620a-default-rtdb.firebaseio.com"
        });
    }

    database = admin.database();
    console.log('Firebase Admin initialized successfully');
} catch (error) {
    console.error('Firebase Admin initialization error:', error);
}

module.exports = { database, admin };

