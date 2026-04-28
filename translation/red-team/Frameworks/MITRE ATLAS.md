# MITRE ATLAS

**MITRE ATLAS** (Adversarial Threat Landscape for Artificial-Intelligence Systems), makine öğrenmesi sistemlerine yönelik gerçek dünyada gözlemlenen saldırılara dayanan, saldırgan taktik ve tekniklerinden oluşan bir bilgi tabanıdır. **MITRE ATT&CK** çerçevesi model alınarak geliştirilen ATLAS, yapay zeka (AI) ve makine öğrenmesi (ML) sistemlerine özgü tehditleri anlamak ve bunlara karşı savunma yapmak için yapılandırılmış bir yol sunar.

ATLAS, saldırgan tekniklerini, bir saldırı sırasında saldırganın hedeflerini temsil eden "taktikler" şeklinde düzenler. LLM uygulamaları için bu taktikler, yapay zeka sistemi yaşam döngüsü boyunca potansiyel saldırı vektörlerinin belirlenmesine yardımcı olur.

## MITRE ATLAS Taktikleri
ATLAS, saldırgan ML tekniklerini şu taktikler altında toplar:

*   **Keşif (Reconnaissance):** ML sistemi hakkında bilgi toplama.
*   **Kaynak Geliştirme (Resource Development):** Hedeflemeyi desteklemek için kaynaklar oluşturma.
*   **İlk Erişim (Initial Access):** ML sistemine giriş sağlama.
*   **ML Saldırı Hazırlığı (ML Attack Staging):** ML modeline yönelik saldırıları hazırlama ve konumlandırma.
*   **Sızdırma (Exfiltration):** Veri veya model bilgilerini çalma.
*   **Etki (Impact):** ML sistemini bozma, performansını düşürme veya yok etme.

## MITRE ATLAS Tehditlerini Tarama
**Promptfoo**, kapsamlı "red teaming" çalışmaları aracılığıyla ATLAS ile uyumlu zafiyetlerin belirlenmesine yardımcı olur. Promptfoo arayüzü üzerinden ATLAS taramasını ayarlamak için MITRE ATLAS seçeneğini belirleyebilir veya doğrudan yapılandırabilirsiniz:

```yaml
redteam:
  plugins:
    - mitre:atlas
  strategies:
    - jailbreak
    - prompt-injection
```
## Veya belirli taktikleri hedefleyebilirsiniz:
```yaml
redteam:
  plugins:
    - mitre:atlas:reconnaissance
    - mitre:atlas:exfiltration
    - mitre:atlas:impact
```
### Keşif - Reconnaissance (mitre:atlas:reconnaissance)

**Keşif (Reconnaissance)**, saldırganların sonraki saldırıları planlamak amacıyla ML sistemi hakkında bilgi toplamasını içerir. LLM uygulamaları için bu; sistem yeteneklerini keşfetmeyi, sistem komutlarını (prompts) ele geçirmeyi, erişim kontrollerini anlamayı ve rekabetçi istihbarat toplamayı kapsar.

#### Tehdit Ortamı
Saldırganlar keşif taktiğini şu amaçlarla kullanır:

*   Kullanılabilir fonksiyonları ve araçları keşfetmek.
*   Sistem komutlarını (system prompts) ve talimatları dışarı sızdırmak.
*   Rol tabanlı erişim kontrollerini (RBAC) haritalandırmak.
*   Rekabet avantajlarını veya tescilli yaklaşımları belirlemek.
*   Veri kaynaklarını ve bilgi tabanlarını anlamak.

#### Test Stratejisi
Keşif zafiyetlerini test etmek için:

*   **Competitors (Rakipler):** Sistemin rakip bilgilerini ifşa etmediğini doğrular.
*   **Policy (Politika):** Dahili politikaların ve iş kurallarının açıklanmadığını test eder.
*   **Prompt Extraction (Komut Çıkarma):** Sistem komutlarının dışarı sızdırılamayacağından emin olur.
*   **RBAC:** Rol sınırlarının kolayca numaralandırılamayacağını doğrular.

**Örnek yapılandırma:**

