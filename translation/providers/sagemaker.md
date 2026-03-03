---
sidebar_label: Amazon SageMaker AI
title: Amazon SageMaker AI Sağlayıcısı
description: Kapsamlı metrikler ve performans kıyaslaması ile Amazon SageMaker uç noktalarında konuşlandırılan ML modellerini test edin ve değerlendirin
---

# Amazon SageMaker AI

`sagemaker` sağlayıcısı, Amazon SageMaker AI uç noktalarını değerlendirmelerinizde kullanmanıza olanak tanır. Bu; Hugging Face modelleri, özel eğitimli modeller, Amazon SageMaker JumpStart'tan alınan temel modeller ve daha fazlası dahil olmak üzere SageMaker AI üzerinde konuşlandırılan herhangi bir modelin test edilmesini ve değerlendirilmesini sağlar. Özel uç noktaları olmayan AWS tarafından yönetilen temel modeller için [AWS Bedrock sağlayıcısını](./aws-bedrock.md) da düşünebilirsiniz.

## Kurulum

1. İstediğiniz modelleri SageMaker AI uç noktaları olarak konuşlandırdığınızdan emin olun.

2. `@aws-sdk/client-sagemaker-runtime` paketini kurun:

   ```bash
   npm install @aws-sdk/client-sagemaker-runtime
   ```

3. AWS SDK, kimlik bilgilerini otomatik olarak şu konumlardan çekecektir:
   - EC2, Lambda veya SageMaker Studio üzerindeki IAM rolleri
   - `~/.aws/credentials` veya `~/.aws/config` dosyaları
   - `AWS_ACCESS_KEY_ID` ve `AWS_SECRET_ACCESS_KEY` ortam değişkenleri

   :::info

   Daha fazla ayrıntı için [Node.js kimlik bilgilerini ayarlama (AWS)](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) sayfasına bakın.

   :::

4. Yapılandırma dosyanızı SageMaker sağlayıcısına yönelecek şekilde düzenleyin. İşte bir örnek:

   ```yaml
   providers:
     - id: sagemaker:my-sagemaker-endpoint
   ```

   Sağlayıcının `sagemaker:` ve ardından SageMaker uç noktanızın adından oluştuğunu unutmayın.

5. Ek yapılandırma parametreleri şu şekilde iletilir:

   ```yaml
   providers:
     - id: sagemaker:my-sagemaker-endpoint
       config:
         accessKeyId: ERIŞIM_ANAHTARI_KIMLIĞINIZ
         secretAccessKey: GIZLI_ERIŞIM_ANAHTARINIZ
         region: 'us-west-2'
         modelType: 'jumpstart'
         maxTokens: 256
         temperature: 0.7
   ```

## Kimlik Doğrulama

Sağlayıcınızın `config` bölümünde şu yöntemlerden birini kullanarak Amazon SageMaker kimlik doğrulamasını yapılandırın:

1. Erişim anahtarı (Access key) ile kimlik doğrulama:

```yaml
providers:
  - id: sagemaker:my-sagemaker-endpoint
    config:
      accessKeyId: 'ERIŞIM_ANAHTARI_KIMLIĞINIZ'
      secretAccessKey: 'GIZLI_ERIŞIM_ANAHTARINIZ'
      sessionToken: 'OTURUM_TOKENINIZ' # İsteğe bağlı
      region: 'us-east-1' # İsteğe bağlı, varsayılan us-east-1
```

2. Profil (Profile) ile kimlik doğrulama:

```yaml
providers:
  - id: sagemaker:my-sagemaker-endpoint
    config:
      profile: 'PROFIL_ADINIZ'
      region: 'us-east-1' # İsteğe bağlı, varsayılan us-east-1
```

`profile: 'ProfilAdınız'` ayarı, AWS kimlik bilgileri/yapılandırma dosyalarınızdaki o profili kullanacaktır. Bu, AWS SSO profillerinin yanı sıra erişim anahtarlarına sahip standart profiller için de çalışır.

