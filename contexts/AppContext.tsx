
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTab, ThemeMode } from '../types';

interface AppContextType {
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    showMenu: boolean;
    setShowMenu: (show: boolean) => void;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    isOnline: boolean;
    deferredPrompt: any;
    setDeferredPrompt: (prompt: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
    const [showMenu, setShowMenu] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Theme State
    const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme_mode');
            if (saved === 'light' || saved === 'dark' || saved === 'system') return saved as ThemeMode;
        }
        return 'system';
    });

    // --- EFFECTS ---
    
    // Theme Effect
    useEffect(() => {
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const applyTheme = (isDark: boolean) => {
            if (isDark) {
                root.classList.add('dark');
                document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#15202b');
            } else {
                root.classList.remove('dark');
                document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#E6E4DD');
            }
        };

        if (themeMode === 'system') {
            applyTheme(mediaQuery.matches);
            const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        } else {
            applyTheme(themeMode === 'dark');
        }
        localStorage.setItem('theme_mode', themeMode);
    }, [themeMode]);

    // Online Status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // PWA Prompt
    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // Wrappers to handle additional logic if needed
    const setThemeMode = (mode: ThemeMode) => setThemeModeState(mode);

    return (
        <AppContext.Provider value={{
            activeTab, setActiveTab,
            showMenu, setShowMenu,
            themeMode, setThemeMode,
            isOnline,
            deferredPrompt, setDeferredPrompt
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
