import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token exists, then fetch user profile
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const { data } = await api.get('/api/profile/me');
            setUser(data);
        } catch (err) {
            console.error('Failed to fetch user profile', err);
            // Logout logic handled by api interceptor
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        // Standard json payload instead of oauth form-data
        const { data } = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        // Now that token is saved, fetch user
        await fetchUserProfile();
    };

    const register = async (name, email, password, risk_profile) => {
        await api.post('/api/auth/register', {
            name,
            email,
            password,
            risk_profile
        });
        // Can optionally auto-login after register, but instruction implies "Register -> Login -> Dashboard"
        // so we just return success
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
