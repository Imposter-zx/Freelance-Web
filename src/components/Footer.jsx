import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const links = [
        { label: 'À propos', href: '#' },
        { label: 'Conditions', href: '#' },
        { label: 'Confidentialité', href: '#' },
        { label: 'Support', href: '#' },
    ];

    const socials = [
        { label: 'Twitter', href: '#' },
        { label: 'Facebook', href: '#' },
        { label: 'LinkedIn', href: '#' },
    ];

    return (
        <footer className="bg-gray-900 text-gray-400 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Top row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                    <Link to="/" className="text-2xl font-extrabold text-white tracking-tight">
                        ZORD
                    </Link>
                    <nav className="flex flex-wrap items-center gap-6 text-sm">
                        {links.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="hover:text-white transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-4 text-sm">
                        {socials.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
                    &copy; {new Date().getFullYear()} ZORD. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
