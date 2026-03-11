---
sidebar_label: MCP (Model Context Protocol)
title: MCP Sağlayıcısı
description: Ajan sistemlerini ve araç çağırma yeteneklerini test etmek için Model Bağlam Protokolü (MCP) sunucularını promptfoo'da sağlayıcı olarak kullanın
---

# MCP (Model Context Protocol) Sağlayıcısı

`mcp` sağlayıcısı, Model Bağlam Protokolü (MCP) sunucularını doğrudan promptfoo'da sağlayıcı olarak kullanmanıza olanak tanır. Bu, özellikle fonksiyon çağırma, veri erişimi ve harici entegrasyonlar için MCP araçlarına güvenen ajan sistemlerinin kırmızı ekip (red team) testleri ve genel testleri için yararlıdır.

[Diğer sağlayıcılar için MCP entegrasyonunun](../integrations/mcp.md) aksine, MCP sağlayıcısı MCP sunucusunun kendisini test edilen hedef sistem olarak ele alır ve MCP tabanlı uygulamaların güvenlik açıklarını ve sağlamlığını değerlendirmenize olanak tanır.

## Kurulum

MCP sağlayıcısını kullanmak için çalışan bir MCP sunucunuzun olması gerekir. Bu yerel bir sunucu veya uzak bir sunucu olabilir.

### Ön Koşullar

1. Bir MCP sunucusu (yerel veya uzak)
2. MCP SDK'sı için Node.js bağımlılıkları (promptfoo tarafından otomatik olarak halledilir)

## Temel Yapılandırma

En temel MCP sağlayıcı yapılandırması:

```yaml title="promptfooconfig.yaml"
providers:
  - id: mcp
    config:
      enabled: true
      server:
        command: node
        args: ['mcp_server/index.js']
        name: test-sunucusu
```

## Yapılandırma Seçenekleri

### Sunucu Yapılandırması

MCP sağlayıcısı hem yerel hem de uzak MCP sunucularını destekler:

#### Yerel Sunucu (Komut tabanlı)

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      server:
        command: node # Sunucuyu çalıştırmak için komut
        args: ['server.js'] # Komut için argümanlar
        name: yerel-sunucu # Sunucu için isteğe bağlı ad
```

#### Uzak Sunucu (URL tabanlı)

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      server:
        url: https://api.example.com/mcp # Uzak MCP sunucusunun URL'si
        name: uzak-sunucu # Sunucu için isteğe bağlı ad
        headers: # İsteğe bağlı özel başlıklar
          Authorization: 'Bearer token'
          X-API-Key: 'api-anahtarınız'
```

#### Çoklu Sunucular

Aynı anda birden fazla MCP sunucusuna bağlanabilirsiniz:

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      servers:
        - command: node
          args: ['server1.js']
          name: sunucu-1
        - url: https://api.example.com/mcp
          name: sunucu-2
          headers:
            Authorization: 'Bearer token'
```

### Kimlik Doğrulama

Kimlik doğrulama gerektiren sunucular için `auth` yapılandırmasını kullanın. MCP sağlayıcısı birden fazla kimlik doğrulama yöntemini destekler.

#### Taşıyıcı Jeton (Bearer Token)

Statik bir taşıyıcı jeton kabul eden API'ler için:

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      server:
        url: https://guvenli-mcp-sunucusu.com
        auth:
          type: bearer
          token: '{{env.MCP_BEARER_TOKEN}}'
```

Sağlayıcı, her isteğe bir `Authorization: Bearer <token>` başlığı ekler.

#### Temel Kimlik Doğrulama (Basic Authentication)

HTTP Temel kimlik doğrulaması kullanan sunucular için:

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      server:
        url: https://guvenli-mcp-sunucusu.com
        auth:
          type: basic
          username: '{{env.MCP_USERNAME}}'
          password: '{{env.MCP_PASSWORD}}'
```

#### API Anahtarı

API anahtarı kimlik doğrulaması kullanan sunucular için:

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      server:
        url: https://guvenli-mcp-sunucusu.com
        auth:
          type: api_key
          value: '{{env.MCP_API_KEY}}'
          keyName: X-API-Key # Başlık veya sorgu parametresi adı (varsayılan: X-API-Key)
          placement: header # 'header' (varsayılan) veya 'query'
```

`placement` değeri `header` olduğunda anahtar bir istek başlığı olarak eklenir. `placement` değeri `query` olduğunda ise bir URL sorgu parametresi olarak eklenir.

:::note Geriye Dönük Uyumluluk
Eski `api_key` alanı geriye dönük uyumluluk için hala desteklenmektedir. Yeni yapılandırmalar bunun yerine `value` kullanmalıdır.
:::

