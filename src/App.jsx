




import React from "react";
import { useState, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";


const products = [
  { 
    id: 1, 
    name: "Amashay Churn", 
    price: 15, 
    img: "/Amashay_Churn.jpg", 
    description: "A potent Ayurvedic digestive powder crafted from rare herbs to soothe your stomach and enhance digestion.", 
    howToUse: "Mix 1 teaspoon with warm water and consume after meals twice daily.", 
    rating: 4.5, 
    reviews: [
      { user: "Priya", text: "Works wonders for my digestion!", rating: 5 }, 
      { user: "Ravi", text: "Good product, but takes time.", rating: 4 }
    ] 
  },
  { 
    id: 2, 
    name: "/Daant Manjaan", 
    price: 10, 
    img: "Daant_Manjan.jpg", 
    description: "A herbal tooth powder enriched with cloves and neem for strong, healthy teeth.", 
    howToUse: "Rub 1/2 teaspoon on teeth and gums, rinse after 2 minutes.", 
    rating: 4.0, 
    reviews: [
      { user: "Amit", text: "Love the taste and freshness!", rating: 4 }
    ] 
  },
  { 
    id: 3, 
    name: "Face Pack", 
    price: 20, 
    img: "/Face_Pack.jpg", 
    description: "Natural face mask.", 
    howToUse: "Apply evenly on face, rinse after 15 mins.", 
    rating: 4.8, 
    reviews: [
      { user: "Sneha", text: "Amazing glow!", rating: 5 }
    ] 
  },
  { 
    id: 4, 
    name: "Jodo Ka Tail", 
    price: 18, 
    img: "/Jodo_Ka_Tail.jpg", 
    description: "Joint pain relief oil.", 
    howToUse: "Massage gently on affected area.", 
    rating: 4.2, 
    reviews: [
      { user: "Vikram", text: "Great relief!", rating: 4 }
    ] 
  },
  { 
    id: 5, 
    name: "Kesh Ratn", 
    price: 8, 
    img: "/Kesh_Ratn.jpg", 
    description: "Hair growth oil.", 
    howToUse: "Apply to scalp, leave overnight.", 
    rating: 4.6, 
    reviews: [
      { user: "Neha", text: "Thicker hair!", rating: 5 }
    ] 
  },
  { 
    id: 6, 
    name: "Power Churan", 
    price: 12, 
    img: "/Power_Churan.jpg", 
    description: "Energy powder.", 
    howToUse: "Mix with milk, drink in morning.", 
    rating: 4.3, 
    reviews: [
      { user: "Kunal", text: "Boosts energy!", rating: 4 }
    ] 
  },
  { 
    id: 7, 
    name: "Rambaan Tail", 
    price: 22, 
    img: "/Rambaan_Tail.jpg", 
    description: "Healing oil.", 
    howToUse: "Apply on cuts or skin.", 
    rating: 4.7, 
    reviews: [
      { user: "Meera", text: "Must-have!", rating: 5 }
    ] 
  }
];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [animationTrigger, setAnimationTrigger] = useState(null);
  const cartIconRef = useRef(null);

  const addToCart = (product, quantity, triggerElement) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    // Trigger animation
    if (triggerElement && cartIconRef.current) {
      const triggerRect = triggerElement.getBoundingClientRect();
      const cartRect = cartIconRef.current.getBoundingClientRect();
      setAnimationTrigger({
        product,
        from: { x: triggerRect.left, y: triggerRect.top },
        to: { x: cartRect.left, y: cartRect.top },
      });
      setTimeout(() => setAnimationTrigger(null), 800);
    }

    // Show toast notification
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-white font-sans">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gradient-to-r from-green-700 to-green-500 text-white p-4 shadow-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-extrabold tracking-wider">Ayurveda Bliss</Link>
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-yellow-200 transition duration-300 font-medium">Home</Link>
            <Link to="/products" className="hover:text-yellow-200 transition duration-300 font-medium">Products</Link>
            <Link to="/cart" className="flex items-center hover:text-yellow-200 transition duration-300 font-medium">
              <span ref={cartIconRef} className="cart-icon flex items-center">
                <FaShoppingCart className="mr-2" /> {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </Link>
            <a href="#" className="hover:text-yellow-200 transition duration-300 font-medium">About</a>
            <a href="#" className="hover:text-yellow-200 transition duration-300 font-medium">Contact</a>
            <button className="bg-yellow-400 text-green-800 px-5 py-2 rounded-full hover:bg-yellow-500 transition duration-300 shadow-md">
              Login
            </button>
          </div>
          <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
            className="md:hidden mt-4 space-y-4 text-center"
          >
            <Link to="/" className="block hover:text-yellow-200 font-medium">Home</Link>
            <Link to="/products" className="block hover:text-yellow-200 font-medium">Products</Link>
            <Link to="/cart" className="block hover:text-yellow-200 font-medium flex justify-center items-center">
              <FaShoppingCart className="mr-2" /> {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Link>
            <a href="#" className="block hover:text-yellow-200 font-medium">About</a>
            <a href="#" className="block hover:text-yellow-200 font-medium">Contact</a>
            <button className="bg-yellow-400 text-green-800 px-5 py-2 rounded-full hover:bg-yellow-500">Login</button>
          </motion.div>
        )}
      </motion.nav>

      <AnimatePresence>
        <Routes>
          <Route path="/" element={<ProductList products={products} addToCart={addToCart} />} />
          <Route path="/products" element={<ProductList products={products} addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        </Routes>
      </AnimatePresence>

      {/* Cart Animation */}
      {animationTrigger && (
        <motion.img
          src={animationTrigger.product.img}
          initial={{ x: animationTrigger.from.x, y: animationTrigger.from.y, scale: 1, opacity: 1 }}
          animate={{ x: animationTrigger.to.x, y: animationTrigger.to.y, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ position: "fixed", zIndex: 1000, width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
        />
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;