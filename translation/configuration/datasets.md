---
sidebar_position: 21
sidebar_label: Veri Seti Oluşturma
title: Veri Seti Oluşturma - Otomatikleştirilmiş Test Verisi Oluşturma
description: promptfoo kullanılarak kapsamlı test veri setlerini otomatik olarak oluştur. Kapsamlı LLM değerlendirmesi için çeşitli test durumları, kişileri ve sınır durumları oluştur.
keywords:
  [
    veri seti oluşturma,
    otomatik test,
    test verisi oluşturma,
    LLM veri setleri,
    değerlendirme verisi,
    test otomasyonu,
    sentetik veri,
  ]
pagination_prev: configuration/scenarios
pagination_next: configuration/huggingface-datasets
---

# Veri Seti Oluşturma

Veri setiniz, LLM değerlendirmenizin kalbidır. Mümkün olduğu kadar, LLM uygulamanuzun gerçek girdilerini yakından temsil etmelidir.

promptfoo, `promptfoo generate dataset` komutu kullanılarak mevcut veri setlerini genişletebilir ve onları daha kapsamlı ve çeşitli hale getirebilir. Bu kılavuz, `promptfoo` kullanılarak veri setleri oluşturma sürecinde sizi tanıtabilecektir.

### İstemlerinizi Hazırlayın

Bir veri seti oluşturmadan önce, `prompts` öğeleriniz ve isteyen olarak `tests` öğeleriniz hazır olması gerekir:

```yaml
prompts:
  - 'Bir seyahat rehberi olarak hareket et {{location}} için'
  - 'Sen bir seyahat rehberi olarak hareket etmesini istiyorum. Bana konumumu yazacağım ve sen konumuma yakın ziyaret edebileceğin bir yer önereceksin. Bazı durumlarda, ziyaret edeceğim yerlerin türünü de sana veriri. Ayrıca bana ilk konumuma yakın benzer türde yerleri öner. Mevcut konumum {{location}}'

tests:
  - vars:
      location: 'San Francisco'
  - vars:
      location: 'Wyoming'
  - vars:
      location: 'Kyoto'
  - vars:
      location: 'Great Barrier Reef'
```

Alternatif olarak, [istepleneri CSV olarak](/docs/configuration/prompts#csv-files-csv) belirtebilirsiniz:

```yaml
prompts: file://travel-guide-prompts.csv
```

CSV şöyle gözükecektir:

```csv title="travel-guide-prompts.csv"
istem
"Bir seyahat rehberi olarak hareket et {{location}} için"
"Sen bir seyahat rehberi olarak hareket etmesini istiyorum. Bana konumumu yazacağım ve sen konumuma yakın ziyaret edebileceğin bir yer önereceksin. Bazı durumlarda, ziyaret edeceğim yerlerin türünü de sana veriri. Ayrıca bana ilk konumuma yakın benzer türde yerleri öner. Mevcut konumum {{location}}"
```

### `promptfoo generate dataset` Çalıştırın

Veri seti oluşturma, İstemleriniz ve mevcut test durumlarını değerlendirme için kullanılabilecek yeni, benzersiz test durumları oluşturmak için kullanır.

Komutu yapılandırma dosyanızla aynı dizinde çalıştırın:

```sh
promptfoo generate dataset
```

Bu, `tests` YAML'ini terminalinize çıkaracaktır.

Yeni veri setini YAML'ye yazdırmak istiyorsanız:

```sh
promptfoo generate dataset -o tests.yaml
```

bir CSV'ye:

```sh
promptfoo generate dataset -o tests.csv
```

Veya mevcut yapılandırmayı yerinde düzenlemek istiyorsanız:

```sh
promptfoo generate dataset -w
```

### Çıktı Dosyalarından Yükleme

`-o` bayrağını kullanırken, oluşturulan veri setini yapılandırma dosyanızın [tests](/docs/configuration/test-cases) bloğu içinde eklemeniz gerekecektir.

Örneğin:

```yaml
prompts:
  - 'Bir seyahat rehberi olarak hareket et {{location}} için'
  - 'Sen bir seyahat rehberi olarak hareket etmesini istiyorum. Bana konumumu yazacağım ve sen konumuma yakın ziyaret edebileceğin bir yer önereceksin. Bazı durumlarda, ziyaret edeceğim yerlerin türünü de sana veriri. Ayrıca bana ilk konumuma yakın benzer türde yerleri öner. Mevcut konumum {{location}}'

tests:
  - file://tests.csv
  - vars:
      location: 'San Francisco'
  - vars:
      location: 'Wyoming'
  - vars:
      location: 'Kyoto'
  - vars:
      location: 'Great Barrier Reef'
```

### Oluşturma Sürecini Özelleştir

Veri seti oluşturma sürecini `promptfoo generate dataset` komutuna ek seçenekler sağlayarak özelleştirebilirsiniz. Aşağıda desteklenen parametrelerin bir tablosu yer almaktadır:

| Parameter                  | Açıklama                                                              |
| -------------------------- | ----------------------------------------------------------------------- |
| `-c, --config`             | Yapılandırma dosyasına giden yol.                                    |
| `-i, --instructions`       | Test durumları oluşturulurken LLM'ın izlemesi gereken özel talimatlar. |
| `-o, --output [path]`      | Çıktı dosyasına giden yol. CSV ve YAML destekler.                 |
| `-w, --write`              | Oluşturulan test durumlarını doğrudan yapılandırma dosyasına yaz. |
| `--numPersonas`            | Veri seti için oluşturulacak kişilerın sayısı.                          |
| `--numTestCasesPerPersona` | Kişi başına oluşturulacak test durumlarının sayısı.                  |
| `--provider`               | Veri seti oluşturma için kullanılacak sağlayıcı. Örn: openai:chat:gpt-5 |

Örneğin:

```sh
promptfoo generate dataset --config path_to_config.yaml --output path_to_output.yaml --instructions "Uluslararası seyahat ile ilgili sınır durumlarını göz önünde bulundurun"
```

### Özel Sağlayıcı Kullanma

`--provider` bayrağı, test durumlarını oluşturmak için kullanılan LLM'yi belirtir. Bu, yapılandırma dosyanızdaki sağlayıcılardan (test edilecek hedefler) ayrıdır.

Varsayılan olarak, veri seti oluşturma OpenAI (`OPENAI_API_KEY`) kullanır. Farklı bir sağlayıcı kullanmak için uygun ortam değişkenlerini ayarlayın:

```bash
# Azure OpenAI
export AZURE_OPENAI_API_KEY=your-key
export AZURE_API_HOST=your-host.openai.azure.com
export AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment

promptfoo generate dataset
```

Alternatif olarak, `--provider` bayrağını herhangi bir desteklenen sağlayıcı ile kullanın:

```bash
promptfoo generate dataset --provider openai:chat:gpt-5-mini
```

Daha fazla kontrol için bir sağlayıcı yapılandırma dosyası oluştur:

```yaml title="synthesis-provider.yaml"
id: openai:responses:gpt-5.2
config:
  reasoning:
    effort: medium
  max_output_tokens: 4096
```

```bash
promptfoo generate dataset --provider file://synthesis-provider.yaml
```

Bir Python sağlayıcısı da kullanabilirsiniz:

```bash
promptfoo generate dataset --provider file://synthesis-provider.py
```