AWS SDK, standart kimlik bilgileri zincirini kullanır ([Node.js'de Kimlik Bilgilerini Ayarlama - AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html)). Herhangi bir bölge belirtilmezse, sağlayıcı varsayılan olarak `us-east-1`'e ayarlanır. İsteklerin yanlış yönlendirilmesini önlemek için `region` ayarını uç noktanızın konuşlandırıldığı bölgeye ayarlamanız (veya `AWS_REGION` ortam değişkenini kullanmanız) önerilir.

## Sağlayıcı Sözdizimi

SageMaker sağlayıcısı birkaç sözdizimi desenini destekler:

1. Temel uç nokta belirtimi:

   ```yaml
   sagemaker:uc-noktasi-adiniz
   ```

2. Model türü belirtimi (yaygın model formatları için):

   ```yaml
   sagemaker:model-turu:uc-noktasi-adiniz
   ```

   Bu, uç noktanızda konuşlandırılan model konteyneri türü için istekleri doğru şekilde yapılandırmak ve yanıtları ayrıştırmak üzere bir format işleyici belirtir.

   :::tip
   Embedding olmayan modeller için model türü, `sagemaker:model-turu:uc-noktasi-adi` formatı kullanılarak belirtilmeli veya `config.modelType` alanında sağlanmalıdır.
   :::

3. Embedding uç noktası belirtimi:

   ```yaml
   sagemaker:embedding:embedding-uc-noktasi-adiniz
   ```

   Metin tamamlamaları yerine embedding üreten uç noktalar için.

4. JumpStart model belirtimi:
   ```yaml
   sagemaker:jumpstart:jumpstart-uc-noktasi-adiniz
   ```
   Belirli giriş/çıkış formatları gerektiren AWS JumpStart temel modelleri için.

Sağlayıcı, adında `'jumpstart'` varsa JumpStart uç noktalarını otomatik olarak algılar, ancak netlik için manuel `modelType` belirtimi önerilir.

## Örnekler

### Standart Örnek

```yaml
prompts:
  - '{{topic}} hakkında bir tweet yaz'

providers:
  - id: sagemaker:jumpstart:my-llama-endpoint
    config:
      region: 'us-east-1'
      temperature: 0.7
      maxTokens: 256
  - id: sagemaker:huggingface:my-mistral-endpoint
    config:
      region: 'us-east-1'
      temperature: 0.7
      maxTokens: 256

tests:
  - vars:
      topic: Çevre dostu paketlememiz
  - vars:
      topic: Gizli menü öğemize kısa bir bakış
  - vars:
      topic: Son fotoğraf çekimimizden kamera arkası
```

### Llama Model Örneği (JumpStart)

JumpStart aracılığıyla konuşlandırılan Llama 3 modelleri için:

```yaml
prompts:
  - '{{flavor}} aromalı kahve konusunda uzmanlaşmış bir kahve dükkanı için yaratıcı bir isim oluştur.'

providers:
  - id: sagemaker:jumpstart:llama-3-2-1b-instruct
    label: 'SageMaker üzerinde Llama 3.2 (8B)'
    delay: 500 # Uç nokta doygunluğunu önlemek için istekler arasına 500 ms gecikme ekleyin
    config:
      region: us-west-2
      modelType: jumpstart # JumpStart format işleyicisini kullan
      temperature: 0.7
      maxTokens: 256
      topP: 0.9
      contentType: 'application/json'
      acceptType: 'application/json'
      responseFormat:
        path: 'json.generated_text' # Bu alanı yanıttan çıkar
tests:
  - vars:
      flavor: karamel
  - vars:
      flavor: bal kabağı baharatlı
  - vars:
      flavor: lavanta
```

### Gelişmiş Yanıt İşleme Örneği

Bu örnek, dosya tabanlı bir dönüşüm (transform) ile gelişmiş yanıt işlemeyi gösterir:

```yaml
prompts:
  - '{{year}} yılında World Series"i kim kazandı?'

providers:
  - id: sagemaker:jumpstart:my-custom-endpoint
    label: 'Yanıt İşlemeli Özel Model'
    config:
      region: us-west-2
      modelType: jumpstart
      # Yanıtı çıkarmak ve işlemek için özel bir dönüşüm dosyası kullanın
      responseFormat:
        path: 'file://transforms/extract-baseball-info.js'

tests:
  - vars:
      year: 2023
  - vars:
      year: 2000
```

Yanıtı çıkaran ve geliştiren özel bir dönüşüm dosyasıyla:

```javascript
// transforms/extract-baseball-info.js
module.exports = function (json) {
  // Ham üretilen metni al
  const rawText = json.generated_text || '';

  // Regex kullanarak takım adını çıkar
  const teamMatch = rawText.match(/the\s+([A-Za-z\s]+)\s+won/i);
  const team = teamMatch ? teamMatch[1].trim() : 'Bilinmeyen takım';

  // Yanıtı güzelce formatla
  return {
    rawResponse: rawText,
    extractedTeam: team,
    year: rawText.match(/(\d{4})/)?.[1] || 'bilinmeyen yıl',
    confidence: rawText.includes('Eminim') ? 'yüksek' : 'orta',
  };
};
```

Bu dönüşüm sadece içeriği çıkarmakla kalmaz, aynı zamanda belirli bilgileri tanımlamak için onu ayrıştırır ve ek bağlamla yanıtı formatlar.

### Mistral Model Örneği (Hugging Face)

Hugging Face aracılığıyla konuşlandırılan Mistral 7B modelleri için:

```yaml
prompts:
  - '{{flavor}} aromalı kahve konusunda uzmanlaşmış bir kahve dükkanı için yaratıcı bir isim oluştur.'

providers:
  - id: sagemaker:huggingface:mistral-7b-v3
    label: 'SageMaker üzerinde Mistral 7B v3'
    delay: 500 # Uç nokta doygunluğunu önlemek için istekler arasına 500 ms gecikme ekleyin
    config:
      region: us-west-2
      modelType: huggingface # Hugging Face format işleyicisini kullan
      temperature: 0.7
      maxTokens: 256
      topP: 0.9
      contentType: 'application/json'
      acceptType: 'application/json'
      responseFormat:
        path: 'json[0].generated_text' # Dizi öğesine erişmek için JavaScript ifadesi

tests:
  - vars:
      flavor: karamel
  - vars:
      flavor: bal kabağı baharatlı
  - vars:
      flavor: lavanta
```

### Birden Fazla Modeli Karşılaştırma

Bu örnek, Llama ve Mistral modellerinin yan yana nasıl karşılaştırılacağını gösterir:

```yaml
description: 'SageMaker üzerinde Mistral 7B ve Llama 3 Karşılaştırması'

prompts:
  - '{{flavor}} aromalı kahve konusunda uzmanlaşmış bir kahve dükkanı için yaratıcı bir isim oluştur.'
  - '{{topic}} hakkında {{style}} tarzda kısa bir hikaye yazın. {{length}} kelimeyi hedefleyin.'
  - '{{concept}} kavramını {{audience}} kitlesine anlayabilecekleri bir şekilde açıklayın.'

providers:
  # Llama 3.2 sağlayıcısı
  - id: sagemaker:jumpstart:llama-3-2-1b-instruct
    label: 'Llama 3.2 (8B)'
    delay: 500 # İstekler arasına 500 ms gecikme ekleyin
    config:
      region: us-west-2
      modelType: jumpstart
      temperature: 0.7
      maxTokens: 256
      topP: 0.9
      contentType: 'application/json'
      acceptType: 'application/json'
      responseFormat:
        path: 'json.generated_text'

  # Mistral 7B sağlayıcısı
  - id: sagemaker:huggingface:mistral-7b-v3
    label: 'Mistral 7B v3'
    delay: 500 # İstekler arasına 500 ms gecikme ekleyin
    config:
      region: us-west-2
      modelType: huggingface
      temperature: 0.7
      maxTokens: 256
      topP: 0.9
      contentType: 'application/json'
      acceptType: 'application/json'
      responseFormat:
        path: 'json[0].generated_text'

tests:
  - vars:
      flavor: karamel
      topic: kendini fark eden bir robot
      style: bilim kurgu
      length: '250'
      concept: yapay zeka
      audience: 10 yaşında bir çocuk
  - vars:
      flavor: lavanta
      topic: müşterilerinin zihnini okuyabilen bir barista
      style: gizem
      length: '300'
      concept: makine öğrenimi
      audience: yaşlı bir vatandaş
```

## Model Türleri

SageMaker sağlayıcısı, istekleri doğru şekilde formatlamak ve yanıtları ayrıştırmak için çeşitli model türlerini destekler. Sağlayıcı kimliğinde veya yapılandırmada model türünü belirtin:

```yaml
# Sağlayıcı kimliğinde
providers:
  - id: sagemaker:huggingface:my-endpoint

# Veya yapılandırmada
providers:
  - id: sagemaker:my-endpoint
    config:
      modelType: 'huggingface'
```

Desteklenen model türleri:

| Model Türü    | Açıklama                                   | Sonuçlar için JavaScript İfadesi |
| ------------- | ------------------------------------------ | -------------------------------- |
| `llama`       | Llama uyumlu arayüz modelleri              | Standart format                  |
| `huggingface` | Hugging Face modelleri (Mistral gibi)      | `json[0].generated_text`         |
| `jumpstart`   | AWS JumpStart temel modelleri              | `json.generated_text`            |
| `custom`      | Özel model formatları (varsayılan)         | Modele bağlıdır                  |

:::info Model türleri hakkında önemli açıklama

`modelType` ayarı, SageMaker üzerinde konuşlandırılan farklı model konteynerleri tarafından beklenen belirli desenlere göre isteklerin ve yanıtların formatlanmasına yardımcı olur.

Farklı model türleri sonuçları farklı yanıt formatlarında döndürür. Çıkarma için uygun JavaScript ifadesini yapılandırın:

- **JumpStart modelleri** (Llama): `responseFormat.path: "json.generated_text"` kullanın.
- **Hugging Face modelleri** (Mistral): `responseFormat.path: "json[0].generated_text"` kullanın.

Daha karmaşık çıkarma mantığı için, [Yanıt Yolu İfadeleri](#yanit-yolu-ifadeleri) bölümünde açıklandığı gibi dosya tabanlı dönüşümleri kullanın.
:::

## Giriş/Çıkış Formatı

SageMaker uç noktaları, isteğin model konteynerinin tasarlandığı formatta olmasını bekler. Çoğu metin üretme modeli (örn. Hugging Face Transformers veya JumpStart LLM'leri) için bu, bir `"inputs"` anahtarına (ve üretim ayarları için isteğe bağlı `"parameters"` anahtarına) sahip bir JSON yükü göndermek anlamına gelir.

Örneğin:

- Bir Hugging Face LLM konteyneri genellikle şunu bekler: `{"inputs": "isminiz", "parameters": {...}}`
- Bir JumpStart modeli benzer bir yapı bekler ve genellikle `{"generated_text": "çıktı"}` döndürür.

Sağlayıcının `modelType` ayarı isteği uygun şekilde formatlamaya çalışacaktır, ancak girişinizin modelin beklediğiyle eşleştiğinden emin olun. Gerekirse özel bir dönüştürücü sağlayabilirsiniz (bkz. [İstemleri Dönüştürme](#istemleri-donusturme)).

## Yapılandırma Seçenekleri

SageMaker uç noktaları için yaygın yapılandırma seçenekleri:

| Seçenek         | Açıklama                                     | Varsayılan          |
| --------------- | -------------------------------------------- | ------------------- |
| `endpoint`      | SageMaker uç noktası adı                     | (sağlayıcı kimliğinden) |
| `region`        | AWS bölgesi                                  | `us-east-1`         |
| `modelType`     | İstek/yanıt formatlaması için model türü     | `custom`            |
| `maxTokens`     | Üretilecek maksimum token sayısı             | `1024`              |
| `temperature`   | Rastgeleliği kontrol eder (0.0 - 1.0)        | `0.7`               |
| `topP`          | Çekirdek örnekleme parametresi               | `1.0`               |
| `stopSequences` | Üretimin durduğu diziler dizisi              | `[]`                |
| `contentType`   | SageMaker isteği için içerik türü            | `application/json`  |
| `acceptType`    | SageMaker yanıtı için kabul türü             | `application/json`  |
| `delay`         | Milisaniye cinsinden API çağrıları arası gecikme | `0`                 |
| `transform`     | Göndermeden önce istemleri dönüştüren fonksiyon | N/A                 |

### Durdurma Dizileri (Stop Sequences) Örneği

```yaml
providers:
  - id: sagemaker:jumpstart:my-llama-endpoint
    config:
      region: us-east-1
      maxTokens: 100
      stopSequences: ["\nHuman:", '<|endoftext|>'] # durdurma dizileri örnekleri
```

Bunlar, karşılaşıldığında üretimi durdurmak için (destekleniyorsa) modele iletilecektir. Örneğin, JumpStart Hugging Face LLM konteynerleri dize listesi olarak bir `stop` parametresi kabul eder.

## İçerik Türü (Content Type) ve Kabul (Accept) Başlıkları

`contentType` ve `acceptType` değerlerinin modelinizin beklentileriyle eşleştiğinden emin olun:

- Çoğu LLM uç noktası için `application/json` kullanın (varsayılan).
- Modeliniz ham metin tüketiyorsa veya düz metin döndürüyorsa `text/plain` kullanın.

Varsayılan değer JSON'dur çünkü popüler SageMaker LLM konteynerleri (Hugging Face, JumpStart) JSON yükleri kullanır. Uç noktanız JSON olmayan bir yanıt döndürüyorsa, bu ayarları buna göre yapmanız gerekebilir.

## JavaScript İfadeleri ile Yanıt Ayrıştırma

Benzersiz yanıt formatlarına sahip uç noktalar için, yanıttan belirli alanları çıkarmak üzere JavaScript ifadeleri kullanabilirsiniz:

```yaml
providers:
  - id: sagemaker:my-custom-endpoint
    config:
      responseFormat:
        path: 'json.custom.nested.responseField'
```

Bu, JavaScript özellik erişimini kullanarak JSON yanıtından belirtilen yoldaki değeri çıkaracaktır. JSON yanıtı, ifadenizde `json` değişkeni olarak mevcuttur.

Daha karmaşık ayrıştırma ihtiyaçları için dosya tabanlı bir dönüştürücü kullanabilirsiniz:

```yaml
providers:
  - id: sagemaker:my-custom-endpoint
    config:
      responseFormat:
        path: 'file://transformers/custom-parser.js'
```

JavaScript ifadeleri ve dosya tabanlı dönüştürücülerin kullanımı hakkında daha fazla ayrıntı için [Yanıt Yolu İfadeleri](#yanit-yolu-ifadeleri) bölümüne bakın.

## Embedding'ler

SageMaker embedding uç noktalarını kullanmak için:

```yaml
providers:
  - id: sagemaker:embedding:my-embedding-endpoint
    config:
      region: 'us-east-1'
      modelType: 'huggingface' # İsteği uygun şekilde formatlamaya yardımcı olur
```

Bir embedding uç noktası kullanırken, istek genellikle bir metin modeline benzer şekilde formatlanmalıdır (giriş dizesine sahip JSON). SageMaker konteynerinizin embedding'leri JSON formatında (örn. ondalıklı sayı listesi) döndürdüğünden emin olun. Örneğin, bir Hugging Face sentence-transformer modeli çıktı olarak bir JSON embedding dizisi verecektir.

Model belirli bir yapı döndürüyorsa, bir yol belirtmeniz gerekebilir:

```yaml
providers:
  - id: sagemaker:embedding:my-embedding-endpoint
    config:
      region: us-west-2
      contentType: application/json
      acceptType: application/json
      # örneğin model {"embedding": [..]} döndürüyorsa:
      responseFormat:
        path: 'json.embedding'
```

Veya ham bir dizi döndürüyorsa:

```yaml
responseFormat:
  path: 'json[0]' # döndürülen dizinin ilk öğesi
```

`embedding:` öneki, Promptfoo'ya çıktıyı metin yerine bir embedding vektörü olarak ele almasını söyler. Bu, benzerlik metrikleri için kullanışlıdır. SageMaker'a sayısal vektörler çıktı veren bir embedding modeli konuşlandırmalısınız.

Embedding gerektiren iddialar (benzerlik karşılaştırmaları gibi) için bir SageMaker embedding sağlayıcısı belirtebilirsiniz:

```yaml
defaultTest:
  options:
    provider:
      embedding:
        id: sagemaker:embedding:my-embedding-endpoint
        config:
          region: us-east-1
```

## Ortam Değişkenleri

Promptfoo, varsayılan üretim parametrelerini ayarlamak için belirli ortam değişkenlerini de okuyacaktır:

- `AWS_REGION` veya `AWS_DEFAULT_REGION`: SageMaker API çağrıları için varsayılan bölge
- `AWS_SAGEMAKER_MAX_TOKENS`: Üretilecek varsayılan maksimum token sayısı
- `AWS_SAGEMAKER_TEMPERATURE`: Üretim için varsayılan sıcaklık
- `AWS_SAGEMAKER_TOP_P`: Üretim için varsayılan top_p değeri
- `AWS_SAGEMAKER_MAX_RETRIES`: Başarısız API çağrıları için yeniden deneme sayısı (varsayılan: 3)

Bunlar, değerlendirme çalışmalarınız için küresel varsayılanlar olarak hizmet eder. Yapılandırma dosyalarında tekrardan kaçınmak için bunları kullanabilirsiniz. Sağlayıcının YAML yapılandırmasında ayarlanan herhangi bir değer, bu ortam varsayılanlarını geçersiz kılacaktır.

## Önbelleğe Alma (Caching) Desteği

SageMaker sağlayıcısı, tekrarlanan testleri çalıştırırken değerlendirmeleri önemli ölçüde hızlandırabilen ve maliyetleri azaltabilen promptfoo önbellekleme sistemini tam olarak destekler:

```yaml
# Önbellekleme varsayılan olarak etkindir. Açıkça yapılandırmak için:
evaluateOptions:
  cache: true

providers:
  - id: sagemaker:my-endpoint
    config:
      region: us-east-1
```

Önbellekleme etkinleştirildiğinde:

- Aynı istemler için yanıtlar saklanır ve yeniden kullanılır.
- Token kullanım istatistikleri `cached` bayrağıyla sürdürülür.
- Hata ayıklama (debug) modu gerektiğinde önbelleği baypas eder.

Önbellekleme varsayılan olarak etkindir. Belirli test çalışmaları için önbelleğe almayı devre dışı bırakmak için:

```bash
promptfoo eval --no-cache
```

## Gecikmelerle Hız Sınırlama (Rate Limiting)

SageMaker uç noktaları, istekleri temel örneğin (instance) izin verdiği hızda işleyecektir. Arka arkaya çok fazla istek gönderirseniz, uç noktanın kapasitesini doyurabilir ve gecikme artışları veya hatalar alabilirsiniz. Bunu önlemek için çağrılar arasında bir gecikme yapılandırabilirsiniz.

Örneğin, `delay: 1000` uç noktaya yapılan her istek arasında 1 saniye bekleyecektir. Bu, özellikle modelinizdeki eşzamanlılık sınırlarına takılmamak veya otomatik ölçeklendirmeyi (autoscaling) çok agresif bir şekilde tetiklememek için yararlıdır.

```yaml
providers:
  - id: sagemaker:my-endpoint
    config:
      region: us-east-1
      delay: 1000 # API çağrıları arasına 1000 ms (1 saniye) gecikme ekle
```

Gecikmeyi doğrudan sağlayıcı seviyesinde de belirtebilirsiniz:

```yaml
providers:
  - id: sagemaker:my-endpoint
    delay: 1000 # 1 saniye gecikme
    config:
      region: us-east-1
```

İstekleri aralıklı göndermek, daha fazla örneğin ölçeklenmesine (veya istek başına ödeme modelini kullanıyorsanız yükün yayılmasına) neden olabilecek ani kullanımlardan kaçınmaya yardımcı olabilir. Çağrı başına maliyeti düşürmez ancak kullanımı daha öngörülebilir hale getirebilir.

Gecikmelerin sadece gerçek API çağrıları için uygulandığını, yanıtlar önbellekten alındığında uygulanmadığını unutmayın.

## İstemleri Dönüştürme (Transforming Prompts)

SageMaker sağlayıcısı, istemlerin uç noktaya gönderilmeden önce dönüştürülmesini destekler. Bu özellik özellikle şunlar için yararlıdır:

- İstemleri belirli bir model türü için özel olarak formatlama
- Sistem talimatları veya bağlam ekleme
- Farklı istem formatları arasında dönüşüm yapma
- Özel modeller için metni ön işlemeden geçirme

Yapılandırmanızda bir dönüşüm (transform) fonksiyonu belirtebilirsiniz:

```yaml
providers:
  - id: sagemaker:my-endpoint
    config:
      region: us-east-1
      transform: |
        // SageMaker'a göndermeden önce istemi dönüştür
        return `<s>[INST] ${prompt} [/INST]`
```

Daha karmaşık dönüşümler için bir dosya kullanın:

```yaml
providers:
  - id: sagemaker:jumpstart:my-llama-endpoint
    config:
      region: us-west-2
      modelType: jumpstart
      transform: file://transform.js
```

`transform.js` şunları içerebilir:

```javascript
// Llama istemlerini formatlamak için dönüşüm fonksiyonlu
module.exports = function (prompt, context) {
  return {
    inputs: prompt,
    parameters: {
      max_new_tokens: context.config?.maxTokens || 256,
      temperature: context.config?.temperature || 0.7,
      top_p: context.config?.topP || 0.9,
      do_sample: true,
    },
  };
};
```

Dönüşümü sağlayıcının en üst seviyesinde veya `config` içinde belirtebilirsiniz. Her ikisi de aynı etkiyi yaratır; yapılandırmanızı hangisi daha net hale getiriyorsa onu kullanın. YAML'da, karmaşık mantık için `file://` yolu kullanılması önerilir.

```yaml
providers:
  - id: sagemaker:my-endpoint
    transform: file://transforms/format-prompt.js
    config:
      region: us-east-1
```

Dönüştürülen istemler uygun önbelleğe almayı sürdürür ve yanıtta dönüşüm hakkında meta veriler içerir.

## Yanıt Yolu İfadeleri (Response Path Expressions)

`responseFormat.path` yapılandırma seçeneği, JavaScript ifadelerini veya dosyalardaki özel dönüştürücü fonksiyonlarını kullanarak SageMaker uç noktası yanıtından belirli alanları çıkarmanıza olanak tanır.

### JavaScript İfadeleri

Yanıttaki iç içe geçmiş özelliklere erişmek için JavaScript ifadelerini kullanabilirsiniz. Yol ifadesindeki JSON nesnesine atıfta bulunmak için `json` kullanın:

```yaml
providers:
  - id: sagemaker:jumpstart:your-jumpstart-endpoint
    label: 'JumpStart modeli'
    config:
      region: us-east-1
      modelType: jumpstart
      temperature: 0.7
      maxTokens: 256
      responseFormat:
        path: 'json.generated_text'
```

### Yanıt Formatı Sorunları

Uç noktanızdan alışılmadık yanıtlar alıyorsanız şunları deneyin:

1. `modelType` ayarını modelinizle eşleşecek şekilde yapın (veya benzersizse `custom` yapın).
2. Doğru alanı çıkarmak için `responseFormat.path` seçeneğini kullanın:
   - Llama modelleri (JumpStart) için: `responseFormat.path: "json.generated_text"` kullanın.
   - Mistral modelleri (Hugging Face) için: `responseFormat.path: "json[0].generated_text"` kullanın.
3. Uç noktanızın giriş formatını doğru şekilde işlediğini kontrol edin.
4. Uç nokta doygunluğunu önlemek için bir gecikme parametresi (örn. `delay: 500`) ekleyin.
