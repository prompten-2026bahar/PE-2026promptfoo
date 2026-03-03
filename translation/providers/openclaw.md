---
title: OpenClaw
sidebar_label: OpenClaw
sidebar_position: 42
description: 'Otomatik algılanan ağ geçidi ve kimlik doğrulama ile kişisel bir yapay zeka asistan çerçevesi olan OpenClaw"ı değerlendirme hedefi olarak kullanın'
---

# OpenClaw

OpenClaw, yapılandırılabilir akıl yürütme ve oturum yönetimi ile ajan tabanlı değerlendirmelere olanak tanıyan kişisel bir yapay zeka asistan çerçevesidir.

## Ön Koşullar

1. OpenClaw'ı yükleyin:

```sh
npm install -g openclaw@latest
```

2. İlk kurulum sihirbazını çalıştırın:

```sh
openclaw onboard
```

3. `~/.openclaw/openclaw.json` dosyasına aşağıdakileri ekleyerek HTTP API'sini etkinleştirin:

```json
{
  "gateway": {
    "http": {
      "endpoints": {
        "chatCompletions": {
          "enabled": true
        }
      }
    }
  }
}
```

4. Ağ geçidini (gateway) başlatın:

```sh
openclaw gateway
```

Veya zaten çalışıyorsa yeniden başlatın:

```sh
openclaw gateway restart
```

## Sağlayıcı Türleri

OpenClaw, her biri farklı bir ağ geçidi API yüzeyini hedefleyen dört sağlayıcı türü sunar:

| Sağlayıcı   | Format                    | API                    | Kullanım Durumu                                     |
| ----------- | ------------------------- | ---------------------- | --------------------------------------------------- |
| Chat        | `openclaw:main`           | `/v1/chat/completions` | Standart sohbet tamamlamaları (varsayılan)          |
| Responses   | `openclaw:responses:main` | `/v1/responses`        | Öğe tabanlı girişlerle OpenResponses uyumlu API     |
| Agent       | `openclaw:agent:main`     | WebSocket RPC          | Yerel WS protokolü üzerinden tam ajan akışı         |
| Tool Invoke | `openclaw:tools:bash`     | `/tools/invoke`        | Kırmızı takım (red team) testleri için doğrudan araç çağırma |

### Sohbet (Chat) (varsayılan)

OpenAI uyumlu sohbet tamamlama uç noktasını kullanır. Herhangi bir anahtar kelime belirtilmediğinde varsayılan budur.

- `openclaw` - Varsayılan ajanı kullanır
- `openclaw:main` - Açıkça ana ajanı hedefler
- `openclaw:<agent-id>` - Kimliğine (ID) göre belirli bir ajanı hedefler

### Responses (Yanıtlar)

OpenResponses uyumlu `/v1/responses` uç noktasını kullanır. Ağ geçidi yapılandırmasında etkinleştirilmesini gerektirir:

```json
{
  "gateway": {
    "http": {
      "endpoints": {
        "responses": { "enabled": true }
      }
    }
  }
}
```

- `openclaw:responses` - Responses API üzerinden varsayılan ajan
- `openclaw:responses:main` - Açık ajan kimliği
- `openclaw:responses:<agent-id>` - Özel ajan

### WebSocket Ajanı (WebSocket Agent)

Tam ajan akışı için yerel OpenClaw WebSocket RPC protokolünü kullanır. HTTP uç noktası etkinleştirilmesine gerek kalmadan doğrudan ağ geçidinin WS portuna bağlanır.

- `openclaw:agent` - WS üzerinden varsayılan ajan
- `openclaw:agent:main` - Açık ajan kimliği
- `openclaw:agent:<agent-id>` - Özel ajan

### Araç Çağırma (Tool Invoke)

`POST /tools/invoke` aracılığıyla belirli bir aracı doğrudan çağırır. Tek tek araçları yalıtılmış olarak test etmek amacıyla yapılan kırmızı takım (red team) testleri için kullanışlıdır. İstem, araç argümanları için JSON olarak ayrıştırılır.

