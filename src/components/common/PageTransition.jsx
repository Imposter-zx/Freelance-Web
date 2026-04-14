import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
    const pageVariants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        enter: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            },
        },
    };

    return (
        <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
