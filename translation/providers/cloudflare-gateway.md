---
sidebar_label: Cloudflare AI Gateway
sidebar_position: 47
description: Önbelleğe alma, hız sınırlama ve analitik için yapay zeka isteklerini Cloudflare AI Gateway üzerinden yönlendirin.
---

# Cloudflare AI Gateway

[Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/), yapay zeka sağlayıcılarına yapılan istekleri Cloudflare'in altyapısı üzerinden yönlendiren bir proxy hizmetidir. Şunları sağlar:

- **Önbelleğe Alma (Caching)** - Özdeş istekleri önbelleğe alarak maliyetleri düşürün
- **Hız Sınırlama (Rate limiting)** - Kota sorunlarını önlemek için istek hızlarını kontrol edin
- **Analitik** - Sağlayıcılar arası kullanımı ve maliyetleri takip edin
- **Günlük Kaydı (Logging)** - İstekleri ve yanıtları izleyin
- **Yedekleme (Fallback)** - Güvenilirlik için yedek sağlayıcılar yapılandırın

`cloudflare-gateway` sağlayıcısı, promptfoo değerlendirmelerinizi Cloudflare AI Gateway üzerinden desteklenen herhangi bir yapay zeka sağlayıcısına yönlendirmenize olanak tanır.

## Sağlayıcı Formatı

```
cloudflare-gateway:{provider}:{model}
```

**Örnekler:**

- `cloudflare-gateway:openai:gpt-5.2`
- `cloudflare-gateway:anthropic:claude-sonnet-4-5-20250929`
- `cloudflare-gateway:groq:llama-3.3-70b-versatile`

## Gerekli Yapılandırma

Cloudflare hesap kimliğinizi ve gateway kimliğinizi ayarlayın:

```sh
export CLOUDFLARE_ACCOUNT_ID=your_account_id_here
export CLOUDFLARE_GATEWAY_ID=your_gateway_id_here
```

### Sağlayıcı API Anahtarları

İstekleri yönlendirdiğiniz sağlayıcılar için API anahtarlarına ihtiyacınız vardır:

```sh
# OpenAI için
export OPENAI_API_KEY=your_openai_key

# Anthropic için
export ANTHROPIC_API_KEY=your_anthropic_key

# Groq için
export GROQ_API_KEY=your_groq_key
```

### BYOK (Kendi Anahtarını Getir) Kullanımı

Cloudflare'de [BYOK yapılandırdıysanız](https://developers.cloudflare.com/ai-gateway/configuration/byok/), sağlayıcı API anahtarlarını tamamen atlayabilirsiniz. Cloudflare, gateway yapılandırmanızda saklanan anahtarları kullanacaktır.

```yaml
providers:
  # OPENAI_API_KEY gerekmez - Cloudflare saklanan anahtarı kullanır
  - id: cloudflare-gateway:openai:gpt-5.2
    config:
      accountId: '{{env.CLOUDFLARE_ACCOUNT_ID}}'
      gatewayId: '{{env.CLOUDFLARE_GATEWAY_ID}}'
      cfAigToken: '{{env.CF_AIG_TOKEN}}'
```

:::note
BYOK en iyi OpenAI uyumlu sağlayıcılarla çalışır. Anthropic, SDK zorunlu kıldığı için bir API anahtarı gerektirir.
:::

### Kimlik Doğrulamalı Gateway'ler (Authenticated Gateways)

Gateway'inizde [Kimlik Doğrulamalı Gateway](https://developers.cloudflare.com/ai-gateway/configuration/authenticated-gateway/) etkinse, `cfAigToken` sağlamanız gerekir:

```sh
export CF_AIG_TOKEN=your_gateway_token_here
```

## Temel Kullanım

```yaml title="promptfooconfig.yaml"
prompts:
  - 'Bu soruyu cevapla: {{question}}'

providers:
  - id: cloudflare-gateway:openai:gpt-5.2
    config:
      accountId: '{{env.CLOUDFLARE_ACCOUNT_ID}}'
      gatewayId: '{{env.CLOUDFLARE_GATEWAY_ID}}'
      temperature: 0.7

tests:
  - vars:
      question: Fransa'nın başkenti neresidir?
```

## Desteklenen Sağlayıcılar

