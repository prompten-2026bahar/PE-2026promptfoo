# Chatbase Sohbet Botu için Red Team Testi

Chatbase; müşteri desteği, potansiyel müşteri oluşturma ve kullanıcı etkileşimi için web sitelerine gömülebilen özel yapay zeka sohbet botları oluşturmaya yönelik bir platformdur. Bu sohbet botları, kuruluşunuzun bilgi tabanına erişmek ve kullanıcılarla görüşmeleri sürdürmek için RAG (Erişimle Zenginleştirilmiş Üretim) yöntemini kullanır.

### Çok Turlu (Multi-turn) ve Tek Turlu (Single-turn) Test Karşılaştırması

#### Tek Turlu Sistemler
Pek çok LLM uygulaması, her sorguyu bağımsız olarak işler ve her etkileşimi yeni bir görüşme olarak ele alır. Önceki etkileşimlere dair hafızası olmayan biriyle konuşmak gibi, mevcut sorunuzu yanıtlayabilirler ancak önceki mesajlardaki bağlamı korumazlar.

Bu durum, tek turlu sistemleri doğası gereği daha güvenli kılar; çünkü saldırganlar konuşma geçmişini manipüle edemezler. Ancak bu güvenlik, kullanışlılık pahasına sağlanır; kullanıcılar her mesajda tüm bağlamı sağlamak zorunda kalır ve bu da etkileşimi zahmetli hale getirir.

#### Çok Turlu Sistemler (Chatbase gibi)
Chatbase dahil modern konuşmaya dayalı yapay zekalar, etkileşim boyunca bağlamı korur. Kullanıcılar takip soruları sorduğunda, sistem önceki mesajlardaki bağlamı anlar ve doğal bir diyaloğa olanak tanır.

Promptfoo'da bu durum, mesajları birbirine bağlayan bir `conversationId` aracılığıyla yönetilir. Bu durum daha iyi bir kullanıcı deneyimi sağlasa da güvenlik zorluklarını beraberinde getirir. Saldırganlar, yanlış önermeler oluşturarak veya hassas bilgileri sızdırmaya çalışarak konuşma bağlamını birden fazla mesaj üzerinden manipüle etmeye çalışabilirler.

### İlk Kurulum

#### Ön Koşullar
*   Node.js 20+
*   promptfoo CLI (`npm install -g promptfoo`)
*   Chatbase API kimlik bilgileri:
    *   API Taşıyıcı Belirteci (Chatbase panelinizden alınır)
    *   Sohbet Botu Kimliği (botunuzun ayarlarında bulunur)

#### Temel Yapılandırma
1. Red team test ortamını başlatın:
```yaml
promptfoo redteam init
```
2. Kurulum arayüzünde Chatbase hedefinizi yapılandırın. Yapılandırma dosyanız şuna benzer görünmelidir:

```yaml
targets:
  - id: 'http'
    config:
      method: 'POST'
      url: 'https://www.chatbase.co/api/v1/chat'
      headers:
        'Content-Type': 'application/json'
        'Authorization': 'Bearer YOUR_API_TOKEN'
      body:
        {
          'messages': '{{prompt}}',
          'chatbotId': 'YOUR_CHATBOT_ID',
          'stream': false,
          'temperature': 0,
          'model': 'gpt-5-mini',
          'conversationId': '{{conversationId}}',
        }
      transformResponse: 'json.text'
      transformRequest: '[{ role: "user", content: prompt }]'
defaultTest:
  options:
    transformVars: '{ ...vars, conversationId: context.uuid }'
```
### Yapılandırma Notları
Sohbet botunuz için hem `transformRequest` hem de `transformResponse` ayarlarını yapılandırın:

*   **transformRequest:** İsteği OpenAI uyumlu mesajlar olarak formatlar.
*   **transformResponse:** Yanıt metnini JSON gövdesinden (body) çıkarır.

`context.uuid` her test için benzersiz bir konuşma kimliği oluşturarak Chatbase'in birden fazla mesaj boyunca konuşma durumunu takip etmesini sağlar.

### Strateji Yapılandırması
`promptfooconfig.yaml` dosyanızda çok turlu (multi-turn) test stratejilerini etkinleştirin:

```yaml
strategies:
  - id: 'goat'
    config:
      stateful: true
  - id: 'crescendo'
    config:
      stateful: true
  - id: 'mischievous-user'
    config:
      stateful: true
```
### Test Yürütme
Testlerinizi şu komutlarla çalıştırın:

```bash
# Test senaryolarını oluşturun
promptfoo redteam generate

# Değerlendirmeyi (evaluation) yürütün
promptfoo redteam eval

# Ayrıntılı sonuçları web arayüzünde görüntüleyin
promptfoo view
```
### Yaygın Sorunlar ve Çözümler
Sorunlarla karşılaşırsanız şu adımları izleyin:

*   Testler bağlantı kuramazsa, API kimlik bilgilerinizi doğrulayın.
*   Mesaj içeriği bozuk geliyorsa, istek ayrıştırıcınızın (request parser) ve yanıt ayrıştırıcınızın (response parser) doğruluğunu kontrol edin.

### Ek Kaynaklar
*   [Chatbase API Dokümantasyonu](https://chatbase.co)
*   [Promptfoo HTTP Sağlayıcı Kılavuzu](https://promptfoo.dev)
*   [Çok Turlu (Multi-turn) Test Stratejileri](https://promptfoo.dev)


