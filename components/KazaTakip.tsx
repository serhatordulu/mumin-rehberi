
import React, { useState, useEffect } from 'react';
import { Plus, Minus, AlertTriangle, RotateCcw, PenLine, ChevronLeft } from './Icons';

interface KazaCounts {
    sabah: number;
    ogle: number;
    ikindi: number;
    aksam: number;
    yatsi: number;
    vitir: number;
    oruc: number;
}

export const KazaTakip: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [counts, setCounts] = useState<KazaCounts>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('kaza_counts');
            return saved ? JSON.parse(saved) : { sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitir: 0, oruc: 0 };
        }
        return { sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitir: 0, oruc: 0 };
    });

    const [showReset, setShowReset] = useState(false);

    useEffect(() => {
        localStorage.setItem('kaza_counts', JSON.stringify(counts));
    }, [counts]);

    const updateCount = (key: keyof KazaCounts, delta: number) => {
        setCounts(prev => {
            const newValue = Math.max(0, prev[key] + delta);
            return { ...prev, [key]: newValue };
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleReset = () => {
        setCounts({ sabah: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0, vitir: 0, oruc: 0 });
        setShowReset(false);
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    };

    const PrayerRow = ({ label, count, pKey }: { label: string, count: number, pKey: keyof KazaCounts }) => (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white text-lg">{label}</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Borç: {count}</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                <button 
                    onClick={() => updateCount(pKey, -1)}
                    disabled={count === 0}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                >
                    <Minus size={18} strokeWidth={3} />
                </button>
                <span className="w-8 text-center font-mono font-bold text-lg text-slate-900 dark:text-slate-200">{count}</span>
                <button 
                    onClick={() => updateCount(pKey, 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 text-rose-500 dark:text-rose-400 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 active:scale-95 transition-all"
                >
                    <Plus size={18} strokeWidth={3} />
                </button>
            </div>
        </div>
    );

    // Tip güvenliği: Object.values çıktısının number olduğunu garanti et
    const totalKaza = (Object.values(counts) as number[]).reduce((a: number, b: number) => a + b, 0);

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Kaza Takibi</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Borçlarınızı kayıt altına alın</p>
                </div>
                <button 
                    onClick={() => setShowReset(true)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors bg-white/50 dark:bg-slate-800 rounded-full"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-40">
                {/* Summary Card */}
                <div className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl p-6 text-white shadow-md dark:shadow-rose-900/40 relative overflow-hidden mb-6">
                    <div className="absolute top-0 right-0 p-6 opacity-10"><PenLine size={100} /></div>
                    <div className="relative z-10">
                        <span className="text-rose-100 text-xs font-bold uppercase tracking-wider">Toplam Kaza Borcu</span>
                        <h1 className="text-4xl font-bold mt-1 font-mono">{totalKaza} <span className="text-lg font-sans font-medium opacity-80">Vakit</span></h1>
                        <p className="text-xs text-rose-100 mt-2 opacity-80">
                            "Allah'ın borcu ödenmeye en layık olandır." (Hadis-i Şerif)
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Namazlar</h3>
                    <PrayerRow label="Sabah" count={counts.sabah} pKey="sabah" />
                    <PrayerRow label="Öğle" count={counts.ogle} pKey="ogle" />
                    <PrayerRow label="İkindi" count={counts.ikindi} pKey="ikindi" />
                    <PrayerRow label="Akşam" count={counts.aksam} pKey="aksam" />
                    <PrayerRow label="Yatsı" count={counts.yatsi} pKey="yatsi" />
                    <PrayerRow label="Vitir" count={counts.vitir} pKey="vitir" />
                </div>

                <div className="space-y-3 pt-4">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Oruç</h3>
                    <PrayerRow label="Ramazan Orucu" count={counts.oruc} pKey="oruc" />
                </div>
            </div>

            {/* Reset Modal */}
             {showReset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in" style={{ touchAction: 'none' }}>
                    <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sıfırlansın mı?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Tüm kaza kayıtlarınız silinecek ve sayaçlar sıfırlanacak.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button 
                                onClick={handleReset}
                                className="w-full py-3.5 rounded-2xl bg-red-600 text-white font-bold active:scale-[0.98] transition-transform shadow-md"
                            >
                                Evet, Sıfırla
                            </button>
                            <button 
                                onClick={() => setShowReset(false)}
                                className="w-full py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold active:scale-[0.98] transition-transform"
                            >
                                Vazgeç
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
