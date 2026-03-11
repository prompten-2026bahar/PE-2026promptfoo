---
sidebar_position: 7
title: Tool Calling
description: Configure tool definitions that work across OpenAI, Anthropic, AWS Bedrock, Google, and other LLM providers
---

# Araç Çağırma

Araç çağırma (işlev çağırma olarak da bilinir), LLM'lerin yalnızca metin yanıtları oluşturmak yerine tanımladığınız işlevleri çağırmasını sağlar.

## Genel Bakış

### Nasıl Çalışır

1. **Araçları tanımlarsınız** - Modele hangi işlevlerin kullanılabilir olduğunu adlarını, açıklamalarını ve parametre şemalarını sağlayarak söyleyin
2. **Model bir araç çağrısı talep eder** - Model bir işlev adı ve argümanları çıkarır. Bu ad, kodunuzdaki bir işlevle eşleştirilen bir tanımlayıcıdır—model kendisi hiçbir şeyi yürütmez
3. **Kodunuz işlevi yürütür** - Uygulamanız işlev adını gerçek koda eşleştirir ve sağlanan argümanlarla çalıştırır
4. **Sonuçlar modele geri döner** - İşlevin çıktısını modele geri gönderirsiniz, bu da onu son yanıtı oluşturmak için kullanır

```
Kullanıcı: "San Francisco'nun hava durumu nedir?"
    ↓
Model çıktı: { tool: "get_weather", args: { location: "San Francisco" } }
    ↓
Kodunuz çalışır: getWeather("San Francisco") → "72°F, güneşli"
    ↓
Sonucu modele geri gönderirsiniz
    ↓
Model yanıt verir: "San Francisco'da şu anda 72°F ve güneşlidir."
```

### Yapılandırma

Araç çağırmasını yapılandırmanın iki kısmı vardır:

1. **Araç tanımları** - Modele mevcut işlevleri açıklayın: adlarını, açıklamalarını ve parametre şemalarını. Model, hangi aracı çağıracağını ve hangi argümanları ileteceğini belirlemek için bunları kullanır.

2. **Araç seçimi** - Modelin araçları _ne zaman_ kullandığını kontrol edin: onu otomatik olarak karar vermesine izin verin, belirli bir aracı kullanmaya zorlayın veya araçları tamamen devre dışı bırakın.

Birçok sağlayıcı OpenAI'nin araç biçimi etrafında standardize olmakla birlikte, bazıları kendi söz dizimini korur:

| Sağlayıcı                 | Yerel Format                                           |
| ------------------------ | ------------------------------------------------------ |
| OpenAI/Azure/Groq/Ollama | `{ type: 'function', function: { name, parameters } }` |
| Anthropic                | `{ name, input_schema }`                               |
| AWS Bedrock              | `{ toolSpec: { name, inputSchema: { json } } }`        |
| Google                   | `{ functionDeclarations: [{ name, parameters }] }`     |

Promptfoo OpenAI'nin araç biçimini standart olarak kullanır. Yerleşik sağlayıcılar (OpenAI, Anthropic, Bedrock, Google, vb.) için promptfoo araç tanımlarını otomatik olarak gerekli yerel biçime dönüştürür. [HTTP sağlayıcısı](/docs/providers/http) için, hedef API'nin hangi biçimi beklediğini promptfoo'ya söylemek için `transformToolsFormat` ayarlayın.

### Sağlayıcılar arasında araçları yeniden kullanma

