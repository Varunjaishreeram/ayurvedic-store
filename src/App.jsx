// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaBoxOpen, FaBars, FaTimes, FaPhoneAlt, FaUserShield, FaLeaf } from "react-icons/fa"; // Added FaUserShield, FaLeaf
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Components
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Checkout from "./components/Checkout";
import OrderHistory from "./components/OrderHistory";
import ContactUs from "./components/ContactUs";
import NotFound from "./components/NotFound"; // Import NotFound
import AdminRoute from './components/AdminRoute'; // Import AdminRoute
import AdminDashboard from './components/AdminDashboard'; // Import Admin Components
import AdminUserList from './components/AdminUserList';
import AdminOrderList from './components/AdminOrderList';

// Import Auth Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// --- Product Data (Keep as is or fetch from backend if needed) ---
// Ensure product data has prices, otherwise addToCart might fail
const products = [
     {
       id: 1, name: "Amashay Churn", price: 180.00, quantity: '100gm', img: "/Amashay_Churn.jpg", // Example price update
       description: "A potent Ayurvedic digestive powder crafted from rare Himalayan herbs. Specially formulated to soothe stomach discomfort, reduce bloating, and enhance overall digestion naturally.",
       howToUse: "Mix 1 teaspoon (approx. 5g) with a glass of lukewarm water. Consume twice daily, preferably 30 minutes after lunch and dinner for optimal results.",
       benefits: ["Soothes indigestion and acidity.","Reduces gas and bloating.","Improves nutrient absorption.","Promotes regular bowel movements."],
       ingredients: "Triphala, Hing, Ajwain, Saunf, Jeera, Pudina Satva, etc...", rating: 4.5,
       reviews: [{ user: "Priya S.", text: "Works wonders for my digestion! Feel much lighter.", rating: 5 },{ user: "Ravi K.", text: "Good product, noticed improvement after a week.", rating: 4 }]
     },
     {
       id: 2, name: "Daant Manjan", price: 90.00, quantity: '50gm', img: "/Daant_Manjan.jpg", // Example price update
       description: "A herbal tooth powder enriched with cloves and neem for strong, healthy teeth and fresh breath. Naturally whitens and protects gums.",
       howToUse: "Take a small amount on a soft toothbrush or finger. Gently massage teeth and gums for 2 minutes. Rinse thoroughly with water. Use twice daily.",
       benefits: ["Save water, In toothpaste people use more water than this manjan require few water",
        "Strengthens teeth and gums.", "Fights bad breath.", "Helps prevent cavities and plaque.", "Provides natural whitening effect."],
       ingredients: "Neem Bark, Clove Oil, Babool Bark, Vajradanti, Mulethi, Camphor, etc...", rating: 4.2,
       reviews: [{ user: "Amit G.", text: "Love the natural taste and freshness!", rating: 4 }, {user: "Sunita", text: "My gums feel healthier.", rating: 5}]
     },
     {
       id: 3, name: "Face Pack", price: '160', quantity: '70gm', img: "/Face_Pack.jpg", // Example price update
       description: "Rejuvenating herbal face pack with Multani Mitti and Sandalwood for clear, radiant skin. Removes impurities and excess oil.",
       howToUse: "Mix 1-2 teaspoons with rose water or milk to form a paste. Apply evenly on cleansed face and neck, avoiding eye area. Leave on for 15-20 minutes until dry. Rinse off with cool water.",
       benefits: ["Deep cleanses pores.", "Controls excess oil and acne.", "Improves skin tone and texture.", "Provides a cooling and soothing effect."],
       ingredients: "Multani Mitti (Fuller's Earth), Sandalwood Powder, Rose Petal Powder, Neem Powder, Turmeric, etc...", rating: 4.8,
       reviews: [{ user: "Sneha P.", text: "Amazing glow after using this!", rating: 5 }]
     },
     {
       id: 4, name: "Jodo Ka Tail", price: '180', quantity: '60ml',  img: "/Jodo_Ka_Tail.jpg", // Example price update
       description: "Warming Ayurvedic massage oil formulated to relieve joint and muscle discomfort. Infused with potent herbs for deep penetration.",
       howToUse: "Warm a small amount of oil slightly. Gently massage onto the affected joints or muscles for 10-15 minutes. Apply 2-3 times a day for best results. Fomentation after massage can enhance benefits.",
       benefits: ["Soothes joint pain and stiffness.", "Reduces muscle soreness and inflammation.", "Improves flexibility and mobility.", "Strengthens bones and muscles."],
       ingredients: "Sesame Oil, Mahanarayan Oil, Gandhapura Oil (Wintergreen), Eucalyptus Oil, Camphor, Ajwain Satva, etc...", rating: 4.3,
       reviews: [{ user: "Vikram R.", text: "Provides good relief from my knee pain.", rating: 4 }]
     },
      {
       id: 5, name: "Kesh Ratn Hair Oil", price: '360', quantity: '100ml', img: "/Kesh_Ratn.jpg", // Example price update
       description: "Nourishing herbal hair oil enriched with Bhringraj and Amla to promote healthy hair growth, reduce hair fall, and prevent premature graying.",
       howToUse: "Gently massage the oil into the scalp using fingertips for 10-15 minutes. Leave it on for at least an hour or preferably overnight. Wash off with a mild herbal shampoo. Use 2-3 times a week.",
       benefits: ["Reduces hair fall and dandruff.", "Promotes stronger and thicker hair growth.", "Nourishes the scalp and hair roots.", "Adds natural shine and softness."],
       ingredients: "Coconut Oil, Sesame Oil, Bhringraj Extract, Amla Extract, Brahmi Extract, Neem Extract, Hibiscus Flower, etc...", rating: 4.6,
       reviews: [{ user: "Neha V.", text: "My hair feels much thicker and healthier!", rating: 5 }, {user: "Rajesh", text: "Reduced my hair fall significantly.", rating: 4}]
     },
     {
       id: 6, name: "Power Churan", price: '340', quantity: '70gm', img: "/Power_Churan.jpg", // Example price update
       description: "An invigorating Ayurvedic blend to boost energy levels, improve stamina, and combat fatigue naturally. Supports overall vitality.",
       howToUse: "Take 1 teaspoon (approx. 3-5g) with a glass of warm milk or water, preferably in the morning.",
       benefits: ["Enhances energy and stamina.", "Reduces physical and mental fatigue.", "Improves concentration and alertness.", "Supports immune function."],
       ingredients: "Ashwagandha, Shatavari, Safed Musli, Kaunch Beej, Gokshura, etc... ", rating: 4.4,
       reviews: [{ user: "Kunal M.", text: "Definitely feel more energetic throughout the day!", rating: 4 }]
     },
     {
       id: 7, name: "Rambaan Tail", price: 180.00, quantity: '60ml', img: "/Rambaan_Tail.jpg", // Example price update
       description: "A multi-purpose Ayurvedic healing oil known for its antiseptic and soothing properties. Effective for minor cuts, burns, and skin irritations.",
       howToUse: "Apply a small amount directly to the affected skin area 2-3 times daily. Can be used for gentle massage.",
       benefits: ["Promotes faster healing of minor wounds.", "Soothes burns and skin inflammation.", "Acts as a natural antiseptic.", "Relieves itching and irritation."],
       ingredients: "Neem Oil, Karanja Oil, Coconut Oil, Turmeric Extract, Camphor, etc...", rating: 4.7,
       reviews: [{ user: "Meera J.", text: "A must-have in my first-aid kit!", rating: 5 }]
     }
];


