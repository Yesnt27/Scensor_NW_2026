/**
 * CloudButton Component
 * Reusable button component with cloud icon
 * 
 * Props:
 *   - onPress: Function to call when button is pressed
 */

import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { cloudButtonStyles } from '../styles/cloudButtonStyles';

export default function CloudButton({ onPress }) {
    return (
        <TouchableOpacity
            style={cloudButtonStyles.button}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={cloudButtonStyles.icon}>
                <Text style={cloudButtonStyles.iconText}>☁</Text>
            </View>
        </TouchableOpacity>
    );
}

