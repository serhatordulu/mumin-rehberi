
import { GoogleGenAI } from "@google/genai";

// API Anahtarı platform tarafından process.env.API_KEY olarak sağlanır.
const getClient = () => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
      console.error("KRİTİK HATA: API Key bulunamadı! Lütfen .env dosyasını kontrol edin ve tekrar build alın.");
      return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const askIslamicQuestion = async (question: string): Promise<string> => {
  try {
    const ai = getClient();
    if (!ai) return "Sistem anahtarı eksik olduğu için cevap veremiyor.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sen bilgili, nazik ve Ehl-i Sünnet hassasiyetine sahip bir İslami asistansın.
      Kullanıcının sorusu: "${question}"
      
      Kurallar:
      1. Cevabın kısa, net ve anlaşılır olsun (maksimum 3-4 cümle).
      2. Mümkünse ayet veya hadis referansı ver.
      3. Tartışmalı konularda birleştirici ol.
      4. Sadece dini konularda cevap ver.`,
    });
    return response.text || "Cevap alınamadı.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Şu anda yoğunluk nedeniyle cevap veremiyorum, lütfen biraz sonra tekrar deneyin.";
  }
};

// --- YENİ: STREAMING FONKSİYONU ---
export const askIslamicQuestionStream = async function* (question: string) {
    const ai = getClient();
    if (!ai) {
        yield "Sistem anahtarı eksik.";
        return;
    }

    try {
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-3-flash-preview',
            contents: `Sen bilgili, nazik, samimi ve Ehl-i Sünnet hassasiyetine sahip bir İslami asistansın.
            Kullanıcının sorusu: "${question}"
            
            Kurallar:
            1. Cevabın sohbet havasında, akıcı ve anlaşılır olsun.
            2. Gerektiğinde ayet ve hadislerden örnek ver (Arapçasına gerek yok, meali yeterli).
            3. İslam ahlakına uygun, yapıcı ve birleştirici bir dil kullan.
            4. Cevabı markdown formatında ver (kalın yazı, liste vb. kullanabilirsin).`,
        });

        for await (const chunk of responseStream) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Stream Error:", error);
        yield "\n\n(Bağlantı hatası oluştu, lütfen tekrar deneyiniz.)";
    }
};
