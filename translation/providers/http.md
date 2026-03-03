---
sidebar_label: HTTP API
description: Dinamik istek dönüşümleri, değişken değiştirme ve çoklu sağlayıcı API uyumluluğu ile özel LLM entegrasyonları için HTTP/HTTPS uç noktalarını yapılandırın
---

# HTTP/HTTPS API

Sağlayıcı (provider) kimliğini bir URL olarak ayarlamak, bu uç noktaya bir HTTP isteği gönderir. Bu, çıkarım için herhangi bir HTTP uç noktasını kullanmanın genel amaçlı bir yoludur.

Sağlayıcı yapılandırması, HTTP isteğini oluşturmanıza ve çıkarım sonucunu yanıttan çıkarmanıza olanak tanır.

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/generate'
      method: 'POST'
      headers:
        'Content-Type': 'application/json'
      body:
        myPrompt: '{{prompt}}'
      transformResponse: 'json.output' # Yanıttan "output" alanını çıkar
```

`{{prompt}}` yer tutucu değişkeni, test durumu için nihai istemle değiştirilecektir. İsteği oluştururken test değişkenlerine de atıfta bulunabilirsiniz:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/generateTranslation'
      body:
        prompt: '{{prompt}}'
        model: '{{model}}'
        translate: '{{language}}'

tests:
  - vars:
      model: 'gpt-5-mini'
      language: 'Fransızca'
```

Mevcut olduğunda Promptfoo, `{{evaluationId}}` gibi çalışma zamanı değişkenlerini de enjekte eder; bu, alt akış günlüklerini belirli bir değerlendirme çalışmasıyla ilişkilendirmek için yararlıdır:

```yaml
body:
  prompt: '{{prompt}}'
  evaluation_id: '{{evaluationId}}'
```

`body` bir dize veya JSON nesnesi olabilir. Gövde bir dize ise, aksi belirtilmedikçe `Content-Type` üstbilgisi varsayılan olarak `text/plain` olur. Gövde bir nesne ise, içerik türü otomatik olarak `application/json` olarak ayarlanır.

### JSON Örneği

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/generateTranslation'
      body:
        model: '{{model}}'
        translate: '{{language}}'
```

### Form-data Örneği

```yaml
providers:
  - id: https
    config:
      headers:
        'Content-Type': 'application/x-www-form-urlencoded'
      body: 'model={{model}}&translate={{language}}'
```

## Ham HTTP İsteği Gönderme

Sağlayıcı yapılandırmasında `request` özelliğini belirterek ham bir HTTP isteği de gönderebilirsiniz. Bu, üstbilgiler ve gövde dahil olmak üzere istek üzerinde tam kontrole sahip olmanızı sağlar.

İşte ham HTTP isteği özelliğinin nasıl kullanılacağına dair bir örnek:

```yaml
providers:
  - id: https
    config:
      useHttps: true
      request: |
        POST /v1/completions HTTP/1.1
        Host: api.example.com
        Content-Type: application/json
        Authorization: Bearer {{api_key}}

        {
          "model": "llama3.1-405b-base",
          "prompt": "{{prompt}}",
          "max_tokens": 100
        }
      transformResponse: 'json.content' # yanıttan "content" alanını çıkar
```

Bu örnekte:

1. `request` özelliği; yöntem, yol, üstbilgiler ve gövde dahil olmak üzere ham bir HTTP isteği içerir.
2. `useHttps` özelliği `true` olarak ayarlanmıştır, bu nedenle istek HTTPS üzerinden gönderilecektir.
3. Ham istek içinde `{{api_key}}` ve `{{prompt}}` gibi şablon değişkenlerini kullanabilirsiniz. Bunlar, istek gönderildiğinde gerçek değerlerle değiştirilecektir.
4. `transformResponse` özelliği, JSON yanıtından istenen bilgileri çıkarmak için kullanılır.

Ham isteği `file://` önekini kullanarak harici bir dosyadan da yükleyebilirsiniz:

```yaml
providers:
  - id: https
    config:
      request: file://path/to/request.txt
      transformResponse: 'json.text'
```

Bu yol, Promptfoo yapılandırma dosyasını içeren dizine göredir.

Ardından `path/to/request.txt` konumunda bir dosya oluşturun:

