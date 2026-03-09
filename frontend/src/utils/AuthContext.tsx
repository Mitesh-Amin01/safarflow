import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    isVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/users/current-user');
            if (response.data.success) {
                setUser(response.data.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/users/logout');
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
            // Even if the backend call fails, we clear the local state
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
