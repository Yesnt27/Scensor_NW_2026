import { StyleSheet } from 'react-native';
import { LAYOUT_CONFIG } from '../config/layout';

export const sensorCircleStyles = StyleSheet.create({
    outerCircle: {
        width: LAYOUT_CONFIG.circle.size,
        height: LAYOUT_CONFIG.circle.size,
        borderRadius: LAYOUT_CONFIG.circle.size / 2,
        backgroundColor: '#00C25F',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    innerCircle: {
        width: LAYOUT_CONFIG.circle.innerSize,
        height: LAYOUT_CONFIG.circle.innerSize,
        borderRadius: LAYOUT_CONFIG.circle.innerSize / 2,
        backgroundColor: '#00DF82',
    },
});
