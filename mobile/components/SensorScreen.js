/**
 * SensorScreen Component
 * Main screen displaying sensor data with real-time updates
 */

import React from 'react';
import { View, Text } from 'react-native';
import { sensorScreenStyles } from '../styles/sensorScreenStyles';
import { useSensorContext } from '../contexts/SensorContext';
import { STATE_TYPES } from '../hooks/useAlertState';
import { LAYOUT_CONFIG } from '../config/layout';
import SensorCircle from './SensorCircle';
import CloudButton from './CloudButton';
import BottomGradient from './BottomGradient';
import ParticleEffect from './ParticleEffect';

export default function SensorScreen({ onShowTrends }) {
    // Use shared context instead of calling hooks directly
    const { vocIndex, rawValue, state, isLoading, error } = useSensorContext();
    
    // Show loading or error states if needed
    if (error) {
        console.warn('Sensor data error:', error);
    }
    
    // Display text based on state
    // If vocIndex or rawValue is null, state will be DETECTING
    const displayText = state === STATE_TYPES.DETECTING
        ? 'Detecting...'
        : `VOC: ${vocIndex} | Raw: ${rawValue}`;
    
    const isDetecting = state === STATE_TYPES.DETECTING;
    const circleSize = isDetecting
        ? LAYOUT_CONFIG.circle.detectingSize
        : LAYOUT_CONFIG.circle.size;
    
    return (
        <View style={sensorScreenStyles.container}>
            <Text style={sensorScreenStyles.title}>Scensor</Text>
            
            <View style={sensorScreenStyles.sensorContainer}>
                <View style={sensorScreenStyles.circleWrapper}>
                    <SensorCircle state={state} />
                    <ParticleEffect isActive={isDetecting} circleSize={circleSize} />
                </View>
                <Text style={sensorScreenStyles.sensorValue}>
                    {displayText}
                </Text>
            </View>
            
            <BottomGradient state={state} />
            <CloudButton onPress={onShowTrends} />
        </View>
    );
}