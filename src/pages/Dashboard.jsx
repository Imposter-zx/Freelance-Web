import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useNotifications } from '../context/NotificationContext';
import SEOMeta from '../components/common/SEOMeta';
import {
    ArrowRight,
    Briefcase,
    CheckCircle,
    Clock,
    FileText,
    Heart,
    MessageSquare,
    PlusCircle,
    Search,
    Send,
    Settings,
    Sparkles,
    User,
} from 'lucide-react';
import StatsCard from '../components/features/StatsCard';

const readJSON = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
        return fallback;
    }
};

const relativeTime = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';
    const diffMinutes = Math.round((date.getTime() - Date.now()) / 60000);
    const formatter = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
    if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, 'minute');
    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) return formatter.format(diffHours, 'hour');
    const diffDays = Math.round(diffHours / 24);
    return formatter.format(diffDays, 'day');
};

const PROJECT_STATUS_LABELS = {
    open: 'Ouvert',
    in_progress: 'En cours',
    completed: 'Terminé',
    cancelled: 'Annulé',
};

const Dashboard = () => {
    const { user } = useAuth();
    const { unreadCount, conversations } = useMessages();
    const { addNotification } = useNotifications();
    const [postedProjects, setPostedProjects] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        setPostedProjects(readJSON('postedProjects', []));
        setProposals(readJSON('proposals', []));
        setFavorites(readJSON('favoriteFreelancers', []));
    }, []);

    const isFreelancer = user?.role === 'freelancer';
    const firstName = user?.name?.split(' ')[0] || '';

    const activeProjects = postedProjects.filter(
        (project) =>
            project.status === 'in_progress' || project.status === 'open' || !project.status
    ).length;
    const myProjectIds = new Set(postedProjects.map((project) => String(project.id)));
    const receivedProposalItems = proposals.filter((proposal) =>
        myProjectIds.has(String(proposal.projectId))
    );
    const receivedProposals = receivedProposalItems.length;
    const pendingProposals = proposals.filter((proposal) => proposal.status === 'pending');
    const pendingReceivedProposals = receivedProposalItems.filter(
        (proposal) => proposal.status === 'pending'
    );

    const persistProjects = (nextProjects) => {
        setPostedProjects(nextProjects);
        localStorage.setItem('postedProjects', JSON.stringify(nextProjects));
    };

    const persistProposals = (nextProposals) => {
        setProposals(nextProposals);
        localStorage.setItem('proposals', JSON.stringify(nextProposals));
    };

    const acceptProposal = (proposal) => {
        const nextProposals = proposals.map((item) => {
            if (String(item.projectId) !== String(proposal.projectId)) return item;
            return {
                ...item,
                status: item.id === proposal.id ? 'accepted' : 'rejected',
            };
        });
        persistProposals(nextProposals);

        const nextProjects = postedProjects.map((project) =>
            String(project.id) === String(proposal.projectId) &&
            (project.status === 'open' || !project.status)
                ? { ...project, status: 'in_progress', acceptedProposalId: proposal.id }
                : project
        );
        persistProjects(nextProjects);

        addNotification({
            type: 'proposal',
            title: 'Proposition acceptée',
            message: `${proposal.freelancerName || 'Un freelance'} a été sélectionné pour « ${
                proposal.projectTitle
            } ».`,
        });
    };

    const completeProject = (project) => {
        const nextProjects = postedProjects.map((item) =>
            String(item.id) === String(project.id)
                ? { ...item, status: 'completed', completedAt: new Date().toISOString() }
                : item
        );
        persistProjects(nextProjects);

        addNotification({
            type: 'project',
            title: 'Projet terminé',
            message: `« ${project.title} » est maintenant marqué comme terminé.`,
        });
    };

    const projectStatusStyles = {
        open: {
            label: PROJECT_STATUS_LABELS.open,
            className:
                'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        },
        in_progress: {
            label: PROJECT_STATUS_LABELS.in_progress,
            className: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
        },
        completed: {
            label: PROJECT_STATUS_LABELS.completed,
            className:
                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        },
        cancelled: {
            label: PROJECT_STATUS_LABELS.cancelled,
            className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
        },
    };

    const proposalStatusStyles = {
        pending: {
            label: 'En attente',
            className:
                'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
        },
        accepted: {
            label: 'Acceptée',
            className:
                'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        },
        rejected: {
            label: 'Refusée',
            className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        },
    };

    const profileFields = [
        { label: 'Nom', complete: Boolean(user?.name) },
        { label: 'Adresse e-mail', complete: Boolean(user?.email) },
        { label: 'Rôle', complete: Boolean(user?.role) },
        { label: 'Biographie', complete: Boolean(user?.bio) },
        { label: 'Localisation', complete: Boolean(user?.location) },
    ];
    const completedFields = profileFields.filter((field) => field.complete).length;
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

    const stats = isFreelancer
        ? [
              {
                  label: 'Propositions envoyées',
                  value: proposals.length,
                  icon: <Send size={20} />,
                  color: 'bg-blue-600',
              },
              {
                  label: 'En attente de réponse',
                  value: pendingProposals.length,
                  icon: <Clock size={20} />,
                  color: 'bg-amber-500',
              },
              {
                  label: 'Messages non lus',
                  value: unreadCount,
                  icon: <MessageSquare size={20} />,
                  color: 'bg-indigo-600',
              },
              {
                  label: 'Profils favoris',
                  value: favorites.length,
                  icon: <Heart size={20} />,
                  color: 'bg-rose-500',
              },
          ]
        : [
              {
                  label: 'Projets publiés',
                  value: postedProjects.length,
                  icon: <FileText size={20} />,
                  color: 'bg-blue-600',
              },
              {
                  label: 'Projets actifs',
                  value: activeProjects,
                  icon: <Briefcase size={20} />,
                  color: 'bg-emerald-600',
              },
              {
                  label: 'Propositions reçues',
                  value: receivedProposals,
                  icon: <Send size={20} />,
                  color: 'bg-indigo-600',
              },
              {
                  label: 'Messages non lus',
                  value: unreadCount,
                  icon: <MessageSquare size={20} />,
                  color: 'bg-amber-500',
              },
          ];

    const quickActions = isFreelancer
        ? [
              {
                  label: 'Explorer les projets',
                  description: 'Découvrez les briefs récents',
                  to: '/#recent-projects',
                  icon: Search,
              },
              {
                  label: 'Compléter mon profil',
                  description: 'Ajoutez votre bio et localisation',
                  to: '/settings',
                  icon: User,
              },
              {
                  label: 'Mes messages',
                  description: 'Échangez avec les clients',
                  to: '/messages',
                  icon: MessageSquare,
              },
              {
                  label: 'Paramètres',
                  description: 'Gérez votre compte',
                  to: '/settings',
                  icon: Settings,
              },
          ]
        : [
              {
                  label: 'Publier un projet',
                  description: 'Décrivez votre besoin',
                  to: '/post-project',
                  icon: PlusCircle,
              },
              {
                  label: 'Trouver un talent',
                  description: 'Parcourez les profils',
                  to: '/search',
                  icon: Search,
              },
              {
                  label: 'Mes messages',
                  description: 'Échangez avec les freelances',
                  to: '/messages',
                  icon: MessageSquare,
              },
              {
                  label: 'Paramètres',
                  description: 'Gérez votre compte',
                  to: '/settings',
                  icon: Settings,
              },
          ];

    const activity = useMemo(() => {
        const projectItems = postedProjects.map((project) => {
            const proposalCount = proposals.filter(
                (proposal) => String(proposal.projectId) === String(project.id)
            ).length;
            return {
                id: `project-${project.id}`,
                type: 'project',
                title: project.title,
                description: `${PROJECT_STATUS_LABELS[project.status || 'open']} · ${
                    proposalCount > 0
                        ? `${proposalCount} proposition${proposalCount > 1 ? 's' : ''} reçue${
                              proposalCount > 1 ? 's' : ''
                          }`
                        : 'En attente de propositions'
                }`,
                date: project.completedAt || project.createdAt,
            };
        });
        const proposalItems = proposals.map((proposal) => ({
            id: `proposal-${proposal.id}`,
            type: 'proposal',
            title: proposal.projectTitle,
            description: `Proposition de ${Number(proposal.amount).toLocaleString('fr-FR')} € · ${
                proposal.status === 'accepted'
                    ? 'acceptée'
                    : proposal.status === 'rejected'
                      ? 'refusée'
                      : 'en attente'
            }`,
            date: proposal.createdAt,
        }));
        const messageItems = conversations
            .filter((conversation) => conversation.lastMessage)
            .map((conversation) => ({
                id: `conversation-${conversation.id}`,
                type: 'message',
                title: conversation.participantName,
                description: conversation.lastMessage,
                date: conversation.timestamp,
            }));

        return [...projectItems, ...proposalItems, ...messageItems]
            .filter((item) => item.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 6);
    }, [postedProjects, proposals, conversations]);

    const activityIcons = {
        project: FileText,
        proposal: Send,
        message: MessageSquare,
    };

    return (
        <div className="min-h-screen bg-bg-soft pb-20 pt-28 sm:pt-32">
            <SEOMeta title="Tableau de bord" description="Gérez vos projets et collaborations." noIndex />

            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                >
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                            <Sparkles size={12} aria-hidden="true" />
                            {isFreelancer ? 'Espace freelance' : 'Espace client'}
                        </span>
                        <h1 className="mt-3 font-display text-2xl font-bold text-text-main sm:text-3xl">
                            Bonjour{firstName ? `, ${firstName}` : ''}
                        </h1>
                        <p className="mt-1 text-sm text-text-soft">
                            {isFreelancer
                                ? 'Suivez vos propositions et vos échanges en un coup d’œil.'
                                : 'Pilotez vos projets et les propositions reçues en un coup d’œil.'}
                        </p>
                    </div>
                    <span className="self-start rounded-full border border-border bg-bg-main px-3 py-1.5 text-[11px] font-medium text-text-soft sm:self-auto">
                        Données locales de démonstration
                    </span>
                </motion.div>

                <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs">
                    {stats.map((stat, index) => (
                        <StatsCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            delay={index * 0.06}
                        />
                    ))}
                </section>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                    <div className="space-y-6">
                        {/* Projects / proposals */}
                        <section className="rounded-2xl border border-border bg-bg-main p-6 shadow-card">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="font-display text-lg font-bold">
                                    {isFreelancer ? 'Mes propositions' : 'Mes projets'}
                                </h2>
                                <Link
                                    to={isFreelancer ? '/search' : '/post-project'}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
                                >
                                    {isFreelancer ? 'Trouver des projets' : 'Nouveau projet'}
                                    <ArrowRight size={15} aria-hidden="true" />
                                </Link>
                            </div>

                            <div className="mt-5 space-y-3">
                                {isFreelancer ? (
                                    proposals.length > 0 ? (
                                        proposals.slice(0, 5).map((proposal) => (
                                            <article
                                                key={proposal.id}
                                                className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-sm font-semibold text-text-main">
                                                        {proposal.projectTitle}
                                                    </h3>
                                                    <p className="mt-0.5 text-xs text-text-soft">
                                                        Envoyée {relativeTime(proposal.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-text-main">
                                                        {Number(proposal.amount).toLocaleString('fr-FR')} €
                                                    </span>
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                            (
                                                                proposalStatusStyles[
                                                                    proposal.status || 'pending'
                                                                ] || proposalStatusStyles.pending
                                                            ).className
                                                        }`}
                                                    >
                                                        {
                                                            (
                                                                proposalStatusStyles[
                                                                    proposal.status || 'pending'
                                                                ] || proposalStatusStyles.pending
                                                            ).label
                                                        }
                                                    </span>
                                                </div>
                                            </article>
                                        ))
                                    ) : (
                                        <EmptyState
                                            icon={Send}
                                            title="Aucune proposition envoyée"
                                            description="Explorez les projets ouverts et envoyez votre première proposition."
                                            actionLabel="Explorer les projets"
                                            actionTo="/#recent-projects"
                                        />
                                    )
                                ) : postedProjects.length > 0 ? (
                                    postedProjects.slice(0, 5).map((project) => {
                                        const status =
                                            projectStatusStyles[project.status || 'open'] ||
                                            projectStatusStyles.open;
                                        const projectProposalCount = proposals.filter(
                                            (proposal) =>
                                                String(proposal.projectId) === String(project.id)
                                        ).length;

                                        return (
                                            <article
                                                key={project.id}
                                                className="rounded-xl border border-border p-4"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="min-w-0">
                                                        <h3 className="truncate text-sm font-semibold text-text-main">
                                                            {project.title}
                                                        </h3>
                                                        <p className="mt-0.5 text-xs text-text-soft">
                                                            Publié {relativeTime(project.createdAt)} ·{' '}
                                                            {project.budgetMin}€ – {project.budgetMax}€
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-bg-soft px-2.5 py-1 text-[11px] font-semibold text-text-soft">
                                                            {projectProposalCount} proposition
                                                            {projectProposalCount > 1 ? 's' : ''}
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
                                                        >
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </div>

                                                {project.status !== 'completed' &&
                                                    project.status !== 'cancelled' && (
                                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                                                            <p className="text-[11px] text-text-soft">
                                                                {project.status === 'in_progress'
                                                                    ? 'La collaboration est en cours.'
                                                                    : 'Vous pouvez clôturer ce projet une fois la prestation terminée.'}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => completeProject(project)}
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold text-text-main transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30"
                                                            >
                                                                <CheckCircle size={13} aria-hidden="true" />
                                                                Marquer terminé
                                                            </button>
                                                        </div>
                                                    )}
                                            </article>
                                        );
                                    })
                                ) : (
                                    <EmptyState
                                        icon={FileText}
                                        title="Aucun projet publié"
                                        description="Publiez votre premier brief pour recevoir des propositions de freelances."
                                        actionLabel="Publier un projet"
                                        actionTo="/post-project"
                                    />
                                )}
                            </div>
                        </section>

                        {!isFreelancer && receivedProposalItems.length > 0 && (
                            <section
                                aria-labelledby="received-proposals"
                                className="rounded-2xl border border-border bg-bg-main p-6 shadow-card"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2
                                            id="received-proposals"
                                            className="font-display text-lg font-bold"
                                        >
                                            Propositions reçues
                                        </h2>
                                        <p className="mt-1 text-xs text-text-soft">
                                            {pendingReceivedProposals.length > 0
                                                ? `${pendingReceivedProposals.length} proposition${
                                                      pendingReceivedProposals.length > 1 ? 's' : ''
                                                  } en attente de votre décision.`
                                                : 'Toutes les propositions ont été traitées.'}
                                        </p>
                                    </div>
                                    <span className="rounded-full border border-border bg-bg-soft px-2.5 py-1 text-[11px] font-medium text-text-soft">
                                        Démonstration locale
                                    </span>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {receivedProposalItems.slice(0, 6).map((proposal) => {
                                        const parentProject = postedProjects.find(
                                            (project) =>
                                                String(project.id) === String(proposal.projectId)
                                        );
                                        const status =
                                            proposalStatusStyles[proposal.status || 'pending'] ||
                                            proposalStatusStyles.pending;
                                        const canAccept =
                                            (proposal.status || 'pending') === 'pending' &&
                                            (parentProject?.status === 'open' ||
                                                !parentProject?.status);

                                        return (
                                            <article
                                                key={proposal.id}
                                                className="rounded-xl border border-border p-4"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                                            {proposal.projectTitle}
                                                        </p>
                                                        <h3 className="mt-1 text-sm font-semibold text-text-main">
                                                            {proposal.freelancerName || 'Freelance'}
                                                        </h3>
                                                        <p className="mt-1 line-clamp-2 text-xs text-text-soft">
                                                            {proposal.cover}
                                                        </p>
                                                    </div>
                                                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                                                        <span className="text-sm font-bold text-text-main">
                                                            {Number(proposal.amount).toLocaleString(
                                                                'fr-FR'
                                                            )}{' '}
                                                            €
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
                                                        >
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </div>

                                                {canAccept && (
                                                    <div className="mt-3 flex justify-end border-t border-border pt-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => acceptProposal(proposal)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-blue-700"
                                                        >
                                                            <CheckCircle
                                                                size={13}
                                                                aria-hidden="true"
                                                            />
                                                            Accepter cette proposition
                                                        </button>
                                                    </div>
                                                )}
                                            </article>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Quick actions */}
                        <section aria-labelledby="quick-actions">
                            <h2 id="quick-actions" className="mb-3 font-display text-lg font-bold">
                                Actions rapides
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {quickActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <Link
                                            key={action.label}
                                            to={action.to}
                                            className="group flex items-center gap-3 rounded-xl border border-border bg-bg-main p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-card"
                                        >
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                <Icon size={19} aria-hidden="true" />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-sm font-semibold text-text-main group-hover:text-blue-700">
                                                    {action.label}
                                                </span>
                                                <span className="block truncate text-xs text-text-soft">
                                                    {action.description}
                                                </span>
                                            </span>
                                            <ArrowRight
                                                size={16}
                                                aria-hidden="true"
                                                className="ml-auto shrink-0 text-text-soft"
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        {/* Profile completion */}
                        <section className="rounded-2xl border border-border bg-bg-main p-6 shadow-card">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="font-display text-lg font-bold">Votre profil</h2>
                                <span className="text-sm font-bold text-blue-700">{profileCompletion}%</span>
                            </div>
                            <div
                                className="mt-3 h-2 overflow-hidden rounded-full bg-bg-soft"
                                role="progressbar"
                                aria-valuenow={profileCompletion}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="Complétion du profil"
                            >
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all"
                                    style={{ width: `${profileCompletion}%` }}
                                />
                            </div>
                            <ul className="mt-4 space-y-2.5">
                                {profileFields.map((field) => (
                                    <li
                                        key={field.label}
                                        className="flex items-center gap-2 text-sm text-text-soft"
                                    >
                                        <CheckCircle
                                            size={15}
                                            className={
                                                field.complete
                                                    ? 'text-emerald-600'
                                                    : 'text-gray-300 dark:text-gray-600'
                                            }
                                            aria-hidden="true"
                                        />
                                        {field.label}
                                        <span className="sr-only">
                                            {field.complete ? 'complété' : 'à compléter'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/settings" className="btn btn-secondary mt-5 w-full text-sm">
                                Modifier mon profil
                            </Link>
                        </section>

                        {/* Activity */}
                        <section className="rounded-2xl border border-border bg-bg-main p-6 shadow-card">
                            <h2 className="font-display text-lg font-bold">Activité récente</h2>
                            {activity.length > 0 ? (
                                <ul className="mt-4 space-y-4">
                                    {activity.map((item) => {
                                        const Icon = activityIcons[item.type];
                                        return (
                                            <li key={item.id} className="flex items-start gap-3">
                                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-soft text-text-soft">
                                                    <Icon size={15} aria-hidden="true" />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-text-main">
                                                        {item.title}
                                                    </p>
                                                    <p className="truncate text-xs text-text-soft">
                                                        {item.description}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] text-text-soft">
                                                        {relativeTime(item.date)}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="mt-3 text-sm text-text-soft">
                                    Aucune activité pour le moment. Vos projets, propositions et messages
                                    apparaîtront ici.
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ icon: Icon, title, description, actionLabel, actionTo }) => (
    <div className="rounded-xl border border-dashed border-border bg-bg-soft/50 px-6 py-10 text-center">
        <Icon size={26} className="mx-auto text-text-soft" aria-hidden="true" />
        <h3 className="mt-3 text-sm font-semibold text-text-main">{title}</h3>
        <p className="mx-auto mt-1 max-w-sm text-xs text-text-soft">{description}</p>
        <Link to={actionTo} className="btn btn-primary mt-4 px-4 py-2 text-xs">
            {actionLabel}
        </Link>
    </div>
);

export default Dashboard;
