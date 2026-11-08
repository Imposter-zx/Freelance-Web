import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    BadgeCheck,
    Briefcase,
    Code2,
    MapPin,
    MonitorSmartphone,
    Plus,
    Search,
    Sparkles,
    Star,
    TrendingUp,
    Users,
} from 'lucide-react';
import SEOMeta from '../components/common/SEOMeta';
import { freelancers, projects, services } from '../services/mockData';
import { homeContent } from '../locales/homeContent';
import { useLanguage } from '../context/LanguageContext';
import { containerVariants, itemVariants } from '../utils/animations';

const serviceIcons = {
    MonitorSmart: MonitorSmartphone,
    Code2,
    TrendingUp,
};

const Home = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const copy = homeContent[language] || homeContent.fr;

    const handleSearch = (event) => {
        event.preventDefault();
        const trimmed = query.trim();
        navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
    };

    const featuredFreelancer = freelancers[1] || freelancers[0];

    return (
        <div className="bg-bg-main">
            <SEOMeta
                title={t('hero.titleHighlight')}
                description={copy.heroSubtitle}
                keywords="freelance, marketplace, talents, projets, ZORD"
            />

            {/* Hero */}
            <section className="relative overflow-hidden bg-bg-main pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.10),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_40%)]"
                />
                <div className="container relative">
                    <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                                <Sparkles size={14} aria-hidden="true" />
                                {copy.badge}
                            </span>

                            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-text-main sm:text-5xl lg:text-6xl">
                                {copy.heroTitle}{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                                    {copy.heroTitleAccent}
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-soft sm:text-lg">
                                {copy.heroSubtitle}
                            </p>

                            <form
                                onSubmit={handleSearch}
                                className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-border bg-bg-main p-2 shadow-card sm:flex-row"
                                role="search"
                            >
                                <label htmlFor="hero-search" className="sr-only">
                                    {copy.searchPlaceholder}
                                </label>
                                <div className="relative flex-1">
                                    <Search
                                        size={18}
                                        aria-hidden="true"
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-soft"
                                    />
                                    <input
                                        id="hero-search"
                                        type="search"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder={copy.searchPlaceholder}
                                        className="w-full rounded-xl border-0 bg-transparent py-3 pl-10 pr-4 text-sm outline-none placeholder:text-text-soft focus:ring-2 focus:ring-blue-500/30"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary shrink-0 px-6 py-3 text-sm"
                                >
                                    {copy.searchButton}
                                    <ArrowRight size={16} aria-hidden="true" />
                                </button>
                            </form>

                            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-text-soft">
                                {copy.trust.map((item) => (
                                    <span key={item} className="inline-flex items-center gap-1.5">
                                        <BadgeCheck size={15} className="text-blue-600" aria-hidden="true" />
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link to="/search" className="btn btn-primary px-6">
                                    {copy.browseTalents}
                                    <ArrowRight size={17} aria-hidden="true" />
                                </Link>
                                <Link to="/post-project" className="btn btn-secondary px-6">
                                    {copy.publishProject}
                                </Link>
                            </div>
                        </motion.div>

                        {/* Profile preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 30, rotate: 1 }}
                            animate={{ opacity: 1, y: 0, rotate: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end"
                        >
                            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-600/10 via-indigo-500/10 to-transparent blur-2xl" />
                            <div className="rounded-[1.75rem] border border-border bg-bg-main p-6 shadow-card">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-text-soft">
                                        {copy.previewLabel}
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        {featuredFreelancer.availability}
                                    </span>
                                </div>

                                <div className="mt-6 flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-2xl font-bold text-blue-700 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300">
                                        {featuredFreelancer.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-display text-lg font-bold text-text-main">
                                            {featuredFreelancer.name}
                                        </p>
                                        <p className="truncate text-sm text-text-soft">
                                            {featuredFreelancer.role}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-text-soft">
                                            <MapPin size={12} aria-hidden="true" />
                                            {featuredFreelancer.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between rounded-xl bg-bg-soft px-4 py-3">
                                    <span className="flex items-center gap-1.5 text-sm font-semibold text-text-main">
                                        <Star size={15} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                                        {featuredFreelancer.rating}
                                        <span className="font-normal text-text-soft">
                                            ({featuredFreelancer.reviewsCount})
                                        </span>
                                    </span>
                                    <span className="text-sm font-bold text-text-main">
                                        {featuredFreelancer.hourlyRate}€
                                        <span className="font-normal text-text-soft">{copy.perHour}</span>
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {featuredFreelancer.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-lg border border-border bg-bg-main px-2.5 py-1 text-xs font-medium text-text-soft"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    to={`/profile/${featuredFreelancer.id}`}
                                    className="mt-6 flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-main transition-colors hover:border-blue-300 hover:text-blue-700"
                                >
                                    {copy.viewAll}
                                    <ArrowRight size={16} aria-hidden="true" />
                                </Link>
                            </div>
                            <span className="mt-3 block text-center text-[11px] text-text-soft">
                                {copy.demoProfiles}
                            </span>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured freelancers */}
            <section className="section bg-bg-soft/60" aria-labelledby="featured-talent">
                <div className="container">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 id="featured-talent" className="font-display text-2xl font-bold sm:text-3xl">
                                {copy.freelancersTitle}
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm text-text-soft sm:text-base">
                                {copy.freelancersSubtitle}
                            </p>
                        </div>
                        <Link
                            to="/search"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
                        >
                            {copy.viewAll}
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>

                    <motion.div
                        className="mt-8 grid gap-5 md:grid-cols-3"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                    >
                        {freelancers.map((freelancer) => (
                            <motion.article key={freelancer.id} variants={itemVariants}>
                                <Link
                                    to={`/profile/${freelancer.id}`}
                                    className="group flex h-full flex-col rounded-2xl border border-border bg-bg-main p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-card-hover"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-lg font-bold text-blue-700 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300">
                                            {freelancer.name.charAt(0)}
                                        </div>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                            <Star size={12} className="fill-current" aria-hidden="true" />
                                            {freelancer.rating}
                                        </span>
                                    </div>
                                    <h3 className="mt-4 font-display text-base font-bold text-text-main transition-colors group-hover:text-blue-700">
                                        {freelancer.name}
                                    </h3>
                                    <p className="text-sm text-text-soft">{freelancer.role}</p>
                                    <p className="mt-1 flex items-center gap-1 text-xs text-text-soft">
                                        <MapPin size={12} aria-hidden="true" />
                                        {freelancer.location}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {freelancer.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-md bg-bg-soft px-2 py-1 text-[11px] font-medium text-text-soft"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm">
                                        <span className="text-text-soft">
                                            {freelancer.experience} {copy.experience}
                                        </span>
                                        <span className="font-bold text-text-main">
                                            {freelancer.hourlyRate}€
                                            <span className="font-normal text-text-soft">{copy.perHour}</span>
                                        </span>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </motion.div>
                    <p className="mt-4 text-center text-[11px] text-text-soft">{copy.demoProfiles}</p>
                </div>
            </section>

            {/* Services */}
            <section className="section" aria-labelledby="services">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 id="services" className="font-display text-2xl font-bold sm:text-3xl">
                            {t('services.title')}
                        </h2>
                        <p className="mt-3 text-sm text-text-soft sm:text-base">{t('services.subtitle')}</p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {services.map((service) => {
                            const Icon = serviceIcons[service.icon] || Briefcase;
                            return (
                                <article
                                    key={service.id}
                                    className="group rounded-2xl border border-border bg-bg-main p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-card-hover"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                        <Icon size={21} aria-hidden="true" />
                                    </div>
                                    <h3 className="mt-5 font-display text-base font-bold text-text-main">
                                        {service.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-text-soft">
                                        {service.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="section bg-bg-soft/60" aria-labelledby="how-it-works">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 id="how-it-works" className="font-display text-2xl font-bold sm:text-3xl">
                            {t('howItWorks.title')}
                        </h2>
                        <p className="mt-3 text-sm text-text-soft sm:text-base">{t('howItWorks.subtitle')}</p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {[1, 2, 3].map((step, index) => (
                            <div
                                key={step}
                                className="relative rounded-2xl border border-border bg-bg-main p-6 shadow-card"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                    {step}
                                </span>
                                <h3 className="mt-4 font-display text-base font-bold text-text-main">
                                    {t(`howItWorks.step${step}.title`)}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-text-soft">
                                    {t(`howItWorks.step${step}.desc`)}
                                </p>
                                {index < 2 && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute -right-3 top-9 hidden h-px w-6 bg-border md:block"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects */}
            <section className="section" aria-labelledby="recent-projects">
                <div className="container">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 id="recent-projects" className="font-display text-2xl font-bold sm:text-3xl">
                                {copy.projectsTitle}
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm text-text-soft sm:text-base">
                                {copy.projectsSubtitle}
                            </p>
                        </div>
                        <Link
                            to="/work"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
                        >
                            {t('nav.postProject')}
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                        {projects.map((project) => (
                            <article
                                key={project.id}
                                className="flex h-full flex-col rounded-2xl border border-border bg-bg-main p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-card-hover"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        {project.status === 'open' ? 'Ouvert' : 'Fermé'}
                                    </span>
                                    <span className="text-xs font-medium text-text-soft">{project.duration}</span>
                                </div>
                                <h3 className="mt-4 font-display text-base font-bold text-text-main">
                                    {project.title}
                                </h3>
                                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-soft">
                                    {project.description}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {project.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-md bg-bg-soft px-2 py-1 text-[11px] font-medium text-text-soft"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                                    <span className="text-sm font-bold text-text-main">
                                        {project.budgetMin}€ – {project.budgetMax}€
                                    </span>
                                    <Link
                                        to={`/project/${project.id}`}
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
                                    >
                                        {t('portfolio.viewProject')}
                                        <ArrowRight size={14} aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                    <p className="mt-4 text-center text-[11px] text-text-soft">{copy.demoProjects}</p>
                </div>
            </section>

            {/* FAQ */}
            <section className="section bg-bg-soft/60" aria-labelledby="faq">
                <div className="container max-w-3xl">
                    <div className="text-center">
                        <h2 id="faq" className="font-display text-2xl font-bold sm:text-3xl">
                            {copy.faqTitle}
                        </h2>
                        <p className="mt-3 text-sm text-text-soft sm:text-base">{copy.faqSubtitle}</p>
                    </div>

                    <div className="mt-8 space-y-3">
                        {copy.faq.map((item) => (
                            <details
                                key={item.q}
                                className="group rounded-xl border border-border bg-bg-main px-5 py-4 shadow-sm"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-text-main marker:content-none">
                                    {item.q}
                                    <Plus
                                        size={17}
                                        aria-hidden="true"
                                        className="shrink-0 text-text-soft transition-transform group-open:rotate-45"
                                    />
                                </summary>
                                <p className="mt-3 text-sm leading-relaxed text-text-soft">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="pb-20 pt-4 sm:pb-24">
                <div className="container">
                    <div className="relative overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-600 to-indigo-600 px-6 py-12 text-center text-white shadow-card sm:px-10 sm:py-16">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_45%)]"
                        />
                        <div className="relative mx-auto max-w-2xl">
                            <Users size={28} className="mx-auto mb-4 text-blue-100" aria-hidden="true" />
                            <h2 className="font-display text-2xl font-bold sm:text-3xl">{copy.ctaTitle}</h2>
                            <p className="mt-3 text-sm text-blue-100 sm:text-base">{copy.ctaSubtitle}</p>
                            <div className="mt-7 flex flex-wrap justify-center gap-3">
                                <Link
                                    to="/register"
                                    className="btn bg-white px-6 text-blue-700 hover:bg-blue-50"
                                >
                                    {copy.ctaPrimary}
                                    <ArrowRight size={17} aria-hidden="true" />
                                </Link>
                                <Link
                                    to="/search"
                                    className="btn border border-white/30 bg-white/10 px-6 text-white hover:bg-white/20"
                                >
                                    {copy.ctaSecondary}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
