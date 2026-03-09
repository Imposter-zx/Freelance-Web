import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEOMeta from '../components/common/SEOMeta';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        await new Promise(r => setTimeout(r, 800));

        const success = login(formData.email, formData.password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Identifiants incorrects. Veuillez réessayer.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-bg-soft flex items-center justify-center">
            <SEOMeta title="Connexion" description="Connectez-vous à votre compte ZORD Freelance." />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container max-w-md"
            >
                <div className="bg-bg-main p-10 rounded-[2rem] shadow-xl border border-border relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-3 font-outfit">Bon Retour !</h1>
                        <p className="text-text-soft">Connectez-vous pour accéder à vos projets.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold pl-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="nom@exemple.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-bg-soft border border-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between pl-1">
                                <label className="text-sm font-semibold">Mot de Passe</label>
                                <Link to="#" className="text-xs text-blue-600 hover:underline">Oublié ?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-bg-soft border border-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-4 text-lg relative overflow-hidden group"
                        >
                            <span className={isLoading ? 'opacity-0' : 'flex items-center gap-2'}>
                                Se connecter <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-10 text-sm text-text-soft">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-blue-600 font-bold hover:underline">Créer un compte</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
