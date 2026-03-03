---
description: Maliyet etkin yapay zeka modeli değerlendirmesi ve testi için promptfoo ile Nscale Sunucusuz Çıkarım API'sini kullanın
---

# Nscale

Nscale sağlayıcısı, [Nscale Sunucusuz Çıkarım API'si](https://nscale.com/serverless) modellerini promptfoo ile kullanmanıza olanak tanır. Nscale; diğer sağlayıcılara kıyasla %80'e varan tasarruf, sıfır hız sınırı ve bekleme süresi (cold start) olmadan maliyet etkin yapay zeka çıkarımı sunar.

## Kurulum

Nscale hizmet jetonunuzu (service token) bir ortam değişkeni olarak ayarlayın:

```bash
export NSCALE_SERVICE_TOKEN=servis_jetonunuz_buraya
```

Alternatif olarak, bunu `.env` dosyanıza ekleyebilirsiniz:

```env
NSCALE_SERVICE_TOKEN=servis_jetonunuz_buraya
```

### Kimlik Bilgilerini Alma

Servis jetonlarını şu şekilde alabilirsiniz:

1. [Nscale](https://nscale.com/) adresinden kaydolun
2. Hesap ayarlarınıza gidin
3. "Service Tokens" bölümüne gidin

## Yapılandırma

Promptfoo yapılandırmanızda Nscale modellerini kullanmak için `nscale:` önekini ve ardından model adını kullanın:

```yaml
providers:
  - nscale:openai/gpt-oss-120b
  - nscale:meta/llama-3.3-70b-instruct
  - nscale:qwen/qwen-3-235b-a22b-instruct
```

## Model Türleri

Nscale, belirli uç nokta formatları aracılığıyla farklı model türlerini destekler:

### Sohbet Tamamlama (Chat Completion) Modelleri (Varsayılan)

Sohbet tamamlama modelleri için her iki formatı da kullanabilirsiniz:

```yaml
providers:
  - nscale:chat:openai/gpt-oss-120b
  - nscale:openai/gpt-oss-120b # Varsayılan olarak sohbet (chat) kullanılır
```

### Tamamlama (Completion) Modelleri

Metin tamamlama modelleri için:

```yaml
providers:
  - nscale:completion:openai/gpt-oss-20b
```

### Gömme (Embedding) Modelleri

Gömme modelleri için:

```yaml
providers:
  - nscale:embedding:qwen/qwen3-embedding-8b
  - nscale:embeddings:qwen/qwen3-embedding-8b # Alternatif format
```

## Popüler Modeller

Nscale, geniş bir popüler yapay zeka modelleri yelpazesi sunar:

### Metin Üretim Modelleri

| Model                         | Sağlayıcı Formatı                               | Kullanım Alanı                      |
| ----------------------------- | ----------------------------------------------- | ----------------------------------- |
| GPT OSS 120B                  | `nscale:openai/gpt-oss-120b`                    | Genel amaçlı akıl yürütme ve görevler |
| GPT OSS 20B                   | `nscale:openai/gpt-oss-20b`                     | Hafif genel amaçlı model            |
| Qwen 3 235B Instruct          | `nscale:qwen/qwen-3-235b-a22b-instruct`         | Büyük ölçekli dil anlama            |
| Qwen 3 235B Instruct 2507     | `nscale:qwen/qwen-3-235b-a22b-instruct-2507`    | En son Qwen 3 235B varyantı         |
| Qwen 3 4B Thinking 2507       | `nscale:qwen/qwen-3-4b-thinking-2507`           | Akıl yürütme ve düşünme görevleri   |
| Qwen 3 8B                     | `nscale:qwen/qwen-3-8b`                         | Orta boy genel amaçlı model         |
| Qwen 3 14B                    | `nscale:qwen/qwen-3-14b`                        | Geliştirilmiş akıl yürütme yetenekleri|
| Qwen 3 32B                    | `nscale:qwen/qwen-3-32b`                        | Büyük ölçekli akıl yürütme ve analiz|
| Qwen 2.5 Coder 3B Instruct    | `nscale:qwen/qwen-2.5-coder-3b-instruct`        | Hafif kod üretimi                   |
| Qwen 2.5 Coder 7B Instruct    | `nscale:qwen/qwen-2.5-coder-7b-instruct`        | Kod üretimi ve programlama          |
| Qwen 2.5 Coder 32B Instruct   | `nscale:qwen/qwen-2.5-coder-32b-instruct`       | Gelişmiş kod üretimi                |
| Qwen QwQ 32B                  | `nscale:qwen/qwq-32b`                           | Uzmanlaşmış akıl yürütme modeli     |
| Llama 3.3 70B Instruct        | `nscale:meta/llama-3.3-70b-instruct`            | Yüksek kaliteli talimat izleme      |
| Llama 3.1 8B Instruct         | `nscale:meta/llama-3.1-8b-instruct`             | Verimli talimat izleme              |
| Llama 4 Scout 17B             | `nscale:meta/llama-4-scout-17b-16e-instruct`    | Görüntü-Metin yetenekleri           |
| DeepSeek R1 Distill Llama 70B | `nscale:deepseek/deepseek-r1-distill-llama-70b` | Verimli akıl yürütme modeli         |
| DeepSeek R1 Distill Llama 8B  | `nscale:deepseek/deepseek-r1-distill-llama-8b`  | Hafif akıl yürütme modeli           |
| DeepSeek R1 Distill Qwen 1.5B | `nscale:deepseek/deepseek-r1-distill-qwen-1.5b` | Ultra hafif akıl yürütme            |
| DeepSeek R1 Distill Qwen 7B   | `nscale:deepseek/deepseek-r1-distill-qwen-7b`   | Kompakt akıl yürütme modeli         |
| DeepSeek R1 Distill Qwen 14B  | `nscale:deepseek/deepseek-r1-distill-qwen-14b`  | Orta boy akıl yürütme modeli        |
| DeepSeek R1 Distill Qwen 32B  | `nscale:deepseek/deepseek-r1-distill-qwen-32b`  | Büyük akıl yürütme modeli           |
| Devstral Small 2505           | `nscale:mistral/devstral-small-2505`            | Kod üretimi ve geliştirme           |
| Mixtral 8x22B Instruct        | `nscale:mistral/mixtral-8x22b-instruct-v0.1`    | Büyük MoE (experts karması) modeli  |

### Gömme (Embedding) Modelleri

| Model               | Sağlayıcı Formatı                          | Kullanım Alanı                 |
| ------------------- | ------------------------------------------ | ------------------------------ |
| Qwen 3 Embedding 8B | `nscale:embedding:Qwen/Qwen3-Embedding-8B` | Metin gömmeleri ve benzerlik   |

### Metinden Görüntüye Modeller

| Model                 | Sağlayıcı Formatı                                       | Kullanım Alanı                |
| --------------------- | ------------------------------------------------------- | ----------------------------- |
| Flux.1 Schnell        | `nscale:image:BlackForestLabs/FLUX.1-schnell`           | Hızlı görüntü üretimi         |
| Stable Diffusion XL   | `nscale:image:stabilityai/stable-diffusion-xl-base-1.0` | Yüksek kaliteli görüntü üretimi|
| SDXL Lightning 4-step | `nscale:image:ByteDance/SDXL-Lightning-4step`           | Ultra hızlı görüntü üretimi   |
| SDXL Lightning 8-step | `nscale:image:ByteDance/SDXL-Lightning-8step`           | Dengeli hız ve kalite         |

## Yapılandırma Seçenekleri

Nscale, standart OpenAI uyumlu parametreleri destekler:

```yaml
providers:
  - id: nscale:openai/gpt-oss-120b
    config:
      temperature: 0.7
      max_tokens: 1024
      top_p: 0.9
      frequency_penalty: 0.1
      presence_penalty: 0.2
      stop: ['END', 'STOP']
      stream: true
```

### Desteklenen Parametreler

- `temperature`: Rastgeleliği kontrol eder (0.0 - 2.0)
- `max_tokens`: Oluşturulacak maksimum token sayısı
- `top_p`: Çekirdek örnekleme (nucleus sampling) parametresi
- `frequency_penalty`: Frekansa dayalı tekrarı azaltır
- `presence_penalty`: Varlığa dayalı tekrarı azaltır
- `stop`: Üretimi durduracak diziler
- `stream`: Akışlı (streaming) yanıtları etkinleştirir
- `seed`: Deterministik örnekleme tohumu

## Örnek Yapılandırma

İşte eksiksiz bir yapılandırma örneği:

```yaml
providers:
  - id: nscale-gpt-oss
    config:
      temperature: 0.7
      max_tokens: 512
  - id: nscale-llama
    config:
      temperature: 0.5
      max_tokens: 1024

prompts:
  - '{{concept}} kavramını basit terimlerle açıkla'
  - '{{concept}} kavramının temel faydaları nelerdir?'

tests:
  - vars:
      concept: kuantum bilişimi
    assert:
      - type: contains
        value: 'kuantum'
      - type: llm-rubric
        value: 'Açıklama açık ve doğru olmalıdır'
```

## Fiyatlandırma

Nscale son derece rekabetçi fiyatlar sunar:

- **Metin Üretimi**: 1M token başına 0,01 $ giriş / 0,03 $ çıkıştan başlar
- **Gömmeler**: 1M token başına 0,04 $
- **Görüntü Üretimi**: Megapiksel başına 0,0008 $'dan başlar

En güncel fiyatlandırma bilgileri için [Nscale fiyatlandırma sayfasını](https://docs.nscale.com/pricing) ziyaret edin.

## Temel Özellikler

- **Maliyet Etkin**: Diğer sağlayıcılara kıyasla %80'e varan tasarruf
- **Sıfır Hız Sınırı**: Azaltma (throttling) veya istek sınırı yoktur
- **Beklemesiz (No Cold Starts)**: Anlık yanıt süreleri
- **Sunucusuz (Serverless)**: Altyapı yönetimi gerektirmez
- **OpenAI Uyumlu**: Standart API arayüzü
- **Küresel Kullanılabilirlik**: Dünya genelinde düşük gecikmeli çıkarım

## Hata Yönetimi

Nscale sağlayıcısı yaygın sorunlar için yerleşik hata yönetimi içerir:

- Ağ zaman aşımları ve yeniden denemeler
- Hız sınırlama (Nscale'de hız sınırı olmasa da protokol düzeyinde ele alınır)
- Geçersiz API anahtarı hataları
- Model kullanılabilirlik sorunları

## Destek

Nscale sağlayıcısı için destek kanalları:

- [Nscale Belgeleri](https://docs.nscale.com/)
- [Nscale Topluluk Discord](https://discord.gg/nscale)
- [promptfoo GitHub Sorunları](https://github.com/promptfoo/promptfoo/issues)
