
import React, { useState, useEffect } from 'react';
import { User, Award, TrendingUp, Target, Medal, Check, Star, Zap, RotateCcw, AlertTriangle, Sparkles, ChevronLeft, BookOpen, Brain, Lock, Trophy, Calendar, Crown, Info, X, BarChart3, ChevronRight } from './Icons';
import { IslamicInfographics } from './IslamicInfographics';

interface ProfileProps {
    onBack: () => void;
}

interface UserStats {
    totalZikir: number;
    totalPrayers: number;
    streak: number;
    xp: number;
    level: number;
    lastLogin: string;
    quizCorrect: number; 
    kazaPaid: number;    
    pagesRead: number;   
}

interface Task {
    id: number;
    text: string;
    target: number;
    current: number;
    type: 'zikir' | 'prayer' | 'quiz' | 'read' | 'kaza';
    xpReward: number;
    completed: boolean;
}

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    condition: (stats: UserStats) => boolean;
}

const RANKS = [
    { level: 1, name: "Müptedi (Yolcu)", minXp: 0 },
    { level: 2, name: "Talip (İstekli)", minXp: 200 },
    { level: 3, name: "Mürid (Arayan)", minXp: 500 },
    { level: 4, name: "Zâkir (Anan)", minXp: 1000 },
    { level: 5, name: "Abid (Kulluk Eden)", minXp: 2000 },
    { level: 6, name: "Zahid (Gönlü Tok)", minXp: 3500 },
    { level: 7, name: "Salih (İyi)", minXp: 5500 },
    { level: 8, name: "Sadık (Doğru)", minXp: 8000 },
    { level: 9, name: "Arif (Bilen)", minXp: 11000 },
    { level: 10, name: "Veli (Dost)", minXp: 15000 },
    { level: 11, name: "Mürşid (Yol Gösteren)", minXp: 20000 },
    { level: 12, name: "Kutup (Önder)", minXp: 30000 },
];

const TASK_POOL: Omit<Task, 'current' | 'completed'>[] = [
    { id: 101, text: "100 Defa Zikir Çek", target: 100, type: 'zikir', xpReward: 50 },
    { id: 102, text: "33 Defa Subhanallah", target: 33, type: 'zikir', xpReward: 25 },
    { id: 103, text: "33 Defa Elhamdulillah", target: 33, type: 'zikir', xpReward: 25 },
    { id: 104, text: "33 Defa Allahu Ekber", target: 33, type: 'zikir', xpReward: 25 },
    { id: 105, text: "99 Defa Kelime-i Tevhid", target: 99, type: 'zikir', xpReward: 75 },
    { id: 201, text: "2 Vakit Namazı İşaretle", target: 2, type: 'prayer', xpReward: 40 },
    { id: 202, text: "5 Vakit Namazı Tamamla", target: 5, type: 'prayer', xpReward: 150 },
    { id: 203, text: "Sabah Namazını Kıl", target: 1, type: 'prayer', xpReward: 50 },
    { id: 301, text: "Bilgi Yarışmasında 3 Doğru Yap", target: 3, type: 'quiz', xpReward: 60 },
    { id: 302, text: "Bilgi Yarışmasında 10 Doğru Yap", target: 10, type: 'quiz', xpReward: 200 },
    { id: 401, text: "Bir Kaza Namazı Öde", target: 1, type: 'kaza', xpReward: 50 },
    { id: 501, text: "Kütüphaneden Bir Kıssa Oku", target: 1, type: 'read', xpReward: 30 },
];

