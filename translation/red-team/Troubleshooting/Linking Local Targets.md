### Yerel Hedefleri Buluta Bağlama (Linking Local Targets to Cloud)

Özel sağlayıcılar (Python, JavaScript, HTTP) kullanırken, yerel yapılandırmanızı `linkedTargetId` kullanarak bir bulut hedefine bağlayın. Bu, birden fazla değerlendirme (eval) çalışmasından elde edilen bulguları tek bir panoda birleştirerek performansı ve güvenlik açıklarını zaman içinde takip etmenizi ve kapsamlı raporlar görüntülemenizi sağlar.

#### Hedefler Nasıl Bağlanır?

**1. Adım: Hedef Kimliğini (Target ID) Alın**
*   Promptfoo Cloud'da oturum açın (https://www.promptfoo.app/ veya şirket içi URL'niz).
*   Hedefler (Targets) sayfasına gidin: `/redteam/targets`
*   Bağlamak istediğiniz hedefi bulun.
*   Kimliğini (ID) kopyalayın (şuna benzer: `12345678-1234-1234-1234-123456789abc`).

**2. Adım: Sağlayıcı Yapılandırmasına Ekleyin**
Kimliği `promptfoo://provider/<hedef-id>` şeklinde formatlayın ve sağlayıcı yapılandırmanıza ekleyin:

**Python sağlayıcısı:**

```yaml
providers:
  - id: 'file://my_provider.py'
    config:
      linkedTargetId: 'promptfoo://provider/12345678-1234-1234-1234-123456789abc'
      # Diğer yapılandırmalarınız...
```
### JavaScript sağlayıcısı:
```yaml
providers:
  - id: 'file://customProvider.js'
    config:
      linkedTargetId: 'promptfoo://provider/12345678-1234-1234-1234-123456789abc'
      # Diğer yapılandırmalarınız...
```
### HTTP sağlayıcısı:
```yaml
providers:
  - id: https
    config:
      url: 'https://api.example.com/endpoint'
      method: 'POST'
      linkedTargetId: 'promptfoo://provider/12345678-1234-1234-1234-123456789abc'
      headers:
        'Content-Type': 'application/json'
      body:
        prompt: '{{prompt}}'
```
**3. Adım: Değerlendirmenizi (Eval) Çalıştırın**
Sonuçlar artık bağlantılı bulut hedefi altında birleştirilecektir.

### Sorun Giderme (Troubleshooting)

#### "Invalid linkedTargetId format" Hatası
**Sorun:** `linkedTargetId` değeri `promptfoo://provider/` ile başlamıyor.

**Çözüm:** Formatın tam olarak `promptfoo://provider/<UUID>` şeklinde olduğundan emin olun:

```yaml
# ✅ Doğru
linkedTargetId: 'promptfoo://provider/12345678-1234-1234-1234-123456789abc'

# ❌ Yanlış - ön ek eksik
linkedTargetId: '12345678-1234-1234-1234-123456789abc'

# ❌ Yanlış - hatalı ön ek
linkedTargetId: 'promptfoo://12345678-1234-1234-1234-123456789abc'
```
#### "linkedTargetId not found" Hatası
**Sorun:** Hedef (Target), bulut organizasyonunuzda mevcut değil veya erişim yetkiniz yok.

**Sorun Giderme Adımları:**

Oturum açtığınızı doğrulayın:

```bash
promptfoo auth status
```
**Hedefin (Target) varlığını kontrol edin:**

*   Bulut panonuzdaki `/redteam/targets` sayfasını ziyaret edin.
*   Hedef kimliğinin (target ID) doğru olduğunu doğrulayın.
*   Hedefin silinmediğinden emin olun.

**Organizasyon erişimini doğrulayın:**

*   Hedefler, organizasyonunuzun kapsamındadır.
*   Doğru organizasyonda (org) oturum açtığınızdan emin olun.
*   Bu hedefe erişim izniniz olduğunu onaylayın.

#### "linkedTargetId Specified But Cloud Not Configured" Hatası
**Uyarı mesajı:** `linkedTargetId specified but cloud is not configured`

**Sorun:** Promptfoo Cloud'da oturum açmamış olmanız.

**Çözüm:**

```bash
promptfoo auth login
```
`linkedTargetId` yalnızca bulut özellikleri etkinleştirildiğinde çalışır.

### SSS (Sıkça Sorulan Sorular)

**S: `linkedTargetId`'yi yerleşik sağlayıcılarla (OpenAI, Anthropic vb.) kullanabilir miyim?**

Evet, `linkedTargetId` her türlü sağlayıcı türüyle çalışır. Ancak, sabit bir tanımlayıcıya sahip olmadıkları için en çok özel sağlayıcılar (Python, JavaScript, HTTP) için kullanışlıdır. Yerleşik sağlayıcılar (`openai:gpt-4` gibi) zaten tutarlı kimliklere (ID) sahiptir, bu nedenle manuel bağlamaya daha az ihtiyaç duyarlar.

**S: `linkedTargetId`'yi kullandıktan sonra kaldırırsam ne olur?**

Bir sonraki değerlendirme (eval), yeni bir hedef girişi oluşturur. Önceki sonuçlar ise bağlı hedef altında kalmaya devam eder.

**S: Farklı bir organizasyondaki hedefe bağlantı verebilir miyim?**

Hayır, hedefler organizasyon kapsamındadır. Yalnızca mevcut organizasyonunuzdaki hedeflere bağlantı verebilirsiniz.

**S: Her değerlendirme (eval) için yeni bir `linkedTargetId` mi gerekir?**

Hayır! Tüm değerlendirmelerinizde aynı `linkedTargetId`'yi kullanın. Zaten asıl amaç budur; sonuçları tek bir hedef altında birleştirmek.

### İlgili Dokümantasyon

*   [Python Sağlayıcıları (Python Providers)](https://promptfoo.dev)
*   [JavaScript Sağlayıcıları (JavaScript Providers)](https://promptfoo.dev)
*   [HTTP Sağlayıcıları (HTTP Providers)](https://promptfoo.dev)
*   [Kırmızı Takım Yapılandırması (Red Team Configuration)](https://promptfoo.dev)

