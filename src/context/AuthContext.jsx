import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const USER_KEY = 'user';
const SESSION_KEY = 'loggedIn';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

// Demo-auth only: the password never leaves the browser and is not stored in clear text.
// In production, authentication must be delegated to the backend over HTTPS.
const hashPassword = async (email, password) => {
    const input = `${normalizeEmail(email)}:${password}`;
    if (globalThis.crypto?.subtle) {
        const data = new TextEncoder().encode(input);
        const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(digest))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    // Fallback for non-secure contexts (e.g. an old browser opened over plain HTTP).
    let hash = 2166136261;
    for (let index = 0; index < input.length; index += 1) {
        hash ^= input.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return `fnv1a-${(hash >>> 0).toString(16)}`;
};

const readStoredUser = () => {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const toPublicUser = (user) => ({
    name: user.name,
    email: user.email,
    role: user.role || 'client',
    bio: user.bio || '',
    location: user.location || '',
    createdAt: user.createdAt,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = readStoredUser();
        const loggedIn = localStorage.getItem(SESSION_KEY);
        if (loggedIn === 'true' && storedUser) {
            setUser(toPublicUser(storedUser));
        }
        setLoading(false);
    }, []);

    const register = async ({ name, email, password, role = 'client' }) => {
        const normalizedEmail = normalizeEmail(email);
        if (!name?.trim() || !normalizedEmail || !password) {
            throw new Error('Tous les champs sont requis.');
        }
        if (password.length < 8) {
            throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
        }

        const existing = readStoredUser();
        if (existing?.email === normalizedEmail) {
            throw new Error('Un compte existe déjà avec cette adresse e-mail.');
        }

        const newUser = {
            name: name.trim(),
            email: normalizedEmail,
            role: ['client', 'freelancer'].includes(role) ? role : 'client',
            createdAt: new Date().toISOString(),
            passwordHash: await hashPassword(normalizedEmail, password),
        };

        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        localStorage.setItem(SESSION_KEY, 'true');
        setUser(toPublicUser(newUser));
        return toPublicUser(newUser);
    };

    const login = async (email, password) => {
        const storedUser = readStoredUser();
        if (!storedUser) return false;

        const normalizedEmail = normalizeEmail(email);
        if (storedUser.email !== normalizedEmail) return false;

        let isValid = false;
        if (storedUser.passwordHash) {
            isValid = storedUser.passwordHash === (await hashPassword(normalizedEmail, password));
        } else if (storedUser.password) {
            // Migrate legacy plain-text accounts on their next successful login.
            isValid = storedUser.password === password;
            if (isValid) {
                storedUser.passwordHash = await hashPassword(normalizedEmail, password);
                delete storedUser.password;
                localStorage.setItem(USER_KEY, JSON.stringify(storedUser));
            }
        }

        if (!isValid) return false;

        const { password: _legacyPassword, ...safeUser } = storedUser;
        localStorage.setItem(SESSION_KEY, 'true');
        localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
        setUser(toPublicUser(safeUser));
        return true;
    };

    const updateProfile = (updates) => {
        const storedUser = readStoredUser();
        if (!storedUser) return;

        const nextStored = {
            ...storedUser,
            name: updates.name?.trim() || storedUser.name,
            role: updates.role || storedUser.role,
            bio: updates.bio ?? storedUser.bio,
            location: updates.location ?? storedUser.location,
            // The email is the account identifier and is intentionally immutable in this demo.
            email: storedUser.email,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(nextStored));
        setUser(toPublicUser(nextStored));
    };

    const changePassword = async (currentPassword, newPassword) => {
        const storedUser = readStoredUser();
        if (!storedUser) throw new Error('Aucun compte connecté.');

        const currentHash = storedUser.passwordHash ||
            (storedUser.password ? null : '');
        if (storedUser.password) {
            if (storedUser.password !== currentPassword) {
                throw new Error('Le mot de passe actuel est incorrect.');
            }
        } else if (currentHash !== (await hashPassword(storedUser.email, currentPassword))) {
            throw new Error('Le mot de passe actuel est incorrect.');
        }

        if (!newPassword || newPassword.length < 8) {
            throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères.');
        }

        const nextStored = {
            ...storedUser,
            passwordHash: await hashPassword(storedUser.email, newPassword),
        };
        delete nextStored.password;
        localStorage.setItem(USER_KEY, JSON.stringify(nextStored));
    };

    const deleteAccount = () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            login,
            register,
            logout,
            updateProfile,
            changePassword,
            deleteAccount,
            loading,
        }),
        [user, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
