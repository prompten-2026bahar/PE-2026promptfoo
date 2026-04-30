# Best-of-N (BoN) Jailbreaking Stratejisi

Best-of-N (BoN), zararlı bir yanıt alınana kadar istemin (prompt) modaliteye özgü artırımlarla (augmentations) varyasyonlarını tekrar tekrar örnekleyerek çalışan, basit ama etkili bir "black-box" (kara kutu) jailbreak algoritmasıdır.

Hughes ve arkadaşları (2024) tarafından tanıtılan bu yöntem; metin, görüntü ve ses modalitelerinde yüksek saldırı başarı oranlarına ulaşır.

> [!TIP]
> Bu teknik yüksek saldırı başarı oranlarına (GPT-4o üzerinde %89 ve Claude 3.5 Sonnet üzerinde %78) ulaşsa da, bu başarıyı yakalamak genellikle çok sayıda örnekleme yapılmasını gerektirir.

Bunu `promptfooconfig.yaml` dosyanızda şu şekilde kullanabilirsiniz:

```yaml
# promptfooconfig.yaml
strategies:
  - id: best-of-n
    config:
      useBasicRefusal: false
      maxConcurrency: 3      # Maksimum eşzamanlı API çağrısı (varsayılan)
      nSteps: 10000          # Maksimum deneme sayısı (isteğe bağlı)
      maxCandidatesPerStep: 1 # Her adım başı maksimum aday sayısı (isteğe bağlı)
```
BoN Jailbreaking üç adımlı basit bir süreçle çalışır:

1.  **Varyasyon Oluşturma:** Modaliteye özgü artırımlar kullanarak giriş isteminin birden fazla versiyonunu oluşturur:
    *   **Metin:** Rastgele büyük harf kullanımı, karakter karıştırma, karakter gürültüsü.
    *   **Görüntü:** Yazı tipi varyasyonları, arka plan renkleri, metin konumlandırma.
    *   **Ses:** Hız, perde, ses seviyesi, arka plan gürültüsü modifikasyonları.
2.  **Eşzamanlı Test:** Hedef modele karşı aynı anda birden fazla varyasyonu test eder.
3.  **Başarı Tespiti:** Zararlı bir çıktı tespit edilene veya maksimum deneme sayısına ulaşılana kadar yanıtları izler.

Stratejinin etkinliği, LLM çıktılarının stokastik (rastlantısal) doğasından ve küçük girdi varyasyonlarına olan duyarlılıklarından yararlanmasından gelir.

## Yapılandırma Parametreleri

### `useBasicRefusal`
*   **Tür:** boolean
*   **Varsayılan:** false

Etkinleştirildiğinde, "LLM-as-a-judge" (yargıç olarak LLM) doğrulamaları yerine basit bir reddetme kontrolü kullanır. Bu, bir LLM yargıcı kullanmaktan çok daha hızlı ve ucuzdur; orijinal istemlerinize verilen tipik yanıtın bir reddetme olduğu durumlarda test yapmak için idealdir.

Orijinal istemlerinize verilen varsayılan yanıt "Üzgünüm, bunu yapamam" tarzı bir reddetme ise, bu ayarı kullanmanızı öneririz.

### `maxConcurrency`
*   **Tür:** number
*   **Varsayılan:** 3

Aynı anda test edilecek maksimum istem varyasyonu sayısı. Daha yüksek değerler işlem hacmini artırır. Bunu, hız limitlerinizin (rate limits) izin verdiği ölçüde yüksek tutmanızı öneririz.

### `nSteps`
*   **Tür:** number
*   **Varsayılan:** undefined

Vazgeçmeden önceki toplam maksimum deneme sayısı. Her adım `maxCandidatesPerStep` kadar varyasyon oluşturur. Yüksek değerler başarı oranını artırır ancak maliyeti de yükseltir. Orijinal makale, 10.000 adımda en iyi sonuçlara ulaşmıştır.

### `maxCandidatesPerStep`
*   **Tür:** number
*   **Varsayılan:** 1

Her partide (batch) oluşturulacak istem varyasyonu sayısı. Düşük değerler daha hassas kontrol sağlarken, yüksek değerler daha verimlidir ancak partinin başında başarılı bir varyasyon bulunursa API çağrılarını boşa harcayabilir.

Genellikle bunu 1'e ayarlayıp, başarılı bir jailbreak elde edene kadar `nSteps` değerini artırmak en iyisidir.

> [!TIP]
> Başlangıç testleri için `useBasicRefusal: true` ve nispeten düşük `nSteps` ve `maxCandidatesPerStep` değerleri ile başlamanızı öneririz. Bu, kapsamlı testlere geçmeden önce stratejinin kullanım durumunuz için etkinliğini hızlıca doğrulamanıza olanak tanır.

## Performans

BoN, farklı modellerde ve modalitelerde etkileyici saldırı başarı oranlarına (ASR) ulaşır:

*   **Metin:** GPT-4'te %89, Claude 3.5 Sonnet'te %78 (10.000 örnekleme ile)
*   **Görüntü:** GPT-4 Vision'da %56
*   **Ses:** GPT-4 Audio'da %72

Saldırı başarı oranı, örnek sayısıyla birlikte bir "güç yasası" (power-law) ölçeklemesi izler; yani daha fazla varyasyon test edildikçe güvenilir bir şekilde iyileşir. Bu durum, ASR karşılaştırmalarının neden deneme bütçesini hesaba katması gerektiğini gösterir: Deneme başına %1 başarı oranı olan bir yöntem, 392 denemede %98'e çıkar.

## Temel Özellikler

*   **Basit Uygulama:** Gradyanlara veya modelin iç yapısına ihtiyaç duymaz.
*   **Çoklu Modalite Desteği:** Metin, görüntü ve ses girişlerinde çalışır.
*   **Yüksek Derecede Paralelleştirilebilir:** Birden fazla varyasyonu eşzamanlı test edebilir.
*   **Öngörülebilir Ölçeklendirme:** Başarı oranı güç yasası davranışını izler.

## İlgili Kavramlar

*   **GOAT Stratejisi**
*   **Yinelemeli (Iterative) Jailbreak'ler**
*   **Çok Turlu (Multi-turn) Jailbreak'ler**
*   **Best of N Yapılandırma Örneği**

LLM zafiyetleri ve "red teaming" stratejileri hakkında kapsamlı bir genel bakış için [LLM Zafiyet Türleri](Types of LLM Vulnerabilities) sayfamızı ziyaret edin.