const ALL_BADGES: Badge[] = [
    { id: 'first_step', name: "İlk Adım", description: "Uygulamaya ilk giriş ve başlangıç.", icon: Zap, color: "text-yellow-500", condition: (s) => s.xp > 0 },
    { id: 'zikir_1k', name: "Tesbih Ehli", description: "Toplam 1.000 zikir çek.", icon: Target, color: "text-blue-500", condition: (s) => s.totalZikir >= 1000 },
    { id: 'zikir_10k', name: "Zikir Üstadı", description: "Toplam 10.000 zikir çek.", icon: Sparkles, color: "text-purple-500", condition: (s) => s.totalZikir >= 10000 },
    { id: 'streak_3', name: "İstikrar", description: "3 gün üst üste giriş yap.", icon: TrendingUp, color: "text-green-500", condition: (s) => s.streak >= 3 },
    { id: 'streak_7', name: "Süreklilik", description: "7 gün üst üste giriş yap.", icon: Calendar, color: "text-orange-500", condition: (s) => s.streak >= 7 },
    { id: 'prayer_50', name: "Cami Kuşu", description: "50 vakit namazı vaktinde kıl.", icon: Check, color: "text-emerald-600", condition: (s) => s.totalPrayers >= 50 },
    { id: 'prayer_500', name: "Sadık Kul", description: "500 vakit namazı vaktinde kıl.", icon: Crown, color: "text-amber-500", condition: (s) => s.totalPrayers >= 500 },
    { id: 'quiz_50', name: "İlim Talibi", description: "Bilgi yarışmasında toplam 50 doğru cevap ver.", icon: Brain, color: "text-cyan-500", condition: (s) => s.quizCorrect >= 50 },
    { id: 'quiz_200', name: "Alim", description: "Bilgi yarışmasında toplam 200 doğru cevap ver.", icon: BookOpen, color: "text-indigo-600", condition: (s) => s.quizCorrect >= 200 },
    { id: 'kaza_10', name: "Borçsuz", description: "10 vakit kaza namazı öde.", icon: RotateCcw, color: "text-rose-500", condition: (s) => s.kazaPaid >= 10 },
    { id: 'level_5', name: "Yolcu", description: "5. Seviyeye (Abid) ulaş.", icon: Medal, color: "text-teal-500", condition: (s) => s.level >= 5 },
    { id: 'level_10', name: "Gönül Dostu", description: "10. Seviyeye (Veli) ulaş.", icon: Star, color: "text-yellow-400", condition: (s) => s.level >= 10 },
];

