// src/api.js
import axios from 'axios';

// Get the base URL from environment variables
// VITE_API_BASE_URL will be replaced by Vite during the build process
// with the value you set in Vercel environment variables.
// For local development, it might be undefined, so we can fall back.
const apiBaseUrl = 'https://saatwikayurveda-backend.onrender.com/'; // Fallback for local dev if needed, but proxy handles it better there.

console.log(`API Base URL being used: ${apiBaseUrl}`); // Good for debugging

const apiClient = axios.create({
  // Set the base URL for all requests made with this client
  baseURL: apiBaseUrl,
  withCredentials: true, // Send cookies with requests (needed for Flask-Login sessions)
});

// Optional: Add interceptors for logging or error handling if needed
// apiClient.interceptors.request.use(request => {
//   console.log('Starting Request', request);
//   return request;
// });

// apiClient.interceptors.response.use(response => {
//   console.log('Response:', response);
//   return response;
// }, error => {
//   console.error('API Error:', error.response || error.message);
//   return Promise.reject(error);
// });


export default apiClient;
