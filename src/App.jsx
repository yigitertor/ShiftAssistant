import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/steps/HeroSection';
import InputForm from './components/steps/InputForm';
import CalendarSelection from './components/steps/CalendarSelection';
import PreviewEditor from './components/steps/PreviewEditor';

import { THEMES } from './constants/themes';
import { getDaysInMonth, getFirstDayOfMonth } from './utils/dateUtils';
import { loadScript } from './utils/scriptLoader';
import { drawDecorativePattern } from './utils/canvasUtils';
import { useLanguage } from './context/LanguageContext';

// Nöbet Tipleri Tanımları
const SHIFT_TYPES = {
  day: { id: 'day', label: 'Gündüz', color: '#f59e0b', icon: '☀️' }, // Amber
  night: { id: 'night', label: 'Gece', color: '#3b82f6', icon: '🌙' }, // Blue
  full: { id: 'full', label: '24 Saat', color: '#ef4444', icon: '🚨' } // Red
};

export default function App() {
  const { t, translations } = useLanguage();
  const MONTHS = translations.months;
  const DAYS = translations.days_short;

  // --- STATE ---
  // LocalStorage'dan başlangıç değerlerini al
  const getInitialState = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    return defaultValue;
  };

  const [step, setStep] = useState(() => getInitialState('step', 0));
  const [name, setName] = useState(() => getInitialState('name', ''));
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date objesi JSON'da string olur, o yüzden bunu direkt init ediyoruz
  // Shifts artık obje dizisi: { day: 1, type: 'night' }
  const [shifts, setShifts] = useState(() => getInitialState('shifts', []));
  const [currentTheme, setCurrentTheme] = useState(() => getInitialState('currentTheme', 'minimal'));

  // Yeni Özellikler State'leri
  const [customFont, setCustomFont] = useState('sans-serif');
  const [customBgImage, setCustomBgImage] = useState(null);
  const [darkMode, setDarkMode] = useState(() => getInitialState('darkMode', false));

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const canvasRef = useRef(null);

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('step', JSON.stringify(step)); }, [step]);
  useEffect(() => { localStorage.setItem('name', JSON.stringify(name)); }, [name]);
  useEffect(() => { localStorage.setItem('shifts', JSON.stringify(shifts)); }, [shifts]);
  useEffect(() => { localStorage.setItem('currentTheme', JSON.stringify(currentTheme)); }, [currentTheme]);
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);


  // --- DOSYA YÜKLEME VE OCR ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(t('input.status_analyzing'));

    try {
      // Excel İşleme
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setUploadStatus(t('input.status_loading_excel'));
        await loadScript('https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js');

        setUploadStatus(t('input.status_reading_excel'));
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = window.XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = window.XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          const detectedShifts = [];

          // İsim ile eşleşen satırı bul
          const targetName = name.trim().toLowerCase();
          let targetRow = null;

          // Tüm satırları gez
          for (let row of jsonData) {
            // Satırdaki hücreleri kontrol et
            const rowString = row.join(' ').toLowerCase();
            if (rowString.includes(targetName)) {
              targetRow = row;
              break;
            }
          }

          if (targetRow) {
            targetRow.forEach(cell => {
              if (typeof cell === 'number' && cell > 0 && cell <= 31) {
                detectedShifts.push({ day: cell, type: 'night' }); // Varsayılan Gece
              } else if (typeof cell === 'string') {
                // Bazen sayılar string olarak gelebilir "1", "2" vb.
                const num = parseInt(cell);
                if (!isNaN(num) && num > 0 && num <= 31) {
                  detectedShifts.push({ day: num, type: 'night' });
                }
              }
            });
          } else {
            alert(t('input.error_name_not_found'));
          }

          // Tekrarları temizle (Basitçe gün numarasına göre)
          const uniqueShifts = Array.from(new Set(detectedShifts.map(s => s.day)))
            .map(day => {
              return detectedShifts.find(s => s.day === day);
            }).sort((a, b) => a.day - b.day);

          setShifts(uniqueShifts);
          setUploadStatus(t('input.status_complete'));
          setTimeout(() => { setIsUploading(false); setStep(2); }, 500);
        };
        reader.readAsArrayBuffer(file);
      }
      // Resim İşleme (Gemini AI)
      else if (file.type.startsWith('image/')) {
        setUploadStatus(t('input.status_scanning')); // "Resim taranıyor..."

        // Resmi Base64'e çevir
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target.result;
          console.log("Starting image analysis...");

          try {
            // 15 saniyelik zaman aşımı (timeout)
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Request timed out (15s)")), 15000)
            );

            // Netlify Function'a istek at
            const fetchPromise = fetch('/.netlify/functions/analyze-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: base64Image, name: name })
            });

            console.log("Sending request to /.netlify/functions/analyze-image");
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            console.log("Response received:", response.status, response.statusText);

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              // JSON dönmediyse (örn: 404 sayfası, 500 hatası vb.)
              const text = await response.text();
              console.error("Non-JSON response:", text);
              throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || data.details || 'API Error');
            }

            if (data.shifts && Array.isArray(data.shifts)) {
              console.log("Shifts found:", data.shifts);
              const newShifts = data.shifts.map(day => ({ day, type: 'night' }));
              setShifts(newShifts);
              setUploadStatus(t('input.status_complete'));
              setTimeout(() => { setIsUploading(false); setStep(2); }, 500);
            } else {
              throw new Error('Invalid response format: shifts array missing');
            }

          } catch (error) {
            console.error("OCR Error:", error);
            // Hata mesajını kullanıcıya göster
            const errorMessage = error.message || "Unknown Error";
            alert(`${t('input.status_error')}\nDetay: ${errorMessage}`);

            // Ekranda da hatayı göster
            setUploadStatus(`Hata: ${errorMessage}`);

            // Mesajın okunabilmesi için süreyi uzat (5 saniye)
            setTimeout(() => setIsUploading(false), 5000);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error(error);
      setUploadStatus(t('input.status_error'));
      setTimeout(() => setIsUploading(false), 2000);
    }
  };

  // --- ICS OLUŞTURMA ---
  const generateICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//NobetAsistani//TR\n";
    shifts.forEach(shift => {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), shift.day);
      const dateString = date.toISOString().replace(/-|:|\.\d+/g, "").substring(0, 8);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toISOString().replace(/-|:|\.\d+/g, "").substring(0, 8);

      icsContent += "BEGIN:VEVENT\n";
      icsContent += `DTSTART;VALUE=DATE:${dateString}\n`;
      icsContent += `DTEND;VALUE=DATE:${nextDayString}\n`;
      icsContent += `SUMMARY:Nöbet (${SHIFT_TYPES[shift.type].label}) - ${name}\n`;
      icsContent += "END:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "nobetler.ics";
    link.click();
  };

  // --- CANVAS ÇİZİM ---
  const drawCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const theme = THEMES[currentTheme];
    const width = 1080;
    const height = 1920;

    canvas.width = width;
    canvas.height = height;

    // Arka Plan (Özel Resim veya Tema Rengi)
    if (customBgImage) {
      const img = new Image();
      img.src = customBgImage;
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          // Okunabilirlik için overlay
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.fillRect(0, 0, width, height);
          resolve();
        };
        img.onerror = resolve; // Hata olsa da devam et
      });
    } else {
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);
      drawDecorativePattern(ctx, width, height, theme);
    }

    // Font Ayarı
    const fontName = customFont || theme.font;

    // Takvim Hesaplamaları
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const boxSize = 110;
    const gap = 20;
    const calendarWidth = (7 * boxSize) + (6 * gap);
    const numRows = Math.ceil((firstDayIndex + daysInMonth) / 7);
    const calendarHeight = (numRows * boxSize) + ((numRows - 1) * gap) + 60;

    const startX = (width - calendarWidth) / 2;
    const startY = (height - calendarHeight) / 2 + 250;

    // Başlıklar
    ctx.fillStyle = theme.text;
    ctx.textAlign = 'center';
    ctx.font = `bold 90px ${fontName}`;
    ctx.fillText(`${MONTHS[month]} ${year}`, width / 2, startY - 180);

    ctx.font = `italic 50px ${fontName}`;
    ctx.globalAlpha = 0.8;
    ctx.fillText(`${name}`, width / 2, startY - 110);
    ctx.globalAlpha = 1.0;

    // Gün İsimleri
    const dayNames = DAYS;
    ctx.font = `bold 35px ${fontName}`;
    ctx.fillStyle = theme.accent;
    dayNames.forEach((d, i) => {
      ctx.fillText(d, startX + (i * (boxSize + gap)) + (boxSize / 2), startY - 40);
    });

    // Günler
    let x = startX;
    let y = startY;
    let currentDayIndex = 0;

    for (let i = 0; i < firstDayIndex; i++) { x += boxSize + gap; currentDayIndex++; }

    for (let d = 1; d <= daysInMonth; d++) {
      const shift = shifts.find(s => s.day === d);

      if (shift) {
        // Nöbet Tipine Göre Renk
        const shiftColor = SHIFT_TYPES[shift.type].color;

        ctx.fillStyle = shiftColor;
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

        ctx.fillStyle = '#ffffff'; // Nöbet günleri her zaman beyaz yazı (renkli top üstünde)
      } else {
        ctx.fillStyle = theme.text;
      }

      ctx.font = shift ? `bold 45px ${fontName}` : `40px ${fontName}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(d, x + boxSize / 2, y + boxSize / 2);

      x += boxSize + gap;
      currentDayIndex++;
      if (currentDayIndex % 7 === 0) { x = startX; y += boxSize + gap; }
    }

    // Alt Bilgi
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = theme.text;
    ctx.font = `40px ${fontName}`;
    ctx.globalAlpha = 0.7;
    const bottomY = startY + (Math.ceil((firstDayIndex + daysInMonth) / 7) * (boxSize + gap)) + 60;
    ctx.fillText(`${shifts.length} ${t('preview.shift_planned')}`, width / 2, bottomY);

    if (theme.decorative && !customBgImage) {
      ctx.font = `30px ${fontName}`;
      ctx.fillText(theme.emoji + " " + t('preview.good_luck') + " " + theme.emoji, width / 2, bottomY + 50);
    }

    setPreviewUrl(canvas.toDataURL());
  };

  const downloadWallpaper = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${t('preview.generated_filename')}_${name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  useEffect(() => {
    if (step >= 3) {
      // Async draw
      drawCanvas();
    }
  }, [step, currentTheme, shifts, name, selectedDate, translations, customFont, customBgImage]);

  // --- SAYFA RENDER LOGIC ---

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {step === 0 && (
        <>
          <Header onHome={() => setStep(0)} darkMode={darkMode} setDarkMode={setDarkMode} />
          <HeroSection onStart={() => setStep(1)} />
          <Footer />
        </>
      )}

      {step === 1 && (
        <InputForm
          name={name}
          setName={setName}
          setStep={setStep}
          handleFileUpload={handleFileUpload}
          isUploading={isUploading}
          uploadStatus={uploadStatus}
        />
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col h-screen">
          <Header onHome={() => setStep(0)} darkMode={darkMode} setDarkMode={setDarkMode} />
          <CalendarSelection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            shifts={shifts}
            setShifts={setShifts}
            setStep={setStep}
            SHIFT_TYPES={SHIFT_TYPES}
          />
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header onHome={() => setStep(0)} darkMode={darkMode} setDarkMode={setDarkMode} />
          <PreviewEditor
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
            THEMES={THEMES}
            downloadWallpaper={downloadWallpaper}
            generateICS={generateICS}
            previewUrl={previewUrl}
            canvasRef={canvasRef}
            setStep={setStep}
            selectedDate={selectedDate}
            customFont={customFont}
            setCustomFont={setCustomFont}
            setCustomBgImage={setCustomBgImage}
          />
        </div>
      )}
    </div>
  );
}
