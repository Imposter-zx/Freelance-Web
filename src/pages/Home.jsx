import React from 'react';
import { motion } from 'framer-motion';
import SEOMeta from '../components/common/SEOMeta';
import { services } from '../services/mockData';
import { ArrowRight, CheckCircle, Star, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const portfolio = [
        { title: "Dashboard SaaS", image: "/assets/Projet1.jpg", tags: ["React", "Tailwind"] },
        { title: "E-commerce App", image: "/assets/Projet2.jpg", tags: ["Next.js", "Stripe"] },
        { title: "Brand Identity", image: "/assets/Projet3.jpg", tags: ["Figma", "Design"] }
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <>
            <SEOMeta
                title="Accueil"
                description="ZORD est la plateforme premium pour trouver les meilleurs freelances et projets de développement web, design et marketing."
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 bg-bg-main">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50 dark:opacity-20" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[120px] opacity-50 dark:opacity-20" />

                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6 dark:bg-blue-900/30 dark:text-blue-400">
                            Propulsé par l'IA et les Talents Humains
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 font-outfit leading-tight lg:px-24">
                            Donnez Vie à Vos Idées avec les <span className="text-blue-600">Meilleurs Freelances</span>
                        </h1>
                        <p className="text-lg md:text-xl text-text-soft mb-10 max-w-2xl mx-auto leading-relaxed">
                            ZORD connecte les entreprises avec des experts du digital pour créer des produits exceptionnels. Qualité garantie, délais respectés.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/search" className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto">
                                Trouver un expert <ArrowRight size={20} />
                            </Link>
                            <Link to="/work" className="btn btn-secondary px-8 py-4 text-lg w-full sm:w-auto">
                                Devenir Freelance
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How it works */}
            <section className="section bg-bg-soft">
                <div className="container">
                    <div className="section-title">
                        <h2>Comment ça marche</h2>
                        <p>Une plateforme simple et intuitive pour gérer vos projets de bout en bout.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Créez un compte", desc: "Rejoignez notre communauté en quelques secondes.", icon: <Users className="text-blue-600" size={32} /> },
                            { title: "Publiez un projet", desc: "Décrivez vos besoins et recevez des propositions ciblées.", icon: <CheckCircle className="text-blue-600" size={32} /> },
                            { title: "Collaborez", desc: "Travaillez ensemble avec nos outils de gestion intégrés.", icon: <Zap className="text-blue-600" size={32} /> }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                {...fadeInUp}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-bg-main border border-border p-8 rounded-2xl hover:shadow-lg transition-all text-center group"
                            >
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl mb-3">{step.title}</h3>
                                <p className="text-text-soft text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section id="services" className="section bg-bg-main">
                <div className="container">
                    <div className="section-title">
                        <h2>Nos Domaines d'Expertise</h2>
                        <p>Des services de haute qualité pour toutes vos ambitions digitales.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, idx) => (
                            <motion.div
                                key={idx}
                                {...fadeInUp}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 border border-border rounded-2xl hover:border-blue-300 transition-colors"
                            >
                                <h3 className="text-2xl mb-4 font-outfit">{service.title}</h3>
                                <p className="text-text-soft mb-6">{service.description}</p>
                                <Link to="/search" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                                    Explorer <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio */}
            <section id="portfolio" className="section bg-bg-soft">
                <div className="container">
                    <div className="section-title">
                        <h2>Portfolio des Talents</h2>
                        <p>Découvrez les réalisations de nos freelances les plus talentueux.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {portfolio.map((item, idx) => (
                            <motion.div
                                key={idx}
                                {...fadeInUp}
                                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-surface shadow-md"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                                    <div className="flex gap-2">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full text-text-soft">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="section bg-bg-main">
                <div className="container max-w-4xl">
                    <motion.div
                        {...fadeInUp}
                        className="bg-blue-600 rounded-[2.5rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à Lancer Votre Projet ?</h2>
                            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                                Rejoignez plus de 5,000 entreprises qui font déjà confiance à nos experts pour transformer leur vision en réalité.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/register" className="bg-white text-blue-600 btn px-10 py-4 hover:bg-blue-50">
                                    Commencer l'aventure
                                </Link>
                                <a href="mailto:contact@zord.com" className="text-white border-white/30 border btn px-10 py-4 hover:bg-white/10">
                                    Nous contacter
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Home;
