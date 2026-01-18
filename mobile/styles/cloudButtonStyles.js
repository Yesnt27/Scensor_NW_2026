import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../config/fonts';

export const cloudButtonStyles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 75,
        height: 75,
        borderRadius: 100,
        backgroundColor: '#d9d9d9b3', 
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    iconText: {
        fontFamily: FONT_FAMILY,
        fontSize: 40,
        color: '#FFFFFF',
    },
});

