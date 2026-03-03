---
title: fal.ai Sağlayıcısı
description: Görsel yapay zeka testi ve değerlendirmesi için Flux ve Stable Diffusion dahil olmak üzere fal.ai'nin hızlı görüntü oluşturma modellerini entegre edin
sidebar_position: 42
keywords: [fal.ai, görüntü oluşturma, yapay zeka görüntüleri, flux, imagen, ideogram, promptfoo sağlayıcısı]
---

# fal.ai

`fal` sağlayıcısı, [fal-js](https://github.com/fal-ai/fal-js) istemcisini kullanarak [fal.ai](https://fal.ai) çıkarım API'sini destekler ve değerlendirmelerinizde fal.ai modellerini kullanmanız için yerel bir deneyim sunar.

## Kurulum

1. **fal istemcisini kurun**:

   ```bash
   npm install --save @fal-ai/client
   ```

2. **Bir API anahtarı oluşturun**: [fal paneli](https://fal.ai/dashboard/keys) üzerinden

3. **Ortam değişkenini ayarlayın**:
   ```bash
   export FAL_KEY=your_api_key_here
   ```

## Sağlayıcı Formatı

Bir modeli çalıştırmak için model türünü ve model adını belirtin: `fal:<model_turu>:<model_adi>`.

### Öne Çıkan Modeller

- `fal:image:fal-ai/flux-pro/v1.1-ultra` - 2K çözünürlüğe kadar profesyonel düzeyde görüntü oluşturma
- `fal:image:fal-ai/flux/schnell` - 1-4 adımda hızlı, yüksek kaliteli görüntü oluşturma
- `fal:image:fal-ai/fast-sdxl` - LoRA destekli yüksek hızlı SDXL

:::info

En yeni modeller ve ayrıntılı özellikler için [model galerisine](https://fal.ai/models) göz atın. Model kullanılabilirliği ve yetenekleri sık sık güncellenmektedir.

:::

## Popüler Modeller

**Hız için**: `fal:image:fal-ai/flux/schnell` - 1-4 adımda ultra hızlı üretim  
**Kalite için**: `fal:image:fal-ai/flux/dev` - Yüksek kaliteli 12B parametreli model  
**En yüksek kalite için**: `fal:image:fal-ai/imagen4/preview` - Google'ın en yüksek kaliteli modeli  
**Metin/Logolar için**: `fal:image:fal-ai/ideogram/v3` - Olağanüstü tipografi işleme  
**Profesyonel işler için**: `fal:image:fal-ai/flux-pro/v1.1-ultra` - 2K çözünürlüğe kadar  
**Vektör sanatı için**: `fal:image:fal-ai/recraft/v3/text-to-image` - Vektör sanatı ve tipografide son nokta  
**4K görüntüler için**: `fal:image:fal-ai/sana` - Bir saniyenin altında 4K üretim  
**Çok modlu (Multimodal) için**: `fal:image:fal-ai/bagel` - 7B parametreli metin ve görüntü modeli

Tüm modellere [fal.ai/models](https://fal.ai/models?categories=text-to-image) adresinden göz atın.

## Ortam Değişkenleri

| Değişken  | Açıklama                                 |
| --------- | ---------------------------------------- |
| `FAL_KEY` | fal ile kimlik doğrulama için API anahtarınız |

## Yapılandırma

fal sağlayıcısını promptfoo yapılandırma dosyanızda yapılandırın. İşte [`fal-ai/flux/schnell`](https://fal.ai/models/fal-ai/flux/schnell) kullanan bir örnek:

:::info

Yapılandırma parametreleri modele göre değişir. Örneğin, `fast-sdxl`, `scheduler` ve `guidance_scale` gibi ek parametreleri destekler. Desteklenen parametreler için her zaman [modele özgü belgelere](https://fal.ai/models) bakın.

:::

### Temel Kurulum

```yaml title="promptfooconfig.yaml"
providers:
  - id: fal:image:fal-ai/flux/schnell
    config:
      apiKey: your_api_key_here # FAL_KEY ortam değişkenine alternatif
      image_size:
        width: 1024
        height: 1024
      num_inference_steps: 8
      seed: 6252023
```

### Gelişmiş Seçenekler

```yaml title="promptfooconfig.yaml"
providers:
  - id: fal:image:fal-ai/flux/dev
    config:
      num_inference_steps: 28
      guidance_scale: 7.5
      seed: 42
      image_size:
        width: 1024
        height: 1024
```

### Yapılandırma Seçenekleri

| Parametre             | Tür    | Açıklama                                | Örnek               |
| --------------------- | ------ | --------------------------------------- | ------------------- |
| `apiKey`              | string | fal ile kimlik doğrulama için API anahtarınız | `your_api_key_here` |
| `image_size.width`    | number | Oluşturulan görüntünün genişliği        | `1024`              |
| `image_size.height`   | number | Oluşturulan görüntünün yüksekliği       | `1024`              |
| `num_inference_steps` | number | Çalıştırılacak çıkarım adımı sayısı     | `4` ile `50` arası  |
| `seed`                | number | Tekrarlanabilir sonuçlar için tohum değeri | `42`                |
| `guidance_scale`      | number | İsteme bağlılık (modele bağlıdır)       | `3.5` ile `15` arası |

## Ayrıca Bakınız

- [Model galerisi](https://fal.ai/models)
- [API belgeleri](https://docs.fal.ai/)
- [fal.ai Discord topluluğu](https://discord.gg/fal-ai)
- [Yapılandırma Referansı](../configuration/reference.md)
