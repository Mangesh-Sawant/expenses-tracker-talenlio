import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Ideally you'd have a /me endpoint to validate token and get user details
                    // For now we'll decode details if possible or assume logged in if token exists
                    // For better security, implement a /me endpoint in backend
                    const userData = JSON.parse(localStorage.getItem('userInfo'));
                    setUser(userData);
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (email, password) => {
        const { data } = await axios.post('/auth/register', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
