/**
 * CloudIcon Component
 * Custom SVG cloud/smoke icon for air quality monitoring
 * 
 * Props:
 *   - size: Icon size (default: 40)
 *   - color: Icon color (default: '#FFFFFF')
 */

import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

export default function CloudIcon({ size = 40, color = '#FFFFFF' }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            <G>
                {/* Background cloud (slightly transparent) */}
                <Path
                    d="M 70 45 
                       C 70 38, 65 32, 58 32
                       C 56 26, 50 22, 43 22
                       C 35 22, 28 28, 27 35
                       C 20 35, 15 40, 15 47
                       C 15 54, 20 59, 27 59
                       L 65 59
                       C 72 59, 78 53, 78 46
                       C 78 42, 76 38, 72 36
                       Z"
                    fill={color}
                    opacity={0.6}
                />
                
                {/* Foreground cloud (brighter) */}
                <Path
                    d="M 60 55
                       C 60 48, 55 42, 48 42
                       C 46 36, 40 32, 33 32
                       C 25 32, 18 38, 17 45
                       C 10 45, 5 50, 5 57
                       C 5 64, 10 69, 17 69
                       L 55 69
                       C 62 69, 68 63, 68 56
                       C 68 52, 66 48, 62 46
                       Z"
                    fill={color}
                    opacity={1}
                />
            </G>
        </Svg>
    );
}