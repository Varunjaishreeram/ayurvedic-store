// src/components/ContactUs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaWhatsapp, FaUserMd, FaSeedling, FaBookOpen, FaHandsHelping } from 'react-icons/fa';

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
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const itemAnimation = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.2 }
    };

    return (
        <>
            <motion.section
                initial={sectionAnimation.initial}
                animate={sectionAnimation.animate}
                transition={sectionAnimation.transition}
                className="max-w-4xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
                    Connect With Us
                </h2>
                <motion.p
                    initial={itemAnimation.initial}
                    animate={itemAnimation.animate}
                    transition={itemAnimation.transition}
                    className="text-center text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto text-lg"
                >
                    Welcome to Saatwik Aayurveda. Guided by divine grace and the wisdom of our elders, we are dedicated to sharing the profound benefits of authentic Ayurveda. Our purpose extends beyond commerce; we aim to reconnect our community with the ancient knowledge of the Vedas and traditional healing practices. We invite you to explore our offerings and reach out if you have any questions or need assistance. Your well-being is our utmost priority, and we hope our carefully crafted medicines bring you health and harmony.
                </motion.p>

                <motion.div
                    initial={itemAnimation.initial}
                    animate={itemAnimation.animate}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 md:flex"
                >
                    {/* Image Section - Adjusted */}
                    <div className="md:w-1/2 p-4 flex justify-center items-center bg-gray-50 md:rounded-l-xl">
                        <img
                            src={imagePath}
                            alt="Saatwik Aayurveda Logo"
                            className="object-contain max-w-full max-h-64 sm:max-h-72 md:max-h-80 lg:max-h-96" // Adjusted for decent size
                            loading="lazy"
                        />
                    </div>

                    {/* Details Section - Adjusted for Founder Title */}
                    <div className="md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 md:rounded-r-xl">
                        <div className="mb-6 text-center md:text-left">
                            <span className="text-lg md:text-xl font-medium text-green-700 block">
                                Our Founder
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold text-green-800 mt-1 flex items-center justify-center md:justify-start">
                                <FaUserMd className="mr-3 text-green-600 flex-shrink-0 h-7 w-7" />
                                Mr. Panchal
                            </h3>
                        </div>
                        <div className="space-y-6 text-gray-700">
                            <a href="mailto:Saatwikaayurveda2790@gmail.com" className="flex items-center text-lg hover:text-green-700 transition-colors group">
                                <FaEnvelope className="mr-4 h-6 w-6 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
                                <span>Saatwikaayurveda2790@gmail.com</span>
                            </a>
                            <a
                               href={`https://wa.me/${formatWhatsAppNumber(phoneNumber1)}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center text-lg hover:text-green-700 transition-colors group"
                            >
                                <FaWhatsapp className="mr-4 h-6 w-6 text-green-500 group-hover:text-green-600 transition-colors flex-shrink-0" />
                                <span>{phoneNumber1}</span>
                            </a>
                            <a
                               href={`https://wa.me/${formatWhatsAppNumber(phoneNumber2)}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center text-lg hover:text-green-700 transition-colors group"
                            >
                                <FaWhatsapp className="mr-4 h-6 w-6 text-green-500 group-hover:text-green-600 transition-colors flex-shrink-0" />
                                <span>{phoneNumber2}</span>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </motion.section>

            <motion.section
                initial={sectionAnimation.initial}
                animate={sectionAnimation.animate}
                transition={{ ...sectionAnimation.transition, delay: 0.2 }}
                className="max-w-4xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 rounded-xl shadow-lg my-12 md:my-16"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-10 flex items-center justify-center">
                    <FaBookOpen className="mr-3 text-green-600 h-8 w-8" />
                    Our Founder's Journey
                </h2>
                <div className="space-y-6 text-gray-700 leading-relaxed md:text-lg">
                    <motion.p {...itemAnimation}>
                        It begins with <strong>Om</strong>, a recognition of the infinite grace of the Divine and the cherished blessings of our elders. This spiritual foundation is the very seed from which Saatwik Aayurveda blossomed.
                    </motion.p>
                    <motion.div {...itemAnimation} className="mt-6 p-6 bg-white rounded-lg shadow-md border border-green-100">
                        <h4 className="text-xl font-semibold text-green-700 mb-3 flex items-center">
                            <FaSeedling className="mr-2 text-green-500" /> A Lifetime of Dedication and Learning
                        </h4>
                        <p className="mb-2">
                            Our founder, Mr. Panchal, comes from a background rich in learning and service. After completing postgraduate studies in two subjects and a B.Ed., he dedicated three decades to the field of education, serving as both a teacher and a principal. Throughout these years, his commitment to students, parents, and society was marked by unwavering devotion, truthfulness, and discipline, all while dutifully caring for his family.
                        </p>
                        <p>
                            Parallel to this distinguished career, a profound aspiration to contribute more deeply to societal well-being grew. This led to an intensive, two-decade-long study of the Atharva Veda, meticulously exploring interpretations by seven different scholars in both Hindi and English. This deep immersion into ancient wisdom ignited a desire to embark on a unique path.
                        </p>
                    </motion.div>
                    <motion.div {...itemAnimation} className="mt-6 p-6 bg-white rounded-lg shadow-md border border-green-100">
                        <h4 className="text-xl font-semibold text-green-700 mb-3 flex items-center">
                            <FaBookOpen className="mr-2 text-green-500" /> A Legacy of Healing
                        </h4>
                        <p>
                            Inspiration also flowed from a precious family heritage: a handwritten book of Ayurvedic remedies penned 75 years ago by Mr. Panchal's grandfather, a respected headmaster of his time. This treasured volume, detailing treatments for over 450 ailments using herbal wisdom, remains a guiding light for Saatwik Aayurveda.
                        </p>
                    </motion.div>
                     <motion.div {...itemAnimation} className="mt-6 p-6 bg-white rounded-lg shadow-md border border-green-100">
                        <h4 className="text-xl font-semibold text-green-700 mb-3 flex items-center">
                           <FaHandsHelping className="mr-2 text-green-500" /> The Path to Pure Ayurveda
                        </h4>
                        <p className="mb-2">
                            Fueled by the profound knowledge of the Atharva Veda and this ancestral legacy, the decision was made: to create authentic Ayurvedic medicines, uncompromising in their purity and efficacy.
                        </p>
                        <p>
                           For three decades, these formulations were carefully tested and refined, shared with family and acquaintances, and their positive effects meticulously documented.
                        </p>
                    </motion.div>
                    <motion.p {...itemAnimation} className="mt-4">
                        After years of dedicated study, rigorous testing, and accumulated experience, Saatwik Aayurveda is now honored to present these time-honored medicines to the wider community. We sincerely hope they bring you the health and well-being you seek.
                    </motion.p>
                    <motion.div {...itemAnimation} className="mt-8 p-6 bg-green-50 rounded-lg shadow border border-green-200 text-center">
                        <h4 className="text-xl font-semibold text-green-700 mb-3">Our Guiding Philosophy</h4>
                        <p className="mb-2">
                            The mission of Saatwik Aayurveda transcends mere financial gain, for we believe that material rewards are preordained. Our true aim is to reacquaint the people of our nation with the timeless wisdom of the Vedas and the holistic principles of Ayurveda.
                        </p>
                        <p>
                            We aspire to inspire future generations to connect with the profound knowledge of our sages and ancestors. We are driven by a deep love for our country and a commitment to its people.
                        </p>
                        <p className="mt-4 font-medium text-green-800">
                            Thank you for being a part of our journey.
                        </p>
                    </motion.div>
                </div>
            </motion.section>
        </>
    );
}

export default ContactUs;