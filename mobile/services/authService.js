import { auth } from '../config/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { database } from '../config/firebase';
import { ref, set, get } from 'firebase/database';

class AuthService {
    // Sign up new user
    async signUp(email, password) {
        try {
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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    // Sign out
    async signOutUser() {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    }

    // Listen to auth state changes
    onAuthStateChange(callback) {
        return onAuthStateChanged(auth, callback);
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

