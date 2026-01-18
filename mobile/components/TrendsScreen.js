import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import { useSensorContext } from '../contexts/SensorContext';
import { useSensorHistory } from '../hooks/useSensorHistory';
import { STATE_TYPES } from '../hooks/useAlertState';
import { FONT_FAMILY } from '../config/fonts';
import { LAYOUT_CONFIG } from '../config/layout';
import { LinearGradient } from 'expo-linear-gradient';
import CloudButton from './CloudButton';
import { trendsScreenStyles } from '../styles/trendsScreenStyles';

const screenWidth = Dimensions.get('window').width;

export default function TrendsScreen({ onBack }) {
    // Use shared context for current VOC and state
    const { vocIndex, state } = useSensorContext();
    const { vocHistory, timestamps, highestVoc, isLoading, error } = useSensorHistory(50);

    if (isLoading) return <Text style={trendsScreenStyles.loadingText}>Loading...</Text>;
    if (error) return <Text style={trendsScreenStyles.errorText}>Error: {error}</Text>;

    // Chart dimensions
    const chartWidth = screenWidth * 0.9;
    const chartHeight = 300;
    const padding = 40;
    const innerWidth = chartWidth - padding * 2;
    const innerHeight = chartHeight - padding * 2;

    const maxValue = Math.max(...vocHistory, 300);
    const minValue = 0;
    const range = maxValue - minValue;

    const createSmoothPath = () => {
        if (vocHistory.length < 2) return '';

        const points = vocHistory.map((value, index) => {
            const x = padding + (index / (vocHistory.length - 1)) * innerWidth;
            const y = padding + innerHeight - ((value - minValue) / range) * innerHeight;
            return { x, y };
        });

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            
            const controlX1 = current.x + (next.x - current.x) / 3;
            const controlY1 = current.y;
            const controlX2 = current.x + 2 * (next.x - current.x) / 3;
            const controlY2 = next.y;

            path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
        }

        return path;
    };

    const toleranceY = padding + innerHeight - ((250 - minValue) / range) * innerHeight;

    let gradientColor;
    if (state === STATE_TYPES.ALERT) {
        gradientColor = LAYOUT_CONFIG.gradient.alertColor;
    } else if (state === STATE_TYPES.DETECTING) {
        gradientColor = LAYOUT_CONFIG.gradient.detectingColor;
    } else {
        gradientColor = LAYOUT_CONFIG.gradient.normalColor;
    }

    const currentVocColor = (vocIndex !== null && vocIndex > 250) ? '#FF0000' : '#00DF82';

    return (
        <View style={trendsScreenStyles.container}>
            <Text style={trendsScreenStyles.title}>Trends</Text>

            {/* Current VOC Level Display */}
            <View style={trendsScreenStyles.currentVocContainer}>
                <Text style={trendsScreenStyles.currentVocLabel}>Current VOC Level</Text>
                <Text style={[trendsScreenStyles.currentVocValue, { color: currentVocColor }]}>
                    {vocIndex !== null ? vocIndex : '---'}
                </Text>
            </View>

            {/* Chart */}
            <View style={trendsScreenStyles.chartContainer}>
                <Svg width={chartWidth} height={chartHeight}>
                    <Line
                        x1={padding}
                        y1={padding}
                        x2={padding}
                        y2={chartHeight - padding}
                        stroke="#FFFFFF"
                        strokeWidth="1"
                    />
                    
                    <Line
                        x1={padding}
                        y1={chartHeight - padding}
                        x2={chartWidth - padding}
                        y2={chartHeight - padding}
                        stroke="#FFFFFF"
                        strokeWidth="1"
                    />

                    <Line
                        x1={padding}
                        y1={toleranceY}
                        x2={chartWidth - padding}
                        y2={toleranceY}
                        stroke="#FF0000"
                        strokeWidth="2"
                    />
                    
                    <SvgText
                        x={chartWidth - padding - 10}
                        y={toleranceY - 10}
                        fill="#FF0000"
                        fontSize="12"
                        fontFamily={FONT_FAMILY}
                        textAnchor="end"
                    >
                        Tolerance
                    </SvgText>

                    <Path
                        d={createSmoothPath()}
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <SvgText
                        x={15}
                        y={chartHeight / 2}
                        fill="#FFFFFF"
                        fontSize="14"
                        fontFamily={FONT_FAMILY}
                        textAnchor="middle"
                        transform={`rotate(-90, 15, ${chartHeight / 2})`}
                    >
                        VOC index
                    </SvgText>

                    <SvgText
                        x={chartWidth / 2}
                        y={chartHeight - 10}
                        fill="#FFFFFF"
                        fontSize="14"
                        fontFamily={FONT_FAMILY}
                        textAnchor="middle"
                    >
                        Time
                    </SvgText>
                </Svg>
            </View>

            {/* Highest level text */}
            <Text style={trendsScreenStyles.highestText}>Highest level: {highestVoc}</Text>

            {/* Bottom gradient */}
            <LinearGradient
                colors={['#000000', gradientColor]}
                locations={[0, 1]}
                style={trendsScreenStyles.bottomGradient}
            />

            {/* Cloud Button */}
            <CloudButton onPress={onBack} />
        </View>
    );
}