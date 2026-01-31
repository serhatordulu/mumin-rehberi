
import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, RefreshCcw, Check, PenLine, Layers, BookOpen, Trash2, Plus, Vibrate, VibrateOff, ChevronLeft, Sliders, Sparkles } from './Icons';

interface ZikirmatikProps {
    onBack: () => void;
}

const ZIKIR_DATA = [
  { name: "Subhanallah", arabic: "سُبْحَانَ اللّٰهِ", meaning: "Allah'ı bütün noksan sıfatlardan tenzih ederim." },
  { name: "Elhamdulillah", arabic: "اَلْحَمْدُ لِلّٰهِ", meaning: "Hamd (her türlü övgü ve şükür) Allah'a mahsustur." },
  { name: "Allahu Ekber", arabic: "اَللّٰهُ اَكْبَرُ", meaning: "Allah en büyüktür, yüceliği her şeyden üstündür." },
  { name: "La ilahe illallah", arabic: "لَا اِلٰهَ اِلَّا اللّٰهُ", meaning: "Allah'tan başka ilah yoktur." },
  { name: "Estağfurullah", arabic: "اَسْتَغْفِرُ اللّٰهَ", meaning: "Allah'tan bağışlanma dilerim." },
  { name: "Salavat-ı Şerif", arabic: "اَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ", meaning: "Allah'ım, Efendimiz Muhammed'e salat ve selam eyle." },
  { name: "Ya Allah", arabic: "يَا اللّٰهُ", meaning: "Ey Allah'ım (C.C.)" },
  { name: "Hasbunallah", arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ", meaning: "Allah bize yeter, O ne güzel vekildir." }
];

const DEFAULT_TESBIHAT = [
  { name: "Subhanallah", target: 33 },
  { name: "Elhamdulillah", target: 33 },
  { name: "Allahu Ekber", target: 33 }
];

interface TesbihatStep {
    name: string;
    target: number;
}

export const Zikirmatik: React.FC<ZikirmatikProps> = ({ onBack }) => {
  const [count, setCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zikir_count');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [target, setTarget] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zikir_target');
      return saved ? parseInt(saved, 10) : 33; 
    }
    return 33;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [zikirName, setZikirName] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('zikir_name') || "Subhanallah";
    }
    return "Subhanallah";
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [isTesbihatMode, setIsTesbihatMode] = useState(false);
  const [tesbihatStep, setTesbihatStep] = useState(0); 
  const [tesbihatSequence, setTesbihatSequence] = useState<TesbihatStep[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('custom_tesbihat_sequence');
          return saved ? JSON.parse(saved) : DEFAULT_TESBIHAT;
      }
      return DEFAULT_TESBIHAT;
  });

  // Ripple Effect Ref
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { localStorage.setItem('zikir_count', count.toString()); }, [count]);
  useEffect(() => { localStorage.setItem('zikir_target', target.toString()); }, [target]);
  useEffect(() => { localStorage.setItem('zikir_name', zikirName); }, [zikirName]);
  useEffect(() => { localStorage.setItem('custom_tesbihat_sequence', JSON.stringify(tesbihatSequence)); }, [tesbihatSequence]);

  const updateGlobalStats = () => {
    if (typeof window === 'undefined') return;
    const savedStats = localStorage.getItem('user_stats');
    let stats = savedStats ? JSON.parse(savedStats) : { totalZikir: 0, totalPrayers: 0, streak: 1, xp: 0, level: 1, lastLogin: new Date().toDateString() };
    stats.totalZikir += 1;
    localStorage.setItem('user_stats', JSON.stringify(stats));

    const savedTasks = localStorage.getItem('daily_tasks');
    if (savedTasks) {
        let tasks = JSON.parse(savedTasks);
        let tasksUpdated = false;
        let xpGained = 0;
        tasks = tasks.map((t: any) => {
            if (!t.completed && t.type === 'zikir') {
                if (t.text.includes("Defa Zikir")) { t.current += 1; tasksUpdated = true; }
                else if (t.text.toLowerCase().includes(zikirName.toLowerCase())) { t.current += 1; tasksUpdated = true; }
                if (t.current >= t.target && !t.completed) { t.completed = true; xpGained += t.xpReward; }
            }
            return t;
        });
        if (tasksUpdated) {
            localStorage.setItem('daily_tasks', JSON.stringify(tasks));
            if (xpGained > 0) {
                stats.xp += xpGained;
                localStorage.setItem('user_stats', JSON.stringify(stats));
            }
        }
    }
  };

  const getZikirDetails = (name: string) => ZIKIR_DATA.find(z => z.name === name);
  const activeZikirDetail = getZikirDetails(zikirName);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.transform = 'scale(0)';
    circle.style.animation = 'ripple 0.6s linear';
    circle.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    circle.style.pointerEvents = 'none';

    // Remove existing ripples to clean up
    const existingRipple = button.getElementsByClassName("ripple")[0];
    if (existingRipple) {
        existingRipple.remove();
    }

    circle.classList.add("ripple");
    button.appendChild(circle);
  };

  const handleCount = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e); // Trigger visual effect

    if (isTesbihatMode) {
        if (tesbihatStep >= tesbihatSequence.length) {
            startTesbihat();
            return;
        }
    }
    if (!isTesbihatMode && target > 0 && count === target) {
        resetCount();
        return;
    }
    const newCount = count + 1;
    updateGlobalStats();
    
    if (target > 0 && newCount === target) {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
        if (isTesbihatMode) {
            setTimeout(() => {
                const nextStep = tesbihatStep + 1;
                setTesbihatStep(nextStep);
                setCount(0);
                if (nextStep < tesbihatSequence.length) {
                    setZikirName(tesbihatSequence[nextStep].name);
                    setTarget(tesbihatSequence[nextStep].target);
                } else {
                    setZikirName("Tesbihat Tamamlandı");
                    setCount(99); 
                }
            }, 300);
        } else {
            setCount(newCount);
        }
    } else {
        setCount(newCount);
        if (navigator.vibrate && soundEnabled) navigator.vibrate(50);
    }
  };

  const resetCount = () => {
    setCount(0);
    setShowSettings(false);
    if (isTesbihatMode) { startTesbihat(); }
    if (navigator.vibrate) navigator.vibrate(100);
  };

  const handleTargetChange = (newTarget: number) => {
    setTarget(newTarget);
    setIsTesbihatMode(false);
  };

  const startTesbihat = () => {
      if (tesbihatSequence.length === 0) return;
      setIsTesbihatMode(true);
      setTesbihatStep(0);
      setTarget(tesbihatSequence[0].target);
      setCount(0);
      setZikirName(tesbihatSequence[0].name);
      setShowSettings(false);
  };

  const exitTesbihatMode = () => {
      setIsTesbihatMode(false);
      setTesbihatStep(0);
      setTarget(33);
      setCount(0);
      setZikirName("Subhanallah");
  };

  const updateTesbihatStep = (index: number, field: keyof TesbihatStep, value: string | number) => {
      const newSeq = [...tesbihatSequence];
      newSeq[index] = { ...newSeq[index], [field]: value };
      setTesbihatSequence(newSeq);
  };

  const addTesbihatStep = () => { setTesbihatSequence([...tesbihatSequence, { name: "Yeni Zikir", target: 33 }]); };
  const removeTesbihatStep = (index: number) => { const newSeq = tesbihatSequence.filter((_, i) => i !== index); setTesbihatSequence(newSeq); };
  const resetToDefaultTesbihat = () => { setTesbihatSequence(DEFAULT_TESBIHAT); };

  const percentage = target > 0 ? Math.min(100, (count % (target + 1)) / target * 100) : 100;
  const displayPercentage = ((!isTesbihatMode && target > 0 && count === target) || (isTesbihatMode && tesbihatStep >= tesbihatSequence.length)) ? 100 : percentage;

  const radius = 130; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

  const getStepColor = (stepIndex: number) => {
      if (tesbihatStep > stepIndex) return "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/30";
      if (tesbihatStep === stepIndex) return `bg-white dark:bg-slate-800 border-emerald-500 text-emerald-600 ring-2 ring-emerald-500/20 scale-110`;
      return `bg-warm-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-transparent`;
  };

  const getButtonText = () => {
      if (isTesbihatMode && tesbihatStep >= tesbihatSequence.length) return 'Başa Dön';
      if (!isTesbihatMode && target > 0 && count === target) return 'Sıfırla';
      return 'Zikir Çek';
  };

  const renderStepIndicators = () => {
      if (tesbihatSequence.length > 5) {
          return (
             <div className="flex items-center justify-center space-x-2">
                 <span className={`text-sm text-slate-500`}>Adım:</span>
                 <span className={`text-xl font-bold text-emerald-600`}>{tesbihatStep + 1}</span>
                 <span className={`text-sm text-slate-500`}>/ {tesbihatSequence.length}</span>
             </div>
          )
      }
      return (
        <div className="flex items-center justify-center relative px-2 gap-3 flex-wrap">
            {tesbihatSequence.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${getStepColor(idx)}`}>
                        {tesbihatStep > idx ? <Check size={16} strokeWidth={3} /> : <span className="text-xs font-bold">{item.target}</span>}
                    </div>
                </div>
            ))}
        </div>
      );
  }

  const renderZikirInfo = () => {
      if (isTesbihatMode) {
          if (tesbihatStep < tesbihatSequence.length) {
              const currentItem = tesbihatSequence[tesbihatStep];
              const details = getZikirDetails(currentItem.name);
              return (
                <div className="flex flex-col items-center text-center animate-fade-in space-y-3 justify-center px-4 h-full">
                     {details ? (
                         <>
                             <span className="text-3xl sm:text-5xl font-['Amiri'] font-bold leading-relaxed text-slate-900 dark:text-white drop-shadow-sm" dir="rtl">
                                 {details.arabic}
                             </span>
                             <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">
                                 {currentItem.name}
                             </span>
                             <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-normal max-w-[95%] font-medium mt-1">
                                 {details.meaning}
                             </span>
                         </>
                     ) : (
                         <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                             {currentItem.name}
                         </span>
                     )}
                </div>
              );
          } else {
              return (
                  <div className="flex flex-col items-center text-center animate-scale-up h-full justify-center">
                      <span className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Allah Kabul Etsin</span>
                      <p className="text-4xl font-['Amiri'] font-bold text-emerald-600 dark:text-emerald-400" dir="rtl">لَا اِلٰهَ اِلَّا اللّٰهُ</p>
                  </div>
              );
          }
      } else {
          if (target > 0 && count === target) {
             return (
                 <div className="flex flex-col items-center text-center animate-scale-up h-full justify-center">
                     <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">Allah Kabul Etsin</span>
                     <span className="text-base font-medium text-slate-500 dark:text-slate-400">Hedef {target} tamamlandı.</span>
                 </div>
             );
          } else {
              return (
                  <div className="flex flex-col items-center text-center animate-fade-in space-y-3 justify-center px-4 h-full">
                      {activeZikirDetail ? (
                          <>
                              <span className="text-3xl sm:text-5xl font-['Amiri'] font-bold leading-relaxed text-slate-900 dark:text-white drop-shadow-sm" dir="rtl">
                                  {activeZikirDetail.arabic}
                              </span>
                              <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">{activeZikirDetail.name}</span>
                              <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-normal max-w-[95%] font-medium mt-1">
                                  {activeZikirDetail.meaning}
                              </span>
                          </>
                      ) : (
                          <span className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 break-words w-full px-4">
                              {zikirName}
                          </span>
                      )}
                  </div>
              );
          }
      }
  }

  return (
    <div className="flex flex-col h-full transition-all duration-300 ease-in-out bg-warm-200 dark:bg-slate-950 animate-slide-up overflow-hidden">
      <style>{`
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
      `}</style>
      
      {/* Header - Fixed & Background Matching */}
      <div className="flex justify-between items-center px-6 py-4 shrink-0 z-10 animate-fade-in bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-3 -ml-3 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
            <ChevronLeft size={24} />
        </button>

        <div className="flex gap-3">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full shadow-sm border backdrop-blur-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800`}>
                <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-1.5 rounded-full ${soundEnabled ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-600"}`}>
                    {soundEnabled ? <Vibrate size={24} /> : <VibrateOff size={24} />}
                </button>
            </div>
            <button 
            onClick={() => setShowSettings(true)}
            className={`p-3 rounded-full shadow-sm border backdrop-blur-md active:scale-95 transition-transform bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400`}
            >
            <Sliders size={24} />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full h-full relative">
        
        {/* Top: Controls / List */}
        <div className="w-full px-4 shrink-0 mt-2 animate-fade-in-up z-20">
            {!isTesbihatMode ? (
                <div className="flex flex-col space-y-3">
                    <button onClick={startTesbihat} className={`w-full flex items-center justify-center space-x-3 py-3 rounded-2xl border active:scale-95 transition-all shadow-sm group backdrop-blur-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800/50`}>
                        <div className={`p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform`}><Layers size={18} /></div>
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Sıralı Tesbihat Başlat</span>
                    </button>
                    <div className="w-full overflow-x-auto no-scrollbar pb-1">
                        <div className="flex space-x-3 px-1">
                            {ZIKIR_DATA.map(item => (
                            <button key={item.name} onClick={() => { setZikirName(item.name); setIsTesbihatMode(false); setCount(0); }} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border shadow-sm ${zikirName === item.name ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/30 scale-105' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-warm-100 dark:hover:bg-slate-800'}`}>
                                {item.name}
                            </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`p-4 rounded-2xl border shadow-sm animate-scale-up backdrop-blur-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800`}>
                    <div className="flex justify-between items-center mb-3">
                        <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-500 dark:text-slate-400`}><BookOpen size={16}/> Tesbihat Modu</span>
                        <button onClick={exitTesbihatMode} className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs text-red-500 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Çıkış</button>
                    </div>
                    {renderStepIndicators()}
                </div>
            )}
        </div>

        {/* Middle: Text */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto no-scrollbar w-full relative z-10 px-6 py-2 min-h-0">
             {renderZikirInfo()}
        </div>

        {/* Bottom: Circle & Button */}
        <div className="shrink-0 flex flex-col items-center w-full z-20 pb-24 sm:pb-28"> 
            
            {/* Circle - Size Reduced for better fit */}
            <div className="w-[60vw] h-[60vw] max-w-[240px] max-h-[240px] relative aspect-square mb-8">
                <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-500 ${target > 0 && count === target ? 'bg-emerald-500/30' : 'opacity-0'}`}></div>
                
                <svg viewBox="0 0 300 300" className="transform -rotate-90 w-full h-full relative z-10 drop-shadow-xl">
                    <circle cx="150" cy="150" r={radius} stroke="currentColor" strokeWidth="20" fill="transparent" className={`transition-colors duration-300 text-warm-300 dark:text-slate-800`}/>
                    <circle cx="150" cy="150" r={radius} stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className={`transition-all duration-300 ease-out text-emerald-500 dark:text-emerald-600 ${target === 0 ? 'hidden' : ''}`}/>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center pointer-events-none z-20">
                     {((isTesbihatMode && tesbihatStep >= tesbihatSequence.length) || (!isTesbihatMode && target > 0 && count === target)) ? (
                        <div className="flex flex-col items-center justify-center animate-pop">
                            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2 shadow-lg">
                                <Check size={56} strokeWidth={4} />
                            </div>
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                                <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-100"></div>
                                <div className="absolute top-1/4 right-0 w-2 h-2 bg-red-400 rounded-full animate-ping delay-200"></div>
                            </div>
                        </div>
                     ) : (
                         <>
                            <span key={count} className="text-7xl sm:text-8xl font-bold tracking-tighter tabular-nums animate-pop text-slate-900 dark:text-white leading-none drop-shadow-sm">
                                {count}
                            </span>
                            {target > 0 && (
                                <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-2 bg-warm-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    Hedef: {target}
                                </span>
                            )}
                         </>
                     )}
                </div>
            </div>

            {/* Button */}
            <div className="w-full px-6">
                <button
                    ref={buttonRef}
                    onClick={handleCount}
                    className={`w-full h-16 rounded-2xl text-xl font-bold active:scale-[0.97] transition-all duration-100 ease-out flex items-center justify-center shadow-lg relative overflow-hidden group ${
                        (isTesbihatMode && tesbihatStep >= tesbihatSequence.length) || (!isTesbihatMode && target > 0 && count === target)
                        ? 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white' 
                        : 'bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white shadow-emerald-500/30'
                    }`}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {getButtonText()}
                    </span>
                </button>
            </div>
        </div>

      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="absolute inset-0" onClick={() => setShowSettings(false)}></div>
          <div className="relative bg-warm-100 dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-scale-up max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><Settings size={22} className="text-emerald-600 dark:text-emerald-400"/> Ayarlar</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"><X size={22} /></button>
             </div>
             
             <div className="pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
                 <div className="flex justify-between items-center mb-3">
                     <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Tesbihat Düzenle</label>
                     <button onClick={resetToDefaultTesbihat} className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"><RefreshCcw size={12} /> Varsayılan</button>
                 </div>
                 <div className="space-y-3 mb-4">
                     {tesbihatSequence.map((step, idx) => (
                         <div key={idx} className="flex gap-2 items-center">
                             <input type="text" value={step.name} onChange={(e) => updateTesbihatStep(idx, 'name', e.target.value)} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-emerald-500 outline-none" />
                             <input type="number" value={step.target} onChange={(e) => updateTesbihatStep(idx, 'target', parseInt(e.target.value) || 0)} className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2.5 text-sm font-bold text-center text-slate-700 dark:text-slate-200 focus:border-emerald-500 outline-none" />
                             <button onClick={() => removeTesbihatStep(idx)} className="p-2.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"><Trash2 size={18} /></button>
                         </div>
                     ))}
                 </div>
                 <button onClick={addTesbihatStep} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 text-sm font-bold flex items-center justify-center gap-2 hover:border-emerald-500 hover:text-emerald-500 transition-colors"><Plus size={16} /> Yeni Adım Ekle</button>
             </div>
             <div className="mb-6">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2 block uppercase tracking-wider">Manuel Zikir İsmi</label>
                <div className="relative mb-4">
                    <input type="text" value={zikirName} disabled={isTesbihatMode} onChange={(e) => { setZikirName(e.target.value); setIsTesbihatMode(false); }} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 focus:border-emerald-500 outline-none transition-all font-medium pr-10 disabled:opacity-50" placeholder="Özel zikir ismi..." />
                    <PenLine size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {isTesbihatMode && <p className="text-xs text-amber-500 mt-1 mb-2 font-medium">Tesbihat modunda isim otomatik değişir.</p>}
                <label className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2 block uppercase tracking-wider">Manuel Hedef</label>
                <div className="grid grid-cols-4 gap-2">
                    {[33, 99, 500, 0].map((t) => (
                        <button key={t} onClick={() => handleTargetChange(t)} className={`py-3 rounded-xl text-sm font-bold border transition-colors relative active:scale-95 ${target === t ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                            {t === 0 ? '∞' : t}
                            {target === t && <div className="absolute top-[-6px] right-[-6px] bg-emerald-600 text-white rounded-full p-0.5 animate-pop"><Check size={12}/></div>}
                        </button>
                    ))}
                </div>
             </div>
             <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button onClick={resetCount} className="w-full py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30 active:bg-red-100 dark:active:bg-red-900/20 transition-colors active:scale-95 shadow-sm"><RefreshCcw size={20} /> Sayacı Sıfırla</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
