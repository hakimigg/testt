import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          i18n.language === 'en'
            ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg transform scale-105'
            : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50 hover:shadow-md'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          i18n.language === 'fr'
            ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg transform scale-105'
            : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50 hover:shadow-md'
        }`}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
