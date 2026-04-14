import React, { useState } from 'react';
import { Check, ImageIcon, Calendar as CalendarIcon, Loader2, Camera, Type, Image as ImgIcon, Share2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ShiftStats from '../ShiftStats';
import ShiftNotification from '../ShiftNotification';

const PreviewEditor = ({ currentTheme, setCurrentTheme, THEMES, downloadWallpaper, generateICS, previewUrl, canvasRef, setStep, selectedDate, customFont, setCustomFont, setCustomBgImage, shifts, SHIFT_TYPES, name }) => {
    const { t, translations } = useLanguage();
    const MONTHS = translations.months;
    const [shareStatus, setShareStatus] = useState('');

    const fonts = [
        { name: t('fonts.modern'), value: 'sans-serif' },
        { name: t('fonts.classic'), value: 'serif' },
        { name: t('fonts.typewriter'), value: 'monospace' },
        { name: t('fonts.handwritten'), value: "'Brush Script MT', cursive" },
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setCustomBgImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // F2: URL tabanlı paylaşım
    const handleShare = async () => {
        try {
            const shareData = {
                n: name,
                m: selectedDate.getMonth(),
                y: selectedDate.getFullYear(),
                s: shifts.map(s => `${s.day}:${s.type[0]}`).join(',')
                // Format: "1:n,5:d,12:f" (compact)
            };
            const params = new URLSearchParams(shareData);
            const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

            if (navigator.share) {
                await navigator.share({
                    title: t('meta.title'),
                    text: `${name} - ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`,
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                setShareStatus('copied');
                setTimeout(() => setShareStatus(''), 2000);
            }
        } catch (e) {
            // User cancelled share or clipboard failed
            if (e.name !== 'AbortError') {
                console.error('Share error:', e);
                setShareStatus('error');
                setTimeout(() => setShareStatus(''), 2000);
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
            {/* SOL PANEL: AYARLAR */}
            <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10 flex flex-col h-full transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('preview.title')}</h2>
                    <button onClick={() => setStep(2)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600">{t('preview.edit')}</button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* İstatistikler (F3) */}
                    <ShiftStats shifts={shifts} SHIFT_TYPES={SHIFT_TYPES} />

                    {/* Temalar */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t('preview.themes_title')}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.values(THEMES).map((theme) => {
                                const Icon = theme.icon || Check;
                                return (
                                    <button
                                        key={theme.id}
                                        onClick={() => { setCurrentTheme(theme.id); setCustomBgImage(null); }}
                                        className={`relative p-3 rounded-xl border-2 text-left transition-all overflow-hidden h-24 flex flex-col justify-between ${currentTheme === theme.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}
                                        style={{ backgroundColor: theme.bg }}
                                    >
                                        <div className="flex justify-between w-full">
                                            <Icon className="w-5 h-5" style={{ color: theme.accent }} />
                                            {currentTheme === theme.id && <div className="bg-indigo-500 text-white rounded-full p-0.5"><Check size={10} /></div>}
                                        </div>
                                        <span className="text-xs font-bold truncate w-full" style={{ color: theme.text }}>{t(`themes.${theme.id}`)}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Özelleştirme */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t('preview.customize_title')}</h3>

                        {/* Font Seçimi */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Type size={16} /> {t('preview.font_label')}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {fonts.map(f => (
                                    <button
                                        key={f.value}
                                        onClick={() => setCustomFont(f.value)}
                                        className={`px-3 py-2 text-sm border rounded-lg ${customFont === f.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}
                                        style={{ fontFamily: f.value }}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Arka Plan Yükleme */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <ImgIcon size={16} /> {t('preview.bg_label')}
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    {t('preview.select_photo')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bildirimler (F4) */}
                    <ShiftNotification shifts={shifts} selectedDate={selectedDate} name={name} />

                </div>
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 space-y-3 bg-gray-50 dark:bg-gray-800">
                    <button onClick={downloadWallpaper} className="w-full py-4 bg-gray-900 dark:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition shadow-lg">
                        <ImageIcon size={20} /> {t('preview.btn_download')}
                    </button>
                    <div className="flex gap-2">
                        <button onClick={generateICS} className="flex-1 py-3 bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-gray-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-gray-600 transition">
                            <CalendarIcon size={18} /> {t('preview.btn_calendar')}
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex-none px-4 py-3 bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-gray-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-gray-600 transition relative"
                        >
                            <Share2 size={18} />
                            {shareStatus === 'copied' && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                                    {t('preview.share_copied')}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* SAĞ PANEL: ÖNİZLEME */}
            <div className="flex-1 bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-8 relative overflow-hidden">
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
