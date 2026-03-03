---
sidebar_position: 42
description: Tek bir birleşik uç nokta üzerinden metin, görüntü ve ses üretimi için DeepSeek, Qwen ve diğer uzmanlaşmış LLM'lere erişmek üzere Hyperbolic'in OpenAI uyumlu API'sini yapılandırın
---

# Hyperbolic

`hyperbolic` sağlayıcısı, çeşitli LLM, görüntü üretimi, ses üretimi ve görme-dil modellerine [OpenAI uyumlu API formatı](/docs/providers/openai) üzerinden erişim sağlayan [Hyperbolic API'sini](https://docs.hyperbolic.xyz) destekler. Bu, OpenAI SDK'sını kullanan mevcut uygulamalara entegrasyonu kolaylaştırır.

## Kurulum

Hyperbolic'i kullanmak için `HYPERBOLIC_API_KEY` ortam değişkenini ayarlamanız veya sağlayıcı yapılandırmasında `apiKey` belirtmeniz gerekir.

Ortam değişkenini ayarlama örneği:

```sh
export HYPERBOLIC_API_KEY=api_anahtarınız_buraya
```

## Sağlayıcı Formatları

### Metin Üretimi (LLM)

```
hyperbolic:<model_adi>
```

### Görüntü Üretimi

```
hyperbolic:image:<model_adi>
```

### Ses Üretimi (TTS)

```
hyperbolic:audio:<model_adi>
```

## Mevcut Modeller

### Metin Modelleri (LLM'ler)

#### DeepSeek Modelleri

- `hyperbolic:deepseek-ai/DeepSeek-R1` - En iyi açık kaynaklı akıl yürütme modeli
- `hyperbolic:deepseek-ai/DeepSeek-R1-Zero` - DeepSeek-R1'in sıfır-atış (zero-shot) varyantı
- `hyperbolic:deepseek-ai/DeepSeek-V3` - En yeni DeepSeek modeli
- `hyperbolic:deepseek/DeepSeek-V2.5` - Önceki nesil model

#### Qwen Modelleri

- `hyperbolic:qwen/Qwen3-235B-A22B` - Güçlü akıl yürütme yeteneğine sahip MoE modeli
- `hyperbolic:qwen/QwQ-32B` - En yeni Qwen akıl yürütme modeli
- `hyperbolic:qwen/QwQ-32B-Preview` - QwQ'nun önizleme sürümü
- `hyperbolic:qwen/Qwen2.5-72B-Instruct` - Kodlama ve matematik yetenekli en yeni Qwen LLM
- `hyperbolic:qwen/Qwen2.5-Coder-32B` - Qwen ekibinden en iyi kodlayıcı model

#### Meta Llama Modelleri

- `hyperbolic:meta-llama/Llama-3.3-70B-Instruct` - Llama 3.1 405B ile karşılaştırılabilir performans
- `hyperbolic:meta-llama/Llama-3.2-3B` - En yeni küçük Llama modeli
- `hyperbolic:meta-llama/Llama-3.1-405B` - En büyük ve en iyi açık kaynaklı model
- `hyperbolic:meta-llama/Llama-3.1-405B-BASE` - Temel tamamlama modeli (BF16)
- `hyperbolic:meta-llama/Llama-3.1-70B` - Kendi boyutundaki en iyi LLM
- `hyperbolic:meta-llama/Llama-3.1-8B` - En küçük ve en hızlı Llama 3.1
- `hyperbolic:meta-llama/Llama-3-70B` - Son derece verimli ve güçlü

#### Diğer Modeller

- `hyperbolic:hermes/Hermes-3-70B` - En yeni amiral gemisi Hermes modeli

### Görme-Dil Modelleri (Vision-Language Models - VLMs)

- `hyperbolic:qwen/Qwen2.5-VL-72B-Instruct` - Qwen'den en yeni ve en büyük görme modeli
- `hyperbolic:qwen/Qwen2.5-VL-7B-Instruct` - Qwen'den daha küçük görme modeli
- `hyperbolic:mistralai/Pixtral-12B` - MistralAI'dan görme modeli

### Görüntü Üretim Modelleri

- `hyperbolic:image:SDXL1.0-base` - Yüksek çözünürlük ustası (önerilir)
- `hyperbolic:image:SD1.5` - Güvenilir klasik Stable Diffusion
- `hyperbolic:image:SD2` - Geliştirilmiş Stable Diffusion v2
- `hyperbolic:image:SSD` - Alana özgü görevler için Segmind SD-1B
- `hyperbolic:image:SDXL-turbo` - Hızlı yüksek çözünürlüklü çıktılar
- `hyperbolic:image:SDXL-ControlNet` - ControlNet içeren SDXL
- `hyperbolic:image:SD1.5-ControlNet` - ControlNet içeren SD1.5

### Ses Üretim Modelleri

- `hyperbolic:audio:Melo-TTS` - Yüksek kaliteli konuşma için doğal anlatıcı

## Yapılandırma

Sağlayıcıyı promptfoo yapılandırma dosyanızda yapılandırın:

```yaml
providers:
  - id: hyperbolic:deepseek-ai/DeepSeek-R1
    config:
      temperature: 0.1
      top_p: 0.9
      apiKey: ... # ortam değişkenini geçersiz kıl
```

### Yapılandırma Seçenekleri

#### Metin Üretimi Seçenekleri

| Parametre            | Açıklama                                                                    |
| -------------------- | --------------------------------------------------------------------------- |
| `apiKey`             | Hyperbolic API anahtarınız                                                  |
| `temperature`        | Çıktının rastgeleliğini kontrol eder (0.0 - 2.0)                            |
| `max_tokens`         | Oluşturulacak maksimum token sayısı                                         |
| `top_p`              | Çekirdek örneklemeyi (nucleus sampling) kontrol eder (0.0 - 1.0)            |
| `top_k`              | Dikkate alınacak en iyi token sayısını kontrol eder (tümü için -1)          |
| `min_p`              | Bir tokenin dikkate alınması için minimum olasılık (0.0 - 1.0)              |
| `presence_penalty`   | Yeni tokenler için ceza (0.0 - 1.0)                                         |
| `frequency_penalty`  | Sık kullanılan tokenler için ceza (0.0 - 1.0)                               |
| `repetition_penalty` | Token tekrarını önler (varsayılan: 1.0)                                     |
| `stop`               | Karşılaşıldığında üretimi durduracak dize dizisi                           |
| `seed`               | Tekrarlanabilir sonuçlar için rastgele tohum                                |

#### Görüntü Üretimi Seçenekleri

| Parametre          | Açıklama                                            |
| ------------------ | --------------------------------------------------- |
| `height`           | Görüntünün yüksekliği (varsayılan: 1024)            |
| `width`            | Görüntünün genişliği (varsayılan: 1024)             |
| `backend`          | Hesaplama arka ucu: 'auto', 'tvm' veya 'torch'      |
| `negative_prompt`  | Neyin oluşturulmamasını belirten metin              |
| `seed`             | Tekrarlanabilir sonuçlar için rastgele tohum        |
| `cfg_scale`        | Yönlendirme ölçeği (yüksek = istemle daha ilgili)   |
| `steps`            | Gürültü giderme (denoising) adımlarının sayısı      |
| `style_preset`     | Görüntü için stil kılavuzu                          |
| `enable_refiner`   | SDXL iyileştiriciyi (refiner) etkinleştir (SDXL)    |
| `controlnet_name`  | ControlNet model adı                                |
| `controlnet_image` | ControlNet için referans görüntü                    |
| `loras`            | Nesne olarak LoRA ağırlıkları (örn. `{"Pixel_Art": 0.7}`) |

#### Ses Üretimi Seçenekleri

| Parametre  | Açıklama                    |
| ---------- | --------------------------- |
| `voice`    | TTS için ses seçimi         |
| `speed`    | Konuşma hızı çarpanı        |
| `language` | TTS için dil                |

## Örnek Kullanım

### Metin Üretimi Örneği

```yaml
prompts:
  - file://prompts/coding_assistant.json
providers:
  - id: hyperbolic:qwen/Qwen2.5-Coder-32B
    config:
      temperature: 0.1
      max_tokens: 4096
      presence_penalty: 0.1
      seed: 42

tests:
  - vars:
      task: 'İki dizenin en uzun ortak alt dizisini bulan bir Python fonksiyonu yaz'
    assert:
      - type: contains
        value: 'def lcs'
      - type: contains
        value: 'dynamic programming'
```

### Görüntü Üretimi Örneği

```yaml
prompts:
  - 'Gün batımında uçan arabaların olduğu fütüristik bir şehir silüeti'
providers:
  - id: hyperbolic:image:SDXL1.0-base
    config:
      width: 1024
      height: 1024
      cfg_scale: 7.0
      steps: 30
      negative_prompt: 'bulanık, düşük kalite'

tests:
  - assert:
      - type: is-valid-image
      - type: image-width
        value: 1024
```

### Ses Üretimi Örneği

```yaml
prompts:
  - 'Hyperbolic AI'ya hoş geldiniz. Harika uygulamalar geliştirmenize yardımcı olacağımız için heyecanlıyız.'
providers:
  - id: hyperbolic:audio:Melo-TTS
    config:
      voice: 'alloy'
      speed: 1.0

tests:
  - assert:
      - type: is-valid-audio
```

### Görme-Dil Modeli Örneği

```yaml
prompts:
  - role: user
    content:
      - type: text
        text: "Bu görüntüde ne var?"
      - type: image_url
        image_url:
          url: 'https://example.com/image.jpg'
providers:
  - id: hyperbolic:qwen/Qwen2.5-VL-72B-Instruct
    config:
      temperature: 0.1
      max_tokens: 1024

tests:
  - assert:
      - type: contains
        value: 'image shows'
```

Örnek istem şablonu (`prompts/coding_assistant.json`):

```json
[
  {
    "role": "system",
    "content": "Siz uzman bir programlama asistanısınız."
  },
  {
    "role": "user",
    "content": "{{task}}"
  }
]
```

## Maliyet Bilgileri

Hyperbolic, tüm model türlerinde rekabetçi fiyatlar sunar (Ocak 2025 itibarıyla):

### Metin Modelleri

- **DeepSeek-R1**: 2,00 $ / 1M token
- **DeepSeek-V3**: 0,25 $ / 1M token
- **Qwen3-235B**: 0,40 $ / 1M token
- **Llama-3.1-405B**: 4,00 $ / 1M token (BF16)
- **Llama-3.1-70B**: 0,40 $ / 1M token
- **Llama-3.1-8B**: 0,10 $ / 1M token

### Görüntü Modelleri

- **Flux.1-dev**: 25 adımlı 1024x1024 görüntü başına 0,01 $ (boyut/adıma göre ölçeklenir)
- **SDXL modelleri**: Benzer fiyatlandırma formülü
- **SD1.5/SD2**: Daha düşük maliyetli seçenekler

### Ses Modelleri

- **Melo-TTS**: 1M karakter başına 5,00 $

## Başlarken

Kurulumunuzu çalışan örneklerle test edin:

```bash
npx promptfoo@latest init --example hyperbolic
```

Bu, metin üretimi, görüntü oluşturma, ses sentezi ve görme görevleri için test edilmiş yapılandırmaları içerir.

## Notlar

- **Model kullanılabilirliği değişebilir** - Bazı modeller Pro kademe erişimi gerektirir (5 $ + depozito)
- **Hız sınırları**: Temel kademe: dakikada 60 istek (ücretsiz), Pro kademe: dakikada 600 istek
- **Önerilen modeller**: Metin için `meta-llama/Llama-3.3-70B-Instruct`, görüntüler için `SDXL1.0-base` kullanın
- Tüm uç noktalar, kolay entegrasyon için OpenAI uyumlu format kullanır
- VLM modelleri çok modlu girişleri (metin + görüntüler) destekler
