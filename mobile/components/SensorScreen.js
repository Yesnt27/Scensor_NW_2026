/**
 * SensorScreen Component
 * Main screen displaying sensor data with real-time updates
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getSensorScreenStyles } from '../styles/sensorScreenStyles';
import { useSensorContext } from '../contexts/SensorContext';
import { useDimensions } from '../hooks';
import { STATE_TYPES } from '../hooks/useAlertState';
import { LAYOUT_CONFIG } from '../config/layout';
import SensorCircle from './SensorCircle';
import CloudButton from './CloudButton';
import BottomGradient from './BottomGradient';
import ParticleEffect from './ParticleEffect';

export default function SensorScreen({ onShowTrends }) {
    // Get responsive dimensions (updates on screen size change)
    const { isDesktop } = useDimensions();
    
    // Get responsive styles based on screen size
    const sensorScreenStyles = getSensorScreenStyles(isDesktop);
    
    // Use shared context instead of calling hooks directly
    const { vocIndex, rawValue, state, isLoading, error } = useSensorContext();
    const [useImages, setUseImages] = useState(false);
    
    // Track historical raw values (most recent first)
    const [rawValueHistory, setRawValueHistory] = useState([]);
    const previousRawValue = useRef(rawValue);
    const MAX_HISTORY = 4; // Number of historical values to display
    
    // Update history when rawValue changes
    useEffect(() => {
        // Only add to history if the value actually changed
        if (rawValue !== previousRawValue.current) {
            setRawValueHistory(prev => {
                // Add new value at the beginning (most recent first)
                const newHistory = [rawValue, ...prev];
                // Keep only the last MAX_HISTORY values
                return newHistory.slice(0, MAX_HISTORY);
            });
            previousRawValue.current = rawValue;
        }
    }, [rawValue]);
    
    // Show loading or error states if needed
    if (error) {
        console.warn('Sensor data error:', error);
    }

    const isDetecting = state === STATE_TYPES.DETECTING;
    const circleSize = isDetecting
        ? LAYOUT_CONFIG.circle.detectingSize
        : LAYOUT_CONFIG.circle.size;
    
    // Format raw value to 5 digits with "ppi" unit
    const formatRawValue = (value) => {
        return `${String(value).padStart(5, '0')} ppi`;
    };
    
    // Format VOC value
    const formatVOC = (value) => {
        return `${value} VOC`;
    };
    
    // Calculate opacity for each historical value (1.0 for most recent, decreasing for older)
    const getOpacity = (index) => {
        // Most recent (index 0) = 1.0, second = 0.8, third = 0.6, fourth = 0.4
        return 1.0 - (index * 0.2);
    };
    
    // Ensure we always have 4 values to display (fill with current value if history is short)
    const displayValues = [];
    for (let i = 0; i < MAX_HISTORY; i++) {
        if (i < rawValueHistory.length) {
            displayValues.push(rawValueHistory[i]);
        } else {
            // Fill with current rawValue if history is not yet populated
            displayValues.push(rawValue);
        }
    }
    
    return (
        <View style={sensorScreenStyles.container}>
            <TouchableOpacity onPress={() => setUseImages(!useImages)}>
                <Text style={sensorScreenStyles.title}>Scensor</Text>
            </TouchableOpacity>

            <View style={sensorScreenStyles.sensorContainer}>
                <View style={sensorScreenStyles.circleWrapper}>
                    <SensorCircle state={state} useImages={useImages} />
                    <ParticleEffect isActive={isDetecting} circleSize={circleSize} />
                </View>
            </View>
            
            {/* Bottom values display */}
            <View style={sensorScreenStyles.bottomValuesContainer}>
                {/* Left side: Raw values stacked with fading opacity */}
                <View style={sensorScreenStyles.leftValuesContainer}>
                    {displayValues.map((value, index) => (
                        <Text 
                            key={index}
                            style={[
                                sensorScreenStyles.rawValue,
                                { opacity: getOpacity(index) }
                            ]}
                        >
                            {formatRawValue(value)}
                        </Text>
                    ))}
                </View>
                
                {/* Right side: VOC value */}
                <View style={sensorScreenStyles.rightValueContainer}>
                    <Text style={sensorScreenStyles.vocValue}>{formatVOC(vocIndex)}</Text>
                </View>
            </View>

            <BottomGradient state={state} />
            <CloudButton onPress={onShowTrends} />
        </View>
    );
}
