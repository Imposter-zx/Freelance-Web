import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { freelancers } from '../services/mockData';
import SEOMeta from '../components/common/SEOMeta';
import { useLanguage } from '../context/LanguageContext';
import {
    Search,
    MapPin,
    Star,
    MessageCircle,
    Briefcase,
    X,
    SlidersHorizontal,
    ArrowRight,
} from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/animations';
import { filterFreelancers, EXPERIENCE_LEVELS } from '../utils/freelancerFilters';
import { ProjectDescription } from '../components/pretext';

const ALL_SKILLS = [
    'React',
    'Node.js',
    'AWS',
    'Figma',
    'Webflow',
    'SEO',
    'Copywriting',
    'Analytics',
    'Python',
    'Design',
];

const SearchFreelance = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('relevance');
    const [filters, setFilters] = useState({
        skills: [],
        minRating: 0,
        experience: '',
    });

    useEffect(() => {
        setSearchTerm(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        const next = new URLSearchParams(searchParams);
        if (value.trim()) {
            next.set('q', value);
        } else {
            next.delete('q');
        }
        setSearchParams(next, { replace: true });
    };

    const filteredFreelancers = useMemo(
        () =>
            filterFreelancers({
                freelancers,
                searchTerm,
                filters,
                sortBy,
            }),
        [filters, searchTerm, sortBy]
    );

    const toggleSkill = (skill) => {
        setFilters((current) => ({
            ...current,
            skills: current.skills.includes(skill)
                ? current.skills.filter((item) => item !== skill)
                : [...current.skills, skill],
        }));
    };

    const clearFilters = () => {
        setFilters({ skills: [], minRating: 0, experience: '' });
        handleSearchChange('');
    };

    const activeFiltersCount =
        filters.skills.length +
        (filters.minRating > 0 ? 1 : 0) +
        (filters.experience ? 1 : 0);

    return (
        <div className="min-h-screen bg-bg-soft pb-20 pt-28 sm:pt-32">
            <SEOMeta title={t('search.pageTitle')} description={t('search.pageDescription')} />

            <div className="container">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="font-display text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
                        {t('search.title')}
                    </h1>
                    <p className="mt-3 text-sm text-text-soft sm:text-base">{t('search.subtitle')}</p>
                </div>

                {/* Search */}
                <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <label htmlFor="freelancer-search" className="sr-only">
                            {t('search.searchPlaceholder')}
                        </label>
                        <Search
                            size={19}
                            aria-hidden="true"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft"
                        />
                        <input
                            id="freelancer-search"
                            type="search"
                            placeholder={t('search.searchPlaceholder')}
                            className="w-full rounded-xl border border-border bg-bg-main py-3.5 pl-11 pr-4 text-sm text-text-main shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            value={searchTerm}
                            onChange={(event) => handleSearchChange(event.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters((value) => !value)}
                        className={`btn px-5 ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
                        aria-expanded={showFilters}
                        aria-controls="search-filters"
                    >
                        <SlidersHorizontal size={18} aria-hidden="true" />
                        {t('search.filters')}
                        {activeFiltersCount > 0 && (
                            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-current">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filters */}
                <AnimatePresence initial={false}>
                    {showFilters && (
                        <motion.div
                            id="search-filters"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mx-auto mt-4 max-w-3xl overflow-hidden"
                        >
                            <div className="rounded-2xl border border-border bg-bg-main p-5 shadow-card">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-text-main">
                                        {t('search.advancedFilters')}
                                    </h2>
                                    {activeFiltersCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
                                        >
                                            <X size={13} aria-hidden="true" />
                                            {t('search.clearAll')}
                                        </button>
                                    )}
                                </div>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <span className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-text-soft">
                                            {t('search.skills')}
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {ALL_SKILLS.map((skill) => {
                                                const active = filters.skills.includes(skill);
                                                return (
                                                    <button
                                                        key={skill}
                                                        type="button"
                                                        onClick={() => toggleSkill(skill)}
                                                        aria-pressed={active}
                                                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                                            active
                                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                                : 'border-border bg-bg-soft text-text-soft hover:border-blue-300 hover:text-text-main'
                                                        }`}
                                                    >
                                                        {skill}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <span className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-text-soft">
                                                {t('search.minRating')}
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {[0, 3, 4, 4.5].map((rating) => {
                                                    const active = filters.minRating === rating;
                                                    return (
                                                        <button
                                                            key={rating}
                                                            type="button"
                                                            onClick={() =>
                                                                setFilters((current) => ({
                                                                    ...current,
                                                                    minRating: rating,
                                                                }))
                                                            }
                                                            aria-pressed={active}
                                                            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                                                active
                                                                    ? 'border-blue-600 bg-blue-600 text-white'
                                                                    : 'border-border bg-bg-soft text-text-soft hover:border-blue-300'
                                                            }`}
                                                        >
                                                            <Star
                                                                size={12}
                                                                className={rating > 0 ? 'fill-current' : ''}
                                                                aria-hidden="true"
                                                            />
                                                            {rating === 0 ? t('search.all') : `${rating}+`}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="experience-filter"
                                                className="mb-2.5 block text-xs font-semibold uppercase tracking-wide text-text-soft"
                                            >
                                                {t('search.experience')}
                                            </label>
                                            <select
                                                id="experience-filter"
                                                value={filters.experience}
                                                onChange={(event) =>
                                                    setFilters((current) => ({
                                                        ...current,
                                                        experience: event.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-lg border border-border bg-bg-soft px-3 py-2.5 text-sm text-text-main outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="">{t('search.allExperience')}</option>
                                                {EXPERIENCE_LEVELS.map((level) => (
                                                    <option key={level} value={level}>
                                                        {level}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results header */}
                <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-text-soft" aria-live="polite">
                        {filteredFreelancers.length} {t('search.results')}
                    </p>
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort-by" className="text-xs font-medium text-text-soft">
                            Trier par
                        </label>
                        <select
                            id="sort-by"
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            className="rounded-lg border border-border bg-bg-main px-3 py-2 text-xs text-text-main outline-none focus:border-blue-500"
                        >
                            <option value="relevance">{t('search.relevance')}</option>
                            <option value="rating">{t('search.highestRating')}</option>
                            <option value="price">{t('search.lowestPrice')}</option>
                            <option value="experience">{t('search.mostExperience')}</option>
                        </select>
                    </div>
                </div>

                {/* Results */}
                <motion.div
                    className="mx-auto mt-5 grid max-w-3xl gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredFreelancers.map((freelancer) => (
                        <motion.article
                            key={freelancer.id}
                            variants={itemVariants}
                            className="rounded-2xl border border-border bg-bg-main p-5 shadow-card transition-all duration-300 hover:border-blue-200 hover:shadow-card-hover sm:p-6"
                        >
                            <div className="flex flex-col gap-5 sm:flex-row">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-xl font-bold text-blue-700 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300">
                                    {freelancer.name.charAt(0)}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <h2 className="font-display text-lg font-bold text-text-main">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/profile/${freelancer.id}`)}
                                                    className="text-left hover:text-blue-700"
                                                >
                                                    {freelancer.name}
                                                </button>
                                            </h2>
                                            <p className="text-sm font-medium text-blue-700">{freelancer.role}</p>
                                        </div>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                            <Star size={12} className="fill-current" aria-hidden="true" />
                                            {freelancer.rating}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-soft">
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin size={13} aria-hidden="true" />
                                            {freelancer.location}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Briefcase size={13} aria-hidden="true" />
                                            {freelancer.experience} {t('search.experience').toLowerCase()}
                                        </span>
                                        <span className="font-semibold text-text-main">
                                            {freelancer.hourlyRate}€ / h
                                        </span>
                                    </div>

                                    <div className="mt-3">
                                        <ProjectDescription
                                            text={freelancer.description}
                                            maxLines={2}
                                            lineHeight={18}
                                            className="text-sm"
                                        />
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {freelancer.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-md bg-bg-soft px-2 py-1 text-[11px] font-medium text-text-soft"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/profile/${freelancer.id}`)}
                                            className="btn btn-primary px-4 py-2 text-xs"
                                        >
                                            {t('search.hireBtn')}
                                            <ArrowRight size={14} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/messages?to=${freelancer.id}`)}
                                            className="btn btn-secondary px-3 py-2 text-xs"
                                            aria-label={`Envoyer un message à ${freelancer.name}`}
                                        >
                                            <MessageCircle size={15} aria-hidden="true" />
                                            Message
                                        </button>
                                        <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            {freelancer.availability}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                {filteredFreelancers.length === 0 && (
                    <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-border bg-bg-main px-6 py-12 text-center shadow-card">
                        <p className="text-sm text-text-soft">{t('search.noResults')}</p>
                        <button type="button" onClick={clearFilters} className="btn btn-secondary mt-5">
                            {t('search.clearFilters')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchFreelance;
