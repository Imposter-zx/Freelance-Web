import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  ...props 
}) => {
    const baseClasses = 'font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200',
        success: 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200',
    };

    return (
        <motion.button
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default AnimatedButton;
