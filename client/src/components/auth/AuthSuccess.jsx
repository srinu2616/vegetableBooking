import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { loginSuccess } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const error = params.get('error');

        if (accessToken && refreshToken) {
            loginSuccess(accessToken, refreshToken);
        } else if (error) {
            console.error("Auth error:", error);
            navigate('/login?error=' + error);
        } else {
            navigate('/login');
        }
    }, [location, loginSuccess, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="ml-4 text-gray-600">Completing login...</p>
        </div>
    );
};

export default AuthSuccess;
