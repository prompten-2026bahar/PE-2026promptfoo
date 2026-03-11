---
title: Hız Sınırlamaları
description: Üstel geri çekme, başlık-bilincine sahip gecikmeler ve LLM sağlayıcı API'leri için uyarlanabilir eşzamanlılık ile otomatik hız sınırlama işlemeyi yapılandırın.
sidebar_label: Hız Sınırlamaları
sidebar_position: 15
---

# Hız Sınırlamaları

Promptfoo, LLM sağlayıcılarından gelen hız sınırlarını otomatik olarak işler. Bir sağlayıcı HTTP 429 veya benzer hız sınırlama hataları döndürdüğünde, istekler üssel geri çekme ile otomatik olarak yeniden denenir.

## Otomatik İşleme

Hız sınırlama işlemi değerlendiriciye yerleşiktir ve yapılandırma gerektirmez:

- **Otomatik yeniden deneme**: Başarısız istekler üssel geri çekme ile en fazla 3 kez yeniden denenir
- **Başlık-bilincine sahip gecikmeler**: Sağlayıcılardan `retry-after` başlıklarına uyar
- **Uyarlanabilir eşzamanlılık**: Hız sınırları vurulduğunda eşzamanlı istekleri azaltır
- **Sağlayıcı başına izolasyon**: Her sağlayıcı ve API anahtarı ayrı hız sınırlama takibi yapar

### Desteklenen Başlıklar

Promptfoo, büyük sağlayıcılardan hız sınırlama başlıklarını ayrıştırır:

| Sağlayıcı   | Başlıklar                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| OpenAI       | `x-ratelimit-remaining-requests`, `x-ratelimit-limit-requests`, `x-ratelimit-remaining-tokens`, `retry-after-ms` |
| Anthropic    | `anthropic-ratelimit-requests-remaining`, `anthropic-ratelimit-tokens-remaining`, `retry-after`                  |
| Azure OpenAI | `x-ratelimit-remaining-requests`, `retry-after-ms`, `retry-after`                                                |
| Genel        | `retry-after`, `ratelimit-remaining`, `ratelimit-reset`                                                          |

### Geçici Hata İşleme

Promptfoo, geçici sunucu hatalarıyla başarısız olan istekleri otomatik olarak yeniden dener:

