/**
 * SensorCircle Component
 * Displays a two-toned circle that changes color based on state
 * 
 * Props:
 *   - state: String indicating current state ('normal', 'alert', 'detecting')
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LAYOUT_CONFIG } from '../config/layout';
import { STATE_TYPES } from '../hooks/useAlertState';

export default function SensorCircle({ state = STATE_TYPES.NORMAL }) {
    // Determine inner circle color based on state
    let innerColor;
    if (state === STATE_TYPES.ALERT) {
        innerColor = LAYOUT_CONFIG.circle.alertColor;
    } else if (state === STATE_TYPES.DETECTING) {
        innerColor = LAYOUT_CONFIG.circle.detectingColor;
    } else {
        innerColor = LAYOUT_CONFIG.circle.normalColor;
    }

    // Determine outer circle color based on state
    let outerColor;
    if (state === STATE_TYPES.ALERT) {
        outerColor = LAYOUT_CONFIG.circle.outerColorAlert;
    } else if (state === STATE_TYPES.DETECTING) {
        outerColor = LAYOUT_CONFIG.circle.outerColorDetecting;
    } else {
        outerColor = LAYOUT_CONFIG.circle.outerColorNormal;
    }

    return (
        <View style={[styles.outerCircle, { backgroundColor: outerColor }]}>
            <View style={[styles.innerCircle, { backgroundColor: innerColor }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    outerCircle: {
        width: LAYOUT_CONFIG.circle.size,
        height: LAYOUT_CONFIG.circle.size,
        borderRadius: LAYOUT_CONFIG.circle.size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    innerCircle: {
        width: LAYOUT_CONFIG.circle.innerSize,
        height: LAYOUT_CONFIG.circle.innerSize,
        borderRadius: LAYOUT_CONFIG.circle.innerSize / 2,
    },
});
