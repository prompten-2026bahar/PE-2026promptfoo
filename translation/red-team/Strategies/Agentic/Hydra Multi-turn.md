# Hydra Çok Turlu Strateji (Hydra Multi-turn)

Hydra stratejisi (`jailbreak:hydra`), hedef sisteminizden gelen her yanıta uyum sağlayan çok turlu bir saldırgan ajan çalıştırır. Yapılandırılmış bir bellek tutar, geçmiş denemeleri değerlendirir ve doğrudan yol başarısız olduğunda yeni saldırı yaklaşımlarına dallanır.

Tek bir veri yükünün (payload) varyasyonlarını yeniden deneyen tek turlu jailbreak'lerin aksine Hydra, önceki turlar hakkında sürekli akıl yürütür, taze bağlamla yeniden dener ve aynı taramadaki her testte edindiği öğrenimleri paylaşır.

## Uygulama
Çok turlu uyarlanabilir testi etkinleştirmek için stratejiyi `promptfooconfig.yaml` dosyanıza ekleyin:

```yaml
# promptfooconfig.yaml
redteam:
  strategies:
    # Temel kullanım
    - jailbreak:hydra

    # Yapılandırma ile kullanım
    - id: jailbreak:hydra
      config:
        # İsteğe bağlı: Hydra durmadan önceki maksimum tur sayısı (varsayılan: 10)
        maxTurns: 12
        # İsteğe bağlı: Durum bilgisi olmayan (stateless) modda reddetmelerden sonra kaç kez geri takip yapılacağı (varsayılan: 10)
        maxBacktracks: 5
        # İsteğe bağlı: Hedefiniz her istekte oturum durumu bekliyorsa true olarak ayarlayın
        stateful: false
```

Çevirmemi istediğiniz **nasıl çalışır** bölümü veya **farklı bir yapılandırma** detayı var mı?
## Yapılandırma Seçenekleri


| Seçenek | Varsayılan | Açıklama |
| :--- | :--- | :--- |
| **maxTurns** | 10 | Hydra'nın durmadan önce hedefle gerçekleştireceği maksimum konuşma turu sayısı. Daha derin keşifler için bu değeri artırın. |
| **maxBacktracks** | 10 | Hydra'nın bir reddetme tespit ettiğinde son turu kaç kez geri alabileceği (roll back). `stateful: true` olduğunda otomatik olarak 0'a ayarlanır. |
| **stateful** | false | `true` olduğunda, Hydra oturum tanımlayıcısıyla birlikte yalnızca en son turu gönderir. Hedefiniz her seferinde tüm konuşma geçmişini bekliyorsa `false` (durum bilgisi olmayan mod) olarak bırakın. |
## Nasıl Çalışır?

*   **Hedef Belirleme:** Hydra, red team hedefini eklenti meta verilerinden veya enjekte edilen değişkenden çeker.
*   **Ajan Karar Mekanizması:** Promptfoo Cloud'daki koordinatör ajan, önceki turları değerlendirir ve bir sonraki saldırı mesajını seçer.
*   **Hedef Sorgulama:** Seçilen mesaj (durumlu veya durumsuz olarak) işlenir ve hedef sağlayıcınıza gönderilir.
*   **Sonuç Puanlama:** Yanıtlar, yapılandırılan eklenti doğrulamalarıyla (assertions) puanlanır ve daha sonraki öğrenimler için saklanır.
*   **Uyarlanabilir Dallanma:** Reddetme durumunda Hydra, başarılı olana, `maxBacktracks` sınırını tüketene veya `maxTurns` değerine ulaşana kadar geri takip yapar ve alternatif dalları keşfeder.

Hydra, tarama bazlı bir bellek tutar; böylece daha sonraki test senaryoları, çalışmanın başlarında keşfedilen başarılı taktikleri yeniden kullanabilir.
### Hydra ve Diğer Ajan Tabanlı Stratejilerin Karşılaştırması


| Strateji | Tur Modeli | En İyi Kullanım Alanı | Maliyet Profili |
| :--- | :--- | :--- | :--- |
| **jailbreak** | Tek Turlu | Hızlı temel çizgiler, düşük maliyet | Düşük |
| **jailbreak:meta** | Yinelemeli Taksonomi | Geniş kapsamlı tek seferlik (single-shot) testler | Orta |
| **jailbreak:hydra** | Çok Turlu Dallanma | Durumlu (stateful) ajanlar, atlatmacı savunmalar | Yüksek |
### Hydra Ne Zaman Kullanılmalı?
*   Ürününüz, durum bilgisi koruyan (stateful) davranışlara sahip bir konuşma botu veya ajan iş akışı sunuyorsa.
*   Güvenlik bariyerleri (guardrails) basit jailbreak girişimlerini engelliyorsa ve strateji değiştirebilen (pivot) bir saldırgana ihtiyaç duyuyorsanız.
*   Tüm tarama süreci boyunca elde edilen kazanımları yeniden kullanmak istiyorsanız (örneğin; kurum genelindeki büyük kırmızı ekip -red team- operasyonlarında).
*   Hydra; grader'lar aracılığıyla somut hata koşullarını tanımlayan `harmful`, `pii` veya `rbac` gibi eklenti paketleriyle eşleştirildiğinde en yüksek verimi sağlar.

### İlgili Kavramlar
*   **Yinelemeli (Iterative) Jailbreak'ler** – Temel tek turlu optimizasyon stratejisi.
*   **Meta-Ajan Jailbreak'leri** – Karmaşık tek turlu saldırılar için stratejik taksonomi oluşturucu.
*   **Çok Turlu (Multi-turn) Jailbreak'ler** – Konuşma tabanlı saldırgan ajanlara genel bakış.
*   **Ağaç Tabanlı (Tree-based) Jailbreak'ler** – Çok turlu etkileşim olmadan dallanarak keşif yapma yöntemi.
