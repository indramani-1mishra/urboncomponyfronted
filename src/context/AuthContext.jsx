import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await api.get('/api/auth/me');
                setUser(res.data);
            } catch (err) {
                setUser(null);
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        setUser(res.data);
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/api/auth/register', { name, email, password, role });
        setUser(res.data);
    };

    const logout = async () => {
        await api.post('/api/auth/logout', {});
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
