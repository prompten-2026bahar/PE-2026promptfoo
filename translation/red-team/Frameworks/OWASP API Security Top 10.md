# OWASP API Güvenliği İlk 10 (Top 10)

OWASP API Güvenliği İlk 10, API'lere yönelik en kritik güvenlik risklerini tanımlayan bir farkındalık belgesidir. Geleneksel olarak REST ve GraphQL API'lerine odaklanmış olsa da, bu zafiyetler; veritabanları, harici servisler ve iç sistemlerle etkileşime giren akıllı API katmanları olarak işlev gören **LLM (Büyük Dil Modeli)** uygulamaları için giderek daha önemli hale gelmektedir.

Fonksiyon çağırma (function calling), araç kullanımı veya ajan mimarileri kullanan LLM uygulamaları, kullanıcılar ile arka uç sistemleri arasında dinamik bir arayüz görevi gördükleri için API güvenlik sorunlarına karşı özellikle hassastır.

## LLM Uygulamaları İçin API Güvenlik Riskleri
Güncel OWASP API Güvenliği İlk 10 (2023) listesi şunları içerir:

*   **API1: Bozuk Nesne Düzeyinde Yetkilendirme** (Broken Object Level Authorization)
*   **API2: Bozuk Kimlik Doğrulama** (Broken Authentication)
*   **API3: Bozuk Nesne Özelliği Düzeyinde Yetkilendirme** (Broken Object Property Level Authorization)
*   **API4: Kısıtlanmamış Kaynak Tüketimi** (Unrestricted Resource Consumption)
*   **API5: Bozuk Fonksiyon Düzeyinde Yetkilendirme** (Broken Function Level Authorization)
*   **API6: Hassas İş Akışlarına Sınırsız Erişim** (Unrestricted Access to Sensitive Business Flows)
*   **API7: Sunucu Tarafı İstek Sahteciliği (SSRF)** (Server Side Request Forgery)
*   **API8: Güvenlik Yanlış Yapılandırması** (Security Misconfiguration)
*   **API9: Uygunsuz Envanter Yönetimi** (Improper Inventory Management)
*   **API10: API'lerin Güvensiz Tüketimi** (Unsafe Consumption of APIs)

## LLM'ler İçin API Güvenliği Neden Önemlidir?
API erişimi olan LLM uygulamaları benzersiz güvenlik zorlukları yaratır:

1.  **Doğal Dil Arayüzü:** Kullanıcılar, sohbet komutları (prompts) aracılığıyla API çağrılarını manipüle edebilir.
2.  **Araç Çağırma:** LLM'ler, kullanıcı girdisine bağlı olarak fonksiyonları ve API'leri otonom olarak tetikleyebilir.
3.  **Karmaşık Yetkilendirme:** Geleneksel API yetkilendirme yöntemleri, LLM aracılı erişimi tam olarak kapsamayabilir.
4.  **Dolaylı Saldırılar:** Saldırganlar, API etkileşimlerini manipüle etmek için "prompt injection" (komut enjeksiyonu) yöntemini kullanabilir.

## OWASP API Güvenlik Risklerini Tarama
**Promptfoo**, "red teaming" çalışmaları aracılığıyla LLM uygulamalarındaki API güvenlik zafiyetlerini belirlemeye yardımcı olur:

```yaml
redteam:
  plugins:
    - owasp:api
  strategies:
    - jailbreak
    - prompt-injection
```
## Veya belirli API risklerini hedefleyebilirsiniz:
```yaml
redteam:
  plugins:
    - owasp:api:01 # Bozuk Nesne Düzeyinde Yetkilendirme
    - owasp:api:05 # Bozuk Fonksiyon Düzeyinde Yetkilendirme
    - owasp:api:07 # Sunucu Tarafı İstek Sahteciliği (SSRF)
```
### API1: Bozuk Nesne Düzeyinde Yetkilendirme (owasp:api:01)

**Bozuk Nesne Düzeyinde Yetkilendirme (BOLA)**, aynı zamanda **Güvensiz Doğrudan Nesne Referansı (IDOR)** olarak da bilinir. Bir uygulamanın, bir kullanıcının belirli bir nesneye erişme yetkisi olup olmadığını uygun şekilde doğrulayamadığı durumlarda ortaya çıkar. Bu, en yaygın ve en etkili API zafiyetidir.

#### LLM Bağlamı
LLM uygulamalarında BOLA zafiyetleri şu durumlarda oluşur:

