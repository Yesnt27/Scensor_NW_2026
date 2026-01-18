import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Animated } from 'react-native';
import * as Font from 'expo-font';
import { fonts } from './config/fonts';
import SensorScreen from './components/SensorScreen';
import TrendsScreen from './components/TrendsScreen';
import { appStyles } from './styles/appStyles';
import { SensorProvider } from './contexts/SensorContext';

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [showTrends, setShowTrends] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync(fonts);
                setFontsLoaded(true);
            } catch (error) {
                console.error('Error loading fonts:', error);
                setFontsLoaded(true);
            }
        }
        loadFonts();
    }, []);

    const handleTransition = (showTrendsScreen) => {
        // Fade out
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            // Change screen
            setShowTrends(showTrendsScreen);
            // Fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        });
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SensorProvider>
            <View style={appStyles.container}>
                <StatusBar style="light" />
                <Animated.View style={[appStyles.screenContainer, { opacity: fadeAnim }]}>
                    {showTrends ? (
                        <TrendsScreen onBack={() => handleTransition(false)} />
                    ) : (
                        <SensorScreen onShowTrends={() => handleTransition(true)} />
                    )}
                </Animated.View>
            </View>
        </SensorProvider>
    );
}