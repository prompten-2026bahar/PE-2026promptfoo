---
sidebar_label: Genel Webhook
description: HTTP POST istekleri ile özel LLM akışlarını ve istem zincirlerini tetiklemek için webhook entegrasyonlarını yapılandırın, sorunsuz API tabanlı test ve değerlendirme sunar
---

# Genel Webhook (Generic Webhook)

Webhook sağlayıcısı, uygulamanızdaki daha karmaşık akışları veya istem zincirlerini uçtan uca tetiklemek için yararlı olabilir.

Şu şekilde belirtilir:

```yaml
providers:
  - webhook:http://example.com/webhook
```

promptfoo, aşağıdaki JSON yüküyle bir HTTP POST isteği gönderecektir:

```json
{
  "prompt": "..."
}
```

Şu formatta bir JSON yanıtı bekler:

```json
{
  "output": "..."
}
```

## Özel özellikler iletme

Daha ayrıntılı bir format kullanarak `config` anahtarı altında webhook sağlayıcı özellikleri ayarlamak mümkündür:

```yaml
providers:
  - id: webhook:http://example.com/webhook
    config:
      foo: bar
      test: 123
```

Bu yapılandırma özellikleri, JSON istek yükünde olduğu gibi iletilecektir:

```json
{
  "prompt": "...",
  "config": {
    "foo": "bar",
    "test": 123
  }
}
```
