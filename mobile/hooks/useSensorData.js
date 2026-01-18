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

export function useSensorData() {
    const [vocIndex, setVocIndex] = useState(null);
    const [rawValue, setRawValue] = useState(null);
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
                    
                    // Set both VOC index and raw value (null if not present)
                    setVocIndex(latest.voc_index ?? null);
                    setRawValue(latest.raw ?? null);
                } else {
                    // No data in Firebase
                    setVocIndex(null);
                    setRawValue(null);
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