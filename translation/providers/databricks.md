---
sidebar_label: Databricks
description: OpenAI uyumlu arayüz üzerinden barındırılan ve harici LLM'lere birleşik erişim için Databricks Temel Model API'lerini Llama-3, Claude ve özel uç noktalarla yapılandırın
---

# Databricks Temel Model API'leri

Databricks sağlayıcısı, Databricks'in Temel Model API'leri ile entegre olarak, birleşik bir OpenAI uyumlu arayüz üzerinden son teknoloji modellere erişim sunar. Özel kullanım durumunuza ve performans gereksinimlerinize uygun birden fazla dağıtım modunu destekler.

## Genel Bakış

Databricks Temel Model API'leri üç ana dağıtım seçeneği sunar:

1. **Token başına ödeme uç noktaları (Pay-per-token)**: Kullanıma dayalı fiyatlandırma ile popüler modeller için önceden yapılandırılmış uç noktalar
2. **Tahsis edilmiş kapasite (Provisioned throughput)**: Üretim iş yükleri için garantili performans sunan adanmış uç noktalar
3. **Harici modeller**: Databricks üzerinden OpenAI, Anthropic ve Google gibi sağlayıcıların modellerine birleşik erişim

## Ön Koşullar

1. Temel Model API'leri etkinleştirilmiş bir Databricks çalışma alanı
2. Kimlik doğrulama için bir Databricks erişim jetonu (token)
3. Çalışma alanı URL'niz (örn. `https://your-workspace.cloud.databricks.com`)

Ortamınızı ayarlayın:

```sh
export DATABRICKS_WORKSPACE_URL=https://your-workspace.cloud.databricks.com
export DATABRICKS_TOKEN=your-token-here
```

## Temel Kullanım

### Token Başına Ödeme (Pay-per-token) Uç Noktaları

Basit bir yapılandırma ile önceden yapılandırılmış Temel Model uç noktalarına erişin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: databricks:databricks-meta-llama-3-3-70b-instruct
    config:
      isPayPerToken: true
      workspaceUrl: https://your-workspace.cloud.databricks.com
```

Mevcut token başına ödeme modellerinden bazıları şunlardır:

- `databricks-meta-llama-3-3-70b-instruct` - Meta'nın en yeni Llama modeli
- `databricks-claude-3-7-sonnet` - Akıl yürütme yeteneklerine sahip Anthropic Claude
- `databricks-gte-large-en` - Metin gömme (embeddings) modeli
- `databricks-dbrx-instruct` - Databricks'in kendi temel modeli

### Tahsis Edilmiş Kapasite (Provisioned Throughput) Uç Noktaları

Garantili performans gerektiren üretim iş yükleri için:

```yaml
providers:
  - id: databricks:my-custom-endpoint
    config:
      workspaceUrl: https://your-workspace.cloud.databricks.com
      temperature: 0.7
      max_tokens: 500
```

### Harici Modeller

Databricks'in birleşik API'si aracılığıyla harici modellere erişin:

```yaml
providers:
  - id: databricks:my-openai-endpoint
    config:
      workspaceUrl: https://your-workspace.cloud.databricks.com
      # Harici model uç noktaları OpenAI, Anthropic vb. sağlayıcılara proxy yapar.
```

## Yapılandırma Seçenekleri

Databricks sağlayıcısı, [OpenAI yapılandırma seçeneklerini](/docs/providers/openai#configuring-parameters) şu Databricks'e özgü özelliklerle genişletir:

| Parametre         | Açıklama                                                                                      | Varsayılan |
| ----------------- | --------------------------------------------------------------------------------------------- | ---------- |
| `workspaceUrl`    | Databricks çalışma alanı URL'si. `DATABRICKS_WORKSPACE_URL` ortam değişkeniyle de ayarlanabilir. | -          |
| `isPayPerToken`   | Bunun bir token başına ödeme (true) mi yoksa özel dağıtılmış bir uç nokta (false) mi olduğu    | false      |
| `usageContext`    | Kullanım takibi ve maliyet ataması için isteğe bağlı meta veriler                             | -          |
| `aiGatewayConfig` | AI Gateway özellikleri yapılandırması (güvenlik filtreleri, PII işleme)                       | -          |

### Gelişmiş Yapılandırma

```yaml title="promptfooconfig.yaml"
providers:
  - id: databricks:databricks-claude-3-7-sonnet
    config:
      isPayPerToken: true
      workspaceUrl: https://your-workspace.cloud.databricks.com

      # Standart OpenAI parametreleri
      temperature: 0.7
      max_tokens: 2000
      top_p: 0.9

      # Maliyet ataması için kullanım takibi
      usageContext:
        project: 'musteri-destek'
        team: 'muhendislik'
        environment: 'üretim'

      # AI Gateway özellikleri (uç noktada etkinleştirilmişse)
      aiGatewayConfig:
        enableSafety: true
        piiHandling: 'mask' # Seçenekler: none, block, mask
