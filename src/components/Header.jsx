import React from 'react';
import { Calendar, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Header = ({ onHome }) => {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">{t('meta.title')}</span>
                </div>
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
                >
                    <Globe size={16} />
                    {language.toUpperCase()}
                </button>
            </div>
        </header>
    );
};

export default Header;
