
import React, { useState } from 'react';
import { Hand, ChevronLeft, Coins, Heart, CloudRain, Shield, RefreshCcw, Brain, User, Navigation, Star, AlignRight, ChevronRight, Share2, Copy, Check, Grid, X, Sun, Moon, BookOpen, Coffee, Home, Lock } from './Icons';
import { Share } from '@capacitor/share';

interface DuaItem {
    id: string;
    title: string;
    arabic?: string;
    turkish: string;
    meaning: string;
    source: string;
}

interface DuaCategory {
    id: string;
    title: string;
    icon: any;
    color: string;
    duas: DuaItem[];
}

const DUA_LIBRARY: DuaCategory[] = [
    {
        id: 'rizik',
        title: '1. Rızık ve Bereket',
        icon: Coins,
        color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400',
        duas: [
            { id: 'r1', title: "Borçtan Kurtulma Duası", arabic: "اَللّٰهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَاَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ", turkish: "Allahummekfinî bihelâlike an harâmike ve ağninî bifadlike ammen sivâke.", meaning: "Allah'ım! Bana helâl rızık nasip ederek beni haramlardan koru! Lütfunla beni Senden başkasına muhtaç etme!", source: "Tirmizî, Deavât, 110" },
            { id: 'r2', title: "Karınca Duası (Bereket)", arabic: "اللهم يا رب جبرائيل وميكائيل وإسرافيل وعزرائيل...", turkish: "Allahümme yâ Rabbi Cebrâîle ve Mîkâîle ve İsrâfîle ve Azrâîle...", meaning: "Ey Cebrail'in, Mikail'in, İsrafil'in ve Azrail'in Rabbi... Beni rızıklandır.", source: "Halk Arasında Meşhur" },
            { id: 'r3', title: "Eve Girerken Bereket", arabic: "بِسْمِ اللّٰهِ وَلَجْنَا وَبِسْمِ اللّٰهِ خَرَجْنَا", turkish: "Bismillâhi velecnâ ve bismillâhi haracnâ ve alâ Rabbinâ tevekkelnâ.", meaning: "Allah'ın adıyla girdik, Allah'ın adıyla çıktık ve Rabbimize tevekkül ettik.", source: "Ebû Dâvûd, Edeb, 102" },
            { id: 'r4', title: "İşlerin Kolaylaşması", arabic: "رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", turkish: "Rabbenâ âtinâ min ledunke rahmeten ve heyyi' lenâ min emrinâ raşedâ.", meaning: "Rabbimiz! Bize katından bir rahmet ver ve işimizde bize doğruyu göster.", source: "Kehf Suresi, 10" },
            { id: 'r5', title: "Rızık Genişliği İçin", arabic: "اَللّٰهُمَّ بَارِكْ لَنَا ف۪يمَا رَزَقْتَنَا", turkish: "Allahümme bârik lenâ fîmâ razaktenâ.", meaning: "Allah'ım! Bize verdiğin rızkı bereketli kıl.", source: "İbni Mace" },
            { id: 'r6', title: "Hz. Musa'nın Duası", arabic: "رَبِّ اِنّ۪ي لِمَٓا اَنْزَلْتَ اِلَيَّ مِنْ خَيْرٍ فَق۪يرٌ", turkish: "Rabbi innî limâ enzelte ileyye min hayrin fakîr.", meaning: "Rabbim! Bana indireceğin her hayra muhtacım.", source: "Kasas Suresi, 24" },
            { id: 'r7', title: "Sabah Rızık Duası", arabic: "اَللّٰهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا", turkish: "Allahümme innî es'elüke ilmen nâfian ve rızkan tayyiben ve amelen mütekabbelâ.", meaning: "Allah'ım! Senden faydalı ilim, helal rızık ve kabul olunmuş amel isterim.", source: "İbni Mace" },
            { id: 'r8', title: "Vakıa Suresi Fazileti", arabic: "Okunması tavsiye edilir.", turkish: "Her gece Vakıa Suresi okumak.", meaning: "Peygamberimiz (s.a.v): 'Her gece Vakıa suresini okuyan kimseye asla fakirlik isabet etmez' buyurmuştur.", source: "Beyhakî" },
            { id: 'r9', title: "Esma-ül Hüsna (Rezzak)", arabic: "Yâ Rezzâk, Yâ Fettâh", turkish: "Yâ Rezzâk, Yâ Fettâh", meaning: "Ey rızık veren ve ey kapıları açan Allah'ım. Rızkımı genişlet.", source: "Zikir" },
            { id: 'r10', title: "Çarşı Pazar Duası", arabic: "Lâ ilâhe illallâhu vahdehû lâ şerîke leh...", turkish: "Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehül mülkü ve lehül hamdü...", meaning: "Allah'tan başka ilah yoktur. Mülk O'nundur, hamd O'nadır. O diriltir ve öldürür.", source: "Tirmizî" }
        ]
    },
    {
        id: 'sifa',
        title: '2. Şifa ve Sağlık',
        icon: Heart,
        color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/40 dark:text-rose-400',
        duas: [
            { id: 's1', title: "Hz. Eyyüb'ün Duası", arabic: "رَبِّ اَنّ۪ي مَسَّنِيَ الضُّرُّ وَاَنْتَ اَرْحَمُ الرَّاحِم۪ينَۚ", turkish: "Rabbi ennî messeniye'd-durru ve ente erhamu'r-râhimîn.", meaning: "Başıma bu dert geldi. Sen, merhametlilerin en merhametlisisin.", source: "Enbiyâ Suresi, 83" },
            { id: 's2', title: "Peygamberimizin Şifa Duası", arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ اشْفِهِ وَأَنْتَ الشَّافِي", turkish: "Allahümme Rabben-nâsi ezhibil-be'se işfi ve ente'ş-şâfî lâ şifâe illâ şifâüke.", meaning: "Ey insanların Rabbi! Bu hastalığı gider. Şifa ver, çünkü şifa verici sensin. Senin vereceğin şifadan başka şifa yoktur.", source: "Buhârî, Tıbb, 37" },
            { id: 's3', title: "Ağrı İçin Okunacak Dua", arabic: "أَعُوذُ بِاللهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ", turkish: "Eûzü bi-izzetillâhi ve kudretihî min şerri mâ ecidü ve uhâziru.", meaning: "Hissettiğim ve sakındığım acının şerrinden Allah'ın izzet ve kudretine sığınırım. (7 defa ağrıyan yere el konularak okunur)", source: "Müslim, Selâm, 67" },
            { id: 's4', title: "Şifa Ayeti (Tevbe)", arabic: "وَيَشْفِ صُدُورَ قَوْمٍ مُؤْمِن۪ينَۙ", turkish: "Ve yeşfi sudûra kavmin mü'minîn.", meaning: "Allah mümin bir topluluğun kalplerine şifa versin.", source: "Tevbe Suresi, 14" },
            { id: 's5', title: "Şifa Ayeti (Şuara)", arabic: "وَاِذَا مَرِضْتُ فَهُوَ يَشْف۪ينِ", turkish: "Ve izâ maridtu fehuve yeşfîn.", meaning: "Hastalandığım zaman bana şifa veren O'dur.", source: "Şuara Suresi, 80" },
            { id: 's6', title: "Fatiha Suresi", arabic: "Okunması şifadır.", turkish: "Elhamdülillahi Rabbil Alemin...", meaning: "Fatiha suresi her derde deva, her hastalığa şifadır.", source: "Hadis-i Şerif" },
            { id: 's7', title: "Cebrail'in (a.s) Duası", arabic: "Bismillahi erkike min külli şey'in...", turkish: "Bismillahi erkîke min külli şey'in yu'zîke...", meaning: "Allah'ın adıyla sana okurum. Sana eziyet veren her şeyden, her nefisten ve hasetçinin gözünden Allah şifa versin.", source: "Müslim" },
            { id: 's8', title: "Hastayı Ziyaret Duası", arabic: "Es'elüllâhel-azîm, rabbel-arşil-azîm en yeşfiyeke", turkish: "Es'elüllâhel-azîm, rabbel-arşil-azîm en yeşfiyeke.", meaning: "Büyük Allah'tan, büyük Arş'ın Rabbi'nden sana şifa vermesini isterim.", source: "Ebu Davud" },
            { id: 's9', title: "Ruhsal Sıkıntı ve Vesvese", arabic: "Eûzü billâhi mineş-şeytânir-racîm", turkish: "Eûzü billâhi mineş-şeytânir-racîm.", meaning: "Kovulmuş şeytandan Allah'a sığınırım. (Şifa ayetleri ile birlikte okunur)", source: "Kuran-ı Kerim" },
            { id: 's10', title: "Ya Şafi Zikri", arabic: "Yâ Şâfî", turkish: "Yâ Şâfî, Yâ Allah.", meaning: "Ey şifa veren Allah. (391 defa okunması tavsiye edilir).", source: "Esma-ül Hüsna" }
        ]
    },
    {
        id: 'sikinti',
        title: '3. Sıkıntı ve Keder',
        icon: CloudRain,
        color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400',
        duas: [
            { id: 'k1', title: "İnşirah Suresi", arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَۙ", turkish: "Elem neşrah leke sadrak...", meaning: "Biz senin göğsünü açıp genişletmedik mi? (Her zorlukla beraber bir kolaylık vardır).", source: "İnşirah Suresi" },
            { id: 'k2', title: "Hz. Yunus'un Duası", arabic: "لَٓا اِلٰهَ اِلَّٓا اَنْتَ سُبْحَانَكَ اِنّ۪ي كُنْتُ مِنَ الظَّالِم۪ينَ", turkish: "Lâ ilâhe illâ ente subhâneke innî kuntu minezzâlimîn.", meaning: "Senden başka ilâh yoktur. Seni her türlü noksanlıktan tenzih ederim. Gerçekten ben kendine zulmedenlerden oldum.", source: "Enbiyâ Suresi, 87" },
            { id: 'k3', title: "Sıkıntı Anında (Hayy Kayyum)", arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ", turkish: "Yâ Hayyu yâ Kayyûm! Bi rahmetike esteğîsu.", meaning: "Ey Hayy ve Kayyûm olan Allah'ım! Rahmetinle yardımını talep ediyorum.", source: "Tirmizî, Deavât, 92" },
            { id: 'k4', title: "Hasbunallah Duası", arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَك۪يلُ", turkish: "Hasbunallâhu ve ni'mel vekîl.", meaning: "Allah bize yeter, O ne güzel vekildir.", source: "Âl-i İmrân Suresi, 173" },
            { id: 'k5', title: "La Havle Duası", arabic: "لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ", turkish: "Lâ havle ve lâ kuvvete illâ billâh.", meaning: "Güç ve kuvvet ancak Allah'tadır. (Cennet hazinelerinden bir hazinedir).", source: "Buhârî" },
            { id: 'k6', title: "Üzüntü Duası", arabic: "Allahümme innî eûzü bike minel-hemmi vel-hazen...", turkish: "Allahümme innî eûzü bike minel-hemmi vel-hazen ve eûzü bike minel-aczi vel-kesel...", meaning: "Allah'ım! Kederden, üzüntüden, acizlikten ve tembellikten sana sığınırım.", source: "Buhârî" },
            { id: 'k7', title: "Sıkıntının Gitmesi İçin", arabic: "Lâ ilâhe illallâhül azîmül halîm...", turkish: "Lâ ilâhe illallâhül azîmül halîm, lâ ilâhe illallâhü rabbül arşil azîm...", meaning: "Azamet ve hilim sahibi olan Allah'tan başka ilah yoktur. Büyük Arş'ın Rabbi Allah'tan başka ilah yoktur.", source: "Buhârî" },
            { id: 'k8', title: "Duha Suresi", arabic: "Vel duha...", turkish: "Ved-duha vel-leyli izâ secâ...", meaning: "Rabbin seni terk etmedi ve sana darılmadı. (Teselli için okunur).", source: "Duha Suresi" },
            { id: 'k9', title: "Rahmet Duası", arabic: "Allahümme rahmeteke ercû...", turkish: "Allahümme rahmeteke ercû felâ tekilnî ilâ nefsî tarfete aynin...", meaning: "Allah'ım! Rahmetini umuyorum. Beni göz açıp kapayıncaya kadar bile olsa nefsime bırakma.", source: "Ebu Davud" },
            { id: 'k10', title: "Sabır İçin", arabic: "Rabbena efriğ aleyna sabran...", turkish: "Rabbenâ efriğ aleynâ sabran ve sebbit ekdâmenâ...", meaning: "Rabbimiz! Üzerimize sabır yağdır ve ayaklarımızı sabit kıl.", source: "Bakara Suresi, 250" }
        ]
    },
    {
        id: 'nazar',
        title: '4. Nazar ve Korunma',
        icon: Shield,
        color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400',
        duas: [
            { id: 'n1', title: "Nazar Ayeti", arabic: "وَاِنْ يَكَادُ الَّذ۪ينَ كَفَرُوا لَيُزْلِقُونَكَ بِاَبْصَارِهِمْ", turkish: "Ve in yekâdullezîne keferû leyuzlikûneke biebsârihim...", meaning: "Şüphesiz inkâr edenler Zikr'i (Kur'an'ı) duydukları zaman neredeyse seni gözleriyle devireceklerdi.", source: "Kalem Suresi, 51-52" },
            { id: 'n2', title: "Felak Suresi", arabic: "قُلْ اَعُوذُ بِرَبِّ الْفَلَقِۙ", turkish: "Kul e'ûzu bi-Rabbil-felak...", meaning: "De ki: Yarattığı şeylerin şerrinden sabahın Rabbine sığınırım.", source: "Felak Suresi" },
            { id: 'n3', title: "Nas Suresi", arabic: "قُلْ اَعُوذُ بِرَبِّ النَّاسِۙ", turkish: "Kul e'ûzu bi-Rabbin-nâs...", meaning: "De ki: İnsanların Rabbine sığınırım.", source: "Nas Suresi" },
            { id: 'n4', title: "Korunma Duası", arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ", turkish: "Eûzü bi-kelimâtillâhi't-tâmmeti min külli şeytânin ve hâmmetin...", meaning: "Her türlü şeytandan, zararlı haşerattan ve kem gözden Allah'ın tam kelimelerine sığınırım.", source: "Buhârî, Enbiyâ, 10" },
            { id: 'n5', title: "Ayetel Kürsi", arabic: "اللّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ", turkish: "Allahü lâ ilâhe illâ hüvel hayyül kayyûm...", meaning: "O'ndan başka ilah yoktur; O, hayydır, kayyûmdur. (Koruyucudur)", source: "Bakara Suresi, 255" },
            { id: 'n6', title: "Maşallah Duası", arabic: "Maaşallah la kuvvete illa billah", turkish: "Mâşâallâh lâ kuvvete illâ billâh.", meaning: "Allah'ın dilediği olur. Kuvvet ancak Allah'tandır. (Beğenilen bir şeye bakınca okunur).", source: "Kehf Suresi, 39" },
            { id: 'n7', title: "Çocukları Koruma", arabic: "Üizukuma bi kelimatillahit-tammeti...", turkish: "Üîzükümâ bi-kelimâtillâhi't-tâmmeti min külli şeytânin ve hâmmetin...", meaning: "Her türlü şeytandan ve kem gözden sizi Allah'ın tam kelimelerine emanet ediyorum.", source: "Buhârî" },
            { id: 'n8', title: "Sabah Akşam Korunma", arabic: "Bismillahillezi la yedurru...", turkish: "Bismillâhillezi lâ yedurru measmihi şey'ün fil ardi ve lâ fis-semâi...", meaning: "İsmiyle yerde ve gökte hiçbir şeyin zarar veremediği Allah'ın adıyla.", source: "Tirmizî" },
            { id: 'n9', title: "Evden Çıkarken", arabic: "Bismillahi tevekkeltu alallahi...", turkish: "Bismillâhi tevekkeltü alallâhi lâ havle ve lâ kuvvete illâ billâh.", meaning: "Allah'ın adıyla, Allah'a tevekkül ettim.", source: "Tirmizî" },
            { id: 'n10', title: "Şeytandan Sığınma", arabic: "Rabbi eûzu bike min hemezâtiş-şeyâtîn...", turkish: "Rabbi eûzü bike min hemezâtiş-şeyâtîn. Ve eûzü bike rabbi en yahdurûn.", meaning: "Rabbim! Şeytanların kışkırtmalarından ve yanımda bulunmalarından sana sığınırım.", source: "Mü'minûn Suresi, 97-98" }
        ]
    },
    {
        id: 'tovbe',
        title: '5. Tövbe ve İstiğfar',
        icon: RefreshCcw,
        color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/40 dark:text-teal-400',
        duas: [
            { id: 't1', title: "Seyyidül İstiğfar", arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي...", turkish: "Allahümme ente Rabbî lâ ilâhe illâ ente halaktenî...", meaning: "Allah'ım! Sen benim Rabbimsin. Senden başka ilah yoktur. Beni Sen yarattın.", source: "Buhârî, Deavât, 2" },
            { id: 't2', title: "Hz. Adem'in Tövbesi", arabic: "رَبَّنَا ظَلَمْنَٓا اَنْفُسَنَا وَاِنْ لَمْ تَغْفِرْ لَنَا...", turkish: "Rabbenâ zalemnâ enfusenâ ve in lem tağfir lenâ ve terhamnâ lenekûnenne minel hâsirîn.", meaning: "Rabbimiz! Biz kendimize zulmettik. Eğer bizi bağışlamazsan hüsrana uğrayanlardan oluruz.", source: "A'râf Suresi, 23" },
            { id: 't3', title: "Kısa İstiğfar", arabic: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ", turkish: "Estağfirullahe ve etûbu ileyh.", meaning: "Allah'tan bağışlanma dilerim ve O'na tövbe ederim.", source: "Müslim" },
            { id: 't4', title: "Bağışlanma Duası", arabic: "رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا", turkish: "Rabbenâ fağfir lenâ zunûbenâ ve keffir annâ seyyiâtinâ.", meaning: "Rabbimiz! Günahlarımızı bağışla, kötülüklerimizi ört.", source: "Âl-i İmrân Suresi, 193" },
            { id: 't5', title: "Namaz Sonrası İstiğfar", arabic: "Estağfirullah el-Azim", turkish: "Estağfirullâhel-azîm el-kerîm ellezî lâ ilâhe illâ hû...", meaning: "Azamet ve kerem sahibi, kendisinden başka ilah olmayan Allah'tan mağfiret dilerim.", source: "Tirmizî" },
            { id: 't6', title: "Tövbe Duası (Peygamberimiz)", arabic: "Allahümme inneke afüvvün...", turkish: "Allahümme inneke afüvvün tuhibbül afve fa'fu annî.", meaning: "Allah'ım! Sen çok affedicisin, affetmeyi seversin, beni de affet.", source: "Tirmizî" },
            { id: 't7', title: "Subhanallah İstiğfarı", arabic: "Subhanallahi ve bihamdihi...", turkish: "Sübhânallâhi ve bi-hamdihî, estağfirullâhe ve etûbü ileyh.", meaning: "Allah'ı hamd ile tesbih ederim, O'ndan bağışlanma diler ve O'na tövbe ederim.", source: "Buhârî" },
            { id: 't8', title: "Rahmet Duası", arabic: "Rabbena la tuahizna...", turkish: "Rabbenâ lâ tuâhiznâ in nesînâ ev ahta'nâ.", meaning: "Rabbimiz! Unutur veya hataya düşersek bizi sorumlu tutma.", source: "Bakara Suresi, 286" },
            { id: 't9', title: "İçten Tövbe (Tahrim)", arabic: "Tûbû ilallâhi tevbeten nasûhâ", turkish: "Tûbû ilallâhi tevbeten nasûhâ.", meaning: "İçten ve samimi bir tövbe ile Allah'a dönün.", source: "Tahrim Suresi, 8" },
            { id: 't10', title: "Zalimlerden Olmaktan Sığınma", arabic: "Rabbena la tec'alna...", turkish: "Rabbenâ lâ tec'alnâ meal kavmiz-zâlimîn.", meaning: "Rabbimiz! Bizi zalimler topluluğu ile beraber bulundurma.", source: "A'râf Suresi, 47" }
        ]
    },
    {
        id: 'sinav',
        title: '6. Zihin ve Başarı',
        icon: Brain,
        color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400',
        duas: [
            { id: 'z1', title: "Zihin Açıklığı (Hz. Musa)", arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", turkish: "Rabbişrah lî sadrî ve yessir lî emrî.", meaning: "Rabbim! Göğsümü genişlet, işimi kolaylaştır.", source: "Tâhâ Suresi, 25-26" },
            { id: 'z2', title: "İlim Artırma", arabic: "رَبِّ زِدْنِي عِلْمًا", turkish: "Rabbi zidnî ilmen ve fehmen.", meaning: "Rabbim! İlmimi ve anlayışımı artır.", source: "Tâhâ Suresi, 114" },
            { id: 'z3', title: "Dil Bağının Çözülmesi", arabic: "وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي", turkish: "Vahlul ukdeten min lisânî yefkahû kavlî.", meaning: "Dilimdeki düğümü çöz ki sözümü anlasınlar.", source: "Tâhâ Suresi, 27-28" },
            { id: 'z4', title: "Unutkanlığa Karşı", arabic: "سَنُقْرِئُكَ فَلَا تَنْسٰىۙ", turkish: "Senukriuke felâ tensâ.", meaning: "Sana okutacağız da asla unutmayacaksın.", source: "A'la Suresi, 6" },
            { id: 'z5', title: "Sınav Heyecanı İçin", arabic: "Rabbi yessir ve la tuassir", turkish: "Rabbi yessir ve lâ tuassir, Rabbi temmim bil hayr.", meaning: "Rabbim! Kolaylaştır zorlaştırma, Rabbim hayırla sonuçlandır.", source: "Hadis-i Şerif" },
            { id: 'z6', title: "İşlerin Rast Gitmesi", arabic: "Allahümme la sehle illa...", turkish: "Allahümme lâ sehle illâ mâ cealtehû sehlan...", meaning: "Allah'ım! Senin kolay kıldığından başka kolay yoktur. Sen dilediğinde zoru kolay kılarsın.", source: "İbni Hibban" },
            { id: 'z7', title: "Başarı İçin (İsra)", arabic: "Rabbi edhilni müdhale sıdkın...", turkish: "Rabbi edhilnî müdhale sıdkın ve ahricnî muhrace sıdkın vec'al lî min ledunke sultânen nasîrâ.", meaning: "Rabbim! Gireceğim yere dürüstlükle girmemi, çıkacağım yerden de dürüstlükle çıkmamı sağla. Bana katından yardımcı bir güç ver.", source: "İsrâ Suresi, 80" },
            { id: 'z8', title: "Anlayış Duası", arabic: "Ya Fettah, Ya Alim", turkish: "Yâ Fettâh, Yâ Alîm, iftah lenâ hayral bâb.", meaning: "Ey her şeyi açan ve her şeyi bilen Allah'ım, bize hayır kapılarını aç.", source: "Esma-ül Hüsna" },
            { id: 'z9', title: "Hayırlı İlim", arabic: "Allahümme neffini bima allemteni", turkish: "Allahümme neffini bimâ allemtenî ve allimnî mâ yenfeunî.", meaning: "Allah'ım! Öğrettiklerinle beni faydalandır, bana fayda verecek ilmi öğret.", source: "Tirmizî" },
            { id: 'z10', title: "Kalem Suresi (Başarı)", arabic: "Nun vel kalemi...", turkish: "Nûn, vel kalemi ve mâ yesturûn.", meaning: "Nûn. Kaleme ve satır satır yazdıklarına andolsun.", source: "Kalem Suresi, 1" }
        ]
    },
    {
        id: 'aile',
        title: '7. Aile ve Huzur',
        icon: User,
        color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-400',
        duas: [
            { id: 'a1', title: "Eş ve Çocuklar İçin", arabic: "رَبَّنَا هَبْ لَنَا مِنْ اَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ اَعْيُنٍ", turkish: "Rabbenâ heb lenâ min ezvâcinâ ve zürriyyâtinâ kurrate a'yunin.", meaning: "Rabbimiz! Bize gözümüzü aydınlatacak eşler ve zürriyetler bağışla.", source: "Furkan Suresi, 74" },
            { id: 'a2', title: "Anne Baba Duası", arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ", turkish: "Rabbigfirlî ve livâlideyye.", meaning: "Rabbim! Beni ve anne babamı bağışla.", source: "Nûh Suresi, 28" },
            { id: 'a3', title: "Hayırlı Evlat (Hz. Zekeriya)", arabic: "رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً", turkish: "Rabbi heb lî min ledunke zurriyyeten tayyibeh.", meaning: "Rabbim! Bana katından temiz bir nesil bahşet.", source: "Âl-i İmrân Suresi, 38" },
            { id: 'a4', title: "Aile Huzuru (İbrahim)", arabic: "رَبِّ اجْعَلْن۪ي مُق۪يمَ الصَّلٰوةِ وَمِنْ ذُرِّيَّت۪ي", turkish: "Rabbic'alnî mukîmes salâti ve min zurriyyetî.", meaning: "Rabbim! Beni ve soyumu namazı dosdoğru kılanlardan eyle.", source: "İbrahim Suresi, 40" },
            { id: 'a5', title: "Anne Babaya Merhamet", arabic: "Rabbi-rhamhuma...", turkish: "Rabbi-rhamhümâ kemâ rabbe yânî sağîrâ.", meaning: "Rabbim! Onlar beni küçükken nasıl terbiye ettilerse, sen de onlara merhamet et.", source: "İsrâ Suresi, 24" },
            { id: 'a6', title: "Salih Evlat İsteği", arabic: "Rabbi heb lî mines-sâlihîn", turkish: "Rabbi heb lî mines-sâlihîn.", meaning: "Rabbim! Bana salihlerden olacak bir evlat bağışla.", source: "Sâffât Suresi, 100" },
            { id: 'a7', title: "Aile İçi Geçimsizlik", arabic: "Ya Vedud", turkish: "Yâ Vedûd.", meaning: "Ey çok seven ve sevdiren Allah'ım. Aramızdaki muhabbeti artır.", source: "Esma-ül Hüsna" },
            { id: 'a8', title: "Şükreden Aile Olmak", arabic: "Rabbi evzi'nî en eşküra...", turkish: "Rabbi evzi'nî en eşküra ni'metekelletî en'amte aleyye ve alâ vâlideyye...", meaning: "Rabbim! Bana ve ana-babama verdiğin nimete şükretmemi nasip et.", source: "Ahkâf Suresi, 15" },
            { id: 'a9', title: "Çocukların Korunması", arabic: "Üizukuma bi kelimatillah...", turkish: "Çocukları nazardan ve kötülükten korumak için okunan dua.", meaning: "Sizi Allah'ın tam kelimelerine emanet ediyorum.", source: "Hadis-i Şerif" },
            { id: 'a10', title: "Evliliğin Hayırlı Olması", arabic: "Allahümme barik...", turkish: "Allahümme bârik lî fî ehlî ve bârik liehlî fiyye.", meaning: "Allah'ım! Eşimi bana, beni eşime mübarek (hayırlı) kıl.", source: "Hadis-i Şerif" }
        ]
    },
    {
        id: 'gunluk',
        title: '8. Günlük Dualar',
        icon: Sun,
        color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-400',
        duas: [
            { id: 'g1', title: "Uyanınca", arabic: "اَلْحَمْدُ لِلّٰهِ الَّذِي اَحْيَانَا بَعْدَ مَا اَمَاتَنَا وَاِلَيْهِ النُّشُورُ", turkish: "Elhamdülillâhillezi ahyânâ ba'de mâ emâtenâ ve ileyhin-nüşûr.", meaning: "Bizi öldürdükten (uyuttuktan) sonra dirilten Allah'a hamdolsun.", source: "Buhârî" },
            { id: 'g2', title: "Yemek Duası", arabic: "Elhamdülillahillezi et'amenâ ve sekânâ...", turkish: "Elhamdülillahillezi et'amenâ ve sekânâ ve cealenâ minel müslimîn.", meaning: "Bizi doyuran, içiren ve Müslüman kılan Allah'a hamdolsun.", source: "Tirmizî" },
            { id: 'g3', title: "Eve Girerken", arabic: "Allahümme innî es'elüke hayra'l-mevleci...", turkish: "Allahümme innî es'elüke hayra'l-mevleci ve hayra'l-mahreci.", meaning: "Allah'ım! Senden girişin ve çıkışın hayırlısını dilerim.", source: "Ebû Dâvûd" },
            { id: 'g4', title: "Aynaya Bakınca", arabic: "Allahümme kemâ hassente halkî fehassin hulukî", turkish: "Allahümme kemâ hassente halkî fehassin hulukî.", meaning: "Allah'ım! Yaratılışımı güzel yaptığın gibi ahlakımı da güzelleştir.", source: "İbni Hibban" },
            { id: 'g5', title: "Tuvalete Girerken", arabic: "Allahümme inni eûzü bike...", turkish: "Allahümme innî eûzü bike minel hubsi vel habâis.", meaning: "Allah'ım! Pislikten ve cinlerin şerrinden sana sığınırım.", source: "Buhârî" },
            { id: 'g6', title: "Tuvaletten Çıkınca", arabic: "Gufraneke", turkish: "Gufrâneke, Elhamdülillahillezi ezhebe annil eza...", meaning: "Affını dilerim. Benden eziyeti gideren ve bana afiyet veren Allah'a hamdolsun.", source: "İbni Mace" },
            { id: 'g7', title: "Elbise Giyerken", arabic: "Elhamdülillahillezi kesani...", turkish: "Elhamdülillahillezi kesânî hâzâ ve razakanîhi min ğayri havlin minnî ve lâ kuvvetin.", meaning: "Benim gücüm ve kuvvetim olmaksızın bunu bana giydiren ve rızık veren Allah'a hamdolsun.", source: "Ebu Davud" },
            { id: 'g8', title: "Camiye Girerken", arabic: "Allahümmeftah li ebvabe rahmetike", turkish: "Allâhümmeftah lî ebvâbe rahmetike.", meaning: "Allah'ım! Bana rahmet kapılarını aç.", source: "Müslim" },
            { id: 'g9', title: "Camiden Çıkarken", arabic: "Allahümme inni es'elüke min fadlike", turkish: "Allâhümme innî es'elüke min fadlike.", meaning: "Allah'ım! Senden lütfunu ve ihsanını isterim.", source: "Müslim" },
            { id: 'g10', title: "Uyumadan Önce", arabic: "Bismikellahümme emutu ve ahya", turkish: "Bismikellâhümme emûtü ve ahyâ.", meaning: "Allah'ım! Senin isminle ölür (uyur) ve dirilirim (uyanırım).", source: "Buhârî" }
        ]
    },
    {
        id: 'namaz',
        title: '9. Namaz Sure ve Duaları',
        icon: Navigation,
        color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400',
        duas: [
            { id: 'nm1', title: "Sübhaneke", arabic: "سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ...", turkish: "Sübhânekellâhümme ve bi hamdik...", meaning: "Allah'ım! Sen eksik sıfatlardan pak ve uzaksın. Seni daima böyle tenzih eder ve överim.", source: "Namaz Tesbihi" },
            { id: 'nm2', title: "Ettehiyyatü", arabic: "اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ...", turkish: "Ettehiyyâtu lillâhi vessalevâtu...", meaning: "Dil ile, beden ve mal ile yapılan bütün ibadetler Allah'a dır.", source: "Teşehhüd" },
            { id: 'nm3', title: "Allahümme Salli", arabic: "اَللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ...", turkish: "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed...", meaning: "Allah'ım! Muhammed'e ve Muhammed'in ümmetine rahmet eyle.", source: "Salavat" },
            { id: 'nm4', title: "Allahümme Barik", arabic: "Allahümme barik ala Muhammed...", turkish: "Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed...", meaning: "Allah'ım! Muhammed'e ve Muhammed'in ümmetine bereket ver.", source: "Salavat" },
            { id: 'nm5', title: "Rabbena Atina", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً...", turkish: "Rabbenâ âtinâ fid-dunyâ haseneten ve fil-âhirati haseneten vekınâ azâben-nâr.", meaning: "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.", source: "Bakara Suresi, 201" },
            { id: 'nm6', title: "Rabbenağfirli", arabic: "Rabbenâğfirlî ve li-vâlideyye...", turkish: "Rabbenâğfirlî ve li-vâlideyye ve lil-mü'minîne yevme yekûmül hisâb.", meaning: "Rabbimiz! Hesap kurulacağı gün beni, anamı, babamı ve müminleri bağışla.", source: "İbrahim Suresi, 41" },
            { id: 'nm7', title: "Kunut Duaları 1", arabic: "اَللّٰهُمَّ اِنَّا نَسْتَعِينُكَ...", turkish: "Allâhümme innâ nesteînuke ve nestağfiruke...", meaning: "Allah'ım! Senden yardım isteriz, günahlarımızı bağışlamanı isteriz.", source: "Vitir Namazı" },
            { id: 'nm8', title: "Kunut Duaları 2", arabic: "Allahümme iyyake na'büdü...", turkish: "Allâhümme iyyâke na'büdü ve leke nusallî ve nescüdü...", meaning: "Allah'ım! Biz yalnız sana kulluk ederiz. Namazı yalnız senin için kılarız.", source: "Vitir Namazı" },
            { id: 'nm9', title: "Amentü", arabic: "Amentü billahi...", turkish: "Âmentü billâhi ve melâiketihî ve kütübihî ve rusülihî...", meaning: "Allah'a, meleklerine, kitaplarına, peygamberlerine... inandım.", source: "İman Esasları" },
            { id: 'nm10', title: "Ezan Duası", arabic: "Allahümme rabbe hazihid daveti...", turkish: "Allâhümme Rabbe hâzihi'd-da'veti't-tâmmeh...", meaning: "Ey bu tam davetin ve kılınacak namazın Rabbi olan Allah'ım!", source: "Buhârî" }
        ]
    },
    {
        id: 'hacet',
        title: '10. Hacet ve İstek',
        icon: Star,
        color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-400',
        duas: [
            { id: 'h1', title: "Hacet Duası", arabic: "Lâ ilâhe illallahü'l-halimü'l-kerim...", turkish: "Lâ ilâhe illallahü'l-halimü'l-kerim. Sübhanallahi Rabbi'l-arşi'l-azim...", meaning: "Halim ve Kerim olan Allah'tan başka ilah yoktur. Büyük Arş'ın Rabbi Allah'ı tenzih ederim.", source: "Tirmizî, Vitir, 17" },
            { id: 'h2', title: "İsm-i Azam Duası", arabic: "Allahümme inni es'elüke bi-enni...", turkish: "Allahümme inni es'elüke bi-enni leke'l-hamdü lâ ilâhe illâ ente...", meaning: "Allah'ım! Hamd ancak sanadır, senden başka ilah yoktur. Senden istiyorum.", source: "Ebû Dâvûd" },
            { id: 'h3', title: "Zor İşlerin Kolaylaşması", arabic: "Allâhumme lâ sehle illâ mâ cealtehû sehlan...", turkish: "Allâhumme lâ sehle illâ mâ cealtehû sehlan ve ente tecalul hazne izâ şi'te sehlan.", meaning: "Allah'ım! Senin kolay kıldığından başka kolay yoktur. Sen dilersen zor olanı kolay kılarsın.", source: "İbni Hibban" },
            { id: 'h4', title: "Salaten Tüncina", arabic: "Allâhumme salli alâ Seyyidinâ Muhammedin...", turkish: "Allâhumme salli alâ Seyyidinâ Muhammedin ve alâ âli Seyyidinâ Muhammedin salâten tüncînâ bihâ min-cemî'il-ehvâli vel âfât...", meaning: "Allah'ım! Efendimiz Muhammed'e (s.a.v) ve onun ehl-i beytine salât et. Bu salât ile bizi bütün korku ve musibetlerden kurtar.", source: "Meşhur Salavat" },
            { id: 'h5', title: "Salaten Tefriciye", arabic: "Allâhumme salli salâten kâmileten...", turkish: "Allâhumme salli salâten kâmileten ve sellim selâmen tâmmen alâ Seyyidinâ Muhammedin...", meaning: "Allah'ım! Efendimiz Muhammed'e kâmil bir salât ve tam bir selâm eyle.", source: "Meşhur Salavat" },
            { id: 'h6', title: "Hz. Yunus'un Duası", arabic: "La ilahe illa ente subhaneke...", turkish: "Lâ ilâhe illâ ente subhâneke innî kuntu minezzâlimîn.", meaning: "Senden başka ilah yoktur. Seni tenzih ederim. Ben zalimlerden oldum.", source: "Enbiya Suresi, 87" },
            { id: 'h7', title: "Adiyat Suresi", arabic: "Vel adiyati dabha...", turkish: "Hacet için Adiyat suresini okumak tavsiye edilmiştir.", meaning: "(Savaş sırasında) soluk soluğa koşan atlara andolsun.", source: "Adiyat Suresi" },
            { id: 'h8', title: "Hasbunallah", arabic: "Hasbunallahu ve ni'mel vekil", turkish: "Hasbunallâhu ve ni'mel vekîl.", meaning: "Allah bize yeter, O ne güzel vekildir.", source: "Al-i İmran Suresi" },
            { id: 'h9', title: "Hayır Kapılarının Açılması", arabic: "Ya Fettah", turkish: "Yâ Fettâh, Yâ Rezzâk.", meaning: "Ey kapıları açan ve rızık veren Allah'ım. Hayır kapılarını aç.", source: "Zikir" },
            { id: 'h10', title: "Hacet Namazı Duası", arabic: "Allahümme inni es'elüke...", turkish: "Allahümme innî es'elüke ve eteveccehü ileyke bi-Nebiyyike Muhammedin...", meaning: "Allah'ım! Senden istiyorum ve Peygamberin Muhammed (s.a.v) ile sana yöneliyorum.", source: "Tirmizî" }
        ]
    }
];

export const DuaCollection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);
    const [selectedDua, setSelectedDua] = useState<DuaItem | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCategorySelect = (cat: DuaCategory) => {
        setSelectedCategory(cat);
        setSelectedDua(null);
    };

    const handleDuaSelect = (dua: DuaItem) => {
        setSelectedDua(dua);
    };

    const handleBack = () => {
        if (selectedDua) {
            setSelectedDua(null);
        } else if (selectedCategory) {
            setSelectedCategory(null);
        } else {
            onBack();
        }
    };

    const handleCopy = () => {
        if (!selectedDua) return;
        const text = `✨ *${selectedDua.title}*\n\n"${selectedDua.turkish}"\n\n${selectedDua.source}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (!selectedDua) return;
        const text = `✨ *${selectedDua.title}*\n\n"${selectedDua.turkish}"\n\n${selectedDua.source}\n\n📍 Mümin Rehberi`;
        try {
            await Share.share({ title: selectedDua.title, text: text, dialogTitle: 'Paylaş' });
        } catch (e) { handleCopy(); }
    };

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={handleBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {selectedDua ? selectedDua.title : (selectedCategory ? selectedCategory.title : 'Dua Hazinesi')}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedDua ? 'Dua Detayı' : (selectedCategory ? `${selectedCategory.duas.length} Dua Mevcut` : '10 Farklı Kategori')}
                    </p>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4">
                {selectedDua ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-pop">
                        <div className={`px-6 py-4 flex justify-between items-start bg-emerald-600`}>
                            <div className="flex-1 pr-4"><h3 className="text-white font-bold text-lg">{selectedDua.title}</h3>{selectedDua.source && <p className="text-xs mt-1 font-medium text-emerald-200">{selectedDua.source}</p>}</div>
                            <button onClick={() => setSelectedDua(null)} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white"><Grid size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {selectedDua.arabic && <p className="text-right font-['Amiri'] text-2xl leading-loose text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4" dir="rtl">{selectedDua.arabic}</p>}
                            <p className="text-slate-800 dark:text-slate-200 text-lg italic leading-relaxed font-serif">"{selectedDua.turkish}"</p>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">{selectedDua.meaning}</p>
                            <div className="flex space-x-3 pt-2">
                                <button onClick={handleShare} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"><Share2 size={18} /> Paylaş</button>
                                <button onClick={handleCopy} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700">{copied ? <Check size={18} className="text-emerald-500"/> : <Copy size={18} />} {copied ? <span className="text-emerald-500">Kopyalandı</span> : "Kopyala"}</button>
                            </div>
                        </div>
                    </div>
                ) : selectedCategory ? (
                    <div className="space-y-3 pb-20">
                        {selectedCategory.duas.map((dua) => (
                            <button key={dua.id} onClick={() => handleDuaSelect(dua)} className="w-full text-left bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-colors flex justify-between items-center group">
                                <div><h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{dua.title}</h4><p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{dua.meaning}</p></div><ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500" />
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 pb-20">
                        {DUA_LIBRARY.map((cat) => (
                            <button key={cat.id} onClick={() => handleCategorySelect(cat)} className={`p-4 rounded-3xl border text-left flex flex-col justify-between h-32 relative overflow-hidden active:scale-95 transition-all ${cat.color} bg-opacity-20 dark:bg-opacity-10 border-transparent hover:shadow-md`}>
                                <cat.icon size={28} className="mb-2" /><span className="font-bold text-sm leading-tight">{cat.title}</span><span className="text-[10px] opacity-70 font-medium mt-1">{cat.duas.length} Dua</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
