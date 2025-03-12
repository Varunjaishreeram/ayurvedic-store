import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

function Cart({ cart, setCart }) {
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  return (
    <section className="max-w-5xl mx-auto py-16 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-green-800 text-center mb-12 tracking-tight"
      >
        Your Cart
      </motion.h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Your cart is empty. <Link to="/products" className="text-green-600 hover:underline">Shop now!</Link>
        </p>
      ) : (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <img src={item.img} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1 ml-6">
                <h3 className="text-xl font-semibold text-green-700">{item.name}</h3>
                <p className="text-gray-600 text-lg">${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                className="w-20 p-2 border rounded-lg text-center focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 text-red-600 hover:text-red-800 transition-colors duration-300"
              >
                <FaTrash size={20} />
              </button>
            </motion.div>
          ))}
          <div className="text-right mt-8">
            <p className="text-2xl font-semibold text-green-800">
              Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </p>
            <button className="mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-full hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;