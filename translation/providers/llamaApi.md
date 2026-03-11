---
title: Meta Llama API
description: promptfoo ile metin üretimi ve çok modlu (multimodal) görevler için Meta'nın barındırılan Llama API hizmetini kullanın
---

# Meta Llama API

Llama API sağlayıcısı, Meta'nın resmi API hizmeti aracılığıyla barındırılan Llama modellerini kullanmanıza olanak tanır. Buna en yeni Llama 4 çok modlu modellerine ve Llama 3.3 metin modellerine erişimin yanı sıra Cerebras ve Groq gibi iş ortaklarından hızlandırılmış varyantlar da dahildir.

## Kurulum

Öncelikle, Meta'dan bir API anahtarı almanız gerekecek:

1. [llama.developer.meta.com](https://llama.developer.meta.com) adresini ziyaret edin
2. Bir hesap oluşturun ve bekleme listesine katılın
3. Panelde (dashboard) bir API anahtarı oluşturun
4. API anahtarını bir ortam değişkeni olarak ayarlayın:

```bash
export LLAMA_API_KEY="api_anahtarınız_buraya"
```

## Yapılandırma

Llama API modellerini belirtmek için `llamaapi:` önekini kullanın:

```yaml
providers:
  - llamaapi:Llama-4-Maverick-17B-128E-Instruct-FP8
  - llamaapi:Llama-3.3-70B-Instruct
  - llamaapi:chat:Llama-3.3-8B-Instruct # Açık sohbet formatı
```

### Sağlayıcı Seçenekleri

```yaml
providers:
  - id: llamaapi:Llama-4-Maverick-17B-128E-Instruct-FP8
    config:
      temperature: 0.7 # Rastgeleliği kontrol eder (0.0-2.0)
      max_tokens: 1000 # Maksimum yanıt uzunluğu
      top_p: 0.9 # Çekirdek örnekleme parametresi
      frequency_penalty: 0 # Tekrarı azaltır (-2.0 ile 2.0 arası)
      presence_penalty: 0 # Konu çeşitliliğini teşvik eder (-2.0 ile 2.0 arası)
      stream: false # Akışlı (streaming) yanıtları etkinleştir
```

## Mevcut Modeller

### Meta Tarafından Barındırılan Modeller

#### Llama 4 (Çok Modlu / Multimodal)

- **`Llama-4-Maverick-17B-128E-Instruct-FP8`**: Görüntü ve metin anlama yeteneğine sahip endüstri lideri çok modlu model
- **`Llama-4-Scout-17B-16E-Instruct-FP8`**: Üstün görsel zekaya sahip sınıfının lideri çok modlu model

Her iki Llama 4 modeli de şunları destekler:

- **Giriş**: Metin ve görüntüler
- **Çıktı**: Metin
- **Bağlam Penceresi**: 128k token
- **Hız Sınırları**: Dakikada 3.000 istek (RPM), dakikada 1M token (TPM)

#### Llama 3.3 (Yalnızca Metin)

- **`Llama-3.3-70B-Instruct`**: Geliştirilmiş performanslı metin modeli
- **`Llama-3.3-8B-Instruct`**: Hafif ve ultra hızlı varyant

Her iki Llama 3.3 modeli de şunları destekler:

- **Giriş**: Yalnızca metin
- **Çıktı**: Metin
- **Bağlam Penceresi**: 128k token
- **Hız Sınırları**: Dakikada 3.000 istek (RPM), dakikada 1M token (TPM)

### Hızlandırılmış Varyantlar (Önizleme)

Ultra düşük gecikme süresi gerektiren uygulamalar için:

- **`Cerebras-Llama-4-Maverick-17B-128E-Instruct`** (32k bağlam, 900 RPM, 300k TPM)
- **`Cerebras-Llama-4-Scout-17B-16E-Instruct`** (32k bağlam, 600 RPM, 200k TPM)
- **`Groq-Llama-4-Maverick-17B-128E-Instruct`** (128k bağlam, 1000 RPM, 600k TPM)

Not: Hızlandırılmış varyantlar yalnızca metin tabanlıdır ve görüntü girişlerini desteklemez.

## Özellikler

### Metin Üretimi

Temel metin üretimi tüm modellerle çalışır:

```yaml
providers:
  - llamaapi:Llama-3.3-70B-Instruct

prompts:
  - 'Kuantum bilişimini basit terimlerle açıkla'

tests:
  - vars: {}
    assert:
      - type: contains
        value: 'kuantum'
```

### Çok Modlu (Görüntü + Metin)

Llama 4 modelleri metinle birlikte görüntüleri de işleyebilir:

```yaml
providers:
  - llamaapi:Llama-4-Maverick-17B-128E-Instruct-FP8

prompts:
  - role: user
    content:
      - type: text
        text: 'Bu görüntüde ne görüyorsun?'
      - type: image_url
        image_url:
          url: 'https://example.com/image.jpg'

tests:
  - vars: {}
    assert:
      - type: llm-rubric
        value: 'Görüntü içeriğini doğru bir şekilde açıklar'
```

#### Görüntü Gereksinimleri

- **Desteklenen formatlar**: JPEG, PNG, GIF, ICO
- **Maksimum dosya boyutu**: Görüntü başına 25MB
- **İstek başına maksimum görüntü**: 9
- **Giriş yöntemleri**: URL veya base64 kodlaması

### JSON Yapılandırılmış Çıktı

Belirli bir JSON şemasına uygun yanıtlar üretin:

```yaml
providers:
  - id: llamaapi:Llama-4-Maverick-17B-128E-Instruct-FP8
    config:
      temperature: 0.1
      response_format:
        type: json_schema
        json_schema:
          name: product_review
          schema:
            type: object
            properties:
              rating:
                type: number
                minimum: 1
                maximum: 5
              summary:
                type: string
              pros:
                type: array
                items:
                  type: string
              cons:
                type: array
                items:
                  type: string
            required: ['rating', 'summary']

prompts:
  - 'Bu ürünü incele: {{product_description}}'

tests:
  - vars:
      product_description: 'Harika ses kalitesine sahip ancak pil ömrü kısa kablosuz kulaklıklar'
    assert:
      - type: is-json
      - type: javascript
        value: 'JSON.parse(output).rating >= 1 && JSON.parse(output).rating <= 5'
```

### Araç Çağırma (Tool Calling)

Modellerin harici fonksiyonları çağırmasını etkinleştirin:

```yaml
providers:
  - id: llamaapi:Llama-3.3-70B-Instruct
    config:
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
                  description: Şehir ve eyalet/ülke, örn. İstanbul, TR
                unit:
                  type: string
                  enum: ['celsius', 'fahrenheit']
              required: ['location']

prompts:
  - "{{city}} şehrinde hava nasıl?"

tests:
  - vars:
      city: 'İstanbul, TR'
    assert:
      - type: function-call
        value: get_weather
      - type: javascript
        value: "output.arguments.location.includes('İstanbul')"
```

### Akışlı (Streaming)

Gerçek zamanlı yanıt akışını etkinleştirin:

```yaml
providers:
  - id: llamaapi:Llama-3.3-8B-Instruct
    config:
      stream: true
      temperature: 0.7

prompts:
  - '{{topic}} hakkında kısa bir hikaye yaz'

tests:
  - vars:
      topic: 'zaman yolculuğu'
    assert:
      - type: contains
        value: 'zaman'
```

## Hız Sınırları ve Kotalar

Tüm hız sınırları ekip başına uygulanır (tüm API anahtarları genelinde):

| Model Türü      | İstek/dak (RPM) | Token/dak (TPM) |
| --------------- | -------------- | --------------- |
| Standart Modeller | 3.000          | 1.000.000       |
| Cerebras Modelleri | 600-900        | 200.000-300.000 |
| Groq Modelleri     | 1.000          | 600.000         |

Hız sınırı bilgileri yanıt başlıklarında (headers) mevcuttur:

- `x-ratelimit-limit-tokens`: Toplam token sınırı
- `x-ratelimit-remaining-tokens`: Kalan tokenler
- `x-ratelimit-limit-requests`: Toplam istek sınırı
- `x-ratelimit-remaining-requests`: Kalan istekler

## Model Seçim Kılavuzu

### Şu Durumlarda Llama 4 Modellerini Seçin:

- Çok modlu yeteneklere (metin + görüntü) ihtiyacınız varsa
- En gelişmiş akıl yürütme ve zekayı istiyorsanız
- Kalite, hızdan daha önemliyse
- Karmaşık yapay zeka uygulamaları geliştiriyorsanız

### Şu Durumlarda Llama 3.3 Modellerini Seçin:

- Yalnızca metin işlemeye ihtiyacınız varsa
- Kalite ve hız arasında bir denge istiyorsanız
- Maliyet verimliliği önemliyse
- Sohbet robotları veya içerik üretme araçları geliştiriyorsanız

### Şu Durumlarda Hızlandırılmış Varyantları Seçin:

- Ultra düşük gecikme süresi kritikse
- Gerçek zamanlı uygulamalar geliştiriyorsanız
- Yalnızca metin işleme yeterliyse
- Azaltılmış bağlam pencereleri (Cerebras modelleri) içinde çalışabiliyorsanız

## En İyi Uygulamalar

### Çok Modlu (Multimodal) Kullanım

1. **Görüntü boyutlarını optimize edin**: Daha büyük görüntüler daha fazla token tüketir
2. **Uygun formatları kullanın**: Fotoğraflar için JPEG, grafikler için PNG
3. **Birden fazla görüntüyü toplu işleyin**: Mümkün olduğunda istek başına 9 görüntüye kadar

### Token Yönetimi

1. **Bağlam pencerelerini izleyin**: Modele bağlı olarak 32k-128k arası
2. **`max_tokens` değerini uygun şekilde kullanın**: Yanıt uzunluğunu kontrol edin
3. **Görüntü tokenlerini tahmin edin**: 336x336 piksellik her karo (tile) için yaklaşık 145 token

### Hata Yönetimi

1. **Yeniden deneme mantığını (retry logic) uygulayın**: Hız sınırları ve geçici hatalar için
2. **Girişleri doğrulayın**: Görüntü formatlarını ve boyutlarını kontrol edin
3. **Hız sınırlarını izleyin**: Sınırlara takılmamak için yanıt başlıklarını kullanın

### Performans Optimizasyonu

1. **Doğru modeli seçin**: Kalite, hız ve maliyet dengesini kurun
2. **Akışlı (streaming) özelliği kullanın**: Uzun yanıtlarda daha iyi kullanıcı deneyimi için
3. **Yanıtları önbelleğe alın**: Kullanım durumunuza uygun olduğunda

## Sorun Giderme

### Kimlik Doğrulama Sorunları

```
Error: 401 Unauthorized
```

- `LLAMA_API_KEY` ortam değişkeninizin ayarlandığından emin olun
- API anahtarınızın llama.developer.meta.com adresinde geçerli olduğunu kontrol edin
- Llama API'sine erişiminiz olduğundan emin olun (şu anda önizleme aşamasındadır)

### Hız Sınırları (Rate Limiting)

```
Error: 429 Too Many Requests
```

- Mevcut hız sınırı kullanımınızı kontrol edin
- Üstel geri çekilme (exponential backoff) yeniden deneme mantığını uygulayın
- Yükü farklı zaman dilimlerine dağıtmayı düşünün

### Model Hataları

```
Error: Model not found
```

- Model adının yazımını kontrol edin
- Modelin bölgenizde mevcut olup olmadığını kontrol edin
- Desteklenen model kimliklerini kullandığınızdan emin olun

### Görüntü İşleme Sorunları

```
Error: Invalid image format
```

- Görüntü formatını kontrol edin (yalnızca JPEG, PNG, GIF, ICO)
- Görüntü boyutunun 25MB'ın altında olduğunu doğrulayın
- Görüntü URL'sinin herkese açık olarak erişilebilir olduğundan emin olun

## Veri Gizliliği

Meta Llama API'sinin güçlü veri taahhütleri vardır:

- ✅ **Verilerinizle eğitim yapılmaz**: Girişleriniz ve çıktılarınız model eğitimi için kullanılmaz
- ✅ **Şifreleme**: Veriler beklemedeyken ve transit halindeyken şifrelenir
- ✅ **Reklam yok**: Veriler reklam amaçlı kullanılmaz
- ✅ **Depolama ayırma**: Sıkı erişim kontrolleri ve izole depolama
- ✅ **Uyumluluk**: Düzenli zafiyet yönetimi ve uyumluluk denetimleri

## Diğer Sağlayıcılarla Karşılaştırma

| Özellik           | Llama API    | OpenAI | Anthropic |
| ----------------- | ------------ | ------ | --------- |
| Çok Modlu         | ✅ (Llama 4) | ✅     | ✅        |
| Araç Çağırma      | ✅           | ✅     | ✅        |
| JSON Şeması       | ✅           | ✅     | ❌        |
| Akışlı (Stream)   | ✅           | ✅     | ✅        |
| Bağlam Penceresi  | 32k-128k     | 128k   | 200k      |
| Veri Eğitimi      | ❌           | ✅     | ❌        |

## Örnekler

Aşağıdaki konular için [örnekler dizinine](https://github.com/promptfoo/promptfoo/tree/main/examples/llama-api) göz atın:

- **Temel sohbet**: Basit metin üretimi
- **Çok modlu**: Görüntü anlama görevleri
- **Yapılandırılmış çıktı**: JSON şema doğrulaması
- **Araç çağırma**: Fonksiyon çağırma örnekleri
- **Model karşılaştırması**: Performans kıyaslaması

## İlgili Sağlayıcılar

- [OpenAI](/docs/providers/openai) - Benzer API yapısı ve yetenekler
- [Anthropic](/docs/providers/anthropic) - Alternatif yapay zeka sağlayıcısı
- [Together AI](/docs/providers/togetherai) - Llama dahil çeşitli açık kaynaklı modelleri barındırır
- [OpenRouter](/docs/providers/openrouter) - Llama dahil birden fazla yapay zeka modeline erişim sağlar

Sorularınız ve destek için [Llama API belgelerini](https://llama.developer.meta.com/docs) ziyaret edin veya [promptfoo Discord topluluğuna](https://discord.gg/promptfoo) katılın.
