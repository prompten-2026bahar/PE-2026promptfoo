import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import Groq from 'groq-sdk';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/analyze', async (req, res) => {
    try {
        const { review } = req.body;
        if (!review) return res.status(400).json({ error: 'Yorum eksik' });
        
        const systemPrompt = `Sen uzman bir veri analistisin. Müşterilerimizin yorumlarını analiz ederek sistemlerimize otomatik entegre edilmesini sağlıyorsun.
Adım adım düşün:
1. Önce yorumu dikkatlice oku ve genel duyguyu anla (pozitif, negatif, karmaşık veya nötr).
2. Sonra yorumda bahsedilen özellikleri (batarya, kargo, ekran, kalite vb.) bul.
3. Her bir özelliğin müşteri tarafından nasıl değerlendirildiğine karar ver (olumlu, olumsuz).
4. Sadece JSON formatında çıktı ver. Başka hiçbir açıklama metni ekleme.

Metnin formatı her zaman şöyle olmalı:
{
  "duygu": "[Duygu Durumu]",
  "özellikler": {
    "[Özellik 1]": "[Değerlendirme 1]",
    "[Özellik 2]": "[Değerlendirme 2]"
  }
}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Müşteri Yorumu:\n${review}` }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const jsonResponse = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
        res.json(jsonResponse);

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: 'Analiz sırasında bir API veya Sunucu hatası oluştu.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Duygu Analizi API sunucusu çalışıyor: http://localhost:${PORT}`));
