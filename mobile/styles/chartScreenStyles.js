import { StyleSheet, Dimensions } from 'react-native';
import { FONT_FAMILY } from '../config/fonts';

const { height } = Dimensions.get('window');

export const chartScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 0,
        overflow: 'hidden', // Ensure gradient can extend to edges
    },
    title: {
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 30,
        alignSelf: 'flex-start',
        marginLeft: 0,
    },
    chartContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        paddingBottom: 20,
    },
    chartWrapperContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#000000',
    },
    chartPlaceholder: {
        width: '100%',
        height: height * 0.6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartPlaceholderText: {
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontSize: 16,
    },
    highestLevelContainer: {
        marginTop: 15,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    highestLevelText: {
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 250,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        zIndex: 1,
    },
});

