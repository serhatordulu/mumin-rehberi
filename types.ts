
export enum AppTab {
  HOME = 'HOME',
  PRAYER_TIMES = 'PRAYER_TIMES',
  ZIKIR = 'ZIKIR',
  QIBLA = 'QIBLA',
  AI_ASSISTANT = 'AI_ASSISTANT', // Artık sadece Chat/Asistan
  CHAT = 'CHAT', // Deprecated olabilir ama geriye dönük uyumluluk için kalsın
  CALENDAR = 'CALENDAR',
  PROFILE = 'PROFILE',
  KAZA = 'KAZA',
  QURAN = 'QURAN',
  AUDIO_QURAN = 'AUDIO_QURAN',
  MOSQUE_FINDER = 'MOSQUE_FINDER',
  NAMES = 'NAMES',
  RAMADAN = 'RAMADAN',
  ZAKAT = 'ZAKAT',
  LIBRARY = 'LIBRARY',
  // Yeni Eklenenler
  HADITH = 'HADITH',
  DUA = 'DUA',
  CUZ = 'CUZ',
  ESMA_HUSNA = 'ESMA_HUSNA',
  QUIZ = 'QUIZ',
  PRIVACY = 'PRIVACY' // Gizlilik Politikası
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface PrayerTimeData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Surah {
  id: number;
  name: string;
  slug: string;
  verse_count: number;
  verses: Verse[];
}

export interface Verse {
  id: number;
  surah_id: number;
  verse_number: number;
  arabic: string;
  turkish: string; // Diyanet Meali
}

// Audio Player Props Interface
export interface AudioPlayerControlProps {
    currentSurahIndex: number;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    isBuffering: boolean;
    volume: number;
    togglePlay: () => void;
    skipNext: () => void;
    skipPrev: () => void;
    seek: (time: number) => void;
    selectSurah: (index: number) => void;
    onVolumeChange: (val: number) => void;
}