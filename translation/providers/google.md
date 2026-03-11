---
sidebar_label: Google AI / Gemini
description: Kapsamlı çok modlu (multimodal) LLM testi ve değerlendirmesi için Google AI Studio API aracılığıyla metin, görüntü ve video girişlerini destekleyen Google Gemini modellerini yapılandırın
---

# Google AI / Gemini

`google` sağlayıcısı, Google AI Studio ve Gemini API ile entegrasyonu sağlar. Metin, görüntü ve video girişlerini destekleyen Google'ın son teknoloji dil modellerine erişim sunar.

Google AI Studio yerine Vertex AI kullanıyorsanız, [`vertex` sağlayıcısı](/docs/providers/vertex)na bakın.

## Kimlik Doğrulama

Google AI Studio API'sini kullanmak için bir API anahtarı kullanarak kimlik doğrulaması yapmanız gerekir. Şu adımları izleyin:

### 1. API Anahtarı Alın

1. [Google AI Studio](https://aistudio.google.com/) adresini ziyaret edin
2. Sol kenar çubuğunda "Get API key" (API anahtarı al) seçeneğine tıklayın
3. Yeni bir API anahtarı oluşturun veya mevcut olanı kullanın
4. API anahtarınızı kopyalayın

**Güvenlik Notu:** API anahtarlarını asla sürüm kontrol sistemine (Git vb.) yüklemeyin. Her zaman ortam değişkenlerini veya `.gitignore` dosyasına eklenmiş bir `.env` dosyasını kullanın.

### 2. Kimlik Doğrulamayı Yapılandırın

API anahtarınızı sağlamak için üç seçeneğiniz vardır:

#### Seçenek 1: Ortam Değişkeni (Önerilen)

`GOOGLE_API_KEY` ortam değişkenini ayarlayın:

```bash
# export kullanarak (Linux/macOS)
export GOOGLE_API_KEY="api_anahtarınız_buraya"

# set kullanarak (Windows Komut İstemi)
set GOOGLE_API_KEY=api_anahtarınız_buraya

# $env kullanarak (Windows PowerShell)
$env:GOOGLE_API_KEY="api_anahtarınız_buraya"
```

#### Seçenek 2: .env Dosyası (Geliştirme için Önerilen)

Proje kök dizininizde bir `.env` dosyası oluşturun:

```bash
# .env
GOOGLE_API_KEY=api_anahtarınız_buraya
```

Promptfoo, proje dizininizdeki `.env` dosyalarından ortam değişkenlerini otomatik olarak yükler. `.env` dosyasını `.gitignore` dosyanıza eklediğinizden emin olun.

#### Seçenek 3: Sağlayıcı Yapılandırması

API anahtarını doğrudan yapılandırmanızda belirtin:

```yaml
providers:
  - id: google:gemini-2.1-flash
    config:
      apiKey: api_anahtarınız_buraya
```

**Not:** Sürüm kontrolüne eklenebilecek yapılandırma dosyalarında API anahtarlarını sabit olarak yazmaktan kaçının. API anahtarı `GOOGLE_API_KEY` ortam değişkeninden otomatik olarak algılanır, bu nedenle genellikle yapılandırmada belirtmeniz gerekmez.

Yapılandırmanızda bir ortam değişkenine açıkça atıfta bulunmanız gerekiyorsa, Nunjucks şablon sözdizimini kullanın:

```yaml
providers:
  - id: google:gemini-2.1-flash # GOOGLE_API_KEY ortam değişkenini kullanır
    config:
      # apiKey: "{{ env.GOOGLE_API_KEY }}"  # isteğe bağlı, otomatik algılanır
      temperature: 0.7
```

### 3. Kimlik Doğrulamayı Doğrulayın

Kurulumunuzu basit bir istemle test edin:

```bash
promptfoo eval --prompt "Merhaba, nasılsın?" --providers google:gemini-2.1-flash
```

## Yapılandırma Seçenekleri

Kimlik doğrulamaya ek olarak şunları yapılandırabilirsiniz:

- `GOOGLE_API_HOST` - Google API ana bilgisayarını geçersiz kıl (varsayılan `generativelanguage.googleapis.com`)
- `GOOGLE_API_BASE_URL` - Google API temel URL'sini geçersiz kıl (varsayılan `https://generativelanguage.googleapis.com`)

Özel ana bilgisayar örneği:

```yaml
providers:
  - id: google:gemini-2.1-flash
    config:
      apiHost: custom.googleapis.com
      apiBaseUrl: https://custom.googleapis.com
```

## Hızlı Başlangıç

### 1. Temel Değerlendirme

Basit bir `promptfooconfig.yaml` oluşturun:

```yaml
# promptfooconfig.yaml
providers:
  - google:gemini-2.1-flash

prompts:
  - '{{topic}} hakkında bir haiku yaz'

tests:
  - vars:
      topic: 'yapay zeka'
  - vars:
      topic: 'okyanus'
```

Değerlendirmeyi çalıştırın:

```bash
promptfoo eval
```

### 2. Modelleri Karşılaştırma

Farklı Gemini modellerini karşılaştırın:

```yaml
providers:
  - google:gemini-2.1-flash
  - google:gemini-2.1-pro
  - google:gemini-2.0-flash

prompts:
  - '{{concept}} kavramını basit terimlerle açıkla'

tests:
  - vars:
      concept: 'kuantum bilişimi'
    assert:
      - type: contains
        value: 'kübit'
      - type: llm-rubric
        value: 'Açıklama bir lise öğrencisi tarafından anlaşılabilir olmalıdır'
```

### 3. Ortam Değişkenlerini Kullanma

```yaml
# Yapılandırmanızda ortam değişkenlerine atıfta bulunun
providers:
  - id: google:gemini-2.1-flash # GOOGLE_API_KEY ortam değişkenini kullanır
    config:
      # apiKey: "{{ env.GOOGLE_API_KEY }}"  # isteğe bağlı, otomatik algılanır
      temperature: '{{ env.TEMPERATURE | default(0.7) }}' # Ayarlanmamışsa varsayılan 0.7
```

## Sorun Giderme

### Yaygın Sorunlar

#### 1. API Anahtarı Bulunamadı

**Hata**: `API key not found`

**Çözüm**: API anahtarınızın düzgün ayarlandığından emin olun:

```bash
# Ortam değişkeninin ayarlanıp ayarlanmadığını kontrol edin
echo $GOOGLE_API_KEY

# Boşsa tekrar ayarlayın
export GOOGLE_API_KEY="api_anahtarınız_buraya"
```

#### 2. Geçersiz API Anahtarı

**Hata**: `API key not valid. Please pass a valid API key`

**Çözümler**:

- API anahtarınızı [Google AI Studio](https://aistudio.google.com/) adresinden doğrulayın
- Doğru API anahtarını kullandığınızdan emin olun (proje kimliği veya başka bir kimlik bilgisi değil)
- API anahtarınızın gerekli izinlere sahip olduğunu kontrol edin

#### 3. Hız Sınırlama (Rate Limiting)

**Hata**: `Resource has been exhausted`

**Çözümler**:

- İstekler arasına gecikme ekleyin:
  ```yaml
  # promptfooconfig.yaml
  evaluateOptions:
    delay: 1000 # API çağrıları arasında 1 saniye gecikme
  ```
- Google AI Studio'da API kotanızı yükseltin
- `gemini-1.5-flash-lite` gibi daha düşük hız kademesine sahip bir model kullanın

#### 4. Model Mevcut Değil

**Hata**: `Model not found`

**Çözümler**:

- Model adının yazımını kontrol edin
- Modelin bölgenizde mevcut olduğundan emin olun
- Modelin [mevcut modeller](https://ai.google.dev/models) listesinde olduğunu doğrulayın

### Hata Ayıklama İpuçları

1. **Ayrıntılı günlük kaydını (verbose) etkinleştirin**:

   ```bash
   promptfoo eval --verbose
   ```

2. **API anahtarınızı doğrudan test edin**:

   ```bash
   curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.1-flash:generateContent?key=$GOOGLE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Merhaba"}]}]}'
   ```

3. **Ortamınızı kontrol edin**:
   ```bash
   # Tüm GOOGLE_ ortam değişkenlerini listeleyin
   env | grep GOOGLE_
   ```

## Geçiş Kılavuzu

### Google AI Studio'dan Vertex AI'a Geçiş

Daha gelişmiş özelliklere veya kurumsal kapasiteye ihtiyacınız varsa Vertex AI'a geçiş yapabilirsiniz:

| Google AI Studio          | Vertex AI                     | Notlar                                  |
| ------------------------- | ----------------------------- | --------------------------------------- |
| `google:gemini-1.5-flash` | `vertex:gemini-1.5-flash`     | Aynı model, farklı uç nokta             |
| `GOOGLE_API_KEY`          | `GOOGLE_CLOUD_PROJECT` + kimlik | Vertex, Google Cloud kimlik doğrulamasını kullanır |
| Basit API anahtarı        | Çoklu kimlik doğrulama yöntemi | Vertex, ADC ve servis hesaplarını destekler |
| Küresel uç nokta          | Bölgesel uç noktalar          | Vertex bölge seçimi gerektirir          |

Örnek geçiş:

```yaml
# Önce (Google AI Studio)
providers:
  - google:gemini-1.5-pro

# Sonra (Vertex AI)
providers:
  - vertex:gemini-1.5-pro
    config:
      projectId: projemin-id-si
      region: us-central1
```

Ayrıntılı kurulum talimatları için [Vertex AI sağlayıcı belgelerine](/docs/providers/vertex) bakın.

## Mevcut Modeller

### Sohbet ve Çok Modlu (Multimodal) Modeller

- `google:gemini-2.0-pro-preview` - İyileştirilmiş akıl yürütme ve performansa sahip Gemini 2.0 Pro önizleme
- `google:gemini-2.0-flash-preview` - Öncü zeka, Flash düzeyinde hızda Pro kalitesinde akıl yürütme, düşünme ve dayanaklandırma (grounding) özelliklerine sahip Gemini 2.0 Flash önizleme
- `google:gemini-2.1-pro` - Geliştirilmiş akıl yürütme, kodlama ve çok modlu anlama özelliklerine sahip Gemini 2.1 Pro modeli
- `google:gemini-2.1-flash` - Geliştirilmiş akıl yürütme ve düşünme yeteneklerine sahip Gemini 2.1 Flash modeli
- `google:gemini-2.1-flash-lite` - Yüksek hacimli, gecikmeye duyarlı görevler için optimize edilmiş maliyet etkin Gemini 2.1 modeli
- `google:gemini-2.0-flash-lite` - 1M token bağlamlı 2.0 Flash'ın maliyet etkin versiyonu
- `google:gemini-2.0-flash-thinking-exp` - Karmaşık akıl yürütme ve problem çözme için optimize edilmiştir

### Gömme (Embedding) Modelleri

- `google:embedding:text-embedding-004` - Google metin gömme modeli
- `google:embedding:embedding-001` - Google gömme modeli

### Görüntü Oluşturma Modelleri

Imagen modelleri hem **Google AI Studio** hem de **Vertex AI** üzerinden kullanılabilir. `google:image:` önekini kullanın:

#### Imagen 4 Modelleri (Hem Google AI Studio hem de Vertex AI'da mevcuttur)

- `google:image:imagen-4.0-ultra-generate-preview-06-06` - Ultra kalite
- `google:image:imagen-4.0-generate-preview-06-06` - Standart kalite
- `google:image:imagen-4.0-fast-generate-preview-06-06` - Hızlı üretim

#### Imagen 3 Modelleri (Yalnızca Vertex AI)

- `google:image:imagen-3.0-generate-002` - Imagen 3.0
- `google:image:imagen-3.0-generate-001` - Imagen 3.0
- `google:image:imagen-3.0-fast-generate-001` - Imagen 3.0 hızlı

#### Kimlik Doğrulama Seçenekleri

**Seçenek 1: Google AI Studio** (Hızlı başlangıç, sınırlı özellikler)

```bash
export GOOGLE_API_KEY=api-anahtarınız
```

- ✅ API anahtarı ile daha basit kurulum
- ✅ Imagen 4 modellerini destekler
- ❌ Imagen 3 modellerini desteklemez
- ❌ `seed` veya `addWatermark` parametrelerini desteklemez

**Seçenek 2: Vertex AI** (Tam özellikler)

```bash
gcloud auth application-default login
export GOOGLE_PROJECT_ID=projenin-id-si
```

- ✅ Tüm Imagen modelleri desteklenir
- ✅ Tüm yapılandırma parametreleri desteklenir
- ❌ Faturalandırması açık bir Google Cloud projesi gerektirir

Sağlayıcı, mevcut kimlik bilgilerine göre uygun API'yi otomatik olarak seçer.

Yapılandırma seçenekleri:

```yaml
providers:
  - google:image:imagen-3.0-generate-002
    config:
      projectId: 'projeniz-id-si'  # Veya GOOGLE_PROJECT_ID ayarlayın
      region: 'us-central1'          # İsteğe bağlı, varsayılan us-central1
      aspectRatio: '16:9'
      seed: 42
      addWatermark: false            # tohum (seed) kullanırken false olmalıdır
```

[Google Imagen örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/google-imagen)ne bakın.

### Gemini Yerel Görüntü Oluşturma Modelleri

Gemini modelleri, `generateContent` API'sini kullanarak yerel olarak görüntü oluşturabilir. Adında `-image` olan modeller otomatik olarak görüntü oluşturmayı etkinleştirir:

- `google:gemini-2.1-flash-image` - Görüntü oluşturma özellikli Gemini 2.1 Flash

Yapılandırma seçenekleri:

```yaml
providers:
  - id: google:gemini-2.1-flash-image
    config:
      imageAspectRatio: '16:9' # 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
      imageSize: '2K' # 1K, 2K, 4K
      temperature: 0.7
```

Imagen'den temel farklar:

- Gemini sohbet ile aynı ad alanını (namespace) kullanır (`google:model-adi`)
- Daha fazla en boy oranı seçeneği (2:3, 3:2, 4:5, 5:4, 21:9 dahil)
- `imageSize` ile çözünürlük kontrolü (1K, 2K, 4K)
- Aynı yanıtta hem metin hem de görüntü döndürebilir
- Gemini sohbet modelleriyle aynı kimlik doğrulamasını kullanır

Gemini görüntü oluşturma yapılandırmaları için [Google Imagen örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/google-imagen)ne bakın.

### Video Oluşturma Modelleri (Veo)

Google'ın Veo modelleri, metin istemlerinden yapay zeka destekli video üretimi sağlar. `google:video:` önekini kullanın:

#### Mevcut Modeller

| Model                                   | Açıklama                                          | Süre Desteği     |
| --------------------------------------- | ------------------------------------------------- | ---------------- |
| `google:video:veo-2.1-generate-preview` | Video uzatma destekli en yeni Veo 2.1 modeli      | 4, 6, 8 saniye   |
| `google:video:veo-2.1-fast-preview`     | Hızlı Veo 2.1 modeli                              | 4, 6, 8 saniye   |
| `google:video:veo-2-generate`           | Veo 2.0 standart modeli                           | 4, 6, 8 saniye   |
| `google:video:veo-2-fast`               | Veo 2.0 hızlı modeli                              | 4, 6, 8 saniye   |

#### Temel Kullanım

```yaml
providers:
  - id: google:video:veo-2.1-generate-preview
    config:
      aspectRatio: '16:9' # veya '9:16'
      resolution: '720p' # veya '1080p'
      durationSeconds: 6 # Veo 2.x için 4, 6 veya 8

prompts:
  - '{{subject}} ögesinin bir videosunu oluştur'

tests:
  - vars:
      subject: 'bir yumak yünle oynayan bir kedi'
```

#### Yapılandırma Seçenekleri

| Seçenek            | Tür    | Açıklama                                                           |
| ------------------ | ------ | ------------------------------------------------------------------ |
| `aspectRatio`      | string | Video en boy oranı: `16:9` (varsayılan) veya `9:16`                |
| `resolution`       | string | Video çözünürlüğü: `720p` (varsayılan) veya `1080p`                |
| `durationSeconds`  | number | Video süresi: Veo 2.x için 4, 6, 8                                 |
| `personGeneration` | string | Kişi oluşturma modu: `allow_adult` veya `dont_allow`               |
| `negativePrompt`   | string | Oluşturulan videoda kaçınılması gereken kavramlar                  |
| `referenceImages`  | array  | 3 adede kadar referans görüntü (dosya yolları veya nesneler, yalnızca Veo 2.1) |
| `image`            | string | Görüntüden videoya üretim için kaynak görüntü                      |
| `lastImage`        | string | Enterpolasyon için bitiş karesi (`image` gerektirir)               |
| `extendVideoId`    | string | Uzatılacak önceki Veo üretiminden gelen işlem kimliği (yalnızca Veo 2.1) |

#### Görüntüden Videoya Üretim

Bir başlangıç görüntüsünden videolar oluşturun:

```yaml
providers:
  - id: google:video:veo-2.1-generate-preview
    config:
      image: file://assets/baslangic-karesi.jpg
      aspectRatio: '16:9'
      durationSeconds: 6

prompts:
  - 'Bu görüntüyü canlandır: {{animation_description}}'

tests:
  - vars:
      animation_description: 'karakter yavaşça kameraya dönüyor'
```

#### Video Enterpolasyonu (İlk ve Son Kare)

İki görüntü arasında geçiş yapan bir video oluşturun:

```yaml
providers:
  - id: google:video:veo-2.1-generate-preview
    config:
      image: file://assets/baslangic.jpg # İlk kare
      lastImage: file://assets/bitis.jpg # Son kare
      durationSeconds: 6

prompts:
  - 'Bu kareler arasında pürüzsüz bir geçiş oluştur'
```

#### Video Uzatma (Yalnızca Veo 2.1)

Daha önce oluşturulmuş bir Veo videosunu işlem kimliğini (operation ID) kullanarak uzatın:

```yaml
providers:
  - id: google:video:veo-2.1-generate-preview
    config:
      # Önceki bir Veo üretiminden gelen işlem kimliğini kullanın
      extendVideoId: projects/my-project/locations/us-central1/publishers/google/models/veo-2.1-generate-preview/operations/abc123
      durationSeconds: 6

prompts:
  - 'Bu videoyu şununla devam ettir: {{continuation}}'

tests:
  - vars:
      continuation: 'kamera bir gün batımını gösterecek şekilde kayıyor'
```

:::note
Video uzatma, yerel bir dosya yolu değil, önceki bir Veo video üretiminden gelen bir işlem kimliği gerektirir. İşlem kimliği, üretim yanıtının `metadata.operationName` alanında döndürülür.
:::

#### Referans Görüntüler

Video stilini yönlendirmek için 3 adede kadar referans görüntü kullanın (yalnızca Veo 2.1):

```yaml
providers:
  - id: google:video:veo-2.1-generate-preview
    config:
      referenceImages:
        # Basit format: dosya yolları ('asset' referans türünü kullanır)
        - file://assets/stil-ref-1.jpg
        - file://assets/stil-ref-2.jpg
      aspectRatio: '16:9'
      durationSeconds: 6
```

Referans türünü belirtmek için nesne biçimini de kullanabilirsiniz:

```yaml
referenceImages:
  - image: file://assets/karakter.jpg
    referenceType: asset
  - image: file://assets/arka-plan.jpg
    referenceType: asset
```

#### Depolama

Oluşturulan videolar, tekilleştirme (deduplication) için içerik adreslenebilir karma (hashing) kullanan promptfoo'nun büyük ikili nesne (blob) depolama sisteminde saklanır. Aynı içeriğe sahip videolar aynı depolama referansını paylaşır. Yeniden üretmeye zorlamak için `--no-cache` kullanın:

```bash
promptfoo eval --no-cache
```

Eksiksiz yapılandırmalar için [Google Video örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/google-video)ne bakın.

### Temel Yapılandırma

Sağlayıcı, modelin davranışını özelleştirmek için kullanılabilecek çeşitli yapılandırma seçeneklerini destekler:

```yaml
providers:
  - id: google:gemini-1.5-pro
    config:
      temperature: 0.7 # Rastgeleliği kontrol eder (0.0 - 1.0)
      maxOutputTokens: 2048 # Yanıtın maksimum uzunluğu
      topP: 0.9 # Çekirdek örnekleme (Nucleus sampling)
      topK: 40 # Top-k örnekleme
      stopSequences: ['END'] # Bu dizilerde üretimi durdur
```

### Düşünme (Thinking) Yapılandırması

Düşünme yeteneklerini destekleyen modeller için, modelin problemleri nasıl akıl yürüterek çözeceğini yapılandırabilirsiniz.

#### Gemini 2 Modelleri (thinkingLevel)

Gemini 2 modelleri daha hassas kontrol için `thinkingLevel` kullanır:

```yaml
providers:
  - id: google:gemini-2.0-flash-preview
    config:
      generationConfig:
        thinkingConfig:
          thinkingLevel: MEDIUM # MINIMAL, LOW, MEDIUM veya HIGH
```

| Düzey   | Açıklama                                                                |
| ------- | ----------------------------------------------------------------------- |
| MINIMAL | En az token. Düşük karmaşıklıktaki görevler için en iyisi (yalnızca Flash). |
| LOW     | Daha az token. Daha basit görevler için uygundur.                      |
| MEDIUM  | Orta karmaşıklık için dengeli yaklaşım (yalnızca Flash).              |
| HIGH    | Derin akıl yürütme için daha fazla token. Varsayılan.                   |

#### Gemini 2.1 Modelleri (thinkingBudget)

Gemini 2.1 modelleri `thinkingBudget` kullanır:

```yaml
providers:
  - id: google:gemini-2.1-flash
    config:
      generationConfig:
        temperature: 0.7
        maxOutputTokens: 2048
        thinkingConfig:
          thinkingBudget: 1024 # Düşünme süreci için ayrılan tokenleri kontrol eder
```

Düşünme yapılandırması, modelin nihai yanıtı vermeden önce akıl yürütme sürecini göstermesine olanak tanır; bu, adım adım düşünme gerektiren karmaşık görevler için yararlı olabilir.

**Not:** Aynı istekte hem `thinkingLevel` hem de `thinkingBudget` kullanamazsınız.

Yapılandırılmış çıktı (structured output) için bir yanıt şeması da belirtebilirsiniz:

```yaml
providers:
  - id: google:gemini-1.5-pro
    config:
      generationConfig:
        response_mime_type: application/json
        response_schema:
          type: object
          properties:
            foo:
              type: string
```

Çok modlu (multimodal) girişler (görüntü ve video) için sağlayıcı şunları destekler:

- Görüntüler: PNG, JPEG, WEBP, HEIC, HEIF formatları (maksimum 3.600 dosya)
- Videolar: MP4, MPEG, MOV, AVI, FLV, MPG, WEBM, WMV, 3GPP formatları (~1 saate kadar)

Görüntüleri kullanırken, bunları isteminizde ayrı satırlara yerleştirin. `file://` öneki yükleme ve kodlama işlemlerini otomatik olarak halleder:

```yaml
prompts: |
  {{imageFile}}
  Bu resmi açıklayın.

providers:
  - id: google:gemini-1.5-flash

tests:
  - vars:
      imageFile: file://assets/pandan.jpg
```

### Güvenlik Ayarları (Safety Settings)

İçerik filtrelemeyi kontrol etmek için güvenlik ayarları yapılandırılabilir:

```yaml
providers:
  - id: google:gemini-1.5-pro
    config:
      safetySettings:
        - category: HARM_CATEGORY_DANGEROUS_CONTENT
          threshold: BLOCK_ONLY_HIGH # veya diğer eşikler
```

### Sistem Talimatları (System Instructions)

Model için sistem düzeyinde talimatlar yapılandırın:

```yaml
providers:
  - id: google:gemini-1.5-pro
    config:
      # Doğrudan metin
      systemInstruction: 'Siz yardımsever bir asistansınız'

      # Veya dosyadan yükle
      systemInstruction: file://system-instruction.txt
```

Sistem talimatları Nunjucks şablonlamasını destekler ve daha iyi organizasyon ve yeniden kullanılabilirlik için harici dosyalardan yüklenebilir.

### Rol Eşleme Yapılandırması (Role Mapping Configuration)

Gemini modelleri sohbet mesajlarında belirli rol adları gerektirir. Varsayılan olarak Promptfoo, daha yeni Gemini sürümleriyle (1.5+) uyumluluk için `model` rolünü kullanır. `assistant` rolünü bekleyen daha eski Gemini sürümleri için bunu devre dışı bırakabilirsiniz:

```yaml
providers:
  # Varsayılan davranış - 'assistant'ı 'model'e eşler (Gemini 1.5+ için)
  - id: google:gemini-1.5-flash
    config:
      temperature: 0.7

  # Daha eski Gemini sürümleri için - 'assistant' rolünü korur
  - id: google:gemini-1.5-pro
    config:
      useAssistantRole: true # Eşleme yapmadan 'assistant' rolünü korur
      temperature: 0.7
```

Yetenekler ve yapılandırma seçenekleri hakkında daha fazla ayrıntı için [Gemini API belgelerine](https://ai.google.dev/docs) bakın.

## Model Örnekleri

### Gemini 2 Flash Preview

Öncü zeka, Pro seviyesinde akıl yürütme ve düşünme yeteneklerine sahip Gemini 2.0 Flash:

```yaml
providers:
  - id: google:gemini-2.0-flash-preview
    config:
      temperature: 0.7
      maxOutputTokens: 4096
      generationConfig:
        thinkingConfig:
          thinkingLevel: MEDIUM # MINIMAL, LOW, MEDIUM veya HIGH
```

Gemini 2 Flash için düşünme düzeyleri: MINIMAL (en hızlı), LOW, MEDIUM (dengeli), HIGH (en kapsamlı).

### Gemini 2 Pro Preview

Gelişmiş akıl yürütme ve ajan yeteneklerine sahip Gemini 2.0 Pro:

```yaml
providers:
  - id: google:gemini-2.0-pro-preview
    config:
      temperature: 0.7
      maxOutputTokens: 4096
      generationConfig:
        thinkingConfig:
          thinkingLevel: HIGH # LOW veya HIGH (Pro yalnızca bu iki düzeyi destekler)
```

Gemini 2 Pro için düşünme düzeyleri: LOW (daha hızlı, daha basit görevler), HIGH (derin akıl yürütme, varsayılan).

### Gemini 2.1 Pro

Karmaşık akıl yürütme, kodlama ve çok modlu anlama için Gemini 2.1 Pro modeli:

```yaml
providers:
  - id: google:gemini-2.1-pro
    config:
      temperature: 0.7
      maxOutputTokens: 4096
      topP: 0.9
      topK: 40
      generationConfig:
        thinkingConfig:
          thinkingBudget: 2048 # Karmaşık görevler için geliştirilmiş düşünme
```

### Gemini 2.1 Flash

Geliştirilmiş akıl yürütme ve düşünme yeteneklerine sahip Gemini 2.1 Flash modeli:

```yaml
providers:
  - id: google:gemini-2.1-flash
    config:
      temperature: 0.7
      maxOutputTokens: 2048
      topP: 0.9
      topK: 40
      generationConfig:
        thinkingConfig:
          thinkingBudget: 1024 # Düşünme yetenekli hızlı model
```

### Gemini 2.1 Flash-Lite

Yüksek hacimli, gecikmeye duyarlı görevler için maliyet etkin ve hızlı model:

```yaml
providers:
  - id: google:gemini-2.1-flash-lite
    config:
      temperature: 0.7
      maxOutputTokens: 1024
      topP: 0.9
      topK: 40
      generationConfig:
        thinkingConfig:
          thinkingBudget: 512 # Hız ve maliyet verimliliği için optimize edilmiştir
```

### Gemini 1.5 Flash

Hızlı, verimli yanıtlar ve genel görevler için en iyisi:

```yaml
providers:
  - id: google:gemini-1.5-flash
    config:
      temperature: 0.7
      maxOutputTokens: 2048
      topP: 0.9
      topK: 40
```

## Gelişmiş Özellikler

### Sağlayıcıları Geçersiz Kılma (Overriding Providers)

Yapılandırmanızda hem metin oluşturma hem de gömme (embedding) sağlayıcılarını geçersiz kılabilirsiniz. Model dereceli değerlendirmelerin uygulanma şekli nedeniyle, **metin oluşturma modelinin sohbet formatlı istemleri desteklemesi gerekir**.

Sağlayıcıları birkaç şekilde geçersiz kılabilirsiniz:

1. `defaultTest` kullanarak tüm test durumları için:

```yaml title="promptfooconfig.yaml"
defaultTest:
  options:
    provider:
      # Metin oluşturma sağlayıcısını geçersiz kıl
      text:
        id: google:gemini-1.5-flash
        config:
          temperature: 0.7
      # Benzerlik karşılaştırmaları için gömme sağlayıcısını geçersiz kıl
      embedding:
        id: google:embedding:text-embedding-004
```

2. Bireysel iddialar (assertions) için:

```yaml
assert:
  - type: similar
    value: Beklenen yanıt
    threshold: 0.8
    provider:
      id: google:embedding:text-embedding-004
```

### Python'dan Google AI Studio'yu Çağırma

Özel bir sağlayıcıda `google-generativeai` Python kütüphanesini kullanmak istiyorsanız, bir [Python sağlayıcısı](/docs/providers/python/) oluşturun:

```python title="google_provider.py"
import os
import google.generativeai as genai

def call_api(prompt, options, context):
    genai.configure(api_key=os.environ.get('GOOGLE_API_KEY'))
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    return {
      "output": response.text
    }
```

```yaml title="promptfooconfig.yaml"
providers:
  - id: file://google_provider.py
```

## Ayrıca Bakında

- [Vertex AI Sağlayıcısı](/docs/providers/vertex) - Kurumsal düzeyde Gemini özellikleri için
- [Google Imagen Örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/google-imagen)
- [Google Video Örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/google-video)
- [Hız Sınırlamasını Yönetme](/docs/configuration/parameters/#rate-limits)
- [Çok Modlu (Multimodal) Test](/docs/guides/multimodal-evals/)
