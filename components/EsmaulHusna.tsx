
import React, { useState } from 'react';
import { Search, ChevronRight, BookOpen, Share2, Copy, Check, X, ChevronLeft, AlignRight } from './Icons';
import { Share } from '@capacitor/share';

interface Esma {
    id: number;
    name: string;
    arabic: string;
    meaning: string;
    dhikr_count: number;
}

const ESMA_DATA: Esma[] = [
    { id: 1, name: "Allah", arabic: "الله", meaning: "Eşi benzeri olmayan, bütün noksan sıfatlardan münezzeh tek ilah, her şeyin yaratıcısı.", dhikr_count: 66 },
    { id: 2, name: "Er-Rahman", arabic: "الرحمن", meaning: "Dünyada bütün mahlukata merhamet eden, şefkat gösteren, ihsan eden.", dhikr_count: 298 },
    { id: 3, name: "Er-Rahim", arabic: "الرحيم", meaning: "Ahirette sadece müminlere merhamet eden, onlara acıyan.", dhikr_count: 258 },
    { id: 4, name: "El-Melik", arabic: "الملك", meaning: "Mülkün, kainatın sahibi, mülk ve saltanatı devamlı olan.", dhikr_count: 90 },
    { id: 5, name: "El-Kuddüs", arabic: "القدوس", meaning: "Her noksanlıktan uzak ve her türlü takdise layık olan, tertemiz.", dhikr_count: 170 },
    { id: 6, name: "Es-Selam", arabic: "السلام", meaning: "Her türlü tehlikeden kullarını selamete çıkaran, cennetteki kullarına selam eden.", dhikr_count: 131 },
    { id: 7, name: "El-Mü'min", arabic: "المؤمن", meaning: "Güven veren, emin kılan, koruyan, iman nurunu veren.", dhikr_count: 137 },
    { id: 8, name: "El-Müheymin", arabic: "المهيمن", meaning: "Her şeyi görüp gözeten, her varlığın yaptıklarından haberdar olan.", dhikr_count: 145 },
    { id: 9, name: "El-Aziz", arabic: "العزيز", meaning: "İzzet sahibi, her şeye galip gelen, mağlup edilmesi imkansız olan.", dhikr_count: 94 },
    { id: 10, name: "El-Cebbar", arabic: "الجبار", meaning: "Azamet ve kudret sahibi. Dilediğini yapan ve yaptıran, hükmüne karşı gelinemeyen.", dhikr_count: 206 },
    { id: 11, name: "El-Mütekebbir", arabic: "المتكبر", meaning: "Büyüklükte eşi, benzeri olmayan, büyüklüğünü her şeyde gösteren.", dhikr_count: 662 },
    { id: 12, name: "El-Halık", arabic: "الخالق", meaning: "Yaratan, yoktan var eden, her şeyin varlığını ve geçireceği halleri takdir eden.", dhikr_count: 731 },
    { id: 13, name: "El-Bari", arabic: "البارئ", meaning: "Her şeyi kusursuz ve uyumlu yaratan, birbirinden farklı sanat harikaları vücuda getiren.", dhikr_count: 214 },
    { id: 14, name: "El-Musavvir", arabic: "المصور", meaning: "Varlıklara şekil veren, tasvir eden, her şeye bir suret giydiren.", dhikr_count: 336 },
    { id: 15, name: "El-Gaffar", arabic: "الغفار", meaning: "Günahları örten ve çok mağfiret eden, kullarının günahlarını bağışlayan.", dhikr_count: 1281 },
    { id: 16, name: "El-Kahhar", arabic: "القهار", meaning: "Her şeye, her istediğini yapacak surette galip ve hakim olan, düşmanlarını kahreden.", dhikr_count: 306 },
    { id: 17, name: "El-Vehhab", arabic: "الوهاب", meaning: "Karşılıksız hibeler veren, çok fazla ihsan eden, nimetleri bol bol veren.", dhikr_count: 14 },
    { id: 18, name: "Er-Rezzak", arabic: "الرزاق", meaning: "Bütün mahlukatın rızkını veren ve ihtiyacını karşılayan.", dhikr_count: 308 },
    { id: 19, name: "El-Fettah", arabic: "الفتاح", meaning: "Her türlü müşkülleri açan ve kolaylaştıran, darlıktan kurtaran.", dhikr_count: 489 },
    { id: 20, name: "El-Alim", arabic: "العليم", meaning: "Gizli açık, geçmiş, gelecek her şeyi en ince detaylarına kadar bilen.", dhikr_count: 150 },
    { id: 21, name: "El-Kabız", arabic: "القابض", meaning: "Dilediğinin rızkını daraltan, ruhları alan, sıkan, daraltan.", dhikr_count: 903 },
    { id: 22, name: "El-Basıt", arabic: "الباسط", meaning: "Dilediğinin rızkını genişleten, ruhları veren, ferahlatan, açan.", dhikr_count: 72 },
    { id: 23, name: "El-Hafıd", arabic: "الخافض", meaning: "Dereceleri alçaltan, kafirleri zillete düşüren.", dhikr_count: 1481 },
    { id: 24, name: "Er-Rafi", arabic: "الرافع", meaning: "Şeref verip yükselten, müminlerin derecesini artıran.", dhikr_count: 351 },
    { id: 25, name: "El-Muiz", arabic: "المعز", meaning: "Dilediğini aziz eden, izzet veren, şereflendiren.", dhikr_count: 117 },
    { id: 26, name: "El-Müzil", arabic: "المذل", meaning: "Dilediğini zillete düşüren, hor ve hakir eden.", dhikr_count: 770 },
    { id: 27, name: "Es-Semi", arabic: "السميع", meaning: "Her şeyi en iyi işiten, duaları kabul eden.", dhikr_count: 180 },
    { id: 28, name: "El-Basir", arabic: "البصير", meaning: "Gizli açık, her şeyi en iyi gören.", dhikr_count: 302 },
    { id: 29, name: "El-Hakem", arabic: "الحكم", meaning: "Mutlak hakim, hakkı batıldan ayıran, hüküm veren.", dhikr_count: 68 },
    { id: 30, name: "El-Adl", arabic: "العدل", meaning: "Mutlak adil, çok adaletli, asla zulmetmeyen.", dhikr_count: 104 },
    { id: 31, name: "El-Latif", arabic: "اللطيف", meaning: "Lütuf ve ihsan sahibi, en ince işlerin bütün inceliklerini bilen.", dhikr_count: 129 },
    { id: 32, name: "El-Habir", arabic: "الخبير", meaning: "Her şeyden haberdar olan, her şeyin iç yüzünü bilen.", dhikr_count: 812 },
    { id: 33, name: "El-Halim", arabic: "الحليم", meaning: "Yumuşak huylu, acele etmeyen, ceza vermede aceleci olmayan.", dhikr_count: 88 },
    { id: 34, name: "El-Azim", arabic: "العظيم", meaning: "Büyüklükte benzeri olmayan, pek yüce.", dhikr_count: 1020 },
    { id: 35, name: "El-Gafur", arabic: "الغفور", meaning: "Affı, mağfireti bol olan, günahları bağışlayan.", dhikr_count: 1286 },
    { id: 36, name: "Eş-Şekur", arabic: "الشكور", meaning: "Az amele, çok sevap veren, şükreden kullarını mükafatlandıran.", dhikr_count: 526 },
    { id: 37, name: "El-Aliyy", arabic: "العلي", meaning: "Yüceler yücesi, çok yüce olan.", dhikr_count: 110 },
    { id: 38, name: "El-Kebir", arabic: "الكبير", meaning: "Büyüklükte benzeri olmayan, pek büyük.", dhikr_count: 232 },
    { id: 39, name: "El-Hafiz", arabic: "الحفيظ", meaning: "Her şeyi koruyup saklayan, muhafaza eden.", dhikr_count: 998 },
    { id: 40, name: "El-Mukit", arabic: "المقيت", meaning: "Her yaratılmışın rızkını, gıdasını veren, tayin eden.", dhikr_count: 550 },
    { id: 41, name: "El-Hasib", arabic: "الحسيب", meaning: "Kulların hesabını en iyi gören, herkese yeten.", dhikr_count: 80 },
    { id: 42, name: "El-Celil", arabic: "الجليل", meaning: "Celal ve azamet sahibi olan, büyüklük sahibi.", dhikr_count: 73 },
    { id: 43, name: "El-Kerim", arabic: "الكريم", meaning: "Çok ikram eden, keremi, lütfu ve ihsanı bol olan.", dhikr_count: 270 },
    { id: 44, name: "Er-Rakib", arabic: "الرقيب", meaning: "Her varlığı, her işi her an görüp, gözeten, kontrolü altında tutan.", dhikr_count: 312 },
    { id: 45, name: "El-Mucib", arabic: "المجيب", meaning: "Duaları, istekleri kabul eden, cevap veren.", dhikr_count: 55 },
    { id: 46, name: "El-Vasi", arabic: "الواسع", meaning: "Rahmeti, kudreti, ilmi ve ihsanı her şeyi kuşatan, geniş olan.", dhikr_count: 137 },
    { id: 47, name: "El-Hakim", arabic: "الحكيم", meaning: "Her işi hikmetli, her şeyi hikmetle yaratan.", dhikr_count: 78 },
    { id: 48, name: "El-Vedud", arabic: "الودود", meaning: "Kullarını çok seven, sevilmeye gerçekten layık olan.", dhikr_count: 20 },
    { id: 49, name: "El-Mecid", arabic: "المجيد", meaning: "Şanı, şerefi çok üstün olan, övülmeye layık.", dhikr_count: 57 },
    { id: 50, name: "El-Bais", arabic: "الباعث", meaning: "Ölüleri dirilten, peygamberler gönderen.", dhikr_count: 573 },
    { id: 51, name: "Eş-Şehid", arabic: "الشهيد", meaning: "Her zaman her yerde hazır ve nazır olan, her şeye şahitlik eden.", dhikr_count: 319 },
    { id: 52, name: "El-Hakk", arabic: "الحق", meaning: "Varlığı hiç değişmeden duran, var olan, hakkı ortaya çıkaran.", dhikr_count: 108 },
    { id: 53, name: "El-Vekil", arabic: "الوكيل", meaning: "Kulların işlerini bitiren, tevekkül edenlerin işini en iyi neticeye ulaştıran.", dhikr_count: 66 },
    { id: 54, name: "El-Kaviyy", arabic: "القوي", meaning: "Kudreti en üstün ve hiç azalmaz olan, pek kuvvetli.", dhikr_count: 116 },
    { id: 55, name: "El-Metin", arabic: "المتين", meaning: "Kuvvet ve kudret kaynağı, pek güçlü, sarsılmaz.", dhikr_count: 500 },
    { id: 56, name: "El-Veliyy", arabic: "الولي", meaning: "Müslümanların dostu, onları sevip yardım eden.", dhikr_count: 46 },
    { id: 57, name: "El-Hamid", arabic: "الحميد", meaning: "Her türlü övgüye layık olan, hamd edilen.", dhikr_count: 62 },
    { id: 58, name: "El-Muhsi", arabic: "المحصي", meaning: "Yarattığı ve yaratacağı bütün varlıkların sayısını bilen.", dhikr_count: 148 },
    { id: 59, name: "El-Mübdi", arabic: "المبدئ", meaning: "Mahlukatı maddesiz ve örneksiz olarak ilk baştan yaratan.", dhikr_count: 57 },
    { id: 60, name: "El-Muid", arabic: "المعيد", meaning: "Yaratılmışları yok ettikten sonra tekrar yaratan.", dhikr_count: 124 },
    { id: 61, name: "El-Muhyi", arabic: "المحيي", meaning: "İhya eden, dirilten, can veren.", dhikr_count: 68 },
    { id: 62, name: "El-Mumit", arabic: "المميت", meaning: "Her canlıya ölümü tattıran, öldüren.", dhikr_count: 490 },
    { id: 63, name: "El-Hayy", arabic: "الحي", meaning: "Ezeli ve ebedi hayatla diri olan.", dhikr_count: 18 },
    { id: 64, name: "El-Kayyum", arabic: "القيوم", meaning: "Mahlukları varlıkta durduran, zatı ile kaim olan.", dhikr_count: 156 },
    { id: 65, name: "El-Vacid", arabic: "الواجد", meaning: "Kendisinden hiçbir şey gizli kalmayan, dilediğini dilediği vakit bulan.", dhikr_count: 14 },
    { id: 66, name: "El-Macid", arabic: "الماجد", meaning: "Kadri ve şanı büyük, keremi, ihsanı bol olan.", dhikr_count: 48 },
    { id: 67, name: "El-Vahid", arabic: "الواحد", meaning: "Zat, sıfat ve fiillerinde benzeri ve ortağı olmayan, tek olan.", dhikr_count: 19 },
    { id: 68, name: "Es-Samed", arabic: "الصمد", meaning: "Hiçbir şeye muhtaç olmayan, herkesin muhtaç olduğu.", dhikr_count: 134 },
    { id: 69, name: "El-Kadir", arabic: "القادر", meaning: "Dilediğini dilediği gibi yaratmaya muktedir olan, gücü yeten.", dhikr_count: 305 },
    { id: 70, name: "El-Muktedir", arabic: "المقتدر", meaning: "Dilediği gibi tasarruf eden, her şeyi kolayca yaratan kudret sahibi.", dhikr_count: 744 },
    { id: 71, name: "El-Mukaddim", arabic: "المقدم", meaning: "Dilediğini öne alan, yükselten.", dhikr_count: 184 },
    { id: 72, name: "El-Muahhir", arabic: "المؤخر", meaning: "Dilediğini sona bırakan, erteleyen, alçaltan.", dhikr_count: 847 },
    { id: 73, name: "El-Evvel", arabic: "الأول", meaning: "Ezeli olan, varlığının başlangıcı olmayan.", dhikr_count: 37 },
    { id: 74, name: "El-Ahir", arabic: "الآخر", meaning: "Ebedi olan, varlığının sonu olmayan.", dhikr_count: 801 },
    { id: 75, name: "Ez-Zahir", arabic: "الظاهر", meaning: "Varlığı sayısız delillerle açık olan, aşikar.", dhikr_count: 1106 },
    { id: 76, name: "El-Batın", arabic: "الباطن", meaning: "Akılların idrak edemeyeceği, yüceliği gizli olan.", dhikr_count: 62 },
    { id: 77, name: "El-Vali", arabic: "الوالي", meaning: "Bütün kainatı idare eden, onların işlerini yoluna koyan.", dhikr_count: 47 },
    { id: 78, name: "El-Müteali", arabic: "المتعالي", meaning: "Son derece yüce olan, noksanlıklardan münezzeh.", dhikr_count: 551 },
    { id: 79, name: "El-Berr", arabic: "البر", meaning: "İyilik ve ihsanı bol, iyilik ve güzellik kaynağı.", dhikr_count: 202 },
    { id: 80, name: "Et-Tevvab", arabic: "التواب", meaning: "Tövbeleri kabul edip, günahları bağışlayan.", dhikr_count: 409 },
    { id: 81, name: "El-Müntakim", arabic: "المنتقم", meaning: "Asilerin, zalimlerin cezasını veren, intikam alan.", dhikr_count: 630 },
    { id: 82, name: "El-Afüvv", arabic: "العفو", meaning: "Affı çok olan, günahları yok eden.", dhikr_count: 156 },
    { id: 83, name: "Er-Rauf", arabic: "الرؤوف", meaning: "Çok merhametli, pek şefkatli.", dhikr_count: 287 },
    { id: 84, name: "Malikü'l-Mülk", arabic: "مالك الملك", meaning: "Mülkün, her varlığın, kainatın sahibi.", dhikr_count: 212 },
    { id: 85, name: "Zü'l-Celali ve'l-İkram", arabic: "ذو الجلال والإكرام", meaning: "Celal, büyüklük, şeref, kemal ve ikram sahibi.", dhikr_count: 1100 },
    { id: 86, name: "El-Muksit", arabic: "المقسط", meaning: "Bütün işlerini denk, birbirine uygun ve yerli yerinde yapan, adaletli.", dhikr_count: 209 },
    { id: 87, name: "El-Cami", arabic: "الجامع", meaning: "İstediğini, istediği zaman, istediği yerde toplayan.", dhikr_count: 114 },
    { id: 88, name: "El-Ganiyy", arabic: "الغني", meaning: "Çok zengin, hiçbir şeye muhtaç olmayan.", dhikr_count: 1060 },
    { id: 89, name: "El-Muğni", arabic: "المغني", meaning: "Dilediğini zengin eden, ihtiyaçlarını gideren.", dhikr_count: 1100 },
    { id: 90, name: "El-Mani", arabic: "المانع", meaning: "Bir şeyin meydana gelmesine izin vermeyen, engelleyen.", dhikr_count: 161 },
    { id: 91, name: "Ed-Darr", arabic: "الضار", meaning: "Elem, zarar verenleri yaratan, imtihan eden.", dhikr_count: 1001 },
    { id: 92, name: "En-Nafi", arabic: "النافع", meaning: "Fayda verenleri yaratan, kullarına faydalı olan.", dhikr_count: 201 },
    { id: 93, name: "En-Nur", arabic: "النور", meaning: "Alemleri nurlandıran, dilediğine nur veren.", dhikr_count: 256 },
    { id: 94, name: "El-Hadi", arabic: "الهادي", meaning: "Hidayet veren, doğru yolu gösteren.", dhikr_count: 20 },
    { id: 95, name: "El-Bedi", arabic: "البديع", meaning: "Eşi ve benzeri olmayan güzellikler yaratan, icat eden.", dhikr_count: 86 },
    { id: 96, name: "El-Baki", arabic: "الباقي", meaning: "Varlığına son olmayan, ebedi olan.", dhikr_count: 113 },
    { id: 97, name: "El-Varis", arabic: "الوارث", meaning: "Her şeyin asıl sahibi olan, mülk O'na kalan.", dhikr_count: 707 },
    { id: 98, name: "Er-Reşid", arabic: "الرشيد", meaning: "Bütün işleri ezeli takdirine göre yürütüp, dosdoğru bir nizam ile sonuca ulaştıran.", dhikr_count: 514 },
    { id: 99, name: "Es-Sabur", arabic: "الصبور", meaning: "Çok sabırlı olan, ceza vermede acele etmeyen.", dhikr_count: 298 }
];

