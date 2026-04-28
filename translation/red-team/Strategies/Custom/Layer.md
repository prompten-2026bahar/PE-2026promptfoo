### Katman (Layer) Stratejisi
Katman (Layer) stratejisi, birden fazla kırmızı ekip stratejisini sıralı bir şekilde birleştirmenize (compose) olanak tanır. Bir stratejinin çıktısını bir sonrakine besleyerek, gelişmiş saldırı zincirleri oluşturmanızı sağlar. Bu; birden fazla kodlama katmanı uygulamak veya ajan tabanlı saldırıları çok modlu (multi-modal) çıktılarla (ses/görüntü) birleştirmek gibi karmaşık dönüşümlere imkan tanır.

### Hızlı Başlangıç
Birden fazla stratejiyi sırayla uygulayın:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        steps:
          - base64 # Önce base64 olarak kodla
          - rot13  # Sonra ROT13 uygula
```
### Nasıl Çalışır?
Katman (Layer) stratejisi, dahil ettiğiniz adımların türüne bağlı olarak iki farklı modda çalışır:

#### Mod 1: Dönüşüm Zinciri (Ajan Olmayan Adımlar)
Tüm adımlar dönüşümlerden (`base64`, `rot13`, `leetspeak` vb.) oluştuğunda, katman basit bir iş hattı (pipeline) görevi görür:

*   **Sıralı İşleme:** Her adım, bir önceki adımın çıktısını girdi olarak alır.
*   **Kümülatif Dönüşüm:** Değişiklikler üst üste biner (örneğin; metin → base64 → rot13).
*   **Sadece Final Çıktısı:** Sadece son adımın çıktıları test durumu (test case) haline gelir.
*   **Değerlendirme Öncesi:** Tüm dönüşümler, hedefe gönderilmeden önce uygulanır.

#### Mod 2: Ajan + Tur Başına Dönüşümler
İlk adım bir ajan stratejisi (`hydra`, `crescendo`, `goat`, `jailbreak` vb.) olduğunda, katman tur başına dönüşümler içeren güçlü çok turlu/çok denemeli saldırılar sağlar:

*   **Ajan Orkestrasyonu:** Ajan stratejisi saldırı döngüsünü kontrol eder.
*   **Tur Başına Dönüşümler:** Geri kalan adımlar (örneğin; `audio`, `image`) her tura dinamik olarak uygulanır.
*   **Çok Modlu Saldırılar:** Konuşma tabanlı saldırıları sesli veya görüntülü iletimle birleştirir.

```yaml
# promptfooconfig.yaml
providers:
  - id: openai:chat:gpt-4o-audio-preview
    config:
      modalities: ['text', 'audio']
      audio:
        voice: 'alloy'
        format: 'mp3'

prompts:
  - |
    [{"role": "user", "content": [{"type": "input_audio", "input_audio": {"data": "{{prompt}}", "format": "mp3"}}]}]

redteam:
  purpose: 'Yardımcı bir müşteri hizmetleri asistanı'
  plugins:
    - harmful:hate
  strategies:
    - id: layer
      config:
        steps:
          - id: jailbreak
            config:
              maxIterations: 2
          - audio
```
### Sıralama Kuralları
Ajan (agentic) stratejileri (`hydra`, `crescendo`, `goat`, `jailbreak`) her zaman **en başta** yer almalıdır (en fazla 1 adet). Çok modlu (multi-modal) stratejiler (`audio`, `image`) ise her zaman **en sonda** bulunmalıdır (en fazla 1 adet). Metin dönüşümleri (`base64`, `rot13`, `leetspeak`) ise araya zincirlenebilir.

#### Geçerli Kalıplar
```yaml
# Dönüşüm zinciri (ajan yok)
steps: [base64, rot13]

# Dönüşüm + çok modlu
steps: [leetspeak, audio]

# Sadece ajan
steps: [jailbreak:hydra]

# Ajan + çok modlu (ses/görüntü hedefleri için önerilir)
steps: [jailbreak:hydra, audio]
```
#### Geçersiz Kalıplar
```yaml
# ❌ Yanlış: Ajan stratejisi ilk sırada değil (dönüşümler hedefi bozacaktır)
steps: [base64, jailbreak:hydra]

# ❌ Yanlış: Çok modlu strateji son sırada değil
steps: [audio, base64]

# ❌ Yanlış: Birden fazla ajan stratejisi kullanılmış
steps: [hydra, crescendo]

