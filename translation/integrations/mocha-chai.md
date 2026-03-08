---
sidebar_label: Mocha/Chai
description: Anlamsal benzerlik, olgusallık (factuality) ve özel savlar kullanarak test paketinizde prompt kalitesi kontrollerini otomatikleştirmek için Promptfoo LLM testlerini Mocha ve Chai ile entegre edin.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Mocha/Chai ile Prompt Testi

`promptfoo`, mevcut test ve CI iş akışlarının bir parçası olarak promptları değerlendirmek için [Mocha](https://mochajs.org/) gibi test çerçeveleri ve [Chai](https://www.chaijs.com/) gibi sav (assertion) kütüphaneleriyle entegre edilebilir.

Bu kılavuz, anlamsal benzerlik ve LLM derecelendirmesi kullanarak istenen prompt kalitesi için Mocha test vakalarının nasıl oluşturulacağını gösteren örnekler içerir.

Desteklenen kontroller hakkında daha fazla bilgi için [Savlar ve Metrikler (Assertions & Metrics) belgelerine](/docs/configuration/expected-outputs/) bakın.

## Ön Koşullar

Başlamadan önce şu node paketlerinin kurulu olduğundan emin olun:

- [mocha](https://mochajs.org/#installation): `npm install --save-dev mocha`
- [chai](https://www.chaijs.com/guide/installation/): `npm install --save-dev chai`
- promptfoo: `npm install --save-dev promptfoo`

## Özel Chai Savları Oluşturma

İlk olarak, özel chai savları (assertions) oluşturacağız:

- `toMatchSemanticSimilarity`: İki dizeyi anlamsal benzerlik açısından karşılaştırır.
- `toPassLLMRubric`: Bir dizenin belirtilen LLM Rubric kriterlerini karşılayıp karşılamadığını kontrol eder.
- `toMatchFactuality`: Bir dizenin belirtilen olgusallık (factuality) kriterlerini karşılayıp karşılamadığını kontrol eder.
- `toMatchClosedQA`: Bir dizenin belirtilen soru-cevap kriterlerini karşılayıp karşılamadığını kontrol eder.

`assertions.js` adında yeni bir dosya oluşturun ve şunları ekleyin:

<Tabs>
  <TabItem value="Javascript" label="Javascript" default>

```javascript
import { Assertion } from 'chai';
import { assertions } from 'promptfoo';

const { matchesSimilarity, matchesLlmRubric } = assertions;

Assertion.addAsyncMethod('toMatchSemanticSimilarity', async function (expected, threshold = 0.8) {
  const received = this._obj;
  const result = await matchesSimilarity(received, expected, threshold);
  const pass = received === expected || result.pass;

  this.assert(
    pass,
    `#{this} ifadesinin #{exp} ile anlamsal olarak benzer olması bekleniyordu, ancak uyuşmadı. Sebep: ${result.reason}`,
    `#{this} ifadesinin #{exp} ile anlamsal olarak benzer olmaması bekleniyordu`,
    expected,
  );
});

Assertion.addAsyncMethod('toPassLLMRubric', async function (expected, gradingConfig) {
  const received = this._obj;
  const gradingResult = await matchesLlmRubric(expected, received, gradingConfig);

  this.assert(
    gradingResult.pass,
    `#{this} ifadesinin #{exp} ile LLM Rubric kriterini geçmesi bekleniyordu, ancak geçmedi. Sebep: ${gradingResult.reason}`,
    `#{this} ifadesinin #{exp} ile LLM Rubric kriterini geçmemesi bekleniyordu`,
    expected,
  );
});

Assertion.addAsyncMethod('toMatchFactuality', async function (input, expected, gradingConfig) {
  const received = this._obj;
  const gradingResult = await matchesFactuality(input, expected, received, gradingConfig);

  this.assert(
    gradingResult.pass,
    `#{this} ifadesinin #{exp} ile olgusallık (factuality) açısından uyuşması bekleniyordu, ancak uyuşmadı. Sebep: ${gradingResult.reason}`,
    `#{this} ifadesinin #{exp} ile olgusallık (factuality) açısından uyuşmaması bekleniyordu`,
    expected,
  );
});

