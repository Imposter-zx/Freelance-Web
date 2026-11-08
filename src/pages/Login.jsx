import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEOMeta from '../components/common/SEOMeta';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || '/dashboard';

    const handleInputChange = (event) => {
        setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(formData.email, formData.password);
            if (success) {
                navigate(redirectTo, { replace: true });
            } else {
                setError('Adresse e-mail ou mot de passe incorrect.');
            }
        } catch {
            setError('La connexion a échoué. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg-soft px-6 pb-20 pt-32">
            <SEOMeta title="Connexion" description="Connectez-vous à votre compte ZORD." noIndex />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-3xl border border-border bg-bg-main p-8 shadow-card sm:p-10"
            >
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                        Z
                    </div>
                    <h1 className="mt-4 font-display text-2xl font-bold text-text-main">Bon retour</h1>
                    <p className="mt-2 text-sm text-text-soft">
                        Connectez-vous pour retrouver vos projets et vos conversations.
                    </p>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                    >
                        <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-text-main">
                            Adresse e-mail
                        </label>
                        <div className="relative">
                            <Mail
                                size={18}
                                aria-hidden="true"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft"
                            />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="vous@exemple.com"
                                className="w-full rounded-xl border border-border bg-bg-soft py-3.5 pl-11 pr-4 text-sm text-text-main outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-text-main">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock
                                size={18}
                                aria-hidden="true"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft"
                            />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Votre mot de passe"
                                className="w-full rounded-xl border border-border bg-bg-soft py-3.5 pl-11 pr-12 text-sm text-text-main outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-text-soft hover:text-text-main"
                                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-3.5">
                        {isLoading ? (
                            <>
                                <span
                                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                    aria-hidden="true"
                                />
                                Connexion…
                            </>
                        ) : (
                            <>
                                Se connecter
                                <ArrowRight size={17} aria-hidden="true" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-text-soft">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">
                        Créer un compte
                    </Link>
                </p>
                <p className="mt-5 text-center text-[11px] leading-relaxed text-text-soft">
                    Version démonstration : votre compte est stocké localement dans ce navigateur.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
