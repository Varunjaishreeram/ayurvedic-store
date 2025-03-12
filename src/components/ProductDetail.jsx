import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { FaStar } from "react-icons/fa";

function ProductDetail({ products, addToCart }) {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const addButtonRef = useRef(null);

  if (!product) return <div>Product not found</div>;

  const sortedReviews = [...product.reviews].sort((a, b) =>
    sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating
  );

  const handleAddToCart = () => {
    const button = addButtonRef.current;
    addToCart(product, quantity, button);
  };

  return (
    <section className="max-w-5xl mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <motion.img
            src={product.img}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full md:w-1/2 h-80 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold text-green-800">{product.name}</h2>
            <p className="text-2xl text-gray-600 mt-2">${product.price}</p>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"} />
              ))}
              <span className="ml-2 text-gray-600">({product.rating}/5)</span>
            </div>
            <p className="text-gray-700 mt-4 text-lg leading-relaxed">{product.description}</p>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-green-700">How to Use</h3>
              <p className="text-gray-700 mt-2">{product.howToUse}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-green-700">Benefits</h3>
              <p className="text-gray-700 mt-2">{product.benefits}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-green-700">Ingredients</h3>
              <p className="text-gray-700 mt-2">{product.ingredients}</p>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="w-20 p-2 border rounded-lg text-center focus:ring-2 focus:ring-green-500"
              />
              <button
                ref={addButtonRef}
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-full hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg"
              >
                Add to Cart
              </button>
            </div>
            <Link to="/products" className="mt-4 inline-block text-green-600 hover:underline text-lg">Back to Products</Link>
          </div>
        </div>
        <div className="mt-12">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-green-800">Customer Reviews</h3>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="desc">Highest Rating First</option>
              <option value="asc">Lowest Rating First</option>
            </select>
          </div>
          {sortedReviews.length === 0 ? (
            <p className="text-gray-600 mt-4">No reviews yet.</p>
          ) : (
            sortedReviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <div className="flex items-center">
                  <p className="font-semibold text-green-700">{review.user}</p>
                  <div className="ml-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mt-1">{review.text}</p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
}

export default ProductDetail;