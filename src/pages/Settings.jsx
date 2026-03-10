import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEOMeta from '../components/common/SEOMeta';
import { 
    User, Lock, Bell, CreditCard, Shield, Globe, 
    Moon, Sun, Save, Trash2, Camera, Mail, Phone
} from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: '+33 1 23 45 67 89',
        bio: 'Developpeur passionne avec plus de 5 ans d experience.',
        location: 'Paris, France',
        timezone: 'Europe/Paris',
        language: 'fr',
        darkMode: true,
        emailNotifications: true,
        pushNotifications: true,
        projectUpdates: true,
        marketingEmails: false,
        twoFactor: false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const sections = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Securite', icon: Shield },
        { id: 'billing', label: 'Facturation', icon: CreditCard }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-bg-soft">
            <SEOMeta title="Parametres" description="Gerez vos parametres de compte." />

            <div className="container">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold font-outfit mb-2">Parametres</h1>
                        <p className="text-text-soft mb-8">Gerez vos preferences et parametres de compte</p>

                        {saved && (
                            <div className="bg-green-100 border border-green-600 text-green-600 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
                                <Save size={20} /> Parametres sauvegardes avec succes !
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-1">
                                <nav className="bg-bg-main rounded-3xl border border-border p-4 shadow-sm">
                                    {sections.map(section => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${
                                                activeSection === section.id 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'text-text-soft hover:bg-bg-soft'
                                            }`}
                                        >
                                            <section.icon size={20} /> {section.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="lg:col-span-3">
                                <form onSubmit={handleSave} className="bg-bg-main rounded-3xl border border-border p-8 shadow-sm">
                                    {activeSection === 'profile' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                <User size={24} className="text-blue-600" /> Informations du profil
                                            </h2>

                                            <div className="flex items-center gap-6 mb-8">
                                                <div className="relative">
                                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl">
                                                        {formData.name.charAt(0)}
                                                    </div>
                                                    <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                                                        <Camera size={14} />
                                                    </button>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">Photo de profil</h3>
                                                    <p className="text-sm text-text-soft">JPG, PNG. Max 2MB</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">Nom complet</label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">Email</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">Telephone</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">Localisation</label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-bold mb-2">Bio</label>
                                                    <textarea
                                                        name="bio"
                                                        value={formData.bio}
                                                        onChange={handleInputChange}
                                                        rows={4}
                                                        className="w-full px-5 py-3 bg border-border rounded-xl-bg-soft border focus:border-blue-500 outline-none resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeSection === 'notifications' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                <Bell size={24} className="text-blue-600" /> Parametres de notification
                                            </h2>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between p-4 bg-bg-soft rounded-xl">
                                                    <div>
                                                        <h4 className="font-bold">Notifications par email</h4>
                                                        <p className="text-sm text-text-soft">Recevoir des emails pour les mises a jour importantes</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="emailNotifications" checked={formData.emailNotifications} onChange={handleInputChange} className="sr-only peer" />
                                                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-bg-soft rounded-xl">
                                                    <div>
                                                        <h4 className="font-bold">Notifications push</h4>
                                                        <p className="text-sm text-text-soft">Recevoir des notifications sur votre appareil</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="pushNotifications" checked={formData.pushNotifications} onChange={handleInputChange} className="sr-only peer" />
                                                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-bg-soft rounded-xl">
                                                    <div>
                                                        <h4 className="font-bold">Mises a jour des projets</h4>
                                                        <p className="text-sm text-text-soft">Etre notifie des nouvelles activites sur vos projets</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="projectUpdates" checked={formData.projectUpdates} onChange={handleInputChange} className="sr-only peer" />
                                                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-bg-soft rounded-xl">
                                                    <div>
                                                        <h4 className="font-bold">Emails marketing</h4>
                                                        <p className="text-sm text-text-soft">Recevoir des nouvelles et offres speciales</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="marketingEmails" checked={formData.marketingEmails} onChange={handleInputChange} className="sr-only peer" />
                                                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeSection === 'security' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                <Shield size={24} className="text-blue-600" /> Securite du compte
                                            </h2>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between p-4 bg-bg-soft rounded-xl">
                                                    <div>
                                                        <h4 className="font-bold">Authentification a deux facteurs</h4>
                                                        <p className="text-sm text-text-soft">Ajouter une couche de securite supplementaire</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="twoFactor" checked={formData.twoFactor} onChange={handleInputChange} className="sr-only peer" />
                                                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>

                                                <div className="border-t border-border pt-6">
                                                    <h3 className="font-bold mb-4">Changer le mot de passe</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-bold mb-2">Mot de passe actuel</label>
                                                            <div className="relative">
                                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
                                                                <input
                                                                    type="password"
                                                                    name="currentPassword"
                                                                    value={formData.currentPassword}
                                                                    onChange={handleInputChange}
                                                                    className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-bold mb-2">Nouveau mot de passe</label>
                                                            <div className="relative">
                                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
                                                                <input
                                                                    type="password"
                                                                    name="newPassword"
                                                                    value={formData.newPassword}
                                                                    onChange={handleInputChange}
                                                                    className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-bold mb-2">Confirmer le mot de passe</label>
                                                            <div className="relative">
                                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
                                                                <input
                                                                    type="password"
                                                                    name="confirmPassword"
                                                                    value={formData.confirmPassword}
                                                                    onChange={handleInputChange}
                                                                    className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border rounded-xl focus:border-blue-500 outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeSection === 'billing' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                <CreditCard size={24} className="text-blue-600" /> Methodes de paiement
                                            </h2>

                                            <div className="space-y-4">
                                                <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                                                        <div>
                                                            <p className="font-bold">•••• •••• •••• 4242</p>
                                                            <p className="text-sm text-text-soft">Expire 12/26</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-green-600 text-sm font-medium">Par defaut</span>
                                                </div>

                                                <button type="button" className="w-full py-4 border-2 border-dashed border-border rounded-xl text-text-soft hover:border-blue-400 hover:text-blue-600 transition-colors">
                                                    + Ajouter une methode de paiement
                                                </button>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-border">
                                                <h3 className="font-bold mb-4">Historique des factures</h3>
                                                <div className="space-y-3">
                                                    {[
                                                        { date: 'Jan 2025', amount: '29.00 EUR', status: 'Paye' },
                                                        { date: 'Dec 2024', amount: '29.00 EUR', status: 'Paye' },
                                                        { date: 'Nov 2024', amount: '29.00 EUR', status: 'Paye' }
                                                    ].map((invoice, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-4 bg-bg-soft rounded-xl">
                                                            <div>
                                                                <p className="font-bold">{invoice.amount}</p>
                                                                <p className="text-sm text-text-soft">{invoice.date}</p>
                                                            </div>
                                                            <button className="text-blue-600 text-sm font-medium hover:underline">Telecharger</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                                        <button type="button" className="text-red-500 flex items-center gap-2 hover:text-red-600">
                                            <Trash2 size={18} /> Supprimer le compte
                                        </button>
                                        <button type="submit" className="btn btn-primary flex items-center gap-2">
                                            <Save size={18} /> Sauvegarder
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
