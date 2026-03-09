import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEOMeta from '../components/common/SEOMeta';
import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    BarChart3,
    Bell,
    ExternalLink,
    PlusCircle,
    TrendingUp,
    Calendar
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Projets Actifs', value: '12', icon: <Briefcase size={20} />, color: 'bg-blue-500' },
        { label: 'Total Revenus', value: '4,250€', icon: <TrendingUp size={20} />, color: 'bg-green-500' },
        { label: 'Nouveau Messages', value: '3', icon: <MessageSquare size={20} />, color: 'bg-amber-500' },
        { label: 'Heures Travaillées', value: '120h', icon: <Calendar size={20} />, color: 'bg-indigo-500' },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 bg-bg-soft">
            <SEOMeta title="Dashboard" description="Gérez vos projets et suivez votre progression." />

            <div className="container">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-bold font-outfit mb-2">
                            Bonjour, {user?.name || 'Freelance'} 👋
                        </h1>
                        <p className="text-text-soft">Voici un aperçu de votre activité aujourd'hui.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4"
                    >
                        <button className="btn btn-secondary flex items-center gap-2">
                            <Bell size={20} /> notifications
                        </button>
                        <button className="btn btn-primary flex items-center gap-2">
                            <PlusCircle size={20} /> Nouveau Projet
                        </button>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-bg-main p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} text-white p-3 rounded-xl`}>
                                    {stat.icon}
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">+12%</span>
                            </div>
                            <h3 className="text-text-soft text-sm font-medium">{stat.label}</h3>
                            <p className="text-2xl font-bold font-outfit">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-bg-main rounded-3xl border border-border overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-border flex justify-between items-center">
                                <h2 className="text-xl font-bold font-outfit">Projets Récents</h2>
                                <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                                    Voir tout <ExternalLink size={14} />
                                </button>
                            </div>
                            <div className="divide-y divide-border">
                                {[
                                    { name: "Plateforme E-learning", client: "TechEdu", status: "En cours", price: "2,400€" },
                                    { name: "Refonte Branding", client: "GreenCo", status: "Livré", price: "1,200€" },
                                    { name: "App Mobile Fitness", client: "FitLife", status: "En attente", price: "3,500€" },
                                ].map((project, idx) => (
                                    <div key={idx} className="p-6 flex items-center justify-between hover:bg-bg-soft transition-colors cursor-pointer group">
                                        <div>
                                            <h4 className="font-bold mb-1 group-hover:text-blue-600 transition-colors">{project.name}</h4>
                                            <p className="text-xs text-text-soft">Client: {project.client}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm mb-1">{project.price}</p>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${project.status === 'Livré' ? 'bg-green-100 text-green-600' :
                                                    project.status === 'En cours' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        <section className="bg-bg-main p-8 rounded-3xl border border-border shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <BarChart3 className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold font-outfit">Performances</h2>
                            </div>
                            <div className="h-48 bg-bg-soft rounded-2xl flex items-end justify-between p-6 gap-2">
                                {[30, 60, 45, 90, 75, 50, 85].map((h, i) => (
                                    <div key={i} className="bg-blue-200 dark:bg-blue-900/30 w-full rounded-t-lg transition-all hover:bg-blue-500" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                            <p className="text-center text-text-soft text-sm mt-6">
                                Vos performances ont augmenté de <span className="text-green-500 font-bold">24%</span> ce mois-ci.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
