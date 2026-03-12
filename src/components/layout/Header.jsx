import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useMessages } from '../../context/MessageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Moon, Sun, Menu, X, User, MessageSquare, PlusCircle, Settings, Bell, Info, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { user, logout } = useAuth();
    const { unreadCount: unreadMessages } = useMessages();
    const { notifications, unreadCount: unreadNotifs, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
        { name: 'Services', href: '/#services' },
        { name: 'Portfolio', href: '/#portfolio' },
        { name: 'Chercher', href: '/search' },
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
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
            <div className="container flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold tracking-tight text-blue-600 font-outfit">
                    ZORD
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.href} className="text-sm font-medium hover:text-blue-600 transition-colors">
                            {link.name}
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 pl-4 border-l border-border">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-bg-soft transition-colors text-text-main">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                                        className={`p-2 rounded-full hover:bg-bg-soft transition-colors ${isNotificationsOpen ? 'bg-bg-soft text-blue-600' : 'text-text-main'}`}
                                    >
                                        <Bell size={20} />
                                        {unreadNotifs > 0 && (
                                            <span className="absolute top-0 right-0 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-bg-main">
                                                {unreadNotifs}
                                            </span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isNotificationsOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-80 bg-bg-main border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                                            >
                                                <div className="p-4 border-b border-border flex justify-between items-center bg-bg-soft/50">
                                                    <h3 className="font-bold text-sm">Notifications</h3>
                                                    <button onClick={markAllAsRead} className="text-[10px] text-blue-600 font-bold hover:underline">Tout marquer lu</button>
                                                </div>
                                                <div className="max-h-[350px] overflow-y-auto divide-y divide-border">
                                                    {notifications.length > 0 ? (
                                                        notifications.map((n) => (
                                                            <div key={n.id} className={`p-4 hover:bg-bg-soft transition-colors flex gap-3 relative group ${!n.read ? 'bg-blue-50/30' : ''}`}>
                                                                <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
                                                                <div className="flex-1" onClick={() => markAsRead(n.id)}>
                                                                    <p className={`text-sm ${!n.read ? 'font-bold' : 'text-text-main'}`}>{n.title}</p>
                                                                    <p className="text-xs text-text-soft line-clamp-2 mt-0.5">{n.message}</p>
                                                                    <span className="text-[10px] text-text-soft mt-2 block italic">{n.time}</span>
                                                                </div>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-500 rounded-md transition-all text-text-soft"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-8 text-center text-text-soft text-sm">Aucune notification</div>
                                                    )}
                                                </div>
                                                <div className="p-3 border-t border-border bg-bg-soft/20 text-center">
                                                    <Link to="/settings" className="text-xs font-bold text-blue-600 hover:underline">Gérer les alertes</Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link to="/messages" className="relative p-2 rounded-full hover:bg-bg-soft transition-colors text-text-main">
                                    <MessageSquare size={20} />
                                    {unreadMessages > 0 && (
                                        <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-bg-main">
                                            {unreadMessages}
                                        </span>
                                    )}
                                </Link>

                                <Link to="/post-project" className="p-2 rounded-full hover:bg-bg-soft transition-colors text-text-main" title="Publier un projet">
                                    <PlusCircle size={20} />
                                </Link>

                                <Link to="/dashboard" className="text-sm font-semibold flex items-center gap-2 text-text-main hover:text-blue-600 transition-colors bg-bg-soft/50 px-3 py-1.5 rounded-full border border-border">
                                    <User size={16} />
                                    <span>{user.name?.split(' ')[0] || 'Défaut'}</span>
                                </Link>

                                <button onClick={logout} className="btn bg-red-50 text-red-600 hover:bg-red-100 py-2 px-4 text-xs font-bold">Déconnexion</button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium">Connexion</Link>
                                <Link to="/register" className="btn btn-primary py-2 px-5 text-sm">S'inscrire</Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-bg-soft">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-bg-main border-b border-border p-6 flex flex-col gap-4 md:hidden shadow-lg"
                    >
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-border" />
                        {user ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2"><User size={20}/> Tableau de bord</Link>
                                <Link to="/messages" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2"><MessageSquare size={20}/> Messages</span>
                                    {unreadMessages > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadMessages}</span>}
                                </Link>
                                <Link to="/post-project" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2"><PlusCircle size={20}/> Publier un projet</Link>
                                <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2"><Settings size={20}/> Paramètres</Link>
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="btn bg-red-50 text-red-600 w-full mt-2">Déconnexion</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Connexion</Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary w-full">S'inscrire</Link>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
