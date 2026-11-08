import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-bg-main">
            <div className="container py-12">
                <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 font-display text-xl font-bold text-blue-600"
                            aria-label="ZORD Freelance — Accueil"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                                Z
                            </span>
                            ZORD
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-soft">
                            La plateforme qui connecte les entreprises ambitieuses aux meilleurs talents indépendants.
                        </p>
                        <a
                            href="https://github.com/Imposter-zx/Freelance-Web"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-text-soft transition-colors hover:text-blue-700"
                            aria-label="Voir le code source sur GitHub"
                        >
                            <Github size={17} aria-hidden="true" />
                            Code source
                        </a>
                    </div>

                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-text-main">
                            {t('nav.search')}
                        </h2>
                        <ul className="mt-4 space-y-3 text-sm text-text-soft">
                            <li>
                                <Link to="/search" className="transition-colors hover:text-blue-700">
                                    Explorer les talents
                                </Link>
                            </li>
                            <li>
                                <Link to="/post-project" className="transition-colors hover:text-blue-700">
                                    {t('nav.postProject')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/work" className="transition-colors hover:text-blue-700">
                                    Devenir freelance
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="transition-colors hover:text-blue-700">
                                    {t('nav.dashboard')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-text-main">
                            Plateforme
                        </h2>
                        <ul className="mt-4 space-y-3 text-sm text-text-soft">
                            <li>
                                <Link to="/#services" className="transition-colors hover:text-blue-700">
                                    {t('nav.services')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/#how-it-works" className="transition-colors hover:text-blue-700">
                                    Comment ça marche
                                </Link>
                            </li>
                            <li>
                                <Link to="/#faq" className="transition-colors hover:text-blue-700">
                                    Questions fréquentes
                                </Link>
                            </li>
                            <li>
                                <Link to="/messages" className="transition-colors hover:text-blue-700">
                                    {t('nav.messages')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-text-main">
                            Compte
                        </h2>
                        <ul className="mt-4 space-y-3 text-sm text-text-soft">
                            <li>
                                <Link to="/login" className="transition-colors hover:text-blue-700">
                                    {t('nav.connection')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="transition-colors hover:text-blue-700">
                                    {t('nav.register')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/settings" className="transition-colors hover:text-blue-700">
                                    {t('nav.settings')}
                                </Link>
                            </li>
                        </ul>
                        <Link
                            to="/register"
                            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
                        >
                            Commencer
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-text-soft sm:flex-row sm:items-center sm:justify-between">
                    <p>© {year} ZORD Freelance. Tous droits réservés.</p>
                    <p>Version démonstration — les données sont stockées dans votre navigateur.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
