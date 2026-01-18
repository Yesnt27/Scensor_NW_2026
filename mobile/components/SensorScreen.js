import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, Platform, Animated } from 'react-native';
import { getSensorScreenStyles } from '../styles/sensorScreenStyles';
import { useSensorContext } from '../contexts/SensorContext';
import { STATE_TYPES } from '../hooks/useAlertState';
import { LAYOUT_CONFIG } from '../config/layout';
import SensorCircle from './SensorCircle';
import BottomGradient from './BottomGradient';
import ParticleEffect from './ParticleEffect';
import ResetButton from './ResetButton';
import firebaseResetService from '../services/firebaseResetService';

export default function SensorScreen({ onShowTrends }) {
    // Get responsive dimensions (updates on screen size change)
    const { isDesktop } = useDimensions();
    
    // Get responsive styles based on screen size
    const sensorScreenStyles = getSensorScreenStyles(isDesktop);
    
    const { vocIndex, rawValue, state, isLoading, error } = useSensorContext(); 

    const [rawValueHistory, setRawValueHistory] = useState([]);
    const previousRawValue = useRef(rawValue);
    const MAX_HISTORY = 4;

    // ✅ Alert banner animation
    const alertOpacity = useRef(new Animated.Value(0)).current;
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (rawValue !== previousRawValue.current) {
            setRawValueHistory(prev => {
                const newHistory = [rawValue, ...prev];
                return newHistory.slice(0, MAX_HISTORY);
            });
            previousRawValue.current = rawValue;
        }
    }, [rawValue]);

    // ✅ Show/hide alert banner when VOC exceeds threshold
    useEffect(() => {
        if (vocIndex !== null && vocIndex > 250) {
            setShowAlert(true);
            Animated.timing(alertOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(alertOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setShowAlert(false));
        }
    }, [vocIndex]);

    const handleReset = () => {
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(
                "Are you sure you want to clear all sensor data? This action cannot be undone."
            );

            if (confirmed) {
                (async () => {
                    try {
                        console.log('🔄 Resetting database...');
                        await firebaseResetService.resetSensorData();
                        window.alert("Success! All sensor data has been cleared.");
                        setRawValueHistory([]);
                    } catch (error) {
                        console.error('❌ Reset error:', error);
                        window.alert(`Failed to reset database: ${error.message}`);
                    }
                })();
            }
        } else {
            Alert.alert(
                "Reset Database",
                "Are you sure you want to clear all sensor data? This action cannot be undone.",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Reset",
                        onPress: async () => {
                            try {
                                console.log('🔄 Resetting database...');
                                await firebaseResetService.resetSensorData();
                                Alert.alert(
                                    "Success",
                                    "All sensor data has been cleared.",
                                    [{ text: "OK" }]
                                );
                                setRawValueHistory([]);
                            } catch (error) {
                                console.error('❌ Reset error:', error);
                                Alert.alert(
                                    "Error",
                                    `Failed to reset database: ${error.message}`,
                                    [{ text: "OK" }]
                                );
                            }
                        },
                        style: "destructive"
                    }
                ]
            );
        }
    };

    if (error) {
        console.warn('Sensor data error:', error);
    }

    const isDetecting = state === STATE_TYPES.DETECTING;
    const circleSize = isDetecting
        ? LAYOUT_CONFIG.circle.detectingSize
        : LAYOUT_CONFIG.circle.size;

    const formatRawValue = (value) => {
        return `${String(value).padStart(5, '0')} ppi`;
    };

    const formatVOC = (value) => {
        return `${value} VOC`;
    };

    const getOpacity = (index) => {
        return 1.0 - (index * 0.2);
    };

    const displayValues = [];
    for (let i = 0; i < MAX_HISTORY; i++) {
        if (i < rawValueHistory.length) {
            displayValues.push(rawValueHistory[i]);
        } else {
            displayValues.push(rawValue);
        }
    }

    const particleColor = state === STATE_TYPES.ALERT
        ? '#FF0000'
        : state === STATE_TYPES.DETECTING
            ? '#FFFFFF'
            : '#00FF88';

    return (
        <View style={sensorScreenStyles.container}>
            <BottomGradient state={state} />

            {/* ✅ Alert Banner */}
            {showAlert && (
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 60,
                        left: 20,
                        right: 20,
                        backgroundColor: '#FF0000',
                        paddingHorizontal: 20,
                        paddingVertical: 15,
                        borderRadius: 12,
                        zIndex: 100,
                        opacity: alertOpacity,
                        shadowColor: '#FF0000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.5,
                        shadowRadius: 10,
                        elevation: 10,
                    }}
                >
                    <Text style={{
                        color: '#FFFFFF',
                        fontSize: 18,
                        fontFamily: FONT_FAMILY,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>
                        🚨 AIR QUALITY ALERT
                    </Text>
                    <Text style={{
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontFamily: FONT_FAMILY,
                        textAlign: 'center',
                        marginTop: 5,
                    }}>
                        VOC Index: {vocIndex} - Exceeds safe threshold (250)
                    </Text>
                </Animated.View>
            )}

            <Text style={sensorScreenStyles.title} className="text-white">Scensor</Text>

            <View style={sensorScreenStyles.sensorContainer}>
                <View style={sensorScreenStyles.circleWrapper}>
                    <SensorCircle state={state} />
                    <ParticleEffect
                        isActive={true}
                        circleSize={circleSize}
                        color={particleColor}
                    />
                </View>
            </View>

            {isDetecting ? (
                <View style={sensorScreenStyles.detectingContainer}>
                    <Text style={sensorScreenStyles.detectingText}>Detecting...</Text>
                </View>
            ) : (
                <View style={sensorScreenStyles.bottomValuesContainer}>
                    <View style={sensorScreenStyles.leftValuesContainer}>
                        {displayValues.map((value, index) => (
                            <Text
                                key={index}
                                style={[
                                    sensorScreenStyles.rawValue,
                                    index > 0 && sensorScreenStyles.rawValueFaded,
                                    { opacity: getOpacity(index) }
                                ]}
                            >
                                {formatRawValue(value)}
                            </Text>
                        ))}
                    </View>

                    <View style={sensorScreenStyles.rightValueContainer}>
                        <Text style={sensorScreenStyles.vocValue}>{formatVOC(vocIndex)}</Text>
                    </View>
                </View>
            )}

            <ResetButton onPress={handleReset} />
        </View>
    );
}