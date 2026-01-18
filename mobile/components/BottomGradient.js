/**
 * BottomGradient Component
 * Displays a gradient at the bottom of the screen that changes color based on state
 * 
 * Props:
 *   - state: String indicating current state ('normal', 'alert', 'detecting')
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LAYOUT_CONFIG } from '../config/layout';
import { STATE_TYPES } from '../hooks/useAlertState';

export default function BottomGradient({ state = STATE_TYPES.NORMAL }) {
    // Determine gradient color based on state
    let gradientColor;
    if (state === STATE_TYPES.ALERT) {
        gradientColor = LAYOUT_CONFIG.gradient.alertColor;
    } else if (state === STATE_TYPES.DETECTING) {
        gradientColor = LAYOUT_CONFIG.gradient.detectingColor;
    } else {
        gradientColor = LAYOUT_CONFIG.gradient.normalColor;
    }

    return (
        <LinearGradient
            colors={[
                '#00000000',
                '#00000040',
                `${gradientColor}80`,
                gradientColor
            ]}
            locations={[0, 0.3, 0.7, 1]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        />
    );
}

const styles = StyleSheet.create({
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: LAYOUT_CONFIG.gradient.height,
        borderTopLeftRadius: LAYOUT_CONFIG.gradient.borderRadius,
        borderTopRightRadius: LAYOUT_CONFIG.gradient.borderRadius,
        overflow: 'hidden',
    },
});
