
import React, { useState } from 'react';
import { Book, ChevronLeft, Feather, User, Users, ChevronRight } from './Icons';

interface Story {
    id: number;
    title: string;
    content: string;
}

// Diyanet kaynaklarına uygun Siyer Kronolojisi
const SIYER_DATA: Story[] = [
    {
        id: 1,
        title: "Kutsal Doğum ve Çocukluk",
        content: "Peygamber Efendimiz (s.a.v), Fil Vakası'ndan 50-55 gün sonra, Rebiülevvel ayının 12. gecesi (20 Nisan 571), sabaha karşı Mekke'de dünyaya geldi. Babası Abdullah, O daha doğmadan vefat etmişti. Dedesi Abdülmuttalip, O'na 'Muhammed' ismini verdi. Mekke'nin havası ağır olduğu için sütannesi Halime'ye verildi ve 4 yaşına kadar orada kaldı. 6 yaşında annesi Amine'yi, 8 yaşında dedesi Abdülmuttalip'i kaybetti ve amcası Ebu Talip'in himayesine girdi."
    },
    {
        id: 2,
        title: "Gençlik Yılları ve Evlilik",
        content: "Gençliğinde 'Muhammedü'l-Emin' (Güvenilir Muhammed) olarak tanındı. Hılfu'l-Fudul (Erdemliler Cemiyeti) içinde yer alarak haksızlıklara karşı durdu. Ticaretle uğraştı. 25 yaşında iken, dürüstlüğüne hayran kalan Hz. Hatice validemiz ile evlendi. Bu evlilikten Kasım, Abdullah, Zeynep, Rukiyye, Ümmü Gülsüm ve Fatıma adında çocukları oldu. Hz. Hatice vefat edene kadar başka bir evlilik yapmadı."
    },
    {
        id: 3,
        title: "İlk Vahiy ve Nübüvvet",
        content: "40 yaşına yaklaştığında Nur Dağı'ndaki Hira mağarasında inzivaya çekilmeye başladı. 610 yılı Ramazan ayının Kadir Gecesi'nde Cebrail (a.s) ilk vahyi getirdi. 'Oku!' emriyle Alak suresinin ilk ayetleri indi. Eve titreyerek döndü ve 'Beni örtünüz' dedi. Hz. Hatice O'nu teselli etti. İlk inananlar Hz. Hatice, Hz. Ali, Hz. Zeyd ve Hz. Ebubekir oldu."
    },
    {
        id: 4,
        title: "Tebliğ Dönemi ve İşkenceler",
        content: "İlk 3 yıl davet gizli yapıldı. Sonra 'Sana emrolunanı açıkça söyle' ayetiyle açık davet başladı. Mekkeli müşrikler Müslümanlara ağır işkenceler yaptı. Sümeyye ve Yasir (r.a) şehit edildi. Bilal-i Habeşi kızgın kumlara yatırıldı. Zulüm artınca bir grup Müslüman Habeşistan'a hicret etti. Müşrikler Müslümanlara 3 yıl süren boykot uyguladı."
    },
    {
        id: 5,
        title: "Hüzün Yılı ve Taif",
        content: "Nübüvvetin 10. yılında Peygamberimiz, en büyük destekçisi amcası Ebu Talip'i ve çok sevdiği eşi Hz. Hatice'yi peş peşe kaybetti. Bu yıla 'Hüzün Yılı' dendi. Destek bulmak için gittiği Taif'te taşlandı, ayakları kan içinde kaldı ama onlara beddua etmeyip hidayetleri için dua etti."
    },
    {
        id: 6,
        title: "İsra ve Miraç",
        content: "Hüzün Yılı'ndan sonra Allah Teala Peygamberimizi teselli etmek için O'nu huzuruna kabul etti. Bir gece Mescid-i Haram'dan Mescid-i Aksa'ya (İsra), oradan da göklere (Miraç) yükseltildi. Burada 5 vakit namaz farz kılındı, Bakara suresinin son ayetleri indirildi ve şirk koşmayanların cennete gireceği müjdelendi."
    },
    {
        id: 7,
        title: "Hicret",
        content: "Mekkeli müşriklerin zulmü ve suikast planları üzerine Allah (c.c) hicrete izin verdi. 622 yılında Peygamberimiz, Hz. Ebubekir ile birlikte Medine'ye hicret etti. Sevr mağarasında 3 gün gizlendiler. Medine'ye varışlarıyla İslam tarihinde yeni bir dönem başladı ve Hicri takvimin başlangıcı oldu."
    },
    {
        id: 8,
        title: "Medine Dönemi ve Mescid-i Nebevi",
        content: "Medine'ye varınca ilk iş olarak Mescid-i Nebevi inşa edildi. Muhacir (Mekke'den gelenler) ve Ensar (Medineliler) kardeş ilan edildi (Muahat). Medine'deki Yahudilerle 'Medine Vesikası' imzalanarak toplumsal barış sağlandı. Kıble, Mescid-i Aksa'dan Kabe'ye çevrildi."
    },
    {
        id: 9,
        title: "Bedir ve Uhud Savaşları",
        content: "624 yılında Bedir'de müşriklere karşı ilk büyük zafer kazanıldı. Müslümanların sayısı az olmasına rağmen Allah'ın yardımıyla galip geldiler. 625 yılında Uhud Savaşı yapıldı. Okçuların yerlerini terk etmesi sonucu Müslümanlar zor anlar yaşadı, Hz. Hamza şehit oldu ve Peygamberimizin dişi kırıldı."
    },
    {
        id: 10,
        title: "Hendek Savaşı",
        content: "627 yılında müşrikler büyük bir orduyla Medine'yi kuşattı. Selman-ı Farisi'nin önerisiyle şehrin etrafına hendekler kazıldı. Müşrikler hendeği aşamadı. Çıkan şiddetli fırtına ve Allah'ın yardımıyla kuşatma başarısız oldu ve müşrikler perişan halde geri döndü."
    },
    {
        id: 11,
        title: "Hudeybiye ve Mekke'nin Fethi",
        content: "628 yılında Hudeybiye Barış Antlaşması imzalandı. Bu barış ortamında İslam hızla yayıldı. Müşriklerin antlaşmayı bozması üzerine 630 yılında 10 bin kişilik orduyla Mekke fethedildi. Peygamberimiz şehre kan dökmeden girdi, genel af ilan etti ve Kabe'yi putlardan temizledi."
    },
    {
        id: 12,
        title: "Veda Haccı ve Vefat",
        content: "632 yılında Peygamberimiz ilk ve son haccını yaptı. Veda Hutbesi'nde insan hakları, kadın hakları ve kardeşlik üzerine evrensel mesajlar verdi. Medine'ye döndükten sonra hastalandı. 8 Haziran 632 (13 Rebiülevvel 11) tarihinde 'Refik-i A'la'ya (Yüce Dost'a)' diyerek Rabbine kavuştu."
    }
];

