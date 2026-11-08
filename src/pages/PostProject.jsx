import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEOMeta from '../components/common/SEOMeta';
import { useAuth } from '../context/AuthContext';
import { FileText, Tag, Clock, X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const categories = [
    { id: 'dev-web', label: 'Développement Web' },
    { id: 'dev-mobile', label: 'Développement Mobile' },
    { id: 'design', label: 'Design & Graphisme' },
    { id: 'seo', label: 'SEO & Marketing' },
    { id: 'data', label: 'Data Science' },
];

const durations = [
    { id: 'less-1', label: 'Moins de 1 mois' },
    { id: '1-3', label: '1 à 3 mois' },
    { id: '3-6', label: '3 à 6 mois' },
    { id: 'more-6', label: 'Plus de 6 mois' },
];

const experienceLevels = [
    { id: 'entry', label: 'Débutant' },
    { id: 'intermediate', label: 'Intermédiaire' },
    { id: 'expert', label: 'Expert' },
];

const initialForm = {
    title: '',
    category: '',
    description: '',
    skills: [],
    budgetMin: '',
    budgetMax: '',
    duration: '',
    experienceLevel: '',
};

const PostProject = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(initialForm);
    const [skillInput, setSkillInput] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        if (error) setError('');
    };

    const handleAddSkill = () => {
        const skill = skillInput.trim();
        if (!skill) return;
        if (formData.skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
            setError('Cette compétence est déjà ajoutée.');
            return;
        }
        setFormData((current) => ({ ...current, skills: [...current.skills, skill] }));
        setSkillInput('');
        setError('');
    };

    const handleRemoveSkill = (skill) => {
        setFormData((current) => ({
            ...current,
            skills: current.skills.filter((item) => item !== skill),
        }));
    };

    const validateStep = (targetStep) => {
        if (targetStep === 1) {
            if (formData.title.trim().length < 8) return 'Le titre doit contenir au moins 8 caractères.';
            if (!formData.category) return 'Sélectionnez une catégorie.';
            if (formData.description.trim().length < 30) {
                return 'La description doit contenir au moins 30 caractères.';
            }
        }
        if (targetStep === 2) {
            if (formData.skills.length === 0) return 'Ajoutez au moins une compétence.';
            const min = Number(formData.budgetMin);
            const max = Number(formData.budgetMax);
            if (!min || min <= 0) return 'Indiquez un budget minimum valide.';
            if (!max || max <= 0) return 'Indiquez un budget maximum valide.';
            if (min > max) return 'Le budget minimum ne peut pas dépasser le maximum.';
        }
        if (targetStep === 3) {
            if (!formData.duration) return 'Sélectionnez une durée estimée.';
            if (!formData.experienceLevel) return 'Sélectionnez un niveau d’expérience.';
        }
        return '';
    };

    const goNext = () => {
        const validationError = validateStep(step);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError('');
        setStep((current) => Math.min(current + 1, 3));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        for (let currentStep = 1; currentStep <= 3; currentStep += 1) {
            const validationError = validateStep(currentStep);
            if (validationError) {
                setStep(currentStep);
                setError(validationError);
                return;
            }
        }

        const projects = JSON.parse(localStorage.getItem('postedProjects') || '[]');
        const newProject = {
            id: Date.now(),
            title: formData.title.trim(),
            category: categories.find((item) => item.id === formData.category)?.label || formData.category,
            description: formData.description.trim(),
            skills: formData.skills,
            budgetMin: Number(formData.budgetMin),
            budgetMax: Number(formData.budgetMax),
            duration: durations.find((item) => item.id === formData.duration)?.label || formData.duration,
            experienceLevel:
                experienceLevels.find((item) => item.id === formData.experienceLevel)?.label ||
                formData.experienceLevel,
            client: user?.name || 'Client',
            clientEmail: user?.email || '',
            status: 'open',
            proposals: 0,
            createdAt: new Date().toISOString(),
        };
        projects.unshift(newProject);
        localStorage.setItem('postedProjects', JSON.stringify(projects));
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-bg-soft pb-20 pt-32">
                <SEOMeta title="Projet publié" description="Votre projet a été publié." noIndex />
                <div className="container max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-3xl border border-border bg-bg-main p-8 text-center shadow-card sm:p-12"
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                            <CheckCircle size={34} aria-hidden="true" />
                        </div>
                        <h1 className="mt-5 font-display text-2xl font-bold text-text-main">
                            Projet publié
                        </h1>
                        <p className="mt-2 text-sm text-text-soft">
                            Votre brief est enregistré. Retrouvez-le dans votre tableau de bord et suivez les
                            propositions reçues.
                        </p>
                        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-primary"
                            >
                                Retour au tableau de bord
                                <ArrowRight size={16} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData(initialForm);
                                    setStep(1);
                                    setSubmitted(false);
                                }}
                                className="btn btn-secondary"
                            >
                                Publier un autre projet
                            </button>
                        </div>
                        <p className="mt-6 text-[11px] text-text-soft">
                            Version démonstration : le projet est stocké dans ce navigateur.
                        </p>
                    </motion.div>
                </div>
            </div>
        );
    }

    const stepLabels = ['Informations', 'Compétences & budget', 'Détails'];

    return (
        <div className="min-h-screen bg-bg-soft pb-20 pt-28 sm:pt-32">
            <SEOMeta title="Publier un projet" description="Décrivez votre projet et trouvez le freelance idéal." noIndex />
            <div className="container max-w-3xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="font-display text-2xl font-bold text-text-main sm:text-3xl">
                        Publier un projet
                    </h1>
                    <p className="mt-2 text-sm text-text-soft">
                        Un brief clair attire les meilleurs profils. Trois étapes suffisent.
                    </p>

                    {/* Progress */}
                    <ol className="mt-8 flex items-center gap-2" aria-label="Étapes du formulaire">
                        {stepLabels.map((label, index) => {
                            const number = index + 1;
                            const active = step === number;
                            const complete = step > number;
                            return (
                                <li key={label} className="flex flex-1 items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (number < step) {
                                                setStep(number);
                                                setError('');
                                            }
                                        }}
                                        disabled={number >= step}
                                        aria-current={active ? 'step' : undefined}
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                            complete
                                                ? 'bg-blue-600 text-white'
                                                : active
                                                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-600 dark:bg-blue-950/60 dark:text-blue-300'
                                                  : 'border border-border bg-bg-main text-text-soft'
                                        }`}
                                    >
                                        {complete ? <CheckCircle size={15} aria-hidden="true" /> : number}
                                    </button>
                                    <span
                                        className={`hidden text-xs font-semibold sm:block ${
                                            active ? 'text-text-main' : 'text-text-soft'
                                        }`}
                                    >
                                        {label}
                                    </span>
                                    {number < stepLabels.length && (
                                        <span
                                            aria-hidden="true"
                                            className={`h-px flex-1 ${complete ? 'bg-blue-600' : 'bg-border'}`}
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ol>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 rounded-3xl border border-border bg-bg-main p-6 shadow-card sm:p-8"
                        noValidate
                    >
                        {error && (
                            <div
                                role="alert"
                                className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                            >
                                <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                                    <FileText size={20} className="text-blue-600" aria-hidden="true" />
                                    Informations du projet
                                </h2>
                                <div>
                                    <label htmlFor="title" className="mb-2 block text-sm font-semibold">
                                        Titre du projet
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Ex : Refonte de site web e-commerce"
                                        className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category" className="mb-2 block text-sm font-semibold">
                                        Catégorie
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="">Sélectionnez une catégorie</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="description" className="mb-2 block text-sm font-semibold">
                                        Description détaillée
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={7}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Décrivez le contexte, les objectifs et le résultat attendu…"
                                        className="w-full resize-none rounded-xl border border-border bg-bg-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <p className="mt-1 text-[11px] text-text-soft">
                                        {formData.description.trim().length} caractères (30 minimum)
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                                    <Tag size={20} className="text-blue-600" aria-hidden="true" />
                                    Compétences & budget
                                </h2>
                                <div>
                                    <label htmlFor="skill" className="mb-2 block text-sm font-semibold">
                                        Compétences requises
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            id="skill"
                                            type="text"
                                            value={skillInput}
                                            onChange={(event) => setSkillInput(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    handleAddSkill();
                                                }
                                            }}
                                            placeholder="Ajouter une compétence"
                                            className="flex-1 rounded-xl border border-border bg-bg-soft px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSkill}
                                            className="btn btn-secondary px-4 py-3 text-sm"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                    {formData.skills.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {formData.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        aria-label={`Retirer ${skill}`}
                                                        className="rounded-full p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900"
                                                    >
                                                        <X size={12} aria-hidden="true" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="budgetMin" className="mb-2 block text-sm font-semibold">
                                            Budget minimum (€)
                                        </label>
                                        <input
                                            id="budgetMin"
                                            name="budgetMin"
                                            type="number"
                                            min="1"
                                            value={formData.budgetMin}
                                            onChange={handleInputChange}
                                            placeholder="500"
                                            className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="budgetMax" className="mb-2 block text-sm font-semibold">
                                            Budget maximum (€)
                                        </label>
                                        <input
                                            id="budgetMax"
                                            name="budgetMax"
                                            type="number"
                                            min="1"
                                            value={formData.budgetMax}
                                            onChange={handleInputChange}
                                            placeholder="2000"
                                            className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                                    <Clock size={20} className="text-blue-600" aria-hidden="true" />
                                    Détails supplémentaires
                                </h2>
                                <div>
                                    <label htmlFor="duration" className="mb-2 block text-sm font-semibold">
                                        Durée estimée
                                    </label>
                                    <select
                                        id="duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="">Sélectionnez une durée</option>
                                        {durations.map((duration) => (
                                            <option key={duration.id} value={duration.id}>
                                                {duration.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="experienceLevel" className="mb-2 block text-sm font-semibold">
                                        Niveau d’expérience
                                    </label>
                                    <select
                                        id="experienceLevel"
                                        name="experienceLevel"
                                        value={formData.experienceLevel}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="">Sélectionnez le niveau</option>
                                        {experienceLevels.map((level) => (
                                            <option key={level.id} value={level.id}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="rounded-xl border border-blue-200/60 bg-blue-50 p-4 text-xs text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
                                    Les pièces jointes ne sont pas disponibles dans cette version de démonstration.
                                </div>
                            </motion.div>
                        )}

                        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep((current) => current - 1);
                                        setError('');
                                    }}
                                    className="btn btn-secondary"
                                >
                                    Retour
                                </button>
                            ) : (
                                <span />
                            )}
                            {step < 3 ? (
                                <button type="button" onClick={goNext} className="btn btn-primary">
                                    Suivant
                                    <ArrowRight size={16} aria-hidden="true" />
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-primary">
                                    <CheckCircle size={17} aria-hidden="true" />
                                    Publier le projet
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default PostProject;