#### OAuth 2.0

OAuth 2.0 kimlik doğrulaması, **İstemci Kimlik Bilgileri (Client Credentials)** ve **Parola (Password)** verme türlerini destekler. Jetonlar, sona ermeden 60 saniye önce otomatik olarak yenilenir.

**İstemci Kimlik Bilgileri (Client Credentials) Akışı:**

Bu akışı sunucudan sunucuya kimlik doğrulama için kullanın:

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      server:
        url: https://guvenli-mcp-sunucusu.com
        auth:
          type: oauth
          grantType: client_credentials
          tokenUrl: https://auth.example.com/oauth/token
          clientId: '{{env.MCP_CLIENT_ID}}'
          clientSecret: '{{env.MCP_CLIENT_SECRET}}'
          scopes:
            - read
            - write
```

**Parola (Password) Akışı:**

Bu akışı kullanıcı kimlik bilgileriyle kimlik doğrulama yaparken kullanın:

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      server:
        url: https://guvenli-mcp-sunucusu.com
        auth:
          type: oauth
          grantType: password
          tokenUrl: https://auth.example.com/oauth/token
          username: '{{env.MCP_USERNAME}}'
          password: '{{env.MCP_PASSWORD}}'
          clientId: '{{env.MCP_CLIENT_ID}}' # İsteğe bağlı
          clientSecret: '{{env.MCP_CLIENT_SECRET}}' # İsteğe bağlı
          scopes:
            - read
```

**Jeton Uç Noktası Keşfi:**

