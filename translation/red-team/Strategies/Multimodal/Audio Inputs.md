### Ses Tabanlı (Audio) Jailbreak
Ses (Audio) stratejisi, istem metnini konuşma sesine dönüştürür ve ardından bu sesi bir base64 dizesi olarak kodlar. Bu, yapay zeka sistemlerinin ses olarak kodlanmış metinleri nasıl işlediğini test etmeyi sağlar; bu da metin tabanlı içerik filtrelerini potansiyel olarak atlatabilir veya düz metin işlemeden farklı davranışlara yol açabilir.

### Kullanım Durumu
Bu strateji şu amaçlar için kullanışlıdır:

*   Modellerin base64 kodlu seslerden metni çıkarıp çıkaramadığını ve işleyip işleyemediğini test etmek.
*   Ses olarak kodlanmış metnin, genellikle düz metni tarayan içerik filtrelerini atlatıp atlatamadığını değerlendirmek.
*   Çok modlu (multi-modal) girdileri (konuşma formatına dönüştürülmüş metin) işlerken model davranışını ölçmek.

Bunu `promptfooconfig.yaml` dosyanızda şu şekilde kullanabilirsiniz:

```yaml
# promptfooconfig.yaml
strategies:
  - audio
```
Veya ek yapılandırma ile:

```yaml
# promptfooconfig.yaml
strategies:
  - id: audio
    config:
      language: fr # Fransızca ses kullan (ISO 639-1 kodu)
```
### Nasıl Çalışır?
Strateji aşağıdaki işlemleri gerçekleştirir:

*   Test durumunuzdaki orijinal metni alır.
*   Metni, konuşma sesine dönüştürülmesi için uzak servise gönderir.
*   Base64 formatında kodlanmış ses verisini alır.
*   Test durumunuzdaki orijinal metni, base64 kodlu ses ile değiştirir.

Sonuçta ortaya çıkan test durumu, orijinaliyle aynı anlamsal içeriğe sahiptir ancak yapay zeka sistemleri tarafından farklı şekilde işlenebilecek farklı bir formattadır.

### Yapılandırma Seçenekleri
*   **language (dil):** Metin okuma (TTS) sisteminin hangi dili kullanacağını belirten bir ISO 639-1 dil kodudur. Bu parametre, oluşturulan sesin aksanını ve telaffuz kalıplarını kontrol eder. Belirtilmezse varsayılan olarak 'en' (İngilizce) kullanılır. **Not:** Bu parametre sadece sesin aksanını değiştirir; metninizi tercüme etmez. Eğer `language: 'fr'` ayarıyla İngilizce bir metin verirseniz, Fransız aksanıyla konuşulan İngilizce kelimeler elde edersiniz.

### Önemi
Bu stratejiyi uygulamaya değer kılan nedenler şunlardır:

*   İçerik filtreleme mekanizmalarının düz metin dışındaki formatlara karşı dayanıklılığını test eder.
*   Modelin ses verilerini işleme ve bunlardan bilgi çıkarma yeteneğini değerlendirir.
*   Modellerin farklı formatlarda sunulan aynı içeriği işleme biçimindeki tutarsızlıkları ortaya çıkarabilir.
*   Ses modaliteleri, zararlı içerikler için farklı eşik değerlerine veya işleme hatlarına (pipeline) sahip olabilir.

### İlgili Kavramlar
*   **Görüntü (Image) Jailbreak** – Ses yerine görüntülerin kullanıldığı benzer yaklaşım.
*   **Video Jailbreak** – Ses yerine videonun kullanıldığı benzer yaklaşım.
*   **Çok Modlu (Multi-Modal) Kırmızı Ekip Rehberi** – Çok modlu modelleri test etmek için kapsamlı rehber.
*   **LLM Zafiyet Türleri** – Zafiyetlere ilişkin kapsamlı genel bakış.
*   **Kırmızı Ekip Stratejileri** – Diğer kırmızı ekip yaklaşımları.
