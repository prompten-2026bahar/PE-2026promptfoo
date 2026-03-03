---
sidebar_label: TrueFoundry
description: Birleşik bir API aracılığıyla kurumsal düzeyde güvenlik, gözlemlenebilirlik ve yönetim ile 1000'den fazla LLM'e erişmek için TrueFoundry'nin LLM Ağ Geçidini yapılandırın
---

# TrueFoundry

[TrueFoundry](https://www.truefoundry.com/ai-gateway), kurumsal düzeyde güvenlik, gözlemlenebilirlik ve yönetim ile tek bir API üzerinden 1000'den fazla LLM'e birleşik erişim sağlayan bir LLM ağ geçididir. TrueFoundry'nin ağ geçidi OpenAI uyumludur ve test ve değerlendirme için promptfoo ile sorunsuz bir şekilde entegre olur.

TrueFoundry sağlayıcısı şunları destekler:

- Birden fazla LLM sağlayıcısından (OpenAI, Anthropic, Google Gemini, Groq, Mistral ve daha fazlası) sohbet tamamlamaları
- Gömmeler (Embeddings)
- Araç kullanımı ve fonksiyon çağırma
- Gelişmiş yetenekler için MCP (Model Context Protocol) sunucuları
- Özel meta veriler ve günlük kaydı yapılandırması
- Gerçek zamanlı gözlemlenebilirlik ve izleme

## Kurulum

TrueFoundry'yi kullanmak için API anahtarınızı ayarlamanız gerekir:

1. Bir TrueFoundry hesabı oluşturun ve [TrueFoundry Konsolu](https://www.truefoundry.com/)'ndan bir API anahtarı alın.
2. `TRUEFOUNDRY_API_KEY` ortam değişkenini ayarlayın:

```sh
export TRUEFOUNDRY_API_KEY=your_api_key_here
```

Alternatif olarak, sağlayıcı yapılandırmasında `apiKey` belirtebilirsiniz (aşağıya bakın).

## Yapılandırma

TrueFoundry sağlayıcısını promptfoo yapılandırma dosyanızda yapılandırın. Model adı `provider-account/model-name` formatını izlemelidir (örneğin, `openai-main/gpt-5`):

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: truefoundry:openai-main/gpt-5
    config:
      temperature: 0.7
      max_completion_tokens: 100
prompts:
  - {{topic}} hakkında komik bir tweet yaz
tests:
  - vars:
      topic: kediler
  - vars:
      topic: köpekler
```

**Not**: Model tanımlayıcı formatı `provider-account/model-name` şeklindedir. `provider-account`, TrueFoundry'deki sağlayıcı entegrasyonunuzun adıdır (örneğin, `openai-main`, `anthropic-main`). Mevcut modelleri TrueFoundry LLM Playground kullanıcı arayüzünde bulabilirsiniz.

### Temel Yapılandırma Seçenekleri

TrueFoundry sağlayıcısı tüm standart OpenAI yapılandırma seçeneklerini destekler:

- `temperature`: Çıktıdaki rastgeleliği 0 ile 2 arasında kontrol eder
- `max_tokens`: Oluşturulacak maksimum token sayısı
- `max_completion_tokens`: Sohbet tamamlamasında oluşturulabilecek maksimum token sayısı
- `top_p`: Çekirdek örnekleme kullanarak sıcaklık örneklemesine alternatif
- `presence_penalty`: -2.0 ile 2.0 arası sayı. Pozitif değerler, şimdiye kadar metinde görünüp görünmediklerine bağlı olarak yeni tokenleri cezalandırır
- `frequency_penalty`: -2.0 ile 2.0 arası sayı. Pozitif değerler, şimdiye kadar metindeki mevcut frekanslarına bağlı olarak yeni tokenleri cezalandırır
- `stop`: API'nin daha fazla token üretmeyi durduracağı 4 adede kadar dizi
- `response_format`: Modelin çıktı vermesi gereken formatı belirten nesne (örneğin, JSON modu)
- `seed`: Belirlenimci örnekleme için (en iyi çaba)

### Özel API Temel URL'si

Kendi kendine barındırılan veya kurumsal dağıtımlar için özel bir API temel URL'si belirtebilirsiniz:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: truefoundry:openai-main/gpt-5
    config:
      apiBaseUrl: 'https://your-custom-gateway.example.com'
      temperature: 0.7
```

Belirtilmezse, varsayılan URL olan `https://llm-gateway.truefoundry.com` kullanılır.

### TrueFoundry'ye Özgü Yapılandırma

TrueFoundry, meta veri takibi ve günlük kaydı için ek yapılandırma seçenekleri sunar:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: truefoundry:openai-main/gpt-5
    config:
      temperature: 0.7
      metadata:
        user_id: 'test-user'
        environment: 'production'
        custom_key: 'custom_value'
      loggingConfig:
        enabled: true
```

Yapılandırma seçenekleri:

- `metadata`: Her istekle birlikte izlenecek özel meta veriler (anahtar-değer çiftlerine sahip nesne)
- `loggingConfig`: Gözlemlenebilirlik için günlük kaydı yapılandırması (`enabled: true` içermelidir)

## Model Desteği

TrueFoundry birden fazla sağlayıcıdan gelen modelleri destekler. `provider-account/model-name` formatını kullanın:

### OpenAI Modelleri

```yaml
providers:
  - truefoundry:openai-main/gpt-5
  - truefoundry:openai-main/gpt-4o
  - truefoundry:openai-main/gpt-4o-mini
  - truefoundry:openai-main/o1
  - truefoundry:openai-main/o1-mini
```

### Anthropic Modelleri

```yaml
providers:
  - truefoundry:anthropic-main/claude-sonnet-4.5
  - truefoundry:anthropic-main/claude-3-5-sonnet-20241022
  - truefoundry:anthropic-main/claude-3-opus-20240229
```

### Google Gemini Modelleri

```yaml
providers:
  - truefoundry:vertex-ai-main/gemini-2.5-pro
  - truefoundry:vertex-ai-main/gemini-2.5-flash
  - truefoundry:vertex-ai-main/gemini-1.5-pro
```

### Diğer Sağlayıcılar

```yaml
providers:
  - truefoundry:groq-main/llama-3.3-70b-versatile
  - truefoundry:mistral-main/mistral-large-latest
  - truefoundry:cohere-main/embed-english-v3.0 # Gömmeler
```

## Gömmeler (Embeddings)

TrueFoundry, aynı birleşik API aracılığıyla gömme modellerini destekler:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: truefoundry:openai-main/text-embedding-3-large
    config:
      metadata:
        user_id: 'embedding-test'
      loggingConfig:
        enabled: true
tests:
  - vars:
      query: 'Makine öğrenimi nedir?'
    assert:
      - type: is-valid-openai-embedding
```

### Cohere Gömmeleri

Cohere modellerini kullanırken `input_type` parametresini belirtmelisiniz:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: truefoundry:cohere-main/embed-english-v3.0
    config:
      input_type: 'search_query' # Seçenekler: search_query, search_document, classification, clustering
      metadata:
        user_id: 'embedding-test'
```

### Çok Modlu Gömmeler (Vertex AI)

TrueFoundry, Vertex AI aracılığıyla görüntüler ve videolar için çok modlu gömmeleri destekler:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: truefoundry:vertex-ai-main/multimodalembedding@001
    config:
      metadata:
        use_case: 'image-search'
```

## Araç Kullanımı ve Fonksiyon Çağırma

TrueFoundry, OpenAI araçlar formatıyla uyumlu araç kullanımını ve fonksiyon çağırmayı destekler:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: truefoundry:openai-main/gpt-5
    config:
      tools:
        - type: function
          function:
            name: get_weather
            description: 'Belirli bir konumdaki mevcut hava durumunu al'
            parameters:
              type: object
              properties:
                location:
                  type: string
                  description: 'Şehir ve eyalet, örn. San Francisco, CA'
                unit:
                  type: string
                  enum:
                    - celsius
                    - fahrenheit
              required:
                - location
      tool_choice: auto
prompts:
  - '{{location}} konumunda hava durumu nedir?'
tests:
  - vars:
      location: 'San Francisco, CA'
```

## MCP Sunucuları (Model Context Protocol)

TrueFoundry, gelişmiş araç yetenekleri için MCP sunucularını destekler. MCP sunucuları; web araması, kod yürütme ve daha fazlası gibi entegre araçlara erişim sağlar:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: truefoundry:openai-main/gpt-5
    config:
      temperature: 0.7
      mcp_servers:
        - integration_fqn: 'common-tools'
          enable_all_tools: false
          tools:
            - name: 'web_search'
            - name: 'code_executor'
      iteration_limit: 20
      metadata:
        user_id: 'mcp-test'
      loggingConfig:
        enabled: true
prompts:
  - 'Web üzerinde {{query}} araması yapın ve bulguları özetleyin'
tests:
  - vars:
      query: 'en son yapay zeka gelişmeleri 2025'
```

### MCP Yapılandırma Seçenekleri

- `mcp_servers`: MCP sunucu yapılandırmaları dizisi
  - `integration_fqn`: Entegrasyonun tam nitelikli adı (örneğin, 'common-tools')
  - `enable_all_tools`: Entegrasyondaki tüm araçların etkinleştirilip etkinleştirilmeyeceği (boolean)
  - `tools`: Etkinleştirilecek belirli araçların dizisi (her biri bir `name` alanına sahip)
- `iteration_limit`: Araç çağırma için maksimum iterasyon sayısı (varsayılan: 20)

### Mevcut MCP Entegrasyonları

Yaygın entegrasyonlar şunları içerir:

- `common-tools`: web_search, code_executor ve diğer yardımcı programları sağlar
- Özel entegrasyonlar TrueFoundry hesabınız üzerinden yapılandırılabilir

## Tam Örnek

İşte TrueFoundry'nin yeteneklerini gösteren kapsamlı bir örnek:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: TrueFoundry LLM Ağ Geçidi değerlendirmesi

providers:
  - id: truefoundry:openai-main/gpt-5
    label: 'TrueFoundry üzerinden GPT-5'
    config:
      temperature: 0.7
      max_completion_tokens: 1000
      metadata:
        user_id: 'eval-user'
        environment: 'testing'
      loggingConfig:
        enabled: true
      mcp_servers:
        - integration_fqn: 'common-tools'
          enable_all_tools: false
          tools:
            - name: 'web_search'
      iteration_limit: 10

  - id: truefoundry:anthropic-main/claude-sonnet-4.5
    label: 'TrueFoundry üzerinden Claude Sonnet 4.5'
    config:
      temperature: 0.7
      max_tokens: 1000
      metadata:
        user_id: 'eval-user'
        environment: 'testing'
      loggingConfig:
        enabled: true

prompts:
  - |
    Siz yardımcı bir asistansınız. Aşağıdaki soruyu yanıtlayın:
    {{question}}

tests:
  - vars:
      question: 'Fransa"nın başkenti neresidir?'
    assert:
      - type: contains
        value: 'Paris'

  - vars:
      question: 'Kuantum bilişimi basit terimlerle açıklayın'
    assert:
      - type: llm-rubric
        value: 'Kuantum bilişimi hakkında net ve basit bir açıklama sağlar'

  - vars:
      question: 'Yapay zeka hakkındaki en son haberleri arayın ve özetleyin'
    assert:
      - type: llm-rubric
        value: 'En son yapay zeka haberlerini başarıyla arar ve özetler'
```

## Gözlemlenebilirlik ve İzleme

TrueFoundry yerleşik gözlemlenebilirlik özellikleri sunar. `loggingConfig.enabled` değeri `true` olarak ayarlandığında, tüm istekler günlüğe kaydedilir ve TrueFoundry panosu üzerinden izlenebilir.

Temel gözlemlenebilirlik özellikleri:

- İstek ve yanıt günlüğü
- Performans metrikleri (gecikme, kullanılan tokenler)
- Maliyet takibi
- Hata izleme
- Filtreleme ve analiz için özel meta veriler

## En İyi Uygulamalar

1. **Meta Veri Kullanın**: İstekleri kullanıcı, ortam veya özelliğe göre izlemek için anlamlı meta veriler ekleyin
2. **Günlük Kaydını Etkinleştirin**: Üretim izleme için `loggingConfig.enabled: true` olarak ayarlayın
3. **Model Seçimi**: Kullanım durumunuza göre modelleri seçin (hız ve kalite dengesi)
4. **MCP Sunucuları**: Web araması ve kod yürütme gibi gelişmiş yetenekler için MCP sunucularını kullanın
5. **Maliyet Yönetimi**: TrueFoundry panosu üzerinden token kullanımını izleyin

## Ek Kaynaklar

- [TrueFoundry Dokümantasyonu](https://docs.truefoundry.com/docs/ai-gateway)
- [TrueFoundry Blog](https://www.truefoundry.com/blog)
- [OpenAI Sağlayıcı Dokümantasyonu](/docs/providers/openai/) (ek yapılandırma seçenekleri için)

TrueFoundry'nin LLM Ağ Geçidi hakkında daha fazla bilgi için [truefoundry.com/ai-gateway](https://www.truefoundry.com/ai-gateway) adresini ziyaret edin.
