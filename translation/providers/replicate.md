---
sidebar_label: Replicate
description: "Görüntü, metin ve ses üretimi için Replicate'in ölçeklenebilir API'sini kullanarak açık kaynaklı yapay zeka modellerini bulutta dağıtın ve çalıştırın"
---

# Replicate

Replicate, makine öğrenimi modelleri için bir API'dir. Şu anda [Llama v2](https://replicate.com/replicate/llama70b-v2-chat), [Gemma](https://replicate.com/google-deepmind/gemma-7b-it) ve [Mistral/Mixtral](https://replicate.com/mistralai/mixtral-8x7b-instruct-v0.1) gibi modellere ev sahipliği yapmaktadır.

:::info
promptfoo'daki Replicate sağlayıcısı, Replicate API'sine doğrudan HTTP istekleri kullanır, bu nedenle ek bir SDK kurulumu gerekmez.
:::

Bir modeli çalıştırmak için Replicate model adını ve isteğe bağlı olarak sürümünü belirtin:

```
# Belirli bir sürümle (tutarlılık için önerilir)
replicate:replicate/llama70b-v2-chat:e951f18578850b652510200860fc4ea62b3b16fac280f83ff32282f87bbd2e48

# Sürüm olmadan (en güncelini kullanır)
replicate:meta/meta-llama-3-8b-instruct
```

:::tip
Üretim kullanımı için, tutarlı sonuçlar elde etmek adına her zaman sürümü belirtin. Sürüm kimliklerini (IDs) Replicate'deki modelin sayfasında bulabilirsiniz.
:::

## Örnekler

İşte Replicate üzerindeki Llama kullanımına bir örnek. Llama durumunda, sürüm karması (hash) ve `config` altındaki her şey isteğe bağlıdır:

```yaml
providers:
  - id: replicate:meta/llama-2-7b-chat
    config:
      temperature: 0.01
      max_length: 1024
      prompt:
        prefix: '[INST] '
        suffix: ' [/INST]'
```

İşte Replicate üzerindeki Gemma kullanımına bir örnek. Llama'nın aksine Gemma'nın varsayılan bir sürümü yoktur, bu nedenle model sürümünü belirtiyoruz:

```yaml
providers:
  - id: replicate:google-deepmind/gemma-7b-it:2790a695e5dcae15506138cc4718d1106d0d475e6dca4b1d43f42414647993d5
    config:
      temperature: 0.01
      max_new_tokens: 1024
      prompt:
        prefix: "<start_of_turn>user\n"
        suffix: "<end_of_turn>\n<start_of_turn>model"
```

## Yapılandırma

