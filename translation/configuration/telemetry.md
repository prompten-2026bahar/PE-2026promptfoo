---
sidebar_position: 42
sidebar_label: Telemetri
title: Telemetri Yapılandırması - Kullanım Analitikleri ve İzleme
description: promptfoo kullanımı izleme için telemetri ve analitiği yapılandırın. Veri toplama ayarları, gizlilik kontrolleri ve kullanım izleme seçeneklerini öğrenin.
keywords:
  [
    telemetri yapılandırması,
    kullanım analitikleri,
    izleme,
    veri toplama,
    gizlilik ayarları,
    kullanım izleme,
    analitik kurulumu,
  ]
pagination_prev: configuration/caching
pagination_next: null
---

# Telemetri

`promptfoo` varsayılan olarak temel anonim telemetri toplar. Bu telemetri, geliştirme üzerinde zaman harcamayı nasıl karar vereceğimize yardımcı olur.

Bir olay kaydedilir:

- Bir komut çalıştırılırsa (örn. `init`, `eval`, `view`)
- Bir onaylama kullanılırsa (onaylama türü ile birlikte, örn. `is-json`, `similar`, `llm-rubric`)

Hiçbir ek bilgi toplanmaz. Yukarıdaki liste tamamen kapsamlıdır.

Telemetriyi devre dışı bırakmak için aşağıdaki ortam değişkenini ayarlayın:

```sh
PROMPTFOO_DISABLE_TELEMETRY=1
```

## Güncellemeler

CLI, güncellemeler için NPM'nin paket kayıt defterini kontrol eder. Daha yeni bir sürüm varsa, kullanıcıya bir başlık gösterir.

Devre dışı bırakmak için şunu ayarlayın:

```sh
PROMPTFOO_DISABLE_UPDATE=1
```