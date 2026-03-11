---
sidebar_label: Web Tarayıcısı
description: 'Gizliliği koruyan testler için WebGPU hızlandırma ve yerel modeller kullanarak LLM değerlendirmelerini doğrudan tarayıcılarda gerçekleştirin'
---

# Tarayıcı Sağlayıcısı (Browser Provider)

Tarayıcı Sağlayıcısı, daha basit sağlayıcıların yetersiz kaldığı karmaşık web uygulamalarını ve yoğun JavaScript içeren web sitelerini test etmek için otomatik web tarayıcısı etkileşimlerini sağlar.

Bu sağlayıcı, gözetimsiz (headless) tarayıcıları kontrol etmek için [Playwright](https://playwright.dev/) kullanır; bu sayede sayfalarda gezinebilir, öğelerle etkileşime girebilir ve dinamik web sitelerinden veri ayıklayabilirsiniz. Playwright; Chromium (Chrome, Edge), Firefox ve WebKit (Safari motoru) tarayıcılarını destekler.

## Tarayıcı Sağlayıcısı Ne Zaman Kullanılmalıdır?

Tarayıcı Sağlayıcısı yalnızca daha basit alternatiflerin mümkün olmadığı durumlarda kullanılmalıdır:

1. **Önce bunları deneyin:**
   - [HTTP Sağlayıcısı](/docs/providers/http) - API çağrıları ve basit HTML yanıtları için.
   - [WebSocket Sağlayıcısı](/docs/providers/websocket) - Gerçek zamanlı bağlantılar için.
   - [Özel Python Sağlayıcısı](/docs/providers/python) - Mevcut kütüphanelerle özel mantık yürütmek için.
   - [Özel JavaScript Sağlayıcısı](/docs/providers/custom-api) - Node.js tabanlı çözümler için.

2. **Tarayıcı Sağlayıcısını yalnızca şu durumlarda kullanın:**
   - Uygulamanın içeriği işlemek (render) için JavaScript yürütmesi gerekiyorsa.
   - Karmaşık kullanıcı arayüzü öğeleriyle (açılır menüler, modallar vb.) etkileşime girmeniz gerekiyorsa.
   - Kimlik doğrulama, tarayıcı tabanlı iş akışları (OAuth, SSO) gerektiriyorsa.
   - Gerçek kullanıcı etkileşimlerini (tıklamalar, yazma, kaydırma) test etmeniz gerekiyorsa.

### Önemli Hususlar

Tarayıcı otomasyonu kullanırken şunlara dikkat edin:

1. **Hız Sınırlama (Rate Limiting)**: Sunucuları aşırı yüklememek için istekler arasına her zaman gecikmeler ekleyin.
2. **Bot Algılama**: Pek çok web sitesi, otomatik tarayıcıları algılayan ve engelleyen bot karşıtı önlemler kullanır.
3. **Kaynak Kullanımı**: Tarayıcı otomasyonu, doğrudan API çağrılarından 10-100 kat daha yavaştır ve önemli ölçüde CPU/bellek tüketir.
4. **Yasal Uyumluluk**: Otomasyon yapmadan önce her zaman web sitesinin Hizmet Şartlarını ve robots.txt dosyasını kontrol edin.

## Ön Koşullar

Tarayıcı sağlayıcısı Playwright ve ilgili paketleri gerektirir. Bunlar isteğe bağlı bağımlılıklardır, bu nedenle bunları kendiniz kurmanız gerekir:

```bash
npm install playwright @playwright/browser-chromium playwright-extra puppeteer-extra-plugin-stealth
```

Not: Şu anda promptfoo'nun tarayıcı sağlayıcısı yalnızca Chromium tabanlı tarayıcıları (Chrome, Edge) desteklemektedir. Sağlayıcı, gelişmiş gizlilik yetenekleri için Chromium motoruyla birlikte `playwright-extra` paketini kullanır.

## Yapılandırma

Tarayıcı Sağlayıcısını kullanmak için sağlayıcı `id`sini `browser` olarak ayarlayın ve yürütülecek bir dizi `steps` (adım) tanımlayın:

```yaml
providers:
  - id: browser
    config:
      steps:
        - action: navigate
          args:
            url: 'https://example.com'
        - action: type
          args:
            selector: '#search-input'
            text: '{{prompt}}'
        - action: click
          args:
            selector: '#search-button'
        - action: extract
          args:
            selector: '#results'
          name: searchResults
      transformResponse: 'extracted.searchResults'
```

### Mevcut Tarayıcı Oturumlarına Bağlanma

Mevcut bir Chrome tarayıcı oturumuna (örneğin, OAuth kimlik doğrulaması zaten tamamlanmış bir oturum) bağlanabilirsiniz:

```yaml
providers:
  - id: browser
    config:
      connectOptions:
        debuggingPort: 9222 # Chrome hata ayıklama portu

      steps:
        # Test adımlarınız buraya
```

**Kurulum Talimatları**:

1. Chrome'u hata ayıklama moduyla başlatın: `chrome --remote-debugging-port=9222 --user-data-dir=/tmp/test`
2. Kimlik doğrulamasını manuel olarak tamamlayın.
3. Testlerinizi çalıştırın.

**Bağlantı Seçenekleri**:

- `debuggingPort`: Chrome DevTools Protokolü için port numarası (varsayılan: 9222).
- `mode`: Bağlantı modu - `'cdp'` (varsayılan) veya `'websocket'`.
- `wsEndpoint`: Doğrudan WebSocket uç noktası (`mode: 'websocket'` kullanıldığında).

### Çok Turlu Oturum Kalıcılığı (Multi-Turn Session Persistence)

Hydra, Crescendo veya GOAT gibi çok turlu stratejiler için tarayıcı oturumunu turlar arasında koruyabilirsiniz. Bu, aynı sayfayı açık tutar ve sohbet tabanlı uygulamalarda konuşma durumunu sürdürür.

```yaml
providers:
  - id: browser
    config:
      persistSession: true # Sayfayı turlar arasında açık tut
      connectOptions:
        debuggingPort: 9222

      steps:
        # Sadece ilk turda navigasyon yap
        - action: navigate
          runOnce: true
          args:
            url: 'https://example.com/chat'

        # Sadece ilk turda sayfa yüklenmesini bekle
        - action: wait
          runOnce: true
          args:
            ms: 3000

        # Bunlar her turda çalışır
        - action: type
          args:
            selector: '#chat-input'
            text: '{{prompt}}<enter>'

        - action: wait
          args:
            ms: 5000

        - action: extract
          args:
            script: |
              // En son yapay zeka yanıtını ayıkla
              const messages = document.querySelectorAll('.ai-message');
              return messages[messages.length - 1]?.textContent || '';
          name: response

      transformResponse: 'extracted.response'
```

**Temel seçenekler:**

- `persistSession: true` - `callApi()` çağrıları arasında tarayıcı sayfasını açık tutar.
- Adımlarda `runOnce: true` - Sadece ilk turda yürütülür (sonraki turlarda atlanır).

Bu, konuşma bağlamını sürdürmeniz gereken sohbet arayüzlerine karşı çok turlu jailbreak stratejilerini test etmek için gereklidir.

## Desteklenen Eylemler

Tarayıcı Sağlayıcısı aşağıdaki eylemleri destekler:

### Temel Eylemler

#### 1. `navigate` - Web sayfası yükle

Belirtilen bir URL'ye gider.

```yaml
- action: navigate
  args:
    url: 'https://example.com/search?q={{query}}'
```

#### 2. `click` - Bir öğeye tıkla

Tıklanabilir herhangi bir öğeye (düğme, bağlantı vb.) tıklar.

```yaml
- action: click
  args:
    selector: 'button[type="submit"]'
    optional: true # Öğe mevcut değilse hata vermez
```

#### 3. `type` - Metin gir

Metin giriş alanlarına, metin alanlarına (textarea) veya düzenlenebilir herhangi bir öğeye metin yazar.

```yaml
- action: type
  args:
    selector: 'input[name="username"]'
    text: '{{username}}'
```

Özel tuşlar:

- `<enter>` - Enter tuşuna basar.
- `<tab>` - Tab tuşuna basar.
- `<escape>` - Escape tuşuna basar.

#### 4. `extract` - Metin içeriğini al

Herhangi bir öğeden metin ayıklar veya veri ayıklamak için özel JavaScript çalıştırır. Ayıklanan içerik `transformResponse` içinde kullanılabilir.

**Seçici (selector) kullanarak:**

```yaml
- action: extract
  args:
    selector: '.result-title'
  name: title # extracted.title olarak erişin
```

**Özel bir betik (script) kullanarak:**

```yaml
- action: extract
  args:
    script: |
      const fullText = document.body.innerText;
      return fullText.split('Response:')[1]?.trim() || '';
  name: aiResponse # extracted.aiResponse olarak erişin
```

`script` seçeneği, tarayıcı bağlamında JavaScript çalıştırır ve sonucu döndürür. Bu, CSS seçicilerinin işleyemediği karmaşık ayıklama mantığına ihtiyaç duyduğunuzda kullanışlıdır.

#### 5. `wait` - Yürütmeyi duraklat

Belirtilen bir süre boyunca (milisaniye cinsinden) bekler.

```yaml
- action: wait
  args:
    ms: 3000 # 3 saniye bekle
```

#### 6. `waitForNewChildren` - Dinamik içeriği bekle

Bir üst öğenin altında yeni öğelerin görünmesini bekler. AJAX üzerinden yüklenen içerikler için kullanışlıdır.

```yaml
- action: waitForNewChildren
  args:
    parentSelector: '#results-container'
    delay: 500 # Her 500ms'de bir kontrol et
    timeout: 10000 # Maksimum 10 saniye bekle
```

#### 7. `screenshot` - Sayfayı yakala

Sayfanın mevcut durumunun ekran görüntüsünü alır.

```yaml
- action: screenshot
  args:
    path: 'screenshot.png'
    fullPage: true # Sadece görünür alanı değil, tüm sayfayı yakala
```

### Eylem Parametreleri

| Eylem              | Gerekli Argümanlar             | İsteğe Bağlı Argümanlar | Açıklama                                       |
| ------------------ | ------------------------------ | ---------------------- | ---------------------------------------------- |
| navigate           | `url`                          | -                      | Gidilecek URL                                  |
| click              | `selector`                     | `optional`             | Tıklanacak öğenin CSS seçicisi                 |
| type               | `selector`, `text`             | -                      | CSS seçicisi ve yazılacak metin                |
| extract            | `selector` VEYA `script`, `name` | -                    | CSS seçicisi veya JS betiği ve değişken adı    |
| wait               | `ms`                           | -                      | Beklenecek milisaniye                          |
| waitForNewChildren | `parentSelector`               | `delay`, `timeout`     | İzlenecek üst öğe                              |
| screenshot         | `path`                         | `fullPage`             | Ekran görüntüsünün kaydedileceği dosya yolu    |

## Yanıt Ayrıştırma (Response Parsing)

Sonuçlardan belirli verileri ayıklamak için `transformResponse` yapılandırma seçeneğini kullanın. Ayrıştırıcı iki özelliğe sahip bir nesne alır:

- `extracted`: `extract` eylemlerinden gelen adlandırılmış sonuçları içeren bir nesne.
- `finalHtml`: Tüm eylemler tamamlandıktan sonra sayfanın son HTML içeriği.

## Değişkenler ve Şablonlama

Yapılandırmanızda, `{{prompt}}` değişkeni ve test bağlamında iletilen diğer tüm değişkenler dahil olmak üzere Nunjucks şablonlamayı kullanabilirsiniz.

```yaml
providers:
  - id: browser
    config:
      steps:
        - action: navigate
          args:
            url: 'https://example.com/search?q={{prompt}}'
        - action: extract
          args:
            selector: '#first-result'
          name: topResult
      transformResponse: 'extracted.topResult'

tests:
  - vars:
      prompt: 'Fransa"nın başkenti neresidir?'
```

## Kitaplık Olarak Kullanım

Eğer promptfoo'yu bir [Node kitaplığı](/docs/usage/node-package/) olarak kullanıyorsanız, eşdeğer sağlayıcı yapılandırmasını sağlayabilirsiniz:

```js
{
  // ...
  providers: [{
    id: 'browser',
    config: {
      steps: [
        { action: 'navigate', args: { url: 'https://example.com' } },
        { action: 'type', args: { selector: '#search', text: '{{prompt}}' } },
        { action: 'click', args: { selector: '#submit' } },
        { action: 'extract', args: { selector: '#results' }, name: 'searchResults' }
      ],
      transformResponse: (extracted, finalHtml) => extracted.searchResults,
    }
  }],
}
```

## Referans

Desteklenen yapılandırma seçenekleri:

| Seçenek           | Tür                                                                              | Açıklama                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| headless          | `boolean`                                                                        | Tarayıcının gözetimsiz (headless) modda çalışıp çalışmayacağı. Varsayılan: `true`.                                                                                           |
| cookies           | `string` \| `{ name: string; value: string; domain?: string; path?: string; }[]` | Tarayıcıda ayarlanacak bir dize veya çerez dizisi.                                                                                                                           |
| transformResponse | `string` \| `Function`                                                           | Yanıtı ayrıştırmak için bir fonksiyon veya fonksiyonun dize temsili. `extracted` ve `finalHtml` parametrelerini içeren bir nesne alır ve bir ProviderResponse döndürmelidir. |
| steps             | `BrowserAction[]`                                                                | Tarayıcıda gerçekleştirilecek eylemler dizisi.                                                                                                                               |
| timeoutMs         | `number`                                                                         | Tarayıcı işlemlerinin tamamlanması için beklenecek maksimum süre (milisaniye).                                                                                               |
| persistSession    | `boolean`                                                                        | Birden fazla `callApi()` çağrısı boyunca tarayıcı sayfasını açık tutar. Çok turlu stratejiler için gereklidir. Varsayılan: `false`.                                          |
| connectOptions    | `object`                                                                         | Mevcut bir tarayıcıya bağlanma seçenekleri (`debuggingPort`, `mode`, `wsEndpoint`).                                                                                          |

Not: Yapılandırmadaki tüm dize değerleri Nunjucks şablonlamayı destekler. Bu, `{{prompt}}` değişkenini veya test bağlamında iletilen diğer değişkenleri kullanabileceğiniz anlamına gelir.

### Tarayıcı Desteği

Playwright birden fazla tarayıcıyı (Chromium, Firefox ve WebKit) desteklemesine rağmen, promptfoo'nun tarayıcı sağlayıcısı şu anda yalnızca Chromium desteğini uygulamaktadır. Bu şunları içerir:

- **Chrome** - Google'ın tarayıcısı.
- **Edge** - Microsoft'un Chromium tabanlı tarayıcısı.
- **Chromium** - Açık kaynaklı tarayıcı projesi.

Uygulama, algılanmaktan kaçınmak için gelişmiş gizlilik yetenekleri sunan Chromium motoruyla birlikte `playwright-extra` paketini kullanır.

### Desteklenen Tarayıcı Eylemleri

Yapılandırmadaki `steps` dizisi şu eylemleri içerebilir:

| Eylem              | Açıklama                                             | Gerekli Argümanlar                               | İsteğe Bağlı Argümanlar                 |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------ | --------------------------------------- |
| navigate           | Belirtilen bir URL'ye gider                          | `url`: string                                    | `runOnce`: boolean                      |
| click              | Bir öğeye tıklar                                     | `selector`: string                               | `optional`: boolean, `runOnce`: boolean |
| extract            | Öğeden metin ayıklar veya JS betiği çalıştırır        | (`selector` VEYA `script`): string, `name`: string |                                         |
| screenshot         | Sayfanın ekran görüntüsünü alır                       | `path`: string                                   | `fullPage`: boolean                     |
| type               | Bir giriş alanına metin yazar                        | `selector`: string, `text`: string               | `runOnce`: boolean                      |
| wait               | Belirtilen bir süre boyunca bekler                   | `ms`: number                                     | `runOnce`: boolean                      |
| waitForNewChildren | Bir üst öğenin altında yeni alt öğelerin çıkmasını bekler | `parentSelector`: string                       | `delay`: number, `timeout`: number      |

`steps` dizisindeki her eylem şu yapıya sahip bir nesne olmalıdır:

```typescript
{
  action: string;
  args: {
    [key: string]: any;
  };
  name?: string;
  runOnce?: boolean;
}
```

`steps` dizisindeki her adım şu yapıya sahip olmalıdır:

- `action`: Gerçekleştirilecek eylem türünü belirtir (örn. 'navigate', 'click', 'type').
- `args`: Eylem için gerekli ve isteğe bağlı argümanları içerir.
- `name` (isteğe bağlı): 'extract' eyleminde ayıklanan içeriği adlandırmak için kullanılır.
- `runOnce` (isteğe bağlı): Eğer `true` ise, adım yalnızca ilk turda yürütülür. Çok turlu stratejiler için `persistSession` ile birlikte kullanılır.

Adımlar sırayla yürütülür ve karmaşık web etkileşimlerine olanak tanır.

`args` içindeki tüm dize değerleri Nunjucks şablonlamayı destekler; böylece `{{prompt}}` gibi değişkenler kullanılabilir.

## Gelişmiş Özellikler

### Playwright Kayıt Araçları (Recorder Tools)

Tarayıcı otomasyon betikleri oluşturmanın en kolay yolu etkileşimlerinizi kaydetmektir:

#### Chrome Uzantısı (Önerilen)

[Playwright Recorder Chrome Uzantısı](https://chrome.google.com/webstore/detail/playwright-recorder/pbbgjmghmjcpeelnheiphabndacpdfbc), seçicileri (selectors) hızlıca oluşturmak için özellikle yararlıdır:

1. Uzantıyı Chrome Web Mağazası'ndan kurun.
2. Hedef web sitenize gidin.
3. Uzantı simgesine tıklayın ve kaydı başlatın.
4. Eylemlerinizi gerçekleştirin (tıklama, yazma vb.).
5. Kaydı durdurun ve oluşturulan seçicileri/kodları kopyalayın.
6. Kodları promptfoo'nun tarayıcı sağlayıcısı formatına uyarlayın.

Bu uzantı şunlar nedeniyle özellikle kullanışlıdır:

- Öğelerin üzerine geldiğinizde seçicileri gerçek zamanlı olarak gösterir.
- Birden fazla seçici seçeneği (CSS, metin, XPath) oluşturur.
- Tam bir eylem kaydı yapmadan tekil seçicileri kopyalamanıza olanak tanır.

#### Playwright Denetçisi (Tüm Tarayıcılar)

Çapraz tarayıcı kaydı için Playwright'ın yerleşik kaydedicisini kullanın:

```bash
npx playwright codegen https://example.com
```

Bu, eylemleri gerçekleştirebileceğiniz ve oluşturulan kodu gerçek zamanlı olarak görebileceğiniz etkileşimli bir tarayıcı penceresi açar. Chromium, Firefox veya WebKit arasından seçim yapabilirsiniz.

### Seçici Stratejileri

Playwright çeşitli seçici stratejilerini destekler:

| Strateji | Örnek                            | Açıklama                      |
| -------- | -------------------------------- | ----------------------------- |
| CSS      | `#submit-button`                 | Standart CSS seçicileri       |
| Metin    | `text=Gönder`                    | Metin içeriğine göre bulma    |
| Rol      | `role=button[name="Gönder"]`     | ARIA rol tabanlı seçiciler    |
| Test ID  | `data-testid=submit`             | Veri özniteliği seçicileri    |
| XPath    | `xpath=//button[@type="submit"]` | XPath ifadeleri               |

En güvenilir seçiciler için:

- Kimlikler (IDs) ve data-testid gibi kararlı öznitelikleri tercih edin.
- Erişilebilirlik için rol tabanlı seçicileri kullanın.
- Sayfa düzeni değişiklikleriyle bozulabilecek konum tabanlı seçicilerden kaçının.

### Hata Ayıklama (Debugging)

#### 1. Gözetimsiz (Headless) Modu Devre Dışı Bırakın

Tarayıcıda tam olarak ne olduğunu görün:

```yaml
providers:
  - id: browser
    config:
      headless: false # Görünür bir tarayıcı penceresi açar
```

#### 2. Hata Ayıklama Günlüğünü Etkinleştirin

Her eylem hakkında ayrıntılı bilgi alın:

```bash
npx promptfoo@latest eval --verbose
```

#### 3. Ekran Görüntüleri Alın

Yürütme sırasında sayfa durumunu yakalayın:

```yaml
steps:
  - action: navigate
    args:
      url: 'https://example.com'
  - action: screenshot
    args:
      path: 'debug-{{_attempt}}.png'
```

### Performans Optimizasyonu

1. **Üretimde gözetimsiz modu kullanın**: Daha hızlıdır ve daha az kaynak tüketir.
2. **Bekleme sürelerini en aza indirin**: Sadece gerektiği kadar bekleyin.
3. **Toplu işlemler**: İlgili eylemleri gruplandırın.
4. **Tarayıcı bağlamlarını (contexts) yeniden kullanın**: Aynı siteye karşı yapılan birden fazla test için.

### Hız Sınırlama (Rate Limiting) İçin En İyi Uygulamalar

Algılanmaktan ve sunucuyu aşırı yüklemekten kaçınmak için uygun hız sınırlaması uygulamak çok önemlidir:

```yaml
providers:
  - id: browser
    config:
      steps:
        # Her zaman saygılı bir gecikmeyle başlayın
        - action: wait
          args:
            ms: 2000

        - action: navigate
          args:
            url: 'https://example.com'

        # Eylemler arasında bekleyin
        - action: wait
          args:
            ms: 1000

        - action: click
          args:
            selector: '#button'

        # Bir sonraki istekten önce son gecikme
        - action: wait
          args:
            ms: 3000
```

**Algılanmaktan kaçınmak için ipuçları:**

- Eylemler arasındaki gecikmeleri rastgele hale getirin (1-3 saniye).
- Gizlilik eklentisini (stealth plugin) kullanın (playwright-extra ile birlikte gelir).
- Otomatik görünen desenlerden kaçının.
- Farklı kullanıcı aracıları (user agents) kullanmayı düşünün.
- robots.txt dosyasına ve hız sınırlarına uyun.

### Bot Karşıtı Önlemlerle Başa Çıkma

Pek çok web sitesi bot karşıtı algılama sistemleri (Cloudflare, reCAPTCHA vb.) uygular. İşte yaygın senaryolarla başa çıkma yöntemleri:

#### Yaygın Bot Karşıtı Zorluklar

| Zorluk                 | Algılama Yöntemi                      | Azaltma Stratejisi                              |
| ---------------------- | ------------------------------------- | ----------------------------------------------- |
| Tarayıcı parmak izi    | Otomasyon için JavaScript kontrolleri | Gizlilik eklentisi otomasyonu maskelemeye yardımcı olur |
| Davranış analizi       | Fare hareketleri, yazma desenleri     | Gerçekçi gecikmeler ve etkileşimler ekleyin    |
| IP hız sınırlama       | Bir IP'den çok fazla istek            | Uygun gecikmeler kullanın, vekilleri dikkatli kullanın |
| CAPTCHA zorlukları     | İnsan doğrulama testleri              | Sitenin otomasyona izin verip vermediğini düşünün |
| Kullanıcı Aracısı algılama| Gözetimsiz tarayıcı kontrolü          | Gerçekçi kullanıcı aracısı dizeleri kullanın   |

#### Bot Karşıtı Hususlar İçeren Örnek

```yaml
providers:
  - id: browser
    config:
      headless: false # Bazı siteler gözetimsiz modu algılar
      steps:
        # Başlamadan önce insan benzeri gecikme
        - action: wait
          args:
            ms: 3000

        - action: navigate
          args:
            url: '{{url}}'

        # Herhangi bir bot karşıtı kontrolün tamamlanmasını bekle
        - action: wait
          args:
            ms: 5000

        # Bir insanın yapacağı gibi yavaşça yaz
        - action: type
          args:
            selector: '#search'
            text: '{{query}}'
            delay: 100 # Tuş vuruşları arasındaki gecikme
```

**Not**: Eğer bir web sitesinin güçlü bot karşıtı önlemleri varsa, bu genellikle otomasyonun hoş karşılanmadığının bir işaretidir. Her zaman web sitesi sahibinin isteklerine saygı gösterin ve bunun yerine API erişimi istemeyi düşünün.

## Örnek: Giriş Akışını Test Etme

İşte bir giriş iş akışını test eden eksiksiz bir örnek:

```yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: Giriş özelliğini test et

prompts:
  - '{{username}} kullanıcı adı ve {{password}} şifresi ile giriş yap'

providers:
  - id: browser
    config:
      headless: true
      steps:
        - action: navigate
          args:
            url: 'https://example.com/login'

        - action: type
          args:
            selector: '#username'
            text: '{{username}}'

        - action: type
          args:
            selector: '#password'
            text: '{{password}}'

        - action: click
          args:
            selector: 'button[type="submit"]'

        - action: wait
          args:
            ms: 2000

        - action: extract
          args:
            selector: '.welcome-message'
          name: welcomeText

      transformResponse: |
        return {
          output: extracted.welcomeText,
          success: extracted.welcomeText.includes('Hoş geldiniz')
        };

tests:
  - vars:
      username: 'testu_kullanicisi'
      password: 'test_sifresi123'
    assert:
      - type: javascript
        value: output.success === true
```

## Sorun Giderme

### Yaygın Sorunlar ve Çözümler

| Sorun                           | Neden                                      | Çözüm                                                                                             |
| ------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| "Öğe bulunamadı" (Element not found) | Seçici yanlış veya öğe yüklenmedi          | • DevTools'ta seçiciyi doğrulayın<br />• Eylemden önce bekleme ekleyin<br />• Öğenin bir iframe içinde olup olmadığını kontrol edin |
| "Seçici için zaman aşımı"       | Sayfa yavaş yükleniyor veya öğe hiç görünmüyor | • Zaman aşımı süresini (timeout) artırın<br />• Açık bekleme eylemleri ekleyin<br />• Başarısız ağ isteklerini kontrol edin |
| "Erişim reddedildi" veya 403 hatası | Bot karşıtı algılama tetiklendi            | • headless: false kullanın<br />• Daha fazla gecikme ekleyin<br />• Otomasyona izin verilip verilmediğini kontrol edin |
| "Tıklama engellendi"            | Öğe bir katman (overlay) tarafından kapatılmış | • Katmanların kaybolmasını bekleyin<br />• Öğeyi görünür alana kaydırın (scroll)<br />• Zorla tıklama (force click) seçeneğini kullanın |
| Tutarsız sonuçlar               | Zamanlama veya algılama sorunları          | • Tutarlı gecikmeler ekleyin<br />• Gizlilik eklentisi (stealth plugin) kullanın<br />• Yoğun olmayan saatlerde test edin |

### Bot Karşıtı Algılamada Hata Ayıklama

Eğer bot karşıtı önlemlerin otomasyonunuzu engellediğinden şüpheleniyorsanız:

```yaml
providers:
  - id: browser
    config:
      headless: false # Hata ayıklama için her zaman pencereli modla başlayın
      steps:
        - action: navigate
          args:
            url: '{{url}}'

        - action: screenshot
          args:
            path: 'debug-landing.png' # Bir engel sayfasıyla (challenge page) karşılaşıp karşılaşmadığınızı kontrol edin

        - action: wait
          args:
            ms: 10000 # Ne olduğunu görmek için daha uzun süre bekle

        - action: screenshot
          args:
            path: 'debug-after-wait.png'
```

## Yararlı Kaynaklar

- [Playwright Dokümantasyonu](https://playwright.dev/docs/intro) - Resmi Playwright belgeleri.
- [Playwright Tarayıcılar Kılavuzu](https://playwright.dev/docs/browsers) - Desteklenen tarayıcılar hakkında ayrıntılı bilgi.
- [Playwright Seçiciler Kılavuzu](https://playwright.dev/docs/selectors) - CSS, metin ve diğer seçici stratejileri hakkında bilgi edinin.
- [Playwright En İyi Uygulamalar](https://playwright.dev/docs/best-practices) - Güvenilir otomasyon için ipuçları.
- [Playwright Denetçisi](https://playwright.dev/docs/inspector) - Testler oluşturmak ve hata ayıklamak için etkileşimli araç.
- [Chrome DevTools Kılavuzu](https://developer.chrome.com/docs/devtools/) - Öğeleri incelemek ve seçicileri bulmak için.

---

Daha fazla örnek için GitHub depomuzdaki [gözetimsiz tarayıcı (headless-browser) örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/headless-browser) bakabilirsiniz.
