---
sidebar_label: Together AI
description: "Sunucusuz GPU altyapısına sahip Together AI'nın optimize edilmiş çıkarım platformunu kullanarak açık kaynaklı modelleri ölçekli bir şekilde dağıtın"
---

# Together AI

[Together AI](https://www.together.ai/), OpenAI'ın arayüzüyle uyumlu bir API aracılığıyla açık kaynaklı modellere erişim sağlar.

## OpenAI Uyumluluğu

Together AI'nın API'si, OpenAI'ın API'si ile uyumludur; bu da [OpenAI sağlayıcısı](/docs/providers/openai/) sayfasında bulunan tüm parametrelerin Together AI ile de çalıştığı anlamına gelir.

## Temel Yapılandırma

Promptfoo yapılandırmanızda bir Together AI modelini şu şekilde yapılandırın:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: togetherai:meta-llama/Llama-4-Scout-Instruct
    config:
      temperature: 0.7
```

Sağlayıcı, `TOGETHER_API_KEY` ortam değişkeninde saklanan bir API anahtarı gerektirir.

## Temel Özellikler

### Maksimum Token Yapılandırması

```yaml
config:
  max_tokens: 4096
```

### Fonksiyon Çağırma (Function Calling)

```yaml
config:
  tools:
    - type: function
      function:
        name: get_weather
        description: Mevcut hava durumunu al
        parameters:
          type: object
          properties:
            location:
              type: string
              description: Şehir ve eyalet
```

### JSON Modu

```yaml
config:
  response_format: { type: 'json_object' }
```

## Popüler Modeller

Together AI 200'den fazla model sunar. İşte kategori bazında en popüler modellerden bazıları:

### Llama 4 Modelleri

- **Llama 4 Maverick**: `meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8` (524.288 bağlam uzunluğu, FP8)
- **Llama 4 Scout**: `meta-llama/Llama-4-Scout-17B-16E-Instruct` (327.680 bağlam uzunluğu, FP16)

### DeepSeek Modelleri

- **DeepSeek R1**: `deepseek-ai/DeepSeek-R1` (128.000 bağlam uzunluğu, FP8)
- **DeepSeek R1 Distill Llama 70B**: `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` (131.072 bağlam uzunluğu, FP16)
- **DeepSeek R1 Distill Qwen 14B**: `deepseek-ai/DeepSeek-R1-Distill-Qwen-14B` (131.072 bağlam uzunluğu, FP16)
- **DeepSeek V3**: `deepseek-ai/DeepSeek-V3` (16.384 bağlam uzunluğu, FP8)

### Llama 3 Modelleri

- **Llama 3.3 70B Instruct Turbo**: `meta-llama/Llama-3.3-70B-Instruct-Turbo` (131.072 bağlam uzunluğu, FP8)
- **Llama 3.1 70B Instruct Turbo**: `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo` (131.072 bağlam uzunluğu, FP8)
- **Llama 3.1 405B Instruct Turbo**: `meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo` (130.815 bağlam uzunluğu, FP8)
- **Llama 3.1 8B Instruct Turbo**: `meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo` (131.072 bağlam uzunluğu, FP8)
- **Llama 3.2 3B Instruct Turbo**: `meta-llama/Llama-3.2-3B-Instruct-Turbo` (131.072 bağlam uzunluğu, FP16)

### Mixtral Modelleri

- **Mixtral-8x7B Instruct**: `mistralai/Mixtral-8x7B-Instruct-v0.1` (32.768 bağlam uzunluğu, FP16)
- **Mixtral-8x22B Instruct**: `mistralai/Mixtral-8x22B-Instruct-v0.1` (65.536 bağlam uzunluğu, FP16)
- **Mistral Small 3 Instruct (24B)**: `mistralai/Mistral-Small-24B-Instruct-2501` (32.768 bağlam uzunluğu, FP16)

### Qwen Modelleri

- **Qwen 2.5 72B Instruct Turbo**: `Qwen/Qwen2.5-72B-Instruct-Turbo` (32.768 bağlam uzunluğu, FP8)
- **Qwen 2.5 7B Instruct Turbo**: `Qwen/Qwen2.5-7B-Instruct-Turbo` (32.768 bağlam uzunluğu, FP8)
- **Qwen 2.5 Coder 32B Instruct**: `Qwen/Qwen2.5-Coder-32B-Instruct` (32.768 bağlam uzunluğu, FP16)
- **QwQ-32B**: `Qwen/QwQ-32B` (32.768 bağlam uzunluğu, FP16)

### Vizyon (Vision) Modelleri

- **Llama 3.2 Vision**: `meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo` (131.072 bağlam uzunluğu, FP16)
- **Qwen 2.5 Vision Language 72B**: `Qwen/Qwen2.5-VL-72B-Instruct` (32.768 bağlam uzunluğu, FP8)
- **Qwen 2 VL 72B**: `Qwen/Qwen2-VL-72B-Instruct` (32.768 bağlam uzunluğu, FP16)

### Ücretsiz Uç Noktalar (Free Endpoints)

Together AI, düşürülmüş hız sınırlarına (rate limits) sahip ücretsiz katmanlar sunar:

- `meta-llama/Llama-3.3-70B-Instruct-Turbo-Free`
- `meta-llama/Llama-Vision-Free`
- `deepseek-ai/DeepSeek-R1-Distill-Llama-70B-Free`

Mevcut 200'den fazla modelin tamamı ve özellikleri için [Together AI Modeller sayfasını](https://docs.together.ai/docs/inference-models) inceleyin.

## Örnek Yapılandırma

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.jsons
providers:
  - id: togetherai:meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8
    config:
      temperature: 0.7
      max_tokens: 4096

  - id: togetherai:deepseek-ai/DeepSeek-R1
    config:
      temperature: 0.0
      response_format: { type: 'json_object' }
      tools:
        - type: function
          function:
            name: get_weather
            description: Hava durumu bilgisini al
            parameters:
              type: object
              properties:
                location: { type: 'string' }
                unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
```

Daha fazla bilgi için [Together AI belgelerine](https://docs.together.ai/docs/chat-models) bakın.
