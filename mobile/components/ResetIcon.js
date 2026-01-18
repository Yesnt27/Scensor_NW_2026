import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function ResetIcon({ size = 40, color = '#FFFFFF' }) {
    return (
        <MaterialIcons 
            name="refresh" 
            size={size} 
            color={color} 
        />
    );
}