// Kuran'da adı geçen 25 Peygamber
const PROPHETS_DATA: Story[] = [
    {
        id: 1,
        title: "Hz. Adem (a.s)",
        content: "İlk insan ve ilk peygamberdir. Allah O'nu topraktan yarattı, ruhundan üfledi ve meleklerin O'na secde etmesini emretti. Şeytan kibri yüzünden secde etmedi. Eşi Hz. Havva ile cennete yerleştirildi ancak yasak meyveden yedikleri için yeryüzüne indirildiler. İnsanlığın atasıdır."
    },
    {
        id: 2,
        title: "Hz. İdris (a.s)",
        content: "Hz. Adem ve Hz. Şit'ten sonra gelen peygamberdir. Kalemle yazı yazan, elbise diken (terzilerin piri) ve astronomi ile ilgilenen ilk kişidir. Allah O'nu yüce bir makama yükseltmiştir."
    },
    {
        id: 3,
        title: "Hz. Nuh (a.s)",
        content: "İnsanlığın ikinci atası sayılır. 950 yıl kavmini Allah'a davet etti ancak çok azı inandı. Allah'ın emriyle büyük bir gemi yaptı. Tufan koptuğunda inananlar ve hayvanlardan birer çift gemiye binerek kurtuldu, inkarcılar (oğlu dahil) boğuldu."
    },
    {
        id: 4,
        title: "Hz. Hud (a.s)",
        content: "Ad kavmine gönderilmiştir. Ad kavmi, yüksek binalar yapan, güçlü ama kibirli bir topluluktu. Rüzgar ve fırtına ile helak edildiler."
    },
    {
        id: 5,
        title: "Hz. Salih (a.s)",
        content: "Semud kavmine gönderilmiştir. Kavmi mucize olarak kayadan deve çıkmasını istedi. Allah kayadan dişi bir deve çıkardı ancak kavmi deveyi kesti. Bunun üzerine korkunç bir ses (sayha) ile helak oldular."
    },
    {
        id: 6,
        title: "Hz. İbrahim (a.s)",
        content: "Ulü'l-Azm peygamberlerdendir. Tevhid mücadelesinin sembolüdür. Nemrut tarafından ateşe atılmış ancak ateş O'nu yakmamıştır. Oğlu İsmail ile Kabe'yi inşa etmiştir. Allah'a teslimiyetinin nişanesi olarak oğlunu kurban etmeye razı olmuş, Allah da O'na koç göndermiştir."
    },
    {
        id: 7,
        title: "Hz. Lut (a.s)",
        content: "Hz. İbrahim'in yeğenidir. Sodom ve Gomore halkına gönderildi. Kavmi, ahlaksızlık ve sapkınlık içindeydi. Uyarıları dinlemeyen kavmi, taş yağmuru ve şehrin altının üstüne getirilmesiyle helak oldu."
    },
    {
        id: 8,
        title: "Hz. İsmail (a.s)",
        content: "Hz. İbrahim'in oğludur. Zemzem suyu O'nun ayağının dibinden çıkmıştır. Babasıyla Kabe'yi inşa etmiştir. Peygamber Efendimiz (s.a.v) O'nun soyundan gelir. Teslimiyetin sembolüdür."
    },
    {
        id: 9,
        title: "Hz. İshak (a.s)",
        content: "Hz. İbrahim'in diğer oğludur. Hz. Yakup'un babasıdır. İsrailoğulları peygamberleri O'nun soyundan gelir."
    },
    {
        id: 10,
        title: "Hz. Yakup (a.s)",
        content: "Hz. İshak'ın oğludur. Lakabı İsrail'dir. 12 oğlu vardır (Yusuf a.s dahil). Oğlu Yusuf'un hasretiyle gözleri kör olmuş, kavuştuğunda yeniden açılmıştır. Sabrı ile bilinir."
    },
    {
        id: 11,
        title: "Hz. Yusuf (a.s)",
        content: "Kardeşleri tarafından kuyuya atıldı, köle olarak satıldı, iftiraya uğrayıp zindana düştü ama sonunda Mısır'a maliye bakanı (aziz) oldu. Rüya tabiri ilmi verilmişti. Güzelliği ve iffetiyle tanınır."
    },
    {
        id: 12,
        title: "Hz. Eyyüb (a.s)",
        content: "Sabır timsali peygamberdir. Büyük bir zenginlikten sonra ağır bir hastalık ve fakirlikle imtihan edildi. Yıllarca sabretti, sonunda Allah şifa verdi ve kaybettiklerini misliyle iade etti."
    },
    {
        id: 13,
        title: "Hz. Şuayb (a.s)",
        content: "Medyen ve Eyke halkına gönderildi. Kavmi ölçü ve tartıda hile yapıyordu. 'Hatibü'l-Enbiya' (Peygamberlerin hatibi) olarak bilinir. Kavmi korkunç bir sesle helak oldu."
    },
    {
        id: 14,
        title: "Hz. Musa (a.s)",
        content: "Kendisine Tevrat verilen ve Allah ile konuşan (Kelimullah) peygamberdir. Firavun'un sarayında büyüdü. Asasıyla denizi ikiye yararak İsrailoğullarını Firavun zulmünden kurtardı."
    },
    {
        id: 15,
        title: "Hz. Harun (a.s)",
        content: "Hz. Musa'nın kardeşidir. Hz. Musa'nın duası üzerine O'na yardımcı olarak peygamber yapılmıştır. Güzel konuşmasıyla bilinir."
    },
    {
        id: 16,
        title: "Hz. Davud (a.s)",
        content: "Kendisine Zebur verildi. Sesi çok güzeldi ve demiri işleme (zırh yapma) mucizesi vardı. Hem hükümdar hem peygamberdi. Calut'u öldürerek İsrailoğullarını zafere taşıdı."
    },
    {
        id: 17,
        title: "Hz. Süleyman (a.s)",
        content: "Hz. Davud'un oğludur. Rüzgara hükmetme, cinleri çalıştırma ve hayvanlarla konuşma mucizeleri verildi. Muhteşem bir saltanatı vardı (Süleyman Mührü). Mescid-i Aksa'yı cinlere inşa ettirdi."
    },
    {
        id: 18,
        title: "Hz. İlyas (a.s)",
        content: "İsrailoğullarına gönderildi. Baal putuna tapan kavmini uyardı. Kuraklık mucizesiyle kavmini terbiye etmeye çalıştı."
    },
    {
        id: 19,
        title: "Hz. Elyesa (a.s)",
        content: "Hz. İlyas'ın yardımcısı ve sonrasında peygamber olan zattır. Hastaları iyileştirme mucizesi olduğu rivayet edilir."
    },
    {
        id: 20,
        title: "Hz. Zülkifl (a.s)",
        content: "Sabreden ve sözüne sadık kalan salih peygamberlerden biri olarak Kuran'da anılır."
    },
    {
        id: 21,
        title: "Hz. Yunus (a.s)",
        content: "Ninova halkına gönderildi. Kavmi inanmayınca oradan ayrıldı, bindiği gemiden atıldı ve bir balık tarafından yutuldu. Balığın karnındaki duasıyla kurtuldu. Geri döndüğünde 100 bin kişilik kavmi iman etmişti."
    },
    {
        id: 22,
        title: "Hz. Zekeriya (a.s)",
        content: "Hz. Meryem'in himayesini üstlendi. İhtiyar yaşında Allah'a dua etti ve Hz. Yahya ile müjdelendi. Şehit edilen peygamberlerdendir."
    },
    {
        id: 23,
        title: "Hz. Yahya (a.s)",
        content: "Hz. Zekeriya'nın oğludur. Hz. İsa'nın müjdecisi ve çağdaşıdır. Çocukluğundan itibaren hikmet verilmiş, yumuşak kalpli bir peygamberdi."
    },
    {
        id: 24,
        title: "Hz. İsa (a.s)",
        content: "Babasız olarak Hz. Meryem'den doğdu. Bebekken konuştu, ölüleri diriltti, körleri iyileştirdi. Kendisine İncil verildi. Çarmıha gerilmedi, Allah O'nu kendi katına yükseltti."
    },
    {
        id: 25,
        title: "Hz. Muhammed (s.a.v)",
        content: "Son peygamberdir (Hatemü'l-Enbiya). Alemlere rahmet olarak gönderilmiştir. En büyük mucizesi Kuran-ı Kerim'dir. Getirdiği din İslam, kıyamete kadar baki kalacaktır."
    }
];

