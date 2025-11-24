import React from 'react';
import { Calendar, FileImage, Loader2, Smartphone, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const InputForm = ({ name, setName, setStep, handleFileUpload, isUploading, uploadStatus }) => {
    const { t } = useLanguage();

    return (
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div onClick={() => setStep(0)} className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer">
                    <Calendar className="text-white" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    {t('input.title')}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    {t('input.subtitle')}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-300">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('input.label_name')}</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('input.placeholder_name')}
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(0)}
                                    className="flex-none px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <button
                                    disabled={!name}
                                    onClick={() => setStep(2)}
                                    className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t('input.btn_manual')}
                                </button>
                            </div>

                            <div className={`relative group w-full ${!name ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input
                                    type="file"
                                    accept="image/*, .xlsx, .xls"
                                    disabled={!name || isUploading}
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
                                />
                                <div className="w-full bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-gray-600 py-4 px-4 rounded-md font-medium hover:bg-indigo-50 dark:hover:bg-gray-600 flex flex-col items-center justify-center gap-2 text-center transition">
                                    <div className="flex items-center gap-2">
                                        {isUploading ? <Loader2 className="animate-spin w-5 h-5" /> : <FileImage className="w-5 h-5" />}
                                        <span>{t('input.btn_upload')}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                                        {t('input.upload_desc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                            <Smartphone size={16} className="shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold">{t('input.tip_title')}</span> {t('input.tip_desc')}
                            </div>
                        </div>

                        {isUploading && (
                            <p className="text-center text-xs text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">{uploadStatus}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default InputForm;
