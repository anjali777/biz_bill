import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('auth_token'); // Check if token exists
    return token ? children : <Navigate to="/users/login_user" />;
};

export default ProtectedRoute;
