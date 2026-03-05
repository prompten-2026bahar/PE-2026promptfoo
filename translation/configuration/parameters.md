---
displayed_sidebar: promptfoo
sidebar_label: Genel Bakış
title: Yapılandırma Genel Bakışı - İstemler, Testler ve Çıktılar
description: İstemler, test durumları, çıktılar ve LLM değerlendirmesi için yaygın desenler dahil olmak üzere promptfoo'nun temel yapılandırma kavramlarının hızlı genel bakışı.
keywords:
  [
    promptfoo genel bakışı,
    yapılandırma temelleri,
    istem kurulumu,
    test durumları,
    çıktı biçimleri,
    değerlendirme iş akışı,
  ]
pagination_prev: configuration/reference
pagination_next: configuration/prompts
---

# İstemler, testler ve çıktılar

Promptfoo'nun LLM uygulamalarınızı nasıl değerlendirdiğini yapılandırın.

:::tip Ayrıntılı Belgeler
Kapsamlı kılavuzlar için bkz. adanmış sayfalar:

- **[İstemler](/docs/configuration/prompts)** - LLM'lere ne gönderdiğinizi yapılandırın
- **[Test Durumları](/docs/configuration/test-cases)** - Değerlendirme senaryoları ayarlayın
- **[Çıktı Biçimleri](/docs/configuration/outputs)** - Sonuçları kaydedin ve analiz edin
  :::

## Hızlı Başlangıç

```yaml title="promptfooconfig.yaml"
# İstemlerinizi tanımla
prompts:
  - 'Şu dile çevir {{language}}: {{text}}'

# Test durumlarını yapılandır
tests:
  - vars:
      language: Fransızca
      text: Merhaba dünya
    assert:
      - type: contains
        value: Bonjour
# Değerlendirmeyi çalıştır
# promptfoo eval
```

## Temel Kavramlar

### 📝 [İstemler](/docs/configuration/prompts)

LLM'lerinize ne gönderdiğinizi tanımlayın - basit dizelerden karmaşık sohbetlere.

<details>
<summary><strong>Yaygın desenler</strong></summary>

**Metin istemler**

```yaml
prompts:
  - 'Şunu özetle: {{content}}'
  - file://prompts/customer_service.txt
```

**Sohbet konuşmaları**

```yaml
prompts:
  - file://prompts/chat.json
```

**Dinamik istemler**

```yaml
prompts:
  - file://generate_prompt.js
  - file://create_prompt.py
```

</details>

[İstemler hakkında daha fazla bilgi →](/docs/configuration/prompts)

### 🧪 [Test Durumları](/docs/configuration/test-cases)

Değişkenler ve iddialarla değerlendirme senaryolarını yapılandırın.

<details>
<summary><strong>Yaygın desenler</strong></summary>

**Satır içi testler**

```yaml
tests:
  - vars:
      question: "2+2 nedir?"
    assert:
      - type: equals
        value: '4'
```

**CSV test verileri**

```yaml
tests: file://test_cases.csv
```

**HuggingFace veri setleri**

```yaml
tests: huggingface://datasets/rajpurkar/squad
```

**Dinamik oluşturma**

```yaml
tests: file://generate_tests.js
```

</details>

[Test durumları hakkında daha fazla bilgi →](/docs/configuration/test-cases)

### 📊 [Çıktı Biçimleri](/docs/configuration/outputs)

Değerlendirme sonuçlarınızı kaydedin ve analiz edin.

<details>
<summary><strong>Kullanılabilir biçimler</strong></summary>

```bash
# Görsel rapor
promptfoo eval --output results.html

# Veri analizi
promptfoo eval --output results.json

# Elektronik tablo
promptfoo eval --output results.csv
```

</details>

[Çıktılar hakkında daha fazla bilgi →](/docs/configuration/outputs)

## Tam Örnek

Birden fazla özelliği birleştiren gerçek dünyadaki bir örnek:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: Müşteri hizmetleri sohbet botu değerlendirmesi

prompts:
  # Basit metin istemi
  - 'Yararlı bir müşteri hizmetleri ajanı olarak davran. {{query}}'

  # Sohbet konuşması biçimi
  - file://prompts/chat_conversation.json

  # Mantık ile dinamik istem
  - file://prompts/generate_prompt.js

providers:
  - openai:gpt-5-mini
  - anthropic:claude-3-haiku

tests:
  # Satır içi test durumları
  - vars:
      query: 'Bir ürünü iade etmem gerekiyor'
    assert:
      - type: contains
        value: 'iade politikası'
      - type: llm-rubric
        value: 'Yanıt yararlı ve profesyoneldir'

  # CSV'den daha fazla testi yükle
  - file://test_scenarios.csv

# Sonuçları kaydet
outputPath: evaluations/customer_service_results.html
```

## Hızlı Referans

### Desteklenen Dosya Biçimleri

| Biçim                | İstemler | Testler | Kullanım Durumu                     |
| -------------------- | ------- | ----- | ----------------------------------- |
| `.txt`               | ✅      | ❌    | Basit metin istemler                 |
| `.json`              | ✅      | ✅    | Sohbet konuşmaları, yapılandırılmış veriler |
| `.yaml`              | ✅      | ✅    | Karmaşık yapılandırmalar              |
| `.csv`               | ✅      | ✅    | Toplu veriler, birden fazla varyant        |
| `.js`/`.ts`          | ✅      | ✅    | Mantık ile dinamik oluşturma       |
| `.py`                | ✅      | ✅    | Python tabanlı oluşturma             |
| `.md`                | ✅      | ❌    | Markdown biçimli istemler          |
| `.j2`                | ✅      | ❌    | Jinja2 şablonları                    |
| HuggingFace veri setleri | ❌      | ✅    | Mevcut veri setlerinden alma       |

### Değişken Söz Dizimi

Değişkenler [Nunjucks](https://mozilla.github.io/nunjucks/) şablon oluşturmayı kullanır:

```yaml
# Temel ikame
prompt: "Merhaba {{name}}"

# Filtreler
prompt: "ACİL: {{message | upper}}"

# Koşullu ifadeler
prompt: "{% if premium %}Premium destek: {% endif %}{{query}}"
```

### Dosya Referansları

Tüm dosya yolları yapılandırma dosyasına göre bağlıdır:

```yaml
# Tek dosya
prompts:
  - file://prompts/main.txt

# Glob ile birden fazla dosya
tests:
  - file://tests/*.yaml

# Belirli işlev
prompts:
  - file://generate.js:createPrompt
```

`path/to/prompts/**/*.py:func_name` gibi joker karakterler de desteklenir.

## Sonraki Adımlar

- **[İstemler](/docs/configuration/prompts)** - İstem yapılandırmasına detaylı bakış
- **[Test Durumları](/docs/configuration/test-cases)** - Test senaryoları ve iddialar hakkında bilgi edinin
- **[HuggingFace Veri Setleri](/docs/configuration/huggingface-datasets)** - Mevcut veri setlerinden test durumlarını alma
- **[Çıktı Biçimleri](/docs/configuration/outputs)** - Değerlendirme sonuçlarını anlayın
- **[Beklenen Çıktılar](/docs/configuration/expected-outputs)** - İddialar yapılandırın
- **[Yapılandırma Referansı](/docs/configuration/reference)** - Tüm yapılandırma seçenekleri