// --- Page Transition Variants ---
const pageVariants = {
  initial: { opacity: 0, y: 5 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -5 }
};
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.3 };

// --- App Content Structure ---
function AppContent() {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [animationTrigger, setAnimationTrigger] = useState(null);
    const cartIconRef = useRef(null);
    const location = useLocation();

    // Save cart to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Add to Cart Logic
    const addToCart = (product, quantity = 1, triggerElement) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            // Ensure price exists and is a valid number before adding/updating
            const price = typeof product.price === 'number' ? product.price : parseFloat(product.price);
            if (isNaN(price) || price === null) {
                toast.error(`Cannot add ${product.name}: Price information is missing.`);
                console.error(`Invalid price for product ${product.id}:`, product.price);
                return prevCart; // Return previous cart state without changes
            }

            if (existingItem) {
                // Update quantity of existing item
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            // Add new item with validated price
            return [...prevCart, { ...product, quantity, price }];
        });

        // Trigger animation (optional)
        if (triggerElement && cartIconRef.current) {
             const triggerRect = triggerElement.getBoundingClientRect();
             const cartRect = cartIconRef.current.getBoundingClientRect();
             setAnimationTrigger({
                 product,
                 from: { x: triggerRect.left + triggerRect.width / 2, y: triggerRect.top + triggerRect.height / 2 },
                 to: { x: cartRect.left + cartRect.width / 2, y: cartRect.top + cartRect.height / 2 },
             });
             setTimeout(() => setAnimationTrigger(null), 600); // Animation duration
        }

        toast.success(`${quantity} x ${product.name} added to cart!`, {
             position: "bottom-right", autoClose: 2000, hideProgressBar: true,
        });
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white font-sans flex flex-col">
            <Navbar cart={cart} cartIconRef={cartIconRef} />
            <main className="flex-grow container mx-auto px-4 pt-4 pb-8"> {/* Added container and padding */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Routes location={location}>
                            {/* Public Routes */}
                            <Route path="/" element={<ProductList products={products} addToCart={addToCart} />} />
                            <Route path="/products" element={<ProductList products={products} addToCart={addToCart} />} />
                            <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
                            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/contact-us" element={<ContactUs />} />

                            {/* Logged In User Routes (can be accessed by admins too) */}
                            {/* These should ideally be wrapped in a "LoggedInRoute" or checked within the component */}
                            <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
                            <Route path="/my-orders" element={<OrderHistory />} />

                            {/* --- Admin Routes --- */}
                            <Route element={<AdminRoute />}> {/* Parent route for admin */}
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/admin/users" element={<AdminUserList />} />
                                <Route path="/admin/orders" element={<AdminOrderList />} />
                                {/* Add more specific admin routes here if needed */}
                            </Route>
                            {/* --- End Admin Routes --- */}

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            {/* Cart Animation Element */}
             {animationTrigger && (
                 <motion.img
                     src={animationTrigger.product.img}
                     alt="" // Decorative
                     initial={{
                         x: animationTrigger.from.x, y: animationTrigger.from.y,
                         scale: 0.5, opacity: 0.8, rotate: 0, position: 'fixed', zIndex: 1000,
                         width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover',
                         pointerEvents: 'none', border: '2px solid white'
                     }}
                     animate={{
                         x: animationTrigger.to.x, y: animationTrigger.to.y,
                         scale: 0.1, opacity: 0, rotate: 360
                     }}
                     transition={{ duration: 0.6, ease: "easeInOut" }}
                 />
             )}
             {/* Toast Container now placed in App */}
        </div>
    );
}

