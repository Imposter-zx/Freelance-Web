import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { languages } from '../../locales/translations';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages[Object.keys(languages).find(key => languages[key].code === language)];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-bg-soft transition-colors text-sm font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Change Language"
      >
        <Globe size={18} />
        <span>{currentLanguage?.flag}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-bg-main border border-border rounded-lg shadow-lg z-50"
          >
            {Object.entries(languages).map(([key, lang]) => (
              <motion.button
                key={key}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  language === lang.code
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                    : 'hover:bg-bg-soft'
                }`}
                whileHover={{ paddingLeft: '20px' }}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1">{lang.name}</span>
                {language === lang.code && <span className="text-xl">✓</span>}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
