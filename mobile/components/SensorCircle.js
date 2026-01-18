import React from 'react';
import { View } from 'react-native';
import { sensorCircleStyles } from '../styles/sensorCircleStyles';

export default function SensorCircle() {
    return (
        <View style={sensorCircleStyles.outerCircle}>
            <View style={sensorCircleStyles.innerCircle} />
        </View>
    );
}

