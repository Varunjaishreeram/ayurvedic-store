// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa'; // Optional loading spinner

const AdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation(); // Get current location

  if (loading) {
    // Show a loading indicator while auth state is being determined
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-gray-600">
            <FaSpinner className="animate-spin text-2xl mr-3" /> Checking permissions...
        </div>
    );
  }

  if (!user) {
    // Not logged in, redirect to login, saving the intended destination
    // toast.info("Please log in as an admin to access this page."); // Optional toast
    return <Navigate to="/login" state={{ from: location }} replace />; // Pass location state
  }

  if (!user.isAdmin) {
    // Logged in but not an admin
    toast.error("Access Denied: Admin privileges required.");
    return <Navigate to="/" replace />; // Redirect to homepage or a 'forbidden' page
  }

  // User is logged in and is an admin, render the child route component
  return <Outlet />;
};

export default AdminRoute;