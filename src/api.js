// src/api.js
import axios from 'axios';

// Get base URL from environment variables
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://saatwikayurveda-backend.onrender.com'; // Fallback for local

// Log the URL being used (helpful for debugging deployment)
if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn(`VITE_API_BASE_URL not set, falling back to: ${apiBaseUrl}`);
} else {
    console.log(`API Base URL configured: ${apiBaseUrl}`);
}


const apiClient = axios.create({
  baseURL: apiBaseUrl,
  // No longer need withCredentials for token auth in headers
});

// --- Request Interceptor to add the Authorization header ---
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage on each request
    const token = localStorage.getItem('authToken');
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('Attaching token to request:', token); // Uncomment for debugging
    } else {
      // Optional: Log if no token is found for a request
      // console.log('No token found, request sent without Authorization header.');
    }
    return config; // Return the (potentially modified) config
  },
  (error) => {
    // Handle request errors (e.g., network issues)
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// --- Optional: Response Interceptor (Example for global 401 handling) ---
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., token expired/invalid)
      console.warn("API request returned 401 (Unauthorized). Token might be invalid or expired.");

      // Check if the error message indicates token expiry specifically
      const errorMessage = error.response.data?.message || '';
      if (errorMessage.toLowerCase().includes('expired')) {
          // Optionally notify user about expiry
          // toast.error("Your session has expired. Please log in again.");
      }

      // Clear invalid/expired token and potentially trigger logout/redirect
      localStorage.removeItem('authToken');

      // Avoid infinite loops if the login page itself causes a 401
      if (window.location.pathname !== '/login') {
        // Redirect to login page
        // Consider using a more sophisticated method if using a router context
        // window.location.href = '/login';
        console.log("Redirecting to login due to 401 error.");
      }
    }
    // Return the error so components can potentially handle it too
    return Promise.reject(error);
  }
);


export default apiClient;
    