*   Kullanıcıların, diğer kullanıcıların verilerine erişmek için LLM'i manipüle edebilmesi.
*   LLM'in, uygun yetkilendirme kontrolleri olmadan nesnelere erişmesi.
*   Komut enjeksiyonunun (Prompt injection) erişim kontrol mantığını atlatması.

#### Test Stratejisi
BOLA zafiyetlerini test etmek için:

*   **BOLA eklentisi:** Yetkisiz nesne erişimini sistematik olarak test eder.
*   **RBAC (Rol Tabanlı Erişim Kontrolü):** Rol tabanlı erişim kontrollerinin uygulandığını doğrular.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - bola
    - rbac
```
## Veya OWASP API kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - owasp:api:01
```
### API2: Bozuk Kimlik Doğrulama (owasp:api:02)

**Bozuk Kimlik Doğrulama (Broken Authentication)** zafiyetleri, saldırganların kimlik doğrulama belirteçlerini (tokens) ele geçirmesine veya diğer kullanıcıların kimliğine bürünmek için uygulama hatalarından faydalanmasına olanak tanır.

#### LLM Bağlamı
Kimlik doğrulama sorunları olan LLM uygulamalarında şu durumlar görülebilir:

*   Kullanıcı kimliğinin uygun şekilde doğrulanamaması.
*   Komut manipülasyonu (prompt manipulation) yoluyla oturum çalmaya (session hijacking) izin verilmesi.
*   Rol tabanlı erişimin (RBAC) yanlış yapılandırılması.
*   Kimlik doğrulama belirteçlerinin veya parolanın (credentials) dışarı sızdırılması.

#### Test Stratejisi
Kimlik doğrulama zafiyetlerini test etmek için:

*   **BFLA:** Fonksiyon düzeyindeki yetkilendirme atlatmalarını test eder.
*   **RBAC:** Kimlik doğrulama ve rol uygulama süreçlerini doğrular.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - bfla
    - rbac
```
## Veya OWASP API kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - owasp:api:02
```
### API3: Bozuk Nesne Özelliği Düzeyinde Yetkilendirme (owasp:api:03)

Bu zafiyet, **aşırı veri ifşası** (excessive data exposure) ve **toplu atama** (mass assignment) risklerini birleştirir. Bir API'nin gereğinden fazla veri döndürdüğü veya kullanıcıların erişmemeleri gereken nesne özelliklerini değiştirmesine izin verdiği durumlarda ortaya çıkar.

#### LLM Bağlamı
LLM uygulamalarında bu durum şu şekillerde kendini gösterir:

*   **Veri Paylaşımı:** LLM yanıtlarında verilerin aşırı paylaşılması.
*   **Aşırı Yetki:** Sistem özelliklerini değiştirme konusunda LLM'e gereğinden fazla yetki (excessive agency) verilmesi.
*   **Filtreleme Hatası:** Hassas nesne özelliklerinin filtrelenmesinde başarısız olunması.

#### Test Stratejisi
Nesne özelliği düzeyindeki yetkilendirme sorunlarını test etmek için:

*   **Excessive Agency (Aşırı Yetki):** Yetkisiz değişiklikleri test eder.
*   **Overreliance (Aşırı Güven):** Geçersiz özellik değişikliklerinin kabul edilip edilmediğini kontrol eder.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - excessive-agency
    - overreliance
```
## Veya OWASP API kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - owasp:api:03
```
### API4: Kısıtlanmamış Kaynak Tüketimi (owasp:api:04)

Eskiden "Kaynak Eksikliği ve Hız Sınırlama" (Lack of Resources & Rate Limiting) olarak bilinen bu zafiyet, API'lerin kaynak tüketimini uygun şekilde kısıtlamadığı durumlarda ortaya çıkar ve hizmet dışı kalma (DoS) veya aşırı maliyetlere yol açar.

#### LLM Bağlamı
LLM uygulamaları, kaynak tükenmesine karşı özellikle hassastır:

*   **Maliyetli API Çağrıları:** Kullanıcı komutları (prompts) tarafından tetiklenen yüksek maliyetli API çağrıları.
*   **Sınırsız Bağlam Penceresi:** Bağlam penceresinin (context window) sınırsız veya aşırı kullanımı.
*   **Veritabanı Sorguları:** Gereğinden fazla veya karmaşık veritabanı sorgularının tetiklenmesi.
*   **Oturum Kalıcılığı:** Oturum kalıcılığı üzerinden veri sızıntıları veya kaynak israfı.

