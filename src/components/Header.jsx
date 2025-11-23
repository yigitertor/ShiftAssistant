import React from 'react';
import { Calendar } from 'lucide-react';

const Header = ({ onHome }) => (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">NöbetAsistanı</span>
            </div>
        </div>
    </header>
);

export default Header;
