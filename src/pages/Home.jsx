import React from 'react';
import { motion } from 'framer-motion';
import SEOMeta from '../components/common/SEOMeta';
import { services } from '../services/mockData';
import { ArrowRight, CheckCircle, Star, Users, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { containerVariants, itemVariants, cardTilt, parallaxMove, staggerContainer } from '../utils/animations';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const { t } = useLanguage();

    const portfolio = [
        { title: "Dashboard SaaS", image: "/assets/Projet1.jpg", tags: ["React", "Tailwind"] },
        { title: "E-commerce App", image: "/assets/Projet2.jpg", tags: ["Next.js", "Stripe"] },
        { title: "Brand Identity", image: "/assets/Projet3.jpg", tags: ["Figma", "Design"] }
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const stepIcons = [
        { 
            title: t('howItWorks.step1.title'), 
            desc: t('howItWorks.step1.desc'), 
            icon: <Users className="text-blue-600" size={32} /> 
        },
        { 
            title: t('howItWorks.step2.title'), 
            desc: t('howItWorks.step2.desc'), 
            icon: <CheckCircle className="text-blue-600" size={32} /> 
        },
        { 
            title: t('howItWorks.step3.title'), 
            desc: t('howItWorks.step3.desc'), 
            icon: <Zap className="text-blue-600" size={32} /> 
        }
    ];

    return (
        <>
            <SEOMeta
                title="Accueil"
                description="ZORD est la plateforme premium pour trouver les meilleurs freelances et projets de développement web, design et marketing."
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 bg-bg-main">
                {/* Animated background blobs with Parallax */}
                <motion.div 
                    className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50 dark:opacity-20" 
                    {...parallaxMove}
                />
                <motion.div 
                    className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[120px] opacity-50 dark:opacity-20"
                    {...parallaxMove}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
        <motion.span 
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6 dark:bg-blue-900/30 dark:text-blue-400"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <Sparkles size={16} />
                            {t('hero.badge')}
                        </motion.span>

                        <motion.h1 
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 font-outfit leading-tight lg:px-24"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                        >
                            {t('hero.title.part1')}{' '}
                            <motion.span 
                                className="text-blue-600 inline-block"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            >
                                {t('hero.title.part2')}
                            </motion.span>
                        </motion.h1>

                        <motion.p 
                            className="text-lg md:text-xl text-text-soft mb-10 max-w-2xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            {t('hero.subtitle')}
                        </motion.p>

                        <motion.div 
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link to="/search" className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto btn-glow group flex items-center justify-center gap-2">
                                    <span>{t('hero.searchBtn')}</span>
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <ArrowRight size={20} />
                                    </motion.div>
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link to="/work" className="btn btn-secondary px-8 py-4 text-lg w-full sm:w-auto hover-lift">
                                    {t('hero.becomeFreelanceBtn')}
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* How it works */}
            <section className="section bg-bg-soft">
                <div className="container">
                    <motion.div 
                        className="section-title"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>{t('howItWorks.title')}</h2>
                        <p>{t('howItWorks.subtitle')}</p>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {stepIcons.map((step, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="bg-bg-main border border-border p-8 rounded-2xl hover:shadow-lg transition-all text-center group cursor-pointer"
                                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)" }}
                            >
                                <motion.div 
                                    className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {step.icon}
                                </motion.div>
                                <motion.h3 
                                    className="text-xl mb-3 font-outfit"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 + 0.3 }}
                                >
                                    {step.title}
                                </motion.h3>
                                <p className="text-text-soft text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services */}
            <section id="services" className="section bg-bg-main">
                <div className="container">
                    <motion.div 
                        className="section-title"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>{t('services.title')}</h2>
                        <p>{t('services.subtitle')}</p>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {services.map((service, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="p-10 border border-border rounded-2xl bg-bg-main relative overflow-hidden group cursor-pointer"
                                {...cardTilt}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity"
                                />
                                <div className="relative z-10">
                                    <h3 className="text-2xl mb-4 font-outfit font-bold">{service.title}</h3>
                                    <p className="text-text-soft mb-6 leading-relaxed">{service.description}</p>
                                    <Link to="/search" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all group/link">
                                        {t('common.explore')}
                                        <motion.div
                                            animate={{ x: [0, 3, 0] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        >
                                            <ArrowRight size={18} />
                                        </motion.div>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Portfolio */}
            <section id="portfolio" className="section bg-bg-soft">
                <div className="container">
                    <motion.div 
                        className="section-title"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>{t('portfolio.title')}</h2>
                        <p>{t('portfolio.subtitle')}</p>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {portfolio.map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-surface shadow-lg cursor-pointer"
                                {...cardTilt}
                            >
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <motion.img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        initial={{ scale: 1 }}
                                        whileHover={{ scale: 1.15 }}
                                        transition={{ duration: 0.6 }}
                                    />
                                    <motion.div
                                        className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {item.tags.map((tag) => (
                                            <span 
                                                key={tag} 
                                                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full font-semibold"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials / Clients Section */}
            <section className="section bg-bg-main">
                <div className="container">
                    <motion.div 
                        className="section-title"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Trust by Industry Leaders</h2>
                        <p>Trusted by companies and innovators from around the world</p>
                    </motion.div>

                    {/* Animated Client Logos Carousel */}
                    <motion.div 
                        className="flex flex-wrap justify-center items-center gap-12 py-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {['TechCorp', 'Innovate', 'Digital Pro', 'Cloud First', 'DataHub', 'Smart Systems', 'NextGen', 'FutureFlow'].map((company, idx) => (
                            <motion.div
                                key={company}
                                className="px-6 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full border border-blue-200 dark:border-blue-700/30 font-semibold text-blue-600 dark:text-blue-400 shadow-sm"
                                whileHover={{ scale: 1.1, boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)" }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.4 }}
                            >
                                {company}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Animated Tagline - Inspiration from Cometrix */}
            <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 overflow-hidden relative">
                <motion.div 
                    className="whitespace-nowrap flex items-center gap-12 text-white text-3xl md:text-5xl font-bold"
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                    <span>We connect talent with opportunity</span>
                    <span className="text-blue-200">•</span>
                    <span>We connect talent with opportunity</span>
                    <span className="text-blue-200">•</span>
                    <span>We connect talent with opportunity</span>
                    <span className="text-blue-200">•</span>
                </motion.div>
            </section>

            {/* Resources / Blog Section */}
            <section className="section bg-bg-soft">
                <div className="container">
                    <motion.div 
                        className="section-title"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Insights & Resources</h2>
                        <p>Expert tips and industry insights to help you succeed</p>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {[
                            { title: "How to Choose the Right Freelancer", desc: "5 tips for finding the perfect match for your project", tag: "Guide" },
                            { title: "Remote Work Best Practices", desc: "Optimize productivity and collaboration with your team", tag: "Advice" },
                            { title: "Pricing Your Freelance Services", desc: "Strategies to ensure you're valued appropriately", tag: "Strategy" }
                        ].map((article, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="bg-bg-main border border-border rounded-2xl p-8 hover:border-blue-300 transition-all cursor-pointer group"
                                whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(37, 99, 235, 0.2)" }}
                            >
                                <motion.span 
                                    className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full mb-4"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1, scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {article.tag}
                                </motion.span>
                                <h3 className="text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors font-outfit">{article.title}</h3>
                                <p className="text-text-soft text-sm mb-4">{article.desc}</p>
                                <motion.div 
                                    className="flex items-center gap-2 text-blue-600 font-bold text-sm"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    Read More <ArrowRight size={16} />
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="section bg-bg-main">
                <div className="container">
                    <motion.div 
                        className="section-title"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Meet Our Team</h2>
                        <p>Passionate experts dedicated to connecting talent with opportunity</p>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {[
                            { name: "Sarah Johnson", role: "Founder & CEO", icon: "👩‍💼" },
                            { name: "Marc Chen", role: "Head of Operations", icon: "👨‍💼" },
                            { name: "Emma Rodriguez", role: "Community Manager", icon: "👩‍🦰" }
                        ].map((member, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700/30"
                                whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(37, 99, 235, 0.15)" }}
                            >
                                <motion.div 
                                    className="text-6xl mb-4"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {member.icon}
                                </motion.div>
                                <h3 className="text-lg font-bold mb-1 font-outfit">{member.name}</h3>
                                <p className="text-blue-600 font-medium text-sm">{member.role}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section id="contact" className="section bg-bg-main">
                <div className="container max-w-4xl">
                    <motion.div
                        {...fadeInUp}
                        className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.div 
                            className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px]"
                            animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                        />
                        <motion.div 
                            className="absolute bottom-[-20%] left-[-10%] w-[250px] h-[250px] bg-blue-400/10 rounded-full blur-[80px]"
                            animate={{ x: [0, -20, 0], y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        />

                        <div className="relative z-10">
                            <motion.h2 
                                className="text-3xl md:text-4xl font-bold text-white mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                {t('cta.title')}
                            </motion.h2>

                            <motion.p 
                                className="text-blue-100 text-lg mb-10 max-w-xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                            >
                                {t('cta.subtitle')}
                            </motion.p>

                            <motion.div 
                                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link to="/register" className="bg-white text-blue-600 btn px-10 py-4 hover:bg-blue-50 font-bold transition-all">
                                        {t('cta.startBtn')}
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <a href="mailto:contact@zord.com" className="text-white border-white/30 border btn px-10 py-4 hover:bg-white/10 font-bold transition-all">
                                        {t('cta.contactBtn')}
                                    </a>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Home;
