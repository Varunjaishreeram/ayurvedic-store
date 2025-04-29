// src/components/Cart.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { toast } from 'react-toastify';

function Cart({ cart, setCart }) {
    const { user } = useAuth(); // Get user state
    const navigate = useNavigate(); // Hook for navigation

    // --- Helper function to format currency (INR) ---
    const formatCurrency = (amount) => {
        const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        if (isNaN(numericAmount)) {
            console.warn(`Invalid amount for formatting: ${amount}. Defaulting to 0.`);
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

    // --- Remove item from cart ---
    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
        // Optional: Add a toast notification for removal
        // toast.info("Item removed from cart.");
    };

    // --- Update item quantity ---
    const updateQuantity = (id, newQuantity) => {
        // Ensure quantity is a number between 1 and a reasonable max (e.g., 99)
        const quantity = Math.max(1, Math.min(99, parseInt(newQuantity, 10) || 1));
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: quantity } : item
            )
        );
    };

    // --- Calculate cart total ---
    const cartTotal = cart.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity, 10) || 1;
        return sum + price * quantity;
    }, 0);

    // --- Handle checkout navigation ---
    const handleCheckout = () => {
        if (!user) {
            toast.info("Please log in to proceed to checkout.", { autoClose: 3000 });
            navigate('/login', { state: { from: '/cart' } }); // Redirect to login, passing current location
        } else {
            navigate('/checkout'); // Proceed to checkout if logged in
        }
    };

    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 1 }, // Start visible for AnimatePresence layout changes
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08 // Stagger animation of children
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
    };

    return (
        <section className="max-w-4xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]"> {/* Adjusted max-width and min-height */}
            {/* Page Title */}
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 md:mb-12"
            >
                Your Shopping Cart
            </motion.h2>

            {cart.length === 0 ? (
                // Empty Cart State
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center bg-white p-10 rounded-lg shadow-md border border-gray-100"
                >
                    <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-5" />
                    <p className="text-gray-600 text-xl mb-6">
                        Your cart is currently empty.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center bg-green-600 text-white px-6 py-2.5 rounded-md hover:bg-green-700 transition-colors duration-300 shadow hover:shadow-md text-base font-medium"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                    </Link>
                </motion.div>
            ) : (
                // Cart Content
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    {/* Cart Items List */}
                    <motion.ul
                        className="divide-y divide-gray-200"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.li
                                    key={item.id}
                                    layout // Enable layout animation
                                    variants={itemVariants}
                                    exit="exit" // Specify exit variant
                                    className="flex flex-col sm:flex-row items-center py-4 px-4 sm:px-6 gap-4" // Added gap
                                >
                                    {/* Item Image */}
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md flex-shrink-0 border border-gray-100"
                                        loading="lazy"
                                    />
                                    {/* Item Details */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-medium text-gray-800 hover:text-green-700">
                                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                                        </h3>
                                        {/* <p className="text-gray-500 text-sm mt-1">{formatCurrency(item.price)} each</p> */}
                                    </div>
                                    {/* Quantity & Price */}
                                    <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-0">
                                        {/* Quantity Input */}
                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                                            aria-label={`Quantity for ${item.name}`}
                                            className="w-16 h-9 p-1 border border-gray-300 rounded-md text-center text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition"
                                        />
                                        {/* Subtotal */}
                                        {/* <p className="text-base font-medium text-gray-900 w-24 text-right">
                                            {formatCurrency(item.price * item.quantity)}
                                        </p> */}
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label={`Remove ${item.name} from cart`}
                                            className="ml-1 sm:ml-2 text-gray-400 hover:text-red-600 transition-colors duration-200 p-1.5 rounded-full hover:bg-red-50"
                                            title="Remove item"
                                        >
                                            <FaTrash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </motion.ul>

                    {/* Cart Summary & Checkout */}
                    <div className="bg-gray-50 px-4 py-5 sm:px-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
                            {/* <div className="text-lg sm:text-xl font-semibold text-gray-800">
                                Subtotal: <span className="text-green-700 ml-1">{formatCurrency(cartTotal)}</span>
                            </div> */}
                            <button
                                onClick={handleCheckout}
                                className="w-full sm:w-auto inline-flex justify-center items-center bg-green-600 text-white px-8 py-2.5 rounded-md hover:bg-green-700 transition-colors duration-300 shadow hover:shadow-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Cart;
