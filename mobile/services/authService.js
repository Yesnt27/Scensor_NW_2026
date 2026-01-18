import { initAuth, getAuthInstance } from '../config/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { database } from '../config/firebase';
import { ref, set, get } from 'firebase/database';

class AuthService {
    // Ensure auth is initialized before use
    async ensureAuth() {
        let auth = getAuthInstance();
        if (!auth) {
            auth = await initAuth();
        }
        return auth;
    }

    // Sign up new user
    async signUp(email, password) {
        try {
            const auth = await this.ensureAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user profile with default thresholds (single value)
            await this.createUserProfile(user.uid, {
                email: email,
                thresholds: {
                    min: 0,
                    max: 100
                }
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    // Sign in existing user
    async signIn(email, password) {
        try {
            const auth = await this.ensureAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    // Sign out
    async signOutUser() {
        try {
            const auth = await this.ensureAuth();
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        const auth = getAuthInstance();
        if (!auth) return null;
        return auth.currentUser;
    }

    // Listen to auth state changes
    async onAuthStateChange(callback) {
        try {
            const auth = await this.ensureAuth();
            return onAuthStateChanged(auth, callback);
        } catch (error) {
            console.error('Error setting up auth state listener:', error);
            throw error;
        }
    }

    // Create user profile in Firebase
    async createUserProfile(userId, profileData) {
        const userRef = ref(database, `users/${userId}`);
        await set(userRef, {
            ...profileData,
            createdAt: new Date().toISOString()
        });
    }

    // Get user profile (including thresholds)
    async getUserProfile(userId) {
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);
        return snapshot.exists() ? snapshot.val() : null;
    }

    // Update user thresholds
    async updateThresholds(userId, thresholds) {
        const thresholdsRef = ref(database, `users/${userId}/thresholds`);
        await set(thresholdsRef, thresholds);
    }
}

export default new AuthService();

