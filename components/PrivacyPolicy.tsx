
import React from 'react';
import { ChevronLeft, Shield, Lock, MapPin, Smartphone, Globe, Share2 } from './Icons';

interface PrivacyPolicyProps {
    onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Gizlilik Politikası</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Son Güncelleme: 20 Mayıs 2025</p>
                </div>
                <div className="w-10"></div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Genel Bakış</h3>
                    </div>
                    <p>
                        "Mümin Rehberi" (bundan böyle "Uygulama" olarak anılacaktır) olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu Gizlilik Politikası, uygulamamızı kullandığınızda hangi verilerin toplandığını, nasıl kullanıldığını ve paylaşıldığını açıklar. Uygulamayı kullanarak bu politikada belirtilen şartları kabul etmiş olursunuz.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white px-2">Toplanan Bilgiler ve İzinler</h3>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-start gap-3">
                            <MapPin className="text-indigo-500 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Konum Verileri (Location)</h4>
                                <p className="text-xs opacity-80">
                                    Uygulama, <strong>Namaz Vakitleri</strong>, <strong>Kıble Pusulası</strong> ve <strong>Yakınlardaki Camiler</strong> özelliklerinin çalışabilmesi için hassas (GPS) veya yaklaşık konum verilerine erişim izni isteyebilir. Bu veriler anlık hesaplamalar için cihazınızda işlenir ve sunucularımızda kalıcı olarak depolanmaz.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-start gap-3">
                            <Smartphone className="text-amber-500 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Cihaz ve Kullanım Verileri</h4>
                                <p className="text-xs opacity-80">
                                    Hizmetlerimizi geliştirmek, hataları gidermek ve reklam gösterimi sağlamak amacıyla cihaz modeli, işletim sistemi sürümü, benzersiz cihaz tanımlayıcıları (Advertising ID gibi) ve kullanım istatistikleri toplanabilir.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-start gap-3">
                            <Globe className="text-blue-500 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Üçüncü Taraf Hizmetler</h4>
                                <p className="text-xs opacity-80 mb-2">Uygulama aşağıdaki üçüncü taraf hizmet sağlayıcılarını kullanır:</p>
                                <ul className="list-disc list-inside text-xs opacity-80 space-y-1">
                                    <li><strong>Google AdMob:</strong> Reklam gösterimi için (Kullanıcı verilerini ve Reklam Kimliğini kullanabilir).</li>
                                    <li><strong>Google Gemini API:</strong> Dini asistan özelliği için metin girdilerinizi işler.</li>
                                    <li><strong>Aladhan API & OpenStreetMap:</strong> Namaz vakitleri ve harita verileri için.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white px-2">Veri Güvenliği</h3>
                    <p className="px-2 opacity-90">
                        Kişisel verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz. Ancak, internet üzerinden yapılan hiçbir iletimin %100 güvenli garanti edilemeyeceğini unutmayınız. Uygulamamız, kişisel kimlik bilgilerinizi (Ad, Soyad, E-posta vb.) sunucularımızda saklamaz; bu bilgiler sadece cihazınızın yerel hafızasında (Local Storage) tutulur.
                    </p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl text-center">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">İletişim</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Bu gizlilik politikası hakkında sorularınız veya önerileriniz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.
                    </p>
                    <a href="mailto:serhatordulu83@gmail.com" className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors">
                        <Share2 size={18} /> E-posta Gönder
                    </a>
                </div>

                <div className="pb-24 text-center text-[10px] text-slate-400">
                    <p>&copy; 2025 Mümin Rehberi. Tüm Hakları Saklıdır.</p>
                </div>
            </div>
        </div>
    );
};
