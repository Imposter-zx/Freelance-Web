import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fadeInUp, float } from '../utils/animations';

const Hero = () => {
    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 0.2, ease: "easeOut" }
        }
    };

    const subtitleVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.6, delay: 0.4, ease: "easeOut" }
        }
    };

    const badgeVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const buttonsVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-white">
            {/* Animated background blobs */}
            <motion.div 
                className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none"
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
                className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[120px] opacity-60 pointer-events-none"
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div 
                className="relative z-10 max-w-3xl mx-auto"
                initial="hidden"
                animate="visible"
            >
                {/* Badge with animation */}
                <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6 border border-blue-100"
                    variants={badgeVariants}
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    ✨ 150+ freelances actifs aujourd'hui
                </motion.div>

                {/* Title with staggered word animation */}
                <motion.h1 
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900"
                    variants={titleVariants}
                >
                    {["La", "plateforme", "élite", "pour", "vos"].map((word, i) => (
                        <motion.span 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i + 0.5, duration: 0.5 }}
                            className="inline-block mr-3"
                        >
                            {word}
                        </motion.span>
                    ))}
                    <motion.span 
                        className="text-blue-600 inline-block underline-hover"
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        projets
                    </motion.span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                    className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed"
                    variants={subtitleVariants}
                >
                    Travaillez avec des experts ou postez votre projet en quelques clics.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    variants={buttonsVariants}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/search"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-blue-200 w-full sm:w-auto justify-center btn-glow group"
                        >
                            <span className="group-hover:translate-x-1 transition-transform">Je cherche un freelance</span>
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <ArrowRight size={20} />
                            </motion.div>
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/work"
                            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-4 rounded-2xl text-lg border border-gray-200 hover:border-blue-300 transition-all w-full sm:w-auto justify-center hover-lift"
                        >
                            Je veux travailler
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                    className="absolute left-10 top-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="absolute right-10 bottom-1/4 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-2xl"
                    animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
            </motion.div>
        </section>
    );
};

export default Hero;