Replicate sağlayıcısı, modellerin davranışını özelleştirmek için kullanılabilecek birkaç [yapılandırma seçeneğini](https://github.com/promptfoo/promptfoo/blob/main/src/providers/replicate.ts#L9-L17) destekler:

| Parametre            | Açıklama                                                       |
| -------------------- | -------------------------------------------------------------- |
| `temperature`        | Üretim sürecindeki rastgeleliği kontrol eder.                  |
| `max_length`         | Üretilen metnin maksimum uzunluğunu belirtir.                  |
| `max_new_tokens`     | Üretilecek yeni token sayısını sınırlar.                       |
| `top_p`              | Çekirdek örnekleme (Nucleus sampling): 0 ile 1 arasında bir ondalıklı sayı. |
| `top_k`              | Top-k örnekleme: Korunacak en yüksek olasılıklı token sayısı.  |
| `repetition_penalty` | Üretilen metinde kelime tekrarlarını cezalandırır.             |
| `system_prompt`      | Tüm istekler için sistem düzeyinde bir istem ayarlar.          |
| `stop_sequences`     | Üretimi durduran durdurma dizilerini belirtir.                 |
| `seed`               | Tekrarlanabilir sonuçlar için bir çekirdek (seed) ayarlar.     |

:::warning
Her model tüm tamamlama parametrelerini desteklemez. Modle tarafından sağlanan API'yi önceden incelediğinizden emin olun.
:::

Aşağıdaki parametreler tüm modeller için desteklenir:

| Parametre        | Açıklama                                                                |
| ---------------- | ----------------------------------------------------------------------- |
| `apiKey`         | Replicate ile kimlik doğrulama için API anahtarı.                       |
| `prompt.prefix`  | Her istemden önce eklenen dize. Talimat/sohbet formatlaması için kullanışlıdır. |
| `prompt.suffix`  | Her istemden sonra eklenen dize. Talimat/sohbet formatlaması için kullanışlıdır. |

Desteklenen ortam değişkenleri:

- `REPLICATE_API_TOKEN` - Replicate API anahtarınız.
- `REPLICATE_API_KEY` - API anahtarınız için `REPLICATE_API_TOKEN`'a bir alternatiftir.
- `REPLICATE_MAX_LENGTH` - Üretilen metnin maksimum uzunluğunu belirtir.
- `REPLICATE_TEMPERATURE` - Üretim sürecindeki rastgeleliği kontrol eder.
- `REPLICATE_REPETITION_PENALTY` - Üretilen metinde kelime tekrarlarını cezalandırır.
- `REPLICATE_TOP_P` - Çekirdek örneklemeyi kontrol eder: 0 ile 1 arasında bir ondalıklı sayı.
- `REPLICATE_TOP_K` - Top-k örneklemeyi kontrol eder: Filtreleme için korunacak en yüksek olasılıklı kelime dağarcığı token sayısı.
- `REPLICATE_SEED` - Tekrarlanabilir sonuçlar için bir çekirdek ayarlar.
- `REPLICATE_STOP_SEQUENCES` - Üretimi durduran durdurma dizilerini belirtir.
- `REPLICATE_SYSTEM_PROMPT` - Tüm istekler için sistem düzeyinde bir istem ayarlar.

## Görüntüler

SDXL gibi görüntü oluşturucular şu şekilde kullanılabilir:

```yaml
prompts:
  - 'Bir görüntü oluştur: {{subject}}'

providers:
  - id: replicate:image:stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc
    config:
      width: 768
      height: 768
      num_inference_steps: 50

tests:
  - vars:
      subject: meyveli halkalar (fruit loops)
```

## Görüntüler İçerik Desteklenen Parametreler

Aşağıdaki parametreler görüntü oluşturma modelleri için desteklenir:

| Parametre             | Açıklama                                                        |
| --------------------- | --------------------------------------------------------------- |
| `width`               | Üretilen görüntünün genişliği.                                  |
| `height`              | Üretilen görüntünün yüksekliği.                                 |
| `refine`              | Hangi iyileştirme (refine) stilinin kullanılacağı               |
| `apply_watermark`     | Üretilen görüntüye filigran ekle.                               |
| `num_inference_steps` | Görüntü üretimi sırasında kullanılacak çıkarım adımı sayısı.     |

:::warning
Her model tüm görüntü parametrelerini desteklemez. Modle tarafından sağlanan API'yi önceden incelediğinizden emin olun.
:::

Görüntüler için desteklenen ortam değişkenleri:

- `REPLICATE_API_TOKEN` - Replicate API anahtarınız.
- `REPLICATE_API_KEY` - API anahtarınız için `REPLICATE_API_TOKEN`'a bir alternatiftir.

:::warning
**Önemli:** Replicate görüntü URL'leri geçicidir ve genellikle 24 saat sonra geçerliliğini yitirir. Üretilen görüntüleri korumanız gerekiyorsa, bunları hemen indirin veya aşağıda açıklanan otomatik indirme kancasını (hook) kullanın.
:::

## Üretilen Görüntüleri İndirme

Replicate görüntü URL'lerinin süresi dolduğundan, değerlendirme sırasında görüntüleri otomatik olarak indirmek ve kaydetmek isteyebilirsiniz. Bu amaçla bir `afterEach` kancası kullanabilirsiniz:

Bir `save-images.js` dosyası oluşturun:

```javascript
const fs = require('fs');
const path = require('path');

// Node >= 20 için, fetch küresel olarak mevcuttur
const { fetch } = globalThis;

/**
 * Her testten sonra Replicate tarafından üretilen görüntüleri indirir ve kaydeder
 */
module.exports = {
  async hook(hookName, context) {
    // Sadece afterEach kancası için ve bir çıktı olduğunda çalıştır
    if (hookName !== 'afterEach') {
      return;
    }

    // URL'yi markdown görüntü formatından çıkar
    const output = context.result?.response?.output;
    if (!output || typeof output !== 'string') {
      return;
    }

    const match = output.match(/!\[.*?\]\((.*?)\)/);
    const imageUrl = match?.[1];
    if (!imageUrl || !imageUrl.includes('replicate.delivery')) {
      return;
    }

    try {
      // Dizin yoksa images dizini oluştur
      const imagesDir = path.join(__dirname, 'images');
      await fs.promises.mkdir(imagesDir, { recursive: true });

      // Test açıklaması ve zaman damgasından dosya adı oluştur
      const testDesc = context.test.description || 'adsiz';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sanitizedName = testDesc
        .replace(/[^a-z0-9\s-]/gi, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();
      const filename = `${sanitizedName}-${timestamp}.png`;
      const filepath = path.join(imagesDir, filename);

      // Görüntüyü indir ve kaydet
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP hatası: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      await fs.promises.writeFile(filepath, Buffer.from(buffer));

      console.log(`✓ Görüntü kaydedildi: ${filename}`);
    } catch (error) {
      console.error(`❌ Görüntü kaydedilemedi: ${error.message}`);
    }
  },
};
```

Ardından promptfoo yapılandırmanızda buna atıfta bulunun:

```yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
extensions:
  - file://save-images.js:hook

prompts:
  - 'Bir görüntü oluştur: {{subject}}'

providers:
  - replicate:image:black-forest-labs/flux-dev

tests:
  - vars:
      subject: dağlar üzerinde güzel bir gün batımı
```

Bu kanca, üretilen tüm görüntüleri, test açıklamasına ve zaman damgasına dayalı açıklayıcı dosya adlarıyla otomatik olarak bir `images/` dizinine indirecektir.
