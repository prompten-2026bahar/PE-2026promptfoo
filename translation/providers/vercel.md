---
title: Vercel AI Gateway
sidebar_label: Vercel AI Gateway
sidebar_position: 48
description: Vercel'in birleşik AI Gateway'i aracılığıyla OpenAI, Anthropic, Google ve 20'den fazla yapay zeka sağlayıcısına erişin. Metin üretimi, akış (streaming), yapılandırılmış çıktı ve gömmeleri destekler.
---

# Vercel AI Gateway

[Vercel AI Gateway](https://vercel.com/docs/ai-gateway), tek bir API üzerinden 20'den fazla sağlayıcının yapay zeka modellerine erişmek için birleşik bir arayüz sağlar. Bu sağlayıcı, resmi [Vercel AI SDK'sını](https://ai-sdk.dev/) kullanır.

## Kurulum

1. [Vercel Panosu](https://vercel.com/dashboard)'ndan AI Gateway'i etkinleştirin.
2. AI Gateway ayarlarından API anahtarınızı alın.
3. `VERCEL_AI_GATEWAY_API_KEY` ortam değişkenini ayarlayın veya yapılandırmanızda `apiKey` değerini belirtin.

```bash
export VERCEL_AI_GATEWAY_API_KEY=your_api_key_here
```

## Kullanım

### Sağlayıcı Formatı

Vercel sağlayıcısı şu formatı kullanır: `vercel:<provider>/<model>`

```yaml
providers:
  - vercel:openai/gpt-4o-mini
  - vercel:anthropic/claude-sonnet-4.5
  - vercel:google/gemini-2.5-flash
```

### Gömme Modelleri (Embedding Models)

Gömme modelleri için `embedding:` önekini kullanın:

```yaml
providers:
  - vercel:embedding:openai/text-embedding-3-small
```

## Yapılandırma

### Temel Yapılandırma

```yaml title="promptfooconfig.yaml"
providers:
  - id: vercel:openai/gpt-4o-mini
    config:
      temperature: 0.7
      maxTokens: 1000
```

### Tüm Yapılandırma Seçenekleri

```yaml title="promptfooconfig.yaml"
providers:
  - id: vercel:anthropic/claude-sonnet-4.5
    config:
      # Kimlik Doğrulama
      apiKey: ${VERCEL_AI_GATEWAY_API_KEY}
      apiKeyEnvar: CUSTOM_API_KEY_VAR # Özel bir ortam değişkeni adı kullanın

      # Model ayarları
      temperature: 0.7
      maxTokens: 2000
      topP: 0.9
      topK: 40
      frequencyPenalty: 0.5
      presencePenalty: 0.3
      stopSequences:
        - '\n\n'

      # İstek ayarları
      timeout: 60000
      headers:
        Custom-Header: 'değer'

      # Akış (Streaming)
      streaming: true
```

### Yapılandırma Parametreleri

| Parametre          | Tür      | Açıklama                                       |
| ------------------ | -------- | ---------------------------------------------- |
| `apiKey`           | string   | Vercel AI Gateway API anahtarı                 |
| `apiKeyEnvar`      | string   | API anahtarı için özel ortam değişkeni adı      |
| `temperature`      | number   | Rastgeleliği kontrol eder (0.0 - 1.0)          |
| `maxTokens`        | number   | Oluşturulacak maksimum token sayısı            |
| `topP`             | number   | Çekirdek örnekleme (Nucleus sampling) parametresi |
| `topK`             | number   | Top-k örnekleme parametresi                    |
| `frequencyPenalty` | number   | Sık kullanılan tokenleri cezalandırır          |
| `presencePenalty`  | number   | Varlığa bağlı olarak tokenleri cezalandırır    |
| `stopSequences`    | string[] | Üretimin durduğu diziler                       |
| `timeout`          | number   | Milisaniye cinsinden istek zaman aşımı         |
| `headers`          | object   | Ek HTTP başlıkları                             |
| `streaming`        | boolean  | Akış yanıtlarını etkinleştir                   |
| `responseSchema`   | object   | Yapılandırılmış çıktı için JSON şeması         |
| `baseUrl`          | string   | AI Gateway temel URL'sini geçersiz kıl         |

## Yapılandırılmış Çıktı

Bir JSON şeması sağlayarak yapılandırılmış JSON çıktısı oluşturun:

```yaml title="promptfooconfig.yaml"
providers:
  - id: vercel:openai/gpt-4o
    config:
      responseSchema:
        type: object
        properties:
          sentiment:
            type: string
            enum: [positive, negative, neutral]
          confidence:
            type: number
          keywords:
            type: array
            items:
              type: string
        required:
          - sentiment
          - confidence

prompts:
  - 'Bu metnin duygusunu analiz et: {{text}}'

tests:
  - vars:
      text: 'Bu ürünü çok sevdim!'
    assert:
      - type: javascript
        value: output.sentiment === 'positive'
```

## Akış (Streaming)

Gerçek zamanlı yanıtlar için akışı etkinleştirin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: vercel:anthropic/claude-sonnet-4.5
    config:
      streaming: true
      maxTokens: 2000
```

## Desteklenen Sağlayıcılar

Vercel AI Gateway şu sağlayıcıların modellerini destekler:

| Sağlayıcı  | Örnek Modeller                                              |
| ---------- | ----------------------------------------------------------- |
| OpenAI     | `openai/gpt-5`, `openai/o3-mini`, `openai/gpt-4o-mini`      |
| Anthropic  | `anthropic/claude-sonnet-4.5`, `anthropic/claude-haiku-4.5` |
| Google     | `google/gemini-2.5-flash`, `google/gemini-2.5-pro`          |
| Mistral    | `mistral/mistral-large`, `mistral/magistral-medium`         |
| Cohere     | `cohere/command-a`                                          |
| DeepSeek   | `deepseek/deepseek-r1`, `deepseek/deepseek-v3`              |
| Perplexity | `perplexity/sonar-pro`, `perplexity/sonar-reasoning`        |
| xAI        | `xai/grok-3`, `xai/grok-4`                                  |

Tam liste için [Vercel AI Gateway belgelerine](https://vercel.com/docs/ai-gateway/models-and-providers) bakın.

## Gömme Modelleri (Embedding Models)

Metin benzerliği, arama ve RAG uygulamaları için gömmeler oluşturun:

```yaml title="promptfooconfig.yaml"
providers:
  - vercel:embedding:openai/text-embedding-3-small

prompts:
  - 'Şunun için gömme oluştur: {{text}}'

tests:
  - vars:
      text: 'Merhaba dünya'
    assert:
      - type: is-valid-embedding
```

Desteklenen gömme modelleri:

| Sağlayıcı | Örnek Modeller                                                   |
| --------- | ---------------------------------------------------------------- |
| OpenAI    | `openai/text-embedding-3-small`, `openai/text-embedding-3-large` |
| Google    | `google/gemini-embedding-001`, `google/text-embedding-005`       |
| Cohere    | `cohere/embed-v4.0`                                              |
| Voyage    | `voyage/voyage-3.5`, `voyage/voyage-code-3`                      |

## Örnekler

### Çoklu Sağlayıcı Karşılaştırması

```yaml title="promptfooconfig.yaml"
providers:
  - id: vercel:openai/gpt-4o-mini
    config:
      temperature: 0.7
  - id: vercel:anthropic/claude-sonnet-4.5
    config:
      temperature: 0.7
  - id: vercel:google/gemini-2.5-flash
    config:
      temperature: 0.7

prompts:
  - '{{concept}} kavramını basit terimlerle açıkla'

tests:
  - vars:
      concept: 'kuantum bilişim'
    assert:
      - type: llm-rubric
        value: 'Yanıt anlaşılması kolay olmalıdır'
```

### Doğrulama ile JSON Yanıtı

```yaml title="promptfooconfig.yaml"
providers:
  - id: vercel:openai/gpt-4o
    config:
      responseSchema:
        type: object
        properties:
          summary:
            type: string
          topics:
            type: array
            items:
              type: string
          wordCount:
            type: integer
        required:
          - summary
          - topics

prompts:
  - 'Bu makaleyi analiz et ve yapılandırılmış bir özet döndür: {{article}}'

tests:
  - vars:
      article: 'Uzun makale metni...'
    assert:
      - type: javascript
        value: 'Array.isArray(output.topics) && output.topics.length > 0'
```

## Ortam Değişkenleri

| Değişken                     | Açıklama                    |
| ---------------------------- | --------------------------- |
| `VERCEL_AI_GATEWAY_API_KEY`  | AI Gateway için API anahtarı |
| `VERCEL_AI_GATEWAY_BASE_URL` | AI Gateway URL'sini geçersiz kıl |

## Sorun Giderme

### Yaygın Sorunlar

1. **Kimlik Doğrulama Başarısız**: `VERCEL_AI_GATEWAY_API_KEY` değerinin doğru ayarlandığından emin olun.
2. **Model Bulunamadı**: Sağlayıcı/model kombinasyonunun desteklendiğini kontrol edin.
3. **İstek Zaman Aşımı**: `timeout` yapılandırma değerini artırın.

### Hata Ayıklama Modu

Ayrıntılı istek/yanıt bilgilerini görmek için hata ayıklama günlüğünü etkinleştirin:

```bash
LOG_LEVEL=debug promptfoo eval
```

## İlgili Bağlantılar

- [Vercel AI SDK Belgeleri](https://ai-sdk.dev/)
- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [Desteklenen Sağlayıcılar](https://vercel.com/docs/ai-gateway/models-and-providers)
- [promptfoo Sağlayıcı Kılavuzu](/docs/providers/)
