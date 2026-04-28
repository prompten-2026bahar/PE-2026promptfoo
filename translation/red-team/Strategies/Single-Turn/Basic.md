## Temel Strateji (Basic Strategy)

Temel strateji, eklenti tarafından oluşturulan orijinal test senaryolarının (herhangi bir strateji uygulanmamış hallerinin) nihai çıktıya dahil edilip edilmeyeceğini kontrol eder.

## Uygulama
Temel strateji aşağıdaki yapılandırma seçeneklerini kabul eder:


| Seçenek | Tür | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| enabled | boolean | true | Temel test senaryolarının dahil edilip edilmeyeceği |

Örnek kullanım:

```yaml
# promptfooconfig.yaml
redteam:
  language: ['es', 'fr'] # İspanyolca ve Fransızca dillerinde test et
  strategies:
    - id: basic
      config:
        enabled: false # Sadece strateji uygulanmış testleri çalıştır
    - id: jailbreak
    - id: base64
```
## Nasıl Çalışır?

Varsayılan olarak promptfoo şunları yapar:

*   Etkinleştirilmiş eklentilerden (plugins) test senaryoları oluşturur.
*   Ek test senaryoları üretmek için her bir stratejiyi uygular.
*   Hem orijinal eklenti test senaryolarını hem de strateji tarafından oluşturulan test senaryolarını dahil eder.

Temel strateji devre dışı bırakıldığında (`enabled: false`), nihai çıktıya yalnızca strateji tarafından oluşturulan test senaryoları dahil edilir. Bu, yalnızca stratejiler aracılığıyla belirli saldırı vektörlerini test etmeye odaklanmak istediğinizde kullanışlı olabilir.

## Kullanım Durumları

*   **Strateji etkinliğini test etme:** Stratejilerinizin ne kadar iyi çalıştığını izole etmek ve değerlendirmek için temel testleri devre dışı bırakın.
*   **Test hacmini azaltma:** Çok sayıda eklentiniz ve stratejiniz varsa, temel testleri devre dışı bırakmak toplam test sayısını azaltabilir.
*   **Odaklanmış test:** Sisteminizin temel eklenti testleri yerine, özellikle değiştirilmiş/stratejik girdileri nasıl işlediğini test etmek istediğinizde.

## İlgili Kavramlar

*   **Red Team Eklentileri** – Temel strateji için test senaryoları oluşturur.
*   **Red Team Stratejileri** – Test senaryolarına uygulanacak diğer stratejiler.
*   **Yapılandırma Kılavuzu** – Daha gelişmiş yapılandırma seçenekleri.

LLM zafiyetleri ve "red teaming" stratejileri hakkında kapsamlı bir genel bakış için [LLM Zafiyet Türleri](Types of LLM Vulnerabilities) sayfamızı ziyaret edin.
