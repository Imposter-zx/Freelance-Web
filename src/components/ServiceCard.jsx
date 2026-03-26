import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ title, description, icon, image }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            onHoverStart={() => setIsExpanded(true)}
            onHoverEnd={() => setIsExpanded(false)}
            className="flex-1 min-w-[280px] bg-bg-main dark:bg-dark-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group cursor-pointer relative"
        >
            {/* Image Background (if provided) */}
            {image && (
                <motion.div
                    className="h-40 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30"
                    animate={{ scale: isExpanded ? 1.05 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <img 
                        src={image} 
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            )}

            {/* Content Section */}
            <div className="p-8">
                {/* Icon */}
                <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mb-5 text-blue-600 dark:text-blue-400"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    {icon}
                </motion.div>

                {/* Title */}
                <motion.h3
                    className="text-lg font-bold font-outfit mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {title}
                </motion.h3>

                {/* Description */}
                <motion.p
                    className="text-sm text-text-soft leading-relaxed mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    {description}
                </motion.p>

                {/* View More Link */}
                <motion.div
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm group/link"
                    animate={{ x: isExpanded ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    View More
                    <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <ArrowRight size={16} />
                    </motion.div>
                </motion.div>
            </div>

            {/* Animated Border */}
            <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{ width: '100%' }}
            />

            {/* Hover Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-0 pointer-events-none"
                animate={{ opacity: isExpanded ? 0.05 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
};

export default ServiceCard;