```http
POST /api/generate HTTP/1.1
Host: example.com
Content-Type: application/json

{"prompt": "Bana bir fıkra anlat"}
```

### İçe İçe Nesneler

İçe içe geçmiş nesneler desteklenir ve `dump` fonksiyonuna geçirilmelidir.

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/generateTranslation'
      body:
        // highlight-start
        messages: '{{messages | dump}}'
        // highlight-end
        model: '{{model}}'
        translate: '{{language}}'

tests:
  - vars:
      // highlight-start
      messages:
        - role: 'user'
          content: 'foobar'
        - role: 'assistant'
          content: 'baz'
      // highlight-end
      model: 'gpt-5-mini'
      language: 'Fransızca'
```

`body` içindeki herhangi bir geçerli JSON dizesinin bir JSON nesnesine dönüştürüleceğini unutmayın.

## Sorgu Parametreleri (Query Parameters)

Sorgu parametreleri, sağlayıcı yapılandırmasında `queryParams` alanı kullanılarak belirtilebilir. Bunlar URL'ye GET parametreleri olarak eklenecektir.

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/search'
      // highlight-start
      method: 'GET'
      queryParams:
        q: '{{prompt}}'
        foo: 'bar'
      // highlight-end
```

## Dinamik URL'ler

Hem sağlayıcı `id` alanı hem de `url` alanı Nunjucks şablonlarını destekler. Test `vars` alanındaki değişkenler istek gönderilmeden önce işlenecektir.

```yaml
providers:
  - id: https://api.example.com/users/{{userId}}/profile
    config:
      method: 'GET'
```

## Kütüphane Olarak Kullanma

Promptfoo'yu bir [node kütüphanesi](/docs/usage/node-package/) olarak kullanıyorsanız, eşdeğer sağlayıcı yapılandırmasını sağlayabilirsiniz:

```javascript
{
  // ...
  providers: [{
    id: 'https',
    config: {
      url: 'https://example.com/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        foo: '{{bar}}',
      },
      transformResponse: (json) => json.output,
    }
  }],
}
```

## İstek Dönüşümü (Request Transform)

İstek dönüşümü, isteminizi işlendikten sonra ancak bir sağlayıcı API'sine gönderilmeden önce değiştirir. Bu şunları yapmanıza olanak tanır:

- İstemleri belirli mesaj yapılarına formatlamak
- Meta veri veya bağlam eklemek
- Çok turlu konuşmalar için karmaşık mesaj formatlarını yönetmek

### Temel Kullanım

```yaml
providers:
  - id: https
    config:
      url: 'https://api.example.com/chat'
      transformRequest: '{"message": "{{prompt}}"}'
      body:
        user_message: '{{prompt}}'
```

### Dönüşüm Türleri

#### Dize Şablonu

İstemi dönüştürmek için Nunjucks şablonlarını kullanın:

```yaml
transformRequest: '{"text": "{{prompt}}"}'
```

#### JavaScript Fonksiyonu

İstemi dönüştüren bir fonksiyon tanımlayın:

```javascript
transformRequest: (prompt, vars, context) =>
  JSON.stringify({ text: prompt, timestamp: Date.now() });
```

#### Dosya Tabanlı Dönüşüm

Harici bir dosyadan bir dönüşüm yükleyin:

```yaml
transformRequest: 'file://transforms/request.js'
```

Örnek dönüşüm dosyası (transforms/request.js):

```javascript
module.exports = (prompt, vars, context) => {
  return {
    text: prompt,
    metadata: {
      timestamp: Date.now(),
      version: '1.0',
    },
  };
};
```

Kullanılacak belirli bir fonksiyonu da belirtebilirsiniz:

```yaml
transformRequest: 'file://transforms/request.js:transformRequest'
```

## Yanıt Dönüşümü (Response Transform)

`transformResponse` seçeneği, API yanıtını çıkarmanıza ve dönüştürmenize olanak tanır. Herhangi bir `transformResponse` belirtilmezse sağlayıcı, yanıtı JSON olarak ayrıştırmaya çalışacaktır. JSON ayrıştırması başarısız olursa ham metin yanıtını döndürecektir.

