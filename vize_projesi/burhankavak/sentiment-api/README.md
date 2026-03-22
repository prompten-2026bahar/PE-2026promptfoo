# Duygu Analizi Web API (Gerçek Dünya Uygulaması) 🚀

Bu proje, **Promptfoo** ile testleri yapılmış ve en başarılı olduğu kanıtlanmış olan *Instruction Prompt* ve *Llama 3 (Groq API)* kombinasyonunun Node.js üzerinde çalışan tam teşekküllü bir E-Ticaret Yorum Analizi servisidir.

## Kurulum ve Çalıştırma (Adım Adım)

Projede `node_modules` klasörü ve gizli `.env` dosyaları güvenlik nedeniyle GitHub'a yüklenmemiştir. Kodu kendi bilgisayarınızda (localhost) çalıştırmak için aşağıdaki adımları sırasıyla uygulayın:

### 1. Klasöre Gidin
Terminalinizde (veya Komut İstemi/VSCode terminalinde) bu klasörün içine girin:
```bash
cd vize_projesi/burhankavak/sentiment-api
```

### 2. Gerekli Kütüphaneleri Yükleyin
Projenin çalışması için gereken arka uç paketlerini (`express`, `cors`, `dotenv`, `groq-sdk`) indirmek için şu komutu çalıştırın:
```bash
npm install
```

### 3. Çevresel Değişkenleri (.env) Ayarlayın
Bu klasörün içinde (`sentiment-api` dizininde) `.env` adında yeni bir gizli yapılandırma dosyası oluşturun ve içine Groq API anahtarınızı aşağıdaki formatta yapıştırın:
```env
GROQ_API_KEY=gsk_sizin_api_anahtariniz_buraya_gelecek
```
*(Not: Ücretsiz, hızlı ve sınırsız bir API anahtarı almak için [console.groq.com](https://console.groq.com) adresini ziyaret edip saniyeler içinde kod oluşturabilirsiniz.)*

### 4. Sunucuyu Başlatın
Tüm ayarlar bittikten sonra aşağıdaki komutla Node.js Express sunucusunu çalıştırın:
```bash
node server.js
```
Ekranda `🚀 Duygu Analizi API sunucusu çalışıyor: http://localhost:3000` mesajını görmelisiniz. Bilgisayarınızın arkaplanında bir web sunucusu başarıyla açılmış demektir.

### 5. Uygulamayı Deneyimleyin
Tarayıcınızı (Chrome, Safari vb.) açın ve projemizin Ön Yüz'üne (Frontend) şu adresten bağlanın:
[http://localhost:3000](http://localhost:3000)

Karşınıza çıkan arayüzde bir metin kutusu göreceksiniz. Buraya karmaşık, ironik, emojili veya basit herhangi bir e-ticaret yorumu girip **Analiz Et** butonuna basın ve Prompt Mühendisliğinin arka taraftaki gücünü kendi gözlerinizle görün!
