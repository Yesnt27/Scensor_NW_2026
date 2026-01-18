/**
 * SensorCircle Component
 * Displays a two-toned circle that changes color and size based on state
 * Animates size transitions and synchronized pulsing
 * 
 * Props:
 *   - state: String indicating current state ('normal', 'alert', 'detecting')
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LAYOUT_CONFIG } from '../config/layout';
import { STATE_TYPES } from '../hooks/useAlertState';

export default function SensorCircle({ state = STATE_TYPES.NORMAL }) {
    const isDetecting = state === STATE_TYPES.DETECTING;
    const isAlert = state === STATE_TYPES.ALERT;

    // Animated values for sizes
    const outerSizeAnim = useRef(new Animated.Value(LAYOUT_CONFIG.circle.size)).current;
    const innerSizeAnim = useRef(new Animated.Value(LAYOUT_CONFIG.circle.innerSize)).current;

    // Shared pulsing animation for both circles during detecting
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Animate sizes with ease in/out
        Animated.parallel([
            Animated.timing(outerSizeAnim, {
                toValue: isDetecting
                    ? LAYOUT_CONFIG.circle.detectingSize
                    : LAYOUT_CONFIG.circle.size,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false,
            }),
            Animated.timing(innerSizeAnim, {
                toValue: isDetecting
                    ? LAYOUT_CONFIG.circle.detectingInnerSize
                    : LAYOUT_CONFIG.circle.innerSize,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false,
            }),
        ]).start();

        // Shared pulsing animation for both circles during detecting
        if (isDetecting) {
            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.15, // Scale up to 115%
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1, // Scale back to 100%
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                ])
            );
            pulseAnimation.start();

            return () => {
                pulseAnimation.stop();
                pulseAnim.setValue(1);
            };
        } else {
            pulseAnim.setValue(1);
        }
    }, [isDetecting, outerSizeAnim, innerSizeAnim, pulseAnim]);

    // Determine outer circle color based on state
    let outerColor;
    if (isAlert) {
        outerColor = LAYOUT_CONFIG.circle.outerColorAlert;
    } else if (isDetecting) {
        outerColor = LAYOUT_CONFIG.circle.outerColorDetecting;
    } else {
        outerColor = LAYOUT_CONFIG.circle.outerColorNormal;
    }

    // Determine inner circle color - stay white in detecting, don't animate back to green
    let innerColor;
    if (isAlert) {
        innerColor = LAYOUT_CONFIG.circle.alertColor;
    } else if (isDetecting) {
        innerColor = LAYOUT_CONFIG.circle.detectingColor; // White, no green transition
    } else {
        innerColor = LAYOUT_CONFIG.circle.normalColor;
    }

    // Calculate animated sizes with shared pulse effect
    const animatedOuterSize = isDetecting
        ? Animated.multiply(outerSizeAnim, pulseAnim)
        : outerSizeAnim;

    const animatedInnerSize = isDetecting
        ? Animated.multiply(innerSizeAnim, pulseAnim)
        : innerSizeAnim;

    return (
        <Animated.View style={[
            styles.outerCircle,
            {
                backgroundColor: outerColor,
                width: animatedOuterSize,
                height: animatedOuterSize,
                borderRadius: Animated.divide(animatedOuterSize, 2),
            }
        ]}>
            <Animated.View style={[
                styles.innerCircle,
                {
                    backgroundColor: innerColor,
                    width: animatedInnerSize,
                    height: animatedInnerSize,
                    borderRadius: Animated.divide(animatedInnerSize, 2),
                }
            ]} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    outerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    innerCircle: {
        // Size, borderRadius, and backgroundColor are set dynamically
    },
});
