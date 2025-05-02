// src/components/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import apiClient from '../api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa'; // Import spinner

// Helper function to load Razorpay script (kept for potential future use)
const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => { resolve(true); };
        script.onerror = () => { resolve(false); };
        document.body.appendChild(script);
    });
};

function Checkout({ cart, setCart }) {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', phone: ''
    });
    // Default to COD since Razorpay is hidden
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Could fetch saved address here
    }, [user]);

    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const cartTotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity, 10) || 1;
        return sum + price * quantity;
    }, 0);

    // --- Format Currency ---
     const formatCurrency = (amount) => {
        const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        if (isNaN(numericAmount)) amount = 0; else amount = numericAmount;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2
        }).format(amount);
    };

    const handlePlaceOrder = async () => {
        setProcessing(true);
        if (!user) {
            toast.error("Please log in to place an order.");
            setProcessing(false);
            navigate('/login');
            return;
        }
        if (cart.length === 0) {
             toast.error("Your cart is empty.");
             setProcessing(false);
             navigate('/products');
             return;
        }
         // Basic address validation
        if (!address.line1 || !address.city || !address.state || !address.postalCode || !address.phone || !address.country) {
            toast.error("Please fill in all required address fields.");
            setProcessing(false);
            return;
        }

        console.log("Attempting to place COD order. User state:", user);

        // --- Handle COD ---
        if (paymentMethod === 'cod') {
            try {
                const response = await apiClient.post('/api/orders/create', {
                    cart: cart,
                    paymentMethod: 'cod',
                    address: address,
                });
                // Display estimated delivery date if received from backend
                let successMsg = response.data.message || "Order placed successfully!";
                if (response.data.estimatedDeliveryDate) {
                     const deliveryDate = new Date(response.data.estimatedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                     successMsg += ` Estimated delivery around ${deliveryDate}.`;
                }
                toast.success(successMsg, { autoClose: 5000 }); // Longer display time
                setCart([]); // Clear cart
                navigate('/my-orders'); // Redirect to order history
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to place COD order.");
                console.error("COD Error:", error.response || error);
            } finally {
                setProcessing(false);
            }
        }
        // --- Razorpay path removed as option is hidden ---
        else {
            toast.error("Invalid payment method selected."); // Should not happen
            setProcessing(false);
        }
    };


   // Redirect if not logged in and loading is finished
   if (!authLoading && !user) {
      toast.info("Please log in to proceed to checkout.");
      return <Navigate to="/login" replace />;
   }

    // Show loading indicator while checking auth or processing
    if (authLoading) {
         return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-gray-600">
                <FaSpinner className="animate-spin text-2xl mr-3" /> Loading user details...
            </div>
         );
    }


    return (
        <section className="max-w-4xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 md:mb-12"
            >
                Checkout
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Address Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                 >
                    <h3 className="text-xl font-semibold text-green-700 mb-4">Shipping Address</h3>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        {Object.keys(address).map((key) => (
                            <div key={key}>
                                <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize mb-1">
                                    {key.replace(/([A-Z])/g, ' $1').trim()} {/* Add space before capitals */}
                                    {['line1', 'city', 'state', 'postalCode', 'country', 'phone'].includes(key) && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <input
                                    type={key === 'phone' ? 'tel' : 'text'}
                                    id={key}
                                    name={key}
                                    value={address[key]}
                                    onChange={handleInputChange}
                                    required={['line1', 'city', 'state', 'postalCode', 'country', 'phone'].includes(key)}
                                    readOnly={key === 'country'} // Make country read-only if always India
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100"
                                    disabled={key === 'country'}
                                />
                            </div>
                        ))}
                    </form>
                </motion.div>

                 {/* Order Summary & Payment */}
                 <motion.div
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.5, delay: 0.2 }}
                     className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col"
                 >
                    <h3 className="text-xl font-semibold text-green-700 mb-4">Order Summary</h3>
                    <div className="space-y-2 mb-5 border-b border-gray-200 pb-4 flex-grow">
                        {cart.length > 0 ? cart.map(item => (
                            <div key={item.id} className="flex justify-between text-sm text-gray-700">
                                <span>{item.name} x {item.quantity}</span>
                                {/* Display formatted item subtotal */}
                                {/* <span>{formatCurrency((parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 1))}</span> */}
                            </div>
                        )) : <p className="text-gray-500 italic">Your cart is empty.</p>}
                         <div className="flex justify-between font-semibold text-lg text-gray-800 pt-3 mt-3 border-t border-gray-100">
                            <span>Total</span>
                            <span>{formatCurrency(cartTotal)}</span>
                         </div>
                    </div>

                    {/* Payment Method Selection - Simplified for COD only */}
                    <div className="mt-auto">
                        <h3 className="text-lg font-semibold text-green-700 mb-3">Payment Method</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center p-3 border border-green-300 rounded-md bg-green-50">
                                <input
                                    id="cod"
                                    name="paymentMethod"
                                    type="radio"
                                    value="cod"
                                    checked={true} // Always checked as it's the only option
                                    readOnly // Make it read-only
                                    className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                                />
                                <label htmlFor="cod" className="ml-3 block text-sm font-medium text-green-800">
                                    Cash on Delivery (COD)
                                </label>
                            </div>
                            {/* Razorpay option is commented out/removed */}
                        </div>

                        <button
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={processing || cart.length === 0 || !address.line1 || !address.city || !address.state || !address.postalCode || !address.phone} // Add address validation to disable
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <>
                                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Processing...
                                </>
                            ) : 'Place Order'}
                        </button>
                    </div>
                 </motion.div>
            </div>
        </section>
    );
}

export default Checkout;