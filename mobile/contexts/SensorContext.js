import React, { createContext, useContext } from 'react';
import { useSensorData } from '../hooks/useSensorData';
import { useAlertState } from '../hooks/useAlertState';
import { useNotifications } from '../hooks/useNotifications';

const SensorContext = createContext();

export function SensorProvider({ children }) {
    const { vocIndex, rawValue, isLoading, error } = useSensorData();
    const { state, isAlert, isDetecting } = useAlertState(vocIndex);
    
    // ✅ Add notification monitoring
    const { permissionGranted, pushToken } = useNotifications(vocIndex);

    return (
        <SensorContext.Provider
            value={{
                vocIndex,
                rawValue,
                state,
                isAlert,
                isDetecting,
                isLoading,
                error,
                notificationsEnabled: permissionGranted,
                pushToken,
            }}
        >
            {children}
        </SensorContext.Provider>
    );
}

export function useSensorContext() {
    const context = useContext(SensorContext);
    if (!context) {
        throw new Error('useSensorContext must be used within SensorProvider');
    }
    return context;
}