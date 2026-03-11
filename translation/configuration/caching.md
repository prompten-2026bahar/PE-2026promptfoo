---
sidebar_position: 41
sidebar_label: Önbellekleme
title: Önbellekleme Yapılandırması - Performans Optimizasyonu
description: Daha hızlı LLM değerlendirmeleri için önbelleklemeyi yapılandırın. Ön bellek stratejileri, depolama seçenekleri ve hızlı test iş akışları için performans optimizasyonunu öğrenin.
keywords:
  [
    LLM önbellekleme,
    performans optimizasyonu,
    değerlendirme hızı,
    ön bellek yapılandırması,
    yanıt önbellekleme,
    test verimliliği,
  ]
pagination_prev: configuration/chat
pagination_next: configuration/telemetry
---

# Önbellekleme

promptfoo, LLM sağlayıcılarına yapılan API çağrılarının sonuçlarını zaman ve maliyet tasarrufu sağlamak için önbelleğe alır.

Ön bellek, disk tabanlı depolama için [`cache-manager`](https://www.npmjs.com/package/cache-manager/) tarafından [`keyv`](https://www.npmjs.com/package/keyv) ve [`keyv-file`](https://www.npmjs.com/package/keyv-file) ile yönetilir. Varsayılan olarak, promptfoo disk tabanlı depolama (`~/.promptfoo/cache`) kullanır.

## Önbellekleme Nasıl Çalışır

### Ön Bellek Anahtarları

Ön bellek girdileri şunları içeren bileşik anahtarlar kullanılarak depolanır:

- Sağlayıcı tanımlayıcısı
- İstem içeriği
- Sağlayıcı yapılandırması
- Bağlam değişkenleri (uygun olduğunda)

Örneğin:

```js
// OpenAI - model, mesajlar, ayarlar
`gpt-5:${JSON.stringify({
  "messages": [...],
  "temperature": 0
})}`

// HTTP - URL ve istek detayları
`fetch:v2:https://api.example.com/v1/chat:${JSON.stringify({
  "method": "POST",
  "body": {...}
})}`
```

### Ön Bellek Davranışı

- Başarılı API yanıtları tam yanıt verileriyle önbelleğe alınır
- Hata yanıtları yeniden deneme girişimlerine izin vermek için önbelleğe alınmaz
- Ön bellek otomatik olarak geçersiz kılınır:
  - TTL süresi dolduğunda (varsayılan: 14 gün)
  - Ön bellek manuel olarak temizlendiğinde
- `NODE_ENV=test` olduğunda bellek depolama otomatik olarak kullanılır

## Komut Satırı

Komut satırını kullanıyorsanız, ön belleği devre dışı bırakmak için `promptfoo eval` komutunu `--no-cache` ile çağırın veya config dosyanızda `{ evaluateOptions: { cache: false }}` ayarını yapın.

Ön belleği temizlemek için `promptfoo cache clear` komutunu kullanın.

## Node Paketi

Ön belleği devre dışı bırakmak için `EvaluateOptions.cache` değerini false olarak ayarlayın:

```js
promptfoo.evaluate(testSuite, {
  cache: false,
});
```

## Testler

[jest veya vitest](/docs/integrations/jest), [mocha](/docs/integrations/mocha-chai) veya başka bir dış çerçeve ile entegrasyon yapıyorsanız, CI için muhtemelen aşağıdakileri ayarlamak isteyeceksiniz:

```sh
PROMPTFOO_CACHE_TYPE=disk
PROMPTFOO_CACHE_PATH=...
```

## Yapılandırma

Ön bellek, ortam değişkenleri aracılığıyla yapılandırılabilir:

| Ortam Değişkeni         | Açıklama                                  | Varsayılan Değer                                    |
| ----------------------- | ----------------------------------------- | -------------------------------------------------- |
| PROMPTFOO_CACHE_ENABLED | Ön belleği etkinleştir veya devre dışı bırak | true                                               |
| PROMPTFOO_CACHE_TYPE    | `disk` veya `memory`                      | `NODE_ENV` `test` ise `memory`, aksi takdirde `disk` |
| PROMPTFOO_CACHE_PATH    | Ön bellek dizinine giden yol              | `~/.promptfoo/cache`                               |
| PROMPTFOO_CACHE_TTL     | Ön bellek girdilerinin yaşam süresi (saniye cinsinden) | 14 gün                                             |

#### Ek Ön Bellek Detayları

- Hız sınırı yanıtları (HTTP 429) üstel geri çekilmeyle otomatik olarak işlenir
- Boş yanıtlar önbelleğe alınmaz
- HTTP 500 yanıtları `PROMPTFOO_RETRY_5XX=true` ayarlanarak yeniden denenebilir

## Ön Belleği Yönetme

### Ön Belleği Temizleme

Ön belleği birkaç şekilde temizleyebilirsiniz:

1. CLI komutunu kullanarak:

```bash
promptfoo cache clear
```

2. Node.js API aracılığıyla:

```javascript
const promptfoo = require('promptfoo');
await promptfoo.cache.clearCache();
```

3. Ön bellek dizinini manuel olarak silin:

```bash
rm -rf ~/.promptfoo/cache
```

### Ön Bellek Tahrif Etme

Ön bellek hataını iki şekilde zorlayabilirsiniz:

1. CLI'ye `--no-cache` parametreyi geçin:

```bash
promptfoo eval --no-cache
```

2. Kodda ön bellek tahrif etme ayarını yapın:

```javascript
const result = await fetchWithCache(url, options, timeout, 'json', true); // Son parametre ön bellek hatasını zorunlu yapar
```