---
sidebar_label: Jest & Vitest
description: Anlamsal benzerlik, olgusallık (factuality) kontrolleri ve otomatik prompt kalitesi doğrulama için özel eşleştiricilerle LLM testlerini Jest ve Vitest iş akışlarınıza dahil edin.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import JestExampleImage from '../assets/jest-example.png';

# Jest ve Vitest ile Prompt Testi

`promptfoo`, mevcut test ve CI iş akışlarının bir parçası olarak promptları değerlendirmek için [Jest](https://jestjs.io/) ve [Vitest](https://vitest.dev/) gibi test çerçeveleriyle (framework) entegre edilebilir.

Bu kılavuz, anlamsal benzerlik ve LLM derecelendirmesi kullanarak istenen prompt kalitesi için nasıl test vakaları oluşturulacağını gösteren örnekler içerir. Ayrıca doğrudan [tam örnek koda](https://github.com/promptfoo/promptfoo/tree/main/examples/jest-integration) göz atabilirsiniz.

Desteklenen kontroller hakkında daha fazla bilgi için [Savlar ve Metrikler (Assertions & Metrics) belgelerine](/docs/configuration/expected-outputs/) bakın.

## Ön Koşullar

Başlamadan önce şu node paketlerinin kurulu olduğundan emin olun:

- [jest](https://jestjs.io/docs/getting-started): `npm install --save-dev jest`
- [vitest](https://vitest.dev/guide/): `npm install --save-dev vitest`
- promptfoo: `npm install --save-dev promptfoo`

## Özel Eşleştiriciler Oluşturma

İlk olarak, özel eşleştiriciler (custom matchers) oluşturacağız:

- `toMatchSemanticSimilarity`: İki dizeyi anlamsal benzerlik açısından karşılaştırır.
- `toPassLLMRubric`: Bir dizenin belirtilen LLM Rubric kriterlerini karşılayıp karşılamadığını kontrol eder.
- `toMatchFactuality`: Bir dizenin belirtilen olgusallık (factuality) kriterlerini karşılayıp karşılamadığını kontrol eder.
- `toMatchClosedQA`: Bir dizenin belirtilen soru-cevap kriterlerini karşılayıp karşılamadığını kontrol eder.

`matchers.js` adında yeni bir dosya oluşturun ve şunları ekleyin:

<Tabs>
  <TabItem value="Javascript" label="Javascript" default>

```javascript
import { assertions } from 'promptfoo';

const { matchesSimilarity, matchesLlmRubric } = assertions;

export function installMatchers() {
  expect.extend({
    async toMatchSemanticSimilarity(received, expected, threshold = 0.8) {
      const result = await matchesSimilarity(received, expected, threshold);
      const pass = received === expected || result.pass;
      if (pass) {
        return {
          message: () => `beklenen: ${received}, ${expected} ile anlamsal benzerliğe SAHİP OLMAMALIYDI`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `beklenen: ${received}, ${expected} ile anlamsal olarak benzer OLMALIYDI, ancak uyuşmadı. Sebep: ${result.reason}`,
          pass: false,
        };
      }
    },

    async toPassLLMRubric(received, expected, gradingConfig) {
      const gradingResult = await matchesLlmRubric(expected, received, gradingConfig);
      if (gradingResult.pass) {
        return {
          message: () => `beklenen: ${received}, ${expected} ile LLM Rubric kriterini GEÇMEMELİYDİ`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `beklenen: ${received}, ${expected} ile LLM Rubric kriterini GEÇMELİYDİ, ancak geçmedi. Sebep: ${gradingResult.reason}`,
          pass: false,
        };
      }
    },

    async toMatchFactuality(input, expected, received, gradingConfig) {
      const gradingResult = await matchesFactuality(input, expected, received, gradingConfig);
      if (gradingResult.pass) {
        return {
          message: () => `beklenen: ${received}, ${expected} ile olgusallık (factuality) açısından UYUŞMAMALIYDI`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `beklenen: ${received}, ${expected} ile olgusallık (factuality) açısından UYUŞMALIYDI, ancak uyuşmadı. Sebep: ${gradingResult.reason}`,
          pass: false,
        };
      }
    },

    async toMatchClosedQA(input, expected, received, gradingConfig) {
      const gradingResult = await matchesClosedQa(input, expected, received, gradingConfig);
      if (gradingResult.pass) {
        return {
          message: () => `beklenen: ${received}, ${expected} ile ClosedQA açısından UYUŞMAMALIYDI`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `beklenen: ${received}, ${expected} ile ClosedQA açısından UYUŞMALIYDI, ancak uyuşmadı. Sebep: ${gradingResult.reason}`,
          pass: false,
        };
      }
    },
  });
}
```

  </TabItem>
  <TabItem value="Typescript" label="Typescript" default>

```typescript
import { assertions } from 'promptfoo';
import type { GradingConfig } from 'promptfoo';

const { matchesSimilarity, matchesLlmRubric } = assertions;

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchSemanticSimilarity(expected: string, threshold?: number): R;
      toPassLLMRubric(expected: string, gradingConfig: GradingConfig): R;
    }
  }
}

export function installMatchers() {
  expect.extend({
    async toMatchSemanticSimilarity(
      received: string,
      expected: string,
      threshold: number = 0.8,
    ): Promise<jest.CustomMatcherResult> {
      const result = await matchesSimilarity(received, expected, threshold);
      const pass = received === expected || result.pass;
      if (pass) {
        return {
          message: () => `beklenen: ${received}, ${expected} ile anlamsal benzerliğe SAHİP OLMAMALIYDI`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `beklenen: ${received}, ${expected} ile anlamsal olarak benzer OLMALIYDI, ancak uyuşmadı. Sebep: ${result.reason}`,
          pass: false,
        };
      }
    },

    async toPassLLMRubric(
      received: string,
      expected: string,
      gradingConfig: GradingConfig,
    ): Promise<jest.CustomMatcherResult> {
      const gradingResult = await matchesLlmRubric(expected, received, gradingConfig);
      if (gradingResult.pass) {
        return {
          message: () => `beklenen: ${received}, ${expected} ile LLM Rubric kriterini GEÇMEMELİYDİ`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `beklenen: ${received}, ${expected} ile LLM Rubric kriterini GEÇMELİYDİ, ancak geçmedi. Sebep: ${gradingResult.reason}`,
          pass: false,
        };
      }
    },
  });
}
```

  </TabItem>
</Tabs>

## Testleri Yazma

Test kodumuz, birkaç test vakasını çalıştırmak için bu özel eşleştiricileri kullanacaktır.

`index.test.js` adında yeni bir dosya oluşturun ve şu kodu ekleyin:

```javascript
import { installMatchers } from './matchers';

installMatchers();

const gradingConfig = {
  provider: 'openai:chat:gpt-5-mini',
};

describe('anlamsal benzerlik testleri', () => {
  test('dizeler anlamsal olarak benzer olduğunda başarılı olmalıdır', async () => {
    await expect('The quick brown fox').toMatchSemanticSimilarity('A fast brown fox');
  });

  test('dizeler anlamsal olarak benzer olmadığında başarısız olmalıdır', async () => {
    await expect('The quick brown fox').not.toMatchSemanticSimilarity('The weather is nice today');
  });

  test('özel eşik değeri ile dizeler anlamsal olarak benzer olduğunda başarılı olmalıdır', async () => {
    await expect('The quick brown fox').toMatchSemanticSimilarity('A fast brown fox', 0.7);
  });

  test('özel eşik değeri ile dizeler anlamsal olarak benzer olmadığında başarısız olmalıdır', async () => {
    await expect('The quick brown fox').not.toMatchSemanticSimilarity(
      'The weather is nice today',
      0.9,
    );
  });
});

describe('LLM değerlendirme testleri', () => {
  test('dizeler LLM Rubric kriterlerini karşıladığında başarılı olmalıdır', async () => {
    await expect('Four score and seven years ago').toPassLLMRubric(
      'Ünlü bir konuşmanın parçasını içerir',
      gradingConfig,
    );
  });

  test('dizeler LLM Rubric kriterlerini karşılamadığında başarısız olmalıdır', async () => {
    await expect('Çamaşır yıkama zamanı geldi').not.toPassLLMRubric(
      'Ünlü bir konuşmanın parçasını içerir',
      gradingConfig,
    );
  });
});
```

## Son Yapılandırma

`package.json` dosyanızdaki `scripts` bölümüne şu satırı ekleyin:

```json
"test": "jest"
```

Artık şu komutla testleri çalıştırabilirsiniz:

```sh
npm test
```

Bu, testleri yürütecek ve sonuçları terminalde görüntüleyecektir.

Varsayılan sağlayıcıları kullanıyorsanız, `OPENAI_API_KEY` ortam değişkenini ayarlamanız gerektiğini unutmayın.

<img src={JestExampleImage} />
