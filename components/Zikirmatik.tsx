
import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, RefreshCcw, Check, PenLine, Layers, BookOpen, Trash2, Plus, Vibrate, VibrateOff, ChevronLeft, Sliders } from './Icons';

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

    const existingRipple = button.getElementsByClassName("ripple")[0];
    if (existingRipple) {
        existingRipple.remove();
    }

    circle.classList.add("ripple");
    button.appendChild(circle);
  };

  const handleCount = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);

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

  // Responsive Daire - Sabit bir px yerine % ve vh kullanacağız
  const radius = 130; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

  const getStepColor = (stepIndex: number) => {
      if (tesbihatStep > stepIndex) return "bg-emerald-600 text-white border-emerald-600";
      if (tesbihatStep === stepIndex) return `bg-white dark:bg-slate-800 border-emerald-500 text-emerald-600 ring-1 ring-emerald-500/20 scale-110`;
      return `bg-warm-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-transparent`;
  };

  const getButtonText = () => {
      if (isTesbihatMode && tesbihatStep >= tesbihatSequence.length) return 'Başa Dön';
      if (!isTesbihatMode && target > 0 && count === target) return 'Sıfırla';
      return 'Zikir Çek';
  };

  // --- RESPONSIVE FONT SCALING (Based on Viewport Height) ---
  // Ekran yüksekliğine (vh) bağlı yazı tipleri, taşmayı önler
  const arabicTextStyle = { fontSize: 'clamp(1.5rem, 5vh, 2.5rem)', lineHeight: '1.4' };
  const titleTextStyle = { fontSize: 'clamp(1rem, 3vh, 1.8rem)' };
  const countTextStyle = { fontSize: 'clamp(3rem, 10vh, 5rem)' };

  return (
    <div className="flex flex-col h-full bg-warm-200 dark:bg-slate-950 animate-slide-up overflow-hidden relative">
      <style>{`
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
      `}</style>
      
      {/* 1. HEADER (Fixed Height) */}
      <div className="flex justify-between items-center px-4 py-3 shrink-0 z-10 bg-warm-200/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <button onClick={onBack} className="p-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
            <ChevronLeft size={24} />
        </button>

        <div className="flex gap-2">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${soundEnabled ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                {soundEnabled ? <Vibrate size={20} /> : <VibrateOff size={20} />}
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <Sliders size={20} />
            </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT WRAPPER (Flex Grow - Fills remaining space) */}
      <div className="flex-1 flex flex-col justify-between w-full relative z-0 px-4 pb-24 sm:pb-28">
        
        {/* TOP: Quick Select / Tesbihat Steps */}
        <div className="shrink-0 w-full mb-2">
            {!isTesbihatMode ? (
                <div className="flex flex-col gap-2">
                    <button onClick={startTesbihat} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 transition-transform">
                        <Layers size={16} className="text-emerald-500" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Sıralı Tesbihat Başlat</span>
                    </button>
                    {/* Horizontal Scroll List */}
                    <div className="w-full overflow-x-auto no-scrollbar">
                        <div className="flex gap-2 px-1 pb-1">
                            {ZIKIR_DATA.map(item => (
                            <button key={item.name} onClick={() => { setZikirName(item.name); setIsTesbihatMode(false); setCount(0); }} className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${zikirName === item.name ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}>
                                {item.name}
                            </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1"><BookOpen size={12}/> Tesbihat Modu</span>
                        <button onClick={exitTesbihatMode} className="text-[10px] font-bold text-red-500 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded-md">Çıkış</button>
                    </div>
                    {tesbihatSequence.length > 5 ? (
                         <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                             <span>Adım:</span><span className="font-bold text-emerald-600">{tesbihatStep + 1}</span><span>/ {tesbihatSequence.length}</span>
                         </div>
                    ) : (
                        <div className="flex justify-center gap-2">
                            {tesbihatSequence.map((item, idx) => (
                                <div key={idx} className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all ${getStepColor(idx)}`}>
                                    {tesbihatStep > idx ? <Check size={12} /> : item.target}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* MIDDLE: Text Content (Flexible) */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-2 min-h-0 shrink">
             {((isTesbihatMode && tesbihatStep >= tesbihatSequence.length) || (!isTesbihatMode && target > 0 && count === target)) ? (
                 <div className="animate-scale-up">
                     <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 block mb-2">Allah Kabul Etsin</span>
                     <span className="text-sm text-slate-500 dark:text-slate-400">Hedef tamamlandı.</span>
                 </div>
             ) : (
                 <>
                    {/* Arabic Text */}
                    <div 
                        className="font-['Amiri'] font-bold text-slate-800 dark:text-white leading-relaxed drop-shadow-sm mb-2 px-2 w-full break-words" 
                        style={arabicTextStyle} 
                        dir="rtl"
                    >
                        {activeZikirDetail ? activeZikirDetail.arabic : ((isTesbihatMode && tesbihatStep < tesbihatSequence.length) ? (getZikirDetails(tesbihatSequence[tesbihatStep].name)?.arabic || "") : "")}
                    </div>
                    
                    {/* Turkish Name */}
                    <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1 px-2 w-full break-words leading-tight" style={titleTextStyle}>
                        {isTesbihatMode ? tesbihatSequence[tesbihatStep]?.name : zikirName}
                    </div>
                    
                    {/* Meaning (Hidden on very small screens if needed, or clamped) */}
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium px-4 line-clamp-3 leading-snug">
                        {activeZikirDetail ? activeZikirDetail.meaning : ((isTesbihatMode && tesbihatStep < tesbihatSequence.length) ? (getZikirDetails(tesbihatSequence[tesbihatStep].name)?.meaning || "") : "")}
                    </div>
                 </>
             )}
        </div>

        {/* BOTTOM: Circle & Main Button (Fixed relative size) */}
        <div className="shrink-0 flex flex-col items-center w-full mt-2">
            
            {/* Progress Circle Container - Dynamic Height based on viewport */}
            <div className="relative aspect-square flex items-center justify-center mb-4" style={{ height: 'min(30vh, 220px)', maxHeight: '220px' }}>
                <svg viewBox="0 0 300 300" className="transform -rotate-90 w-full h-full drop-shadow-xl overflow-visible">
                    {/* Background Circle */}
                    <circle cx="150" cy="150" r={radius} stroke="currentColor" strokeWidth="24" fill="transparent" className="text-warm-100 dark:text-slate-800"/>
                    {/* Progress Arc */}
                    <circle cx="150" cy="150" r={radius} stroke="currentColor" strokeWidth="24" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className={`transition-all duration-300 ease-out text-emerald-500 dark:text-emerald-600 ${target === 0 ? 'hidden' : ''}`}/>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     {((isTesbihatMode && tesbihatStep >= tesbihatSequence.length) || (!isTesbihatMode && target > 0 && count === target)) ? (
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-lg animate-pop">
                            <Check size={40} strokeWidth={4} />
                        </div>
                     ) : (
                         <div className="flex flex-col items-center">
                            <span className="font-bold tracking-tighter tabular-nums text-slate-900 dark:text-white leading-none" style={countTextStyle}>
                                {count}
                            </span>
                            {target > 0 && (
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full">
                                    /{target}
                                </span>
                            )}
                         </div>
                     )}
                </div>
            </div>

            {/* Main Action Button */}
            <button
                ref={buttonRef}
                onClick={handleCount}
                className={`w-full h-14 sm:h-16 rounded-2xl text-lg font-bold active:scale-[0.98] transition-all duration-100 shadow-lg relative overflow-hidden group ${
                    (isTesbihatMode && tesbihatStep >= tesbihatSequence.length) || (!isTesbihatMode && target > 0 && count === target)
                    ? 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-700 text-white shadow-emerald-500/30'
                }`}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {getButtonText()}
                </span>
            </button>
        </div>

      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 shadow-2xl animate-scale-up max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Settings size={20}/> Ayarlar</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 rounded-full bg-white dark:bg-slate-800"><X size={20} /></button>
             </div>
             
             {/* Tesbihat Düzenleyici */}
             <div className="mb-5 pb-5 border-b border-slate-200 dark:border-slate-800">
                 <div className="flex justify-between items-center mb-3">
                     <label className="text-xs font-bold text-slate-500 uppercase">Sıralı Tesbihat</label>
                     <button onClick={resetToDefaultTesbihat} className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><RefreshCcw size={10} /> Sıfırla</button>
                 </div>
                 <div className="space-y-2 mb-3">
                     {tesbihatSequence.map((step, idx) => (
                         <div key={idx} className="flex gap-2 items-center">
                             <input type="text" value={step.name} onChange={(e) => updateTesbihatStep(idx, 'name', e.target.value)} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold" />
                             <input type="number" value={step.target} onChange={(e) => updateTesbihatStep(idx, 'target', parseInt(e.target.value) || 0)} className="w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs font-bold text-center" />
                             <button onClick={() => removeTesbihatStep(idx)} className="p-2 text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                         </div>
                     ))}
                 </div>
                 <button onClick={addTesbihatStep} className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 text-xs font-bold flex items-center justify-center gap-2 hover:border-emerald-500 hover:text-emerald-500 transition-colors"><Plus size={14} /> Adım Ekle</button>
             </div>

             {/* Manuel Ayarlar */}
             <div className="mb-5">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Manuel Zikir</label>
                <div className="relative mb-3">
                    <input type="text" value={zikirName} disabled={isTesbihatMode} onChange={(e) => { setZikirName(e.target.value); setIsTesbihatMode(false); }} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-50" placeholder="Zikir ismi..." />
                    <PenLine size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Hedef Sayısı</label>
                <div className="grid grid-cols-4 gap-2">
                    {[33, 99, 500, 0].map((t) => (
                        <button key={t} onClick={() => handleTargetChange(t)} className={`py-2 rounded-lg text-xs font-bold border transition-colors relative ${target === t ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'}`}>
                            {t === 0 ? '∞' : t}
                            {target === t && <div className="absolute top-[-4px] right-[-4px] bg-emerald-600 text-white rounded-full p-0.5"><Check size={8}/></div>}
                        </button>
                    ))}
                </div>
             </div>

             <button onClick={resetCount} className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30 active:scale-95 transition-transform"><RefreshCcw size={16} /> Sayacı Sıfırla</button>
          </div>
        </div>
      )}
    </div>
  );
};
