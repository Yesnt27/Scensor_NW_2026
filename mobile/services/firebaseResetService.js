/**
 * Firebase Reset Service
 * Handles clearing all sensor data from Firebase
 */

import { database } from '../config/firebase';
import { ref, remove, set } from 'firebase/database';

class FirebaseResetService {
    /**
     * Clear all sensor data and trigger ESP32 restart
     * @returns {Promise<boolean>} Success status
     */
    async resetSensorData() {
        try {
            console.log('🔄 [RESET] Starting Firebase reset...');
            
            // 1. Delete all sensor data
            const sensorRef = ref(database, 'sensor_data');
            await remove(sensorRef);
            console.log('✅ [RESET] Sensor data cleared');
            
            // 2. Send restart command to ESP32
            const commandRef = ref(database, 'commands/reset');
            await set(commandRef, 'true');
            console.log('🔄 [RESET] Restart command sent to ESP32');
            
            console.log('✅ [RESET] Full reset complete - ESP32 will restart');
            return true;
        } catch (error) {
            console.error('❌ [RESET] Error:', error);
            throw error;
        }
    }
}

export default new FirebaseResetService();