Cloudflare AI Gateway bu sağlayıcılara yönlendirmeyi destekler:

| Sağlayıcı         | Gateway Adı         | API Anahtarı Ortam Değişkeni |
| ----------------- | ------------------- | ---------------------------- |
| OpenAI           | `openai`            | `OPENAI_API_KEY`             |
| Anthropic        | `anthropic`         | `ANTHROPIC_API_KEY`          |
| Groq             | `groq`              | `GROQ_API_KEY`               |
| Perplexity       | `perplexity-ai`     | `PERPLEXITY_API_KEY`         |
| Google AI Studio | `google-ai-studio`  | `GOOGLE_API_KEY`             |
| Mistral          | `mistral`           | `MISTRAL_API_KEY`            |
| Cohere           | `cohere`            | `COHERE_API_KEY`             |
| Azure OpenAI     | `azure-openai`      | `AZURE_OPENAI_API_KEY`       |
| Workers AI       | `workers-ai`        | `CLOUDFLARE_API_KEY`         |
| Hugging Face     | `huggingface`       | `HUGGINGFACE_API_KEY`        |
| Replicate        | `replicate`         | `REPLICATE_API_KEY`          |
| Grok (xAI)       | `grok`              | `XAI_API_KEY`                |

:::note
AWS Bedrock, gateway proxy yaklaşımıyla uyumsuz olan AWS istek imzalama (request signing) gerektirdiği için Cloudflare AI Gateway üzerinden desteklenmez.
:::

## Yapılandırma Seçenekleri

### Gateway Yapılandırması

| Seçenek           | Tür    | Açıklama                                                                         |
| ----------------- | ------ | -------------------------------------------------------------------------------- |
| `accountId`       | string | Cloudflare hesap kimliği (account ID)                                            |
| `accountIdEnvar`  | string | Hesap kimliği için özel ortam değişkeni (varsayılan: `CLOUDFLARE_ACCOUNT_ID`)     |
| `gatewayId`       | string | AI Gateway kimliği (ID)                                                          |
| `gatewayIdEnvar`  | string | Gateway kimliği için özel ortam değişkeni (varsayılan: `CLOUDFLARE_GATEWAY_ID`)    |
| `cfAigToken`      | string | İsteğe bağlı gateway kimlik doğrulama jetonu (token)                             |
| `cfAigTokenEnvar` | string | Gateway jetonu için özel ortam değişkeni (varsayılan: `CF_AIG_TOKEN`)            |

### Azure OpenAI Yapılandırması

Azure OpenAI ek yapılandırma gerektirir:

| Seçenek          | Tür    | Açıklama                                          |
| ---------------- | ------ | ------------------------------------------------- |
| `resourceName`   | string | Azure OpenAI kaynak adı (gereklidir)              |
| `deploymentName` | string | Azure OpenAI dağıtım adı (gereklidir)            |
| `apiVersion`     | string | Azure API sürümü (varsayılan: `2024-12-01-preview`) |

```yaml
providers:
  - id: cloudflare-gateway:azure-openai:gpt-4
    config:
      accountId: '{{env.CLOUDFLARE_ACCOUNT_ID}}'
      gatewayId: '{{env.CLOUDFLARE_GATEWAY_ID}}'
      resourceName: my-azure-resource
      deploymentName: my-gpt4-deployment
      apiVersion: 2024-12-01-preview
```

### Workers AI Yapılandırması

Workers AI, istekleri Cloudflare'in kenar noktalarında dağıtılan modellere yönlendirir. Model adı URL yoluna dahil edilir:

```yaml
providers:
  - id: cloudflare-gateway:workers-ai:@cf/meta/llama-3.1-8b-instruct
    config:
      accountId: '{{env.CLOUDFLARE_ACCOUNT_ID}}'
      gatewayId: '{{env.CLOUDFLARE_GATEWAY_ID}}'
```

### Sağlayıcıya Özgü Seçenekler

Temel sağlayıcının tüm seçenekleri desteklenir. Örneğin, `cloudflare-gateway:openai:gpt-5.2` kullanırken herhangi bir [OpenAI sağlayıcı seçeneğini](/docs/providers/openai) kullanabilirsiniz.

