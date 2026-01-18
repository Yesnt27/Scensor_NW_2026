/**
 * Custom Hook: useAlertState
 * Manages alert state logic based on VOC index
 * 
 * Logic:
 * - VOC Index > 250: Alert state (red)
 * - VOC Index = 0: Detecting state (white, pulsing)
 * - VOC Index < 250 and > 0: Normal state (green)
 * 
 * Usage:
 *   const { state, toggleState } = useAlertState(vocIndex);
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
        if (vocIndex === 0) {
            return STATE_TYPES.DETECTING;  // Sensor initializing or no reading
        } else if (vocIndex > 250) {
            return STATE_TYPES.ALERT;  // High VOC detected
        } else {
            return STATE_TYPES.NORMAL;  // Normal air quality
        }
    }, [vocIndex]);
    
    // Button function (currently does nothing, but kept for compatibility)
    const toggleState = () => {
        // No-op: state is now purely determined by VOC index
        console.log('Button pressed - state is auto-determined by VOC index');
    };
    
    return {
        state,
        isAlert: state === STATE_TYPES.ALERT,
        isDetecting: state === STATE_TYPES.DETECTING,
        toggleState,  // Keep this so the button doesn't break
    };
}