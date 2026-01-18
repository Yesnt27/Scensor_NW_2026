import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../config/fonts';
import { LAYOUT_CONFIG } from '../config/layout';

// Responsive spacing function
// Mobile: 40px (original spacing)
// Desktop: 120px (more spacing from edges)
const getHorizontalPadding = (isDesktop) => isDesktop ? 120 : 40;

// Base styles (mobile-first, keeps original code for mobile)
const baseStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingTop: 60,
        paddingBottom: 40,
    },
    sensorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    circleWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    leftValuesContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    rawValue: {
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '400',
        marginBottom: 8,
    },
    rawValueFaded: {
        color: '#B0B0B0',
    },
    rightValueContainer: {
        alignItems: 'flex-end',
    },
    vocValue: {
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '400',
    },
    detectingContainer: {
        position: 'absolute',
        bottom: 145, // Position below the circle
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    detectingText: {
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '400',
    },
});

// Function to get responsive styles based on screen size
export const getSensorScreenStyles = (isDesktop) => {
    const horizontalPadding = getHorizontalPadding(isDesktop);
    
    return {
        ...baseStyles,
        title: {
            fontFamily: FONT_FAMILY,
            color: '#FFFFFF',
            fontSize: LAYOUT_CONFIG.title.fontSize,
            fontWeight: '600',
            alignSelf: 'flex-start',
            marginLeft: horizontalPadding,
            marginTop: 20,
        },
        bottomValuesContainer: {
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingHorizontal: horizontalPadding,
        },
    };
};

// Export base styles for backward compatibility (defaults to mobile)
export const sensorScreenStyles = getSensorScreenStyles(false);

