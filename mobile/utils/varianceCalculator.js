/**
 * Variance Calculator Utility
 * Calculates variance and determines if data indicates an alert condition
 * 
 * Logic:
 * - Need at least 20 data points to establish baseline
 * - If variance increases by 20% from baseline → alert
 */

/**
 * Calculate variance of an array of numbers
 * @param {number[]} values - Array of numeric values
 * @returns {number} Variance value
 */
export function calculateVariance(values) {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

    return variance;
}

/**
 * Calculate mean (average) of an array of numbers
 * @param {number[]} values - Array of numeric values
 * @returns {number} Mean value
 */
export function calculateMean(values) {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Determine state based on data conditions
 * @param {number[]} dataHistory - Array of historical sensor values
 * @param {number} baselineStartIndex - Index to start baseline calculation from (for reset on button press)
 * @returns {Object} { state: string, baselineVariance: number, currentVariance: number }
 */
export function determineStateFromData(dataHistory, baselineStartIndex = 0) {
    const MIN_DATA_POINTS = 20;
    const VARIANCE_THRESHOLD_PERCENT = 20; // 20% increase triggers alert

    console.log('[varianceCalculator] determineStateFromData called:', {
        dataHistoryLength: dataHistory.length,
        baselineStartIndex,
        dataHistorySlice: dataHistory.slice(0, 5),
    });

    // Get data from baseline start index onwards
    const dataFromBaseline = dataHistory.slice(baselineStartIndex);
    const dataPointCount = dataFromBaseline.length;

    console.log('[varianceCalculator] Data from baseline:', {
        dataPointCount,
        dataFromBaselineSlice: dataFromBaseline.slice(0, 5),
        needsMorePoints: dataPointCount < MIN_DATA_POINTS,
    });

    // If less than 20 data points from baseline start → detecting state
    if (dataPointCount < MIN_DATA_POINTS) {
        console.log('[varianceCalculator] Returning DETECTING state:', {
            dataPointCount,
            minRequired: MIN_DATA_POINTS,
            pointsNeeded: MIN_DATA_POINTS - dataPointCount,
        });
        return {
            state: 'detecting',
            baselineVariance: null,
            currentVariance: null,
            dataPointCount,
        };
    }

    // Calculate baseline variance from first 20 points starting from baselineStartIndex
    // These 20 points become the new baseline/average
    const baselineData = dataFromBaseline.slice(0, MIN_DATA_POINTS);
    const baselineVariance = calculateVariance(baselineData);

    // Calculate current variance from all data from baseline start onwards
    const currentVariance = calculateVariance(dataFromBaseline);

    console.log('[varianceCalculator] Variance calculations:', {
        baselineDataLength: baselineData.length,
        baselineDataSample: baselineData.slice(0, 5),
        baselineVariance,
        currentDataLength: dataFromBaseline.length,
        currentVariance,
    });

    // When we have exactly 20 points, baseline and current are the same, so varianceIncrease = 0%
    // This means it will return 'normal' (green) state, which is correct
    // As more data comes in after the 20 points, we compare variance to the baseline

    // Handle edge case where baseline variance is 0 (all values are the same)
    if (baselineVariance === 0) {
        // If baseline has no variance and current also has no variance, it's normal
        if (currentVariance === 0) {
            return {
                state: 'normal',
                baselineVariance: 0,
                currentVariance: 0,
                varianceIncrease: 0,
                dataPointCount,
            };
        }
        // If current has variance but baseline doesn't, it's an alert
        return {
            state: 'alert',
            baselineVariance: 0,
            currentVariance,
            varianceIncrease: Infinity,
            dataPointCount,
        };
    }

    // Check if variance increased by 20% from baseline
    const varianceIncrease = ((currentVariance - baselineVariance) / baselineVariance) * 100;

    console.log('[varianceCalculator] Variance comparison:', {
        varianceIncrease,
        threshold: VARIANCE_THRESHOLD_PERCENT,
        isAlert: varianceIncrease >= VARIANCE_THRESHOLD_PERCENT,
    });

    if (varianceIncrease >= VARIANCE_THRESHOLD_PERCENT) {
        console.log('[varianceCalculator] Returning ALERT state');
        return {
            state: 'alert',
            baselineVariance,
            currentVariance,
            varianceIncrease,
            dataPointCount,
        };
    }

    // Otherwise, it's good (normal state)
    // This includes when we have exactly 20 points (varianceIncrease = 0%)
    console.log('[varianceCalculator] Returning NORMAL state');
    return {
        state: 'normal',
        baselineVariance,
        currentVariance,
        varianceIncrease,
        dataPointCount,
    };
}

