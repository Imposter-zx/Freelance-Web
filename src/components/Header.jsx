import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', to: '/' },
    { label: 'Services', to: '/#services' },
    { label: 'Portfolio', to: '/#portfolio' },
    { label: 'Contact', to: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100'
          : 'bg-white'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-600 tracking-tight font-outfit hover:text-blue-700 transition-colors"
        >
          ZORD
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, to }) => (
            <a
              key={label}
              href={to}
              className={`text-sm font-semibold transition-colors hover:text-blue-600 ${pathname === to ? 'text-blue-600' : 'text-gray-600'
                }`}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors px-3 py-2"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm shadow-blue-200"
          >
            S'inscrire
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-lg">
          {navLinks.map(({ label, to }) => (
            <a
              key={label}
              href={to}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-semibold text-gray-600 hover:text-blue-600 py-2 transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl py-2.5 hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl py-2.5 transition-all"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
