---
sidebar_position: 12
sidebar_label: Test Cases
title: Test Case Configuration - Variables, Assertions, and Data
description: Configure test cases for LLM evaluation with variables, assertions, CSV data, and dynamic generation. Learn inline tests, external files, and media support.
keywords:
  [
    test cases,
    LLM testing,
    evaluation data,
    assertions,
    CSV tests,
    variables,
    dynamic testing,
    test automation,
  ]
pagination_prev: configuration/prompts
pagination_next: configuration/scenarios
---

# Test Case Yapılandırması

Değişkenler, iddialar ve test verileri ile değerlendirme senaryoları tanımlayın.

## İçe Gömülü Testler

Testleri doğrudan yapılandırmanızda tanımlamanın en basit yolu:

```yaml title="promptfooconfig.yaml"
tests:
  - vars:
      question: 'Fransa\'nın başkenti nedir?'
    assert:
      - type: contains
        value: 'Paris'

  - vars:
      question: '2 + 2 nedir?'
    assert:
      - type: equals
        value: '4'
```

### Test Yapısı

Her test durumu içerebilir:

```yaml
tests:
  - description: 'İsteğe bağlı test açıklaması'
    vars:
      # Prompt\'larda yerine konacak değişkenler
      var1: value1
      var2: value2
    assert:
      # Beklenen çıktılar ve doğrulamalar
      - type: contains
        value: 'beklenen metin'
    metadata:
      # Filtrelenebilir metadata
      category: math
      difficulty: easy
```

### Testleri Sağlayıcıya Göre Filtreleme

`providers` alanını kullanarak belirli testlerin hangi sağlayıcılarda çalışacağını kontrol edin. Bu, bir tek değerlendirmede farklı test setlerini farklı modellere karşı çalıştırmanıza olanak tanır:

```yaml
providers:
  - id: openai:gpt-3.5-turbo
    label: fast-model
  - id: openai:gpt-4
    label: smart-model

tests:
  # Sadece fast-model üzerinde çalış
  - vars:
      question: '2 + 2 nedir?'
    providers:
      - fast-model
    assert:
      - type: equals
        value: '4'

  # Sadece smart-model üzerinde çalış
  - vars:
      question: 'Kuantum dolanıklığını açıklayın'
    providers:
      - smart-model
    assert:
      - type: llm-rubric
        value: 'Doğru fizik açıklaması sağlar'
```

**Eşleştirme söz dizimi:**

| Pattern        | Eşleştirir                                                       |
| -------------- | --------------------------------------------------------------- |
| `fast-model`   | Tam label eşleşmesi                                             |
| `openai:gpt-4` | Tam sağlayıcı ID eşleşmesi                                      |
| `openai:*`     | Wildcard - `openai:` ile başlayan herhangi bir sağlayıcı        |
| `openai`       | Legacy prefix - `openai:gpt-4`, `openai:gpt-3.5-turbo` vb. ile eşleşir |

**`defaultTest` ile tüm testlere uygulayın:**

```yaml
defaultTest:
  providers:
    - openai:* # Tüm testler varsayılan olarak sadece OpenAI sağlayıcılarına

tests:
  - vars:
      question: 'Basit soru'
  - vars:
      question: 'Karmaşık soru'
    providers:
      - smart-model # Bu test için varsayılanı geçersiz kıl
```

**Sınır durumları:**

- **Filtre yok**: `providers` alanı olmadan test tüm sağlayıcılara karşı çalışır (çapraz ürün davranışı)
- **Boş dizi**: `providers: []` testi hiçbir sağlayıcıda çalıştırmadığını ve etkili olarak atlandığını anlamına gelir
- **`providerPromptMap` ile yığın**: Hem `providers` hem de `providerPromptMap` ayarlandığında, bunlar birlikte filtreler—bir sağlayıcı çalışmak için her ikisine de eşleşmelidir
- **CLI `--filter-providers`**: Sağlayıcıları CLI düzeyinde filtrelemek için `--filter-providers` kullanırsanız, doğrulama sadece filtrelenmiş sağlayıcıları görür. `--filter-providers` tarafından hariç tutulan sağlayıcılara başvuran testler doğrulama başarısız olur

### Testleri Prompt\'a Göre Filtreleme

Varsayılan olarak, her test tüm prompt\'lara karşı çalışır (kartezyen ürün). Bir testi belirli prompt\'larla sınırlamak için `prompts` alanını kullanabilirsiniz:

