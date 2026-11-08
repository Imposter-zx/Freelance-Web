import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import SEOMeta from '../components/common/SEOMeta';

const NotFound = () => (
    <div className="flex min-h-[70vh] items-center justify-center bg-bg-soft px-6 pb-20 pt-32">
        <SEOMeta title="Page introuvable" description="Cette page n’existe pas." noIndex />
        <div className="max-w-lg text-center">
            <p className="font-display text-6xl font-bold text-blue-600">404</p>
            <h1 className="mt-4 font-display text-2xl font-bold text-text-main">Page introuvable</h1>
            <p className="mt-3 text-sm text-text-soft">
                Le lien que vous avez suivi est peut-être obsolète. Revenez à l’accueil ou explorez les talents.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/" className="btn btn-primary">
                    <ArrowLeft size={16} aria-hidden="true" />
                    Retour à l’accueil
                </Link>
                <Link to="/search" className="btn btn-secondary">
                    <Search size={16} aria-hidden="true" />
                    Explorer les talents
                </Link>
            </div>
        </div>
    </div>
);

export default NotFound;
