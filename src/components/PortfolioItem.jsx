import React from 'react';
import { motion } from 'framer-motion';

const PortfolioItem = ({ title, image }) => {
    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-md hover:shadow-2xl transition-shadow"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
        >
            {/* Image with zoom effect */}
            <motion.img
                src={image}
                alt={title}
                className="w-full h-52 object-cover"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.6 }}
            />

            {/* Enhanced Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Title with animation */}
                <motion.span
                    className="text-white font-bold text-lg tracking-wide drop-shadow-lg text-center px-4"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {title}
                </motion.span>

                {/* Animated CTA button */}
                <motion.button
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Voir le projet
                </motion.button>
            </motion.div>

            {/* Corner accent decoration */}
            <motion.div
                className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-0 group-hover:opacity-10 blur-2xl rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
            />
        </motion.div>
    );
};

export default PortfolioItem;
