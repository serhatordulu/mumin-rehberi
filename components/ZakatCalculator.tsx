
import React, { useState, useEffect } from 'react';
import { Calculator, Coins, RotateCcw, ChevronLeft, Info, TrendingUp, Globe, Loader2, RefreshCcw, AlertTriangle, Check, X } from './Icons';

// Özel Altın Külçesi İkonu (SVG)
const GoldIngotIcon = ({ size = 24, className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M4 8l2.5-3h11L20 8M4 8v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M4 8l16 0" />
        <path d="M8 14h8" />
    </svg>
);

// Özel Türk Lirası İkonu (SVG)
const TurkishLiraIcon = ({ size = 24, className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M10 5v14" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M10 19a4 4 0 0 0 4-4" />
    </svg>
);

export const ZakatCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Varlıklar
    const [cash, setCash] = useState<number>(0);
    const [goldGram, setGoldGram] = useState<number>(0);
    const [foreignCurrency, setForeignCurrency] = useState<number>(0); // TL cinsinden toplam döviz
    const [debts, setDebts] = useState<number>(0);
    
    // Sabitler
    const [goldPrice, setGoldPrice] = useState<number>(0);
    const [loadingGold, setLoadingGold] = useState(false);
    const [apiError, setApiError] = useState(false);
    
    const [result, setResult] = useState<{totalAssets: number, nisapAmount: number, zakatAmount: number, isEligible: boolean} | null>(null);
    const [showInfo, setShowInfo] = useState(false);

    // Yardımcı: Sayı formatlama (API'den gelen stringleri parse eder)
    const parsePrice = (val: any): number => {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        
        let v = val.toString();
        // Örn: "3.100,50" -> "3100.50"
        if (v.includes('.') && v.includes(',')) {
            v = v.replace(/\./g, '').replace(',', '.');
        } 
        // Örn: "3100,50" -> "3100.50"
        else if (v.includes(',')) {
            v = v.replace(',', '.');
        }
        
        const parsed = parseFloat(v);
        return isNaN(parsed) ? 0 : parsed;
    };

    // API'den Altın Fiyatını Çek
    const fetchGoldPrice = async () => {
        setLoadingGold(true);
        setApiError(false);
        
        // Timeout kontrolü için AbortController
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 saniye zaman aşımı

        try {
            // 1. Kaynak: Truncgil (Daha güvenilir ve CORS dostu)
            // Cache-busting için time parametresi eklendi
            const response = await fetch('https://finans.truncgil.com/today.json?t=' + new Date().getTime(), {
                signal: controller.signal
            });

            if (response.ok) {
                const data = await response.json();
                // Olası anahtar isimlerini kontrol et
                const gold = data["Gram Altın"] || data["GRA"] || data["gram-altin"] || data["altin-gram"];
                
                if (gold) {
                    // Satış veya Selling değerini al
                    const price = gold.Satış || gold.Selling || gold.satis;
                    const parsedPrice = parsePrice(price);
                    
                    if (parsedPrice > 0) {
                        setGoldPrice(parsedPrice);
                        setApiError(false);
                        return; // Başarılı, çık
                    }
                }
            }
            
            throw new Error("Veri çekilemedi veya format hatalı");

        } catch (error) {
            console.warn("Altın fiyatı alınamadı (Truncgil):", error);
            
            // Yedek Kaynak: AllOrigins Proxy üzerinden Genelpara
            try {
                const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.genelpara.com/embed/altin.json');
                const res = await fetch(proxyUrl);
                if (res.ok) {
                    const json = await res.json();
                    const data = JSON.parse(json.contents);
                    if (data?.GA?.satis) {
                        const price = parsePrice(data.GA.satis);
                        if (price > 0) {
                            setGoldPrice(price);
                            setApiError(false);
                            return;
                        }
                    }
                }
            } catch (e) {
                console.error("Yedek kaynak da başarısız oldu.");
            }

            // Hiçbiri çalışmadıysa
            setApiError(true);
            setGoldPrice(0);
            
        } finally {
            clearTimeout(timeoutId);
            setLoadingGold(false);
        }
    };

    // Component mount olduğunda fiyatı çek
    useEffect(() => {
        fetchGoldPrice();
    }, []);

    // Otomatik Hesaplama
    useEffect(() => {
        const currentGoldPrice = goldPrice;
        
        // Inputlar boş gelirse 0 kabul et
        const safeCash = isNaN(cash) ? 0 : cash;
        const safeForeign = isNaN(foreignCurrency) ? 0 : foreignCurrency;
        const safeGoldGram = isNaN(goldGram) ? 0 : goldGram;
        const safeDebts = isNaN(debts) ? 0 : debts;

        const totalAssets = safeCash + safeForeign + (safeGoldGram * currentGoldPrice);
        const netAssets = totalAssets - safeDebts;
        const nisapAmount = 80.18 * currentGoldPrice; // 80.18 gr altın
        
        // Mantık: Altın fiyatı 0'dan büyük olmalı (veri gelmiş olmalı) VE net varlık nisap miktarını geçmeli
        const isEligible = currentGoldPrice > 0 && netAssets > 0 && netAssets >= nisapAmount;
        const zakatAmount = isEligible ? netAssets * 0.025 : 0; // %2.5 veya 1/40

        setResult({
            totalAssets: netAssets,
            nisapAmount,
            zakatAmount,
            isEligible
        });
    }, [cash, goldGram, foreignCurrency, debts, goldPrice]);

    const handleReset = () => {
        setCash(0);
        setGoldGram(0);
        setForeignCurrency(0);
        setDebts(0);
        if(navigator.vibrate) navigator.vibrate(50);
    };

    const formatCurrency = (amount: number) => {
        // Intl.NumberFormat bazen ₺ simgesini render edemeyebilir (kare çıkar).
        // Bu yüzden manuel olarak "TL" ekliyoruz.
        return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(amount) + " TL";
    };

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            {/* Header - pt-safe eklendi */}
            <div className="flex items-center justify-between px-6 py-4 pt-safe bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-50">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Zekat Hesapla</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">1/40 (Kırkta Bir)</p>
                </div>
                <button onClick={() => setShowInfo(!showInfo)} className="p-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500">
                    <Info size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24 space-y-6">
                
                {/* Result Card */}
                <div className={`rounded-3xl p-6 shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col ${result?.isEligible ? 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    
                    {/* Background Icon */}
                    <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                        <Coins size={120} />
                    </div>
                    
                    <div className="relative z-10 text-center mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Verilecek Zekat Miktarı</span>
                        <div className="text-5xl font-mono font-bold mt-2 tracking-tight">
                            {formatCurrency(result?.zakatAmount || 0)}
                        </div>
                    </div>

                    {/* Comparison Bar */}
                    <div className="relative z-10 bg-black/10 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="flex justify-between text-xs font-bold mb-2 opacity-90">
                            <span>Sizin Varlığınız</span>
                            <span>Nisap Sınırı</span>
                        </div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-lg font-mono font-bold leading-none">{formatCurrency(result?.totalAssets || 0)}</span>
                            <span className="text-sm font-mono opacity-80">{formatCurrency(result?.nisapAmount || 0)}</span>
                        </div>
                        
                        {/* Progress Bar Visual */}
                        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden flex">
                            <div 
                                className={`h-full transition-all duration-700 ease-out ${result?.isEligible ? 'bg-white' : 'bg-slate-400'}`}
                                style={{ width: `${Math.min(100, ((result?.totalAssets || 0) / (result?.nisapAmount || 1)) * 100)}%` }}
                            ></div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs font-bold">
                            {result?.isEligible ? (
                                <><Check size={14} className="text-emerald-300" /> <span>Nisap miktarı aşıldı, zekat gerekir.</span></>
                            ) : (
                                <><X size={14} className="opacity-70" /> <span>Henüz nisap miktarına ulaşılmadı.</span></>
                            )}
                        </div>
                    </div>
                </div>

                {/* Settings (Gold Price) */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${apiError ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/40' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/40'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${apiError ? 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300' : 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300'}`}>
                            {apiError ? <AlertTriangle size={20} /> : <TrendingUp size={20} />}
                        </div>
                        <div>
                            <p className={`text-xs font-bold uppercase ${apiError ? 'text-red-800 dark:text-red-200' : 'text-amber-800 dark:text-amber-200'}`}>
                                Gram Altın Fiyatı
                            </p>
                            <p className={`text-[10px] ${apiError ? 'text-red-600 dark:text-red-400 font-bold' : 'text-amber-600 dark:text-amber-400'}`}>
                                {loadingGold ? "Güncelleniyor..." : apiError ? "Sunucuya erişilemedi. Lütfen fiyatı manuel giriniz." : "Canlı Veri (Otomatik)"}
                            </p>
                        </div>
                    </div>
                    <div className="relative w-32 flex items-center gap-2">
                        <div className="relative w-full">
                            <input 
                                type="number" 
                                value={goldPrice === 0 ? '' : goldPrice} 
                                onChange={(e) => {
                                    setGoldPrice(parseFloat(e.target.value) || 0);
                                    setApiError(false); // Kullanıcı elle girerse hatayı kaldır
                                }}
                                placeholder="Fiyat"
                                className={`w-full bg-white dark:bg-slate-900 border rounded-lg py-2 px-2 text-right font-bold text-sm outline-none focus:ring-2 ${apiError || goldPrice === 0 ? 'border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 focus:ring-red-400 placeholder:text-red-300 animate-pulse' : 'border-amber-200 dark:border-amber-800 text-slate-800 dark:text-white focus:ring-amber-400'}`}
                            />
                        </div>
                        <button 
                            onClick={fetchGoldPrice} 
                            disabled={loadingGold}
                            className={`p-2 rounded-lg active:scale-95 transition-transform ${apiError ? 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300' : 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300'}`}
                        >
                            {loadingGold ? <Loader2 size={16} className="animate-spin"/> : <RefreshCcw size={16}/>}
                        </button>
                    </div>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white px-1">Varlıklar</h3>
                    
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                            <TurkishLiraIcon size={24} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 block mb-1">Nakit Para (TL)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={cash || ''} 
                                onChange={(e) => setCash(parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full bg-transparent font-mono font-bold text-lg text-slate-900 dark:text-white outline-none placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500/50 transition-all">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-xl shadow-inner">
                            {/* Külçe Altın İkonu */}
                            <GoldIngotIcon size={24} className="drop-shadow-sm" />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 block mb-1">Altın (Gram)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={goldGram || ''} 
                                onChange={(e) => setGoldGram(parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full bg-transparent font-mono font-bold text-lg text-slate-900 dark:text-white outline-none placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                            <Globe size={24} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 block mb-1">Döviz ve Diğer (TL Karşılığı)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={foreignCurrency || ''} 
                                onChange={(e) => setForeignCurrency(parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full bg-transparent font-mono font-bold text-lg text-slate-900 dark:text-white outline-none placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white px-1 pt-2">Borçlar</h3>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/50 transition-all">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
                            <TrendingUp size={24} className="rotate-180" />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 block mb-1">Borçlar (Düşülecek)</label>
                            <input 
                                type="number" 
                                min="0"
                                value={debts || ''} 
                                onChange={(e) => setDebts(parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full bg-transparent font-mono font-bold text-lg text-slate-900 dark:text-white outline-none placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </div>

                <button onClick={handleReset} className="w-full py-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-bold flex items-center justify-center gap-2">
                    <RotateCcw size={16} /> Formu Temizle
                </button>

                {showInfo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowInfo(false)}>
                        <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Zekat Hakkında</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                Zekat, hicri yıl üzerinden bir yıl geçmiş, nisap miktarına (80.18 gr altın) ulaşan ve borçlar düşüldükten sonra kalan artıcı (nema) vasfındaki malın %2.5'inin (kırkta bir) ihtiyaç sahiplerine verilmesidir.
                            </p>
                            <button onClick={() => setShowInfo(false)} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold">Anlaşıldı</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
