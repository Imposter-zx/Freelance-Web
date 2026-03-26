import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ label, value, icon, color, trend, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            className="bg-bg-main p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
        >
            {/* Animated background gradient */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <motion.div
                        className={`${color} text-white p-3 rounded-xl`}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {icon}
                    </motion.div>
                    {trend && (
                        <motion.span
                            className={`text-xs font-bold px-2 py-1 rounded-md ${
                                trend.startsWith('+') ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
                            }`}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: delay + 0.2, type: "spring" }}
                        >
                            {trend}
                        </motion.span>
                    )}
                </div>
                <h3 className="text-text-soft text-sm font-medium">{label}</h3>
                <motion.p
                    className="text-2xl font-bold font-outfit mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: delay + 0.3 }}
                >
                    {value}
                </motion.p>
            </div>
        </motion.div>
    );
};

export default StatsCard;
