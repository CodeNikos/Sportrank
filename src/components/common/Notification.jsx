import React, { useState, useEffect } from 'react';
import './Notification.css';

export const Notification = ({ message, type = 'info', duration = 4000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onClose && onClose();
            }, 300); // Tiempo para la animación de salida
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose && onClose();
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className={`notification ${type} ${isVisible ? 'show' : 'hide'}`}>
            <div className="notification-content">
                <span className="notification-icon">{getIcon()}</span>
                <span className="notification-message">{message}</span>
                <button className="notification-close" onClick={handleClose}>
                    ×
                </button>
            </div>
        </div>
    );
};

export const NotificationContainer = ({ notifications, removeNotification }) => {
    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    duration={notification.duration}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};
