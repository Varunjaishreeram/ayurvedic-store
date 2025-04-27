// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api'; // Uses the Axios instance WITHOUT baseURL
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      // Add /api prefix
      const response = await apiClient.get('/api/auth/status');
      if (response.data.logged_in) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (identifier, password) => {
     setLoading(true);
     try {
        // Add /api prefix
        const response = await apiClient.post('/api/auth/login', { identifier, password });
        setUser(response.data.user);
        toast.success(`Welcome back, ${response.data.user.username}!`);
        setLoading(false);
        return true;
     } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
        toast.error(errorMessage);
        setUser(null);
        setLoading(false);
        return false;
     }
  };

  const signup = async (username, email, password) => {
     setLoading(true);
     try {
        // Add /api prefix
        const response = await apiClient.post('/api/auth/signup', { username, email, password });
        setUser(response.data.user);
        toast.success(`Account created successfully! Welcome, ${response.data.user.username}!`);
        setLoading(false);
        return true;
     } catch (error) {
        const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
        toast.error(errorMessage);
        setUser(null);
        setLoading(false);
        return false;
     }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Add /api prefix
      await apiClient.post('/api/auth/logout');
      setUser(null);
      toast.info('You have been logged out.');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
      setUser(null);
    } finally {
       setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, checkAuthStatus, loading }}>
      {!loading ? children : <div className="text-center py-20">Loading Application...</div>} {/* Basic loading state */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);