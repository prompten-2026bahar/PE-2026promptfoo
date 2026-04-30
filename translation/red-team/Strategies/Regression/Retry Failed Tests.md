### Yeniden Deneme (Retry) Stratejisi
Yeniden deneme (retry) stratejisi, daha önce başarısız olmuş test durumlarını otomatik olarak test paketinize dahil ederek hedef LLM sistemleri için bir regresyon testi sistemi oluşturur. Her kırmızı ekip taraması geçmiş hatalardan öğrenir, bu da promptfoo'nun hedefinizdeki zafiyetleri bulmada giderek daha etkili olmasını sağlar. Yeniden deneme stratejisi iş hattınızda (pipeline) ilk sırada çalışır ve diğer stratejilerin bu geçmiş test durumları üzerine inşa edilmesine olanak tanır.

> [!NOTE]
> **Not:** Yeniden deneme stratejisi hedefe özeldir; yalnızca aynı hedef sisteme (hedef etiketi ile tanımlanır) karşı daha önce başarısız olmuş test durumlarını yeniden dener. Bu, yeniden denenen test durumlarının o hedefin bilinen zafiyetleriyle ilgili olmasını sağlar.

### Uygulama
Yeniden deneme stratejisini kırmızı ekip kurulumunuza dahil etmek için:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: 'retry'
      config:
        numTests: 10 # Eklenti başına dahil edilecek geçmiş test durumu sayısı
        plugins:
          - harmful:hate # Sadece bu eklentilerden gelen başarısız testleri yeniden dene
          - harmful:illegal
```
Şunları yapılandırabilirsiniz:

*   **numTests:** Her eklenti başına dahil edilecek maksimum geçmiş test durumu sayısı (varsayılan: her eklentinin kendi `numTests` ayarıyla eşleşir).
*   **plugins:** Yeniden deneme stratejisinin uygulanacağı belirli eklentilerin listesi (varsayılan: tüm eklentiler).

Örneğin, yukarıdaki yapılandırma ve belirtilen iki eklenti ile; yeniden deneme stratejisi, mevcut hedef sisteminize özel olarak `harmful:hate` için en fazla 10 ve `harmful:illegal` için en fazla 10 geçmiş test durumunu dahil edecektir.

Yapılandırma olmadan temel kullanım için:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: retry
```
### Nasıl Çalışır?
Yeniden deneme (retry) stratejisi şu adımları izler:

1.  Hedef sistem için daha önce başarısız olmuş test durumlarını tanımlar.
2.  Eklenti bazında en ilgili başarısız test durumlarını seçer.
3.  Bu vakaları mevcut test paketine dahil eder.
4.  Sonraki stratejilerin bu geçmiş bilgi birikimi üzerine inşa edilmesine olanak tanır.

### Örnek Senaryolar
Şöyle bir test paketiniz olduğunu varsayalım:

```yaml
# promptfooconfig.yaml
redteam:
  plugins:
    - id: harmful:hate
      numTests: 5
  strategies:
    - id: retry
    - id: jailbreak
```
Eğer hedefiniz üzerinde daha önce bazı nefret söylemi testleri başarısız olduysa, yeniden deneme (retry) stratejisi şunları yapacaktır:

1.  5 adet yeni nefret söylemi test durumu oluşturur.
2.  Bu hedef için geçmişte başarısız olmuş nefret söylemi test durumlarını bulur.
3.  Bunları birleştirir ve tekrarlardan arındırır (deduplication).
4.  En ilgili ilk 5 test durumunu seçer.
5.  Bunları sonraki stratejilere (örneğin `jailbreak`) aktarır.

### En İyi Pratikler
*   Yeni test durumları oluşturmadan önce, en son kırmızı ekip (red team) taramanızı gözden geçirin ve puanlayın.
*   Maksimum kapsama alanı için diğer stratejilerle kombinasyon halinde kullanın.

> [!INFO]
> **Bilgi:** Şu anda yeniden deneme stratejisi yalnızca yerel veritabanınızı kullanmaktadır. Ekipler arasında bulut üzerinden test durumu paylaşımı yakında eklenecektir.

### İlgili Kavramlar
*   **Stratejilere Genel Bakış** – Yeniden denemenin diğer stratejilerle nasıl uyum sağladığını görün.
*   **LLM Zafiyet Türleri** – Hangi zafiyetlerin test edileceğini anlayın.
*   **Best-of-N Stratejisi** – Saldırı başarı oranını artırmak için kullanılan bir başka yaklaşım.