```yaml
providers:
  - id: cloudflare-gateway:openai:gpt-5.2
    config:
      accountId: '{{env.CLOUDFLARE_ACCOUNT_ID}}'
      gatewayId: '{{env.CLOUDFLARE_GATEWAY_ID}}'
      temperature: 0.8
      max_tokens: 1000
      top_p: 0.9
```

## Örnekler

### Birden Fazla Sağlayıcı

Tamamı Cloudflare gateway'iniz üzerinden yönlendirilen farklı sağlayıcılardan gelen yanıtları karşılaştırın:

```yaml title="promptfooconfig.yaml"
prompts:
  - '{{topic}} kavramını basit terimlerle açıkla.'

providers:
  - id: cloudflare-gateway:openai:gpt-5.2
    config:
      accountId: '{{env.CLOUDFLARE_ACCOUNT_ID}}'
      gatewayId: '{{env.CLOUDFLARE_GATEWAY_ID}}'

  - id: cloudflare-gateway:anthropic:claude-sonnet-4-5-20250929
    config:
      accountId: '{{env.CLOUDFLARE_ACCOUNT_ID}}'
      gatewayId: '{{env.CLOUDFLARE_GATEWAY_ID}}'

  - id: cloudflare-gateway:groq:llama-3.3-70b-versatile
    config:
      accountId: '{{env.CLOUDFLARE_ACCOUNT_ID}}'
      gatewayId: '{{env.CLOUDFLARE_GATEWAY_ID}}'

tests:
  - vars:
      topic: kuantum bilişim
```

### Kimlik Doğrulamalı Gateway

AI Gateway'iniz kimlik doğrulama gerektiriyorsa:

```yaml
providers:
  - id: cloudflare-gateway:openai:gpt-5.2
    config:
      accountId: '{{env.CLOUDFLARE_ACCOUNT_ID}}'
      gatewayId: '{{env.CLOUDFLARE_GATEWAY_ID}}'
      cfAigToken: '{{env.CF_AIG_TOKEN}}'
```

### Özel Ortam Değişkenleri

Farklı projeler veya ortamlar için özel ortam değişkeni adları kullanın:

```yaml
providers:
  - id: cloudflare-gateway:openai:gpt-5.2
    config:
      accountIdEnvar: MY_CF_ACCOUNT
      gatewayIdEnvar: MY_CF_GATEWAY
      apiKeyEnvar: MY_OPENAI_KEY
```

## Gateway URL Yapısı

Sağlayıcı, gateway URL'sini şu formatta oluşturur:

```
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/{provider}
```

Örneğin, `accountId: abc123` ve `gatewayId: my-gateway` ile OpenAI'ya yapılan istekler şu yol üzerinden yönlendirilir:

```
https://gateway.ai.cloudflare.com/v1/abc123/my-gateway/openai
```

## AI Gateway Kullanmanın Faydaları

### Önbelleğe Alma Yoluyla Maliyet Azaltma

AI Gateway özdeş istekleri önbelleğe alabilir; aynı istemleri birden çok kez çalıştırdığınızda (geliştirme ve test sırasında yaygındır) maliyetleri düşürür.

### Birleşik Analitik

Tüm yapay zeka sağlayıcılarınızdaki kullanımı tek bir Cloudflare panelinde görüntüleyin, maliyetleri ve kullanım modellerini takip etmeyi kolaylaştırın.

### Hız Sınırı Koruması

AI Gateway, istekleri sıraya koyarak hız sınırlarını yönetmeye yardımcı olabilir ve değerlendirmelerinizin sağlayıcı hız sınırları nedeniyle başarısız olmasını önleyebilir.

### Günlük Kaydı ve Hata Ayıklama

Tüm istek ve yanıtlar Cloudflare'de günlüğe kaydedilir, bu da sorunları ayıklamayı ve yapay zeka kullanımını denetlemeyi kolaylaştırır.

## Ayrıca Bakınız

- [Cloudflare AI Gateway Belgeleri](https://developers.cloudflare.com/ai-gateway/)
- [Cloudflare Workers AI Sağlayıcısı](/docs/providers/cloudflare-ai) - Modelleri doğrudan Cloudflare'in kenar noktalarında çalıştırmak için
- [OpenAI Sağlayıcısı](/docs/providers/openai)
- [Anthropic Sağlayıcısı](/docs/providers/anthropic)
