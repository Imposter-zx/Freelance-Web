import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEOMeta from '../components/common/SEOMeta';
import { Send, CheckCircle, ArrowLeft, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen py-48 flex items-center justify-center bg-bg-soft">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="container max-w-lg text-center bg-bg-main p-16 rounded-[3rem] shadow-2xl border border-border"
                >
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="text-3xl font-bold font-outfit mb-4">Candidature Envoyée !</h1>
                    <p className="text-text-soft mb-10 leading-relaxed">
                        Merci pour votre inscription. Notre équipe examinera votre profil et vous contactera dans les plus brefs délais (généralement sous 48h).
                    </p>
                    <Link to="/" className="btn btn-primary w-full py-4 text-lg">
                        Retour à l'accueil
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-bg-soft">
            <SEOMeta title="Devenir Freelance" description="Rejoignez notre réseau d'élite et travaillez sur des projets passionnants." />

            <div className="container max-w-4xl">
                <div className="mb-12">
                    <Link to="/" className="text-sm font-bold flex items-center gap-2 text-text-soft hover:text-blue-600 transition-colors mb-8">
                        <ArrowLeft size={16} /> Retour
                    </Link>
                    <h1 className="text-4xl font-bold font-outfit mb-4 flex items-center gap-4">
                        Rejoignez l'Équipe <Rocket className="text-blue-600" />
                    </h1>
                    <p className="text-text-soft text-lg">Remplissez le formulaire ci-dessous pour postuler en tant que freelance.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-bg-main p-10 md:p-16 rounded-[2.5rem] border border-border shadow-xl"
                >
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold pl-1">Prénom</label>
                            <input type="text" required placeholder="Ex: Jean" className="w-full px-6 py-4 bg-bg-soft border border-border rounded-2xl focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold pl-1">Nom</label>
                            <input type="text" required placeholder="Ex: Dupont" className="w-full px-6 py-4 bg-bg-soft border border-border rounded-2xl focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold pl-1">Email Professionnel</label>
                            <input type="email" required placeholder="jean@exemple.com" className="w-full px-6 py-4 bg-bg-soft border border-border rounded-2xl focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold pl-1">Domaine d'Expertise</label>
                            <select className="w-full px-6 py-4 bg-bg-soft border border-border rounded-2xl focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                                <option>Développement Web</option>
                                <option>UI/UX Design</option>
                                <option>SEO & Marketing</option>
                                <option>Data Science</option>
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold pl-1">Présentez-vous en quelques mots</label>
                            <textarea rows="5" required placeholder="Parlez-nous de vos expériences..." className="w-full px-6 py-4 bg-bg-soft border border-border rounded-2xl focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full py-5 text-lg shadow-lg shadow-blue-500/20 relative"
                            >
                                <span className={isLoading ? 'opacity-0' : 'flex items-center gap-2'}>
                                    Envoyer ma candidature <Send size={20} />
                                </span>
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default WorkPage;
