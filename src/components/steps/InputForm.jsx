import React from 'react';
import { Calendar, FileImage, Loader2, Smartphone } from 'lucide-react';

const InputForm = ({ name, setName, setStep, handleFileUpload, isUploading, uploadStatus }) => {
    return (
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div onClick={() => setStep(0)} className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer">
                    <Calendar className="text-white" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Bilgilerini Gir
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Duvar kağıdında görünecek ismi belirle.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">İsim / Ünvan</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Örn: Dr. Ali Veli"
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                disabled={!name}
                                onClick={() => setStep(2)}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Manuel Seçim ile Devam Et
                            </button>

                            <div className={`relative group w-full ${!name ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input
                                    type="file"
                                    accept="image/*, .xlsx, .xls"
                                    disabled={!name || isUploading}
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
                                />
                                <div className="w-full bg-white text-indigo-600 border border-indigo-200 py-4 px-4 rounded-md font-medium hover:bg-indigo-50 flex flex-col items-center justify-center gap-2 text-center transition">
                                    <div className="flex items-center gap-2">
                                        {isUploading ? <Loader2 className="animate-spin w-5 h-5" /> : <FileImage className="w-5 h-5" />}
                                        <span>Dosya Yükle (Otomatik)</span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-normal">
                                        Desteklenenler: Excel veya Ekran Görüntüsü
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 flex items-start gap-2">
                            <Smartphone size={16} className="shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold">İpucu:</span> PDF veya Word dosyanız varsa, listenin bulunduğu sayfanın ekran görüntüsünü alıp yükleyerek en iyi sonucu alabilirsiniz.
                            </div>
                        </div>

                        {isUploading && (
                            <p className="text-center text-xs text-indigo-600 font-medium animate-pulse">{uploadStatus}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default InputForm;
