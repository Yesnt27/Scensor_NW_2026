/**
 * Data Parser Utilities
 * Handles parsing and normalization of sensor data from Firebase
 */

/**
 * Parses sensor value from Firebase snapshot
 * @param {*} value - Raw value from Firebase
 * @returns {Object} - Parsed data with value and unit
 */
export function parseSensorValue(value) {
    // Handle number type
    if (typeof value === 'number') {
        return {
            value: Math.round(value),
            unit: null,
        };
    }

    // Handle object type with value property
    if (value && typeof value === 'object' && value.value !== undefined) {
        return {
            value: Math.round(value.value),
            unit: value.unit || null,
        };
    }

    // Handle string that can be parsed as number
    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
        return {
            value: Math.round(parseFloat(value)),
            unit: null,
        };
    }

    // Return null if value cannot be parsed
    return null;
}

/**
 * Validates if a value is a valid sensor reading
 * @param {*} value - Value to validate
 * @returns {boolean} - True if valid
 */
export function isValidSensorValue(value) {
    return value !== null && value !== undefined && !isNaN(value);
}

