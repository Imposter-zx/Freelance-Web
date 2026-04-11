import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import SEOMeta from '../components/common/SEOMeta';
import {
    Briefcase, MessageSquare, BarChart3, Bell, PlusCircle, TrendingUp,
    DollarSign, Users, Clock, CheckCircle, FileText, ArrowRight, Eye
} from 'lucide-react';

import StatsCard from '../components/features/StatsCard';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { unreadCount } = useMessages();
    const [postedProjects, setPostedProjects] = useState([]);

    useEffect(() => {
        const projects = JSON.parse(localStorage.getItem('postedProjects') || '[]');
        setPostedProjects(projects);
    }, []);

    const stats = [
        { label: 'Projets Actifs', value: postedProjects.filter(p => p.status === 'open').length || 3, icon: <Briefcase size={20} />, color: 'bg-blue-500', trend: '+2' },
        { label: 'Total Dépenses', value: 4250, suffix: '€', icon: <DollarSign size={20} />, color: 'bg-green-500', trend: '+12%' },
        { label: 'Messages', value: unreadCount || 3, icon: <MessageSquare size={20} />, color: 'bg-amber-500', trend: unreadCount > 0 ? `+${unreadCount}` : '0' },
        { label: 'Profils vus', value: 156, icon: <Eye size={20} />, color: 'bg-indigo-500', trend: '+24' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-bg-soft">
            <SEOMeta title="Dashboard" description="Gérez vos projets et suivez votre progression." />

            <div className="container">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Bonjour, {user?.name || 'Freelance'} 👋
                    </h1>
                    <p className="text-text-soft text-lg">Voici un aperçu de votre activité aujourd'hui.</p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                >
                    {quickActions.map((action, idx) => (
                        <motion.button
                            key={idx}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(action.path)}
                            className={`${action.color} text-white p-5 rounded-2xl flex items-center justify-center md:justify-start gap-4 hover:opacity-95 transition-all shadow-md hover:shadow-xl`}
                        >
                            <div className="bg-white/20 p-2 rounded-lg truncate">
                                {action.icon}
                            </div>
                            <span className="font-bold text-sm hidden md:block">{action.label}</span>
                        </motion.button>
                    ))}
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    {stats.map((stat, idx) => (
                        <motion.div key={stat.label} variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 }
                        }}>
                            <StatsCard
                                {...stat}
                                delay={0} // Staggered by container
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-bg-main rounded-3xl border border-border overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h2 className="text-xl font-bold font-outfit">Mes Projets</h2>
                                <button onClick={() => navigate('/post-project')} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                                    Voir tout <ArrowRight size={14} />
                                </button>
                            </div>
                            <div className="divide-y divide-border">
                                {postedProjects.length > 0 ? (
                                    postedProjects.slice(0, 5).map((project, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-6 flex items-center justify-between hover:bg-bg-soft transition-colors cursor-pointer group"
                                            onClick={() => navigate(`/project/${project.id || idx + 1}`)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold mb-1 group-hover:text-blue-600 transition-colors">{project.title || 'Projet sans titre'}</h4>
                                                    <p className="text-xs text-text-soft">{new Date(project.createdAt).toLocaleDateString('fr-FR')}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm mb-1">{project.budgetMin && project.budgetMax ? `${project.budgetMin}-${project.budgetMax}€` : 'Budget non défini'}</p>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                                                    project.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {project.status === 'open' ? 'Ouvert' : 'Fermé'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    [
                                        { id: 1, name: "Plateforme E-learning", client: "TechEdu", status: "En cours", price: "2,400€" },
                                        { id: 2, name: "Refonte Branding", client: "GreenCo", status: "Livré", price: "1,200€" },
                                        { id: 3, name: "App Mobile Fitness", client: "FitLife", status: "En attente", price: "3,500€" },
                                    ].map((project, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-6 flex items-center justify-between hover:bg-bg-soft transition-colors cursor-pointer group"
                                            onClick={() => navigate(`/project/${project.id}`)}
                                        >
                                            <div>
                                                <h4 className="font-bold mb-1 group-hover:text-blue-600 transition-colors">{project.name}</h4>
                                                <p className="text-xs text-text-soft">Client: {project.client}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm mb-1">{project.price}</p>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${project.status === 'Livre' ? 'bg-green-100 text-green-600' :
                                                        project.status === 'En cours' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="bg-bg-main rounded-3xl border border-border overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-border">
                                <h2 className="text-xl font-bold font-outfit">Activite recente</h2>
                            </div>
                            <div className="divide-y divide-border">
                                {recentActivity.map((activity, idx) => (
                                    <div key={idx} className="p-4 flex items-center gap-4 hover:bg-bg-soft transition-colors">
                                        <div className="w-10 h-10 bg-bg-soft rounded-full flex items-center justify-center shrink-0">
                                            {activity.type === 'message' && <MessageSquare size={18} className="text-blue-600" />}
                                            {activity.type === 'proposal' && <FileText size={18} className="text-purple-600" />}
                                            {activity.type === 'project' && <CheckCircle size={18} className="text-green-600" />}
                                            {activity.type === 'payment' && <DollarSign size={18} className="text-green-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{activity.text}</p>
                                            <p className="text-xs text-text-soft">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section className="bg-bg-main p-6 rounded-3xl border border-border shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart3 className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold font-outfit">Performances</h2>
                            </div>
                            <div className="h-40 bg-bg-soft rounded-2xl flex items-end justify-between p-4 gap-2 mb-4">
                                {[30, 60, 45, 90, 75, 50, 85, 70, 95, 60, 80, 100].map((h, i) => (
                                    <div key={i} className="bg-blue-200 dark:bg-blue-900/30 w-full rounded-t-lg transition-all hover:bg-blue-500 cursor-pointer" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                            <p className="text-center text-text-soft text-sm">
                                Vos performances ont augmente de <span className="text-green-500 font-bold">24%</span> ce mois-ci.
                            </p>
                        </section>

                        <section className="bg-bg-main p-6 rounded-3xl border border-border shadow-sm">
                            <h2 className="text-lg font-bold font-outfit mb-4">Projets par statut</h2>
                            <div className="space-y-4">
                                {[
                                    { label: 'En cours', value: 5, color: 'bg-blue-500', percent: 42 },
                                    { label: 'Livres', value: 8, color: 'bg-green-500', percent: 67 },
                                    { label: 'En attente', value: 2, color: 'bg-amber-500', percent: 17 },
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{item.label}</span>
                                            <span className="font-bold">{item.value}</span>
                                        </div>
                                        <div className="h-2 bg-bg-soft rounded-full overflow-hidden">
                                            <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-sm">
                            <h2 className="text-lg font-bold font-outfit mb-2">Conseil du jour</h2>
                            <p className="text-blue-100 text-sm mb-4">
                                Completez votre profil pour obtenir 3x plus de propositions. Ajoutez vos realisations et certifications.
                            </p>
                            <button 
                                onClick={() => navigate('/settings')}
                                className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors"
                            >
                                Completer mon profil
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
