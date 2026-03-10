import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { freelancers } from '../services/mockData';
import SEOMeta from '../components/common/SEOMeta';
import { Search, MapPin, Star, Filter, MessageCircle, Briefcase, X, SlidersHorizontal } from 'lucide-react';

const SearchFreelance = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skills: [],
    minRating: 0,
    experience: '',
    location: ''
  });

  const allSkills = ['React', 'Node.js', 'AWS', 'Figma', 'Webflow', 'SEO', 'Copywriting', 'Analytics', 'Python', 'Design'];
  const experienceLevels = ['1-3 ans', '3-5 ans', '5-10 ans', '10+ ans'];

  const filteredFreelancers = freelancers.filter(f => {
    const matchesSearch = !searchTerm || 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkills = filters.skills.length === 0 || 
      filters.skills.some(s => f.skills.includes(s));
    
    const matchesRating = f.rating >= filters.minRating;
    
    return matchesSearch && matchesSkills && matchesRating;
  });

  const toggleSkill = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const clearFilters = () => {
    setFilters({ skills: [], minRating: 0, experience: '', location: '' });
  };

  const activeFiltersCount = filters.skills.length + (filters.minRating > 0 ? 1 : 0) + (filters.experience ? 1 : 0);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-bg-soft">
      <SEOMeta title="Trouver un Freelance" description="Explorez notre selection de freelances experts pour vos projets." />

      <div className="container">
        <div className="section-title">
          <h1 className="text-4xl font-bold font-outfit mb-4">Trouvez l'expert ideal</h1>
          <p>Accedez a un reseau de freelances verifies et passionnes.</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, competence ou mot cle..."
              className="w-full pl-12 pr-4 py-4 bg-bg-main border border-border rounded-2xl focus:border-blue-500 shadow-sm focus:shadow-md outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} px-6 flex items-center gap-2`}
          >
            <SlidersHorizontal size={20} /> 
            Filtres 
            {activeFiltersCount > 0 && (
              <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-bg-main rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Filtres avances</h3>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <X size={14} /> Effacer tout
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-3">Competences</label>
                    <div className="flex flex-wrap gap-2">
                      {allSkills.map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            filters.skills.includes(skill)
                              ? 'bg-blue-600 text-white'
                              : 'bg-bg-soft border border-border hover:border-blue-400'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3">Note minimum</label>
                    <div className="flex gap-2">
                      {[0, 3, 4, 4.5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filters.minRating === rating
                              ? 'bg-blue-600 text-white'
                              : 'bg-bg-soft border border-border hover:border-blue-400'
                          }`}
                        >
                          <Star size={14} className={rating > 0 ? 'fill-current' : ''} /> 
                          {rating === 0 ? 'Tous' : rating + '+'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3">Experience</label>
                    <select
                      value={filters.experience}
                      onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-4 py-2 bg-bg-soft border border-border rounded-lg focus:border-blue-500 outline-none"
                    >
                      <option value="">Toutes experiences</option>
                      {experienceLevels.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-6">
          <p className="text-text-soft">{filteredFreelancers.length} freelance{filteredFreelancers.length !== 1 ? 's' : ''} trouve{filteredFreelancers.length !== 1 ? 's' : ''}</p>
          <select className="px-4 py-2 bg-bg-main border border-border rounded-lg text-sm focus:border-blue-500 outline-none">
            <option>Pertinence</option>
            <option>Note la plus haute</option>
            <option>Prix croissant</option>
            <option>Plus d'experience</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredFreelancers.map((freelance, idx) => (
            <motion.div
              key={freelance.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-bg-main p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col sm:flex-row gap-8 cursor-pointer"
              onClick={() => navigate(`/profile/${freelance.id}`)}
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

                <div className="flex gap-4" onClick={e => e.stopPropagation()}>
                  <button className="btn btn-primary flex-grow text-sm py-3 px-4">Engager ce profil</button>
                  <button 
                    onClick={() => navigate('/messages')}
                    className="p-3 bg-bg-soft border border-border rounded-xl hover:text-blue-600 hover:border-blue-300 transition-all"
                  >
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFreelancers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-soft mb-4">Aucun freelance ne correspond a vos criteres.</p>
            <button onClick={clearFilters} className="btn btn-secondary">Effacer les filtres</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFreelance;
