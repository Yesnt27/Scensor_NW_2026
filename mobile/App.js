import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { fonts } from './config/fonts';
import SensorScreen from './components/SensorScreen';

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync(fonts);
                setFontsLoaded(true);
            } catch (error) {
                console.error('Error loading fonts:', error);
                setFontsLoaded(true); // Continue even if font loading fails
            }
        }
        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return null; // Or a loading screen
    }

    return (
        <>
            <StatusBar style="light" />
            <SensorScreen />
        </>
    );
}
