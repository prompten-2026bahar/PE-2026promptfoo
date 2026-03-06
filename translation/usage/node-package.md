---
sidebar_position: 20
sidebar_label: Node paketi
description: Node.js uygulamalarına promptfoo'nun evaluate() işleviyle LLM testi entegre edin. TypeScript/JavaScript API'lerini kullanarak sağlayıcıları yapılandırın, test paketlerini çalıştırın ve sonuçları analiz edin.
---

# Node paketini kullanma

## Kurulum

promptfoo [npm'de](https://www.npmjs.com/package/promptfoo) bir node paketi olarak mevcuttur:

```sh
npm install promptfoo
```

## Kullanım

`promptfoo` işlevini ve diğer yardımcıları içeri aktararak projenizde bir kütüphane olarak kullanın:

```ts
import promptfoo from 'promptfoo';

const results = await promptfoo.evaluate(testSuite, options);
```

Değerlendirme işlevi aşağıdaki parametreleri alır:

- `testSuite`: promptfooconfig.yaml dosyasının Javascript eşdeğeri olan [`TestSuiteConfiguration` nesnesi](/docs/configuration/reference#testsuiteconfiguration).

- `options`: test sisteminin nasıl çalıştığıyla ilgili çeşitli seçenekler, bir [`EvaluateOptions` nesnesi](/docs/configuration/reference#evaluateoptions) olarak.

Değerlendirmenin sonuçları bir [`EvaluateSummary` nesnesi](/docs/configuration/reference#evaluatesummary) olarak döndürülür.

### Sağlayıcı işlevleri

Bir `ProviderFunction`, bir LLM API çağrısını uygulayan bir Javascript işlevidir. Bir istem dizesi ve bağlam alır. LLM yanıtını veya bir hata döndürür. [`ProviderFunction` türüne](/docs/configuration/reference#providerfunction) bakın.

`loadApiProvider` işlevini kullanarak sağlayıcıları yükleyebilirsiniz:

```ts
import { loadApiProvider } from 'promptfoo';

// Varsayılan seçeneklerle bir sağlayıcı yükle
const provider = await loadApiProvider('openai:o3-mini');

// Özel seçeneklerle bir sağlayıcı yükle
const providerWithOptions = await loadApiProvider('azure:chat:test', {
  options: {
    apiHost: 'test-host',
    apiKey: 'test-key',
  },
});
```

### İddia işlevleri

Bir `Assertion` değeri olarak bir `AssertionFunction` alabilir. `AssertionFunction` parametreleri:

- `output`: LLM çıktısı
- `testCase`: test durumu
- `assertion`: iddia nesnesi

<details>
<summary>Tür tanımı</summary>
```typescript
type AssertionFunction = (
  output: string,
  testCase: AtomicTestCase,
  assertion: Assertion,
) => Promise<GradingResult>;

interface GradingResult {
// Test geçip geçmediği
pass: boolean;

// Test puanı, tipik olarak 0 ile 1 arasında
score: number;

// Sonucun düz metin nedeni
reason: string;

// Etiketli ölçümlerin değerlere eşlenmesi
namedScores?: Record<string, number>;

// Bu iddia için belirteç kullanımının kaydı
tokensUsed?: Partial<{
total: number;
prompt: number;
completion: number;
cached?: number;
}>;

// İddia'nın her bir bileşeni için sonuçlar listesi
componentResults?: GradingResult[];

// Değerlendirilen iddia
assertion: Assertion | null;
}

````
</details>

Farklı iddia türleri hakkında daha fazla bilgi için [iddialara ve ölçümlere](/docs/configuration/expected-outputs/) bakın.

## Örnek

`promptfoo`, istem değerlendirmelerini çalıştırmak için kullanabileceğiniz bir `evaluate` işlevi verir.

```js
import promptfoo from 'promptfoo';

const results = await promptfoo.evaluate(
  {
    prompts: ['Rephrase this in French: {{body}}', 'Rephrase this like a pirate: {{body}}'],
    providers: ['openai:gpt-5-mini'],
    tests: [
      {
        vars: {
          body: 'Hello world',
        },
      },
      {
        vars: {
          body: "I'm hungry",
        },
      },
    ],
    writeLatestResults: true, // write results to disk so they can be viewed in web viewer
  },
  {
    maxConcurrency: 2,
  },
);

console.log(results);
````

Bu kod `promptfoo` kütüphanesini içeri aktarır, değerlendirme seçeneklerini tanımlar ve ardından bu seçeneklerle `evaluate` işlevini çağırır.

Ayrıca `prompts`, `providers` veya `asserts` için işlevler sağlayabilirsiniz:

```js
import promptfoo from 'promptfoo';

(async () => {
  const results = await promptfoo.evaluate({
    prompts: [
      'Rephrase this in French: {{body}}',
      (vars) => {
        return `Rephrase this like a pirate: ${vars.body}`;
      },
    ],
    providers: [
      'openai:gpt-5-mini',
      (prompt, context) => {
        // Call LLM here...
        console.log(`Prompt: ${prompt}, vars: ${JSON.stringify(context.vars)}`);
        return {
          output: '<LLM output>',
        };
      },
    ],
    tests: [
      {
        vars: {
          body: 'Hello world',
        },
      },
      {
        vars: {
          body: "I'm hungry",
        },
        assert: [
          {
            type: 'javascript',
            value: (output) => {
              const pass = output.includes("J'ai faim");
              return {
                pass,
                score: pass ? 1.0 : 0.0,
                reason: pass ? 'Output contained substring' : 'Output did not contain substring',
              };
            },
          },
        ],
      },
    ],
  });
  console.log('RESULTS:');
  console.log(results);
})();
```

Github'da tam bir örnek [burada](https://github.com/promptfoo/promptfoo/tree/main/examples/config-node-package) mevcuttur.

JSON formatında örnek çıktı:

```json
{
  "results": [
    {
      "prompt": {
        "raw": "Rephrase this in French: Hello world",
        "display": "Rephrase this in French: {{body}}"
      },
      "vars": {
        "body": "Hello world"
      },
      "response": {
        "output": "Bonjour le monde",
        "tokenUsage": {
          "total": 19,
          "prompt": 16,
          "completion": 3
        }
      }
    },
    {
      "prompt": {
        "raw": "Rephrase this in French: I&#39;m hungry",
        "display": "Rephrase this in French: {{body}}"
      },
      "vars": {
        "body": "I'm hungry"
      },
      "response": {
        "output": "J'ai faim.",
        "tokenUsage": {
          "total": 24,
          "prompt": 19,
          "completion": 5
        }
      }
    }
    // ...
  ],
  "stats": {
    "successes": 4,
    "failures": 0,
    "tokenUsage": {
      "total": 120,
      "prompt": 72,
      "completion": 48
    }
  },
  "table": [
    ["Rephrase this in French: {{body}}", "Rephrase this like a pirate: {{body}}", "body"],
    ["Bonjour le monde", "Ahoy thar, me hearties! Avast ye, world!", "Hello world"],
    [
      "J'ai faim.",
      "Arrr, me belly be empty and me throat be parched! I be needin' some grub, matey!",
      "I'm hungry"
    ]
  ]
}
```

## Sonuçları Paylaşma

Paylaşılabilir bir URL almak için `sharing: true` ile birlikte `writeLatestResults: true` ayarlayın:

```js
const results = await promptfoo.evaluate({
  prompts: ['Your prompt here'],
  providers: ['openai:gpt-5-mini'],
  tests: [{ vars: { input: 'test' } }],
  writeLatestResults: true,
  sharing: true,
});

console.log(results.shareableUrl); // https://app.promptfoo.dev/eval/abc123
```

Bir [Promptfoo Cloud](/docs/enterprise) hesabı veya self-hosted sunucu gerektirir. Self-hosted için, `true` yerine `sharing: { apiBaseUrl, appBaseUrl }` iletin.