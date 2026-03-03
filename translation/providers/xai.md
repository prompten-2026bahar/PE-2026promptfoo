---
title: xAI (Grok) Sağlayıcısı
description: Ajan tabanlı araç çağırma ve karmaşık analizler için gelişmiş akıl yürütmeye sahip Grok 4.1 Fast ve Grok-4 dahil xAI Grok modellerini dağıtın
keywords: [xai, grok, grok-4-1-fast, grok-4, grok-3, akıl yürütme, vizyon, llm, ajan tabanlı]
---

# xAI (Grok)

`xai` sağlayıcısı, OpenAI formatıyla uyumlu bir API arayüzü üzerinden [xAI'ın Grok modellerini](https://x.ai/) destekler. Sağlayıcı, kullanılan modele bağlı olarak hem metin hem de görme (vision) yeteneklerini destekler.

## Kurulum

xAI API'sini kullanmak için `XAI_API_KEY` ortam değişkenini ayarlayın veya yapılandırma dosyasındaki `apiKey` aracılığıyla belirtin.

```sh
export XAI_API_KEY=api_anahtariniz_buraya
```

## Desteklenen Modeller

xAI sağlayıcısı aşağıdaki model formatlarını destekler:

### Grok 4.1 Fast Modelleri

- `xai:grok-4-1-fast-reasoning` - Akıl yürütme ile ajan tabanlı araç çağırma için optimize edilmiş sınır ötesi model (2M bağlam)
- `xai:grok-4-1-fast-non-reasoning` - Akıl yürütme olmadan anlık yanıtlar için hızlı varyant (2M bağlam)
- `xai:grok-4-1-fast` - grok-4-1-fast-reasoning için takma ad
- `xai:grok-4-1-fast-latest` - grok-4-1-fast-reasoning için takma ad

### Grok Code Fast Modelleri

- `xai:grok-code-fast-1` - Ajan tabanlı kodlama için optimize edilmiş, hızlı ve ekonomik akıl yürütme modeli (256K bağlam)
- `xai:grok-code-fast` - grok-code-fast-1 için takma ad
- `xai:grok-code-fast-1-0825` - code-fast modelinin belirli bir sürümü (256K bağlam)

### Grok-4 Fast Modelleri

- `xai:grok-4-fast-reasoning` - 2M bağlam penceresine sahip hızlı akıl yürütme modeli
- `xai:grok-4-fast-non-reasoning` - Anlık yanıtlar için hızlı akıl yürütme yapmayan model (2M bağlam)
- `xai:grok-4-fast` - grok-4-fast-reasoning için takma ad
- `xai:grok-4-fast-latest` - grok-4-fast-reasoning için takma ad

### Grok-4 Modelleri

- `xai:grok-4-0709` - Amiral gemisi akıl yürütme modeli (256K bağlam)
- `xai:grok-4` - En son Grok-4 modeli için takma ad
- `xai:grok-4-latest` - En son Grok-4 modeli için takma ad

### Grok-3 Modelleri

- `xai:grok-3-beta` - Kurumsal görevler için en son amiral gemisi model (131K bağlam)
- `xai:grok-3-fast-beta` - En hızlı amiral gemisi model (131K bağlam)
- `xai:grok-3-mini-beta` - Temel görevler için daha küçük model, akıl yürütme çabasını (reasoning effort) destekler (32K bağlam)
- `xai:grok-3-mini-fast-beta` - Daha hızlı mini model, akıl yürütme çabasını destekler (32K bağlam)
- `xai:grok-3` - grok-3-beta için takma ad
- `xai:grok-3-latest` - grok-3-beta için takma ad
- `xai:grok-3-fast` - grok-3-fast-beta için takma ad
- `xai:grok-3-fast-latest` - grok-3-fast-beta için takma ad
- `xai:grok-3-mini` - grok-3-mini-beta için takma ad
- `xai:grok-3-mini-latest` - grok-3-mini-beta için takma ad
- `xai:grok-3-mini-fast` - grok-3-mini-fast-beta için takma ad
- `xai:grok-3-mini-fast-latest` - grok-3-mini-fast-beta için takma ad

### Grok-2 ve Önceki Modeller

- `xai:grok-2-latest` - En son Grok-2 modeli (131K bağlam)
- `xai:grok-2-vision-latest` - En son Grok-2 görme (vision) modeli (32K bağlam)
- `xai:grok-2-vision-1212`
- `xai:grok-2-1212`
- `xai:grok-beta` - Beta sürümü (131K bağlam)
- `xai:grok-vision-beta` - Görme beta sürümü (8K bağlam)

Belirli sürümlü modelleri de kullanabilirsiniz:

- `xai:grok-2-1212`
- `xai:grok-2-vision-1212`

## Yapılandırma

Sağlayıcı, tüm [OpenAI sağlayıcısı](/docs/providers/openai) yapılandırma seçeneklerini ve Grok'a özgü seçenekleri destekler. Örnek kullanım:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: xai:grok-3-mini-beta
    config:
      temperature: 0.7
      reasoning_effort: 'high' # Sadece grok-3-mini modelleri için
      apiKey: api_anahtariniz_buraya # XAI_API_KEY ortam değişkenine alternatif
```

### Akıl Yürütme (Reasoning) Desteği

Birden fazla Grok modeli akıl yürütme yeteneklerini destekler:

**Grok Code Fast Modelleri**: `grok-code-fast-1` ailesi, ajan tabanlı kodlama iş akışları için optimize edilmiş akıl yürütme modelleridir. Şunları desteklerler:

- Fonksiyon çağırma ve araç kullanımı
- `search_parameters` aracılığıyla web araması
- Yerleşik akıl yürütme ile hızlı çıkarım

**Grok-3 Modelleri**: `grok-3-mini-beta` ve `grok-3-mini-fast-beta` modelleri, `reasoning_effort` parametresi aracılığıyla akıl yürütmeyi destekler:

- `reasoning_effort: "low"` - Minimal düşünme süresi, hızlı yanıtlar için daha az token kullanır
- `reasoning_effort: "high"` - Maksimum düşünme süresi, karmaşık problemler için daha fazla token kullanır

:::info

Grok-3 için akıl yürütme sadece mini varyantlarında mevcuttur. Standart `grok-3-beta` ve `grok-3-fast-beta` modelleri akıl yürütmeyi desteklemez.

:::

### Grok 4.1 Fast Özel Davranışı

Grok 4.1 Fast, xAI'ın özellikle ajan tabanlı araç çağırma için optimize edilmiş sınır ötesi modelidir:

- **İki varyant**: Maksimum zeka için `grok-4-1-fast-reasoning`, anlık yanıtlar için `grok-4-1-fast-non-reasoning`
- **Devasa bağlam penceresi**: Karmaşık, çok turlu ajan etkileşimlerini yönetmek için 2.000.000 token
- **Araç çağırma için optimize edilmiş**: Simüle edilmiş ortamlarda RL (pekiştirmeli öğrenme) aracılığıyla yüksek performanslı ajan tabanlı araç çağırma için özel olarak eğitilmiştir
- **Düşük gecikme süresi ve maliyet**: Hızlı çıkarım ile 1M giriş tokenı başına 0,20 $, 1M çıkış tokenı başına 0,50 $
- **Desteklenmeyen parametreler**: Grok-4 ile aynı kısıtlamalar mevcuttur (presence_penalty, frequency_penalty, stop, reasoning_effort yok)

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: xai:grok-4-1-fast-reasoning
    config:
      temperature: 0.7
      max_completion_tokens: 4096
```

### Grok-4 Fast Özel Davranışı

Grok-4 Fast modelleri, Grok-4 ile aynı yetenekleri ancak daha hızlı çıkarım ve daha düşük maliyetle sunar:

- **İki varyant**: Akıl yürütme görevleri için `grok-4-fast-reasoning`, anlık yanıtlar için `grok-4-fast-non-reasoning`
- **2M bağlam penceresi**: Grok 4.1 Fast ile aynı büyük bağlam
- **Grok-4 ile aynı parametre kısıtlamaları**: presence_penalty, frequency_penalty, stop veya reasoning_effort yok

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: xai:grok-4-fast-reasoning
    config:
      temperature: 0.7
      max_completion_tokens: 4096
```

### Grok-4 Özel Davranışı

Grok-4, önceki Grok modellerine kıyasla önemli değişiklikler getirir:

- **Her zaman akıl yürütme kullanır**: Grok-4, her zaman maksimum akıl yürütme kapasitesinde çalışan bir akıl yürütme modelidir
- **`reasoning_effort` parametresi yoktur**: Grok-3 mini modellerinin aksine, Grok-4 `reasoning_effort` parametresini desteklemez
- **Desteklenmeyen parametreler**: Aşağıdaki parametreler desteklenmez ve otomatik olarak filtrelenir:
  - `presencePenalty` / `presence_penalty`
  - `frequencyPenalty` / `frequency_penalty`
  - `stop`
- **Daha büyük bağlam penceresi**: Grok-3 modelleri için 131.072 olan bağlam penceresi 256.000 tokendır
- **`max_completion_tokens` kullanır**: Bir akıl yürütme modeli olarak Grok-4, `max_tokens` yerine `max_completion_tokens` kullanır

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: xai:grok-4
    config:
      temperature: 0.7
      max_completion_tokens: 4096
```

### Grok Code Fast Özel Davranışı

Grok Code Fast modelleri, ajan tabanlı kodlama iş akışları için optimize edilmiştir ve birkaç temel özellik sunar:

- **Hız için Tasarlandı**: Birden fazla araç çağrısının yaygın olduğu ajan tabanlı kodlama araçları için son derece duyarlı olacak şekilde tasarlanmıştır
- **Ekonomik Fiyatlandırma**: 1M giriş tokenı başına 0,20 $ ve 1M çıkış tokenı başına 1,50 $ ile amiral gemisi modellerden önemli ölçüde daha uygundur
- **Akıl Yürütme Yetenekleri**: Kod analizi, hata ayıklama ve problem çözme için yerleşik akıl yürütme
- **Araç Entegrasyonu**: Fonksiyon çağırma, araç kullanımı ve web araması için mükemmel destek
- **Kodlama Uzmanlığı**: Özellikle TypeScript, Python, Java, Rust, C++ ve Go konularında yetkindir

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: xai:grok-code-fast-1
    # veya takma adı kullanın:
    # - id: xai:grok-code-fast
    config:
      temperature: 0.1 # Kodlama görevleri için genellikle düşük sıcaklık tercih edilir
      max_completion_tokens: 4096
      search_parameters:
        mode: auto # Kodlama yardımı için web aramasını etkinleştir
```

### Bölge Desteği

Bölgeye özel bir API uç noktası kullanmak için bir bölge belirtebilirsiniz:

```yaml
providers:
  - id: xai:grok-2-latest
    config:
      region: us-west-1 # https://us-west-1.api.x.ai/v1 uç noktasını kullanacaktır
```

Bu, Python istemcisinde `base_url="https://us-west-1.api.x.ai/v1"` ayarını yapmaya eşdeğerdir.

### Canlı Arama (Beta)

:::warning Kullanımdan Kaldırma Bildirimi

xAI, Canlı Arama API'sinin (`search_parameters` aracılığıyla) **15 Aralık 2025'e kadar kullanımdan kaldırılacağını** duyurdu. Bunun yerine, gelişmiş ajan tabanlı arama yetenekleri sağlayan Agent Tools API kullanılacaktır. Ajan Araçları (Agent Tools) Responses API uç noktasını gerektirir - daha fazla ayrıntı için [Ajan Araçları API'si](#ajan-araçları-api-si-responses-api) bölümüne bakın.

:::

Modelin web'den veya X'ten gerçek zamanlı bilgi çekmesine izin vermek için isteğe bağlı olarak Grok'un **Canlı Arama** özelliğini etkinleştirebilirsiniz. Sağlayıcı yapılandırmanızda bir `search_parameters` nesnesi iletin. `mode` alanı aramanın nasıl kullanılacağını kontrol eder:

- `off` – Aramayı devre dışı bırak
- `auto` – Model ne zaman arama yapacağına karar verir (varsayılan)
- `on` – Her zaman canlı arama yap

`sources`, `from_date`, `to_date` ve `return_citations` gibi ek alanlar da sağlanabilir.

```yaml title="promptfooconfig.yaml"
providers:
  - id: xai:grok-3-beta
    config:
      search_parameters:
        mode: auto
        return_citations: true
        sources:
          - type: web
```

Seçeneklerin tam listesi için [xAI belgelerine](https://docs.x.ai/docs) bakın.

### Ajan Araçları API'si (Responses API)

Web araması, X araması ve kod yorumlama (code interpretation) için otonom sunucu tarafı araç yürütmeyi etkinleştiren xAI Agent Tools API'sine erişmek için `xai:responses:<model>` sağlayıcısını kullanın.

```yaml title="promptfooconfig.yaml"
providers:
  - id: xai:responses:grok-4-1-fast-reasoning
    config:
      temperature: 0.7
      max_output_tokens: 4096
      tools:
        - type: web_search
        - type: x_search
```

#### Mevcut Ajan Araçları

| Araç                 | Açıklama                                       |
| -------------------- | ---------------------------------------------- |
| `web_search`         | Web'de arama yapın ve sayfaları inceleyin      |
| `x_search`           | X gönderilerini, kullanıcılarını ve başlıklarını arayın |
| `code_interpreter`   | Bir korumalı alanda (sandbox) Python kodu yürütün |
| `collections_search` | Yüklenen bilgi tabanlarında arama yapın        |
| `mcp`                | Uzak MCP sunucularına bağlanın                |

#### Web Arama Aracı (Web Search Tool)

```yaml
tools:
  - type: web_search
    filters:
      allowed_domains:
        - example.com
        - news.com
      # VEYA excluded_domains (ikisi birden kullanılamaz)
    enable_image_understanding: true
```

#### X Arama Aracı (X Search Tool)

```yaml
tools:
  - type: x_search
    from_date: '2025-01-01' # ISO8601 formatı
    to_date: '2025-11-27'
    allowed_x_handles:
      - elonmusk
    enable_image_understanding: true
    enable_video_understanding: true
```

#### Kod Yorumlayıcı Aracı (Code Interpreter Tool)

```yaml
tools:
  - type: code_interpreter
    container:
      pip_packages:
        - numpy
        - pandas
```

#### Tam Örnek

```yaml title="promptfooconfig.yaml"
providers:
  - id: xai:responses:grok-4-fast
    config:
      temperature: 0.7
      tools:
        - type: web_search
          enable_image_understanding: true
        - type: x_search
          from_date: '2025-01-01'
        - type: code_interpreter
          container:
            pip_packages:
              - numpy
      tool_choice: auto # auto, required veya none
      parallel_tool_calls: true

tests:
  - vars:
      question: En son yapay zeka haberleri neler? Web'de ve X'te arama yapın.
    assert:
      - type: contains
        value: yapay zeka
```

#### Responses API Yapılandırması

| Parametre              | Tür     | Açıklama                                      |
| ---------------------- | ------- | --------------------------------------------- |
| `temperature`          | sayı    | Örnekleme sıcaklığı (0-2)                     |
| `max_output_tokens`    | sayı    | Üretilecek maksimum token                     |
| `top_p`                | sayı    | Çekirdek örnekleme parametresi                |
| `tools`                | array   | Etkinleştirilecek ajan araçları               |
| `tool_choice`          | dize    | Araç seçim modu: auto, required, none         |
| `parallel_tool_calls`  | boolean | Paralel araç yürütmeye izin ver               |
| `instructions`         | dize    | Sistem düzeyinde talimatlar                   |
| `previous_response_id` | dize    | Çok turlu konuşmalar için                     |
| `store`                | boolean | Yanıtı daha sonra almak üzere sakla           |
| `response_format`      | nesne   | Yapılandırılmış çıktı için JSON şeması       |

#### Desteklenen Modeller

Responses API, Grok 4 modelleriyle çalışır:

- `grok-4-1-fast-reasoning` (ajan tabanlı iş akışları için önerilir)
- `grok-4-1-fast-non-reasoning`
- `grok-4-fast-reasoning`
- `grok-4-fast-non-reasoning`
- `grok-4`

#### Canlı Arama'dan Göç Etme

`search_parameters` aracılığıyla Canlı Arama kullanıyorsanız, 15 Aralık 2025'ten önce Responses API'sine göç edin:

**Önce (Canlı Arama - kullanımdan kaldırıldı):**

```yaml
providers:
  - id: xai:grok-4-1-fast-reasoning
    config:
      search_parameters:
        mode: auto
        sources:
          - type: web
          - type: x
```

**Sonra (Responses API):**

```yaml
providers:
  - id: xai:responses:grok-4-1-fast-reasoning
    config:
      tools:
        - type: web_search
        - type: x_search
```

### Ertelenmiş Sohbet Tamamlamaları (Deferred Chat Completions)

:::info Henüz Desteklenmiyor

xAI, bir `request_id` aracılığıyla asenkron olarak alınabilen, uzun süreli istekler için [Ertelenmiş Sohbet Tamamlamaları](https://docs.x.ai/docs/guides/deferred-chat-completions) sunar. Bu özellik henüz promptfoo'da desteklenmemektedir. Asenkron iş akışları için doğrudan xAI Python SDK'sını kullanın.

:::

### Fonksiyon Çağırma (Function Calling)

xAI, istemci tarafı araç yürütme için standart OpenAI uyumlu fonksiyon çağırmayı destekler:

```yaml title="promptfooconfig.yaml"
providers:
  - id: xai:grok-4-1-fast-reasoning
    config:
      tools:
        - type: function
          function:
            name: get_weather
            description: Bir konum için mevcut hava durumunu al
            parameters:
              type: object
              properties:
                location:
                  type: string
                  description: Şehir ve eyalet
              required:
                - location
```

### Yapılandırılmış Çıktılar (Structured Outputs)

xAI, JSON şeması üzerinden yapılandırılmış çıktıları destekler:

```yaml title="promptfooconfig.yaml"
providers:
  - id: xai:grok-4
    config:
      response_format:
        type: json_schema
        json_schema:
          name: analiz_sonucu
          strict: true
          schema:
            type: object
            properties:
              ozet:
                type: string
              guven_puani:
                type: number
            required:
              - ozet
              - guven_puani
            additionalProperties: false
```

Şemaları harici dosyalardan da yükleyebilirsiniz:

```yaml
config:
  response_format: file://./schemas/analiz-semasi.json
```

İç içe geçmiş dosya başvuruları ve değişken işleme desteklenmektedir (ayrıntılar için [OpenAI belgelerine](/docs/providers/openai#harici-dosya-basvurulari) bakın).

### Vizyon (Vision) Desteği

Görme yeteneklerine sahip modeller için, OpenAI ile aynı formatı kullanarak istemlerinize görüntüler dahil edebilirsiniz. Bir `prompt.yaml` dosyası oluşturun:

```yaml title="prompt.yaml"
- role: user
  content:
    - type: image_url
      image_url:
        url: '{{image_url}}'
        detail: 'high'
    - type: text
      text: '{{question}}'
```

Ardından promptfoo yapılandırmanızda buna atıfta bulunun:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - file://prompt.yaml

providers:
  - id: xai:grok-2-vision-latest

tests:
  - vars:
      image_url: 'https://example.com/image.jpg'
      question: "Bu görüntüde ne var?"
```

### Görüntü Üretimi

xAI ayrıca Grok görüntü modeli aracılığıyla görüntü üretimini de destekler:

```yaml
providers:
  - xai:image:grok-2-image
```

Görüntü üretimi için örnek yapılandırma:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - '{{style}} tarzında bir {{subject}} tablosu'

providers:
  - id: xai:image:grok-2-image
    config:
      n: 1 # Üretilecek görüntü sayısı (1-10)
      response_format: 'url' # 'url' veya 'b64_json'

tests:
  - vars:
      style: 'empresyonist'
      subject: 'dağlar üzerinde gün batımı'
```

### Video Üretimi

xAI, `xai:video:grok-imagine-video` sağlayıcısını kullanarak Grok Imagine API üzerinden video üretimini destekler:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - 'Şu sahnenin videosunu üret: {{scene}}'

providers:
  - id: xai:video:grok-imagine-video
    config:
      duration: 5 # 1-15 saniye
      aspect_ratio: '16:9'
      resolution: '720p'

tests:
  - vars:
      scene: yün yumağıyla oynayan bir kedi
    assert:
      - type: cost
        threshold: 1.0
```

#### Yapılandırma Seçenekleri

| Seçenek            | Tür     | Varsayılan | Açıklama                                       |
| ------------------ | ------- | ---------- | ---------------------------------------------- |
| `duration`         | sayı    | 8          | Saniye cinsinden video uzunluğu (1-15)         |
| `aspect_ratio`     | dize    | 16:9       | En boy oranı: 16:9, 4:3, 1:1, 9:16, 3:4, 3:2, 2:3 |
| `resolution`       | dize    | 720p       | Çıkış çözünürlüğü: 720p, 480p                  |
| `poll_interval_ms` | sayı    | 10000      | Milisaniye cinsinden yoklama aralığı           |
| `max_poll_time_ms` | sayı    | 600000     | Maksimum bekleme süresi (10 dakika)            |

#### Görüntüden Videoya (Image-to-Video)

Bir görüntü URL'si sağlayarak statik bir görüntüyü hareketlendirin:

```yaml
providers:
  - id: xai:video:grok-imagine-video
    config:
      image:
        url: 'https://example.com/image.jpg'
      duration: 5
```

#### Video Düzenleme

Metin talimatlarıyla mevcut bir videoyu düzenleyin:

```yaml
providers:
  - id: xai:video:grok-imagine-video
    config:
      video:
        url: 'https://example.com/kaynak-video.mp4'

prompts:
  - 'Renkleri daha canlı yap ve ağır çekim ekle'
```

:::note

Video düzenleme işlemleri; süre, en boy oranı ve çözünürlük doğrulamasını atlar çünkü bunlar kaynak video tarafından belirlenir.

:::

#### Fiyatlandırma

Video üretimi, üretilen videonun **saniyesi başına yaklaşık 0,05 $** olarak faturalandırılır.

### Sesli Ajan (Voice Agent) API'si

xAI Sesli Ajan API'si, WebSocket üzerinden Grok modelleriyle gerçek zamanlı sesli görüşmelere olanak tanır. `xai:voice:<model>` sağlayıcı formatını kullanın.

```yaml
providers:
  - xai:voice:grok-3
```

#### Yapılandırma

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: xai:voice:grok-3
    config:
      voice: 'Ara' # Ara, Rex, Sal, Eve veya Leo
      instructions: 'Yardımsever bir sesli asistansınız.'
      modalities: ['text', 'audio']
      websocketTimeout: 60000 # ms cinsinden bağlantı zaman aşımı
      tools:
        - type: web_search
        - type: x_search
```

#### Mevcut Sesler

| Ses | Açıklama   |
| --- | ---------- |
| Ara | Kadın sesi |
| Rex | Erkek sesi |
| Sal | Erkek sesi |
| Eve | Kadın sesi |
| Leo | Erkek sesi |

#### Yerleşik Araçlar

Ses API'si, otomatik olarak yürütülen sunucu tarafı araçları içerir:

| Araç          | Açıklama                                       |
| ------------- | ---------------------------------------------- |
| `web_search`  | Bilgi için web'de arama yapın                  |
| `x_search`    | X (Twitter) gönderilerinde arama yapın         |
| `file_search` | Vektör depolarında yüklü dosyaları arayın      |

```yaml
tools:
  - type: web_search
  - type: x_search
    allowed_x_handles:
      - elonmusk
      - xai
  - type: file_search
    vector_store_ids:
      - vs-123
    max_num_results: 10
```

#### Özel Fonksiyon Araçları ve İddialar (Assertions)

Özel fonksiyon araçlarını satır içi tanımlayabilir veya harici dosyalardan yükleyebilirsiniz:

```yaml title="promptfooconfig.yaml"
providers:
  - id: xai:voice:grok-3
    config:
      # Satır içi araç tanımı
      tools:
        - type: function
          name: sesi_ayarla
          description: Cihaz ses seviyesini ayarla
          parameters:
            type: object
            properties:
              level:
                type: number
                description: 0 ile 100 arası ses seviyesi
            required:
              - level

      # Veya harici dosyadan yükle (YAML veya JSON)
      # tools: file://tools.yaml

tests:
  - vars:
      question: 'Sesi yüzde 50'ye ayarla'
    assert:
      # Doğru fonksiyonun doğru argümanlarla çağrıldığını kontrol et
      - type: javascript
        value: |
          const calls = output.functionCalls || [];
          return calls.some(c => c.name === 'sesi_ayarla' && c.arguments?.level === 50);

      # Veya fonksiyon adı eşleşmesi için tool-call-f1 kullanın
      - type: tool-call-f1
        value: ['sesi_ayarla']
        threshold: 1.0
```

**Harici araçlar dosyası örneği:**

```yaml title="tools.yaml"
- type: function
  name: hava_durumunu_al
  description: Bir konum için mevcut hava durumunu al
  parameters:
    type: object
    properties:
      location:
        type: string
    required:
      - location

- type: function
  name: hatirlatici_kur
  description: Kullanıcı için bir hatırlatıcı kur
  parameters:
    type: object
    properties:
      message:
        type: string
      time:
        type: string
    required:
      - message
      - time
```

Fonksiyon araçları kullanıldığında, sağlayıcı çıktısı şunları içeren bir `functionCalls` dizisi içerir:

- `name`: Çağrılan fonksiyonun adı
- `arguments`: Ayrıştırılmış argümanlar nesnesi
- `result`: Fonksiyon işleyiciniz tarafından döndürülen sonuç (sağlanmışsa)

#### Özel Uç Nokta Yapılandırması

Proxyler veya bölgesel uç noktalar için yararlı olan Ses API'si için özel bir WebSocket uç noktası yapılandırabilirsiniz:

```yaml
providers:
  - id: xai:voice:grok-3
    config:
      # Seçenek 1: Tam temel URL (https://'yi wss://'ye dönüştürür)
      apiBaseUrl: 'https://my-proxy.example.com/v1'

      # Seçenek 2: Sadece ana bilgisayar (https://{host}/v1 oluşturur)
      # apiHost: 'my-proxy.example.com'
```

Ayrıca `XAI_API_BASE_URL` ortam değişkenini de kullanabilirsiniz:

```sh
export XAI_API_BASE_URL=https://my-proxy.example.com/v1
```

URL dönüşümü: Sağlayıcı, HTTP URL'lerini otomatik olarak WebSocket URL'lerine dönüştürür (`https://` → `wss://`, `http://` → `ws://`) ve Ses API'si uç noktasına ulaşmak için sonuna `/realtime` ekler.

#### Tam WebSocket URL Geçersiz Kılma

Yerel testler, özel proxyler veya sorgu parametreleri gerektiren uç noktalar gibi gelişmiş kullanım durumları için, hiçbir dönüşüm uygulanmadan tam olarak belirtildiği gibi kullanılacak tam bir WebSocket URL'si sağlayabilirsiniz:

```yaml
providers:
  - id: xai:voice:grok-3
    config:
      # Bu URL'yi tam olarak olduğu gibi kullan (hiçbir dönüşüm uygulanmaz)
      websocketUrl: 'wss://custom-endpoint.example.com/path?token=xyz&session=abc'
```

Bu özellik şunlar için yararlıdır:

- Sahte (mock) sunucularla yerel geliştirme ve test
- Özel proxy yapılandırmaları
- Kimlik doğrulama belirteçlerini veya oturum kimliklerini URL parametresi olarak ekleme
- Alternatif WebSocket ağ geçitleri veya bölgesel uç noktaları kullanma

#### Ses Yapılandırması (Audio Configuration)

Giriş/çıkış ses formatlarını yapılandırın:

```yaml
config:
  audio:
    input:
      format:
        type: audio/pcm
        rate: 24000
    output:
      format:
        type: audio/pcm
        rate: 24000
```

Desteklenen formatlar: `audio/pcm`, `audio/pcmu`, `audio/pcma`
Desteklenen örnekleme hızları: 8000, 16000, 22050, 24000, 32000, 44100, 48000 Hz

#### Tam Örnek

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - file://input.json

providers:
  - id: xai:voice:grok-3
    config:
      voice: 'Ara'
      instructions: 'Yardımsever bir sesli asistansınız.'
      modalities: ['text', 'audio']
      tools:
        - type: web_search

tests:
  - vars:
      question: 'En son yapay zeka gelişmeleri nelerdir?'
    assert:
      - type: llm-rubric
        value: Güncel yapay zeka haberleri hakkında bilgi verir
```

#### Fiyatlandırma

Sesli Ajan API'si, bağlantı süresinin **dakikası başına 0,05 $** olarak faturalandırılır.

Mevcut modeller ve API kullanımı hakkında daha fazla bilgi için [xAI belgelerine](https://docs.x.ai/docs) bakın.

## Örnekler
