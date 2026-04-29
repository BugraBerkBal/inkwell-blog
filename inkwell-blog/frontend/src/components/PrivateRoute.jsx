import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute: Oturum açılmamışsa Login sayfasına yönlendirir.
 * Yönlendirmeden önce nereden geldiği saklanır (from state).
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