# ❌ Yanlış: Birden fazla çok modlu strateji kullanılmış
steps: [audio, image]
```
### Yapılandırma Seçenekleri

#### Etiket (Birden Fazla Katman Stratejisi İçin)
Aynı yapılandırma dosyasındaki birden fazla katman stratejisini birbirinden ayırt etmek için `label` alanını kullanın:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    # Benzersiz etiketlere sahip birden fazla katman stratejisi
    - id: layer
      config:
        label: hydra-audio # Benzersiz tanımlayıcı
        steps:
          - jailbreak:hydra
          - audio

    - id: layer
      config:
        label: crescendo-audio # Farklı etiket = farklı strateji
        steps:
          - crescendo
          - audio
```
Etiketler (labels) kullanılmadığında, katman (layer) stratejileri içerdikleri adımlara (steps) göre tekilleştirilir. Etiket kullanıldığında ise, her bir etiketli katman ayrı bir strateji olarak işlenir.

### Temel Yapılandırma
Yerleşik stratejiler için basit dize tabanlı adımlar kullanılır:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        steps:
          - base64     # Basit strateji referansı
          - leetspeak  # Bir başka basit strateji
          - rot13      # Final dönüşümü
```
### Gelişmiş Yapılandırma
Bireysel yapılandırmalara sahip nesne tabanlı adımlar:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        steps:
          # Özel yapılandırmaya sahip adım
          - id: jailbreak
            config:
              maxIterations: 10

          # Basit adım
          - hex

          # Özel strateji betiği (script)
          - id: file://custom-obfuscator.js
            config:
              intensity: high
```
### Adım Bazlı Eklenti Hedefleme
Her bir adımın hangi eklentilere uygulanacağını kontrol edin:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        plugins: ['harmful', 'pii'] # Tüm adımlar için varsayılan
        steps:
          # Belirli bir adım için geçersiz kılma
          - id: jailbreak
            config:
              plugins: ['harmful'] # Sadece harmful eklentisine uygula

          # Üst yapılandırmadaki (parent config) varsayılan eklentileri kullanır
          - rot13

          # Farklı eklenti kümesi
          - id: base64
            config:
              plugins: ['pii', 'contracts']
```
### Örnek Senaryolar

#### Çok Turlu Ses Saldırısı
Ses özelliği etkinleştirilmiş yapay zeka ajanlarını gelişmiş jailbreak girişimleriyle test edin:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        steps:
          - jailbreak:hydra # Çok turlu (multi-turn) jailbreak
          - audio           # Her turu konuşma sesine dönüştür
```
Hydra saldırıyı orkestra edecek ve her turun istemi, hedefinize gönderilmeden önce sese dönüştürülecektir. Özel sağlayıcınız (custom provider), konuşma geçmişini (metin olarak) ve mevcut turu (ses olarak) içeren hibrit bir veri yükü (payload) alacaktır.

#### Çok Turlu Görüntü Saldırısı
Görüntü işleme yeteneğine sahip yapay zeka ajanlarını test edin:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        steps:
          - crescendo # Kademeli tırmandırma saldırısı
          - image     # Her turu görüntüye dönüştür
```
#### Tek Turlu Ses Saldırısı
Çok denemeli stratejiler için (`jailbreak`, `jailbreak:meta`, `jailbreak:tree`), her bir bağımsız deneme ses dosyasına dönüştürülür:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        steps:
          - jailbreak:meta # Meta-ajan saldırı varyantları oluşturur
          - audio # Her bir varyant sese dönüştürülür
```
#### Çift Kodlamalı Saldırı
Tespiti atlatmak için birden fazla kodlama katmanı uygulayın:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        steps:
          - hex # Önce onaltılık (hexadecimal) olarak kodla
          - base64 # Sonra base64 olarak kodla
```
#### Kademeli Gizleme (Progressive Obfuscation)
Maksimum gizleme sağlamak için birden fazla kodlama tekniğini üst üste ekleyin:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        steps:
          - leetspeak # Önce leetspeak uygula
          - hex       # Sonra hex olarak kodla
          - base64    # Son olarak base64 olarak kodla
```
#### Enjeksiyon Zinciri
İstem enjeksiyonunu (prompt injection) kodlama ile birleştirin:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        steps:
          - prompt-injection # Enjeksiyon yüklerini ekle
          - rot13            # Enjeksiyonu gizle (obfuscate)
