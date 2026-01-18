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
import { useSensorData, useAlertState } from '../hooks';
import SensorCircle from './SensorCircle';
import CloudButton from './CloudButton';
import BottomGradient from './BottomGradient';

export default function SensorScreen() {
    // Fetch sensor data from Firebase
    const { sensorValue, unit, isLoading, error } = useSensorData();

    // Manage alert state based on sensor value and button press
    const { isAlert, toggleAlert } = useAlertState(sensorValue);

    // Show loading or error states if needed
    if (error) {
        console.warn('Sensor data error:', error);
    }

    return (
        <View style={sensorScreenStyles.container}>
            <Text style={sensorScreenStyles.title}>Scensor</Text>

            <View style={sensorScreenStyles.sensorContainer}>
                <SensorCircle isAlert={isAlert} />
                <Text style={sensorScreenStyles.sensorValue}>
                    {sensorValue} {unit}
                </Text>
            </View>

            <BottomGradient isAlert={isAlert} />
            <CloudButton onPress={toggleAlert} />
        </View>
    );
}
