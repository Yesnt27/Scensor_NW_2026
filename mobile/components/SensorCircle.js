/**
 * SensorCircle Component
 * Displays a two-toned circle that changes color based on alert state
 * 
 * Props:
 *   - isAlert: Boolean indicating if alert state is active (default: false)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LAYOUT_CONFIG } from '../config/layout';

export default function SensorCircle({ isAlert = false }) {
    const innerColor = isAlert
        ? LAYOUT_CONFIG.circle.alertColor
        : LAYOUT_CONFIG.circle.normalColor;

    const outerColor = isAlert
        ? LAYOUT_CONFIG.circle.outerColorAlert
        : LAYOUT_CONFIG.circle.outerColorNormal;

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
