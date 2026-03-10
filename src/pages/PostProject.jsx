import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEOMeta from '../components/common/SEOMeta';
import { FileText, Tag, Clock, X, CheckCircle, Upload } from 'lucide-react';

const PostProject = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ 
        title: '', category: '', description: '', skills: [], 
        budgetMin: '', budgetMax: '', duration: '', experienceLevel: '' 
    });
    const [skillInput, setSkillInput] = useState('');

    const categories = [
        { id: 'dev-web', label: 'Developpement Web' },
        { id: 'dev-mobile', label: 'Developpement Mobile' },
        { id: 'design', label: 'Design & Graphisme' },
        { id: 'seo', label: 'SEO & Marketing' },
        { id: 'data', label: 'Data Science' }
    ];

    const durations = [
        { id: 'less-1', label: 'Moins de 1 mois' },
        { id: '1-3', label: '1 a 3 mois' },
        { id: '3-6', label: '3 a 6 mois' },
        { id: 'more-6', label: 'Plus de 6 mois' }
    ];

    const experienceLevels = [
        { id: 'entry', label: 'Debutant' },
        { id: 'intermediate', label: 'Intermediaire' },
        { id: 'expert', label: 'Expert' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skill) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const projects = JSON.parse(localStorage.getItem('postedProjects') || '[]');
        const newProject = { 
            id: Date.now(), ...formData, status: 'open', 
            proposals: 0, createdAt: new Date().toISOString() 
        };
        projects.unshift(newProject);
        localStorage.setItem('postedProjects', JSON.stringify(projects));
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-bg-soft">
                <SEOMeta title="Projet Publie" description="Votre projet a ete publie." />
                <div className="container max-w-2xl">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-bg-main rounded-3xl border border-border p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold font-outfit mb-4">Projet Publie !</h1>
                        <p className="text-text-soft mb-8">Votre projet a ete publie avec succes.</p>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Retour au Dashboard</button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-bg-soft">
            <SEOMeta title="Publier un Projet" description="Decrivez votre projet." />
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold font-outfit mb-2">Publier un Projet</h1>
                        <p className="text-text-soft mb-8">Decrivez votre projet pour trouver le freelance ideal</p>
                        
                        <div className="flex items-center gap-2 mb-8">
                            {[1, 2, 3].map(s => (
                                <React.Fragment key={s}>
                                    <button onClick={() => setStep(s)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                                            step >= s ? 'bg-blue-600 text-white' : 'bg-bg-main border border-border text-text-soft'
                                        }`}>
                                        {s}
                                    </button>
                                    {s < 3 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-blue-600' : 'bg-border'}`} />}
                                </React.Fragment>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="bg-bg-main rounded-3xl border border-border p-8 shadow-sm">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <FileText size={24} className="text-blue-600" /> Informations du Projet
                                    </h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Titre du projet *</label>
                                            <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                                                placeholder="Ex: Refonte de site web e-commerce" className="w-full px-5 py-4 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Categorie *</label>
                                            <select name="category" value={formData.category} onChange={handleInputChange}
                                                className="w-full px-5 py-4 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none" required>
                                                <option value="">Selectionnez une categorie</option>
                                                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.label}</option>))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Description detaillee *</label>
                                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6}
                                                placeholder="Decrivez votre projet en detail..." className="w-full px-5 py-4 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none resize-none" required />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Tag size={24} className="text-blue-600" /> Competences & Budget
                                    </h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Competences requises</label>
                                            <div className="flex gap-2 mb-3">
                                                <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                                    placeholder="Ajouter une competence" className="flex-1 px-5 py-3 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none" />
                                                <button type="button" onClick={handleAddSkill} className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Ajouter</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skills.map(skill => (
                                                    <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium flex items-center gap-2">
                                                        {skill} <button type="button" onClick={() => handleRemoveSkill(skill)}><X size={14} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Budget minimum (EUR)</label>
                                                <input type="number" name="budgetMin" value={formData.budgetMin} onChange={handleInputChange}
                                                    placeholder="500" className="w-full px-5 py-4 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Budget maximum (EUR)</label>
                                                <input type="number" name="budgetMax" value={formData.budgetMax} onChange={handleInputChange}
                                                    placeholder="2000" className="w-full px-5 py-4 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Clock size={24} className="text-blue-600" /> Details supplementaires
                                    </h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Duree estimee *</label>
                                            <select name="duration" value={formData.duration} onChange={handleInputChange}
                                                className="w-full px-5 py-4 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none" required>
                                                <option value="">Selectionnez une duree</option>
                                                {durations.map(d => (<option key={d.id} value={d.id}>{d.label}</option>))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Niveau d'experience *</label>
                                            <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange}
                                                className="w-full px-5 py-4 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none" required>
                                                <option value="">Selectionnez le niveau</option>
                                                {experienceLevels.map(l => (<option key={l.id} value={l.id}>{l.label}</option>))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Fichiers joints (optionnel)</label>
                                            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                                                <Upload size={32} className="mx-auto mb-3 text-text-soft" />
                                                <p className="text-text-soft">Glissez-deposez vos fichiers ici</p>
                                                <p className="text-xs text-text-soft mt-2">PDF, DOC, ZIP (Max 10MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex justify-between mt-8 pt-6 border-t border-border">
                                {step > 1 ? (
                                    <button type="button" onClick={() => setStep(step - 1)} className="btn btn-secondary">Retour</button>
                                ) : <div />}
                                {step < 3 ? (
                                    <button type="button" onClick={() => setStep(step + 1)} className="btn btn-primary">Suivant</button>
                                ) : (
                                    <button type="submit" className="btn btn-primary flex items-center gap-2">
                                        <CheckCircle size={18} /> Publier le projet
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PostProject;
