# NIST Yapay Zekâ Risk Yönetimi Çerçevesi (NIST AI RMF)

NIST Yapay Zekâ Risk Yönetimi Çerçevesi (AI RMF), ABD Ulusal Standartlar ve Teknoloji Enstitüsü tarafından geliştirilen, yapay zekâ sistemleriyle ilişkili risklerin yönetilmesine yardımcı olan gönüllü bir çerçevedir. Yapay zekâ yaşam döngüsü boyunca risklerin tanımlanması, değerlendirilmesi ve yönetilmesi için yapılandırılmış bir yaklaşım sunar.

Çerçeve dört temel fonksiyondan oluşur: Yönet (Govern), Haritala (Map), Ölç (Measure) ve Yönet (Manage). Promptfoo’nun red teaming yetenekleri ağırlıklı olarak Ölç (Measure) fonksiyonuna odaklanır.

---

## Çerçeve Yapısı

### MEASURE 1: Uygun yöntemler ve metrikler belirlenir ve uygulanır
- **1.1:** AI risklerinin ölçümü için yöntemler ve metrikler seçilir, uygulanır ve belgelenir  
- **1.2:** AI metriklerinin uygunluğu ve risk kontrollerinin etkinliği düzenli olarak değerlendirilir  

### MEASURE 2: AI sistemleri güvenilirlik açısından değerlendirilir
- **2.1:** Test setleri, metrikler ve kullanılan araçlar belgelenir  
- **2.2:** İnsan katılımlı değerlendirmeler uygunluk şartlarını karşılar  
- **2.3:** Performans kriterleri ölçülür ve gösterilir  
- **2.4:** Güvenlik riskleri düzenli olarak değerlendirilir  
- **2.5:** Sistem geçerli ve güvenilir olduğunu gösterir  
- **2.6:** Kötüye kullanım potansiyeli değerlendirilir  
- **2.7:** Güvenlik ve dayanıklılık değerlendirilir  
- **2.8:** Gizlilik ve veri koruma uygulamaları değerlendirilir  
- **2.9:** Risk değerleri belgelenir  
- **2.10:** Gizlilik riskleri analiz edilir  
- **2.11:** Adalet ve önyargı değerlendirilir  
- **2.12:** Çevresel etki değerlendirilir  
- **2.13:** Şeffaflık araçlarının etkinliği değerlendirilir  

### MEASURE 3: Risk takibi mekanizmaları
- **3.1:** Riskler düzenli olarak izlenir  
- **3.2:** Ölçülmesi zor riskler için yöntemler geliştirilir  
- **3.3:** Kullanıcı geri bildirim mekanizmaları oluşturulur  

### MEASURE 4: Risk metrikleri etkiyi yansıtır
- **4.1:** Geri bildirim süreçleri entegre edilir  
- **4.2:** Performans değişimleri ölçülür  
- **4.3:** Performans değişimleri iş değeri ile ilişkilendirilir  

---

## NIST AI RMF Uyumluluğu için Tarama

```yaml
redteam:
  plugins:
    - nist:ai:measure
  strategies:
    - jailbreak
    - prompt-injection
```

Belirli ölçümler hedeflenebilir:

```yaml
redteam:
  plugins:
    - nist:ai:measure:2.4
    - nist:ai:measure:2.7
    - nist:ai:measure:2.11
```
Önemli Ölçümler ve Test Stratejileri
MEASURE 1.1 & 1.2
```yaml
redteam:
  plugins:
    - excessive-agency
    - harmful:misinformation-disinformation
  strategies:
    - jailbreak
    - prompt-injection
```
MEASURE 2.1 & 2.2
```yaml
redteam:
  plugins:
    - harmful:privacy
    - pii:api-db
    - pii:direct
    - pii:session
    - pii:social
```
MEASURE 2.3 & 2.5
```yaml
redteam:
  plugins:
    - excessive-agency
```

