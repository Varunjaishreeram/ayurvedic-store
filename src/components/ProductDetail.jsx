// src/components/ProductDetail.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaArrowLeft, FaChevronDown } from 'react-icons/fa'; // Added icons

function ProductDetail({ products, addToCart }) {
    const { id } = useParams();
    // Ensure comparison is correct (string vs number if needed)
    const product = products.find(p => p.id.toString() === id);
    const [quantity, setQuantity] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc"); // Default sort for reviews
    const addButtonRef = useRef(null);

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

    // --- Handle quantity change ---
    const handleQuantityChange = (value) => {
        setQuantity(Math.max(1, parseInt(value, 10) || 1));
    };

    // --- Handle adding to cart ---
    const handleAddToCart = () => {
        const button = addButtonRef.current;
        const quantityToAdd = quantity || 1;
        addToCart(product, quantityToAdd, button);
    };

    // --- Render star rating ---
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5; // Check for half star if using fractional ratings
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Adjust if using half stars

        return (
            <div className="flex items-center text-yellow-400">
                {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
                {/* Add half star logic here if needed */}
                {[...Array(emptyStars)].map((_, i) => <FaStar key={`empty-${i}`} className="text-gray-300" />)}
            </div>
        );
    };


    // --- Loading/Not Found State ---
    // Add a check if products are still loading if applicable
    if (!product) {
        return (
            <div className="text-center py-20 text-gray-600">
                Product not found or still loading...
                <Link to="/products" className="block mt-4 text-green-600 hover:underline">
                    Go Back to Products
                </Link>
            </div>
        );
     }

     // Ensure reviews is an array before sorting
     const reviews = Array.isArray(product.reviews) ? product.reviews : [];
     const sortedReviews = [...reviews].sort((a, b) => {
         // Handle potential non-numeric ratings
         const ratingA = typeof a.rating === 'number' ? a.rating : 0;
         const ratingB = typeof b.rating === 'number' ? b.rating : 0;
         return sortOrder === "desc" ? ratingB - ratingA : ratingA - ratingB;
     });

    // Calculate average rating safely
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + (typeof review.rating === 'number' ? review.rating : 0), 0) / reviews.length
        : 0;


    return (
        <section className="max-w-6xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
             {/* Back to Products Link */}
            <Link
                to="/products"
                className="inline-flex items-center text-sm text-green-700 hover:text-green-900 mb-6 group"
            >
                <FaArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Back to Products
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200" // Consistent card style
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0"> {/* Removed gap for seamless look */}
                    {/* Product Image */}
                    <div className="md:aspect-square overflow-hidden"> {/* Maintain aspect ratio */}
                         <motion.img
                            src={product.img}
                            alt={product.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="w-full h-full object-cover" // Ensure image covers the area
                        />
                    </div>

                    {/* Product Info */}
                    <div className="p-6 md:p-8 lg:p-10 flex flex-col">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
                        <div className="flex items-center mb-4 space-x-2">
                            {renderStars(averageRating)}
                            <span className="text-sm text-gray-500">
                                ({averageRating.toFixed(1)}/5 from {reviews.length} review{reviews.length !== 1 ? 's' : ''})
                            </span>
                        </div>
                        {/* <p className="text-3xl font-semibold text-green-700 mb-6">
                            {formatCurrency(product.price)}
                        </p> */}

                        {/* Description */}
                        <div className="text-gray-700 text-base leading-relaxed mb-6">
                            {product.description}
                        </div>

                        {/* Action Area */}
                        <div className="mt-auto pt-6 border-t border-gray-100">
                             <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <label htmlFor="quantity" className="sr-only">Quantity</label>
                                    <input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                        aria-label={`Quantity for ${product.name}`}
                                        className="w-20 h-11 p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-offset-1 focus:ring-green-500 focus:border-green-500 outline-none transition duration-150"
                                    />
                                </div>
                                <button
                                    ref={addButtonRef}
                                    onClick={handleAddToCart}
                                    className="flex-1 inline-flex items-center justify-center h-11 px-6 bg-green-600 text-white text-base font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-sm hover:shadow-md"
                                    aria-label={`Add ${product.name} to cart`}
                                >
                                    <FaShoppingCart className="mr-2 h-5 w-5" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details Tabs/Accordion (Optional but good for long content) */}
                 {/* For simplicity, keeping the stacked layout */}
                <div className="px-6 md:px-8 lg:px-10 py-8 border-t border-gray-200 bg-gray-50/50">
                    <div className="space-y-6">
                        {product.howToUse && (
                             <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{product.howToUse}</p>
                            </div>
                        )}
                         {product.benefits && (
                             <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Benefits</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{product.benefits}</p>
                            </div>
                         )}
                        {product.ingredients && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingredients</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{product.ingredients}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="px-6 md:px-8 lg:px-10 py-8 border-t border-gray-200">
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                        <h3 className="text-2xl font-semibold text-gray-800">Customer Reviews</h3>
                        {/* Styled Select Dropdown */}
                        <div className="relative inline-block text-left">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="appearance-none w-full sm:w-auto bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 focus:border-green-500 text-sm"
                                aria-label="Sort reviews"
                            >
                                <option value="desc">Highest Rating</option>
                                <option value="asc">Lowest Rating</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <FaChevronDown className="h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-5">
                        {sortedReviews.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No reviews have been submitted for this product yet.</p>
                        ) : (
                            sortedReviews.map((review, index) => (
                                <motion.div
                                    key={index} // Consider using a more stable key if reviews have IDs
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm" // Subtle background/shadow for each review
                                >
                                    <div className="flex items-center mb-1.5">
                                        {renderStars(review.rating)}
                                        <p className="ml-3 font-semibold text-sm text-gray-800">{review.user || 'Anonymous'}</p>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

export default ProductDetail;

