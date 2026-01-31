
import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ChevronRight, ChevronLeft, Share2, Copy, AlertTriangle, Loader2, RefreshCcw, Check, Book, Download, WifiOff } from './Icons';
import { checkHadithDataExists, saveHadithsToDB, getHadithsByPage, searchHadiths, clearHadithDB } from '../services/db';
import { Share } from '@capacitor/share';

// API URL (Sahih-i Buhârî Türkçe)
const API_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/tur-bukhari.json";

// --- SKELETON LOADER COMPONENT ---
const HadithListSkeleton = () => (
    <div className="space-y-4 animate-pulse p-4">
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start mb-3">
                    <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                    <div className="flex gap-1">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
                </div>
            </div>
        ))}
    </div>
);

export const HadithReader: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [view, setView] = useState<'loading' | 'download' | 'list'>('loading');
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadStep, setDownloadStep] = useState<string>("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Reader States
    const [currentPage, setCurrentPage] = useState(1);
    const [hadiths, setHadiths] = useState<any[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);
    const [copiedId, setCopiedId] = useState<string | number | null>(null);
    
    // Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        checkStatus();
    }, []);

    useEffect(() => {
        if (view === 'list' && !searchQuery) {
            loadPage(currentPage);
        }
    }, [currentPage, view, searchQuery]);

    useEffect(() => {
        // Debounce search
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim().length > 2) {
                performSearch(searchQuery);
            } else if (searchQuery.trim().length === 0 && isSearching) {
                setIsSearching(false);
                loadPage(currentPage);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const checkStatus = async () => {
        const exists = await checkHadithDataExists();
        if (exists) {
            setView('list');
        } else {
            setView('download');
        }
    };

    const loadPage = async (page: number) => {
        setLoadingPage(true);
        try {
            const data = await getHadithsByPage(page);
            // Hadis numarasına göre sırala (string gelebilir, garantiye al)
            data.sort((a, b) => parseFloat(a.hadithNumber) - parseFloat(b.hadithNumber));
            setHadiths(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingPage(false);
        }
    };

    const performSearch = async (query: string) => {
        setIsSearching(true);
        setLoadingPage(true);
        try {
            const results = await searchHadiths(query);
            setSearchResults(results);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingPage(false);
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        setError(null);
        setDownloadProgress(0);

        try {
            setDownloadStep("Veri Sunucusuna Bağlanılıyor...");
            setDownloadProgress(10);
            
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Hadis verisi indirilemedi.");
            
            setDownloadStep("Hadisler İndiriliyor (Bu işlem biraz sürebilir)...");
            setDownloadProgress(40);
            
            const json = await response.json();
            
            if (!json.hadiths || !Array.isArray(json.hadiths)) {
                throw new Error("Veri formatı hatalı.");
            }

            setDownloadStep(`Veritabanına İşleniyor (${json.hadiths.length} Hadis)...`);
            setDownloadProgress(70);

            // Veritabanına kaydet
            await saveHadithsToDB(json.hadiths);
            
            setDownloadProgress(100);
            setDownloadStep("Tamamlandı!");
            
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

            setTimeout(() => {
                setIsDownloading(false);
                setView('list');
            }, 1000);

        } catch (err) {
            console.error(err);
            setError("İndirme sırasında bir hata oluştu. İnternet bağlantınızı kontrol edip tekrar deneyin.");
            setIsDownloading(false);
        }
    };

    const handleResetData = async () => {
        if(window.confirm("İndirilen hadis verilerini silmek istiyor musunuz?")) {
            await clearHadithDB();
            setView('download');
        }
    };

    const handleCopy = (text: string, id: string | number) => {
        navigator.clipboard.writeText(`${text}\n\n(Sahih-i Buhârî, Hadis No: ${id})`);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        if(navigator.vibrate) navigator.vibrate(50);
    };

    const handleShare = async (text: string, id: string | number) => {
        const shareText = `"${text}"\n\nSahih-i Buhârî, No: ${id}\n📍 Mümin Rehberi`;
        try {
            await Share.share({
                title: 'Hadis-i Şerif',
                text: shareText,
            });
        } catch (e) {
            handleCopy(text, id);
        }
    };

    if (view === 'loading') {
        return <div className="h-full flex items-center justify-center text-slate-400"><Loader2 className="animate-spin" /></div>;
    }

    if (view === 'download') {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-warm-200 dark:bg-slate-950 text-center animate-fade-in">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
                    {error ? <WifiOff size={48}/> : <Download size={48} />}
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Sahih-i Buhârî</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs text-sm leading-relaxed">
                    Tüm Sahih-i Buhârî hadislerini (7000+) cihazınıza indirerek çevrimdışı okuyabilirsiniz.
                </p>

                <div className="w-full max-w-xs space-y-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-600 dark:text-slate-400">İndirme Boyutu:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">~12 MB</span>
                    </div>

                    {!isDownloading ? (
                        <button 
                            onClick={handleDownload}
                            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-emerald-700"
                        >
                            <Download size={20} />
                            Arşivi İndir
                        </button>
                    ) : (
                        <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                                <span className="truncate pr-2">{downloadStep}</span>
                                <span>%{downloadProgress}</span>
                            </div>
                            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-500 ease-out relative"
                                    style={{ width: `${downloadProgress}%` }}
                                >
                                    <div className="absolute inset-0 w-full h-full bg-white/30 animate-shimmer" style={{ transform: 'skewX(-20deg)' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-xs font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-2 text-left">
                            <AlertTriangle size={24} className="shrink-0" /> 
                            <span>{error}</span>
                        </div>
                    )}
                </div>
                
                <button onClick={onBack} className="mt-8 text-sm text-slate-400 font-medium hover:text-slate-600">Geri Dön</button>
            </div>
        );
    }

    const activeList = isSearching ? searchResults : hadiths;

    return (
        <div 
            className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up"
        >
            {/* Header */}
            <div className="flex flex-col bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center justify-between px-6 py-4">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sahih-i Buhârî</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{isSearching ? `${searchResults.length} Sonuç` : `Sayfa ${currentPage}`}</p>
                    </div>
                    {/* Yenileme butonu kaldırıldı */}
                    <div className="w-10"></div> 
                </div>
                
                {/* Search Bar */}
                <div className="px-6 pb-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Hadis içinde ara..." 
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-200 dark:bg-slate-700 rounded-full text-slate-500">
                                <span className="sr-only">Temizle</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* List with Stylish Scrollbar */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loadingPage ? (
                    <HadithListSkeleton />
                ) : activeList.length > 0 ? (
                    <div className="p-4 space-y-4 pb-24">
                    {activeList.map((h) => (
                        <div key={h.hadithNumber} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden animate-fade-in-up">
                            <div className="flex justify-between items-start mb-3">
                                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                                    Hadis No: {h.hadithNumber}
                                </span>
                                <div className="flex gap-1">
                                    <button onClick={() => handleCopy(h.text, h.hadithNumber)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                                        {copiedId === h.hadithNumber ? <Check size={16} className="text-emerald-500"/> : <Copy size={16}/>}
                                    </button>
                                    <button onClick={() => handleShare(h.text, h.hadithNumber)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line font-serif">
                                {h.text}
                            </p>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        {isSearching ? "Sonuç bulunamadı." : "Hadis bulunamadı."}
                    </div>
                )}
                
                {/* Pagination (Only show if NOT searching) */}
                {!isSearching && !loadingPage && (
                    <div className="flex justify-center items-center space-x-4 pt-2 pb-24">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl disabled:opacity-50 text-sm font-bold text-slate-600 dark:text-slate-300"
                        >
                            Önceki
                        </button>
                        <span className="text-sm font-medium text-slate-500">Sayfa {currentPage}</span>
                        <button 
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={hadiths.length < 50}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl disabled:opacity-50 text-sm font-bold text-slate-600 dark:text-slate-300"
                        >
                            Sonraki
                        </button>
                    </div>
                )}
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1; 
                    border-radius: 4px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155; 
                }
            `}</style>
        </div>
    );
};
