---
sidebar_label: WebSockets
description: Özel mesaj şablonları, yanıt ayrıştırma ve çift yönlü API entegrasyonu için güvenli kimlik doğrulama ile gerçek zamanlı LLM çıkarımı için WebSocket uç noktalarını yapılandırın
---

# WebSockets

WebSocket sağlayıcısı, çıkarım (inference) için bir WebSocket uç noktasına bağlanmanıza olanak tanır. Bu, gerçek zamanlı, çift yönlü iletişim için kullanışlıdır. WebSockets genellikle, LLM uygulamalarının algılanan performansını artırmak amacıyla kısmi yanıtlar içeren mesajları akış olarak iletmek için kullanılır. Promptfoo; tam yanıtı içeren tek bir mesajla yanıt veren sunuculardan, bir dizi kısmi yanıt akışı gönderen sunuculara kadar bir dizi uygulamayı destekler.

## Yapılandırma

WebSocket sağlayıcısını kullanmak için sağlayıcı `id` değerini `websocket` olarak ayarlayın ve `config` bölümünde gerekli yapılandırmayı sağlayın.

```yaml
providers:
  - id: 'wss://example.com/ws'
    config:
      messageTemplate: '{"prompt": "{{prompt}}", "model": "{{model}}"}'
      transformResponse: 'data.output'
      timeoutMs: 300000
      headers:
        Authorization: 'Bearer bura-token-gelecek'
```

### Yapılandırma Seçenekleri

- `url` (gerekli): Bağlanılacak WebSocket URL'si.
- `messageTemplate` (gerekli): WebSocket bağlantısı üzerinden gönderilecek mesaj için bir şablon. Gerçek istemle değiştirilecek `{{prompt}}` gibi yer tutucuları kullanabilirsiniz.
- `transformResponse` (isteğe bağlı): `data` parametresi verildiğinde WebSocket yanıtından istenen çıktıyı ayıklamak için bir JavaScript kod parçası veya fonksiyonu. Sağlanmazsa, yanıtın tamamı çıktı olarak kullanılacaktır. Yanıt geçerli bir JSON ise, nesne döndürülecektir.
- `streamResponse` (isteğe bağlı): Sunucu istem başına birden fazla mesaj gönderdiğinde, akışlı WebSocket mesajlarından istenen çıktıyı ayıklamak için bir JavaScript fonksiyonu. `(accumulator, data, context?)` alır ve `[nextAccumulator, complete]` döndürmelidir. `streamResponse` sağlandığında, `transformResponse` yerine bu kullanılır.
- `timeoutMs` (isteğe bağlı): WebSocket bağlantısı için milisaniye cinsinden zaman aşımı. Varsayılan değer 300000'dir (5 dakika).
- `headers` (isteğe bağlı): WebSocket bağlantı isteğine dahil edilecek HTTP başlıkları eşleşmesi. Kimlik doğrulama veya diğer özel başlıklar için kullanışlıdır.

## Değişkenleri Kullanma

`messageTemplate` içinde test değişkenlerini kullanabilirsiniz:

```yaml
providers:
  - id: 'wss://example.com/ws'
    config:
      messageTemplate: '{"prompt": {{ prompt | dump }}, "model": {{ model | dump }}, "language": {{ language | dump }} }'
      transformResponse: 'data.translation'

tests:
  - vars:
      model: 'gpt-4'
      language: 'Fransızca'
```

## Yanıtı Ayrıştırma

WebSocket yanıtından belirli değerleri çıkarmak için `transformResponse` özelliğini kullanın. Örneğin:

```yaml
providers:
  - id: 'wss://example.com/ws'
    config:
      messageTemplate: '{"prompt": {{ prompt | dump }} }'
      transformResponse: 'data.choices[0].message.content'
```

Bu yapılandırma, şuna benzer bir yanıt yapısından mesaj içeriğini çıkarır:

```json
{
  "choices": [
    {
      "message": {
        "content": "Bu bir yanıttır."
      }
    }
  ]
}
```

## Akışlı (Streaming) Yanıtlar

Bazı WebSocket uç noktaları, nihai bir tamamlama göndermeden önce yanıtlarını birden fazla mesaj (örneğin, token bazlı farklar) olarak akış halinde sunar. Bu artımlı mesajları yönetmek ve ne zaman bittiğine karar vermek için `streamResponse` kullanın.

