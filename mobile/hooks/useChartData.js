/**
 * Custom Hook: useChartData
 * Fetches historical sensor data from Firebase for chart visualization
 * 
 * Usage:
 *   const { chartData, isLoading, error, highestLevel } = useChartData(limit);
 * 
 * @param {number} limit - Maximum number of data points to fetch (default: 60)
 * @returns {Object} Chart data with times, vocIndex arrays, loading state, error, and highest level
 */

import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, query, limitToLast, orderByKey } from 'firebase/database';
import { DEFAULT_VALUES } from '../utils/constants';

export function useChartData(limit = 60) {
    const [chartData, setChartData] = useState({
        times: [],
        vocIndex: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sensorRef = ref(database, 'sensor_data');
        
        // Try to use query with orderByKey and limitToLast
        // If that fails, fall back to fetching all data and limiting client-side
        let sensorQuery;
        try {
            sensorQuery = query(
                sensorRef,
                orderByKey(),
                limitToLast(limit)
            );
        } catch (queryError) {
            // If query fails (e.g., no index), use the base ref
            console.warn('Query with orderByKey failed, using base ref:', queryError);
            sensorQuery = sensorRef;
        }
        
        const unsubscribe = onValue(
            sensorQuery,
            (snapshot) => {
                setIsLoading(false);
                setError(null);
                
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const entries = Object.entries(data);
                    
                    // Sort by key (timestamp index) to ensure chronological order
                    // Convert keys to numbers for proper sorting
                    entries.sort((a, b) => {
                        const keyA = parseInt(a[0]) || 0;
                        const keyB = parseInt(b[0]) || 0;
                        return keyA - keyB;
                    });
                    
                    // Limit to last N entries if we fetched all data
                    const limitedEntries = entries.length > limit 
                        ? entries.slice(-limit)
                        : entries;
                    
                    const times = [];
                    const vocIndex = [];
                    
                    limitedEntries.forEach(([key, value]) => {
                        const vocValue = value.voc_index ?? value.vocIndex ?? DEFAULT_VALUES.VOC_INDEX;
                        const timestamp = value.timestamp ?? Date.now();
                        
                        // Format time for display
                        const date = new Date(timestamp);
                        const timeString = date.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        });
                        
                        times.push(timeString);
                        vocIndex.push(Number(vocValue));
                    });
                    
                    setChartData({ times, vocIndex });
                } else {
                    // No data available
                    setChartData({ times: [], vocIndex: [] });
                }
            },
            (firebaseError) => {
                setIsLoading(false);
                setError(firebaseError.message);
                console.error('Chart data error:', firebaseError);
            }
        );
        
        return () => unsubscribe();
    }, [limit]);

    // Calculate highest level from current data
    const highestLevel = chartData.vocIndex.length > 0
        ? Math.max(...chartData.vocIndex)
        : 0;

    return { 
        chartData, 
        isLoading, 
        error, 
        highestLevel,
        dataPointCount: chartData.vocIndex.length
    };
}

