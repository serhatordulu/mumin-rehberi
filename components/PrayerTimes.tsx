
import React, { useEffect, useState } from 'react';
import { AppTab } from '../types';
import { Loader2, Bell, BellOff, Navigation, X, Layers, Check, AlertTriangle, RefreshCcw, Search, ChevronDown, Lock, ChevronLeft } from './Icons';
import { DailyWidget } from './DailyWidget';
import { TURKEY_CITIES, getDistrictsForCity } from '../data/turkey_data';
import { useApp } from '../contexts/AppContext';
import { CountdownTimer } from './CountdownTimer';

// Custom Hooks
import { useLocation } from '../hooks/useLocation';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { usePrayerAlarms } from '../hooks/usePrayerAlarms';

const ALARM_OPTIONS = [
    { label: "45 dk Önce", value: -45 },
    { label: "30 dk Önce", value: -30 },
    { label: "15 dk Önce", value: -15 },
    { label: "Tam Vaktinde", value: 0 },
    { label: "15 dk Sonra", value: 15 },
    { label: "30 dk Sonra", value: 30 },
];

const PrayerTimesSkeleton = () => (
    <div className="h-full p-4 sm:p-6 space-y-6 animate-pulse">
        <div className="h-[240px] rounded-3xl bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
            <div className="absolute top-4 left-4 h-8 w-32 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="absolute top-4 right-4 h-8 w-8 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="h-4 w-24 bg-slate-300 dark:bg-slate-700 rounded"></div>
                <div className="h-10 w-48 bg-slate-300 dark:bg-slate-700 rounded"></div>
                <div className="flex gap-4">
                    <div className="h-16 w-16 bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
                    <div className="h-16 w-16 bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
                    <div className="h-16 w-16 bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
                </div>
            </div>
        </div>
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800"></div>
        <div className="rounded-3xl bg-slate-200 dark:bg-slate-800 p-1 space-y-1">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-14 bg-slate-300 dark:bg-slate-700 rounded-2xl mx-2 my-2 opacity-50"></div>
            ))}
        </div>
    </div>
);

