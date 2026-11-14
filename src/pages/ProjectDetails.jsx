import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../services/mockData';
import SEOMeta from '../components/common/SEOMeta';
import {
    Briefcase,
    Clock,
    DollarSign,
    ChevronLeft,
    Send,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const readStoredArray = (key) => {
    try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
};

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [bidAmount, setBidAmount] = useState('');
    const [bidCover, setBidCover] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const { addNotification } = useNotifications();

    useEffect(() => {
        const found =
            projects.find((item) => String(item.id) === String(id)) ||
            readStoredArray('postedProjects').find((item) => String(item.id) === String(id));
        if (found) {
            setProject(found);
            setBidAmount(found.budgetMin.toString());
            const existing = user?.email
                ? readStoredArray('proposals').find(
                      (proposal) =>
                          proposal.projectId === found.id &&
                          proposal.freelancerEmail === user.email
                  )
                : null;
            setSubmitted(Boolean(existing));
            if (existing) setBidCover(existing.cover || '');
        }
        setLoaded(true);
    }, [id, user?.email]);

    const handleSubmitBid = (event) => {
        event.preventDefault();
        setError('');

        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'freelancer') {
            setError('Seuls les comptes freelance peuvent envoyer une proposition.');
            return;
        }

        if (project.clientEmail && project.clientEmail === user.email) {
            setError('Vous ne pouvez pas envoyer de proposition sur votre propre projet.');
            return;
        }

        if (project.status !== 'open') {
            setError('Ce projet n’accepte plus de propositions.');
            return;
        }

        setIsSubmitting(true);

        try {
            const proposals = readStoredArray('proposals');
            const existing = proposals.some(
                (proposal) =>
                    proposal.projectId === project.id && proposal.freelancerEmail === user.email
            );

            if (existing) {
                setSubmitted(true);
                return;
            }

            proposals.unshift({
                id: Date.now(),
                projectId: project.id,
                projectTitle: project.title,
                amount: Number(bidAmount),
                cover: bidCover.trim(),
                freelancerEmail: user.email,
                freelancerName: user.name,
                status: 'pending',
                createdAt: new Date().toISOString(),
            });
            localStorage.setItem('proposals', JSON.stringify(proposals));

            // Keep the bid count in sync for projects published from this browser.
            const posted = readStoredArray('postedProjects');
            const nextPosted = posted.map((item) =>
                item.id === project.id ? { ...item, proposals: (item.proposals || 0) + 1 } : item
            );
            localStorage.setItem('postedProjects', JSON.stringify(nextPosted));

            addNotification({
                title: 'Proposition envoyée',
                message: `Votre proposition pour « ${project.title} » a bien été enregistrée.`,
                type: 'success',
            });
            setSubmitted(true);
        } catch {
            setError('Impossible d’enregistrer la proposition. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loaded && !project) {
        return (
            <>
                <SEOMeta
                    title="Projet introuvable"
                    description="Ce projet n’existe pas ou a été retiré."
                    noIndex
                />
                <div className="flex min-h-[70vh] items-center justify-center bg-bg-soft px-6 pt-32">
                    <div className="text-center">
                        <h1 className="font-display text-2xl font-bold">Projet introuvable</h1>
                        <p className="mt-2 text-sm text-text-soft">Ce projet n’existe pas ou a été retiré.</p>
                        <Link to="/" className="btn btn-primary mt-6">
                            Retour à l’accueil
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    if (!project) {
        return <div className="min-h-screen bg-bg-soft pt-32" aria-busy="true" />;
    }

    const isProjectOwner = Boolean(
        project.clientEmail && user?.email && project.clientEmail === user.email
    );

    return (
        <div className="min-h-screen bg-bg-soft pb-20 pt-28 sm:pt-32">
            <SEOMeta title={project.title} description={project.description} />

            <div className="container max-w-5xl">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-text-soft transition-colors hover:text-blue-700"
                >
                    <ChevronLeft size={18} aria-hidden="true" />
                    Retour
                </button>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
                    <div className="space-y-6">
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-border bg-bg-main p-6 shadow-card sm:p-8"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    {project.status === 'open'
                                        ? 'Ouvert aux offres'
                                        : project.status === 'in_progress'
                                          ? 'En cours'
                                          : project.status === 'completed'
                                            ? 'Terminé'
                                            : 'Fermé'}
                                </span>
                                {project.experienceLevel && (
                                    <span className="rounded-full bg-bg-soft px-2.5 py-1 text-[11px] font-semibold text-text-soft">
                                        {project.experienceLevel}
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-4 font-display text-2xl font-bold text-text-main sm:text-3xl">
                                {project.title}
                            </h1>

                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-soft">
                                <span className="flex items-center gap-2">
                                    <Briefcase size={17} className="text-blue-600" aria-hidden="true" />
                                    {project.client}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock size={17} className="text-blue-600" aria-hidden="true" />
                                    {project.duration || 'Durée à définir'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <DollarSign size={17} className="text-blue-600" aria-hidden="true" />
                                    {project.budgetMin}€ – {project.budgetMax}€
                                </span>
                            </div>

                            <div className="mt-7 border-t border-border pt-6">
                                <h2 className="font-display text-lg font-bold text-text-main">
                                    Description du projet
                                </h2>
                                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-soft">
                                    {project.description}
                                </p>
                            </div>

                            <div className="mt-7 border-t border-border pt-6">
                                <h2 className="font-display text-lg font-bold text-text-main">
                                    Compétences requises
                                </h2>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {project.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-lg border border-border bg-bg-soft px-3 py-1.5 text-xs font-medium text-text-soft"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.article>

                        <div className="rounded-2xl border border-blue-200/60 bg-blue-50 p-5 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
                            <p className="font-semibold">Données de démonstration</p>
                            <p className="mt-1 leading-relaxed text-blue-800/80 dark:text-blue-200/80">
                                Ce projet fait partie du jeu de données de démonstration. Les propositions sont
                                enregistrées localement dans votre navigateur.
                            </p>
                        </div>
                    </div>

                    <div>
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl border border-border bg-bg-main p-6 shadow-card lg:sticky lg:top-28"
                            aria-labelledby="proposal-title"
                        >
                            <h2 id="proposal-title" className="font-display text-lg font-bold text-text-main">
                                Placer une offre
                            </h2>

                            {!user ? (
                                <div className="py-6 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                                        <Send size={26} aria-hidden="true" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-text-main">
                                        Connectez-vous pour proposer
                                    </h3>
                                    <p className="mt-2 text-sm text-text-soft">
                                        Un compte freelance est nécessaire pour envoyer une offre.
                                    </p>
                                    <Link
                                        to="/login"
                                        state={{ from: `/project/${project.id}` }}
                                        className="btn btn-primary mt-5 w-full text-sm"
                                    >
                                        Se connecter
                                    </Link>
                                </div>
                            ) : user.role !== 'freelancer' && !isProjectOwner ? (
                                <div className="py-6 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
                                        <AlertCircle size={26} aria-hidden="true" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-text-main">
                                        Compte freelance requis
                                    </h3>
                                    <p className="mt-2 text-sm text-text-soft">
                                        Votre compte est configuré comme client. Créez un compte
                                        freelance pour envoyer des propositions.
                                    </p>
                                    <Link
                                        to="/register"
                                        className="btn btn-secondary mt-5 w-full text-sm"
                                    >
                                        Créer un compte freelance
                                    </Link>
                                </div>
                            ) : isProjectOwner ? (
                                <div className="py-6 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-bg-soft text-text-soft">
                                        <Briefcase size={26} aria-hidden="true" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-text-main">
                                        Votre projet
                                    </h3>
                                    <p className="mt-2 text-sm text-text-soft">
                                        Vous ne pouvez pas envoyer de proposition sur votre propre
                                        projet. Suivez les offres reçues depuis votre tableau de bord.
                                    </p>
                                    <Link to="/dashboard" className="btn btn-primary mt-5 w-full text-sm">
                                        Voir mon tableau de bord
                                    </Link>
                                </div>
                            ) : submitted ? (
                                <div className="py-6 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                                        <CheckCircle size={28} aria-hidden="true" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-text-main">Proposition enregistrée</h3>
                                    <p className="mt-2 text-sm text-text-soft">
                                        {user
                                            ? 'Vous pouvez suivre vos propositions depuis votre tableau de bord.'
                                            : 'Connectez-vous pour suivre vos propositions.'}
                                    </p>
                                    <div className="mt-5 flex flex-col gap-2">
                                        <Link to="/dashboard" className="btn btn-primary w-full text-sm">
                                            Voir mon tableau de bord
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitBid} className="mt-5 space-y-4">
                                    {error && (
                                        <p
                                            role="alert"
                                            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                                        >
                                            <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                                            {error}
                                        </p>
                                    )}

                                    <div>
                                        <label
                                            htmlFor="bid-amount"
                                            className="mb-1.5 block text-sm font-semibold text-text-main"
                                        >
                                            Votre budget (€)
                                        </label>
                                        <input
                                            id="bid-amount"
                                            type="number"
                                            required
                                            min={1}
                                            value={bidAmount}
                                            onChange={(event) => setBidAmount(event.target.value)}
                                            className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3 text-sm font-semibold text-text-main outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        <p className="mt-1 flex items-center gap-1 text-[11px] text-text-soft">
                                            <AlertCircle size={11} aria-hidden="true" />
                                            Fourchette suggérée : {project.budgetMin}€ – {project.budgetMax}€
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="bid-cover"
                                            className="mb-1.5 block text-sm font-semibold text-text-main"
                                        >
                                            Message de motivation
                                        </label>
                                        <textarea
                                            id="bid-cover"
                                            required
                                            rows={4}
                                            placeholder="Expliquez pourquoi vous êtes le meilleur candidat…"
                                            value={bidCover}
                                            onChange={(event) => setBidCover(event.target.value)}
                                            className="w-full resize-none rounded-xl border border-border bg-bg-soft px-4 py-3 text-sm text-text-main outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn btn-primary flex w-full items-center justify-center gap-2 py-3.5"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span
                                                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                                    aria-hidden="true"
                                                />
                                                Envoi…
                                            </>
                                        ) : (
                                            <>
                                                Envoyer l’offre
                                                <Send size={17} aria-hidden="true" />
                                            </>
                                        )}
                                    </button>

                                    {!user && (
                                        <p className="text-center text-[11px] text-text-soft">
                                            Vous devez être connecté pour envoyer une proposition.
                                        </p>
                                    )}
                                </form>
                            )}
                        </motion.section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
