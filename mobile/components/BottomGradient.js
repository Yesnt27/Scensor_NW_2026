/**
 * BottomGradient Component
 * Displays a gradient at the bottom of the screen that changes color based on alert state
 * 
 * Props:
 *   - isAlert: Boolean indicating if alert state is active (default: false)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LAYOUT_CONFIG } from '../config/layout';

export default function BottomGradient({ isAlert = false }) {
    const gradientColor = isAlert
        ? LAYOUT_CONFIG.gradient.alertColor
        : LAYOUT_CONFIG.gradient.normalColor;

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
