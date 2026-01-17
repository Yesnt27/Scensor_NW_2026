import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

class FirebaseService {
    // Listen to sensor data from Firebase
    subscribeToData(deviceId, callback) {
        const dataRef = ref(database, `devices/${deviceId}/data`);

        const unsubscribe = onValue(dataRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            } else {
                callback(null);
            }
        }, (error) => {
            console.error('Firebase error:', error);
            callback(null);
        });

        return () => {
            off(dataRef);
        };
    }
}

export default new FirebaseService();
