import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-bg-soft border-t border-border pt-16 pb-8">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-blue-600 font-outfit mb-4 block">
                            ZORD
                        </Link>
                        <p className="text-text-soft text-sm">
                            La plateforme de référence pour connecter les talents du monde entier avec les projets les plus ambitieux.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Plateforme</h4>
                        <ul className="space-y-4 text-sm text-text-soft">
                            <li><Link to="/search" className="hover:text-primary">Trouver un freelance</Link></li>
                            <li><Link to="/work" className="hover:text-primary">Travailler en freelance</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary">Mon tableau de bord</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Entreprise</h4>
                        <ul className="space-y-4 text-sm text-text-soft">
                            <li><Link to="#" className="hover:text-primary">À propos</Link></li>
                            <li><Link to="#" className="hover:text-primary">Blog</Link></li>
                            <li><Link to="#" className="hover:text-primary">Recrutement</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-text-soft">
                            <li><Link to="#" className="hover:text-primary">Centre de sécurité</Link></li>
                            <li><Link to="#" className="hover:text-primary">Contactez-nous</Link></li>
                            <li><Link to="#" className="hover:text-primary">Confidentialité</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-text-soft">
                        © {new Date().getFullYear()} ZORD Freelance. Tous droits réservés.
                    </p>

                    <div className="flex items-center gap-5 translate-y-[-2px]">
                        <a href="#" className="p-2 rounded-full bg-white dark:bg-dark-surface shadow-sm hover:text-primary hover:shadow-md transition-all">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-white dark:bg-dark-surface shadow-sm hover:text-primary hover:shadow-md transition-all">
                            <Linkedin size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-white dark:bg-dark-surface shadow-sm hover:text-primary hover:shadow-md transition-all">
                            <Github size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-white dark:bg-dark-surface shadow-sm hover:text-primary hover:shadow-md transition-all">
                            <Mail size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
