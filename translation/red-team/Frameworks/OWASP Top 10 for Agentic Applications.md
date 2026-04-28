### Ajan Tabanlı Uygulamalar İçin OWASP Top 10
Ajan Tabanlı Uygulamalar için OWASP Top 10 (OWASP Top 10 for Agentic Applications), Black Hat Europe 2025 ve OWASP Agentic Security Summit sırasında duyurulmuştur. Bu liste, yapay zeka ajanı uygulamaları için en kritik güvenlik risklerini temsil eder.

Geleneksel LLM uygulamalarının aksine, ajan tabanlı (agentic) sistemler aşağıdaki özellikleri nedeniyle benzersiz güvenlik zorlukları sunar:

*   **Otonom Karar Verme:** Ajanlar, hedeflere ulaşmak için adımları bağımsız olarak belirler.
*   **Kalıcı Bellek:** Oturumlar arasında hem kısa vadeli hem de uzun vadeli bellek kullanımı.
*   **Araç ve API Erişimi:** Harici sistemlerle doğrudan etkileşim.
*   **Çoklu Ajan Koordinasyonu:** Karmaşık ajanlar arası iletişim ve yetkilendirme/delege etme süreçleri.
### En Kritik 10 Risk (The Top 10 Risks)


| ID | Risk Adı | Açıklama |
| :--- | :--- | :--- |
| **ASI01** | **Ajan Hedef Ele Geçirme** (Agent Goal Hijack) | Saldırganlar, kötü niyetli içerik yoluyla ajan hedeflerini değiştirir. |
| **ASI02** | **Araç Kötüye Kullanımı ve İstismar** (Tool Misuse) | Ajanların meşru araçları güvenli olmayan şekillerde kullanması. |
| **ASI03** | **Kimlik ve Yetki İstismarı** | Ajanların yüksek yetkili kimlik bilgilerini devralması veya yetki yükseltmesi. |
| **ASI04** | **Ajan Tedarik Zinciri Zafiyetleri** | Güvenliği ihlal edilmiş araçlar, eklentiler veya harici bileşenler. |
| **ASI05** | **Beklenmedik Kod Çalıştırma** | Ajanların güvenli olmayan şekilde kod veya komut oluşturup çalıştırması. |
| **ASI06** | **Bellek ve Bağlam Zehirlenmesi** | Saldırganların ajan bellek sistemlerini ve RAG veritabanlarını zehirlemesi. |
| **ASI07** | **Güvensiz Ajanlar Arası İletişim** | Çoklu ajan sistemlerinde kimlik taklidi ve veri manipülasyonu riskleri. |
| **ASI08** | **Kademeli Hatalar** (Cascading Failures) | Küçük hataların planlama ve yürütme süreçleri boyunca yayılması. |
| **ASI09** | **İnsan-Ajan Güven İstismarı** | Kullanıcıların ajan önerilerine aşırı güvenmesi (Aşırı Güven). |
| **ASI10** | **Kötü Niyetli Ajanlar** (Rogue Agents) | Ele geçirilmiş ajanların, meşru görünerek zararlı eylemlerde bulunması. |

### OWASP Ajan Tabanlı Riskler İçin Tarama
10 riskin tamamına karşı test yapmak için:

```yaml
redteam:
  plugins:
    - owasp:agentic
  strategies:
    - jailbreak
    - prompt-injection
    - crescendo
```
Veya belirli riskleri hedefleyin:
```yaml
redteam:
  plugins:
    - owasp:agentic:asi01 # Ajan Hedef Ele Geçirme (Agent Goal Hijack)
    - owasp:agentic:asi02 # Araç Kötüye Kullanımı ve İstismar (Tool Misuse and Exploitation)
    - owasp:agentic:asi05 # Beklenmedik Kod Çalıştırma (Unexpected Code Execution)
```
Taramayı Promptfoo kullanıcı arayüzü (UI) üzerinden ayarlamak için, Eklentiler (Plugins) sayfasındaki ön ayarlar listesinden **OWASP Agentic** seçeneğini belirleyin.

