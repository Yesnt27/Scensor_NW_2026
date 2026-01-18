/**
 * Custom Hook: useDimensions
 * Provides responsive screen dimensions that update when screen size changes
 * 
 * Usage:
 *   const { width, height, isDesktop } = useDimensions();
 */

import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const DESKTOP_BREAKPOINT = 768; // Consider > 768px as desktop/tablet

export function useDimensions() {
    const [dimensions, setDimensions] = useState(() => {
        const { width, height } = Dimensions.get('window');
        return {
            width,
            height,
            isDesktop: width > DESKTOP_BREAKPOINT,
        };
    });

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions({
                width: window.width,
                height: window.height,
                isDesktop: window.width > DESKTOP_BREAKPOINT,
            });
        });

        return () => subscription?.remove();
    }, []);

    return dimensions;
}
