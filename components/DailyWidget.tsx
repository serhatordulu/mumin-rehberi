
import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Share2 } from './Icons';
import { Share } from '@capacitor/share';

const QUOTES = [
  { text: "Şüphesiz güçlükle beraber bir kolaylık vardır.", source: "İnşirah Suresi, 5. Ayet" },
  { text: "İki günü eşit olan ziyandadır.", source: "Hadis-i Şerif" },
  { text: "Allah sabredenlerle beraberdir.", source: "Bakara Suresi, 153. Ayet" },
  { text: "Merhamet etmeyene merhamet olunmaz.", source: "Hadis-i Şerif" },
  { text: "Dua müminin silahıdır.", source: "Hadis-i Şerif" },
  { text: "Rabbinin nimetini durmadan anlat.", source: "Duha Suresi, 11. Ayet" },
  { text: "Güzel söz sadakadır.", source: "Hadis-i Şerif" },
  { text: "Namaz, müminin miracıdır.", source: "Hadis-i Şerif" },
  { text: "Veren el, alan elden üstündür.", source: "Hadis-i Şerif" },
  { text: "Kınamayınız, kınadığınız şey başınıza gelmedikçe ölmezsiniz.", source: "Hadis-i Şerif" }
];

export const DailyWidget: React.FC = () => {
  const [hijriDate, setHijriDate] = useState("");
  const [quote, setQuote] = useState(QUOTES[0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Hicri Tarih Hesaplama (Intl API kullanarak)
    try {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        calendar: 'islamic-umalqura'
      } as any;
      
      const formatter = new Intl.DateTimeFormat('tr-TR-u-ca-islamic', options);
      
      // Format çıktısında "AH", "Hicri", "MÖ" gibi ibareler varsa temizleyelim
      // Android WebView bazen "MÖ" veya "-" değeri dönebiliyor, bunu düzeltiyoruz.
      const formattedDate = formatter.format(date)
          .replace(/AH|Hicri|MÖ|MS/gi, '')
          .replace(/-/g, '')
          .replace(/^\s+/, '') // Baştaki boşluğu sil
          .replace(/\s+$/, ''); // Sondaki boşluğu sil

      setHijriDate(formattedDate);
    } catch (e) {
      setHijriDate("");
    }

    // 2. Günün Sözünü Seç (Güne göre sabit kalması için tarih bazlı index)
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % QUOTES.length;
    setQuote(QUOTES[quoteIndex]);
  }, []);

  const handleShare = async () => {
    const text = `"${quote.text}" - ${quote.source}\n\n📍 Mümin Rehberi`;
    
    try {
        await Share.share({
            title: 'Günün Hikmeti',
            text: text,
            dialogTitle: 'Paylaş',
        });
    } catch (e) {
        // Fallback
        if (navigator.share) {
             try {
                await navigator.share({ title: 'Günün Hikmeti', text: text });
             } catch (err) {}
        } else {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            if (navigator.vibrate) navigator.vibrate(50);
        }
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm relative overflow-hidden group transition-colors duration-300">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Sparkles size={80} className="text-amber-500" />
      </div>

      <div className="flex flex-col space-y-3 relative z-10">
        
        {/* Header: Hijri Date */}
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-500">
          <Calendar size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Hicri Takvim</span>
        </div>
        
        <h3 className="text-lg font-serif font-medium text-slate-900 dark:text-white capitalize">
          {hijriDate || "Yükleniyor..."}
        </h3>

        {/* Divider */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-1"></div>

        {/* Quote Content */}
        <div className="pt-1">
          <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed mb-2">
            "{quote.text}"
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md border border-amber-100 dark:border-amber-800">
              {quote.source}
            </span>
            
            <button 
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors active:scale-90"
              title="Paylaş"
            >
              {copied ? <span className="text-emerald-500 text-xs font-bold">Kopyalandı</span> : <Share2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