:::note
Araç OpenClaw politikası tarafından izinli listeye alınmamışsa, ağ geçidi 404 hatası döndürür. Aracın OpenClaw yapılandırmanızda etkinleştirildiğinden emin olun.
:::

- `openclaw:tools:bash` - bash aracını çağır
- `openclaw:tools:agents_list` - agents_list aracını çağır

## Yapılandırma

### Otomatik Algılama

Sağlayıcı, ağ geçidi URL'sini ve kimlik doğrulama token'ını `~/.openclaw/openclaw.json` dosyasından otomatik olarak algılar:

```yaml title="promptfooconfig.yaml"
providers:
  - openclaw:main
```

### Açık Yapılandırma

Otomatik algılamayı açık yapılandırma ile geçersiz kılın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openclaw:main
    config:
      gateway_url: http://127.0.0.1:18789
      auth_token: buraya-token-gelecek
      session_key: ozel-oturum
```

### Ortam Değişkenleri

Yapılandırmayı ortam değişkenleri aracılığıyla ayarlayın:

```sh
export OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
export OPENCLAW_GATEWAY_TOKEN=buraya-token-gelecek
```

```yaml title="promptfooconfig.yaml"
providers:
  - openclaw:main
```

## Yapılandırma Seçenekleri

| Yapılandırma Özelliği | Ortam Değişkeni        | Açıklama                                           |
| --------------------- | ---------------------- | -------------------------------------------------- |
| gateway_url           | OPENCLAW_GATEWAY_URL   | Ağ Geçidi URL'si (varsayılan: otomatik algılanan)    |
| auth_token            | OPENCLAW_GATEWAY_TOKEN | Kimlik Doğrulama Token'ı (varsayılan: otomatik algılanan) |
| thinking_level        | -                      | Düşünme derinliği (Sadece WS Ajanı): low, medium, high |
| session_key           | -                      | Konuşma sürekliliği için oturum tanımlayıcısı      |
| timeoutMs             | -                      | Milisaniye cinsinden WebSocket ajan zaman aşımı    |

## Örnekler

### Temel Kullanım

```yaml title="promptfooconfig.yaml"
prompts:
  - '{{country}} ülkesinin başkenti neresidir?'

providers:
  - openclaw:main

tests:
  - vars:
      country: Fransa
    assert:
      - type: contains
        value: Paris
```

### Özel Düşünme Seviyesi İle (WS Ajanı)

`thinking_level` yalnızca WebSocket Ajanı sağlayıcısı tarafından desteklenir:

```yaml title="promptfooconfig.yaml"
prompts:
  - '{{topic}} konusunun artılarını ve eksilerini analiz edin'

providers:
  - id: openclaw:agent:main
    config:
      thinking_level: high
      timeoutMs: 60000

tests:
  - vars:
      topic: yenilenebilir enerji
```

### Responses API Kullanımı

```yaml title="promptfooconfig.yaml"
prompts:
  - 'Özetle: {{text}}'

providers:
  - openclaw:responses:main

tests:
  - vars:
      text: Hızlı kahverengi tilki tembel köpeğin üzerinden atlar.
```

### WebSocket Ajanı

```yaml title="promptfooconfig.yaml"
prompts:
  - '{{task}}'

providers:
  - id: openclaw:agent:main
    config:
      timeoutMs: 60000

tests:
  - vars:
      task: Mevcut dizinde hangi dosyalar var?
```

### Araç Çağırma (Red Team)

```yaml title="promptfooconfig.yaml"
prompts:
  - '{"command": "{{cmd}}"}'

providers:
  - openclaw:tools:bash

tests:
  - vars:
      cmd: echo merhaba
    assert:
      - type: contains
        value: merhaba
```

## Ayrıca Bakınız

Tam bir örnek için [examples/openclaw](https://github.com/promptfoo/promptfoo/tree/main/examples/openclaw) sayfasına bakın.
