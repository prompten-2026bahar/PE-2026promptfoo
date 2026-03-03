---
sidebar_label: DeepSeek
description: 64K bağlam pencereleri ve maliyet etkin LLM testi için gelişmiş önbelleğe alma özelliğine sahip, özel sohbet ve akıl yürütme modelleriyle DeepSeek'in OpenAI uyumlu API'sini yapılandırın
---

# DeepSeek

[DeepSeek](https://platform.deepseek.com/), dil modelleri için hem genel sohbet hem de gelişmiş akıl yürütme görevleri için özel modellerle birlikte OpenAI uyumlu bir API sağlar. DeepSeek sağlayıcısı, [OpenAI sağlayıcısı](/docs/providers/openai/) tarafından sunulan tüm seçeneklerle uyumludur.

## Kurulum

1. [DeepSeek Platformu](https://platform.deepseek.com/)'ndan bir API anahtarı alın
2. `DEEPSEEK_API_KEY` ortam değişkenini ayarlayın veya yapılandırmanızda `apiKey` belirtin

## Yapılandırma

Temel yapılandırma örneği:

```yaml
providers:
  - id: deepseek:deepseek-chat
    config:
      temperature: 0.7
      max_tokens: 4000
      apiKey: YOUR_DEEPSEEK_API_KEY

  - id: deepseek:deepseek-reasoner # DeepSeek-R1 modeli
    config:
      max_tokens: 8000
```

### Yapılandırma Seçenekleri

- `temperature`
- `max_tokens`
- `top_p`, `presence_penalty`, `frequency_penalty`
- `stream`
- `showThinking` - Akıl yürütme içeriğinin çıktıya dahil edilip edilmeyeceğini kontrol eder (varsayılan: `true`, deepseek-reasoner modeli için geçerlidir)

## Mevcut Modeller

:::note

API model adları, otomatik olarak en son sürümlere işaret eden takma adlardır: şu anda hem `deepseek-chat` hem de `deepseek-reasoner` DeepSeek-V3.2'yi işaret etmektedir; sohbet modeli düşünme modu kapalıyken, akıl yürütme (reasoner) modeli ise düşünme modu açıkken kullanılır.

:::

### deepseek-chat

- Konuşmalar ve içerik üretimi için genel amaçlı model
- 128K bağlam penceresi, 8K'ya kadar çıktı tokeni
- Giriş: 0,028 $/1M (önbellek isabeti), 0,28 $/1M (önbellek ıska)
- Çıktı: 0,42 $/1M

### deepseek-reasoner

- Genişletilmiş düşünme yeteneklerine sahip özel akıl yürütme modeli
- 128K bağlam penceresi, 64K'ya kadar çıktı tokeni (32K akıl yürütme + nihai yanıt)
- Giriş: 0,028 $/1M (önbellek isabeti), 0,28 $/1M (önbellek ıska)
- Çıktı: 0,42 $/1M
- `showThinking` parametresi aracılığıyla akıl yürütme içeriğinin gösterilmesini veya gizlenmesini destekler

:::warning

Akıl yürütme modeli `temperature`, `top_p`, `presence_penalty`, `frequency_penalty`, `logprobs` veya `top_logprobs` parametrelerini desteklemez. Bu parametrelerin ayarlanması hata tetiklemez ancak bir etkisi olmaz.

:::

## Örnek Kullanım

Akıl yürütme görevlerinde DeepSeek ve OpenAI'yi karşılaştıran bir örnek:

```yaml
providers:
  - id: deepseek:deepseek-reasoner
    config:
      max_tokens: 8000
      showThinking: true # Akıl yürütme içeriğini çıktıya dahil et (varsayılan)
  - id: openai:o-1
    config:
      temperature: 0.0

prompts:
  - 'Adım adım çöz: {{math_problem}}'

tests:
  - vars:
      math_problem: 'x^3 + 2x ifadesinin x'e göre türevi nedir?'
```

### Akıl Yürütme Çıktısını Kontrol Etme

DeepSeek-R1 modeli (deepseek-reasoner), çıktısında ayrıntılı akıl yürütme adımlarını içerir. Bu akıl yürütme içeriğinin gösterilip gösterilmeyeceğini `showThinking` parametresini kullanarak kontrol edebilirsiniz:

```yaml
providers:
  - id: deepseek:deepseek-reasoner
    config:
      showThinking: false # Akıl yürütme içeriğini çıktıdan gizle
```

`showThinking` değeri `true` (varsayılan) olarak ayarlandığında, çıktı hem akıl yürütmeyi hem de nihai yanıtı standart bir formatta içerir:

```
Akıl Yürütme: <akıl yürütme içeriği>

<nihai yanıt>
```

`false` olarak ayarlandığında, çıktıya yalnızca nihai yanıt dahil edilir. Bu, daha iyi akıl yürütme kalitesi istediğiniz ancak akıl yürütme sürecini son kullanıcılara göstermek veya iddialarınızda (assertions) kullanmak istemediğiniz durumlarda kullanışlıdır.

MMLU akıl yürütme görevlerinde OpenAI'nin o1 modeliyle karşılaştırmasını yapan [eksiksiz örneğimize](https://github.com/promptfoo/promptfoo/tree/main/examples/deepseek-r1-vs-openai-o1) bakın.

## API Detayları

- Temel URL: `https://api.deepseek.com/v1`
- OpenAI uyumlu API formatı
- Tam [API belgeleri](https://platform.deepseek.com/docs)

## Ayrıca Bakınız

- [OpenAI Sağlayıcısı](/docs/providers/openai/) - Uyumlu yapılandırma seçenekleri
- [Eksiksiz örnek](https://github.com/promptfoo/promptfoo/tree/main/examples/deepseek-r1-vs-openai-o1) - OpenAI'nin o1 modeliyle karşılaştırma
