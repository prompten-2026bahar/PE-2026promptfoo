---
title: 'ElevenLabs'
description: 'ElevenLabs yapay zeka ses yeteneklerini test edin: Metinden Konuşmaya (TTS), Konuşmadan Metne (STT), Konuşma Ajanları ve ses işleme araçları'
---

# ElevenLabs

ElevenLabs sağlayıcısı, kapsamlı ses yapay zekası testi ve değerlendirmesi için birden fazla yapay zeka ses yeteneğini entegre eder.

:::tip

Kapsamlı bir adım adım eğitim için [ElevenLabs ses yapay zekasını değerlendirme kılavuzuna](/docs/guides/evaluate-elevenlabs/) bakın.

:::

## Hızlı Başlangıç

ElevenLabs'i 3 adımda kullanmaya başlayın:

1. **Kurulum ve kimlik doğrulama:**

   ```sh
   npm install -g promptfoo
   export ELEVENLABS_API_KEY=your_api_key_here
   ```

2. **Bir yapılandırma dosyası oluşturun** (`promptfooconfig.yaml`):

   ```yaml
   prompts:
     - 'Müşteri hizmetlerimize hoş geldiniz. Bugün size nasıl yardımcı olabilirim?'

   providers:
     - id: elevenlabs:tts:rachel

   tests:
     - description: Karşılama mesajı oluştur
       assert:
         - type: cost
           threshold: 0.01
         - type: latency
           threshold: 2000
   ```

3. **İlk değerlendirmenizi (eval) çalıştırın:**

   ```sh
   promptfoo eval
   ```

   Sonuçları `promptfoo view` komutuyla veya web arayüzünde görüntüleyin.

## Kurulum

ElevenLabs API anahtarınızı bir ortam değişkeni olarak ayarlayın:

```sh
export ELEVENLABS_API_KEY=your_api_key_here
```

Alternatif olarak, API anahtarını doğrudan yapılandırmanızda belirtin:

```yaml
providers:
  - id: elevenlabs:tts
    config:
      apiKey: your_api_key_here
```

