
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Loader2, AlertTriangle, Layers } from './Icons';
import { checkQuranDataExists, getJuzFromDB } from '../services/db';

interface JuzItem {
    id: number;
    title: string;
    range: string;
    summary: string;
}

const ALL_JUZ_DATA: JuzItem[] = Array.from({ length: 30 }, (_, i) => {
    const id = i + 1;
    let summary = "";
    let range = "";
    
    if (id === 1) { range = "Fatiha 1 - Bakara 141"; summary = "Kuran'ın özeti Fatiha ve İslam hukukunun temeli Bakara suresiyle başlar."; }
    else if (id === 30) { range = "Nebe 1 - Nas 6"; summary = "Kıyamet, ahiret ve kısa sureler (Amme Cüzü)."; }
    else { range = `${id}. Cüz Aralığı`; summary = "Bu cüzdeki sureler ve temel konular."; }

    return {
        id: id,
        title: `${id}. Cüz`,
        range: range,
        summary: summary
    };
});

export const CuzFinder: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedJuz, setSelectedJuz] = useState<JuzItem | null>(null);
    const [viewingJuzContent, setViewingJuzContent] = useState<any[] | null>(null);
    const [juzLoading, setJuzLoading] = useState(false);
    const [juzError, setJuzError] = useState<string | null>(null);

    const handleCuzSelect = async (juz: JuzItem) => {
        setSelectedJuz(juz);
        const hasData = await checkQuranDataExists();
        if (!hasData) {
            setJuzError("Kuran verileri indirilmemiş. Lütfen 'Kuran-ı Kerim' menüsünden verileri indiriniz.");
            return;
        }
        setJuzLoading(true);
        setJuzError(null);
        try {
            const result = await getJuzFromDB(juz.id);
            if (result) {
                setViewingJuzContent(result.verses);
            } else { 
                setJuzError("Cüz verisi okunurken bir hata oluştu."); 
            }
        } catch (e) { 
            setJuzError("Veritabanı hatası."); 
        } finally { 
            setJuzLoading(false); 
        }
    };

    const handleBack = () => {
        if (selectedJuz) {
            setSelectedJuz(null);
            setViewingJuzContent(null);
            setJuzError(null);
        } else {
            onBack();
        }
    };

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={handleBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedJuz ? selectedJuz.title : 'Kuran Cüzleri'}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedJuz ? 'Mealli Okuma' : 'Cüz Seçimi'}</p>
                </div>
                <div className="w-10 flex justify-center text-indigo-500"><Layers size={24}/></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4">
                {selectedJuz ? (
                    <div className="h-full flex flex-col">
                        {juzLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-indigo-500">
                                <Loader2 className="animate-spin mb-2" size={32} />
                                <p className="text-sm font-medium">Ayetler Getiriliyor...</p>
                            </div>
                        ) : juzError ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center">
                                    <AlertTriangle size={32} />
                                </div>
                                <h3 className="font-bold">Veri Bulunamadı</h3>
                                <p className="text-slate-500 text-sm">{juzError}</p>
                            </div>
                        ) : (
                            <div className="flex-1 space-y-4 pb-20">
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-4">
                                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-1">{selectedJuz.range}</h4>
                                    <p className="text-xs text-indigo-700 dark:text-indigo-400">{selectedJuz.summary}</p>
                                </div>
                                {viewingJuzContent && viewingJuzContent.map((verse: any) => (
                                    <div key={verse.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">{verse.surahName}</span>
                                                <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs mt-1">{verse.verse_number}</div>
                                            </div>
                                        </div>
                                        {verse.arabic && <p className="text-right font-['Amiri'] text-2xl leading-[2.2] text-slate-900 dark:text-white mb-4" dir="rtl">{verse.arabic}</p>}
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{verse.turkish}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3 pb-20">
                        {ALL_JUZ_DATA.map((juz) => (
                            <button key={juz.id} onClick={() => handleCuzSelect(juz)} className="w-full text-left bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center group active:scale-[0.98]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">{juz.id}</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{juz.range}</h4>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 opacity-80">{juz.summary}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
