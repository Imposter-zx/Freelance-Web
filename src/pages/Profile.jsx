import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { freelancers } from '../services/mockData';
import SEOMeta from '../components/common/SEOMeta';
import { 
    MapPin, Star, Clock, Briefcase, Award, Languages, 
    Mail, Phone, Globe, Calendar, ThumbsUp, MessageCircle,
    ChevronLeft, Share2, Heart
} from 'lucide-react';
import ProjectDescription from '../components/pretext/ProjectDescription';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('about');
    const [isHired, setIsHired] = useState(false);

    const freelancer = freelancers.find(f => f.id === parseInt(id)) || freelancers[0];

    const portfolio = [
        { id: 1, title: 'E-commerce Platform', image: '/assets/Projet1.jpg', description: 'Plateforme e-commerce complete' },
        { id: 2, title: 'Dashboard Analytics', image: '/assets/Projet2.jpg', description: 'Tableau de bord analytique' },
        { id: 3, title: 'Mobile App', image: '/assets/Projet3.jpg', description: 'Application mobile iOS/Android' }
    ];

    const reviews = [
        { id: 1, author: 'TechCorp', rating: 5, comment: 'Excellent travail, recommande !', date: 'Jan 2025', avatar: 'TC' },
        { id: 2, author: 'StartUp XYZ', rating: 5, comment: 'Professionnel et reactif', date: 'Dec 2024', avatar: 'SX' },
        { id: 3, author: 'Digital Agency', rating: 4, comment: 'Bon deliverable,.delai respecte', date: 'Nov 2024', avatar: 'DA' }
    ];

    const skills = freelancer.skills || ['React', 'Node.js', 'AWS'];
    const hourlyRate = 75;
    const successRate = 98;
    const totalProjects = 47;
    const responseTime = '1h';

    return (
        <div className="min-h-screen pt-24 pb-20 bg-bg-soft">
            <SEOMeta title={`${freelancer.name} - Profil`} description={`Profil de ${freelancer.role}`} />

            <div className="container">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-soft hover:text-blue-600 mb-6 transition-colors">
                    <ChevronLeft size={20} /> Retour
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-bg-main rounded-3xl border border-border p-8 shadow-sm"
                        >
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0">
                                    {freelancer.photo ? (
                                        <img src={freelancer.photo} alt={freelancer.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-blue-600">{freelancer.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h1 className="text-3xl font-bold font-outfit mb-1">{freelancer.name}</h1>
                                            <p className="text-blue-600 font-medium text-lg">{freelancer.role}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-3 bg-bg-soft border border-border rounded-xl hover:text-red-500 transition-colors">
                                                <Heart size={20} />
                                            </button>
                                            <button className="p-3 bg-bg-soft border border-border rounded-xl hover:text-blue-600 transition-colors">
                                                <Share2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-text-soft">
                                        <span className="flex items-center gap-1"><MapPin size={16} /> Paris, France</span>
                                        <span className="flex items-center gap-1"><Clock size={16} /> Repond en {responseTime}</span>
                                        <span className="flex items-center gap-1"><Calendar size={16} /> Membre depuis 2022</span>
                                    </div>

                                    <div className="flex items-center gap-6 mt-6">
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={18} className={i < Math.floor(freelancer.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                                ))}
                                            </div>
                                            <span className="font-bold">{freelancer.rating}</span>
                                            <span className="text-text-soft">({reviews.length} avis)</span>
                                        </div>
                                        <span className="text-green-600 font-medium">{successRate}% de satisfaction</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-bg-main rounded-3xl border border-border shadow-sm"
                        >
                            <div className="border-b border-border">
                                <div className="flex gap-8 px-8">
                                    {['about', 'portfolio', 'reviews'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`py-4 font-bold border-b-2 transition-colors capitalize ${
                                                activeTab === tab 
                                                    ? 'border-blue-600 text-blue-600' 
                                                    : 'border-transparent text-text-soft hover:text-blue-600'
                                            }`}
                                        >
                                            {tab === 'about' ? 'A propos' : tab === 'portfolio' ? 'Portfolio' : 'Avis'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8">
                                {activeTab === 'about' && (
                                    <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold mb-3">A propos</h3>
                                    <ProjectDescription text={freelancer.description || ''} maxLines={3} lineHeight={20} />
                                </div>

                                        <div>
                                            <h3 className="text-lg font-bold mb-3">Competences</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map(skill => (
                                                    <span key={skill} className="px-4 py-2 bg-bg-soft border border-border rounded-xl text-sm font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold mb-3">Langues</h3>
                                            <div className="flex gap-4">
                                                <span className="flex items-center gap-2"><Globe size={18} className="text-text-soft" /> Francais - Natif</span>
                                                <span className="flex items-center gap-2"><Globe size={18} className="text-text-soft" /> Anglais - Courant</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'portfolio' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {portfolio.map(item => (
                                            <div key={item.id} className="group rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all">
                                                <div className="aspect-video overflow-hidden">
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-bold mb-1">{item.title}</h4>
                                                    <p className="text-sm text-text-soft">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="space-y-6">
                                        {reviews.map(review => (
                                            <div key={review.id} className="border-b border-border pb-6 last:border-0">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                        {review.avatar}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div>
                                                                <span className="font-bold">{review.author}</span>
                                                                <span className="text-text-soft text-sm ml-2">{review.date}</span>
                                                            </div>
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={14} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-text-soft">{review.comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-bg-main rounded-3xl border border-border p-6 shadow-sm sticky top-28"
                        >
                            <div className="text-center mb-6">
                                <span className="text-4xl font-bold font-outfit">{hourlyRate}€</span>
                                <span className="text-text-soft">/heure</span>
                            </div>

                            <button 
                                onClick={() => setIsHired(!isHired)}
                                className={`w-full py-4 rounded-xl font-bold mb-4 transition-colors ${
                                    isHired 
                                        ? 'bg-green-100 text-green-600 border border-green-600' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isHired ? 'Deja contacté' : 'Contacter ce profil'}
                            </button>

                            <button 
                                onClick={() => navigate('/messages')}
                                className="w-full py-4 border border-border rounded-xl font-bold hover:bg-bg-soft transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={20} /> Envoyer un message
                            </button>

                            <div className="mt-6 pt-6 border-t border-border space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-text-soft">Taux de reussite</span>
                                    <span className="font-bold">{successRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-soft">Projets completes</span>
                                    <span className="font-bold">{totalProjects}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-soft">Temps de reponse</span>
                                    <span className="font-bold">{responseTime}</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-bg-main rounded-3xl border border-border p-6 shadow-sm"
                        >
                            <h3 className="font-bold mb-4">Informations de contact</h3>
                            <div className="space-y-3">
                                <a href="mailto:contact@zord.com" className="flex items-center gap-3 text-text-soft hover:text-blue-600 transition-colors">
                                    <Mail size={18} /> contact@zord.com
                                </a>
                                <a href="tel:+33123456789" className="flex items-center gap-3 text-text-soft hover:text-blue-600 transition-colors">
                                    <Phone size={18} /> +33 1 23 45 67 89
                                </a>
                                <span className="flex items-center gap-3 text-text-soft">
                                    <Globe size={18} /> www.portfolio.com
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
