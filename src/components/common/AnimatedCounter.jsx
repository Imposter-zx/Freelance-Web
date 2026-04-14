import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 2, delay = 0, suffix = '', prefix = '' }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => {
        // Handle potential strings or floats
        const numValue = typeof latest === 'number' ? Math.round(latest) : 0;
        return prefix + numValue.toLocaleString() + suffix;
    });
    
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, value, {
                duration,
                delay,
                ease: [0.33, 1, 0.68, 1], // Custom cubic-bezier for premium feel
            });
            return controls.stop;
        }
    }, [isInView, value, duration, delay, count]);

    return (
        <motion.span ref={ref} className="tabular-nums">
            {rounded}
        </motion.span>
    );
};

export default AnimatedCounter;
