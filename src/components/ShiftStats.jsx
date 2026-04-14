import React from 'react';
import { BarChart3, Sun, Moon, AlertCircle, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SHIFT_HOURS = { day: 8, night: 16, full: 24 };

const ShiftStats = ({ shifts, SHIFT_TYPES }) => {
    const { t } = useLanguage();

    if (!shifts || shifts.length === 0) return null;

    const dayCnt = shifts.filter(s => s.type === 'day').length;
    const nightCnt = shifts.filter(s => s.type === 'night').length;
    const fullCnt = shifts.filter(s => s.type === 'full').length;
    const totalHours = (dayCnt * SHIFT_HOURS.day) + (nightCnt * SHIFT_HOURS.night) + (fullCnt * SHIFT_HOURS.full);

    const stats = [
        { label: t('stats.day_shifts'), count: dayCnt, color: SHIFT_TYPES.day.color, icon: Sun },
        { label: t('stats.night_shifts'), count: nightCnt, color: SHIFT_TYPES.night.color, icon: Moon },
        { label: t('stats.full_shifts'), count: fullCnt, color: SHIFT_TYPES.full.color, icon: AlertCircle },
    ];

    const maxCount = Math.max(dayCnt, nightCnt, fullCnt, 1);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-indigo-500" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('stats.title')}</h3>
            </div>

            {/* Toplam */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('stats.total_hours')}</span>
                </div>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{totalHours} {t('stats.hours')}</span>
            </div>

            {/* Bar Chart */}
            <div className="space-y-3">
                {stats.map(({ label, count, color, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3">
                        <Icon size={14} style={{ color }} className="shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600 dark:text-gray-400 truncate">{label}</span>
                                <span className="font-bold text-gray-700 dark:text-gray-200">{count}</span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: color }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toplam nöbet */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-center">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {shifts.length} {t('stats.total_shifts')}
                </span>
            </div>
        </div>
    );
};

export default ShiftStats;
