---
sidebar_label: Perplexity
description: "Doğruluk kontrolü, güncel olaylar ve bilgi temelli yanıtlar için Perplexity'nin gerçek zamanlı web aramalı çevrimiçi LLM'lerini entegre edin"
---

# Perplexity

[Perplexity API'si](https://blog.perplexity.ai/blog/introducing-pplx-api), yerleşik arama yetenekleri, alıntılar ve yapılandırılmış çıktı desteğine sahip sohbet tamamlama modelleri sağlar. Perplexity modelleri gerçek zamanlı olarak web'den bilgi toplar ve kaynak alıntılarıyla birlikte güncel yanıtlar verilmesini sağlar.

Perplexity, OpenAI'ın sohbet tamamlama API formatını takip eder - temel API ayrıntıları için [OpenAI belgelerimize](https://promptfoo.dev/docs/providers/openai) bakın.

## Kurulum

1. [Perplexity Ayarları](https://www.perplexity.ai/settings/api) sayfasından bir API anahtarı alın.
2. `PERPLEXITY_API_KEY` ortam değişkenini ayarlayın veya yapılandırmanızda `apiKey` belirtin.

## Desteklenen Modeller

Perplexity, farklı görevler için optimize edilmiş birkaç özel model sunar:

| Model               | Bağlam Uzunluğu | Açıklama                                            | Kullanım Durumu                                  |
| ------------------- | --------------- | --------------------------------------------------- | ------------------------------------------------ |
| sonar-pro           | 200k            | 8k maksimum çıktı tokenı ile gelişmiş arama modeli  | Uzun formlu içerik, karmaşık akıl yürütme       |
| sonar               | 128k            | Hafif arama modeli                                  | Hızlı aramalar, maliyet etkin yanıtlar          |
| sonar-reasoning-pro | 128k            | Düşünce Zinciri (CoT) ile birinci sınıf akıl yürütme modeli | Karmaşık analizler, çok adımlı problem çözme |
| sonar-reasoning     | 128k            | Hızlı gerçek zamanlı akıl yürütme modeli            | Arama ile problem çözme                          |
| sonar-deep-research | 128k            | Uzman düzeyinde araştırma modeli                    | Kapsamlı raporlar, ayrıntılı araştırmalar        |
| r1-1776             | 128k            | Çevrimdışı sohbet modeli (arama yok)                | Yaratıcı içerik, web araması gerektirmeyen görevler |

## Temel Yapılandırma

```yaml
providers:
  - id: perplexity:sonar-pro
    config:
      temperature: 0.7
      max_tokens: 4000

  - id: perplexity:sonar
    config:
      temperature: 0.2
      max_tokens: 1000
      search_domain_filter: ['wikipedia.org', 'nature.com', '-reddit.com'] # wikipedia/nature'ı dahil et, reddit'i hariç tut
      search_recency_filter: 'week' # Sadece güncel kaynakları kullan
```

## Özellikler

### Arama ve Alıntılar

Perplexity modelleri otomatik olarak internette arama yapar ve kaynakları alıntılar. Bunu şunlarla kontrol edebilirsiniz:

- `search_domain_filter`: Dahil edilecek/hariç tutulacak alan adlarının listesi (hariç tutmak için başına `-` ekleyin)
- `search_recency_filter`: Kaynaklar için zaman filtresi ('month', 'week', 'day', 'hour')
- `return_related_questions`: İlgili takip sorusu önerileri alın
- `web_search_options.search_context_size`: Arama bağlamı miktarını kontrol edin ('low', 'medium', 'high')

```yaml
providers:
  - id: perplexity:sonar-pro
    config:
      search_domain_filter: ['stackoverflow.com', 'github.com', '-quora.com']
      search_recency_filter: 'month'
      return_related_questions: true
      web_search_options:
        search_context_size: 'high'
```

### Tarih Aralığı Filtreleri

Arama sonuçlarını yayınlanma tarihine göre kontrol edin:

```yaml
providers:
  - id: perplexity:sonar-pro
    config:
      # Tarih filtreleri - format: "AA/GG/YYYY"
      search_after_date_filter: '3/1/2025'
      search_before_date_filter: '3/15/2025'
```

### Konum Tabanlı Filtreleme

Kullanıcı konumunu belirterek arama sonuçlarını yerelleştirin:

```yaml
providers:
  - id: perplexity:sonar
    config:
      web_search_options:
        user_location:
          latitude: 37.7749
          longitude: -122.4194
          country: 'US' # İsteğe bağlı: ISO ülke kodu
```

### Yapılandırılmış Çıktı

JSON Şeması kullanarak belirli formatlarda yanıtlar alın:

```yaml
providers:
  - id: perplexity:sonar
    config:
      response_format:
        type: 'json_schema'
        json_schema:
          schema:
            type: 'object'
            properties:
              title: { type: 'string' }
              year: { type: 'integer' }
              summary: { type: 'string' }
            required: ['title', 'year', 'summary']
```

Veya regex desenleriyle (sadece sonar modeli):

```yaml
providers:
  - id: perplexity:sonar
    config:
      response_format:
        type: 'regex'
        regex:
          regex: "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"
```

**Not**: Yeni bir şema ile yapılan ilk isteğin hazırlanması 10-30 saniye sürebilir. Akıl yürütme modelleri için yanıt, `<think>` bölümünü ve ardından yapılandırılmış çıktıyı içerecektir.

### Görüntü Desteği

Yanıtlarda görüntü getirmeyi etkinleştirin:

```yaml
providers:
  - id: perplexity:sonar-pro
    config:
      return_images: true
```

### Maliyet Takibi

promptfoo, Perplexity modelleri için resmi fiyatlandırmalarına dayalı yerleşik maliyet hesaplaması içerir. `usage_tier` parametresi ile kullanım seviyesini belirtebilirsiniz:

```yaml
providers:
  - id: perplexity:sonar-pro
    config:
      usage_tier: 'medium' # Seçenekler: 'high', 'medium', 'low'
```

Maliyet hesaplaması şunları içerir:

- Giriş ve çıkış tokenları için farklı oranlar
- Modela özel fiyatlandırma (sonar, sonar-pro, sonar-reasoning vb.)
- Kullanım seviyesi değerlendirmeleri (high, medium, low)

## Gelişmiş Kullanım Durumları

### Kapsamlı Araştırma

Derinlemesine araştırma raporları için:

```yaml
providers:
  - id: perplexity:sonar-deep-research
    config:
      temperature: 0.1
      max_tokens: 4000
      search_domain_filter: ['arxiv.org', 'researchgate.net', 'scholar.google.com']
      web_search_options:
        search_context_size: 'high'
```

### Adım Adım Akıl Yürütme

Açık akıl yürütme adımları gerektiren problemler için:

```yaml
providers:
  - id: perplexity:sonar-reasoning-pro
    config:
      temperature: 0.2
      max_tokens: 3000
```

### Çevrimdışı Yaratıcı Görevler

Web araması gerektirmeyen yaratıcı içerikler için:

```yaml
providers:
  - id: perplexity:r1-1776
    config:
      temperature: 0.7
      max_tokens: 2000
```

## En İyi Uygulamalar

### Model Seçimi

- **sonar-pro**: Alıntılar içeren ayrıntılı yanıtlar gerektiren karmaşık sorgular için kullanın.
- **sonar**: Olgusal sorgular ve maliyet verimliliği için kullanın.
- **sonar-reasoning-pro/sonar-reasoning**: Adım adım problem çözme için kullanın.
- **sonar-deep-research**: Kapsamlı raporlar için kullanın (30+ dakika sürebilir).
- **r1-1776**: Arama gerektirmeyen yaratıcı içerikler için kullanın.

### Arama Optimizasyonu

- Daha yüksek kaliteli alıntılar için `search_domain_filter`'ı güvenilir alan adlarına ayarlayın.
- Zamana duyarlı konular için `search_recency_filter` kullanın.
- Maliyet optimizasyonu için `web_search_options.search_context_size` ayarını "low" yapın.
- Kapsamlı araştırma için `web_search_options.search_context_size` ayarını "high" yapın.

### Yapılandırılmış Çıktı İpuçları

- Akıl yürütme modelleriyle yapılandırılmış çıktılar kullanırken, yanıtlar bir `<think>` bölümü ve ardından yapılandırılmış çıktıyı içerecektir.
- Regex desenleri için desteklenen sözdizimine uyduklarından emin olun.
- JSON şemaları özyinelemeli (recursive) yapılar veya kısıtlanmamış nesneler içeremez.

## Örnek Yapılandırmalar

Perplexity'nin yeteneklerini sergileyen birden fazla yapılandırmanın bulunduğu [perplexity.ai-example](https://github.com/promptfoo/promptfoo/tree/main/examples/perplexity.ai-example) örneğimizi inceleyin:

- **promptfooconfig.yaml**: Temel model karşılaştırması
- **promptfooconfig.structured-output.yaml**: JSON şeması ve regex desenleri
- **promptfooconfig.search-filters.yaml**: Tarih ve konum tabanlı filtreler
- **promptfooconfig.research-reasoning.yaml**: Özel araştırma ve akıl yürütme modelleri

Bu örnekleri şununla başlatabilirsiniz:

```bash
npx promptfoo@latest init --example perplexity.ai-example
```

## Fiyatlandırma ve Hız Sınırları (Rate Limits)

Fiyatlandırma modele ve kullanım seviyesine göre değişir:

| Model               | Giriş Tokenları (milyon başı) | Çıkış Tokenları (milyon başı) |
| ------------------- | -------------------------- | --------------------------- |
| sonar               | 1 $                        | 1 $                         |
| sonar-pro           | 3 $                        | 15 $                        |
| sonar-reasoning     | 1 $                        | 5 $                         |
| sonar-reasoning-pro | 2 $                        | 8 $                         |
| sonar-deep-research | 2 $                        | 8 $                         |
| r1-1776             | 2 $                        | 8 $                         |

Hız sınırları da kullanım seviyesine (high, medium, low) göre değişir. Doğru maliyet hesaplamaları almak için `usage_tier` parametresi ile seviyenizi belirtin.

Güncel oranlar için [Perplexity'nin fiyatlandırma sayfasını](https://docs.perplexity.ai/docs/pricing) kontrol edin.

## Sorun Giderme

- **Uzun İlk İstekler**: Yeni bir şema ile yapılan ilk istek 10-30 saniye sürebilir.
- **Alıntı Sorunları**: Daha iyi alıntılar için `search_domain_filter`'ı güvenilir alan adlarıyla kullanın.
- **Zaman Aşımı Hataları**: Araştırma modelleri için istek zaman aşımı ayarlarını artırmayı düşünün.
- **Akıl Yürütme Formatı**: Akıl yürütme modelleri için çıktılar `<think>` bölümlerini içerir; bu bölümler yapılandırılmış çıktılar için ayrıştırma (parsing) gerektirebilir.