export const Profile: React.FC<ProfileProps> = ({ onBack }) => {
    const [stats, setStats] = useState<UserStats>({
        totalZikir: 0,
        totalPrayers: 0,
        streak: 1,
        xp: 0,
        level: 1,
        lastLogin: new Date().toDateString(),
        quizCorrect: 0,
        kazaPaid: 0,
        pagesRead: 0
    });

    const [tasks, setTasks] = useState<Task[]>([]);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showRankModal, setShowRankModal] = useState(false);
    const [showStatsView, setShowStatsView] = useState(false); 
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        if (typeof window === 'undefined') return;

        const savedStats = localStorage.getItem('user_stats');
        let currentStats: UserStats = savedStats ? JSON.parse(savedStats) : {
            totalZikir: 0, totalPrayers: 0, streak: 1, xp: 0, level: 1, lastLogin: new Date().toDateString(),
            quizCorrect: 0, kazaPaid: 0, pagesRead: 0
        };

        if (currentStats.quizCorrect === undefined) currentStats.quizCorrect = 0;
        if (currentStats.kazaPaid === undefined) currentStats.kazaPaid = 0;

        const today = new Date().toDateString();
        if (currentStats.lastLogin !== today) {
            const last = new Date(currentStats.lastLogin);
            const diff = Math.floor((new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diff === 1) currentStats.streak += 1;
            else if (diff > 1) currentStats.streak = 1;
            
            currentStats.lastLogin = today;
            localStorage.setItem('user_stats', JSON.stringify(currentStats));
        }

        const currentLevelObj = RANKS.slice().reverse().find(l => currentStats.xp >= l.minXp) || RANKS[0];
        currentStats.level = currentLevelObj.level;
        
        setStats(currentStats);

        const savedTasksDate = localStorage.getItem('tasks_date');
        const savedTasks = localStorage.getItem('daily_tasks');
        
        if (savedTasksDate !== today || !savedTasks) {
            const shuffled = [...TASK_POOL].sort(() => 0.5 - Math.random());
            const selectedTasks = shuffled.slice(0, 4).map((t, idx) => ({
                ...t,
                id: idx,
                current: 0,
                completed: false
            }));
            
            setTasks(selectedTasks as Task[]);
            localStorage.setItem('tasks_date', today);
            localStorage.setItem('daily_tasks', JSON.stringify(selectedTasks));
        } else {
            setTasks(JSON.parse(savedTasks));
        }
    };

    const handleResetConfirm = () => {
        if (typeof window === 'undefined') return;
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

        localStorage.removeItem('user_stats');
        localStorage.removeItem('daily_tasks');
        localStorage.removeItem('tasks_date');
        localStorage.removeItem('zikir_count');
        localStorage.removeItem('zikir_target'); 
        localStorage.removeItem('kaza_counts');
        
        const today = new Date().toDateString();
        localStorage.removeItem(`completed_prayers_${today}`);
        
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    const getLevelInfo = () => {
        const current = RANKS.find(l => l.level === stats.level) || RANKS[0];
        const next = RANKS.find(l => l.level === stats.level + 1);
        return { current, next };
    };

    const { current: currentLevel, next: nextLevel } = getLevelInfo();
    const progress = nextLevel 
        ? ((stats.xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 
        : 100;

    if (showStatsView) {
        return <IslamicInfographics onBack={() => setShowStatsView(false)} />;
    }

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Profilim</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Gelişim ve Başarılar</p>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6 pb-40">
                
                {/* Level Card */}
                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 animate-pulse-slow"><Crown size={140} /></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/30 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-indigo-400/50 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                <User size={32} className="text-indigo-200" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest bg-indigo-900/50 px-2 py-0.5 rounded border border-indigo-700">Seviye {stats.level}</span>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight mt-1">{currentLevel.name}</h2>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowRankModal(true)}
                            className="flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 p-2 rounded-xl border border-white/10 transition-colors backdrop-blur-sm"
                        >
                            <Info size={20} className="text-indigo-200 mb-1" />
                            <span className="text-[9px] font-bold text-indigo-100">Rütbeler</span>
                        </button>
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-2 uppercase tracking-wide">
                            <span>İlerleme</span>
                            {nextLevel ? <span>{nextLevel.minXp - stats.xp} XP Sonra: {nextLevel.name}</span> : <span>Maksimum Seviye</span>}
                        </div>
                        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-all duration-1000 relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/30 w-full h-full animate-shimmer" style={{ transform: 'skewX(-20deg)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setShowStatsView(true)}
                    className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-emerald-500 dark:hover:border-emerald-500 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                            <BarChart3 size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-900 dark:text-white">İstatistikler & Grafikler</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">İbadet takibini görselleştir</p>
                        </div>
                    </div>
                    <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                </button>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-blue-500 mb-1"><Target size={20} /></div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{stats.totalZikir}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Zikir</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-emerald-500 mb-1"><Check size={20} /></div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{stats.totalPrayers}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Vakit</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-amber-500 mb-1"><TrendingUp size={20} /></div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{stats.streak}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Gün Seri</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-cyan-500 mb-1"><Brain size={20} /></div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{stats.quizCorrect}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Doğru</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 px-1">
                        <Award className="text-emerald-600 dark:text-emerald-400" size={20} />
                        <h3 className="font-bold text-slate-900 dark:text-white">Günün Görevleri</h3>
                        <span className="text-[10px] bg-white/50 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 ml-auto font-medium">Her gün yenilenir</span>
                    </div>

                    {tasks.map(task => {
                        const taskProgress = Math.min(100, (task.current / task.target) * 100);
                        return (
                            <div 
                                key={task.id} 
                                className={`p-4 rounded-2xl border relative overflow-hidden transition-all duration-500 ${
                                    task.completed 
                                    ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600 scale-[1.01] ring-1 ring-emerald-200 dark:ring-emerald-800' 
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                                }`}
                            >
                                {task.completed && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -skew-x-12 animate-shimmer pointer-events-none"></div>
                                )}

                                <div className="flex justify-between items-start mb-3 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-medium text-sm transition-all duration-300 ${task.completed ? 'text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-900 dark:text-white'}`}>
                                                {task.text}
                                            </p>
                                            {task.completed && <Sparkles size={16} className="text-amber-400 animate-spin-slow" />}
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 mt-1.5">
                                            <div className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-colors duration-500 ${
                                                task.completed 
                                                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' 
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                            }`}>
                                                <Zap size={10} fill="currentColor"/> {task.xpReward} XP
                                            </div>
                                            
                                            {task.completed && (
                                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                                                    <Check size={10} strokeWidth={3}/> Tamamlandı
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`text-xs font-mono font-bold transition-colors ${task.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {task.current}/{task.target}
                                    </div>
                                </div>
                                
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                                            task.completed 
                                            ? 'bg-emerald-500' 
                                            : 'bg-indigo-500'
                                        }`}
                                        style={{ width: `${taskProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 px-1">
                        <Medal className="text-amber-500" size={20} />
                        <h3 className="font-bold text-slate-900 dark:text-white">Rozet Koleksiyonu</h3>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        {ALL_BADGES.map((badge) => {
                            const isEarned = badge.condition(stats);
                            return (
                                <button 
                                    key={badge.id}
                                    onClick={() => setSelectedBadge(badge)}
                                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 border-2 transition-all duration-300 relative group overflow-hidden ${
                                        isEarned
                                        ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm' 
                                        : 'bg-white/50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 grayscale hover:opacity-80'
                                    }`}
                                >
                                    <div className={`mb-1 transition-transform group-hover:scale-110 ${isEarned ? badge.color : 'text-slate-400'}`}>
                                        <badge.icon size={28} />
                                    </div>
                                    <span className={`text-[8px] sm:text-[9px] text-center font-bold leading-tight line-clamp-2 ${isEarned ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                                        {badge.name}
                                    </span>
                                    
                                    {!isEarned && (
                                        <div className="absolute top-1 right-1 text-slate-400">
                                            <Lock size={10} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button 
                        onClick={() => setShowResetModal(true)}
                        className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <RotateCcw size={14} />
                        Tüm İstatistikleri Sıfırla
                    </button>
                </div>

                 {showResetModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in" style={{ touchAction: 'none' }}>
                        <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-700">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
                                    <AlertTriangle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Emin misiniz?</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Tüm seviye, rozet ve görev ilerlemeniz kalıcı olarak silinecek.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <button 
                                    onClick={handleResetConfirm}
                                    className="w-full py-3.5 rounded-2xl bg-red-600 text-white font-bold active:scale-[0.98] transition-transform shadow-md"
                                >
                                    Evet, Sıfırla
                                </button>
                                <button 
                                    onClick={() => setShowResetModal(false)}
                                    className="w-full py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold active:scale-[0.98] transition-transform"
                                >
                                    Vazgeç
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {selectedBadge && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedBadge(null)}>
                        <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-700 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className={`absolute top-0 left-0 w-full h-24 opacity-10 bg-current ${selectedBadge.color}`}></div>
                            
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className={`w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-opacity-20 ${selectedBadge.color.replace('text-', 'ring-')}`}>
                                    <selectedBadge.icon size={40} className={selectedBadge.condition(stats) ? selectedBadge.color : 'text-slate-400'} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedBadge.name}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                    {selectedBadge.description}
                                </p>
                                
                                {selectedBadge.condition(stats) ? (
                                    <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-sm flex items-center gap-2">
                                        <Check size={16} /> Kazanıldı
                                    </div>
                                ) : (
                                    <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-xl font-bold text-sm flex items-center gap-2">
                                        <Lock size={16} /> Henüz Kazanılmadı
                                    </div>
                                )}
                            </div>
                            
                            <button onClick={() => setSelectedBadge(null)} className="absolute top-4 right-4 p-2 bg-black/5 dark:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 z-20">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {showRankModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setShowRankModal(false)}>
                        <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-sm h-[80vh] rounded-3xl shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Trophy className="text-amber-500" size={20} /> Rütbe Ağacı
                                </h3>
                                <button onClick={() => setShowRankModal(false)} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500"><X size={20}/></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar pb-20">
                                {RANKS.map((rank, idx) => {
                                    const isUnlocked = stats.xp >= rank.minXp;
                                    const isCurrent = rank.level === stats.level;
                                    const isNext = rank.level === stats.level + 1;
                                    const progressToNext = isNext ? Math.min(100, (stats.xp / rank.minXp) * 100) : (isUnlocked ? 100 : 0);
                                    
                                    const remainingXP = Math.max(0, rank.minXp - stats.xp);
                                    const estimatedTasks = Math.ceil(remainingXP / 50);

                                    return (
                                        <div key={rank.level} className={`relative p-4 rounded-2xl border transition-all ${isCurrent ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500' : (isUnlocked ? 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800/30' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70')}`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCurrent ? 'bg-indigo-600 text-white' : (isUnlocked ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500')}`}>
                                                        {rank.level}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm font-bold ${isCurrent ? 'text-indigo-700 dark:text-indigo-400' : (isUnlocked ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500')}`}>
                                                            {rank.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                                            {rank.minXp} XP Gerekiyor
                                                        </span>
                                                    </div>
                                                </div>
                                                {isCurrent && <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">Mevcut</span>}
                                                {!isUnlocked && !isNext && <Lock size={16} className="text-slate-400" />}
                                                {isUnlocked && !isCurrent && <Check size={16} className="text-emerald-500" />}
                                            </div>

                                            {isNext && (
                                                <div className="mt-3 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden relative">
                                                    <div className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(stats.xp / rank.minXp) * 100}%` }}></div>
                                                </div>
                                            )}
                                            
                                            {isNext && (
                                                <div className="mt-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
                                                    <Info size={12} />
                                                    <span>Sonraki rütbe için <b>{remainingXP} XP</b> (Yaklaşık <b>{estimatedTasks} görev</b>) gerekiyor.</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes shimmer {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(200%); }
                }
                .animate-shimmer {
                    animation: shimmer 2.5s infinite linear;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #475569;
                }
            `}</style>
        </div>
    );
};
