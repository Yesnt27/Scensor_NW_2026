/**
 * Custom Hook: useNotifications
 * Manages notification permissions and monitoring
 */

import { useEffect, useState } from 'react';
import notificationService from '../services/notificationService';

export function useNotifications(vocIndex) {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [pushToken, setPushToken] = useState(null);

    // Request permissions on mount
    useEffect(() => {
        (async () => {
            const granted = await notificationService.requestPermissions();
            setPermissionGranted(granted);

            if (granted) {
                const token = await notificationService.getPushToken();
                setPushToken(token);
            }
        })();
    }, []);

    // Monitor VOC and trigger notifications
    useEffect(() => {
        if (permissionGranted && vocIndex !== null) {
            notificationService.checkAndNotify(vocIndex, 250);
        }
    }, [vocIndex, permissionGranted]);

    return {
        permissionGranted,
        pushToken,
        resetCooldown: () => notificationService.resetCooldown(),
    };
}