### `streamResponse` Nasıl Çalışır?

- Gelen her WebSocket mesajı için çağrılır ve şunları alır:
  - `accumulator`: Mevcut birikmiş sonuç. Bu, `ProviderResponse` şeklinde bir nesne olmalıdır, örneğin `{ output: string }`.
  - `data`: Ham WebSocket mesaj olayı. Yüke `data.data` üzerinden erişin. Sunucunuz JSON gönderiyorsa, genellikle bunu ayırarak başlayacaksınız: `JSON.parse(data.data)`.
  - `context` (isteğe bağlı): Test değişkenleri ve bayrakları (flags) dahil olmak üzere `callApi`'den gelen çağrı bağlamı.
- Şunları içeren bir demet (tuple) `[result, complete]` döndürmelidir:
  - `result`: İleriye taşımak istediğiniz güncellenmiş birikmiş sonuç.
  - `complete` (boolean): Yalnızca son mesajı aldığınızda ve akışı durdurup sonucu döndürmek istediğinizde `true` olarak ayarlayın.

`complete` değeri `false` olduğunda, promptfoo WebSocket'i açık tutar ve bir sonraki mesajı bekler. `true` olduğunda, bağlantı kapatılır ve `result` döndürülür (`ProviderResponse` olarak normalleştirildikten sonra).

:::info
`data`, tarayıcı/Node `MessageEvent` olayıdır. Çoğu sunucu yararlı yükü `data.data` içinde bir dize olarak gönderir. Gerekiyorsa ayrıştırın:

```js
const message = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
```

:::

### Örnek: Akışlı parçaları tek bir yanıtta birleştirme

Bir seyahat önerisi yazarken sunucunuzun şu şekilde JSON akışı sunduğunu varsayalım:

```json
{"type":"chunk","text":"Ziyaret etmelisiniz "}
{"type":"chunk","text":"ilkbaharda Kyoto'yu."}
{"type":"done"}
```

İşte bir `type: done` gelene kadar `text` alanlarını birleştiren bir `streamResponse`:

```yaml
providers:
  - id: 'wss://example.com/ws'
    config:
      messageTemplate: '{"prompt": {{ prompt | dump }} }'
      streamResponse: |
        (accumulator, data, context) => {
          const msg = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
          const previous = typeof accumulator?.output === 'string' ? accumulator.output : '';

          if (msg?.type === 'chunk' && typeof msg.text === 'string') {
            return [{ output: previous + msg.text }, false];
          }
          if (msg?.type === 'done') {
            return [{ output: previous }, true];
          }
          return [accumulator, false];
        }
```

Bu, `done` mesajı alındığında tek bir nihai dize döndürecektir: "Ziyaret etmelisiniz ilkbaharda Kyoto'yu."

### Örnek: `complete` bayrağı kullanarak nihai olmayan mesajları filtreleme

Pek çok gerçek zamanlı API, ara farklar (interim deltas) ve `complete: true` içeren bir nihai mesaj yayar. Akışın şöyle dostane bir yemek tarifi üretme konuşması içerdiğini varsayalım:

```json
{"role":"assistant","event":"delta","content":"Soğanları soteleyerek başlayın...","complete":false}
{"role":"assistant","event":"delta","content":" sonra domatesleri ekleyin ve kısık ateşte pişirin.","complete":false}
{"role":"assistant","event":"final","content":"Soğanları soteleyerek başlayın, sonra domatesleri ekleyin ve kısık ateşte pişirin.","complete":true}
```

Eğer sadece bitmiş yanıtı puanlamak istiyorsanız (her bir parçayı değil), `complete` değerini sadece son çerçevede `true` olarak ayarlayın ve diğer her şeyi yoksayın:

```yaml
providers:
  - id: 'wss://example.com/ws'
    config:
      messageTemplate: '{"prompt": {{ prompt | dump }} }'
      streamResponse: |
        (accumulator, data, context) => {
          const msg = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
          if (msg?.complete === true) {
            return [{ output: msg.content }, true];
          }
          // Henüz tamamlanmadı — beklemeye devam et ve önceki akümülatörü koru
          return [accumulator, false];
        }
```

