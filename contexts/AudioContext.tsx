
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { SURAH_META } from '../data/quran_data';

interface AudioContextType {
    currentSurahIndex: number;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    volume: number;
    isBuffering: boolean;
    togglePlay: () => void;
    selectSurah: (index: number) => void;
    skipNext: () => void;
    skipPrev: () => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSurahIndex, setCurrentSurahIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [isBuffering, setIsBuffering] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // URL Helper
    const getFormattedId = (id: number) => id.toString().padStart(3, '0');
    const currentSurah = SURAH_META[currentSurahIndex];
    const audioSrc = `https://server8.mp3quran.net/afs/${getFormattedId(currentSurah.id)}.mp3`;

    // Audio Element Setup
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
    }, []);

    // Source Change & Autoplay
    useEffect(() => {
        if (audioRef.current) {
            if (audioRef.current.src !== audioSrc) {
                audioRef.current.src = audioSrc;
                audioRef.current.load();
                if (isPlaying) {
                    audioRef.current.play().catch(e => {
                        console.error("Autoplay error:", e);
                        setIsPlaying(false);
                    });
                }
            }
        }
    }, [currentSurahIndex, audioSrc]);

    // Play/Pause & Volume Effect
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.error("Play error:", e);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, volume]);

    // Media Session API
    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSurah.name,
                artist: 'Mishary Rashid Alafasy',
                album: 'Mümin Rehberi - Sesli Kuran',
                artwork: [
                    { src: 'https://cdn-icons-png.flaticon.com/512/3655/3655562.png', sizes: '512x512', type: 'image/png' }
                ]
            });
            navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
            
            navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
            navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
            navigator.mediaSession.setActionHandler('previoustrack', skipPrev);
            navigator.mediaSession.setActionHandler('nexttrack', skipNext);
        }
    }, [currentSurahIndex, isPlaying]);

    // Actions
    const togglePlay = () => setIsPlaying(!isPlaying);
    
    const selectSurah = (index: number) => {
        setCurrentSurahIndex(index);
        setIsPlaying(true);
    };

    const skipNext = () => {
        if (currentSurahIndex < SURAH_META.length - 1) selectSurah(currentSurahIndex + 1);
    };

    const skipPrev = () => {
        if (currentSurahIndex > 0) selectSurah(currentSurahIndex - 1);
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const setVolume = (val: number) => {
        setVolumeState(val);
        if (audioRef.current) audioRef.current.volume = val;
    };

    // Events
    const onTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
    const onLoadedMetadata = () => { if (audioRef.current) { setDuration(audioRef.current.duration); setIsBuffering(false); } };
    const onEnded = () => { skipNext(); };
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onError = (e: any) => { console.error("Audio Error", e); setIsPlaying(false); setIsBuffering(false); };

    return (
        <AudioContext.Provider value={{
            currentSurahIndex, isPlaying, duration, currentTime, volume, isBuffering,
            togglePlay, selectSurah, skipNext, skipPrev, seek, setVolume
        }}>
            {/* Audio Element Hidden in Provider */}
            <audio
                ref={audioRef}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={onEnded}
                onWaiting={onWaiting}
                onPlaying={onPlaying}
                onError={onError}
                preload="auto"
                crossOrigin="anonymous"
            />
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
