import React from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth } from '../../utils/dateUtils';
import { useLanguage } from '../../context/LanguageContext';

const CalendarSelection = ({ selectedDate, setSelectedDate, shifts, setShifts, setStep, SHIFT_TYPES }) => {
    const { t, translations } = useLanguage();
    const MONTHS = translations.months;
    const DAYS = translations.days_short;

    const toggleShift = (day) => {
        const existingShift = shifts.find(s => s.day === day);

        if (!existingShift) {
            // Yoksa ekle (Varsayılan: Gündüz)
            setShifts([...shifts, { day, type: 'day' }]);
        } else {
            // Varsa tipini değiştir veya sil
            if (existingShift.type === 'day') {
                // Gündüz -> Gece
                setShifts(shifts.map(s => s.day === day ? { ...s, type: 'night' } : s));
            } else if (existingShift.type === 'night') {
                // Gece -> 24 Saat
                setShifts(shifts.map(s => s.day === day ? { ...s, type: 'full' } : s));
            } else {
                // 24 Saat -> Sil
                setShifts(shifts.filter(s => s.day !== day));
            }
        }
    };

    const clearAllShifts = () => {
        if (window.confirm('Tüm seçimleri temizlemek istediğinize emin misiniz?')) {
            setShifts([]);
        }
    };

    return (
        <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 flex flex-col items-center transition-colors duration-300">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[85vh] transition-colors duration-300">
                {/* Sol Taraf: Takvim Kontrol */}
                <div className="flex-1 p-3 md:p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-2 md:mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('calendar.title')}</h2>
                        <div className="flex gap-2">
                            <button onClick={() => {
                                const d = new Date(selectedDate); d.setMonth(d.getMonth() - 1); setSelectedDate(d); setShifts([]);
                            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300">←</button>
                            <span className="font-medium text-indigo-600 dark:text-indigo-400 w-32 text-center">{MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
                            <button onClick={() => {
                                const d = new Date(selectedDate); d.setMonth(d.getMonth() + 1); setSelectedDate(d); setShifts([]);
                            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300">→</button>
                        </div>
                    </div>

                    {/* Nöbet Tipleri Lejantı */}
                    <div className="flex gap-4 mb-4 justify-center">
                        {Object.values(SHIFT_TYPES).map(type => (
                            <div key={type.id} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                                <span>{type.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400">
                            {DAYS.map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2">
                            {Array(getFirstDayOfMonth(selectedDate.getFullYear(), selectedDate.getMonth())).fill(null).map((_, i) => <div key={`blank-${i}`} />)}
                            {Array.from({ length: getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth()) }, (_, i) => i + 1).map(day => {
                                const shift = shifts.find(s => s.day === day);
                                return (
                                    <button
                                        key={day}
                                        onClick={() => toggleShift(day)}
                                        style={shift ? { backgroundColor: SHIFT_TYPES[shift.type].color, color: 'white' } : {}}
                                        className={`h-9 md:h-14 w-full rounded-lg flex items-center justify-center text-sm md:text-lg font-medium transition 
                                            ${shift ? 'shadow-lg scale-105' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                                    >
                                        {day}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-700 dark:text-gray-300">{shifts.length} {t('calendar.selected_days')}</span>
                            {shifts.length > 0 && (
                                <button
                                    onClick={clearAllShifts}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    <Trash2 size={14} /> Temizle
                                </button>
                            )}
                        </div>
                        <button onClick={() => setStep(3)} disabled={shifts.length === 0} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                            {t('calendar.btn_design')} <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CalendarSelection;
