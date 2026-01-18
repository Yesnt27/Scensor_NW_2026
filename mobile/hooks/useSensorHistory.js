/**
 * Custom Hook: useSensorHistory
 * Fetches historical sensor data for graphing
 * 
 * Usage:
 *   const { vocHistory, timestamps, highestVoc, isLoading, error } = useSensorHistory(50);
 */

import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, query, limitToLast } from 'firebase/database';

export function useSensorHistory(limit = 50) {
    const [vocHistory, setVocHistory] = useState([]);
    const [timestamps, setTimestamps] = useState([]);
    const [highestVoc, setHighestVoc] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sensorRef = query(ref(database, 'sensor_data'), limitToLast(limit));
        
        const unsubscribe = onValue(
            sensorRef,
            (snapshot) => {
                setIsLoading(false);
                setError(null);
                
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const entries = Object.entries(data);
                    
                    // Extract VOC values and timestamps
                    const vocs = entries.map(([_, value]) => value.voc_index || 0);
                    const times = entries.map(([_, value]) => value.timestamp || 0);
                    
                    setVocHistory(vocs);
                    setTimestamps(times);
                    setHighestVoc(Math.max(...vocs));
                } else {
                    setVocHistory([]);
                    setTimestamps([]);
                    setHighestVoc(0);
                }
            },
            (firebaseError) => {
                setIsLoading(false);
                setError(firebaseError.message);
            }
        );
        
        return () => unsubscribe();
    }, [limit]);

    return { vocHistory, timestamps, highestVoc, isLoading, error };
}