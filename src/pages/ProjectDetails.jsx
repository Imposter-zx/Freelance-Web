import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../services/mockData';
import SEOMeta from '../components/common/SEOMeta';
import { Briefcase, Clock, DollarSign, ChevronLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [bidCover, setBidCover] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { addNotification } = useNotifications();

    useEffect(() => {
        const found = projects.find(p => p.id === parseInt(id));
        if (found) {
            setProject(found);
            setBidAmount(found.budgetMin.toString());
        }
    }, [id]);

    const handleSubmitBid = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            addNotification({
                title: 'Offre envoyée !',
                message: `Votre proposition pour "${project.title}" a été transmise au client.`,
                type: 'success'
            });
        }, 1500);
    };

    if (!project) return <div className="pt-40 text-center">Projet non trouvé...</div>;

    return (
        <div className="min-h-screen pt-32 pb-20 bg-bg-soft">
            <SEOMeta title={project.title} description={project.description} />
            
            <div className="container max-w-4xl">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-soft hover:text-blue-600 mb-8 transition-colors font-medium"
                >
                    <ChevronLeft size={20} /> Retour aux recherches
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-bg-main p-8 rounded-3xl border border-border shadow-sm"
                        >
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-600 text-[10px] font-bold uppercase rounded-full mb-4">
                                {project.status === 'open' ? 'Ouvert aux offres' : 'Fermé'}
                            </span>
                            <h1 className="text-3xl font-bold font-outfit mb-4">{project.title}</h1>
                            
                            <div className="flex flex-wrap gap-6 text-sm text-text-soft mb-8">
                                <span className="flex items-center gap-2"><Briefcase size={18} className="text-blue-600" /> {project.client}</span>
                                <span className="flex items-center gap-2"><Clock size={18} className="text-blue-600" /> Il y a 2 jours</span>
                                <span className="flex items-center gap-2"><DollarSign size={18} className="text-blue-600" /> {project.budgetMin}-{project.budgetMax}€</span>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-lg font-bold mb-3">Description du projet</h3>
                                <p className="text-text-soft leading-relaxed">{project.description}</p>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-bold mb-4">Compétences requises</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills.map(skill => (
                                        <span key={skill} className="px-4 py-2 bg-bg-soft border border-border rounded-xl text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-bg-main p-8 rounded-3xl border border-border shadow-sm sticky top-32"
                        >
                            <h3 className="text-xl font-bold font-outfit mb-6">Placer une offre</h3>
                            
                            {submitted ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">Offre envoyée !</h4>
                                    <p className="text-sm text-text-soft mb-6">Le client a été notifié de votre intérêt.</p>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="text-blue-600 font-bold text-sm hover:underline"
                                    >
                                        Modifier mon offre
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitBid} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Votre budget (€)</label>
                                        <input 
                                            type="number" 
                                            required
                                            min={project.budgetMin}
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            className="w-full p-4 bg-bg-soft border border-border rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
                                        />
                                        <p className="text-[10px] text-text-soft mt-1 flex items-center gap-1">
                                            <AlertCircle size={10} /> Suggéré: {project.budgetMin}€ - {project.budgetMax}€
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Message de motivation</label>
                                        <textarea 
                                            required
                                            rows="4"
                                            placeholder="Expliquez pourquoi vous êtes le meilleur candidat..."
                                            value={bidCover}
                                            onChange={(e) => setBidCover(e.target.value)}
                                            className="w-full p-4 bg-bg-soft border border-border rounded-2xl focus:border-blue-500 outline-none transition-all text-sm resize-none"
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn btn-primary w-full py-4 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>Envoyer l'offre <Send size={18} /></>
                                        )}
                                    </button>
                                    
                                    <p className="text-[10px] text-center text-text-soft">
                                        En soumettant, vous acceptez les conditions de ZORD.
                                    </p>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