| Durum Kodu | Açıklama            | Yeniden Deneme Koşulu                                  |
| ---------- | -------------------- | ------------------------------------------------------ |
| 502        | Geçersiz Ağ Geçidi   | Durum metni "bad gateway" içerir                       |
| 503        | Hizmet Kullanılamaz  | Durum metni "service unavailable" içerir               |
| 504        | Ağ Geçidi Zaman Aşımı| Durum metni "gateway timeout" içerir                   |
| 524        | Zaman Aşımı Oluştu   | Durum metni "timeout" içerir (Cloudflare'a özgü)       |

Bu hatalar üssel geri çekme ile (1s, 2s, 4s) en fazla 3 kez yeniden denenir. Durum metni kontrolü, kalıcı hataların (kimlik doğrulama hataları gibi 502 kullanan) yeniden denenmemesini sağlar.

### Uyarlanabilir Eşzamanlılık Nasıl Çalışır

Zamanlayıcı, verimi optimize etmek için AIMD'yi (Aditif Artış, Çarpımsal Azalma) kullanır:

1. Bir hız sınırlaması vurulduğunda, eşzamanlılık %50 azaltılır
2. Sürekli başarılı isteklerden sonra, eşzamanlılık 1 artırılır
3. Kalan kota %10'un altına düştüğünde (başlıklardan), eşzamanlılık proaktif olarak azaltılır

Bu, daha yüksek bir `maxConcurrency` ayarlamanıza ve promptfoo'nun optimum hızı otomatik olarak bulmasına olanak tanır.

## Yapılandırma

### Eşzamanlılık

Maksimum eşzamanlı istek sayısını kontrol edin:

```yaml
evaluateOptions:
  maxConcurrency: 10
```

Veya CLI aracılığıyla:

```bash
promptfoo eval --max-concurrency 10
```

Uyarlanabilir zamanlayıcı, hız sınırları karşılaşıldığında bunu azaltacaktır, ancak yapılandırılmış maksimumunuzu aşamaz.

### Sabit Gecikme

İstekler arasında sabit bir gecikme ekleyin (herhangi bir hız sınırlama geri çekmesine ek olarak):

```yaml
evaluateOptions:
  delay: 1000 # milliseconds
```

Veya CLI aracılığıyla:

```bash
promptfoo eval --delay 1000
```

Veya ortam değişkeni aracılığıyla:

```bash
PROMPTFOO_DELAY_MS=1000 promptfoo eval
```

### Geri Çekme Yapılandırması

Promptfoo'nun iki yeniden deneme katmanı vardır:

1. **Sağlayıcı düzeyi yeniden deneme** (zamanlayıcı): `callApi()`'yi 1 saniye temel geri çekme ile, en fazla 3 kez yeniden dener
2. **HTTP düzeyi yeniden deneme**: Başarısız HTTP isteklerini yapılandırılabilir geri çekme ile yeniden dener

Zamanlayıcı için ortam değişkenleri:

| Ortam Değişkeni                      | Açıklama                                      | Varsayılan |
| ------------------------------------ | --------------------------------------------- | ---------- |
| `PROMPTFOO_DISABLE_ADAPTIVE_SCHEDULER` | Uyarlanabilir eşzamanlılığı devre dışı bırak (sabit kullan) | false     |
| `PROMPTFOO_MIN_CONCURRENCY`          | Minimum eşzamanlılık (uyarlanabilir için taban) | 1         |
| `PROMPTFOO_SCHEDULER_QUEUE_TIMEOUT_MS`| Kuyruğa alınmış istekler için zaman aşımı (devre dışı bırakmak için 0) | 300000ms  |

HTTP düzeyi yeniden deneme için ortam değişkenleri:

| Ortam Değişkeni             | Açıklama                                 | Varsayılan |
| --------------------------- | ---------------------------------------- | ---------- |
| `PROMPTFOO_REQUEST_BACKOFF_MS` | HTTP yeniden deneme geri çekmesi için temel gecikme | 5000ms    |
| `PROMPTFOO_RETRY_5XX`       | HTTP 500 hatalarında yeniden dene         | false     |

Örnek:

```bash
PROMPTFOO_REQUEST_BACKOFF_MS=10000 PROMPTFOO_RETRY_5XX=true promptfoo eval
```

Zamanlayıcının yeniden denemesi çoğu hız sınırlamayı otomatik olarak işler. HTTP düzeyi yeniden deneme, ağ sorunları için ek dayanıklılık sağlar.

## Sağlayıcıya Özel Notlar

### OpenAI

OpenAI'nin istekler ve token'lar için ayrı hız sınırları vardır. Zamanlayıcı her ikisini de takip eder. Yüksek hacimli değerlendirmeler için:

```yaml
evaluateOptions:
  maxConcurrency: 20 # Gerekirse zamanlayıcı aşağı uyarlar
```

Ek seçenekler için [OpenAI sorun giderme](/docs/providers/openai#troubleshooting) bölümüne bakın.

### Anthropic

Anthropic hız sınırları genellikle dakikada olur. Zamanlayıcı, API'den `retry-after` başlıklarına uyar.

### Özel Sağlayıcılar

Özel sağlayıcılar, hatalar şunları içerdiğinde otomatik yeniden denemeyi tetikler:

- "429"
- "rate limit"
- "too many requests"

Yeniden deneme zamanlaması sağlamak için, yanıt meta verilerinizde başlıkları dahil edin:

```javascript
return {
  output: 'response',
  metadata: {
    headers: {
      'retry-after': '60', // seconds
    },
  },
};
```

## Hata Ayıklama

Hız sınırlama olaylarını görmek için hata ayıklama günlüğünü etkinleştirin:

```bash
LOG_LEVEL=debug promptfoo eval -c config.yaml
```

Günlüğe kaydedilen olaylar:

- `ratelimit:hit` - Hız sınırlaması karşılaşıldı
- `ratelimit:learned` - Başlıklardan keşfedilen sağlayıcı sınırları
- `ratelimit:warning` - Hız sınırlaması eşiğine yaklaşılıyor
- `concurrency:decreased` / `concurrency:increased` - Uyarlanabilir eşzamanlılık değişiklikleri
- `request:retrying` - Yeniden deneme devam ediyor

## En İyi Uygulamalar

1. **Daha yüksek eşzamanlılıkla başlayın** - `maxConcurrency`'yi istediğiniz verime ayarlayın; zamanlayıcı gerekirse aşağı uyarlar

2. **Önbellekleme kullanın** - Aynı istekleri yeniden çalıştırmaktan kaçınmak için [önbellekleme](/docs/configuration/caching) etkinleştirin

3. **Hata ayıklama günlüklerini izleyin** - Değerlendirmeler yavaşsa, sık `ratelimit:hit` olaylarını kontrol edin

4. **Sağlayıcı katmanlarını göz önünde bulundurun** - Daha yüksek API katmanları genellikle daha yüksek hız sınırlarına sahiptir; zamanlayıcı sağlayıcının izin verdiği her şeyi otomatik olarak kullanacaktır

## Otomatik İşlemeyi Devre Dışı Bırakma

Zamanlayıcı her zaman aktiftir ancak minimum ek yükü vardır. Tamamen deterministik davranış için (örneğin, testlerde), şunu kullanın:

```yaml
evaluateOptions:
  maxConcurrency: 1
  delay: 1000
```

Bu, istekler arasında sabit gecikmelerle sıralı yürütmeyi sağlar.