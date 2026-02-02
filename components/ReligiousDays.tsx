
import React, { useState, useEffect } from 'react';
import { Calendar, Moon, Star, Gift, Layers, BookOpen, Bell, BellOff, Check, X, Clock, ChevronLeft } from './Icons';
import { NotificationService } from '../services/notificationService';

interface ReligiousDaysProps {
    onBack: () => void;
}

interface Holiday {
    name: string;
    date: string; // YYYY-MM-DD
    icon: any;
    desc: string;
}

// 2026 Dini Günler (Kullanıcı Tarafından Belirtilen Liste)
const STATIC_HOLIDAYS_2026: Holiday[] = [
    { name: "Miraç Kandili", date: "2026-01-15", icon: Star, desc: "26 Receb 1447 - Perşembe" },
    { name: "Berat Kandili", date: "2026-02-02", icon: Star, desc: "14 Şaban 1447 - Pazartesi" },
    { name: "Ramazan Başlangıcı", date: "2026-02-19", icon: Moon, desc: "1 Ramazan 1447 - Perşembe" },
    { name: "Kadir Gecesi", date: "2026-03-16", icon: Star, desc: "26 Ramazan 1447 - Pazartesi" },
    { name: "Arefe (Ramazan)", date: "2026-03-19", icon: Calendar, desc: "29 Ramazan 1447 - Perşembe" },
    { name: "Ramazan Bayramı (1. Gün)", date: "2026-03-20", icon: Gift, desc: "1 Şevval 1447 - Cuma" },
    { name: "Ramazan Bayramı (2. Gün)", date: "2026-03-21", icon: Gift, desc: "2 Şevval 1447 - Cumartesi" },
    { name: "Ramazan Bayramı (3. Gün)", date: "2026-03-22", icon: Gift, desc: "3 Şevval 1447 - Pazar" },
    { name: "Arefe (Kurban)", date: "2026-05-26", icon: Calendar, desc: "9 Zilhicce 1447 - Salı" },
    { name: "Kurban Bayramı (1. Gün)", date: "2026-05-27", icon: Gift, desc: "10 Zilhicce 1447 - Çarşamba" },
    { name: "Kurban Bayramı (2. Gün)", date: "2026-05-28", icon: Gift, desc: "11 Zilhicce 1447 - Perşembe" },
    { name: "Kurban Bayramı (3. Gün)", date: "2026-05-29", icon: Gift, desc: "12 Zilhicce 1447 - Cuma" },
    { name: "Kurban Bayramı (4. Gün)", date: "2026-05-30", icon: Gift, desc: "13 Zilhicce 1447 - Cumartesi" },
    { name: "Hicri Yılbaşı", date: "2026-06-16", icon: Calendar, desc: "1 Muharrem 1448 - Salı" },
    { name: "Aşure Günü", date: "2026-06-25", icon: Layers, desc: "10 Muharrem 1448 - Perşembe" },
    { name: "Mevlid Kandili", date: "2026-08-24", icon: BookOpen, desc: "11 Rebiülevvel 1448 - Pazartesi" },
    { name: "Üç Ayların Başlangıcı", date: "2026-12-10", icon: Moon, desc: "1 Receb 1448 - Perşembe" },
    { name: "Regaib Kandili", date: "2026-12-10", icon: Star, desc: "1 Receb 1448 - Perşembe" },
];

const REMINDER_OPTIONS = [
    { label: "Gününde (Sabah)", daysBefore: 0 },
    { label: "1 Gün Önce", daysBefore: 1 },
    { label: "3 Gün Önce", daysBefore: 3 },
    { label: "1 Hafta Önce", daysBefore: 7 }
];

