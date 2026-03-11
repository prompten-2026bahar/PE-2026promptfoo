---
sidebar_position: 3
title: Claude Agent SDK
description: 'Gereçler, izinler, MCP sunucuları ve daha fazlası ile yapılandırılabilir değerlendirmeler için Claude Agent SDK"yı kullanın'
---

# Claude Agent SDK

Bu sağlayıcı, [Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview)'yı, onun [TypeScript SDK](https://docs.claude.com/en/api/agent-sdk/typescript) aracılığıyla değerlendirmeler için kullanılabilir hale getirir.

:::info
Claude Agent SDK eskiden Claude Code SDK olarak biliniyordu. Hala Claude Code üzerine inşa edilmiştir ve onun tüm özelliklerini sunar.
:::

## Sağlayıcı Kimlikleri

Bu sağlayıcıyı şu adlardan biriyle referanslayabilirsiniz:

- `anthropic:claude-agent-sdk` (tam ad)
- `anthropic:claude-code` (takma ad)

## Kurulum

Claude Agent SDK sağlayıcısı, `@anthropic-ai/claude-agent-sdk` paketinin ayrıca kurulmasını gerektirir:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

:::note
Bu isteğe bağlı bir bağımlılıktır ve yalnızca Claude Agent SDK sağlayıcısını kullanmak istiyorsanız kurulması gerekir. Anthropic'in claude-agent-sdk kütüphanesini [özel bir lisans](https://github.com/anthropics/claude-agent-sdk-typescript/blob/9f51899c3e04f15951949ceac81849265d545579/LICENSE.md) ile yayınladığını unutmayın.
:::

## Kurulum (Setup)

Başlamanın en kolay yolu bir Anthropic API anahtarı kullanmaktır. Bunu `ANTHROPIC_API_KEY` ortam değişkeniyle ayarlayabilir veya sağlayıcı yapılandırmasında `apiKey` olarak belirtebilirsiniz.

