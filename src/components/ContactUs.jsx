// src/components/ContactUs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaWhatsapp, FaUserMd } from 'react-icons/fa'; // Import FaWhatsapp

function ContactUs() {
    const imagePath = "/logo.jpg"; // Image already used in LaunchBanner

    // Function to format phone number for WhatsApp link (removes spaces, adds country code if needed)
    const formatWhatsAppNumber = (number) => {
        let cleanedNumber = number.replace(/\s+/g, ''); // Remove spaces
        // Add country code if it's not already there (assuming Indian numbers)
        if (!cleanedNumber.startsWith('91')) {
            cleanedNumber = '91' + cleanedNumber;
        }
        return cleanedNumber;
    };

    const phoneNumber1 = "90455 88110";
    const phoneNumber2 = "94122 19854";

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8" // Increased max-width slightly
        >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
                Get In Touch
            </h2>
            {/* Added engaging text */}
            <p className="text-center text-gray-600 mb-8 md:mb-12 max-w-xl mx-auto">
                Have questions about our Ayurvedic products or need assistance? We're here to help! Feel free to reach out via email or WhatsApp, and we'll get back to you as soon as possible. Your well-being is our priority.
            </p>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 md:flex">
                {/* Image Section */}
                <div className="md:w-1/2">
                    {/* Use the celebration image */}
                    <img
                        src={imagePath}
                        alt="Contact Saatwik Aayurveda"
                        className="w-full h-64 md:h-full object-cover"
                        loading="lazy"
                        style={{ 
                         }} // Slightly dimmed for better text contrast
                    />
                </div>

                {/* Details Section */}
                <div className="md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold text-green-800 mb-6 flex items-center">
                        <FaUserMd className="mr-3 text-green-600 flex-shrink-0" /> {/* Doctor Icon */}
                        Mr. Panchal
                    </h3>
                    <div className="space-y-5 text-gray-700"> {/* Increased spacing */}
                        {/* Email Link */}
                        <a href="mailto:Saatwikaayurveda2790@gmail.com" className="flex items-center hover:text-green-700 transition-colors group">
                            <FaEnvelope className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
                            <span>Saatwikaayurveda2790@gmail.com</span>
                        </a>

                        {/* WhatsApp Link 1 */}
                        <a
                           href={`https://wa.me/${formatWhatsAppNumber(phoneNumber1)}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center hover:text-green-700 transition-colors group"
                        >
                            <FaWhatsapp className="mr-3 h-5 w-5 text-green-500 group-hover:text-green-600 transition-colors flex-shrink-0" />
                            <span>{phoneNumber1}</span>
                        </a>

                        {/* WhatsApp Link 2 */}
                        <a
                           href={`https://wa.me/${formatWhatsAppNumber(phoneNumber2)}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center hover:text-green-700 transition-colors group"
                        >
                            <FaWhatsapp className="mr-3 h-5 w-5 text-green-500 group-hover:text-green-600 transition-colors flex-shrink-0" />
                            <span>{phoneNumber2}</span>
                        </a>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

export default ContactUs;