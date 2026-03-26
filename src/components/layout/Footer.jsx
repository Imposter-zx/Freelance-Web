import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Send, Check } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="bg-bg-main border-t border-border">
            {/* Newsletter Section */}
            <motion.div 
                className="border-b border-border py-12 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <div className="container">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-2 font-outfit">Stay Updated</h3>
                            <p className="text-text-soft">Get the latest news and opportunities delivered to your inbox.</p>
                        </div>
                        <motion.form 
                            onSubmit={handleSubscribe}
                            className="flex gap-2 w-full md:w-auto"
                            whileHover={{ scale: 1.02 }}
                        >
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-grow md:flex-grow-0 px-4 py-3 bg-bg-soft border border-border rounded-lg focus:border-blue-500 outline-none transition-colors"
                                required
                            />
                            <motion.button
                                type="submit"
                                className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                                    subscribed 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {subscribed ? (
                                    <>
                                        <Check size={18} /> Subscribed
                                    </>
                                ) : (
                                    <>
                                        Subscribe <Send size={18} />
                                    </>
                                )}
                            </motion.button>
                        </motion.form>
                    </div>
                </div>
            </motion.div>

            {/* Main Footer */}
            <div className="pt-16 pb-8">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <motion.div 
                            className="col-span-1 md:col-span-1"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link to="/" className="text-2xl font-bold text-blue-600 font-outfit mb-4 block hover:text-blue-700 transition-colors">
                                ZORD
                            </Link>
                            <p className="text-text-soft text-sm leading-relaxed">
                                La plateforme premium pour connecter les talentset les projets les plus ambitieux. Transformez vos idées en réalité.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm text-text-soft">
                                <li><Link to="/search" className="hover:text-blue-600 transition-colors">Find a Freelancer</Link></li>
                                <li><Link to="/work" className="hover:text-blue-600 transition-colors">Start Freelancing</Link></li>
                                <li><Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link></li>
                                <li><Link to="#" className="hover:text-blue-600 transition-colors">Projects</Link></li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Company</h4>
                            <ul className="space-y-4 text-sm text-text-soft">
                                <li><Link to="#" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                                <li><Link to="#" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                                <li><Link to="#" className="hover:text-blue-600 transition-colors">Career</Link></li>
                                <li><Link to="#" className="hover:text-blue-600 transition-colors">Press</Link></li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Support</h4>
                            <ul className="space-y-4 text-sm text-text-soft">
                                <li><Link to="#" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                                <li><Link to="#" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
                                <li><Link to="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </motion.div>
                    </div>

                    <motion.div 
                        className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <p className="text-sm text-text-soft">
                            © {new Date().getFullYear()} ZORD Freelance. All rights reserved.
                        </p>

                        <div className="flex items-center gap-4">
                            <motion.a 
                                href="#" 
                                className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:text-white hover:bg-blue-600 transition-all shadow-sm"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Twitter size={18} />
                            </motion.a>
                            <motion.a 
                                href="#" 
                                className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:text-white hover:bg-blue-600 transition-all shadow-sm"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Linkedin size={18} />
                            </motion.a>
                            <motion.a 
                                href="#" 
                                className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:text-white hover:bg-blue-600 transition-all shadow-sm"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Github size={18} />
                            </motion.a>
                            <motion.a 
                                href="mailto:contact@zord.com" 
                                className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:text-white hover:bg-blue-600 transition-all shadow-sm"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Mail size={18} />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
