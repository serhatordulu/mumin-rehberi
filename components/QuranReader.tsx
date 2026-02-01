
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Search, ChevronRight, ChevronLeft, Copy, AlertTriangle, Loader2, RefreshCcw, Download, WifiOff, Brain, Eye, EyeOff, PlayCircle, StopCircle, Repeat, X } from './Icons';
import { SURAH_META } from '../data/quran_data';
import { Surah, Verse } from '../types';
import { checkQuranDataExists, saveQuranToDB, getSurahFromDB, clearQuranDB } from '../services/db';

type TafsirSource = 'elmalili' | 'diyanet';

// --- SKELETON LOADER COMPONENT ---
const QuranListSkeleton = () => (
    <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex items-center p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 mr-4"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                </div>
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
        ))}
    </div>
);

export const QuranReader: React.FC<{ onBack: () => void; initialMemoMode?: boolean }> = ({ onBack, initialMemoMode = false }) => {
    const [view, setView] = useState<'loading' | 'download' | 'list' | 'reader'>('loading');
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadStep, setDownloadStep] = useState<string>("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    
    const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
    const [selectedSurahData, setSelectedSurahData] = useState<Surah | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Tafsir Modal State
    const [tafsirVerse, setTafsirVerse] = useState<Verse | null>(null);
    const [tafsirLoading, setTafsirLoading] = useState(false);
    const [tafsirContent, setTafsirContent] = useState<string | null>(null);
    const [tafsirSource, setTafsirSource] = useState<TafsirSource>('elmalili');

    // --- MEMORIZATION MODE STATE ---
    const [isMemoMode, setIsMemoMode] = useState(initialMemoMode);
    const [blurArabic, setBlurArabic] = useState(false);
    const [blurTurkish, setBlurTurkish] = useState(false);
    const [loopCount, setLoopCount] = useState(3);
    const [playingVerse, setPlayingVerse] = useState<{id: number, currentLoop: number, maxLoop: number} | null>(null);
    const [autoStartMemo, setAutoStartMemo] = useState(initialMemoMode);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Audio Playback Logic for Verse Looping
    useEffect(() => {
        if (playingVerse) {
            if (!audioRef.current) {
                audioRef.current = new Audio();
                audioRef.current.addEventListener('ended', handleAudioEnded);
            }
            const src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${playingVerse.id}.mp3`;
            if (audioRef.current.src !== src) {
                audioRef.current.src = src;
                audioRef.current.load();
                audioRef.current.play().catch(e => {
                    console.error("Audio play error", e);
                    setPlayingVerse(null);
                });
            } else {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }

        return () => {
            if (!playingVerse && audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [playingVerse]);

    const handleAudioEnded = () => {
        setPlayingVerse(prev => {
            if (!prev) return null;
            const nextLoop = prev.currentLoop + 1;
            
            if (prev.maxLoop === 0 || nextLoop <= prev.maxLoop) {
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                }
                return { ...prev, currentLoop: nextLoop };
            } else {
                return null;
            }
        });
    };

    const togglePlayVerse = (globalVerseId: number) => {
        if (playingVerse && playingVerse.id === globalVerseId) {
            setPlayingVerse(null); // Stop
        } else {
            setPlayingVerse({ id: globalVerseId, currentLoop: 1, maxLoop: loopCount });
        }
    };

    // Uygulama açılınca veri var mı kontrol et
    useEffect(() => {
        checkStatus();
    }, []);

    useEffect(() => {
        if (selectedSurahId) {
            loadSurahContent(selectedSurahId);
        }
    }, [selectedSurahId]);

    // Tefsir kaynağı değiştiğinde eğer modal açıksa yeniden yükle
    useEffect(() => {
        if (tafsirVerse && selectedSurahData) {
            fetchTafsir(tafsirVerse, selectedSurahData.id);
        }
    }, [tafsirSource]);

    const checkStatus = async () => {
        const exists = await checkQuranDataExists();
        if (exists) {
            setView('list');
        } else {
            setView('download');
        }
    };

    const loadSurahContent = async (id: number) => {
        try {
            const surah = await getSurahFromDB(id);
            if (surah) {
                setSelectedSurahData(surah);
                setView('reader');
                if (autoStartMemo) {
                    setIsMemoMode(true);
                }
            } else {
                setView('download');
            }
        } catch (e) {
            console.error("Sure yüklenemedi", e);
        }
    };

    // AlQuran Cloud API'sini kullanarak Tefsir/Meal çekme (Daha kararlı)
    const fetchTafsir = async (verse: Verse, surahId: number) => {
        setTafsirLoading(true);
        setTafsirContent(null);
        try {
            // Kaynağa göre API endpoint belirleme
            // tr.yazir = Elmalılı Hamdi Yazır
            // tr.diyanet = Diyanet İşleri
            const edition = tafsirSource === 'elmalili' ? 'tr.yazir' : 'tr.diyanet';
            
            // Ayet numarası Kuran genelindeki değil, sure içindeki numaradır.
            const url = `https://api.alquran.cloud/v1/ayah/${surahId}:${verse.verse_number}/${edition}`;
            
            const response = await fetch(url);
            
            if (!response.ok) throw new Error("Veri alınamadı");
            
            const json = await response.json();
            
            if(json.data && json.data.text) {
                setTafsirContent(json.data.text);
            } else {
                setTafsirContent("Bu kaynak için veri bulunamadı.");
            }

        } catch (error) {
            console.error(error);
            setTafsirContent("Veriye ulaşılamadı. İnternet bağlantınızı kontrol edin.");
        } finally {
            setTafsirLoading(false);
        }
    };

    const openTafsirModal = (verse: Verse) => {
        setTafsirVerse(verse);
        if (selectedSurahData) {
            fetchTafsir(verse, selectedSurahData.id);
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        setDownloadError(null);
        setDownloadProgress(0);

        try {
            setDownloadStep("Arapça Hat İndiriliyor...");
            setDownloadProgress(10);
            
            const arabicRes = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
            if (!arabicRes.ok) throw new Error("Arapça veri sunucudan alınamadı.");
            const arabicJson = await arabicRes.json();
            setDownloadProgress(40);

            setDownloadStep("Türkçe Meal İndiriliyor...");
            const turkishRes = await fetch('https://api.alquran.cloud/v1/quran/tr.diyanet');
            if (!turkishRes.ok) throw new Error("Türkçe veri sunucudan alınamadı.");
            const turkishJson = await turkishRes.json();
            setDownloadProgress(70);

            setDownloadStep("Veriler İşleniyor...");
            
            const arabicSurahs = arabicJson.data.surahs;
            const turkishSurahs = turkishJson.data.surahs;

            const processedData: Surah[] = arabicSurahs.map((surah: any, index: number) => {
                const trSurah = turkishSurahs[index];
                
                const verses: Verse[] = surah.ayahs.map((ayah: any, vIndex: number) => {
                    const trAyah = trSurah.ayahs[vIndex];
                    return {
                        id: ayah.number,
                        surah_id: surah.number,
                        verse_number: ayah.numberInSurah,
                        arabic: ayah.text,
                        turkish: trAyah ? trAyah.text : "Meal bulunamadı"
                    };
                });

                const meta = SURAH_META.find(m => m.id === surah.number);

                return {
                    id: surah.number,
                    name: meta ? meta.name : surah.englishName,
                    slug: meta ? meta.name.toLowerCase() : surah.englishName.toLowerCase(),
                    verse_count: surah.ayahs.length,
                    verses: verses
                };
            });

            setDownloadProgress(90);
            setDownloadStep("Veritabanına Kaydediliyor...");

            await saveQuranToDB(processedData);
            
            setDownloadProgress(100);
            setDownloadStep("Tamamlandı!");
            
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

            setTimeout(() => {
                setIsDownloading(false);
                setView('list');
            }, 1000);

        } catch (error) {
            console.error(error);
            setDownloadError("İndirme sırasında bir hata oluştu. İnternet bağlantınızı kontrol edip tekrar deneyin.");
            setIsDownloading(false);
            setDownloadStep("");
        }
    };

    const handleResetData = async () => {
        if(window.confirm("İndirilen Kuran verilerini silmek istiyor musunuz? Bu işlemden sonra tekrar indirme yapmanız gerekecek.")) {
            await clearQuranDB();
            setView('download');
        }
    };

    const handleCopyVerse = (verse: Verse, surahName: string) => {
        const text = `"${verse.turkish}"\n\n${surahName}, ${verse.verse_number}. Ayet`;
        navigator.clipboard.writeText(text);
        if(navigator.vibrate) navigator.vibrate(50);
    };

    // Gelişmiş Türkçe karakter normalizasyonu (İ, I, ı, i sorunlarını çözer)
    const normalizeSearchText = (text: string) => {
        return text
            .toLocaleLowerCase('tr')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Aksanları kaldır
            .replace(/i̇/g, 'i')
            .replace(/ı/g, 'i');
    };

    if (view === 'loading') {
        return <div className="h-full flex items-center justify-center p-6"><QuranListSkeleton /></div>;
    }

    if (view === 'download') {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-warm-200 dark:bg-slate-950 text-center animate-fade-in">
                <div className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-teal-200 dark:shadow-teal-900/20">
                    {downloadError ? <WifiOff size={48}/> : <Download size={48} />}
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Kuran Veri Paketi</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs text-sm leading-relaxed">
                    Uygulamayı çevrimdışı kullanabilmek için Kuran-ı Kerim'in tamamını (Arapça Hat ve Diyanet Meali) indirmeniz gerekmektedir.
                </p>

                <div className="w-full max-w-xs space-y-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-600 dark:text-slate-400">İndirme Boyutu:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">~4 MB</span>
                    </div>

                    {!isDownloading ? (
                        <button 
                            onClick={handleDownload}
                            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-200 dark:shadow-teal-900/40 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-teal-700"
                        >
                            <Download size={20} />
                            Verileri İndir
                        </button>
                    ) : (
                        <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex justify-between text-xs font-bold text-teal-600 dark:text-teal-400 mb-2">
                                <span>{downloadStep}</span>
                                <span>%{downloadProgress}</span>
                            </div>
                            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-teal-500 transition-all duration-500 ease-out relative"
                                    style={{ width: `${downloadProgress}%` }}
                                >
                                    <div className="absolute inset-0 w-full h-full bg-white/30 animate-shimmer" style={{ transform: 'skewX(-20deg)' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {downloadError && (
                        <div className="text-red-500 text-xs font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-2 text-left">
                            <AlertTriangle size={24} className="shrink-0" /> 
                            <span>{downloadError}</span>
                        </div>
                    )}
                </div>
                
                <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-8">
                    Veriler 'alquran.cloud' API servisi üzerinden Diyanet İşleri Başkanlığı meali esas alınarak sağlanmaktadır.
                </p>
            </div>
        );
    }

    if (view === 'reader' && selectedSurahData) {
        return (
            <div 
                className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up"
            >
                <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shrink-0">
                    <button onClick={() => { setSelectedSurahId(null); setView('list'); setPlayingVerse(null); }} className="p-3 -ml-3 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedSurahData.name} Suresi</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{selectedSurahData.verse_count} Ayet</p>
                    </div>
                    <button 
                        onClick={() => setIsMemoMode(!isMemoMode)} 
                        className={`p-3 rounded-full transition-all ${isMemoMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300 dark:shadow-indigo-900/50' : 'bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'}`}
                        title="Ezber Modu"
                    >
                        <Brain size={24} />
                    </button>
                </div>

                <div className={`flex-1 overflow-y-auto no-scrollbar p-4 space-y-6 pb-40`}>
                    {selectedSurahData.verses && selectedSurahData.verses.length > 0 ? (
                        selectedSurahData.verses.map((verse) => {
                            const isPlayingThis = playingVerse?.id === verse.id;
                            
                            return (
                                <div key={verse.id} className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-sm transition-all duration-300 ${isPlayingThis ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-800'}`}>
                                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-base">
                                                {verse.verse_number}
                                            </div>
                                            {isMemoMode && (
                                                <button 
                                                    onClick={() => togglePlayVerse(verse.id)} 
                                                    className={`p-2 rounded-full transition-colors ${isPlayingThis ? 'text-red-500 bg-red-100 dark:bg-red-900/20' : 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20 hover:bg-indigo-200'}`}
                                                >
                                                    {isPlayingThis ? <StopCircle size={22} /> : <PlayCircle size={22} />}
                                                </button>
                                            )}
                                            {isPlayingThis && (
                                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 animate-pulse bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded">
                                                    {playingVerse.maxLoop === 0 ? '∞ Tekrar' : `Tekrar: ${playingVerse.currentLoop}/${playingVerse.maxLoop}`}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => openTafsirModal(verse)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-teal-100 hover:text-teal-700 transition-colors"
                                            >
                                                <BookOpen size={14} /> <span className="hidden sm:inline">Tefsir</span>
                                            </button>
                                            <button 
                                                onClick={() => handleCopyVerse(verse, selectedSurahData.name)}
                                                className="text-slate-400 hover:text-teal-600 transition-colors p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                                            >
                                                <Copy size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {verse.arabic && (
                                        <div className="relative group cursor-pointer" onClick={() => isMemoMode && blurArabic ? null : null}>
                                            {/* Font ve satır aralığı iyileştirmesi */}
                                            <p className={`text-right font-['Amiri'] text-3xl sm:text-4xl leading-[2.8] sm:leading-[3] text-slate-900 dark:text-white mb-8 transition-all duration-300 ${isMemoMode && blurArabic ? 'blur-md hover:blur-0 opacity-40 hover:opacity-100 select-none' : ''}`} dir="rtl">
                                                {verse.arabic}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="relative group cursor-pointer">
                                        <p className={`text-slate-700 dark:text-slate-300 text-lg sm:text-xl leading-loose transition-all duration-300 font-serif ${isMemoMode && blurTurkish ? 'blur-md hover:blur-0 opacity-40 hover:opacity-100 select-none' : ''}`}>
                                            {verse.turkish}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                            <div className="p-4 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-full mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Veri Hatası</h3>
                            <p className="text-slate-500 text-sm">Bu surenin içeriği yüklenemedi. Lütfen verileri sıfırlayıp tekrar indirin.</p>
                        </div>
                    )}
                    <div className="text-center py-6 text-slate-400 text-xs opacity-60">
                        <p>Diyanet İşleri Başkanlığı Meali</p>
                    </div>
                </div>

                {isMemoMode && (
                    <div className="absolute bottom-6 left-4 right-4 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 animate-slide-up z-30">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-base">
                                    <Brain size={20} /> Ezber Paneli
                                </div>
                                <button onClick={() => setIsMemoMode(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={22}/></button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setBlurArabic(!blurArabic)}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all active:scale-95 ${blurArabic ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-transparent' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                                >
                                    {blurArabic ? <EyeOff size={18}/> : <Eye size={18}/>} Arapça Gizle
                                </button>
                                <button 
                                    onClick={() => setBlurTurkish(!blurTurkish)}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all active:scale-95 ${blurTurkish ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-transparent' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                                >
                                    {blurTurkish ? <EyeOff size={18}/> : <Eye size={18}/>} Meal Gizle
                                </button>
                            </div>

                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2 px-2 text-slate-500 dark:text-slate-400">
                                    <Repeat size={20} />
                                    <span className="text-xs font-bold uppercase tracking-wide">Tekrar</span>
                                </div>
                                <div className="flex-1 flex justify-between gap-2">
                                    {[1, 3, 10, 0].map(count => (
                                        <button 
                                            key={count}
                                            onClick={() => setLoopCount(count)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${loopCount === count ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}
                                        >
                                            {count === 0 ? '∞' : `${count}x`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tafsir/Meal Modal with Source Selection */}
                {tafsirVerse && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 sm:p-4" onClick={() => setTafsirVerse(null)}>
                        <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-lg h-[90vh] sm:h-[80vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-slide-up flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="flex flex-col gap-4 mb-4 shrink-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <BookOpen className="text-indigo-500" size={24} /> Tefsir / Meal
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{selectedSurahData?.name} {tafsirVerse.verse_number}. Ayet</p>
                                    </div>
                                    <button onClick={() => setTafsirVerse(null)} className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"><X size={24}/></button>
                                </div>

                                {/* Source Selection Switcher */}
                                <div className="bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1">
                                    <button 
                                        onClick={() => setTafsirSource('elmalili')}
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tafsirSource === 'elmalili' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}
                                    >
                                        Elmalılı Hamdi
                                    </button>
                                    <button 
                                        onClick={() => setTafsirSource('diyanet')}
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tafsirSource === 'diyanet' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}
                                    >
                                        Diyanet İşleri
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                                
                                {tafsirLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-indigo-500">
                                        <Loader2 className="animate-spin mb-3" size={40} />
                                        <p className="text-base font-bold">Kaynak Getiriliyor...</p>
                                    </div>
                                ) : (
                                    <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none">
                                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-loose text-lg font-serif">
                                                {tafsirContent}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                <p className="text-center text-[10px] text-slate-400 opacity-60 pt-4 pb-10">
                                    Veriler AlQuran Cloud API üzerinden sağlanmaktadır.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const filteredSurahList = SURAH_META.filter(s => 
        normalizeSearchText(s.name).includes(normalizeSearchText(searchTerm))
    );

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-3 -ml-3 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Kuran-ı Kerim</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {autoStartMemo ? 'Kuran Öğren - Sure Seçin' : 'Sureler ve Mealleri'}
                    </p>
                </div>
                <button 
                    onClick={handleResetData}
                    className="p-3 bg-white/50 dark:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 transition-all"
                    title="Verileri Sil ve Tekrar İndir"
                >
                    <RefreshCcw size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-40">
                {autoStartMemo && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-5 rounded-2xl mb-6 flex items-start gap-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400"><Brain size={24} /></div>
                        <div>
                            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-base">Kuran Öğrenme Modu</h3>
                            <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1 leading-relaxed">
                                Seçtiğiniz surenin detayına girdiğinizde Arapça/Türkçe gizleme ve sesli tekrar paneli otomatik açılacaktır.
                            </p>
                        </div>
                    </div>
                )}

                <div className="relative mb-6">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                    <input 
                        type="text" 
                        placeholder="Sure ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg"
                    />
                </div>

                <div className="space-y-4">
                    {filteredSurahList.map((surah, idx) => (
                        <button 
                            key={surah.id}
                            onClick={() => setSelectedSurahId(surah.id)}
                            className={`w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 transition-all group animate-fade-in-up shadow-sm hover:shadow-md active:scale-[0.99]`}
                            style={{ animationDelay: `${Math.min(idx * 20, 500)}ms` }}
                        >
                            <div className="flex items-center space-x-5">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                    {surah.id}
                                </div>
                                <div className="text-left">
                                    <span className="font-bold text-slate-900 dark:text-slate-100 block text-lg mb-0.5">{surah.name}</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{surah.verse_count} Ayet</span>
                                </div>
                            </div>
                            <ChevronRight size={24} className="text-slate-300 dark:text-slate-600 group-hover:text-teal-600 transition-colors" />
                        </button>
                    ))}
                </div>
                
                {filteredSurahList.length === 0 && (
                    <div className="text-center py-10 text-slate-400 dark:text-slate-600 font-medium">
                        Sonuç bulunamadı.
                    </div>
                )}
            </div>
        </div>
    );
};
