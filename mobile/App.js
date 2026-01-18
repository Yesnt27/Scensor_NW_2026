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
import ErrorBoundary from './components/ErrorBoundary';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(0);
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
        try {
            setCurrentScreen(screenIndex);
            Animated.spring(translateX, {
                toValue: -screenIndex * SCREEN_WIDTH,
                useNativeDriver: true,
                friction: 8,
                tension: 50,
            }).start();
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    // Swipe gesture with better error handling
    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            try {
                const newTranslateX = -currentScreen * SCREEN_WIDTH + event.translationX;
                // Limit panning to valid range
                if (newTranslateX <= 0 && newTranslateX >= -SCREEN_WIDTH) {
                    translateX.setValue(newTranslateX);
                }
            } catch (error) {
                console.error('Gesture update error:', error);
            }
        })
        .onEnd((event) => {
            try {
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
            } catch (error) {
                console.error('Gesture end error:', error);
                // Fallback to current screen on error
                navigateToScreen(currentScreen);
            }
        })
        .runOnJS(true); 

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ErrorBoundary>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SensorProvider>
                    <View style={appStyles.container}>
                        <StatusBar style="light" />
                        
                        <GestureDetector gesture={gesture}>
                            <Animated.View
                                style={[
                                    {
                                        flex: 1,
                                        flexDirection: 'row',
                                        width: SCREEN_WIDTH * 2,
                                    },
                                    {
                                        transform: [{ translateX }],
                                    },
                                ]}
                            >
                                {/* Sensor Screen */}
                                <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
                                    <SensorScreen onShowTrends={() => navigateToScreen(1)} />
                                </View>

                                {/* Trends Screen */}
                                <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
                                    <TrendsScreen onBack={() => navigateToScreen(0)} />
                                </View>
                            </Animated.View>
                        </GestureDetector>
                    </View>
                </SensorProvider>
            </GestureHandlerRootView>
        </ErrorBoundary>
    );
}