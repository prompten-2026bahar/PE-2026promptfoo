---
sidebar_label: Cloudflare Workers AI
description: Düşük gecikmeli LLM testi ve ağ kenarında değerlendirme için OpenAI uyumlu API'leri kullanarak Cloudflare Workers AI'nın kenar tabanlı çıkarım platformunu Mistral-7B ile yapılandırın
---

# Cloudflare Workers AI

Bu sağlayıcı, kullanıcıya daha yakın bir konumda düşük gecikmeli yanıtlar için yapay zeka modelleri çalıştıran sunucusuz bir kenar çıkarım (edge inference) platformu olan Cloudflare Workers AI tarafından sağlanan [modelleri](https://developers.cloudflare.com/workers-ai/models/) destekler.

Sağlayıcı, Cloudflare'in OpenAI uyumlu API uç noktalarını kullanır; bu da OpenAI ve Cloudflare AI arasında geçiş yapmayı veya bunları birbirinin yerine kullanmayı kolaylaştırır.

## Gerekli Yapılandırma

Cloudflare hesap kimliğinizi (account ID) ve API anahtarınızı ortam değişkenleri olarak ayarlayın:

```sh
export CLOUDFLARE_ACCOUNT_ID=your_account_id_here
export CLOUDFLARE_API_KEY=your_api_key_here
```

Cloudflare hesap kimliği gizli değildir ve promptfoo yapılandırma dosyanıza dahil edilebilir. API anahtarı gizlidir, bu nedenle yapılandırma dosyalarına doğrudan yazmak yerine ortam değişkenlerini kullanın.

```yaml title="promptfooconfig.yaml"
prompts:
  - {{topic}} hakkında komik bir şaka anlat

providers:
  - id: cloudflare-ai:chat:@cf/openai/gpt-oss-120b
    config:
      accountId: your_account_id_here
      # API anahtarı CLOUDFLARE_API_KEY ortam değişkeninden yüklenir

tests:
  - vars:
      topic: programlama
    assert:
      - type: icontains
        value: '{{topic}}'
```

### Alternatif Ortam Değişkeni Adları

`apiKeyEnvar` ve `accountIdEnvar` ile özel ortam değişkeni adlarını kullanın:

```yaml
providers:
  - id: cloudflare-ai:chat:@cf/qwen/qwen2.5-coder-32b-instruct
    config:
      accountId: your_account_id_here
      apiKeyEnvar: CUSTOM_CLOUDFLARE_KEY
      accountIdEnvar: CUSTOM_CLOUDFLARE_ACCOUNT
```

## OpenAI Uyumluluğu

Bu sağlayıcı Cloudflare'in OpenAI uyumlu uç noktalarından yararlanır:

- **Sohbet tamamlamaları (Chat completions)**: `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1/chat/completions`
- **Metin tamamlamaları (Text completions)**: `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1/completions`
- **Gömme (Embeddings)**: `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1/embeddings`

Tüm standart OpenAI parametreleri Cloudflare AI modelleriyle çalışır: `temperature`, `max_tokens`, `top_p`, `frequency_penalty` ve `presence_penalty`. Birçok yeni model ayrıca fonksiyon çağırma (function calling), toplu işlem (batch processing) ve çok modlu girişler (multimodal inputs) gibi gelişmiş özellikleri de destekler.

## Sağlayıcı Türleri

Cloudflare AI sağlayıcısı üç farklı sağlayıcı türünü destekler:

### Sohbet Tamamlama (Chat Completion)

Sohbet tabanlı yapay zeka ve talimat izleyen modeller için:

```yaml
providers:
  - cloudflare-ai:chat:@cf/openai/gpt-oss-120b
  - cloudflare-ai:chat:@cf/meta/llama-4-scout-17b-16e-instruct
  - cloudflare-ai:chat:@cf/mistralai/mistral-small-3.1-24b-instruct
```

### Metin Tamamlama (Text Completion)

Tamamlama tarzı görevler için:

```yaml
providers:
  - cloudflare-ai:completion:@cf/qwen/qwen2.5-coder-32b-instruct
  - cloudflare-ai:completion:@cf/microsoft/phi-2
```

### Gömme (Embeddings)

Metin gömmeleri oluşturmak için:

```yaml
providers:
  - cloudflare-ai:embedding:@cf/google/embeddinggemma-300m
  - cloudflare-ai:embedding:@cf/baai/bge-large-en-v1.5
```

## Güncel Model Örnekleri

Cloudflare Workers AI'da mevcut olan en yeni modellerden bazıları şunlardır:

### Son Teknoloji Modeller (2025)

**En Yeni OpenAI Modelleri:**

- `@cf/openai/gpt-oss-120b` - OpenAI'ın üretim hazırlığı olan, genel amaçlı, yüksek akıl yürütme yeteneğine sahip modeli
- `@cf/openai/gpt-oss-20b` - Özel kullanım durumları için OpenAI'ın daha düşük gecikmeli modeli

**Gelişmiş Çok Modlu (Multimodal) Modeller:**

- `@cf/meta/llama-4-scout-17b-16e-instruct` - Meta'nın yerel çok modlu yeteneklere ve MoE mimarisine sahip Llama 4 Scout modeli
- `@cf/meta/llama-3.3-70b-instruct-fp8-fast` - fp8 kuantizasyonu ile hız için optimize edilmiş Llama 3.3 70B modeli
- `@cf/meta/llama-3.2-11b-vision-instruct` - Görsel tanıma ve görüntü akıl yürütme için optimize edilmiştir

**Gelişmiş Akıl Yürütme ve Problem Çözme:**

- `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b` - DeepSeek R1'den distile edilmiş gelişmiş akıl yürütme modeli
- `@cf/qwen/qwq-32b` - o1-mini ile rekabet edebilen orta ölçekli akıl yürütme modeli

**Kod Üretimi:**

- `@cf/qwen/qwen2.5-coder-32b-instruct` - Mevcut en iyi açık kaynaklı kod modeli

**Gelişmiş Dil Modelleri:**

- `@cf/mistralai/mistral-small-3.1-24b-instruct` - Gelişmiş görsel anlama ve 128K bağlama sahip MistralAI modeli
- `@cf/google/gemma-3-12b-it` - 128K bağlam ve çok dilli desteğe sahip en yeni Gemma modeli
- `@hf/nousresearch/hermes-2-pro-mistral-7b` - Fonksiyon çağırma ve JSON modu desteği

**Yüksek Kaliteli Gömmeler (Embeddings):**

- `@cf/google/embeddinggemma-300m` - Google'ın 100'den fazla dilde eğitilmiş son teknoloji gömme modeli

:::tip

Cloudflare sürekli yeni modeller eklemektedir. Mevcut modellerin tam listesi için [resmi model kataloğuna](https://developers.cloudflare.com/workers-ai/models/) bakın.

:::

## Yapılandırma Örnekleri

### Temel Sohbet Yapılandırması

```yaml title="promptfooconfig.yaml"
providers:
  - id: cloudflare-ai:chat:@cf/deepseek-ai/deepseek-r1-distill-qwen-32b
    config:
      accountId: your_account_id_here
      temperature: 0.7
      max_tokens: 1000
```

### Birden Fazla Modelle Gelişmiş Yapılandırma

```yaml title="promptfooconfig.yaml"
providers:
  - id: cloudflare-ai:chat:@cf/meta/llama-4-scout-17b-16e-instruct
    config:
      accountId: your_account_id_here
      temperature: 0.8
      max_tokens: 500
      top_p: 0.9
      frequency_penalty: 0.1
      presence_penalty: 0.1

  - id: cloudflare-ai:completion:@cf/qwen/qwen2.5-coder-32b-instruct
    config:
      accountId: your_account_id_here
      temperature: 0.2
      max_tokens: 2000
```

### Gömme Yapılandırması

```yaml title="promptfooconfig.yaml"
providers:
  - id: cloudflare-ai:embedding:@cf/google/embeddinggemma-300m
    config:
      accountId: your_account_id_here
```

## Özel API Temel URL'si

Özel dağıtımlar veya belirli bölgeler için varsayılan API temel URL'sini geçersiz kılın:

```yaml
providers:
  - id: cloudflare-ai:chat:@cf/openai/gpt-oss-120b
    config:
      accountId: your_account_id_here
      apiBaseUrl: https://api.cloudflare.com/client/v4/accounts/your_account_id/ai/v1
```

## Ayrıca Bakınız

- [Cloudflare Workers AI Modelleri](https://developers.cloudflare.com/workers-ai/models/) - Tam model kataloğu
- [Cloudflare Workers AI OpenAI Uyumluluğu](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/) - OpenAI uyumlu uç noktalar
- [OpenAI Sağlayıcısı](./openai.md) - OpenAI modelleriyle karşılaştırma için
- [Promptfoo'ya Başlarken](../getting-started.md) - Temel kurulum klavuzu
