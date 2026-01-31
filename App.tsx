
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app'; 
import { AppTab } from './types';
import { WifiOff, RefreshCcw, Bell, X, Star, ThumbsUp, Loader2, Hand } from './components/Icons';
import { Zikirmatik } from './components/Zikirmatik';
import { Qibla } from './components/Qibla';
import { PrayerTimes } from './components/PrayerTimes';
import { GeminiAssistant } from './components/GeminiAssistant';
import { ReligiousDays } from './components/ReligiousDays';
import { Profile } from './components/Profile';
import { KazaTakip } from './components/KazaTakip';
import { MosqueFinder } from './components/MosqueFinder';
import { ReligiousNames } from './components/ReligiousNames';
import { Ramadan } from './components/Ramadan';
import { ZakatCalculator } from './components/ZakatCalculator';
import { IslamicQuiz } from './components/IslamicQuiz';
import { DuaCollection } from './components/DuaCollection';
import { CuzFinder } from './components/CuzFinder';
import { NotificationService } from './services/notificationService';
import { AdMobHandler } from './components/AdMobHandler';
import { MainLayout } from './components/MainLayout';
import { AppProvider, useApp } from './contexts/AppContext';
import { AudioProvider } from './contexts/AudioContext';
import { PrivacyPolicy } from './components/PrivacyPolicy';

// --- LAZY LOADING SETUP ---
const QuranReader = React.lazy(() => import('./components/QuranReader').then(module => ({ default: module.QuranReader })));
const AudioPlayer = React.lazy(() => import('./components/AudioPlayer').then(module => ({ default: module.AudioPlayer })));
const IslamicLibrary = React.lazy(() => import('./components/IslamicLibrary').then(module => ({ default: module.IslamicLibrary })));
const HadithReader = React.lazy(() => import('./components/HadithReader').then(module => ({ default: module.HadithReader })));
const EsmaulHusna = React.lazy(() => import('./components/EsmaulHusna').then(module => ({ default: module.EsmaulHusna })));

// Loading Component (Skeleton benzeri basit loader)
const PageLoader = () => (
    <div className="h-full flex flex-col items-center justify-center bg-warm-200 dark:bg-slate-950 text-slate-400">
        <Loader2 size={40} className="animate-spin mb-4 text-emerald-500" />
        <span className="text-sm font-medium animate-pulse">Yükleniyor...</span>
    </div>
);