export const IslamicLibrary: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'siyer' | 'prophets'>('siyer');
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    return (
        <div className="h-full flex flex-col bg-warm-200 dark:bg-slate-950 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">İslam Kütüphanesi</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">İlim ve Hikmet</p>
                </div>
                <div className="p-2 bg-white/50 dark:bg-slate-800 rounded-full text-amber-600 dark:text-amber-500">
                    <Book size={24} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-4 gap-3 shrink-0 bg-warm-200 dark:bg-slate-950">
                <button 
                    onClick={() => { setActiveTab('siyer'); setSelectedStory(null); }}
                    className={`flex-1 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'siyer' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
                >
                    <Feather size={16} /> Siyer-i Nebi
                </button>
                <button 
                    onClick={() => { setActiveTab('prophets'); setSelectedStory(null); }}
                    className={`flex-1 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'prophets' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
                >
                    <Users size={16} /> Peygamberler
                </button>
            </div>

            {/* Content List or Detail */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 pt-0">
                {selectedStory ? (
                    <div className="animate-fade-in-up">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                <Feather size={120} />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-500 font-serif mb-4 leading-tight">{selectedStory.title}</h2>
                            
                            <div className="prose prose-amber dark:prose-invert max-w-none">
                                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-serif text-justify">
                                    {selectedStory.content}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedStory(null)} className="w-full py-4 text-slate-400 font-medium hover:text-slate-600">Geri Dön</button>
                    </div>
                ) : (
                    <div className="space-y-3 animate-fade-in pb-20">
                        <div className="mb-2 px-1">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                {activeTab === 'siyer' ? 'Peygamber Efendimizin Hayatı' : 'Peygamberler Tarihi'}
                            </h3>
                        </div>
                        {(activeTab === 'siyer' ? SIYER_DATA : PROPHETS_DATA).map((story, idx) => (
                            <button 
                                key={story.id}
                                onClick={() => setSelectedStory(story)}
                                className="w-full bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 dark:hover:border-amber-600 transition-all text-left group"
                                style={{ animationDelay: `${idx * 30}ms` }}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 flex items-center justify-center font-serif font-bold text-lg shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg font-serif group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">{story.title}</h3>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-1">{story.content.substring(0, 50)}...</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
