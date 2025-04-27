// src/api.js
import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'http://127.0.0.1:5000/api', // REMOVED or COMMENTED OUT - Vite proxy handles this now
  withCredentials: true, // Send cookies with requests (needed for Flask-Login sessions)
});

// Optional: Add interceptors for error handling or token refresh if needed
// apiClient.interceptors.response.use(response => response, error => {
//   console.error("API Error:", error.response || error.message || error);
//   // Handle specific errors like 401 Unauthorized if needed
//   return Promise.reject(error);
// });

export default apiClient;