```yaml
prompts:
  - id: prompt-factual
    label: Factual Assistant
    raw: 'You are a factual assistant. Answer: {{question}}'
  - id: prompt-creative
    label: Creative Writer
    raw: 'You are a creative writer. Answer: {{question}}'

providers:
  - openai:gpt-4o-mini

tests:
  # Bu test sadece Factual Assistant prompt\'u ile çalışır
  - vars:
      question: 'Fransa\'nın başkenti nedir?'
    prompts:
      - Factual Assistant
    assert:
      - type: contains
        value: 'Paris'

  # Bu test sadece Creative Writer prompt\'u ile çalışır
  - vars:
      question: 'Paris hakkında bir şiir yazın'
    prompts:
      - prompt-creative # ID veya label ile başvurabilirsiniz
    assert:
      - type: llm-rubric
        value: 'Şiirsel dil içerir'

  # Bu test tüm prompt\'lar ile çalışır (varsayılan davranış)
  - vars:
      question: 'Merhaba'
```

`prompts` alanı aşağıdakileri kabul eder:

- **Tam labellar**: `prompts: ['Factual Assistant']`
- **Tam IDler**: `prompts: ['prompt-factual']`
- **Wildcard pattern\'ler**: `prompts: ['Math:*']` eşleştirir `Math:Basic`, `Math:Advanced` vb.
- **Prefix pattern\'ler**: `prompts: ['Math']` eşleştirir `Math:Basic`, `Math:Advanced` (legacy söz dizimi)

:::note

Geçersiz prompt referansları config yükleme sırasında hataya neden olur. Bu kesin doğrulama yazım hatalarını erkenden yakalar.

:::

`defaultTest` içinde varsayılan prompt filtresi de ayarlayabilirsiniz:

```yaml
defaultTest:
  prompts:
    - Factual Assistant

tests:
  # `defaultTest` den `prompts: ['Factual Assistant']` yi inherit eder
  - vars:
      question: '2+2 nedir?'

  # Farklı bir prompt kullanmak için geçersiz kıl
  - vars:
      question: 'Bir hikaye yazın'
    prompts:
      - Creative Writer
```

## Dış Test Dosyaları

Daha büyük test setleri için testleri ayrı dosyalara saklayın:

```yaml title="promptfooconfig.yaml"
tests: file://tests.yaml
```

Veya birden fazla dosya yükleyin:

```yaml
tests:
  - file://basic_tests.yaml
  - file://advanced_tests.yaml
  - file://edge_cases/*.yaml
```

## CSV Formatı

CSV veya Excel (XLSX) dosyaları toplu test verileri için idealdir:

```yaml title="promptfooconfig.yaml"
tests: file://test_cases.csv
```

```yaml title="promptfooconfig.yaml"
tests: file://test_cases.xlsx
```

### Temel CSV

```csv title="test_cases.csv"
question,expectedAnswer
"2+2 nedir?","4"
"Fransa\'nın başkenti nedir?","Paris"
"Romeo ve Juliet\'i kim yazdı?","Shakespeare"
```

Değişkenler otomatik olarak sütun başlıklarından eşleştirilir.

### Excel (XLSX/XLS) Desteği

Excel dosyaları (.xlsx ve .xls) isteğe bağlı bir özelliktir. Excel dosyalarını kullanmak için:

1. `read-excel-file` paketini bir eş bağımlılık olarak yükleyin:

   ```bash
   npm install read-excel-file
   ```

2. Excel dosyalarını CSV dosyaları gibi kullanın:
   ```yaml title="promptfooconfig.yaml"
   tests: file://test_cases.xlsx
   ```

**Çok sayfah destek:** Varsayılan olarak, sadece ilk sayfa kullanılır. Farklı bir sayfayı belirtmek için `#` söz dizimini kullanın:

- `file://test_cases.xlsx#Sheet2` - Sayfayı isme göre seçin
- `file://test_cases.xlsx#2` - Sayfayı 1-tabanlı indekse göre seçin (2 = ikinci sayfa)

```yaml title="promptfooconfig.yaml"
# Isme göre belirli bir sayfayı kullanın
tests: file://test_cases.xlsx#DataSheet

# Veya indekse göre (1-tabanlı)
tests: file://test_cases.xlsx#2
```

### XLSX Örneği

Excel dosyanız ilk satırda sütun başlıklarına sahip olmalı, sonraki her satır bir test durumunu temsil eder:

