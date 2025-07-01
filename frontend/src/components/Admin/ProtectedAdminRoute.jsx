import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  const user = useSelector(state => state.auth.user);

  // If not logged in or not admin, redirect to not authorized
  if (!user || user.role !== 'admin') {
    return <Navigate to="/not-authorized" replace />;
  }

  // If admin, render the nested routes
  return <Outlet />;
};

export default ProtectedAdminRoute; 