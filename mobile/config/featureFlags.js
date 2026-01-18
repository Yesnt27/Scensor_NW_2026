// Feature Flags Configuration
// Toggle features on/off for testing

export const featureFlags = {
    // Set to false to disable authentication (for testing)
    // When false: abnormality detection uses default thresholds
    // When true: abnormality detection uses user-specific thresholds
    authentication: false,  // Change to true to enable auth

    // Detection mode: 'threshold' (min/max) or 'average' (learn baseline, then detect deviations)
    detectionMode: 'average',  // 'threshold' or 'average' - use 'average' to learn baseline first

    // Default thresholds when authentication is disabled
    defaultThresholds: {
        min: 0,
        max: 100
    },

    // Average-based detection settings
    averageDetection: {
        minReadingsForBaseline: 10,  // Minimum readings needed to establish baseline average
        windowSize: 50,  // Number of readings to keep in history for average calculation
        deviationThreshold: 20  // Percentage deviation from average to trigger alert
    }
};

