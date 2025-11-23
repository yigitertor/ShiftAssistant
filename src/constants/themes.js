import { Moon, Heart, Cloud, Sun, Flower, Star, PawPrint, Leaf, FileText, Smartphone } from 'lucide-react';

export const THEMES = {
    minimal: { id: 'minimal', name: 'Minimal Siyah', bg: '#000000', text: '#ffffff', accent: '#ffffff', secondary: '#333333', font: 'sans-serif', type: 'dark', icon: Moon },
    galaxy: { id: 'galaxy', name: 'Derin Uzay', bg: '#050b14', text: '#e0e7ff', accent: '#c084fc', secondary: '#1e1b4b', font: 'sans-serif', type: 'dark', icon: Star, decorative: true, emoji: '✨', customDraw: 'space' },
    coffee: { id: 'coffee', name: 'Latte Art', bg: '#f5ebe0', text: '#4a3b32', accent: '#d4a373', secondary: '#e3d5ca', font: 'serif', type: 'light', icon: FileText, decorative: true, emoji: '☕' },
    cyberpunk: { id: 'cyberpunk', name: 'Neon Gece', bg: '#09090b', text: '#22d3ee', accent: '#f472b6', secondary: '#27272a', font: 'monospace', type: 'dark', icon: Smartphone, decorative: true, emoji: '👾', customDraw: 'grid' },
    winter: { id: 'winter', name: 'Kış Masalı', bg: '#f0f9ff', text: '#1e3a8a', accent: '#38bdf8', secondary: '#dbeafe', font: 'sans-serif', type: 'light', icon: Cloud, decorative: true, emoji: '❄️', customDraw: 'snow' },
    retro: { id: 'retro', name: '80ler Günbatımı', bg: '#2a0a18', text: '#fcd34d', accent: '#f43f5e', secondary: '#5b21b6', font: "'Courier New', monospace", type: 'dark', icon: Sun, decorative: true, emoji: '🌴' },
    flora: { id: 'flora', name: 'Bahar Bahçesi', bg: '#fefae0', text: '#2d6a4f', accent: '#d08c60', secondary: '#e9edc9', font: "'Brush Script MT', cursive", type: 'light', icon: Flower, decorative: true, emoji: '🌸' },
    ocean: { id: 'ocean', name: 'Sakin Okyanus', bg: '#ecfeff', text: '#164e63', accent: '#06b6d4', secondary: '#cffafe', font: 'sans-serif', type: 'light', icon: Cloud, decorative: true, emoji: '🌊' },
    pastel: { id: 'pastel', name: 'Şeker Pembe', bg: '#fff1f2', text: '#881337', accent: '#fb7185', secondary: '#ffe4e6', font: 'serif', type: 'light', icon: Heart },
    autumn: { id: 'autumn', name: 'Sonbahar', bg: '#451a03', text: '#fef3c7', accent: '#d97706', secondary: '#78350f', font: 'serif', type: 'dark', icon: Leaf, decorative: true, emoji: '🍁' }
};
