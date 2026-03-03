---
sidebar_label: Mistral AI
title: Mistral AI Sağlayıcısı - Modeller, Akıl Yürütme ve API Entegrasyonu İçin Eksiksiz Kılavuz
description: Çok modlu yetenekler, fonksiyon çağırma ve OpenAI uyumlu API'lere sahip Mistral AI Magistral akıl yürütme modellerini yapılandırın
---

# Mistral AI

[Mistral AI API](https://docs.mistral.ai/api/); rekabetçi fiyatlarla olağanüstü performans sunan, en son teknoloji dil modellerine erişim sağlar. Mistral; akıl yürütme, kod üretimi ve çok modlu görevler için özelleşmiş modelleriyle OpenAI ve diğer sağlayıcılara karşı güçlü bir alternatif sunar.

Mistral özellikle şu konularda değerlidir:

- **Maliyet etkin yapay zeka entegrasyonu**: Rakiplerinden 8 kata kadar daha düşük fiyatlandırma
- **Gelişmiş akıl yürütme**: Adım adım düşünmeyi gösteren Magistral modelleri
- **Kod üretimi mükemmelliği**: 80'den fazla programlama dilini destekleyen Codestral modelleri
- **Çok modlu (multimodal) yetenekler**: Metin ve görüntü işleme
- **Kurumsal dağıtımlar**: Sadece 4 GPU gerektiren yerinde (on-premises) kurulum seçenekleri
- **Çok dilli uygulamalar**: 12'den fazla dil için yerel destek

:::tip Neden Mistral'i Seçmelisiniz?

Mistral Medium 3, milyon token başına (giriş/çıkış) 0,40 $ / 2,00 $ fiyatla GPT-4 sınıfı performans sunar; bu da OpenAI'ın benzer yetenekler için 2,50 $ / 10,00 $ olan fiyatlandırmasına kıyasla önemli bir maliyet tasarrufu sağlar.

:::

## API Anahtarı

Mistral AI'yı kullanmak için `MISTRAL_API_KEY` ortam değişkenini ayarlamanız veya sağlayıcı yapılandırmasında `apiKey` belirtmeniz gerekir.

Ortam değişkenini ayarlama örneği:

```sh
export MISTRAL_API_KEY=api_anahtarınız_buraya
```

## Yapılandırma Seçenekleri

Mistral sağlayıcısı kapsamlı yapılandırma seçeneklerini destekler:

### Temel Seçenekler

```yaml
providers:
  - id: mistral:mistral-large-latest
    config:
      # Model davranışı
      temperature: 0.7 # Yaratıcılık (0.0-2.0)
      top_p: 0.95 # Çekirdek örnekleme (0.0-1.0)
      max_tokens: 4000 # Yanıt uzunluğu sınırı

      # Gelişmiş seçenekler
      safe_prompt: true # İçerik filtreleme
      random_seed: 42 # Deterministik çıktılar
      frequency_penalty: 0.1 # Tekrarı azaltır
      presence_penalty: 0.1 # Çeşitliliği teşvik eder
```

### JSON Modu

Yapılandırılmış JSON çıktısı zorla:

```yaml
providers:
  - id: mistral:mistral-large-latest
    config:
      response_format:
        type: 'json_object'
      temperature: 0.3 # Tutarlı JSON için düşük sıcaklık

tests:
  - vars:
      prompt: "'John Smith, 35, mühendis' ifadesinden isim, yaş ve mesleği çıkarın. JSON olarak döndürün."
    assert:
      - type: is-json
      - type: javascript
        value: JSON.parse(output).name === "John Smith"
```

### Kimlik Doğrulama Yapılandırması

```yaml
providers:
  # Seçenek 1: Ortam değişkeni (önerilen)
  - id: mistral:mistral-large-latest

  # Seçenek 2: Doğrudan API anahtarı (üretim için önerilmez)
  - id: mistral:mistral-large-latest
    config:
      apiKey: 'api-anahtarınız-buraya'

  # Seçenek 3: Özel ortam değişkeni
  - id: mistral:mistral-large-latest
    config:
      apiKeyEnvar: 'OZEL_MISTRAL_ANAHTARI'

  # Seçenek 4: Özel uç nokta
  - id: mistral:mistral-large-latest
    config:
      apiHost: 'ozel-proxy.ornek.com'
      apiBaseUrl: 'https://ozel-api.ornek.com/v1'
```

### Gelişmiş Model Yapılandırması

```yaml
providers:
  # Optimal ayarlarla akıl yürütme modeli
  - id: mistral:magistral-medium-latest
    config:
      temperature: 0.7
      top_p: 0.95
      max_tokens: 40960 # Akıl yürütme için tam bağlam

  # FIM destekli kod üretimi
  - id: mistral:codestral-latest
    config:
      temperature: 0.2 # Tutarlı kod için düşük sıcaklık
      max_tokens: 8000
      stop: ['```'] # Kod bloğu sonunda dur

  # Çok modlu yapılandırma
  - id: mistral:pixtral-12b
    config:
      temperature: 0.5
      max_tokens: 2000
      # Görüntü işleme seçenekleri otomatik olarak halledilir
```

### Ortam Değişkenleri Referansı

| Değişken               | Açıklama                                   | Örnek                         |
| ---------------------- | ------------------------------------------ | ----------------------------- |
| `MISTRAL_API_KEY`      | Mistral API anahtarınız (gerekli)          | `sk-1234...`                  |
| `MISTRAL_API_HOST`     | Proxy kurulumu için özel ana bilgisayar adı| `api.ornek.com`               |
| `MISTRAL_API_BASE_URL` | Tam temel URL geçersiz kılma               | `https://api.ornek.com/v1`    |

## Model Seçimi

Yapılandırmanızda hangi Mistral modelini kullanacağınızı belirtebilirsiniz. Aşağıdaki modeller mevcuttur:

### Sohbet Modelleri

#### Premier Modeller

| Model                     | Bağlam | Giriş Fiyatı | Çıkış Fiyatı | En İyi Kullanım Alanı                     |
| ------------------------- | ------- | ----------- | ------------ | ----------------------------------------- |
| `mistral-large-latest`    | 128k    | $2.00/1M    | $6.00/1M     | Karmaşık akıl yürütme, kurumsal görevler  |
| `mistral-medium-latest`   | 128k    | $0.40/1M    | $2.00/1M     | Dengeli performans ve maliyet             |
| `codestral-latest`        | 256k    | $0.30/1M    | $0.90/1M     | Kod üretimi, 80+ dil                      |
| `magistral-medium-latest` | 40k     | $2.00/1M    | $5.00/1M     | Gelişmiş akıl yürütme, adım adım düşünme  |

#### Ücretsiz Modeller

| Model                    | Bağlam | Giriş Fiyatı | Çıkış Fiyatı | En İyi Kullanım Alanı         |
| ------------------------ | ------- | ----------- | ------------ | ----------------------------- |
| `mistral-small-latest`   | 128k    | $0.10/1M    | $0.30/1M     | Genel görevler, maliyet etkin |
| `magistral-small-latest` | 40k     | $0.50/1M    | $1.50/1M     | Düşük bütçeli akıl yürütme    |
| `open-mistral-nemo`      | 128k    | $0.15/1M    | $0.15/1M     | Çok dilli, araştırma          |
| `pixtral-12b`            | 128k    | $0.15/1M    | $0.15/1M     | Görme + metin, çok modlu      |

#### Eski Modeller (Kullanımdan Kaldırıldı)

1. `open-mistral-7b`, `mistral-tiny`, `mistral-tiny-2312`
2. `open-mistral-nemo`, `open-mistral-nemo-2407`, `mistral-tiny-2407`, `mistral-tiny-latest`
3. `mistral-small-2402`
4. `mistral-medium-2312`, `mistral-medium`
5. `mistral-large-2402`
6. `mistral-large-2407`
7. `codestral-2405`
8. `codestral-mamba-2407`, `open-codestral-mamba`, `codestral-mamba-latest`
9. `open-mixtral-8x7b`, `mistral-small`, `mistral-small-2312`
10. `open-mixtral-8x22b`, `open-mixtral-8x22b-2404`

### Gömme (Embedding) Modeli

- `mistral-embed` - 0,10 $ / 1M token - 8k bağlam

İşte farklı Mistral modellerini karşılaştıran örnek bir yapılandırma:

```yaml
providers:
  - mistral:mistral-medium-latest
  - mistral:mistral-small-latest
  - mistral:open-mistral-nemo
  - mistral:magistral-medium-latest
  - mistral:magistral-small-latest
```

## Akıl Yürütme (Reasoning) Modelleri

Mistral'in **Magistral** modelleri, Haziran 2025'te duyurulan özelleşmiş akıl yürütme modelleridir. Bu modeller çok adımlı mantık, şeffaf akıl yürütme ve birden fazla dilde karmaşık problem çözme konularında mükemmeldir.

### Magistral Modellerinin Temel Özellikleri

- **Düşünce zinciri (Chain-of-thought) akıl yürütme**: Modeller, nihai yanıtlara ulaşmadan önce adım adım akıl yürütme izlerini sağlar
- **Çok dilli akıl yürütme**: İngilizce, Fransızca, İspanyolca, Almanca, İtalyanca, Arapça, Rusça, Çince ve daha fazlasında yerel akıl yürütme yetenekleri
- **Şeffaflık**: Takip edilebilir ve doğrulanabilir düşünce süreçleri
- **Alan uzmanlığı**: Yapılandırılmış hesaplamalar, programatik mantık, karar ağaçları ve kural tabanlı sistemler için optimize edilmiştir

### Magistral Model Varyantları

- **Magistral Small** (`magistral-small-2506`): Apache 2.0 lisansı altında 24B parametreli açık kaynaklı sürüm
- **Magistral Medium** (`magistral-medium-2506`): Geliştirilmiş akıl yürütme yeteneklerine sahip daha güçlü kurumsal sürüm

### Kullanım Önerileri

Akıl yürütme görevleri için optimal performans adına şu parametreleri kullanmayı düşünün:

```yaml
providers:
  - id: mistral:magistral-medium-latest
    config:
      temperature: 0.7
      top_p: 0.95
      max_tokens: 40960 # Akıl yürütme görevleri için önerilir
```

## Çok Modlu (Multimodal) Yetenekler

Mistral, hem metin hem de görüntüleri işleyebilen görme yetenekli modeller sunar:

### Görüntü Anlama

Çok modlu görevler için `pixtral-12b` kullanın:

```yaml
providers:
  - id: mistral:pixtral-12b
    config:
      temperature: 0.7
      max_tokens: 1000

tests:
  - vars:
      prompt: 'Bu görüntüde ne görüyorsun?'
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...'
```

### Desteklenen Görüntü Formatları

- **JPEG, PNG, GIF, WebP**
- **Maksimum boyut**: Görüntü başına 20MB
- **Çözünürlük**: 2048x2048 piksele kadar optimaldir

## Fonksiyon Çağırma ve Araç Kullanımı

Mistral modelleri, yapay zeka ajanları ve araçları oluşturmak için gelişmiş fonksiyon çağırmayı destekler:

```yaml
providers:
  - id: mistral:mistral-large-latest
    config:
      temperature: 0.1
      tools:
        - type: function
          function:
            name: get_weather
            description: Bir konum için mevcut hava durumunu al
            parameters:
              type: object
              properties:
                location:
                  type: string
                  description: Şehir adı
                unit:
                  type: string
                  enum: ['celsius', 'fahrenheit']
              required: ['location']

tests:
  - vars:
      prompt: "Paris'te hava nasıl?"
    assert:
      - type: contains
        value: 'get_weather'
```

### Araç Çağırma En İyi Uygulamaları

- Tutarlı araç çağrıları için **düşük sıcaklık** (0.1-0.3) kullanın
- **Ayrıntılı fonksiyon açıklamaları** sağlayın
- Araçlarınıza **parametre doğrulaması** ekleyin
- **Araç çağırma hatalarını** zarif bir şekilde yönetin

## Kod Üretimi

Mistral'in Codestral modelleri, 80'den fazla programlama dilinde kod üretme konusunda mükemmeldir:

### Fill-in-the-Middle (FIM) (Ortayı Doldur)

```yaml
providers:
  - id: mistral:codestral-latest
    config:
      temperature: 0.2
      max_tokens: 2000

tests:
  - vars:
      prompt: |
        <fim_prefix>def calculate_fibonacci(n):
            if n <= 1:
                return n
        <fim_suffix>

        # Fonksiyonu test et
        print(calculate_fibonacci(10))
        <fim_middle>
    assert:
      - type: contains
        value: 'fibonacci'
```

### Kod Üretimi Örnekleri

```yaml
tests:
  - description: 'Python API uç noktası'
    vars:
      prompt: 'Kullanıcı verilerini kabul eden ve veritabanına kaydeden bir FastAPI POST uç noktası oluşturun'
    assert:
      - type: contains
        value: '@app.post'
      - type: contains
        value: 'async def'

  - description: 'React bileşeni'
    vars:
      prompt: 'İsim, e-posta ve avatar içeren bir kullanıcı profili kartı için React bileşeni oluşturun'
    assert:
      - type: contains
        value: 'export'
      - type: contains
        value: 'useState'
```

## Çalışan Tam Örnekler

### Örnek 1: Çoklu Model Karşılaştırması

```yaml
description: 'Mistral modelleri arasındaki akıl yürütme yeteneklerini karşılaştır'

providers:
  - mistral:magistral-medium-latest
  - mistral:magistral-small-latest
  - mistral:mistral-large-latest
  - mistral:mistral-small-latest

prompts:
  - 'Bunu adım adım çöz: {{problem}}'

tests:
  - vars:
      problem: "Bir şirketin 100 çalışanı var. %60'ı uzaktan, %25'i hibrit ve kalanı ofisten çalışıyor. Uzaktan çalışanlar 200 $, hibrit çalışanlar 100 $ ödenek alıyorsa, toplam aylık ödenek maliyeti nedir?"
    assert:
      - type: llm-rubric
        value: 'Açık bir matematiksel akıl yürütme gösterir ve doğru cevaba (13.500 $) ulaşır'
      - type: cost
        threshold: 0.10
```

### Örnek 2: Kod İnceleme Asistanı

```yaml
description: 'Codestral kullanarak yapay zeka destekli kod incelemesi'

providers:
  - id: mistral:codestral-latest
    config:
      temperature: 0.3
      max_tokens: 1500

prompts:
  - |
    Bu kodu hatalar, güvenlik sorunları ve iyileştirmeler açısından inceleyin:

    ```{{language}}
    {{code}}
    ```

    Şu konularda özel geri bildirim sağlayın:
    1. Olası hatalar
    2. Güvenlik açıkları  
    3. Performans iyileştirmeleri
    4. Kod stili ve en iyi uygulamalar

tests:
  - vars:
      language: 'python'
      code: |
        import subprocess

        def run_command(user_input):
            result = subprocess.run(user_input, shell=True, capture_output=True)
            return result.stdout.decode()
    assert:
      - type: contains
        value: 'security'
      - type: llm-rubric
        value: 'Kabuk enjeksiyonu (shell injection) açığını tanımlar ve daha güvenli alternatifler önerir'
```

### Örnek 3: Çok Modlu Belge Analizi

```yaml
description: 'Metin ve görüntü içeren belgeleri analiz et'

providers:
  - id: mistral:pixtral-12b
    config:
      temperature: 0.5
      max_tokens: 2000

tests:
  - vars:
      prompt: |
        Bu belge görüntüsünü analiz edin ve:
        1. Temel bilgileri çıkarın
        2. Ana noktaları özetleyin
        3. Varsa veri veya grafikleri tanımlayın
      image_url: 'https://example.com/financial-report.png'
    assert:
      - type: llm-rubric
        value: 'Belge görüntüsünden metin ve verileri doğru bir şekilde çıkarır'
      - type: length
        min: 200
```

## Kimlik Doğrulama ve Kurulum

### Ortam Değişkenleri

```bash
# Gerekli
export MISTRAL_API_KEY="api-anahtarınız-buraya"

# İsteğe bağlı - özel uç noktalar için
export MISTRAL_API_BASE_URL="https://api.mistral.ai/v1"
export MISTRAL_API_HOST="api.mistral.ai"
```

### API Anahtarınızı Alma

1. [console.mistral.ai](https://console.mistral.ai) adresini ziyaret edin
2. Hesabınıza kaydolun veya giriş yapın
3. **API Keys** bölümüne gidin
4. **Create new key** düğmesine tıklayın
5. Anahtarınızı kopyalayın ve güvenli bir şekilde saklayın

:::warning Güvenlik En İyi Uygulamaları

- API anahtarlarını asla sürüm kontrol sistemlerine göndermeyin
- Ortam değişkenleri veya güvenli kasalar (vaults) kullanın
- Anahtarları düzenli olarak değiştirin
- Beklenmedik artışlar için kullanımı izleyin

:::

## Performans Optimizasyonu

### Model Seçim Kılavuzu

| Kullanım Durumu            | Önerilen Model            | Neden                         |
| -------------------------- | ------------------------- | ---------------------------- |
| **Maliyet duyarlı uygulamalar** | `mistral-small-latest`    | En iyi fiyat/performans oranı |
| **Karmaşık akıl yürütme**  | `magistral-medium-latest` | Adım adım düşünme yeteneği   |
| **Kod üretimi**            | `codestral-latest`        | Programlama için özelleşmiş  |
| **Görme görevleri**        | `pixtral-12b`             | Çok modlu yetenekler         |
| **Yüksek hacimli üretim**  | `mistral-medium-latest`   | Dengeli maliyet ve kalite    |

### Bağlam Penceresi Optimizasyonu

```yaml
providers:
  - id: mistral:magistral-medium-latest
    config:
      max_tokens: 8000 # 32k giriş bağlamı için yer bırakın
      temperature: 0.7
```

### Maliyet Yönetimi

```yaml
# Modeller arası maliyetleri izle
defaultTest:
  assert:
    - type: cost
      threshold: 0.05 # Test başına maliyet > 0,05 $ ise uyar

providers:
  - id: mistral:mistral-small-latest # En maliyet etkin
    config:
      max_tokens: 500 # Çıktı uzunluğunu sınırla
```

## Sorun Giderme

### Yaygın Sorunlar

#### Kimlik Doğrulama Hataları

```
Error: 401 Unauthorized
```

**Çözüm**: API anahtarınızın doğru ayarlandığını doğrulayın:

```bash
echo $MISTRAL_API_KEY
# Anahtarınızı yazdırmalıdır, boş olmamalıdır
```

#### Hız Sınırlama (Rate Limiting)

```
Error: 429 Too Many Requests
```

**Çözümler**:

- Üstel geri çekilme uygulayın
- Daha küçük toplu işlem (batch) boyutları kullanın
- Planınızı yükseltmeyi düşünün

```yaml
# Eşzamanlı istekleri azaltın
providers:
  - id: mistral:mistral-large-latest
    config:
      timeout: 30000 # Zaman aşımı süresini artırın
```

#### Bağlam Uzunluğu Aşıldı

```
Error: Context length exceeded
```

**Çözümler**:

- Giriş metnini kısaltın
- Daha büyük bağlam pencereli modeller kullanın
- Uzun girişler için metin özetleme uygulayın

```yaml
providers:
  - id: mistral:mistral-medium-latest # 128k bağlam
    config:
      max_tokens: 4000 # Giriş için yer bırakın
```

#### Model Bulunamadı

```
Error: Model not found
```

**Çözüm**: Model adlarını kontrol edin ve en son sürümleri kullanın:

```yaml
providers:
  - mistral:mistral-large-latest # ✅ En son sürümü kullanın
  # - mistral:mistral-large-2402  # ❌ Kullanımdan kaldırıldı
```

### Hata Ayıklama İpuçları

1. **Hata ayıklama günlüğünü etkinleştirin**:

   ```bash
   export DEBUG=promptfoo:*
   ```

2. **Önce basit istemlerle test edin**:

   ```yaml
   tests:
     - vars:
         prompt: 'Merhaba dünya!'
   ```

3. **Token kullanımını kontrol edin**:
   ```yaml
   tests:
     - assert:
         - type: cost
           threshold: 0.01
   ```

### Yardım Alma

- **Belgeler**: [docs.mistral.ai](https://docs.mistral.ai)
- **Topluluk**: [Discord](https://discord.gg/mistralai)
- **Destek**: [support@mistral.ai](mailto:support@mistral.ai)
- **Durum**: [status.mistral.ai](https://status.mistral.ai)

## Çalışan Örnekler

GitHub depomuzda kullanıma hazır örnekler mevcuttur:

### 📋 [Eksiksiz Mistral Örnek Koleksiyonu](https://github.com/promptfoo/promptfoo/tree/main/examples/mistral)

Bu örneklerden herhangi birini yerel olarak çalıştırın:

```bash
npx promptfoo@latest init --example mistral
```

**Bireysel Örnekler:**

- **[AIME2024 Matematiksel Akıl Yürütme](https://github.com/promptfoo/promptfoo/blob/main/examples/mistral/promptfooconfig.aime2024.yaml)** - Gelişmiş matematik yarışması problemlerinde Magistral modellerini değerlendirin
- **[Model Karşılaştırması](https://github.com/promptfoo/promptfoo/blob/main/examples/mistral/promptfooconfig.comparison.yaml)** - Magistral ve geleneksel modeller arasındaki akıl yürütmeyi karşılaştırın
- **[Fonksiyon Çağırma](https://github.com/promptfoo/promptfoo/blob/main/examples/mistral/promptfooconfig.tool-use.yaml)** - Araç kullanımı ve fonksiyon çağırmayı gösterin
- **[JSON Modu](https://github.com/promptfoo/promptfoo/blob/main/examples/mistral/promptfooconfig.json-mode.yaml)** - Yapılandırılmış çıktı üretimi
- **[Kod Üretimi](https://github.com/promptfoo/promptfoo/blob/main/examples/mistral/promptfooconfig.code-generation.yaml)** - Codestral ile çok dilli kod üretimi
- **[Akıl Yürütme Görevleri](https://github.com/promptfoo/promptfoo/blob/main/examples/mistral/promptfooconfig.reasoning.yaml)** - Gelişmiş adım adım problem çözme
- **[Çok Modlu](https://github.com/promptfoo/promptfoo/blob/main/examples/mistral/promptfooconfig.multimodal.yaml)** - Pixtral ile görme yetenekleri

### Hızlı Başlangıç

```bash
# Temel karşılaştırmayı deneyin
npx promptfoo@latest eval -c https://raw.githubusercontent.com/promptfoo/promptfoo/main/examples/mistral/promptfooconfig.comparison.yaml

# Magistral modelleriyle matematiksel akıl yürütmeyi test edin
npx promptfoo@latest eval -c https://raw.githubusercontent.com/promptfoo/promptfoo/main/examples/mistral/promptfooconfig.aime2024.yaml

# Akıl yürütme yeteneklerini test edin
npx promptfoo@latest eval -c https://raw.githubusercontent.com/promptfoo/promptfoo/main/examples/mistral/promptfooconfig.reasoning.yaml
```

:::tip Örneklerle Katkıda Bulunun

Harika bir kullanım durumu mu buldunuz? Topluluğa yardımcı olmak için [kendi örneğinizle katkıda bulunun](https://github.com/promptfoo/promptfoo/tree/main/examples)!

:::
