---
title: CometAPI
description: CometAPI'nin OpenAI uyumlu birleşik arayüzü üzerinden birden fazla sağlayıcıdan gelen 500'den fazla yapay zeka modelini kullanın
sidebar_label: CometAPI
---

# CometAPI

`cometapi` sağlayıcısı, [CometAPI](https://www.cometapi.com/?utm_source=promptfoo&utm_campaign=integration&utm_medium=integration&utm_content=integration)'yi OpenAI uyumlu uç noktalar aracılığıyla kullanmanıza olanak tanır. Çeşitli satıcılardan yüzlerce modeli destekler.

## Kurulum

İlk olarak, `COMETAPI_KEY` ortam değişkenini CometAPI API anahtarınızla ayarlayın:

```bash
export COMETAPI_KEY=your_api_key_here
```

API anahtarınızı [CometAPI konsolu](https://api.cometapi.com/console/token) üzerinden alabilirsiniz.

## Yapılandırma

Sağlayıcı aşağıdaki sözdizimini kullanır:

```yaml
providers:
  - cometapi:<type>:<model>
```

Burada `<type>` şunlardan biri olabilir:

- `chat` - Sohbet tamamlamaları için (metin, görme, çok modlu)
- `completion` - Metin tamamlamaları için
- `embedding` - Metin gömmeleri (embeddings) için
- `image` - Görüntü oluşturma için (DALL-E, Flux modelleri)

Varsayılan olarak sohbet (chat) moduna geçen `cometapi:<model>` yazımını da kullanabilirsiniz.

### Örnekler

**Sohbet Modelleri (varsayılan):**

```yaml
providers:
  - cometapi:chat:gpt-5-mini
  - cometapi:chat:claude-3-5-sonnet-20241022
  - cometapi:chat:your-favorite-model
  # Veya varsayılan sohbet modunu kullanın
  - cometapi:gpt-5-mini
```

**Görüntü Oluşturma Modelleri:**

```yaml
providers:
  - cometapi:image:dall-e-3
  - cometapi:image:flux-schnell
  - cometapi:image:any-image-model
```

**Metin Tamamlama Modelleri:**

```yaml
providers:
  - cometapi:completion:deepseek-chat
  - cometapi:completion:any-completion-model
```

**Gömme (Embedding) Modelleri:**

```yaml
providers:
  - cometapi:embedding:text-embedding-3-small
  - cometapi:embedding:any-embedding-model
```

Tüm standart OpenAI parametreleri desteklenir:

```yaml
providers:
  - id: cometapi:chat:gpt-5-mini
    config:
      temperature: 0.7
      max_tokens: 512
  - id: cometapi:image:dall-e-3
    config:
      n: 1
      size: '1024x1024'
      quality: 'standard'
```

## Örnekler

Birlikte gelen örnek yapılandırmayı çalıştırabilirsiniz:

```bash
npx promptfoo@latest init --example cometapi
```

### Komut Satırı Kullanımı

**Metin Üretimi:**

```bash
npx promptfoo@latest eval --prompts "AI hakkında bir haiku yaz" -r cometapi:chat:gpt-5-mini
```

**Görüntü Oluşturma:**

```bash
npx promptfoo@latest eval --prompts "Bahçede fütüristik bir robot" -r cometapi:image:dall-e-3
```

**Görme (Vision)/Çok Modlu (Multimodal):**

```bash
npx promptfoo@latest eval --prompts "Bu görselde ne olduğunu açıkla: {{image_url}}" --vars image_url="https://example.com/image.jpg" -r cometapi:chat:gpt-4o
```

### Yapılandırma Örnekleri

**Özel Parametrelerle Görüntü Oluşturma:**

```yaml
providers:
  - id: cometapi:image:dall-e-3
    config:
      size: '1792x1024'
      quality: 'hd'
      style: 'vivid'
      n: 1

prompts:
  - '{{subject}} konusunun {{style}} bir resmi'

tests:
  - vars:
      style: sürrealist
      subject: uzayda yüzen adalar
```

**Görme (Vision) Modeli Yapılandırması:**

```yaml
providers:
  - id: cometapi:chat:gpt-4o
    config:
      max_tokens: 1000
      temperature: 0.3

prompts:
  - file://./vision-prompt.yaml

tests:
  - vars:
      image_url: 'https://example.com/chart.png'
      question: 'Bu verilerden hangi sonuçları çıkarabilirsin?'
```

## Mevcut Modeller

CometAPI birden fazla sağlayıcıdan gelen 500'den fazla modeli destekler. Mevcut modelleri şu komutla görüntüleyebilirsiniz:

```bash
curl -H "Authorization: Bearer $COMETAPI_KEY" https://api.cometapi.com/v1/models
```

Veya [CometAPI fiyatlandırma sayfasındaki](https://api.cometapi.com/pricing) modelleri inceleyebilirsiniz.

**Herhangi Bir Modeli Kullanma:** Uygun tür önekiyle model adını belirtmeniz yeterlidir:

- Metin/sohbet modelleri için `cometapi:chat:herhangi-bir-model-adi`
- Görüntü oluşturma için `cometapi:image:herhangi-bir-goruntu-modeli`
- Gömmeler için `cometapi:embedding:herhangi-bir-gomme-modeli`
- Metin tamamlamaları için `cometapi:completion:herhangi-bir-tamamlama-modeli`
- `cometapi:herhangi-bir-model-adi` (varsayılan olarak sohbet moduna geçer)

## Ortam Değişkenleri

| Değişken       | Açıklama                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `COMETAPI_KEY` | CometAPI anahtarınız. [CometAPI console token](https://api.cometapi.com/console/token) adresinden alabilirsiniz |
