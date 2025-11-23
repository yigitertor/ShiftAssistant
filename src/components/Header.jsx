import React from 'react';
import { Calendar, Globe, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Header = ({ onHome, darkMode, setDarkMode }) => {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{t('meta.title')}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
                    >
                        <Globe size={16} />
                        {language.toUpperCase()}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
