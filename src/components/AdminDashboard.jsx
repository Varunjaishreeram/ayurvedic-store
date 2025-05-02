// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api';
import { FaUsers, FaBoxOpen, FaSpinner, FaArrowRight } from 'react-icons/fa'; // Added FaArrowRight
import { toast } from 'react-toastify';

function AdminDashboard() {
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(''); // Reset error on new fetch
            try {
                // Fetch user count
                const userRes = await apiClient.get('/api/admin/users/count');
                setUserCount(userRes.data.count);

                // Fetch all orders to get count (adjust if a dedicated count endpoint is made)
                 const ordersRes = await apiClient.get('/api/admin/orders');
                 setOrderCount(ordersRes.data.length);

            } catch (error) {
                console.error("Error fetching admin data:", error);
                const errorMsg = error.response?.data?.message || "Could not load admin dashboard data.";
                setError(errorMsg);
                toast.error(errorMsg);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-gray-600">
                 <FaSpinner className="animate-spin text-2xl mr-3" /> Loading Dashboard...
             </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Admin Dashboard</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User Count Card */}
                <Link
                    to="/admin/users"
                    className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:scale-[1.02]" // Added group and hover effects
                >
                    <div className="flex flex-col sm:flex-row items-center text-blue-600 mb-2">
                        <FaUsers className="h-10 w-10 mb-2 sm:mb-0 sm:mr-4 flex-shrink-0 text-blue-500 group-hover:text-blue-700 transition-colors" />
                        <div>
                            <div className="text-4xl font-bold">{userCount}</div>
                            <p className="text-gray-700 font-semibold mt-1 group-hover:text-blue-800 transition-colors">Registered Users</p>
                            {/* Added Text */}
                            <p className="text-xs text-gray-500 mt-2 flex items-center justify-center sm:justify-start group-hover:text-blue-600 transition-colors">
                                Click to view users <FaArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Order Count Card */}
                 <Link
                     to="/admin/orders"
                     className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300 hover:scale-[1.02]" // Added group and hover effects
                 >
                    <div className="flex flex-col sm:flex-row items-center text-green-600 mb-2">
                         <FaBoxOpen className="h-10 w-10 mb-2 sm:mb-0 sm:mr-4 flex-shrink-0 text-green-500 group-hover:text-green-700 transition-colors" />
                         <div>
                             <div className="text-4xl font-bold">{orderCount}</div>
                             <p className="text-gray-700 font-semibold mt-1 group-hover:text-green-800 transition-colors">Total Orders</p>
                              {/* Added Text */}
                            <p className="text-xs text-gray-500 mt-2 flex items-center justify-center sm:justify-start group-hover:text-green-600 transition-colors">
                                Click to view orders <FaArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </p>
                         </div>
                     </div>
                 </Link>

                {/* Placeholder for more cards */}
                 <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center flex items-center justify-center min-h-[150px]">
                     <p className="text-gray-500 italic">More stats coming soon...</p>
                 </div>
            </div>
            {/* You can add charts or other summaries here later */}
        </div>
    );
}

export default AdminDashboard;