import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-1 bg-white/90 rounded-lg p-1 shadow-md border border-slate-200">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
          i18n.language === 'en'
            ? 'bg-amber-600 text-white shadow-lg'
            : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
          i18n.language === 'fr'
            ? 'bg-amber-600 text-white shadow-lg'
            : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
        }`}
      >
        🇫🇷 FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
