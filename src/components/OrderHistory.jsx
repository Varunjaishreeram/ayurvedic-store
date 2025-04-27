// src/components/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext provides user and loading state
import apiClient from '../api'; // Assuming this is your configured axios instance
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaCalendarAlt, FaCreditCard, FaMoneyBillWave, FaHashtag, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaShippingFast, FaSpinner } from 'react-icons/fa';

function OrderHistory() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Helper function to format currency (INR) ---
    const formatCurrency = (amount) => {
        // Ensure amount is a number, default to 0 if not convertible
        const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        if (isNaN(numericAmount)) {
            console.warn(`Invalid amount detected: ${amount}. Defaulting to 0.`);
            amount = 0;
        } else {
            amount = numericAmount;
        }

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // --- Helper function to format date ---
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: 'numeric', minute: '2-digit', hour12: true,
                timeZone: 'Asia/Kolkata'
            });
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return 'Invalid Date';
        }
    };

    // --- Helper function to get status styles and icon ---
    const getStatusInfo = (status) => {
        const lowerStatus = status?.toLowerCase() || 'unknown';
        let styles = 'bg-gray-100 text-gray-800 border-gray-300'; // Default
        let icon = <FaBoxOpen className="mr-1.5" />;
        let text = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'; // Capitalize

        switch (lowerStatus) {
            case 'completed':
                styles = 'bg-green-100 text-green-800 border-green-300';
                icon = <FaCheckCircle className="mr-1.5" />;
                text = 'Completed';
                break;
            case 'processing':
                styles = 'bg-blue-100 text-blue-800 border-blue-300';
                icon = <FaHourglassHalf className="mr-1.5 animate-spin" />;
                text = 'Processing';
                break;
            case 'pending':
                styles = 'bg-yellow-100 text-yellow-800 border-yellow-300';
                icon = <FaHourglassHalf className="mr-1.5" />;
                text = 'Pending';
                break;
            case 'failed':
            case 'cancelled':
                styles = 'bg-red-100 text-red-800 border-red-300';
                icon = <FaTimesCircle className="mr-1.5" />;
                text = lowerStatus === 'failed' ? 'Failed' : 'Cancelled';
                break;
            default: // Keep default for unknown statuses
                icon = <FaBoxOpen className="mr-1.5" />;
                text = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
        }
        return { styles, icon, text };
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const response = await apiClient.get('/api/orders/my-orders');
                const sortedOrders = response.data.sort((a, b) => {
                    const dateA = new Date(a.orderDate);
                    const dateB = new Date(b.orderDate);
                    if (isNaN(dateA) && isNaN(dateB)) return 0;
                    if (isNaN(dateA)) return 1;
                    if (isNaN(dateB)) return -1;
                    return dateB - dateA;
                });
                setOrders(sortedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchOrders();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-gray-600">
                <FaSpinner className="animate-spin text-2xl mr-3" />
                <span className="text-lg">Loading your orders...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <section className="max-w-6xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 md:mb-12"
            >
                Order History
            </motion.h2>

            {orders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-gray-500 text-lg bg-white p-10 rounded-lg shadow"
                >
                    <FaBoxOpen className="mx-auto text-4xl text-gray-400 mb-4" />
                    You haven't placed any orders yet.
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => {
                        const statusInfo = getStatusInfo(order.paymentStatus);
                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Order Header */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 border-b border-gray-200">
                                    <div className="flex flex-wrap justify-between items-center gap-y-2 gap-x-4">
                                        <div className="flex items-center text-sm text-gray-600 font-medium">
                                            <FaHashtag className="mr-1.5 text-gray-400" />
                                            Order ID: <span className="ml-1 text-gray-800 font-mono">{order.id}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaCalendarAlt className="mr-1.5 text-gray-400" />
                                            {formatDate(order.orderDate)}
                                        </div>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.styles}`}>
                                            {statusInfo.icon}
                                            {statusInfo.text}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                        {/* Items Section - Updated */}
                                        <div className="md:col-span-2">
                                            <h4 className="text-md font-semibold text-gray-700 mb-3">Items Ordered</h4>
                                            <ul className="space-y-3"> {/* Increased spacing */}
                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map(item => {
                                                        // Calculate item subtotal safely
                                                        const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
                                                        const itemQuantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity, 10) || 1;
                                                        const itemSubtotal = itemPrice * itemQuantity;

                                                        return (
                                                            <li key={`${order.id}-${item.productId}`} className="pb-3 border-b border-gray-100 last:border-b-0">
                                                                <div className="flex justify-between items-start gap-2">
                                                                    {/* Item Name */}
                                                                    <span className="text-sm font-medium text-gray-800 flex-1 pr-2">
                                                                        {item.productName || 'Unknown Item'}
                                                                    </span>
                                                                    {/* Item Subtotal */}
                                                                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                                        {formatCurrency(itemSubtotal)}
                                                                    </span>
                                                                </div>
                                                                {/* Quantity x Price Breakdown */}
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {itemQuantity} x {formatCurrency(itemPrice)} each
                                                                </div>
                                                            </li>
                                                        );
                                                    })
                                                ) : (
                                                    <li className="text-gray-500 italic text-sm">No items listed for this order.</li>
                                                )}
                                            </ul>
                                        </div>

                                        {/* Summary & Address Section */}
                                        <div className="md:col-span-1 space-y-5"> {/* Increased spacing */}
                                            {/* Payment & Total */}
                                            <div>
                                                <h4 className="text-md font-semibold text-gray-700 mb-2">Summary</h4>
                                                <div className="space-y-1.5 text-sm"> {/* Slightly more spacing */}
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600 flex items-center">
                                                            {order.paymentMethod === 'razorpay'
                                                                ? <FaCreditCard className="mr-1.5 text-blue-500" />
                                                                : <FaMoneyBillWave className="mr-1.5 text-green-500" />
                                                            }
                                                            Payment:
                                                        </span>
                                                        <span className="font-medium text-gray-800 capitalize">{order.paymentMethod}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2"> {/* Added top margin/padding */}
                                                        <span className="text-gray-600 font-semibold">Order Total:</span>
                                                        <span className="font-bold text-lg text-green-700">{formatCurrency(order.totalAmount)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shipping Address */}
                                            {order.shippingAddress && (
                                                <div>
                                                    <h4 className="text-md font-semibold text-gray-700 mb-1.5 flex items-center"> {/* Adjusted margin */}
                                                        <FaShippingFast className="mr-1.5 text-gray-500"/>
                                                        Shipping To:
                                                    </h4>
                                                    <div className="text-sm text-gray-600 leading-relaxed space-y-0.5"> {/* Added line spacing */}
                                                        {order.shippingAddress.line1 && <div>{order.shippingAddress.line1}</div>}
                                                        {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
                                                        <div>
                                                            {order.shippingAddress.city && <span>{order.shippingAddress.city}, </span>}
                                                            {order.shippingAddress.state && <span>{order.shippingAddress.state}</span>}
                                                            {order.shippingAddress.postalCode && <span> - {order.shippingAddress.postalCode}</span>}
                                                        </div>
                                                        {order.shippingAddress.country && <div>{order.shippingAddress.country}</div>}
                                                        {order.shippingAddress.phone && <div className="mt-1 text-gray-500">Phone: {order.shippingAddress.phone}</div>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </section>
    );
}

export default OrderHistory;