MEASURE 2.4
```yaml
redteam:
  plugins:
    - excessive-agency
    - harmful:misinformation-disinformation
  strategies:
    - jailbreak
    - prompt-injection
```
MEASURE 2.6
```yaml
redteam:
  plugins:
    - harmful:chemical-biological-weapons
    - harmful:indiscriminate-weapons
    - harmful:unsafe-practices
```
MEASURE 2.7
```yaml
redteam:
  plugins:
    - harmful:cybercrime
    - shell-injection
    - sql-injection
  strategies:
    - jailbreak
    - prompt-injection
```
MEASURE 2.8
```yaml
redteam:
  plugins:
    - bfla
    - bola
    - rbac
```
MEASURE 2.9 & 2.13
```yaml
redteam:
  plugins:
    - excessive-agency
```
MEASURE 2.10
```yaml
redteam:
  plugins:
    - harmful:privacy
    - pii:api-db
    - pii:direct
    - pii:session
    - pii:social
```
MEASURE 2.11
```yaml
redteam:
  plugins:
    - harmful:harassment-bullying
    - harmful:hate
    - harmful:insults
```
MEASURE 3.1–3.3
```yaml
redteam:
  plugins:
    - excessive-agency
    - harmful:misinformation-disinformation
  strategies:
    - jailbreak
    - prompt-injection
```
MEASURE 4.1–4.3
```yaml
redteam:
  plugins:
    - excessive-agency
    - harmful:misinformation-disinformation
```
Kapsamlı Test
```yaml
redteam:
  plugins:
    - nist:ai:measure
  strategies:
    - jailbreak
    - prompt-injection
```
Diğer Çerçevelerle Entegrasyon

#ISO 42001

#OWASP LLM Top 10

#GDPR

#AB AI Act
```yaml
redteam:
  plugins:
    - nist:ai:measure
    - owasp:llm
    - gdpr
  strategies:
    - jailbreak
    - prompt-injection
```
## NIST AI RMF Uyumluluğu İçin En İyi Uygulamalar

Promptfoo ile NIST AI RMF uyumluluk testleri yaparken şunlara dikkat edilmelidir:

*   **Testlerinizi Belgeleyin:** NIST, test metodolojilerinin belgelenmesine büyük önem verir (ÖLÇÜM 2.1).
*   **Düzenli Değerlendirme:** "Düzenli değerlendirme" gereksinimlerini karşılamak için sürekli test süreçleri kurun.
*   **Temsili Testler:** Test koşullarının, gerçek dağıtım ortamlarıyla (deployment context) eşleştiğinden emin olun (ÖLÇÜM 2.2).
*   **Risk Takibi:** Belirlenen riskleri zaman içinde takip etmek için Promptfoo'nun raporlama özelliklerini kullanın (ÖLÇÜM 3.1).
*   **Paydaş Geri Bildirimi:** Otomatik testleri, manuel incelemeler ve kullanıcı geri bildirimleriyle birleştirin (ÖLÇÜM 3.3).
*   **Bütünsel Yaklaşım:** Sadece "Ölçüm" (Measure) işlevine odaklanmak yerine, dört temel işlevin (Yönet, Haritalandır, Ölç, Yönet) tamamında testler yapın.

## Otomatik Testlerin Sınırları
Promptfoo birçok NIST AI RMF ölçümünü otomatize etmeye yardımcı olsa da, bazı gereksinimler ek süreçler gerektirir:

*   **ÖLÇÜM 2.12:** Çevresel etki değerlendirmesi, altyapı izleme süreçleri gerektirir.
*   **ÖLÇÜM 3.3:** Paydaş geri bildirim süreçleri, kurumsal prosedürler gerektirir.
*   **ÖLÇÜM 4.3:** İş değeri değerlendirmesi, otomatik testlerin ötesinde bir iş bağlamı gerektirir.

Otomatik "red teaming", yönetişim, dokümantasyon ve paydaş katılımını içeren kapsamlı bir NIST AI RMF uyumluluk programının bir parçası olmalıdır.

## Sırada Ne Var?
NIST AI RMF, ortaya çıkan yeni yapay zeka risklerini ve en iyi uygulamaları yansıtacak şekilde düzenli olarak güncellenmektedir. **Promptfoo** ile yapılan düzenli testler, çerçevenin ölçüm gereksinimlerine sürekli uyum sağlanmasına yardımcı olur.

Kapsamlı bir yapay zeka "red teaming" kurulumu hakkında daha fazla bilgi edinmek için **LLM Red Teaming'e Giriş** ve **Yapılandırma Detayları** bölümlerine bakabilirsiniz.

## Ek Kaynaklar
*   [NIST AI RMF Resmi Web Sitesi](https://nist.gov)
*   [NIST AI RMF Kılavuzu (Playbook)](https://nist.gov)
*   [NIST AI RMF Karşılaştırma Tablosu (Crosswalk)](https://nist.gov)
