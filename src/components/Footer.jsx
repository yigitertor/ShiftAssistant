import React from 'react';
import { Calendar, Github } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <div className="bg-indigo-600 p-1 rounded-lg">
                                <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900">{t('meta.title')}</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto md:mx-0">
                            {t('meta.desc')}
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end">
                        <div className="flex gap-4 mb-2">
                            <a href="https://github.com/yigitertor" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Github size={20} />
                            </a>
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                            {t('footer.developer')}: <span className="text-indigo-600 font-bold">Yiğit Ertör</span>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-400">
                    &copy; 2024 {t('meta.title')}. {t('footer.rights')}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
