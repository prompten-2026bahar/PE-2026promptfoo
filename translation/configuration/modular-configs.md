---
sidebar_position: 999
sidebar_label: Büyük Yapılandırmaları Yönetme
title: Büyük Promptfoo Yapılandırmalarını Yönetme
description: Daha iyi bakım ve yeniden kullanılabilirlik için büyük promptfoo yapılandırmalarını yapılandırmak, organize etmek ve modülarise etmek hakkında bilgi edinin.
keywords:
  [
    promptfoo yapılandırması,
    modüler yapılandırmalar,
    büyük yapılandırma,
    yapılandırma yönetimi,
    yeniden kullanılabilir yapılandırmalar,
    yapılandırma organizasyonu,
    YAML referansları,
    dosya içe aktarımları,
  ]
---

# Büyük Yapılandırmaları Yönetme

Promptfoo değerlendirmeleriniz daha karmaşık hale geldikçe, yapılandırmalarınızı yönetilebilir, bakım yapılabilir ve yeniden kullanılabilir tutmak için stratejiler gerekir. Bu kılavuz, büyük yapılandırmaları organize etmek ve modüler yapmak için en iyi uygulamaları kapsar.

## Ayrı Yapılandırma Dosyaları

Yapılandırmanızı işlevselliğe göre birden fazla dosyaya bölün:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: Ana değerlendirme yapılandırması
prompts: file://configs/prompts.yaml
providers: file://configs/providers.yaml
tests: file://configs/tests/
defaultTest: file://configs/default-test.yaml
```

```yaml title="configs/prompts.yaml"
# İstemler yapılandırması
- file://prompts/system-message.txt
- file://prompts/user-prompt.txt
- id: custom-prompt
  label: Özel İstem
  raw: |
    Yararlı bir asistan olarak hareket et. Lütfen aşağıdaki soruyu cevapla:
    {{question}}
```

```yaml title="configs/providers.yaml"
# Sağlayıcılar yapılandırması
- id: gpt-5.2
  provider: openai:gpt-5.2
  config:
    temperature: 0.7
    max_tokens: 1000
- id: claude-sonnet
  provider: anthropic:claude-sonnet-4-5-20250929
  config:
    temperature: 0.7
    max_tokens: 1000
```

```yaml title="configs/default-test.yaml"
# Varsayılan test yapılandırması
assert:
  - type: llm-rubric
    value: Yanıt yararlı ve doğru olmalıdır
  - type: javascript
    value: output.length > 10 && output.length < 500
```

### Test Durumları Organizasyonu

Test durumlarını etki alanı veya işlevselliğe göre düzenleyin:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: Çok alan değerlendirmesi
prompts: file://prompts/
providers: file://providers.yaml
tests:
  - file://tests/accuracy/
  - file://tests/safety/
  - file://tests/performance/
  - file://tests/edge-cases/
```

```yaml title="tests/accuracy/math-problems.yaml"
# Matematik özgü test durumları
- description: Temel aritmetik
  vars:
    question: 15 + 27 nedir?
  assert:
    - type: contains
      value: '42'
    - type: javascript
      value: /4[2]/.test(output)

- description: Sözel problemler
  vars:
    question: Sarah'nın 3 elması varsa ve 1'ini verirse, kaç tane kalır?
  assert:
    - type: contains
      value: '2'
```

### Ortama Özel Yapılandırmalar

Ortama özel yapılandırmalar oluşturun:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: Üretim değerlendirmesi
prompts: file://prompts/
providers: file://configs/providers-prod.yaml
tests: file://tests/
env: file://configs/env-prod.yaml
```

```yaml title="configs/providers-prod.yaml"
# Oran sınırlandırması olan üretim sağlayıcıları
- id: gpt-5.2-prod
  provider: openai:gpt-5.2
  config:
    temperature: 0.1
    max_tokens: 500
    requestsPerMinute: 100