#### Test Stratejisi
Kaynak tüketimi zafiyetlerini test etmek için:

*   **Privacy (Gizlilik):** Veri kalıcılığı (persistence) sorunlarını test eder.
*   **PII Eklentileri:** İstekler arasında kişisel verilerin (PII) sızdırılıp sızdırılmadığını kontrol eder.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - harmful:privacy
    - pii:api-db
    - pii:session
```
## Veya OWASP API kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - owasp:api:04
```
### API5: Bozuk Fonksiyon Düzeyinde Yetkilendirme (owasp:api:05)

**Bozuk Fonksiyon Düzeyinde Yetkilendirme (BFLA)**, bir uygulamanın fonksiyon düzeyindeki erişim kontrollerini düzgün şekilde uygulamadığı ve kullanıcıların yönetici düzeyinde veya ayrıcalıklı işlemler gerçekleştirmesine izin verdiği durumlarda ortaya çıkar.

#### LLM Bağlamı
Araç çağırma (tool calling) veya fonksiyon yürütme özelliklerine sahip LLM uygulamalarında:

*   **Ayrıcalıklı Fonksiyonlar:** Kullanıcılar, komutlar (prompts) aracılığıyla yetkili fonksiyonları tetikleyebilir.
*   **Yetkisiz Yönetim:** LLM, yetkilendirme olmaksızın idari işlemleri gerçekleştirebilir.
*   **Rol Sınırları:** Kullanıcı rolleri arasındaki sınırların düzgün şekilde korunmaması.

#### Test Stratejisi
Fonksiyon düzeyindeki yetkilendirme sorunlarını test etmek için:

*   **BFLA:** Fonksiyon yetkilendirmesini sistematik olarak test eder.
*   **BOLA:** Fonksiyon erişimiyle birlikte nesne düzeyindeki yetkilendirmeyi test eder.
*   **RBAC:** Rol tabanlı fonksiyon erişim kontrollerini doğrular.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - bfla
    - bola
    - rbac
```
## Veya OWASP API kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - owasp:api:05
```
### API6: Hassas İş Akışlarına Sınırsız Erişim (owasp:api:06)

Bu zafiyet, API'lerin hassas iş akışlarını uygun kontroller olmadan dışarı açması ve saldırganların kritik işlevleri kötüye kullanmasına izin vermesi durumunda ortaya çıkar.

#### LLM Bağlamı
LLM uygulamaları, hassas akışları şu yollarla ifşa edebilir:

*   **İş Süreçlerinin Manipülasyonu:** Doğal dil yoluyla iş süreçlerinin yönlendirilmesi.
*   **Yanlış Bilgilendirme:** İş kuralları veya iş akışları hakkında yanıltıcı bilgi üretilmesi.
*   **Kritik Akışlarda Aşırı Güven:** Kritik iş akışlarında LLM kararlarına aşırı derecede güvenilmesi.

#### Test Stratejisi
İş akışı zafiyetlerini test etmek için:

*   **Misinformation (Yanlış Bilgilendirme):** İş mantığının manipüle edilmesini test eder.
*   **Overreliance (Aşırı Güven):** LLM çıktılarına duyulan körü körüne güveni kontrol eder.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - harmful:misinformation-disinformation
    - overreliance
```
## Veya OWASP API kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - owasp:api:06
```
### API7: Sunucu Tarafı İstek Sahteciliği - SSRF (owasp:api:07)

**SSRF zafiyetleri**, bir API'nin kullanıcı tarafından sağlanan URL'yi doğrulamadan uzak bir kaynağı getirmesi durumunda ortaya çıkar. Bu durum, saldırganların iç sistemlere erişmesine veya yetkisiz işlemler gerçekleştirmesine olanak tanır.

#### LLM Bağlamı
LLM uygulamaları SSRF'e karşı özellikle hassastır:

*   **Yetkisiz İstekler:** LLM'ler kandırılarak yetkisiz ağ istekleri yapmaya zorlanabilir.
*   **Fonksiyon Çağırma:** Fonksiyon çağırma (function calling) özellikleri SSRF vektörlerini açığa çıkarabilir.
*   **Parametre Manipülasyonu:** Komut enjeksiyonu (prompt injection) ile URL parametreleri manipüle edebilir.

#### Test Stratejisi
SSRF ve enjeksiyon zafiyetlerini test etmek için:

