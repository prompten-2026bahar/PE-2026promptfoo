---
sidebar_label: Özel Javascript
description: TypeScript, CommonJS veya ESM modüllerini kullanarak herhangi bir API'yi veya hizmeti promptfoo'nun test çerçevesiyle entegre etmek için özel JavaScript sağlayıcıları yapılandırın
---

# Javascript Sağlayıcısı

Özel Javascript sağlayıcıları, promptfoo'da henüz yerleşik olarak bulunmayan herhangi bir API veya hizmetle entegre olmak için JavaScript veya TypeScript dilinde sağlayıcılar oluşturmanıza olanak tanır.

## Desteklenen Dosya Formatları ve Örnekler

promptfoo birden fazla JavaScript modül formatını destekler. Çalışan eksiksiz örnekler GitHub'da mevcuttur:

- [CommonJS Sağlayıcısı](https://github.com/promptfoo/promptfoo/tree/main/examples/custom-provider) - (`.js`, `.cjs`) - `module.exports` ve `require()` kullanır
- [ESM Sağlayıcısı](https://github.com/promptfoo/promptfoo/tree/main/examples/custom-provider-mjs) - (`.mjs`, `"type": "module"` olan `.js`) - `import`/`export` kullanır
- [TypeScript Sağlayıcısı](https://github.com/promptfoo/promptfoo/tree/main/examples/custom-provider-typescript) - (`.ts`) - Arayüzlerle tip güvenliği sağlar
- [Gömme (Embeddings) Sağlayıcısı](https://github.com/promptfoo/promptfoo/tree/main/examples/custom-provider-embeddings) (commonjs)

## Sağlayıcı Arayüzü

Minimum olarak, özel bir sağlayıcı bir `id` yöntemi ve bir `callApi` yöntemi uygulamalıdır.

```javascript title="echoProvider.mjs"
// ES6 sözdizimi için echoProvider.mjs olarak veya CommonJS için echoProvider.js olarak kaydedin
export default class EchoProvider {
  id = () => 'echo';

  callApi = async (prompt, context, options) => {
    return {
      output: `Echo: ${prompt}`,
    };
  };
}
```

Sağlayıcıyı başlatmak için isteğe bağlı olarak bir yapıcı (constructor) kullanabilirsiniz, örneğin:

```javascript title="openaiProvider.js"
const promptfoo = require('promptfoo').default;

module.exports = class OpenAIProvider {
  constructor(options) {
    this.providerId = options.id || 'openai-custom';
    this.config = options.config;
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt, context, options) {
    const { data } = await promptfoo.cache.fetchWithCache(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.config?.model || 'gpt-5-mini',
          messages: [{ role: 'user', content: prompt }],
          max_completion_tokens: this.config?.max_tokens || 1024,
          temperature: this.config?.temperature || 1,
        }),
      },
    );

    return {
      output: data.choices[0].message.content,
      tokenUsage: data.usage,
    };
  }
};
```

`callApi`, bir `ProviderResponse` nesnesi döndürür. `ProviderResponse` nesnesinin formatı:

```javascript
{
  // kullanıcılara gösterilen ana yanıt
  output: "Model yanıtı - metin veya yapılandırılmış veri olabilir",
  error: "Varsa hata mesajı",
  prompt: "LLM'ye gönderilen gerçek istem", // İsteğe bağlı: rapor edilen istem
  tokenUsage: {
    total: 100,
    prompt: 50,
    completion: 50,
  },
  cost: 0.002,
  cached: false,
  metadata: {}, // Ek veriler
  ...
}
```

### Context Parametresi

`context` parametresi, test durumu bilgilerini ve yardımcı nesneleri sağlar:

```javascript
{
  vars: {},              // Test durumu değişkenleri
  prompt: {},            // İstem şablonu (raw, label, config)
  test: {                // Tam test durumu nesnesi
    vars: {},
    metadata: {
      pluginId: '...',   // Redteam eklentisi (örn. "promptfoo:redteam:harmful:hate")
      strategyId: '...',  // Redteam stratejisi (örn. "jailbreak", "prompt-injection")
    },
  },
  originalProvider: {},  // Geçersiz kılındığında orijinal sağlayıcı
  logger: {},            // Winston günlüğü örneği
}
```

Redteam değerlendirmeleri için, test durumunu hangi eklentinin ve stratejinin oluşturduğunu belirlemek için `context.test.metadata.pluginId` ve `context.test.metadata.strategyId` kullanın.

### Gerçek İstemi Raporlama

Sağlayıcınız istemleri dinamik olarak oluşturuyor veya değiştiriyorsa, yanıtınızdaki `prompt` alanını kullanarak LLM'ye gönderilen gerçek istemi raporlayabilirsiniz. Bu şunlar için yararlıdır:

- İstemleri dinamik olarak oluşturan GenAIScript gibi çerçeveler
- Çok turlu konuşmalar oluşturan ajan çerçeveleri
- Sistem talimatları ekleyen veya istemi değiştiren sağlayıcılar

```javascript title="dynamicPromptProvider.mjs"
export default class DynamicPromptProvider {
  id = () => 'dynamic-prompt';

  callApi = async (prompt, context) => {
    // Dinamik olarak farklı bir istem oluşturun
    const generatedPrompt = `System: Yardımsever bir asistansın.\nUser: ${prompt}`;

    // Oluşturulan istemle LLM'yi çağırın
    const response = await callLLM(generatedPrompt);

    return {
      output: response,
      prompt: generatedPrompt, // Gerçekte neyin gönderildiğini raporlayın
    };
  };
}
```

Rapor edilen istem şunlar için kullanılır:

- **Görüntüleme**: Web kullanıcı arayüzünde "Gerçek Gönderilen İstem" (Actual Prompt Sent) olarak gösterilir
- **İddialar (Assertions)**: `moderation` gibi istem tabanlı iddialar bu değeri kontrol eder
- **Hata Ayıklama**: LLM'ye gerçekte neyin gönderildiğini anlamaya yardımcı olur

Çalışan eksiksiz bir örnek için [vercel-ai-sdk örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/vercel-ai-sdk) bakın.

### İki Aşamalı Sağlayıcı (Two-Stage Provider)

```javascript title="twoStageProvider.js"
const promptfoo = require('promptfoo').default;

module.exports = class TwoStageProvider {
  constructor(options) {
    this.providerId = options.id || 'two-stage';
    this.config = options.config;
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt) {
    // Birinci aşama: ek verileri al
    const secretData = await this.fetchSecret(this.config.secretKey);

    // İkinci aşama: zenginleştirilmiş istemle LLM'yi çağır
    const enrichedPrompt = `${prompt}\nBağlam: ${secretData}`;
    const llmResponse = await this.callLLM(enrichedPrompt);

    return {
      output: llmResponse.output,
      metadata: { secretUsed: true },
    };
  }

  async fetchSecret(key) {
    // İşlem için gereken bazı harici verileri al
    return `${key} için gizli bilgiler`;
  }

  async callLLM(prompt) {
    const { data } = await promptfoo.cache.fetchWithCache(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-5-mini',
          messages: [{ role: 'user', content: prompt }],
        }),
      },
    );

    return {
      output: data.choices[0].message.content,
    };
  }
};
```

### TypeScript Uygulaması

```typescript title="typedProvider.ts"
import promptfoo from 'promptfoo';
import type {
  ApiProvider,
  ProviderOptions,
  ProviderResponse,
  CallApiContextParams,
} from 'promptfoo';

export default class TypedProvider implements ApiProvider {
  protected providerId: string;
  public config: Record<string, any>;

  constructor(options: ProviderOptions) {
    this.providerId = options.id || 'typed-provider';
    this.config = options.config || {};
  }

  id(): string {
    return this.providerId;
  }

  async callApi(prompt: string, context?: CallApiContextParams): Promise<ProviderResponse> {
    const username = (context?.vars?.username as string) || 'anonim';

    return {
      output: `Merhaba, ${username}! Şunu söyledin: "${prompt}"`,
      tokenUsage: {
        total: prompt.length,
        prompt: prompt.length,
        completion: 0,
      },
    };
  }
}
```

## Ek Yetenekler

### Gömme (Embeddings) API'si

```javascript title="embeddingProvider.js"
async callEmbeddingApi(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  const data = await response.json();

  return {
    embedding: data.data[0].embedding,
    tokenUsage: {
      total: data.usage.total_tokens,
      prompt: data.usage.prompt_tokens,
      completion: 0,
    },
  };
}
```

### Sınıflandırma (Classification) API'si

```javascript title="classificationProvider.js"
async callClassificationApi(text) {
  return {
    classification: {
      positive: 0.75,
      neutral: 0.20,
      negative: 0.05,
    },
  };
}
```

## Önbellek Sistemi

Yerleşik önbellekleme sistemi gereksiz API çağrılarından kaçınmaya yardımcı olur:

```javascript title="cacheExample.js"
// Önbellek örneğini alın
const cache = promptfoo.cache.getCache();

// Veriyi saklayın ve geri alın
await cache.set('my-key', 'cached-value', { ttl: 3600 }); // saniye cinsinden TTL
const value = await cache.get('my-key');

// Önbellek sarmalayıcısı ile getirin
const { data, cached } = await promptfoo.cache.fetchWithCache(
  'https://api.example.com/endpoint',
  {
    method: 'POST',
    body: JSON.stringify({ query: 'data' }),
  },
  5000, // milisaniye cinsinden zaman aşımı
);
```

## Yapılandırma

### Sağlayıcı Yapılandırması

```yaml title="promptfooconfig.yaml"
providers:
  - id: file://./myProvider.mjs # ES6 modülleri
    label: 'Özel API'm' # Arayüzde görünen ad
    config:
      model: 'gpt-5'
      temperature: 0.7
      max_tokens: 2000
      custom_parameter: 'custom value'
  # - id: file://./myProvider.js   # CommonJS modülleri
```

### Bulut Hedefine Bağlama (Link to Cloud Target)

:::info Promptfoo Cloud Özelliği
[Promptfoo Cloud](/docs/enterprise) dağıtımlarında mevcuttur.
:::

`linkedTargetId` kullanarak yerel sağlayıcı yapılandırmanızı bir bulut hedefine bağlayın:

```yaml
providers:
  - id: file://./myProvider.mjs
    config:
      linkedTargetId: 'promptfoo://provider/12345678-1234-1234-1234-123456789abc'
```

Kurulum talimatları için [Yerel Hedefleri Buluta Bağlama](/docs/red-team/troubleshooting/linking-targets/) sayfasına bakın.

### Çoklu Örnekler (Multiple Instances)

```yaml title="multiple-providers.yaml"
providers:
  - id: file:///path/to/provider.js
    label: high-temperature
    config:
      temperature: 0.9
  - id: file:///path/to/provider.js
    label: low-temperature
    config:
      temperature: 0.1
```

## Ayrıca Bakınız

- [Tarayıcı Sağlayıcısı](/docs/providers/browser/)
- [Özel Sağlayıcı Örnekleri](https://github.com/promptfoo/promptfoo/tree/main/examples)
- [Özel Betik Sağlayıcısı](/docs/providers/custom-script/)
- [Go Sağlayıcısı](/docs/providers/go/)
- [HTTP Sağlayıcısı](/docs/providers/http/)
- [Python Sağlayıcısı](/docs/providers/python/)
