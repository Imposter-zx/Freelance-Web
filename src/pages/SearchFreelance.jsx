import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { freelancers } from '../services/mockData';
import SEOMeta from '../components/common/SEOMeta';
import { useLanguage } from '../context/LanguageContext';
import { Search, MapPin, Star, Filter, MessageCircle, Briefcase, X, SlidersHorizontal, Zap } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/animations';
import { ProjectDescription } from '../components/pretext';

const SearchFreelance = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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

  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading when filters change
  const handleFilterChange = (newFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
    setTimeout(() => setIsLoading(false), 800);
  };

  const toggleSkill = (skill) => {
    const newSkills = filters.skills.includes(skill) 
        ? filters.skills.filter(s => s !== skill)
        : [...filters.skills, skill];
    handleFilterChange({ ...filters, skills: newSkills });
  };

  const clearFilters = () => {
    handleFilterChange({ skills: [], minRating: 0, experience: '', location: '' });
  };

  const activeFiltersCount = filters.skills.length + (filters.minRating > 0 ? 1 : 0) + (filters.experience ? 1 : 0);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-bg-soft">
      <SEOMeta title={t('search.pageTitle')} description={t('search.pageDescription')} />

      <div className="container">
        {/* Header */}
        <motion.div 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl font-bold font-outfit mb-4 flex items-center gap-3 justify-center"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap className="text-blue-600" size={32} />
            {t('search.title')}
          </motion.h1>
          <p>{t('search.subtitle')}</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="mb-8 flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div 
            className="flex-grow relative group"
            whileFocus={{ scale: 1.01 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft group-focus-within:text-blue-500 transition-colors" size={20} />
            <motion.input
              type="text"
              placeholder={t('search.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-4 bg-bg-main border border-border rounded-2xl focus:border-blue-500 shadow-sm focus:shadow-md outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              whileFocus={{ boxShadow: "0 0 20px rgba(37, 99, 235, 0.2)" }}
            />
          </motion.div>
          
          <motion.button 
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} px-6 flex items-center gap-2 whitespace-nowrap`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SlidersHorizontal size={20} /> 
            {t('search.filters')}
            {activeFiltersCount > 0 && (
              <motion.span 
                className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                {activeFiltersCount}
              </motion.span>
            )}
          </motion.button>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <motion.div 
                className="bg-bg-main rounded-2xl border border-border p-6 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">{t('search.advancedFilters')}</h3>
                  {activeFiltersCount > 0 && (
                    <motion.button 
                      onClick={clearFilters} 
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={14} /> {t('search.clearAll')}
                    </motion.button>
                  )}
                </div>
                
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Skills Filter */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-bold mb-3">{t('search.skills')}</label>
                    <div className="flex flex-wrap gap-2">
                      {allSkills.map((skill, idx) => (
                        <motion.button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            filters.skills.includes(skill)
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                              : 'bg-bg-soft border border-border hover:border-blue-400'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          {skill}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Rating Filter */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-bold mb-3">{t('search.minRating')}</label>
                    <div className="flex gap-2 flex-wrap">
                      {[0, 3, 4, 4.5].map((rating, idx) => (
                        <motion.button
                          key={rating}
                          onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filters.minRating === rating
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                              : 'bg-bg-soft border border-border hover:border-blue-400'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Star size={14} className={rating > 0 ? 'fill-current' : ''} /> 
                          {rating === 0 ? t('search.all') : rating + '+'}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Experience Filter */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-bold mb-3">{t('search.experience')}</label>
                    <motion.select
                      value={filters.experience}
                      onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-4 py-2 bg-bg-soft border border-border rounded-lg focus:border-blue-500 outline-none"
                      whileFocus={{ boxShadow: "0 0 10px rgba(37, 99, 235, 0.2)" }}
                    >
                      <option value="">{t('search.allExperience')}</option>
                      {experienceLevels.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </motion.select>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results info */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.p 
            className="text-text-soft font-medium"
            key={filteredFreelancers.length}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
          >
            {filteredFreelancers.length} {t('search.results')}
          </motion.p>
          <motion.select 
            className="px-4 py-2 bg-bg-main border border-border rounded-lg text-sm focus:border-blue-500 outline-none"
            whileFocus={{ boxShadow: "0 0 10px rgba(37, 99, 235, 0.2)" }}
          >
            <option>{t('search.relevance')}</option>
            <option>{t('search.highestRating')}</option>
            <option>{t('search.lowestPrice')}</option>
            <option>{t('search.mostExperience')}</option>
          </motion.select>
        </motion.div>

        {/* Freelancer Cards */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            // Skeleton Loading State
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-bg-main p-8 rounded-3xl border border-border shadow-sm flex flex-col sm:flex-row gap-8">
                <div className="w-24 h-24 skeleton shrink-0" />
                <div className="flex-grow space-y-4">
                  <div className="h-6 w-1/3 skeleton" />
                  <div className="h-4 w-1/4 skeleton" />
                  <div className="h-4 w-full skeleton" />
                  <div className="h-4 w-5/6 skeleton" />
                  <div className="flex gap-2">
                    <div className="h-8 w-16 skeleton" />
                    <div className="h-8 w-16 skeleton" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            filteredFreelancers.map((freelance, idx) => (
            <motion.div
              key={freelance.id}
              variants={itemVariants}
              className="bg-bg-main p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col sm:flex-row gap-8 cursor-pointer relative overflow-hidden"
              onClick={() => navigate(`/profile/${freelance.id}`)}
              whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(37, 99, 235, 0.15)" }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-0"
                whileHover={{ opacity: 0.05 }}
                transition={{ duration: 0.3 }}
              />

              {/* Avatar */}
              <motion.div 
                className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-3xl shrink-0 relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {freelance.name.charAt(0)}
              </motion.div>

              {/* Content */}
              <div className="flex-grow relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <motion.h3 
                      className="text-xl font-bold font-outfit"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + 0.2 }}
                    >
                      {freelance.name}
                    </motion.h3>
                    <motion.p 
                      className="text-blue-600 font-medium text-sm"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + 0.3 }}
                    >
                      {freelance.role}
                    </motion.p>
                  </div>
                  <motion.div 
                    className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md text-xs font-bold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star size={14} fill="currentColor" /> {freelance.rating}
                  </motion.div>
                </div>

                <motion.div 
                  className="flex flex-wrap gap-4 text-xs text-text-soft mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.1 }}
                >
                  <span className="flex items-center gap-1"><MapPin size={14} /> Paris, France</span>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {freelance.experience} exp.</span>
                </motion.div>

                <motion.div 
                  className="flex flex-wrap gap-2 mb-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {freelance.skills.map((skill, skillIdx) => (
                    <motion.span 
                      key={skill} 
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 rounded-lg text-xs font-medium"
                      variants={itemVariants}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(37, 99, 235, 0.1)" }}
                      transition={{ delay: skillIdx * 0.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.15 }}
                  className="mb-4"
                >
                  <ProjectDescription 
                    text={freelance.description || `${freelance.name} est un ${freelance.role} avec ${freelance.experience} d'expérience. Spécialisé en ${freelance.skills.join(', ')}.`}
                    maxLines={2}
                    lineHeight={18}
                    className="text-sm"
                  />
                </motion.div>

                <motion.div 
                  className="flex gap-4"
                  onClick={e => e.stopPropagation()}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                >
                  <motion.button 
                    className="btn btn-primary flex-grow text-sm py-3 px-4 btn-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('search.hireBtn')}
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/messages')}
                    className="p-3 bg-bg-soft border border-border rounded-xl hover:text-blue-600 hover:border-blue-300 transition-all"
                    whileHover={{ scale: 1.1, backgroundColor: "rgb(226, 232, 240)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle size={20} />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredFreelancers.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p 
              className="text-text-soft mb-4 text-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              😕 {t('search.noResults')}
            </motion.p>
            <motion.button 
              onClick={clearFilters} 
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('search.clearFilters')}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchFreelance;

