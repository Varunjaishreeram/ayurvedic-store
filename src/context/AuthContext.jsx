// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api'; // Uses the Axios instance with interceptor
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds basic user info { id, username, email }
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || null); // Load token initially
  const [loading, setLoading] = useState(true); // Loading state for initial token check

  // --- Function to validate token and set user ---
  const validateTokenAndSetUser = useCallback(async (currentToken) => {
    if (!currentToken) {
      setUser(null);
      setToken(null); // Ensure token state is also null
      localStorage.removeItem('authToken'); // Clean storage just in case
      setLoading(false);
      console.log("No token found on load.");
      return;
    }

    try {
      // Decode token to check expiry
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
        // Ensure payload keys match what your backend sends ('user_id', 'username')
        setUser({
            id: decodedToken.user_id,
            username: decodedToken.username,
            // Add other fields from token if available and needed
        });
        setToken(currentToken); // Ensure token state is set

        // --- Optional: Fetch full user details from /me endpoint ---
        // This confirms the user still exists in the DB and gets fresh data
        // try {
        //     console.log("Fetching full user details from /me");
        //     const response = await apiClient.get('/api/auth/me'); // Interceptor adds token
        //     setUser(response.data); // Update user state with full details
        //     console.log("Full user details fetched:", response.data);
        // } catch (meError) {
        //     console.error("Failed to fetch user details from /me:", meError.response?.data || meError.message);
        //     // If /me fails (e.g., user deleted), clear the invalid token/user state
        //     localStorage.removeItem('authToken');
        //     setToken(null);
        //     setUser(null);
        // }
        // --- End Optional /me fetch ---

      }
    } catch (error) {
      console.error("Stored token is invalid:", error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies: None, relies on argument

  // --- Effect for initial token validation ---
  useEffect(() => {
    console.log("AuthProvider mounted. Checking initial token.");
    const initialToken = localStorage.getItem('authToken');
    setLoading(true);
    validateTokenAndSetUser(initialToken);
  }, [validateTokenAndSetUser]); // Rerun if the validation function itself changes (unlikely)

  // --- Login Function ---
  const login = async (identifier, password) => {
    setLoading(true); // Indicate loading during login attempt
    try {
      const response = await apiClient.post('/api/auth/login', { identifier, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem('authToken', access_token);
      setToken(access_token);
      setUser(userData);
      toast.success(`Welcome back, ${userData.username}!`);
      setLoading(false);
      return true; // Indicate success
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      console.error("Login error:", error.response || error.message);
      toast.error(errorMessage);
      localStorage.removeItem('authToken'); // Clear any potentially bad token
      setToken(null);
      setUser(null);
      setLoading(false);
      return false; // Indicate failure
    }
  };

  // --- Signup Function ---
  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/signup', { username, email, password });
      const { access_token, user: userData } = response.data; // Assuming signup also returns token/user

      localStorage.setItem('authToken', access_token);
      setToken(access_token);
      setUser(userData);
      toast.success(`Account created! Welcome, ${userData.username}!`);
      setLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      console.error("Signup error:", error.response || error.message);
      toast.error(errorMessage);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  // --- Logout Function ---
  const logout = () => { // Made synchronous as it just clears local state/storage
    console.log("Logging out user.");
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    // Optional: Clear other user-related cache/state if needed
    toast.info('You have been logged out.');
    // No loading state change needed unless adding async operations
  };

  // --- Context Value ---
  const authContextValue = {
      user,
      token, // Provide token state if needed elsewhere
      login,
      signup,
      logout,
      loading // Provide loading state for initial check/transitions
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {/* Render children only after the initial token check is done */}
      {!loading ? children : (
          <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl">
              {/* You can add a more sophisticated loading spinner here */}
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
