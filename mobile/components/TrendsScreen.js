import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import { useSensorContext } from '../contexts/SensorContext';
import { useSensorHistory } from '../hooks/useSensorHistory';
import { STATE_TYPES } from '../hooks/useAlertState';
import { FONT_FAMILY } from '../config/fonts';
import { LAYOUT_CONFIG } from '../config/layout';
import { LinearGradient } from 'expo-linear-gradient';
import { trendsScreenStyles } from '../styles/trendsScreenStyles';

export default function TrendsScreen({ onBack }) {
    const { vocIndex, state } = useSensorContext();
    const { vocHistory, timestamps, highestVoc, isLoading, error } = useSensorHistory(50);
    
    // Track dimensions with state and listen for changes
    const [dimensions, setDimensions] = useState({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    });
    
    // Listen for dimension changes (screen resize, rotation)
    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions({
                width: window.width,
                height: window.height,
            });
        });
        
        return () => subscription?.remove();
    }, []);
    
    if (isLoading) return <Text style={trendsScreenStyles.loadingText}>Loading...</Text>;
    if (error) return <Text style={trendsScreenStyles.errorText}>Error: {error}</Text>;
    
    // Use state dimensions
    const chartWidth = dimensions.width * 0.9;
    const chartHeight = Math.min(dimensions.height * 0.35, 350);
    
    const padding = 40;
    const innerWidth = chartWidth - padding * 2;
    const innerHeight = chartHeight - padding * 2;
    const maxValue = Math.max(...vocHistory, 300);
    const minValue = 0;
    const range = maxValue - minValue;
    
    // Calculate average change per minute
    const calculateAvgChangePerMinute = () => {
        if (vocHistory.length < 2 || timestamps.length < 2) return null;
        
        const firstVoc = vocHistory[0];
        const lastVoc = vocHistory[vocHistory.length - 1];
        const firstTime = timestamps[0];
        const lastTime = timestamps[timestamps.length - 1];
        
        const vocChange = lastVoc - firstVoc;
        const timeChangeMs = lastTime - firstTime;
        const timeChangeMinutes = timeChangeMs / (1000 * 60);
        
        if (timeChangeMinutes === 0) return null;
        
        const changePerMinute = vocChange / timeChangeMinutes;
        return changePerMinute.toFixed(2);
    };
    
    const avgChangePerMin = calculateAvgChangePerMinute();
    
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    };
    
    const getDisplayTimestamps = () => {
        if (timestamps.length === 0) return [];
        
        const firstTime = formatTimestamp(timestamps[0]);
        const lastTime = formatTimestamp(timestamps[timestamps.length - 1]);
        
        if (timestamps.length >= 3) {
            const midIndex = Math.floor(timestamps.length / 2);
            const midTime = formatTimestamp(timestamps[midIndex]);
            return [
                { time: firstTime, x: padding },
                { time: midTime, x: chartWidth / 2 },
                { time: lastTime, x: chartWidth - padding }
            ];
        } else if (timestamps.length === 2) {
            return [
                { time: firstTime, x: padding },
                { time: lastTime, x: chartWidth - padding }
            ];
        } else {
            return [{ time: firstTime, x: chartWidth / 2 }];
        }
    };
    
    const displayTimes = getDisplayTimestamps();
    
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
    
    const getChangeColor = (change) => {
        if (change === null) return '#888888';
        const changeNum = parseFloat(change);
        if (changeNum > 1) return '#FF0000';
        if (changeNum < -1) return '#00DF82';
        return '#888888';
    };
    
    const changeColor = getChangeColor(avgChangePerMin);
    
    return (
        <View style={trendsScreenStyles.container}>
            <Text style={trendsScreenStyles.title}>Trends</Text>
            
            {/* Stats Row */}
            <View style={trendsScreenStyles.statsRow}>
                <View style={trendsScreenStyles.statBox}>
                    <Text style={trendsScreenStyles.statLabel}>Current VOC</Text>
                    <Text style={[trendsScreenStyles.statValue, { color: currentVocColor }]}>
                        {vocIndex !== null ? vocIndex : '---'}
                    </Text>
                </View>
                
                <View style={trendsScreenStyles.statBox}>
                    <Text style={trendsScreenStyles.statLabel}>Avg Change/Min</Text>
                    <Text style={[trendsScreenStyles.statValue, { color: changeColor }]}>
                        {avgChangePerMin !== null ? (
                            <>
                                {parseFloat(avgChangePerMin) > 0 ? '+' : ''}
                                {avgChangePerMin}
                            </>
                        ) : '---'}
                    </Text>
                </View>
            </View>
            
            {/* Chart */}
            <View style={trendsScreenStyles.chartContainer}>
                <Svg width={chartWidth} height={chartHeight}>
                    {/* Y-axis */}
                    <Line
                        x1={padding}
                        y1={padding}
                        x2={padding}
                        y2={chartHeight - padding}
                        stroke="#FFFFFF"
                        strokeWidth="1"
                    />
                    
                    {/* X-axis */}
                    <Line
                        x1={padding}
                        y1={chartHeight - padding}
                        x2={chartWidth - padding}
                        y2={chartHeight - padding}
                        stroke="#FFFFFF"
                        strokeWidth="1"
                    />
                    
                    {/* Tolerance line (250 VOC threshold) */}
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
                        Tolerance (250)
                    </SvgText>
                    
                    {/* VOC data line */}
                    <Path
                        d={createSmoothPath()}
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Y-axis label */}
                    <SvgText
                        x={15}
                        y={chartHeight / 2}
                        fill="#FFFFFF"
                        fontSize="14"
                        fontFamily={FONT_FAMILY}
                        textAnchor="middle"
                        transform={`rotate(-90, 15, ${chartHeight / 2})`}
                    >
                        VOC Index
                    </SvgText>
                    
                    {/* X-axis timestamps */}
                    {displayTimes.map((item, index) => (
                        <SvgText
                            key={index}
                            x={item.x}
                            y={chartHeight - 10}
                            fill="#FFFFFF"
                            fontSize="12"
                            fontFamily={FONT_FAMILY}
                            textAnchor="middle"
                        >
                            {item.time}
                        </SvgText>
                    ))}
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
            
            {/* Back button */}
            {/* <CloudButton onPress={onBack} /> */}
        </View>
    );
}