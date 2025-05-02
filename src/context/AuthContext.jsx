// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api'; // Uses the Axios instance with interceptor
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds { id, username, email, isAdmin }
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(true);

  // --- Function to validate token and set user ---
  const validateTokenAndSetUser = useCallback(async (currentToken) => {
    if (!currentToken) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      setLoading(false);
      console.log("No token found on load.");
      return;
    }

    try {
      // Decode token to check expiry and get isAdmin
      const decodedToken = jwtDecode(currentToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.warn("Stored token has expired.");
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      } else {
        console.log("Stored token is valid. Setting user state.");
        // Token is valid, set basic user info from token payload
        setUser({
            id: decodedToken.user_id,
            username: decodedToken.username,
            isAdmin: decodedToken.isAdmin || false // <-- GET isAdmin from token payload
            // Add other fields if needed (like email if included in token)
        });
        setToken(currentToken); // Ensure token state is set

        // Optional: Fetch full user details from /me to confirm user exists and get fresh data
        // Make sure the /me endpoint also returns the isAdmin field
        // try {
        //     const response = await apiClient.get('/api/auth/me');
        //     setUser(response.data); // This response MUST include 'isAdmin'
        // } catch (meError) { /* handle error, clear token/user */ }

      }
    } catch (error) {
      console.error("Stored token is invalid or decoding failed:", error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Effect for initial token validation ---
  useEffect(() => {
    console.log("AuthProvider mounted. Checking initial token.");
    const initialToken = localStorage.getItem('authToken');
    setLoading(true);
    validateTokenAndSetUser(initialToken);
  }, [validateTokenAndSetUser]);

  // --- Login Function ---
  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/login', { identifier, password });
      const { access_token, user: userData } = response.data; // userData includes isAdmin

      localStorage.setItem('authToken', access_token);
      setToken(access_token);
      setUser(userData); // Set user state (includes isAdmin)
      toast.success(`Welcome back, ${userData.username}!`);
      setLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed.';
      console.error("Login error:", error.response || error.message);
      toast.error(errorMessage);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  // --- Signup Function ---
  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/signup', { username, email, password });
      const { access_token, user: userData } = response.data; // userData includes isAdmin

      localStorage.setItem('authToken', access_token);
      setToken(access_token);
      setUser(userData); // Set user state (includes isAdmin)
      toast.success(`Account created! Welcome, ${userData.username}!`);
      setLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed.';
      console.error("Signup error:", error.response || error.message);
      toast.error(errorMessage);
      // Don't clear token/user here necessarily, maybe signup failed for other reasons
      setLoading(false);
      return false;
    }
  };

  // --- Logout Function ---
  const logout = () => {
    console.log("Logging out user.");
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    toast.info('You have been logged out.');
    // No loading state change needed here
  };

  // --- Context Value ---
  const authContextValue = {
      user, // User object now contains `isAdmin` boolean
      token,
      login,
      signup,
      logout,
      loading
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading ? children : (
          <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl">
              Loading Application...
          </div>
        )}
    </AuthContext.Provider>
  );
};

// --- Custom Hook ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};