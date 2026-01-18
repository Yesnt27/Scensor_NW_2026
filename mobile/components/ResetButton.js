/**
 * ResetButton Component
 * Button to reset/clear Firebase database data
 * 
 * Props:
 *   - onPress: Function to call when button is pressed
 */

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { resetButtonStyles } from '../styles/resetButtonStyles';
import ResetIcon from './ResetIcon';

export default function ResetButton({ onPress }) {
    return (
        <TouchableOpacity 
            style={resetButtonStyles.button} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={resetButtonStyles.icon}>
                <ResetIcon size={45} color="#FFFFFF" />
            </View>
        </TouchableOpacity>
    );
}