Anthropic API anahtarlarını [buradan](https://console.anthropic.com/settings/keys) oluşturun.

Ortam değişkenini ayarlama örneği:

```sh
export ANTHROPIC_API_KEY=your_api_key_here
```

## Diğer Model Sağlayıcıları

Anthropic API'sini kullanmanın yanı sıra AWS Bedrock ve Google Vertex AI'yı da kullanabilirsiniz.

AWS Bedrock için:

- `CLAUDE_CODE_USE_BEDROCK` ortam değişkenini `true` olarak ayarlayın:

```sh
export CLAUDE_CODE_USE_BEDROCK=true
```

- Kimlik bilgilerini Claude Agent SDK için kullanılabilir hale getirmek üzere [Claude Code Bedrock belgelerini](https://docs.claude.com/en/docs/claude-code/amazon-bedrock) izleyin.

Google Vertex için:

- `CLAUDE_CODE_USE_VERTEX` ortam değişkenini `true` olarak ayarlayın:

```sh
export CLAUDE_CODE_USE_VERTEX=true
```

- Kimlik bilgilerini Claude Agent SDK için kullanılabilir hale getirmek üzere [Claude Code Vertex belgelerini](https://docs.claude.com/en/docs/claude-code/google-vertex-ai) izleyin.

## Hızlı Başlangıç

### Temel Kullanım

Varsayılan olarak Claude Agent SDK, hiçbir araç etkinleştirilmeden ve `default` izin modu kullanılarak geçici bir dizinde çalışır. Bu, standart [Anthropic sağlayıcısına](/docs/providers/anthropic/) benzer şekilde davranmasını sağlar. Dosya sistemine erişimi (okuma veya yazma) yoktur ve sistem komutlarını çalıştıramaz.

```yaml title="promptfooconfig.yaml"
providers:
  - anthropic:claude-agent-sdk

prompts:
  - 'Fibonacci dizisindeki ilk 10 sayıyı yazdıran bir python fonksiyonu üret'
```

Test durumlarınız bittiğinde geçici dizin silinir.

### Çalışma Dizini (Working Directory) ile Kullanım

Claude Agent SDK'nın çalışması için belirli bir çalışma dizini belirtebilirsiniz:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      working_dir: ./src

prompts:
  - 'TypeScript dosyalarını incele ve potansiyel hataları belirle'
```

Bu, testlerinizi çalıştırmadan önce dosyalar veya alt dizinlerin olduğu bir dizin hazırlamanıza olanak tanır.

Varsayılan olarak, bir çalışma dizini belirttiğinizde Claude Agent SDK'ya bu dizin için salt okunur (read-only) erişim verilir.

### Yan Etkiler (Side Effects) ile Kullanım

Claude Agent SDK'nın dosyalara yazmasına, sistem komutları çalıştırmasına, MCP sunucularını çağırmasına ve daha fazlasına izin verebilirsiniz.

İşte Claude Agent SDK'nın çalışma dizinindeki dosyaları hem okumasına hem de yazmasına izin verecek bir örnek. Salt okunur araçların varsayılan setine dosya yazma ve düzenleme araçlarını eklemek için `append_allowed_tools` kullanır. Ayrıca `permission_mode` değerini `acceptEdits` olarak ayarlar, böylece Claude Agent SDK onay istemeden dosyaları değiştirebilir.

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      working_dir: ./projem
      append_allowed_tools: ['Write', 'Edit', 'MultiEdit']
      permission_mode: 'acceptEdits'

prompts:
  - 'Kimlik doğrulama modülünü async/await kullanacak şekilde yeniden düzenle'
```

> **Not:** `acceptEdits` ve dosyalara yazma gibi yan etkileri olan araçları kullanırken, her test çalışmasından sonra dosyaları nasıl sıfırlayacağınızı düşünmeniz gerekir. Daha fazla bilgi için [Yan Etkileri Yönetme](#managing-side-effects) bölümüne bakın.

## Desteklenen Parametreler

| Parametre                            | Tür          | Açıklama                                                                                                     | Varsayılan               |
| ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------ |
| `apiKey`                             | string       | Anthropic API anahtarı                                                                                       | Ortam değişkeni          |
| `working_dir`                        | string       | Dosya işlemleri için dizin                                                                                   | Geçici dizin             |
| `model`                              | string       | Kullanılacak ana model (Claude Agent SDK'ya iletilir)                                                        | Claude Agent SDK varsayılanı |
| `fallback_model`                     | string       | Ana model başarısız olursa kullanılacak yedek model                                                          | Claude Agent SDK varsayılanı |
| `max_turns`                          | number       | Maksimum konuşma turu                                                                                        | Claude Agent SDK varsayılanı |
| `max_thinking_tokens`                | number       | Düşünme için maksimum token sayısı                                                                           | Claude Agent SDK varsayılanı |
| `max_budget_usd`                     | number       | Ajan yürütmesi için USD cinsinden maksimum maliyet bütçesi                                                   | Yok                      |
| `permission_mode`                    | string       | İzin modu: `default`, `plan`, `acceptEdits`, `bypassPermissions`, `dontAsk`                                  | `default`                |
| `allow_dangerously_skip_permissions` | boolean      | `bypassPermissions` modu kullanıldığında gerekli olan güvenlik bayrağı                                        | false                    |
| `thinking`                           | nesne        | Düşünme yapılandırması: `{type: 'adaptive'}`, `{type: 'enabled', budgetTokens: N}` veya `{type: 'disabled'}` | Model varsayılanı        |
| `effort`                             | string       | Yanıt efor düzeyi: `low`, `medium`, `high`, `max`                                                            | `high`                   |
| `agent`                              | string       | Ana iş parçacığı için adlandırılmış ajan (`agents` veya ayarlarda tanımlanmalıdır)                           | Yok                      |
| `session_id`                         | string       | Özel oturum UUID'si (`fork_session` ayarlanmadıkça `continue`/`resume` ile kullanılamaz)                     | Otomatik oluşturulur     |
| `debug`                              | boolean      | Ayrıntılı hata ayıklama günlüğünü etkinleştir                                                                | false                    |
| `debug_file`                         | string       | Hata ayıklama günlüklerini bu dosya yoluna yaz (dolaylı olarak hata ayıklamayı etkinleştirir)                | Yok                      |
| `betas`                              | string[]     | Beta özelliklerini etkinleştir (örneğin, 1M bağlam için `['context-1m-2025-08-07']`)                          | Yok                      |
| `custom_system_prompt`               | string       | Varsayılan sistem istemini değiştir                                                                          | Yok                      |
| `append_system_prompt`               | string       | Varsayılan sistem istemine ekle                                                                              | Yok                      |
| `tools`                              | dizi/nesne   | Yerleşik araçların temel seti (ad dizisi veya `{type: 'preset', preset: 'claude_code'}`)                     | Yok                      |
| `custom_allowed_tools`               | string[]     | Varsayılan izin verilen araçları değiştir                                                                    | Yok                      |
| `append_allowed_tools`               | string[]     | Varsayılan izin verilen araçlara ekle                                                                        | Yok                      |
| `allow_all_tools`                    | boolean      | Mevcut tüm araçlara izin ver                                                                                 | false                    |
| `disallowed_tools`                   | string[]     | Açıkça engellenecek araçlar (izin verilenleri geçersiz kılar)                                                | Yok                      |
| `additional_directories`             | string[]     | Ajanın erişebileceği ek dizinler (working_dir dışındakiler)                                                  | Yok                      |
| `ask_user_question`                  | nesne        | AskUserQuestion aracı için otomatik yanıt yönetimi (bkz. [AskUserQuestion Aracını Yönetme](#handling-askuserquestion-tool)) | Yok                      |
| `mcp`                                | nesne        | MCP sunucu yapılandırması                                                                                    | Yok                      |
| `strict_mcp_config`                  | boolean      | Yalnızca yapılandırılmış MCP sunucularına izin ver                                                           | true                     |
| `cache_mcp`                          | boolean      | MCP yapılandırıldığında önbelleğe almayı etkinleştir (deterministik MCP araçları için)                        | false                    |
| `setting_sources`                    | string[]     | SDK'nın ayarları, CLAUDE.md'yi ve slash komutlarını arayacağı yerler                                         | Yok (devre dışı)         |
| `output_format`                      | nesne        | JSON şemalı yapılandırılmış çıktı yapılandırması                                                             | Yok                      |
| `agents`                             | nesne        | Özel alt ajanlar için programatik ajan tanımları                                                             | Yok                      |
| `hooks`                              | nesne        | Araç çağrılarını ve diğer olayları yakalamak için olay kancaları                                              | Yok                      |
| `include_partial_messages`           | boolean      | Yanıta kısmi/akış mesajlarını dahil et                                                                       | false                    |
| `resume`                             | string       | Belirli bir oturum kimliğinden devam et                                                                      | Yok                      |
| `fork_session`                       | boolean      | Devam etmek yerine mevcut bir oturumdan çatalla (fork)                                                       | false                    |
| `continue`                           | boolean      | Mevcut bir oturumu devam ettir                                                                               | false                    |
| `enable_file_checkpointing`          | boolean      | Önceki durumlara geri dönebilmek için dosya değişikliklerini takip et                                        | false                    |
| `persist_session`                    | boolean      | Daha sonra devam edebilmek için oturumu diske kaydet                                                         | true                     |
| `sandbox`                            | nesne        | Komut yürütme yalıtımı için korumalı alan (sandbox) ayarları                                                 | Yok                      |
| `permission_prompt_tool_name`        | string       | İzin istemleri için kullanılacak MCP aracı adı                                                               | Yok                      |
| `executable`                         | string       | JavaScript çalışma zamanı: `node`, `bun` veya `deno`                                                         | Otomatik algılanır       |
| `executable_args`                    | string[]     | JavaScript çalışma zamanına iletilecek argümanlar                                                            | Yok                      |
| `extra_args`                         | nesne        | Ek CLI argümanları (`--` olmadan anahtarlar, dize olarak değerler veya bayraklar için null)                  | Yok                      |
| `path_to_claude_code_executable`     | string       | Özel bir Claude Code yürütülebilir dosyasının yolu                                                           | Yerleşik                 |
| `spawn_claude_code_process`          | fonksiyon     | VM'ler/konteynerler için özel spawn fonksiyonu (yalnızca programatik)                                        | Varsayılan spawn         |

## Modeller

Claude Agent SDK mantıklı varsayılanlar kullandığı için model seçimi isteğe bağlıdır. Belirtildiğinde, modeller doğrudan Claude Agent SDK'ya iletilir.

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      model: claude-opus-4-6
      fallback_model: claude-sonnet-4-5-20250929
```

Claude Agent SDK ayrıca yapılandırmada kullanılabilen bir dizi [model takma adını (alias)](https://docs.claude.com/en/docs/claude-code/model-config#model-aliases) destekler.

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      model: sonnet
      fallback_model: haiku
```

Claude Agent SDK ayrıca modelleri [ortam değişkenleri](https://docs.claude.com/en/docs/claude-code/model-config#environment-variables) aracılığıyla yapılandırmayı da destekler. Bu sağlayıcıyı kullanırken, ayarladığınız tüm ortam değişkenleri Claude Agent SDK'ya aktarılacaktır.

## Sistem İstemi (System Prompt)

Bir `custom_system_prompt` belirtmediğiniz sürece, varsayılan Claude Code sistem istemi kullanılacaktır. `append_system_prompt` ile buna ek talimatlar ekleyebilirsiniz.

:::info
Bunun, Claude Agent SDK'nın Promptfoo'dan bağımsız kullanıldığındaki davranışından biraz farklı olduğunu unutmayın. Agent SDK, belirtilmediği sürece varsayılan olarak Claude Code sistem istemini _kullanmayacaktır_—hiçbiri sağlanmazsa boş bir sistem istemi kullanacaktır. Bu sağlayıcı ile boş bir sistem istemi kullanmak istiyorsanız, `custom_system_prompt` değerini boş bir dize olarak ayarlayın.
:::

## Araçlar ve İzinler

### Varsayılan Araçlar (Default Tools)

Herhangi bir `working_dir` belirtilmezse, Claude Agent SDK varsayılan olarak hiçbir araca erişimi olmadan geçici bir dizinde çalışır.

Varsayılan olarak, bir `working_dir` belirtildiğinde, Claude Agent SDK aşağıdaki salt okunur araçlara erişebilir:

- `Read` - Dosya içeriğini oku
- `Grep` - Dosya içeriğinde arama yap
- `Glob` - Desene göre dosyaları bul
- `LS` - Dizin içeriğini listele

### İzin Modları (Permission Modes)

Claude Agent SDK'nın dosyaları değiştirme ve sistem komutlarını çalıştırma izinlerini kontrol edin:

| Mod                 | Açıklama                                                                |
| ------------------- | ----------------------------------------------------------------------- |
| `default`           | Standart izinler                                                        |
| `plan`              | Planlama modu                                                          |
| `acceptEdits`       | Dosya değişikliklerine izin ver                                         |
| `bypassPermissions` | Kısıtlama yok (güvenlik için `allow_dangerously_skip_permissions: true` gerektirir) |
| `dontAsk`           | Önceden onaylanmamış izinleri reddet (istem yok)                        |

:::warning
`bypassPermissions` kullanmak, bir güvenlik önlemi olarak `allow_dangerously_skip_permissions: true` ayarlanmasını gerektirir:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      permission_mode: bypassPermissions
      allow_dangerously_skip_permissions: true
```

:::

### Araç Yapılandırması (Tool Configuration)

Kullanım durumunuz için mevcut araçları özelleştirin:

```yaml
# Preset aracılığıyla tüm varsayılan Claude Code araçlarını kullanın
providers:
  - id: anthropic:claude-agent-sdk
    config:
      tools:
        type: preset
        preset: claude_code

# Tam temel araçları belirtin
providers:
  - id: anthropic:claude-agent-sdk
    config:
      tools:
        - Bash
        - Read
        - Edit
        - Write

# Tüm yerleşik araçları devre dışı bırakın
providers:
  - id: anthropic:claude-agent-sdk
    config:
      tools: []

# Varsayılanlara araçlar ekleyin
providers:
  - id: anthropic:claude-agent-sdk
    config:
      append_allowed_tools: ['Write', 'Edit']

# Varsayılan izin verilen araçları tamamen değiştirin
providers:
  - id: anthropic:claude-agent-sdk
    config:
      custom_allowed_tools: ['Read', 'Grep', 'Glob', 'Write', 'Edit', 'MultiEdit', 'Bash', 'WebFetch', 'WebSearch']

# Belirli araçları engelleyin
providers:
  - id: anthropic:claude-agent-sdk
    config:
      disallowed_tools: ['Delete', 'Run']

# Tüm araçlara izin ver (dikkatli kullanın)
providers:
  - id: anthropic:claude-agent-sdk
    config:
      allow_all_tools: true
```

`tools` seçeneği mevcut yerleşik araçların temel setini belirtirken, `allowedTools` ve `disallowedTools` bu temelden filtreleme yapar.

⚠️ **Güvenlik Notu**: Bazı araçlar Claude Agent SDK'nın dosyaları değiştirmesine, sistem komutları çalıştırmasına, web'de arama yapmasına ve daha fazlasına olanak tanır. Bu araçları kullanmadan önce güvenlik etkilerini dikkatlice düşünün.

[Mevcut araçların tam listesi burada yer almaktadır.](https://docs.claude.com/en/docs/claude-code/settings#tools-available-to-claude)

## MCP Entegrasyonu

Standart Anthropic sağlayıcısının aksine, Claude Agent SDK MCP (Model Context Protocol) bağlantılarını doğrudan yönetir. Yapılandırma Claude Agent SDK'ya aktarılır:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      mcp:
        servers:
          # HTTP tabanlı sunucu
          - url: https://api.projem.com/mcp
            name: api-server
            headers:
              Authorization: 'Bearer token'

          # İşlem (process) tabanlı sunucu
          - command: node
            args: ['mcp-server.js']
            name: yerel-sunucu

      strict_mcp_config: true # Yalnızca yapılandırılmış sunucuları kullan (varsayılan true)
```

Detaylı MCP yapılandırması için [Claude Code MCP belgelerine](https://docs.claude.com/en/docs/claude-code/mcp) bakın.

## Ayar Kaynakları (Setting Sources)

Varsayılan olarak Claude Agent SDK sağlayıcısı ayar dosyalarını, CLAUDE.md'yi veya slash komutlarını aramaz. Bunu `setting_sources` belirterek etkinleştirebilirsiniz:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      setting_sources: ['project', 'local']
```

Mevcut değerler:

- `user` - Kullanıcı düzeyi ayarlar
- `project` - Proje düzeyi ayarlar
- `local` - Yerel dizin ayarları

## Yetenekleri (Skills) Test Etme

[Ajan Yetenekleri (Skills)](https://platform.claude.com/docs/en/agent-sdk/skills), Claude'un işlevselliğini genişleten yeniden kullanılabilir kabiliyetlerdir. `.claude/skills/` dizinlerinde `SKILL.md` dosyaları olarak tanımlanırlar ve Claude Agent SDK sağlayıcısı kullanılarak test edilebilirler.

### Yetenekleri Etkinleştirme

Yetenekleri test etmek için hem `setting_sources` yapılandırmanız (dosya sisteminden yetenekleri yüklemek için) hem de izin verilen araçlara `Skill`i dahil etmeniz gerekir:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      working_dir: ./projem
      setting_sources: ['project'] # Yetenekleri .claude/skills/ altından yükle
      append_allowed_tools: ['Skill']
```

### Yetenekler Nasıl Keşfedilir?

Yetenekler başlarken yapılandırılan `setting_sources` dizinlerinden otomatik olarak keşfedilir. SDK, `.claude/skills/` alt dizinlerindeki `SKILL.md` dosyalarını tarar:

```text
projem/
└── .claude/
    └── skills/
        ├── kod-inceleme/
        │   └── SKILL.md
        └── test-ureticisi/
            └── SKILL.md
```

Claude, bir görev yeteneğin frontmatter kısmındaki açıklamasıyla eşleştiğinde ilgili yeteneği otomatik olarak çağırır.

### Yetenek Çağrısını Test Etme

Yeteneklerin düzgün çağrıldığını, [araç çağrılarını](#tool-call-tracking) kontrol ederek test edebilirsiniz. Skill aracının girdisi `skill` (yetenek adı) ve isteğe bağlı `args` parametrelerini içerir:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      working_dir: ./projem
      setting_sources: ['project']
      append_allowed_tools: ['Skill', 'Read', 'Write']

prompts:
  - 'Kimlik doğrulama modülünü güvenlik sorunları açısından incele'

tests:
  - assert:
      # Skill aracının çağrıldığını kontrol et
      - type: javascript
        value: |
          const toolCalls = context.providerResponse?.metadata?.toolCalls || [];
          return toolCalls.some(t => t.name === 'Skill');
      # Belirli bir yeteneğin çağrıldığını kontrol et
      - type: javascript
        value: |
          const toolCalls = context.providerResponse?.metadata?.toolCalls || [];
          const skillCalls = toolCalls.filter(t => t.name === 'Skill');
          return skillCalls.some(t => t.input?.skill === 'kod-inceleme');
```

### Mevcut Yetenekleri Kontrol Etme

Claude'dan mevcut yetenekleri listelemesini isteyerek yeteneklerin yüklendiğini doğrulayabilirsiniz. Bunun Claude'un serbest metin yanıtına dayandığını unutmayın, bu nedenle esnek bir iddia (assertion) kullanın:

```yaml
prompts:
  - 'Mevcut tüm yetenekleri adlarıyla listele'

tests:
  - assert:
      - type: icontains
        value: 'kod-inceleme' # Beklenen yetenek adı
```

:::note
Yanıt serbest metin olduğu için `contains` iddiaları kırılgan olabilir. Daha güvenilir testler için araç çağrılarını (tool calls) kontrol edin (bkz. [Yetenek Çağrısını Test Etme](#testing-skill-invocation)).
:::

### CI İçin Test Kısıtlamaları

CI/CD ortamlarında tutarlı testler için yalnızca proje düzeyindeki yeteneklerle kısıtlayın:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      working_dir: ./projem
      setting_sources: ['project'] # Yalnızca takımca paylaşılan yetenekler, kişisel olanları hariç tut
      append_allowed_tools: ['Skill', 'Read', 'Bash']
      permission_mode: 'acceptEdits'
```

bu, testlerin CI ortamında bulunmayabilecek kullanıcıya özel yeteneklere dayanmamasını sağlar.

### Örnek: Tam Yetenek Test Yapılandırması

```yaml title="promptfooconfig.yaml"
providers:
  - id: anthropic:claude-agent-sdk
    config:
      working_dir: ./projem
      setting_sources: ['project']
      append_allowed_tools: ['Skill', 'Read', 'Write', 'Bash']
      permission_mode: 'acceptEdits'

prompts:
  - 'UserService sınıfı için birim testleri oluştur'

tests:
  - assert:
      # test-ureticisi yeteneğinin çağrıldığını doğrula
      - type: javascript
        value: |
          const toolCalls = context.providerResponse?.metadata?.toolCalls || [];
          const skillCalls = toolCalls.filter(t => t.name === 'Skill');
          return skillCalls.some(t => t.input?.skill === 'test-ureticisi');
      # Testlerin oluşturulduğunu doğrula
      - type: icontains
        value: 'describe('
```

Yetenek oluşturma hakkında daha fazla bilgi için [Claude Code yetenekler belgelerine](https://code.claude.com/docs/en/skills) bakın.

## Bütçe Kontrolü (Budget Control)

Bir ajan yürütmesinin maksimum maliyetini `max_budget_usd` ile sınırlayın:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      max_budget_usd: 0.50
```

Maliyet belirtilen bütçeyi aşarsa ajan yürütmeyi durduracaktır.

## Ek Dizinler (Additional Directories)

Ajana çalışma dizininin dışındaki dizinlere erişim izni verin:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      working_dir: ./proje
      additional_directories:
        - /paylasilan/kitapliklar
        - /veri/modeller
```

## Yapılandırılmış Çıktı (Structured Output)

Bir çıktı şeması belirterek doğrulanmış JSON yanıtları alın:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      output_format:
        type: json_schema
        schema:
          type: object
          properties:
            analysis:
              type: string
            confidence:
              type: number
          required: [analysis, confidence]
```

`output_format` yapılandırıldığında, yanıt şemaya uygun yapılandırılmış çıktıyı içerecektir. Yapılandırılmış çıktı şuralarda mevcuttur:

- `output` - Ayrıştırılmış yapılandırılmış çıktı (varsa)
- `metadata.structuredOutput` - Ham yapılandırılmış çıktı değeri

## Oturum Yönetimi (Session Management)

Çok turlu etkileşimler için mevcut oturumları devam ettirin veya çatallayın (fork):

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      # Mevcut bir oturumu devam ettir
      resume: 'onceki-calismadan-oturum-kimligi'
      continue: true

      # VEYA mevcut bir oturumdan çatalla
      resume: 'catallanacak-oturum-kimligi'
      fork_session: true
```

Oturum kimlikleri yanıtta döndürülür ve değerlendirme çalışmaları arasında konuşmaları sürdürmek için kullanılabilir.

### Oturum Kalıcılığını Devre Dışı Bırakma

Varsayılan olarak oturumlar diske (`~/.claude/projects/`) kaydedilir ve daha sonra devam ettirilebilir. Oturum geçmişine ihtiyaç duyulmayan geçici veya otomatik iş akışları için kalıcılığı devre dışı bırakın:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      persist_session: false
```

## Dosya Checkpoint Oluşturma (File Checkpointing)

Konuşmanın önceki durumlarına geri dönebilmek için oturum sırasında dosya değişikliklerini takip edin:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      enable_file_checkpointing: true
      working_dir: ./projem
      append_allowed_tools: ['Write', 'Edit']
```

Dosya checkpoint oluşturma etkinleştirildiğinde, SDK dosyalar değiştirilmeden önce yedeklerini oluşturur. Bu, konuşmadaki herhangi bir önceki duruma programatik olarak geri yükleme yapılmasına olanak tanır.

## Beta Özellikleri

`betas` parametresini kullanarak deneysel özellikleri etkinleştirin:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      betas:
        - context-1m-2025-08-07
```

Şu anda mevcut betalar:

| Beta                    | Açıklama                                             |
| ----------------------- | ---------------------------------------------------- |
| `context-1m-2025-08-07` | 1M token bağlam penceresini etkinleştir (yalnızca Sonnet 4/4.5) |

Daha fazla bilgi için [Anthropic beta başlıkları belgelerine](https://docs.anthropic.com/en/api/beta-headers) bakın.

## Sandbox Yapılandırması

Ek güvenlik için komutları yalıtılmış bir sandbox ortamında çalıştırın:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      sandbox:
        enabled: true
        autoAllowBashIfSandboxed: true
        network:
          allowLocalBinding: true
          allowedDomains:
            - api.projem.com
```

Mevcut sandbox seçenekleri:

| Seçenek                       | Tür      | Açıklama                                                |
| ----------------------------- | -------- | ------------------------------------------------------- |
| `enabled`                     | boolean  | Sandbox yürütmeyi etkinleştir                           |
| `autoAllowBashIfSandboxed`    | boolean  | Sandbox içindeyken bash komutlarına otomatik izin ver   |
| `allowUnsandboxedCommands`    | boolean  | Sandbox'a alınamayan komutlara izin ver                |
| `enableWeakerNestedSandbox`   | boolean  | İç içe geçmiş ortamlar için daha zayıf sandbox'ı etkinleştir |
| `excludedCommands`            | string[] | Sandbox'tan hariç tutulacak komutlar                    |
| `ignoreViolations`            | nesne    | Yok sayılacak ihlal türlerine komut desenleri haritası  |
| `network.allowedDomains`      | string[] | Ağ erişimi için izin verilen alan adları                |
| `network.allowLocalBinding`   | boolean  | Localhost'a bağlanmaya izin ver                         |
| `network.allowUnixSockets`    | string[] | İzin verilecek belirli Unix soketleri                   |
| `network.allowAllUnixSockets` | boolean  | Tüm Unix soket bağlantılarına izin ver                  |
| `network.httpProxyPort`       | number   | Ağ erişimi için HTTP proxy portu                        |
| `network.socksProxyPort`      | number   | Ağ erişimi için SOCKS proxy portu                       |
| `ripgrep.command`             | string   | Özel ripgrep yürütülebilir dosyasının yolu              |
| `ripgrep.args`                | string[] | Ripgrep için ek argümanlar                              |

Daha fazla detay için [Claude Code sandbox belgelerine](https://docs.anthropic.com/en/docs/claude-code/settings#sandbox-settings) bakın.

## Gelişmiş Çalışma Zamanı Yapılandırması

### JavaScript Çalışma Zamanı

Hangi JavaScript çalışma zamanının kullanılacağını belirtin:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      executable: bun # veya 'node' veya 'deno'
      executable_args:
        - '--smol'
```

### Ek CLI Argümanları

Claude Code'a ek argümanlar iletin:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      extra_args:
        verbose: null # boolean bayrak (--verbose ekler)
        timeout: '30' # --timeout 30 ekler
```

### Özel Yürütülebilir Yol (Custom Executable Path)

Belirli bir Claude Code kurulumunu kullanın:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      path_to_claude_code_executable: /ozel/yol/claude-code
```

### Özel Spawn Fonksiyonu (Yalnızca Programatik)

Claude Code'u VM'lerde, konteynerlerde veya uzak ortamlarda çalıştırmak için sağlayıcıyı programatik olarak kullanırken özel bir spawn fonksiyonu sağlayabilirsiniz:

```typescript
import { ClaudeCodeSDKProvider } from 'promptfoo';

const provider = new ClaudeCodeSDKProvider({
  config: {
    spawn_claude_code_process: (options) => {
      // VM/konteyner yürütmesi için özel spawn mantığı
      // options şunları içerir: command, args, cwd, env, signal
      return myVMProcess; // SpawnedProcess arayüzünü karşılamalıdır
    },
  },
});
```

Bu seçenek yalnızca sağlayıcı programatik olarak kullanıldığında mevcuttur, YAML yapılandırması ile kullanılamaz.

## Programatik Ajanlar (Programmatic Agents)

Belirli araçlara ve izinlere sahip özel alt ajanlar tanımlayın:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      agents:
        kod-inceleyici:
          name: Kod İnceleyici
          description: Kodları hatalar ve stil sorunları açısından inceler
          tools: [Read, Grep, Glob]
        test-yurutucu:
          name: Test Yürütücü
          description: Testleri çalıştırır ve sonuçları raporlar
          tools: [Bash, Read]
```

## AskUserQuestion Aracını Yönetme

`AskUserQuestion` aracı, Claude'un yürütme sırasında kullanıcıya çoktan seçmeli sorular sormasına olanak tanır. Otomatik değerlendirmelerde soruları cevaplayacak bir insan olmadığı için bunların nasıl yönetileceğini yapılandırmanız gerekir.

### Kolaylık Seçeneğini Kullanma

En basit yaklaşım `ask_user_question` yapılandırmasını kullanmaktır:

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      append_allowed_tools: ['AskUserQuestion']
      ask_user_question:
        behavior: first_option
```

Mevcut davranışlar:

| Davranış        | Açıklama                                       |
| --------------- | ---------------------------------------------- |
| `first_option`  | Her zaman ilk seçeneği seç                     |
| `random`        | Mevcut seçenekler arasından rastgele seç       |
| `deny`          | Araç kullanımını reddet                        |

### Programatik Kullanım

Sağlayıcıyı programatik olarak kullanırken özel cevap seçme mantığı için kendi `canUseTool` geri çağırmanızı (callback) sağlayabilirsiniz:

```typescript
import { ClaudeCodeSDKProvider } from 'promptfoo';

const provider = new ClaudeCodeSDKProvider({
  config: {
    append_allowed_tools: ['AskUserQuestion'],
  },
  // canUseTool, SDK seçenekleri aracılığıyla iletilir
});
```

`canUseTool` geri çağırması araç adını ve girdisini alır ve bir cevap döndürür:

```typescript
async function canUseTool(toolName, input, options) {
  if (toolName !== 'AskUserQuestion') {
    return { behavior: 'allow', updatedInput: input };
  }

  const answers = {};
  for (const q of input.questions) {
    // Özel seçim mantığı - önerilen olarak işaretlenen seçenekleri tercih et
    const preferred = q.options.find((o) => o.description.toLowerCase().includes('recommended'));
    answers[q.question] = preferred?.label ?? q.options[0].label;
  }

  return {
    behavior: 'allow',
    updatedInput: {
      questions: input.questions,
      answers,
    },
  };
}
```

Daha fazla detay için [Claude Agent SDK izinleri belgelerine](https://platform.claude.com/docs/en/agent-sdk/permissions) bakın.

:::tip
Ajanın sorular sorduğu senaryoları test ediyorsanız, hangi cevabın en ilgi çekici test durumuna yol açacağını düşünün. `random` davranışı kullanmak uç vakaları (edge cases) keşfetmeye yardımcı olabilir.
:::

## Araç Çağrısı Takibi (Tool Call Tracking)

Claude Agent SDK sağlayıcısı, ajan oturumu sırasında yapılan tüm araç çağrılarını yakalar ve bunları `response.metadata.toolCalls` içinde sunar. Bu, değerlendirmelerinizde araç kullanımına dair iddialarda bulunmanıza olanak tanır.

Her araç çağrısı girişi şunları içerir:

| Alan              | Tür            | Açıklama                                                     |
| ----------------- | -------------- | ------------------------------------------------------------ |
| `id`              | string         | Benzersiz araç çağrısı kimliği                               |
| `name`            | string         | Araç adı (örn. `Read`, `Bash`, `Grep`)                       |
| `input`           | unknown        | Araca iletilen argümanlar                                    |
| `output`          | unknown        | Araç sonuç içeriği (varsa)                                   |
| `is_error`        | boolean        | Araç çağrısının hatayla sonuçlanıp sonuçlanmadığı            |
| `parentToolUseId` | string \| null | Alt ajan çağrıları için üst araç kullanım kimliği, en üst seviye için `null` |

### Araç Kullanımı Üzerine İddialarda Bulunma (Asserting on Tool Usage)

Hangi araçların çağrıldığını kontrol etmek için JavaScript iddialarını kullanın:

```yaml
assert:
  - type: javascript
    value: |
      const toolCalls = context.providerResponse?.metadata?.toolCalls || [];
      // Dosyaların okunduğundan emin ol
      return toolCalls.some(t => t.name === 'Read');
```

Aracın tam olarak ne yaptığını da doğrulayabilirsiniz:

```yaml
assert:
  - type: javascript
    value: |
      const toolCalls = context.providerResponse?.metadata?.toolCalls || [];
      const writeCall = toolCalls.find(t => t.name === 'Write');
      return writeCall?.input?.path === 'src/config.ts' && writeCall?.input?.content.includes('export const config');
```

Alt ajanların araç kullanımını doğrulamak için `parentToolUseId` kullanın:

```yaml
assert:
  - type: javascript
    value: |
      const toolCalls = context.providerResponse?.metadata?.toolCalls || [];
      // Alt ajanlar tarafından yapılan çağrıları bul
      const subAgentCalls = toolCalls.filter(t => t.parentToolUseId !== null);
      return subAgentCalls.length > 0;
```

## Yan Etkileri Yönetme (Managing Side Effects)

`acceptEdits` veya `bypassPermissions` ile Claude Agent SDK dosyaları değiştirebilir veya sistem komutları çalıştırabilir. Otomatik değerlendirmelerde bu "yan etkiler" her yürütmeden sonra temizlenmelidir.

### Geçici Dizinleri Kullanma

En güvenli yaklaşım, her test durumu için geçici bir çalışma dizini kullanmaktır. Hiçbir `working_dir` belirtmezseniz, sağlayıcı test bittiğinde silecek olan geçici bir çalışma dizini oluşturur.

```yaml
providers:
  - id: anthropic:claude-agent-sdk
    config:
      permission_mode: 'acceptEdits'
      append_allowed_tools: ['Write', 'Edit']
```

### Değerlendirme Öncesi/Sonrası Dosyaları Sıfırlama

Bir `working_dir` kullanmanız gerekiyorsa, her test çalışmasından önce dosyaları orijinal durumlarına sıfırlamak için [`beforeAll`](/docs/configuration/guide/#global-hooks) kancasını veya bir `run_command` kullanın:

```sh
# evaluate-script.sh
git checkout -- src/
npm test # veya promptfoo eval
```

Veya [dosya sistemi testi](/docs/guides/testing-file-systems/) klavuzumuzu izleyin.

### Checkpointleri Kullanma (Programatik)

Seansı her dönüşten sonra veya başarısızlıktan sonra geri almak için programatik olarak checkpointleri kullanabilirsiniz. [Dosya Checkpoint Oluşturma](#file-checkpointing) yeteneği bu iş akışını desteklemek için tasarlanmıştır.

## Sınırlamalar

- **İnteraktif İstemler**: Sağlayıcı, yetkisiz araç çağrıları için interaktif izin istemlerini işlemez (otomatik olarak reddeder). Bunun yerine `acceptEdits` modunu veya `ask_user_question` yapılandırmasını kullanın.
- **Kısmi Yanıtlar**: Varsayılan olarak yalnızca final yanıtı döndürülür. Kısmi mesajları görmek için `include_partial_messages` özelliğini etkinleştirin.
- **Aşırı Uzun Konuşmalar**: Çok yüksek `max_turns` ayarları bağlam sınırlarına veya zaman aşımlarına neden olabilir.

## Ayrıca Bakınız

- [Claude Agent SDK Resmi Belgeleri](https://docs.claude.com/en/api/agent-sdk/overview)
- [Anthropic Sağlayıcısı](/docs/providers/anthropic/)
- [Ajanlık Değerlendirmeleri (Agentic Evals)](/docs/guides/agentic-evals/)
- [MCP Sunucusu Değerlendirmesi](/docs/guides/evaluate-mcp-servers/)
- [Dosya Sistemi Testi](/docs/guides/testing-file-systems/)
