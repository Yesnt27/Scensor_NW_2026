import { StyleSheet } from 'react-native';

export const resetButtonStyles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 60,
        right: 20, // Position to the right of cloud button
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    icon: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: '#FFB84D', // Amber/warning color
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#8B4513', // Brown shadow for warning feel
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 2,
        borderColor: '#CC8A2E', // Darker amber border
    },
});