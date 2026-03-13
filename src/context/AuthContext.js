'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check for saved user/token in localStorage
        const fetchUser = async () => {
            const token = localStorage.getItem('@RifaBot:token');
            if (token) {
                try {
                    const response = await api.get('/users/me');
                    setUser(response.data);
                    localStorage.setItem('@RifaBot:user', JSON.stringify(response.data));
                } catch (error) {
                    console.error('Error refreshing user profile:', error);
                    // If token is invalid or server error, logout
                    if (error.response?.status === 401) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            const { user: userData, token } = response.data;

            setUser(userData);
            localStorage.setItem('@RifaBot:token', token);
            localStorage.setItem('@RifaBot:user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            const { user: newUser, token } = response.data;
            
            if (newUser && token) {
                setUser(newUser);
                localStorage.setItem('@RifaBot:token', token);
                localStorage.setItem('@RifaBot:user', JSON.stringify(newUser));
                return newUser;
            }
            return newUser;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = () => {
        setLoggingOut(true);
        setTimeout(() => {
            setUser(null);
            localStorage.removeItem('@RifaBot:token');
            localStorage.removeItem('@RifaBot:user');
            setLoggingOut(false);
            router.push('/login');
        }, 1500);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, loading, loggingOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
