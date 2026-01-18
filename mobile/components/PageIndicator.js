/**
 * PageIndicator Component
 * Apple-style page indicator with elongated bar for current page
 * 
 * Props:
 *   - currentPage: Current page index (0 or 1)
 *   - totalPages: Total number of pages
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function PageIndicator({ currentPage, totalPages = 2 }) {
    // Create animated values for each indicator
    const animatedWidths = useRef(
        [...Array(totalPages)].map(() => new Animated.Value(8))
    ).current;

    useEffect(() => {
        // Animate all indicators
        animatedWidths.forEach((width, index) => {
            Animated.timing(width, {
                toValue: currentPage === index ? 32 : 8,
                duration: 300,
                useNativeDriver: false, // Width animations require native driver to be false
            }).start();
        });
    }, [currentPage]);

    return (
        <View style={styles.container}>
            {[...Array(totalPages)].map((_, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.indicator,
                        {
                            width: animatedWidths[index],
                            opacity: currentPage === index ? 0.9 : 0.4,
                        }
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    indicator: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#000000', // Black for contrast with white gradient
    },
});