```

## Ortam Değişkenleri

| Değişken                   | Açıklama                                        |
| -------------------------- | ----------------------------------------------- |
| `DATABRICKS_WORKSPACE_URL` | Databricks çalışma alanı URL'niz                |
| `DATABRICKS_TOKEN`         | Databricks API erişimi için kimlik doğrulama jetonu |

## Özellikler

### Görme (Vision) Modelleri

Databricks üzerindeki görme modelleri, OpenAI formatına benzer yapılandırılmış JSON istemleri gerektirir. Bunları şu şekilde kullanabilirsiniz:

```yaml title="promptfooconfig.yaml"
prompts:
  - file://vision-prompt.json

providers:
  - id: databricks:databricks-claude-3-7-sonnet
    config:
      isPayPerToken: true

tests:
  - vars:
      question: "Bu görselde ne var?"
      image_url: 'https://example.com/image.jpg'
```

Uygun formatta bir `vision-prompt.json` dosyası oluşturun:

```json title="vision-prompt.json"
[
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "{{question}}"
      },
      {
        "type": "image_url",
        "image_url": {
          "url": "{{image_url}}"
        }
      }
    ]
  }
]
```

### Yapılandırılmış Çıktılar (Structured Outputs)

Belirli bir JSON şemasında yanıtlar alın:

```yaml
providers:
  - id: databricks:databricks-meta-llama-3-3-70b-instruct
    config:
      isPayPerToken: true
      response_format:
        type: 'json_schema'
        json_schema:
          name: 'ürün_bilgisi'
          schema:
            type: 'object'
            properties:
              name:
                type: 'string'
              price:
                type: 'number'
            required: ['name', 'price']
```

## İzleme ve Kullanım Takibi

Ayrıntılı bağlam ile kullanım ve maliyetleri takip edin:

```yaml
providers:
  - id: databricks:databricks-meta-llama-3-3-70b-instruct
    config:
      isPayPerToken: true
      usageContext:
        application: 'sohbet_botu'
        customer_id: '12345'
        request_type: 'destek_sorgusu'
        priority: 'high'
```

Kullanım verileri Databricks sistem tabloları üzerinden mevcuttur:

- `system.serving.endpoint_usage` - Token kullanımı ve istek metrikleri
- `system.serving.served_entities` - Uç nokta meta verileri

## En İyi Uygulamalar

1. **Doğru dağıtım modunu seçin**:
   - Deneyler ve düşük hacimli kullanım durumları için token başına ödeme (pay-per-token) kullanın
   - SLA gerektiren üretim iş yükleri için tahsis edilmiş kapasite (provisioned throughput) kullanın
   - Belirli sağlayıcıların yeteneklerine ihtiyaç duyduğunuzda harici modelleri kullanın

2. **Üretim uç noktaları için AI Gateway özelliklerini etkinleştirin**:
   - Güvenlik koruma duvarları zararlı içeriği engeller
   - PII algılama hassas verileri korur
   - Hız sınırlama maliyetleri kontrol eder ve kötüye kullanımı önler

3. **Uygun hata yönetimini uygulayın**:
   - Token başına ödeme uç noktalarının hız sınırları olabilir
   - Tahsis edilmiş uç noktaların saniye başına token sınırları olabilir
   - Harici model uç noktaları sağlayıcıya özgü sınırlamaları devralır

## Örnek: Çoklu Model Karşılaştırması

```yaml title="promptfooconfig.yaml"
prompts:
  - 'Kuantum bilişimi 10 yaşındaki bir çocuğa açıkla'

providers:
  # Databricks yerel modeli
  - id: databricks:databricks-meta-llama-3-3-70b-instruct
    config:
      isPayPerToken: true
      temperature: 0.7

  # Databricks üzerinden harici model
  - id: databricks:my-gpt4-endpoint
    config:
      temperature: 0.7

  # Özel dağıtılmış model
  - id: databricks:my-finetuned-llama
    config:
      temperature: 0.7

tests:
  - assert:
      - type: llm-rubric
        value: 'Yanıt basit, açık olmalı ve yaşa uygun benzetmeler kullanmalıdır'
```

## Sorun Giderme

Yaygın sorunlar ve çözümleri:

1. **Kimlik doğrulama hataları**: `DATABRICKS_TOKEN` değerinizin gerekli izinlere sahip olduğunu doğrulayın
2. **Uç nokta bulunamadı**:
   - Token başına ödeme için: Tam uç nokta adını kullandığınızdan emin olun (örn. `databricks-meta-llama-3-3-70b-instruct`)
   - Özel uç noktalar için: Uç noktanın var olduğunu ve çalıştığını doğrulayın
3. **Hız sınırlama**: Token başına ödeme uç noktalarının kullanım sınırları vardır; yüksek hacimli kullanım için tahsis edilmiş kapasiteyi değerlendirin
4. **Token sayısı hataları**: Bazı modellerin belirli token sınırları vardır; `max_tokens` değerini buna göre ayarlayın

## Ek Kaynaklar

- [Databricks Temel Model API'leri belgeleri](https://docs.databricks.com/en/machine-learning/foundation-models/index.html)
- [Desteklenen modeller ve bölgeler](https://docs.databricks.com/en/machine-learning/foundation-models/supported-models.html)
- [AI Gateway yapılandırması](https://docs.databricks.com/en/ai-gateway/index.html)
- [Unity Catalog model yönetimi](https://docs.databricks.com/en/machine-learning/manage-model-lifecycle/index.html)
