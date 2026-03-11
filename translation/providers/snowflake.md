---
sidebar_label: Snowflake Cortex
description: Claude, GPT, Mistral ve Llama modellerine erişim sağlayan Snowflake Cortex'in OpenAI uyumlu REST API'si aracılığıyla yapay zeka modellerine bağlanın
---

# Snowflake Cortex

[Snowflake Cortex](https://docs.snowflake.com/en/user-guide/snowflake-cortex/overview), çeşitli LLM modellerine [OpenAI uyumlu](/docs/providers/openai/) bir REST API aracılığıyla erişim sağlayan Snowflake'in yapay zeka ve makine öğrenimi platformudur. Cortex; özel bir veri ambarına (warehouse) ihtiyaç duymadan Claude, GPT, Mistral ve Llama modelleri dahil olmak üzere sektör lideri LLM'leri sunar.

## Kurulum

1. Snowflake hesap tanımlayıcınızı alın (format: `kurumadi-hesapadi`)
2. Bir taşıyıcı token (JWT, OAuth veya programlı erişim token'ı) oluşturun
3. `SNOWFLAKE.CORTEX_USER` veritabanı rolüne sahip olduğunuzdan emin olun

## Sağlayıcı Formatı

Snowflake Cortex sağlayıcısı şu formatı kullanır:

- `snowflake:<model_adi>` - Belirtilen model adını kullanarak Snowflake Cortex'e bağlanır

## Yapılandırma

### Temel Yapılandırma

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: snowflake:mistral-large2
    config:
      accountIdentifier: 'kurumum-hesabim'
      apiKey: 'tasiyici-tokeniniz'
```

### Ortam Değişkenleri İle

Snowflake kimlik bilgilerinizi ortam değişkenleri olarak ayarlayın:

```bash
export SNOWFLAKE_ACCOUNT_IDENTIFIER="kurumum-hesabim"
export SNOWFLAKE_API_KEY="tasiyici-tokeniniz"
```

Ardından, kimlik bilgilerini belirtmeden sağlayıcıyı kullanın:

```yaml
providers:
  - id: snowflake:mistral-large2
```

### Ek Parametreler İle

Snowflake Cortex, OpenAI uyumlu parametreleri destekler:

```yaml
providers:
  - id: snowflake:mistral-large2
    config:
      accountIdentifier: 'kurumum-hesabim'
      apiKey: 'tasiyici-tokeniniz'
      temperature: 0.7
      max_tokens: 1024
      top_p: 0.9
```

### Özel Temel URL

Gerekirse varsayılan temel URL'yi geçersiz kılın:

```yaml
providers:
  - id: snowflake:claude-3-5-sonnet
    config:
      apiBaseUrl: 'https://ozel.snowflakecomputing.com'
      apiKey: 'tasiyici-tokeniniz'
```

## Özellikler

Snowflake Cortex şunları destekler:

- **Araç Çağırma (Tool Calling)** - Fonksiyon çağırma ve araç kullanımı
- **Yapılandırılmış Çıktı (Structured Output)** - JSON şeması doğrulaması
- **Akış (Streaming)** - Gerçek zamanlı token akışı (API üzerinden)
- **Görüntü Girişi** - Seçili modeller için görme yetenekleri
- **İçerik Filtreleme** - Yerleşik korumalar (guardrails)
- **Bölgeler Arası Çıkarım** - Snowflake bölgeleri genelinde kullanılabilen modeller

## Kimlik Doğrulama

Kimlik doğrulama, Authorization başlığındaki Taşıyıcı (Bearer) token'lar aracılığıyla işlenir. Snowflake Cortex birden fazla token türünü destekler:

- **JWT (JSON Web Token)** - Standart Snowflake kimlik doğrulaması
- **OAuth token'ları** - OAuth 2.0 kimlik doğrulama akışı
- **Programlı erişim token'ları** - Servis hesabı token'ları

## Örnek Yapılandırma

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: 'Snowflake Cortex modellerini karşılaştırın'

prompts:
  - '{{topic}} konusunu basit terimlerle açıklayın'

providers:
  - id: snowflake:claude-3-5-sonnet
    config:
      temperature: 0.7
      max_tokens: 1024
  - id: snowflake:mistral-large2
    config:
      temperature: 0.7
      max_tokens: 1024
  - id: snowflake:llama-3.1-70b
    config:
      temperature: 0.7
      max_tokens: 1024

tests:
  - vars:
      topic: kuantum hesaplama
    assert:
      - type: contains
        value: kuantum
```

## Ayrıca Bakınız

- [OpenAI Sağlayıcısı](/docs/providers/openai) - Snowflake Cortex tarafından kullanılan uyumlu API formatı
- [Yapılandırma Referansı](/docs/configuration/reference.md) - Sağlayıcılar için tüm yapılandırma seçenekleri
- [Snowflake Cortex Belgeleri](https://docs.snowflake.com/en/user-guide/snowflake-cortex/overview) - Resmi Cortex belgeleri
- [Snowflake Cortex REST API](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-rest-api) - REST API referansı