Araçlarınızı OpenAI biçiminde bir kez tanımlayın ve [YAML bağlantıları ve takma adlarını](https://yaml.org/spec/1.2.2/#3222-anchors-and-aliases) kullanarak tüm sağlayıcılarda yeniden kullanın. Bir bağlantı (`&tools`) bir değeri kaydeder ve bir takma ad (`*tools`) başka yerlerde buna başvurur:

```yaml
providers:
  - id: openai:gpt-4o
    config:
      tools: &tools # Bağlantı: araçları bir kez tanımla
        - type: function
          function:
            name: get_weather
            description: Bir konum için mevcut hava durumunu al
            parameters:
              type: object
              properties:
                location: { type: string }
              required: [location]

  - id: anthropic:claude-sonnet-4-20250514
    config:
      tools: *tools # Takma ad: aynı araçları yeniden kullan

  - id: google:gemini-2.0-flash
    config:
      tools: *tools # Takma ad: burada da çalışır
```

## Araçları Tanımlama

Araçları OpenAI biçiminde tanımlayın:

```yaml
providers:
  - id: openai:gpt-4
    config:
      tools:
        - type: function
          function:
            name: get_weather
            description: Bir konum için mevcut hava durumunu al
            parameters:
              type: object
              properties:
                location:
                  type: string
                  description: Şehir adı (örn. "San Francisco, CA")
                unit:
                  type: string
                  enum: [celsius, fahrenheit]
                  description: Sıcaklık birimi
              required:
                - location
```

### Alanlar

| Alan                   | Tür     | Gerekli | Açıklama                                              |
| ---------------------- | ------- | ------- | ----------------------------------------------------- |
| `type`                 | string  | Evet    | `'function'` olmalıdır                               |
| `function.name`        | string  | Evet    | İşlev adı (model tarafından çağırmak için kullanılır) |
| `function.description` | string  | Hayır   | İşlevin ne yaptığının açıklaması                     |
| `function.parameters`  | object  | Hayır   | İşlevin parametrelerini tanımlayan JSON Schema       |
| `function.strict`      | boolean | Hayır   | Kesin şema doğrulamasını etkinleştirin (sadece OpenAI/Anthropic) |

### Tam JSON Schema Desteği

`parameters` alanı, aşağıdakiler dahil olmak üzere tam JSON Schema taslak-07'yi destekler:

```yaml
tools:
  - type: function
    function:
      name: complex_function
      parameters:
        type: object
        properties:
          coordinates:
            $ref: '#/$defs/coordinate'
          tags:
            type: array
            items:
              type: string
            minItems: 1
        required: [coordinates]
        $defs:
          coordinate:
            type: object
            properties:
              lat:
                type: number
                minimum: -90
                maximum: 90
              lon:
                type: number
                minimum: -180
                maximum: 180
            required: [lat, lon]
```

### Kesin Mod

Bunu destekleyen sağlayıcılar için kesin şema doğrulamasını etkinleştirin:

```yaml
tools:
  - type: function
    function:
      name: get_weather
      strict: true # Çıktının şemayla tam olarak eşleşmesini garanti eder
      parameters:
        type: object
        properties:
          location:
            type: string
        required: [location]
        additionalProperties: false # Kesin mod için gereklidir
```

**Kesin mod sağlayıcı desteği:**

| Sağlayıcı       | Destek                                           |
| -------------- | ----------------------------------------------- |
| OpenAI         | Tam destek — çıktının şemayla eşleşmesini garanti eder |
| Anthropic      | Yapılandırılmış çıktılar beta özelliğini etkinleştirir |
| Bedrock/Google | Yoksayıldı (desteklenmiyor)                    |

## Araç Seçimi

Araç seçimi, modelin tanımladığınız araçları _ne zaman_ ve _nasıl_ kullandığını kontrol eder. Varsayılan olarak, model bir araç çağrısının uygun olup olmadığını kendisi karar verir (`auto`). Bunu araç kullanımını zorlamak, devre dışı bırakmak veya modeli belirli bir araçla sınırlamak üzere geçersiz kılabilirsiniz—modelin doğru işlevi çağırıp çağırmadığını test etmek veya araç çağrısının her zaman beklendiği boru hatları için yararlı.

```yaml
providers:
  - id: openai:gpt-4
    config:
      tools:
        - type: function
          function:
            name: get_weather
            parameters: { ... }
      tool_choice: required # Model bir araç çağırmalıdır
```

### Modlar

Araç seçimi OpenAI'nin yerel biçimini kullanır:

| Değer                                                 | Açıklama                                                                                                         |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `auto`                                                | Model, isteme göre bir araç çağırıp çağırmayacağına karar verir (varsayılan)                                    |
| `none`                                                | Model, tanımlanmış olsa bile herhangi bir aracı çağıramaz—araç kullanını vs. düz metin yanıtlarını A/B test etmek için yararlı |
| `required`                                            | Model en az bir aracı çağırmalıdır—her zaman yapılandırılmış bir araç yanıtı beklediğinizde yararlı             |
| `{ type: function, function: { name: get_weather } }` | Model belirtilen aracı çağırmalıdır—belirli bir işlevi test etmek için yararlı                                   |

### Örnekler

```yaml
# Modelin karar vermesine izin ver
tool_choice: auto

# Modeli araçları kullanmaya zorla
tool_choice: required

# Belirli bir aracı zorunlu kıl
tool_choice:
  type: function
  function:
    name: get_weather

# Bu istek için araçları devre dışı bırak
tool_choice: none
```

## Sağlayıcı Dönüşümleri

### Araç Tanımı Eşlemeleri

Yerleşik sağlayıcılar için OpenAI biçimindeki araç tanımları otomatik olarak sağlayıcının yerel biçimine dönüştürülür. [HTTP sağlayıcısı](/docs/providers/http) için hedef biçimi belirtmek üzere `transformToolsFormat` ayarlayın. OpenAI biçimiyle eşleşmeyen araç tanımlarını iletirseniz, bunlar dönüştürülmeden doğrudan iletilir.

| OpenAI Alanı           | Anthropic      | Bedrock                     | Google                               |
| ---------------------- | -------------- | --------------------------- | ------------------------------------ |
| `function.name`        | `name`         | `toolSpec.name`             | `functionDeclarations[].name`        |
| `function.description` | `description`  | `toolSpec.description`      | `functionDeclarations[].description` |
| `function.parameters`  | `input_schema` | `toolSpec.inputSchema.json` | `functionDeclarations[].parameters`  |
| `function.strict`      | _(yoksayıldı)_ | _(yoksayıldı)_              | _(yoksayıldı)_                       |

### Araç Seçimi Eşlemeleri

| OpenAI (varsayılan)                        | Anthropic                | Bedrock              | Google                                                                    |
| ------------------------------------------ | ------------------------ | -------------------- | ------------------------------------------------------------------------- |
| `'auto'`                                   | `{ type: 'auto' }`       | `{ auto: {} }`       | `{ functionCallingConfig: { mode: 'AUTO' } }`                             |
| `'none'`                                   | `{ type: 'auto' }`       | _(çıkarıldı)_        | `{ functionCallingConfig: { mode: 'NONE' } }`                             |
| `'required'`                               | `{ type: 'any' }`        | `{ any: {} }`        | `{ functionCallingConfig: { mode: 'ANY' } }`                              |
| `{ type: 'function', function: { name } }` | `{ type: 'tool', name }` | `{ tool: { name } }` | `{ functionCallingConfig: { mode: 'ANY', allowedFunctionNames: [...] } }` |

## Diğer Sağlayıcı Biçimleri

Sağlayıcı-yerel biçimleri doğrudan kullanabilirsiniz. Dönüştürülmeden değiştirilmemiş olarak geçerler:

```yaml
# Anthropic yerel biçimi - olduğu gibi geçer
providers:
  - id: anthropic:claude-sonnet-4-20250514
    config:
      tools:
        - name: get_weather
          description: Hava durumunu al
          input_schema:
            type: object
            properties:
              location: { type: string }
```

Promptfoo biçimi otomatik olarak algılar. Araçlar OpenAI biçimindeyse (`type: 'function'` ile `function.name`), dönüştürülebilirler. Aksi takdirde, değiştirilmeden geçerler.

## Dosyalardan Araçları Yükleme

Araçlar dış dosyalardan yüklenebilir:

```yaml
providers:
  - id: openai:gpt-4
    config:
      tools: file://tools/my-tools.json
```

**tools/my-tools.json:**

```json
[
  {
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "Mevcut hava durumunu al",
      "parameters": {
        "type": "object",
        "properties": {
          "location": { "type": "string" }
        }
      }
    }
  }
]
```

## Araçlarla HTTP Sağlayıcısı

Özel HTTP uç noktaları için, OpenAI biçimindeki araçları uç noktanızın beklediği biçime otomatik olarak dönüştürmek üzere `transformToolsFormat` seçeneğini kullanın.

### OpenAI Uyumlu Uç Noktalar

```yaml
providers:
  - id: http://localhost:8080/v1/chat/completions
    config:
      method: POST
      headers:
        Content-Type: application/json
      transformToolsFormat: openai # Araçlar zaten OpenAI biçiminde, geçer
      body:
        model: gpt-4
        messages: '{{ prompt }}'
        tools: '{{ tools }}'
        tool_choice: '{{ tool_choice }}'
      tools:
        - type: function
          function:
            name: get_weather
            description: Bir konum için hava durumunu al
            parameters:
              type: object
              properties:
                location: { type: string }
      tool_choice: required
```

### Anthropic Uyumlu Uç Noktalar

```yaml
providers:
  - id: http://localhost:8080/v1/messages
    config:
      method: POST
      headers:
        Content-Type: application/json
        x-api-key: '{{ env.ANTHROPIC_API_KEY }}'
        anthropic-version: '2023-06-01'
      transformToolsFormat: anthropic # OpenAI → Anthropic biçimine dönüştür
      body:
        model: claude-sonnet-4-20250514
        max_tokens: 1024
        messages: '{{ prompt }}'
        tools: '{{ tools }}'
        tool_choice: '{{ tool_choice }}'
      tools:
        - type: function
          function:
            name: get_weather
            description: Bir konum için hava durumunu al
            parameters:
              type: object
              properties:
                location:
                  type: string
                  description: Şehir adı
              required:
                - location
      tool_choice: required
```

`transformToolsFormat` seçeneği şu değerleri kabul eder: `openai`, `anthropic`, `bedrock` veya `google`. `{{ tools }}` ve `{{ tool_choice }}` şablon değişkenleri, istek gövdesine enjekte edilirken otomatik olarak JSON olarak serileştirilir.

### Yerel Biçim Geçişi

Uç noktanız belirli bir biçim gerektiriyorsa, araçları o biçimde doğrudan tanımlayabilir ve `transformToolsFormat` atlayabilirsiniz. Araçlar değiştirilmeden geçer:

```yaml
providers:
  - id: http://localhost:8080/v1/messages
    config:
      method: POST
      headers:
        Content-Type: application/json
      # transformToolsFormat yok - araçlar olduğu gibi geçer
      body:
        model: claude-sonnet-4-20250514
        messages: '{{ prompt }}'
        tools: '{{ tools }}'
      tools:
        # input_schema ile yerel Anthropic biçimi
        - name: get_weather
          description: Bir konum için hava durumunu al
          input_schema:
            type: object
            properties:
              location:
                type: string
            required:
              - location
```

Bu, uç noktanız özel veya standart olmayan bir araç biçimi beklediğinde faydalıdır.

## Ayrıca Bakınız

- [OpenAI Sağlayıcısı](/docs/providers/openai) - OpenAI-spesifik araç özellikleri
- [Anthropic Sağlayıcısı](/docs/providers/anthropic) - Anthropic araç çağırma
- [AWS Bedrock Sağlayıcısı](/docs/providers/aws-bedrock) - Bedrock Converse API araçları
- [Google Sağlayıcısı](/docs/providers/google) - Gemini işlev çağırma
- [Özel HTTP Sağlayıcısı](/docs/providers/custom-api) - Özel uç noktalarla araçlar