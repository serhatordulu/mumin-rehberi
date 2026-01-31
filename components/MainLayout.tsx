
import React, { useRef, useEffect, useState } from 'react';
import { AppTab, ThemeMode } from '../types';
import { 
    Clock, Home, Compass, User, LayoutGrid, Calendar, Settings, 
    Sun, Moon, Smartphone, Type, Check, X, Download, 
    Moon as MoonIcon, MessageCircle, MapPin, Baby, BookOpen, 
    Hand, Layers, AlignRight, Trophy, Book, Headphones, Calculator, Send, Shield
} from './Icons';
import { useApp } from '../contexts/AppContext';

interface MainLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showBottomNav?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
    children, 
    showHeader = true,
    showBottomNav = true
}) => {
    const { 
        activeTab, setActiveTab, 
        showMenu, setShowMenu,
        themeMode, setThemeMode,
        deferredPrompt
    } = useApp();

    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const themeMenuRef = useRef<HTMLDivElement>(null);

    // Click outside to close theme menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
                setShowThemeMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeSelect = (mode: ThemeMode) => {
        setThemeMode(mode);
        if (navigator.vibrate) navigator.vibrate(50);
        setShowThemeMenu(false);
    };

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        setThemeMode(themeMode); 
    };

    const handlePrivacyClick = () => {
        setActiveTab(AppTab.PRIVACY);
        setShowThemeMenu(false);
    };

    // --- MENU DATA ---
    const PINNED_ITEMS = [
        { id: 'ramazan', label: 'Ramazan-ı Şerif', icon: MoonIcon, tab: AppTab.RAMADAN, color: 'bg-emerald-600 text-white' },
        { id: 'asistan', label: 'Dini Asistan', icon: MessageCircle, tab: AppTab.AI_ASSISTANT, color: 'bg-violet-600 dark:bg-violet-700 text-white' },
    ];

    const REGULAR_ITEMS = [
        { id: 'cami', label: 'Cami Bul', icon: MapPin, tab: AppTab.MOSQUE_FINDER, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
        { id: 'gunler', label: 'Dini Günler', icon: Calendar, tab: AppTab.CALENDAR, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
        { id: 'isimler', label: 'Dini İsimler', icon: Baby, tab: AppTab.NAMES, color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400' },
        { id: 'hadis', label: 'Hadisler', icon: BookOpen, tab: AppTab.HADITH, color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' },
        { id: 'dua', label: 'Dua Hazinesi', icon: Hand, tab: AppTab.DUA, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
        { id: 'cuz', label: 'Kuran Cüzleri', icon: Layers, tab: AppTab.CUZ, color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
        { id: 'esma', label: 'Esma-ül Hüsna', icon: AlignRight, tab: AppTab.ESMA_HUSNA, color: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400' },
        { id: 'quiz', label: 'Bilgi Yarışması', icon: Trophy, tab: AppTab.QUIZ, color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
        { id: 'kaza', label: 'Kaza Takibi', icon: Clock, tab: AppTab.KAZA, color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' },
        { id: 'kuran', label: 'Kuran-ı Kerim', icon: BookOpen, tab: AppTab.QURAN, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
        { id: 'kutuphane', label: 'Kütüphane', icon: Book, tab: AppTab.LIBRARY, color: 'bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400' },
        { id: 'sesli', label: 'Sesli Kuran', icon: Headphones, tab: AppTab.AUDIO_QURAN, color: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400' },
        { id: 'zekat', label: 'Zekat Hesapla', icon: Calculator, tab: AppTab.ZAKAT, color: 'bg-lime-50 dark:bg-lime-900/20 text-lime-600 dark:text-lime-400' },
        { 
            id: 'feedback', 
            label: 'Geri Bildirim', 
            icon: Send, 
            action: () => { window.open('mailto:serhatordulu83@gmail.com?subject=Mümin Rehberi - Geri Bildirim', '_system'); }, 
            color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
            tab: null 
        },
    ];

    const sortedRegularItems = REGULAR_ITEMS.sort((a, b) => a.label.localeCompare(b.label, 'tr'));

    const TabButton = ({ tab, icon: Icon, label }: { tab: AppTab, icon: any, label: string }) => (
        <button
          onClick={() => { setActiveTab(tab); setShowMenu(false); }}
          className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative group active:scale-95 ${
            activeTab === tab 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <div className={`p-2 rounded-2xl transition-all duration-300 ${activeTab === tab ? 'bg-emerald-50 dark:bg-emerald-900/30 -translate-y-1.5' : 'group-hover:-translate-y-1'}`}>
             <Icon size={activeTab === tab ? 26 : 24} strokeWidth={activeTab === tab ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] sm:text-xs font-bold transition-all duration-300 mt-1 ${activeTab === tab ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-warm-200 dark:bg-slate-950 border-x border-slate-200 dark:border-slate-800 shadow-2xl relative transition-colors duration-500 overflow-hidden">
            
            {/* Header */}
            {showHeader && (
                <header className="bg-warm-200/90 dark:bg-slate-900/80 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-[110] pt-safe transition-colors duration-500 sticky top-0">
                    <div className="flex items-center space-x-3.5">
                        <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 relative overflow-hidden group shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50"></div>
                            <svg viewBox="0 0 512 512" className="w-7 h-7 text-white fill-current relative z-10 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
                                <g transform="translate(256, 256) rotate(-35) scale(0.85) translate(-220, -256)">
                                    <path d="M266,96 C172.1,96 96,167.6 96,256 C96,344.4 172.1,416 266,416 C294.2,416 320.9,409.1 344.6,396.9 C290,388.4 246,344.8 246,256 C246,167.2 290,123.6 344.6,115.1 C320.9,102.9 294.2,96 266,96 Z" />
                                </g>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-0.5">Mümin Rehberi</h1>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">İslami Asistan</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3" ref={themeMenuRef}>
                        {/* Tarih Göstergesi - Mobilde Gizli */}
                        <div className="h-11 text-xs font-bold px-4 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-300 dark:border-slate-700 hidden xs:flex items-center gap-2">
                            <Calendar size={16} className="opacity-70" />
                            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setShowThemeMenu(!showThemeMenu)}
                                className="flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all active:scale-95 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-400 border border-slate-300 dark:border-slate-700 shadow-sm"
                                title="Ayarlar"
                            >
                                <Settings size={24} />
                            </button>

                            {showThemeMenu && (
                                <div className="absolute right-0 top-full mt-3 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden animate-pop origin-top-right ring-1 ring-black/5">
                                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-1 bg-slate-50 dark:bg-slate-950">
                                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block px-2">Görünüm</span>
                                    </div>
                                    <div className="p-2 flex flex-col gap-1.5">
                                        <button onClick={() => handleThemeSelect('light')} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full text-left ${themeMode === 'light' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                            <Sun size={18} /> Aydınlık {themeMode === 'light' && <Check size={16} className="ml-auto"/>}
                                        </button>
                                        <button onClick={() => handleThemeSelect('dark')} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full text-left ${themeMode === 'dark' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                            <Moon size={18} /> Karanlık {themeMode === 'dark' && <Check size={16} className="ml-auto"/>}
                                        </button>
                                        <button onClick={() => handleThemeSelect('system')} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full text-left ${themeMode === 'system' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                            <Smartphone size={18} /> Sistem {themeMode === 'system' && <Check size={16} className="ml-auto"/>}
                                        </button>
                                    </div>

                                    {/* Ayraç */}
                                    <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

                                    <div className="p-2">
                                        <button onClick={handlePrivacyClick} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full text-left text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                            <Shield size={18} /> Gizlilik Politikası
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden bg-warm-200 dark:bg-slate-950/50 transition-colors duration-500 w-full pb-20 sm:pb-24">
                {children}
            </main>

            {/* Bottom Navigation */}
            {showBottomNav && (
                <nav className="h-[90px] sm:h-24 bg-white/95 dark:bg-slate-950 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-around shrink-0 pb-safe px-3 absolute bottom-0 w-full z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-500">
                    <TabButton tab={AppTab.HOME} icon={Clock} label="Vakitler" />
                    <TabButton tab={AppTab.ZIKIR} icon={Home} label="Zikir" />
                    
                    {/* Orta Buton (Menü) */}
                    <div className="relative -top-6 sm:-top-7 group px-2">
                        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-50 dark:border-slate-950 transition-all active:scale-95 duration-200 ${showMenu ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-slate-500/30' : 'bg-emerald-600 text-white shadow-emerald-500/40'}`}
                        >
                            {showMenu ? <X size={30} className="sm:w-8 sm:h-8" /> : <LayoutGrid size={28} className="sm:w-8 sm:h-8" />}
                        </button>
                    </div>
                    
                    <TabButton tab={AppTab.QIBLA} icon={Compass} label="Kıble" />
                    <TabButton tab={AppTab.PROFILE} icon={User} label="Profil" />
                </nav>
            )}

            {/* Menu Overlay */}
            {showMenu && (
                <div className="absolute inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm animate-fade-in flex items-end justify-center pb-safe sm:items-center sm:pb-0 px-4 pt-10">
                    <div 
                        className="w-full bg-slate-100 dark:bg-slate-900 rounded-3xl shadow-2xl animate-slide-up border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col overflow-hidden mb-4 sm:mb-0 sm:max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0 z-10">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Menü</h3>
                            <button onClick={() => setShowMenu(false)} className="p-3 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"><X size={24}/></button>
                        </div>
              
                        <div className="overflow-y-auto p-5 no-scrollbar">
                            <div className="grid grid-cols-2 gap-3">
                                {PINNED_ITEMS.map((item) => (
                                    <button 
                                        key={item.id}
                                        onClick={() => { setActiveTab(item.tab as AppTab); setShowMenu(false); }}
                                        className={`col-span-2 flex flex-row items-center p-4 rounded-3xl border active:scale-95 transition-all group relative overflow-hidden shadow-lg border-transparent ${item.color}`}
                                    >
                                        <div className="absolute top-0 right-0 p-3 opacity-10 scale-150"><item.icon size={70} /></div>
                                        <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><item.icon size={24} /></div>
                                        <div className="text-left"><span className="font-bold text-lg block">{item.label}</span><span className="text-xs opacity-80 font-medium">Görüntülemek için dokunun</span></div>
                                    </button>
                                ))}

                                {sortedRegularItems.map((item) => (
                                    <button 
                                        key={item.id}
                                        onClick={() => {
                                            if (item.action) {
                                                item.action();
                                            } else if (item.tab) {
                                                setActiveTab(item.tab);
                                                setShowMenu(false);
                                            }
                                        }}
                                        className={`flex flex-col items-center justify-center p-5 rounded-3xl border active:scale-95 transition-all group ${item.color} border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md bg-opacity-40 dark:bg-opacity-10 bg-white dark:bg-slate-900`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${item.color.split(' ')[0]} bg-opacity-20 text-current`}>
                                            <item.icon size={24} />
                                        </div>
                                        <span className="font-bold text-sm text-center text-slate-700 dark:text-slate-200">{item.label}</span>
                                    </button>
                                ))}
                     
                                {deferredPrompt && (
                                    <button onClick={handleInstallClick} className="flex flex-col items-center justify-center p-5 bg-slate-800 dark:bg-slate-700 rounded-3xl border border-slate-700 dark:border-slate-600 active:scale-95 transition-all group col-span-2 shadow-lg">
                                        <div className="w-12 h-12 bg-slate-700 dark:bg-slate-600 text-white rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Download size={24} /></div>
                                        <span className="font-bold text-base text-white">Uygulamayı Yükle</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 -z-10" onClick={() => setShowMenu(false)}></div>
                </div>
            )}
        </div>
    );
};
