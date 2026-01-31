
import React, { useEffect, useState, useRef } from 'react';
import { Loader2, MapPin, Navigation, Settings, Search, AlertTriangle, X, ChevronLeft, Map, RefreshCcw } from './Icons';
import { TURKEY_CITIES } from '../data/turkey_data';

interface QiblaProps {
  onBack: () => void;
}

export const Qibla: React.FC<QiblaProps> = ({ onBack }) => {
  const [heading, setHeading] = useState<number>(0);
  const [qiblaAngle, setQiblaAngle] = useState<number>(0);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAligned, setIsAligned] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [compassSupported, setCompassSupported] = useState(true);
  const [locationName, setLocationName] = useState("Konum Aranıyor...");

  // Animasyon için ref
  const currentHeadingRef = useRef<number>(0);
  const targetHeadingRef = useRef<number>(0);

  const KAABA_LAT = 21.422487;
  const KAABA_LONG = 39.826206;

  // Kıble Açısı Hesaplama
  const calculateQibla = (lat: number, long: number) => {
    const PI = Math.PI;
    const latk = (KAABA_LAT * PI) / 180.0;
    const longk = (KAABA_LONG * PI) / 180.0;
    const phi = (lat * PI) / 180.0;
    const lambda = (long * PI) / 180.0;
    
    const y = Math.sin(longk - lambda);
    const x = Math.cos(phi) * Math.tan(latk) - Math.sin(phi) * Math.cos(longk - lambda);
    
    let qibla = (Math.atan2(y, x) * 180.0) / PI;
    setQiblaAngle((qibla + 360) % 360);
  };

  const startGPS = () => {
    setLoading(true);
    setError(null);
    setLocationName("GPS Bekleniyor...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          calculateQibla(latitude, longitude);
          setLoading(false);
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=tr`)
            .then(res => res.json())
            .then(data => {
                const district = data.address.town || data.address.city_district || data.address.district || "";
                const city = data.address.province || data.address.city || "";
                setLocationName(district && city ? `${district}, ${city}` : "GPS Konumu");
                
                localStorage.setItem('user_location', JSON.stringify({ 
                    name: district && city ? `${district}, ${city}` : "GPS Konumu", 
                    coords: { latitude, longitude } 
                }));
            })
            .catch(() => setLocationName("GPS Konumu"));
        },
        (err) => {
          setLoading(false);
          setError("Konum sinyali alınamadı. GPS'inizin açık olduğundan ve izinlerin verildiğinden emin olun.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setError("Cihazınız konum özelliğini desteklemiyor.");
      setLoading(false);
    }
  };

  const handleManualCitySelect = (cityId: number) => {
      const city = TURKEY_CITIES.find(c => c.id === cityId);
      if (city) {
          calculateQibla(city.latitude, city.longitude);
          setLocationName(city.name);
          setLoading(false);
          setShowCityModal(false);
          localStorage.setItem('user_location', JSON.stringify({ name: city.name, coords: { latitude: city.latitude, longitude: city.longitude } }));
      }
  };

  const openExternalQiblaFinder = () => {
      window.open('https://qiblafinder.withgoogle.com/intl/tr/desktop', '_system');
  };

  // --- COMPASS SENSOR LOGIC ---
  useEffect(() => {
    const saved = localStorage.getItem('user_location');
    if (saved) {
        try {
            const loc = JSON.parse(saved);
            setLocationName(loc.name);
            calculateQibla(loc.coords.latitude, loc.coords.longitude);
            setLoading(false);
        } catch (e) { startGPS(); }
    } else { startGPS(); }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let compass = 0;
      if ((event as any).webkitCompassHeading) {
         compass = (event as any).webkitCompassHeading;
      } 
      else if (event.alpha !== null) {
         if ('absolute' in event && (event as any).absolute === true) {
             compass = 360 - event.alpha;
         } else {
             compass = 360 - event.alpha;
         }
      }
      compass = (compass + 360) % 360;
      targetHeadingRef.current = compass;
      setCompassSupported(true);
    };

    const startCompass = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                } else {
                    setCompassSupported(false);
                    setError("Pusula izni reddedildi. Ayarlardan izin verin.");
                }
            } catch (e) { setCompassSupported(false); }
        } else {
            if ('ondeviceorientationabsolute' in (window as any)) {
                (window as any).addEventListener('deviceorientationabsolute', handleOrientation, true);
            } else if ('ondeviceorientation' in window) {
                window.addEventListener('deviceorientation', handleOrientation, true);
            } else {
                setCompassSupported(false);
            }
        }
    };
    startCompass();

    let animationFrameId: number;
    const animate = () => {
        let current = currentHeadingRef.current;
        let target = targetHeadingRef.current;

        let delta = target - current;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        current += delta * 0.15; 
        currentHeadingRef.current = (current + 360) % 360;
        setHeading(currentHeadingRef.current);

        let diff = Math.abs(currentHeadingRef.current - qiblaAngle);
        if (diff > 180) diff = 360 - diff;
        setIsAligned(diff < 5);

        animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if ('ondeviceorientationabsolute' in window) {
          (window as any).removeEventListener('deviceorientationabsolute', handleOrientation);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [qiblaAngle]);

  if (loading) return <div className="flex flex-col items-center justify-center h-full text-emerald-600 dark:text-emerald-400"><Loader2 className="animate-spin mb-2" size={40}/>Hesaplanıyor...</div>;

  return (
    <div className="flex flex-col h-full bg-warm-200 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0 z-20 relative bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <button onClick={onBack} className="p-3 -ml-3 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm">
              <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Kıble Pusulası</h2>
          <button onClick={startGPS} className="p-3 -mr-3 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors">
              <RefreshCcw size={22} />
          </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 pb-28 text-center animate-fade-in w-full relative overflow-y-auto no-scrollbar">
        
        {/* Info Bar */}
        <div className="w-full flex flex-col items-center mb-8 shrink-0 space-y-3">
            <button onClick={() => setShowCityModal(true)} className="flex items-center space-x-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform">
                <Navigation size={18} className="text-emerald-500" />
                <span className="max-w-[200px] truncate">{locationName}</span>
            </button>

            <button onClick={openExternalQiblaFinder} className="flex items-center space-x-2 text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-xl shadow-lg shadow-blue-600/30 active:scale-95 transition-transform">
                <Map size={14} />
                <span>Haritada Gör (Google)</span>
            </button>

            {!compassSupported && (
                <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-xs font-bold border border-red-100 dark:border-red-900/30">
                    <AlertTriangle size={14} />
                    <span>Manyetik sensör bulunamadı.</span>
                </div>
            )}
        </div>

        {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-8 rounded-3xl border border-red-100 dark:border-red-900/30 w-full max-w-xs mx-auto flex flex-col items-center animate-fade-in shadow-lg">
                <MapPin size={48} className="mb-4 opacity-50"/>
                <p className="font-bold text-lg mb-2">Konum Alınamadı</p>
                <p className="text-sm opacity-80 mb-6 text-center leading-relaxed">{error}</p>
                <div className="flex flex-col w-full space-y-3">
                    <button onClick={startGPS} className="w-full py-3.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-2xl text-sm font-bold shadow-sm active:scale-95 transition-transform">Tekrar Dene</button>
                    <button onClick={() => setShowCityModal(true)} className="w-full py-3.5 bg-red-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-red-200 dark:shadow-red-900/40 active:scale-95 transition-transform">Şehir Seç</button>
                </div>
            </div>
        ) : (
            <div className="relative flex items-center justify-center flex-1 w-full my-4">
                
                {/* 
                    ANA DÖNEN KONTEYNER (DÜNYA) 
                    Bu div, heading (cihazın yönü) kadar tersine döner. 
                    Böylece içindeki "N" harfi daima Kuzeyi gösterir.
                */}
                <div 
                    className="relative transition-transform duration-75 ease-linear will-change-transform"
                    style={{ 
                        width: '75vw', 
                        height: '75vw', 
                        maxWidth: '320px', 
                        maxHeight: '320px',
                        transform: `rotate(${-heading}deg)` 
                    }}
                >
                    {/* 1. DIŞ YÖRÜNGE ÇİZGİSİ (Sabit, Kabe bunun üzerinde dönecek gibi durur) */}
                    <div className={`absolute -inset-10 rounded-full border-2 border-dashed transition-colors duration-500 ${isAligned ? 'border-emerald-300 dark:border-emerald-700 opacity-80' : 'border-slate-300 dark:border-slate-700 opacity-50'}`}></div>

                    {/* 2. PUSULA GÖVDESİ (İÇ) */}
                    <div className={`w-full h-full rounded-full bg-white dark:bg-[#15202b] border-4 border-slate-200 dark:border-slate-800 relative shadow-2xl overflow-hidden transition-all duration-300 ${isAligned ? 'ring-4 ring-emerald-500/30' : ''}`}>
                        
                        {/* Kuzey İşareti (N) */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <span className="text-xl font-black text-red-500 tracking-tighter">N</span>
                            <div className="w-1 h-2 bg-red-500 rounded-full mt-1"></div>
                        </div>

                        {/* Diğer Yönler */}
                        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-lg font-bold text-slate-300 dark:text-slate-600">S</span>
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300 dark:text-slate-600">W</span>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300 dark:text-slate-600">E</span>

                        {/* Derece Çizgileri */}
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="absolute top-0 left-1/2 -translate-x-1/2 origin-bottom h-[50%] pt-2 pointer-events-none opacity-20" style={{ transform: `rotate(${i * 30}deg)` }}>
                                <div className="w-0.5 h-2 bg-slate-900 dark:bg-white rounded-full"></div>
                            </div>
                        ))}

                        {/* Merkez Nokta */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className={`w-3 h-3 rounded-full border-2 bg-white dark:bg-slate-800 shadow-md ${isAligned ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}></div>
                        </div>
                    </div>

                    {/* 3. KIBLE KATMANI (Dönen Konteynerin İçinde, KIBLE AÇISINA GÖRE DÖNER) */}
                    {/* Bu katman "Kuzey"e göre qiblaAngle kadar döner. Kabe ikonu bu katmanın tepesine (dışa) yerleştirilir. */}
                    <div 
                        className="absolute inset-0 pointer-events-none z-20 transition-transform duration-500 ease-out will-change-transform" 
                        style={{ transform: `rotate(${qiblaAngle}deg)` }}
                    >
                        {/* KABE İKONU - PUSULA ÇEMBERİNİN DIŞINDA */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-xl">
                                <div className={`relative transition-transform duration-300 ${isAligned ? 'scale-125' : 'scale-100'}`}>
                                    {/* Kabe Parıltısı */}
                                    {isAligned && <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-40 animate-pulse"></div>}
                                    
                                    {/* Küp Gövde */}
                                    <div className="w-12 h-12 bg-black rounded-lg flex flex-col items-center justify-start border border-slate-600 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                                        {/* Altın Şerit */}
                                        <div className="w-full h-1.5 bg-yellow-400 mt-2.5 shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div>
                                        {/* Kapı Detayı */}
                                        <div className="w-2.5 h-4 bg-yellow-500/80 rounded-t-sm absolute bottom-0 right-2"></div>
                                    </div>
                                    {/* Alt Gölge */}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-black/30 blur-sm rounded-full"></div>
                                </div>
                        </div>

                        {/* KIBLE OKU - MERKEZDEN ÇEMBERİN KENARINA KADAR */}
                        <div className="absolute top-0 bottom-[50%] left-1/2 -translate-x-1/2 w-2 flex flex-col items-center justify-start pt-2">
                            {/* Ok Ucu (Çemberin kenarına yakın) */}
                            <div className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] mb-[-2px] transition-colors duration-300 z-10 ${isAligned ? 'border-b-emerald-500 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] scale-110' : 'border-b-slate-500 dark:border-b-slate-400'}`}></div>
                            
                            {/* Ok Gövdesi (Merkeze kadar) */}
                            <div className={`w-1.5 flex-1 rounded-full transition-all duration-300 ${isAligned ? 'bg-gradient-to-b from-emerald-500 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-b from-slate-400 to-transparent dark:from-slate-600'}`}></div>
                        </div>
                    </div>

                    {/* Sabit Telefon Göstergesi (Kullanıcının baktığı yön) */}
                    <div 
                        className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-40 pointer-events-none transition-opacity duration-300"
                        // Okun "yukarı" sabit kalması için heading kadar tersine döndürülür
                        style={{ transform: `rotate(${heading}deg)` }}
                    >
                        <div className={`w-1 h-5 rounded-full mb-1 transition-all duration-300 ${isAligned ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)] h-6' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] ${isAligned ? 'border-b-emerald-500' : 'border-b-slate-300 dark:border-b-slate-600'}`}></div>
                    </div>

                </div>
            </div>
        )}

        {/* Status Bar - Küçültülmüş Versiyon */}
        <div className={`w-full max-w-[260px] px-5 py-4 rounded-3xl transition-all duration-300 flex flex-col items-center shadow-lg border relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shrink-0 ${isAligned ? 'border-emerald-500 shadow-emerald-500/20' : ''}`}>
            <span className={`text-[10px] uppercase tracking-widest mb-0.5 font-bold z-10 ${isAligned ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {isAligned ? 'KIBLEYİ BULDUNUZ' : 'KIBLE YÖNÜ'}
            </span>
            <div className="flex items-baseline space-x-2 z-10">
                {isAligned ? (
                    <span className="text-2xl font-black tracking-tighter text-emerald-600 dark:text-emerald-500 animate-pulse">
                        ELHAMDÜLİLLAH
                    </span>
                ) : (
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-mono font-bold tracking-tighter text-slate-800 dark:text-white">
                            {qiblaAngle.toFixed(0)}°
                        </span>
                        {!error && (
                            <span className="text-xs font-bold text-amber-500 mt-0.5 animate-pulse">
                                {Math.abs(heading - qiblaAngle) < 180 
                                    ? (heading < qiblaAngle ? 'Sağa Dönün' : 'Sola Dönün')
                                    : (heading < qiblaAngle ? 'Sola Dönün' : 'Sağa Dönün')
                                }
                            </span>
                        )}
                    </div>
                )}
            </div>
            
            {/* Visual Radar Map Effect */}
            <div className="mt-3 w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                 <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 h-full bg-slate-400 dark:bg-slate-600 z-10"></div>
                 <div 
                    className={`absolute top-0 bottom-0 w-10 h-full rounded-full transition-all duration-300 ease-out ${isAligned ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-indigo-500 opacity-50'}`}
                    style={{ left: `calc(50% + ${(heading - qiblaAngle) * -1}px - 20px)` }} 
                 ></div>
            </div>
            
            <div className="mt-2 text-[9px] text-slate-400 dark:text-slate-600 text-center leading-tight px-2 opacity-70">
                *Yanlış gösteriyorsa telefonu 8 çizerek kalibre ediniz.
            </div>
        </div>
      
        {/* Şehir Seçim Modalı */}
        {showCityModal && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-slide-up h-[75vh] sm:h-[80vh] flex flex-col border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Konum Değiştir</h3>
                        <button onClick={() => setShowCityModal(false)} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-700 transition-colors"><X size={24} /></button>
                    </div>
                    <button onClick={() => { startGPS(); setShowCityModal(false); }} className="flex items-center space-x-4 p-5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 rounded-2xl mb-4 active:scale-98 transition-transform border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40">
                        <div className="p-2.5 bg-emerald-200 dark:bg-emerald-800/50 rounded-full"><Navigation size={22} className="fill-current" /></div>
                        <div className="text-left"><span className="font-bold text-base block">GPS Kullan</span><span className="text-xs opacity-70 font-medium">En hassas sonuç için</span></div>
                    </button>
                    
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input type="text" placeholder="Şehir ara..." className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl text-base outline-none transition-all placeholder:text-slate-400" />
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 mt-2">
                        {TURKEY_CITIES.map(city => (
                            <button key={city.id} onClick={() => handleManualCitySelect(city.id)} className="w-full text-left px-5 py-4 rounded-2xl font-bold text-base transition-colors bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-800">
                                {city.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
