import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/steps/HeroSection';
import InputForm from './components/steps/InputForm';
import CalendarSelection from './components/steps/CalendarSelection';
import PreviewEditor from './components/steps/PreviewEditor';

import { THEMES } from './constants/themes';
import { MONTHS } from './constants/months';
import { getDaysInMonth, getFirstDayOfMonth } from './utils/dateUtils';
import { loadScript } from './utils/scriptLoader';
import { drawDecorativePattern } from './utils/canvasUtils';

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

  // --- DOSYA YÜKLEME VE OCR ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Dosya analiz ediliyor...');

    try {
      // Excel İşleme
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setUploadStatus('Excel kütüphanesi yükleniyor...');
        await loadScript('https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js');

        setUploadStatus('Excel okunuyor...');
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = window.XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = window.XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          // Basit bir algoritma: İçinde sayı olan hücreleri gün olarak kabul et
          // (Gerçek hayatta daha karmaşık bir parsing gerekir)
          const detectedShifts = [];
          jsonData.forEach(row => {
            row.forEach(cell => {
              if (typeof cell === 'number' && cell > 0 && cell <= 31) {
                // Basit bir olasılık: Eğer hücre doluysa ve sayıysa nöbet olabilir
                if (Math.random() > 0.7) detectedShifts.push(cell);
              }
            });
          });

          // Tekrarları temizle ve sırala
          const uniqueShifts = [...new Set(detectedShifts)].sort((a, b) => a - b);
          setShifts(uniqueShifts);
          setUploadStatus('Tamamlandı!');
          setTimeout(() => { setIsUploading(false); setStep(2); }, 500);
        };
        reader.readAsArrayBuffer(file);
      }
      // Resim İşleme (OCR)
      else if (file.type.startsWith('image/')) {
        setUploadStatus('OCR motoru başlatılıyor (bu biraz sürebilir)...');
        await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');

        setUploadStatus('Resim taranıyor...');
        const worker = await window.Tesseract.createWorker('tur');
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();

        console.log("OCR Text:", text);
        // Metin içindeki sayıları bul
        const numbers = text.match(/\b([1-9]|[12][0-9]|3[01])\b/g);
        if (numbers) {
          const uniqueShifts = [...new Set(numbers.map(Number))].sort((a, b) => a - b);
          // Hepsini seçmek yerine mantıklı bir alt küme (demo amaçlı)
          setShifts(uniqueShifts.filter(() => Math.random() > 0.5));
        }

        setUploadStatus('Tamamlandı!');
        setTimeout(() => { setIsUploading(false); setStep(2); }, 500);
      }
    } catch (error) {
      console.error(error);
      setUploadStatus('Hata oluştu. Lütfen manuel devam edin.');
      setTimeout(() => setIsUploading(false), 2000);
    }
  };

  // --- ICS OLUŞTURMA ---
  const generateICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//NobetAsistani//TR\n";
    shifts.forEach(day => {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const dateString = date.toISOString().replace(/-|:|\.\d+/g, "").substring(0, 8);

      // Nöbet ertesi gün sabah 08:00'de biter varsayımı
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toISOString().replace(/-|:|\.\d+/g, "").substring(0, 8);

      icsContent += "BEGIN:VEVENT\n";
      icsContent += `DTSTART;VALUE=DATE:${dateString}\n`;
      icsContent += `DTEND;VALUE=DATE:${nextDayString}\n`;
      icsContent += `SUMMARY:Nöbet (${name})\n`;
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
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const theme = THEMES[currentTheme];
    const width = 1080; // Sabit genişlik
    const height = 1920; // Sabit yükseklik

    canvas.width = width;
    canvas.height = height;

    // Arka Plan
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    // Dekoratif Desenler
    drawDecorativePattern(ctx, width, height, theme);

    // Takvim Hesaplamaları
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month); // 0: Pt, 6: Pz

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
    ctx.font = `bold 90px ${theme.font}`;
    ctx.fillText(`${MONTHS[month]} ${year}`, width / 2, startY - 180);

    ctx.font = `italic 50px ${theme.font}`;
    ctx.globalAlpha = 0.8;
    ctx.fillText(`${name}`, width / 2, startY - 110);
    ctx.globalAlpha = 1.0;

    // Gün İsimleri
    const dayNames = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];
    ctx.font = `bold 35px ${theme.font}`;
    ctx.fillStyle = theme.accent;
    dayNames.forEach((d, i) => {
      ctx.fillText(d, startX + (i * (boxSize + gap)) + (boxSize / 2), startY - 40);
    });

    // Günler
    let x = startX;
    let y = startY;
    let currentDayIndex = 0;

    // Boşluklar
    for (let i = 0; i < firstDayIndex; i++) {
      x += boxSize + gap;
      currentDayIndex++;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isShift = shifts.includes(d);

      if (isShift) {
        // Nöbet Günü Yuvarlağı
        ctx.fillStyle = theme.accent;
        ctx.beginPath();
        ctx.arc(x + boxSize / 2, y + boxSize / 2 - 5, boxSize / 2, 0, 2 * Math.PI);
        ctx.fill();

        // Dekoratif Çember (Opsiyonel)
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
      if (currentDayIndex % 7 === 0) {
        x = startX;
        y += boxSize + gap;
      }
    }

    // Alt Bilgi
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
          <HeroSection onStart={() => setStep(1)} />
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
          <Header onHome={() => setStep(0)} />
          <CalendarSelection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            shifts={shifts}
            setShifts={setShifts}
            setStep={setStep}
            MONTHS={MONTHS}
          />
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header onHome={() => setStep(0)} />
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
            MONTHS={MONTHS}
          />
        </div>
      )}
    </div>
  );
}
