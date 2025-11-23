import React from 'react';
import { ArrowRight, FileSpreadsheet, Calendar, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HeroSection = ({ onStart }) => {
    const { t } = useLanguage();

    return (
        <main className="flex-1">
            <div className="relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
                        <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <div className="inline-block px-4 py-1.5 mb-4 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wide">
                                    {t('hero.badge')}
                                </div>
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">{t('hero.title_part1')}</span>{' '}
                                    <span className="block text-indigo-600 xl:inline">{t('hero.title_part2')}</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    {t('hero.subtitle')}
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <button onClick={onStart} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg transition shadow-xl shadow-indigo-200">
                                        {t('hero.cta')}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-indigo-50 flex items-center justify-center mt-8 lg:mt-0">
                    {/* HERO MOCKUP (SIMULATION) */}
                    <div className="relative w-full h-96 lg:h-full flex items-center justify-center overflow-hidden">
                        {/* Arka plan efektleri */}
                        <div className="absolute w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 top-0 right-0"></div>

                        {/* TELEFON ÇERÇEVESİ */}
                        <div className="relative z-10 transform rotate-[-5deg] hover:rotate-0 transition duration-500">
                            <div className="w-64 h-[500px] bg-black rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden relative flex flex-col">

                                {/* --- EKRAN İÇERİĞİ (Minimal Tema Simülasyonu) --- */}
                                <div className="absolute inset-0 bg-[#111111] flex flex-col">
                                    {/* Dekoratif Orta Daire */}
                                    <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-40 h-40 bg-[#333333] rounded-full opacity-50 blur-md"></div>

                                    {/* Üst Boşluk (Saat için) */}
                                    <div className="h-[35%] flex flex-col items-center justify-center text-white/50 space-y-1">
                                        {/* İstenilen Random Saat Görünümü */}
                                        <div className="text-5xl font-light text-white tracking-tight">14:38</div>
                                        <div className="text-[10px] tracking-widest uppercase opacity-70">12 Oct Tue</div>
                                    </div>

                                    {/* İçerik (Aşağı itilmiş) */}
                                    <div className="flex-1 flex flex-col items-center px-4 relative z-10">
                                        {/* Başlıklar */}
                                        <div className="text-white text-2xl font-bold mb-1">Oct 2025</div>
                                        <div className="text-gray-400 text-sm italic mb-6">Dr. John Doe</div>

                                        {/* Takvim Grid Simülasyonu */}
                                        <div className="w-full">
                                            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                                                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => <span key={d} className="text-[0.6rem] text-gray-500 font-bold">{d}</span>)}
                                            </div>
                                            <div className="grid grid-cols-7 gap-1.5">
                                                {/* Rastgele Günler */}
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                                                    const isShift = [3, 7, 12, 18, 24, 28].includes(d);
                                                    return (
                                                        <div key={d} className={`aspect-square flex items-center justify-center text-[0.65rem] rounded-full ${isShift ? 'bg-white text-black font-bold' : 'text-gray-400'}`}>
                                                            {d}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Alt Bilgi */}
                                        <div className="mt-auto mb-8 text-gray-500 text-[0.6rem]">
                                            6 {t('preview.shift_planned')}
                                        </div>
                                    </div>
                                </div>
                                {/* --- EKRAN SONU --- */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FEATURES */}
            <div id="nasil-calisir" className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">{t('hero.how_it_works')}</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            {t('hero.how_title')}
                        </p>
                    </div>

                    <div className="mt-10">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <FileSpreadsheet className="h-6 w-6" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{t('hero.step1_title')}</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">
                                    {t('hero.step1_desc')}
                                </dd>
                            </div>
                            <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{t('hero.step2_title')}</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">
                                    {t('hero.step2_desc')}
                                </dd>
                            </div>
                            <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <ImageIcon className="h-6 w-6" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{t('hero.step3_title')}</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">
                                    {t('hero.step3_desc')}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HeroSection;
