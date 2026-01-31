
import { Surah, Verse } from "../types";
import { JUZ_BOUNDARIES, SURAH_META } from "../data/quran_data";

const DB_NAME = 'NurAppDB';
const DB_VERSION = 2; // Hadis eklendiği için versiyon artırıldı
const STORE_NAME = 'quran_full';
const HADITH_STORE_NAME = 'hadith_bukhari';

// Tarayıcı veritabanını açar
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject("Veritabanı açılamadı.");

        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            
            // Kuran Store
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }

            // Hadis Store (Yeni)
            if (!db.objectStoreNames.contains(HADITH_STORE_NAME)) {
                const hadithStore = db.createObjectStore(HADITH_STORE_NAME, { keyPath: 'hadithNumber' });
                // Sayfalama için index
                hadithStore.createIndex('pageIndex', 'pageIndex', { unique: false });
            }
        };
    });
};

// --- KURAN FONKSİYONLARI ---

export const checkQuranDataExists = async (): Promise<boolean> => {
    try {
        const db = await openDB();
        return new Promise((resolve) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const countRequest = store.count();

            countRequest.onsuccess = () => {
                resolve(countRequest.result > 0);
            };
            countRequest.onerror = () => resolve(false);
        });
    } catch (e) {
        return false;
    }
};

export const saveQuranToDB = async (data: Surah[]): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        data.forEach(surah => {
            store.put(surah);
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject("Kaydetme hatası.");
    });
};

export const getSurahFromDB = async (id: number): Promise<Surah | undefined> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Veri okuma hatası.");
    });
};

export const getJuzFromDB = async (juzId: number): Promise<{verses: Verse[], meta: string} | null> => {
    const boundary = JUZ_BOUNDARIES.find(j => j.id === juzId);
    if (!boundary) return null;

    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            
            const startSurahId = boundary.start.s;
            const endSurahId = boundary.end.s;
            
            const range = IDBKeyRange.bound(startSurahId, endSurahId);
            const request = store.openCursor(range);
            
            let accumulatedVerses: Verse[] = [];

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
                if (cursor) {
                    const surah = cursor.value as Surah;
                    let versesToAdd = surah.verses;

                    if (surah.id === startSurahId) {
                        versesToAdd = versesToAdd.filter(v => v.verse_number >= boundary.start.v);
                    }
                    
                    if (surah.id === endSurahId) {
                        versesToAdd = versesToAdd.filter(v => v.verse_number <= boundary.end.v);
                    }

                    const versesWithSurahName = versesToAdd.map(v => ({...v, surahName: surah.name}));
                    accumulatedVerses = [...accumulatedVerses, ...versesWithSurahName];
                    cursor.continue();
                } else {
                    resolve({
                        verses: accumulatedVerses,
                        meta: `${SURAH_META.find(s=>s.id === startSurahId)?.name} ${boundary.start.v} - ${SURAH_META.find(s=>s.id === endSurahId)?.name} ${boundary.end.v}`
                    });
                }
            };
            
            request.onerror = () => reject("Veri okuma hatası.");
        });
    } catch (e) {
        return null;
    }
};

export const clearQuranDB = async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject();
    });
};

// --- HADİS FONKSİYONLARI ---

export const checkHadithDataExists = async (): Promise<boolean> => {
    try {
        const db = await openDB();
        return new Promise((resolve) => {
            const transaction = db.transaction([HADITH_STORE_NAME], 'readonly');
            const store = transaction.objectStore(HADITH_STORE_NAME);
            const countRequest = store.count();
            countRequest.onsuccess = () => resolve(countRequest.result > 0);
            countRequest.onerror = () => resolve(false);
        });
    } catch (e) {
        return false;
    }
};

export const saveHadithsToDB = async (hadiths: any[]): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([HADITH_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(HADITH_STORE_NAME);

        hadiths.forEach((h, index) => {
            store.put({
                hadithNumber: h.hadithnumber, // Unique ID from API
                text: h.text,
                reference: h.reference, // Varsa
                grades: h.grades, // Varsa
                pageIndex: Math.floor(index / 50) + 1 // 1. Sayfa, 2. Sayfa...
            });
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = (e) => {
            console.error(e);
            reject("Hadis kaydetme hatası.");
        };
    });
};

export const getHadithsByPage = async (page: number): Promise<any[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([HADITH_STORE_NAME], 'readonly');
        const store = transaction.objectStore(HADITH_STORE_NAME);
        const index = store.index('pageIndex');
        const request = index.getAll(page);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Hadis okuma hatası.");
    });
};

export const searchHadiths = async (query: string): Promise<any[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([HADITH_STORE_NAME], 'readonly');
        const store = transaction.objectStore(HADITH_STORE_NAME);
        const request = store.openCursor();
        
        const results: any[] = [];
        
        // Türkçe karakter ve şapkalı harf normalizasyonu
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

        const normalizedQuery = normalizeSearchText(query);

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
            if (cursor) {
                const hadith = cursor.value;
                
                // Normalizasyon ile karşılaştırma
                if (hadith.text && normalizeSearchText(hadith.text).includes(normalizedQuery)) {
                    results.push(hadith);
                }
                
                // Limit search results to avoid freezing UI
                if (results.length >= 100) {
                    resolve(results);
                    return;
                }
                
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        
        request.onerror = () => reject("Arama hatası.");
    });
};

export const clearHadithDB = async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([HADITH_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(HADITH_STORE_NAME);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject();
    });
};
