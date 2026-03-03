---
title: Alibaba Cloud (Qwen) Sağlayıcısı
sidebar_label: Alibaba Cloud (Qwen)
description: Kurumsal uygulamalar için Qwen3, QwQ akıl yürütme ve özel kodlama/matematik/görme modelleri dahil olmak üzere Alibaba Cloud'un Qwen modellerini dağıtın
keywords: [alibaba, qwen, qwen3, dashscope, deepseek, qwq, akıl yürütme, görme, çok modlu, llm]
---

# Alibaba Cloud (Qwen)

[Alibaba Cloud'un DashScope API'si](https://www.alibabacloud.com/help/en/model-studio/getting-started/models), Qwen dil modellerine OpenAI uyumlu erişim sağlar. promptfoo'daki tüm [OpenAI sağlayıcısı](/docs/providers/openai/) seçenekleriyle uyumludur.

## Kurulum

Alibaba Cloud API'sini kullanmak için `DASHSCOPE_API_KEY` ortam değişkenini ayarlayın veya yapılandırma dosyasındaki `apiKey` aracılığıyla belirtin:

```sh
export DASHSCOPE_API_KEY=your_api_key_here
```

## Yapılandırma

Sağlayıcı tüm [OpenAI sağlayıcısı](/docs/providers/openai) yapılandırma seçeneklerini destekler. Örnek kullanım:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - alibaba:qwen-max # Basit kullanım
  - id: alibaba:qwen-plus # Takma adlar: alicloud:, aliyun:, dashscope:
    config:
      temperature: 0.7
      apiKey: your_api_key_here # DASHSCOPE_API_KEY ortam değişkenine alternatif
      apiBaseUrl: https://dashscope-intl.aliyuncs.com/compatible-mode/v1 # İsteğe bağlı: Varsayılan API temel URL'sini geçersiz kıl
```

:::note

Alibaba Cloud Pekin bölgesi konsolunu kullanıyorsanız, temel URL'yi uluslararası uç nokta yerine `https://dashscope.aliyuncs.com/compatible-mode/v1` olarak değiştirin.

:::

## Desteklenen Modeller

Alibaba sağlayıcısı aşağıdaki model formatları için destek içerir:

### Qwen 3 Amiral Gemisi (Flagship)

- `qwen3-max` - Akıl yürütme ve araç entegrasyonuna sahip yeni nesil amiral gemisi
- `qwen3-max-preview` - Düşünme modu (thinking mode) desteğine sahip önizleme sürümü
- `qwen3-max-2025-09-23` - Eylül 2025 anlık görüntüsü
- `qwen-max` - 32K bağlam (30,720 girdi, 8,192 çıktı)
- `qwen-max-latest` - Her zaman en yeni sürüme güncellenir
- `qwen-max-2025-01-25` - Ocak 2025 anlık görüntüsü
- `qwen-plus` / `qwen-plus-latest` - 128K-1M bağlam (düşünme ve düşünmeme modları)
- `qwen-plus-2025-09-11`, `qwen-plus-2025-07-28`, `qwen-plus-2025-07-14`, `qwen-plus-2025-04-28`, `qwen-plus-2025-01-25` - Tarihli anlık görüntüler
- `qwen-flash` / `qwen-flash-2025-07-28` - Gecikme süresi optimize edilmiş genel model
- `qwen-turbo` / `qwen-turbo-latest` / `qwen-turbo-2025-04-28` / `qwen-turbo-2024-11-01` - Hızlı, uygun maliyetli (qwen-flash ile değiştiriliyor)
- `qwen-long-latest` / `qwen-long-2025-01-25` - Uzun metin analizi, özetleme ve çıkarma için **10M bağlam**

### Qwen 3 Omni & Gerçek Zamanlı (Realtime)

- `qwen3-omni-flash` / `qwen3-omni-flash-2025-09-15` - Konuşma + görme desteğine sahip çok modlu amiral gemisi (düşünme ve düşünmeme modları)
- `qwen3-omni-flash-realtime` / `qwen3-omni-flash-realtime-2025-09-15` - Ses akışı girişi ve VAD ile gerçek zamanlı akış
- `qwen3-omni-30b-a3b-captioner` - Özel ses altyazı oluşturma modeli (konuşma, ortam sesleri, müzik)
- `qwen2.5-omni-7b` - Metin, görüntü, konuşma ve video girişli Qwen2.5 tabanlı çok modlu model

### Akıl Yürütme ve Araştırma (Reasoning & Research)

- `qwq-plus` - Alibaba'nın akıl yürütme modeli (ticari)
- `qwq-32b` - Qwen2.5 üzerinde eğitilmiş açık kaynaklı QwQ akıl yürütme modeli
- `qwq-32b-preview` - Deneysel QwQ araştırma modeli (2024)
- `qwen-deep-research` - Web aramalı uzun biçimli araştırma asistanı
- `qvq-max` / `qvq-max-latest` / `qvq-max-2025-03-25` - Görsel akıl yürütme modelleri (ticari)
- `qvq-72b-preview` - Deneysel görsel akıl yürütme araştırma modeli
- **DeepSeek modelleri** (Alibaba Cloud tarafından barındırılır):
  - `deepseek-v3.2-exp` / `deepseek-v3.1` / `deepseek-v3` - En yeni DeepSeek modelleri (671-685B)
  - `deepseek-r1` / `deepseek-r1-0528` - DeepSeek akıl yürütme modelleri
  - `deepseek-r1-distill-qwen-{1.5b,7b,14b,32b}` - Qwen2.5 üzerine distile edilmiş
  - `deepseek-r1-distill-llama-{8b,70b}` - Llama üzerine distile edilmiş

### Görme ve Çok Modlu (Vision & Multimodal)

**Ticari:**

- `qwen3-vl-plus` / `qwen3-vl-plus-2025-09-23` - Uzun bağlamlı yüksek çözünürlüklü görüntü desteği (düşünme ve düşünmeme modları)
- `qwen3-vl-flash` / `qwen3-vl-flash-2025-10-15` - Düşünme modu desteğine sahip hızlı görme modeli
- `qwen-vl-max` - 7.5K bağlam, görüntü başına 1.280 token
- `qwen-vl-plus` - Yüksek çözünürlüklü görüntü desteği
- `qwen-vl-ocr` - Belgeler, tablolar, el yazısı için OCR optimize edilmiş (30+ dil)

**Açık kaynak:**

- `qwen3-vl-235b-a22b-thinking` / `qwen3-vl-235b-a22b-instruct` - 235B parametreli Qwen3-VL
- `qwen3-vl-32b-thinking` / `qwen3-vl-32b-instruct` - 32B parametreli Qwen3-VL
- `qwen3-vl-30b-a3b-thinking` / `qwen3-vl-30b-a3b-instruct` - 30B parametreli Qwen3-VL
- `qwen3-vl-8b-thinking` / `qwen3-vl-8b-instruct` - 8B parameter Qwen3-VL
- `qwen2.5-vl-{72b,7b,3b}-instruct` - Qwen 2.5 VL serisi

### Ses ve Konuşma (Audio & Speech)

- `qwen3-asr-flash` / `qwen3-asr-flash-2025-09-08` - Çok dilli konuşma tanıma (11 dil, Çince lehçeleri)
- `qwen3-asr-flash-realtime` / `qwen3-asr-flash-realtime-2025-10-27` - Otomatik dil algılamalı gerçek zamanlı konuşma tanıma
- `qwen3-omni-flash-realtime` - VAD ile konuşma akışını destekler

### Kodlama ve Matematik (Coding & Math)

**Ticari:**

- `qwen3-coder-plus` / `qwen3-coder-plus-2025-09-23` / `qwen3-coder-plus-2025-07-22` - Araç çağırma özelliğine sahip kodlama ajanları
- `qwen3-coder-flash` / `qwen3-coder-flash-2025-07-28` - Hızlı kod üretimi
- `qwen-math-plus` / `qwen-math-plus-latest` / `qwen-math-plus-2024-09-19` / `qwen-math-plus-2024-08-16` - Matematik problemi çözme
- `qwen-math-turbo` / `qwen-math-turbo-latest` / `qwen-math-turbo-2024-09-19` - Hızlı matematiksel akıl yürütme
- `qwen-mt-{plus,turbo}` - Makine çevirisi (92 dil)
- `qwen-doc-turbo` - Belge madenciliği ve yapılandırılmış veri çıkarma

**Açık kaynak:**

- `qwen3-coder-480b-a35b-instruct` / `qwen3-coder-30b-a3b-instruct` - Açık kaynaklı Qwen3 kodlayıcı modelleri
- `qwen2.5-math-{72b,7b,1.5b}-instruct` - CoT/PoT/TIR akıl yürütmeye sahip matematik odaklı modeller

### Qwen 2.5 Serisi

Tümü 131K bağlamı destekler (129,024 girdi, 8,192 çıktı)

- `qwen2.5-{72b,32b,14b,7b}-instruct`
- `qwen2.5-{7b,14b}-instruct-1m`

### Qwen 2 Serisi

- `qwen2-72b-instruct` - 131K bağlam
- `qwen2-57b-a14b-instruct` - 65K bağlam
- `qwen2-7b-instruct` - 131K bağlam

### Qwen 1.5 Serisi

8K bağlam (6K girdi, 2K çıktı)

- `qwen1.5-{110b,72b,32b,14b,7b}-chat`

### Qwen 3 Açık Kaynaklı Modeller

Düşünme modu desteğine sahip en yeni açık kaynaklı Qwen3 modelleri:

- `qwen3-next-80b-a3b-thinking` / `qwen3-next-80b-a3b-instruct` - Yeni nesil 80B (Eylül 2025)
- `qwen3-235b-a22b-thinking-2507` / `qwen3-235b-a22b-instruct-2507` - 235B Temmuz 2025 sürümleri
- `qwen3-30b-a3b-thinking-2507` / `qwen3-30b-a3b-instruct-2507` - 30B Temmuz 2025 sürümleri
- `qwen3-235b-a22b` - Çift mod desteğine sahip 235B (düşünme/düşünmeme)
- `qwen3-32b` - 32B çift modlu model
- `qwen3-30b-a3b` - 30B çift modlu model
- `qwen3-14b`, `qwen3-8b`, `qwen3-4b` - Daha küçük çift modlu modeller
- `qwen3-1.7b`, `qwen3-0.6b` - Kenar/mobil modeller

### Üçüncü Taraf Modeller (Third-party Models)

**Kimi (Moonshot AI):**

- `moonshot-kimi-k2-instruct` - Çin'deki ilk açık kaynaklı trilyon parametreli MoE modeli (32B parametreyi etkinleştirir)

### Gömme Modelleri (Embeddings)

- `text-embedding-v3` - 1.024d vektörler, 8.192 token sınırı, 50+ dil
- `text-embedding-v4` - Esnek boyutlara (64-2048d) sahip en yeni Qwen3-Embedding, 100+ dil

### Görüntü Oluşturma (Image Generation)

- `qwen-image-plus` - Karmaşık metin oluşturma özelliğine sahip metinden görüntüye (Çince/İngilizce)

En güncel kullanılabilirlik için sıkça güncellenen [resmi DashScope model kataloğuna](https://www.alibabacloud.com/help/en/model-studio/getting-started/models) bakın.

## Ek Yapılandırma

- `vl_high_resolution_images`: bool - Görüntü token sınırını 1.280'den 16.384'e çıkarır (yalnızca qwen-vl-max)

Standart [OpenAI parametreleri](/docs/providers/openai/#configuring-parameters) (temperature, max_tokens) desteklenir. Temel URL: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` (veya Pekin bölgesi için `https://dashscope.aliyuncs.com/compatible-mode/v1`).

API kullanım detayları için [Alibaba Cloud belgelerine](https://www.alibabacloud.com/help/en/model-studio/getting-started/models) bakın.

## Ayrıca Bakınız

- [OpenAI Sağlayıcısı](/docs/providers/openai)

## Referans

- [Alibaba Cloud DashScope belgeleri](https://www.alibabacloud.com/help/en/model-studio/getting-started/models)
