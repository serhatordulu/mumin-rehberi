
export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
    // --- KURAN-I KERİM ---
    { id: 1, question: "Kuran-ı Kerim'de kaç cüz vardır?", options: ["20", "30", "40", "114"], correctIndex: 1, explanation: "Kuran-ı Kerim 30 cüzden oluşur." },
    { id: 2, question: "İlk inen sure hangisidir?", options: ["Fatiha", "Bakara", "Alak", "Yasin"], correctIndex: 2, explanation: "İlk inen ayetler Alak suresinin ilk 5 ayetidir." },
    { id: 3, question: "Kuran-ı Kerim'in en uzun suresi hangisidir?", options: ["Ali İmran", "Nisa", "Maide", "Bakara"], correctIndex: 3, explanation: "Bakara Suresi 286 ayet ile en uzun suredir." },
    { id: 4, question: "Kuran-ı Kerim hangi halife döneminde kitap haline getirilmiştir?", options: ["Hz. Ebubekir", "Hz. Ömer", "Hz. Osman", "Hz. Ali"], correctIndex: 0, explanation: "Hz. Ebubekir döneminde toplanmış, Hz. Osman döneminde çoğaltılmıştır." },
    { id: 5, question: "Kuran-ı Kerim'in en kısa suresi hangisidir?", options: ["İhlas", "Nas", "Kevser", "Asr"], correctIndex: 2, explanation: "Kevser Suresi en kısa suredir." },
    { id: 6, question: "Hangi surede 'Besmele' iki defa geçer?", options: ["Tevbe", "Neml", "Nahl", "Yasin"], correctIndex: 1, explanation: "Neml suresinde (Süleyman AS kıssasında) ikinci bir besmele vardır." },
    { id: 7, question: "Hangi surede 'Besmele' bulunmaz?", options: ["Tevbe", "Enfal", "Muhammed", "Fetih"], correctIndex: 0, explanation: "Tevbe suresinin başında Besmele yoktur." },
    { id: 8, question: "Ayet-el Kürsi hangi surenin içindedir?", options: ["Ali İmran", "Bakara", "Fatiha", "Yasin"], correctIndex: 1, explanation: "Bakara Suresi'nin 255. ayetidir." },
    { id: 9, question: "Kuran-ı Kerim kaç yılda inmiştir?", options: ["10", "13", "23", "40"], correctIndex: 2, explanation: "Mekke ve Medine dönemi toplam yaklaşık 23 yıldır." },
    { id: 10, question: "'Kuran'ın Kalbi' olarak bilinen sure hangisidir?", options: ["Yasin", "Mülk", "Rahman", "Fatiha"], correctIndex: 0, explanation: "Hadislerde Yasin suresi Kuran'ın kalbi olarak nitelendirilmiştir." },

    // --- SİYER (PEYGAMBERİMİZİN HAYATI) ---
    { id: 11, question: "Peygamber Efendimiz (s.a.v) kaç yılında doğmuştur?", options: ["571", "610", "622", "632"], correctIndex: 0, explanation: "Peygamberimiz 571 yılında Mekke'de doğmuştur." },
    { id: 12, question: "Peygamber Efendimizin (s.a.v) süt annesinin adı nedir?", options: ["Amine", "Halime", "Fatıma", "Hatice"], correctIndex: 1, explanation: "Süt annesi Halime-i Sadiye'dir." },
    { id: 13, question: "İlk Müslüman olan kadın kimdir?", options: ["Hz. Aişe", "Hz. Fatıma", "Hz. Hatice", "Hz. Sümeyye"], correctIndex: 2, explanation: "İlk inanan kişi eşi Hz. Hatice'dir." },
    { id: 14, question: "Peygamberimizin (s.a.v) katıldığı ilk savaş hangisidir?", options: ["Uhud", "Hendek", "Bedir", "Tebük"], correctIndex: 2, explanation: "Müslümanların ilk büyük savaşı Bedir Savaşı'dır." },
    { id: 15, question: "Peygamber Efendimiz (s.a.v) nerede vefat etmiştir?", options: ["Mekke", "Medine", "Kudüs", "Taif"], correctIndex: 1, explanation: "Medine'de vefat etmiş ve oraya defnedilmiştir." },
    { id: 16, question: "Peygamberimize 'Muhammedü'l Emin' lakabı ne zaman verilmiştir?", options: ["Peygamberlikten sonra", "Hicretten sonra", "Peygamberlikten önce", "Vefatından sonra"], correctIndex: 2, explanation: "Dürüstlüğü sebebiyle peygamberlik gelmeden önce bu lakabı almıştır." },
    { id: 17, question: "Hicret hangi iki şehir arasında yapılmıştır?", options: ["Mekke-Şam", "Mekke-Medine", "Medine-Kudüs", "Mekke-Taif"], correctIndex: 1, explanation: "622 yılında Mekke'den Medine'ye hicret edilmiştir." },
    { id: 18, question: "Peygamberimizin soyu hangi peygambere dayanır?", options: ["Hz. Musa", "Hz. İsa", "Hz. İbrahim", "Hz. Nuh"], correctIndex: 2, explanation: "Hz. İbrahim'in oğlu Hz. İsmail soyundan gelir." },
    { id: 19, question: "Mescid-i Nebevi hangi şehirdedir?", options: ["Mekke", "Kudüs", "Medine", "Bağdat"], correctIndex: 2, explanation: "Peygamber Mescidi Medine'dedir." },
    { id: 20, question: "Peygamber Efendimizin (s.a.v) kaç kızı vardır?", options: ["2", "3", "4", "5"], correctIndex: 2, explanation: "Zeynep, Rukiyye, Ümmü Gülsüm ve Fatıma olmak üzere 4 kızı vardır." },

    // --- İBADET VE FIKIH ---
    { id: 21, question: "Hangi namazın sünneti yoktur?", options: ["Sabah", "İkindi", "Akşam", "Yatsı"], correctIndex: 1, explanation: "İkindi namazının son sünneti yoktur, sadece gayr-i müekked olan ilk sünneti vardır. Halk arasında genellikle kastedilen budur." },
    { id: 22, question: "İslam'ın şartı kaçtır?", options: ["3", "5", "6", "12"], correctIndex: 1, explanation: "İslam'ın şartı 5'tir: Şehadet, Namaz, Oruç, Zekat, Hac." },
    { id: 23, question: "İmanın şartı kaçtır?", options: ["3", "5", "6", "12"], correctIndex: 2, explanation: "İmanın şartı 6'dır." },
    { id: 24, question: "Kabe'nin etrafında 7 kez dönmeye ne ad verilir?", options: ["Vakfe", "Sa'y", "Tavaf", "İhram"], correctIndex: 2, explanation: "Kabe etrafında bir kez dönmeye şavt, 7 kez dönmeye Tavaf denir." },
    { id: 25, question: "Zekat kimlere verilmez?", options: ["Fakirlere", "Borçlulara", "Anne-Babaya", "Yolda kalmışlara"], correctIndex: 2, explanation: "Kişi bakmakla yükümlü olduğu anne, baba, eş ve çocuklarına zekat veremez." },
    { id: 26, question: "Oruç hangi ayda tutulur?", options: ["Recep", "Şaban", "Ramazan", "Muharrem"], correctIndex: 2, explanation: "Farz olan oruç Ramazan ayındadır." },
    { id: 27, question: "Günde kaç vakit farz namaz vardır?", options: ["3", "4", "5", "6"], correctIndex: 2, explanation: "Sabah, Öğle, İkindi, Akşam, Yatsı." },
    { id: 28, question: "Teyemmüm ne ile alınır?", options: ["Su", "Toprak", "Hava", "Ateş"], correctIndex: 1, explanation: "Su bulunmadığında temiz toprakla teyemmüm alınır." },
    { id: 29, question: "Namazda ayakta durmaya ne denir?", options: ["Kıyam", "Kıraat", "Rüku", "Secde"], correctIndex: 0, explanation: "Ayakta durmak Kıyam'dır." },
    { id: 30, question: "Hangi ibadet mal ile yapılır?", options: ["Oruç", "Namaz", "Zekat", "Kelime-i Şehadet"], correctIndex: 2, explanation: "Zekat, mal ile yapılan bir ibadettir." },

    // --- PEYGAMBERLER TARİHİ ---
    { id: 31, question: "İlk insan ve ilk peygamber kimdir?", options: ["Hz. İbrahim", "Hz. Nuh", "Hz. Adem", "Hz. Musa"], correctIndex: 2, explanation: "İnsanlığın atası Hz. Adem'dir." },
    { id: 32, question: "Kendisine 'Zebur' indirilen peygamber kimdir?", options: ["Hz. Musa", "Hz. Davud", "Hz. İsa", "Hz. İbrahim"], correctIndex: 1, explanation: "Zebur, Hz. Davud'a indirilmiştir." },
    { id: 33, question: "Firavun ile mücadele eden peygamber kimdir?", options: ["Hz. Yusuf", "Hz. Musa", "Hz. Yunus", "Hz. İsa"], correctIndex: 1, explanation: "Hz. Musa, Firavun'a karşı mücadele etmiştir." },
    { id: 34, question: "Gemisiyle tufandan kurtulan peygamber kimdir?", options: ["Hz. Hud", "Hz. Salih", "Hz. Nuh", "Hz. Lut"], correctIndex: 2, explanation: "Hz. Nuh ve inananlar gemi ile kurtulmuştur." },
    { id: 35, question: "Ateşe atılıp yanmayan peygamber kimdir?", options: ["Hz. İbrahim", "Hz. İsmail", "Hz. Yakup", "Hz. Yusuf"], correctIndex: 0, explanation: "Nemrut tarafından ateşe atılmış, ateş onu yakmamıştır." },
    { id: 36, question: "Balığın karnında yaşayan peygamber kimdir?", options: ["Hz. Yunus", "Hz. Yusuf", "Hz. Yahya", "Hz. Eyüp"], correctIndex: 0, explanation: "Hz. Yunus balığın karnında kalmıştır." },
    { id: 37, question: "Kuyuya atılan peygamber kimdir?", options: ["Hz. Yakup", "Hz. Yusuf", "Hz. Bünyamin", "Hz. İshak"], correctIndex: 1, explanation: "Kardeşleri tarafından kuyuya atılan Hz. Yusuf'tur." },
    { id: 38, question: "Babasız dünyaya gelen peygamber kimdir?", options: ["Hz. Adem", "Hz. Yahya", "Hz. İsa", "Hz. Musa"], correctIndex: 2, explanation: "Hz. İsa, Allah'ın mucizesi olarak babasız doğmuştur. (Hz. Adem hem annesiz hem babasızdır)." },
    { id: 39, question: "Sabrı ile bilinen peygamber kimdir?", options: ["Hz. Eyüp", "Hz. Yakup", "Hz. Yusuf", "Hz. Süleyman"], correctIndex: 0, explanation: "Hz. Eyüp sabrı ile imtihan edilmiştir." },
    { id: 40, question: "Hayvanlarla konuşabilen peygamber kimdir?", options: ["Hz. Davud", "Hz. Süleyman", "Hz. Musa", "Hz. İsa"], correctIndex: 1, explanation: "Hz. Süleyman'a hayvanların dili öğretilmiştir." },

    // --- GENEL KÜLTÜR VE KAVRAMLAR ---
    { id: 41, question: "İlk ezanı kim okumuştur?", options: ["Hz. Ali", "Hz. Ömer", "Bilal-i Habeşi", "Hz. Osman"], correctIndex: 2, explanation: "İslam'ın ilk müezzini Bilal-i Habeşi'dir." },
    { id: 42, question: "'Allah'ın Kılıcı' lakaplı sahabe kimdir?", options: ["Hz. Hamza", "Halid bin Velid", "Hz. Ali", "Hz. Ömer"], correctIndex: 1, explanation: "Halid bin Velid, Seyfullah (Allah'ın Kılıcı) olarak anılır." },
    { id: 43, question: "Kuran'ı çoğaltan halife kimdir?", options: ["Hz. Ebubekir", "Hz. Ömer", "Hz. Osman", "Hz. Ali"], correctIndex: 2, explanation: "Hz. Osman döneminde nüshalar çoğaltılmıştır." },
    { id: 44, question: "Müslümanların ilk kıblesi neresidir?", options: ["Kabe", "Mescid-i Aksa", "Mescid-i Nebevi", "Kuba Mescidi"], correctIndex: 1, explanation: "İlk kıble Kudüs'teki Mescid-i Aksa'dır." },
    { id: 45, question: "Hangi ayda Kadir Gecesi vardır?", options: ["Recep", "Şaban", "Ramazan", "Muharrem"], correctIndex: 2, explanation: "Kadir Gecesi, Ramazan ayı içerisindedir." },
    { id: 46, question: "İslam'ın ilk şehidi kimdir?", options: ["Hz. Hamza", "Hz. Sümeyye", "Hz. Yasir", "Musab bin Umeyr"], correctIndex: 1, explanation: "Hz. Sümeyye (r.a) Ebu Cehil tarafından şehit edilmiştir." },
    { id: 47, question: "Osmanlı'da Kuran'ı en güzel okuyanlara ne denirdi?", options: ["Hafız", "Kurra", "Müezzin", "İmam"], correctIndex: 1, explanation: "Kıraat ilmini bilen ve güzel okuyanlara Kurra denir." },
    { id: 48, question: "Cebrail (a.s)'ın görevi nedir?", options: ["Rızık dağıtmak", "Can almak", "Vahiy getirmek", "Sura üflemek"], correctIndex: 2, explanation: "Vahiy meleğidir." },
    { id: 49, question: "Sura üflemekle görevli melek hangisidir?", options: ["Mikail", "İsrafil", "Azrail", "Cebrail"], correctIndex: 1, explanation: "Kıyamet günü Sura üfleyecek melek İsrafil'dir." },
    { id: 50, question: "Uhud savaşında şehit düşen 'Şehitlerin Efendisi' kimdir?", options: ["Hz. Ali", "Hz. Hamza", "Musab bin Umeyr", "Cafer-i Tayyar"], correctIndex: 1, explanation: "Peygamberimizin amcası Hz. Hamza'dır." },
    
    // --- EKSTRA ZOR SORULAR ---
    { id: 51, question: "Kuran-ı Kerim'de ismi geçen tek sahabe kimdir?", options: ["Hz. Ebubekir", "Hz. Zeyd b. Harise", "Hz. Ali", "Hz. Ömer"], correctIndex: 1, explanation: "Ahzab suresinde Zeyd bin Harise'nin ismi geçer." },
    { id: 52, question: "Hendek savaşında hendek kazılmasını öneren sahabe kimdir?", options: ["Selman-ı Farisi", "Hz. Ali", "Hz. Ömer", "Ebu Zer"], correctIndex: 0, explanation: "İranlı sahabe Selman-ı Farisi önermiştir." },
    { id: 53, question: "Hangi namazın rüku ve secdesi yoktur?", options: ["Bayram Namazı", "Teravih Namazı", "Cenaze Namazı", "Teheccüd Namazı"], correctIndex: 2, explanation: "Cenaze namazı ayakta kılınır, rüku ve secde yoktur." },
    { id: 54, question: "Kuran-ı Kerim'de 'Bismillah' ile başlamayan tek sure hangisidir?", options: ["Fatiha", "Tevbe", "Yasin", "Mülk"], correctIndex: 1, explanation: "Tevbe Suresi besmele ile başlamaz." }
];
