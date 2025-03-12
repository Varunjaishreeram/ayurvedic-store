import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

function ProductList({ products, addToCart }) {
  const [quantities, setQuantities] = useState(products.map(() => 1));
  const buttonRefs = useRef(products.map(() => React.createRef()));

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = Math.max(1, value);
    setQuantities(newQuantities);
  };

  const handleAddToCart = (product, index) => {
    const button = buttonRefs.current[index].current;
    addToCart(product, quantities[index], button);
  };

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl font-extrabold text-green-800 text-center mb-12 tracking-tight"
      >
        Our Ayurvedic Treasures
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-56 object-cover hover:scale-110 transition-transform duration-500"
              />
            </Link>
            <div className="p-6">
              <h3 className="text-xl font-bold text-green-700">{product.name}</h3>
              <p className="text-gray-600 text-lg">${product.price}</p>
              <div className="mt-4 flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  value={quantities[index]}
                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                  className="w-16 p-2 border rounded-lg text-center focus:ring-2 focus:ring-green-500"
                />
                <button
                  ref={buttonRefs.current[index]}
                  onClick={() => handleAddToCart(product, index)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-full hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ProductList;