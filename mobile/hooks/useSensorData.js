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
import { DEFAULT_VALUES } from '../utils/constants';

export function useSensorData() {
    const [sensorValue, setSensorValue] = useState(DEFAULT_VALUES.SENSOR_VALUE);
    const [unit, setUnit] = useState('VOC Index');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Change to read from sensor_data
        const sensorRef = ref(database, 'sensor_data');
        
        const unsubscribe = onValue(
            sensorRef,
            (snapshot) => {
                setIsLoading(false);
                setError(null);
                
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    
                    // Get the latest entry
                    const entries = Object.entries(data);
                    const latest = entries[entries.length - 1][1];
                    
                    // Use voc_index or raw value
                    setSensorValue(latest.voc_index || latest.raw);
                    setUnit('VOC Index');
                } else {
                    setSensorValue(DEFAULT_VALUES.SENSOR_VALUE);
                    setUnit(DEFAULT_VALUES.UNIT);
                }
            },
            (firebaseError) => {
                setIsLoading(false);
                setError(firebaseError.message);
            }
        );
        
        return () => unsubscribe();
    }, []);

    return { sensorValue, unit, isLoading, error };
}