import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { freelancers } from '../services/mockData';
import SEOMeta from '../components/common/SEOMeta';
import { useAuth } from '../context/AuthContext';
import {
    MapPin,
    Star,
    Clock,
    Briefcase,
    Award,
    Globe,
    MessageCircle,
    ChevronLeft,
    Share2,
    Heart,
    CheckCircle,
} from 'lucide-react';
import ProjectDescription from '../components/pretext/ProjectDescription';

const portfolio = [
    {
        id: 1,
        title: 'Plateforme e-commerce',
        image: `${import.meta.env.BASE_URL}assets/Projet1.jpg`,
        description: 'Exemple de réalisation — interface de démonstration.',
    },
    {
        id: 2,
        title: 'Tableau de bord analytique',
        image: `${import.meta.env.BASE_URL}assets/Projet2.jpg`,
        description: 'Exemple de réalisation — interface de démonstration.',
    },
    {
        id: 3,
        title: 'Application mobile',
        image: `${import.meta.env.BASE_URL}assets/Projet3.jpg`,
        description: 'Exemple de réalisation — interface de démonstration.',
    },
];

const getFavorites = () => {
    try {
        return JSON.parse(localStorage.getItem('favoriteFreelancers') || '[]');
    } catch {
        return [];
    }
};

const getAllReviews = () => {
    try {
        const stored = JSON.parse(localStorage.getItem('freelancerReviews') || '[]');
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
};

const getReviewsForFreelancer = (freelancerId) =>
    getAllReviews()
        .filter((review) => Number(review.freelancerId) === Number(freelancerId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const formatReviewDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date);
};

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const parsedId = parseInt(id, 10);
    const [activeTab, setActiveTab] = useState('about');
    const [favorites, setFavorites] = useState(getFavorites);
    const [shareStatus, setShareStatus] = useState('');
    const [reviews, setReviews] = useState(() => getReviewsForFreelancer(parsedId));
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewFeedback, setReviewFeedback] = useState({ type: '', message: '' });

    const freelancer = freelancers.find((item) => item.id === parsedId);

    if (!freelancer) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-bg-soft px-6 pt-32">
                <div className="text-center">
                    <h1 className="font-display text-2xl font-bold">Profil introuvable</h1>
                    <p className="mt-2 text-sm text-text-soft">Ce freelance n’existe pas ou n’est plus disponible.</p>
                    <button type="button" onClick={() => navigate('/search')} className="btn btn-primary mt-6">
                        Explorer les talents
                    </button>
                </div>
            </div>
        );
    }

    const skills = freelancer.skills || [];
    const isFavorite = favorites.includes(freelancer.id);

    const toggleFavorite = () => {
        const next = isFavorite
            ? favorites.filter((favoriteId) => favoriteId !== freelancer.id)
            : [...favorites, freelancer.id];
        setFavorites(next);
        localStorage.setItem('favoriteFreelancers', JSON.stringify(next));
    };

    const handleShare = async () => {
        const shareData = {
            title: `${freelancer.name} — ZORD Freelance`,
            text: `Découvrez le profil de ${freelancer.name} sur ZORD.`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setShareStatus('Lien copié');
                setTimeout(() => setShareStatus(''), 2500);
            }
        } catch {
            setShareStatus('Partage annulé');
            setTimeout(() => setShareStatus(''), 2500);
        }
    };

    const tabs = [
        { id: 'about', label: 'À propos' },
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'reviews', label: 'Avis' },
    ];

    const localAverage =
        reviews.length > 0
            ? (
                  reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
                  reviews.length
              ).toFixed(1)
            : null;
    const displayedRating = localAverage || freelancer.rating;
    const displayedReviewCount = reviews.length || freelancer.reviewsCount;
    const hasReviewed = Boolean(
        user?.email && reviews.some((review) => review.reviewerEmail === user.email)
    );

    const handleSubmitReview = (event) => {
        event.preventDefault();

        if (!user) {
            setReviewFeedback({
                type: 'error',
                message: 'Connectez-vous pour laisser un avis.',
            });
            return;
        }

        if (hasReviewed) {
            setReviewFeedback({
                type: 'error',
                message: 'Vous avez déjà laissé un avis sur ce profil de démonstration.',
            });
            return;
        }

        const comment = reviewComment.trim();
        if (comment.length < 10) {
            setReviewFeedback({
                type: 'error',
                message: 'Votre avis doit contenir au moins 10 caractères.',
            });
            return;
        }

        const review = {
            id: Date.now(),
            freelancerId: freelancer.id,
            reviewerName: user.name || 'Client',
            reviewerEmail: user.email,
            rating: reviewRating,
            comment,
            createdAt: new Date().toISOString(),
        };

        const nextReviews = [review, ...getAllReviews()];
        localStorage.setItem('freelancerReviews', JSON.stringify(nextReviews));
        setReviews(getReviewsForFreelancer(freelancer.id));
        setReviewComment('');
        setReviewRating(5);
        setReviewFeedback({
            type: 'success',
            message: 'Avis de démonstration enregistré localement.',
        });
    };

    return (
        <div className="min-h-screen bg-bg-soft pb-20 pt-24 sm:pt-28">
            <SEOMeta
                title={`${freelancer.name} — ${freelancer.role}`}
                description={freelancer.description}
            />

            <div className="container max-w-5xl">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-text-soft transition-colors hover:text-blue-700"
                >
                    <ChevronLeft size={18} aria-hidden="true" />
                    Retour
                </button>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* Header */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-3xl border border-border bg-bg-main p-6 shadow-card sm:p-8"
                        >
                            <div className="flex flex-col gap-6 sm:flex-row">
                                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-3xl font-bold text-blue-700 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300">
                                    {freelancer.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h1 className="font-display text-2xl font-bold text-text-main sm:text-3xl">
                                                    {freelancer.name}
                                                </h1>
                                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                    Démo
                                                </span>
                                            </div>
                                            <p className="mt-1 text-base font-medium text-blue-700">
                                                {freelancer.role}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={toggleFavorite}
                                                aria-pressed={isFavorite}
                                                aria-label={
                                                    isFavorite
                                                        ? `Retirer ${freelancer.name} des favoris`
                                                        : `Ajouter ${freelancer.name} aux favoris`
                                                }
                                                className={`rounded-xl border p-2.5 transition-colors ${
                                                    isFavorite
                                                        ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-900/60 dark:bg-red-950/40'
                                                        : 'border-border bg-bg-soft text-text-soft hover:text-red-500'
                                                }`}
                                            >
                                                <Heart
                                                    size={18}
                                                    className={isFavorite ? 'fill-current' : ''}
                                                    aria-hidden="true"
                                                />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleShare}
                                                className="rounded-xl border border-border bg-bg-soft p-2.5 text-text-soft transition-colors hover:text-blue-700"
                                                aria-label="Partager ce profil"
                                            >
                                                <Share2 size={18} aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-soft">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={15} aria-hidden="true" />
                                            {freelancer.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={15} aria-hidden="true" />
                                            Répond en {freelancer.responseTime}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Briefcase size={15} aria-hidden="true" />
                                            {freelancer.experience} d’expérience
                                        </span>
                                    </div>

                                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                                        <span className="flex items-center gap-1.5">
                                            <span className="flex" aria-hidden="true">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={16}
                                                        className={
                                                            star <= Math.round(Number(displayedRating))
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'text-gray-300'
                                                        }
                                                    />
                                                ))}
                                            </span>
                                            <span className="sr-only">
                                                Note de {displayedRating} sur 5
                                            </span>
                                            <span className="text-sm font-bold text-text-main">
                                                {displayedRating}
                                            </span>
                                            <span className="text-sm text-text-soft">
                                                ({displayedReviewCount} avis de démonstration)
                                            </span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            {freelancer.availability}
                                        </span>
                                    </div>
                                    {shareStatus && (
                                        <p role="status" className="mt-2 text-xs font-medium text-blue-700">
                                            {shareStatus}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.section>

                        {/* Tabs */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="overflow-hidden rounded-3xl border border-border bg-bg-main shadow-card"
                        >
                            <div className="border-b border-border">
                                <div className="flex gap-2 px-5 sm:gap-6 sm:px-8" role="tablist" aria-label="Informations du profil">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            role="tab"
                                            id={`tab-${tab.id}`}
                                            aria-selected={activeTab === tab.id}
                                            aria-controls={`panel-${tab.id}`}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`border-b-2 py-4 text-sm font-semibold transition-colors ${
                                                activeTab === tab.id
                                                    ? 'border-blue-600 text-blue-700'
                                                    : 'border-transparent text-text-soft hover:text-blue-700'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 sm:p-8">
                                {activeTab === 'about' && (
                                    <div
                                        id="panel-about"
                                        role="tabpanel"
                                        aria-labelledby="tab-about"
                                        className="space-y-6"
                                    >
                                        <div>
                                            <h2 className="font-display text-lg font-bold">À propos</h2>
                                            <div className="mt-3">
                                                <ProjectDescription
                                                    text={freelancer.description || ''}
                                                    maxLines={4}
                                                    lineHeight={20}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="font-display text-lg font-bold">Compétences</h2>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {skills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="rounded-xl border border-border bg-bg-soft px-3.5 py-2 text-sm font-medium text-text-main"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="font-display text-lg font-bold">Langues</h2>
                                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-soft">
                                                {freelancer.languages.map((language) => (
                                                    <span key={language} className="flex items-center gap-2">
                                                        <Globe size={16} aria-hidden="true" />
                                                        {language}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-x-8 gap-y-3 rounded-xl bg-bg-soft p-4 text-sm">
                                            <span className="flex items-center gap-2 text-text-soft">
                                                <Award size={16} className="text-blue-600" aria-hidden="true" />
                                                Taux de réussite :{' '}
                                                <strong className="text-text-main">{freelancer.successRate}%</strong>
                                            </span>
                                            <span className="flex items-center gap-2 text-text-soft">
                                                <CheckCircle size={16} className="text-blue-600" aria-hidden="true" />
                                                Disponibilité :{' '}
                                                <strong className="text-text-main">{freelancer.availability}</strong>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'portfolio' && (
                                    <div
                                        id="panel-portfolio"
                                        role="tabpanel"
                                        aria-labelledby="tab-portfolio"
                                    >
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <h2 className="font-display text-lg font-bold">Portfolio</h2>
                                            <span className="rounded-full bg-bg-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-soft">
                                                Exemples de démonstration
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            {portfolio.map((item) => (
                                                <article
                                                    key={item.id}
                                                    className="group overflow-hidden rounded-2xl border border-border"
                                                >
                                                    <div className="aspect-video overflow-hidden bg-bg-soft">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold">{item.title}</h3>
                                                        <p className="mt-1 text-xs text-text-soft">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div
                                        id="panel-reviews"
                                        role="tabpanel"
                                        aria-labelledby="tab-reviews"
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h2 className="font-display text-lg font-bold">
                                                    Avis
                                                </h2>
                                                <p className="mt-1 text-sm text-text-soft">
                                                    Retours enregistrés localement pour ce profil de
                                                    démonstration.
                                                </p>
                                            </div>
                                            <span className="rounded-full bg-bg-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-soft">
                                                Avis locaux non vérifiés
                                            </span>
                                        </div>

                                        {reviews.length > 0 ? (
                                            <ul className="space-y-4">
                                                {reviews.map((review) => (
                                                    <li
                                                        key={review.id}
                                                        className="rounded-2xl border border-border p-5"
                                                    >
                                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm font-semibold text-text-main">
                                                                    {review.reviewerName}
                                                                </p>
                                                                <p className="mt-0.5 text-xs text-text-soft">
                                                                    {formatReviewDate(review.createdAt)}
                                                                </p>
                                                            </div>
                                                            <span
                                                                className="flex items-center gap-0.5"
                                                                aria-label={`${review.rating} sur 5`}
                                                            >
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        size={14}
                                                                        aria-hidden="true"
                                                                        className={
                                                                            star <= review.rating
                                                                                ? 'fill-amber-400 text-amber-400'
                                                                                : 'text-gray-300'
                                                                        }
                                                                    />
                                                                ))}
                                                            </span>
                                                        </div>
                                                        <p className="mt-3 text-sm leading-relaxed text-text-soft">
                                                            {review.comment}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-border bg-bg-soft/50 px-6 py-8 text-center">
                                                <Star
                                                    size={26}
                                                    className="mx-auto text-text-soft"
                                                    aria-hidden="true"
                                                />
                                                <h3 className="mt-3 text-sm font-semibold text-text-main">
                                                    Aucun avis local
                                                </h3>
                                                <p className="mx-auto mt-1 max-w-sm text-xs text-text-soft">
                                                    Ce profil de démonstration n’a pas encore reçu
                                                    d’avis. Les avis sont stockés dans votre navigateur.
                                                </p>
                                            </div>
                                        )}

                                        <div className="rounded-2xl border border-border bg-bg-soft/50 p-5 sm:p-6">
                                            <h3 className="font-display text-base font-bold">
                                                Laisser un avis
                                            </h3>
                                            <p className="mt-1 text-xs text-text-soft">
                                                Démonstration locale : cet avis n’est ni vérifié ni
                                                publié sur un serveur.
                                            </p>

                                            {!user ? (
                                                <Link
                                                    to="/login"
                                                    state={{ from: `/profile/${freelancer.id}` }}
                                                    className="btn btn-primary mt-4 px-4 py-2.5 text-sm"
                                                >
                                                    Se connecter pour laisser un avis
                                                </Link>
                                            ) : hasReviewed ? (
                                                <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                                                    Vous avez déjà laissé un avis de démonstration sur ce
                                                    profil.
                                                </p>
                                            ) : (
                                                <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
                                                    <fieldset>
                                                        <legend className="text-sm font-semibold text-text-main">
                                                            Votre note
                                                        </legend>
                                                        <div className="mt-2 flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => setReviewRating(star)}
                                                                    aria-pressed={reviewRating === star}
                                                                    aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                                                                    className={`rounded-lg p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                                                        star <= reviewRating
                                                                            ? 'text-amber-500'
                                                                            : 'text-gray-300 hover:text-amber-400 dark:text-gray-600'
                                                                    }`}
                                                                >
                                                                    <Star
                                                                        size={24}
                                                                        aria-hidden="true"
                                                                        className={
                                                                            star <= reviewRating
                                                                                ? 'fill-current'
                                                                                : ''
                                                                        }
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </fieldset>

                                                    <div>
                                                        <label
                                                            htmlFor="review-comment"
                                                            className="text-sm font-semibold text-text-main"
                                                        >
                                                            Votre avis
                                                        </label>
                                                        <textarea
                                                            id="review-comment"
                                                            value={reviewComment}
                                                            onChange={(event) =>
                                                                setReviewComment(event.target.value)
                                                            }
                                                            rows={4}
                                                            maxLength={800}
                                                            required
                                                            minLength={10}
                                                            placeholder="Décrivez votre collaboration avec ce profil…"
                                                            className="mt-2 w-full rounded-xl border border-border bg-bg-main px-4 py-3 text-sm text-text-main outline-none transition-colors placeholder:text-text-soft/70 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                        />
                                                    </div>

                                                    {reviewFeedback.message && (
                                                        <p
                                                            role={
                                                                reviewFeedback.type === 'error'
                                                                    ? 'alert'
                                                                    : 'status'
                                                            }
                                                            className={`rounded-xl px-3 py-2 text-xs font-medium ${
                                                                reviewFeedback.type === 'error'
                                                                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
                                                                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                                                            }`}
                                                        >
                                                            {reviewFeedback.message}
                                                        </p>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary px-4 py-2.5 text-sm"
                                                    >
                                                        Publier l’avis
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <motion.aside
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-3xl border border-border bg-bg-main p-6 shadow-card lg:sticky lg:top-28"
                        >
                            <div className="mb-6 text-center">
                                <span className="font-display text-4xl font-bold text-text-main">
                                    {freelancer.hourlyRate}€
                                </span>
                                <span className="text-text-soft">/heure</span>
                                <p className="mt-1 text-xs text-text-soft">Tarif indicatif de démonstration</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate(`/messages?to=${freelancer.id}`)}
                                className="btn btn-primary w-full py-3.5"
                            >
                                <MessageCircle size={18} aria-hidden="true" />
                                Contacter ce profil
                            </button>

                            <button
                                type="button"
                                onClick={handleShare}
                                className="btn btn-secondary mt-3 w-full py-3.5"
                            >
                                <Share2 size={18} aria-hidden="true" />
                                Partager le profil
                            </button>

                            <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                                <div className="flex justify-between gap-3">
                                    <dt className="text-text-soft">Taux de réussite</dt>
                                    <dd className="font-bold text-text-main">{freelancer.successRate}%</dd>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <dt className="text-text-soft">Expérience</dt>
                                    <dd className="font-bold text-text-main">{freelancer.experience}</dd>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <dt className="text-text-soft">Temps de réponse</dt>
                                    <dd className="font-bold text-text-main">{freelancer.responseTime}</dd>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <dt className="text-text-soft">Localisation</dt>
                                    <dd className="font-bold text-text-main">{freelancer.location}</dd>
                                </div>
                            </dl>
                        </motion.aside>

                        <div className="rounded-2xl border border-blue-200/60 bg-blue-50 p-5 text-xs leading-relaxed text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
                            <p className="font-semibold">Profil de démonstration</p>
                            <p className="mt-1 text-blue-800/80 dark:text-blue-200/80">
                                Les informations, tarifs et exemples affichés servent à illustrer le produit.
                                Aucun paiement n’est traité.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
