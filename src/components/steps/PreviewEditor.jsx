import React from 'react';
import { Check, ImageIcon, Calendar as CalendarIcon, Loader2, Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PreviewEditor = ({ currentTheme, setCurrentTheme, THEMES, downloadWallpaper, generateICS, previewUrl, canvasRef, setStep, selectedDate }) => {
    const { t, translations } = useLanguage();
    const MONTHS = translations.months;

    return (
        <div className="flex-1 flex flex-col lg:flex-row bg-gray-100 overflow-hidden">
            {/* SOL PANEL: AYARLAR */}
            <div className="w-full lg:w-96 bg-white border-r border-gray-200 z-10 flex flex-col h-full">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">{t('preview.title')}</h2>
                    <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-indigo-600">{t('preview.edit')}</button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t('preview.themes_title')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.values(THEMES).map((theme) => {
                            const Icon = theme.icon || Check;
                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => setCurrentTheme(theme.id)}
                                    className={`relative p-3 rounded-xl border-2 text-left transition-all overflow-hidden h-24 flex flex-col justify-between ${currentTheme === theme.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-100 hover:border-gray-200'}`}
                                    style={{ backgroundColor: theme.bg }}
                                >
                                    <div className="flex justify-between w-full">
                                        <Icon className="w-5 h-5" style={{ color: theme.accent }} />
                                        {currentTheme === theme.id && <div className="bg-indigo-500 text-white rounded-full p-0.5"><Check size={10} /></div>}
                                    </div>
                                    <span className="text-xs font-bold truncate w-full" style={{ color: theme.text }}>{theme.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 space-y-3 bg-gray-50">
                    <button onClick={downloadWallpaper} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition shadow-lg">
                        <ImageIcon size={20} /> {t('preview.btn_download')}
                    </button>
                    <button onClick={generateICS} className="w-full py-3 bg-white text-indigo-700 border border-indigo-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition">
                        <CalendarIcon size={18} /> {t('preview.btn_calendar')}
                    </button>
                </div>
            </div>

            {/* SAĞ PANEL: ÖNİZLEME */}
            <div className="flex-1 bg-gray-200 flex items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6b7280 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="relative h-[85vh] aspect-[9/19] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden ring-1 ring-gray-900/5">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-36 bg-black rounded-b-2xl z-20"></div>
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="w-full h-full bg-white relative">
                        {!previewUrl && <div className="absolute inset-0 flex items-center justify-center bg-gray-100"><Loader2 className="animate-spin text-gray-400" /></div>}
                        {previewUrl && <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />}
                        {/* Sahte Kilit Ekranı UI */}
                        <div className="absolute top-12 left-0 w-full text-center z-10 pointer-events-none mix-blend-difference text-white px-8">
                            <div className="text-5xl md:text-7xl font-light tracking-tighter">09:41</div>
                            <div className="text-xl font-medium mt-2 opacity-90">12 {MONTHS[selectedDate.getMonth()]}</div>
                        </div>
                        <div className="absolute bottom-10 left-0 w-full flex justify-between px-12 z-10 pointer-events-none mix-blend-difference text-white">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"><div className="w-6 h-6 bg-current rounded-full opacity-50" /></div>
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"><Camera className="w-6 h-6" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PreviewEditor;
