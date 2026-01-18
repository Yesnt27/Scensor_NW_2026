/**
 * SensorCircle Component
 * Displays a breathing circle with glow effects
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LAYOUT_CONFIG } from '../config/layout';
import { STATE_TYPES } from '../hooks/useAlertState';

export default function SensorCircle({ state = STATE_TYPES.NORMAL }) {
    const isDetecting = state === STATE_TYPES.DETECTING;
    const isAlert = state === STATE_TYPES.ALERT;

    // Animated values
    const breatheAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(20)).current;
    const glowOpacityAnim = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        // Continuous breathing animation (5 second cycle - slower)
        const breathAnimation = Animated.loop(
            Animated.sequence([
                // Inhale - expand
                Animated.parallel([
                    Animated.timing(breatheAnim, {
                        toValue: 1.15, // Increased from 1.05 to 1.15 (115% scale)
                        duration: 2500,
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 50, // Increased from 35 to 50
                        duration: 2500,
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowOpacityAnim, {
                        toValue: 0.9, // Increased from 0.8 to 0.9
                        duration: 2500,
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: false,
                    }),
                ]),
                // Exhale - contract
                Animated.parallel([
                    Animated.timing(breatheAnim, {
                        toValue: 1,
                        duration: 2500,
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 20,
                        duration: 2500,
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowOpacityAnim, {
                        toValue: 0.6,
                        duration: 2500,
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: false,
                    }),
                ]),
            ])
        );

        breathAnimation.start();

        return () => {
            breathAnimation.stop();
        };
    }, [breatheAnim, glowAnim, glowOpacityAnim]);

    // Determine colors based on state
    let outerColor, innerColor, glowColor;
    
    if (isAlert) {
        outerColor = '#CC0000';
        innerColor = '#FF0000';
        glowColor = '#FF0000';
    } else if (isDetecting) {
        outerColor = '#b7b7b7';
        innerColor = '#FFFFFF';
        glowColor = '#FFFFFF';
    } else {
        outerColor = '#00CC66';
        innerColor = '#00FF88';
        glowColor = '#00FF88';
    }

    return (
        <View style={styles.container}>
            {/* Outer glow */}
            <Animated.View
                style={[
                    styles.glow,
                    {
                        width: LAYOUT_CONFIG.circle.size + 80,
                        height: LAYOUT_CONFIG.circle.size + 80,
                        borderRadius: (LAYOUT_CONFIG.circle.size + 80) / 2,
                        backgroundColor: glowColor,
                        opacity: glowOpacityAnim,
                        shadowColor: glowColor,
                        shadowRadius: glowAnim,
                        shadowOpacity: 1,
                        transform: [{ scale: breatheAnim }],
                    },
                ]}
            />

            {/* Main breathing circle */}
            <Animated.View
                style={[
                    styles.outerCircle,
                    {
                        backgroundColor: outerColor,
                        width: LAYOUT_CONFIG.circle.size,
                        height: LAYOUT_CONFIG.circle.size,
                        borderRadius: LAYOUT_CONFIG.circle.size / 2,
                        transform: [{ scale: breatheAnim }],
                    },
                ]}
            >
                <View
                    style={[
                        styles.innerCircle,
                        {
                            backgroundColor: innerColor,
                            width: LAYOUT_CONFIG.circle.innerSize,
                            height: LAYOUT_CONFIG.circle.innerSize,
                            borderRadius: LAYOUT_CONFIG.circle.innerSize / 2,
                        },
                    ]}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    glow: {
        position: 'absolute',
        elevation: 0,
        shadowOffset: { width: 0, height: 0 },
    },
    outerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    innerCircle: {},
});