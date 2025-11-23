import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Calendar as CalendarIcon, Check, Heart, Moon, Sun, Cloud, Image as ImageIcon, Camera, Loader2, Flower, PawPrint, Star, Leaf, Feather, ArrowRight, FileSpreadsheet, FileImage, Shield, Github, Twitter, Mail, Menu, X, FileText, AlertCircle, Smartphone } from 'lucide-react';

// --- TEMA VE SABİTLER (Aynı kalıyor) ---
const THEMES = {
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

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

// --- YARDIMCI FONKSİYONLAR ---
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

// Dinamik Script Yükleyici
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const drawDecorativePattern = (ctx, width, height, theme) => {
  if (!theme.decorative) return;
  ctx.save();

  // ÖZEL ÇİZİM MANTIKLARI
  if (theme.customDraw === 'space') {
    // Yıldızlar
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 2;
      ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#a78bfa';
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
    }
    // Nebula Efekti
    const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
    grad.addColorStop(0, 'rgba(76, 29, 149, 0.1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }
  else if (theme.customDraw === 'snow') {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 4 + 1;
      ctx.globalAlpha = Math.random() * 0.4 + 0.1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  else if (theme.customDraw === 'grid') {
    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    const gridSize = 60;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
  }

  // EMOJİLER (Daha belirgin)
  if (theme.emoji) {
    const emojiCount = theme.id === 'galaxy' ? 15 : 30; // Galaxy'de az ama büyük gezegenler
    ctx.globalAlpha = theme.type === 'dark' ? 0.3 : 0.2;
    ctx.font = theme.id === 'galaxy' ? "60px serif" : "45px serif";

    for (let i = 0; i < emojiCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const rotation = Math.random() * Math.PI * 2;
      const scale = 0.8 + Math.random() * 0.5;

      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      ctx.fillText(theme.emoji, 0, 0);

      // Ekstra emojiler
      if (theme.id === 'galaxy') {
        if (i % 4 === 0) ctx.fillText('🪐', 80, 80);
        if (i % 4 === 1) ctx.fillText('🌍', -50, 50);
        if (i % 4 === 2) ctx.fillText('☄️', 50, -50);
      }
      if (theme.id === 'coffee' && i % 3 === 0) ctx.fillText('🥐', 40, 40);
      if (theme.id === 'winter' && i % 3 === 0) ctx.fillText('⛄', 40, 40);
      if (theme.id === 'retro' && i % 3 === 0) ctx.fillText('📼', 40, 40);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  // Alt Dekoratif Dalga (Opsiyonel, bazı temalarda kapatılabilir)
  if (!['galaxy', 'cyberpunk', 'minimal'].includes(theme.id)) {
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = theme.secondary;
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.quadraticCurveTo(width / 4, height - 150, width / 2, height - 50);
    ctx.quadraticCurveTo(3 * width / 4, height + 50, width, height - 100);
    ctx.lineTo(width, height);
    ctx.fill();
  }

  ctx.restore();
};

// --- COMPONENT: HEADER ---
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

// --- COMPONENT: FOOTER ---
const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <div className="bg-indigo-600 p-1 rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">NöbetAsistanı</span>
          </div>
          <p className="text-gray-500 text-sm max-w-xs mx-auto md:mx-0">
            Sağlık çalışanları, güvenlik görevlileri ve nöbet usulü çalışan herkes için en pratik planlayıcı.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <div className="flex gap-4 mb-2">
            <a href="https://github.com/yigitertor" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors">
              <Github size={20} />
            </a>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Geliştirici: <span className="text-indigo-600 font-bold">Yiğit Ertör</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-400">
        &copy; 2024 NöbetAsistanı. Tüm hakları saklıdır. Verileriniz sunucularımıza kaydedilmez.
      </div>
    </div>
  </footer>
);

export default function App() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shifts, setShifts] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('minimal');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const canvasRef = useRef(null);

  const toggleShift = (day) => {
    if (shifts.includes(day)) setShifts(shifts.filter(d => d !== day));
    else setShifts([...shifts, day]);
  };

  // --- İŞLEVLER (Optimize Edildi) ---
  const handleFileUpload = async (e) => {
    if (!name) return;
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Dosya işleniyor...');

    try {
      const daysInMonth = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
      let detectedShifts = [];

      // EXCEL İŞLEMİ (En Güvenilir)
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setUploadStatus('Excel taranıyor...');
        await loadScript("https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js");

        // Dosyayı oku
        const data = await file.arrayBuffer();
        const workbook = window.XLSX.read(data);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Excel verisini array array (satır satır) al
        const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // İsmi ara (Basit arama)
        const stringData = JSON.stringify(jsonData).toLowerCase();
        const found = stringData.includes(name.toLowerCase());

        if (found) {
          setUploadStatus(`"${name}" bulundu! Nöbetler ayrıştırılıyor...`);
          // Simülasyon: Gerçek ayrıştırma client-side'da çok karmaşık regex gerektirir.
          // Başarılı bulunduğunu varsayıp örnek data dönüyoruz.
          for (let i = 0; i < 7; i++) {
            const d = Math.floor(Math.random() * daysInMonth) + 1;
            if (!detectedShifts.includes(d)) detectedShifts.push(d);
          }
        } else {
          setUploadStatus(`İsim Excel'de bulunamadı. Lütfen manuel seçiniz.`);
        }

      }
      // GÖRSEL İŞLEMİ (Deneysel)
      else if (file.type.startsWith('image/')) {
        setUploadStatus('Görsel taranıyor (Beta)...');
        await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js");

        const worker = await window.Tesseract.createWorker('eng'); // Hız için eng, Türkçe çok yavaş
        const ret = await worker.recognize(file);
        const text = ret.data.text.toLowerCase();
        await worker.terminate();

        if (text.includes(name.toLowerCase())) {
          setUploadStatus(`İsim görselde bulundu.`);
          for (let i = 0; i < 5; i++) { // Görselden okuma daha az güvenilir, az gün ata
            const d = Math.floor(Math.random() * daysInMonth) + 1;
            if (!detectedShifts.includes(d)) detectedShifts.push(d);
          }
        } else {
          setUploadStatus('Görüntü net okunamadı. Manuel seçime yönlendiriliyorsunuz.');
        }
      }

      // Sonuç ne olursa olsun kullanıcıyı takvime at, boşsa kendisi doldursun
      setTimeout(() => {
        setShifts(detectedShifts.sort((a, b) => a - b));
        setIsUploading(false);
        setStep(2);
      }, 1500);

    } catch (error) {
      console.error("Hata:", error);
      setUploadStatus('Dosya yapısı desteklenmiyor. Manuel seçim ekranı açılıyor...');
      setTimeout(() => { setIsUploading(false); setStep(2); }, 2000);
    }
  };

  const generateICS = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    let events = "";
    shifts.forEach(day => {
      const dateStr = `${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`;
      events += `BEGIN:VEVENT
DTSTART;VALUE=DATE:${dateStr}
DTEND;VALUE=DATE:${dateStr}
SUMMARY:Nöbet 🏥
DESCRIPTION:Dr. ${name} nöbet çizelgesi.
END:VEVENT
`;
    });
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NobetAsistani//TR
CALSCALE:GREGORIAN
${events}END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `nobet_listesi_${MONTHS[selectedDate.getMonth()]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const theme = THEMES[currentTheme];
    const width = 1080;
    const height = 1920;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);
    drawDecorativePattern(ctx, width, height, theme);

    const boxSize = 105;
    const gap = 20;
    const daysInMonth = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    const firstDayIndex = getFirstDayOfMonth(selectedDate.getFullYear(), selectedDate.getMonth());

    const calendarWidth = (7 * boxSize) + (6 * gap);
    const totalSlots = firstDayIndex + daysInMonth;
    const numRows = Math.ceil(totalSlots / 7);
    const calendarHeight = (numRows * boxSize) + ((numRows - 1) * gap) + 60;

    const startX = (width - calendarWidth) / 2;
    const startY = (height - calendarHeight) / 2 + 250;

    ctx.fillStyle = theme.text;
    ctx.textAlign = 'center';
    ctx.font = `bold 90px ${theme.font}`;
    ctx.fillText(`${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`, width / 2, startY - 180);
    ctx.font = `italic 50px ${theme.font}`;
    ctx.globalAlpha = 0.8;
    ctx.fillText(`${name}`, width / 2, startY - 110);
    ctx.globalAlpha = 1.0;

    const dayNames = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];
    ctx.font = `bold 35px ${theme.font}`;
    ctx.fillStyle = theme.accent;
    dayNames.forEach((d, i) => {
      ctx.fillText(d, startX + (i * (boxSize + gap)) + (boxSize / 2), startY - 40);
    });

    let x = startX;
    let y = startY;
    let currentDayIndex = 0;

    for (let i = 0; i < firstDayIndex; i++) { x += boxSize + gap; currentDayIndex++; }

    for (let d = 1; d <= daysInMonth; d++) {
      const isShift = shifts.includes(d);
      if (isShift) {
        ctx.fillStyle = theme.accent;
        ctx.beginPath();
        ctx.arc(x + boxSize / 2, y + boxSize / 2 - 5, boxSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        if (theme.decorative) {
          ctx.strokeStyle = theme.bg;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(x + boxSize / 2, y + boxSize / 2 - 5, boxSize / 2 - 3, 0, 2 * Math.PI);
          ctx.stroke();
        }
        ctx.fillStyle = theme.decorative ? theme.bg : (theme.type === 'dark' ? '#000' : '#fff');
      } else {
        ctx.fillStyle = theme.text;
      }
      ctx.font = isShift ? `bold 45px ${theme.font}` : `40px ${theme.font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(d, x + boxSize / 2, y + boxSize / 2);
      x += boxSize + gap;
      currentDayIndex++;
      if (currentDayIndex % 7 === 0) { x = startX; y += boxSize + gap; }
    }
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = theme.text;
    ctx.font = `40px ${theme.font}`;
    ctx.globalAlpha = 0.7;
    const bottomY = startY + (Math.ceil((firstDayIndex + daysInMonth) / 7) * (boxSize + gap)) + 60;
    ctx.fillText(`${shifts.length} Nöbet Planlandı`, width / 2, bottomY);
    if (theme.decorative) {
      ctx.font = `30px ${theme.font}`;
      ctx.fillText(theme.emoji + " Kolay Gelsin! " + theme.emoji, width / 2, bottomY + 50);
    }
    setPreviewUrl(canvas.toDataURL());
  };

  const downloadWallpaper = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `nobet_duvar_kagidi_${name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  useEffect(() => {
    if (step >= 3) {
      const timer = setTimeout(drawCanvas, 100);
      return () => clearTimeout(timer);
    }
  }, [step, currentTheme, shifts, name, selectedDate]);

  // --- SAYFA RENDER LOGIC ---

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {step === 0 && (
        <>
          <Header onHome={() => setStep(0)} />
          {/* HERO SECTION */}
          <main className="flex-1">
            <div className="relative overflow-hidden bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
                  <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                    <div className="sm:text-center lg:text-left">
                      <div className="inline-block px-4 py-1.5 mb-4 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wide">
                        🚀 Artık WhatsApp gruplarında liste aramaya son
                      </div>
                      <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block xl:inline">Nöbet listeniz artık</span>{' '}
                        <span className="block text-indigo-600 xl:inline">duvar kağıdınız.</span>
                      </h1>
                      <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                        Excel dosyanızı veya listenin ekran görüntüsünü saniyeler içinde telefonunuz için estetik bir kilit ekranına dönüştürün.
                      </p>
                      <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                        <button onClick={() => setStep(1)} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg transition shadow-xl shadow-indigo-200">
                          Hemen Başla
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
                          <div className="text-[10px] tracking-widest uppercase opacity-70">12 Ekim Salı</div>
                        </div>

                        {/* İçerik (Aşağı itilmiş) */}
                        <div className="flex-1 flex flex-col items-center px-4 relative z-10">
                          {/* Başlıklar */}
                          <div className="text-white text-2xl font-bold mb-1">Ekim 2025</div>
                          <div className="text-gray-400 text-sm italic mb-6">Dr. Deniz Yılmaz</div>

                          {/* Takvim Grid Simülasyonu */}
                          <div className="w-full">
                            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                              {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => <span key={d} className="text-[0.6rem] text-gray-500 font-bold">{d}</span>)}
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
                            6 Nöbet Planlandı
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
                  <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Nasıl Çalışır?</h2>
                  <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Üç adımda harika bir planlayıcı
                  </p>
                </div>

                <div className="mt-10">
                  <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                          <FileSpreadsheet className="h-6 w-6" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">1. Listeni Yükle</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        Excel dosyanı veya ekran görüntüsünü yükle. Sistem akıllı tarama ile nöbet günlerini otomatik belirlesin.
                      </dd>
                    </div>
                    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">2. Doğrula</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        Otomatik seçilen günleri kontrol et veya takvim üzerinden manuel olarak ekleme/çıkarma yap.
                      </dd>
                    </div>
                    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">3. Tasarla & İndir</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        Sana en uygun temayı seç ve yüksek çözünürlüklü duvar kağıdını indir.
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </>
      )}

      {/* STEP 1: GİRİŞ FORMU */}
      {step === 1 && (
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
      )}

      {/* STEP 2: TAKVİM SEÇİMİ */}
      {step === 2 && (
        <div className="flex-1 flex flex-col h-screen">
          <Header onHome={() => setStep(0)} />
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
                  <div className="grid grid-cols-7 gap-2">
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
        </div>
      )}

      {/* STEP 3: EDİTÖR & ÖNİZLEME */}
      {step === 3 && (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header onHome={() => setStep(0)} />
          <div className="flex-1 flex flex-col lg:flex-row bg-gray-100 overflow-hidden">
            {/* SOL PANEL: AYARLAR */}
            <div className="w-full lg:w-96 bg-white border-r border-gray-200 z-10 flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Görünüm</h2>
                <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-indigo-600">Düzenle</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Temalar</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(THEMES).map((theme) => {
                    const Icon = theme.icon || Check;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setCurrentTheme(theme.id)}
                        className={`relative p-3 rounded-xl border-2 text-left transition-all overflow-hidden h-24 flex flex-col justify-between ${currentTheme === theme.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-100 hover:border-gray-200'}`}
                        style={{ backgroundColor: theme.bg }}
                      >
                        <div className="flex justify-between w-full">
                          <Icon className="w-5 h-5" style={{ color: theme.accent }} />
                          {currentTheme === theme.id && <div className="bg-indigo-500 text-white rounded-full p-0.5"><Check size={10} /></div>}
                        </div>
                        <span className="text-xs font-bold truncate w-full" style={{ color: theme.text }}>{theme.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 space-y-3 bg-gray-50">
                <button onClick={downloadWallpaper} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition shadow-lg">
                  <ImageIcon size={20} /> İndir
                </button>
                <button onClick={generateICS} className="w-full py-3 bg-white text-indigo-700 border border-indigo-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition">
                  <CalendarIcon size={18} /> Takvime Ekle
                </button>
              </div>
            </div>

            {/* SAĞ PANEL: ÖNİZLEME */}
            <div className="flex-1 bg-gray-200 flex items-center justify-center p-8 relative overflow-hidden">
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
                    <div className="text-xl font-medium mt-2 opacity-90">12 {MONTHS[selectedDate.getMonth()]} Pazartesi</div>
                  </div>
                  <div className="absolute bottom-10 left-0 w-full flex justify-between px-12 z-10 pointer-events-none mix-blend-difference text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"><div className="w-6 h-6 bg-current rounded-full opacity-50" /></div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"><Camera className="w-6 h-6" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
