import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../common/AnimatedCounter';

const StatsCard = ({ label, value, icon, color, delay = 0, suffix = '', prefix = '' }) => {
    const numericValue =
        typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay, duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-bg-main p-5 shadow-card"
        >
            <div className="flex items-center justify-between">
                <span className={`${color} rounded-xl p-2.5 text-white`}>{icon}</span>
                <span className="text-3xl font-bold text-text-main/10" aria-hidden="true">
                    {typeof value === 'number' ? value : ''}
                </span>
            </div>
            <p className="mt-4 text-sm font-medium text-text-soft">{label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-text-main">
                <AnimatedCounter
                    value={Number.isFinite(numericValue) ? numericValue : 0}
                    delay={delay + 0.2}
                    prefix={prefix}
                    suffix={suffix || (typeof value === 'string' && value.includes('€') ? '€' : '')}
                />
            </p>
        </motion.div>
    );
};

export default StatsCard;
