import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
          i18n.language === 'en'
            ? 'bg-white text-blue-600 shadow-lg'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
          i18n.language === 'fr'
            ? 'bg-white text-blue-600 shadow-lg'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
      >
        🇫🇷 FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
