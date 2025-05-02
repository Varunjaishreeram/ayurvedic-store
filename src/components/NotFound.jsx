// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa'; // Import the icon

function NotFound() {
    return (
        <div className="text-center py-20 px-4 flex flex-col items-center min-h-[calc(100vh-250px)] justify-center"> {/* Adjusted min-height */}
            <motion.div
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ type: "spring", stiffness: 100, delay: 0.1}}
            >
                 <h1 className="text-6xl sm:text-7xl font-bold text-red-500 mb-4">404</h1>
            </motion.div>
             <motion.p
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.3}}
                 className="text-xl md:text-3xl text-gray-700 mb-8"
             >
                 Oops! Page Not Found.
            </motion.p>
            <motion.p
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.4}}
                 className="text-gray-500 mb-8 max-w-md"
             >
                 The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </motion.p>
            <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5}}
            >
                 <Link
                     to="/"
                     className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 shadow hover:shadow-md"
                 >
                     <FaArrowLeft className="mr-2" /> Go Back Home
                 </Link>
            </motion.div>
        </div>
    );
}

export default NotFound;