/**
 * Custom Hook: useAlertState
 * Manages alert state logic based on sensor value and button press
 * 
 * Usage:
 *   const { isAlert, toggleAlert, resetAlert } = useAlertState(sensorValue, threshold);
 */

import { useState, useMemo } from 'react';
import { LAYOUT_CONFIG } from '../config/layout';

export function useAlertState(sensorValue, threshold = null) {
    const [isButtonPressed, setIsButtonPressed] = useState(false);

    // Use provided threshold or fall back to config
    const alertThreshold = threshold ?? LAYOUT_CONFIG.circle.threshold;

    // Calculate if alert should be active
    const isAlert = useMemo(() => {
        return isButtonPressed || sensorValue >= alertThreshold;
    }, [isButtonPressed, sensorValue, alertThreshold]);

    const toggleAlert = () => {
        setIsButtonPressed((prev) => !prev);
    };

    const resetAlert = () => {
        setIsButtonPressed(false);
    };

    return {
        isAlert,
        isButtonPressed,
        toggleAlert,
        resetAlert,
    };
}

