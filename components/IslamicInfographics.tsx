
import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, Activity, ChevronLeft, Calendar, Zap, Target, TrendingUp, Award, Layers, Sparkles } from './Icons';

interface IslamicInfographicsProps {
    onBack: () => void;
}

// --- ÖZET KART BİLEŞENİ ---
const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: { title: string, value: string | number, subtext: string, icon: any, colorClass: string }) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform duration-500`}>
            <Icon size={64} />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1">{value}</h3>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{subtext}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon size={20} />
        </div>
    </div>
);

// --- İBADET SÜREKLİLİĞİ (HEATMAP) ---
const PrayerHeatmap = () => {
    const [days, setDays] = useState<{ date: string, count: number, opacity: string }[]>([]);

    useEffect(() => {
        const tempDays = [];
        // Son 28 günü (4 hafta) göster
        for (let i = 27; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toDateString();
            
            const saved = localStorage.getItem(`completed_prayers_${dateStr}`);
            const completedList = saved ? JSON.parse(saved) : [];
            const count = completedList.length;

            // 5 vakit üzerinden opaklık hesapla (0.1 - 1.0 arası)
            // Hiç kılınmadıysa çok silik (0.1), 5 vakitse tam (1.0)
            let opacity = "opacity-10"; // Boş
            if (count === 1) opacity = "opacity-30";
            if (count === 2) opacity = "opacity-50";
            if (count === 3) opacity = "opacity-70";
            if (count === 4) opacity = "opacity-90";
            if (count === 5) opacity = "opacity-100";

            tempDays.push({
                date: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
                count,
                opacity
            });
        }
        setDays(tempDays);
    }, []);

    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Calendar size={18} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Son 30 Gün İbadet Yoğunluğu</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 group relative">
                        <div 
                            className={`w-full aspect-square rounded-lg bg-emerald-500 dark:bg-emerald-400 transition-all duration-300 ${day.opacity} hover:opacity-100 hover:scale-110 shadow-sm`}
                        ></div>
                        {/* Tooltip (Sadece hover durumunda görünür) */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                            {day.date}: {day.count} Vakit
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center mt-3 text-[9px] text-slate-400 font-medium px-1">
                <span>Az</span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-sm bg-emerald-500/10"></div>
                    <div className="w-2 h-2 rounded-sm bg-emerald-500/40"></div>
                    <div className="w-2 h-2 rounded-sm bg-emerald-500/70"></div>
                    <div className="w-2 h-2 rounded-sm bg-emerald-500"></div>
                </div>
                <span>Çok</span>
            </div>
        </div>
    );
};

// --- AYLIK İBADET GRAFİĞİ BİLEŞENİ (GÜNCELLENDİ: 7 GÜN -> 30 GÜN) ---
const MonthlyPrayerChart = () => {
    const [data, setData] = useState<{ day: string; count: number; fullDate: string }[]>([]);

    useEffect(() => {
        // Son 30 günün verisini hazırla
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i)); // Bugünden geriye 29 gün + bugün
            const dateStr = d.toDateString();
            
            // LocalStorage'dan veriyi çek
            const saved = localStorage.getItem(`completed_prayers_${dateStr}`);
            const completedList = saved ? JSON.parse(saved) : [];
            
            return {
                day: d.getDate().toString(), // Sadece gün numarası (1, 2, 15 vb.)
                count: completedList.length,
                fullDate: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
            };
        });
        
        setData(last30Days);
    }, []);

    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <BarChart3 size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Aylık Performans</h3>
                </div>
            </div>

            <div className="flex items-end justify-between h-32 gap-[2px]">
                {data.map((item, idx) => {
                    const heightPercent = (item.count / 5) * 100;
                    const isToday = idx === 29;
                    
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative">
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative h-full flex items-end overflow-hidden">
                                <div 
                                    className={`w-full rounded-t-sm transition-all duration-1000 ease-out relative ${
                                        isToday 
                                        ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' 
                                        : 'bg-indigo-300 dark:bg-indigo-700 hover:bg-indigo-400 dark:hover:bg-indigo-600'
                                    }`}
                                    style={{ height: `${Math.max(5, heightPercent)}%` }} // Min yükseklik %5
                                >
                                    {isToday && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                                </div>
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap z-20 font-bold -translate-x-1/2 left-1/2">
                                {item.fullDate}: {item.count}/5
                            </div>

                            {/* Sadece belirli günleri göster (karmaşayı önlemek için) */}
                            {(idx % 5 === 0 || isToday) && (
                                <span className={`text-[8px] mt-1 font-bold absolute top-full ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`}>
                                    {item.day}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- KAZA BORCU DAĞILIM GRAFİĞİ (DONUT CHART) ---
const KazaPieChart = () => {
    const [kazaData, setKazaData] = useState<{ label: string, count: number, color: string }[]>([]);
    const [totalKaza, setTotalKaza] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('kaza_counts');
        const counts = saved ? JSON.parse(saved) : { sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitir: 0 };
        
        const data = [
            { label: 'Sabah', count: counts.sabah || 0, color: '#f43f5e' },   // Rose
            { label: 'Öğle', count: counts.ogle || 0, color: '#fb923c' },    // Orange
            { label: 'İkindi', count: counts.ikindi || 0, color: '#facc15' }, // Yellow
            { label: 'Akşam', count: counts.aksam || 0, color: '#a78bfa' },  // Violet
            { label: 'Yatsı', count: counts.yatsi || 0, color: '#3b82f6' },  // Blue
            { label: 'Vitir', count: counts.vitir || 0, color: '#94a3b8' }   // Slate
        ];

        setKazaData(data);
        setTotalKaza(data.reduce((acc, curr) => acc + curr.count, 0));
    }, []);

    // SVG Hesaplamaları
    let cumulativePercent = 0;
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
                        <PieChart size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Kaza Borcu Dağılımı</h3>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* SVG Chart */}
                <div className="relative w-32 h-32 shrink-0">
                    {totalKaza === 0 ? (
                        <div className="w-full h-full rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-[10px] text-slate-400 font-medium">Borç Yok</span>
                        </div>
                    ) : (
                        <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                            {kazaData.map((slice, i) => {
                                if (slice.count === 0) return null;
                                const start = cumulativePercent;
                                const slicePercent = slice.count / totalKaza;
                                cumulativePercent += slicePercent;
                                const end = cumulativePercent;

                                const [startX, startY] = getCoordinatesForPercent(start);
                                const [endX, endY] = getCoordinatesForPercent(end);
                                const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

                                if (slicePercent === 1) {
                                    return <circle key={i} cx="0" cy="0" r="0.8" fill="transparent" stroke={slice.color} strokeWidth="0.3" />;
                                }

                                return (
                                    <path 
                                        key={i} 
                                        fill="none"
                                        stroke={slice.color}
                                        strokeWidth="0.3" 
                                        d={`M ${startX * 0.8} ${startY * 0.8} A 0.8 0.8 0 ${largeArcFlag} 1 ${endX * 0.8} ${endY * 0.8}`}
                                        className="transition-all duration-1000 hover:opacity-80"
                                    />
                                );
                            })}
                        </svg>
                    )}
                    {/* Ortadaki Toplam Sayı - Sadece Borç Varsa Göster */}
                    {totalKaza > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl font-black text-slate-800 dark:text-white leading-none">{totalKaza}</span>
                            <span className="text-[8px] text-slate-400 uppercase font-bold mt-0.5">Vakit</span>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
                    {kazaData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-slate-500 dark:text-slate-400 font-medium">{item.label}</span>
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- ANA BİLEŞEN ---
export const IslamicInfographics: React.FC<IslamicInfographicsProps> = ({ onBack }) => {
    // İstatistik Verilerini Topla
    const [stats, setStats] = useState({
        streak: 0,
        totalZikir: 0,
        xp: 0,
        level: 1
    });

    useEffect(() => {
        const savedStats = localStorage.getItem('user_stats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    }, []);

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">İstatistikler</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Gelişim Analizi</p>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-44 space-y-4">
                
                {/* Özet Kartlar */}
                <div className="grid grid-cols-2 gap-3">
                    <StatCard 
                        title="Günlük Seri" 
                        value={stats.streak} 
                        subtext="Gün Aralıksız Giriş" 
                        icon={TrendingUp} 
                        colorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    />
                    <StatCard 
                        title="Toplam Zikir" 
                        value={stats.totalZikir} 
                        subtext="Adet Tesbihat" 
                        icon={Target} 
                        colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    />
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden flex items-center justify-between">
                    <div className="absolute left-0 top-0 w-full h-full bg-white/10 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Award size={18} className="text-white/80"/>
                            <span className="text-xs font-bold uppercase tracking-widest text-white/90">Manevi Seviye</span>
                        </div>
                        <h2 className="text-3xl font-black">{stats.level}. Seviye</h2>
                        <p className="text-xs text-white/80 font-medium mt-1">Toplam {stats.xp} XP Puanı</p>
                    </div>
                    <div className="relative z-10 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <Zap size={32} />
                    </div>
                </div>

                <PrayerHeatmap />
                <MonthlyPrayerChart />
                <KazaPieChart />
                
                <div className="mt-6 mb-4 mx-2">
                    <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-6 rounded-2xl border border-amber-100 dark:border-slate-700 text-center shadow-sm">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-950 p-2 rounded-full border border-amber-100 dark:border-slate-700 shadow-sm">
                            <Sparkles size={16} className="text-amber-500" />
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-serif text-lg italic leading-relaxed mb-2">
                            "İki günü eşit olan ziyandadır."
                        </p>
                        <div className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                            Hadis-i Şerif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
