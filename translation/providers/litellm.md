---
sidebar_label: LiteLLM
title: LiteLLM Sağlayıcısı - Birleşik API ile 400'den Fazla LLM'e Erişin
description: Birleşik bir OpenAI uyumlu arayüz üzerinden 400'den fazla dil modelini değerlendirmek için promptfoo ile LiteLLM kullanın. Sohbet, tamamlama ve gömme modellerini destekler.
keywords:
  [
    litellm,
    llm sağlayıcısı,
    openai uyumlu,
    dil modelleri,
    yapay zeka değerlendirmesi,
    gpt-4,
    claude,
    gemini,
    llama,
    mistral,
    gömmeler,
    promptfoo,
  ]
---

# LiteLLM

[LiteLLM](https://docs.litellm.ai/docs/), birleşik bir OpenAI uyumlu arayüz üzerinden 400'den fazla LLM'e erişim sağlar.

## Kullanım

LiteLLM'i promptfoo ile üç şekilde kullanabilirsiniz:

### 1. Özel LiteLLM sağlayıcısı

LiteLLM sağlayıcısı sohbet (chat), tamamlama (completion) ve gömme (embedding) modellerini destekler.

#### Sohbet modelleri (varsayılan)

```yaml
providers:
  - id: litellm:<model adi>
  # veya açıkça:
  - id: litellm:chat:<model adi>
```

Örnek:

```yaml
providers:
  - id: litellm:gpt-5-mini
  # veya
  - id: litellm:chat:gpt-5-mini
```

#### Tamamlama (Completion) modelleri

```yaml
providers:
  - id: litellm:completion:<model adi>
```

#### Gömme (Embedding) modelleri

```yaml
providers:
  - id: litellm:embedding:<model adi>
```

Örnek:

```yaml
providers:
  - id: litellm:embedding:text-embedding-3-large
```

### 2. LiteLLM proxy sunucusu ile kullanma

Eğer bir LiteLLM proxy sunucusu çalıştırıyorsanız:

```yaml
providers:
  - id: litellm:gpt-5-mini # LITELLM_API_KEY ortam değişkenini kullanır
    config:
      apiBaseUrl: http://localhost:4000
      # apiKey: "{{ env.LITELLM_API_KEY }}"  # isteğe bağlı, otomatik algılanır
```

### 3. OpenAI sağlayıcısını LiteLLM ile kullanma

LiteLLM OpenAI formatını kullandığı için OpenAI sağlayıcısını da kullanabilirsiniz:

```yaml
providers:
  - id: openai:chat:gpt-5-mini # LITELLM_API_KEY ortam değişkenini kullanır
    config:
      apiBaseUrl: http://localhost:4000
      # apiKey: "{{ env.LITELLM_API_KEY }}"  # isteğe bağlı, otomatik algılanır
```

## Yapılandırma

### Temel yapılandırma

```yaml
providers:
  - id: litellm:gpt-5.1-mini # OPENAI_API_KEY ortam değişkenini kullanır
    config:
      # apiKey: "{{ env.OPENAI_API_KEY }}"  # isteğe bağlı, otomatik algılanır
      temperature: 0.7
      max_tokens: 1000
```

### Gelişmiş yapılandırma

Tüm LiteLLM parametreleri desteklenir:

```yaml
providers:
  - id: litellm:claude-4-sonnet # ANTHROPIC_API_KEY ortam değişkenini kullanır
    config:
      # apiKey: "{{ env.ANTHROPIC_API_KEY }}"  # isteğe bağlı, otomatik algılanır
      temperature: 0.7
      max_tokens: 4096
      top_p: 0.9
      # Diğer tüm LiteLLM destekli parametreler
```

## Ortam Değişkenleri

LiteLLM sağlayıcısı standart ortam değişkenlerini dikkate alır:

- `LITELLM_API_KEY` - LiteLLM proxy sunucusu için API anahtarı
- `LITELLM_API_BASE` - LiteLLM proxy sunucusu için temel URL (varsayılan: `http://0.0.0.0:4000`)
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `AZURE_API_KEY`
- Sağlayıcıya özel diğer ortam değişkenleri

## Gömme (Embedding) Yapılandırması

LiteLLM; benzerlik metrikleri ve diğer görevler için kullanılabilecek gömme modellerini destekler. Bir gömme sağlayıcısını küresel olarak veya bireysel iddialar (assertions) için belirtebilirsiniz.

### 1. Tüm testler için varsayılan bir gömme sağlayıcısı ayarlayın

```yaml
defaultTest:
  options:
    provider:
      embedding:
        id: litellm:embedding:text-embedding-3-large
```

### 2. Belirli bir iddia için gömme sağlayıcısını geçersiz kılın

```yaml
assert:
  - type: similar
    value: Referans metin
    provider:
      id: litellm:embedding:text-embedding-3-large
```

Gerekirse `config` bloğu aracılığıyla ek yapılandırma seçenekleri iletilebilir:

```yaml
defaultTest:
  options:
    provider:
      embedding:
        id: litellm:embedding:text-embedding-3-large # OPENAI_API_KEY ortam değişkenini kullanır
        config:
          # apiKey: "{{ env.OPENAI_API_KEY }}"  # isteğe bağlı, otomatik algılanır
```

## Eksiksiz Örnek

İşte birden fazla LiteLLM modeli kullanan eksiksiz bir örnek:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: LiteLLM değerlendirme örneği

providers:
  # Sohbet modelleri
  - id: litellm:gpt-5-mini
  - id: litellm:claude-sonnet-4-5 # ANTHROPIC_API_KEY ortam değişkenini kullanır
    # config:
    # apiKey: "{{ env.ANTHROPIC_API_KEY }}"  # isteğe bağlı, otomatik algılanır

  # Benzerlik kontrolleri için gömme modeli
  - id: litellm:embedding:text-embedding-3-large

prompts:
  - 'Bunu {{language}} diline çevir: {{text}}'

tests:
  - vars:
      language: Fransızca
      text: 'Hello, world!'
    assert:
      - type: contains
        value: 'Bonjour'
      - type: similar
        value: 'Bonjour, le monde!'
        threshold: 0.8
        provider: litellm:embedding:text-embedding-3-large
```

## Desteklenen Modeller

LiteLLM tüm ana sağlayıcıların modellerini destekler:

- **OpenAI**: GPT-4.1, GPT-4, GPT-3.5, gömmeler ve daha fazlası
- **Anthropic**: Claude 4, Claude 3.7, Claude 3.5, Claude 3 ve önceki modeller
- **Google**: Gemini ve PaLM modelleri
- **Meta**: Llama modelleri
- **Mistral**: Tüm Mistral modelleri
- **Ve 400'den fazla diğer model**

Desteklenen modellerin tam listesi için [LiteLLM model belgelerine](https://docs.litellm.ai/docs/providers) bakın.

## Desteklenen Parametreler

Tüm standart LiteLLM parametreleri iletilir:

- `temperature`
- `max_tokens`
- `top_p`
- `frequency_penalty`
- `presence_penalty`
- `stop`
- `response_format`
- `tools` / `functions`
- `seed`
- Sağlayıcıya özel parametreler

## İpuçları

1. **Model adlandırma**: LiteLLM belgelerinde belirtilen tam model adlarını kullanın
2. **API anahtarları**: Her sağlayıcı için uygun API anahtarlarını ayarlayın
3. **Proxy sunucusu**: Daha iyi kontrol için bir LiteLLM proxy sunucusu çalıştırmayı düşünün
4. **Hız sınırlama**: LiteLLM hız sınırlamasını (rate limiting) otomatik olarak halleder
5. **Maliyet takibi**: LiteLLM yerleşik maliyet takibi sağlar

## Sorun Giderme

Sorunlarla karşılaşırsanız:

1. API anahtarlarının doğru ayarlandığını doğrulayın
2. Model adının LiteLLM belgeleriyle eşleştiğini kontrol edin
3. LiteLLM proxy sunucusunun (kullanılıyorsa) erişilebilir olduğundan emin olun
4. LiteLLM belgelerindeki sağlayıcıya özel gereksinimleri inceleyin

## Ayrıca Bakınız

- [LiteLLM Belgeleri](https://docs.litellm.ai/docs/)
- [Sağlayıcı Yapılandırması](./index.md)
- [OpenAI Sağlayıcısı](./openai.md)
