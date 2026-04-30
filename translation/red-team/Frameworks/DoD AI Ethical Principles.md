# DoD Yapay Zeka Etik İlkeleri

ABD Savunma Bakanlığı (DoD), 2020 yılında beş yapay zeka etik ilkesini kabul etmiştir: **Sorumlu, Adil, İzlenebilir, Güvenilir ve Yönetilebilir.**

Promptfoo, etik ve güvenlik risklerini tekrarlanabilir testlerle ölçebilmeniz için her bir ilkeyi somut "red team" eklentileriyle eşleştirir.

## İlkelere Genel Bakış
*   **Sorumlu (Responsible):** İnsanlar, YZ sonuçlarından sorumlu olmaya devam eder.
*   **Adil (Equitable):** YZ kullanımı, istenmeyen önyargıları en aza indirmelidir.
*   **İzlenebilir (Traceable):** Kararlar ve çıktılar denetlenebilir olmalıdır.
*   **Güvenilir (Reliable):** Sistemler; amaçlanan bağlamlarda emniyetli, güvenli ve etkili olmalıdır.
*   **Yönetilebilir (Governable):** Operatörler, istenmeyen davranışları tespit edebilmeli ve devre dışı bırakabilmelidir.

## DoD YZ Etik Uyumluluğu İçin Tarama
Promptfoo kullanıcı arayüzünde (UI), Eklentiler (Plugins) sayfasındaki **DoD AI Ethical Principles** ön ayarını seçin.

Veya doğrudan yapılandırın:

```yaml
redteam:
  plugins:
    - dod:ai:ethics
```
# DoD Yapay Zeka Etik İlkeleri

ABD Savunma Bakanlığı (DoD), 2020 yılında beş yapay zeka etik ilkesini kabul etmiştir: **Sorumlu, Adil, İzlenebilir, Güvenilir ve Yönetilebilir.**

Promptfoo, etik ve güvenlik risklerini tekrarlanabilir testlerle ölçebilmeniz için her bir ilkeyi somut "red team" eklentileriyle eşleştirir.

## İlkelere Genel Bakış
*   **Sorumlu (Responsible):** İnsanlar, YZ sonuçlarından sorumlu olmaya devam eder.
*   **Adil (Equitable):** YZ kullanımı, istenmeyen önyargıları en aza indirmelidir.
*   **İzlenebilir (Traceable):** Kararlar ve çıktılar denetlenebilir olmalıdır.
*   **Güvenilir (Reliable):** Sistemler; amaçlanan bağlamlarda emniyetli, güvenli ve etkili olmalıdır.
*   **Yönetilebilir (Governable):** Operatörler, istenmeyen davranışları tespit edebilmeli ve devre dışı bırakabilmelidir.

## DoD YZ Etik Uyumluluğu İçin Tarama
Promptfoo kullanıcı arayüzünde (UI), Eklentiler (Plugins) sayfasındaki **DoD AI Ethical Principles** ön ayarını seçin.

Veya doğrudan yapılandırın:

```yaml
redteam:
  plugins:
    - dod:ai:ethics
```

#  1. Sorumlu (dod:ai:ethics:01)

Sorumlu YZ sistemleri, insanı kontrol mekanizmasında tutmalı ve onaylanmamış otonom davranışları engellemelidir.
Test Stratejisi
*  **Yetkisiz eylemleri ve aşırı otomasyonu test edin.**
*  **Vekil optimizasyonunun (proxy optimization) amaçlanan hedeflerle çelişip çelişmediğini test edin.**
*  **Konu dışı ele geçirme (hijacking) ve kötüye kullanımı test edin.**

**Örnek Yapılandırma:**

```yaml
redteam:
  plugins:
    - excessive-agency
    - goal-misalignment
    - overreliance
    - hijacking
  strategies:
    - jailbreak
    - jailbreak-templates
```
**Veya kısa yolu kullanın:**
```yaml
redteam:
  plugins:
    - dod:ai:ethics:01
```
## 2. Adil (dod:ai:ethics:02)
Adil YZ sistemleri, korunan sınıflar genelinde ayrımcı sonuçları azaltmalıdır.
**Test Stratejisi**
*   Yaş, engellilik, cinsiyet ve ırk genelinde demografik önyargıları test edin.
*   Zararlı ayrımcı çıktıları test edin.
**Örnek Yapılandırma:**
```yaml
redteam:
  plugins:
    - bias:age
    - bias:disability
    - bias:gender
    - bias:race
    - harmful:hate
```

## 3. İzlenebilir (dod:ai:ethics:03)
İzlenebilir YZ sistemleri, çıktıların denetlenebilirliğini ve kanıta dayalı incelenmesini desteklemelidir.
**Test Stratejisi**
*  Uydurma iddiaları ve doğrulanamayan ifadeleri test edin.
*  RAG çıktıları için kaynak atıf kalitesini test edin.
*  Olguya dayalı güvenilirliği ve halüsinasyon davranışını test edin.
**Örnek Yapılandırma:**
```yaml
redteam:
  plugins:
    - hallucination
    - harmful:misinformation-disinformation
    - rag-source-attribution
    - unverifiable-claims
```
## 4. Güvenilir (dod:ai:ethics:04)
Güvenilir YZ sistemleri, gerçekçi koşullar altında emniyetli ve güvenli bir şekilde çalışmalıdır.
**Test Stratejisi**
*  Zararlı dezenformasyonu ve güvenli olmayan talimatları test edin.
*  Injection (enjeksiyon) ve SSRF gibi güvenlik açıklarını test edin.
*  Kaynak baskısı altında güvenilirliği test edin.
**Örnek Yapılandırma:**
```yaml
redteam:
  plugins:
    - harmful:misinformation-disinformation
    - harmful:unsafe-practices
    - shell-injection
    - sql-injection
    - ssrf
    - debug-access
    - reasoning-dos
  strategies:
    - jailbreak
    - jailbreak-templates
```
## 5. Yönetilebilir (dod:ai:ethics:05)
Yönetilebilir YZ sistemleri; operatörlerin güvenli olmayan davranışları tespit etmesine, kısıtlamasına ve kapatmasına olanak sağlamalıdır.
**Test Stratejisi**
*  Kontrol sınırı hatalarını ve hedef ele geçirmeyi test edin.
*  Prompt/kontrol düzlemi (control-plane) saldırılarını test edin.
*  Yetkilendirme ve araç kapsamı (tool-scope) uygulamasını test edin.
**Örnek Yapılandırma:**
```yaml
redteam:
  plugins:
    - excessive-agency
    - hijacking
    - indirect-prompt-injection
    - system-prompt-override
    - rbac
    - bfla
    - bola
    - tool-discovery
  strategies:
    - jailbreak
    - jailbreak-templates
    - jailbreak:composite
```
## Tüm İlkeleri Birlikte Çalıştırma
```yaml
redteam:
  plugins:
    - dod:ai:ethics
  strategies:
    - jailbreak:meta
    - jailbreak:composite
    - jailbreak-templates
```
**Diğer Çerçevelerle Birleştirme**
DoD YZ etik testi genellikle güvenlik ve yönetişim çerçeveleriyle eşleştirilir:
*  NIST AI RMF
*  Ajan Tabanlı Uygulamalar İçin OWASP Top 10
*  ISO 42001
*  Veri Koruma
**Örnek Birleşik Tarama:**
```yaml
redteam:
  plugins:
    - dod:ai:ethics
    - nist:ai:measure
    - owasp:agentic
```
**Kaynaklar**
*  DoD, 5 yapay zeka etik ilkesini kabul etti.
* DoD Sorumlu YZ Kaynakları.

