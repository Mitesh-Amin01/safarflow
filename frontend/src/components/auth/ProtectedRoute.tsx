import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-base">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-t-2 border-primary-light rounded-full animate-spin duration-700"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-black tracking-widest text-primary animate-pulse uppercase">Syncing</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
