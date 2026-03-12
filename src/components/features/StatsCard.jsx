import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ label, value, icon, color, trend, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-bg-main p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`${color} text-white p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        trend.startsWith('+') ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
                    }`}>
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-text-soft text-sm font-medium">{label}</h3>
            <p className="text-2xl font-bold font-outfit">{value}</p>
        </motion.div>
    );
};

export default StatsCard;
