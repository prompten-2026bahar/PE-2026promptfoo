---
displayed_sidebar: promptfoo
sidebar_label: HuggingFace Veri Setleri
title: HuggingFace Veri Setlerinden Test Durumlarını Yükleme
description: Otomatik bölme, filtreleme ve format dönüştürme yetenekleriyle HuggingFace veri setlerini doğrudan LLM değerlendirmesi için yükleyin
keywords:
  [
    huggingface veri setleri,
    test durumları,
    veri seti entegrasyonu,
    promptfoo veri setleri,
    ml değerlendirmesi,
    veri seti alma,
    mevcut veri setler,
  ]
pagination_prev: configuration/datasets
pagination_next: configuration/scenarios
---

# HuggingFace Veri Setleri

Promptfoo, `huggingface://datasets/` önekini kullanarak test durumlarını doğrudan [HuggingFace veri setlerinden](https://huggingface.co/docs/datasets) içe aktarabilir.

## Temel kullanım

Tüm veri setini yüklemek için:

```yaml
tests: huggingface://datasets/fka/awesome-chatgpt-prompts
```

Değerlendirmeyi çalıştırın:

```bash
npx promptfoo eval
```

Her veri seti satırı, veri seti alanlarının tümünün değişkenler olarak kullanılabilir olduğu bir test durumu haline gelir.

## Veri Seti Bölündüğü

Sorgu parametrelerini kullanarak veri setlerinin belirli bölümlerini yükleyin:

```yaml
# Eğitim bölümünden yükleme
tests: huggingface://datasets/fka/awesome-chatgpt-prompts?split=train

# Özel yapılandırma ile doğrulama bölümünden yükleme
tests: huggingface://datasets/fka/awesome-chatgpt-prompts?split=validation&config=custom
```

## İstemler de veri seti alanlarını kullanın

Veri seti alanları otomatik olarak istem değişkenleri haline gelir. İşte nasıl:

```yaml title="promptfooconfig.yaml"
prompts:
  - "Question: {{question}}\nAnswer:"

tests: huggingface://datasets/rajpurkar/squad
```

## Sorgu parametreleri

| Parametre | Açıklama                                      | Varsayılan  |
| --------- | --------------------------------------------- | ----------- |
| `split`   | Yüklenecek veri seti bölümü (train/test/validation) | `test`      |
| `config`  | Veri seti yapılandırma adı                    | `default`   |
| `subset`  | Veri seti alt seti (çok alt setli veri setleri için) | `none`      |
| `limit`   | Yüklenecek maksimum test durumu sayısı          | `sınırsız` |

Yükleyici, [HuggingFace Veri Setleri API'si](https://huggingface.co/docs/datasets-server/api_reference#get-apirows) tarafından desteklenen herhangi bir parametreyi kabul eder. Bu yaygın olanların ötesindeki ek parametreler doğrudan API'ye iletilir.

Test durumlarının sayısını sınırlamak için:

```yaml
tests: huggingface://datasets/fka/awesome-chatgpt-prompts?split=train&limit=50
```

Belirli bir alt seti yüklemek için (MMLU veri setleriyle yaygındır):

```yaml
tests: huggingface://datasets/cais/mmlu?split=test&subset=physics&limit=10
```

## Kimlik doğrulama

Özel veri setleri veya artan hız sınırları için HuggingFace jetonunuzu kullanarak kimlik doğrulama yapın. Şu ortam değişkenlerinden birini ayarlayın:

```bash
# Bu ortam değişkenlerinden herhangi biri çalışır:
export HF_TOKEN=your_token_here
export HF_API_TOKEN=your_token_here
export HUGGING_FACE_HUB_TOKEN=your_token_here
```

:::info
Kimlik doğrulama, özel veri setleri ve gated modelleri için gereklidir. Herkese açık veri setleri için kimlik doğrulama isteğe bağlıdır ancak daha yüksek hız sınırları sağlar.
:::

## Uygulama ayrıntıları

- Her veri seti satırı bir test durumu haline gelir
- Tüm veri seti alanları istem değişkenleri olarak kullanılabilir
- Büyük veri setleri otomatik olarak sayfalandırılır (istek başına 100 satır)
- Orijinal verileri korumak için değişken genişletmesi devre dışı bırakılır

## Örnek yapılandırmalar

### Temel sohbet botu değerlendirmesi

```yaml title="promptfooconfig.yaml"
description: HuggingFace veri seti ile test etme

prompts:
  - 'Act as {{act}}. {{prompt}}'

providers:
  - openai:gpt-5-mini

tests: huggingface://datasets/fka/awesome-chatgpt-prompts?split=train
```

### Sınırlarla soru-cevap

```yaml title="promptfooconfig.yaml"
description: Kimlik doğrulama ile SQUAD değerlendirmesi

prompts:
  - 'Question: {{question}}\nContext: {{context}}\nAnswer:'

providers:
  - openai:gpt-5-mini

tests: huggingface://datasets/rajpurkar/squad?split=validation&limit=100

env:
  HF_TOKEN: your_token_here
```

## Örnek projeler

| Örnek                                                                                                  | Kullanım Durumu   | Temel Özellikler |
| -------------------------------------------------------------------------------------------------------- | -------------------- | -------------------- |
| [Temel Kurulum](https://github.com/promptfoo/promptfoo/tree/main/examples/huggingface-dataset)             | Basit değerlendirme | Varsayılan parametreler   |
| [MMLU Karşılaştırması](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-gpt-5-vs-gpt-4o-mmlu) | Sorgu parametreleri  | Bölme, alt seti, sınır |
| [Red Team Güvenliği](https://github.com/promptfoo/promptfoo/tree/main/examples/redteam-beavertails)         | Güvenlik testi    | BeaverTails veri seti  |

## Sorun Giderme

### Kimlik doğrulama hataları

HuggingFace jetonunuzun doğru şekilde ayarlandığından emin olun: `export HF_TOKEN=your_token`

### Veri seti bulunamadı

Veri seti yolu biçimini doğrulayın: `owner/repo` (örn. `rajpurkar/squad`)

### Boş sonuçlar

Belirtilen bölmenin veri seti için mevcut olduğunu kontrol edin. `split=test` sonuç döndürmüyorsa `split=train`'i deneyin.

### Performans sorunları

Yüklenen satır sayısını azaltmak için `limit` parametresini ekleyin: `&limit=100`

## Ayrıca Bkz.

- [Test Durumu Yapılandırması](/docs/configuration/test-cases) - Test durumlarını yapılandırmaya ilişkin tam kılavuz
- [HuggingFace Sağlayıcısı](/docs/providers/huggingface) - Çıkarım için HuggingFace modellerini kullanma
- [CSV Test Durumları](/docs/configuration/test-cases#csv-format) - CSV dosyalarından test durumlarını yükleme
- [Red Team Yapılandırması](/docs/red-team/configuration) - Kırmızı ekip değerlendirmelerinde veri setlerini kullanma