Assertion.addAsyncMethod('toMatchClosedQA', async function (input, expected, gradingConfig) {
  const received = this._obj;
  const gradingResult = await matchesClosedQa(input, expected, received, gradingConfig);

  this.assert(
    gradingResult.pass,
    `#{this} ifadesinin #{exp} ile ClosedQA açısından uyuşması bekleniyordu, ancak uyuşmadı. Sebep: ${gradingResult.reason}`,
    `#{this} ifadesinin #{exp} ile ClosedQA açısından uyuşmaması bekleniyordu`,
    expected,
  );
});
```

  </TabItem>
  <TabItem value="Typescript" label="Typescript" default>

```typescript
import { Assertion } from 'chai';
import { assertions } from 'promptfoo';
import type { GradingConfig } from 'promptfoo';

const { matchesSimilarity, matchesLlmRubric } = assertions;

Assertion.addAsyncMethod(
  'toMatchSemanticSimilarity',
  async function (this: Assertion, expected: string, threshold: number = 0.8) {
    const received = this._obj;
    const result = await matchesSimilarity(received, expected, threshold);
    const pass = received === expected || result.pass;

    this.assert(
      pass,
      `#{this} ifadesinin #{exp} ile anlamsal olarak benzer olması bekleniyordu, ancak uyuşmadı. Sebep: ${result.reason}`,
      `#{this} ifadesinin #{exp} ile anlamsal olarak benzer olmaması bekleniyordu`,
      expected,
    );
  },
);

Assertion.addAsyncMethod(
  'toPassLLMRubric',
  async function (this: Assertion, expected: string, gradingConfig: GradingConfig) {
    const received = this._obj;
    const gradingResult = await matchesLlmRubric(expected, received, gradingConfig);

    this.assert(
      gradingResult.pass,
      `#{this} ifadesinin #{exp} ile LLM Rubric kriterini geçmesi bekleniyordu, ancak geçmedi. Sebep: ${gradingResult.reason}`,
      `#{this} ifadesinin #{exp} ile LLM Rubric kriterini geçmemesi bekleniyordu`,
      expected,
    );
  },
);
```

  </TabItem>
</Tabs>

## Testleri Yazma

Test kodumuz, birkaç test vakasını çalıştırmak için bu özel chai savlarını kullanacaktır.

`index.test.js` adında yeni bir dosya oluşturun ve şu kodu ekleyin:

```javascript
import { expect } from 'chai';
import './assertions';

const gradingConfig = {
  provider: 'openai:chat:gpt-5-mini',
};

describe('anlamsal benzerlik testleri', () => {
  it('dizeler anlamsal olarak benzer olduğunda başarılı olmalıdır', async () => {
    await expect('The quick brown fox').toMatchSemanticSimilarity('A fast brown fox');
  });

  it('dizeler anlamsal olarak benzer olmadığında başarısız olmalıdır', async () => {
    await expect('The quick brown fox').not.toMatchSemanticSimilarity('The weather is nice today');
  });

  it('özel eşik değeri ile dizeler anlamsal olarak benzer olduğunda başarılı olmalıdır', async () => {
    await expect('The quick brown fox').toMatchSemanticSimilarity('A fast brown fox', 0.7);
  });

  it('özel eşik değeri ile dizeler anlamsal olarak benzer olmadığında başarısız olmalıdır', async () => {
    await expect('The quick brown fox').not.toMatchSemanticSimilarity(
      'The weather is nice today',
      0.9,
    );
  });
});

describe('LLM değerlendirme testleri', () => {
  it('dizeler LLM Rubric kriterlerini karşıladığında başarılı olmalıdır', async () => {
    await expect('Four score and seven years ago').toPassLLMRubric(
      'Ünlü bir konuşmanın parçasını içerir',
      gradingConfig,
    );
  });

  it('dizeler LLM Rubric kriterlerini karşılamadığında başarısız olmalıdır', async () => {
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
"test": "mocha"
```

Artık şu komutla testleri çalıştırabilirsiniz:

```sh
npm test
```

Bu, testleri yürütecek ve sonuçları terminalde görüntüleyecektir.

Varsayılan sağlayıcıları kullanıyorsanız, `OPENAI_API_KEY` ortam değişkenini ayarlamanız gerektiğini unutmayın.