- id: claude-sonnet-prod
  provider: anthropic:claude-sonnet-4-5-20250929
  config:
    temperature: 0.1
    max_tokens: 500
    requestsPerMinute: 50
```

```yaml title="configs/env-prod.yaml"
# Üretim ortamı değişkenleri
OPENAI_API_KEY: '{{ env.OPENAI_API_KEY_PROD }}'
ANTHROPIC_API_KEY: '{{ env.ANTHROPIC_API_KEY_PROD }}'
LOG_LEVEL: info
```

## YAML Referansları ve Şablonları

Tekrarlamaktan kaçınmak için YAML referanslarını kullanın:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: Yeniden kullanılabilir bileşenlere sahip değerlendirme
prompts: file://prompts/
providers: file://providers.yaml

# Yeniden kullanılabilir iddia şablonları tanımla
assertionTemplates:
  lengthCheck: &lengthCheck
    type: javascript
    value: output.length > 20 && output.length < 500

  qualityCheck: &qualityCheck
    type: llm-rubric
    value: Yanıt açık, yararlı ve iyi yapılandırılmış olmalıdır

  safetyCheck: &safetyCheck
    type: llm-rubric
    value: Yanıt zararlı veya uygunsuz içerik içermemelidir

defaultTest:
  assert:
    - *qualityCheck
    - *safetyCheck

tests:
  - description: Kısa yanıt testi
    vars:
      input: Yapay zeka nedir?
    assert:
      - *lengthCheck
      - *qualityCheck

  - description: Uzun yanıt testi
    vars:
      input: Makine öğrenimini ayrıntılı olarak açıkla
    assert:
      - type: javascript
        value: output.length > 100 && output.length < 2000
      - *qualityCheck
```

## JavaScript ile Dinamik Yapılandırma

Karmaşık mantık için JavaScript yapılandırmalarını kullanın:

```javascript title="promptfooconfig.js"
const baseConfig = {
  description: 'Dinamik yapılandırma örneği',
  prompts: ['file://prompts/base-prompt.txt'],
  providers: ['openai:gpt-5.2', 'anthropic:claude-sonnet-4-5-20250929'],
};

// Test durumlarını programlı olarak oluştur
const categories = ['teknoloji', 'bilim', 'tarih', 'edebiyat'];
const difficulties = ['temel', 'orta', 'ileri'];

const tests = [];
for (const category of categories) {
  for (const difficulty of difficulties) {
    tests.push({
      vars: {
        category,
        difficulty,
        question: `${difficulty} ${category} hakkında bir soru oluştur`,
      },
      assert: [
        {
          type: 'contains',
          value: category,
        },
        {
          type: 'javascript',
          value: `
            const wordCount = output.split(' ').length;
            const minWords = ${difficulty === 'temel' ? 5 : difficulty === 'orta' ? 15 : 30};
            const maxWords = ${difficulty === 'temel' ? 20 : difficulty === 'orta' ? 50 : 100};
            return wordCount >= minWords && wordCount <= maxWords;
          `,
        },
      ],
    });
  }
}

module.exports = {
  ...baseConfig,
  tests,
};
```

## TypeScript Yapılandırması

Promptfoo yapılandırmaları TypeScript'te yazılabilir:

```typescript title="promptfooconfig.ts"
import type { UnifiedConfig } from 'promptfoo';

const config: UnifiedConfig = {
  description: 'Değerlendirme paketim',
  prompts: ['{{topic}} hakkında bana {{style}} anlatın'],
  providers: ['openai:gpt-5.2', 'anthropic:claude-sonnet-4-5-20250929'],
  tests: [
    {
      vars: {
        topic: 'kuantum bilgisayar',
        style: 'basit terimlerle',
      },
      assert: [
        {
          type: 'contains',
          value: 'kuantum',
        },
      ],
    },
  ],
};

export default config;
```

### TypeScript Yapılandırmalarını Çalıştırma

Bir TypeScript yükleyici yükleyin:

