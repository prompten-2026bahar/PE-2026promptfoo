---
title: OpenAI Ajanları (Agents)
description: promptfoo içinde araçlar, devir teslimler ve izleme ile çok turlu OpenAI Ajanlarını test edin.
keywords:
  [
    openai ajanları,
    çok turlu iş akışları,
    ajan araçları,
    ajan devir teslimleri,
    ajan sistemleri,
    fonksiyon çağırma,
    opentelemetry izleme,
  ]
sidebar_label: OpenAI Ajanları
---

# OpenAI Ajanları (Agents)

[@openai/agents](https://github.com/openai/openai-agents-js) SDK'sı ile oluşturulmuş çok turlu ajan iş akışlarını test edin. Araç kullanan, uzmanlar arasında devir teslim yapan ve çok adımlı görevleri yerine getiren ajanları değerlendirin.

## Ön Koşullar

- SDK'yı yükleyin: `npm install @openai/agents`
- `OPENAI_API_KEY` ortam değişkenini ayarlayın
- Ajan tanımı (satır içi veya bir TypeScript/JavaScript dosyasında)

## Temel Kullanım

```yaml
providers:
  - openai:agents:my-agent
    config:
      agent:
        name: Müşteri Destek Ajanı
        model: gpt-5-mini
        instructions: Yardımsever bir müşteri destek ajanısınız.
      maxTurns: 10
```

## Yapılandırma Seçenekleri

| Parametre          | Açıklama                                                  | Varsayılan            |
| ------------------ | --------------------------------------------------------- | --------------------- |
| `agent`            | Ajan tanımı (satır içi nesne veya `file://yol`)           | -                     |
| `tools`            | Araç tanımları (satır içi dizi veya `file://yol`)         | -                     |
| `handoffs`         | Ajan devir teslim tanımları (satır içi dizi veya `file://yol`) | -                     |
| `maxTurns`         | Maksimum konuşma turu                                     | 10                    |
| `model`            | Ajan tanımında belirtilen modeli geçersiz kılar           | -                     |
| `modelSettings`    | Model parametreleri (temperature, topP, maxTokens)       | -                     |
| `inputGuardrails`  | Giriş doğrulama korumaları (inline dizi veya `file://`)   | -                     |
| `outputGuardrails` | Çıkış doğrulama korumaları (inline dizi veya `file://`)  | -                     |
| `tracing`          | OpenTelemetry OTLP izlemeyi etkinleştir                   | false                 |
| `otlpEndpoint`     | İzleme için özel OTLP uç nokta URL'si                     | http://localhost:4318 |

## Dosya Tabanlı Yapılandırma

Ajanı ve araçları harici dosyalardan yükleyin:

```yaml
providers:
  - openai:agents:support-agent
    config:
      agent: file://./agents/support-agent.ts
      tools: file://./tools/support-tools.ts
      maxTurns: 15
      tracing: true
```

**Örnek ajan dosyası (`agents/support-agent.ts`):**

```typescript
import { Agent } from '@openai/agents';

export default new Agent({
  name: 'Destek Ajanı',
  model: 'gpt-5-mini',
  instructions: 'Yardımsever bir müşteri destek ajanısınız.',
});
```

**Örnek araçlar dosyası (`tools/support-tools.ts`):**

```typescript
import { tool } from '@openai/agents';
import { z } from 'zod';

export const lookupOrder = tool({
  name: 'lookup_order',
  description: 'Sipariş kimliğine göre sipariş durumunu ara',
  parameters: z.object({
    order_id: z.string().describe('Sipariş kimliği'),
  }),
  execute: async ({ order_id }) => {
    return { status: 'shipped', tracking: 'ABC123' };
  },
});

export default [lookupOrder];
```

## Ajan Devir Teslimleri (Handoffs)

Konuşmaları uzmanlaşmış ajanlar arasında transfer edin:

```yaml
providers:
  - openai:agents:triage
    config:
      agent:
        name: Triyaj Ajanı
        model: gpt-5-mini
        instructions: Soruları uygun uzmana yönlendirir.
      handoffs:
        - agent:
            name: Teknik Destek
            model: gpt-5-mini
            instructions: Teknik sorun giderme işlemlerini yürütür.
          description: Teknik sorunlar için transfer
```

## Korumalar (Guardrails)

Araç girişlerini ve çıkışlarını korumalarla (SDK v0.3.8 ile eklendi) doğrulayın:

```yaml
providers:
  - openai:agents:secure-agent
    config:
      agent: file://./agents/secure-agent.ts
      inputGuardrails: file://./guardrails/input-guardrails.ts
      outputGuardrails: file://./guardrails/output-guardrails.ts
```

Korumalar, araç yürütülmeden önce (giriş) ve sonra (çıkış) doğrulama mantığını çalıştırarak içerik filtreleme, PII tespiti veya özel iş kurallarını etkinleştirir.

## İzleme (Tracing)

Ajan yürütme hatalarını ayıklamak için OpenTelemetry izlemeyi etkinleştirin:

```yaml
providers:
  - openai:agents:my-agent
    config:
      agent: file://./agents/my-agent.ts
      tracing: true # http://localhost:4318 adresine aktarır
```

Özel bir OTLP uç noktası ile:

```yaml
providers:
  - openai:agents:my-agent
    config:
      agent: file://./agents/my-agent.ts
      tracing: true
      otlpEndpoint: https://otel-collector.example.com:4318
```

Veya küresel olarak etkinleştirin:

```bash
export PROMPTFOO_TRACING_ENABLED=true
npx promptfoo eval
```

İzlemeler; ajan yürütme aralıklarını (spans), araç çağrılarını, model çağrılarını, devir teslim olaylarını ve token kullanımını içerir.

## Örnek: D&D Zindan Efendisi (Dungeon Master)

D&D mekanikleri, zar atma ve karakter yönetimi içeren tam çalışan örnek:

```yaml
description: Yapay Zeka Zindan Efendisi ile D&D Macerası
description: D&D Adventure with AI Dungeon Master

prompts:
  - '{{query}}'

providers:
  - id: openai:agents:dungeon-master
    config:
      agent: file://./agents/dungeon-master-agent.ts
      tools: file://./tools/game-tools.ts
      maxTurns: 20
      tracing: true

tests:
  - description: Saldırı zarı ile ejderha dövüşü
    vars:
      query: 'Uzun kılıcımı çekiyorum ve kırmızı ejderhaya saldırıyorum!'
    assert:
      - type: llm-rubric
        value: Yanıt, saldırı ve hasar için zar atışlarını içerir

  - description: Karakter istatistiklerini kontrol et
    vars:
      query: 'Karakter istatistiklerim ve mevcut canım (HP) nedir?'
    assert:
      - type: contains-any
        value: ['Thorin', 'Savaşçı', 'seviye 5']
```

:::tip

Etkileşimli örneği deneyin: `npx promptfoo@latest init --example openai-agents-basic`

:::

## Ortam Değişkenleri

| Değişken                    | Açıklama                          |
| --------------------------- | --------------------------------- |
| `OPENAI_API_KEY`            | OpenAI API anahtarı (gerekli)     |
| `PROMPTFOO_TRACING_ENABLED` | İzlemeyi küresel olarak etkinleştir |
| `OPENAI_BASE_URL`           | Özel OpenAI API temel URL'si      |
| `OPENAI_ORGANIZATION`       | OpenAI organizasyon kimliği       |

## Sınırlamalar

:::warning

Araçlar eşzamansız (async) fonksiyonlar olmalıdır. Senkronize araçlar çalışma zamanı hatalarına neden olur.

:::

- Ajan tanımlama dosyaları TypeScript veya JavaScript olmalıdır
- Dosya yolları `file://` önekini gerektirir (göreli yollar yapılandırma dosyasının konumundan çözümlenir)
- Varsayılan maksimum: 10 tur (`maxTurns` ile yapılandırın)

## İlgili Belgeler

- [OpenAI Sağlayıcısı](/docs/providers/openai) - Standart OpenAI tamamlamaları ve sohbet
- [Kırmızı Ekip Rehberi](/docs/red-team/quickstart) - Ajan güvenliğini test edin
- [İddialar (Assertions)](/docs/configuration/expected-outputs) - Ajan yanıtlarını doğrulayın
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-js) - Resmi SDK belgeleri
