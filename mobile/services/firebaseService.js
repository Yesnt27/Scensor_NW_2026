import { database } from '../config/firebase';
import { ref, onValue, off, get } from 'firebase/database';
import authService from './authService';
import { featureFlags } from '../config/featureFlags';

class FirebaseService {
    // Store recent readings for average calculation
    readingHistory = new Map(); // deviceId -> array of recent values

    // Listen to sensor data from Firebase
    subscribeToData(deviceId, callback) {
        const dataRef = ref(database, `devices/${deviceId}/data`);

        const unsubscribe = onValue(dataRef, async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                // Check for abnormalities
                let abnormalities = [];
                let averageInfo = null;

                if (featureFlags.detectionMode === 'average') {
                    // Use average-based detection - learn baseline first
                    const result = await this.checkAbnormalitiesByAverage(data, deviceId);
                    abnormalities = result.abnormalities;
                    averageInfo = result.averageInfo; // Includes average, reading count, baseline status
                } else {
                    // Use threshold-based detection
                    if (featureFlags.authentication) {
                        // Use user-specific thresholds if auth is enabled
                        const user = authService.getCurrentUser();
                        if (user) {
                            abnormalities = await this.checkAbnormalities(data, user.uid);
                        }
                    } else {
                        // Use default thresholds if auth is disabled
                        abnormalities = this.checkAbnormalitiesWithDefaults(data);
                    }
                }

                callback({
                    ...data,
                    abnormalities,
                    averageInfo  // Contains: average, readingCount, baselineEstablished
                });
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

    // Check if sensor data is abnormal based on user's thresholds
    // Expects sensorData to have a 'value' property with a single number
    async checkAbnormalities(sensorData, userId) {
        try {
            const userProfile = await authService.getUserProfile(userId);
            if (!userProfile || !userProfile.thresholds) {
                return [];
            }

            const thresholds = userProfile.thresholds;
            const abnormalities = [];

            // Get the sensor value (could be 'value', 'reading', or any numeric field)
            const sensorValue = sensorData.value !== undefined
                ? sensorData.value
                : (sensorData.reading !== undefined ? sensorData.reading : null);

            if (sensorValue === null || sensorValue === undefined) {
                return [];
            }

            // Check if value is below minimum threshold
            if (thresholds.min !== undefined && sensorValue < thresholds.min) {
                abnormalities.push({
                    type: 'below_threshold',
                    value: sensorValue,
                    threshold: thresholds.min,
                    message: `Value too low: ${sensorValue} (minimum: ${thresholds.min})`
                });
            }

            // Check if value is above maximum threshold
            if (thresholds.max !== undefined && sensorValue > thresholds.max) {
                abnormalities.push({
                    type: 'above_threshold',
                    value: sensorValue,
                    threshold: thresholds.max,
                    message: `Value too high: ${sensorValue} (maximum: ${thresholds.max})`
                });
            }

            return abnormalities;
        } catch (error) {
            console.error('Error checking abnormalities:', error);
            return [];
        }
    }

    // Check abnormalities using default thresholds (when auth is disabled)
    checkAbnormalitiesWithDefaults(sensorData) {
        const abnormalities = [];
        const thresholds = featureFlags.defaultThresholds;

        // Get the sensor value
        const sensorValue = sensorData.value !== undefined
            ? sensorData.value
            : (sensorData.reading !== undefined ? sensorData.reading : null);

        if (sensorValue === null || sensorValue === undefined) {
            return [];
        }

        // Check if value is below minimum threshold
        if (thresholds.min !== undefined && sensorValue < thresholds.min) {
            abnormalities.push({
                type: 'below_threshold',
                value: sensorValue,
                threshold: thresholds.min,
                message: `Value too low: ${sensorValue} (minimum: ${thresholds.min})`
            });
        }

        // Check if value is above maximum threshold
        if (thresholds.max !== undefined && sensorValue > thresholds.max) {
            abnormalities.push({
                type: 'above_threshold',
                value: sensorValue,
                threshold: thresholds.max,
                message: `Value too high: ${sensorValue} (maximum: ${thresholds.max})`
            });
        }

        return abnormalities;
    }

    // Check abnormalities based on average of recent readings
    // First establishes baseline average, then detects deviations
    async checkAbnormalitiesByAverage(sensorData, deviceId) {
        try {
            const sensorValue = sensorData.value !== undefined
                ? sensorData.value
                : (sensorData.reading !== undefined ? sensorData.reading : null);

            if (sensorValue === null || sensorValue === undefined) {
                return {
                    abnormalities: [],
                    averageInfo: null
                };
            }

            // Initialize history for this device if needed
            if (!this.readingHistory.has(deviceId)) {
                this.readingHistory.set(deviceId, []);
            }

            const history = this.readingHistory.get(deviceId);

            // Add current reading to history
            history.push(sensorValue);

            // Keep only the last N readings (window size)
            const windowSize = featureFlags.averageDetection.windowSize;
            if (history.length > windowSize) {
                history.shift(); // Remove oldest reading
            }

            const abnormalities = [];
            const minReadings = featureFlags.averageDetection.minReadingsForBaseline;

            // Calculate average from all collected readings
            const sum = history.reduce((a, b) => a + b, 0);
            const average = history.length > 0 ? sum / history.length : 0;
            const readingCount = history.length;
            const baselineEstablished = readingCount >= minReadings;

            // Average info to return (so you can see what the baseline is)
            const averageInfo = {
                average: average.toFixed(2),
                readingCount: readingCount,
                baselineEstablished: baselineEstablished,
                minReadingsNeeded: minReadings,
                message: baselineEstablished
                    ? `Baseline established: Average is ${average.toFixed(2)} from ${readingCount} readings`
                    : `Collecting baseline: ${readingCount}/${minReadings} readings (need ${minReadings - readingCount} more)`
            };

            // Only detect abnormalities if baseline is established
            if (baselineEstablished && readingCount >= 2) {
                // Calculate deviation percentage
                const deviation = Math.abs(sensorValue - average);
                const deviationPercent = average > 0 ? (deviation / average) * 100 : 0;

                // Check if deviation exceeds threshold
                const threshold = featureFlags.averageDetection.deviationThreshold;
                if (deviationPercent > threshold) {
                    abnormalities.push({
                        type: 'deviation_from_average',
                        value: sensorValue,
                        average: parseFloat(average.toFixed(2)),
                        deviation: parseFloat(deviationPercent.toFixed(2)),
                        threshold: threshold,
                        message: `⚠️ Abnormal: Value ${sensorValue} deviates ${deviationPercent.toFixed(2)}% from baseline average ${average.toFixed(2)} (threshold: ${threshold}%)`
                    });
                }
            }

            return {
                abnormalities,
                averageInfo
            };
        } catch (error) {
            console.error('Error checking average abnormalities:', error);
            return {
                abnormalities: [],
                averageInfo: null
            };
        }
    }
}

export default new FirebaseService();
