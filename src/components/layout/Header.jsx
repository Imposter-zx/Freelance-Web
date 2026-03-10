import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useMessages } from '../../context/MessageContext';
import { Moon, Sun, Menu, X, User, MessageSquare, PlusCircle, Settings } from 'lucide-react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { user, logout } = useAuth();
    const { unreadCount } = useMessages();
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
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-bg-soft transition-colors">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/messages" className="relative p-2 rounded-full hover:bg-bg-soft transition-colors">
                                    <MessageSquare size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <Link to="/post-project" className="p-2 rounded-full hover:bg-bg-soft transition-colors" title="Publier un projet">
                                    <PlusCircle size={20} />
                                </Link>
                                <Link to="/dashboard" className="text-sm font-semibold flex items-center gap-2">
                                    <User size={18} />
                                    <span>Dashboard</span>
                                </Link>
                                <Link to="/settings" className="p-2 rounded-full hover:bg-bg-soft transition-colors" title="Parametres">
                                    <Settings size={18} />
                                </Link>
                                <button onClick={logout} className="btn btn-secondary py-2 text-xs">Deconnexion</button>
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
                        className="absolute top-full left-0 w-full bg-bg-main border-b border-border p-6 flex flex-col gap-4 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-border" />
                        {user ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Tableau de bord</Link>
                                <Link to="/messages" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between">
                                    Messages {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
                                </Link>
                                <Link to="/post-project" onClick={() => setIsMobileMenuOpen(false)}>Publier un projet</Link>
                                <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>Parametres</Link>
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="btn btn-secondary w-full">Deconnexion</button>
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
