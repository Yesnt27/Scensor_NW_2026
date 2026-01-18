import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../config/fonts';
import { LAYOUT_CONFIG } from '../config/layout';

export const sensorScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingBottom: 40,
    },
    title: {
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontSize: LAYOUT_CONFIG.title.fontSize,
        fontWeight: '600',
        marginBottom: 40,
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    sensorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    sensorValue: {
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontSize: LAYOUT_CONFIG.sensorValue.fontSize,
        fontWeight: '500',
        marginTop: LAYOUT_CONFIG.sensorValue.marginTop,
    },
});

