/**
 * ResetIcon Component
 * Circular arrows SVG icon for reset/refresh action
 * 
 * Props:
 *   - size: Icon size (default: 40)
 *   - color: Icon color (default: '#FFFFFF')
 */

import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export default function ResetIcon({ size = 40, color = '#FFFFFF' }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            <G>
                {/* Top circular arrow (clockwise) */}
                <Path
                    d="M 50 20 A 20 20 0 1 1 28 35 L 32 31 M 28 35 L 24 39"
                    stroke={color}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                
                {/* Bottom circular arrow (clockwise, opposite side) */}
                <Path
                    d="M 50 80 A 20 20 0 1 1 72 65 L 68 69 M 72 65 L 76 61"
                    stroke={color}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </G>
        </Svg>
    );
}