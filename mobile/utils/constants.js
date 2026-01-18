/**
 * Application Constants
 * Centralized location for all constant values used across the app
 */

// Firebase Database Paths
export const FIREBASE_PATHS = {
    SENSOR_VALUE: 'sensor_data',  // Changed from 'sensor/value' to match ESP32
    DEVICES: 'devices',
};

// Default Values
export const DEFAULT_VALUES = {
    SENSOR_VALUE: 100,  
    UNIT: 'VOC Index',  
};

// Data Parsing
export const DATA_TYPES = {
    NUMBER: 'number',
    OBJECT: 'object',
    STRING: 'string',
};
