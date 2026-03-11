---
title: Promptfoo'da MCP (Model Context Protocol) Kullanımı
description: Gelişmiş araç kullanımı, kalıcı bellek ve sağlayıcılar arası ajan tabanlı iş akışları için Model Context Protocol (MCP) entegrasyonunu etkinleştirin
sidebar_label: Model Context Protocol (MCP)
sidebar_position: 20
---

# Promptfoo'da MCP (Model Context Protocol) Kullanımı

Promptfoo, gelişmiş araç kullanımı ve ajan tabanlı (agentic) iş akışları için Model Context Protocol (MCP) desteği sunar. MCP, Promptfoo sağlayıcılarınızı; araç orkestrasyonu ve daha fazlasını etkinleştirmek için [modelcontextprotocol/server-memory](https://github.com/modelcontextprotocol/server-memory) gibi harici bir MCP sunucusuna bağlamanıza olanak tanır.

## Temel Yapılandırma

Bir sağlayıcı için MCP'yi etkinleştirmek üzere, `promptfooconfig.yaml` dosyanızdaki sağlayıcının `config` bölümüne `mcp` bloğunu ekleyin:

```yaml title="promptfooconfig.yaml"
description: Google AI Studio ile MCP bellek sunucusu entegrasyonunu test etme
providers:
  - id: google:gemini-2.0-flash
    config:
      mcp:
        enabled: true
        server:
          command: npx
          args: ['-y', '@modelcontextprotocol/server-memory']
          name: memory
```

### MCP Yapılandırma Seçenekleri

- `enabled`: Bu sağlayıcı için MCP'yi etkinleştirmek için `true` olarak ayarlayın.
- `timeout`: (İsteğe bağlı) MCP araç çağrıları için milisaniye cinsinden istek zaman aşımı. Varsayılan değer 60000'dir (60 saniye). Uzun süren araçlar için bu değeri artırın.
- `resetTimeoutOnProgress`: (İsteğe bağlı) İlerleme bildirimleri alındığında zaman aşımını sıfırlar. Uzun süren işlemler için kullanışlıdır. Varsayılan: false.
- `maxTotalTimeout`: (İsteğe bağlı) İlerleme bildirimlerinden bağımsız olarak milisaniye cinsinden mutlak maksimum zaman aşımı.
- `pingOnConnect`: (İsteğe bağlı) Yanıt verip vermediğini doğrulamak için bağlandıktan sonra sunucuya ping atar. Varsayılan: false.
- `server`: (İsteğe bağlı) Bir MCP sunucusunu başlatmak veya sunucuya bağlanmak için yapılandırma.
  - `command`: MCP sunucusunu başlatacak komut (örneğin, `npx`).
  - `args`: Komuta iletilecek argümanlar (örneğin, `['-y', '@modelcontextprotocol/server-memory']`).
  - `name`: (İsteğe bağlı) Sunucu örneği için bir ad.
  - `url`: Uzak bir MCP sunucusuna bağlanmak için URL.
  - `headers`: (İsteğe bağlı) Uzak bir MCP sunucusuna bağlanırken gönderilecek özel HTTP başlıkları (yalnızca `url` tabanlı bağlantılar için geçerlidir).
  - `auth`: (İsteğe bağlı) Sunucu için kimlik doğrulama yapılandırması. Tüm bağlantı türleri için kimlik doğrulama başlıklarını otomatik olarak ayarlamak için kullanılabilir.
    - `type`: Kimlik doğrulama türü, `'bearer'` veya `'api_key'`.
    - `token`: Bearer kimlik doğrulaması için jeton.
    - `api_key`: api_key kimlik doğrulaması için API anahtarı.
- `command`/`args` yerine bir `url` belirterek de uzak bir MCP sunucusuna bağlanabilirsiniz.

MCP sunucuları yerel olarak çalıştırılabilir veya uzaktan erişilebilir. Geliştirme ve test için yerel bir sunucu genellikle en basitidir; üretim ortamları ise merkezi bir uzak sunucu kullanabilir.

#### Örnek: Uzak Bir MCP Sunucusuna Bağlanma

```yaml
providers:
  - id: openai:responses:gpt-5.1
    config:
      apiKey: <api-anahtariniz>
      mcp:
        enabled: true
        server:
          url: http://localhost:8000
```

#### Örnek: Uzak Bir MCP Sunucusu ile Özel Başlıklar (Headers) Kullanma

```yaml
providers:
  - id: openai:responses:gpt-5.1
    config:
      apiKey: <api-anahtariniz>
      mcp:
        enabled: true
        server:
          url: http://localhost:8000
          headers:
            X-API-Key: ozel-api-anahtariniz
            Authorization: Bearer jetonunuz
            X-Custom-Header: ozel-deger
```

Bu yapılandırma şu durumlarda yararlı olabilir:

- MCP sunucusu bir API anahtarı veya kimlik doğrulama jetonu gerektiriyorsa
- Özel tanımlayıcılar veya oturum bilgileri sağlamanız gerekiyorsa
- Sunucu, yapılandırma veya takip için belirli başlıklara (headers) ihtiyaç duyuyorsa

## Tek Bir Sağlayıcıyı Birden Fazla MCP Sunucusuna Bağlama

Promptfoo, sağlayıcınızın MCP yapılandırmasındaki `servers` dizisini kullanarak tek bir sağlayıcının birden fazla MCP sunucusuna bağlanmasına olanak tanır. Bağlı tüm sunuculardaki tüm araçlar sağlayıcı tarafından kullanılabilir hale gelir.

### Örnek: Bir Sağlayıcı, Birden Fazla MCP Sunucusu

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5.1
    config:
      mcp:
        enabled: true
        servers:
          - command: npx
            args: ['-y', '@modelcontextprotocol/server-memory']
            name: sunucu_a
          - url: http://localhost:8001
            name: sunucu_b
            headers:
              X-API-Key: api-anahtariniz
```

- Birden fazla MCP sunucusu belirtmek için `servers:` dizisini kullanın (sadece `server:` değil).
- Her giriş yerel bir başlatma veya (destekleniyorsa) uzak bir URL olabilir.
- Tüm sunuculardaki tüm araçlar sağlayıcı tarafından kullanılabilir.
- URL bağlantılarını kullanırken her sunucu için farklı başlıklar belirtebilirsiniz.
- Gerekirse aynı sunucuya birden fazla kez de bağlanabilirsiniz:

```yaml
providers:
  - id: anthropic:claude-sonnet-4-5-20250929
    config:
      mcp:
        enabled: true
        servers:
          - command: npx
            args: ['-y', '@modelcontextprotocol/server-memory']
            name: memory
          - command: npx
            args: ['-y', '@modelcontextprotocol/server-filesystem']
            name: filesystem
          - command: npx
            args: ['-y', '@modelcontextprotocol/server-github']
            name: github
```

Bu yapılandırma, tek bir sağlayıcıyı birden fazla MCP sunucusuna bağlayarak aynı anda bellek depolama, dosya sistemi işlemleri ve GitHub entegrasyonuna erişim sağlar.

## Birden Fazla MCP Sunucusu Kullanma

`promptfooconfig.yaml` dosyanızda farklı sağlayıcılara farklı MCP sunucu yapılandırmaları atayarak birden fazla MCP sunucusu yapılandırabilirsiniz. Her sağlayıcının kendi `mcp.server` bloğu olabilir; bu da farklı modeller veya kullanım durumları için ayrı bellek/araç sunucuları çalıştırmanıza olanak tanır.

```yaml title="promptfooconfig.yaml"
description: Birden fazla MCP sunucusu kullanma
providers:
  - id: google:gemini-2.0-flash
    config:
      mcp:
        enabled: true
        server:
          command: npx
          args: ['-y', '@modelcontextprotocol/server-memory']
          name: gemini-memory
 
  - id: openai:responses:gpt-5.1
    config:
      apiKey: <api-anahtariniz>
      mcp:
        enabled: true
        server:
          url: http://localhost:8001
          name: openai-memory
          headers:
            X-API-Key: openai-server-api-key
 
  - id: anthropic:claude-sonnet-4-5-20250929
    config:
      mcp:
        enabled: true
        server:
          url: http://localhost:8002
          name: anthropic-memory
          headers:
            Authorization: Bearer anthropic-server-token
```

Bu örnekte:

- Gemini sağlayıcısı, `npx` kullanarak yerel bir MCP sunucusu başlatır.
- OpenAI ve Anthropic sağlayıcıları, farklı bağlantı noktalarında çalışan farklı uzak MCP sunucularına bağlanır.
- Her sağlayıcı; diğerlerinden izole edilmiş kendi belleğine, araç setine ve bağlamına sahip olabilir.
- Uzak sunucular için kimlik doğrulama veya diğer gereksinimleri karşılamak amacıyla özel başlıklar (headers) belirtilmiştir.

Bu kurulum, ajan tabanlı iş akışlarını paralel olarak test etmek, kıyaslamak (benchmarking) veya izole bir şekilde çalıştırmak için yararlıdır.

## Desteklenen Sağlayıcılar

MCP, Promptfoo'daki çoğu ana sağlayıcı tarafından desteklenir:

- Google Gemini (AI Studio, Vertex)
- OpenAI (ve Groq, Together vb. uyumlu sağlayıcılar)
- Anthropic

## OpenAI Responses API MCP Entegrasyonu

Yukarıda açıklanan genel MCP entegrasyonuna ek olarak, OpenAI'nin Responses API'si, yerel MCP sunucuları çalıştırmadan uzak MCP sunucularına doğrudan bağlantı sağlayan yerel MCP desteğine sahiptir. Bu yaklaşım OpenAI'nin Responses API'sine özgüdür ve şunları sunar:

- Uzak MCP sunucularına doğrudan bağlantı (DeepWiki, Stripe vb.)
- Veri paylaşımı için yerleşik onay iş akışları
- Güvenli MCP sunucuları için kimlik doğrulama başlığı desteği
- Araç filtreleme yetenekleri

OpenAI'nin Responses API'si ile MCP kullanımı hakkında ayrıntılı bilgi için [OpenAI Sağlayıcı MCP belgelerine](../providers/openai.md#mcp-model-context-protocol-support) bakın.

## Araç Şeması Uyumluluğu

Promptfoo, desteklenen özellikleri korurken sağlayıcıyla uyumsuz meta veri alanlarını (örneğin `$schema`) kaldırarak MCP sunucuları ve LLM sağlayıcıları arasındaki JSON Şeması uyumluluğunu otomatik olarak yönetir. Giriş parametresi olmayan araçlar herhangi bir değişiklik yapılmadan çalışır.

## Zaman Aşımı Yapılandırması

MCP araç çağrıları 60 saniyelik varsayılan bir zaman aşımına sahiptir. Uzun süren araçlar için zaman aşımını artırın:

```yaml
providers:
  - id: openai:responses:gpt-5.1
    config:
      mcp:
        enabled: true
        timeout: 900000 # milisaniye cinsinden 15 dakika
        server:
          url: https://api.ornek.com/mcp
```

Global bir varsayılan değeri ortam değişkeni aracılığıyla da ayarlayabilirsiniz:

```bash
export MCP_REQUEST_TIMEOUT_MS=900000  # 15 dakika
```

Öncelik sırası: `config.timeout` > `MCP_REQUEST_TIMEOUT_MS` ortam değişkeni > SDK varsayılanı (60s).

## Sorun Giderme

- MCP sunucunuzun çalıştığından ve erişilebilir olduğundan emin olun.
- MCP bağlantı hataları için sağlayıcı günlüklerinizi kontrol edin.
- Kimlik doğrulama sorunları yaşıyorsanız, özel başlıklarınızın doğru şekilde biçimlendirildiğini doğrulayın.
- Araç çağrıları zaman aşımına uğruyorsa, `timeout` yapılandırma seçeneğini artırın veya `MCP_REQUEST_TIMEOUT_MS` değerini ayarlayın.

## Ayrıca Bakınız

- [Yapılandırma Referansı](../configuration/reference.md)
- [Sağlayıcı Yapılandırması](../providers/index.md)
