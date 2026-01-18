/**
 * Custom Hook: useSensorData
 * Handles Firebase real-time data subscription for sensor values
 * 
 * Usage:
 *   const { vocIndex, rawValue, isLoading, error } = useSensorData();
 */

import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { DEFAULT_VALUES } from '../utils/constants';

export function useSensorData() {
    const [vocIndex, setVocIndex] = useState(DEFAULT_VALUES.VOC_INDEX);
    const [rawValue, setRawValue] = useState(DEFAULT_VALUES.RAW_VALUE);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
                    
                    // Set both VOC index and raw value
                    setVocIndex(latest.voc_index || DEFAULT_VALUES.VOC_INDEX);
                    setRawValue(latest.raw || DEFAULT_VALUES.RAW_VALUE);
                } else {
                    setVocIndex(DEFAULT_VALUES.VOC_INDEX);
                    setRawValue(DEFAULT_VALUES.RAW_VALUE);
                }
            },
            (firebaseError) => {
                setIsLoading(false);
                setError(firebaseError.message);
            }
        );
        
        return () => unsubscribe();
    }, []);

    return { vocIndex, rawValue, isLoading, error };
}