Sağlayıcı yapılandırmasında bir `transformResponse` belirterek bu davranışı geçersiz kılabilirsiniz. `transformResponse` şunlardan biri olabilir:

1. JavaScript ifadesi içeren bir dize
2. Bir fonksiyon
3. Bir JavaScript modülüne giden dosya yolu (`file://` önekli)

### JSON Yanıtını Ayrıştırma

Varsayılan olarak, tüm yanıt çıktı olarak döndürülür. API'niz bir JSON nesnesi ile yanıt veriyorsa ve belirli bir değeri seçmek istiyorsanız, sağlanan `json` nesnesini işleyen bir JavaScript parçacığı ayarlamak için `transformResponse` özelliğini kullanın.

Örneğin, bu `transformResponse` yapılandırması:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/openai-compatible/chat/completions'
      # ...
      transformResponse: 'json.choices[0].message.content'
```

Bu yanıttan mesaj içeriğini çıkarır:

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "gpt-5-mini",
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 7,
    "total_tokens": 20
  },
  "choices": [
    {
      "message": {
        "role": "assistant",
        // highlight-start
        "content": "\n\nBu bir testtir!"
        // highlight-end
      },
      "logprobs": null,
      "finish_reason": "stop",
      "index": 0
    }
  ]
}
```

### Metin Yanıtını Ayrıştırma

API'niz bir metin yanıtı veriyorsa, sağlanan `text` nesnesini işleyen bir JavaScript parçacığı ayarlamak için `transformResponse` özelliğini kullanın.

Örneğin, bu `transformResponse` yapılandırması:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      # ...
      transformResponse: 'text.slice(11)'
```

Bu yanıttan "merhaba dünya" mesaj içeriğini çıkarır:

```text
Assistant: merhaba dünya
```

### Yanıt Ayrıştırıcı Türleri

#### Dize Ayrıştırıcı

Yanıttan veri çıkarmak için JavaScript ifadesi içeren bir dize kullanabilirsiniz:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      transformResponse: 'json.choices[0].message.content'
```

Bu ifade, mevcut üç değişkenle değerlendirilecektir:

- `json`: Ayrıştırılmış JSON yanıtı (eğer yanıt geçerli bir JSON ise)
- `text`: Ham metin yanıtı
- `context`: `context.response`, aşağıdakileri içeren `FetchWithCacheResult` türündedir:
  - `data`: Yanıt verisi (mümkünse JSON olarak ayrıştırılmış)
  - `cached`: Yanıtın önbellekten gelip gelmediğini belirten boolean
  - `status`: HTTP durum kodu
  - `statusText`: HTTP durum metni
  - `headers`: Yanıt üstbilgileri (varsa)

#### Fonksiyon Ayrıştırıcı

Promptfoo'yu bir Node.js kütüphanesi olarak kullanırken, yanıt olarak bir fonksiyon sağlayabilirsiniz. `ProviderResponse` türünde bir dize veya bir nesne döndürebilirsiniz.

Ayrıştırıcı:

```javascript
{
  providers: [{
    id: 'https',
    config: {
      url: 'https://example.com/generate_response',
      transformResponse: (json, text) => {
        // Dize döndüren özel ayrıştırma mantığı
        return json.choices[0].message.content;
      },
    }
  },
  {
    id: 'https',
    config: {
      url: 'https://example.com/generate_with_tokens',
      transformResponse: (json, text) => {
        // Nesne döndüren özel ayrıştırma mantığı
        return {
          output: json.output,
          tokenUsage: {
            prompt: json.usage.input_tokens,
            completion: json.usage.output_tokens,
            total: json.usage.input_tokens + json.usage.output_tokens,
          }
        }
      },
    }
  }],
}
```

<details>
<summary>Tür Tanımı</summary>

