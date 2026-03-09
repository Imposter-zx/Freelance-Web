import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { freelancers } from '../services/mockData';
import SEOMeta from '../components/common/SEOMeta';
import { Search, MapPin, Star, Filter, MessageCircle, Briefcase } from 'lucide-react';

const SearchFreelance = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFreelancers = freelancers.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20 bg-bg-soft">
      <SEOMeta title="Trouver un Freelance" description="Explorez notre sélection de freelances experts pour vos projets." />

      <div className="container">
        <div className="section-title">
          <h1 className="text-4xl font-bold font-outfit mb-4">Trouvez l'expert idéal</h1>
          <p>Accédez à un réseau de freelances vérifiés et passionnés.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom ou compétence..."
              className="w-full pl-12 pr-4 py-4 bg-bg-main border border-border rounded-2xl focus:border-blue-500 shadow-sm focus:shadow-md outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary px-6">
            <Filter size={20} /> Filtres avancés
          </button>
        </div>

        {/* Freelancers List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredFreelancers.map((freelance, idx) => (
            <motion.div
              key={freelance.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-bg-main p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col sm:flex-row gap-8"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-3xl shrink-0">
                {freelance.name.charAt(0)}
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold font-outfit">{freelance.name}</h3>
                    <p className="text-blue-600 font-medium text-sm">{freelance.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md text-xs font-bold">
                    <Star size={14} fill="currentColor" /> {freelance.rating}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-text-soft mb-6">
                  <span className="flex items-center gap-1"><MapPin size={14} /> Paris, France</span>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {freelance.experience} exp.</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {freelance.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-bg-soft border border-border rounded-lg text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button className="btn btn-primary flex-grow text-sm py-3 px-4">Engager ce profil</button>
                  <button className="p-3 bg-bg-soft border border-border rounded-xl hover:text-blue-600 hover:border-blue-300 transition-all">
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFreelancers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-soft">Aucun freelance ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFreelance;