| question                       | expectedAnswer |
| ------------------------------ | -------------- |
| 2+2 nedir?                     | 4              |
| Fransa\'nın başkenti nedir?    | Paris          |
| Bir ana rengi adlandırın       | blue           |

**Excel dosyaları için ipuçları:**

- İlk satırda sütun başlıkları olmalıdır
- Sütun adları prompt\'larınızda değişken adları olur
- Boş hücreler boş dizeler olarak işlenir
- İldirmeleri için `__expected` sütunlarını kullanın (CSV\'nin aynısı)

### Iddialı CSV

İddialar için özel `__expected` sütunlarını kullanın:

```csv title="test_cases.csv"
input,__expected
"Merhaba dünya","içerir: Merhaba"
"5 * 6 hesapla","eşittir: 30"
"Hava durumu ne?"","llm-rubric: Hava durumu bilgisi sağlar"
```

Bir tür ön eki olmayan değerler varsayılan olarak `equals` kullanır:

| `__expected` değeri                         | İddia türü               |
| ------------------------------------------- | ----------------------- |
| `Paris`                                     | `equals`                |
| `contains:Paris`                            | `contains`              |
| `factuality:Başkent Paris\'tir`             | `factuality`            |
| `similar(0.8):Merhaba orada`                | `similar` 0.8 eşiği ile |

Birden fazla iddia:

```csv title="test_cases.csv"
question,__expected1,__expected2,__expected3
"2+2 nedir?","eşittir: 4","içerir: dört","javascript: output.length < 10"
```

:::note
**contains-any** ve **contains-all** `__expected` sütununda virgülle ayrılmış değerler bekler.

```csv title="test_cases.csv"
translated_text,__expected
"<span>Hola</span> <b>mundo</b>","contains-any: <b>,</span>"
```

`"contains-any: <b> </span>"` yazarsanız, promptfoo bunu `<b> </span>` tek bir arama terimi yerine iki ayrı etiket olarak değerlendirir.
:::

### Özel CSV Sütunları

| Sütun                                                           | Amaç                                         | Örnek                                            |
| --------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| `__expected`                                                    | Tek iddia                                    | `contains: Paris`                                |
| `__expected1`, `__expected2`, ...                               | Birden fazla iddia                           | `equals: 42`                                     |
| `__description`                                                 | Test açıklaması                              | `Temel matematik testi`                          |
| `__prefix`                                                      | Prompt\'tan önce ekle                        | `Şu şekilde cevap vermelisiniz: `               |
| `__suffix`                                                      | Prompt\'tan sonra ekle                       | ` (kısa cevap verin)`                            |
| `__metric`                                                      | Raporlarda görüntü adı (iddia türünü değiştirmez) | `accuracy`                               |
| `__threshold`                                                   | Geçiş eşiği (tüm iddialar için geçerli)     | `0.8`                                            |
| `__metadata:*`                                                  | Filtrelenebilir metadata                     | Aşağıya bakın                                    |
| `__config:__expected:<key>` or `__config:__expectedN:<key>`   | Tüm veya belirli iddiaların yapılandırmasını ayarlayın | `__config:__expected:threshold`, `__config:__expected2:threshold` |

`__metadata` anahtarsız kullanmak desteklenmez. Metadata alanını `__metadata:category` gibi belirtin.
CSV dosyası bir anahtarsız `__metadata` sütunu içeriyorsa, Promptfoo bir uyarı kaydeder ve sütunu görmezden gelir.

### CSV\'de Metadata

Filtrelenebilir metadata ekleyin:

```csv title="test_cases.csv"
question,__expected,__metadata:category,__metadata:difficulty
"2+2 nedir?","eşittir: 4","matematik","kolay"
"Kuantum fiziğini açıklayın","llm-rubric: Doğru açıklama","bilim","zor"
```

`[]` ile dizi metadata:

```csv
topic,__metadata:tags[]
"Makine öğrenmesi","ai,teknoloji,veri bilimi"
"İklim değişikliği","çevre,bilim,küresel\,ısınma"
```

Testleri filtreleyin:

```bash
promptfoo eval --filter-metadata category=math
promptfoo eval --filter-metadata difficulty=easy
promptfoo eval --filter-metadata tags=ai

# Birden fazla filtre AND mantığı kullanır (testler TÜM koşulları sağlamalıdır)
promptfoo eval --filter-metadata category=math --filter-metadata difficulty=easy
```

### CSV\'de JSON

Yapılandırılmış veri ekleyin:

```csv title="test_cases.csv"
query,context,__expected
"Sıcaklık nedir?","{""location"":""NYC"",""units"":""celsius""}","içerir: celsius"
```

Prompt\'lardaki erişim:

```yaml
prompts:
  - 'Sorgu: {{query}}, Konum: {{(context | load).location}}'
```

### defaultTest ile CSV

`defaultTest` kullanarak CSV dosyasından yüklenen tüm testlere aynı iddialar uygulayın:

```yaml title="promptfooconfig.yaml"
defaultTest:
  assert:
    - type: factuality
      value: '{{reference_answer}}'
  options:
    provider: openai:gpt-5.2

tests: file://tests.csv
```

```csv title="tests.csv"
question,reference_answer
"GPT neyin kısaltmasıdır?","Generative Pre-trained Transformer"
"Fransa\'nın başkenti nedir?","Paris, Fransa\'nın başkentidir"
```

`defaultTest` iddiaları içinde `__expected` sütunu yerine normal sütun adlarını (örneğin `reference_answer`) kullanın. `__expected` sütunu satır başına iddiaları otomatik olarak oluşturur.

## Dinamik Test Oluşturma

Testleri programlı olarak oluşturun:

### JavaScript/TypeScript

```yaml title="promptfooconfig.yaml"
tests: file://generate_tests.js
```

```javascript title="generate_tests.js"
module.exports = async function () {
  // Veri getir, test durumlarını hesapla vb.
  const testCases = [];

  for (let i = 1; i <= 10; i++) {
    testCases.push({
      description: `Test durumu ${i}`,
      vars: {
        number: i,
        squared: i * i,
      },
      assert: [
        {
          type: 'contains',
          value: String(i * i),
        },
      ],
    });
  }

  return testCases;
};
```

### Python

```yaml title="promptfooconfig.yaml"
tests: file://generate_tests.py:create_tests
```

```python title="generate_tests.py"
import json

def create_tests():
    test_cases = []

    # Veritabanı, API vb. den test verisi yükle
    test_data = load_test_data()

    for item in test_data:
        test_cases.append({
            "vars": {
                "input": item["input"],
                "context": item["context"]
            },
            "assert": [{
                "type": "contains",
                "value": item["expected"]
            }]
        })

    return test_cases
```

### Yapılandırma ile

Oluşturucular yapılandırması geç:

```yaml title="promptfooconfig.yaml"
tests:
  - path: file://generate_tests.py:create_tests
    config:
      dataset: 'validation'
      category: 'math'
      sample_size: 100
```

```python title="generate_tests.py"
def create_tests(config):
    dataset = config.get('dataset', 'train')
    category = config.get('category', 'all')
    size = config.get('sample_size', 50)

    # Testleri oluşturmak için yapılandırması kullanın
    return generate_test_cases(dataset, category, size)
```

## JSON/JSONL Formatı

### JSON Dizisi

```json title="tests.json"
[
  {
    "vars": {
      "topic": "yapay zeka"
    },
    "assert": [
      {
        "type": "contains",
        "value": "AI"
      }
    ]
  },
  {
    "vars": {
      "topic": "iklim değişikliği"
    },
    "assert": [
      {
        "type": "llm-rubric",
        "value": "Çevresel etkileri tartışır"
      }
    ]
  }
]
```

### JSONL (Satır başına bir test)

```jsonl title="tests.jsonl"
{"vars": {"x": 5, "y": 3}, "assert": [{"type": "equals", "value": "8"}]}
{"vars": {"x": 10, "y": 7}, "assert": [{"type": "equals", "value": "17"}]}
```

## Medya Dosyalarını Yükleme

Görüntüleri, PDF\'leri ve diğer dosyaları değişken olarak ekleyin:

```yaml title="promptfooconfig.yaml"
tests:
  - vars:
      image: file://images/chart.png
      document: file://docs/report.pdf
      data: file://data/config.yaml
```

### Yol Çözümlemesi

`file://` yolları **config dosyanızın dizinine** göre çözümlenir, geçerli çalışma dizinine değil. Bu, `promptfoo`\'yu nereye çalıştıracağınız fark etmeksizin tutarlı davranışı sağlar:

```yaml title="src/tests/promptfooconfig.yaml"
tests:
  - vars:
      # src/tests/data/input.json olarak çözümlenir
      data: file://./data/input.json

      # Ayrıca çalışır - src/tests/data/input.json olarak çözümlenir
      data2: file://data/input.json

      # Üst dizin - src/shared/context.json olarak çözümlenir
      shared: file://../shared/context.json
```

`file://` ön eki olmadan, değerler düz dizeler olarak sağlayıcınıza iletilir.

### Desteklenen Dosya Türleri

| Tür                    | İşleme            | Kullanım             |
| ---------------------- | ----------------- | -------------------- |
| Görüntüler (png, jpg vb.) | Base64\'e dönüştürüldü | Vision modelleri     |
| Videolar (mp4 vb.)     | Base64\'e dönüştürüldü | Multimodal modelleri |
| PDF\'ler                | Metin çıkarımı     | Belge analizi        |
| Metin dosyaları       | Dize olarak yüklenir | Herhangi bir kullanım durumu |
| YAML/JSON              | Nesneye ayrıştırılır | Yapılandırılmış veri |

### Örnek: Vision Model Testi

```yaml
tests:
  - vars:
      image: file://test_image.jpg
      question: 'Bu görüntüde hangi nesneler var?'
    assert:
      - type: contains
        value: 'köpek'
```

Prompt\'unuzda:

```json
[
  {
    "role": "user",
    "content": [
      { "type": "text", "text": "{{question}}" },
      {
        "type": "image_url",
        "image_url": {
          "url": "data:image/jpeg;base64,{{image}}"
        }
      }
    ]
  }
]
```

## En İyi Uygulamalar

### 1. Test Verilerini Düzenleyin

```
project/
├── promptfooconfig.yaml
├── prompts/
│   └── main_prompt.txt
└── tests/
    ├── basic_functionality.csv
    ├── edge_cases.yaml
    └── regression_tests.json
```

### 2. Açıklayıcı Adlar Kullanın

```yaml
tests:
  - description: 'Resmi ton ile Fransızca çevirisi test et'
    vars:
      text: 'Merhaba'
      language: 'French'
      tone: 'formal'
```

### 3. İlgili Testleri Gruplayın

```yaml
# Organizasyon için metadata kullanın
tests:
  - vars:
      query: 'Şifreyi sıfırla'
    metadata:
      feature: authentication
      priority: high
```

### 4. Yaklaşımları Birleştirin

```yaml
tests:
  # Hızlı duman testleri satır içi
  - vars:
      test: 'hızlı kontrol'

  # Dosyadan kapsamlı test seti
  - file://tests/full_suite.csv

  # Dinamik kenar durumu oluşturma
  - file://tests/generate_edge_cases.js
```

## Yaygın Desenler

### A/B Test Değişkenleri

```csv title="ab_tests.csv"
message_style,greeting,__expected
"resmi","İyi sabahlar","içerir: İyi sabahlar"
"rahat","Selam","içerir: Selam"
"arkadaşça","Merhaba!","içerir: Merhaba"
```

### Hata İşleme Testleri

```yaml
tests:
  - description: 'Boş giriş işle'
    vars:
      input: ''
    assert:
      - type: contains
        value: 'daha fazla bilgi sağlayın'
```

### Performans Testleri

```yaml
tests:
  - vars:
      prompt: 'Basit soru'
    assert:
      - type: latency
        threshold: 1000 # milisaniye
```

### İddialar İçin Diziler Geçirin

Varsayılan olarak, dizi değişkenleri birden fazla test durumuna genişler. Bir diziyi `contains-any` gibi iddialara doğrudan geçmek için değişken genişletmeyi devre dışı bırakın:

```yaml
defaultTest:
  options:
    disableVarExpansion: true
  assert:
    - type: contains-any
      value: '{{expected_values}}'

tests:
  - description: 'Geçerli bir yanıt için kontrol edin'
    vars:
      expected_values: ['option1', 'option2', 'option3']
```

## Dış Veri Kaynakları

### Google Sheets

Doğrudan elektronik tablodan test verisi yükleme hakkında ayrıntılar için [Google Sheets entegrasyonuna](/docs/integrations/google-sheets) bakın.

### SharePoint

Microsoft SharePoint belge kitaplıklarından test verisi yükleme hakkında ayrıntılar için [SharePoint entegrasyonuna](/docs/integrations/sharepoint) bakın.

### HuggingFace Veri Setleri

Mevcut veri setlerinden test durumlarını içeri aktarma talimatları için [HuggingFace Veri Setlerine](/docs/configuration/huggingface-datasets) bakın.