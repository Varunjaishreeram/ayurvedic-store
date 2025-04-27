// src/components/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import apiClient from '../api'; // Uses the Axios instance WITHOUT baseURL
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Helper function to load Razorpay script
const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

function Checkout({ cart, setCart }) {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', phone: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'razorpay'
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // You could potentially fetch saved address here if implemented
    }, [user]);

    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

        console.log("Attempting to place order. User state:", user);

        if (paymentMethod === 'cod') {
            // --- Handle COD ---
            try {
                 // CORRECTED PATH: Added /api prefix
                const response = await apiClient.post('/api/orders/create', {
                    cart: cart,
                    paymentMethod: 'cod',
                    address: address,
                });
                toast.success(response.data.message || "Order placed successfully!");
                setCart([]); // Clear cart
                navigate('/my-orders');
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to place COD order.");
                console.error("COD Error:", error.response || error);
            } finally {
                setProcessing(false);
            }
        } else if (paymentMethod === 'razorpay') {
            // --- Handle Razorpay ---
             const scriptLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
             if (!scriptLoaded) {
                 toast.error('Could not load payment gateway. Please try again.');
                 setProcessing(false);
                 return;
             }

             try {
                 // 1. Create Razorpay Order ID from backend
                 // CORRECTED PATH: Added /api prefix
                 const orderRes = await apiClient.post('/api/payments/razorpay/create_order', {
                     amount: cartTotal
                 });
                 const { orderId, amount: amountInPaise, keyId } = orderRes.data;

                 // 2. Configure Razorpay options
                 const options = {
                     key: keyId,
                     amount: amountInPaise,
                     currency: "INR",
                     name: "Saatwik Ayurveda",
                     description: "Order Payment",
                     image: "/favicon.ico", // Make sure this favicon exists in your public folder
                     order_id: orderId,
                     handler: async function (response) {
                         // 3. Payment Success: Send details to backend for verification & order creation
                         try {
                              // CORRECTED PATH: Added /api prefix
                             const verifyRes = await apiClient.post('/api/orders/create', {
                                 cart: cart,
                                 paymentMethod: 'razorpay',
                                 address: address,
                                 razorpayDetails: {
                                     paymentId: response.razorpay_payment_id,
                                     orderId: response.razorpay_order_id,
                                     signature: response.razorpay_signature,
                                 }
                             });
                             toast.success(verifyRes.data.message || "Order placed successfully!");
                             setCart([]); // Clear cart
                             navigate('/my-orders');
                         } catch (verificationError) {
                             toast.error(verificationError.response?.data?.message || "Payment verification failed.");
                             console.error("Verification Error:", verificationError.response || verificationError);
                         } finally {
                            setProcessing(false);
                         }
                     },
                     prefill: {
                         name: user.username || "",
                         email: user.email || "",
                         contact: address.phone || "",
                     },
                     notes: {
                         address: `${address.line1}, ${address.city}`
                     },
                     theme: {
                         color: "#22c55e" // Green color
                     },
                 };

                 // 4. Open Razorpay Checkout
                 const rzp = new window.Razorpay(options);
                 rzp.on('payment.failed', function (response) {
                     toast.error(`Payment Failed: ${response.error.description || 'Unknown error'}`);
                     console.error("Razorpay Failed:", response.error);
                     setProcessing(false);
                 });
                 rzp.open();

             } catch (error) {
                 toast.error(error.response?.data?.message || "Failed to initiate Razorpay payment.");
                 console.error("Razorpay Init Error:", error.response || error);
                 setProcessing(false);
             }
        } else {
            toast.error("Invalid payment method selected.");
            setProcessing(false);
        }
    };


   // Redirect if not logged in and loading is finished
   if (!authLoading && !user) {
      toast.info("Please log in to proceed to checkout.");
      return <Navigate to="/login" replace />;
   }

    // Show loading indicator while checking auth
    if (authLoading) {
         return <div className="text-center py-10">Loading user details...</div>;
    }


    return (
        <section className="max-w-4xl mx-auto py-16 px-4">
            <motion.h2
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl font-extrabold text-green-800 text-center mb-10 tracking-tight"
            >
                Checkout
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Address Form */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                 >
                    <h3 className="text-2xl font-semibold text-green-700 mb-4">Shipping Address</h3>
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
                        {Object.keys(address).map((key) => (
                            <div key={key}>
                                <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1')} {/* Add space before capitals */}
                                    {['line1', 'city', 'state', 'postalCode', 'country', 'phone'].includes(key) && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type={key === 'phone' ? 'tel' : 'text'}
                                    id={key}
                                    name={key}
                                    value={address[key]}
                                    onChange={handleInputChange}
                                    required={['line1', 'city', 'state', 'postalCode', 'country', 'phone'].includes(key)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                        ))}
                    </form>
                </motion.div>

                 {/* Order Summary & Payment */}
                 <motion.div
                     initial={{ opacity: 0, x: 50 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.2 }}
                     className="bg-white p-6 rounded-xl shadow-lg"
                 >
                    <h3 className="text-2xl font-semibold text-green-700 mb-4">Order Summary</h3>
                    <div className="space-y-2 mb-6 border-b pb-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-gray-700">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                         <div className="flex justify-between font-bold text-lg text-green-800 pt-2">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                         </div>
                    </div>

                    <h3 className="text-xl font-semibold text-green-700 mb-3">Payment Method</h3>
                     <div className="space-y-2 mb-6">
                         <div className="flex items-center">
                            <input
                                id="cod"
                                name="paymentMethod"
                                type="radio"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                            />
                            <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                                Cash on Delivery (COD)
                            </label>
                         </div>
                          <div className="flex items-center">
                            <input
                                id="razorpay"
                                name="paymentMethod"
                                type="radio"
                                value="razorpay"
                                checked={paymentMethod === 'razorpay'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                            />
                            <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700">
                                Pay Online (Card, UPI, etc.)
                            </label>
                         </div>
                     </div>

                    <button
                        type="button" // Change to type="button" to prevent form submission
                        onClick={handlePlaceOrder}
                        disabled={processing || cart.length === 0}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60"
                    >
                        {processing ? 'Processing...' : `Place Order${paymentMethod === 'razorpay' ? ' & Pay' : ''}`}
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

export default Checkout;