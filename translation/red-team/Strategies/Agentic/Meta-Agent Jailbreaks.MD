# Meta-Ajan Jailbreak Stratejisi (Meta-Agent Jailbreaks)

Meta-Ajan Jailbreak stratejisi (`jailbreak:meta`), sisteminizin uyarlanabilir saldırılara karşı direncini test etmek için stratejik karar alma mekanizmalarını kullanır.

Tek bir istemi (prompt) iyileştiren standart yinelemeli yaklaşımların aksine, meta-ajan özel bir yaklaşım taksonomisi oluşturur ve stratejisini hedefinizin yanıtlarına göre dinamik olarak uyarlar.

## Uygulama
Bunu `promptfooconfig.yaml` dosyanıza ekleyin:

```yaml
# promptfooconfig.yaml
strategies:
  # Temel kullanım
  - jailbreak:meta

  # Yapılandırma ile kullanım
  - id: jailbreak:meta
    config:
      # İsteğe bağlı: Denenecek yineleme sayısı (varsayılan: 10)
      numIterations: 50
```
Yineleme sayısını bir ortam değişkeni (environment variable) aracılığıyla da geçersiz kılabilirsiniz:
```yaml
PROMPTFOO_NUM_JAILBREAK_ITERATIONS=5
```
## Nasıl Çalışır?

Meta-ajan, farklı saldırı yaklaşımlarını sistematik olarak keşfetmek için yinelemeler boyunca bir bellek tutar. Bir yaklaşım türü başarısız olduğunda, aynı kalıbı rafine etmeye devam etmek yerine temelden farklı tekniklere yönelir.

Bu durum, daha fazla API çağrısı maliyetiyle potansiyel zafiyetlerin daha geniş bir kapsamda taranmasını sağlar. Standart jailbreak tek bir yaklaşımı defalarca rafine ederken, meta-ajan zayıflıkları bulmak için birden fazla farklı yaklaşımı keşfeder.

### Meta-Ajan vs Standart Jailbreak


| Özellik | Meta-Ajan | Standart Yinelemeli |
| :--- | :--- | :--- |
| **Yaklaşım** | Çok sayıda farklı saldırı türünü keşfeder | Tek bir yaklaşımın varyasyonlarını rafine eder |
| **Kapsam** | Geniş - farklı saldırı kategorilerini test eder | Derin - tek bir yaklaşımı tüketene kadar dener |
| **Maliyet** | Daha yüksek (daha çeşitli denemeler) | Daha düşük (odaklanmış rafine etme) |
| **En İyi Kullanım** | Güçlü sistemlerdeki herhangi bir zafiyeti bulmak | Belirli saldırı kalıplarını test etmek |

Meta-ajan; bir zafiyet bulduğunda, hedefin güvenli olduğuna karar verdiğinde veya maksimum yineleme sayısına ulaştığında durur.
## Ne Zaman Kullanılmalı?

Şu durumlarda **jailbreak:meta** kullanın:

*   Saldırı türlerinin kapsamlı bir şekilde taranmasına ihtiyaç duyduğunuz üretim sistemlerini test ederken.
*   Güvenlik bariyerleriniz bariz yaklaşımları engelliyor ancak alternatif saldırı açılarını kaçırıyor olabileceği durumlarda.
*   Maliyetin, tüm potansiyel zafiyetleri bulmaktan daha az kritik olduğu durumlarda.

Şu durumlarda **standart jailbreak** kullanın:

*   API maliyetinin birincil endişe olduğu büyük ölçekli testler çalıştırırken.
*   Henüz gelişmiş savunmaları olmayan erken aşama sistemleri test ederken.
*   Bulut erişimi (cloud access) mevcut olmadığında.

## İlgili Kavramlar

*   **Yinelemeli (Iterative) Jailbreak'ler** – Ardışık rafine etme yaklaşımı.
*   **Hydra Multi-turn** – Tarama çapında belleğe sahip, çok turlu dallanan ajan.
*   **Ağaç Tabanlı (Tree-based) Jailbreak'ler** – Dallanan keşif stratejisi.
*   **Prompt Injections** – Doğrudan enjeksiyon teknikleri.
*   **Çok Turlu (Multi-turn) Jailbreak'ler** – Konuşma tabanlı saldırılar.

LLM zafiyetleri ve "red teaming" stratejileri hakkında kapsamlı bir genel bakış için [LLM Zafiyet Türleri](Types of LLM Vulnerabilities) sayfamızı ziyaret edin.
