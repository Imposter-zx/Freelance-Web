import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    const colors = {
        blue: 'text-blue-600',
        white: 'text-white',
        gray: 'text-gray-500'
    };

    const containerVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const spinnerVariants = {
        animate: (i) => ({
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
            }
        })
    };

    return (
        <div className="flex items-center justify-center">
            <motion.div
                className={`${sizes[size]} relative`}
                variants={containerVariants}
                animate="animate"
            >
                {/* Rotating outer circle */}
                <motion.div
                    className={`absolute inset-0 border-2 ${colors[color]} border-transparent border-t-current rounded-full`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Pulsing center dot */}
                <motion.div
                    className={`absolute inset-0 flex items-center justify-center`}
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <div className={`w-2 h-2 rounded-full ${colors[color]}`} />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;
