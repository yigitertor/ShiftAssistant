import React, { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ShiftNotification = ({ shifts, selectedDate, name }) => {
    const { t } = useLanguage();
    const [permission, setPermission] = useState('default');
    const [reminderEnabled, setReminderEnabled] = useState(() => {
        return localStorage.getItem('shiftReminder') === 'true';
    });
    const [reminderTime, setReminderTime] = useState(() => {
        return localStorage.getItem('shiftReminderTime') || '20:00'; // Önceki gün saat 20:00
    });
    const [scheduled, setScheduled] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            alert(t('notifications.not_supported'));
            return;
        }
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
            setReminderEnabled(true);
            localStorage.setItem('shiftReminder', 'true');
            scheduleNotifications();
        }
    };

    const toggleReminder = () => {
        const newState = !reminderEnabled;
        setReminderEnabled(newState);
        localStorage.setItem('shiftReminder', String(newState));

        if (newState && permission === 'granted') {
            scheduleNotifications();
        }
    };

    const handleTimeChange = (e) => {
        setReminderTime(e.target.value);
        localStorage.setItem('shiftReminderTime', e.target.value);
    };

    const scheduleNotifications = () => {
        if (!shifts || shifts.length === 0) return;

        // Mevcut timeout'ları temizle
        const existingTimeouts = JSON.parse(localStorage.getItem('shiftTimeouts') || '[]');
        existingTimeouts.forEach(id => clearTimeout(id));

        const newTimeouts = [];
        const [hours, minutes] = reminderTime.split(':').map(Number);
        const now = new Date();

        shifts.forEach(shift => {
            // Nöbet gününden bir gün önce hatırlatma (reminder time'da)
            const shiftDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), shift.day);
            const reminderDate = new Date(shiftDate);
            reminderDate.setDate(reminderDate.getDate() - 1);
            reminderDate.setHours(hours, minutes, 0, 0);

            const delay = reminderDate.getTime() - now.getTime();

            if (delay > 0) {
                const timeoutId = setTimeout(() => {
                    new Notification(t('notifications.reminder_title'), {
                        body: `${t('notifications.reminder_body')} ${shift.day} - ${name}`,
                        icon: '/pwa-192x192.png',
                        tag: `shift-${shift.day}`,
                    });
                }, delay);
                newTimeouts.push(timeoutId);
            }
        });

        localStorage.setItem('shiftTimeouts', JSON.stringify(newTimeouts));
        setScheduled(true);
        setTimeout(() => setScheduled(false), 2000);
    };

    if (!('Notification' in window)) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-3">
                <BellRing size={16} className="text-indigo-500" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('notifications.title')}</h3>
            </div>

            {permission !== 'granted' ? (
                <button
                    onClick={requestPermission}
                    className="w-full py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
                >
                    <Bell size={16} />
                    {t('notifications.enable')}
                </button>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{t('notifications.reminder')}</span>
                        <button
                            onClick={toggleReminder}
                            className={`relative w-11 h-6 rounded-full transition-colors ${reminderEnabled ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                        >
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${reminderEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                    </div>

                    {reminderEnabled && (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{t('notifications.time_label')}</span>
                                <input
                                    type="time"
                                    value={reminderTime}
                                    onChange={handleTimeChange}
                                    className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-200"
                                />
                            </div>
                            <button
                                onClick={scheduleNotifications}
                                className="w-full py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/40 transition"
                            >
                                {scheduled ? (
                                    <><Check size={14} /> {t('notifications.scheduled')}</>
                                ) : (
                                    <><Bell size={14} /> {t('notifications.schedule_btn')}</>
                                )}
                            </button>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                                {t('notifications.note')}
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShiftNotification;
