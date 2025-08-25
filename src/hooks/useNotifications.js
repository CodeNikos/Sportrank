import { useState, useCallback } from 'react';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            message,
            type,
            duration
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto-remove after duration
        setTimeout(() => {
            removeNotification(id);
        }, duration);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const showSuccess = useCallback((message, duration) => {
        addNotification(message, 'success', duration);
    }, [addNotification]);

    const showError = useCallback((message, duration) => {
        addNotification(message, 'error', duration);
    }, [addNotification]);

    const showWarning = useCallback((message, duration) => {
        addNotification(message, 'warning', duration);
    }, [addNotification]);

    const showInfo = useCallback((message, duration) => {
        addNotification(message, 'info', duration);
    }, [addNotification]);

    return {
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};