### ASI01: Ajan Hedef Ele Geçirme (Agent Goal Hijack)
Ajan Hedef Ele Geçirme; bir saldırganın, ajanın planlama ve muhakeme yeteneklerini suistimal ederek, kötü niyetli içerik yoluyla ajanın hedeflerini veya karar yolunu değiştirmesiyle gerçekleşir.

#### Saldırı Senaryoları
*   Planlama çerçevelerini değiştiren ince alt hedefler yoluyla **kademeli plan enjeksiyonu**.
*   Orijinal hedefleri görmezden gelmek ve yetkisiz araç zincirlerini çalıştırmak için **doğrudan talimat enjeksiyonu**.
*   Sonsuz kendi kendini analiz döngülerini tetikleyen **yansıma döngüsü tuzakları** (reflection loop traps).

#### Test Stratejisi
```yaml
redteam:
  plugins:
    - hijacking
    - system-prompt-override
    - indirect-prompt-injection
    - intent
  strategies:
    - jailbreak
    - prompt-injection
    - jailbreak:composite
```
### ASI02: Araç Kötüye Kullanımı ve İstismar (Tool Misuse and Exploitation)
Araç Kötüye Kullanımı; ajanların meşru araçları, parametre kirliliği (parameter pollution), araç zinciri manipülasyonu veya verilen izinlerin otomatik olarak suistimal edilmesi yoluyla güvenli olmayan şekillerde kullanmasıyla gerçekleşir.

#### Saldırı Senaryoları
*   **Parametre Kirliliği:** Fonksiyon çağırma parametrelerini amaçlanan kapsamın ötesinde manipüle etmek.
*   **Araç Zinciri Manipülasyonu:** Yetkisiz sonuçlar elde etmek için ardışık araç çağrılarını suistimal etmek.
*   **Otomatik Suistimal:** Yetkili araçları zararlı bir ölçekte eylemler gerçekleştirmek için kullanmak.

#### Test Stratejisi
```yaml
redteam:
  plugins:
    - excessive-agency
    - mcp
    - tool-discovery
  strategies:
    - jailbreak
    - prompt-injection
```
### ASI03: Kimlik ve Yetki İstismarı (Identity and Privilege Abuse)
Ajanlar, yüksek yetkili kimlik bilgilerine sahip kullanıcı/sistem kimliklerini devralarak; sistemler arasında yetki yükseltme ve yetkisiz erişim fırsatları yaratır.

#### Saldırı Senaryoları
*   Geçici yönetici yetkisi manipülasyonu yoluyla **dinamik izin yükseltme**.
*   Yetersiz kapsam denetimi (scope enforcement) nedeniyle **sistemler arası istismar**.
*   Meşru kimlik bilgilerini devralan **gölge ajan (shadow agent)** dağıtımı.

#### Test Stratejisi
```yaml
redteam:
  plugins:
    - rbac # Rol Tabanlı Erişim Kontrolü
    - bfla # Bozuk Fonksiyon Seviyesinde Yetkilendirme
    - bola # Bozuk Nesne Seviyesinde Yetkilendirme
    - imitation # Taklit
  strategies:
    - jailbreak
    - prompt-injection
```
### ASI04: Ajan Tedarik Zinciri Zafiyetleri (Agentic Supply Chain Vulnerabilities)
Güvenliği ihlal edilmiş araçlar, eklentiler, istem şablonları ve harici sunucular; ajanların farkında olmadan kullanabileceği zafiyetlere yol açar.

#### Saldırı Senaryoları
*   Gizli işlevler yürüten **kötü niyetli araç paketleri**.
*   Çekişmeli talimatlar (adversarial instructions) enjekte eden **ele geçirilmiş istem şablonları**.
*   Zehirlenmiş veri döndüren **harici API bağımlılıkları**.

