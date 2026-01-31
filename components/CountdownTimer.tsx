
import React, { useEffect, useState, memo, useMemo } from 'react';
import { PrayerTimeData } from '../types';
import { RefreshCcw, MapPin, ChevronDown, Moon, Sun, CloudMoon, CloudSun, Clock } from './Icons';

interface CountdownTimerProps {
    times: PrayerTimeData | null;
    nextDayImsak: string | null;
    locationName: string;
    isLocationRefreshing: boolean;
    onRefreshLocation: () => void;
    onLocationClick: () => void;
}

type TimePhase = 'night' | 'dawn' | 'day' | 'dusk';

export const CountdownTimer = memo(({ 
    times, 
    nextDayImsak, 
    locationName, 
    isLocationRefreshing, 
    onRefreshLocation, 
    onLocationClick 
}: CountdownTimerProps) => {
    
    const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
    const [nextPrayerName, setNextPrayerName] = useState("");
    const [progress, setProgress] = useState(0); 
    const [timePhase, setTimePhase] = useState<TimePhase>('day');

    // Zaman stringini (HH:MM) bugünün Date objesine çevirir
    const createDateToday = (timeStr: string) => {
        if (!timeStr) return new Date();
        const [h, m] = timeStr.split(' ')[0].split(':').map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        return date;
    };

    // Zaman stringini (HH:MM) yarının Date objesine çevirir
    const createDateTomorrow = (timeStr: string) => {
        if (!timeStr) return new Date();
        const [h, m] = timeStr.split(' ')[0].split(':').map(Number);
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(h, m, 0, 0);
        return date;
    };

    // Zaman stringini (HH:MM) dünün Date objesine çevirir (İlerleme çubuğu hesabı için)
    const createDateYesterday = (timeStr: string) => {
        if (!timeStr) return new Date();
        const [h, m] = timeStr.split(' ')[0].split(':').map(Number);
        const date = new Date();
        date.setDate(date.getDate() - 1);
        date.setHours(h, m, 0, 0);
        return date;
    };

    useEffect(() => {
        if (!times) return;

        const timer = setInterval(() => {
            const now = new Date();
            const nowMs = now.getTime();

            // Tüm vakitleri Date objesi olarak hazırla
            const prayerPoints = [
                { name: 'İmsak', date: createDateToday(times.Imsak) },
                { name: 'Güneş', date: createDateToday(times.Sunrise) },
                { name: 'Öğle', date: createDateToday(times.Dhuhr) },
                { name: 'İkindi', date: createDateToday(times.Asr) },
                { name: 'Akşam', date: createDateToday(times.Maghrib) },
                { name: 'Yatsı', date: createDateToday(times.Isha) },
                // Döngü için yarının İmsak vakti
                { name: 'İmsak (Yarın)', date: createDateTomorrow(nextDayImsak || times.Imsak) }
            ];

            // Tema Belirleme (Basit saat kontrolü yerine Date karşılaştırması)
            if (now < prayerPoints[1].date) setTimePhase('dawn'); // Güneş doğuşundan önce
            else if (now < prayerPoints[4].date) setTimePhase('day'); // Akşamdan önce
            else if (now < prayerPoints[5].date) setTimePhase('dusk'); // Yatsıdan önce
            else setTimePhase('night'); // Gece

            // Sıradaki vakti bul
            let nextIdx = prayerPoints.findIndex(p => p.date.getTime() > nowMs);
            
            // Eğer bugün tüm vakitler geçtiyse (Yatsı sonrası), sıradaki yarın İmsak'tır.
            if (nextIdx === -1) {
                nextIdx = 6; // Yarın İmsak indexi
            }

            const targetPrayer = prayerPoints[nextIdx];
            // Önceki vakit (Progress bar başlangıcı için)
            // Eğer nextIdx 0 (Bugün İmsak) ise, önceki vakit Dün Yatsı'dır.
            let prevPrayerTimeMs;
            if (nextIdx === 0) {
                prevPrayerTimeMs = createDateYesterday(times.Isha).getTime();
            } else {
                prevPrayerTimeMs = prayerPoints[nextIdx - 1].date.getTime();
            }

            const diffMs = targetPrayer.date.getTime() - nowMs;
            
            // Geri Sayım Hesaplama
            if (diffMs > 0) {
                const h = Math.floor(diffMs / (1000 * 60 * 60));
                const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diffMs % (1000 * 60)) / 1000);

                setTimeLeft({
                    h: h < 10 ? '0' + h : '' + h,
                    m: m < 10 ? '0' + m : '' + m,
                    s: s < 10 ? '0' + s : '' + s
                });
                setNextPrayerName(targetPrayer.name);

                // Progress Bar Hesaplama
                const totalDuration = targetPrayer.date.getTime() - prevPrayerTimeMs;
                const elapsed = nowMs - prevPrayerTimeMs;
                const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                setProgress(percentage);
            } else {
                // Tam vakit anı
                setTimeLeft({ h: '00', m: '00', s: '00' });
                setNextPrayerName("Vakit Girdi");
                setProgress(100);
            }

        }, 1000);

        return () => clearInterval(timer);
    }, [times, nextDayImsak]);

    const getThemeStyles = () => {
        switch (timePhase) {
            case 'night':
                return {
                    gradient: 'bg-gradient-to-b from-slate-950 via-[#0B1026] to-[#1E1B4B]',
                    icon: <Moon size={80} fill="currentColor" className="text-amber-100 drop-shadow-[0_0_25px_rgba(255,251,235,0.4)] opacity-90" />,
                    textColor: 'text-indigo-50',
                    subTextColor: 'text-indigo-300',
                    progressColor: 'bg-indigo-300',
                    shadowColor: 'shadow-indigo-500/30',
                    isNight: true
                };
            case 'dawn':
                return {
                    gradient: 'bg-gradient-to-br from-indigo-700 via-purple-600 to-orange-500',
                    icon: <CloudMoon size={80} className="text-orange-200 opacity-80" />,
                    textColor: 'text-white',
                    subTextColor: 'text-orange-100',
                    progressColor: 'bg-orange-300',
                    shadowColor: 'shadow-orange-500/30',
                    isNight: false
                };
            case 'day':
                return {
                    gradient: 'bg-gradient-to-br from-sky-400 to-blue-600',
                    icon: <Sun size={80} className="text-yellow-300 opacity-80" />,
                    textColor: 'text-white',
                    subTextColor: 'text-sky-100',
                    progressColor: 'bg-white',
                    shadowColor: 'shadow-blue-500/30',
                    isNight: false
                };
            case 'dusk':
                return {
                    gradient: 'bg-gradient-to-br from-orange-500 via-red-600 to-purple-800',
                    icon: <CloudSun size={80} className="text-orange-200 opacity-80" />,
                    textColor: 'text-white',
                    subTextColor: 'text-orange-100',
                    progressColor: 'bg-orange-200',
                    shadowColor: 'shadow-red-500/30',
                    isNight: false
                };
            default:
                return {
                    gradient: 'bg-gradient-to-br from-emerald-600 to-emerald-800',
                    icon: <Clock size={80} className="opacity-50" />,
                    textColor: 'text-white',
                    subTextColor: 'text-emerald-100',
                    progressColor: 'bg-emerald-400',
                    shadowColor: 'shadow-emerald-500/30',
                    isNight: false
                };
        }
    };

    const theme = getThemeStyles();

    return (
        <div className={`${theme.gradient} animate-mesh rounded-3xl p-4 sm:p-6 text-white shadow-xl ${theme.shadowColor} relative overflow-hidden transition-all duration-1000 min-h-[200px] flex flex-col justify-between group animate-fade-in border border-white/10 shrink-0`}>
            
            {theme.isNight && (
                <div className="absolute inset-0 pointer-events-none opacity-60">
                    <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></div>
                    <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-150"></div>
                </div>
            )}

            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform duration-1000 transform group-hover:scale-110 pointer-events-none scale-75 sm:scale-100 animate-float">
                {theme.icon}
            </div>
            
            {/* Üst Kısım: Konum ve Başlık */}
            <div className="flex justify-between items-start z-20 mb-2">
                <div className="flex items-center space-x-2">
                    <button onClick={onLocationClick} className="flex items-center space-x-2 text-white/90 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md hover:bg-black/30 active:scale-95 transition-all border border-white/10">
                        <MapPin size={12} className="shrink-0" />
                        <span className="text-xs font-medium truncate max-w-[120px]">{locationName}</span>
                        <ChevronDown size={10} className="ml-1 opacity-50 shrink-0" />
                    </button>
                    <button onClick={onRefreshLocation} disabled={isLocationRefreshing} className={`p-1.5 rounded-full bg-black/20 text-white/90 hover:bg-black/30 backdrop-blur-md transition-all active:scale-90 border border-white/10 ${isLocationRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <RefreshCcw size={14} className={isLocationRefreshing ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Orta Kısım: Vakit Bilgisi */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-2 sm:space-y-4 flex-1">
                <div>
                    <span className={`${theme.subTextColor} text-[10px] sm:text-[11px] font-bold uppercase tracking-widest opacity-90`}>Sıradaki Vakit</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md mt-0.5 tracking-tight">{nextPrayerName || "--"}</h2>
                </div>

                {/* Yeni Kartlı Sayaç Tasarımı - Glassmorphism */}
                <div className="flex items-center gap-1.5 sm:gap-3">
                    <div className={`flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20 min-w-[55px] sm:min-w-[70px] shadow-lg`}>
                        <span className="text-2xl sm:text-4xl font-bold tracking-tight tabular-nums leading-none drop-shadow-sm">{timeLeft.h}</span>
                        <span className="text-[10px] sm:text-[12px] font-bold opacity-80 mt-1 uppercase tracking-wide">Saat</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold opacity-50 pb-4 animate-pulse">:</span>
                    <div className={`flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20 min-w-[55px] sm:min-w-[70px] shadow-lg`}>
                        <span className="text-2xl sm:text-4xl font-bold tracking-tight tabular-nums leading-none drop-shadow-sm">{timeLeft.m}</span>
                        <span className="text-[10px] sm:text-[12px] font-bold opacity-80 mt-1 uppercase tracking-wide">Dakika</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold opacity-50 pb-4 animate-pulse">:</span>
                    <div className={`flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20 min-w-[55px] sm:min-w-[70px] shadow-lg`}>
                        <span className="text-2xl sm:text-4xl font-bold tracking-tight tabular-nums leading-none drop-shadow-sm">{timeLeft.s}</span>
                        <span className="text-[10px] sm:text-[12px] font-bold opacity-80 mt-1 uppercase tracking-wide">Saniye</span>
                    </div>
                </div>
            </div>

            {/* Alt Kısım: Progress Bar */}
            <div className="relative z-10 mt-4 w-full">
                <div className="flex justify-between text-[10px] opacity-80 mb-1 font-medium">
                    <span>Vaktin Geçen Kısmı</span>
                    <span>%{Math.round(progress)}</span>
                </div>
                <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                        className={`h-full ${theme.progressColor} transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(255,255,255,0.8)]`} 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
});