*   **Shell Injection:** Komut yürütme (command execution) açıklarını test eder.
*   **SQL Injection:** Veritabanı manipülasyonu açıklarını test eder.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - shell-injection
    - sql-injection
```
## Veya OWASP API kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - owasp:api:07
```
### API8: Güvenlik Yanlış Yapılandırması (owasp:api:08)

Güvenlik yanlış yapılandırması; hatalı güvenlik ayarları, varsayılan yapılandırmalar, çok fazla ayrıntı içeren (verbose) hata mesajları ve eksik güvenlik yamalarını kapsayan geniş bir kategoridir.

#### LLM Bağlamı
LLM uygulamalarında yaygın olarak görülen yanlış yapılandırmalar şunlardır:

*   **Hata Ayıklama Bilgileri:** Dışarı sızdırılan debugging (hata ayıklama) bilgileri.
*   **Gevşek Erişim Kontrolü:** Gereğinden fazla izin verilmiş API erişimleri.
*   **Sistem Komutları (System Prompts):** Sistem komutlarının veya yapılandırma dosyalarının dışarı sızması.
*   **Gizlilik Ayarları:** Yanlış yapılandırılmış gizlilik ve veri koruma ayarları.

#### Test Stratejisi
Yanlış yapılandırma sorunlarını test etmek için:

*   **Privacy (Gizlilik):** Yanlış yapılandırmalar nedeniyle oluşan veri ifşalarını test eder.
*   **PII Eklentileri:** İstem dışı gerçekleşen kişisel veri sızıntılarını kontrol eder.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - harmful:privacy
    - pii:api-db
    - pii:session
```
## Veya OWASP API kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - owasp:api:08
```
### API9: Uygunsuz Envanter Yönetimi (owasp:api:09)

Bu zafiyet, kuruluşların API uç noktaları (endpoints), sürümleri ve entegrasyonları konusunda düzgün bir dokümantasyon ve envantere sahip olmaması durumunda ortaya çıkar. Bu durum, yamalanmamış veya kullanımdan kaldırılmış API'lerin erişilebilir kalmasına neden olur.

#### LLM Bağlamı
Zayıf envanter yönetimine sahip LLM uygulamalarında şu sorunlar görülür:

*   **Belgelenmemiş Fonksiyonlar:** Dokümantasyonu yapılmamış fonksiyon çağrılarının veya araçların dışarı açılması.
*   **Kapsam Dışı Tavsiyeler:** Modelin, amaçlanan kapsamın dışında uzmanlık gerektiren tavsiyeler vermesi.
*   **Sistem Yetenekleri:** Sistemin gerçek yetenekleri hakkında yanlış varsayımlarda bulunulması.

#### Test Stratejisi
Envanter yönetimi sorunlarını test etmek için:

*   **Specialized Advice (Uzmanlık Tavsiyesi):** Kapsam dışı uzmanlık alanlarını test eder.
*   **Overreliance (Aşırı Güven):** Doğrulanmamış yetenekleri ve bunlara duyulan güveni kontrol eder.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - harmful:specialized-advice
    - overreliance
```
## Veya OWASP API kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - owasp:api:09
```
### API10: API'lerin Güvensiz Tüketimi (owasp:api:10)

Bu zafiyet, uygulamaların üçüncü taraf API'lerden gelen verilere uygun bir doğrulama yapmadan güvenmesi durumunda ortaya çıkar. Bu durum, ele geçirilmiş veya kötü niyetli API yanıtları üzerinden çeşitli saldırılara yol açabilir.

#### LLM Bağlamı
Harici API'leri tüketen LLM uygulamaları şu risklerle karşı karşıyadır:

*   **Güvensiz Veri Kullanımı:** Yanıtlarda güvenilmeyen verilerin kullanılması.
*   **Hata Ayıklama Sızıntısı:** Harici API'lerden gelen hata ayıklama (debug) bilgilerinin dışarı sızdırılması.
*   **Gizlilik İhlali:** Harici kaynaklardan gelen gizli bilgilerin sızdırılması.

#### Test Stratejisi
Güvensiz API tüketimini test etmek için:

*   **Debug Access (Hata Ayıklama Erişimi):** Dışarı sızan hata ayıklama bilgilerini test eder.
*   **Privacy (Gizlilik):** Harici kaynaklardan gelen veri sızıntılarını test eder.

**Örnek yapılandırma:**

```yaml
redteam:
  plugins:
    - debug-access
    - harmful:privacy
```
Veya OWASP API kısayolunu kullanın:
```yaml
redteam:
  plugins:
    - owasp:api:10
```
## Kapsamlı OWASP API Güvenlik Testi