#### Test Stratejisi
```yaml
redteam:
  plugins:
    - indirect-prompt-injection
    - mcp
  strategies:
    - prompt-injection
```
### ASI05: Beklenmedik Kod Çalıştırma (Unexpected Code Execution)
Ajanların güvenli olmayan şekilde kod veya komut oluşturup çalıştırması; uzaktan kod çalıştırma (RCE), sandbox (kum havuzu) kaçışları ve veri sızdırma fırsatları yaratır.

#### Saldırı Senaryoları
*   Gizli komutlar içeren oluşturulmuş betikler (scripts) yoluyla **DevOps ajanının ele geçirilmesi**.
*   Arka kapılar içeren YZ üretimi betiklerle **iş akışı motoru istismarı**.
*   Veri sızdırma komutları hazırlamak için **dilsel zafiyet istismarı**.

#### Test Stratejisi
```yaml
redteam:
  plugins:
    - shell-injection
    - sql-injection
    - harmful:cybercrime:malicious-code
    - ssrf
  strategies:
    - jailbreak
    - prompt-injection
```
### ASI06: Bellek ve Bağlam Zehirlenmesi (Memory and Context Poisoning)
Saldırganlar; kayıtlı bilgileri bozmak ve oturumlar arası karar verme süreçlerini manipüle etmek için ajan bellek sistemlerini, gömmeleri (embeddings) ve RAG veritabanlarını zehirler.

#### Saldırı Senaryoları
*   Tekrarlanan etkileşimler yoluyla **kademeli bellek zehirlenmesi**.
*   Yetki yükseltmenin fark edilmesini önlemek için **bellek sınırlarının suistimal edilmesi**.
*   Çoklu ajan sistemlerinde **paylaşılan belleğin bozulması**.

#### Test Stratejisi
```yaml
redteam:
  plugins:
    - agentic:memory-poisoning
    - cross-session-leak
    - indirect-prompt-injection
  strategies:
    - jailbreak
    - crescendo
```
### ASI07: Güvensiz Ajanlar Arası İletişim (Insecure Inter-Agent Communication)
Çoklu ajan sistemleri; sahte kimlikler, tekrarlanan mesajlar ve ajanlar arası iletişim kanallarında veri manipülasyonu gibi risklerle karşı karşıyadır.

#### Saldırı Senaryoları
*   Ortak karar verme sürecini etkilemek için **yanıltıcı bilgi enjeksiyonu**.
*   Kimlik doğrulama zayıflıklarını suistimal etmek için **sahte fikir birliği mesajları** oluşturma.
*   Ajan ağları boyunca yayılan **stratejik yanlış veri yerleştirme**.

#### Test Stratejisi
```yaml
redteam:
  plugins:
    - indirect-prompt-injection
    - hijacking
    - imitation
  strategies:
    - prompt-injection
```
### ASI08: Kademeli Hatalar (Cascading Failures)
Bir ajandaki küçük hatalar; planlama, yürütme ve bellek süreçlerine yayılarak birbiriyle bağlantılı sistemler aracılığıyla büyür.

#### Saldırı Senaryoları
*   Uzun süreli bellekte biriken **yanlış ürün detaylarının enjekte edilmesi**.
*   Veri sızıntılarına neden olan **halüsinasyon kaynaklı API uç noktalarının** (endpoints) sisteme dahil edilmesi.
*   Öz-pekiştirme (self-reinforcement) yoluyla kademeli olarak kötüleşen **yanlış bilgilerin yerleştirilmesi**.

#### Test Stratejisi
```yaml
redteam:
  plugins:
    - hallucination
    - harmful:misinformation-disinformation
    - divergent-repetition
  strategies:
    - jailbreak
    - prompt-injection
```
### ASI09: İnsan-Ajan Güven İstismarı (Human Agent Trust Exploitation)
Kullanıcıların ajan önerilerine veya açıklamalarına aşırı güvenmesi; sosyal mühendislik ve gizli zararlı eylemlerin gerçekleştirilmesine olanak tanır.

