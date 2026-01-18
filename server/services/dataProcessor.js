const { database } = require('../config/firebase');

class DataProcessor {
    async process(data, deviceId) {
        // Basic processing - add timestamp
        const processed = {
            ...data,
            timestamp: Date.now(),
            receivedAt: new Date().toISOString()
        };

        // Note: Abnormality checking is done on the client side
        // based on each user's individual thresholds
        // This allows different users to have different thresholds

        return processed;
    }

    // Optional: Server-side abnormality check (uses default thresholds)
    checkAbnormalities(data) {
        const abnormalities = [];
        const defaultThresholds = { min: 0, max: 100 };

        const sensorValue = data.value !== undefined
            ? data.value
            : (data.reading !== undefined ? data.reading : null);

        if (sensorValue !== null && sensorValue !== undefined) {
            if (sensorValue < defaultThresholds.min ||
                sensorValue > defaultThresholds.max) {
                abnormalities.push('value');
            }
        }

        return abnormalities;
    }
}

module.exports = new DataProcessor();

