---
sidebar_position: 42
title: OpenCode SDK
description: '75+ sağlayıcı, yerleşik araçlar ve terminal yerel yapay zeka ajanı ile değerlendirmeler (evals) için OpenCode SDK"sını kullanın'
---

# OpenCode SDK

Bu sağlayıcı, 75'ten fazla LLM sağlayıcısı desteği ile terminal için açık kaynaklı bir yapay zeka kodlama ajanı olan [OpenCode](https://opencode.ai/)'u entegre eder.

## Sağlayıcı Kimlikleri (IDs)

- `opencode:sdk` - OpenCode'un yapılandırılmış modelini kullanır
- `opencode` - `opencode:sdk` ile aynıdır

Model, OpenCode CLI veya `~/.opencode/config.yaml` aracılığıyla yapılandırılır.

## Kurulum

OpenCode SDK sağlayıcısı hem OpenCode CLI hem de SDK paketini gerektirir.

### 1. OpenCode CLI'yı Kurun

```bash
curl -fsSL https://opencode.ai/install | bash
```

Veya diğer paket yöneticileri aracılığıyla - seçenekler için [opencode.ai](https://opencode.ai) adresine bakın.

### 2. SDK Paketini Kurun

```bash
npm install @opencode-ai/sdk
```

:::note

SDK paketi isteğe bağlı bir bağımlılıktır ve yalnızca OpenCode SDK sağlayıcısını kullanmak istiyorsanız kurulması gerekir.

:::

## Kurulum

LLM sağlayıcı kimlik bilgilerinizi yapılandırın. Anthropic için:

```bash
export ANTHROPIC_API_KEY=api_anahtarınız_buraya
```

OpenAI için:

```bash
export OPENAI_API_KEY=api_anahtarınız_buraya
```

OpenCode 75'ten fazla sağlayıcıyı destekler - tam liste için [Desteklenen Sağlayıcılar](#desteklenen-saglayicilar) bölümüne bakın.

## Hızlı Başlangıç

### Temel Kullanım

OpenCode'un yapılandırılmış modeline erişmek için `opencode:sdk` kullanın:

```yaml title="promptfooconfig.yaml"
providers:
  - opencode:sdk

prompts:
  - 'E-posta adreslerini doğrulayan bir Python fonksiyonu yazın'
```

Modelinizi OpenCode CLI aracılığıyla yapılandırın: `opencode config set model openai/gpt-4o`

Varsayılan olarak, OpenCode SDK hiçbir araç etkinleştirilmeden geçici bir dizinde çalışır. Test vakalarınız bittiğinde geçici dizin silinir.

### Satır İçi Model Yapılandırması İle

Sağlayıcıyı ve modeli doğrudan yapılandırmanızda belirtin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: opencode:sdk
    config:
      provider_id: anthropic
      model: claude-sonnet-4-20250514

prompts:
  - 'E-posta adreslerini doğrulayan bir Python fonksiyonu yazın'
```

Bu, bu spesifik değerlendirme için OpenCode CLI aracılığıyla yapılandırılan modeli geçersiz kılar.

### Çalışma Dizini İle

Salt okunur dosya araçlarını etkinleştirmek için bir çalışma dizini belirtin:

```yaml
providers:
  - id: opencode:sdk
    config:
      working_dir: ./src

prompts:
  - 'TypeScript dosyalarını inceleyin ve olası hataları belirleyin'
```

Varsayılan olarak, bir çalışma dizini belirttiğinizde, OpenCode SDK şu salt okunur araçlara erişebilir: `read`, `grep`, `glob`, `list`.

### Tam Araç Erişimi İle

Dosya değişiklikleri ve kabuk (shell) erişimi için ek araçları etkinleştirin:

```yaml
providers:
  - id: opencode:sdk
    config:
      working_dir: ./project
      tools:
        read: true
        grep: true
        glob: true
        list: true
        write: true
        edit: true
        bash: true
      permission:
        bash: allow
        edit: allow
```

:::warning

Yazma/düzenleme/bash araçlarını etkinleştirirken, her testten sonra dosyaları nasıl sıfırlayacağınızı düşünün. [Yan Etkileri Yönetme](#yan-etkileri-yonetme) bölümüne bakın.

:::

## Desteklenen Parametreler

| Parametre          | Tür     | Açıklama                                       | Varsayılan                 |
| ------------------ | ------- | ---------------------------------------------- | -------------------------- |
| `apiKey`           | string  | LLM sağlayıcısı için API anahtarı              | Ortam değişkeni            |
| `baseUrl`          | string  | Mevcut OpenCode sunucusunun URL'si             | Sunucuyu otomatik başlat   |
| `hostname`         | string  | Yeni sunucu başlatılırken ana makine adı       | `127.0.0.1`                |
| `port`             | number  | Yeni sunucu başlatılırken sunucu portu         | Otomatik seçilir           |
| `timeout`          | number  | Sunucu başlatma zaman aşımı (ms)               | `30000`                    |
| `working_dir`      | string  | Dosya işlemleri için dizin                     | Geçici dizin               |
| `provider_id`      | string  | LLM sağlayıcısı (anthropic, openai, google vb.) | Otomatik algılanır         |
| `model`            | string  | Kullanılacak model                             | Sağlayıcı varsayılanı      |
| `tools`            | object  | Araç yapılandırması                            | working_dir ile salt okunur |
| `permission`       | object  | Araçlar için izin yapılandırması               | Tehlikeli araçlar için sor |
| `agent`            | string  | Kullanılacak yerleşik ajan (build, plan)       | Varsayılan ajan            |
| `custom_agent`     | object  | Özel ajan yapılandırması                       | Yok                        |
| `session_id`       | string  | Mevcut oturumu devam ettir                     | Yeni oturum oluştur        |
| `persist_sessions` | boolean | Çağrılar arasında oturumları koru              | `false`                    |
| `mcp`              | object  | MCP sunucu yapılandırması                      | Yok                        |
| `cache_mcp`        | boolean | MCP yapılandırıldığında önbelleğe almayı etkinleştir | `false`              |

## Desteklenen Sağlayıcılar

OpenCode, [Models.dev](https://models.dev/) aracılığıyla 75'ten fazla LLM sağlayıcısını destekler:

**Bulut Sağlayıcıları:**

- Anthropic (Claude)
- OpenAI
- Google AI Studio / Vertex AI
- Amazon Bedrock
- Azure OpenAI
- Groq
- Together AI
- Fireworks AI
- DeepSeek
- Perplexity
- Cohere
- Mistral
- Ve çok daha fazlası...

**Yerel Modeller:**

- Ollama
- LM Studio
- llama.cpp

OpenCode CLI'yı kullanarak tercih ettiğiniz modeli yapılandırın:

```bash
# Varsayılan modelinizi ayarlayın
opencode config set model anthropic/claude-sonnet-4-20250514

# Veya OpenAI için
opencode config set model openai/gpt-4o

# Veya yerel modeller için
opencode config set model ollama/llama3
```

## Araçlar ve İzinler

### Varsayılan Araçlar

Hiçbir `working_dir` belirtilmediğinde, OpenCode hiçbir araca sahip olmadan geçici bir dizinde çalışır.

`working_dir` belirtildiğinde, bu salt okunur araçlar varsayılan olarak etkindir:

| Araç   | Amaç                            |
| ------ | ------------------------------- |
| `read` | Dosya içeriklerini oku          |
| `grep` | Dosya içeriklerinde regex ile ara |
| `glob` | Dosyaları desene göre bul       |
| `list` | Dizin içeriklerini listele      |

### Mevcut Tüm Araçlar

| Araç        | Amaç                                     | Varsayılan |
| ----------- | ---------------------------------------- | ---------- |
| `bash`      | Kabuk komutlarını yürüt                  | false      |
| `edit`      | Mevcut dosyaları değiştir                | false      |
| `write`     | Dosya oluştur/üzerine yaz                | false      |
| `read`      | Dosya içeriklerini oku                   | true\*     |
| `grep`      | Dosya içeriklerinde regex ile ara        | true\*     |
| `glob`      | Dosyaları desene göre bul                | true\*     |
| `list`      | Dizin içeriklerini listele               | true\*     |
| `patch`     | Diff yamalarını (patches) uygula         | false      |
| `todowrite` | Görev listeleri oluştur                  | false      |
| `todoread`  | Görev listelerini oku                    | false      |
| `webfetch`  | Web içeriğini çek                        | false      |
| `question`  | Yürütme sırasında kullanıcıdan girdi iste | false      |
| `skill`     | SKILL.md dosyalarını konuşmaya yükle     | false      |
| `lsp`       | Kod zekası sorguları (deneysel)          | false      |

\* Sadece `working_dir` belirtildiğinde etkindir.

### Araç Yapılandırması

Kullanılabilir araçları özelleştirin:

```yaml
# Ek araçları etkinleştir
providers:
  - id: opencode:sdk
    config:
      working_dir: ./project
      tools:
        read: true
        grep: true
        glob: true
        list: true
        write: true # Dosya yazmayı etkinleştir
        edit: true # Dosya düzenlemeyi etkinleştir
        bash: true # Kabuk komutlarını etkinleştir
        patch: true # Yama uygulamayı etkinleştir
        webfetch: true # Web içeriği çekmeyi etkinleştir
        question: true # Kullanıcı istemlerini etkinleştir
        skill: true # SKILL.md yüklemeyi etkinleştir

# Belirli araçları devre dışı bırak
providers:
  - id: opencode:sdk
    config:
      working_dir: ./project
      tools:
        bash: false # Kabuğu devre dışı bırak
```

### İzinler

Basit değerler veya desen tabanlı kurallar kullanarak araç izinlerini yapılandırın:

```yaml
# Basit izinler
providers:
  - id: opencode:sdk
    config:
      permission:
        bash: allow # veya 'ask' veya 'deny'
        edit: allow
        webfetch: deny
        doom_loop: deny # Sonsuz ajan döngülerini engelle
        external_directory: deny # Çalışma dizini dışına erişimi engelle

# Desen tabanlı izinler
providers:
  - id: opencode:sdk
    config:
      permission:
        bash:
          'git *': allow # Git komutlarına izin ver
          'rm *': deny # rm komutlarını reddet
          '*': ask # Diğer her şey için sor
        edit:
          '*.md': allow # Markdown düzenlemeye izin ver
          'src/**': ask # src dizini için sor
```

| İzin                 | Amaç                             |
| -------------------- | -------------------------------- |
| `bash`               | Kabuk komutu yürütme             |
| `edit`               | Dosya düzenleme                  |
| `webfetch`           | Web içeriği çekme                |
| `doom_loop`          | Sonsuz ajan döngülerini engeller |
| `external_directory` | Çalışma dizini dışına erişim      |

:::tip Güvenlik Önerisi

Güvenliğe duyarlı dağıtımlar için, sonsuz ajan döngülerini önlemek ve dosya erişimini çalışma diziniyle sınırlamak için `doom_loop: deny` ve `external_directory: deny` ayarlarını yapın.

:::

## Oturum Yönetimi

### Geçici Oturumlar (Varsayılan)

Her değerlendirme için yeni bir oturum oluşturur:

```yaml
providers:
  - opencode:sdk
```

### Kalıcı Oturumlar

Çağrılar arasında oturumları yeniden kullanın:

```yaml
providers:
  - id: opencode:sdk
    config:
      persist_sessions: true
```

### Oturumu Devam Ettirme

Belirli bir oturumu devam ettirin:

```yaml
providers:
  - id: opencode:sdk
    config:
      session_id: onceki-oturum-kimligi
```

## Özel Ajanlar

Belirli yapılandırmalara sahip özel ajanlar tanımlayın:

```yaml
providers:
  - id: opencode:sdk
    config:
      custom_agent:
        description: Güvenlik odaklı kod incelemecisi
        mode: primary # 'primary', 'subagent' veya 'all'
        model: claude-sonnet-4-20250514
        temperature: 0.3
        top_p: 0.9 # Çekirdek örnekleme parametresi
        steps: 10 # Sadece metin yanıtından önceki maksimum yineleme
        color: '#ff5500' # Görsel tanımlama
        tools:
          read: true
          grep: true
          write: false
          bash: false
        permission:
          edit: deny
          external_directory: deny
        prompt: |
          Siz güvenlik odaklı bir kod incelemecisisiniz.
          Kodu zayıf noktalar açısından analiz edin ve bulguları raporlayın.
```

| Parametre     | Tür     | Açıklama                                       |
| ------------- | ------- | ---------------------------------------------- |
| `description` | string  | Gerekli. Ajansın amacını açıklar               |
| `mode`        | string  | 'primary', 'subagent' veya 'all'               |
| `model`       | string  | Model Kimliği (küresel ayarı geçersiz kılar)   |
| `temperature` | number  | Yanıt rastgeleliği (0.0-1.0)                   |
| `top_p`       | number  | Çekirdek örnekleme (0.0-1.0)                   |
| `steps`       | number  | Sadece metin yanıtından önceki maksimum yineleme |
| `color`       | string  | Görsel tanımlama için Hex rengi                |
| `tools`       | object  | Araç yapılandırması                            |
| `permission`  | object  | İzin yapılandırması                            |
| `prompt`      | string  | Özel sistem istemi                             |
| `disable`     | boolean | Bu ajanı devre dışı bırak                      |
| `hidden`      | boolean | @ tamamlamasından gizle (sadece alt ajanlar)   |

## MCP Entegrasyonu

OpenCode, MCP (Model Context Protocol) sunucularını destekler:

```yaml
providers:
  - id: opencode:sdk
    config:
      mcp:
        # Yerel MCP sunucusu
        weather-server:
          type: local
          command: ['node', 'mcp-weather-server.js']
          environment:
            API_KEY: '{{env.WEATHER_API_KEY}}'
          timeout: 30000
          enabled: true

        # Başlıklar içeren uzak MCP sunucusu
        api-server:
          type: remote
          url: https://api.example.com/mcp
          headers:
            Authorization: 'Bearer {{env.API_TOKEN}}'

        # OAuth içeren uzak MCP sunucusu
        oauth-server:
          type: remote
          url: https://secure.example.com/mcp
          oauth:
            clientId: '{{env.OAUTH_CLIENT_ID}}'
            clientSecret: '{{env.OAUTH_CLIENT_SECRET}}'
            scope: 'read write'
```

## Önbelleğe Alma Davranışı

Bu sağlayıcı, yanıtları aşağıdakilere göre otomatik olarak önbelleğe alır:

- İstem içeriği
- Çalışma dizini parmak izi (belirtilmişse)
- Sağlayıcı ve model yapılandırması
- Araç yapılandırması

MCP sunucuları yapılandırıldığında, MCP araçları tipik olarak harici durumlarla etkileşime girdiğinden önbelleğe alma varsayılan olarak devre dışıdır. Deterministik MCP araçları için önbelleğe almayı tekrar etkinleştirmek üzere `cache_mcp: true` ayarlayın:

```yaml
providers:
  - id: opencode:sdk
    config:
      cache_mcp: true
      mcp:
        my-server:
          type: local
          command: ['node', 'my-deterministic-mcp-server.js']
```

Önbelleğe almayı devre dışı bırakmak için:

```bash
export PROMPTFOO_CACHE_ENABLED=false
```

Belirli bir test için önbelleği sıfırlamak (bust) isterseniz:

```yaml
tests:
  - vars: {}
    options:
      bustCache: true
```

## Yan Etkileri Yönetme

Yan etkilere izin veren araçları (write, edit, bash) kullanırken şunları göz önünde bulundurun:

- **Sıralı yürütme**: Yarış durumlarını (race conditions) önlemek için `evaluateOptions.maxConcurrency: 1` ayarlayın
- **Git reset**: Her testten sonra dosyaları sıfırlamak için git kullanın
- **Uzantı kancaları (hooks)**: Kurulum/temizlik için promptfoo kancalarını kullanın
- **Konteynerler**: İzolasyon için testleri konteynerlerde çalıştırın

Sıralı yürütme örneği:

```yaml
providers:
  - id: opencode:sdk
    config:
      working_dir: ./project
      tools:
        write: true
        edit: true

evaluateOptions:
  maxConcurrency: 1
```

## Diğer Ajan Sağlayıcılar ile Karşılaştırma

| Özellik                | OpenCode SDK      | Claude Agent SDK | Codex SDK    |
| ---------------------- | ----------------- | ---------------- | ------------ |
| Sağlayıcı esnekliği    | 75+ sağlayıcı     | Sadece Anthropic | Sadece OpenAI |
| Mimari                 | İstemci-sunucu    | Doğrudan API     | İş parçacığı tabanlı |
| Yerel modeller         | Ollama, LM Studio | Hayır            | Hayır        |
| Araç ekosistemi        | Yerel + MCP       | Yerel + MCP      | Yerel        |
| Çalışma dizini izolasyonu | Evet           | Evet             | Git gerekli  |

Kullanım durumunuza göre seçin:

- **Çoklu sağlayıcılar / yerel modeller** → OpenCode SDK
- **Anthropic'e özel özellikler** → Claude Agent SDK
- **OpenAI'ya özel özellikler** → Codex SDK

## Örnekler

Eksiksiz uygulamalar için [örnekler dizinine](https://github.com/promptfoo/promptfoo/tree/main/examples/opencode-sdk) bakın:

- [Temel kullanım](https://github.com/promptfoo/promptfoo/tree/main/examples/opencode-sdk/basic) - Sadece basit sohbet modu

## Ayrıca Bakınız

- [OpenCode Belgeleri](https://opencode.ai/docs/)
- [OpenCode SDK Referansı](https://opencode.ai/docs/sdk/)
- [Claude Agent SDK Sağlayıcısı](/docs/providers/claude-agent-sdk/) - Alternatif ajan sağlayıcısı
- [OpenAI Codex SDK Sağlayıcısı](/docs/providers/openai-codex-sdk/) - Alternatif ajan sağlayıcısı
