
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Utensils, Coffee, Clock, ChevronLeft, MapPin, Sparkles, Calendar, ChevronDown, Search, X, Check, Navigation, Loader2, BookOpen, Heart } from './Icons';
import { getImsakiye, CITY_TIMES } from '../data/imsakiye_data';

interface RamadanProps {
    onBack: () => void;
}

const RAMADAN_PRAYERS = {
    sahur: {
        title: "Sahur (Niyet) Duası",
        arabic: "نَوَيْتُ أَنْ أَصُومَ صَوْمَ شَهْرِ رَمَضَانَ مِنَ الْفَجْرِ إِلَى الْمَغْرِبِ خَالِصًا لِلّهِ تَعَالَى",
        turkish: "Neveytü en asûme savme şehri Ramadâne minel-fecri ilel-mağribi hâlisan lillâhi teâlâ.",
        meaning: "Niyet ettim Allah rızası için bugünkü Ramazan orucunu tutmaya."
    },
    iftar: {
        title: "İftar Duası",
        arabic: "اَللّٰهُمَّ لَكَ صُمْتُ وَ بِكَ آمَنْتُ وَ عَلَيْكَ تَوَكَّلْتُ وَ عَلَى رِزْقِكَ أَفْطَرْتُ",
        turkish: "Allahümme leke sumtu ve bike âmentü ve aleyke tevekkeltü ve alâ rızkıke eftartü.",
        meaning: "Allah'ım! Senin rızan için oruç tuttum, sana inandım, sana güvendim ve senin rızkınla orucumu açtım."
    }
};