```yaml
redteam:
  language: ['tr', 'en', 'es'] # Birden fazla dilde test et
  plugins:
    - competitors
    - policy
    - prompt-extraction
    - rbac
  strategies:
    - jailbreak
```
Veya ATLAS kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - mitre:atlas:reconnaissance
```
### Kaynak Geliştirme - Resource Development (mitre:atlas:resource-development)

**Kaynak Geliştirme (Resource Development)**, saldırganların hedefleme faaliyetlerini desteklemek amacıyla kaynak oluşturması, satın alması veya ele geçirmesi sürecini kapsar. Bu; kötü niyetli komutlar geliştirmeyi, araçlar edinmeyi veya ML sistemlerine saldırı başlatmak için altyapı sağlamayı içerir.

#### Tehdit Ortamı
Saldırganlar şu amaçlarla kaynak geliştirir:

*   Zararlı içerik üretme talepleri oluşturmak.
*   Yasa dışı faaliyetler için özel komutlar (prompts) geliştirmek.
*   Silah veya tehlikeli maddeler üretmek için araçlar inşa etmek.

#### Test Stratejisi
Kaynak geliştirme saldırılarına karşı hassasiyeti test etmek için:

*   **Cybercrime (Siber Suç):** Sistemin kötü niyetli faaliyetlere yardımcı olmadığını doğrular.
*   **Illegal Drugs (Yasa Dışı İlaçlar/Uyuşturucular):** Sistemin uyuşturucuyla ilgili talepleri reddettiğinden emin olur.
*   **Indiscriminate Weapons (Ayrım Gözetmeyen Silahlar):** Silah yapımıyla ilgili taleplerin engellendiğini test eder.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - harmful:cybercrime
    - harmful:illegal-drugs
    - harmful:indiscriminate-weapons
```
Veya ATLAS kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - mitre:atlas:resource-development
```
### İlk Erişim - Initial Access (mitre:atlas:initial-access)

**İlk Erişim (Initial Access)**, saldırganların ML sisteminde ilk dayanak noktasını elde etmek için kullandıkları tekniklerden oluşur. LLM uygulamaları için bu süreç genellikle girdi doğrulama zayıflıklarından yararlanmayı veya güvenlik kontrollerini atlatmak için komut enjeksiyonu (prompt injection) kullanmayı içerir.

#### Tehdit Ortamı
Saldırganlar şu yollarla ilk erişim sağlar:

*   SQL enjeksiyonu ve shell (komut satırı) enjeksiyonu saldırıları.
*   Sunucu tarafı istek sahteciliği (SSRF).
*   Hata ayıklama (debug) erişim uç noktaları.
*   Siber suç teknikleri.
*   Komut enjeksiyonu ve gizleme (obfuscation) yöntemleri.

#### Test Stratejisi
İlk erişim zafiyetlerini test etmek için:

*   **Debug Access:** Hata ayıklama uç noktalarının dışarı kapalı olduğunu doğrular.
*   **Cybercrime:** Yetkisiz erişim tekniklerine yardımcı olunup olunmadığını test eder.
*   **Shell Injection:** Komutların yürütülemediğinden emin olur.
*   **SQL Injection:** Veritabanı sorgularının manipüle edilemediğini doğrular.
*   **SSRF:** Sistemin yetkisiz istekler yapmadığını test eder.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - debug-access
    - harmful:cybercrime
    - shell-injection
    - sql-injection
    - ssrf
  strategies:
    - base64
    - jailbreak
    - leetspeak
    - prompt-injection
    - rot13
```
Veya ATLAS kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - mitre:atlas:initial-access
```
### ML Saldırı Hazırlığı - ML Attack Staging (mitre:atlas:ml-attack-staging)

**ML Saldırı Hazırlığı (ML Attack Staging)**, saldırganların doğrudan ML modelinin kendisine karşı saldırılar hazırlamak ve konumlandırmak için kullandıkları teknikleri içerir. Bu süreç; girdileri zehirlemeyi, model davranışını manipüle etmeyi ve ML'e özgü zafiyetlerden yararlanmayı kapsar.

#### Tehdit Ortamı
Saldırganlar ML'e özgü saldırıları şu yollarla hazırlar:

*   Dolaylı yollarla saldırgan içerikler enjekte etmek.
*   Kodlama (encoding) kullanarak kötü niyetli talimatları gizlice sızdırmak (smuggling).
*   Aşırı yetki (excessive agency) senaryoları oluşturmak.
*   İstismar amacıyla halüsinasyonları tetiklemek.
*   Modeli kademeli olarak ele geçirmek için çok turlu (multi-turn) saldırılar kullanmak.

#### Test Stratejisi
ML saldırı hazırlığı zafiyetlerini test etmek için:

*   **ASCII Smuggling:** Gizli talimatların filtreleri atlatıp atlatamadığını doğrular.
*   **Excessive Agency (Aşırı Yetki):** Modelin amaçlanan yeteneklerini aşmadığını test eder.
*   **Hallucination (Halüsinasyon):** Yanlış bilgilerin bir silaha dönüştürülemediğinden emin olur.
*   **Indirect Prompt Injection:** Zehirlenmiş bağlamlara (context) karşı hassasiyeti kontrol eder.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - ascii-smuggling
    - excessive-agency
    - hallucination
    - indirect-prompt-injection
  strategies:
    - jailbreak
    - jailbreak:tree
```
Veya ATLAS kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - mitre:atlas:ml-attack-staging
```
### Sızdırma - Exfiltration (mitre:atlas:exfiltration)

**Sızdırma (Exfiltration)**, saldırganların ML sisteminden kişisel veriler (PII), eğitim verileri, tescilli komutlar veya diğer hassas bilgileri çalmak için kullandıkları teknikleri içerir.

#### Tehdit Ortamı
Saldırganlar bilgileri şu yollarla sızdırır:

*   Eğitim verilerinden veya bağlamdan (context) kişisel verileri (PII) çıkarmak.
*   Sistem komutlarını (prompts) ve talimatlarını çalmak.
*   Yetkisiz veritabanlarına veya API'lere erişmek.
*   Kullanıcı oturumları arasında bilgi sızdırmak.
*   Veri kaybı önleme (DLP) sistemlerini atlatmak için kodlama (encoding) kullanmak.

#### Test Stratejisi
Sızdırma zafiyetlerini test etmek için:

*   **ASCII Smuggling:** Verilerin kodlama kullanılarak sızdırılamayacağını doğrular.
*   **Privacy (Gizlilik):** Hassas bilgilerin yetkisiz ifşasını test eder.
*   **Indirect Prompt Injection:** Zehirlenmiş girdiler üzerinden veri sızdırma riskini kontrol eder.
*   **PII Eklentileri:** Kişisel veri sızıntılarını kapsamlı bir şekilde test eder.
*   **Prompt Extraction:** Sistem komutlarının dışarı çıkarılamayacağından emin olur.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - ascii-smuggling
    - harmful:privacy
    - indirect-prompt-injection
    - pii:api-db
    - pii:direct
    - pii:session
    - pii:social
    - prompt-extraction
```
Veya ATLAS kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - mitre:atlas:exfiltration
```
### Etki - Impact (mitre:atlas:impact)

**Etki (Impact)**, saldırganların ML sistemini bozmak, performansını düşürmek, yok etmek veya çıktılarını manipüle etmek için kullandıkları tekniklerden oluşur. LLM uygulamaları için bu; sistemin amacını saptırmayı, zararlı içerik üretmeyi, başkalarını taklit etmesini sağlamayı veya yetki dışı işlemler gerçekleştirmeyi içerir.

#### Tehdit Ortamı
Saldırganlar şu yollarla etki yaratır:

*   Yapay zekanın kullanım amacını saptırmak (hijacking).
*   Zararlı veya uygunsuz içerik üretmek.
*   Markaları veya bireyleri taklit etmek (impersonation).
*   Sistemin yetkisiz işlemler yapmasına neden olmak.
*   Karmaşık ve çok turlu (multi-turn) saldırılar kullanmak.

#### Test Stratejisi
Etki zafiyetlerini test etmek için:

*   **Excessive Agency (Aşırı Yetki):** Sistemin yetkisiz işlemler yapmadığını doğrular.
*   **Harmful Content (Zararlı İçerik):** Tehlikeli veya saldırgan içerik üretimine karşı test eder.
*   **Hijacking (Saptırma):** Sistemin kullanım amacını koruduğundan emin olur.
*   **Imitation (Taklit):** Sistemin kişi veya markaları taklit etmediğini doğrular.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - excessive-agency
    - harmful
    - hijacking
    - imitation
  strategies:
    - crescendo
```
Veya ATLAS kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - mitre:atlas:impact
```
## Kapsamlı MITRE ATLAS Testi

Tüm taktikler genelinde tam bir MITRE ATLAS tehdit kapsamı sağlamak için:

```yaml
redteam:
  language: ['tr', 'en', 'es'] # Birden fazla dilde test et
  plugins:
    - mitre:atlas
  strategies:
    - jailbreak
    - prompt-injection
    - base64
    - rot13
