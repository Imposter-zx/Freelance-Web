import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const loggedIn = localStorage.getItem('loggedIn');
        if (loggedIn === 'true' && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.email === email && storedUser.password === password) {
            localStorage.setItem('loggedIn', 'true');
            setUser(storedUser);
            return true;
        }
        return false;
    };

    const register = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('loggedIn', 'true');
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('loggedIn');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