### Örnek: Parçaları biriktirme ve yine de `complete` üzerinde durma

Bazen her iki dünyanın da en iyisini istersiniz: UI önizlemesi için parçaları birleştirin, ancak yalnızca API bitti dediğinde sonlandırın. Müşteri destek yanıtları için yaygın bir kalıp:

```yaml
providers:
  - id: 'wss://example.com/ws'
    config:
      messageTemplate: '{"prompt": {{ prompt | dump }} }'
      streamResponse: |
        (accumulator, data, context) => {
          const msg = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
          const previous = typeof accumulator?.output === 'string' ? accumulator.output : '';

          if (msg?.event === 'delta' && typeof msg.content === 'string') {
            return [{ output: previous + msg.content }, false];
          }
          if (msg?.complete === true) {
            return [{ output: previous }, true];
          }
          return [accumulator, false];
        }
```

### Bir dosyadan fonksiyona atıfta bulunma

Daha büyük işleyiciler için mantığı bir dosyada tutun ve ona atıfta bulunun:

```yaml
providers:
  - id: 'wss://example.com/ws'
    config:
      messageTemplate: '{"prompt": {{ prompt | dump }} }'
      streamResponse: 'file://scripts/wsStreamHandler.js'
```

Ayrıca adlandırılmış bir dışa aktarmaya (named export) da işaret edebilirsiniz: `file://scripts/wsStreamHandler.js:myHandler`.

## Kütüphane Olarak Kullanma

Eğer promptfoo'yu bir node kütüphanesi olarak kullanıyorsanız, eşdeğer sağlayıcı yapılandırmasını sağlayabilirsiniz:

```js
{
  // ...
  providers: [{
    id: 'wss://example.com/ws',
    config: {
      messageTemplate: '{"prompt": "{{prompt}}"}',
      transformResponse: (data) => data.foobar,
      timeoutMs: 15000,
    }
  }],
}
```

WebSocket sağlayıcısını kullanırken, her API çağrısı için bağlantının açılacağını ve yanıt alındıktan veya zaman aşımına ulaşıldıktan sonra kapatılacağını unutmayın.

## Referans

Desteklenen yapılandırma seçenekleri:

| Seçenek           | Tür      | Açıklama                                                                                                                                                             |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url               | string   | Bağlanılacak WebSocket URL'si. Sağlanmazsa, sağlayıcının `id` değeri URL olarak kullanılacaktır.                                                                     |
| messageTemplate   | string   | WebSocket bağlantısı üzerinden gönderilecek mesaj için bir şablon dizesi. Nunjucks şablonlamayı destekler.                                                           |
| transformResponse | string   | Tek bir yanıtı ayrıştırmak için bir fonksiyon gövdesi veya dize. `streamResponse` sağlandığında yoksayılır.                                                          |
| streamResponse    | Function | Bir fonksiyon gövdesi, fonksiyon ifadesi veya akışlı mesajlar için `(accumulator, data, context?)` alan ve `[result, complete]` döndüren `file://` başvurusu.        |
| timeoutMs         | number   | WebSocket bağlantısı için milisaniye cinsinden zaman aşımı. Belirtilmezse varsayılan olarak 300000 (5 dakika) olur.                                                 |
| headers           | object   | WebSocket bağlantı isteğine dahil edilecek HTTP başlıkları eşleşmesi. Kimlik doğrulama veya diğer özel başlıklar için kullanışlıdır.                                |

Not: `messageTemplate`, `{{prompt}}` değişkenini veya test bağlamında iletilen diğer değişkenleri kullanmanıza olanak tanıyan Nunjucks şablonlamayı destekler.

Tam bir URL'ye ek olarak, sağlayıcı `id` alanı değer olarak `ws`, `wss` veya `websocket` kabul eder.

:::info
OpenAI Realtime sağlayıcısını kullanıyorsanız, `apiBaseUrl` (veya ortam değişkenleri) aracılığıyla özel uç noktaları yapılandırabilirsiniz. Sağlayıcı otomatik olarak `https://` → `wss://` ve `http://` → `ws://` çevrimi yapar. OpenAI belgelerine bakın: `/docs/providers/openai/#custom-endpoints-and-proxies-realtime`.
:::