export const EsmaulHusna: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEsma, setSelectedEsma] = useState<Esma | null>(null);
    const [copied, setCopied] = useState(false);

    // Türkçe karakter ve şapkalı harf normalizasyonu
    const normalizeSearchText = (text: string) => {
        return text
            .toLocaleLowerCase('tr')
            .replace(/â/g, 'a')
            .replace(/î/g, 'i')
            .replace(/û/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ğ/g, 'g')
            .replace(/ç/g, 'c')
            .replace(/ü/g, 'u')
            .replace(/ö/g, 'o')
            .replace(/ı/g, 'i');
    };

    // Akıllı filtreleme
    const filteredEsma = ESMA_DATA.filter(esma => 
        normalizeSearchText(esma.name).includes(normalizeSearchText(searchTerm)) || 
        normalizeSearchText(esma.meaning).includes(normalizeSearchText(searchTerm))
    );

    const handleCopy = () => {
        if (!selectedEsma) return;
        navigator.clipboard.writeText(`${selectedEsma.name} (${selectedEsma.arabic}): ${selectedEsma.meaning}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleShare = async (e: React.MouseEvent, esma: Esma) => {
        e.stopPropagation(); // Kart tıklamasını engelle
        const text = `✨ Esma-ül Hüsna\n\n${esma.name} (${esma.arabic})\nZikir Sayısı: ${esma.dhikr_count}\nAnlamı: ${esma.meaning}\n\n📍 Mümin Rehberi`;
        
        try {
            await Share.share({
                title: `Esma-ül Hüsna: ${esma.name}`,
                text: text,
                dialogTitle: 'Paylaş',
            });
        } catch (e) {
            // Fallback
             if (navigator.share) {
                try {
                    await navigator.share({
                        title: `Esma-ül Hüsna: ${esma.name}`,
                        text: text,
                    });
                } catch (err) {}
             } else {
                 navigator.clipboard.writeText(text);
                 if (navigator.vibrate) navigator.vibrate(50);
             }
        }
    };

    return (
        <div 
            className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up"
        >
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Esma-ül Hüsna</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">En Güzel İsimler O'nundur</p>
                </div>
                <div className="w-10"></div>
            </div>

            {/* Search Bar */}
            <div className="px-6 pt-4 pb-2">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="İsim veya anlam ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>
            </div>

            {/* Grid List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-2">
                <div className="grid grid-cols-2 gap-3 pb-40">
                    {filteredEsma.map((esma, idx) => (
                        <div 
                            key={esma.id}
                            onClick={() => setSelectedEsma(esma)}
                            className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all flex flex-col items-center text-center group relative cursor-pointer opacity-0 animate-fade-in-up`}
                            style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}
                        >
                            <button 
                                onClick={(e) => handleShare(e, esma)}
                                className="absolute top-2 right-2 p-2 rounded-full text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all z-10"
                            >
                                <Share2 size={16} />
                            </button>

                            <span className="text-3xl font-['Amiri'] text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform">{esma.arabic}</span>
                            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">{esma.name}</span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">{esma.meaning}</span>
                        </div>
                    ))}
                </div>

                {filteredEsma.length === 0 && (
                    <div className="text-center py-10 text-slate-400 dark:text-slate-600">
                        Sonuç bulunamadı.
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedEsma && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-warm-100 dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-700 relative max-h-[90vh] overflow-y-auto">
                        <button 
                            onClick={() => setSelectedEsma(null)}
                            className="absolute top-4 right-4 p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors z-20"
                        >
                            <X size={20}/>
                        </button>

                        <div className="flex flex-col items-center text-center pt-2">
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 border-4 border-indigo-100 dark:border-indigo-900/30 animate-pop">
                                <span className="text-4xl font-['Amiri'] text-slate-900 dark:text-white drop-shadow-sm">{selectedEsma.arabic}</span>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedEsma.name}</h3>
                            
                            <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 border border-slate-200 dark:border-slate-700">
                                Zikir Sayısı: <span className="text-indigo-600 dark:text-indigo-400">{selectedEsma.dhikr_count}</span>
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
                                {selectedEsma.meaning}
                            </p>

                            <div className="grid grid-cols-2 gap-3 w-full">
                                <button 
                                    onClick={(e) => selectedEsma && handleShare(e, selectedEsma)}
                                    className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm active:scale-95 transition-transform border border-slate-200 dark:border-slate-700"
                                >
                                    <Share2 size={18}/>
                                    <span>Paylaş</span>
                                </button>
                                <button 
                                    onClick={handleCopy}
                                    className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm active:scale-95 transition-transform border border-slate-200 dark:border-slate-700"
                                >
                                    {copied ? <Check size={18} className="text-emerald-500"/> : <Copy size={18} />}
                                    <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
