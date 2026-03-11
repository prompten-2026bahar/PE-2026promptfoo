---
sidebar_position: 2
description: "Gelişmiş akıl yürütme ve konuşmaya dayalı yapay zeka uygulamaları için Opus, Sonnet ve Haiku dahil olmak üzere Anthropic'in Claude modellerini dağıtın"
---

# Anthropic

Bu sağlayıcı, [Anthropic Claude](https://www.anthropic.com/claude) model serisini destekler.

> **Not:** Claude modellerine ayrıca [Azure AI Foundry](/docs/providers/azure/#using-claude-models), [AWS Bedrock](/docs/providers/aws-bedrock/) ve [Google Vertex](/docs/providers/vertex/) aracılığıyla da erişilebilir.

:::tip Ajan Temelli Değerlendirmeler (Agentic Evals)
Dosya erişimi, araç kullanımı ve MCP sunucuları içeren ajan temelli değerlendirmeler için [Claude Agent SDK sağlayıcısına](/docs/providers/claude-agent-sdk/) bakın.
:::

## Kurulum

Anthropic'i kullanmak için `ANTHROPIC_API_KEY` ortam değişkenini ayarlamanız veya sağlayıcı yapılandırmasında `apiKey` belirtmeniz gerekir.

Anthropic API anahtarlarını [buradan](https://console.anthropic.com/settings/keys) oluşturun.

Ortam değişkenini ayarlama örneği:

```sh
export ANTHROPIC_API_KEY=your_api_key_here
```

## Modeller

`anthropic` sağlayıcısı, mesaj API'si aracılığıyla aşağıdaki modelleri destekler:

| Model ID                                                                   | Açıklama                         |
| -------------------------------------------------------------------------- | -------------------------------- |
| `anthropic:messages:claude-sonnet-4-6`                                     | En yeni Claude 4.6 Sonnet modeli |
| `anthropic:messages:claude-opus-4-6`                                       | En yeni Claude 4.6 Opus modeli   |
| `anthropic:messages:claude-opus-4-5-20251101` (claude-opus-4-5-latest)     | Claude 4.5 Opus modeli           |
| `anthropic:messages:claude-opus-4-1-20250805` (claude-opus-4-1-latest)     | Claude 4.1 Opus modeli           |
| `anthropic:messages:claude-opus-4-20250514` (claude-opus-4-latest)         | En yeni Claude 4 Opus modeli     |
| `anthropic:messages:claude-sonnet-4-5-20250929` (claude-sonnet-4-5-latest) | En yeni Claude 4.5 Sonnet modeli |
| `anthropic:messages:claude-sonnet-4-20250514` (claude-sonnet-4-latest)     | En yeni Claude 4 Sonnet modeli   |
| `anthropic:messages:claude-haiku-4-5-20251001` (claude-haiku-4-5-latest)   | En yeni Claude 4.5 Haiku modeli  |
| `anthropic:messages:claude-3-7-sonnet-20250219` (claude-3-7-sonnet-latest) | En yeni Claude 3.7 Sonnet modeli |
| `anthropic:messages:claude-3-5-sonnet-20241022` (claude-3-5-sonnet-latest) | En yeni Claude 3.5 Sonnet modeli |
| `anthropic:messages:claude-3-5-sonnet-20240620`                            | Önceki Claude 3.5 Sonnet modeli  |
| `anthropic:messages:claude-3-5-haiku-20241022` (claude-3-5-haiku-latest)   | En yeni Claude 3.5 Haiku modeli  |
| `anthropic:messages:claude-3-opus-20240229` (claude-3-opus-latest)         | Claude 3 Opus modeli             |
| `anthropic:messages:claude-3-haiku-20240307`                               | Claude 3 Haiku modeli            |

### Platformlar Arası Model Kullanılabilirliği

Claude modelleri birden fazla platformda mevcuttur. Model adlarının farklı sağlayıcılar arasında nasıl eşleştiği aşağıda gösterilmiştir:

| Model             | Anthropic API                                         | Azure AI Foundry ([docs](/docs/providers/azure/#using-claude-models)) | AWS Bedrock ([docs](/docs/providers/aws-bedrock)) | GCP Vertex AI ([docs](/docs/providers/vertex)) |
| ----------------- | ----------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| Claude 4.6 Sonnet | claude-sonnet-4-6                                     | claude-sonnet-4-6                                                     | anthropic.claude-sonnet-4-6                       | claude-sonnet-4-6                              |
| Claude 4.6 Opus   | claude-opus-4-6                                       | claude-opus-4-6-20260205                                              | anthropic.claude-opus-4-6-v1                      | claude-opus-4-6                                |
| Claude 4.5 Opus   | claude-opus-4-5-20251101 (claude-opus-4-5-latest)     | claude-opus-4-5-20251101                                              | anthropic.claude-opus-4-5-20251101-v1:0           | claude-opus-4-5@20251101                       |
| Claude 4.5 Sonnet | claude-sonnet-4-5-20250929 (claude-sonnet-4-5-latest) | claude-sonnet-4-5-20250929                                            | anthropic.claude-sonnet-4-5-20250929-v1:0         | claude-sonnet-4-5@20250929                     |
| Claude 4.5 Haiku  | claude-haiku-4-5-20251001 (claude-haiku-4-5-latest)   | claude-haiku-4-5-20251001                                             | anthropic.claude-haiku-4-5-20251001-v1:0          | claude-haiku-4-5@20251001                      |
| Claude 4.1 Opus   | claude-opus-4-1-20250805                              | claude-opus-4-1-20250805                                              | anthropic.claude-opus-4-1-20250805-v1:0           | claude-opus-4-1@20250805                       |
| Claude 4 Opus     | claude-opus-4-20250514 (claude-opus-4-latest)         | claude-opus-4-20250514                                                | anthropic.claude-opus-4-20250514-v1:0             | claude-opus-4@20250514                         |
| Claude 4 Sonnet   | claude-sonnet-4-20250514 (claude-sonnet-4-latest)     | claude-sonnet-4-20250514                                              | anthropic.claude-sonnet-4-20250514-v1:0           | claude-sonnet-4@20250514                       |
| Claude 3.7 Sonnet | claude-3-7-sonnet-20250219 (claude-3-7-sonnet-latest) | claude-3-7-sonnet-20250219                                            | anthropic.claude-3-7-sonnet-20250219-v1:0         | claude-3-7-sonnet@20250219                     |
| Claude 3.5 Sonnet | claude-3-5-sonnet-20241022 (claude-3-5-sonnet-latest) | claude-3-5-sonnet-20241022                                            | anthropic.claude-3-5-sonnet-20241022-v2:0         | claude-3-5-sonnet-v2@20241022                  |
| Claude 3.5 Haiku  | claude-3-5-haiku-20241022 (claude-3-5-haiku-latest)   | claude-3-5-haiku-20241022                                             | anthropic.claude-3-5-haiku-20241022-v1:0          | claude-3-5-haiku@20241022                      |
| Claude 3 Opus     | claude-3-opus-20240229 (claude-3-opus-latest)         | claude-3-opus-20240229                                                | anthropic.claude-3-opus-20240229-v1:0             | claude-3-opus@20240229                         |
| Claude 3 Haiku    | claude-3-haiku-20240307                               | claude-3-haiku-20240307                                               | anthropic.claude-3-haiku-20240307-v1:0            | claude-3-haiku@20240307                        |

### Desteklenen Parametreler

| Config Özelliği | Ortam Değişkeni       | Açıklama                                                                            |
| --------------- | --------------------- | ----------------------------------------------------------------------------------- |
| apiKey          | ANTHROPIC_API_KEY     | Anthropic'ten aldığınız API anahtarınız                                             |
| apiBaseUrl      | ANTHROPIC_BASE_URL    | Anthropic API'sine yapılan istekler için temel URL                                  |
| temperature     | ANTHROPIC_TEMPERATURE | Çıktının rastgeleliğini kontrol eder (varsayılan: 0)                                |
| max_tokens      | ANTHROPIC_MAX_TOKENS  | Oluşturulan metnin maksimum uzunluğu (varsayılan: 1024)                             |
| top_p           | -                     | Çekirdek örneklemeyi (nucleus sampling) kontrol ederek çıktının rastgeleliğini etkiler |
| top_k           | -                     | Her sonraki token için yalnızca en iyi K seçenekten örnekleme yapın                 |
| tools           | -                     | Modelin çağırması için bir dizi araç veya fonksiyon tanımı                          |
| tool_choice     | -                     | Çağrılacak aracı belirten bir nesne                                                 |
| effort          | -                     | Çıktı efor düzeyi: `low`, `medium`, `high` veya `max`                               |
| output_format   | -                     | Yapılandırılmış çıktılar için JSON şema yapılandırması                              |
| thinking        | -                     | Claude'un genişletilmiş düşünme yapılandırması (`enabled`, `adaptive` veya `disabled`) |
| showThinking    | -                     | Çıktıya düşünme içeriğinin dahil edilip edilmeyeceği (varsayılan: true)              |
| headers         | -                     | API isteğiyle birlikte gönderilecek ek başlıklar                                    |
| extra_body      | -                     | API istek gövdesine eklenecek ek parametreler                                       |

### İstem Şablonu (Prompt Template)

OpenAI istem şablonuyla uyumluluk sağlamak için aşağıdaki format desteklenir:

```json title="prompt.json"
[
  {
    "role": "system",
    "content": "{{ system_message }}"
  },
  {
    "role": "user",
    "content": "{{ question }}"
  }
]
```

`system` rolü belirtilirse otomatik olarak API isteğine eklenecektir.
Tüm `user` veya `assistant` rolleri API isteği için otomatik olarak doğru formata dönüştürülecektir.
Şu anda yalnızca `text` türü desteklenmektedir.

`system_message` ve `question`, `var` direktifi ile ayarlanabilen örnek değişkenlerdir.

### Seçenekler

Anthropic sağlayıcısı, modelin davranışını özelleştirmek için çeşitli seçenekleri destekler. Bunlar şunları içerir:

- `temperature`: Çıktının rastgeleliğini kontrol eder.
- `max_tokens`: Oluşturulan metnin maksimum uzunluğu.
- `top_p`: Çekirdek örneklemeyi (nucleus sampling) kontrol ederek çıktının rastgeleliğini etkiler.
- `top_k`: Her sonraki token için yalnızca en iyi K seçenekten örnekleme yapın.
- `tools`: Modelin çağırması için bir dizi araç veya fonksiyon tanımı.
- `tool_choice`: Çağrılacak aracı belirten bir nesne.
- `extra_body`: Anthropic API istek gövdesine doğrudan iletilecek ek parametreler.

Seçenekler ve istemler içeren yapılandırma örneği:

```yaml title="promptfooconfig.yaml"
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      temperature: 0.0
      max_tokens: 512
      extra_body:
        custom_param: 'test_value'
prompts:
  - file://prompt.json
```

### Araç Çağırma (Tool Calling)

Anthropic sağlayıcısı araç çağırmayı (fonksiyon çağırma) destekler. İşte araçları tanımlamak için bir yapılandırma örneği.

```yaml title="promptfooconfig.yaml"
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      tools:
        - name: get_weather
          description: Belirli bir konumdaki mevcut hava durumunu al
          input_schema:
            type: object
            properties:
              location:
                type: string
                description: Şehir ve eyalet, örneğin San Francisco, CA
              unit:
                type: string
                enum:
                  - celsius
                  - fahrenheit
            required:
              - location
```

#### Web Arama ve Web Getirme Araçları

Anthropic, web arama ve web getirme yetenekleri için özelleştirilmiş araçlar sunar:

##### Web Getirme Aracı (Web Fetch Tool)

Web getirme aracı, Claude'un web sayfalarından ve PDF belgelerinden tam içerik almasına olanak tanır. Bu, Claude'un belirli web içeriğine erişmesini ve analiz etmesini istediğinizde yararlıdır.

```yaml title="promptfooconfig.yaml"
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      tools:
        - type: web_fetch_20250910
          name: web_fetch
          max_uses: 5
          allowed_domains:
            - docs.example.com
            - help.example.com
          citations:
            enabled: true
          max_content_tokens: 50000
```

**Web Getirme Aracı Yapılandırma Seçenekleri:**

| Parametre            | Tür      | Açıklama                                                                                    |
| -------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `type`               | string   | `web_fetch_20250910` olmalıdır                                                              |
| `name`               | string   | `web_fetch` olmalıdır                                                                       |
| `max_uses`           | number   | İstek başına maksimum web getirme sayısı (isteğe bağlı)                                     |
| `allowed_domains`    | string[] | Getirmeye izin verilecek alan adlarının listesi (isteğe bağlı, `blocked_domains` ile birbirini dışlar) |
| `blocked_domains`    | string[] | Getirilmesi engellenecek alan adlarının listesi (isteğe bağlı, `allowed_domains` ile birbirini dışlar) |
| `citations`          | object   | `{ enabled: true }` ile alıntıları etkinleştirin (isteğe bağlı)                             |
| `max_content_tokens` | number   | Web içeriği için maksimum token sayısı (isteğe bağlı)                                       |

##### Web Arama Aracı (Web Search Tool)

Web arama aracı, Claude'un bilgi için internette arama yapmasına olanak tanır:

```yaml title="promptfooconfig.yaml"
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      tools:
        - type: web_search_20250305
          name: web_search
          max_uses: 3
```

**Web Arama Aracı Yapılandırma Seçenekleri:**

| Parametre  | Tür    | Açıklama                                        |
| ---------- | ------ | ----------------------------------------------- |
| `type`     | string | `web_search_20250305` olmalıdır                 |
| `name`     | string | `web_search` olmalıdır                          |
| `max_uses` | number | İstek başına maksimum arama sayısı (isteğe bağlı) |

##### Birleşik Web Arama ve Web Getirme

Kapsamlı web bilgi toplama için her iki aracı birlikte kullanabilirsiniz:

```yaml title="promptfooconfig.yaml"
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      tools:
        - type: web_search_20250305
          name: web_search
          max_uses: 3
        - type: web_fetch_20250910
          name: web_fetch
          max_uses: 5
          citations:
            enabled: true
```

Bu yapılandırma, modelin önce ilgili bilgileri aramasına, ardından en umut verici sonuçlardan tam içeriği getirmesine olanak tanır.

**Önemli Güvenlik Notları:**

- Web getirme aracı, potansiyel veri sızdırma riskleri nedeniyle güvenilir ortamlar gerektirir
- Model dinamik olarak URL oluşturamaz - yalnızca kullanıcılar tarafından sağlanan veya arama sonuçlarından gelen URL'ler getirilebilir
- Erişimi belirli sitelerle sınırlamak için alan adı filtrelemeyi kullanın:
  - Güvenilir alan adlarını beyaz listeye eklemek için `allowed_domains` kullanın (önerilir)
  - Belirli alan adlarını kara listeye eklemek için `blocked_domains` kullanın
  - **Not:** `allowed_domains` veya `blocked_domains` özelliklerinden yalnızca biri belirtilebilir, her ikisi birden kullanılamaz

Araçların nasıl tanımlanacağı hakkında daha fazla bilgi için [Anthropic Araç Kullanım Klavuzu](https://docs.anthropic.com/en/docs/tool-use)'na ve [buradaki](https://github.com/promptfoo/promptfoo/tree/main/examples/tool-use) araç kullanımı örneğine bakın.

### Görüntüler / Görme (Vision)

Claude 3 modellerinde istemlere görüntüler ekleyebilirsiniz.

[Claude vision örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/claude-vision) bakın.

Önemli bir not: Anthropic API'si yalnızca görüntülerin base64 gösterimlerini destekler.
Bu, bir URL'den resim almayı destekleyen OpenAI'ın görme özelliğinden farklıdır. Sonluk olarak, Claude 3 ve OpenAI görme yeteneklerini karşılaştırmaya çalışıyorsanız, her biri için ayrı istemleriniz olması gerekecektir.

Farklılıkları anlamak için [OpenAI vision örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-vision) bakın.

### İstem Önbelleğe Alma (Prompt Caching)

Claude, tekrarlayan görevler için API kullanımını optimize etmek ve maliyetleri düşürmek amacıyla istem önbelleğe almayı destekler. Bu özellik, sonraki isteklerde aynı içeriğin tekrar işlenmesini önlemek için istemlerinizin bölümlerini önbelleğe alır.

Tüm Claude 3, 3.5 ve 4 modellerinde desteklenir. Temel örnek:

```yaml title="promptfooconfig.yaml"
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
prompts:
  - file://prompts.yaml
```

```yaml title="prompts.yaml"
- role: system
  content:
    - type: text
      text: 'Sistem mesajı'
      cache_control:
        type: ephemeral
    - type: text
      text: '{{context}}'
      cache_control:
        type: ephemeral
- role: user
  content: '{{question}}'
```

Önbelleğe alma için yaygın kullanım durumları:

- Sistem mesajları ve talimatları
- Araç/fonksiyon tanımları
- Büyük bağlam belgeleri
- Sık kullanılan görüntüler

Gereksinimler, fiyatlandırma ve en iyi uygulamalar hakkında daha fazla ayrıntı için [Anthropic'in İstem Önbelleğe Alma Klavuzu](https://docs.anthropic.com/claude/docs/prompt-caching)'na bakın.

### Alıntılar (Citations)

Claude, belgeler hakkındaki soruları yanıtlarken ayrıntılı alıntılar sağlayabilir. Temel örnek:

```yaml title="promptfooconfig.yaml"
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
prompts:
  - file://prompts.yaml
```

```yaml title="prompts.yaml"
- role: user
  content:
    - type: document
      source:
        type: text
        media_type: text/plain
        data: 'Belge metniniz buraya'
      citations:
        enabled: true
    - type: text
      text: 'Sorunuz buraya'
```

Daha fazla ayrıntı için [Anthropic'in Alıntılar Klavuzu](https://docs.anthropic.com/en/docs/build-with-claude/citations)'na bakın.

### Genişletilmiş Düşünme (Extended Thinking)

Claude, final yanıtını vermeden önce modelin dahili akıl yürütme sürecini görmenize olanak tanıyan genişletilmiş bir düşünme yeteneğini destekler. Bu, `thinking` parametresi kullanılarak yapılandırılabilir:

```yaml title="promptfooconfig.yaml"
providers:
  # Uyarlanabilir düşünme (Claude Opus 4.6 için önerilir)
  - id: anthropic:messages:claude-opus-4-6
    config:
      max_tokens: 20000
      thinking:
        type: 'adaptive'

  # Açık bütçeli etkinleştirilmiş düşünme
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      max_tokens: 20000
      thinking:
        type: 'enabled'
        budget_tokens: 16000 # ≥1024 ve max_tokens değerinden küçük olmalıdır
```

Düşünme yapılandırmasının üç olası değeri vardır:

1. Uyarlanabilir düşünme (Claude Opus 4.6 için önerilir):

```yaml
thinking:
  type: 'adaptive'
```

Uyarlanabilir modda Claude, isteğin karmaşıklığına göre ne zaman ve ne kadar düşüneceğine karar verir. Bu, `claude-opus-4-6` için önerilen moddur.

2. Etkinleştirilmiş düşünme:

```yaml
thinking:
  type: 'enabled'
  budget_tokens: number # ≥1024 ve max_tokens değerinden küçük olmalıdır
```

3. Devre dışı bırakılmış düşünme:

```yaml
thinking:
  type: 'disabled'
```

Düşünme etkinleştirildiğinde veya uyarlanabilir olduğunda:

- Yanıtlar, Claude'un akıl yürütme sürecini gösteren `thinking` içerik bloklarını içerecektir
- Minimum 1.024 token bütçesi gerektirir
- budget_tokens değeri max_tokens parametresinden küçük olmalıdır
- Düşünme için kullanılan tokenler max_tokens limitinize dahil edilir
- Özelleştirilmiş 28 veya 29 tokenlik bir sistem istemi otomatik olarak dahil edilir
- Önceki dönüşteki düşünme blokları yok sayılır ve girdi tokeni olarak sayılmaz
- Düşünme; temperature, top_p veya top_k değişiklikleriyle uyumlu değildir

Düşünme etkinken örnek yanıt:

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Analiz etmeme izin verin...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "Analizime dayanarak, işte cevap..."
    }
  ]
}
```

#### Düşünme Çıktısını Kontrol Etme

Varsayılan olarak, düşünme içeriği yanıt çıktısına dahil edilir. Bu davranışı `showThinking` parametresini kullanarak kontrol edebilirsiniz:

```yaml title="promptfooconfig.yaml"
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      thinking:
        type: 'enabled'
        budget_tokens: 16000
      showThinking: false # Düşünme içeriğini çıktıdan hariç tut
```

`showThinking` değeri `false` olarak ayarlandığında, düşünme içeriği çıktıdan hariç tutulacak ve yalnızca final yanıtı döndürülecektir. Bu, daha iyi akıl yürütme için düşünmeyi kullanmak istediğiniz ancak düşünme sürecini son kullanıcılara göstermek istemediğiniz durumlarda yararlıdır.

#### Sansürlenmiş Düşünme (Redacted Thinking)

Bazen Claude'un dahili akıl yürütmesi güvenlik sistemleri tarafından işaretlenebilir. Bu durumda, düşünme bloğu şifrelenir ve `redacted_thinking` bloğu olarak döndürülür:

```json
{
  "content": [
    {
      "type": "redacted_thinking",
      "data": "EmwKAhgBEgy3va3pzix/LafPsn4aDFIT2Xlxh0L5L8rLVyIwxtE3rAFBa8cr3qpP..."
    },
    {
      "type": "text",
      "text": "Analizime dayanarak..."
    }
  ]
}
```

Sansürlenmiş düşünme blokları, API'ye geri gönderildiğinde otomatik olarak çözülür ve Claude'un güvenlik önlemlerinden ödün vermeden bağlamı korumasına olanak tanır.

#### Düşünme ile Genişletilmiş Çıktı

Claude 4 modelleri, gelişmiş çıktı yetenekleri ve genişletilmiş düşünme desteği sağlar:

```yaml
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      max_tokens: 64000 # Claude 4 Sonnet 64K'ya kadar çıktı tokenini destekler
      thinking:
        type: 'enabled'
        budget_tokens: 32000
```

Not: The `output-128k-2025-02-19` beta özelliği Claude 3.7 Sonnet'e özgüdür ve yerleşik gelişmiş çıktı yeteneklerine sahip Claude 4 modelleri için gerekli değildir.

Genişletilmiş çıktı kullanırken:

- max_tokens 21,333'ten büyük olduğunda akış (streaming) gereklidir
- 32K'nın üzerindeki düşünme bütçeleri için toplu işleme (batch processing) önerilir
- Model, ayrılan düşünme bütçesinin tamamını kullanmayabilir

Gereksinimler ve en iyi uygulamalar hakkında daha fazla ayrıntı için [Anthropic'in Genişletilmiş Düşünme Klavuzu](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)'na bakın.

### Efor Düzeyi (Effort Level)

`effort` parametresi, çıktı kalitesi/hız dengesini kontrol eder. Daha yüksek efor düzeyleri daha kapsamlı yanıtlar üretebilir ancak daha uzun sürer:

```yaml
providers:
  - id: anthropic:messages:claude-opus-4-6
    config:
      effort: low # Seçenekler: low, medium, high, max
```

Bu, yapılandırılmış çıktılar gibi diğer özelliklerle birleştirilebilir:

```yaml
providers:
  - id: anthropic:messages:claude-opus-4-6
    config:
      effort: high
      output_format:
        type: json_schema
        schema:
          type: object
          properties:
            analysis:
              type: string
          required:
            - analysis
          additionalProperties: false
```

### Yapılandırılmış Çıktılar (Structured Outputs)

Yapılandırılmış çıktılar, Claude'un yanıtlarını bir JSON şemasına zorlar. Claude Sonnet 4.5 ve Claude Opus 4.1 için mevcuttur.

#### JSON Çıktıları

Yapılandırılmış yanıtlar almak için `output_format` ekleyin:

```yaml
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      output_format:
        type: json_schema
        schema:
          type: object
          properties:
            name:
              type: string
            email:
              type: string
          required:
            - name
            - email
          additionalProperties: false
```

Ayrıca tüm `output_format` içeriğini harici bir dosyadan yükleyebilirsiniz:

```yaml
config:
  output_format: file://./schemas/analysis-format.json
```

Şema için iç içe geçmiş dosya referansları desteklenir:

```json title="analysis-format.json"
{
  "type": "json_schema",
  "schema": "file://./schemas/analysis-schema.json"
}
```

Dosya yollarında değişken işleme (variable rendering) desteklenir:

```yaml
config:
  output_format: file://./schemas/{{ schema_name }}.json
```

#### Sıkı Araç Kullanımı (Strict Tool Use)

Şema onaylı parametreler için araç tanımlarına `strict: true` ekleyin:

```yaml
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      tools:
        - name: get_weather
          strict: true
          input_schema:
            type: object
            properties:
              location:
                type: string
            required:
              - location
            additionalProperties: false
```

#### Sınırlamalar

**Desteklenenler:** object, array, string, integer, number, boolean, null, `enum`, `required`, `additionalProperties: false`

**Desteklenmeyenler:** öz yinelemeli (recursive) şemalar, `minimum`/`maximum`, `minLength`/`maxLength`

**Uyumsuz olanlar:** alıntılar, mesaj ön doldurma (prefilling)

[Anthropic'in klavuzuna](https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs) ve [yapılandırılmış çıktılar örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/anthropic/structured-outputs) bakın.

## Model Tarafından Derecelendirilen Testler (Model-Graded Tests)

`factuality` veya `llm-rubric` gibi [model tarafından derecelendirilen iddialar](/docs/configuration/expected-outputs/model-graded/), `ANTHROPIC_API_KEY` ayarlıysa ve `OPENAI_API_KEY` ayarlı değilse otomatik olarak Anthropic'i derecelendirme sağlayıcısı olarak kullanacaktır.

Her iki API anahtarı da mevcutsa, varsayılan olarak OpenAI kullanılacaktır. Yapılandırmanızda derecelendirme sağlayıcısını açıkça geçersiz kılabilirsiniz.

Model tarafından derecelendirilen değerlendirmelerin uygulanma şekli nedeniyle, **model sohbet formatındaki istemleri desteklemelidir** (embedding veya sınıflandırma modelleri hariç).

Derecelendirme sağlayıcısını birkaç şekilde geçersiz kılabilirsiniz:

1. `defaultTest` kullanarak tüm test durumları için:

```yaml title="promptfooconfig.yaml"
defaultTest:
  options:
    provider: anthropic:messages:claude-sonnet-4-5-20250929
```

2. Bireysel iddialar için:

```yaml
assert:
  - type: llm-rubric
    value: Bir AI veya sohbet asistanı olduğunuzdan bahsetmeyin
    provider:
      id: anthropic:messages:claude-sonnet-4-5-20250929
      config:
        temperature: 0.0
```

3. Belirli testler için:

```yaml
tests:
  - vars:
      question: Fransa'nın başkenti neresidir?
    options:
      provider:
        id: anthropic:messages:claude-sonnet-4-5-20250929
    assert:
      - type: llm-rubric
        value: Cevap Paris'ten bahsetmelidir
```

### Ek Yetenekler

- **Önbelleğe Alma**: Promptfoo varsayılan olarak önceki LLM isteklerini önbelleğe alır.
- **Token Kullanımı Takibi**: Her istekte kullanılan token sayısı hakkında ayrıntılı bilgi sağlayarak kullanım izleme ve optimizasyona yardımcı olur.
- **Maliyet Hesaplama**: Üretilen token sayısına ve kullanılan özel modele göre her isteğin maliyetini hesaplar.

## Ayrıca Bakınız

### Örnekler

Claude'un yeteneklerini gösteren birkaç örnek uygulama sunuyoruz:

#### Temel Özellikler

- [Araç Kullanımı Örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/tool-use) - Claude'un araç çağırma yeteneklerinin nasıl kullanılacağını gösterir
- [Yapılandırılmış Çıktılar Örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/anthropic/structured-outputs) - Garantili şema uyumu için JSON çıktılarını ve sıkı araç kullanımını gösterir
- [Görme Örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/claude-vision) - Claude'un görme yeteneklerinin kullanımını gösterir

#### Model Karşılaştırmaları ve Değerlendirmeler

- [Claude vs GPT](https://github.com/promptfoo/promptfoo/tree/main/examples/claude-vs-gpt) - Claude'u çeşitli görevlerde GPT-4 ile karşılaştırır
- [Claude vs GPT Görüntü Analizi](https://github.com/promptfoo/promptfoo/tree/main/examples/claude-vs-gpt-image) - Claude ve GPT'nin görüntü analizi yeteneklerini karşılaştırır

#### Bulut Platformu Entegrasyonları

- [Azure AI Foundry](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/claude) - Claude'u Azure AI Foundry üzerinden kullanma
- [AWS Bedrock](https://github.com/promptfoo/promptfoo/tree/main/examples/amazon-bedrock) - Claude'u AWS Bedrock üzerinden kullanma
- [Google Vertex AI](https://github.com/promptfoo/promptfoo/tree/main/examples/google-vertex) - Claude'u Google Vertex AI üzerinden kullanma

#### Ajan Temelli Değerlendirmeler

- [Claude Agent SDK](/docs/providers/claude-agent-sdk/) - Dosya erişimi, araç kullanımı ve MCP sunucuları içeren ajan temelli değerlendirmeler için

Daha fazla örnek ve genel kullanım modelleri için GitHub'daki [örnekler dizinimizi](https://github.com/promptfoo/promptfoo/tree/main/examples) ziyaret edin.