```typescript
interface ProviderResponse {
  cached?: boolean;
  cost?: number;
  error?: string;
  logProbs?: number[];
  metadata?: {
    redteamFinalPrompt?: string;
    [key: string]: any;
  };
  raw?: string | any;
  output?: string | any;
  tokenUsage?: TokenUsage;
  isRefusal?: boolean;
  sessionId?: string;
  guardrails?: GuardrailResponse;
  audio?: {
    id?: string;
    expiresAt?: number;
    data?: string; // base64 kodlu ses verisi
    transcript?: string;
    format?: string;
  };
}

export type TokenUsage = z.infer<typeof TokenUsageSchema>;

export const TokenUsageSchema = BaseTokenUsageSchema.extend({
  assertions: BaseTokenUsageSchema.optional(),
});

export const BaseTokenUsageSchema = z.object({
  // Temel token sayıları
  prompt: z.number().optional(),
  completion: z.number().optional(),
  cached: z.number().optional(),
  total: z.number().optional(),

  // İstek meta verileri
  numRequests: z.number().optional(),

  // Ayrıntılı tamamlama bilgileri
  completionDetails: CompletionTokenDetailsSchema.optional(),
});
```

</details>

#### Dosya Tabanlı Ayrıştırıcı

`file://` önekini kullanarak dosya yolunu belirterek, yanıt ayrıştırıcısı olarak bir JavaScript dosyası kullanabilirsiniz. Dosya yolu, promptfoo yapılandırma dosyasını içeren dizine göre çözümlenir.

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      transformResponse: 'file://path/to/parser.js'
```

Ayrıştırıcı dosyası, üç argüman (`json`, `text`, `context`) alan ve ayrıştırılmış çıktıyı döndüren bir fonksiyon dışa aktarmalıdır. Metin ve bağlamın isteğe bağlı olduğunu unutmayın.

```javascript
module.exports = (json, text) => {
  return json.choices[0].message.content;
};
```

Yanıt meta verilerine erişmek ve özel mantık uygulamak için `context` parametresini kullanabilirsiniz. Örneğin, denetleme (guardrails) kontrolü uygulamak için:

```javascript
module.exports = (json, text, context) => {
  return {
    output: json.choices[0].message.content,
    guardrails: { flagged: context.response.headers['x-content-filtered'] === 'true' },
  };
};
```

Bu, ek yanıt meta verilerine erişmenize ve yanıt durum kodu, üstbilgiler veya diğer özelliklere göre özel mantık uygulamanıza olanak tanır.

Varsayılan bir dışa aktarma (default export) da kullanabilirsiniz:

```javascript
export default (json, text) => {
  return json.choices[0].message.content;
};
```

Bir dosyadan içe aktarılacak belirli bir fonksiyon adını da belirtebilirsiniz:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      transformResponse: 'file://path/to/parser.js:parseResponse'
```

Bu, `path/to/parser.js` dosyasından `parseResponse` fonksiyonunu içe aktaracaktır.

### Denetleme (Guardrails) Desteği