```
Bu yapılandırma, yapay zeka sisteminizi tüm MITRE ATLAS taktiklerine karşı test ederek kapsamlı bir saldırgan tehdit değerlendirmesi sağlar.
## MITRE ATLAS vs MITRE ATT&CK
MITRE ATT&CK geleneksel BT sistemlerine odaklanırken, MITRE ATLAS bu çerçeveyi ML'e (Makine Öğrenmesi) özgü tehditleri ele alacak şekilde genişletir:


| Özellik | MITRE ATT&CK | MITRE ATLAS |
| :--- | :--- | :--- |
| **Odak Noktası** | BT sistemleri, ağlar | ML sistemleri, Yapay Zeka modelleri |
| **Teknikler** | Geleneksel siber saldırılar | ML'e özgü saldırılar |
| **Hedefler** | Sunucular, uç noktalar | Modeller, eğitim verileri |
| **Örnek** | Kimlik bilgisi sızdırma (Credential dumping) | Model tersine çevirme (Model inversion) |

LLM uygulamaları için her iki çerçeve de birbiriyle ilişkilidir:

*   ML'e özgü zafiyetler (model çıkarma, komut enjeksiyonu) için **ATLAS**'ı kullanın.
*   Altyapı güvenliği (API güvenliği, kimlik doğrulama) için **ATT&CK** prensiplerini kullanın.
## Diğer Çerçevelerle Entegrasyon

MITRE ATLAS, diğer güvenlik çerçevelerini tamamlayıcı niteliktedir:

*   **OWASP LLM Top 10:** ATLAS taktiklerini belirli LLM zafiyetleriyle eşleştirir.
*   **NIST AI RMF:** ATLAS, NIST'in risk ölçümleri için taktiksel detaylar sağlar.
*   **ISO 42001:** ATLAS taktikleri, güvenlik ve sağlamlık gereksinimleri hakkında bilgi verir.
*   **GDPR:** Sızdırma (exfiltration) taktikleri, veri koruma gereksinimleriyle doğrudan ilişkilidir.

ATLAS testlerini diğer çerçevelerle birleştirebilirsiniz:

```yaml
redteam:
  plugins:
    - mitre:atlas
    - owasp:llm
    - nist:ai:measure
  strategies:
    - jailbreak
    - prompt-injection
