// src/components/Modal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { y: "-50px", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { delay: 0.1, type: 'spring', stiffness: 100 } },
    exit: { y: "50px", opacity: 0 }
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => { // Added size prop
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose} // Close on backdrop click
                >
                    <motion.div
                        className={`bg-white rounded-lg shadow-xl overflow-hidden w-full ${sizeClasses[size] || sizeClasses['md']}`} // Apply size class
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                aria-label="Close modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;