```
### Özel Strateji İş Hattı (Pipeline)
İş hattınızda özel betikler (scripts) kullanın:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    - id: layer
      config:
        steps:
          - file://strategies/add-context.js  # Bağlam ekleyen özel betik
          - base64                           # Standart base64 kodlama
          - file://strategies/final-transform.js # Son dönüşüm betiği
```
### Ses/Görüntü Hedefleri İçin Özel Sağlayıcı (Custom Provider)
`layer` stratejisini ses veya görüntü dönüşümleriyle birlikte kullandığınızda, özel sağlayıcınız hibrit bir JSON veri yükü (payload) alır. Bunu şu şekilde yönetebilirsiniz:

**audio-provider.js**
```javascript
class AudioProvider {
  id() {
    return 'audio-target';
  }

  async callApi(prompt) {
    let messages = [];

    // Layer stratejisinden gelen hibrit veri yükünü kontrol et
    if (typeof prompt === 'string' && prompt.startsWith('{')) {
      try {
        const parsed = JSON.parse(prompt);
        if (parsed._promptfoo_audio_hybrid) {
          // Konuşma geçmişinden (metin) mesajları oluştur
          messages = (parsed.history || []).map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

          // Mevcut turu ses veya görüntü ile ekle
          const currentTurn = parsed.currentTurn;
          if (currentTurn?.audio?.data) {
            messages.push({
              role: currentTurn.role,
              content: [
                {
                  type: 'input_audio',
                  input_audio: {
                    data: currentTurn.audio.data,
                    format: currentTurn.audio.format || 'mp3',
                  },
                },
              ],
            });
          } else if (currentTurn?.image?.data) {
            messages.push({
              role: currentTurn.role,
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/${currentTurn.image.format || 'png'};base64,${currentTurn.image.data}`,
                  },
                },
              ],
            });
          }
        }
      } catch (e) {
        // Hata durumunda düz metin olarak işlemeye geri dön
        messages = [{ role: 'user', content: prompt }];
      }
    }

    // Ses yeteneği olan API'nizi çağırın (Örn: OpenAI gpt-4o-audio-preview)
    const response = await yourApiCall(messages);

    return {
      output: response.text,
      audio: response.audio
        ? {
            data: response.audio.data,
            transcript: response.audio.transcript,
            format: 'mp3',
          }
        : undefined,
    };
  }
}

module.exports = AudioProvider;
```
### Ses/Görüntü Hedefleri İçin Özel Sağlayıcı (Custom Provider)
`layer` stratejisini ses veya görüntü dönüşümleriyle birlikte kullandığınızda, özel sağlayıcınız hibrit bir JSON veri yükü (payload) alır. Bunu şu şekilde yönetebilirsiniz:

**audio-provider.js**
```javascript
class AudioProvider {
  id() {
    return 'audio-target';
  }