```
## ATLAS Tabanlı Red Teaming İçin En İyi Uygulamalar

LLM red teaming çalışmalarında MITRE ATLAS kullanırken şu noktalara dikkat edilmelidir:

*   **Saldırı Yaşam Döngüsü:** Sadece ilk erişim veya etki aşamalarını değil, tüm taktikleri test edin.
*   **Derinlemesine Savunma:** Saldırı zincirinin birden fazla aşamasındaki zafiyetleri ele alın.
*   **Gerçekçi Senaryolar:** Taktikleri, saldırganların gerçek saldırılarda yapacağı gibi birleştirerek kullanın.
*   **Sürekli Test:** Yeni ATLAS teknikleri belgelendikçe düzenli olarak testler yapın.
*   **Tehdit İstihbaratı:** ATLAS'ta belgelenen gerçek dünya saldırıları hakkında güncel kalın.
*   **Purple Teaming:** ATLAS'ı, "red" (saldırı) ve "blue" (savunma) ekipleri arasında ortak bir dil olarak kullanın.

## LLM'ler İçin Gerçek Dünyadan ATLAS Teknikleri

MITRE ATLAS, ML sistemlerine yönelik gerçek dünya saldırılarını belgeler. LLM'ler için bazı örnekler şunlardır:

*   **AML.T0043 - Saldırgan Veri Oluşturma:** Zararlı çıktılar elde etmek için tasarlanmış komutlar oluşturma.
*   **AML.T0051 - LLM Komut Enjeksiyonu:** Hazırlanmış girdilerle LLM davranışını manipüle etme.
*   **AML.T0024 - ML Çıkarım API'si Üzerinden Sızdırma:** Sorgular yoluyla eğitim verilerini dışarı çıkarma.
*   **AML.T0020 - Eğitim Verilerini Zehirleme:** İnce ayar (fine-tuning) veya RAG veri kaynaklarını manipüle etme.

Promptfoo eklentileri bu spesifik ATLAS teknikleriyle eşleşerek hedef odaklı testler yapmanıza olanak tanır.

## Sırada Ne Var?
MITRE ATLAS, tehdit ortamı geliştikçe yeni tekniklerle aktif olarak güncellenmektedir. **Promptfoo** ile yapılan düzenli testler, LLM uygulamalarınızın belgelenmiş saldırgan ML taktiklerine karşı korunmasını sağlar.

Kapsamlı bir yapay zeka red teaming kurulumu hakkında daha fazla bilgi edinmek için **LLM Red Teaming'e Giriş** ve **Yapılandırma Detayları** bölümlerine bakabilirsiniz.

## Ek Kaynaklar
*   [MITRE ATLAS Resmi Web Sitesi](https://mitre.org)
*   [ATLAS Matris Gezgini (Matrix Navigator)](https://mitre.orgmatrix/)
*   [ATLAS Örnek Olay İncelemeleri (Case Studies)](https://mitre.orgstudies/)
*   [ATLAS Taktiklerine Genel Bakış](https://mitre.orgtactics/)

