# Jailbreak Şablonları Stratejisi (Jailbreak Templates)

Jailbreak Şablonları stratejisi, 2022-2023 dönemine ait yöntemlerden derlenmiş statik şablon kütüphanesini kullanarak, büyük dil modellerinin bilinen çeşitli tekniklere karşı direncini test etmek için tasarlanmıştır.

> [!NOTE]
> Bu stratejinin adı daha önce `prompt-injection` idi. Statik şablonları uygulama işlevini daha iyi yansıtması için adı değiştirildi. Eski isim olan `prompt-injection` hâlâ çalışmaktadır ancak kullanımdan kaldırılmıştır.

## Bu Strateji Ne Yapar?
Bu strateji, test senaryolarına 67 adet statik şablon uygular. Bu şablonlar şunları içerir:

*   **Skeleton Key** – Güvenlik filtrelerini test etmek için eğitici bağlam çerçevelemesi.
*   **DAN (Do Anything Now)** – Kısıtlamasız bir sistem gibi rol yapma simülasyonu.
*   **Geliştirici Modu (Developer Mode)** – Sınırlamaları olmayan bir sürümü simüle etme yöntemi.
*   **OPPO** – Zıt yanıt verme tekniği.
*   **Diğerleri** – Kimlik tabanlı ve bağlam manipülasyonuna dayalı diğer test yöntemleri.

## Bu Strateji Ne YAPMAZ?
Bu strateji, aşağıdakiler gibi modern istem enjeksiyonu tekniklerini kapsamaz:

*   **Özel belirteç enjeksiyonu** (`<|im_end|>`, `[INST]`, `<system>`, vb.)
*   **Yapılandırılmış veri enjeksiyonu** (JSON/XML manipülasyonu)
*   **Gelişmiş kodlama saldırıları**
*   **Sınırlayıcı (delimiter) saldırıları**
*   **Dolaylı veya çok turlu enjeksiyonlar**
*   **Fonksiyon/Araç çağırma istismarları**

Kapsamlı güvenlik testleri için şu alternatiflerin kullanılması mümkündür:
*   `jailbreak`: Uyarlanabilir test yöntemleri.
*   `jailbreak:composite`: Çok teknikli test yaklaşımları.
*   `indirect-prompt-injection`: Dolaylı enjeksiyon eklentileri.
*   `base64`, `rot13`, `leetspeak`: Kodlama tabanlı stratejiler.

## Yapılandırma
Bu stratejiyi `promptfooconfig.yaml` dosyasına eklemek için şu yapı kullanılır:

```yaml
# promptfooconfig.yaml
strategies:
  - jailbreak-templates
```
## Birden Fazla Şablon Örnekleme

Varsayılan olarak, her test senaryosu için bir şablon uygulanır. Birden fazla şablonu test etmek için:

```yaml
# promptfooconfig.yaml
strategies:
  - id: jailbreak-templates
    config:
      sample: 10
```
Bu durumun test sayısı üzerinde çarpan etkisi vardır. Her bir test senaryosu × örnekleme sayısı = toplam test sayısı.

## Sadece Zararlı Eklentilerle Sınırlandırma
Zaman ve maliyet tasarrufu sağlamak için stratejiyi sadece zararlı içerik eklentileriyle sınırlandırabilirsiniz:

```yaml
# promptfooconfig.yaml
strategies:
  - id: jailbreak-templates
    config:
      sample: 5
      harmfulOnly: true
```
## Nasıl Çalışır?

*   Eklentiler (plugins) tarafından oluşturulan orijinal test senaryolarını alır.
*   Her test senaryosunun başına bir "jailbreak" şablon metni ekler.
*   Bu değiştirilmiş istemlerin yapay zeka sisteminin güvenlik kontrollerini atlatıp atlatmadığını test eder.

## Bu Strateji Ne Zaman Kullanılmalı?

Şu durumlarda bu stratejiyi kullanın:

*   Bilinen/belgelenmiş "jailbreak" tekniklerine karşı test yaparken.
*   Modelinizin yaygın "jailbreak" yöntemlerine direnecek şekilde eğitilip eğitilmediğini kontrol ederken.
*   Düşük hesaplama maliyetiyle hızlı temel (baseline) testler çalıştırırken.

Şu durumlarda diğer stratejileri değerlendirin:

*   Uyarlanabilir (adaptive) ve modele özgü saldırılara karşı test yaparken.
*   Modern istem enjeksiyonu (prompt injection) vektörlerini değerlendirirken.
*   Otonom (agentic) veya araç kullanan uygulamaları test ederken.

## Geriye Dönük Uyumluluk

Eski strateji adı olan `prompt-injection` hâlâ çalışır ancak bir kullanımdan kaldırma (deprecation) uyarısı gösterir:

```yaml
# Kullanımdan kaldırıldı - hâlâ çalışır ancak önerilmez
strategies:
  - prompt-injection

# Önerilen
strategies:
  - jailbreak-templates
```
## İlgili Stratejiler

*   **Yinelemeli (Iterative) Jailbreak** – Yapay zeka tarafından oluşturulan uyarlanabilir saldırılar
*   **Birleşik (Composite) Jailbreak** – Çoklu teknik içeren saldırılar
*   **Ağaç (Tree) Jailbreak** – Ağaç arama optimizasyonu

LLM zafiyetlerine ilişkin kapsamlı bir genel bakış için [LLM Zafiyet Türleri](Types of LLM Vulnerabilities) sayfasını ziyaret edin.
