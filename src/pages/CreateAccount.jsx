import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEOMeta from '../components/common/SEOMeta';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const CreateAccount = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        await new Promise(r => setTimeout(r, 1000));
        register(formData);
        navigate('/dashboard');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-bg-soft flex items-center justify-center">
            <SEOMeta title="Inscription" description="Rejoignez la plus grande communauté de freelances." />

            <div className="container relative z-10 flex flex-col md:flex-row items-center gap-16 max-w-5xl">
                {/* Left side: content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 text-center md:text-left hidden md:block"
                >
                    <h1 className="text-5xl font-bold mb-8 font-outfit leading-tight">
                        Lancez Votre Carrière avec <span className="text-blue-600">ZORD</span>
                    </h1>
                    <ul className="space-y-6">
                        {[
                            "Accès aux meilleurs projets mondiaux",
                            "Paiements sécurisés et garantis",
                            "Outils de collaboration gratuits",
                            "Support communautaire 24/7"
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-4 text-lg text-text-soft">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full text-blue-600">
                                    <ShieldCheck size={24} />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Right side: Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 w-full max-w-md"
                >
                    <div className="bg-bg-main p-10 rounded-[2.5rem] shadow-2xl border border-border relative">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-3 font-outfit">Prêt à Inover ?</h2>
                            <p className="text-text-soft">Créez votre compte en moins de 2 minutes.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold pl-1">Nom Complet</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft group-focus-within:text-blue-500" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Jean Dupont"
                                        className="w-full pl-12 pr-4 py-3.5 bg-bg-soft border border-border rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold pl-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft group-focus-within:text-blue-500" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="nom@exemple.com"
                                        className="w-full pl-12 pr-4 py-3.5 bg-bg-soft border border-border rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold pl-1">Mot de Passe</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft group-focus-within:text-blue-500" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="Minimum 8 caractères"
                                        className="w-full pl-12 pr-4 py-3.5 bg-bg-soft border border-border rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full py-4 text-lg relative group"
                            >
                                <span className={isLoading ? 'opacity-0' : 'flex items-center gap-2'}>
                                    S'inscrire <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    </div>
                                )}
                            </button>
                        </form>

                        <p className="text-center mt-10 text-sm text-text-soft">
                            Déjà inscrit ?{' '}
                            <Link to="/login" className="text-blue-600 font-bold hover:underline">Se connecter</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateAccount;
