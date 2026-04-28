### Hedeflere Bağlanma (Connecting to Targets)

Hedefinizi (target) yapılandırırken şu en iyi uygulamaları takip edin:

*   Tüm istekler için **tek bir HTTP uç noktası** kullanın. Bu uç nokta, kullanıcı girdisini kabul etmeli ve bir yanıt döndürmelidir.
*   Hedefiniz kimlik doğrulama gerektiriyorsa, yapılandırmanıza özel bir başlık (header) veya kullanıcı aracısı (user agent) ekleyin ve istemcinizi beyaz listeye (whitelist) alın.
*   Promptfoo makinenizde yerel olarak çalışır; bu nedenle **makinenizin hedefe erişim izni** olmalıdır.
*   Promptfoo; kimlik doğrulama, karmaşık protokoller, WebSocket'ler ve daha fazlasını kullanma yeteneğine sahiptir. Ancak, tek bir HTTP uç noktası kullanırsanız kurulumun çok daha kolay olduğunu göreceksiniz.

Hedeflere bağlanırken ortaya çıkabilecek birkaç yaygın sorun şunlardır:

#### Kimlik Doğrulama (Authentication)
Hedefiniz kimlik doğrulama gerektiriyorsa, geçerli bir kimlik doğrulama belirteci (token) sağlamanız gerekecektir.

HTTP veya WebSocket gibi bir sağlayıcı (provider) kullanıyorsanız, belirteci `headers` özelliği içinde iletebilirsiniz:

```yaml
headers:
  Authorization: Bearer <token>
```
#### Hız Sınırlama (Rate Limiting)
Hedefe çok sayıda istek gönderiyorsanız, hız sınırlamasıyla karşılaşabilirsiniz. Bu, kötüye kullanımı önlemek için uygulanan yaygın bir güvenlik önlemidir.

Bu sorunun çözümü, yapılandırmanıza özel bir başlık (header) veya kullanıcı aracısı (user agent) eklemek ve bu bilgiyi hedef sisteminizin hız sınırlama ayarlarında beyaz listeye (whitelist) almaktır.

**Örnek yapılandırma:**

```yaml
headers:
  User-Agent: Promptfoo
```
#### Akış (Streaming) veya Polling (Sorgulama)
Birçok sohbet botu, yanıtları istemciye akış (stream) şeklinde iletir veya istemcinin yeni mesajlar için sorgulama (polling) yapmasını gerektirir. Buradaki çözüm, yanıtı tek bir mesajda döndürecek alternatif bir HTTP uç noktası veya parametre ayarlamaktır.

#### Gerçek Zamanlı Hedefler İçin WebSocket Kullanımı
Hedefiniz gerçek zamanlı WebSocket uyumlu bir API sunuyorsa, bunu doğrudan test edebilirsiniz:

*   Genel WebSocket sağlayıcısı (generic WebSocket provider) ile
*   OpenAI Realtime sağlayıcısı ile

OpenAI uyumlu Realtime hedefleri için (proxy'ler ve yerel/geliştirme ortamları dahil), `apiBaseUrl` (veya `OPENAI_API_BASE_URL`/`OPENAI_BASE_URL`) değerini ayarlayın. WebSocket URL'si otomatik olarak türetilecektir (https→wss, http→ws); bu sayede kurumsal proxy'ler üzerinden yönlendirme yapabilir veya yerel sunucuda (localhost) test edebilirsiniz:

```yaml
providers:
  - id: openai:realtime:gpt-4o-realtime-preview
    config:
      apiBaseUrl: 'http://localhost:8080/v1' # → ws://localhost:8080/v1/realtime otomatik dönüşür
      modalities: ['text']
```
