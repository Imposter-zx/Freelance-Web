/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'scale-pulse': 'scale-pulse 2s ease-in-out infinite',
        'bounce-custom': 'bounce-custom 2s ease-in-out infinite',
        'rotate-icon': 'rotate-icon 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '-100%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'slide-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(37, 99, 235, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.6)' },
        },
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'bounce-custom': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'rotate-icon': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
        '3000': '3000ms',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.4)',
        'glow-lg': '0 0 40px rgba(37, 99, 235, 0.6)',
      },
    },
  },
  plugins: [],
}


