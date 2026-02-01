
import React, { useState, useEffect } from 'react';
import { Search, Baby, ChevronLeft, Heart, Copy, Share2, Sparkles, User } from './Icons';
import { Share } from '@capacitor/share';

interface NameItem {
    id: number;
    name: string;
    gender: 'boy' | 'girl' | 'unisex';
    meaning: string;
}

const NAMES_DATA: NameItem[] = [
    // --- ERKEK İSİMLERİ ---
    { id: 1, name: "Adem", gender: "boy", meaning: "İlk insan ve ilk peygamber, toprak." },
    { id: 2, name: "Adil", gender: "boy", meaning: "Adaletli, doğruluktan ayrılmayan." },
    { id: 3, name: "Ahmet", gender: "boy", meaning: "Çok övülmüş, methedilmiş." },
    { id: 4, name: "Akif", gender: "boy", meaning: "İbadet eden, direnen, bir şeyde sebat eden." },
    { id: 5, name: "Ali", gender: "boy", meaning: "Yüce, ulu, yüksek mertebeli." },
    { id: 6, name: "Alparslan", gender: "boy", meaning: "Yiğit, cesur, arslan gibi." },
    { id: 7, name: "Alperen", gender: "boy", meaning: "Derviş, mücahit, yiğit kişi." },
    { id: 8, name: "Asım", gender: "boy", meaning: "Günahtan kaçınan, iffetli, koruyan." },
    { id: 9, name: "Baha", gender: "boy", meaning: "Güzellik, zariflik, parıltı, kıymet." },
    { id: 10, name: "Bahadır", gender: "boy", meaning: "Yiğit, kahraman, cesur." },
    { id: 11, name: "Bedirhan", gender: "boy", meaning: "Dolunay gibi parlak hükümdar." },
    { id: 12, name: "Bekir", gender: "boy", meaning: "İlk çocuk, sabah erken kalkan, deve yavrusu." },
    { id: 13, name: "Berat", gender: "boy", meaning: "Kurtuluş, bağışlanma belgesi, nişan." },
    { id: 14, name: "Bilal", gender: "boy", meaning: "Su gibi ıslatan. İlk müezzin." },
    { id: 15, name: "Burak", gender: "boy", meaning: "Hz. Muhammed'in Miraç bineği, parıldayan." },
    { id: 16, name: "Cihad", gender: "boy", meaning: "Din uğruna savaşma, çaba gösterme." },
    { id: 17, name: "Cüneyt", gender: "boy", meaning: "Küçük asker." },
    { id: 18, name: "Davut", gender: "boy", meaning: "Sevgili, aziz. Sesi güzel bir peygamber." },
    { id: 19, name: "Ebubekir", gender: "boy", meaning: "Bekir'in babası. İlk halife, sadık dost." },
    { id: 20, name: "Emin", gender: "boy", meaning: "Güvenilir, inanan, korkusuz." },
    { id: 21, name: "Emir", gender: "boy", meaning: "Buyruk, komutan, lider." },
    { id: 22, name: "Emre", gender: "boy", meaning: "Aşık, dost, arkadaş, ağabey." },
    { id: 23, name: "Enes", gender: "boy", meaning: "İnsan, dost, arkadaş." },
    { id: 24, name: "Ensar", gender: "boy", meaning: "Yardımcılar, koruyucular (Medine halkı)." },
    { id: 25, name: "Eren", gender: "boy", meaning: "Ermiş, veli, yiğit, olağanüstü sezgileri olan." },
    { id: 26, name: "Ertuğrul", gender: "boy", meaning: "Dürüst, doğru, yiğit insan." },
    { id: 27, name: "Eymen", gender: "boy", meaning: "Daha uğurlu, çok talihli, sağ taraf." },
    { id: 28, name: "Faruk", gender: "boy", meaning: "Hak ile batılı ayıran." },
    { id: 29, name: "Fatih", gender: "boy", meaning: "Fetheden, açan, hüküm veren." },
    { id: 30, name: "Feyyaz", gender: "boy", meaning: "Çok bereketli, feyz veren." },
    { id: 31, name: "Furkan", gender: "boy", meaning: "Hakkı batıldan ayıran, doğru yolu gösteren." },
    { id: 32, name: "Halil", gender: "boy", meaning: "Sadık dost, samimi arkadaş." },
    { id: 33, name: "Halis", gender: "boy", meaning: "Saf, temiz, karışık olmayan." },
    { id: 34, name: "Hamza", gender: "boy", meaning: "Aslan, güçlü, heybetli." },
    { id: 35, name: "Harun", gender: "boy", meaning: "Parlayan. Hz. Musa'nın kardeşi." },
    { id: 36, name: "Hasan", gender: "boy", meaning: "Güzel, iyi, hoş, hayırlı iş." },
    { id: 37, name: "Haydar", gender: "boy", meaning: "Aslan, cesur, yiğit." },
    { id: 38, name: "Hüsrev", gender: "boy", meaning: "Hükümdar, padişah." },
    { id: 39, name: "Hüseyin", gender: "boy", meaning: "Küçük güzel, sevilen." },
    { id: 40, name: "İbrahim", gender: "boy", meaning: "İnananların babası, hakların babası." },
    { id: 41, name: "İhsan", gender: "boy", meaning: "İyilik etme, bağışlama, lütuf." },
    { id: 42, name: "İlker", gender: "boy", meaning: "İlk doğan erkek çocuk." },
    { id: 43, name: "İlyas", gender: "boy", meaning: "Yağmurlara hükmeden peygamber ismi." },
    { id: 44, name: "İsa", gender: "boy", meaning: "Allah'ın yargılaması/kurtuluşu." },
    { id: 45, name: "İsmail", gender: "boy", meaning: "Allah işitir. Hz. İbrahim'in oğlu." },
    { id: 46, name: "Kadir", gender: "boy", meaning: "Kudret sahibi, güçlü, değerli." },
    { id: 47, name: "Kazım", gender: "boy", meaning: "Öfkesini yenen, hırsını tutan." },
    { id: 48, name: "Kemal", gender: "boy", meaning: "Olgunluk, mükemmellik, tamlık." },
    { id: 49, name: "Kerem", gender: "boy", meaning: "Cömertlik, asalet, büyüklük." },
    { id: 50, name: "Lokman", gender: "boy", meaning: "Bilge kişi, eski kavimlerdeki hekim." },
    { id: 51, name: "Mahmut", gender: "boy", meaning: "Övülmüş, methedilmiş." },
    { id: 52, name: "Malik", gender: "boy", meaning: "Sahip, efendi, yöneten." },
    { id: 53, name: "Mehmet", gender: "boy", meaning: "Övülen (Muhammed isminin Türkçesi)." },
    { id: 54, name: "Melih", gender: "boy", meaning: "Güzel, şirin, sevimli." },
    { id: 55, name: "Mert", gender: "boy", meaning: "Sözünün eri, yiğit, güvenilir." },
    { id: 56, name: "Metin", gender: "boy", meaning: "Sağlam, dayanıklı, metanetli." },
    { id: 57, name: "Miraç", gender: "boy", meaning: "Yükselme, göğe çıkma aracı." },
    { id: 58, name: "Muhammed", gender: "boy", meaning: "Yerde ve gökte çok övülen." },
    { id: 59, name: "Murat", gender: "boy", meaning: "Arzu, istek, dilek." },
    { id: 60, name: "Musab", gender: "boy", meaning: "Zor, çetin, dayanıklı (Musab bin Umeyr)." },
    { id: 61, name: "Mustafa", gender: "boy", meaning: "Seçilmiş, güzide, temizlenmiş." },
    { id: 62, name: "Mücahit", gender: "boy", meaning: "Din uğruna savaşan, çaba gösteren." },
    { id: 63, name: "Numan", gender: "boy", meaning: "Gelincik çiçeği, kan, nimet." },
    { id: 64, name: "Orhan", gender: "boy", meaning: "Şehrin hakimi." },
    { id: 65, name: "Osman", gender: "boy", meaning: "Bir tür kuş yavrusu, ejderha." },
    { id: 66, name: "Ömer", gender: "boy", meaning: "Hayat, ömür, canlılık, mamur etme." },
    { id: 67, name: "Ramazan", gender: "boy", meaning: "Yanmak, günahların yanması (Oruç ayı)." },
    { id: 68, name: "Resul", gender: "boy", meaning: "Elçi, peygamber." },
    { id: 69, name: "Rıdvan", gender: "boy", meaning: "Razı olma, cennet kapıcısı melek." },
    { id: 70, name: "Sadık", gender: "boy", meaning: "Doğru, gerçek dost, sadakatli." },
    { id: 71, name: "Salih", gender: "boy", meaning: "Yararlı, elverişli, dindar, yetkili." },
    { id: 72, name: "Selim", gender: "boy", meaning: "Sağlam, kusursuz, doğru, selametli." },
    { id: 73, name: "Serdar", gender: "boy", meaning: "Asker başı, komutan, önder." },
    { id: 74, name: "Sinan", gender: "boy", meaning: "Mızrak ucu." },
    { id: 75, name: "Süleyman", gender: "boy", meaning: "Huzur, barış, selam. Bir peygamber." },
    { id: 76, name: "Taha", gender: "boy", meaning: "Kuran'da bir sure adı." },
    { id: 77, name: "Talha", gender: "boy", meaning: "Güzellik, bir ağaç türü, zamk ağacı." },
    { id: 78, name: "Tarık", gender: "boy", meaning: "Sabah yıldızı, yol, tokmak." },
    { id: 79, name: "Uğur", gender: "boy", meaning: "İyilik, şans, talih, bereket." },
    { id: 80, name: "Ümit", gender: "boy", meaning: "Umut, beklenilen." },
    { id: 81, name: "Veysel", gender: "boy", meaning: "Yoksulluk, muhtaçlık (Veysel Karani)." },
    { id: 82, name: "Yakup", gender: "boy", meaning: "Takip eden, izleyen." },
    { id: 83, name: "Yasin", gender: "boy", meaning: "Ey İnsan (Kuran suresi)." },
    { id: 84, name: "Yavuz", gender: "boy", meaning: "Yaman, güçlü, çetin, iyi." },
    { id: 85, name: "Yunus", gender: "boy", meaning: "Bir peygamber ismi (Balık kıssası)." },
    { id: 86, name: "Yusuf", gender: "boy", meaning: "Ah eden, inleyen. Güzelliğiyle bilinen." },
    { id: 87, name: "Zafer", gender: "boy", meaning: "Amaca ulaşma, başarı, düşmanı yenme." },
    { id: 88, name: "Zahit", gender: "boy", meaning: "Dünyaya rağbet etmeyen, dindar, şüpheli şeylerden kaçınan." },
    { id: 89, name: "Ziya", gender: "boy", meaning: "Işık, aydınlık." },
    { id: 90, name: "Zübeyr", gender: "boy", meaning: "Yazılı küçük şey, akıl, güçlü." },

    // --- KIZ İSİMLERİ ---
    { id: 101, name: "Adile", gender: "girl", meaning: "Adaletli, doğruluktan ayrılmayan." },
    { id: 102, name: "Afra", gender: "girl", meaning: "Ayın 13. gecesi, beyaz toprak." },
    { id: 103, name: "Ahsen", gender: "girl", meaning: "En güzel, çok güzel." },
    { id: 104, name: "Aliye", gender: "girl", meaning: "Yüce, yüksek, onurlu." },
    { id: 105, name: "Amine", gender: "girl", meaning: "Korkusuz, emin (Peygamberimizin annesi)." },
    { id: 106, name: "Arzu", gender: "girl", meaning: "İstek, dilek, heves." },
    { id: 107, name: "Asiye", gender: "girl", meaning: "Acılı kadın, direk (Firavun'un eşi)." },
    { id: 108, name: "Aslı", gender: "girl", meaning: "Öz, kök, temel, hakikat." },
    { id: 109, name: "Asuman", gender: "girl", meaning: "Gök, gökyüzü." },
    { id: 110, name: "Aybüke", gender: "girl", meaning: "Ay gibi aydınlık, akıllı kız." },
    { id: 111, name: "Ayla", gender: "girl", meaning: "Ayın etrafındaki ışık halkası." },
    { id: 112, name: "Aylin", gender: "girl", meaning: "Aydan gelen ışık, parıltı." },
    { id: 113, name: "Aynur", gender: "girl", meaning: "Ay ışığı, ay gibi parlak." },
    { id: 114, name: "Aysu", gender: "girl", meaning: "Ay gibi parlak ve temiz su." },
    { id: 115, name: "Ayşe", gender: "girl", meaning: "Rahat ve huzur içinde yaşayan." },
    { id: 116, name: "Azra", gender: "girl", meaning: "El değmemiş, bakire, Medine'nin adı." },
    { id: 117, name: "Bahar", gender: "girl", meaning: "Yazla kış arasındaki mevsim, tazelik." },
    { id: 118, name: "Belinay", gender: "girl", meaning: "Ayın göle yansıması, Peygamber çiçeği." },
    { id: 119, name: "Belkıs", gender: "girl", meaning: "Saba melikesi, tarihte meşhur bir kraliçe." },
    { id: 120, name: "Beren", gender: "girl", meaning: "Güçlü, kuvvetli, akıllı, tanınmış." },
    { id: 121, name: "Berra", gender: "girl", meaning: "Doğru sözlü, hayır işleyen, temiz." },
    { id: 122, name: "Betül", gender: "girl", meaning: "Namuslu, temiz, Allah'a yönelen, Hz. Meryem'in lakabı." },
    { id: 123, name: "Beyza", gender: "girl", meaning: "Çok beyaz, lekesiz, günahsız." },
    { id: 124, name: "Büşra", gender: "girl", meaning: "Müjde, sevinçli haber." },
    { id: 125, name: "Canan", gender: "girl", meaning: "Sevgili, gönül verilen, sevilen." },
    { id: 126, name: "Cemile", gender: "girl", meaning: "Güzel kadın, hoşa giden davranış." },
    { id: 127, name: "Ceyda", gender: "girl", meaning: "Uzun boylu ve güzel, herkese iyilik yapan." },
    { id: 128, name: "Ceylin", gender: "girl", meaning: "Cennet kapısı, yengeç yuvası." },
    { id: 129, name: "Defne", gender: "girl", meaning: "Güzel kokulu, yaprakları dökülmeyen bir ağaç." },
    { id: 130, name: "Derya", gender: "girl", meaning: "Deniz, çok bilgili, engin." },
    { id: 131, name: "Dilara", gender: "girl", meaning: "Gönül alan, sevgili, süsleyen." },
    { id: 132, name: "Ebrar", gender: "girl", meaning: "Hayır sahipleri, iyiler, dindarlar." },
    { id: 133, name: "Ece", gender: "girl", meaning: "Kraliçe, güzel kadın, ulu." },
    { id: 134, name: "Ecrin", gender: "girl", meaning: "Allah'ın hediyesi, ücret, sevap." },
    { id: 135, name: "Eda", gender: "girl", meaning: "Naz, cilve, ödeme, yerine getirme." },
    { id: 136, name: "Elif", gender: "girl", meaning: "Dost, tanıdık, Arap alfabesinin ilk harfi." },
    { id: 137, name: "Emine", gender: "girl", meaning: "Güvenilir, inanılır, korkusuz." },
    { id: 138, name: "Eslem", gender: "girl", meaning: "Allah'a teslim olan, selamette, en güvenilir." },
    { id: 139, name: "Esma", gender: "girl", meaning: "İsimler, adlar, kulaklar (Esma-ül Hüsna)." },
    { id: 140, name: "Esra", gender: "girl", meaning: "Gece yolculuğu yapan, en çabuk." },
    { id: 141, name: "Fatma", gender: "girl", meaning: "Sütten kesilmiş, cehennemden uzak. Peygamberimizin kızı." },
    { id: 142, name: "Feride", gender: "girl", meaning: "Eşi benzeri olmayan, tek, eşsiz, üstün." },
    { id: 143, name: "Feyza", gender: "girl", meaning: "Bolluk, çokluk, verimlilik, feyiz." },
    { id: 144, name: "Firdevs", gender: "girl", meaning: "Cennetin en yüksek derecesi, bahçe." },
    { id: 145, name: "Gamze", gender: "girl", meaning: "Gülerken yanakta oluşan çukur, nazlı bakış." },
    { id: 146, name: "Gonca", gender: "girl", meaning: "Açılmamış gül, tomurcuk." },
    { id: 147, name: "Gül", gender: "girl", meaning: "Çiçek, peygamberimizin sembolü." },
    { id: 148, name: "Hacer", gender: "girl", meaning: "Taş, kaya parçası. Hz. İsmail'in annesi." },
    { id: 149, name: "Hafsa", gender: "girl", meaning: "Aslan yavrusu, koruyan." },
    { id: 150, name: "Halime", gender: "girl", meaning: "Yumuşak huylu, sert olmayan." },
    { id: 151, name: "Hatice", gender: "girl", meaning: "Erken doğan kız çocuğu. Peygamberimizin ilk eşi." },
    { id: 152, name: "Hilal", gender: "girl", meaning: "Yeni ay." },
    { id: 153, name: "Hümeyra", gender: "girl", meaning: "Beyaz tenli kadın (Hz. Aişe'nin lakabı)." },
    { id: 154, name: "İclal", gender: "girl", meaning: "Büyüklük, ululuk, ikram." },
    { id: 155, name: "İrem", gender: "girl", meaning: "Cennet bahçesi." },
    { id: 156, name: "Kader", gender: "girl", meaning: "Alın yazısı, takdir." },
    { id: 157, name: "Kadriye", gender: "girl", meaning: "Değer, kıymet, itibar." },
    { id: 158, name: "Kevser", gender: "girl", meaning: "Cennet nehri, bolluk, nesil." },
    { id: 159, name: "Kübra", gender: "girl", meaning: "En büyük, çok büyük." },
    { id: 160, name: "Lamia", gender: "girl", meaning: "Parlayan, parıltılı." },
    { id: 161, name: "Leyla", gender: "girl", meaning: "Gece, çok karanlık gece." },
    { id: 162, name: "Merve", gender: "girl", meaning: "Mekke'de bir dağ ismi, çakıl taşı." },
    { id: 163, name: "Meryem", gender: "girl", meaning: "İbadet eden, dindar kadın. Hz. İsa'nın annesi." },
    { id: 164, name: "Münevver", gender: "girl", meaning: "Aydınlatılmış, parlak, ışıklı." },
    { id: 165, name: "Necla", gender: "girl", meaning: "Evlat, çocuk, soy." },
    { id: 166, name: "Neslihan", gender: "girl", meaning: "Han soyundan gelen." },
    { id: 167, name: "Nisa", gender: "girl", meaning: "Kadınlar (Kuran suresi)." },
    { id: 168, name: "Nur", gender: "girl", meaning: "Işık, aydınlık, parıltı." },
    { id: 169, name: "Rabia", gender: "girl", meaning: "Dördüncü." },
    { id: 170, name: "Ravza", gender: "girl", meaning: "Bahçe, yeşilliği bol yer." },
    { id: 171, name: "Rukiye", gender: "girl", meaning: "Büyüleyici, efsun. Peygamberimizin kızı." },
    { id: 172, name: "Rümeysa", gender: "girl", meaning: "Büyük yıldız, gözü çapaklı kadın." },
    { id: 173, name: "Saadet", gender: "girl", meaning: "Mutluluk, kutluluk." },
    { id: 174, name: "Saliha", gender: "girl", meaning: "Dindar, yararlı, iyi, elverişli." },
    { id: 175, name: "Seda", gender: "girl", meaning: "Ses, yankı." },
    { id: 176, name: "Seher", gender: "girl", meaning: "Tan ağartısı, sabahın erken vakti." },
    { id: 177, name: "Selma", gender: "girl", meaning: "Barış, huzur, selamet." },
    { id: 178, name: "Sena", gender: "girl", meaning: "Övgü, ışık, parıltı." },
    { id: 179, name: "Serap", gender: "girl", meaning: "Çöldeki hayali su görüntüsü." },
    { id: 180, name: "Sevde", gender: "girl", meaning: "Esmer, siyahımsı." },
    { id: 181, name: "Sıdıka", gender: "girl", meaning: "Çok doğru, sadık kadın." },
    { id: 182, name: "Sümeyye", gender: "girl", meaning: "İlk şehit kadın, küçük gökyüzü." },
    { id: 183, name: "Şevval", gender: "girl", meaning: "Hicri takvimin 10. ayı." },
    { id: 184, name: "Şeyma", gender: "girl", meaning: "Benli, vücudunda ben olan. Peygamberimizin süt kardeşi." },
    { id: 185, name: "Şule", gender: "girl", meaning: "Alev, ateş alevi." },
    { id: 186, name: "Tuğba", gender: "girl", meaning: "Cennet ağacı, güzellik, iyilik." },
    { id: 187, name: "Vildan", gender: "girl", meaning: "Yeni doğmuş çocuklar, cennet hizmetçileri." },
    { id: 188, name: "Yasemin", gender: "girl", meaning: "Güzel kokulu bir çiçek." },
    { id: 189, name: "Yüsra", gender: "girl", meaning: "Kolaylık, sol taraf." },
    { id: 190, name: "Zehra", gender: "girl", meaning: "Çok beyaz, parlak yüzlü." },
    { id: 191, name: "Zeynep", gender: "girl", meaning: "Babasının süsü, değerli taşlar." },
    { id: 192, name: "Zülal", gender: "girl", meaning: "Saf, berrak, hafif, tatlı su." },
    { id: 193, name: "Züleyha", gender: "girl", meaning: "Su perisi, hızlı yürüyen." }
];

