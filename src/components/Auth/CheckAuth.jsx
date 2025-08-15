import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const CheckAuthentication = ({ isAuthenticated, user, children }) => {
  console.log(isAuthenticated,'anotherOne')
  const location = useLocation();
  const path = location.pathname;

  const isAdminRoute = path.includes('/admin');
  const isStudentRoute = path.includes('/student');
  const isOtpRoute = path.includes('/otp');
  const isPublicRoute = path === '/' || path.includes('/login') || path.includes('/register');

  // 🔒 Protect admin and student routes
  if (isAdminRoute || isStudentRoute) {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    if (isAdminRoute && user?.role !== 'admin') {
      return <Navigate to="/student" replace />;
    }

    if (isStudentRoute && user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
  }

  // 🕒 Allow access to OTP page even if not authenticated yet
  if (isOtpRoute) {
    return <>{children}</>;
  }

  // 🚪 Public routes like home, login, register
  if (isPublicRoute) {
    if (isAuthenticated) {
      return user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/student" replace />;
    } else {
      return <>{children}</>;
    }
  }

  // 🌐 Fallback
  return <>{children}</>;
};

export default CheckAuthentication;
