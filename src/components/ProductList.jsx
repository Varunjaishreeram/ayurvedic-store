// src/components/ProductList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon

function ProductList({ products, addToCart }) {
    // Initialize quantities state based on the products array
    const [quantities, setQuantities] = useState(() => products.map(() => 1));
    // Initialize refs for each button
    const buttonRefs = useRef(products.map(() => React.createRef()));

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

    // Update quantity for a specific product index
    const handleQuantityChange = (index, value) => {
        const newQuantities = [...quantities];
        // Ensure quantity is at least 1 and is a valid number
        newQuantities[index] = Math.max(1, parseInt(value, 10) || 1);
        setQuantities(newQuantities);
    };

    // Handle adding product to cart
    const handleAddToCart = (product, index) => {
        const button = buttonRefs.current[index]?.current; // Safely access ref
        // Ensure quantity is valid before adding
        const quantityToAdd = quantities[index] || 1;
        addToCart(product, quantityToAdd, button);
    };

    // Update quantities state if the products prop changes externally
    useEffect(() => {
        setQuantities(products.map(() => 1));
        buttonRefs.current = products.map(() => React.createRef());
    }, [products]);


    return (
        <section className="max-w-7xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50"> {/* Added subtle gradient background */}
            {/* Section Title */}
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 text-center mb-10 md:mb-14 tracking-tight" // Adjusted size and boldness
            >
                Our Ayurvedic Treasures
            </motion.h2>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col transition-shadow duration-300 hover:shadow-xl" // Use shadow transition, remove transform
                    >
                        {/* Product Image Link */}
                        <Link to={`/product/${product.id}`} className="block overflow-hidden aspect-square"> {/* Fixed aspect ratio */}
                            <img
                                src={product.img}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105" // Smoother scale effect
                                loading="lazy" // Lazy load images
                            />
                        </Link>

                        {/* Product Details */}
                        <div className="p-5 flex flex-col flex-grow"> {/* Use flex-grow to push actions down */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate" title={product.name}> {/* Truncate long names */}
                                {product.name}
                            </h3>
                            <p className="text-xl font-bold text-green-700 mb-4">
                                {formatCurrency(product.price)}
                            </p>

                            {/* Spacer to push actions to bottom */}
                            <div className="flex-grow"></div>

                            {/* Quantity and Add to Cart */}
                            <div className="mt-auto pt-4 border-t border-gray-100"> {/* Add border top */}
                                <div className="flex items-center space-x-3">
                                    {/* Quantity Input */}
                                    <input
                                        type="number"
                                        min="1"
                                        max="99" // Add a reasonable max
                                        value={quantities[index]}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        aria-label={`Quantity for ${product.name}`}
                                        className="w-16 h-10 p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition duration-150"
                                    />
                                    {/* Add to Cart Button */}
                                    <button
                                        ref={buttonRefs.current[index]}
                                        onClick={() => handleAddToCart(product, index)}
                                        className="flex-1 inline-flex items-center justify-center h-10 px-4 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-sm hover:shadow-md"
                                        aria-label={`Add ${product.name} to cart`}
                                    >
                                        <FaShoppingCart className="mr-2 h-4 w-4" /> {/* Added Cart Icon */}
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export default ProductList;
