---
sidebar_label: AI/ML API
description: "Tutarlı fiyatlandırma ve basitleştirilmiş entegrasyon ile AIML API'sinin birleşik arayüzü üzerinden 200'den fazla açık kaynaklı yapay zeka modeline erişin"
---

# AI/ML API

[AI/ML API](https://aimlapi.com), OpenAI, Anthropic, Google, Meta ve daha fazlasından son teknoloji modeller dahil olmak üzere OpenAI uyumlu birleşik bir arayüz aracılığıyla 300'den fazla yapay zeka modeline erişim sağlar.

## OpenAI Uyumluluğu

AI/ML API'sinin uç noktaları OpenAI'ın API'si ile uyumludur, bu da [OpenAI sağlayıcısında](/docs/providers/openai/) bulunan tüm parametrelerin AI/ML API ile çalıştığı anlamına gelir.

## Kurulum

AI/ML API'yi kullanmak için `AIML_API_KEY` ortam değişkenini ayarlamanız veya sağlayıcı yapılandırmasında `apiKey` belirtmeniz gerekir.

Ortam değişkenini ayarlama örneği:

```sh
export AIML_API_KEY=your_api_key_here
```

API anahtarınızı [aimlapi.com](https://aimlapi.com/app/?utm_source=promptfoo&utm_medium=github&utm_campaign=integration) adresinden alın.

## Sağlayıcı Formatları

### Sohbet Modelleri (Chat Models)

```
aimlapi:chat:<model_name>
```

### Tamamlama Modelleri (Completion Models)

```
aimlapi:completion:<model_name>
```

### Gömme Modelleri (Embedding Models)

```
aimlapi:embedding:<model_name>
```

### Kısa Format (Shorthand Format)

Sohbet moduna varsayılan olarak geçmek için türü atlayabilirsiniz:

```
aimlapi:<model_name>
```

## Yapılandırma

Sağlayıcıyı promptfoo yapılandırma dosyanızda yapılandırın:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: aimlapi:chat:deepseek-r1
    config:
      temperature: 0.7
      max_tokens: 2000
      apiKey: ... # isteğe bağlı, ortam değişkenini geçersiz kılar
```

### Yapılandırma Seçenekleri

Tüm standart OpenAI parametreleri desteklenir:

| Parametre           | Açıklama                                     |
| ------------------- | -------------------------------------------- |
| `apiKey`            | AI/ML API anahtarınız                        |
| `temperature`       | Rastgeleliği kontrol eder (0.0 - 2.0)        |
| `max_tokens`        | Oluşturulacak maksimum token sayısı          |
| `top_p`             | Çekirdek örnekleme parametresi               |
| `frequency_penalty` | Sık kullanılan tokenleri cezalandırır        |
| `presence_penalty`  | Varlığa bağlı olarak yeni tokenleri cezalandırır |
| `stop`              | API'nin oluşturmayı durduracağı diziler      |
| `stream`            | Akış yanıtlarını etkinleştir                 |

## Popüler Modeller

AI/ML API, birden fazla sağlayıcıdan modeller sunar. Kategorilere göre en popüler modellerden bazıları şunlardır:

### Akıl Yürütme Modelleri (Reasoning Models)

- **DeepSeek R1**: `deepseek-r1` - Düşünce zinciri yetenekleriyle gelişmiş akıl yürütme
- **OpenAI o3 Mini**: `openai/o3-mini` - Verimli akıl yürütme modeli
- **OpenAI o4 Mini**: `openai/o4-mini` - En yeni kompakt akıl yürütme modeli
- **QwQ-32B**: `qwen/qwq-32b` - Alibaba'ın akıl yürütme modeli

### Gelişmiş Dil Modelleri (Advanced Language Models)

- **GPT-4.1**: `openai/gpt-5` - 1M token bağlamına sahip en yeni GPT
- **GPT-4.1 Mini**: `gpt-5-mini` - Karşılaştırılabilir performansla GPT-4o'dan %83 daha ucuz
- **Claude 4 Sonnet**: `anthropic/claude-4-sonnet` - Dengeli hız ve yetenek
- **Claude 4 Opus**: `anthropic/claude-4-opus` - Claude 4 Opus modeli
- **Gemini 2.5 Pro**: `google/gemini-2.5-pro-preview` - Google'ın çok yönlü çok modlu modeli
- **Gemini 2.5 Flash**: `google/gemini-2.5-flash` - Ultra hızlı akış yanıtları
- **Grok 3 Beta**: `x-ai/grok-3-beta` - xAI'ın en gelişmiş modeli

### Açık Kaynaklı Modeller (Open Source Models)

- **DeepSeek V3**: `deepseek-v3` - Güçlü açık kaynak alternatifi
- **Llama 4 Maverick**: `meta-llama/llama-4-maverick` - En yeni Llama modeli
- **Qwen Max**: `qwen/qwen-max-2025-01-25` - Alibaba'nın verimli MoE modeli
- **Mistral Codestral**: `mistral/codestral-2501` - Kodlama için özelleştirilmiş

### Gömme Modelleri (Embedding Models)

- **Text Embedding 3 Large**: `text-embedding-3-large` - OpenAI'ın en yeni gömme modeli
- **Voyage Large 2**: `voyage-large-2` - Yüksek kaliteli gömmeler
- **BGE M3**: `bge-m3` - Çok dilli gömmeler

Mevcut tüm 300+ modelin tam listesi için [AI/ML API Modeller sayfasını](https://aimlapi.com/models?utm_source=promptfoo&utm_medium=github&utm_campaign=integration) ziyaret edin.

## Yapılandırma Örnekleri

### Temel Örnek

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - aimlapi:chat:deepseek-r1
  - aimlapi:chat:gpt-5-mini
  - aimlapi:chat:claude-4-sonnet

prompts:
  - '{{concept}} kavramını basit terimlerle açıkla'

tests:
  - vars:
      concept: 'kuantum bilişim'
    assert:
      - type: contains
        value: 'qubit'
```

### Birden Fazla Modelle Gelişmiş Yapılandırma

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  # Düşük sıcaklığa sahip akıl yürütme modeli
  - id: aimlapi:chat:deepseek-r1
    label: 'DeepSeek R1 (Reasoning)'
    config:
      temperature: 0.1
      max_tokens: 4000

  # Genel amaçlı model
  - id: aimlapi:chat:openai/gpt-5
    label: 'GPT-4.1'
    config:
      temperature: 0.7
      max_tokens: 2000

  # Hızlı, uygun maliyetli model
  - id: aimlapi:chat:gemini-2.5-flash
    label: 'Gemini 2.5 Flash'
    config:
      temperature: 0.5
      stream: true

prompts:
  - file://prompts/coding_task.txt

tests:
  - vars:
      task: 'Python'da bir ikili arama ağacı uygula'
    assert:
      - type: python
        value: |
          # Kodun geçerli bir Python olduğunu doğrulayın
          import ast
          try:
            ast.parse(output)
            return True
          except:
            return False
      - type: llm-rubric
        value: 'Kod insert, search ve delete yöntemlerini içermelidir'
```

### Gömme Örneği

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: aimlapi:embedding:text-embedding-3-large
    config:
      dimensions: 3072 # İsteğe bağlı: gömme boyutlarını azaltın

prompts:
  - '{{text}}'

tests:
  - vars:
      text: 'Hızlı kahverengi tilki tembel köpeğin üzerinden atlar'
    assert:
      - type: is-valid-embedding
      - type: embedding-dimension
        value: 3072
```

### JSON Modu Örneği

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: aimlapi:chat:gpt-5
    config:
      response_format: { type: 'json_object' }
      temperature: 0.0

prompts:
  - |
    Metindeki aşağıdaki bilgileri çıkarın ve JSON olarak döndürün:
    - name
    - age
    - occupation

    Text: {{text}}

tests:
  - vars:
      text: 'John Smith 35 yaşında bir yazılım mühendisidir'
    assert:
      - type: is-json
      - type: javascript
        value: |
          const data = JSON.parse(output);
          return data.name === 'John Smith' && 
                 data.age === 35 && 
                 data.occupation === 'yazılım mühendisi';
```

## Başlarken

Kurulumunuzu çalışan örneklerle test edin:

```bash
npx promptfoo@latest init --example provider-aiml-api
```

Bu, birden fazla modeli karşılaştırma, akıl yürütme yeteneklerini değerlendirme ve yanıt kalitesini ölçme için test edilmiş yapılandırmaları içerir.

## Notlar

- **API Anahtarı Gerekli**: API anahtarınızı almak için [aimlapi.com](https://aimlapi.com) adresinden kaydolun
- **Ücretsiz Krediler**: Yeni kullanıcılar platformu keşfetmek için ücretsiz krediler alır
- **Hız Limitleri**: Abonelik katmanına göre değişir
- **Model Güncellemeleri**: Yeni modeller düzenli olarak eklenir - en yeni eklemeler için [modeller sayfasını](https://aimlapi.com/models) kontrol edin
- **Birleşik Faturalandırma**: Tüm modeller için tek bir hesap üzerinden ödeme yapın

Detaylı fiyatlandırma bilgisi için [aimlapi.com/pricing](https://aimlapi.com/pricing) adresini ziyaret edin.