  async callApi(prompt) {
    let messages = [];

    // Layer stratejisinden gelen hibrit veri yükünü kontrol et
    if (typeof prompt === 'string' && prompt.startsWith('{')) {
      try {
        const parsed = JSON.parse(prompt);
        if (parsed._promptfoo_audio_hybrid) {
          // Konuşma geçmişinden (metin) mesajları oluştur
          messages = (parsed.history || []).map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

          // Mevcut turu ses veya görüntü ile ekle
          const currentTurn = parsed.currentTurn;
          if (currentTurn?.audio?.data) {
            messages.push({
              role: currentTurn.role,
              content: [
                {
                  type: 'input_audio',
                  input_audio: {
                    data: currentTurn.audio.data,
                    format: currentTurn.audio.format || 'mp3',
                  },
                },
              ],
            });
          } else if (currentTurn?.image?.data) {
            messages.push({
              role: currentTurn.role,
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/${currentTurn.image.format || 'png'};base64,${currentTurn.image.data}`,
                  },
                },
              ],
            });
          }
        }
      } catch (e) {
        // Hata durumunda düz metin olarak işlemeye geri dön
        messages = [{ role: 'user', content: prompt }];
      }
    }

    // Ses yeteneği olan API'nizi çağırın (Örn: OpenAI gpt-4o-audio-preview)
    const response = await yourApiCall(messages);

    return {
      output: response.text,
      audio: response.audio
        ? {
            data: response.audio.data,
            transcript: response.audio.transcript,
            format: 'mp3',
          }
        : undefined,
    };
  }
}

module.exports = AudioProvider;
```
### Performans Değerlendirmeleri

#### Test Durumu Çoğalması
Stratejileri birleştirirken test durumlarının artışına dikkat edin:

*   Bazı stratejiler test vakalarını katlayabilir (örneğin; global `language: ['en', 'es', 'fr']` ayarı yapılırsa tüm test vakaları 3 ile çarpılır).
*   Katmanlı stratejiler sıralı işlendiğinden, test sayısı artışı genellikle doğrusaldır.
*   Aşırı değerlendirme süresinden kaçınmak için test sayılarınızı buna göre planlayın.

#### Optimizasyon İpuçları
*   **Sıralama Önemlidir:** Filtreleme stratejilerini erkene, genişletme stratejilerini sona yerleştirin.
*   **Gereksiz Tekrardan Kaçının:** Aynı stratejiyi hem katman içinde hem de en üst düzeyde kullanmayın.
*   **Önce Küçük Testler Yapın:** Ölçeklendirmeden önce küçük bir alt küme ile doğrulayın.
*   **Belleği İzleyin:** Çok sayıda adım içeren karmaşık katmanlar önemli ölçüde bellek tüketebilir.

### Uygulama Notları
*   **Boş Adım Yönetimi:** Herhangi bir adım test durumu döndürmezse, sonraki adımlar boş bir dizi alır.
*   **Hata Yönetimi:** Başarısız adımlar günlüğe kaydedilir ve atlanır; iş hattı (pipeline) devam eder.
*   **Meta Veri Koruma:** Her adım, test durumu meta verilerini korur ve genişletir.
*   **Strateji Çözümleme:** Hem yerleşik stratejileri hem de `file://` tabanlı özel stratejileri destekler.

### İpuçları ve En İyi Pratikler
*   **Önce Ajan:** Ajan stratejilerini dönüşümlerle birleştirirken her zaman ajan stratejisini ilk sıraya koyun.
*   **En Son Çok Modlu:** Ses (audio) ve görüntü (image) dönüşümleri her zaman son adım olmalıdır.
*   **Mantıklı Kombinasyonlar:** Anlamsal olarak birbirini tamamlayan stratejileri üst üste ekleyin.
*   **Kademeli Hata Ayıklama:** Birleştirmeden önce her adımı tek tek test edin.
*   **Karmaşık Katmanları Belgeleyin:** Saldırı zinciri mantığını açıklayan yorumlar ekleyin.
*   **Hedef Modelleri Düşünün:** Ses/görüntü hedefleri için uygun çok modlu adımlar kullanın.
*   **Eklenti Hedeflemeyi Kullanın:** Farklı adımları farklı zafiyet türlerine odaklayın.
*   **Özel Sağlayıcı Gerekli:** Ses/görüntü saldırıları, hibrit veri yükü formatını işleyebilen özel bir sağlayıcı gerektirir.

### Desteklenen Ajan Stratejileri
Aşağıdaki stratejiler, tur başına dönüşümlerle birlikte ilk adım olarak kullanılabilir:


| Strateji | Tür | Açıklama |
| :--- | :--- | :--- |
| **jailbreak:hydra** | Çok Turlu | Dallanan konuşma saldırısı |
| **crescendo** | Çok Turlu | Kademeli tırmandırma saldırısı |
| **goat** | Çok Turlu | Hedef odaklı düşmanca test |
| **custom** | Çok Turlu | Özel çok turlu strateji |
| **jailbreak** | Çok Denemeli | Yinelemeli tek turlu denemeler |
| **jailbreak:meta** | Çok Denemeli | Meta-ajan saldırı üretimi |
| **jailbreak:tree** | Çok Denemeli | Ağaç tabanlı saldırı araması |
### İlgili Kavramlar
*   **Ses (Audio) Stratejisi** – Metinden konuşmaya (TTS) dönüştürme.
*   **Görüntü (Image) Stratejisi** – Metinden görüntüye dönüştürme.
*   **Hydra Stratejisi** – Çok turlu jailbreak saldırıları.
*   **ROT13** – Basit şifreleme kodlaması.
*   **Base64** – Yaygın kodlama tekniği.
*   **Özel Strateji Betikleri** – Kendi stratejilerinizi oluşturun.
*   **Kırmızı Ekip Stratejileri** – Tüm stratejilere genel bakış.