#### Saldırı Senaryoları
*   Meşru satıcı bilgilerinin değiştirildiği **YZ destekli fatura dolandırıcılığı**.
*   Kötü niyetli bağlantılar içeren aldatıcı mesajlarla **YZ tabanlı oltalama** (phishing).
*   Güvenilir ajan arayüzleri üzerinden yürütülen **dezenformasyon kampanyaları**.

#### Test Stratejisi
```yaml
redteam:
  plugins:
    - overreliance # Aşırı Güven
    - imitation # Taklit
    - harmful:misinformation-disinformation # Zararlı: Yanlış Bilgi ve Dezenformasyon
  strategies:
    - crescendo
```
### ASI10: Kötü Niyetli Ajanlar (Rogue Agents)
Güvenliği ihlal edilmiş veya hedef sapması (misalignment) yaşayan ajanlar; çoklu ajan iş akışlarındaki güven mekanizmalarını suistimal ederek, meşru görünürken zararlı eylemlerde bulunur.

#### Saldırı Senaryoları
*   Onay ajanı taklidi yaparak sisteme **kötü niyetli iş akışı enjeksiyonu**.
*   Sahte işlemleri yönlendirmek için **orkestrasyon ele geçirme** (orchestration hijacking).
*   Bilişim kaynaklarını tüketmek için **koordineli ajan seline (flooding)** maruz bırakma.

#### Test Stratejisi
```yaml
redteam:
  plugins:
    - excessive-agency
    - hijacking
    - rbac
    - goal-misalignment
  strategies:
    - jailbreak
    - crescendo
```
### OWASP LLM Top 10 ile İlişkisi
Ajan Tabanlı Uygulamalar için OWASP Top 10, OWASP LLM Top 10 listesini genişletir ve tamamlar:


| Ajan Tabanlı Risk (Agentic Risk) | İlgili LLM Top 10 Maddesi |
| :--- | :--- |
| **ASI01: Ajan Hedef Ele Geçirme** | LLM01: Prompt Injection (İstem Enjeksiyonu) |
| **ASI02: Araç Kötüye Kullanımı ve İstismar** | LLM06: Excessive Agency (Aşırı Yetkilendirme) |
| **ASI03: Kimlik ve Yetki İstismarı** | LLM06: Excessive Agency (Aşırı Yetkilendirme) |
| **ASI05: Beklenmedik Kod Çalıştırma** | LLM01 & LLM05: Improper Output Handling (Hatalı Çıktı Yönetimi) |
| **ASI06: Bellek ve Bağlam Zehirlenmesi** | LLM04: Data and Model Poisoning (Veri ve Model Zehirlenmesi) |
| **ASI08: Kademeli Hatalar** | LLM09: Misinformation (Yanlış Bilgi) |

Kapsamlı bir koruma sağlamak için her iki çerçeveyi (framework) birlikte test edin:

```yaml
redteam:
  plugins:
    - owasp:agentic
    - owasp:llm
  strategies:
    - jailbreak
    - prompt-injection
    - crescendo
```
## Sırada Ne Var?
Ajan tabanlı sistemlerde "red teaming" (kırmızı takım) süreçleri hakkında daha fazla bilgi edinmek için şunlara göz atabilirsiniz:

*   **LLM Ajanlarında Red Team Nasıl Yapılır?** (How to Red Team LLM Agents)
*   **LLM Red Teaming'e Giriş** (Introduction to LLM Red Teaming)
*   **Red Team Yapılandırması** (Red Team Configuration)

### Ek Kaynaklar
*   **Ajan Tabanlı Uygulamalar İçin OWASP Top 10** (OWASP Top 10 for Agentic Applications)
*   **OWASP GenAI Güvenlik Projesi** (OWASP GenAI Security Project)
*   **OWASP LLM Top 10**
*   **OWASP API Güvenliği Top 10**