// --- Navbar Component ---
function Navbar({ cart, cartIconRef }) {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, loading } = useAuth(); // Use auth context
    const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0); // Safer reduce

    const handleLogout = () => { // No need for async if context logout isn't async
        logout(); // Call logout from context
        setIsOpen(false);
    };

    // Link styles
    const activeClassName = "text-yellow-300 border-b-2 border-yellow-300";
    const baseLinkClassName = "px-3 py-2 rounded-md text-sm font-medium hover:text-yellow-200 transition duration-200 ease-in-out";
    const mobileActiveClassName = 'bg-green-800 text-white';
    const mobileBaseLinkClassName = 'block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-green-600 hover:text-white';

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-md sticky top-0 z-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center text-xl md:text-2xl font-bold tracking-tight hover:opacity-90 transition duration-300" onClick={() => setIsOpen(false)}>
                        <img src="/logo.jpg" alt="Saatwik Aayurveda Logo" className="h-10 w-auto mr-2 rounded-full" />
                        Saatwik Aayurveda
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <NavLink to="/products" className={({ isActive }) => `${baseLinkClassName} ${isActive ? activeClassName : 'border-b-2 border-transparent'}`}>Products</NavLink>
                        <NavLink to="/contact-us" className={({ isActive }) => `flex items-center ${baseLinkClassName} ${isActive ? activeClassName : 'border-b-2 border-transparent'}`}><FaPhoneAlt className="mr-1 h-4 w-4"/> Contact Us</NavLink>

                        {/* === Conditionally show Admin Link === */}
                        {user && user.isAdmin && (
                             <NavLink to="/admin" className={({ isActive }) => `flex items-center ${baseLinkClassName} ${isActive ? activeClassName : 'border-b-2 border-transparent'}`}>
                                 <FaUserShield className="mr-1.5 h-4 w-4"/> Admin Panel
                             </NavLink>
                         )}
                        {/* === End Admin Link === */}

                        <NavLink to="/cart" className={({ isActive }) => `relative flex items-center ${baseLinkClassName} ${isActive ? activeClassName : 'border-b-2 border-transparent'}`} ref={cartIconRef}>
                            <FaShoppingCart className="mr-1 h-4 w-4" /> Cart
                            {totalCartItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{totalCartItems}</span>
                            )}
                        </NavLink>

                        {/* Auth Links - Desktop */}
                        {loading ? (<span className="text-sm px-3 py-2 animate-pulse">...</span>
                        ) : user ? (
                            <>
                                <NavLink to="/my-orders" className={({ isActive }) => `flex items-center ${baseLinkClassName} ${isActive ? activeClassName : 'border-b-2 border-transparent'}`}><FaBoxOpen className="mr-1 h-4 w-4"/> My Orders</NavLink>
                                <div className="flex items-center space-x-3 pl-3 border-l border-green-500/50">
                                    <span className="flex items-center text-sm font-medium text-yellow-100/90" title={user.isAdmin ? 'Admin User' : 'User'}><FaUserCircle className={`mr-1.5 h-5 w-5 ${user.isAdmin ? 'text-yellow-300' : ''}`} /> {user.username}</span>
                                    <button onClick={handleLogout} className="flex items-center bg-yellow-400 text-green-900 px-3 py-1 rounded-md hover:bg-yellow-300 transition duration-200 shadow-sm text-xs font-semibold" title="Logout"><FaSignOutAlt className="mr-1 h-4 w-4" /> Logout</button>
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="ml-4 bg-yellow-400 text-green-900 px-4 py-1.5 rounded-md hover:bg-yellow-300 transition duration-200 shadow-sm text-sm font-semibold">Login / Sign Up</Link>
                        )}
                    </div>

                    {/* Mobile Menu Button Area */}
                    <div className="md:hidden flex items-center">
                         <NavLink to="/cart" className="relative p-2 mr-2 text-gray-200 hover:text-white focus:outline-none" ref={cartIconRef} onClick={() => setIsOpen(false)}>
                            <FaShoppingCart className="h-6 w-6" />
                            {totalCartItems > 0 && (<span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{totalCartItems}</span>)}
                        </NavLink>
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-200 hover:text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={isOpen}>
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="md:hidden absolute top-full left-0 w-full bg-green-700 shadow-lg z-40 overflow-hidden" id="mobile-menu">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <NavLink to="/products" onClick={() => setIsOpen(false)} className={({ isActive }) => `${mobileBaseLinkClassName} ${isActive ? mobileActiveClassName : ''}`}>Products</NavLink>
                            <NavLink to="/contact-us" onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center ${mobileBaseLinkClassName} ${isActive ? mobileActiveClassName : ''}`}><FaPhoneAlt className="mr-2 h-4 w-4" /> Contact Us</NavLink>

                            {/* === Conditionally show Admin Link (Mobile) === */}
                            {user && user.isAdmin && (
                                <NavLink to="/admin" onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center ${mobileBaseLinkClassName} ${isActive ? mobileActiveClassName : ''}`}>
                                    <FaUserShield className="mr-2 h-4 w-4" /> Admin Panel
                                </NavLink>
                             )}
                             {/* === End Admin Link === */}

                            {/* Auth Links - Mobile */}
                            <div className="pt-4 pb-3 border-t border-green-600/50">
                                {loading ? (<div className="px-3 py-2 text-gray-300 text-sm animate-pulse">...</div>
                                ) : user ? (
                                    <div className="space-y-1">
                                         <div className="flex items-center px-3 mb-2">
                                            <FaUserCircle className={`h-8 w-8 mr-2 flex-shrink-0 ${user.isAdmin ? 'text-yellow-300' : 'text-yellow-200'}`}/>
                                            <div><div className="text-base font-medium leading-none text-white">{user.username}</div></div>
                                        </div>
                                        <NavLink to="/my-orders" onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center ${mobileBaseLinkClassName} ${isActive ? mobileActiveClassName : ''}`}><FaBoxOpen className="mr-2 h-4 w-4" /> My Orders</NavLink>
                                        <button onClick={handleLogout} className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-green-600 hover:text-white"><FaSignOutAlt className="mr-2 h-4 w-4" /> Logout</button>
                                    </div>
                                ) : (
                                    <NavLink to="/login" onClick={() => setIsOpen(false)} className={({ isActive }) => `${mobileBaseLinkClassName} ${isActive ? mobileActiveClassName : ''}`}>Login / Sign Up</NavLink>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

// --- Footer Component ---
function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-600 text-sm py-6 mt-10 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; {new Date().getFullYear()} Saatwik Aayurveda. All Rights Reserved.</p>
                 {/* <div className="mt-2">
                     <Link to="/privacy" className="hover:text-green-700 mx-2">Privacy Policy</Link>
                     <Link to="/terms" className="hover:text-green-700 mx-2">Terms of Service</Link>
                 </div> */}
            </div>
        </footer>
    );
}

// --- Root App Component ---
function App() {
    return (
        <AuthProvider> {/* AuthProvider wraps everything */}
            <AppContent /> {/* AppContent contains Navbar, Routes, Footer */}
            {/* ToastContainer setup */}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                limit={3} // Limit number of toasts displayed
            />
        </AuthProvider>
    );
}

export default App;