---
title: GitHub Models Sağlayıcısı
description: 'Birleşik OpenAI uyumlu formatlama ile OpenAI, Anthropic, Google ve xAI modellerine erişmek için GitHub Models API'sini kullanın'
keywords:
  [github models, llm sağlayıcıları, openai, anthropic, claude, gemini, grok, deepseek, ai modelleri]
sidebar_label: GitHub Models
---

# GitHub Models

[GitHub Models](https://github.com/marketplace/models/), birleşik bir API arayüzü üzerinden OpenAI, Anthropic, Google ve xAI'den endüstri lideri yapay zeka modellerine erişim sağlar.

GitHub Models sağlayıcısı, OpenAI uyumlu API formatını kullandığı için [OpenAI sağlayıcısı](/docs/providers/openai/) tarafından sunulan tüm seçeneklerle uyumludur.

## Temel Özellikler

- **Birleşik API**: Tek bir uç nokta üzerinden birden fazla sağlayıcının modellerine erişin
- **OpenAI uyumlu**: Tanıdık OpenAI SDK ve API kalıplarını kullanın
- **Kurumsallığa hazır**: Üretim amaçlı kullanım için tam desteklenen ve faturalandırılabilir
- **GitHub Actions desteği**: İş akışlarında doğrudan GITHUB_TOKEN kullanın

## Kimlik Doğrulama

GitHub kişisel erişim jetonunuzu (PAT) `GITHUB_TOKEN` ortam değişkeni ile ayarlayın veya doğrudan yapılandırmada iletin:

```bash
export GITHUB_TOKEN=github_jetonunuz
```

## Mevcut Modeller

GitHub Models, çeşitli sağlayıcılardan endüstri lideri yapay zeka modellerine erişim sağlar. Modeller düzenli olarak güncellenir ve sık sık yenileri eklenir.

### Model Kategorileri

**Dil Modelleri**

- OpenAI GPT-4.1 serisi (gpt-5, gpt-5-mini, gpt-5-nano)
- OpenAI GPT-4o serisi (gpt-4o, gpt-5-mini)
- OpenAI akıl yürütme modelleri (o1-preview, o1-mini, o3-mini)
- Anthropic Claude serisi (claude-4-opus, claude-4-sonnet, claude-3.7-sonnet, claude-3.5-sonnet, claude-3.5-haiku)
- Google Gemini serisi (gemini-2.5-pro, gemini-2.5-flash, gemini-2.0-flash)
- Meta Llama serisi (llama-4-behemoth, llama-4-maverick, llama-4-scout, llama-3.3-70b-instruct)
- xAI Grok serisi (grok-4, grok-3, grok-3-mini)
- DeepSeek modelleri (deepseek-r1, deepseek-v3)

**Özel Modeller**

- Kod üretimi: Mistral Codestral modelleri
- Akıl Yürütme: DeepSeek-R1, Microsoft Phi-4 serisi, Grok-4 (256K bağlam)
- Çok modlu (Multimodal): Çeşitli sağlayıcılardan görme yeteneğine sahip modeller, Llama 4 serisi
- Hızlı çıkarım: Flash ve mini model varyantları
- Uzun bağlam: Llama 4 Scout (10M token), Llama 4 Maverick (1M token), Llama 4 Behemoth

Mevcut modellerin en güncel listesi için [GitHub Models pazar yeri (marketplace)](https://github.com/marketplace/models/) sayfasını ziyaret edin.

## Yapılandırma Örnekleri

### Temel Kullanım

```yaml
providers:
  - github:openai/gpt-5
```

### Yapılandırma ile

```yaml title="promptfooconfig.yaml"
providers:
  - id: github:anthropic/claude-4-opus # GITHUB_TOKEN ortam değişkenini kullanır
    config:
      temperature: 0.7
      max_tokens: 4096
      # apiKey: "{{ env.GITHUB_TOKEN }}"  # isteğe bağlı, otomatik algılanır
```

### Çoklu Modeller

```yaml title="promptfooconfig.yaml"
providers:
  - id: github-fast
    provider: github:openai/gpt-5-nano
    config:
      temperature: 0.5

  - id: github-balanced
    provider: github:openai/gpt-5-mini
    config:
      temperature: 0.6

  - id: github-smart
    provider: github:openai/gpt-5
    config:
      temperature: 0.7

  - id: github-multimodal
    provider: github:meta/llama-4-maverick
    config:
      temperature: 0.8

  - id: github-reasoning
    provider: github:xai/grok-4
    config:
      temperature: 0.7
```

## Model Seçim Kılavuzu

Modelleri özel ihtiyaçlarınıza göre seçin:

- **Genel Olarak En İyisi**: GPT-4.1 veya Claude 4 Opus - Üstün kodlama, talimat izleme ve uzun bağlam anlama
- **Hızlı ve Ucuz**: GPT-4.1-nano - Güçlü yetenekleri korurken en düşük gecikme ve maliyet
- **Dengeli**: GPT-4.1-mini veya Claude 4 Sonnet - Tam modellerden daha düşük maliyetle iyi performans
- **Genişletilmiş Bağlam**: Tüm kod tabanlarını veya birden fazla belgeyi işlemek için Llama 4 Scout (10M token)
- **Kod Üretimi**: Özel kod görevleri için Codestral serisi
- **Akıl Yürütme**: Karmaşık akıl yürütme görevleri için DeepSeek-R1, o-serisi modeller veya Grok-4
- **Uzun Bağlam**: Büyük belgeleri işlemek için genişletilmiş bağlam penceresine sahip modeller
- **Çok modlu (Multimodal)**: Llama 4 serisi dahil olmak üzere metin ve görüntü işleme için görme yeteneğine sahip modeller

Model yeteneklerini ve fiyatlandırmasını karşılaştırmak için [GitHub Models pazar yeri](https://github.com/marketplace/models/) sayfasını ziyaret edin.

## Kimlik Doğrulama ve Erişim

### Kimlik Doğrulama Yöntemleri

1. **Kişisel Erişim Jetonu (Personal Access Token - PAT)**
   - İnce ayarlı PAT'ler için `models:read` kapsamı (scope) gerektirir
   - `GITHUB_TOKEN` ortam değişkeni ile ayarlanır

2. **GitHub Actions**
   - İş akışlarında yerleşik `GITHUB_TOKEN` kullanın
   - Ek kurulum gerekmez

3. **Kendi Anahtarını Getir (Bring Your Own Key - BYOK)**
   - Diğer sağlayıcılardan gelen API anahtarlarını kullanın
   - Kullanım, sağlayıcı hesabınız üzerinden faturalandırılır

### Hız Sınırları ve Fiyatlandırma

Her modelin belirli hız sınırları ve fiyatlandırması vardır. Güncel detaylar için [GitHub Models belgelerine](https://docs.github.com/en/github-models) bakın.

## API Bilgileri

- **Temel URL**: `https://models.github.ai/inference`
- **Format**: OpenAI uyumlu API
- **Uç noktalar**: Standart sohbet tamamlamaları (chat completions) ve gömme (embeddings)

## Gelişmiş Özellikler

GitHub Models API şunları destekler:

- Akışlı (streaming) ve akışsız tamamlamalar
- Sıcaklık (temperature) kontrolü
- Durdurma dizileri (stop sequences)
- Tohum (seed) aracılığıyla deterministik örnekleme
- Sistem mesajları
- Fonksiyon çağırma (desteklenen modeller için)

## Model Adlandırma

Modellere `github:[model-id]` formatında erişilir; burada `model-id`, GitHub Models pazar yerinde kullanılan adlandırma kuralını takip eder:

- Standart format: `[vendor]/[model-name]`
- Microsoft modelleri: `azureml/[model-name]`
- İş ortağı modelleri: `azureml-[vendor]/[model-name]`

Örnekler:

- `github:openai/gpt-5`
- `github:openai/gpt-5-mini`
- `github:openai/gpt-5-nano`
- `github:anthropic/claude-4-opus`
- `github:anthropic/claude-4-sonnet`
- `github:google/gemini-2.5-pro`
- `github:xai/grok-4`
- `github:xai/grok-3`
- `github:meta/llama-4-behemoth`
- `github:meta/llama-4-scout`
- `github:meta/llama-4-maverick`
- `github:deepseek/deepseek-r1`
- `github:azureml/Phi-4`
- `github:azureml-mistral/Codestral-2501`

## Kod İçinde Örnek Kullanım

```javascript title="example.js"
import promptfoo from 'promptfoo';

// Temel kullanım
const results = await promptfoo.evaluate({
  providers: ['github:openai/gpt-5', 'github:anthropic/claude-4-opus'],
  prompts: ['{{task}} görevini gerçekleştiren bir fonksiyon yaz'],
  tests: [
    {
      vars: { task: 'bir diziyi tersine çevirme' },
      assert: [
        {
          type: 'contains',
          value: 'function',
        },
      ],
    },
  ],
});

// Özel modelleri kullanma
const specializedModels = await promptfoo.evaluate({
  providers: [
    'github:azureml-mistral/Codestral-2501', // Kod üretimi
    'github:deepseek/deepseek-r1', // Gelişmiş akıl yürütme
    'github:xai/grok-4', // Güçlü akıl yürütme ve analiz
    'github:meta/llama-4-scout', // Genişletilmiş bağlam (10M token)
  ],
  prompts: ['{{algorithm}} algoritmasını en uygun zaman karmaşıklığıyla uygula'],
  tests: [
    {
      vars: { algorithm: 'quicksort' },
      assert: [
        {
          type: 'javascript',
          value: 'output.includes("function") && output.includes("pivot")',
        },
      ],
    },
  ],
});
```

Belirli modeller ve yetenekleri hakkında daha fazla bilgi için [GitHub Models pazar yeri](https://github.com/marketplace/models/)ne bakın.

## Ayrıca Bakınız

- [OpenAI Sağlayıcısı](/docs/providers/openai/) - Benzer API formatına sahip uyumlu sağlayıcı
- [Yapılandırma Kılavuzu](/docs/configuration/guide) - Genel yapılandırma seçenekleri
- [Sağlayıcı Seçenekleri](/docs/providers/) - Mevcut tüm sağlayıcılara genel bakış
- [GitHub Models Belgeleri](https://docs.github.com/en/github-models) - Resmi GitHub Models belgeleri
