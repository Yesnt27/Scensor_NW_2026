/**
 * Custom Hook: useSensorData
 * Handles Firebase real-time data subscription for sensor values
 * 
 * Usage:
 *   const { sensorValue, unit, isLoading, error } = useSensorData();
 */

import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { FIREBASE_PATHS, DEFAULT_VALUES } from '../utils/constants';
import { parseSensorValue } from '../utils/dataParser';

export function useSensorData() {
    const [sensorValue, setSensorValue] = useState(DEFAULT_VALUES.SENSOR_VALUE);
    const [unit, setUnit] = useState(DEFAULT_VALUES.UNIT);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sensorRef = ref(database, FIREBASE_PATHS.SENSOR_VALUE);

        const unsubscribe = onValue(
            sensorRef,
            (snapshot) => {
                setIsLoading(false);
                setError(null);

                if (snapshot.exists()) {
                    const rawValue = snapshot.val();
                    const parsed = parseSensorValue(rawValue);

                    if (parsed) {
                        setSensorValue(parsed.value);
                        if (parsed.unit) {
                            setUnit(parsed.unit);
                        }
                    } else {
                        setError('Unable to parse sensor value');
                    }
                } else {
                    // No data available, use defaults
                    setSensorValue(DEFAULT_VALUES.SENSOR_VALUE);
                    setUnit(DEFAULT_VALUES.UNIT);
                }
            },
            (firebaseError) => {
                setIsLoading(false);
                setError(firebaseError.message);
                console.error('Firebase error:', firebaseError);
            }
        );

        return () => unsubscribe();
    }, []);

    return {
        sensorValue,
        unit,
        isLoading,
        error,
    };
}

