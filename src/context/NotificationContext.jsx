import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        if (savedNotifications.length === 0) {
            // Initial mock notifications
            const initial = [
                { id: 1, title: 'Bienvenue !', message: 'Merci de rejoindre ZORD Freelance.', time: 'Il y a 2 jours', read: true, type: 'info' },
                { id: 2, title: 'Profil validé', message: 'Votre profil a été vérifié avec succès.', time: 'Il y a 1 jour', read: true, type: 'success' },
                { id: 3, title: 'Message non lu', message: 'Vous avez un nouveau message de test.', time: 'Il y a 2h', read: false, type: 'message' },
            ];
            setNotifications(initial);
            localStorage.setItem('notifications', JSON.stringify(initial));
        } else {
            setNotifications(savedNotifications);
        }
    }, []);

    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length);
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (notif) => {
        const newNotif = {
            id: Date.now(),
            read: false,
            time: 'À l\'instant',
            ...notif
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