:::tip
API anahtarınızı [ElevenLabs Ayarları](https://elevenlabs.io/app/settings/api-keys) sayfasından alabilirsiniz. Ücretsiz paket ayda 10.000 karakter içerir.
:::

## Yetenekler

ElevenLabs sağlayıcısı birden fazla yeteneği destekler:

### Metinden Konuşmaya (Text-to-Speech - TTS)

Birden fazla model ve sesle yüksek kaliteli ses sentezi oluşturun:

- `elevenlabs:tts:<ses_adi>` - Belirtilen sesle TTS (örn. `elevenlabs:tts:rachel`)
- `elevenlabs:tts` - Varsayılan sesle TTS

**Mevcut Modeller:**

- `eleven_flash_v2_5` - En hızlı, en düşük gecikme süresi (~200ms)
- `eleven_turbo_v2_5` - Yüksek kalite, hızlı
- `eleven_multilingual_v2` - İngilizce dışındaki diller için en iyisi
- `eleven_monolingual_v1` - Yalnızca İngilizce, yüksek kalite

**Örnek:**

```yaml
providers:
  - id: elevenlabs:tts:rachel
    config:
      modelId: eleven_flash_v2_5
      voiceSettings:
        stability: 0.5
        similarity_boost: 0.75
        speed: 1.0
```

### Konuşmadan Metne (Speech-to-Text - STT)

Konuşmacı ayrıştırma (diarization) ve doğluk metrikleriyle sesleri yazıya dökün:

- `elevenlabs:stt` - Konuşmadan metne dönüştürme

**Özellikler:**

- Konuşmacı ayrıştırma (birden fazla konuşmacıyı tanımlama)
- Kelime Hata Oranı (WER) hesaplaması
- Çoklu dil desteği

**Örnek:**

```yaml
providers:
  - id: elevenlabs:stt
    config:
      modelId: scribe_v1
      diarization: true
      maxSpeakers: 3
```

### Konuşma Ajanları (Conversational Agents)

LLM arka uçları ve değerlendirme kriterleriyle sesli yapay zeka ajanlarını test edin:

- `elevenlabs:agents` - Sesli yapay zeka ajanı testi

**Özellikler:**

- Çok turlu konuşma simülasyonu
- Otomatik değerlendirme kriterleri
- Araç çağırma ve taklit etme (tool calling and mocking)
- Maliyet optimizasyonu için LLM basamaklandırma (cascading)
- Özel LLM uç noktaları
- Çok sesli konuşmalar
- Telefon entegrasyonu (Twilio, SIP)

**Örnek:**

```yaml
providers:
  - id: elevenlabs:agents
    config:
      agentConfig:
        name: Müşteri Destek Ajanı
        prompt: Siz yardımsever bir destek ajanısınız
        voiceId: 21m00Tcm4TlvDq8ikWAM
        llmModel: gpt-4o
      evaluationCriteria:
        - name: yardimseverlik
          description: Ajan yardımsever yanıtlar veriyor
          weight: 1.0
          passingThreshold: 0.8
```

### Destekleyici API'ler

Ek ses işleme yetenekleri:

- `elevenlabs:history` - Ajan konuşma geçmişini getirin
- `elevenlabs:isolation` - Sesteki arka plan gürültüsünü giderin
- `elevenlabs:alignment` - Zaman ayarlı altyazılar oluşturun

## Yapılandırma Parametreleri

Tüm sağlayıcılar şu ortak parametreleri destekler:

| Parametre       | Açıklama                                           |
| --------------- | -------------------------------------------------- |
| `apiKey`        | ElevenLabs API anahtarınız                         |
| `apiKeyEnvar`   | API anahtarını içeren ortam değişkeni              |
| `baseUrl`       | API için özel temel URL (varsayılan: ElevenLabs API) |
| `timeout`       | Milisaniye cinsinden istek zaman aşımı             |
| `cache`         | Yanıt önbelleğe almayı etkinleştir                 |
| `cacheTTL`      | Saniye cinsinden önbellek ömrü                     |
| `enableLogging` | Hata ayıklama günlüklerini etkinleştir             |
| `retries`       | Başarısız istekler için yeniden deneme sayısı      |

### TTS'e Özgü Parametreler

| Parametre                 | Açıklama                                                     |
| ------------------------- | ------------------------------------------------------------ |
| `modelId`                 | TTS modeli (örn. `eleven_flash_v2_5`)                        |
| `voiceId`                 | Ses kimliği veya adı (örn. `21m00Tcm4TlvDq8ikWAM` veya `rachel`) |
| `voiceSettings`           | Ses özelleştirme (kararlılık, benzerlik, stil, hız)          |
| `outputFormat`            | Ses formatı (örn. `mp3_44100_128`, `pcm_44100`)              |
| `seed`                    | Deterministik çıktı için tohum değeri                        |
| `streaming`               | Düşük gecikme süresi için WebSocket akışını etkinleştir      |
| `pronunciationDictionary` | Özel telaffuz kuralları                                      |
| `voiceDesign`             | Metin açıklamasından ses oluşturun                           |
| `voiceRemix`              | Ses özelliklerini değiştirin (cinsiyet, aksan, yaş)          |

### STT'ye Özgü Parametreler

| Parametre     | Açıklama                                   |
| ------------- | ------------------------------------------ |
| `modelId`     | STT modeli (varsayılan: `scribe_v1`)       |
| `language`    | ISO 639-1 dil kodu (örn. `tr`, `en`, `es`) |
| `diarization` | Konuşmacı ayrıştırmayı etkinleştir         |
| `maxSpeakers` | Beklenen konuşmacı sayısı (ipucu)          |
| `audioFormat` | Giriş ses formatı                          |

### Ajana Özgü Parametreler

| Parametre            | Açıklama                                  |
| -------------------- | ----------------------------------------- |
| `agentId`            | Mevcut bir ajan kimliğini kullanın        |
| `agentConfig`        | Geçici ajan yapılandırması                |
| `simulatedUser`      | Otomatik kullanıcı simülasyon ayarları    |
| `evaluationCriteria` | Ajan performansı için değerlendirme kriterleri |
| `toolMockConfig`     | Test için taklit (mock) araç yanıtları    |
| `maxTurns`           | Maksimum konuşma turu (varsayılan: 10)    |
| `llmCascade`         | LLM yedekleme yapılandırması              |
| `customLLM`          | Özel LLM uç noktası yapılandırması        |
| `mcpConfig`          | Model Bağlam Protokolü entegrasyonu       |
| `multiVoice`         | Çok sesli konuşma yapılandırması          |
| `postCallWebhook`    | Konuşmadan sonra webhook bildirimi        |
| `phoneConfig`        | Twilio veya SIP telefon entegrasyonu      |

## Örnekler

### Metinden Konuşmaya: Ses Karşılaştırması

```yaml
prompts:
  - 'ElevenLabs''e hoş geldiniz. Yapay zeka ses teknolojimiz doğal tınlayan konuşmalar sunar.'

providers:
  - id: elevenlabs:tts:rachel
    config:
      modelId: eleven_flash_v2_5

  - id: elevenlabs:tts:clyde
    config:
      modelId: eleven_turbo_v2_5

tests:
  - description: Ses üretimi başarılı
    assert:
      - type: cost
        threshold: 0.01
      - type: latency
        threshold: 5000
```

### Konuşmadan Metne: Doğruluk Testi

```yaml
prompts:
  - file://audio/test-recording.mp3

providers:
  - id: elevenlabs:stt
    config:
      diarization: true

tests:
  - description: WER kabul edilebilir seviyede
    assert:
      - type: javascript
        value: |
          const result = JSON.parse(output);
          return result.wer < 0.05; // %5'ten az hata
```

### Konuşma Ajanları: Değerlendirme

```yaml
prompts:
  - |
    User: Siparişimle ilgili yardıma ihtiyacım var
    Agent: Yardımcı olmaktan mutluluk duyarım! Sipariş numaranız nedir?
    User: ORDER-12345

providers:
  - id: elevenlabs:agents
    config:
      agentConfig:
        prompt: Siz yardımsever bir müşteri destek ajanısınız
        llmModel: gpt-4o
      evaluationCriteria:
        - name: selamlama
          weight: 0.8
          passingThreshold: 0.8
        - name: anlama
          weight: 1.0
          passingThreshold: 0.9

tests:
  - description: Ajan değerlendirme kriterlerini karşılıyor
    assert:
      - type: javascript
        value: |
          const result = JSON.parse(output);
          const passed = result.analysis.evaluation_criteria_results.filter(r => r.passed);
          return passed.length >= 2;
```

### Ses İşleme: İş Akışı (Pipeline)

```yaml
# 1. Sesteki gürültüyü gider
providers:
  - id: elevenlabs:isolation

# 2. Temizlenmiş sesi yazıya dök
providers:
  - id: elevenlabs:stt

# 3. Altyazı oluştur
providers:
  - id: elevenlabs:alignment
```

## Gelişmiş Özellikler

### Telaffuz Sözlükleri (Pronunciation Dictionaries)

Teknik terimler için telaffuzu özelleştirin:

```yaml
providers:
  - id: elevenlabs:tts:rachel
    config:
      pronunciationDictionary:
        - word: 'API'
          pronunciation: 'A P I'
        - word: 'OAuth'
          phoneme: 'əʊɔːθ'
```

### Ses Tasarımı (Voice Design)

Açıklamalardan özel sesler oluşturun:

```yaml
providers:
  - id: elevenlabs:tts
    config:
      voiceDesign:
        name: Özel Ses
        description: Derin, otoriter bir tona sahip orta yaşlı bir Amerikan erkeği
        gender: male
        age: middle_aged
        accent: american
```

### LLM Basamaklandırma (Cascading)

Otomatik yedekleme ile maliyetleri optimize edin:

```yaml
providers:
  - id: elevenlabs:agents
    config:
      llmCascade:
        primary: gpt-4o
        fallback:
          - gpt-4o-mini
          - gpt-3.5-turbo
        cascadeOnError: true
        cascadeOnLatency:
          enabled: true
          maxLatencyMs: 5000
```

### Çok Sesli Konuşmalar

Farklı karakterler için farklı sesler:

```yaml
providers:
  - id: elevenlabs:agents
    config:
      multiVoice:
        characters:
          - name: Ajan
            voiceId: 21m00Tcm4TlvDq8ikWAM
            role: Müşteri destek temsilcisi
          - name: Müşteri
            voiceId: 2EiwWnXFnvU5JabPnv8n
            role: Yardım arayan müşteri
```

### Telefon Entegrasyonu

Gerçek telefon görüşmeleriyle ajanları test edin:

```yaml
providers:
  - id: elevenlabs:agents
    config:
      phoneConfig:
        provider: twilio
        twilioAccountSid: ${TWILIO_ACCOUNT_SID}
        twilioAuthToken: ${TWILIO_AUTH_TOKEN}
        twilioPhoneNumber: +1234567890
```

## Maliyet Takibi

ElevenLabs kullanımı otomatik olarak takip edilir:

**TTS Maliyetleri:**

- Flash v2.5: 1.000 karakter başına yaklaşık 0,015 $
- Turbo v2.5: 1.000 karakter başına yaklaşık 0,02 $
- Multilingual v2: 1.000 karakter başına yaklaşık 0,03 $

**STT Maliyetleri:**

- Dakika başına yaklaşık 0,10 $

**Ajan Maliyetleri:**

- Konuşma süresine bağlı olarak (LLM'e bağlı olarak dakika başına yaklaşık 0,10-0,50 $)

**Destekleyici API Maliyetleri:**

- Audio Isolation: Dakika başına yaklaşık 0,10 $
- Forced Alignment: Dakika başına yaklaşık 0,05 $

Maliyetleri değerlendirme sonuçlarında görüntüleyin:

```yaml
tests:
  - assert:
      - type: cost
        threshold: 0.50 # Test başına maksimum 0.50 $
```

## Popüler Sesler

Yaygın ses kimlikleri ve adları:

| Ad     | Kimlik (ID)          | Açıklama           |
| ------ | -------------------- | ------------------ |
| Rachel | 21m00Tcm4TlvDq8ikWAM | Sakin, net kadın   |
| Clyde  | 2EiwWnXFnvU5JabPnv8n | Sıcak erkek        |
| Drew   | 29vD33N1CtxCmqQRPOHJ | Çok yönlü erkek    |
| Paul   | 5Q0t7uMcjvnagumLfvZi | Rahat erkek        |
| Domi   | AZnzlk1XvdvUeBnXmlld | Enerjik kadın      |
| Bella  | EXAVITQu4vr4xnSDxMaL | Anlatımcı kadın    |
| Antoni | ErXwobaYiN019PkySvjV | Derin erkek        |
| Elli   | MF3mGyEYCl7XYWbV9V6O | Genç kadın          |

## Yaygın İş Akışları

### Ses Kalitesi Testi

Modeller ve sesler arasında ses kalitesini karşılaştırın:

```yaml
prompts:
  - 'Hızlı kahverengi tilki uyuşuk köpeğin üzerinden atlar. Bu cümle alfabedeki her harfi içerir.'

providers:
  - id: flash-model
    label: Flash Model (En Hızlı)
    config:
      modelId: eleven_flash_v2_5
      voiceId: rachel

  - id: turbo-model
    label: Turbo Model (En İyi Kalite)
    config:
      modelId: eleven_turbo_v2_5
      voiceId: rachel

tests:
  - description: Flash model hızla tamamlanır
    provider: flash-model
    assert:
      - type: latency
        threshold: 1000

  - description: Turbo model daha iyi kaliteye sahiptir
    provider: turbo-model
    assert:
      - type: cost
        threshold: 0.01
```

### Transkripsiyon Doğruluğu İş Akışı

Uçtan uca TTS → STT doğruluğunu test edin:

```yaml
prompts:
  - |
    Toplantı Perşembe günü saat 14:00'te B toplantı odasında planlanmıştır.
    Lütfen dizüstü bilgisayarınızı ve üç aylık raporunuzu getirin.

providers:
  - id: tts-generator
    label: elevenlabs:tts:rachel
    config:
      modelId: eleven_flash_v2_5

  - id: stt-transcriber
    label: elevenlabs:stt
    config:
      calculateWER: true

tests:
  - vars:
      referenceText: 'Toplantı Perşembe günü saat 14:00''te B toplantı odasında planlanmıştır. Lütfen dizüstü bilgisayarınızı ve üç aylık raporunuzu getirin.'
    assert:
      - type: javascript
        value: |
          const result = JSON.parse(output);
          if (result.wer_result) {
            return result.wer_result.wer < 0.03; // %3'ten az hata
          }
          return true;
```

### Ajan Regresyon Testi

Ajan iyileştirmelerinin performansı düşürmediğinden emin olun:

```yaml
prompts:
  - |
    User: Aboneliğimi iptal etmem gerekiyor
    User: Evet, eminim
    User: Hesap e-postası user@example.com

providers:
  - id: elevenlabs:agents
    config:
      agentConfig:
        prompt: Siz bir müşteri hizmetleri ajanısınız. İptalleri her zaman onaylayın.
        llmModel: gpt-4o
      evaluationCriteria:
        - name: onay_istendi
          description: Ajan iptal etmeden önce onay istiyor
          weight: 1.0
          passingThreshold: 0.9
        - name: profesyonel_ton
          description: Ajan profesyonel tonu koruyor
          weight: 0.8
          passingThreshold: 0.8

tests:
  - description: Ajan iptali düzgün şekilde yönetiyor
    assert:
      - type: javascript
        value: |
          const result = JSON.parse(output);
          const criteria = result.analysis.evaluation_criteria_results;
          return criteria.every(c => c.passed);
```

## En İyi Uygulamalar

### 1. Doğru Modeli Seçin

- **Flash v2.5**: Gerçek zamanlı uygulamalar, canlı yayınlar veya gecikme süresinin kritik olduğu durumlar için kullanın (&lt;200ms)
- **Turbo v2.5**: Kalitenin hızdan daha önemli olduğu yüksek kaliteli önceden kaydedilmiş içerikler için kullanın
- **Multilingual v2**: İngilizce dışındaki diller veya diller arası geçiş yaparken kullanın
- **Monolingual v1**: En yüksek kaliteyi gerektiren yalnızca İngilizce içerikler için kullanın

### 2. Ses Ayarlarını Optimize Edin

**Doğal konuşma için:**

```yaml
voiceSettings:
  stability: 0.5 # Daha fazla varyasyon
  similarity_boost: 0.75
  speed: 1.0
```

**Tutarlı anlatım için:**

```yaml
voiceSettings:
  stability: 0.8 # Daha az varyasyon
  similarity_boost: 0.85
  speed: 0.95
```

**Anlatım gücü için:**

```yaml
voiceSettings:
  stability: 0.3 # Yüksek varyasyon
  similarity_boost: 0.5
  style: 0.8 # Stili güçlendir
  speed: 1.1
```

### 3. Maliyet Optimizasyonu

**Tekrarlanan ifadeler için önbelleğe almayı kullanın:**

```yaml
providers:
  - id: elevenlabs:tts:rachel
    config:
      cache: true
      cacheTTL: 86400 # 24 saat
```

**Ajanlar için LLM basamaklandırmayı (cascading) uygulayın:**

```yaml
providers:
  - id: elevenlabs:agents
    config:
      llmCascade:
        primary: gpt-4o-mini # Önce daha ucuz olan
        fallback:
          - gpt-4o # Daha iyi yedek
        cascadeOnError: true
```

**Geliştirme sırasında daha kısa istemlerle test edin:**

```yaml
providers:
  - id: elevenlabs:tts:rachel
tests:
  - vars:
      shortPrompt: 'Test' # Geliştirme sırasında kullanın
      fullPrompt: 'Tam üretim mesajı'
```

### 4. Ajan Test Stratejisi

**Basit başlayın, karmaşıklığı kademeli olarak artırın:**

```yaml
# Aşama 1: Temel işlevsellik
evaluationCriteria:
  - name: yanit_verir
    description: Ajan kullanıcıya yanıt veriyor
    weight: 1.0

# Aşama 2: Kalite kontrolleri ekle
evaluationCriteria:
  - name: yanit_verir
    weight: 0.8
  - name: dogru
    description: Yanıt gerçeklere dayalı olarak doğrudur
    weight: 1.0

# Aşama 3: Konuşma akışını ekle
evaluationCriteria:
  - name: yanit_verir
    weight: 0.6
  - name: dogru
    weight: 1.0
  - name: dogal_akis
    description: Konuşma doğal hissettiriyor
    weight: 0.8
```

### 5. Ses Kalite Güvencesi

**Her zaman hedef platformlarda test edin:**

```yaml
providers:
  - id: elevenlabs:tts:rachel
    config:
      outputFormat: mp3_44100_128 # Web için iyi
      # outputFormat: pcm_44100      # Telefon sistemleri için daha iyi
      # outputFormat: mp3_22050_32   # Mobil için daha küçük dosyalar
```

**Çeşitli içeriklerle test edin:**

```yaml
prompts:
  # Sayılar ve tarihler
  - 'Randevunuz 15 Mart saat 15:30''dadır. Onay numarası: 4829.'

  # Teknik terimler
  - 'API, OAuth2 kimlik doğrulama belirteçleriyle bir JSON yanıtı döndürür.'

  # Çoklu dil
  - 'Bonjour! Çok dilli desteğimize hoş geldiniz.'

  # Uç durumlar
  - 'Merhaba... şey... beni duyabiliyor musun? Test, 1, 2, 3.'
```

### 6. İzleme ve Gözlemlenebilirlik

**Temel metrikleri takip edin:**

```yaml
tests:
  - assert:
      # Gecikme eşikleri
      - type: latency
        threshold: 2000

      # Maliyet bütçeleri
      - type: cost
        threshold: 0.50

      # Kalite metrikleri
      - type: javascript
        value: |
          // Özel metrikleri takip edin
          const result = JSON.parse(output);
          if (result.audio) {
            console.log('Ses boyutu:', result.audio.sizeBytes);
            console.log('Format:', result.audio.format);
          }
          return true;
```

**Düzenli sonuçlar için etiketler (labels) kullanın:**

```yaml
providers:
  - label: v1-temel
    id: elevenlabs:tts:rachel
    config:
      modelId: eleven_flash_v2_5

  - label: v2-iyilestirilmis
    id: elevenlabs:tts:rachel
    config:
      modelId: eleven_flash_v2_5
      voiceSettings:
        stability: 0.6 # Düzenlenmiş ayar
```

## Sorun Giderme

### API Anahtarı Sorunları

**Hata: `ELEVENLABS_API_KEY environment variable is not set`**

Çözüm: API anahtarınızın düzgün ayarlandığından emin olun:

```sh
# Anahtarın ayarlanıp ayarlanmadığını kontrol edin
echo $ELEVENLABS_API_KEY

# Eksikse ayarlayın
export ELEVENLABS_API_KEY=your_key_here

# Veya kabuk profilinize ekleyin
echo 'export ELEVENLABS_API_KEY=your_key' >> ~/.zshrc
source ~/.zshrc
```

### Kimlik Doğrulama Hataları

**Hata: `401 Unauthorized`**

Çözüm: API anahtarınızın geçerli olduğunu doğrulayın:

```sh
# API anahtarını doğrudan test edin
curl -H "xi-api-key: $ELEVENLABS_API_KEY" https://api.elevenlabs.io/v1/voices
```

Bu başarısız olursa, [ElevenLabs Ayarları](https://elevenlabs.io/app/settings/api-keys) sayfasından API anahtarınızı yeniden oluşturun.

### Hız Sınırlama (Rate Limiting)

**Hata: `429 Too Many Requests`**

Çözüm: Yeniden deneme mantığı ekleyin ve hız sınırlarına uyun:

```yaml
providers:
  - id: elevenlabs:tts:rachel
    config:
      retries: 3 # Başarısız istekleri yeniden dene
      timeout: 30000 # Yeniden denemeler için zaman tanı
```

Yüksek hacimli testler için şunları göz önünde bulundurun:

- Testleri zamana yayın
- Ücretli bir plana geçin
- Gereksiz isteklerden kaçınmak için önbelleğe almayı kullanın

### Ses Dosyası Sorunları

**Hata: `Failed to read audio file` veya `Unsupported audio format`**

Çözüm: Ses dosyalarının erişilebilir ve desteklenen formatlarda olduğundan emin olun:

- Desteklenen formatlar: `.mp3`, `.wav`, `.aac`, `.m4a`, `.ogg`, `.flac`
- Dosya yollarının doğru ve erişilebilir olduğundan emin olun
- Dosya boyutunun ElevenLabs sınırları içinde olduğundan emin olun (genellikle &lt;100MB)

### Ajan Bağlantı Sorunları

**Hata: `WebSocket connection failed` veya `Agent not responding`**

Çözüm: Ağ bağlantınızı ve ajan yapılandırmanızı kontrol edin:

- İnternet bağlantınızın kararlı olduğunu doğrulayın
- Ajan kimliğinin (agentId) doğru olduğunu kontrol edin
- Gerekli tüm LLM anahtarlarının yapılandırıldığından emin olun
- WebSocket kullanımı için güvenlik duvarı kısıtlamalarını kontrol edin

## Destek ve Topluluk

- [ElevenLabs Yardım Merkezi](https://help.elevenlabs.io/)
- [ElevenLabs Discord Topluluğu](https://discord.gg/elevenlabs)
- [API Belgeleri](https://elevenlabs.io/docs/api-reference/introduction)
- [Promptfoo GitHub Tartışmaları](https://github.com/promptfoo/promptfoo/discussions)

## Ayrıca Bakınız

- [Değerlendirme Kılavuzu](/docs/guides/evaluate-elevenlabs/)
- [Maliyet Takibi](/docs/configuration/expected-outputs/cost/)
- [Gecikme Süreleri](/docs/configuration/expected-outputs/latency/)
- [Ses Testi Örnekleri](https://github.com/promptfoo/promptfoo/tree/main/examples/elevenlabs)