export const ReligiousDays: React.FC<ReligiousDaysProps> = ({ onBack }) => {
  const [reminders, setReminders] = useState<Record<string, number[]>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('holiday_reminders_v2');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [activeHoliday, setActiveHoliday] = useState<Holiday | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', message: '' });

  useEffect(() => {
    localStorage.setItem('holiday_reminders_v2', JSON.stringify(reminders));
  }, [reminders]);

  const requestPermission = async () => {
    const granted = await NotificationService.requestPermissions();
    if (!granted) {
        setModalMessage({ title: "İzin Gerekli", message: "Bildirimleri alabilmek için izin vermeniz gerekmektedir." });
        setShowPermissionModal(true);
        return false;
    }
    return true;
  };

  const openReminderSettings = async (holiday: Holiday) => {
      const hasPermission = await requestPermission();
      if (hasPermission) {
          setActiveHoliday(holiday);
          setShowSettingsModal(true);
      }
  };

  const toggleReminderOption = async (daysBefore: number) => {
      if (!activeHoliday) return;
      
      const holidayName = activeHoliday.name;
      const isAlreadySet = (reminders[holidayName] || []).includes(daysBefore);
      
      // Calculate Notification Date
      const targetDate = new Date(activeHoliday.date);
      targetDate.setDate(targetDate.getDate() - daysBefore);
      targetDate.setHours(9, 0, 0, 0); // Sabah 09:00

      // Unique ID oluşturma
      const notifId = Math.abs(holidayName.split('').reduce((a,b)=>a+b.charCodeAt(0),0)) + daysBefore + targetDate.getDate();

      if (isAlreadySet) {
          await NotificationService.cancel(notifId);
          setReminders(prev => {
              const current = prev[holidayName] || [];
              const updated = current.filter(d => d !== daysBefore);
              const newObj = { ...prev, [holidayName]: updated };
              if (updated.length === 0) delete newObj[holidayName];
              return newObj;
          });
      } else {
          let body = daysBefore === 0 ? `${holidayName} bugün. Mübarek olsun!` : `${holidayName} gününe ${daysBefore} gün kaldı.`;
          
          await NotificationService.schedule(notifId, holidayName, body, targetDate);
          
          setReminders(prev => ({
              ...prev,
              [holidayName]: [...(prev[holidayName] || []), daysBefore]
          }));
      }
  };

  const formatDateTR = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
  };

  const getDaysLeft = (dateStr: string) => {
    // 1. İstanbul saat dilimine göre bugünün tarihini al (YYYY-MM-DD string olarak)
    // Bu, kullanıcının cihaz saati ne olursa olsun İstanbul'daki tarihi baz alır.
    const istanbulDateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Istanbul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());

    // 2. İstanbul tarihini matematiksel işlem yapabilmek için yerel saat objesine (00:00:00) çevir
    const [iYear, iMonth, iDay] = istanbulDateStr.split('-').map(Number);
    const todayIstanbul = new Date(iYear, iMonth - 1, iDay); 

    // 3. Hedef tarihi (Holiday Date) yerel saat objesine (00:00:00) çevir
    const [tYear, tMonth, tDay] = dateStr.split('-').map(Number);
    const targetDate = new Date(tYear, tMonth - 1, tDay); 

    // 4. İki tarih arasındaki farkı milisaniye cinsinden hesapla
    const diffTime = targetDate.getTime() - todayIstanbul.getTime();
    
    // 5. Gün farkına çevir (Yukarı yuvarla)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Geçti";
    if (diffDays === 0) return "Bugün";
    return `${diffDays} Gün Kaldı`;
  };

  return (
    <div className="h-full overflow-y-auto p-6 pb-44 space-y-6 no-scrollbar bg-warm-200 dark:bg-slate-950 animate-slide-up">
      
      <div className="flex items-center space-x-3 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
              <ChevronLeft size={24} />
          </button>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Calendar size={28} />
          </div>
          <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dini Takvim</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">2026 Yılı (Hicri 1447-1448)</p>
          </div>
      </div>

      <div className="space-y-4">
        {STATIC_HOLIDAYS_2026.map((holiday, idx) => {
            const activeReminders = reminders[holiday.name] || [];
            const isSet = activeReminders.length > 0;
            const daysLeft = getDaysLeft(holiday.date);
            const isPast = daysLeft === "Geçti";
            const isToday = daysLeft === "Bugün";

            return (
                <div key={idx} className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${isToday ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 scale-[1.02]' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                    {isToday && <div className="absolute top-0 right-0 p-10 opacity-10 transform rotate-12"><Star size={120} /></div>}

                    <div className="flex items-center p-4">
                        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl shrink-0 mr-4 ${isToday ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                            <span className="text-xs font-bold uppercase">{new Date(holiday.date).toLocaleDateString('tr-TR', { month: 'short' })}</span>
                            <span className="text-2xl font-bold font-mono">{new Date(holiday.date).getDate()}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className={`font-bold text-lg truncate ${isToday ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{holiday.name}</h3>
                                {isToday && <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white">BUGÜN</span>}
                            </div>
                            <p className={`text-xs truncate ${isToday ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-400'}`}>{holiday.desc}</p>
                            
                            <div className="flex items-center justify-between mt-1">
                                <p className={`text-[10px] font-medium ${isToday ? 'text-emerald-50' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                    {formatDateTR(holiday.date)}
                                </p>
                                {!isPast && (
                                    <span className={`text-[10px] font-bold ${isToday ? 'text-emerald-50' : 'text-slate-400'}`}>
                                        {daysLeft}
                                    </span>
                                )}
                            </div>
                        </div>

                        {!isPast && (
                            <button 
                                onClick={() => openReminderSettings(holiday)}
                                className={`p-3 rounded-full transition-colors shrink-0 ml-2 relative ${
                                    isSet 
                                    ? (isToday ? 'bg-white text-emerald-600' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400') 
                                    : (isToday ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700')
                                }`}
                            >
                                {isSet ? <Bell size={20} fill="currentColor" /> : <BellOff size={20} />}
                                {isSet && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-slate-900">
                                        {activeReminders.length}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            );
        })}
        
        <div className="text-center pt-4 opacity-60">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Bu liste 2026 yılı için güncellenmiştir.
            </p>
        </div>
      </div>

      {/* Reminder Settings Modal */}
      {showSettingsModal && activeHoliday && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up max-h-[80vh] flex flex-col border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{activeHoliday.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bildirim tercihlerini seçin</p>
                    </div>
                    <button onClick={() => setShowSettingsModal(false)} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-500"><X size={20} /></button>
                </div>

                <div className="space-y-3 mb-6">
                    {REMINDER_OPTIONS.map((option) => {
                        const isChecked = (reminders[activeHoliday.name] || []).includes(option.daysBefore);
                        return (
                            <button
                                key={option.daysBefore}
                                onClick={() => toggleReminderOption(option.daysBefore)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                    isChecked 
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' 
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Clock size={18} className={isChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                                    <span className="font-medium text-sm">{option.label}</span>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    isChecked 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-slate-300 dark:border-slate-600'
                                }`}>
                                    {isChecked && <Check size={14} />}
                                </div>
                            </button>
                        )
                    })}
                </div>

                <button 
                    onClick={() => setShowSettingsModal(false)}
                    className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-bold shadow-md active:scale-95 transition-transform"
                >
                    Tamam
                </button>
            </div>
        </div>
      )}

      {/* Permission Alert Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-100 dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{modalMessage.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">{modalMessage.message}</p>
                <button onClick={() => setShowPermissionModal(false)} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold">Tamam</button>
            </div>
        </div>
      )}

      <style>{`
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};
