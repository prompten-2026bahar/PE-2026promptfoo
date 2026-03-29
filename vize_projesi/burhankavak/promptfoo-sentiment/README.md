# Promptfoo Sentiment Analizi Test Ortamı 🧪

Bu klasör, projemizin bel kemiğini ve Ar-Ge aşamasını oluşturan **Yapay Zeka Test ve Değerlendirme (Evaluation)** laboratuvarıdır. Farklı modellerin (Google Gemini ve Meta Llama) ve farklı prompt tekniklerinin (Zero-Shot, Few-Shot, Instruction) aynı uç düzey müşteri yorumları karşısında nasıl davrandığını (ve nerede halüsinasyon gördüğünü) ölçmek için yapılandırılmıştır.

## Kurulum ve Çalıştırma (Adım Adım)

Güvenlik amacıyla kişisel API anahtarları GitHub'a gönderilmemiştir (*Sadece `.env.example` veya boş bırakılmış konfigürasyon yapısı vardır*). Yapılmış olan testin orijinal ve detaylı grafiksel analizlerini ana dizindeki `RAPOR.md` dosyası içerisinden kolayca okuyabilirsiniz. 

Fakat eğer bu gelişmiş test mimarisini ve dev matrisi **kendi bilgisayarınızda kurup sonuçları (ve arayüzü) canlı incelemek isterseniz** şu adımları izleyin:

### 1. Test Dizinine Gidin
Terminalinizden Promptfoo klasörüne giriş yapın:
```bash
cd vize_projesi/burhankavak/promptfoo-sentiment
```

### 2. API Anahtarlarınızı Düzenleyin
Klasör içerisinde `.env` isminde yeni bir gizli dosya oluşturun ve projede karşılaştırdığımız modellerin (Google Gemini ve Groq) API anahtarlarını yapıştırın:
```env
GEMINI_API_KEY=sizin_gemini_anahtariniz
GROQ_API_KEY=sizin_groq_anahtariniz
```

### 3. Değerlendirme (Eval) Matrisini Başlatın
Tanımlı olan tüm müşteri senaryolarının (`cases.yaml`) ve farklı prompt kombinasyonlarının yapay zeka modelleri üzerinde test edilmesini tetiklemek için aşağıdaki kodu çalıştırın.
*(Not: Google API günlük oran limitlerine (Rate Limit - HTTP 429) takılabilmektedir. Bunu engellemek ve kodun çökmesinin önüne geçmek için aralara 4 saniye bekleme (`--delay 4000`) gecikmesi eklenerek otomasyona uyum sağlanmıştır. Matris, test yoğunluğuna bağlı olarak 1-2 dakika sürebilir.)*
```bash
npx promptfoo@latest eval -j 1 --delay 4000 --env-file .env
```

### 4. Tarayıcı Arayüzünde Testleri Karşılaştırın
Testlerin %100 tamamlanması sonrasında, hiçbir kodu veya tabloyu manually (elle) okumak zorunda değilsiniz. Hangi modelin nerede yanıldığını veya hangi promptun sistemi nasıl harika düzelttiğini devasa bir tablo ve başarı yüzdesi olarak arayüzde görmek için test sunucumuzu başlatın:
```bash
npx promptfoo@latest view
```

Bu komut sonrası ekranda size bir adres verecektir (genellikle `http://localhost:15500`). Bu adresi kopyalayıp Chrome veya Safari gibi bir tarayıcıda açtığınızda karşınızda dev bir karşılaştırma raporu matriksi açılacaktır. İncelemenin keyfini çıkarın!
