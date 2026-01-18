/**
 * Custom Hook: useAlertState
 * Manages alert state logic based on sensor value and button press
 * Cycles through: normal → alert → detecting → normal
 * 
 * Usage:
 *   const { state, toggleState, resetState } = useAlertState(sensorValue, threshold);
 */

import { useState, useMemo } from 'react';
import { LAYOUT_CONFIG } from '../config/layout';

// State types
export const STATE_TYPES = {
    NORMAL: 'normal',
    ALERT: 'alert',
    DETECTING: 'Detecting...',
};

export function useAlertState(sensorValue, threshold = null) {
    // Cycle through: 0 = normal, 1 = alert, 2 = detecting, then back to 0
    const [buttonState, setButtonState] = useState(0);

    // Use provided threshold or fall back to config
    const alertThreshold = threshold ?? LAYOUT_CONFIG.circle.threshold;

    // Determine current state
    const state = useMemo(() => {
        // If button has been pressed, use button state
        if (buttonState > 0) {
            if (buttonState === 1) return STATE_TYPES.ALERT;
            if (buttonState === 2) return STATE_TYPES.DETECTING;
        }
        // Otherwise, check if sensor value exceeds threshold
        if (sensorValue >= alertThreshold) {
            return STATE_TYPES.ALERT;
        }
        return STATE_TYPES.NORMAL;
    }, [buttonState, sensorValue, alertThreshold]);

    const toggleState = () => {
        setButtonState((prev) => (prev + 1) % 3); // Cycle: 0 → 1 → 2 → 0
    };

    const resetState = () => {
        setButtonState(0);
    };

    return {
        state,
        isAlert: state === STATE_TYPES.ALERT,
        isDetecting: state === STATE_TYPES.DETECTING,
        toggleState,
        resetState,
    };
}

