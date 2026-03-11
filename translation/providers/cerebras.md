---
sidebar_label: Cerebras
description: Gelişmiş MoE mimarisi desteğiyle kurumsal düzeyde çıkarım için OpenAI uyumlu API'leri aracılığıyla Cerebras'ın Llama 4 Scout ve Llama 3 modellerini yapılandırın
---

# Cerebras

Bu sağlayıcı, Cerebras modellerini [Çıkarım API'leri](https://docs.cerebras.ai) (Inference API) aracılığıyla kullanmanıza olanak tanır.

Cerebras; Llama modelleri, DeepSeek ve daha fazlasını içeren çeşitli büyük dil modelleri için OpenAI uyumlu bir API sunar. Bunu, şu anda [OpenAI API](/docs/providers/openai/) sohbet uç noktalarını kullanan uygulamalar için doğrudan bir alternatif olarak kullanabilirsiniz.

## Kurulum

Cerebras platformundan bir API anahtarı oluşturun. Ardından `CEREBRAS_API_KEY` ortam değişkenini ayarlayın veya `apiKey` yapılandırma alanı aracılığıyla iletin.

```bash
export CEREBRAS_API_KEY=your_api_key_here
```

Veya yapılandırmanızda:

```yaml
providers:
  - id: cerebras:llama3.1-8b
    config:
      apiKey: your_api_key_here
```

## Sağlayıcı Formatı

Cerebras sağlayıcısı basit bir format kullanır:

- `cerebras:<model_adi>` - Tüm modeller için sohbet tamamlama (chat completion) arayüzünü kullanma

## Mevcut Modeller

Cerebras Çıkarım API'si resmi olarak şu modelleri destekler:

- `llama-4-scout-17b-16e-instruct` - 16 uzmanlı MoE içeren Llama 4 Scout 17B modeli
- `llama3.1-8b` - Llama 3.1 8B modeli
- `llama-3.3-70b` - Llama 3.3 70B modeli
- `deepSeek-r1-distill-llama-70B` (özel önizleme)

Mevcut modellerin güncel listesini almak için `/models` uç noktasını kullanın:

```bash
curl https://api.cerebras.ai/v1/models -H "Authorization: Bearer your_api_key_here"
```

## Parametreler

Sağlayıcı, standart OpenAI sohbet parametrelerini kabul eder:

- `temperature` - Rastgeleliği kontrol eder (0.0 - 1.5)
- `max_completion_tokens` - Oluşturulacak maksimum token sayısı
- `top_p` - Çekirdek örnekleme (nucleus sampling) parametresi
- `stop` - API'nin daha fazla token üretmeyi durduracağı diziler
- `seed` - Deterministik üretim için tohum değeri
- `response_format` - Model yanıtının formatını kontrol eder (örneğin, JSON çıktısı için)
- `logprobs` - Çıktı tokenlerinin log olasılıklarının döndürülüp döndürülmeyeceği

## Gelişmiş Yetenekler

### Yapılandırılmış Çıktılar (Structured Outputs)

Cerebras modelleri, yapay zeka tarafından oluşturulan yanıtlarınızın tutarlı ve öngörülebilir bir formatta olmasını sağlamak için JSON şeması zorlamalı yapılandırılmış çıktıları destekler. Bu, yapay zeka çıktılarını programlı olarak işleyebilen güvenilir uygulamalar oluşturmayı kolaylaştırır.

Yapılandırılmış çıktıları kullanmak için `response_format` parametresini bir JSON şeması içerecek şekilde ayarlayın:

```yaml
providers:
  - id: cerebras:llama-4-scout-17b-16e-instruct
    config:
      response_format:
        type: 'json_schema'
        json_schema:
          name: 'movie_schema'
          strict: true
          schema:
            type: 'object'
            properties:
              title: { 'type': 'string' }
              director: { 'type': 'string' }
              year: { 'type': 'integer' }
            required: ['title', 'director', 'year']
            additionalProperties: false
```

Alternatif olarak, `response_format` değerini `{"type": "json_object"}` olarak ayarlayarak basit JSON modunu kullanabilirsiniz.

### Araç Kullanımı (Tool Use)

Cerebras modelleri, LLM'lerin belirli görevleri programlı olarak yürütmesini sağlayan araç kullanımını (fonksiyon çağırma) destekler. Bu özelliği kullanmak için modelin kullanabileceği araçları tanımlayın:

```yaml
providers:
  - id: cerebras:llama-4-scout-17b-16e-instruct
    config:
      tools:
        - type: 'function'
          function:
            name: 'calculate'
            description: 'Temel aritmetik işlemleri yapabilen bir hesap makinesi'
            parameters:
              type: 'object'
              properties:
                expression:
                  type: 'string'
                  description: 'Hesaplanacak matematiksel ifade'
              required: ['expression']
            strict: true
```

Araç çağırmayı kullanırken, modelin yanıtını işlemeniz, yaptığı araç çağrılarını yönetmeniz ve ardından sonuçları nihai yanıt için modele geri sağlamanız gerekecektir.

## Yapılandırma Örneği

```yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: Cerebras model değerlendirmesi
prompts:
  - Sen {{topic}} konusunda bir uzmansın. {{question}} sorusunu basit terimlerle açıkla.
providers:
  - id: cerebras:llama3.1-8b
    config:
      temperature: 0.7
      max_completion_tokens: 1024
  - id: cerebras:llama-3.3-70b
    config:
      temperature: 0.7
      max_completion_tokens: 1024
tests:
  - vars:
      topic: kuantum bilişim
      question: Kuantum dolanıklığını basit terimlerle açıkla
    assert:
      - type: contains-any
        value: ['dolanık', 'ilişkili', 'kuantum durumu']
  - vars:
      topic: makine öğrenimi
      question: Gözetimli ve gözetimsiz öğrenme arasındaki fark nedir?
    assert:
      - type: contains
        value: 'etiketlenmiş veri'
```

## Ayrıca Bakınız

- [OpenAI Sağlayıcısı](/docs/providers/openai) - Cerebras tarafından kullanılan uyumlu API formatı
- [Yapılandırma Referansı](/docs/configuration/reference.md) - Sağlayıcılar için tam yapılandırma seçenekleri
- [Cerebras API Belgeleri](https://docs.cerebras.ai) - Resmi API referansı
- [Cerebras Yapılandırılmış Çıktılar Klavuzu](https://docs.cerebras.ai/capabilities/structured-outputs/) - JSON şeması zorlaması hakkında daha fazla bilgi edinin
- [Cerebras Araç Kullanımı Klavuzu](https://docs.cerebras.ai/capabilities/tool-use/) - Araç çağırma yetenekleri hakkında daha fazla bilgi edinin
