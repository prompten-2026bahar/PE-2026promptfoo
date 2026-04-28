### Görüntü Tabanlı (Image) Jailbreak
Görüntü (Image) stratejisi, istem metnini bir görüntüye dönüştürür ve ardından bu görüntüyü bir base64 dizesi olarak kodlar. Bu yaklaşım, yapay zeka sistemlerinin metin içeren görüntüleri nasıl işlediğini test etmeyi sağlar; bu da metin tabanlı güvenlik bariyerlerini (guardrails) / içerik filtrelerini potansiyel olarak atlatabilir veya düz metin işlemeden farklı davranışlara yol açabilir.

### Bu Strateji Neden Kullanılmalı?
Bu strateji, güvenlik araştırmacılarına ve yapay zeka geliştiricilerine şu konularda yardımcı olur:

*   **Model Yeteneklerini Test Etme:** Modellerin base64 ile kodlanmış görüntülerden metni çıkarıp çıkaramadığını ve işleyip işleyemediğini değerlendirmek.
*   **Güvenlik Önlemlerini Değerlendirme:** Görüntüye kodlanmış metnin, normalde düz metni tarayan içerik filtrelerini atlatıp atlatamadığını belirlemek.
*   **Çok Modlu (Multi-modal) Davranışı Değerlendirmek:** Modellerin aynı içeriğe farklı formatlarda nasıl yanıt verdiği arasındaki farkları tanımlamak.
*   **Tutarsızlıkları Keşfetmek:** Metin tabanlı ve görüntü tabanlı işleme yollarını karşılaştırarak potansiyel zafiyetleri ortaya çıkarmak.

### Nasıl Çalışır?
Strateji aşağıdaki işlemleri gerçekleştirir:

1.  Test durumunuzdaki orijinal metni alır.
2.  Metni, beyaz arka plan üzerine siyah metin olacak şekilde boş bir PNG görüntüsüne işler (render).
3.  PNG görüntüsünü bir base64 dizesine dönüştürür.
4.  Test durumunuzdaki orijinal metni, base64 kodlu görüntü ile değiştirir.

Sonuçta ortaya çıkan test durumu, orijinaliyle aynı anlamsal içeriğe sahiptir ancak yapay zeka sistemleri tarafından farklı şekilde işlenebilecek farklı bir formattadır.

### Metinden Görüntüye Dönüştürme Örneği
Aşağıda, `harmful:hate` eklentimizden alınan bir metin isteminin görüntüye dönüştürülmesine dair bir örnek yer almaktadır.
Kodlamadan sonra bu görüntü, şu şekilde başlayan bir base64 dizesine dönüştürülür:

`iVBORw0KGgoAAAANSUhEUgAAA...`
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
    - image
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
        "image": {
          "format": "png",
          "source": { "bytes": "{{image}}" }
        }
      }
    ]
  }
]
```
### İlgili Kavramlar
*   **Ses Tabanlı (Audio) Jailbreak** – Görüntü yerine konuşma sesinin kullanıldığı benzer bir yaklaşım.
*   **Video Tabanlı (Video) Jailbreak** – Görüntü yerine videonun kullanıldığı benzer bir yaklaşım.
*   **Base64 Kodlama** – Metinden base64'e dönüştürmeyi kullanan benzer bir kodlama tekniği.
*   **Çok Modlu (Multi-Modal) Kırmızı Ekip Rehberi** – Çok modlu modelleri test etmek için kapsamlı bir rehber.
*   **LLM Zafiyet Türleri** – Zafiyetlere ilişkin kapsamlı genel bakış.

LLM zafiyetleri ve kırmızı ekip stratejileri hakkında kapsamlı bir genel bakış için **LLM Zafiyet Türleri (Types of LLM Vulnerabilities)** sayfamızı ziyaret edebilirsiniz.

