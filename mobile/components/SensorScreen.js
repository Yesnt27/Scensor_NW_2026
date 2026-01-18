import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { sensorScreenStyles } from '../styles/sensorScreenStyles';
import { LAYOUT_CONFIG } from '../config/layout';
import SensorCircle from './SensorCircle';
import CloudButton from './CloudButton';
import BottomGradient from './BottomGradient';

export default function SensorScreen() {
    const [sensorValue, setSensorValue] = useState(81);
    const [unit, setUnit] = useState('ppi');

    useEffect(() => {
        const sensorRef = ref(database, 'sensor/value');

        const unsubscribe = onValue(sensorRef, (snapshot) => {
            if (snapshot.exists()) {
                const value = snapshot.val();
                if (typeof value === 'number') {
                    setSensorValue(Math.round(value));
                } else if (value && typeof value === 'object' && value.value !== undefined) {
                    setSensorValue(Math.round(value.value));
                    if (value.unit) {
                        setUnit(value.unit);
                    }
                } else if (!isNaN(parseFloat(value))) {
                    setSensorValue(Math.round(parseFloat(value)));
                }
            }
        }, (error) => {
            console.error('Firebase error:', error);
        });

        return () => unsubscribe();
    }, []);

    const isAlert = sensorValue >= LAYOUT_CONFIG.circle.threshold;

    return (
        <View style={sensorScreenStyles.container}>
            <Text style={sensorScreenStyles.title}>Scensor</Text>

            <View style={sensorScreenStyles.sensorContainer}>
                <SensorCircle isAlert={isAlert} />
                <Text style={sensorScreenStyles.sensorValue}>
                    {sensorValue} {unit}
                </Text>
            </View>

            <BottomGradient />
            <CloudButton />
        </View>
    );
}
