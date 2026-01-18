/**
 * Notification Service
 * Handles push notifications for both mobile and web
 * Triggers when VOC index exceeds threshold (250)
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

class NotificationService {
    constructor() {
        this.lastNotificationTime = null;
        this.notificationCooldown = 5 * 60 * 1000; // 5 minutes cooldown
        this.setupNotifications();
    }

    /**
     * Setup notification handler
     */
    setupNotifications() {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });
    }

    /**
     * Request notification permissions
     */
    async requestPermissions() {
        try {
            if (Platform.OS === 'web') {
                // Web push notification permission
                if ('Notification' in window) {
                    const permission = await Notification.requestPermission();
                    return permission === 'granted';
                }
                return false;
            }

            // Mobile (iOS/Android)
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                
                if (finalStatus !== 'granted') {
                    console.warn('Failed to get push notification permissions');
                    return false;
                }

                return true;
            } else {
                console.warn('Must use physical device for push notifications');
                return false;
            }
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
            return false;
        }
    }

    /**
     * Get push notification token
     */
    async getPushToken() {
        try {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF0000',
                });
            }

            const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.expoConfig?.projectId;
            
            if (!projectId) {
                console.warn('No project ID found for push notifications');
                return null;
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId: projectId,
            });

            console.log('Push token:', token.data);
            return token.data;
        } catch (error) {
            console.error('Error getting push token:', error);
            return null;
        }
    }

    /**
     * Check if we should send a notification (cooldown logic)
     */
    shouldSendNotification() {
        const now = Date.now();
        
        if (!this.lastNotificationTime) {
            return true;
        }

        const timeSinceLastNotification = now - this.lastNotificationTime;
        return timeSinceLastNotification >= this.notificationCooldown;
    }

    /**
     * Send local notification
     */
    async sendLocalNotification(vocIndex) {
        try {
            if (!this.shouldSendNotification()) {
                console.log('⏰ Notification cooldown active, skipping...');
                return;
            }

            if (Platform.OS === 'web') {
                console.log('🌐 Sending web notification...');
                
                // Check if notifications are supported
                if (!('Notification' in window)) {
                    console.error('❌ Browser does not support notifications');
                    return;
                }

                // Check permission status
                if (Notification.permission === 'denied') {
                    console.error('❌ Notification permission denied');
                    return;
                }

                if (Notification.permission === 'default') {
                    console.log('📋 Requesting permission...');
                    const permission = await Notification.requestPermission();
                    
                    if (permission !== 'granted') {
                        console.error('❌ Permission not granted');
                        return;
                    }
                }

                // Create notification
                const notification = new Notification('🚨 AIR QUALITY ALERT!', {
                    body: `⚠️ VOC Index: ${vocIndex}\n🔴 Exceeds safe threshold (250)\n🌬️ Check your air quality immediately!`,
                    icon: 'https://img.icons8.com/color/96/000000/warning-shield.png',
                    badge: 'https://img.icons8.com/color/96/000000/warning-shield.png',
                    tag: 'voc-alert-' + Date.now(),
                    requireInteraction: true,
                    silent: false,
                    vibrate: [200, 100, 200],
                    timestamp: Date.now(),
                    renotify: true,
                });

                // Add click handler
                notification.onclick = () => {
                    console.log('🔔 Notification clicked');
                    window.focus();
                    notification.close();
                };

                notification.onerror = (err) => {
                    console.error('❌ Notification error:', err);
                };

                console.log('✅ Web notification sent');
                this.lastNotificationTime = Date.now();
                
            } else {
                // Mobile notification
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: '🚨 Air Quality Alert!',
                        body: `VOC Index is ${vocIndex} - exceeds safe threshold (250)`,
                        sound: true,
                        priority: Notifications.AndroidNotificationPriority.HIGH,
                        color: '#FF0000',
                        vibrate: [0, 250, 250, 250],
                        data: { vocIndex, timestamp: Date.now() },
                    },
                    trigger: null,
                });
                
                this.lastNotificationTime = Date.now();
                console.log('✅ Mobile notification sent');
            }
        } catch (error) {
            console.error('❌ Error sending notification:', error);
        }
    }

    /**
     * Check VOC and send notification if threshold exceeded
     */
    async checkAndNotify(vocIndex, threshold = 250) {
        if (vocIndex === null || vocIndex === undefined) {
            return;
        }

        if (vocIndex > threshold) {
            console.log(`⚠️ VOC Alert! Index: ${vocIndex} > Threshold: ${threshold}`);
            await this.sendLocalNotification(vocIndex);
        }
    }

    /**
     * Reset notification cooldown
     */
    resetCooldown() {
        this.lastNotificationTime = null;
        console.log('🔄 Notification cooldown reset');
    }
}

export default new NotificationService();