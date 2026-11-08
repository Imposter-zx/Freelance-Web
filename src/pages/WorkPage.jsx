import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEOMeta from '../components/common/SEOMeta';
import { ArrowRight, CheckCircle, MessageSquare, Search, User, FileText } from 'lucide-react';

const benefits = [
    {
        icon: User,
        title: 'Un profil qui vous ressemble',
        description: 'Présentez vos compétences, votre expérience et vos exemples de réalisations.',
    },
    {
        icon: Search,
        title: 'Des projets ciblés',
        description: 'Parcourez les briefs publiés et proposez vos services sur ceux qui vous correspondent.',
    },
    {
        icon: MessageSquare,
        title: 'Des échanges centralisés',
        description: 'Discutez avec les clients depuis la messagerie intégrée à votre espace.',
    },
];

const steps = [
    'Créez votre compte freelance en quelques secondes.',
    'Complétez votre profil et ajoutez vos compétences.',
    'Explorez les projets et envoyez vos propositions.',
];

const WorkPage = () => (
    <div className="min-h-screen bg-bg-soft pb-20 pt-28 sm:pt-32">
        <SEOMeta
            title="Devenir freelance"
            description="Créez votre profil freelance sur ZORD et proposez vos services aux clients."
        />

        <div className="container max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    Espace freelance
                </span>
                <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
                    Développez votre activité avec des projets qui vous ressemblent.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-soft sm:text-base">
                    ZORD met en relation les freelances et les clients autour de briefs clairs. Créez
                    votre profil, suivez vos propositions et échangez depuis un seul espace.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/register" className="btn btn-primary px-6">
                        Créer mon compte freelance
                        <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    <Link to="/search" className="btn btn-secondary px-6">
                        Explorer la plateforme
                    </Link>
                </div>
            </motion.div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
                {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                        <motion.article
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.08 }}
                            className="rounded-2xl border border-border bg-bg-main p-6 shadow-card"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                <Icon size={20} aria-hidden="true" />
                            </span>
                            <h2 className="mt-4 font-display text-base font-bold text-text-main">
                                {benefit.title}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-text-soft">
                                {benefit.description}
                            </p>
                        </motion.article>
                    );
                })}
            </div>

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 rounded-2xl border border-border bg-bg-main p-6 shadow-card sm:p-8"
            >
                <div className="flex items-center gap-2">
                    <FileText size={19} className="text-blue-600" aria-hidden="true" />
                    <h2 className="font-display text-lg font-bold">Comment démarrer</h2>
                </div>
                <ol className="mt-5 space-y-4">
                    {steps.map((step, index) => (
                        <li key={step} className="flex items-start gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                {index + 1}
                            </span>
                            <span className="flex items-center gap-2 pt-0.5 text-sm text-text-soft">
                                <CheckCircle size={15} className="shrink-0 text-emerald-600" aria-hidden="true" />
                                {step}
                            </span>
                        </li>
                    ))}
                </ol>
                <div className="mt-6 rounded-xl border border-blue-200/60 bg-blue-50 p-4 text-xs leading-relaxed text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
                    Version démonstration : les projets, profils et messages sont des exemples stockés
                    localement dans votre navigateur. Aucun paiement n’est traité.
                </div>
            </motion.section>
        </div>
    </div>
);

export default WorkPage;
