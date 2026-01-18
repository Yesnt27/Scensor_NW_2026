/**
 * SensorScreen Component
 * Main screen displaying sensor data with real-time updates
 * 
 * Responsibilities:
 * - Display sensor value and unit
 * - Show alert state (red/green)
 * - Handle button interactions
 */

import React from 'react';
import { View, Text } from 'react-native';
import { sensorScreenStyles } from '../styles/sensorScreenStyles';
import { useSensorData, useAlertState, STATE_TYPES } from '../hooks';
import SensorCircle from './SensorCircle';
import CloudButton from './CloudButton';
import BottomGradient from './BottomGradient';

export default function SensorScreen() {
    // Fetch sensor data from Firebase
    const { sensorValue, unit, isLoading, error } = useSensorData();

    // Manage state based on sensor value and button press
    // Cycles through: normal → alert → detecting → normal
    const { state, toggleState } = useAlertState(sensorValue);

    // Show loading or error states if needed
    if (error) {
        console.warn('Sensor data error:', error);
    }

    // Display text based on state
    const displayText = state === STATE_TYPES.DETECTING
        ? 'detecting...'
        : `${sensorValue} ${unit}`;

    return (
        <View style={sensorScreenStyles.container}>
            <Text style={sensorScreenStyles.title}>Scensor</Text>

            <View style={sensorScreenStyles.sensorContainer}>
                <SensorCircle state={state} />
                <Text style={sensorScreenStyles.sensorValue}>
                    {displayText}
                </Text>
            </View>

            <BottomGradient state={state} />
            <CloudButton onPress={toggleState} />
        </View>
    );
}
