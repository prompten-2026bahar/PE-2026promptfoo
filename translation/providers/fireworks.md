---
sidebar_label: Fireworks AI
description: Kurumsal düzeyde LLM testi ile sorunsuz entegrasyon ve çıkarım için OpenAI uyumlu API'leri aracılığıyla Fireworks AI'nın Llama-v3-8b modelini yapılandırın
---

# Fireworks AI

[Fireworks AI](https://fireworks.ai), OpenAI arayüzü ile tamamen uyumlu bir API aracılığıyla çok çeşitli dil modellerine erişim sunar.

Fireworks AI sağlayıcısı, [OpenAI sağlayıcısı](/docs/providers/openai/)ndaki tüm seçenekleri destekler.

## Örnek Kullanım

Sağlayıcıyı `accounts/fireworks/models/llama-4-scout-instruct` modelini kullanacak şekilde yapılandırmak için aşağıdaki YAML yapılandırmasını kullanın:

```yaml
providers:
  - id: fireworks:accounts/fireworks/models/llama-4-scout-instruct
    config:
      temperature: 0.7
      apiKey: YOUR_FIREWORKS_API_KEY
```

Alternatif olarak, API anahtarınızı doğrudan kullanmak için `FIREWORKS_API_KEY` ortam değişkenini ayarlayabilirsiniz.

## API Detayları

- **Temel URL**: `https://api.fireworks.ai/inference/v1`
- **API formatı**: OpenAI uyumlu
- Tam [API belgeleri](https://docs.fireworks.ai)