const AppContent: React.FC = () => {
  const { 
      activeTab, setActiveTab, 
      showMenu, setShowMenu, 
      isOnline 
  } = useApp();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  
  // --- ANDROID BACK BUTTON HANDLER ---
  useEffect(() => {
      const handleBackButton = async () => {
          CapacitorApp.addListener('backButton', ({ canGoBack }) => {
              if (showRateModal) {
                  handleRateLater();
                  return;
              }
              if (showMenu) {
                  setShowMenu(false);
                  return;
              }
              if (activeTab !== AppTab.HOME) {
                  setActiveTab(AppTab.HOME);
                  return;
              }
              if (activeTab === AppTab.HOME) {
                  CapacitorApp.exitApp();
              }
          });
      };
      handleBackButton();

      return () => {
          CapacitorApp.removeAllListeners();
      };
  }, [showMenu, activeTab, showRateModal]);

  // --- RATE US LOGIC ---
  useEffect(() => {
      const checkRateCondition = () => {
          const now = new Date().getTime();
          const msInDay = 1000 * 60 * 60 * 24;

          const isRated = localStorage.getItem('app_rated') === 'true';
          if (isRated) return;

          let installDateStr = localStorage.getItem('install_date');
          if (!installDateStr) {
              localStorage.setItem('install_date', new Date().toISOString());
              return;
          }

          const installDate = new Date(installDateStr).getTime();
          const daysSinceInstall = (now - installDate) / msInDay;

          if (daysSinceInstall < 5) return;

          const lastPromptStr = localStorage.getItem('last_rate_prompt');
          if (lastPromptStr) {
              const lastPromptDate = new Date(lastPromptStr).getTime();
              const daysSinceLastPrompt = (now - lastPromptDate) / msInDay;
              if (daysSinceLastPrompt < 5) return;
          }

          setTimeout(() => setShowRateModal(true), 3000);
      };

      checkRateCondition();
  }, []);

  // --- PERMISSIONS LOGIC (SIMPLIFIED & ROBUST) ---
  useEffect(() => {
    // 1 saniye bekle, sonra kontrol et
    const timer = setTimeout(() => {
        const hasExplained = localStorage.getItem('permission_explained');
        // Session storage kontrolü: Bu oturumda zaten gösterildiyse tekrar gösterme
        const sessionChecked = sessionStorage.getItem('permission_session_check');

        if (!hasExplained && !sessionChecked) {
            setShowWelcomeModal(true);
            // Modal açıldığı an session'a kaydet ki refresh harici tekrar açılmasın
            sessionStorage.setItem('permission_session_check', 'true');
        }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRateNow = () => {
      window.open('https://play.google.com/store/apps/details?id=com.nur.app', '_system');
      localStorage.setItem('app_rated', 'true');
      setShowRateModal(false);
  };

  const handleRateLater = () => {
      localStorage.setItem('last_rate_prompt', new Date().toISOString());
      setShowRateModal(false);
  };

  const handleWelcomePermission = async () => {
      setShowWelcomeModal(false);
      localStorage.setItem('permission_explained', 'true');
      
      // Kullanıcı butona bastığında native izni iste
      // Sonuç ne olursa olsun (reddedilse bile) tekrar sormuyoruz.
      await NotificationService.requestPermissions();
  };

  const goHome = () => setActiveTab(AppTab.HOME);

  // --- RENDER CONTENT WRAPPED IN SUSPENSE & ANIMATION DIV ---
  const renderContent = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <div key={activeTab} className="h-full w-full animate-page-enter">
                {(() => {
                    switch (activeTab) {
                        case AppTab.HOME:
                            return <PrayerTimes />;
                        case AppTab.ZIKIR:
                            return <Zikirmatik onBack={goHome} />;
                        case AppTab.QIBLA:
                            return <Qibla onBack={goHome} />;
                        case AppTab.AI_ASSISTANT:
                        case AppTab.CHAT:
                            return <GeminiAssistant onBack={goHome} />;
                        case AppTab.CALENDAR:
                            return <ReligiousDays onBack={goHome} />;
                        case AppTab.PROFILE:
                            return <Profile onBack={goHome} />;
                        case AppTab.KAZA:
                            return <KazaTakip onBack={goHome} />;
                        case AppTab.QURAN:
                            return <QuranReader onBack={goHome} />;
                        case AppTab.AUDIO_QURAN:
                            return <AudioPlayer onBack={goHome} />;
                        case AppTab.MOSQUE_FINDER:
                            return <MosqueFinder onBack={goHome} />;
                        case AppTab.NAMES:
                            return <ReligiousNames onBack={goHome} />;
                        case AppTab.RAMADAN:
                            return <Ramadan onBack={goHome} />;
                        case AppTab.ZAKAT:
                            return <ZakatCalculator onBack={goHome} />;
                        case AppTab.LIBRARY:
                            return <IslamicLibrary onBack={goHome} />;
                        case AppTab.HADITH:
                            return <HadithReader onBack={goHome} />;
                        case AppTab.DUA:
                            return <DuaCollection onBack={goHome} />;
                        case AppTab.CUZ:
                            return <CuzFinder onBack={goHome} />;
                        case AppTab.ESMA_HUSNA:
                            return <EsmaulHusna onBack={goHome} />;
                        case AppTab.QUIZ:
                            return <IslamicQuiz onBack={goHome} />;
                        case AppTab.PRIVACY:
                            return <PrivacyPolicy onBack={goHome} />;
                        default:
                            return <PrayerTimes />;
                    }
                })()}
            </div>
        </Suspense>
    );
  };

  // --- OFFLINE EKRANI ---
  if (!isOnline) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-warm-200 dark:bg-slate-950 p-6 text-center animate-fade-in transition-colors duration-300">
         <div className="p-8 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-8 shadow-xl border border-red-200 dark:border-red-800">
           <WifiOff size={64} strokeWidth={1.5} />
         </div>
         <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">İnternet Bağlantısı Yok</h2>
         <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-xs leading-relaxed text-base font-medium">
           Uygulamayı kullanabilmek için lütfen internet bağlantınızı kontrol ediniz.
         </p>
         <button onClick={() => window.location.reload()} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold active:scale-95 transition-transform flex items-center gap-3 shadow-lg hover:shadow-xl">
           <RefreshCcw size={20} strokeWidth={2.5}/> Tekrar Dene
         </button>
      </div>
    )
  }

  // --- MAIN RENDER WITH LAYOUT ---
  const shouldShowHeader = activeTab === AppTab.HOME;
  const shouldShowBottomNav = true;

  return (
    <MainLayout
        showHeader={shouldShowHeader}
        showBottomNav={shouldShowBottomNav}
    >
        <AdMobHandler />

        {renderContent()}

        {/* --- MODALS (App Level) --- */}
        
        {/* Karşılama ve İzin İsteme Modalı */}
        {showWelcomeModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5">
                            <Bell size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Selamun Aleyküm</h2>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8">
                            Size namaz vakitleri ve özel günleri hatırlatmak için bildirim izni vermeniz gerekiyor. Sizi asla rahatsız etmeyeceğiz.
                        </p>
                        <button onClick={handleWelcomePermission} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-base shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                            Tamam, İzin Ver
                        </button>
                    </div>
                </div>
            </div>
        )}

        {showRateModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in" style={{ touchAction: 'none' }}>
                <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Star size={100} className="text-amber-500" /></div>
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-amber-50 dark:ring-amber-900/10"><ThumbsUp size={32} /></div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Memnun musunuz?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">Uygulamamızı beğendiyseniz Play Store'da bizi değerlendirerek destek olabilir, daha fazla kişiye ulaşmamıza vesile olabilirsiniz.</p>
                        <div className="w-full space-y-3">
                            <button onClick={handleRateNow} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"><Star size={18} fill="currentColor" /> Değerlendir</button>
                            <button onClick={handleRateLater} className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold active:scale-95 transition-all">Daha Sonra</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </MainLayout>
  );
};

export const App: React.FC = () => {
    return (
        <AppProvider>
            <AudioProvider>
                <AppContent />
            </AudioProvider>
        </AppProvider>
    );
};