Eğer `tokenUrl` belirtilmezse, sağlayıcı [RFC 8414](https://datatracker.ietf.org/doc/rfc8414/) OAuth 2.0 Yetkilendirme Sunucusu Meta Verilerini kullanarak jeton uç noktasını otomatik olarak keşfeder. Birkaç bilinen URL'yi dener:

1. Yola eklenen: `{sunucu-url}/.well-known/oauth-authorization-server` (Keycloak tarzı)
2. RFC 8414 yola duyarlı: `{origin}/.well-known/oauth-authorization-server{path}`
3. Kök düzeyinde: `{origin}/.well-known/oauth-authorization-server`

Maksimum uyumluluk için, mümkünse `tokenUrl` değerini açıkça yapılandırın.

**Jeton Yenileme Davranışı:**

OAuth kimlik doğrulaması kullanırken:

1. Sağlayıcı, bağlanmadan önce `tokenUrl`'den (veya keşfedilen uç noktadan) bir erişim jetonu ister
2. Jetonlar, süreleri dolmadan 60 saniye önce proaktif olarak yenilenir
3. Eşzamanlı istekler aynı yenileme işlemini paylaşır (mükerrer jeton alımı olmaz)
4. Değerlendirme sırasında bir jetonun süresi dolarsa, sağlayıcı yeni bir jetonla otomatik olarak yeniden bağlanır

#### Kimlik Doğrulama Seçenekleri Referansı

| Seçenek      | Tür      | Kimlik Doğrulama Türü   | Gerekli | Açıklama                                                |
| ------------ | -------- | ----------------------- | -------- | ------------------------------------------------------- |
| type         | string   | Tümü                    | Evet     | `'bearer'`, `'basic'`, `'api_key'` veya `'oauth'`       |
| token        | string   | bearer                  | Evet     | Taşıyıcı jeton                                          |
| username     | string   | basic, oauth (password) | Evet     | Kullanıcı adı                                           |
| password     | string   | basic, oauth (password) | Evet     | Parola                                                  |
| value        | string   | api_key                 | Evet\*   | API anahtarı değeri                                     |
| api_key      | string   | api_key                 | Evet\*   | Eski alan, bunun yerine `value` kullanın                |
| keyName      | string   | api_key                 | Hayır    | Başlık veya sorgu parametresi adı (varsayılan: `X-API-Key`) |
| placement    | string   | api_key                 | Hayır    | `'header'` (varsayılan) veya `'query'`                 |
| grantType    | string   | oauth                   | Evet     | `'client_credentials'` veya `'password'`                |
| tokenUrl     | string   | oauth                   | Hayır    | OAuth jeton uç noktası URL'si (atlanırsa otomatik keşfedilir) |
| clientId     | string   | oauth                   | Değişir  | client_credentials için gereklidir                      |
| clientSecret | string   | oauth                   | Değişir  | client_credentials için gereklidir                      |
| scopes       | string[] | oauth                   | Hayır    | İstenecek OAuth kapsamları                              |

\* api_key kimlik doğrulama türü için `value` veya `api_key` alanlarından biri gereklidir.

### Araç Filtreleme

MCP sunucusundan hangi araçların kullanılabilir olduğunu kontrol edin:

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      server:
        command: node
        args: ['server.js']
      tools: ['get_user_data', 'process_payment'] # Yalnızca bu araçlara izin ver
      exclude_tools: ['delete_user', 'admin_access'] # Bu araçları hariç tut
```

### Gelişmiş Yapılandırma

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      server:
        command: node
        args: ['server.js']
        name: gelismis-sunucu
      timeout: 900000 # Milisaniye cinsinden istek zaman aşımı (15 dakika)
      debug: true # Hata ayıklama günlüğünü etkinleştir
      verbose: true # Ayrıntılı çıktıyı etkinleştir
      defaultArgs: # Tüm araç çağrıları için varsayılan argümanlar
        session_id: 'test-oturumu'
        user_role: 'musteri'
```

### Zaman Aşımı Yapılandırması

MCP araç çağrılarının varsayılan zaman aşımı süresi (MCP SDK'sından gelen) 60 saniyedir. Uzun süren araçlar için zaman aşımı süresini artırabilirsiniz:

**Yapılandırma aracılığıyla (sağlayıcı başına):**

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      timeout: 900000 # milisaniye cinsinden 15 dakika
      server:
        url: https://api.example.com/mcp
```

**Ortam değişkeni aracılığıyla (küresel varsayılan):**

```bash
# Tüm MCP istekleri için varsayılan zaman aşımı süresini (milisaniye cinsinden) ayarlayın
export MCP_REQUEST_TIMEOUT_MS=900000  # 15 dakika
```

Öncelik sırası şöyledir: `config.timeout` > `MCP_REQUEST_TIMEOUT_MS` ortam değişkeni > SDK varsayılanı (60 saniye).

### Gelişmiş Zaman Aşımı Seçenekleri

İlerleme bildirimleri gönderen uzun süreli MCP araçları için gelişmiş zaman aşımı seçeneklerini kullanabilirsiniz:

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      timeout: 300000 # 5 dakika başlangıç zaman aşımı
      resetTimeoutOnProgress: true # İlerleme alındığında zaman aşımını sıfırla
      maxTotalTimeout: 900000 # 15 dakika mutlak maksimum
      server:
        url: https://api.example.com/mcp
```

| Seçenek                  | Açıklama                                                                    |
| ------------------------ | --------------------------------------------------------------------------- |
| `timeout`                | Milisaniye cinsinden istek zaman aşımı (varsayılan: 60000)                  |
| `resetTimeoutOnProgress` | İlerleme bildirimleri alındığında zaman aşımını sıfırla (varsayılan: false) |
| `maxTotalTimeout`        | İlerlemeden bağımsız olarak mutlak maksimum zaman aşımı (isteğe bağlı)      |
| `pingOnConnect`          | Yanıt verebilirliği doğrulamak için bağlandıktan sonra sunucuya ping at (varsayılan: false) |

## Araç Çağrılarıyla Kullanım

MCP sağlayıcısı, istemlerin JSON araç çağrıları olarak formatlanmasını bekler. Beklenen format şöyledir:

```json
{
  "tool": "fonksiyon_adi",
  "args": {
    "parametre1": "deger1",
    "parametre2": "deger2"
  }
}
```

### Örnek Test Durumu

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: MCP ödeme işleme sistemini test etme

providers:
  - id: mcp
    config:
      enabled: true
      server:
        command: node
        args: ['payment_server.js']
        name: odeme-sistemi

prompts:
  - '{{prompt}}'

tests:
  - vars:
      prompt: '{"tool": "process_payment", "args": {"amount": 100, "currency": "USD", "user_id": "12345"}}'
    assert:
      - type: contains
        value: success

  - vars:
      prompt: '{"tool": "get_transaction", "args": {"transaction_id": "txn_123"}}'
    assert:
      - type: is-json
```

## MCP ile Kırmızı Ekip (Red Team) Testi

MCP sağlayıcısı, ajan sistemlerinin kırmızı ekip testleri için özellikle güçlüdür. Kapsamlı güvenlik testi için önerilen bir yapılandırma şöyledir:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: MCP Kırmızı Ekip Güvenlik Testi

providers:
  - id: mcp
    config:
      enabled: true
      server:
        command: node
        args: ['mcp_server/index.js']
        name: hedef-sistem

redteam:
  purpose: |
    Sistem ödeme işlemlerini, kullanıcı verilerini yönetir ve analitik sağlar.
    Kullanıcılar, farklı erişim seviyelerine sahip müşterileri ve TechMart çalışanlarını içerir.
    Yetkisiz erişim, veri sızıntısı ve fonksiyon manipülasyonu için test yapın.

  # MCP testi için önerilen eklentiler
  plugins:
    - pii # PII veri ifşası testi
    - bfla # Fonksiyon düzeyi yetkilendirme testi
    - bola # Nesne düzeyi yetkilendirme testi
    - sql-injection # SQL enjeksiyon açıklarını test et

  strategies:
    - basic

  numTests: 25
```

### MCP Testi İçin Önerilen Eklentiler

Yaygın MCP güvenlik endişelerine dayanarak, şu eklentiler özellikle alakalıdır:

1. **`pii`** - Araç yanıtları aracılığıyla kişisel olarak tanımlanabilir bilgilerin ifşasını test eder
2. **`bfla`** (Broken Function Level Authorization) - Kullanıcıların erişmemeleri gereken fonksiyonlara erişip erişemeyeceklerini test eder
3. **`bola`** (Broken Object Level Authorization) - Kullanıcıların erişmemeleri gereken veri nesnelerine erişip erişemeyeceklerini test eder
4. **`sql-injection`** - Araç parametrelerindeki SQL enjeksiyon açıklarını test eder

Bu eklentiler, araçları ve verileri MCP arayüzleri aracılığıyla açan sistemlerdeki en yaygın güvenlik açıklarını hedefler.

## Ortam Değişkenleri

MCP sağlayıcısı şu ortam değişkenlerini destekler:

| Değişken                 | Açıklama                                              | Varsayılan |
| ------------------------ | ----------------------------------------------------- | ---------- |
| `MCP_REQUEST_TIMEOUT_MS` | MCP araç çağrıları ve istekleri için varsayılan zaman aşımı (ms) | 60000      |
| `MCP_DEBUG`              | MCP bağlantıları için hata ayıklama günlüğünü etkinleştir | false      |
| `MCP_VERBOSE`            | MCP bağlantıları için ayrıntılı çıktıyı etkinleştir   | false      |

## Hata Yönetimi

MCP sağlayıcısı çeşitli hata durumlarını ele alır:

- **Bağlantı hataları**: MCP sunucusuna erişilemediğinde
- **Geçersiz JSON**: İstem geçerli bir JSON olmadığında
- **Araç bulunamadı**: Mevcut olmayan bir araç istendiğinde
- **Araç yürütme hataları**: Araç çağrısı başarısız olduğunda
- **Zaman aşımı hataları**: Araç çağrıları yapılandırılan zaman aşımı süresini aştığında

Örnek hata yanıtı:

```json
{
  "error": "MCP tool error: Tool 'unknown_function' not found in any connected MCP server"
}
```

## Hata Ayıklama

MCP sağlayıcısı sorunlarını gidermek için hata ayıklama modunu etkinleştirin:

```yaml
providers:
  - id: mcp
    config:
      enabled: true
      debug: true
      verbose: true
      server:
        command: node
        args: ['server.js']
```

Bu şunları günlüğe kaydedecektir:

- MCP sunucusu bağlantı durumu
- Bağlı sunuculardan kullanılabilir araçlar
- Araç çağrısı detayları ve yanıtları
- Yığın izlemeleriyle birlikte hata mesajları

## Sınırlamalar

- MCP sağlayıcısı, istemlerin JSON araç çağrıları olarak formatlanmasını gerektirir
- Yalnızca standart MCP protokolünü uygulayan MCP sunucularını destekler
- Uzak sunucu desteği, ilgili MCP sunucusu uygulamasına bağlıdır
- Araç yanıtları JSON dizeleri olarak döndürülür

## Örnekler

Çalışan tam örnekler için şunlara bakın:

- [Temel MCP Kırmızı Ekip Testi](https://github.com/promptfoo/promptfoo/tree/main/examples/redteam-mcp)
- [MCP Kimlik Doğrulama](https://github.com/promptfoo/promptfoo/tree/main/examples/redteam-mcp-auth) - OAuth ve diğer kimlik doğrulama yöntemleri
- [Basit MCP Entegrasyonu](https://github.com/promptfoo/promptfoo/tree/main/examples/simple-mcp)

Bu örnekleri şu komutlarla başlatabilirsiniz:

```bash
npx promptfoo@latest init --example redteam-mcp
npx promptfoo@latest init --example redteam-mcp-auth
```

## Ayrıca Bakınız

- [Diğer Sağlayıcılar için MCP Entegrasyonu](../integrations/mcp.md)
- [Kırmızı Ekip Test Kılavuzu](../red-team/index.md)
- [MCP Eklentisi Belgeleri](../red-team/plugins/mcp.md)
- [Yapılandırma Referansı](../configuration/reference.md)
