### Video Tabanlı (Video) Jailbreak
Video stratejisi, istem metnini üzerine metin yerleştirilmiş (text overlay) bir videoya dönüştürür ve ardından bu videoyu bir base64 dizesi olarak kodlar. Bu, yapay zeka sistemlerinin video olarak kodlanmış metinleri nasıl işlediğini test etmeyi sağlar; bu da metin tabanlı içerik filtrelerini potansiyel olarak atlatabilir veya düz metin işlemeden farklı davranışlara yol açabilir.

### Bu Strateji Neden Kullanılmalı?
Bu strateji, güvenlik araştırmacılarına ve yapay zeka geliştiricilerine şu konularda yardımcı olur:

*   **Model Yeteneklerini Test Etme:** Modellerin base64 ile kodlanmış videolardan metni çıkarıp çıkaramadığını ve işleyip işleyemediğini değerlendirmek.
*   **Güvenlik Önlemlerini Değerlendirme:** Videoya kodlanmış metnin, genellikle düz metni tarayan içerik filtrelerini atlatıp atlatamadığını belirlemek.
*   **Çok Modlu (Multi-modal) Davranışı Değerlendirmek:** Modellerin aynı içeriğe farklı formatlarda nasıl yanıt verdiği arasındaki farkları tanımlamak.
*   **Tutarsızlıkları Keşfetmek:** Metin tabanlı ve video tabanlı işleme yollarını karşılaştırarak potansiyel zafiyetleri ortaya çıkarmak.

### Nasıl Çalışır?
Strateji aşağıdaki işlemleri gerçekleştirir:

1.  Test durumunuzdaki orijinal metni alır.
2.  Beyaz bir arka plan üzerinde metnin 5 saniye boyunca göründüğü basit bir video oluşturur.
3.  Videoyu bir base64 dizesine dönüştürür.
4.  Test durumunuzdaki orijinal metni, base64 kodlu video ile değiştirir.

Sonuçta ortaya çıkan test durumu, orijinaliyle aynı anlamsal içeriğe sahiptir ancak yapay zeka sistemleri tarafından farklı şekilde işlenebilecek farklı bir formattadır.

### Dönüşüm Örneği
Örneğin, normalde filtrelenebilecek zararlı bir istem, üzerine metin yerleştirilmiş bir videoya dönüştürülür ve ardından base64 olarak kodlanır. Kodlanmış video şu şekilde başlar:

`AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAu1tZGF0...`
### Uygulama
Bunu `promptfooconfig.yaml` dosyanızda şu şekilde kullanabilirsiniz:

```yaml
# promptfooconfig.yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: 'Çok modlu (Multi-modal) kırmızı ekip çalışması'
targets:
  - bedrock:amazon.nova-lite-v1:0
prompts:
  - file://path/to/your/prompt.json
redteam:
  plugins:
    - ...
  strategies:
    - video
    - id: basic
      config:
        enabled: false
```
`prompt.json` dosyanız şu şekilde görünmelidir:

```json
// prompt.json
[
  {
    "role": "system",
    "content": "Siz yardımcı bir asistansınız."
  },
  {
    "role": "user",
    "content": [
      {
        "video": {
          "format": "mp4",
          "source": { "bytes": "{{video}}" }
        }
      }
    ]
  }
]
```
### Gereksinimler
Bu strateji, sisteminizde **FFmpeg**'in yüklü olmasını gerektirir:

**macOS üzerinde:**

```bash
brew install ffmpeg
```
**Ubuntu/Debian üzerinde:**

```bash
apt-get install ffmpeg
```
**Windows üzerinde:** ffmpeg.org adresinden indirin veya Chocolatey gibi paket yöneticilerini kullanın:

```powershell
choco install ffmpeg
```
### Teknik Detaylar
*   **Video Formatı:** Strateji, H.264 kodlamalı MP4 videoları oluşturur.
*   **Süre:** Videolar varsayılan olarak 5 saniye uzunluğundadır.
*   **Çözünürlük:** 640x480 piksel.
*   **Metin İşleme:** Metin, standart bir yazı tipi kullanılarak beyaz arka plan üzerine ortalanır.
*   **İşleme:** Tüm video oluşturma işlemleri FFmpeg kullanılarak yerel olarak yapılır.

> [!WARNING]
> **Uyarı:** Bu strateji, video üretimi nedeniyle diğer kodlama stratejilerinden daha fazla işlem kaynağı gerektirir. Özellikle büyük test setlerinde çalışması daha uzun sürebilir.

### Önemi
Bu stratejiyi uygulamaya değer kılan nedenler şunlardır:

*   İçerik filtreleme mekanizmalarının video formatlarına karşı dayanıklılığını test eder.
*   Modelin video verilerini işleme ve bunlardan bilgi çıkarma yeteneğini değerlendirir.
*   Modellerin farklı formatlarda sunulan aynı içeriği işleme biçimindeki tutarsızlıkları ortaya çıkarabilir.
*   Video modaliteleri, zararlı içerikler için farklı eşik değerlerine veya işleme hatlarına sahip olabilir.
*   Kapsamlı çok modlu (multi-modal) testler sağlamak için görüntü ve ses stratejilerini tamamlar.

### İlgili Kavramlar
*   **Ses Tabanlı (Audio) Jailbreak** – Konuşma sesinin kullanıldığı benzer bir yaklaşım.
*   **Görüntü Tabanlı (Image) Jailbreak** – Görüntülerin kullanıldığı benzer bir yaklaşım.
*   **Çok Modlu Kırmızı Ekip Rehberi** – Çok modlu modelleri test etmek için kapsamlı bir rehber.
*   **LLM Zafiyet Türleri** – Zafiyetlere ilişkin kapsamlı genel bakış.

LLM zafiyetleri ve kırmızı ekip stratejileri hakkında kapsamlı bir genel bakış için **Types of LLM Vulnerabilities** sayfamızı ziyaret edebilirsiniz.