export const ReligiousNames: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [genderFilter, setGenderFilter] = useState<'all' | 'boy' | 'girl'>('all');
    const [favorites, setFavorites] = useState<number[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('favorite_names');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    
    // Rastgele öneriler (Günün Önerileri)
    const [featuredNames, setFeaturedNames] = useState<{boy: NameItem, girl: NameItem} | null>(null);

    useEffect(() => {
        localStorage.setItem('favorite_names', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        // Her gün değişen ama gün içinde sabit kalan rastgelelik
        const today = new Date().getDate();
        const boyNames = NAMES_DATA.filter(n => n.gender === 'boy');
        const girlNames = NAMES_DATA.filter(n => n.gender === 'girl');
        
        // Ensure consistent recommendation for the day
        const randomBoy = boyNames[today % boyNames.length];
        const randomGirl = girlNames[(today * 2) % girlNames.length];
        
        setFeaturedNames({ boy: randomBoy, girl: randomGirl });
    }, []);

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

    const toggleFavorite = (id: number) => {
        setFavorites(prev => {
            if (prev.includes(id)) return prev.filter(f => f !== id);
            return [...prev, id];
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleCopy = (name: string, meaning: string) => {
        navigator.clipboard.writeText(`${name}: ${meaning}`);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleShare = async (name: string, meaning: string) => {
        const text = `✨ ${name}: ${meaning}\n\n📍 Mümin Rehberi`;
        try {
            await Share.share({ title: name, text: text });
        } catch (e) {
            handleCopy(name, meaning);
        }
    };

    const filteredNames = NAMES_DATA.filter(n => {
        const matchesSearch = normalizeSearchText(n.name).includes(normalizeSearchText(searchTerm)) || 
                              normalizeSearchText(n.meaning).includes(normalizeSearchText(searchTerm));
        const matchesGender = genderFilter === 'all' || n.gender === genderFilter;
        return matchesSearch && matchesGender;
    });

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Dini İsimler</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">En Güzel İsimler ve Anlamları</p>
                </div>
                <button className="p-2 bg-white/50 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <Heart size={20} />
                </button>
            </div>

            {/* Content Container with Scroll */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-40">
                
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="İsim veya anlam ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-transparent rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>

                {/* Günün Önerileri (Featured) */}
                {featuredNames && !searchTerm && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <Sparkles size={16} className="text-amber-500" />
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">GÜNÜN ÖNERİLERİ</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Erkek Önerisi (Mavi) */}
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-3xl relative overflow-hidden shadow-lg shadow-blue-500/30 flex flex-col justify-between min-h-[160px] group">
                                <div className="absolute -right-4 -bottom-4 text-white opacity-10 transform rotate-12 scale-150 pointer-events-none">
                                    <User size={100} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-md uppercase tracking-wide">ERKEK İSMİ</span>
                                    <h3 className="text-2xl font-bold mt-2">{featuredNames.boy.name}</h3>
                                    <p className="text-xs text-blue-100 font-medium mt-1 line-clamp-3 leading-snug opacity-90">{featuredNames.boy.meaning}</p>
                                </div>
                                <div className="flex gap-2 mt-auto relative z-10 pt-4">
                                    <button onClick={() => toggleFavorite(featuredNames.boy.id)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                                        <Heart size={18} fill={favorites.includes(featuredNames.boy.id) ? "currentColor" : "none"} />
                                    </button>
                                    <button onClick={() => handleShare(featuredNames.boy.name, featuredNames.boy.meaning)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Kız Önerisi (Pembe) */}
                            <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-4 rounded-3xl relative overflow-hidden shadow-lg shadow-pink-500/30 flex flex-col justify-between min-h-[160px] group">
                                <div className="absolute -right-4 -bottom-4 text-white opacity-10 transform rotate-12 scale-150 pointer-events-none">
                                    <Baby size={100} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-md uppercase tracking-wide">KIZ İSMİ</span>
                                    <h3 className="text-2xl font-bold mt-2">{featuredNames.girl.name}</h3>
                                    <p className="text-xs text-pink-100 font-medium mt-1 line-clamp-3 leading-snug opacity-90">{featuredNames.girl.meaning}</p>
                                </div>
                                <div className="flex gap-2 mt-auto relative z-10 pt-4">
                                    <button onClick={() => toggleFavorite(featuredNames.girl.id)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                                        <Heart size={18} fill={favorites.includes(featuredNames.girl.id) ? "currentColor" : "none"} />
                                    </button>
                                    <button onClick={() => handleShare(featuredNames.girl.name, featuredNames.girl.meaning)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
                    <button 
                        onClick={() => setGenderFilter('all')} 
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all text-center ${genderFilter === 'all' ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        Tümü
                    </button>
                    <button 
                        onClick={() => setGenderFilter('boy')} 
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all text-center ${genderFilter === 'boy' ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        Erkek
                    </button>
                    <button 
                        onClick={() => setGenderFilter('girl')} 
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all text-center ${genderFilter === 'girl' ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        Kız
                    </button>
                </div>

                {/* Name List */}
                <div className="space-y-3">
                    {filteredNames.map((item) => {
                        const isFav = favorites.includes(item.id);
                        return (
                            <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-none shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                                {/* Left Icon */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${item.gender === 'boy' ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-pink-50 text-pink-500 dark:bg-pink-900/20 dark:text-pink-400'}`}>
                                    <Baby size={24} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.name}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.meaning}</p>
                                </div>

                                <div className="flex flex-col gap-2 shrink-0">
                                    <button 
                                        onClick={() => toggleFavorite(item.id)}
                                        className={`p-2 rounded-full transition-colors ${isFav ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-300 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                        onClick={() => handleCopy(item.name, item.meaning)} 
                                        className="p-2 rounded-full text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <Copy size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleShare(item.name, item.meaning)} 
                                        className="p-2 rounded-full text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    
                    {filteredNames.length === 0 && (
                        <div className="text-center py-10 text-slate-400 dark:text-slate-500 font-medium">
                            Aradığınız kriterlere uygun isim bulunamadı.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
