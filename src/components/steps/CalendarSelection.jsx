import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth } from '../../utils/dateUtils';

const CalendarSelection = ({ selectedDate, setSelectedDate, shifts, setShifts, setStep, MONTHS }) => {
    const toggleShift = (day) => {
        if (shifts.includes(day)) setShifts(shifts.filter(d => d !== day));
        else setShifts([...shifts, day]);
    };

    return (
        <div className="flex-1 p-4 md:p-8 bg-gray-50 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[85vh]">
                {/* Sol Taraf: Takvim Kontrol */}
                <div className="flex-1 p-3 md:p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-2 md:mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Günleri Seç</h2>
                        <div className="flex gap-2">
                            <button onClick={() => {
                                const d = new Date(selectedDate); d.setMonth(d.getMonth() - 1); setSelectedDate(d); setShifts([]);
                            }} className="p-2 hover:bg-gray-100 rounded">←</button>
                            <span className="font-medium text-indigo-600 w-32 text-center">{MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
                            <button onClick={() => {
                                const d = new Date(selectedDate); d.setMonth(d.getMonth() + 1); setSelectedDate(d); setShifts([]);
                            }} className="p-2 hover:bg-gray-100 rounded">→</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400">
                            {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2">
                            {Array(getFirstDayOfMonth(selectedDate.getFullYear(), selectedDate.getMonth())).fill(null).map((_, i) => <div key={`blank-${i}`} />)}
                            {Array.from({ length: getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth()) }, (_, i) => i + 1).map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleShift(day)}
                                    className={`h-9 md:h-14 w-full rounded-lg flex items-center justify-center text-sm md:text-lg font-medium transition ${shifts.includes(day) ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-700">{shifts.length} gün seçildi</span>
                        <button onClick={() => setStep(3)} disabled={shifts.length === 0} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                            Tasarla <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CalendarSelection;
