---
sidebar_position: 13
sidebar_label: Senaryolar
title: Senaryo Yapılandırması - Testleri ve Verileri Gruplama
description: Değerlendirme testleriyle test verilerini gruplandırmak için senaryoları yapılandırın. promptfoo'da birden fazla test kombinasyonunu verimli bir şekilde nasıl organize edeceğinizi ve çalıştıracağınızı öğrenin.
keywords:
  [
    test senaryoları,
    gruplandırılmış test,
    test organizasyonu,
    veri kombinasyonları,
    değerlendirme senaryoları,
    test yönetimi,
  ]
pagination_prev: configuration/test-cases
pagination_next: configuration/datasets
---

# Senaryolar

`scenarios` yapılandırması, bir set verisi ile o verilerde çalıştırılması gereken bir test setini gruplandırmanıza olanak tanır.
Bu, aynı test setini geniş bir yelpazedeki girişlerle test etmek istediğinizde çok yararlıdır.

## Örnek

Bir dil çevirisi uygulamasının örneğini alalım. Sistemin üç cümleyi ('Hello world', 'Good morning', and 'How are you?') İngilizceden üç farklı dile (İspanyolca, Fransızca ve Almanca) doğru bir şekilde çevirebilip çeviremediğini test etmek istiyoruz.

```text title="prompts.txt"
You're a translator. Translate this into {{language}}: {{input}}
---
Speak in {{language}}: {{input}}
```

Her kombinasyon için bireysel `tests` oluşturmak yerine,
bu verileri ve test/onaylamaları gruplandıran bir `scenarios` oluşturabiliriz:

```yaml title="promptfooconfig.yaml"
scenarios:
  - config:
      - vars:
          language: Spanish
          expectedHelloWorld: 'Hola mundo'
          expectedGoodMorning: 'Buenos días'
          expectedHowAreYou: '¿Cómo estás?'
      - vars:
          language: French
          expectedHelloWorld: 'Bonjour le monde'
          expectedGoodMorning: 'Bonjour'
          expectedHowAreYou: 'Comment ça va?'
      - vars:
          language: German
          expectedHelloWorld: 'Hallo Welt'
          expectedGoodMorning: 'Guten Morgen'
          expectedHowAreYou: 'Wie geht es dir?'
    tests:
      - description: Translated Hello World
        vars:
          input: 'Hello world'
        assert:
          - type: similar
            value: '{{expectedHelloWorld}}'
            threshold: 0.90
      - description: Translated Good Morning
        vars:
          input: 'Good morning'
        assert:
          - type: similar
            value: '{{expectedGoodMorning}}'
            threshold: 0.90
      - description: Translated How are you?
        vars:
          input: 'How are you?'
        assert:
          - type: similar
            value: '{{expectedHowAreYou}}'
            threshold: 0.90
```

Bu, her dil ve giriş cümlesi kombinasyonu için bir test matrisi oluşturacak ve aynı onaylama setini her birine karşı çalıştıracaktır.

Bu örneğin tam kaynağı [`examples/multiple-translations`][1] içinde bulunmaktadır.

## Yapılandırma

`scenarios` yapılandırması, `Scenario` nesnelerinin bir dizisidir. Her `Scenario`'nun iki ana bölümü vardır:

- `config`: `vars` nesnelerinin bir dizisi. Her `vars` nesnesi, testlere geçirilecek bir değişken setini temsil eder.
- `tests`: `TestCase` nesnelerinin bir dizisi. Bunlar, `config`'deki her değişken seti için çalıştırılacak testlerdir.

İşte bir `Scenario`'nun yapısı:

| Özellik     | Tür                   | Gerekli | Açıklama                                                           |
| ----------- | --------------------- | ------- | ------------------------------------------------------------------ |
| description | `string`              | Hayır   | Test ettiğiniz şeyin isteğe bağlı açıklaması                       |
| config      | `Partial<TestCase>[]` | Evet    | Değişken setlerinin bir dizisi. Her set testlerden geçirilecektir. |
| tests       | `TestCase[]`          | Evet    | Her değişken seti üzerinde çalıştırılacak testler.                 |

Senaryolar ayrıca harici dosyalardan da yüklenebilir. Harici bir dosyaya başvurmak için `file://` önekini kullanın:

```yaml
scenarios:
  - file://path/to/your/scenario.yaml
```

Harici dosya, satır içi senaryolarla aynı yapıyı izlemelidir.

### Glob Desenlerini Kullanma

Birden fazla senaryo dosyasını aynı anda yüklemek için glob desenlerini kullanabilirsiniz:

```yaml
scenarios:
  - file://scenarios/*.yaml # scenarios dizinindeki tüm YAML dosyaları
  - file://scenarios/unit-*.yaml # unit-*.yaml ile eşleşen tüm dosyalar
  - file://scenarios/**/*.yaml # alt dizinlerdeki tüm YAML dosyaları
```

Glob desenleri kullanırken, eşleşen tüm dosyalar yüklenir ve senaryoları otomatik olarak tek bir diziye düzleştirilir. Bu, büyük test paketlerini organize etmek için yararlıdır:

```
scenarios/
├── unit/
│   ├── auth-scenarios.yaml
│   └── api-scenarios.yaml
└── integration/
    ├── workflow-scenarios.yaml
    └── e2e-scenarios.yaml
```

Glob desenlerini doğrudan dosya başvurularıyla karıştırabilirsiniz:

```yaml
scenarios:
  - file://scenarios/critical.yaml # Belirli dosya
  - file://scenarios/unit/*.yaml # Tüm birim test senaryoları
```

Bu işlevsellik, her birini manuel olarak oluşturmak zorunda kalmadan geniş bir yelpazede testleri kolayca çalıştırmanıza olanak tanır. Aynı zamanda yapılandırma dosyanızı daha temiz ve okunması kolay tutar.

[1]: https://github.com/promptfoo/promptfoo/tree/main/examples/multiple-translations