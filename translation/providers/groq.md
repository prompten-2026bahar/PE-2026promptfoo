---
sidebar_label: Groq
description: Akıl yürütme modelleri, araç kullanımı ve görme yetenekleriyle yüksek performanslı LLM testi ve değerlendirmesi için Groq'un ultra hızlı LLM çıkarım API'sini yapılandırın
---

# Groq

[Groq](https://groq.com), promptfoo'nun [OpenAI sağlayıcısı](/docs/providers/openai/) tarafından sunulan tüm seçeneklerle uyumlu, son derece hızlı bir çıkarım (inference) API'sidir. Yapılandırma detayları için OpenAI'ya özgü belgelere bakabilirsiniz.

Groq; düşünce zinciri (chain-of-thought) yeteneklerine sahip akıl yürütme modelleri, yerleşik araçlara sahip birleşik modeller ve standart sohbet modelleri dahil olmak üzere çok çeşitli modellere erişim sağlar. Mevcut modellerin güncel listesi için [Groq Modelleri belgelerine](https://console.groq.com/docs/models) bakın.

## Hızlı Referans

| Özellik          | Açıklama                                         | Sağlayıcı Öneki   | Temel Yapılandırma  |
| ---------------- | ------------------------------------------------ | ----------------- | ------------------- |
| Akıl Yürütme Modelleri | Düşünce zinciri yeteneklerine sahip modeller | `groq:`           | `include_reasoning` |
| Birleşik Modeller | Yerleşik kod yürütme, web arama, göz atma       | `groq:`           | `compound_custom`   |
| Standart Modeller | Genel amaçlı sohbet modelleri                    | `groq:`           | `temperature`       |
| Uzun Bağlam      | Genişletilmiş bağlam pencereli modeller (100k+)  | `groq:`           | Belirtilmedi (N/A)  |
| Yanıtlar (Responses) API'si | Basitleştirilmiş akıl yürütme kontrollü yapılandırılmış API | `groq:responses:` | `reasoning.effort`  |

**Temel Farklılıklar:**

- **`groq:`** - Hassas akıl yürütme kontrollü standart Sohbet Tamamlama (Chat Completions) API'si
- **`groq:responses:`** - Basitleştirilmiş `reasoning.effort` parametresine sahip Yanıtlar (Responses) API'si (beta)
- **Birleşik (Compound) modeller** - Otomatik kod yürütme, web araması ve web sitesi ziyaret araçlarına sahiptir
- **Akıl yürütme (Reasoning) modelleri** - Manuel yapılandırma ile `browser_search` aracını destekler
- **Açık kontrol** - Hangi yerleşik araçların etkinleştirileceğini kontrol etmek için `compound_custom.tools.enabled_tools` kullanın

## Kurulum

Groq'u kullanmak için API anahtarınızı ayarlamanız gerekir:

1. [Groq Console](https://console.groq.com/) üzerinden bir Groq API anahtarı oluşturun.
2. `GROQ_API_KEY` ortam değişkenini ayarlayın:

```sh
export GROQ_API_KEY=api_anahtarınız_buraya
```

Alternatif olarak, sağlayıcı yapılandırmasında `apiKey` belirtebilirsiniz (aşağıya bakın).

## Yapılandırma

Groq sağlayıcısını promptfoo yapılandırma dosyanızda yapılandırın:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: groq:llama-3.3-70b-versatile
    config:
      temperature: 0.7
      max_completion_tokens: 100
prompts:
  - {{topic}} hakkında komik bir tweet yaz
tests:
  - vars:
      topic: kediler
  - vars:
      topic: köpekler
```

Temel yapılandırma seçenekleri:

- `temperature`: Çıktıdaki rastgeleliği 0 ile 2 arasında kontrol eder
- `max_completion_tokens`: Sohbet tamamlamasında oluşturulabilecek maksimum token sayısı
- `response_format`: Modelin çıktı vermesi gereken formatı belirten nesne (örn. JSON modu)
- `presence_penalty`: -2.0 ile 2.0 arasında bir sayı. Pozitif değerler, şimdiye kadar metinde görünüp görünmediklerine bağlı olarak yeni tokenleri cezalandırır
- `seed`: Deterministik örnekleme için (en iyi çaba)
- `frequency_penalty`: -2.0 ile 2.0 arasında bir sayı. Pozitif değerler, metindeki mevcut frekanslarına bağlı olarak yeni tokenleri cezalandırır
- `parallel_tool_calls`: Araç kullanımı sırasında paralel fonksiyon çağırmanın etkinleştirilip etkinleştirilmeyeceği (varsayılan: true)
- `reasoning_format`: Akıl yürütme modelleri için akıl yürütmenin nasıl sunulacağını kontrol eder. Seçenekler: `'parsed'` (ayrı alan), `'raw'` (think etiketleriyle), `'hidden'` (akıl yürütme gösterilmez). Not: JSON modu veya araç çağrıları kullanılırken `parsed` veya `hidden` gereklidir.
- `include_reasoning`: GPT-OSS modelleri için, akıl yürütme çıktısını gizlemek için `false` olarak ayarlayın (varsayılan: `true`)
- `reasoning_effort`: Akıl yürütme modelleri için akıl yürütme çabası düzeyini kontrol eder. Seçenekler: GPT-OSS modelleri için `'low'`, `'medium'`, `'high'`; Qwen modelleri için `'none'`, `'default'`
- `stop`: API'nin daha fazla token üretmeyi durduracağı 4 adede kadar dizi
- `tool_choice`: Araç kullanımını kontrol eder ('none', 'auto', 'required' veya belirli bir araç)
- `tools`: Modelin çağırabileceği araçların (fonksiyonların) listesi (maksimum 128)
- `top_p`: Çekirdek örnekleme (nucleus sampling) kullanarak sıcaklık örneklemesine alternatif

## Desteklenen Modeller

Groq, birkaç kategorideki modellere erişim sağlar. Mevcut modellerin güncel listesi ve özellikleri için [Groq Modelleri belgelerine](https://console.groq.com/docs/models) bakın.

### Model Kategorileri

- **Akıl Yürütme Modelleri** - Düşünce zinciri yeteneklerine sahip modeller (örn. GPT-OSS, Qwen, DeepSeek R1 varyantları)
- **Birleşik (Compound) Modeller** - Kod yürütme ve web araması için yerleşik araçlara sahip modeller (`groq/compound`)
- **Standart Sohbet Modelleri** - Genel amaçlı modeller (örn. Llama varyantları)
- **Uzun Bağlam Modelleri** - Genişletilmiş bağlam pencereli modeller (100k+ token)
- **Görme (Vision) Modelleri** - Görüntüleri işleyebilen çok modlu modeller
- **Konuşma Modelleri** - Konuşmadan metne dönüştürme için Whisper modelleri

### Groq Modellerini Kullanma

Groq'un model kütüphanesindeki herhangi bir modeli `groq:` önekiyle kullanın:

```yaml
providers:
  # Standart sohbet modeli
  - id: groq:llama-3.3-70b-versatile
    config:
      temperature: 0.7
      max_completion_tokens: 4096

  # Akıl yürütme modeli
  - id: groq:deepseek-r1-distill-llama-70b
    config:
      temperature: 0.6
      include_reasoning: true
```

Mevcut modellerin tam listesi için [Groq Console](https://console.groq.com/docs/models) sayfasını kontrol edin.

## Araç Kullanımı (Fonksiyon Çağırma)

Groq, modellerin önceden tanımlanmış fonksiyonları çağırmasına olanak tanıyan araç kullanımını destekler. Araçları sağlayıcı ayarlarınızda yapılandırın:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: groq:llama-3.3-70b-versatile
    config:
      tools:
        - type: function
          function:
            name: get_weather
            description: 'Belirli bir konumdaki mevcut hava durumunu al'
            parameters:
              type: object
              properties:
                location:
                  type: string
                  description: 'Şehir ve eyalet, örn. İstanbul, TR'
                unit:
                  type: string
                  enum:
                    - celsius
                    - fahrenheit
              required:
                - location
      tool_choice: auto
```

## Görme (Vision)

Groq, hem metin hem de görüntü girişlerini işleyebilen görme modelleri sağlar. Bu modeller araç kullanımını ve JSON modunu destekler. Mevcut model kullanılabilirliği ve özellikleri için [Groq Vision belgelerine](https://console.groq.com/docs/vision) bakın.

### Görüntü Giriş Kılavuzu

- **Görüntü URL'leri:** İzin verilen maksimum boyut 20 MB'dir
- **Base64 Kodlu Görüntüler:** İzin verilen maksimum boyut 4 MB'dir
- **Birden Fazla Görüntü:** İstek başına görüntü sınırları için model belgelerini kontrol edin

### Promptfoo'da Görme Yeteneği Nasıl Kullanılır

Sağlayıcı yapılandırmanızda bir görme modeli kimliği belirtin ve görüntüleri OpenAI uyumlu formatta dahil edin:

```yaml title="openai-compatible-prompt-format.yaml"
- role: user
  content:
    - type: text
      text: '{{question}}'
    - type: image_url
      image_url:
        url: '{{url}}'
```

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts: file://openai-compatible-prompt-format.yaml
providers:
  - id: groq:meta-llama/llama-4-scout-17b-16e-instruct
    config:
      temperature: 1
      max_completion_tokens: 1024
tests:
  - vars:
      question: 'Görüntüde ne görüyorsun?'
      url: https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Felis_catus-cat_on_snow.jpg/1024px-Felis_catus-cat_on_snow.jpg
    assert:
      - type: contains
        value: 'cat'
```

## Akıl Yürütme (Reasoning)

Groq, adım adım analiz gerektiren karmaşık problem çözme görevlerinde mükemmel olan akıl yürütme modellerine erişim sağlar. Bunlar arasında GPT-OSS varyantları, Qwen modelleri ve DeepSeek R1 varyantları bulunur. Mevcut akıl yürütme modeli kullanılabilirliği için [Groq Modelleri belgelerine](https://console.groq.com/docs/models) bakın.

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: Groq akıl yürütme modeli örneği
prompts:
  - |
    Göreviniz aşağıdaki soruyu dikkatli bir akıl yürütme ve titizlikle analiz etmektir:
    {{ question }}
providers:
  - id: groq:deepseek-r1-distill-llama-70b
    config:
      temperature: 0.6
      max_completion_tokens: 25000
      reasoning_format: parsed # 'parsed', 'raw' veya 'hidden'
tests:
  - vars:
      question: |
        Şu denklemde x'i bulun: e^-x = x^3 - 3x^2 + 2x + 5
    assert:
      - type: javascript
        value: output.includes('0.676') || output.includes('.676')
```

### Akıl Yürütme Çıktısını Kontrol Etme

**GPT-OSS modelleri** için `include_reasoning` parametresini kullanın:

| Parametre Değeri | Açıklama                                       |
| ---------------- | ---------------------------------------------- |
| `true` (varsayılan) | Çıktıda akıl yürütme/düşünme sürecini gösterir |
| `false`          | Akıl yürütmeyi gizler, yalnızca nihai yanıtı döndürür |

Akıl yürütmeyi gizlemek için örnek:

```yaml
providers:
  - id: groq:deepseek-r1-distill-llama-70b
    config:
      reasoning_format: hidden # Düşünme çıktısını gizle
```

**Diğer akıl yürütme modelleri** (örn. Qwen, DeepSeek) için `reasoning_format` kullanın:

| Format   | Açıklama                                   | En İyi Kullanım Alanı          |
| -------- | ------------------------------------------ | ------------------------------ |
| `parsed` | Akıl yürütmeyi özel bir alana ayırır       | Yapılandırılmış analiz, hata ayıklama |
| `raw`    | Akıl yürütmeyi think etiketleri içine dahil eder | Ayrıntılı adım adım inceleme   |
| `hidden` | Yalnızca nihai yanıtı döndürür             | Üretim/son kullanıcı yanıtları |

Not: `reasoning_format` ile JSON modu veya araç çağrıları kullanıldığında, yalnızca `parsed` veya `hidden` formatları desteklenir.

## Asistan Mesajı Ön Dolgusu (Prefilling)

Asistan mesajlarını önceden doldurarak model çıktı formatını kontrol edin. Bu teknik, modelin başlangıç cümlelerini atlamasını ve JSON veya kod blokları gibi belirli formatları uygulamasını sağlamanıza olanak tanır.

### Nasıl Çalışır?

İsteminizde kısmi bir asistan mesajı ekleyin ve model o noktadan devam edecektir:

```yaml
prompts:
  - |
    [
      {
        "role": "user",
        "content": "{{task}}"
      },
      {
        "role": "assistant",
        "content": "{{prefill}}"
      }
    ]

providers:
  - id: groq:llama-3.3-70b-versatile
    config:
      stop: '```' # Kapanış kod bloğunda dur

tests:
  - vars:
      task: Faktöriyel hesaplamak için bir Python fonksiyonu yaz
      prefill: '```python'
```

### Yaygın Kullanım Durumları

**Kısa ve öz kod oluşturun:**

```yaml
prefill: '```python'
```

**Yapılandırılmış veri çıkarın:**

```yaml
prefill: '```json'
```

**Giriş cümlelerini atlayın:**

```yaml
prefill: "Cevap şudur: "
```

Hassas çıktı kontrolü için `stop` parametresiyle birleştirin.

## Yanıtlar (Responses) API'si

Groq'un Yanıtlar (Responses) API'si; araçlar, yapılandırılmış çıktılar ve akıl yürütme için yerleşik desteğe sahip, konuşma odaklı yapay zekaya yapılandırılmış bir yaklaşım sunar. Bu API'ye erişmek için `groq:responses:` öneki kullanın. Not: Bu API şu anda betadır.

### Temel Kullanım

```yaml
providers:
  - id: groq:responses:llama-3.3-70b-versatile
    config:
      temperature: 0.6
      max_output_tokens: 1000
      reasoning:
        effort: 'high' # 'low', 'medium' veya 'high'
```

### Yapılandırılmış Çıktılar

Yanıtlar API'si, yapılandırılmış JSON çıktıları almayı kolaylaştırır:

```yaml
providers:
  - id: groq:responses:llama-3.3-70b-versatile
    config:
      response_format:
        type: 'json_schema'
        json_schema:
          name: 'hesaplama_sonucu'
          strict: true
          schema:
            type: 'object'
            properties:
              result:
                type: 'number'
              explanation:
                type: 'string'
            required: ['result', 'explanation']
            additionalProperties: false
```

### Giriş Formatı

Yanıtlar API'si basit bir dizeyi veya mesaj nesnelerinden oluşan bir diziyi kabul eder:

```yaml
prompts:
  # Basit dize girişi
  - 'Fransa'nın başkenti neresidir?'

  # Veya mesaj dizisi (JSON olarak)
  - |
    [
      {"role": "system", "content": "Siz yardımsever bir asistansınız."},
      {"role": "user", "content": "Fransa'nın başkenti neresidir?"}
    ]
```

### Sohbet Tamamlama API'sinden Temel Farklar

| Özellik           | Sohbet Tamamlama (`groq:`)               | Yanıtlar API (`groq:responses:`) |
| ----------------- | --------------------------------------- | --------------------------------- |
| Uç Nokta          | `/v1/chat/completions`                  | `/v1/responses`                   |
| Akıl Yürütme Kontrolü | `include_reasoning`, `reasoning_format` | `reasoning.effort`                |
| Token Sınırı Parametresi | `max_completion_tokens`              | `max_output_tokens`               |
| Giriş Alanı       | `messages`                              | `input`                           |
| Çıktı Alanı       | `choices[0].message.content`            | `output_text`                     |

Yanıtlar API'si hakkında daha fazla ayrıntı için [Groq Yanıtlar API belgelerine](https://console.groq.com/docs/responses-api) bakın.

## Yerleşik Araçlar

Groq; otomatik araç kullanımı olan birleşik modeller ve tarayıcı araması gibi manuel olarak yapılandırılmış araçlara sahip akıl yürütme modelleri sunar.

### Birleşik Modeller (Otomatik Araçlar)

Groq'un birleşik modelleri, dil modellerini göreve bağlı olarak otomatik olarak etkinleşen önceden etkinleştirilmiş yerleşik araçlarla birleştirir. Mevcut birleşik model kullanılabilirliği için [Groq belgelerine](https://console.groq.com/docs/models) bakın.

**Yerleşik Yetenekler (Yapılandırma Gerekmez):**

- **Kod Yürütme** - Hesaplamalar ve algoritmalar için Python kodu yürütme
- **Web Araması** - Güncel bilgiler için gerçek zamanlı web aramaları
- **Web Sitesini Ziyaret Etme** - Mesajda URL olduğunda otomatik web sayfası getirme

**Temel Yapılandırma:**

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: groq:groq/compound
    config:
      temperature: 0.7
      max_completion_tokens: 3000

prompts:
  - |
    {{task}}

tests:
  # Kod yürütme
  - vars:
      task: Kod kullanarak ilk 10 Fibonacci sayısını hesapla
    assert:
      - type: javascript
        value: output.length > 50

  # Web araması
  - vars:
      task: Seattle'ın şu anki nüfusu nedir?
    assert:
      - type: javascript
        value: output.length > 50
```

**Örnek Çıktılar:**

Kod yürütme:

```
Thinking:
İlk 10 Fibonacci sayısını hesaplamak için bir Python kod parçası kullanacağım.

<tool>
python
def fibonacci(n):
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib[:n]

print(fibonacci(10))
</tool>

<output>[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]</output>
```

Web araması:

```
<tool>search(current population of Seattle)</tool>

<output>
Title: Seattle Population 2025
URL: https://example.com/seattle
Content: The current metro area population of Seattle in 2025 is 816,600...
</output>
```

**Web Arama Ayarları (İsteğe Bağlı):**

Web araması davranışını özelleştirebilirsiniz:

```yaml
providers:
  - id: groq:groq/compound
    config:
      search_settings:
        exclude_domains: ['example.com'] # Belirli alan adlarını hariç tut
        include_domains: ['*.edu'] # Belirli alan adlarıyla kısıtla
        country: 'us' # Belirli bir ülkeden sonuçları öne çıkar
```

**Açık Araç Kontrolü:**

Varsayılan olarak, Birleşik modeller hangi araçların kullanılacağını otomatik olarak seçer. Hangi araçların mevcut olduğunu `compound_custom` kullanarak açıkça kontrol edebilirsiniz:

```yaml
providers:
  - id: groq:groq/compound
    config:
      compound_custom:
        tools:
          enabled_tools:
            - code_interpreter # Python kod yürütme
            - web_search # Web aramaları
            - visit_website # URL getirme
```

Bu şunları yapmanıza olanak tanır:

- Bir istek için hangi araçların mevcut olduğunu kısıtlamak
- Araç kullanımını sınırlayarak maliyetleri kontrol etmek
- Yalnızca belirli yeteneklerin kullanıldığından emin olmak

**Mevcut Araç Tanımlayıcıları:**

- `code_interpreter` - Python kod yürütme
- `web_search` - Gerçek zamanlı web aramaları
- `visit_website` - Web sayfası getirme
- `browser_automation` - İnteraktif tarayıcı kontrolü (en son sürümü gerektirir)
- `wolfram_alpha` - Hesaplamalı bilgi (API anahtarı gerektirir)

### Tarayıcı Aramalı Akıl Yürütme Modelleri

Groq'taki bazı akıl yürütme modelleri, açıkça etkinleştirilmesi gereken bir tarayıcı arama aracını destekler. Hangi modellerin bu özelliği desteklediğini [Groq belgelerinden](https://console.groq.com/docs/models) kontrol edin.

**Yapılandırma:**

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: groq:compound-beta # veya browser_search desteği olan diğer modeller
    config:
      temperature: 0.6
      max_completion_tokens: 3000
      tools:
        - type: browser_search
      tool_choice: required # Aracın kullanılmasını sağlar
```

**Nasıl Çalışır?**

Tarayıcı araması, web sitelerinde etkileşimli olarak gezinir ve otomatik atıflarla ayrıntılı sonuçlar sağlar. Model arama yapacak, sayfaları okuyacak ve yanıtında kaynakları belirtecektir.

**Web Aramasından Temel Farklılıklar:**

- **Tarayıcı Araması** (Akıl yürütme modelleri): İnsan taramasını taklit eder, web sitelerinde etkileşimli olarak gezinir, ayrıntılı içerik sağlar
- **Web Araması** (Birleşik modeller): Tek bir arama yapar, metin parçacıkları getirir, basit sorgular için daha hızlıdır

### Kullanım Durumları

**Kod Yürütme (Birleşik Modeller):**

- Matematiksel hesaplamalar ve denklem çözme
- Veri analizi ve istatistiksel hesaplamalar
- Algoritma uygulama ve test etme
- Birim dönüştürme ve sayısal işlemler

**Web/Tarayıcı Araması:**

- Güncel olaylar ve gerçek zamanlı bilgiler
- Güncel veri gerektiren olgusal sorgular
- Son gelişmeler üzerine araştırma
- Nüfus istatistikleri, hava durumu, hisse senedi fiyatları

**Birleştirilmiş Yetenekler (Birleşik Modeller):**

- Hem araştırma hem de hesaplama gerektiren finansal analizler
- Hesaplamalı doğrulama ile bilimsel araştırmalar
- Güncel bilgileri ve analizi birleştiren veri odaklı raporlar

### En İyi Uygulamalar

1. **Model Seçimi**:
   - Kod ve araştırmayı birleştiren görevler için birleşik modelleri kullanın
   - Ayrıntılı web araştırması için tarayıcı aramasına sahip akıl yürütme modellerini kullanın
   - `reasoning_effort` düzeylerini seçerken token maliyetlerini göz önünde bulundurun

2. **Token Sınırları**: Yerleşik araçlar önemli miktarda token tüketir. Karmaşık görevler için `max_completion_tokens` değerini 3000-4000 olarak ayarlayın.

3. **Sıcaklık (Temperature) Ayarları**:
   - Olgusal araştırma ve hassas hesaplamalar için 0.3-0.6 kullanın
   - Yaratıcı görevler için 0.7-0.9 kullanın

4. **Araç Seçimi (Tool Choice)**:
   - Tarayıcı aramasının her zaman kullanılmasını sağlamak için `required` kullanın
   - Birleşik modeller araç seçimini otomatik olarak halleder

5. **Hata Yönetimi**: Ağ sorunları nedeniyle araç çağrıları başarısız olabilir. Modeller genellikle hataları kabul eder ve alternatif yaklaşımlar dener.

## Ek Kaynaklar

- [Groq Modelleri Belgeleri](https://console.groq.com/docs/models) - Güncel model listesi ve özellikleri
- [Groq API Belgeleri](https://console.groq.com/docs) - Tam API referansı
- [Groq Console](https://console.groq.com/) - API anahtarı yönetimi ve kullanım
