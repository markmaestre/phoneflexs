// src/components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { user } = useContext(UserContext);  // Get user info from context

  if (!user) {
    // If no user is logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (user.role !== 'user') {
    // If user is not a 'user' role, redirect to dashboard or another page
    return <Navigate to="/user-dashboard" />;
  }

  return <Route {...rest} element={Component} />;
};

export default PrivateRoute;
