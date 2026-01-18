import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../config/fonts';

export const trendsScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingTop: 70,
    },
    title: {
        fontFamily: FONT_FAMILY,
        fontSize: 52,
        color: '#FFFFFF',
        marginLeft: 20,
        marginBottom: 20,
    },
    currentVocContainer: {
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 15,
        backgroundColor: '#1a1a1a',
        marginHorizontal: 20,
        borderRadius: 15,
    },
    currentVocLabel: {
        fontFamily: FONT_FAMILY,
        fontSize: 16,
        color: '#888888',
        marginBottom: 8,
    },
    currentVocValue: {
        fontFamily: FONT_FAMILY,
        fontSize: 48,
        fontWeight: 'bold',
    },
    chartContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    highestText: {
        fontFamily: FONT_FAMILY,
        fontSize: 26,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 20,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
    },
    navIndicators: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        zIndex: 1,
    },
    navDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#333333',
    },
    navPill: {
        width: 30,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#333333',
    },
    loadingText: {
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
    errorText: {
        fontFamily: FONT_FAMILY,
        color: '#FF0000',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
});