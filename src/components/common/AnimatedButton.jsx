import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const AnimatedButton = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    type = 'button',
    ...props
}) => {
    const prefersReducedMotion = useReducedMotion();

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const variantClasses = {
        primary:
            'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/60 hover:from-blue-700 hover:to-indigo-700 dark:shadow-blue-950/40',
        secondary:
            'border border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
        danger:
            'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-red-200/60 hover:from-rose-700 hover:to-red-700',
        success:
            'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-200/60 hover:from-emerald-700 hover:to-green-700',
        ghost:
            'border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 dark:border-blue-900/60 dark:bg-slate-900 dark:text-blue-200 dark:hover:bg-slate-800',
    };

    const motionProps = prefersReducedMotion
        ? {}
        : {
              whileHover: disabled || loading ? undefined : { scale: 1.02, y: -1 },
              whileTap: disabled || loading ? undefined : { scale: 0.98 },
              transition: { type: 'spring', stiffness: 380, damping: 18 },
          };

    return (
        <motion.button
            type={type}
            className={[
                'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
                sizeClasses[size],
                variantClasses[variant],
                className,
            ].join(' ')}
            onClick={onClick}
            disabled={disabled || loading}
            aria-busy={loading}
            {...motionProps}
            {...props}
        >
            {loading && (
                <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
                    aria-hidden="true"
                />
            )}
            {children}
        </motion.button>
    );
};

export default AnimatedButton;