// src/components/ContactUs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaWhatsapp, FaUserMd, FaSeedling, FaBookOpen, FaHandsHelping, FaOm, FaQuoteLeft, FaPhoneAlt } from 'react-icons/fa'; // Added FaPhoneAlt for consistency

function ContactUs() {
    const imagePath = "/logo.jpg";

    const formatWhatsAppNumber = (number) => {
        let cleanedNumber = number.replace(/\s+/g, '');
        if (!cleanedNumber.startsWith('91')) {
            cleanedNumber = '91' + cleanedNumber;
        }
        return cleanedNumber;
    };

    const phoneNumber1 = "90455 88110";
    const phoneNumber2 = "94122 19854";

    const sectionAnimation = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: "easeOut" }
    };

    const itemAnimation = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" }
    };

    const cardHoverEffect = {
        scale: 1.03,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.3 }
    };

    const journeyCardStyle = "bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 p-6 md:p-8 hover:shadow-2xl transition-shadow duration-300";
    const journeyIconStyle = "text-green-600 text-3xl md:text-4xl mb-4";

    return (
        <>
            {/* Section 1: Connect With Us */}
            <motion.section
                initial={sectionAnimation.initial}
                animate={sectionAnimation.animate}
                transition={sectionAnimation.transition}
                className="max-w-5xl mx-auto py-16 md:py-20 px-4 sm:px-6 lg:px-8"
            >
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Connect With Us
                    </h2>
                    <motion.p
                        initial={itemAnimation.initial}
                        animate={itemAnimation.animate}
                        transition={{ ...itemAnimation.transition, delay: 0.2 }}
                        className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                    >
                        Welcome to Saatwik Aayurveda. Guided by divine grace and the wisdom of our elders, we are dedicated to sharing the profound benefits of authentic Ayurveda. Our purpose extends beyond commerce; we aim to reconnect our community with the ancient knowledge of the Vedas and traditional healing practices. We invite you to explore our offerings and reach out if you have any questions or need assistance. Your well-being is our utmost priority, and we hope our carefully crafted medicines bring you health and harmony.
                    </motion.p>
                </div>

                <motion.div
                    initial={itemAnimation.initial}
                    animate={itemAnimation.animate}
                    transition={{ ...itemAnimation.transition, delay: 0.4 }}
                    whileHover={cardHoverEffect}
                    className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-2xl overflow-hidden border border-gray-200 md:flex items-stretch"
                >
                    <div className="md:w-2/5 p-6 flex justify-center items-center bg-white md:rounded-l-xl">
                        <img
                            src={imagePath}
                            alt="Saatwik Aayurveda Logo"
                            className="object-contain w-full max-w-xs sm:max-w-sm md:max-w-md max-h-72 md:max-h-full"
                            loading="lazy"
                        />
                    </div>

                    <div className="md:w-3/5 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                        <div className="mb-6 text-center md:text-left">
                            <span className="text-xl md:text-2xl font-semibold text-green-700 block mb-1">
                                Our Founder
                            </span>
                            <h3 className="text-3xl md:text-4xl font-bold text-green-800 flex items-center justify-center md:justify-start">
                                <FaUserMd className="mr-3 text-green-600 flex-shrink-0 h-8 w-8" />
                                Mr. Panchal
                            </h3>
                        </div>
                        {/* New Descriptive Text */}
                        <motion.p
                            initial={itemAnimation.initial}
                            animate={itemAnimation.animate}
                            transition={{ ...itemAnimation.transition, delay: 0.5 }}
                            className="text-gray-700 mb-6 text-center md:text-left text-base leading-relaxed"
                        >
                            For any queries regarding our products, Ayurvedic consultations, or if you need any assistance, please feel free to connect with us through the channels below:
                        </motion.p>

                        <div className="space-y-5 text-gray-700">
                            <a href="mailto:Saatwikaayurveda2790@gmail.com" className="flex items-start text-lg hover:text-green-800 transition-colors group py-2 border-b border-green-100 hover:border-green-300">
                                <FaEnvelope className="mr-4 h-7 w-7 text-green-500 group-hover:text-green-700 transition-colors flex-shrink-0 mt-1" />
                                <span className="font-medium break-all">Saatwikaayurveda2790@gmail.com</span> {/* Added break-all for better wrapping */}
                            </a>
                            <a
                               href={`https://wa.me/${formatWhatsAppNumber(phoneNumber1)}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center text-lg hover:text-green-800 transition-colors group py-2 border-b border-green-100 hover:border-green-300"
                            >
                                <FaWhatsapp className="mr-4 h-7 w-7 text-green-500 group-hover:text-green-700 transition-colors flex-shrink-0" />
                                <span className="font-medium">{phoneNumber1}</span>
                            </a>
                            <a
                               href={`https://wa.me/${formatWhatsAppNumber(phoneNumber2)}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center text-lg hover:text-green-800 transition-colors group py-2" // Last item, no border bottom
                            >
                                <FaWhatsapp className="mr-4 h-7 w-7 text-green-500 group-hover:text-green-700 transition-colors flex-shrink-0" />
                                <span className="font-medium">{phoneNumber2}</span>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Section 2: Our Founder's Journey */}
            <motion.section
                initial={sectionAnimation.initial}
                animate={sectionAnimation.animate}
                transition={{ ...sectionAnimation.transition, delay: 0.2 }}
                className="py-16 md:py-20 bg-slate-50"
            >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 md:mb-16">
                        <FaBookOpen className="mx-auto text-green-600 h-12 w-12 mb-4" />
                        <h2 className="text-4xl md:text-5xl font-bold text-green-800">
                            Our Founder's Journey
                        </h2>
                    </div>

                    <motion.p
                        {...itemAnimation}
                        transition={{ ...itemAnimation.transition, delay: 0.3 }}
                        className="text-center text-gray-700 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed italic"
                    >
                        <FaOm className="inline mr-2 text-green-500" />
                        "It begins with <strong>Om</strong>, a recognition of the infinite grace of the Divine and the cherished blessings of our elders. This spiritual foundation is the very seed from which Saatwik Aayurveda blossomed."
                    </motion.p>

                    <div className="grid md:grid-cols-1 gap-8 md:gap-10">
                        <motion.div
                            initial={itemAnimation.initial}
                            animate={itemAnimation.animate}
                            transition={{ ...itemAnimation.transition, delay: 0.5 }}
                            whileHover={cardHoverEffect}
                            className={journeyCardStyle}
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center">
                                <FaSeedling className={`${journeyIconStyle} md:mr-6 mb-4 md:mb-0`} />
                                <div className="flex-1">
                                    <h4 className="text-2xl font-semibold text-green-700 mb-3">
                                        A Lifetime of Dedication and Learning
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed mb-3">
                                        Our founder, Mr. Panchal, comes from a background rich in learning and service. After completing postgraduate studies in two subjects and a B.Ed., he dedicated <strong className="text-green-700">three decades to the field of education</strong>, serving as both a teacher and a principal. Throughout these years, his commitment to students, parents, and society was marked by unwavering devotion, truthfulness, and discipline, all while dutifully caring for his family.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        Parallel to this distinguished career, a profound aspiration to contribute more deeply to societal well-being grew. This led to an intensive, <strong className="text-green-700">two-decade-long study of the Atharva Veda</strong>, meticulously exploring interpretations by seven different scholars in both Hindi and English. This deep immersion into ancient wisdom ignited a desire to embark on a unique path.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={itemAnimation.initial}
                            animate={itemAnimation.animate}
                            transition={{ ...itemAnimation.transition, delay: 0.7 }}
                            whileHover={cardHoverEffect}
                            className={journeyCardStyle}
                        >
                             <div className="flex flex-col md:flex-row items-start md:items-center">
                                <FaBookOpen className={`${journeyIconStyle} md:mr-6 mb-4 md:mb-0`} />
                                <div className="flex-1">
                                    <h4 className="text-2xl font-semibold text-green-700 mb-3">
                                        A Legacy of Healing
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        Inspiration also flowed from a precious family heritage: a handwritten book of Ayurvedic remedies penned <strong className="text-green-700">75 years ago by Mr. Panchal's grandfather</strong>, a respected headmaster of his time. This treasured volume, detailing treatments for over 450 ailments using herbal wisdom, remains a guiding light for Saatwik Aayurveda.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={itemAnimation.initial}
                            animate={itemAnimation.animate}
                            transition={{ ...itemAnimation.transition, delay: 0.9 }}
                            whileHover={cardHoverEffect}
                            className={journeyCardStyle}
                        >
                             <div className="flex flex-col md:flex-row items-start md:items-center">
                                <FaHandsHelping className={`${journeyIconStyle} md:mr-6 mb-4 md:mb-0`} />
                                <div className="flex-1">
                                    <h4 className="text-2xl font-semibold text-green-700 mb-3">
                                        The Path to Pure Ayurveda
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed mb-3">
                                        Fueled by the profound knowledge of the Atharva Veda and this ancestral legacy, the decision was made: to create authentic Ayurvedic medicines, uncompromising in their purity and efficacy.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                       For <strong className="text-green-700">three decades, these formulations were carefully tested and refined</strong>, shared with family and acquaintances, and their positive effects meticulously documented.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                     <motion.p
                        initial={itemAnimation.initial}
                        animate={itemAnimation.animate}
                        transition={{ ...itemAnimation.transition, delay: 1.1 }}
                        className="mt-12 text-center text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                    >
                        After years of dedicated study, rigorous testing, and accumulated experience, Saatwik Aayurveda is now honored to present these time-honored medicines to the wider community. We sincerely hope they bring you the health and well-being you seek.
                    </motion.p>
                </div>
            </motion.section>

            {/* Section 3: Our Guiding Philosophy */}
            <motion.section
                initial={sectionAnimation.initial}
                animate={sectionAnimation.animate}
                transition={{ ...sectionAnimation.transition, delay: 0.2 }}
                className="py-16 md:py-20"
            >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={itemAnimation.initial}
                        animate={itemAnimation.animate}
                        transition={{ ...itemAnimation.transition, delay: 0.4 }}
                        className="p-8 md:p-10 bg-green-700 text-white rounded-xl shadow-2xl border-4 border-green-600"
                    >
                        <FaQuoteLeft className="text-green-300 text-4xl md:text-5xl mb-6" />
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Guiding Philosophy</h3>
                        <div className="space-y-5 text-green-50 leading-relaxed text-lg">
                            <p>
                                The mission of Saatwik Aayurveda transcends mere financial gain, for we believe that material rewards are preordained. Our true aim is to reacquaint the people of our nation with the timeless wisdom of the Vedas and the holistic principles of Ayurveda.
                            </p>
                            <p>
                                We aspire to inspire future generations to connect with the profound knowledge of our sages and ancestors. We are driven by a deep love for our country and a commitment to its people.
                            </p>
                            <p className="mt-6 font-semibold text-xl text-center text-green-200">
                                Thank you for being a part of our journey.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </>
    );
}

export default ContactUs;