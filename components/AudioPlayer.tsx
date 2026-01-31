
import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic, Volume2, Search, Loader2, Music, X, RotateCcw, RotateCw, Volume, ChevronLeft } from './Icons';
import { SURAH_META } from '../data/quran_data';
import { useAudio } from '../contexts/AudioContext';

interface AudioPlayerProps {
    onBack: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ onBack }) => {
    // Context Hook
    const {
        currentSurahIndex,
        isPlaying,
        duration,
        currentTime,
        isBuffering,
        volume,
        togglePlay,
        skipNext,
        skipPrev,
        seek,
        selectSurah,
        setVolume
    } = useAudio();

    const [showPlaylist, setShowPlaylist] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const normalizeSearchText = (text: string) => {
        return text
            .toLocaleLowerCase('tr')
            .replace(/â/g, 'a')
            .replace(/î/g, 'i')
            .replace(/û/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ğ/g, 'g')
            .replace(/ç/g, 'c')
            .replace(/ü/g, 'u')
            .replace(/ö/g, 'o')
            .replace(/ı/g, 'i');
    };

    const filteredSurahs = SURAH_META.filter(s => 
        normalizeSearchText(s.name).includes(normalizeSearchText(searchTerm))
    );

    const currentSurah = SURAH_META[currentSurahIndex];

    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeekRelative = (seconds: number) => {
        let newTime = currentTime + seconds;
        if (newTime < 0) newTime = 0;
        if (newTime > duration) newTime = duration;
        seek(newTime);
    };

    const adjustVolume = (delta: number) => {
        let newVol = volume + delta;
        if (newVol < 0) newVol = 0;
        if (newVol > 1) newVol = 1;
        setVolume(newVol);
    };

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 relative overflow-hidden animate-slide-up">
            
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-900/20 pointer-events-none"></div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-6 z-10 shrink-0">
                <button onClick={onBack} className="p-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} /> 
                </button>
                <div className="text-center">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">SESLİ KURAN</h2>
                    <span className="text-[10px] text-indigo-500 font-bold">Mishary Rashid Alafasy</span>
                </div>
                <button 
                    onClick={() => setShowPlaylist(true)}
                    className="p-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                    <ListMusic size={24} />
                </button>
            </div>

            {/* Main Player Visual */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 px-6 pb-28 overflow-y-auto no-scrollbar">
                
                {/* Visualizer & Disc Container */}
                <div className="relative mb-8 sm:mb-10 flex flex-col items-center">
                    
                    {/* Animated Disc */}
                    <div className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/40 flex items-center justify-center relative shrink-0 transition-all duration-500 z-10 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
                        <div className="absolute inset-2 rounded-full border-2 border-white/20 border-dashed animate-[spin_20s_linear_infinite_reverse]"></div>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-warm-100 dark:bg-slate-950 rounded-full flex items-center justify-center shadow-inner z-20">
                            <Music size={24} className="text-indigo-500 sm:w-8 sm:h-8" />
                        </div>
                    </div>

                    {/* Waveform Visualizer (Playing State) */}
                    {isPlaying && !isBuffering && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8 z-0 opacity-60">
                            {[...Array(12)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="w-1.5 bg-indigo-400 rounded-t-sm animate-wave" 
                                    style={{ 
                                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                                        height: `${4 + Math.random() * 12}px` 
                                    }}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="text-center mb-6 sm:mb-8 shrink-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 tracking-tight">{currentSurah.name}</h2>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium bg-white/50 dark:bg-slate-800 px-3 py-1 rounded-full inline-block">Sure {currentSurah.id} • {currentSurah.verse_count} Ayet</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-sm mb-4 shrink-0 px-2 group">
                    <div className="relative h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-lg">
                        <div 
                            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-lg"
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        ></div>
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={currentTime}
                            onChange={(e) => seek(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-2 font-mono group-hover:text-indigo-500 transition-colors">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Main Controls (Responsive & Spaced) */}
                <div className="flex items-center justify-center gap-6 sm:gap-8 w-full mb-8 shrink-0">
                    {/* -10s */}
                    <button 
                        onClick={() => handleSeekRelative(-10)}
                        className="relative p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors active:scale-95 group"
                        title="10 Saniye Geri"
                    >
                        <div className="relative flex items-center justify-center">
                            <RotateCcw size={24} strokeWidth={2} />
                            <span className="absolute text-[8px] font-bold mt-[1px]">10</span>
                        </div>
                    </button>

                    {/* Prev */}
                    <button 
                        onClick={skipPrev}
                        className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors active:scale-95"
                    >
                        <SkipBack size={28} fill="currentColor" />
                    </button>

                    {/* Play/Pause */}
                    <button 
                        onClick={togglePlay}
                        disabled={isBuffering}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-300 dark:shadow-indigo-900/50 active:scale-95 transition-all relative shrink-0"
                    >
                        {isBuffering ? (
                            <Loader2 size={28} className="animate-spin sm:w-8 sm:h-8" />
                        ) : isPlaying ? (
                            <Pause size={28} className="sm:w-8 sm:h-8" fill="currentColor" />
                        ) : (
                            <Play size={28} className="ml-1 sm:w-8 sm:h-8" fill="currentColor" />
                        )}
                    </button>

                    {/* Next */}
                    <button 
                        onClick={skipNext}
                        className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors active:scale-95"
                    >
                        <SkipForward size={28} fill="currentColor" />
                    </button>

                    {/* +10s */}
                    <button 
                        onClick={() => handleSeekRelative(10)}
                        className="relative p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors active:scale-95 group"
                        title="10 Saniye İleri"
                    >
                        <div className="relative flex items-center justify-center">
                            <RotateCw size={24} strokeWidth={2} />
                            <span className="absolute text-[8px] font-bold mt-[1px]">10</span>
                        </div>
                    </button>
                </div>

                {/* Stylish Volume Controls */}
                <div className="w-full max-w-xs flex items-center gap-3 bg-white dark:bg-slate-900 p-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <button 
                        onClick={() => adjustVolume(-0.1)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <Volume size={18} />
                    </button>
                    
                    <div className="flex-1 relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full">
                        <div 
                            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full"
                            style={{ width: `${volume * 100}%` }}
                        ></div>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    <button 
                        onClick={() => adjustVolume(0.1)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <Volume2 size={18} />
                    </button>
                </div>
            </div>

            {/* Playlist Modal */}
            {showPlaylist && (
                <div className="absolute inset-0 z-50 bg-warm-200 dark:bg-slate-950 flex flex-col animate-slide-up">
                    <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 bg-warm-200 dark:bg-slate-900 shrink-0">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Sure Ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:text-white"
                            />
                        </div>
                        <button 
                            onClick={() => setShowPlaylist(false)}
                            className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar pb-24">
                        {filteredSurahs.map((surah) => {
                            // global index is id - 1
                            const globalIndex = surah.id - 1;
                            const isActive = globalIndex === currentSurahIndex;

                            return (
                                <button
                                    key={surah.id}
                                    onClick={() => {
                                        selectSurah(globalIndex);
                                        setShowPlaylist(false);
                                    }}
                                    className={`w-full flex items-center p-3 rounded-xl transition-all ${
                                        isActive 
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800' 
                                        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 ${
                                        isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                    }`}>
                                        {isActive && isPlaying ? <Volume2 size={18} className="animate-pulse" /> : surah.id}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className={`font-bold text-sm ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-800 dark:text-white'}`}>
                                            {surah.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">{surah.verse_count} Ayet</p>
                                    </div>
                                    {isActive && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1; 
                    border-radius: 20px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155; 
                }
            `}</style>
        </div>
    );
};