```bash
npm install tsx
```

`NODE_OPTIONS` ile çalıştırın:

```bash
NODE_OPTIONS="--import tsx" promptfoo eval -c promptfooconfig.ts
```

### Dinamik Şema Oluşturma

Zod şemalarını uygulamanız ve promptfoo arasında paylaşın:

```typescript title="src/schemas/response.ts"
import { z } from 'zod';

export const ResponseSchema = z.object({
  answer: z.string(),
  confidence: z.number().min(0).max(1),
  sources: z.array(z.string()).nullable(),
});
```

```typescript title="promptfooconfig.ts"
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import type { UnifiedConfig } from 'promptfoo';
import { ResponseSchema } from './src/schemas/response';

const responseFormat = zodResponseFormat(ResponseSchema, 'response');

const config: UnifiedConfig = {
  prompts: ['Bu soruyu cevapla: {{question}}'],
  providers: [
    {
      id: 'openai:gpt-5.2',
      config: {
        response_format: responseFormat,
      },
    },
  ],
  tests: [
    {
      vars: { question: 'TypeScript nedir?' },
      assert: [{ type: 'is-json' }],
    },
  ],
};

export default config;
```

Tam bir uygulama için [ts-config örneğini](https://github.com/promptfoo/promptfoo/tree/main/examples/ts-config) bakın.

## Koşullu Yapılandırma Yükleme

Ortama göre uyum sağlayan yapılandırmalar oluşturun:

```javascript title="promptfooconfig.js"
const isQuickTest = process.env.TEST_MODE === 'quick';
const isComprehensive = process.env.TEST_MODE === 'comprehensive';

const baseConfig = {
  description: 'Test modu uyarlanabilir yapılandırma',
  prompts: ['file://prompts/'],
};

// Hızlı test yapılandırması
if (isQuickTest) {
  module.exports = {
    ...baseConfig,
    providers: [
      'openai:gpt-5.1-mini', // Hızlı test için daha hızlı, daha ucuz
    ],
    tests: 'file://tests/quick/', // Daha küçük test süresi
    env: {
      LOG_LEVEL: 'debug',
    },
  };
}

// Kapsamlı test yapılandırması
if (isComprehensive) {
  module.exports = {
    ...baseConfig,
    providers: [
      'openai:gpt-5.2',
      'anthropic:claude-sonnet-4-5-20250929',
      'google:gemini-2.5-flash',
    ],
    tests: 'file://tests/comprehensive/', // Tam test süresi
    env: {
      LOG_LEVEL: 'info',
    },
    writeLatestResults: true,
  };
}
```

## Dizin Yapısı

Yapılandırma dosyalarınızı mantıksal bir hiyerarşi içinde düzenleyin:

```
project/
├── promptfooconfig.yaml              # Ana yapılandırma
├── configs/
│   ├── providers/
│   │   ├── development.yaml
│   │   ├── staging.yaml
│   │   └── production.yaml
│   ├── prompts/
│   │   ├── system-prompts.yaml
│   │   ├── user-prompts.yaml
│   │   └── templates.yaml
│   └── defaults/
│       ├── assertions.yaml
│       └── test-config.yaml
├── tests/
│   ├── accuracy/
│   ├── safety/
│   ├── performance/
│   └── edge-cases/
├── prompts/
│   ├── system/
│   ├── user/
│   └── templates/
└── scripts/
    ├── config-generators/
    └── utilities/
```

## Ayrıca Bkz.

- [Yapılandırma Kılavuzu](./guide.md) - Temel yapılandırma kavramları
- [Yapılandırma Referansı](./reference.md) - Eksiksiz yapılandırma seçenekleri
- [Test Durumları](./test-cases.md) - Test durumlarını organize etme
- [İstemler](./prompts.md) - İstemler ve şablonları yönetme
- [Sağlayıcılar](/docs/providers/) - LLM sağlayıcılarını yapılandırma