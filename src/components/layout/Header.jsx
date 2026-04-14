import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useMessages } from '../../context/MessageContext';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';
import { Moon, Sun, Menu, X, User, MessageSquare, PlusCircle, Settings, Bell, Info, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { user, logout } = useAuth();
    const { unreadCount: unreadMessages } = useMessages();
    const { notifications, unreadCount: unreadNotifs, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const { t } = useLanguage();
    const location = useLocation();

    const { scrollYProgress } = motion.useScroll();
    const scaleX = motion.useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
    };

    const navLinks = [
        { name: t('nav.services'), href: '/#services' },
        { name: t('nav.portfolio'), href: '/#portfolio' },
        { name: t('nav.search'), href: '/search' },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
            case 'error': return <AlertCircle size={16} className="text-red-500" />;
            case 'message': return <MessageSquare size={16} className="text-blue-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[60] origin-left"
                style={{ scaleX }}
            />
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-6'}`}>
                <div className="container flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold tracking-tighter text-blue-600 font-outfit hover:scale-105 transition-transform flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">Z</div>
                        <span>ZORD</span>
                    </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <motion.div key={link.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to={link.href} className="text-sm font-medium hover:text-blue-600 transition-colors">
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}

                    <div className="flex items-center gap-3 pl-4 border-l border-border">
                        <LanguageSelector />
                        
                        <motion.button 
                            onClick={toggleTheme} 
                            className="p-2 rounded-full hover:bg-bg-soft transition-colors text-text-main"
                            whileHover={{ rotate: 20, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </motion.button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Notifications */}
                                <div className="relative">
                                    <motion.button 
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                                        className={`p-2 rounded-full hover:bg-bg-soft transition-colors ${isNotificationsOpen ? 'bg-bg-soft text-blue-600' : 'text-text-main'}`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Bell size={20} />
                                        {unreadNotifs > 0 && (
                                            <motion.span 
                                                className="absolute top-0 right-0 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-bg-main"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                {unreadNotifs}
                                            </motion.span>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {isNotificationsOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-80 bg-bg-main border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                                            >
                                                <div className="p-4 border-b border-border flex justify-between items-center bg-bg-soft/50">
                                                    <h3 className="font-bold text-sm">{t('nav.notifications')}</h3>
                                                    <motion.button 
                                                        onClick={markAllAsRead} 
                                                        className="text-[10px] text-blue-600 font-bold hover:underline"
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        {t('nav.markAllAsRead')}
                                                    </motion.button>
                                                </div>
                                                <div className="max-h-[350px] overflow-y-auto divide-y divide-border">
                                                    {notifications.length > 0 ? (
                                                        notifications.map((n, idx) => (
                                                            <motion.div 
                                                                key={n.id} 
                                                                className={`p-4 hover:bg-bg-soft transition-colors flex gap-3 relative group ${!n.read ? 'bg-blue-50/30' : ''}`}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                            >
                                                                <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
                                                                <div className="flex-1 cursor-pointer" onClick={() => markAsRead(n.id)}>
                                                                    <p className={`text-sm ${!n.read ? 'font-bold' : 'text-text-main'}`}>{n.title}</p>
                                                                    <p className="text-xs text-text-soft line-clamp-2 mt-0.5">{n.message}</p>
                                                                    <span className="text-[10px] text-text-soft mt-2 block italic">{n.time}</span>
                                                                </div>
                                                                <motion.button 
                                                                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-500 rounded-md transition-all text-text-soft"
                                                                    whileHover={{ scale: 1.2, rotate: 90 }}
                                                                >
                                                                    <Trash2 size={12} />
                                                                </motion.button>
                                                            </motion.div>
                                                        ))
                                                    ) : (
                                                        <div className="p-8 text-center text-text-soft text-sm">{t('nav.noNotifications')}</div>
                                                    )}
                                                </div>
                                                <div className="p-3 border-t border-border bg-bg-soft/20 text-center">
                                                    <Link to="/settings" className="text-xs font-bold text-blue-600 hover:underline">{t('nav.manageAlerts')}</Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Messages */}
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Link to="/messages" className="relative p-2 rounded-full hover:bg-bg-soft transition-colors text-text-main">
                                        <MessageSquare size={20} />
                                        {unreadMessages > 0 && (
                                            <motion.span 
                                                className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-bg-main"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                {unreadMessages}
                                            </motion.span>
                                        )}
                                    </Link>
                                </motion.div>

                                {/* Post Project */}
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Link to="/post-project" className="p-2 rounded-full hover:bg-bg-soft transition-colors text-text-main" title={t('nav.postProject')}>
                                        <PlusCircle size={20} />
                                    </Link>
                                </motion.div>

                                {/* Dashboard Link */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/dashboard" className="text-sm font-semibold flex items-center gap-2 text-text-main hover:text-blue-600 transition-colors bg-bg-soft/50 px-3 py-1.5 rounded-full border border-border">
                                        <User size={16} />
                                        <span>{user.name?.split(' ')[0] || 'User'}</span>
                                    </Link>
                                </motion.div>

                                {/* Logout */}
                                <motion.button 
                                    onClick={logout} 
                                    className="btn bg-red-50 text-red-600 hover:bg-red-100 py-2 px-4 text-xs font-bold"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('nav.logout')}
                                </motion.button>
                            </div>
                        ) : (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/login" className="text-sm font-medium">{t('nav.connection')}</Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/register" className="btn btn-primary py-2 px-5 text-sm">{t('nav.register')}</Link>
                                </motion.div>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <LanguageSelector />
                    <motion.button 
                        onClick={toggleTheme} 
                        className="p-2 rounded-full hover:bg-bg-soft"
                        whileHover={{ rotate: 20, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>
                    <motion.button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        className="p-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="absolute top-full left-0 w-full bg-bg-main border-b border-border p-6 flex flex-col gap-4 md:hidden shadow-lg"
                    >
                        {navLinks.map((link, idx) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link 
                                    to={link.href} 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className="text-lg font-medium hover:text-blue-600 transition-colors block"
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                        <hr className="border-border my-2" />
                        {user ? (
                            <>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                        <User size={20} /> {t('nav.dashboard')}
                                    </Link>
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                                    <Link to="/messages" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between gap-2 hover:text-blue-600 transition-colors">
                                        <span className="flex items-center gap-2"><MessageSquare size={20} /> {t('nav.messages')}</span>
                                        {unreadMessages > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadMessages}</span>}
                                    </Link>
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                                    <Link to="/post-project" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                        <PlusCircle size={20} /> {t('nav.postProject')}
                                    </Link>
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                                    <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                        <Settings size={20} /> {t('nav.settings')}
                                    </Link>
                                </motion.div>
                                <motion.button 
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                                    className="btn bg-red-50 text-red-600 w-full mt-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('nav.logout')}
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">
                                        {t('nav.connection')}
                                    </Link>
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary w-full">
                                        {t('nav.register')}
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
