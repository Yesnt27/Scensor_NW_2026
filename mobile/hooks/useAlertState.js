/**
 * Custom Hook: useAlertState
 * Manages alert state logic based on VOC index
 * 
 * Logic:
 * - VOC Index > 250: Alert state (red)
 * - VOC Index = null or 0: Detecting state (white, pulsing)
 * - VOC Index < 250 and > 0: Normal state (green)
 * 
 * Usage:
 *   const { state } = useAlertState(vocIndex);
 */

import { useMemo } from 'react';

// State types
export const STATE_TYPES = {
    NORMAL: 'normal',
    ALERT: 'alert',
    DETECTING: 'Detecting...',
};

export function useAlertState(vocIndex) {
    // Determine current state based purely on VOC index
    const state = useMemo(() => {
        // Null or 0 means sensor is calibrating/no reading yet
        if (vocIndex === null || vocIndex === 0) {
            return STATE_TYPES.DETECTING;
        } else if (vocIndex > 250) {
            return STATE_TYPES.ALERT;  // High VOC detected
        } else {
            return STATE_TYPES.NORMAL;  // Normal air quality
        }
    }, [vocIndex]);
    
    return {
        state,
        isAlert: state === STATE_TYPES.ALERT,
        isDetecting: state === STATE_TYPES.DETECTING,
    };
}