export const PrayerTimes: React.FC = () => {
  const { setActiveTab } = useApp();
  
  // Custom Hooks Usage
  const { location, refreshLocation, setManualLocation } = useLocation();
  const { times, nextDayImsak, loading: timesLoading, error: timesError } = usePrayerTimes(location.coords);
  const { alarms, alarmOffsets, toggleAlarm, removeAlarm } = usePrayerAlarms();

  // Local Component State
  const [currentPrayerLabel, setCurrentPrayerLabel] = useState("");
  
  // Modal States
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [modalView, setModalView] = useState<'cities' | 'districts'>('cities');
  const [selectedCityForDistricts, setSelectedCityForDistricts] = useState<typeof TURKEY_CITIES[0] | null>(null);
  const [isDistrictLoading, setIsDistrictLoading] = useState(false);
  
  const [activeModalPrayer, setActiveModalPrayer] = useState<{name: string, time: string} | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ 
    title: '', 
    message: '', 
    type: 'info' as 'info' | 'success' | 'error' 
  });
  
  const [completedPrayers, setCompletedPrayers] = useState<string[]>([]);

  // Helpers
  const cleanTimeStr = (timeStr: string) => timeStr ? timeStr.split(' ')[0] : "00:00";
  const getMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const cleaned = cleanTimeStr(timeStr);
    const [h, m] = cleaned.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return 0;
    return h * 60 + m;
  };

  // Completed Prayers Persistence
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`completed_prayers_${today}`);
    if (stored) {
        setCompletedPrayers(JSON.parse(stored));
    }
  }, []);

  // Alarm Management
  const openAlarmSettings = (prayerName: string, prayerTime: string) => {
      setActiveModalPrayer({ name: prayerName, time: cleanTimeStr(prayerTime) });
  };

  const handleConfigureAlarm = async (offset: number) => {
      if (!activeModalPrayer) return;
      
      const result = await toggleAlarm(activeModalPrayer.name, activeModalPrayer.time, offset);
      
      if (result.success) {
          if(navigator.vibrate) navigator.vibrate(50);
          setActiveModalPrayer(null);
      } else {
          setModalContent({
              title: "Hata",
              message: result.error || "Bir hata oluştu.",
              type: "error"
          });
          setShowModal(true);
      }
  };

  const handleDisableAlarm = async () => {
      if (!activeModalPrayer) return;
      await removeAlarm(activeModalPrayer.name);
      setActiveModalPrayer(null);
      if(navigator.vibrate) navigator.vibrate([50, 50]);
  };

  // Prayer Completion Logic
  const handlePrayerComplete = (prayerName: string, prayerTime: string) => {
    const today = new Date().toDateString();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const pMinutes = getMinutes(prayerTime);
    
    if (currentMinutes < pMinutes) {
        setModalContent({
            title: "Vakit Girmedi",
            message: `${prayerName} vakti henüz girmediği için tamamlandı olarak işaretleyemezsiniz.`,
            type: "error"
        });
        setShowModal(true);
        return;
    }

    const isAlreadyCompleted = completedPrayers.includes(prayerName);
    let newCompleted;
    
    const savedStats = localStorage.getItem('user_stats');
    let stats = savedStats ? JSON.parse(savedStats) : {
        totalZikir: 0, totalPrayers: 0, streak: 1, xp: 0, level: 1, lastLogin: today
    };

    if (isAlreadyCompleted) {
        newCompleted = completedPrayers.filter(p => p !== prayerName);
        if (stats.totalPrayers > 0) stats.totalPrayers -= 1;
    } else {
        newCompleted = [...completedPrayers, prayerName];
        stats.totalPrayers += 1;
        
        // Görev Tamamlama Mantığı (Basitleştirilmiş)
        const savedTasks = localStorage.getItem('daily_tasks');
        if (savedTasks) {
            let tasks = JSON.parse(savedTasks);
            let tasksUpdated = false;
            let xpGained = 0;
            tasks = tasks.map((t: any) => {
                if (!t.completed && t.type === 'prayer') {
                    t.current += 1;
                    tasksUpdated = true;
                    if (t.current >= t.target && !t.completed) {
                        t.completed = true;
                        xpGained += t.xpReward;
                    }
                }
                return t;
            });
            if (tasksUpdated) {
                localStorage.setItem('daily_tasks', JSON.stringify(tasks));
                if (xpGained > 0) stats.xp += xpGained;
            }
        }
    }

    setCompletedPrayers(newCompleted);
    localStorage.setItem(`completed_prayers_${today}`, JSON.stringify(newCompleted));
    localStorage.setItem('user_stats', JSON.stringify(stats));
  };

  // Location Modal Handlers
  const handleCitySelect = (city: typeof TURKEY_CITIES[0]) => {
      setSelectedCityForDistricts(city);
      setModalView('districts');
      setCitySearchTerm("");
  };

  const handleDistrictSelect = async (district: string) => {
      if (!selectedCityForDistricts) return;
      setIsDistrictLoading(true);
      
      await setManualLocation(selectedCityForDistricts, district);
      
      setIsDistrictLoading(false);
      setShowLocationModal(false);
      setModalView('cities');
      setSelectedCityForDistricts(null);
  };

  const handleModalBack = () => {
      if (modalView === 'districts') {
          setModalView('cities');
          setSelectedCityForDistricts(null);
          setCitySearchTerm("");
      } else {
          setShowLocationModal(false);
      }
  };

  const filteredCities = TURKEY_CITIES.filter(c => 
      c.name.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  const filteredDistricts = selectedCityForDistricts 
      ? getDistrictsForCity(selectedCityForDistricts.name).filter(d => d.toLowerCase().includes(citySearchTerm.toLowerCase()))
      : [];

  // --- LİSTE VURGULAMA MANTIĞI ---
  useEffect(() => {
    if (!times) return;

    const determineCurrentPrayer = () => {
        const now = new Date();
        const nowMs = now.getTime();
        
        const createDate = (timeStr: string) => {
            const [h, m] = timeStr.split(' ')[0].split(':').map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            return d;
        };

        const prayers = [
            { name: 'İmsak', date: createDate(times.Imsak) },
            { name: 'Güneş', date: createDate(times.Sunrise) },
            { name: 'Öğle', date: createDate(times.Dhuhr) },
            { name: 'İkindi', date: createDate(times.Asr) },
            { name: 'Akşam', date: createDate(times.Maghrib) },
            { name: 'Yatsı', date: createDate(times.Isha) },
        ];

        let nextIdx = prayers.findIndex(p => p.date.getTime() > nowMs);

        if (nextIdx !== -1) {
            setCurrentPrayerLabel(prayers[nextIdx].name);
        } else {
            setCurrentPrayerLabel('İmsak');
        }
    };

    determineCurrentPrayer();
    const interval = setInterval(determineCurrentPrayer, 60000);
    return () => clearInterval(interval);
  }, [times]);

  if (location.loading && !times) return <PrayerTimesSkeleton />;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 pb-24 relative no-scrollbar">
      
      {/* Üst Kart */}
      <CountdownTimer
         times={times}
         nextDayImsak={nextDayImsak}
         locationName={location.name}
         isLocationRefreshing={location.loading}
         onRefreshLocation={refreshLocation}
         onLocationClick={() => { setShowLocationModal(true); setModalView('cities'); }}
      />

      {/* Seyahat Uyarısı - Sadeleştirildi */}
      <div className="flex items-center gap-3 px-4 py-3 mx-2 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-xl animate-fade-in-up delay-100">
          <AlertTriangle size={18} className="text-amber-600 dark:text-amber-500 shrink-0" />
          <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
              Seyahat halindeyseniz doğru vakitler için konumu yenileyiniz.
          </p>
      </div>

      <DailyWidget />
      
      {(location.error || timesError) && (
          <div className="text-red-600 dark:text-red-400 text-sm font-bold text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30">
              {location.error || timesError}
          </div>
      )}

      {/* Vakitler Listesi - Ferahlatıldı */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        {times && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[ { label: 'İmsak', time: times.Imsak }, { label: 'Güneş', time: times.Sunrise }, { label: 'Öğle', time: times.Dhuhr }, { label: 'İkindi', time: times.Asr }, { label: 'Akşam', time: times.Maghrib }, { label: 'Yatsı', time: times.Isha } ].map((item, idx) => {
              const isHighlighted = currentPrayerLabel === item.label;
              const isAlarmSet = alarms[item.label] || false;
              const savedOffset = alarmOffsets[item.label] || 0;
              const isCompleted = completedPrayers.includes(item.label);
              
              const now = new Date();
              const [h, m] = cleanTimeStr(item.time).split(':').map(Number);
              const pDate = new Date(); pDate.setHours(h, m, 0, 0);
              const isTimeEntered = now >= pDate;

              const delayClass = idx === 0 ? '' : idx === 1 ? 'delay-100' : idx === 2 ? 'delay-200' : idx === 3 ? 'delay-300' : idx === 4 ? 'delay-400' : 'delay-500';

              return (
                <div key={idx} className={`flex justify-between items-center px-5 py-4 transition-all opacity-0 animate-fade-in-up ${delayClass} ${isHighlighted ? 'bg-emerald-50/80 dark:bg-emerald-900/20' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => openAlarmSettings(item.label, item.time)} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 relative ${isAlarmSet ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                      {isAlarmSet ? <Bell size={20} fill="currentColor" /> : <BellOff size={20} />}
                      {isAlarmSet && savedOffset !== 0 && (
                          <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md border-2 border-white dark:border-slate-900 shadow-sm">
                              {savedOffset > 0 ? '+' : ''}{savedOffset}
                          </div>
                      )}
                    </button>
                    <div>
                        <span className={`block font-bold text-lg leading-none mb-1 ${isHighlighted ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>{item.label}</span>
                        {isHighlighted && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">Şu Anki Vakit</span>
                        )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                      <span className={`font-black text-2xl font-mono tracking-tight ${isHighlighted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>{cleanTimeStr(item.time)}</span>
                      
                      {/* Tamamlama Butonu */}
                      {/* Vakit girmediyse kilitli, girdiyse tiklenebilir */}
                      <button 
                        onClick={() => handlePrayerComplete(item.label, item.time)} 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                            isCompleted 
                            ? 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-lg' 
                            : (isTimeEntered 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-emerald-500' 
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 cursor-not-allowed')
                        }`}
                      >
                          {isCompleted ? <Check size={20} strokeWidth={3} /> : (isTimeEntered ? <Check size={20} /> : <Lock size={16} />)}
                      </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Alarm Settings Modal */}
      {activeModalPrayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={() => setActiveModalPrayer(null)}>
              <div className="bg-slate-100 dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-700 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeModalPrayer.name} Bildirimi</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Vakit: {activeModalPrayer.time}</p>
                      </div>
                      <button onClick={() => setActiveModalPrayer(null)} className="p-3 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-300 transition-colors"><X size={24} /></button>
                  </div>

                  <div className="space-y-3 mb-6">
                      {ALARM_OPTIONS.map((opt, idx) => {
                          const currentOffset = alarmOffsets[activeModalPrayer.name];
                          const isActive = alarms[activeModalPrayer.name] && currentOffset === opt.value;
                          return (
                              <button key={idx} onClick={() => handleConfigureAlarm(opt.value)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'}`}>
                                  <span className="font-bold text-base">{opt.label}</span>
                                  {isActive && <div className="bg-emerald-500 text-white rounded-full p-1"><Check size={16} strokeWidth={3} /></div>}
                              </button>
                          )
                      })}
                  </div>

                  {alarms[activeModalPrayer.name] && (
                      <button onClick={handleDisableAlarm} className="w-full py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold border border-red-100 dark:border-red-900/30 active:scale-95 transition-transform flex items-center justify-center gap-2 text-base shadow-sm">
                          <BellOff size={20} /> Bildirimi Kapat
                      </button>
                  )}
              </div>
          </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-100 dark:bg-slate-900 w-full max-w-md h-[85vh] sm:h-[650px] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-slide-up flex flex-col border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-5 shrink-0">
                      {modalView === 'districts' ? (
                          <div className="flex items-center gap-3">
                              <button onClick={handleModalBack} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                  <ChevronLeft size={24} />
                              </button>
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                  {selectedCityForDistricts?.name}
                              </h3>
                          </div>
                      ) : (
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Şehir Değiştir</h3>
                      )}
                      
                      <button onClick={handleModalBack} className="p-3 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Search Bar - Larger */}
                  <div className="relative mb-4 shrink-0">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                      <input 
                          type="text" 
                          placeholder={modalView === 'districts' ? "İlçe ara..." : "Şehir ara..."}
                          value={citySearchTerm}
                          onChange={(e) => setCitySearchTerm(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 text-lg shadow-sm"
                      />
                  </div>

                  {/* Content List */}
                  {isDistrictLoading ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                          <Loader2 className="animate-spin mb-3" size={40} />
                          <p className="text-base font-medium">Konum verisi alınıyor...</p>
                      </div>
                  ) : (
                      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                          {modalView === 'cities' && (
                              <button 
                                  onClick={() => { refreshLocation(); setShowLocationModal(false); }}
                                  className="w-full flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 rounded-2xl mb-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-left border border-emerald-100 dark:border-emerald-800/30"
                              >
                                  <div className="p-2 bg-emerald-200 dark:bg-emerald-800/50 rounded-full"><Navigation size={20} /></div>
                                  <span className="font-bold text-base">Mevcut Konumu Kullan (GPS)</span>
                              </button>
                          )}
                          
                          {modalView === 'cities' ? (
                              filteredCities.map(city => (
                                  <button
                                      key={city.id}
                                      onClick={() => handleCitySelect(city)}
                                      className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-base transition-colors flex justify-between items-center ${
                                          (selectedCityForDistricts?.name === city.name)
                                          ? 'bg-emerald-600 text-white shadow-md' 
                                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-800'
                                      }`}
                                  >
                                      <span>{city.name}</span>
                                      <ChevronLeft size={20} className="rotate-180 opacity-50" />
                                  </button>
                              ))
                          ) : (
                              filteredDistricts.length > 0 ? (
                                  filteredDistricts.map((district, idx) => (
                                      <button
                                          key={idx}
                                          onClick={() => handleDistrictSelect(district)}
                                          className="w-full text-left px-5 py-4 rounded-2xl font-bold text-base transition-colors flex justify-between items-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-800"
                                      >
                                          <span>{district}</span>
                                      </button>
                                  ))
                              ) : (
                                  <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-base">
                                      İlçe bulunamadı.
                                  </div>
                              )
                          )}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Info/Error Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-100 dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className={`p-5 rounded-full mb-5 ${modalContent.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
                        {modalContent.type === 'error' ? <AlertTriangle size={40}/> : <Bell size={40}/>}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{modalContent.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium">{modalContent.message}</p>
                </div>
                <div className="space-y-3">
                    <button onClick={() => setShowModal(false)} className={`w-full py-4 rounded-2xl font-bold text-lg active:scale-[0.98] transition-transform bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 shadow-lg`}>Tamam</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