HTTP hedefinizde denetlemeler ayarlanmışsa dönüşümünüzden hem `output` hem de `guardrails` alanlarını içeren bir nesne döndürmeniz gerekir. `guardrails` alanı, döndürülen nesnenizde üst düzey bir alan olmalı ve [GuardrailResponse](/docs/configuration/reference#guardrails) arayüzüne uygun olmalıdır. Örneğin:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      transformResponse: |
        {
          output: json.choices[0].message.content,
          guardrails: { flagged: context.response.headers['x-content-filtered'] === 'true' }
        }
```

### Test Dönüşümleri ile Etkileşim

`transformResponse` çıktısı, test düzeyindeki dönüşümler için girdi haline gelir. Karmaşık değerlendirmeler için bu boru hattını (pipeline) anlamak önemlidir:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      # Adım 1: Sağlayıcı dönüşümü API yanıtını normalize eder
      transformResponse: 'json.data' # Veri alanını çıkar

tests:
  - vars:
      query: 'Hava nasıl?'
    options:
      # Adım 2a: İddialar için test dönüşümü (sağlayıcı dönüşüm çıktısını alır)
      transform: 'output.answer'
    assert:
      - type: contains
        value: 'güneşli'

      # Adım 2b: RAG iddiaları için bağlam dönüşümü (ayrıca sağlayıcı dönüşüm çıktısını alır)
      - type: context-faithfulness
        contextTransform: 'output.sources.join(" ")'
```

## Araç Çağırma (Tool Calling)

HTTP sağlayıcısı; `tools`, `tool_choice` ve `transformToolsFormat` yapılandırma seçenekleri aracılığıyla araç çağırmayı destekler. Araçlarınızı ve araç seçiminizi OpenAI formatında tanımlayın, ardından `transformToolsFormat` değerini hedef sağlayıcının formatına (`openai`, `anthropic`, `bedrock` veya `google`) ayarlayın. Promptfoo, `body` içindeki `{{tools}}` ve `{{tool_choice}}` aracılığıyla bunları enjekte etmeden önce `tools` ve `tool_choice` alanlarını dönüştürür.

HTTP sağlayıcısı bir denetleme sağlayıcısı olarak kullanıldığında, yönetilen araç çağrılarının hedef API için doğru şekilde biçimlendirilmesi adına `transformToolsFormat` ayarının yapılması özellikle önemlidir.

### Temel Yapılandırma

```yaml
providers:
  - id: https://api.example.com/v1/chat/completions
    config:
      method: POST
      headers:
        Content-Type: application/json
        Authorization: 'Bearer {{env.API_KEY}}'
      transformToolsFormat: openai
      tools:
        - type: function
          function:
            name: get_weather
            description: Belirli bir konumun hava durumunu al
            parameters:
              type: object
              properties:
                location:
                  type: string
              required:
                - location
      tool_choice: auto
      body:
        model: gpt-4o-mini
        messages:
          - role: user
            content: '{{prompt}}'
        tools: '{{tools}}'
        tool_choice: '{{tool_choice}}'
      transformResponse: 'json.choices[0].message.tool_calls'
```

### transformToolsFormat

`transformToolsFormat` seçeneği hem `tools` hem de `tool_choice` alanlarını [OpenAI formatı](/docs/configuration/tools)ndan sağlayıcıya özgü formatlara dönüştürür. Araçlarınızı bir kez OpenAI formatında tanımlayın, bunlar otomatik olarak hedef sağlayıcının yerel formatına dönüştürülecektir.

| Sağlayıcı        | Format      |
| ---------------- | ----------- |
| Anthropic        | `anthropic` |
| AWS Bedrock      | `bedrock`   |
| Azure OpenAI     | `openai`    |
| Cerebras         | `openai`    |
| DeepSeek         | `openai`    |
| Fireworks AI     | `openai`    |
| Google AI Studio | `google`    |
| Google Vertex AI | `google`    |
| Groq             | `openai`    |
| Ollama           | `openai`    |
| OpenAI           | `openai`    |
| OpenRouter       | `openai`    |
| Perplexity       | `openai`    |
| Together AI      | `openai`    |
| xAI (Grok)       | `openai`    |

Dönüştürme gerektirmeyen OpenAI uyumlu API'ler için `openai` kullanın veya boş bırakın.

**tool_choice neden dönüşüme ihtiyaç duyar:** Her sağlayıcı araç seçimini farklı şekilde temsil eder:

| OpenAI (Promptfoo varsayılanı) | Anthropic          | Bedrock        | Google                                        |
| -------------------------- | ------------------ | -------------- | --------------------------------------------- |
| `"auto"`                   | `{ type: "auto" }` | `{ auto: {} }` | `{ functionCallingConfig: { mode: "AUTO" } }` |
| `"required"`               | `{ type: "any" }`  | `{ any: {} }`  | `{ functionCallingConfig: { mode: "ANY" } }`  |
| `"none"`                   | —                  | —              | `{ functionCallingConfig: { mode: "NONE" } }` |

### Şablon Değişkenleri

İstek gövdenizde bu değişkenleri kullanın:

- `{{tools}}` - Dönüştürülmüş araçlar dizisi, otomatik olarak JSON olarak serileştirilir
- `{{tool_choice}}` - Dönüştürülmüş araç seçimi, otomatik olarak JSON olarak serileştirilir

Araç formatları ve yapılandırması hakkındaki tam belgeler için [Araç Çağırma Yapılandırması](/docs/configuration/tools)na bakın.

## Token Tahmini

Varsayılan olarak HTTP sağlayıcısı, token bilgisi döndürmeyebilecek genel HTTP API'leri için tasarlandığından token kullanım istatistikleri sağlamaz. Ancak maliyet takibi ve analizi için yaklaşık token sayıları almak üzere isteğe bağlı token tahminini etkinleştirebilirsiniz. Redteam taramaları çalıştırılırken token tahmini otomatik olarak etkinleştirilir, böylece ek yapılandırma olmadan yaklaşık maliyetleri takip edebilirsiniz.

Token tahmini, yapılandırılabilir çarpanlara sahip basit bir kelime tabanlı sayma yöntemi kullanır. Bu, temel maliyet tahmini ve kullanım takibi için yararlı olan kaba bir yaklaşım sunar.

:::note Doğruluk
Kelime tabanlı tahmin, yaklaşık token sayıları sağlar. Hassas token sayımı için, uygun bir tokenizer kütüphanesi kullanarak `transformResponse` fonksiyonunuzda özel mantık uygulayın.
:::

### Ne Zaman Token Tahmini Kullanılmalı?

Token tahmini şu durumlarda yararlıdır:

- API'niz token kullanım bilgisini döndürmüyorsa
- Bütçe takibi için temel maliyet tahminlerine ihtiyacınız varsa
- Farklı istemler arasındaki kullanım kalıplarını izlemek istiyorsanız
- Token sayıları sağlayan bir API'den geçiş yapıyorsanız

Şu durumlarda token tahmini kullanmayın:

- API'niz zaten doğru token sayılarını sağlıyorsa (bunun yerine `transformResponse` kullanın)
- Faturalandırma için kesin token sayılarına ihtiyacınız varsa
- Kelime sayımının daha az doğru olduğu İngilizce dışındaki metinlerle çalışıyorsanız

### Temel Token Tahmini

Varsayılan ayarlarla temel token tahminini etkinleştirin:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      body:
        prompt: '{{prompt}}'
      tokenEstimation:
        enabled: true
```

Bu, hem istem (prompt) hem de tamamlama (completion) tokenleri için 1.3 çarpanıyla kelime tabanlı tahmini kullanacaktır.

### Özel Çarpanlar

Özel kullanım durumunuza göre daha doğru tahmin için özel bir çarpan yapılandırın:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      body:
        prompt: '{{prompt}}'
      tokenEstimation:
        enabled: true
        multiplier: 1.5 # İçerik karmaşıklığınıza göre ayarlayın
```

**Çarpan Kılavuzu:**

- Varsayılan `1.3` ile başlayın ve gerçek kullanıma göre ayarlayın
- Teknik/kod içerikleri için daha yüksek çarpanlar (1.5-2.0) gerekebilir
- Basit konuşma metinleri daha düşük çarpanlarla (1.1-1.3) çalışabilir
- Kalibre etmek için gerçek ve tahmini kullanımı izleyin

### Yanıt Dönüşümü ile Entegrasyon

Token tahmini, yanıt dönüşümleriyle birlikte çalışır. Eğer `transformResponse` değeriniz token kullanım bilgisi döndürürse tahmin atlanacaktır:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      tokenEstimation:
        enabled: true # transformResponse tokenUsage sağlarsa yoksayılacaktır
      transformResponse: |
        {
          output: json.choices[0].message.content,
          tokenUsage: {
            prompt: json.usage.prompt_tokens,
            completion: json.usage.completion_tokens,
            total: json.usage.total_tokens
          }
        }
```

### Özel Token Sayımı

Doğru token sayımı için bunu `transformResponse` fonksiyonunuzda uygulayın:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      transformResponse: |
        (json, text, context) => {
          // Doğruluk için uygun bir tokenizer kütüphanesi kullanın
          const promptTokens = customTokenizer.encode(context.vars.prompt).length;
          const completionTokens = customTokenizer.encode(json.response).length;
          
          return {
            output: json.response,
            tokenUsage: {
              prompt: promptTokens,
              completion: completionTokens,
              total: promptTokens + completionTokens,
              numRequests: 1
            }
          };
        }
```

Özel mantığı bir dosyadan da yükleyebilirsiniz:

```yaml
providers:
  - id: https
    config:
      url: 'https://example.com/api'
      transformResponse: 'file://token-counter.js'
```

Örnek `token-counter.js`:

```javascript
// 'tiktoken' veya 'gpt-tokenizer' gibi bir tokenizer kütüphanesi kullanarak
const { encode } = require('gpt-tokenizer');

module.exports = (json, text, context) => {
  const promptText = context.vars.prompt || '';
  const responseText = json.response || text;

  return {
    output: responseText,
    tokenUsage: {
      prompt: encode(promptText).length,
      completion: encode(responseText).length,
      total: encode(promptText).length + encode(responseText).length,
      numRequests: 1,
    },
  };
};
```

### Yapılandırma Seçenekleri

| Seçenek    | Tür     | Varsayılan                   | Açıklama                                                  |
| ---------- | ------- | ---------------------------- | --------------------------------------------------------- |
| enabled    | boolean | false (redteam modunda true) | Token tahminini etkinleştirir veya devre dışı bırakır     |
| multiplier | number  | 1.3                          | Kelime sayısına uygulanan çarpan (karmaşıklığa göre ayarlanır) |

### Örnek: Maliyet Takibi

Aşağıdaki yapılandırma, HTTP sağlayıcısını kullanan bir değerlendirme çalışmasında yaklaşık maliyetleri nasıl takip edeceğinizi gösterir:

```yaml
providers:
  - id: https
    config:
      url: 'https://api.example.com/generate'
      tokenEstimation:
        enabled: true
        multiplier: 1.4
      body:
        prompt: '{{prompt}}'

defaultTest:
  assert:
    - type: cost
      threshold: 0.05 # Tahmini maliyet istek başına 0,05 doları geçerse uyarı ver
```

## Kimlik Doğrulama

HTTP sağlayıcıları için kimlik doğrulaması genellikle `headers` aracılığıyla yapılır:

```yaml
providers:
  - id: https
    config:
      url: 'https://api.example.com'
      headers:
        Authorization: 'Bearer {{env.MY_API_KEY}}'
        'X-API-Key': '{{env.ANOTHER_KEY}}'
```

## Kimlik Doğrulamayı Güvence Altına Alma

API anahtarlarını doğrudan yapılandırma dosyanıza koymak yerine ortam değişkenlerini kullanın:

```yaml
providers:
  - id: https
    config:
      headers:
        Authorization: 'Bearer {{env.API_KEY}}'
```

Ardından değerlendirmeyi çalıştırdığınızda ortam değişkenini ayarlayın:

```bash
export API_KEY=gizli_anahtarim
promptfoo eval
```

## Karmaşık İstek Yapıları

### Çok Turunlu (Multi-turn) Konuşmalar

Çok turlu konuşmaları modellemek için `messages` yapısını ve `dump` filtresini kullanın:

```yaml
providers:
  - id: https
    config:
      url: 'https://api.example.com/chat'
      body:
        messages: '{{messages | dump}}'

tests:
  - vars:
      messages:
        - role: system
          content: 'Siz yardımsever bir asistansınız.'
        - role: user
          content: 'Merhaba!'
```

### İkili (Binary) Veriler

HTTP sağlayıcısı şu an için esas olarak metin tabanlı JSON/REST API'leri için tasarlanmıştır. İkili veriler (görüntü yükleme gibi) göndermeniz gerekiyorsa bir [Python sağlayıcısı](/docs/providers/python/) veya [Javascript sağlayıcısı](/docs/providers/custom-api/) kullanmanızı öneririz.

## Sorun Giderme

### İstek Hataları

İstekleriniz başarısız oluyorsa ayrıntılı çıktı almak için `--verbose` bayrağını kullanın:

```bash
promptfoo eval --verbose
```

Bu, gönderilen gerçek URL'yi, üstbilgileri ve gövdeyi görmenize yardımcı olacaktır.

### Ayrıştırma Hataları

`transformResponse` hata veriyorsa ham yanıtı kontrol edin. Bazen sağlayıcı null değerler veya beklenmedik yapılar döndürebilir:

```javascript
// Daha güvenli ayrıştırma örneği
transformResponse: |
  (json) => {
    if (!json || !json.choices || json.choices.length === 0) {
      return { error: 'Geçersiz yanıt' };
    }
    return json.choices[0].message.content;
  }
```

## Ayrıca Bakınız

- [Websocket Sağlayıcısı](/docs/providers/websocket) - Websocket tabanlı API'ler için
- [Python Sağlayıcısı](/docs/providers/python) - Özel istek/yanıt mantığı için
- [Sağlayıcı Seçenekleri](/docs/providers) - Mevcut tüm sağlayıcı türleri
