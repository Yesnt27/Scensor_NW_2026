/**
 * Application Constants
 * Centralized location for all constant values used across the app
 */

// Firebase Database Paths
export const FIREBASE_PATHS = {
    SENSOR_VALUE: 'sensor_data',
    DEVICES: 'devices',
};

// Default Values - null means calibrating/detecting state
export const DEFAULT_VALUES = {
    VOC_INDEX: null,
    RAW_VALUE: null,
    SENSOR_VALUE: null,
    UNIT: 'VOC Index',
};

// Data Parsing
export const DATA_TYPES = {
    NUMBER: 'number',
    OBJECT: 'object',
    STRING: 'string',
};