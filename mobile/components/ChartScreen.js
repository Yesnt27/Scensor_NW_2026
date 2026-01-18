/**
 * ChartScreen Component
 * Displays VOC index data over time using MUI X Charts
 * 
 * Features:
 * - Y-axis: VOC index
 * - X-axis: Time
 * - "Highest level" text at bottom center of graph
 * - White gradient at bottom of screen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FONT_FAMILY } from '../config/fonts';
import { chartScreenStyles } from '../styles/chartScreenStyles';
import { useChartData } from '../hooks/useChartData';

// Get responsive dimensions
const getDimensions = () => {
    const { width, height } = Dimensions.get('window');
    // Calculate smaller chart size - graph area only
    const chartWidth = Math.min(width * 0.75, 500); // 75% of width, max 500px
    const chartHeight = height * 0.4; // 40% of screen height
    return { width, height, chartWidth, chartHeight };
};

// Lazy load MUI X Charts only when needed (web only)
const loadChart = () => {
    if (Platform.OS !== 'web') return null;

    try {
        // Use dynamic import to avoid bundling issues
        return require('@mui/x-charts/LineChart');
    } catch (error) {
        console.warn('Chart library not available:', error);
        return null;
    }
};

export default function ChartScreen() {
    const [ChartComponent, setChartComponent] = useState(null);
    const [dimensions, setDimensions] = useState(getDimensions());

    // Fetch real-time chart data from Firebase
    const { chartData, isLoading, error, highestLevel, dataPointCount } = useChartData(60);

    // Update dimensions on screen resize
    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', () => {
            setDimensions(getDimensions());
        });
        return () => subscription?.remove();
    }, []);

    // Load chart component only on web
    useEffect(() => {
        if (Platform.OS === 'web') {
            const chartModule = loadChart();
            if (chartModule) {
                setChartComponent(() => chartModule.LineChart || chartModule.default || chartModule);
            }
        }
    }, []);

    // Threshold values for reference lines
    const highThreshold = 200; // Red "High" line

    // Show loading state
    if (isLoading) {
        return (
            <View style={chartScreenStyles.container}>
                <Text style={chartScreenStyles.title}>Trends</Text>
                <View style={chartScreenStyles.chartContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={chartScreenStyles.chartPlaceholderText}>Loading chart data...</Text>
                </View>
            </View>
        );
    }

    // Show error state
    if (error) {
        return (
            <View style={chartScreenStyles.container}>
                <Text style={chartScreenStyles.title}>Trends</Text>
                <View style={chartScreenStyles.chartContainer}>
                    <Text style={[chartScreenStyles.chartPlaceholderText, { color: '#FE0000' }]}>
                        Error loading data: {error}
                    </Text>
                </View>
            </View>
        );
    }

    // Show empty state
    if (dataPointCount === 0) {
        return (
            <View style={chartScreenStyles.container}>
                <Text style={chartScreenStyles.title}>Trends</Text>
                <View style={chartScreenStyles.chartContainer}>
                    <Text style={chartScreenStyles.chartPlaceholderText}>
                        No data available yet. Waiting for sensor readings...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={chartScreenStyles.container}>
            <Text style={chartScreenStyles.title}>Trends</Text>

            <View style={chartScreenStyles.chartContainer}>
                {Platform.OS === 'web' && ChartComponent ? (
                    <View style={chartScreenStyles.chartWrapperContainer}>
                        <View style={[chartScreenStyles.chartWrapper, { width: dimensions.chartWidth, height: dimensions.chartHeight }]}>
                            <ChartComponent
                                width={dimensions.chartWidth}
                                height={dimensions.chartHeight}
                                series={[
                                    {
                                        data: chartData.vocIndex,
                                        color: '#FFFFFF',
                                        showMarkers: false,
                                    },
                                    // High threshold line (red) - simple line, no markers
                                    {
                                        data: chartData.times.map(() => highThreshold),
                                        color: '#FE0000',
                                        showMarkers: false,
                                    },
                                ]}
                                xAxis={[
                                    {
                                        scaleType: 'point',
                                        data: chartData.times,
                                        disableTicks: true,
                                    },
                                ]}
                                yAxis={[
                                    {
                                        min: 0,
                                        max: 300,
                                        disableTicks: true,
                                    },
                                ]}
                                grid={{
                                    horizontal: true,
                                    vertical: true,
                                }}
                                sx={{
                                    backgroundColor: '#000000',
                                    // X-axis (bottom) white bar
                                    '& .MuiChartsAxis-root[data-axis-id="x"]': {
                                        stroke: '#FFFFFF',
                                        strokeWidth: 3,
                                    },
                                    '& .MuiChartsAxis-root[data-axis-id="x"] .MuiChartsAxis-line': {
                                        stroke: '#FFFFFF',
                                        strokeWidth: 3,
                                    },
                                    // Y-axis (left) white bar
                                    '& .MuiChartsAxis-root[data-axis-id="y"]': {
                                        stroke: '#FFFFFF',
                                        strokeWidth: 3,
                                    },
                                    '& .MuiChartsAxis-root[data-axis-id="y"] .MuiChartsAxis-line': {
                                        stroke: '#FFFFFF',
                                        strokeWidth: 3,
                                    },
                                    // All axis lines should be white
                                    '& .MuiChartsAxis-line': {
                                        stroke: '#FFFFFF !important',
                                        strokeWidth: '3px !important',
                                    },
                                    '& .MuiChartsAxis-root': {
                                        stroke: '#FFFFFF !important',
                                        strokeWidth: '3px !important',
                                    },
                                    '& .MuiChartsAxis-tick': {
                                        display: 'none',
                                    },
                                    '& .MuiChartsAxis-tickLabel': {
                                        display: 'none',
                                    },
                                    '& .MuiChartsAxis-label': {
                                        display: 'none',
                                    },
                                    '& .MuiChartsLegend-root': {
                                        display: 'none',
                                    },
                                    '& .MuiChartsGrid-root': {
                                        stroke: '#333333',
                                    },
                                    // Hide all markers/dots on lines
                                    '& .MuiMarkElement-root': {
                                        display: 'none',
                                    },
                                    // Hide markers for threshold lines
                                    '& .MuiLineElement-root[data-series-id="1"] .MuiMarkElement-root': {
                                        display: 'none',
                                    },
                                }}
                            />
                        </View>
                        {/* Highest level text right below the graph */}
                        {ChartComponent && (
                            <View style={chartScreenStyles.highestLevelContainer}>
                                <Text style={chartScreenStyles.highestLevelText}>
                                    Highest level: {highestLevel}
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={chartScreenStyles.chartPlaceholder}>
                        <Text style={chartScreenStyles.chartPlaceholderText}>
                            Chart available on web platform
                        </Text>
                        <Text style={chartScreenStyles.chartPlaceholderText}>
                            Highest level: {highestLevel}
                        </Text>
                    </View>
                )}
            </View>

            {/* White gradient at bottom of screen (matching detecting state) */}
            <LinearGradient
                colors={['#00000000', '#FFFFFF40', '#FFFFFF80', '#FFFFFF']}
                locations={[0, 0.3, 0.7, 1]}
                style={chartScreenStyles.bottomGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
        </View>
    );
}