OWASP API Güvenliği İlk 10 listesinin tamamını kapsayan bir test için şu yapılandırmayı kullanabilirsiniz:

```yaml
redteam:
  plugins:
    - owasp:api
  strategies:
    - jailbreak
    - prompt-injection
```
Bu yapılandırma, LLM uygulamanızı tüm OWASP API Güvenliği İlk 10 riskine karşı sistematik olarak test eder.
## OWASP LLM İlk 10 (Top 10) ile Entegrasyon
OWASP API Güvenliği İlk 10 ve OWASP LLM İlk 10 çerçeveleri birbirini tamamlayıcı niteliktedir:


| API Güvenlik Riski | İlgili LLM Riski |
| :--- | :--- |
| **API1:** Bozuk Nesne Düzeyinde Yetkilendirme (BOLA) | **LLM06:** Aşırı Yetki (Excessive Agency) |
| **API5:** Bozuk Fonksiyon Düzeyinde Yetkilendirme (BFLA) | **LLM06:** Aşırı Yetki (Excessive Agency) |
| **API7:** Sunucu Tarafı İstek Sahteciliği (SSRF) | **LLM05:** Uygunsuz Çıktı İşleme |
| **API8:** Güvenlik Yanlış Yapılandırması | **LLM02:** Hassas Bilgilerin İfşası |

Her iki çerçeveyi birlikte test etmek için:

```yaml
redteam:
  plugins:
    - owasp:api
    - owasp:llm
  strategies:
    - jailbreak
    - prompt-injection
```
## LLM'e Özgü API Güvenliği Zorlukları

LLM uygulamaları, API güvenliği konusunda kendine has bazı değerlendirmeleri beraberinde getirir:

### Bir Saldırı Vektörü Olarak Doğal Dil
Geleneksel API'ler yapılandırılmış girdileri (JSON, XML) doğrular; ancak LLM'lerin doğal dili kabul etmesi, girdi doğrulama (input validation) süreçlerini çok daha karmaşık hale getirir.

### Otonom Araç Kullanımı
LLM'ler birden fazla API çağrısını otonom olarak zincirleme şekilde gerçekleştirebilir. Bu durum, geleneksel API'lerin karşılaşmadığı yetkilendirme zorlukları yaratır.

### Bağlama Dayalı Yetkilendirme
Yetkilendirme kararları konuşma geçmişine bağlı olabilir, bu da oturum yönetimini kritik bir hale getirir.

### Dolaylı Enjeksiyon Saldırıları
Saldırganlar, API'ye doğrudan erişim sağlamadan "prompt injection" (komut enjeksiyonu) yoluyla API çağrılarını manipüle edebilirler.

## En İyi Uygulamalar (Best Practices)
LLM uygulamalarını API zafiyetlerine karşı korurken şunlara dikkat edilmelidir:

*   **Derinlemesine Savunma:** Yetkilendirmeyi hem LLM hem de API katmanlarında uygulayın.
*   **En Az Ayrıcalık İlkesi:** LLM erişimini yalnızca gerekli API'ler ve fonksiyonlarla sınırlandırın.
*   **Girdi Doğrulaması:** LLM çıktılarını API'lere iletmeden önce mutlaka doğrulayın.
*   **Hız Sınırlama (Rate Limiting):** Hem token bazlı hem de API çağrısı bazlı hız sınırları uygulayın.
*   **İzleme (Monitoring):** LLM tarafından başlatılan API çağrılarını günlüğe kaydedin (log) ve izleyin.
*   **Test Etme:** Hem doğrudan API çağrıları hem de LLM aracılı erişim ile düzenli testler yapın.

## Sırada Ne Var?
Yeni saldırı modelleri ortaya çıktıkça, LLM uygulamaları için API güvenliği gelişen bir alan olmaya devam edecektir. **Promptfoo** ile yapılacak düzenli testler, LLM uygulamalarınızın güçlü bir API güvenliği duruşuna sahip olmasını sağlar.

Kapsamlı bir AI "red teaming" kurulumu hakkında daha fazla bilgi edinmek için **LLM Red Teaming'e Giriş** ve **Yapılandırma Detayları** bölümlerine göz atın.

## Ek Kaynaklar
*   OWASP API Güvenlik Projesi
*   OWASP API Güvenliği İlk 10 (2023)
*   API Güvenliği En İyi Uygulamaları