export const Ramadan: React.FC<RamadanProps> = ({ onBack }) => {
    const [selectedCity, setSelectedCity] = useState("İstanbul");
    const [showCityModal, setShowCityModal] = useState(false);
    const [citySearchTerm, setCitySearchTerm] = useState("");
    const [isGpsLoading, setIsGpsLoading] = useState(false);
    const [activePrayer, setActivePrayer] = useState<'sahur' | 'iftar' | null>(null);

    // Şehir listesini veri dosyasından alıp sırala
    const availableCities = Object.keys(CITY_TIMES).sort((a, b) => a.localeCompare(b, 'tr'));

    const filteredCities = availableCities.filter(c => 
        c.toLocaleLowerCase('tr').includes(citySearchTerm.toLocaleLowerCase('tr'))
    );

    // Seçilen şehre göre veriyi oluştur
    const imsakiye = getImsakiye(selectedCity);

    // Bugünün tarihini bulup ona göre "Bugün" kartını gösterme mantığı
    const todayDate = new Date();
    const currentDayStr = todayDate.getDate().toString().padStart(2, '0');
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const currentMonthStr = months[todayDate.getMonth()];
    const dateString = `${currentDayStr} ${currentMonthStr}`;
    
    // Veri içindeki tarihle eşleşeni bul
    const todayIndex = imsakiye.findIndex(d => d.gregorianDate === dateString);

    // Eğer bugün Ramazan içindeyse o günü, değilse ilk günü göster
    const displayIndex = todayIndex !== -1 ? todayIndex : 0; 
    const todayData = imsakiye[displayIndex];

    const handleGpsLocation = () => {
        setIsGpsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // OpenStreetMap Nominatim API ile koordinattan il ismini bul
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=tr`);
                    const data = await response.json();
                    
                    if (data && data.address) {
                        const province = data.address.province || data.address.city;
                        
                        if (province) {
                            // Gelen il ismini listemizdeki ile eşleştirmeye çalış
                            const matchedCity = availableCities.find(c => 
                                c.toLocaleLowerCase('tr') === province.toLocaleLowerCase('tr') || 
                                province.toLocaleLowerCase('tr').includes(c.toLocaleLowerCase('tr'))
                            );

                            if (matchedCity) {
                                setSelectedCity(matchedCity);
                                setShowCityModal(false);
                                setCitySearchTerm("");
                            } else {
                                alert("Bulunduğunuz konum listedeki illerle eşleştirilemedi.");
                            }
                        } else {
                            alert("Şehir bilgisi alınamadı.");
                        }
                    }
                } catch (error) {
                    console.error(error);
                    alert("Konum servisine erişilemedi.");
                } finally {
                    setIsGpsLoading(false);
                }
            }, (error) => {
                console.error(error);
                alert("Konum izni verilmedi veya GPS kapalı.");
                setIsGpsLoading(false);
            });
        } else {
            alert("Cihazınız konum özelliğini desteklemiyor.");
            setIsGpsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Ramazan İmsakiyesi</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">1447 Hicri - 2026 Miladi</p>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                
                {/* City Selector Button */}
                <button 
                    onClick={() => setShowCityModal(true)}
                    className="w-full flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full">
                            <MapPin size={20} />
                        </div>
                        <div className="text-left">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Şehir / İlçe</span>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedCity}</div>
                        </div>
                    </div>
                    <ChevronDown size={20} className="text-slate-400" />
                </button>

                {/* Dua Butonları */}
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setActivePrayer('sahur')}
                        className="flex items-center justify-center gap-2 p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold text-sm border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-200 transition-colors active:scale-95"
                    >
                        <Moon size={16} /> Niyet Et (Sahur)
                    </button>
                    <button 
                        onClick={() => setActivePrayer('iftar')}
                        className="flex items-center justify-center gap-2 p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl font-bold text-sm border border-amber-200 dark:border-amber-800/50 hover:bg-amber-200 transition-colors active:scale-95"
                    >
                        <Utensils size={16} /> İftar Duası
                    </button>
                </div>

                {/* Today Card */}
                {todayData && (
                    <div className={`rounded-3xl p-6 text-white shadow-xl relative overflow-hidden transition-all duration-500 ${todayData.isKadir ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-700' : 'bg-gradient-to-br from-emerald-600 to-teal-800'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Moon size={100} />
                        </div>
                        
                        <div className="relative z-10 flex justify-between items-start mb-6">
                            <div>
                                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${todayData.isKadir ? 'bg-amber-500 text-white' : 'bg-white/20 text-emerald-100'}`}>
                                    {todayIndex !== -1 ? "Bugün" : `${todayData.hijriDay}. Gün`}
                                </span>
                                <h3 className="text-3xl font-bold mt-2">{todayData.gregorianDate}</h3>
                                <p className={`text-sm font-medium ${todayData.isKadir ? 'text-amber-200' : 'text-emerald-100'}`}>{todayData.dayName} • {todayData.hijriDay}. Ramazan</p>
                            </div>
                            {todayData.isKadir && (
                                <div className="flex flex-col items-center animate-pulse">
                                    <Sparkles size={28} className="text-yellow-300" />
                                    <span className="text-[10px] font-bold text-yellow-300 mt-1 uppercase tracking-wider text-center bg-black/20 px-2 py-1 rounded-lg">Kadir Gecesi</span>
                                </div>
                            )}
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center border border-white/10">
                                <div className={`flex items-center gap-2 mb-1 ${todayData.isKadir ? 'text-amber-100' : 'text-emerald-100'}`}>
                                    <Coffee size={16} />
                                    <span className="text-xs font-bold uppercase">Sahur (İmsak)</span>
                                </div>
                                <span className="text-3xl font-mono font-bold">{todayData.imsak}</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center border border-white/20">
                                <div className="flex items-center gap-2 mb-1 text-white">
                                    <Utensils size={16} />
                                    <span className="text-xs font-bold uppercase">İftar (Akşam)</span>
                                </div>
                                <span className="text-3xl font-mono font-bold">{todayData.iftar}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* List Header */}
                <div className="flex items-center gap-2 px-2 mt-4">
                    <Calendar size={18} className="text-slate-400" />
                    <h3 className="font-bold text-slate-700 dark:text-slate-300">Tüm Ayın İmsakiyesi</h3>
                </div>

                {/* List Container */}
                <div className="space-y-3 pb-24">
                    {imsakiye.map((day, idx) => {
                        const isTodayRow = idx === displayIndex && todayIndex !== -1;
                        const isKadir = day.isKadir;
                        const isPast = todayIndex !== -1 && idx < todayIndex;

                        return (
                            <div 
                                key={idx} 
                                className={`
                                    relative p-4 rounded-2xl border transition-all duration-300
                                    ${isTodayRow 
                                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 ring-1 ring-emerald-500 shadow-md' 
                                        : (isKadir 
                                            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-400 dark:border-amber-600 shadow-sm' 
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                                        )
                                    }
                                    ${isPast ? 'opacity-60 grayscale-[0.5]' : ''}
                                `}
                            >
                                {isKadir && (
                                    <div className="absolute top-0 right-0 p-2 text-amber-500 opacity-20 pointer-events-none">
                                        <Sparkles size={60} />
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    {/* Sol Taraf: Gün ve Tarih */}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm ${
                                            isKadir 
                                            ? 'bg-amber-500 text-white' 
                                            : (isTodayRow 
                                                ? 'bg-emerald-600 text-white' 
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
                                        }`}>
                                            <span className="text-[10px] uppercase font-bold opacity-80">Gün</span>
                                            <span className="text-lg font-bold leading-none">{day.hijriDay}</span>
                                        </div>
                                        
                                        <div className="flex flex-col">
                                            <span className={`text-base font-bold ${isTodayRow || isKadir ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {day.gregorianDate}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{day.dayName}</span>
                                                {isKadir && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-1 dark:bg-amber-900 dark:text-amber-300">Kadir Gecesi</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sağ Taraf: Vakitler */}
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        {/* İmsak */}
                                        <div className={`flex flex-col items-center justify-center w-16 py-1.5 rounded-xl border ${
                                            isTodayRow || isKadir 
                                            ? 'bg-white/80 dark:bg-black/20 border-black/5 dark:border-white/10' 
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                                        }`}>
                                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                                                <Coffee size={10} /> Sahur
                                            </div>
                                            <span className={`text-sm font-mono font-bold ${isTodayRow ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {day.imsak}
                                            </span>
                                        </div>

                                        {/* İftar */}
                                        <div className={`flex flex-col items-center justify-center w-16 py-1.5 rounded-xl border ${
                                            isTodayRow || isKadir
                                            ? 'bg-emerald-100/50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' 
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                                        }`}>
                                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                                                <Utensils size={10} /> İftar
                                            </div>
                                            <span className={`text-sm font-mono font-bold ${isTodayRow ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {day.iftar}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="text-center py-6 text-[10px] text-slate-400 dark:text-slate-600 leading-tight opacity-70">
                    <p>Veriler doğrudan Din İşleri Yüksek Kurulu'ndan alınmıştır.</p>
                </div>
            </div>

            {/* Prayer Modal */}
            {activePrayer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={() => setActivePrayer(null)}>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-700 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        
                        <div className={`absolute top-0 left-0 w-full h-24 ${activePrayer === 'sahur' ? 'bg-indigo-600' : 'bg-amber-600'}`}></div>
                        
                        {/* Z-Index artırıldı (z-10 -> z-50) */}
                        <button onClick={() => setActivePrayer(null)} className="absolute top-4 right-4 p-2 bg-black/20 text-white rounded-full hover:bg-black/30 transition-colors z-50">
                            <X size={20} />
                        </button>

                        <div className="relative z-10 flex flex-col items-center pt-2">
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg mb-4 text-slate-900 dark:text-white border-4 border-white dark:border-slate-800">
                                {activePrayer === 'sahur' ? <Moon size={32} className="text-indigo-600" /> : <Utensils size={32} className="text-amber-600" />}
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                {RAMADAN_PRAYERS[activePrayer].title}
                            </h3>

                            <div className="w-full space-y-6 text-center">
                                <p className="text-2xl font-['Amiri'] leading-loose text-slate-800 dark:text-slate-200" dir="rtl">
                                    {RAMADAN_PRAYERS[activePrayer].arabic}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                    "{RAMADAN_PRAYERS[activePrayer].turkish}"
                                </p>
                                <div className={`p-4 rounded-xl text-sm font-medium ${activePrayer === 'sahur' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300'}`}>
                                    {RAMADAN_PRAYERS[activePrayer].meaning}
                                </div>
                            </div>

                            <button onClick={() => setActivePrayer(null)} className={`mt-6 w-full py-3.5 rounded-xl text-white font-bold shadow-lg active:scale-95 transition-transform ${activePrayer === 'sahur' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
                                Allah Kabul Etsin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* City Selection Modal */}
            {showCityModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-sm h-[80vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up flex flex-col border border-slate-200 dark:border-slate-700">
                        
                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Konum Seç</h3>
                            <button onClick={() => setShowCityModal(false)} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-500"><X size={20}/></button>
                        </div>

                        <div className="relative mb-4 shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Şehir ara..."
                                value={citySearchTerm}
                                onChange={(e) => setCitySearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                            {/* GPS Button */}
                            <button 
                                onClick={handleGpsLocation}
                                disabled={isGpsLoading}
                                className="w-full flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl mb-3 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-left border border-emerald-100 dark:border-emerald-800/30"
                            >
                                {isGpsLoading ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
                                <span className="font-bold text-sm">Mevcut Konumu Bul (GPS)</span>
                            </button>

                            {filteredCities.map(city => (
                                <button
                                    key={city}
                                    onClick={() => { setSelectedCity(city); setShowCityModal(false); setCitySearchTerm(""); }}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-colors flex justify-between items-center ${
                                        selectedCity === city
                                        ? 'bg-emerald-600 text-white shadow-md' 
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'
                                    }`}
                                >
                                    <span>{city}</span>
                                    {selectedCity === city && <Check size={16} />}
                                </button>
                            ))}
                            {filteredCities.length === 0 && (
                                <div className="text-center py-10 text-slate-400">Sonuç bulunamadı.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
