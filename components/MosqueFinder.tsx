
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2, RefreshCcw, AlertTriangle, ChevronLeft, ExternalLink, Moon } from './Icons';

interface Mosque {
    id: number;
    name: string;
    lat: number;
    lon: number;
    distance: number; // metre cinsinden
}

// --- SKELETON COMPONENT ---
const MosqueListSkeleton = () => (
    <div className="space-y-3 p-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 skeleton-shimmer shrink-0"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 skeleton-shimmer"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3 skeleton-shimmer"></div>
                    </div>
                </div>
                <div className="w-12 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl skeleton-shimmer"></div>
            </div>
        ))}
    </div>
);

export const MosqueFinder: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [mosques, setMosques] = useState<Mosque[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userLoc, setUserLoc] = useState<{ lat: number, lon: number } | null>(null);

    useEffect(() => {
        findLocationAndMosques();
    }, []);

    const findLocationAndMosques = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Cihazınız konum servisini desteklemiyor.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLoc({ lat: latitude, lon: longitude });
                fetchMosques(latitude, longitude);
            },
            (err) => {
                setError("GPS sinyali alınamadı. Lütfen konum izinlerini kontrol edip açık alanda tekrar deneyin.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const fetchMosques = async (lat: number, lon: number) => {
        try {
            // Overpass API Query: 2000m yarıçapındaki camileri getir
            // amenity=place_of_worship AND religion=muslim
            const query = `
                [out:json][timeout:25];
                (
                  node["amenity"="place_of_worship"]["religion"="muslim"](around:2000,${lat},${lon});
                  way["amenity"="place_of_worship"]["religion"="muslim"](around:2000,${lat},${lon});
                );
                out center;
            `;

            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: query
            });

            if (!response.ok) throw new Error("Sunucu hatası");

            const data = await response.json();
            
            const foundMosques: Mosque[] = data.elements.map((el: any) => {
                const mLat = el.lat || el.center.lat;
                const mLon = el.lon || el.center.lon;
                const dist = calculateDistance(lat, lon, mLat, mLon);
                
                return {
                    id: el.id,
                    name: el.tags.name || "İsimsiz Cami",
                    lat: mLat,
                    lon: mLon,
                    distance: Math.round(dist)
                };
            });

            // Mesafeye göre sırala
            foundMosques.sort((a, b) => a.distance - b.distance);
            
            setMosques(foundMosques);
            if (foundMosques.length === 0) setError("Yakınlarda cami bulunamadı. Daha geniş bir alanda aramayı deneyin.");

        } catch (e) {
            setError("Camiler listelenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    // Haversine Formülü ile mesafe hesaplama (Metre)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // Dünya yarıçapı (metre)
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const openMaps = (lat: number, lon: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=walking`;
        window.open(url, '_blank');
    };

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Yakınlardaki Camiler</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">En yakın ibadethaneler</p>
                </div>
                <button onClick={findLocationAndMosques} disabled={loading} className="p-2 bg-white/50 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:text-emerald-500">
                    <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
                {loading ? (
                    <MosqueListSkeleton />
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white mb-2">Hata Oluştu</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{error}</p>
                        <button onClick={findLocationAndMosques} className="px-6 py-2 bg-white dark:bg-slate-800 rounded-xl font-bold text-sm">Tekrar Dene</button>
                    </div>
                ) : (
                    <div className="space-y-3 p-4">
                        {mosques.map((mosque) => (
                            <div 
                                key={mosque.id} 
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-transform animate-fade-in-up"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                        <Moon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{mosque.name}</h4>
                                        <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                                            <Navigation size={12} className="text-emerald-500" />
                                            <span>{mosque.distance < 1000 ? `${mosque.distance} m` : `${(mosque.distance / 1000).toFixed(1)} km`}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => openMaps(mosque.lat, mosque.lon)}
                                    className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-colors"
                                >
                                    <ExternalLink size={20} />
                                    <span className="text-[9px] font-bold">Tarif</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                {!loading && !error && (
                    <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 pb-20 pt-2">
                        Veriler OpenStreetMap üzerinden sağlanmaktadır.
                    </p>
                )}
            </div>
        </div>
    );
};
