import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedAdminRoute = () => {
  const { user } = useSelector(state => state.auth);

  // Check if user is authenticated and has admin role
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute; 