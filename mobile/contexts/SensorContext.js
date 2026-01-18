import React, { createContext, useContext } from 'react';
import { useSensorData } from '../hooks/useSensorData';
import { useAlertState } from '../hooks/useAlertState';

const SensorContext = createContext();

export function SensorProvider({ children }) {
    const sensorData = useSensorData();
    const alertState = useAlertState(sensorData.vocIndex);

    return (
        <SensorContext.Provider value={{ ...sensorData, ...alertState }}>
            {children}
        </SensorContext.Provider>
    );
}

export function useSensorContext() {
    const context = useContext(SensorContext);
    if (!context) {
        throw new Error('useSensorContext must be used within a SensorProvider');
    }
    return context;
}