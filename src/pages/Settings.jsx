import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SEOMeta from '../components/common/SEOMeta';
import {
    User,
    Bell,
    CreditCard,
    Shield,
    Globe,
    Save,
    Trash2,
    Mail,
    CheckCircle,
    AlertCircle,
    Lock,
    Languages,
} from 'lucide-react';

const readPreferences = () => {
    try {
        return {
            emailNotifications: true,
            projectUpdates: true,
            marketingEmails: false,
            ...JSON.parse(localStorage.getItem('notificationPreferences') || '{}'),
        };
    } catch {
        return {
            emailNotifications: true,
            projectUpdates: true,
            marketingEmails: false,
        };
    }
};

const Settings = () => {
    const { user, updateProfile, changePassword, deleteAccount } = useAuth();
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        role: user?.role || 'client',
        bio: user?.bio || '',
        location: user?.location || '',
    });
    const [preferences, setPreferences] = useState(readPreferences);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const sections = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'preferences', label: 'Préférences', icon: Bell },
        { id: 'security', label: 'Sécurité', icon: Shield },
        { id: 'billing', label: 'Facturation', icon: CreditCard },
    ];

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfileData((current) => ({ ...current, [name]: value }));
        if (status.message) setStatus({ type: '', message: '' });
    };

    const handleSave = (event) => {
        event.preventDefault();
        if (!profileData.name.trim()) {
            setStatus({ type: 'error', message: 'Le nom ne peut pas être vide.' });
            return;
        }

        updateProfile(profileData);
        localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
        setStatus({ type: 'success', message: 'Vos préférences ont été enregistrées.' });
    };

    const handlePasswordChange = async () => {
        setStatus({ type: '', message: '' });
        if (passwords.newPassword !== passwords.confirmPassword) {
            setStatus({ type: 'error', message: 'Les nouveaux mots de passe ne correspondent pas.' });
            return;
        }
        try {
            await changePassword(passwords.currentPassword, passwords.newPassword);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setStatus({ type: 'success', message: 'Mot de passe mis à jour.' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    const handleDeleteAccount = () => {
        deleteAccount();
        navigate('/', { replace: true });
    };

    return (
        <div className="min-h-screen bg-bg-soft pb-20 pt-28 sm:pt-32">
            <SEOMeta title="Paramètres" description="Gérez votre profil et vos préférences." noIndex />

            <div className="container max-w-5xl">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="font-display text-2xl font-bold text-text-main sm:text-3xl">Paramètres</h1>
                    <p className="mt-2 text-sm text-text-soft">
                        Gérez votre profil, vos préférences et la sécurité de votre compte.
                    </p>

                    {status.message && (
                        <div
                            role={status.type === 'error' ? 'alert' : 'status'}
                            className={`mt-5 flex items-start gap-2 rounded-xl border p-3 text-sm ${
                                status.type === 'error'
                                    ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                            }`}
                        >
                            {status.type === 'error' ? (
                                <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                            ) : (
                                <CheckCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                            )}
                            {status.message}
                        </div>
                    )}

                    <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
                        <nav
                            className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-bg-main p-2 shadow-sm lg:flex-col lg:overflow-visible"
                            aria-label="Sections des paramètres"
                        >
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const active = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => setActiveSection(section.id)}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                                            active
                                                ? 'bg-blue-600 text-white'
                                                : 'text-text-soft hover:bg-bg-soft hover:text-text-main'
                                        }`}
                                    >
                                        <Icon size={17} aria-hidden="true" />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </nav>

                        <form
                            onSubmit={handleSave}
                            className="rounded-2xl border border-border bg-bg-main p-6 shadow-card sm:p-8"
                        >
                            {activeSection === 'profile' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                    <div>
                                        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                                            <User size={19} className="text-blue-600" aria-hidden="true" />
                                            Informations du profil
                                        </h2>
                                        <p className="mt-1 text-xs text-text-soft">
                                            Ces informations sont visibles dans votre espace personnel.
                                        </p>
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                                            Nom complet
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                                            Adresse e-mail
                                        </label>
                                        <div className="relative">
                                            <Mail
                                                size={17}
                                                aria-hidden="true"
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft"
                                            />
                                            <input
                                                id="email"
                                                type="email"
                                                value={user?.email || ''}
                                                readOnly
                                                className="w-full cursor-not-allowed rounded-xl border border-border bg-bg-soft/60 py-3.5 pl-11 pr-4 text-sm text-text-soft"
                                            />
                                        </div>
                                        <p className="mt-1 text-[11px] text-text-soft">
                                            L’adresse e-mail sert d’identifiant et ne peut pas être modifiée ici.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="role" className="mb-2 block text-sm font-semibold">
                                                Type de compte
                                            </label>
                                            <select
                                                id="role"
                                                name="role"
                                                value={profileData.role}
                                                onChange={handleProfileChange}
                                                className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="client">Client — je recrute</option>
                                                <option value="freelancer">Freelance — je propose mes services</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="location" className="mb-2 block text-sm font-semibold">
                                                Localisation
                                            </label>
                                            <div className="relative">
                                                <Globe
                                                    size={17}
                                                    aria-hidden="true"
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft"
                                                />
                                                <input
                                                    id="location"
                                                    name="location"
                                                    type="text"
                                                    value={profileData.location}
                                                    onChange={handleProfileChange}
                                                    placeholder="Ville, pays"
                                                    className="w-full rounded-xl border border-border bg-bg-soft py-3.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="bio" className="mb-2 block text-sm font-semibold">
                                            Bio
                                        </label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={4}
                                            value={profileData.bio}
                                            onChange={handleProfileChange}
                                            placeholder="Présentez votre activité en quelques lignes…"
                                            className="w-full resize-none rounded-xl border border-border bg-bg-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {activeSection === 'preferences' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                    <div>
                                        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                                            <Bell size={19} className="text-blue-600" aria-hidden="true" />
                                            Préférences
                                        </h2>
                                        <p className="mt-1 text-xs text-text-soft">
                                            Ces préférences sont conservées localement (démo).
                                        </p>
                                    </div>

                                    <div>
                                        <label htmlFor="language" className="mb-2 block text-sm font-semibold">
                                            Langue de l’interface
                                        </label>
                                        <div className="relative">
                                            <Languages
                                                size={17}
                                                aria-hidden="true"
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft"
                                            />
                                            <select
                                                id="language"
                                                value={language}
                                                onChange={(event) => setLanguage(event.target.value)}
                                                className="w-full rounded-xl border border-border bg-bg-soft py-3.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="fr">Français</option>
                                                <option value="en">English</option>
                                                <option value="es">Español</option>
                                                <option value="de">Deutsch</option>
                                                <option value="it">Italiano</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            {
                                                key: 'emailNotifications',
                                                title: 'Notifications par e-mail',
                                                description: 'Recevoir un e-mail pour les mises à jour importantes.',
                                            },
                                            {
                                                key: 'projectUpdates',
                                                title: 'Mises à jour des projets',
                                                description: 'Être informé des nouvelles activités sur vos projets.',
                                            },
                                            {
                                                key: 'marketingEmails',
                                                title: 'Actualités produit',
                                                description: 'Recevoir les nouveautés de la plateforme.',
                                            },
                                        ].map((option) => (
                                            <label
                                                key={option.key}
                                                htmlFor={option.key}
                                                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-bg-soft p-4"
                                            >
                                                <span>
                                                    <span className="block text-sm font-semibold text-text-main">
                                                        {option.title}
                                                    </span>
                                                    <span className="mt-0.5 block text-xs text-text-soft">
                                                        {option.description}
                                                    </span>
                                                </span>
                                                <input
                                                    id={option.key}
                                                    type="checkbox"
                                                    checked={Boolean(preferences[option.key])}
                                                    onChange={(event) =>
                                                        setPreferences((current) => ({
                                                            ...current,
                                                            [option.key]: event.target.checked,
                                                        }))
                                                    }
                                                    className="peer sr-only"
                                                />
                                                <span
                                                    aria-hidden="true"
                                                    className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 dark:bg-gray-600"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeSection === 'security' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                    <div>
                                        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                                            <Shield size={19} className="text-blue-600" aria-hidden="true" />
                                            Sécurité du compte
                                        </h2>
                                        <p className="mt-1 text-xs text-text-soft">
                                            Version démonstration : le mot de passe est haché et conservé dans ce
                                            navigateur. Une authentification réelle nécessite le serveur.
                                        </p>
                                    </div>

                                    <div className="space-y-4 rounded-xl border border-border bg-bg-soft p-4">
                                        {[
                                            { key: 'currentPassword', label: 'Mot de passe actuel', autocomplete: 'current-password' },
                                            { key: 'newPassword', label: 'Nouveau mot de passe', autocomplete: 'new-password' },
                                            { key: 'confirmPassword', label: 'Confirmer le nouveau mot de passe', autocomplete: 'new-password' },
                                        ].map((field) => (
                                            <div key={field.key}>
                                                <label
                                                    htmlFor={field.key}
                                                    className="mb-1.5 block text-sm font-semibold"
                                                >
                                                    {field.label}
                                                </label>
                                                <div className="relative">
                                                    <Lock
                                                        size={16}
                                                        aria-hidden="true"
                                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-soft"
                                                    />
                                                    <input
                                                        id={field.key}
                                                        type="password"
                                                        autoComplete={field.autocomplete}
                                                        value={passwords[field.key]}
                                                        onChange={(event) =>
                                                            setPasswords((current) => ({
                                                                ...current,
                                                                [field.key]: event.target.value,
                                                            }))
                                                        }
                                                        className="w-full rounded-xl border border-border bg-bg-main py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handlePasswordChange}
                                            className="btn btn-secondary w-full py-3 text-sm"
                                        >
                                            Mettre à jour le mot de passe
                                        </button>
                                    </div>

                                    <div className="rounded-xl border border-border p-4">
                                        <h3 className="text-sm font-semibold text-text-main">
                                            Authentification à deux facteurs
                                        </h3>
                                        <p className="mt-1 text-xs text-text-soft">
                                            Non disponible dans cette démonstration. Aucune fonction de sécurité
                                            factice n’est activée.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {activeSection === 'billing' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                    <div>
                                        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                                            <CreditCard size={19} className="text-blue-600" aria-hidden="true" />
                                            Facturation
                                        </h2>
                                        <p className="mt-1 text-xs text-text-soft">
                                            Aucune facturation n’est active dans cette version.
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-dashed border-border bg-bg-soft px-6 py-10 text-center">
                                        <CreditCard size={28} className="mx-auto text-text-soft" aria-hidden="true" />
                                        <h3 className="mt-3 text-sm font-semibold text-text-main">
                                            Aucun moyen de paiement
                                        </h3>
                                        <p className="mx-auto mt-1 max-w-sm text-xs text-text-soft">
                                            Les paiements et la facturation ne sont pas activés. Aucun débit ne
                                            sera effectué depuis cette démonstration.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {activeSection !== 'security' && activeSection !== 'billing' && (
                                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
                                    <div className="relative">
                                        {deleteConfirmation ? (
                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                                <span className="text-text-soft">Supprimer ce compte local ?</span>
                                                <button
                                                    type="button"
                                                    onClick={handleDeleteAccount}
                                                    className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
                                                >
                                                    Confirmer
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteConfirmation(false)}
                                                    className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text-soft"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setDeleteConfirmation(true)}
                                                className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 size={15} aria-hidden="true" />
                                                Supprimer le compte
                                            </button>
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary px-5 py-2.5 text-sm">
                                        <Save size={16} aria-hidden="true" />
                                        Enregistrer
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
