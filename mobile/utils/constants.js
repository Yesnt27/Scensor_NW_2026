/**
 * Application Constants
 * Centralized location for all constant values used across the app
 */

// Firebase Database Paths
export const FIREBASE_PATHS = {
    SENSOR_VALUE: 'sensor_data',
    DEVICES: 'devices',
};

// Default Values
export const DEFAULT_VALUES = {
    VOC_INDEX: 100,
    RAW_VALUE: 30000,
    SENSOR_VALUE: 100,  // Keep for backward compatibility
    UNIT: 'VOC Index',
};

// Data Parsing
export const DATA_TYPES = {
    NUMBER: 'number',
    OBJECT: 'object',
    STRING: 'string',
};