// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Make sure react plugin is also included
import tailwindcss from '@tailwindcss/vite' // Your existing tailwind plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // Add the react plugin if it's not already there
    tailwindcss(), // Your existing plugin
  ],
  server: { // Add this 'server' section for the proxy
    port: 5173, // Your frontend port (optional, defaults to 5173)
    proxy: {
      // Proxy '/api' requests to your Flask backend
      '/api': {
        target: 'http://127.0.0.1:5000', // Your Flask backend URL
        changeOrigin: true, // Recommended setting
        // secure: false, // Default is false, uncomment if backend uses HTTPS w/ self-signed cert
        // Optional: If your Flask routes *don't* start with /api, you might need rewrite
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})