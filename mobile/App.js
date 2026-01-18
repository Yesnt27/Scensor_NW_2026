import './global.css';
import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Animated, Dimensions } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { fonts } from './config/fonts';
import SensorScreen from './components/SensorScreen';
import TrendsScreen from './components/TrendsScreen';
import { appStyles } from './styles/appStyles';
import { SensorProvider } from './contexts/SensorContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = SensorScreen, 1 = TrendsScreen
    const translateX = useRef(new Animated.Value(0)).current;

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

    const navigateToScreen = (screenIndex) => {
        setCurrentScreen(screenIndex);
        Animated.spring(translateX, {
            toValue: -screenIndex * SCREEN_WIDTH,
            useNativeDriver: true,
            friction: 8,
            tension: 50,
        }).start();
    };

    // Swipe gesture
    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            const newTranslateX = -currentScreen * SCREEN_WIDTH + event.translationX;
            // Limit panning to valid range
            if (newTranslateX <= 0 && newTranslateX >= -SCREEN_WIDTH) {
                translateX.setValue(newTranslateX);
            }
        })
        .onEnd((event) => {
            const velocity = event.velocityX;
            const translation = event.translationX;

            // Determine if swipe was significant enough
            if (Math.abs(velocity) > 500 || Math.abs(translation) > SCREEN_WIDTH * 0.3) {
                if (velocity < 0 || translation < -SCREEN_WIDTH * 0.3) {
                    // Swipe left → Go to TrendsScreen
                    navigateToScreen(1);
                } else {
                    // Swipe right → Go to SensorScreen
                    navigateToScreen(0);
                }
            } else {
                // Snap back to current screen
                navigateToScreen(currentScreen);
            }
        });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SensorProvider>
                <View style={appStyles.container}>
                    <StatusBar style="light" />

                    <GestureDetector gesture={gesture}>
                        <Animated.View
                            style={[
                                appStyles.screenContainer,
                                {
                                    flexDirection: 'row',
                                    width: SCREEN_WIDTH * 2,
                                    transform: [{ translateX }],
                                },
                            ]}
                        >
                            {/* Sensor Screen */}
                            <View style={{ width: SCREEN_WIDTH }}>
                                <SensorScreen onShowTrends={() => navigateToScreen(1)} />
                            </View>

                            {/* Trends Screen */}
                            <View style={{ width: SCREEN_WIDTH }}>
                                <TrendsScreen onBack={() => navigateToScreen(0)} />
                            </View>
                        </Animated.View>
                    </GestureDetector>
                </View>
            </SensorProvider>
        </GestureHandlerRootView>
    );
}