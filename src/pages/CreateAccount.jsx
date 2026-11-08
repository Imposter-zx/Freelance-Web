import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEOMeta from '../components/common/SEOMeta';
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    Briefcase,
    Eye,
    EyeOff,
    AlertCircle,
} from 'lucide-react';

const initialForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
};

const CreateAccount = () => {
    const [formData, setFormData] = useState(initialForm);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Les deux mots de passe ne correspondent pas.');
            return;
        }

        setIsLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (registrationError) {
            setError(registrationError.message || 'La création du compte a échoué.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg-soft px-6 pb-20 pt-32">
            <SEOMeta
                title="Créer un compte"
                description="Créez votre compte ZORD pour recruter ou proposer vos services."
                noIndex
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg rounded-3xl border border-border bg-bg-main p-8 shadow-card sm:p-10"
            >
                <div className="mb-7 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                        Z
                    </div>
                    <h1 className="mt-4 font-display text-2xl font-bold text-text-main">Créer votre compte</h1>
                    <p className="mt-2 text-sm text-text-soft">
                        Choisissez votre profil et commencez en quelques secondes.
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
                    <fieldset>
                        <legend className="mb-2 block text-sm font-semibold text-text-main">
                            Je souhaite…
                        </legend>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'client', label: 'Recruter', hint: 'Publier des projets', icon: Briefcase },
                                { value: 'freelancer', label: 'Travailler', hint: 'Proposer mes services', icon: User },
                            ].map((option) => {
                                const Icon = option.icon;
                                const selected = formData.role === option.value;
                                return (
                                    <label
                                        key={option.value}
                                        className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                                            selected
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                                : 'border-border bg-bg-soft text-text-soft hover:border-blue-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={option.value}
                                            checked={selected}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <Icon size={18} aria-hidden="true" />
                                        <span className="mt-2 block text-sm font-semibold">{option.label}</span>
                                        <span className="block text-[11px] opacity-80">{option.hint}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </fieldset>

                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-text-main">
                            Nom complet
                        </label>
                        <div className="relative">
                            <User
                                size={18}
                                aria-hidden="true"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft"
                            />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Votre nom"
                                className="w-full rounded-xl border border-border bg-bg-soft py-3.5 pl-11 pr-4 text-sm text-text-main outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

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

                    <div className="grid gap-4 sm:grid-cols-2">
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
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="8 caractères min."
                                    className="w-full rounded-xl border border-border bg-bg-soft py-3.5 pl-11 pr-11 text-sm text-text-main outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-semibold text-text-main"
                            >
                                Confirmation
                            </label>
                            <div className="relative">
                                <ShieldCheck
                                    size={18}
                                    aria-hidden="true"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft"
                                />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Répétez"
                                    className="w-full rounded-xl border border-border bg-bg-soft py-3.5 pl-11 pr-4 text-sm text-text-main outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-3.5">
                        {isLoading ? (
                            <>
                                <span
                                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                    aria-hidden="true"
                                />
                                Création…
                            </>
                        ) : (
                            <>
                                Créer mon compte
                                <ArrowRight size={17} aria-hidden="true" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-text-soft">
                    Déjà inscrit ?{' '}
                    <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
                        Se connecter
                    </Link>
                </p>
                <p className="mt-5 text-center text-[11px] leading-relaxed text-text-soft">
                    Version démonstration : le mot de passe est haché et conservé uniquement dans ce navigateur.
                </p>
            </motion.div>
        </div>
    );
};

export default CreateAccount;
