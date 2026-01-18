import { StyleSheet } from 'react-native';

export const cloudButtonStyles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    icon: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: '#B8C5BA',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0A2618', // Dark forest green shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 2,
        borderColor: '#1A3A2A', // Dark green border
    },
});