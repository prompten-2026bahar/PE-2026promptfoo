---
sidebar_position: 41
title: OpenAI Codex SDK
description: 'İş parçacığı yönetimi, yapılandırılmış çıktı ve Git uyumlu işlemlerle değerlendirmeler (evals) için OpenAI Codex SDK"sını kullanın'
---

# OpenAI Codex SDK

Bu sağlayıcı, OpenAI'ın Codex SDK'sını değerlendirmeler için kullanılabilir hale getirir. Codex SDK; iş parçacığı (thread) tabanlı konuşmalar ve JSON şeması çıktısı ile kod üretimi ve manipülasyonunu destekler.

:::note

OpenAI Codex SDK tescilli bir pakettir ve varsayılan olarak yüklü gelmez. Ayrıca yüklemeniz gerekir.

:::

## Sağlayıcı Kimlikleri (IDs)

Bu sağlayıcıya şu iki şekilden biriyle başvurabilirsiniz:

- `openai:codex-sdk` (tam ad)
- `openai:codex` (takma ad)

## Kurulum

OpenAI Codex SDK sağlayıcısı, `@openai/codex-sdk` paketinin ayrı olarak kurulmasını gerektirir:

```bash
npm install @openai/codex-sdk
```

:::note

Bu isteğe bağlı bir bağımlılıktır ve yalnızca OpenAI Codex SDK sağlayıcısını kullanmak istiyorsanız kurulması gerekir. codex-sdk kütüphanesinin tescilli bir lisansı olabileceğini unutmayın.

:::

## Kurulum

OpenAI API anahtarınızı `OPENAI_API_KEY` ortam değişkeni ile ayarlayın veya sağlayıcı yapılandırmasında `apiKey` belirtin.

OpenAI API anahtarlarını [buradan](https://platform.openai.com/api-keys) oluşturun.

Ortam değişkenini ayarlama örneği:

```sh
export OPENAI_API_KEY=api_anahtarınız_buraya
```

Alternatif olarak, `CODEX_API_KEY` ortam değişkenini kullanabilirsiniz:

```sh
export CODEX_API_KEY=api_anahtarınız_buraya
```

## Hızlı Başlangıç

### Temel Kullanım

Varsayılan olarak Codex SDK, geçerli çalışma dizininde (current working directory) çalışır ve güvenlik için bir Git deposu (repository) gerektirir. Bu, kod modifikasyonlarından kaynaklanan hataları önler.

```yaml title="promptfooconfig.yaml"
providers:
  - openai:codex-sdk

prompts:
  - 'Bir sayının faktöriyelini hesaplayan bir Python fonksiyonu yazın'
```

Sağlayıcı, her değerlendirme test vakası için geçici bir iş parçacığı (thread) oluşturur.

### Özel Bir Model İle

Kod üretimi için hangi OpenAI modelinin kullanılacağını belirtin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:codex-sdk
    config:
      model: codex # Veya desteklenen herhangi bir model
```

### Çalışma Dizini İle

Codex SDK'nın çalışması için özel bir çalışma dizini belirtin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:codex-sdk
    config:
      working_dir: ./src
```

Bu, testlerinizi çalıştırmadan önce dosyalarla birlikte bir dizin hazırlamanıza olanak tanır.

### Git Kontrolünü Atlama

Git olmayan bir dizinde çalışmanız gerekiyorsa, Git deposu zorunluluğunu atlayabilirsiniz:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:codex-sdk
    config:
      working_dir: ./temp-workspace
      skip_git_repo_check: true
```

:::warning

Git kontrolünü atlamak bir güvenlik korumasını kaldırır. Dikkatli kullanın ve önemli kodlar için sürüm kontrolü yapmayı düşünün.

:::

## Desteklenen Parametreler

| Parametre                | Tür      | Açıklama                                       | Varsayılan            |
| ------------------------ | -------- | ---------------------------------------------- | --------------------- |
| `apiKey`                 | string   | OpenAI API anahtarı                            | Ortam değişkeni       |
| `base_url`               | string   | API istekleri için özel temel URL (proxyler için) | Yok                   |
| `working_dir`            | string   | Codex'in çalışacağı dizin                      | Geçerli dizin         |
| `additional_directories` | string[] | Ajansın erişebileceği ek dizinler              | Yok                   |
| `model`                  | string   | Kullanılacak model                             | SDK varsayılanı       |
| `sandbox_mode`           | string   | Sandbox erişim seviyesi (aşağıya bakın)         | `workspace-write`     |
| `model_reasoning_effort` | string   | Akıl yürütme yoğunluğu (aşağıya bakın)         | SDK varsayılanı       |
| `network_access_enabled` | boolean  | Ağ isteklerine izin ver                        | false                 |
| `web_search_enabled`     | boolean  | Web aramasına izin ver                         | false                 |
| `approval_policy`        | string   | Ne zaman onay gerekeceği (aşağıya bakın)        | SDK varsayılanı       |
| `collaboration_mode`     | string   | Çoklu ajan modu: `coding` veya `plan` (beta)    | Yok                   |
| `skip_git_repo_check`    | boolean  | Git deposu doğrulamasını atla                  | false                 |
| `codex_path_override`    | string   | Codex ikili dosyasına (binary) özel yol        | Yok                   |
| `thread_id`              | string   | ~/.codex/sessions konumundan mevcut oturumu devam ettir | Yok (yeni oluşturur)  |
| `persist_threads`        | boolean  | İş parçacıklarını çağrılar arasında canlı tut  | false                 |
| `thread_pool_size`       | number   | Maksimum eşzamanlı iş parçacığı (persist_threads varken) | 1                     |
| `output_schema`          | object   | Yapılandırılmış yanıtlar için JSON şeması      | Yok                   |
| `cli_env`                | object   | Codex CLI için özel ortam değişkenleri         | İşlemden devralır     |
| `enable_streaming`       | boolean  | Akışlı (streaming) olayları etkinleştir        | false                 |
| `deep_tracing`           | boolean  | CLI iç kısmının OpenTelemetry izlemesini etkinleştir | false                 |

### Sandbox Modları

`sandbox_mode` parametresi dosya sistemi erişimini kontrol eder:

- `read-only` - Ajan sadece dosyaları okuyabilir (en güvenlisi)
- `workspace-write` - Ajan çalışma dizinine yazabilir (varsayılan)
- `danger-full-access` - Ajan tam dosya sistemi erişimine sahiptir (dikkatli kullanın)

### Onay Politikaları (Approval Policies)

`approval_policy` parametresi ne zaman kullanıcı onayı gerektiğini kontrol eder:

- `never` - Asla onay gerektirmez
- `on-request` - İstendiğinde onay gerektirir
- `on-failure` - Hatalardan sonra onay gerektirir
- `untrusted` - Güvenilmeyen işlemler için onay gerektirir

## Modeller

SDK çeşitli OpenAI modellerini destekler. Kod üretme görevleri için `gpt-5.1-codex` kullanın:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      model: gpt-5.1-codex # Kod görevleri için önerilir
```

Desteklenen modeller şunları içerir:

- **GPT-5.2** - Geliştirilmiş bilgi ve akıl yürütmeye sahip en son frontier model
- **GPT-5.1 Codex** - Kod üretimi için optimize edilmiştir (`gpt-5.1-codex`, `gpt-5.1-codex-max`, `gpt-5.1-codex-mini`)
- **GPT-5 Codex** - Önceki nesil (`gpt-5-codex`, `gpt-5-codex-mini`)
- **GPT-5** - Temel GPT-5 modeli (`gpt-5`)

### Mini Modeller

Daha hızlı veya daha düşük maliyetli değerlendirmeler için mini model varyantlarını kullanın:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      model: gpt-5.1-codex-mini
```

## İş Parçacığı (Thread) Yönetimi

Codex SDK, `~/.codex/sessions` dizininde saklanan iş parçacığı tabanlı konuşmaları kullanır. Promptfoo üç iş parçacığı yönetim modunu destekler:

### Geçici (Ephemeral) İş Parçacıkları (Varsayılan)

Her değerlendirme için yeni bir iş parçacığı oluşturur ve ardından atar:

```yaml
providers:
  - openai:codex-sdk
```

### Kalıcı (Persistent) İş Parçacıkları

Aynı yapılandırmaya sahip değerlendirmeler arasında iş parçacıklarını yeniden kullanın:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      persist_threads: true
      thread_pool_size: 2 # En fazla 2 eşzamanlı iş parçacığına izin ver
```

İş parçacıkları önbellek anahtarına göre (çalışma dizini + model + çıktı şeması + istem) havuzlanır. Havuz dolduğunda en eski iş parçacığı atılır.

### İş Parçacığını Devam Ettirme

Belirli bir iş parçacığını kimliğiyle (ID) devam ettirin:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      thread_id: abc123def456 # ~/.codex/sessions konumundaki iş parçacığı kimliği
      persist_threads: true # Devam ettirilen iş parçacığını önbelleğe al
```

## Yapılandırılmış Çıktı (Structured Output)

Codex SDK, JSON şeması çıktısını destekler. Yapılandırılmış yanıtlar almak için bir `output_schema` belirtin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:codex-sdk
    config:
      output_schema:
        type: object
        properties:
          function_name:
            type: string
          parameters:
            type: array
            items:
              type: string
          return_type:
            type: string
        required:
          - function_name
          - parameters
          - return_type

prompts:
  - 'Fibonacci sayılarını hesaplayan bir fonksiyonun imzasını (signature) tanımlayın'

tests:
  - assert:
      - type: is-json
      - type: javascript
        value: 'output.function_name.includes("fibonacci")'
```

Çıktı, şemanızla eşleşen geçerli bir JSON olacaktır.

### Zod Şemaları

`zod-to-json-schema` ile dönüştürülmüş Zod şemalarını da kullanabilirsiniz:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      output_schema: file://schemas/function-signature.json
```

## Akış (Streaming)

İlerleme olaylarını almak için akışı etkinleştirin:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      enable_streaming: true
```

Akış etkinleştirildiğinde sağlayıcı, nihai yanıtı oluşturmak için `item.completed` ve `turn.completed` gibi olayları işler.

## İzleme (Tracing) ve Gözlemlenebilirlik

OpenAI Codex SDK sağlayıcısı iki düzeyde izlemeyi destekler:

### Akış Modu İzlemesi

Codex işlemlerini OpenTelemetry aralıkları (spans) olarak yakalamak için `enable_streaming` özelliğini etkinleştirin:

```yaml title="promptfooconfig.yaml"
tracing:
  enabled: true
  otlp:
    http:
      enabled: true
      port: 4318
      acceptFormats:
        - json

providers:
  - id: openai:codex-sdk
    config:
      enable_streaming: true
```

Akış etkinleştirildiğinde sağlayıcı şunlar için aralıklar (spans) oluşturur:

- **Sağlayıcı düzeyi çağrılar** - Genel istek zamanlaması ve token kullanımı
- **Ajan yanıtları** - Bireysel mesaj tamamlamaları
- **Akıl yürütme adımları** - Aralık olaylarında yakalanan model akıl yürütmesi
- **Komut yürütme** - Çıkış kodları ve çıktılarla birlikte kabuk (shell) komutları
- **Dosya değişiklikleri** - Yollar ve değişiklik türleriyle birlikte dosya modifikasyonları
- **MCP araç çağrıları** - Harici araç çağrıları

### Derin İzleme (Deep Tracing)

Gelecekteki CLI düzeyinde izleme desteği için `deep_tracing` özelliğini etkinleştirin:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      deep_tracing: true
      enable_streaming: true
```

Derin izleme, OpenTelemetry ortam değişkenlerini (`OTEL_EXPORTER_OTLP_ENDPOINT`, `TRACEPARENT` vb.) Codex CLI işlemine enjekte ederek, CLI yerel OTEL desteği eklediğinde izleme bağlamı yayılımını (context propagation) etkinleştirir.

:::warning

Derin izleme, **iş parçacığı kalıcılığı (thread persistence) ile uyumsuzdur**. `deep_tracing: true` olduğunda:

- `persist_threads`, `thread_id` ve `thread_pool_size` dikkate alınmaz
- Doğru aralık bağlantısını sağlamak için her çağrıda taze bir Codex örneği oluşturulur

:::

### İzlemeleri Görüntüleme

Değerlendirmenizi çalıştırın ve izlemeleri OTLP uyumlu arka ucunuzda (Jaeger, Zipkin vb.) görüntüleyin:

```bash
promptfoo eval -c promptfooconfig.yaml
```

## Git Deposu (Repository) Zorunluluğu

Varsayılan olarak Codex SDK, çalışma dizininde bir Git deposu gerektirir. Bu, kod modifikasyonlarından kaynaklanan hataları önler.

Sağlayıcı şunları doğrular:

1. Çalışma dizini mevcuttur ve erişilebilirdir
2. Çalışma dizini bir klasördür (dosya değildir)
3. Çalışma dizininde `.git` klasörü mevcuttur

Doğrulama başarısız olursa bir hata mesajı görürsünüz.

Bu güvenlik kontrolünü atlamak için:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      skip_git_repo_check: true
```

## Sandbox Modu

Ajan için dosya sistemi erişim seviyesini kontrol edin:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      sandbox_mode: read-only # En güvenlisi - ajan sadece dosyaları okuyabilir
```

Kullanılabilir modlar:

- `read-only` - Ajan sadece dosyaları okuyabilir, değişikliğe izin verilmez
- `workspace-write` - Ajan çalışma dizinine yazabilir (varsayılan)
- `danger-full-access` - Tam dosya sistemi erişimi (aşırı dikkatle kullanın)

## Web Araması ve Ağ Erişimi

Ajansın web'de arama yapmasını veya ağ istekleri göndermesini etkinleştirin:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      web_search_enabled: true # Web aramalarına izin ver
      network_access_enabled: true # Ağ isteklerine izin ver
```

:::warning

Ağ erişimini etkinleştirmek, ajansın isteğe bağlı HTTP istekleri yapmasına olanak tanır. Dikkatli ve sadece güvenilir ortamlarda kullanın.

:::

## İş Birliği Modu (Collaboration Mode) (Beta)

Codex'in diğer ajan iş parçacıkları oluşturabileceği ve onlarla iletişim kurabileceği çoklu ajan koordinasyonunu etkinleştirin:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      collaboration_mode: plan # veya 'coding'
      enable_streaming: true # İş birliği olaylarını görmek için önerilir
```

Kullanılabilir modlar:

- `coding` - Uygulama ve kod yürütmeye odaklanır
- `plan` - Yürütmeden önce planlama ve akıl yürütmeye odaklanır

İş birliği modu etkinleştirildiğinde ajan; birden fazla iş parçacığı arasında çalışmayı koordine etmek için `spawn_agent`, `send_input` ve `wait` gibi araçları kullanabilir.

:::note

İş birliği modu bir beta özelliğidir. `model` ve `model_reasoning_effort` gibi kullanıcı tarafından yapılandırılan bazı ayarlar, iş birliği ön ayarları tarafından geçersiz kılınabilir.

:::

## Model Akıl Yürütme Eforu (Reasoning Effort)

Modelin ne kadar akıl yürütme kullanacağını kontrol edin:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      model_reasoning_effort: high # Karmaşık görevler için kapsamlı akıl yürütme
```

Kullanılabilir seviyeler modele göre değişir:

| Seviye    | Açıklama                                       | Desteklenen Modeller       |
| --------- | ---------------------------------------------- | -------------------------- |
| `none`    | Akıl yürütme yükü yok                          | Sadece gpt-5.2             |
| `minimal` | SDK takma adı (minimal akıl yürütme)           | Tüm modeller               |
| `low`     | Hafif akıl yürütme, daha hızlı yanıtlar        | Tüm modeller               |
| `medium`  | Dengeli (varsayılan)                           | Tüm modeller               |
| `high`    | Karmaşık görevler için kapsamlı akıl yürütme   | Tüm modeller               |
| `xhigh`   | Maksimum akıl yürütme derinliği                | gpt-5.2, gpt-5.1-codex-max |

## Ek Dizinler

Codex ajansının ana çalışma dizininin ötesindeki dizinlere erişmesine izin verin:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      working_dir: ./src
      additional_directories:
        - ./tests
        - ./config
        - ./shared-libs
```

Bu, ajansın test dosyaları, yapılandırma veya paylaşılan kütüphaneler gibi birden fazla konumdan dosya okuması gerektiğinde yararlıdır.

## Özel Ortam Değişkenleri

Codex CLI'ya özel ortam değişkenleri iletin:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      cli_env:
        CUSTOM_VAR: ozel-deger
        ANOTHER_VAR: baska-deger
```

Varsayılan olarak sağlayıcı, tüm ortam değişkenlerini Node.js işleminden devralır.

## Özel İkili Dosya Yolu (Binary Path)

Varsayılan codex ikili dosya konumunu geçersiz kılın:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      codex_path_override: /ozel/yol/codex
```

## Önbellek (Caching) Davranışı

Bu sağlayıcı yanıtları otomatik olarak şunlara göre önbelleğe alır:

- İstem içeriği
- Çalışma dizini (belirtilmişse)
- Ek dizinler (belirtilmişse)
- Model adı
- Çıktı şeması (belirtilmişse)
- Sandbox modu (belirtilmişse)
- Model akıl yürütme eforu (belirtilmişse)
- Ağ/web arama ayarları (belirtilmişse)
- Onay politikası (belirtilmişse)

Önbelleği küresel olarak devre dışı bırakmak için:

```bash
export PROMPTFOO_CACHE_ENABLED=false
```

Belirli bir test vakası için önbelleği sıfırlamak (bust) isterseniz, test yapılandırmanızda `options.bustCache: true` ayarlayın:

```yaml
tests:
  - vars: {}
    options:
      bustCache: true
```

## Gelişmiş Örnekler

### Çok Dosyalı Kod İncelemesi

Artırılmış akıl yürütme ile bir kod tabanındaki birden fazla dosyayı inceleyin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:codex-sdk
    config:
      working_dir: ./src
      model_reasoning_effort: high # Kod incelemesi için kapsamlı akıl yürütme kullan

prompts:
  - 'Bu dizindeki tüm TypeScript dosyalarını inceleyin ve şunları tanımlayın:
    1. Olası güvenlik açıkları
    2. Performans sorunları
    3. Kod stili ihlalleri
    Bulguları JSON formatında döndürün'

tests:
  - assert:
      - type: is-json
      - type: javascript
        value: 'Array.isArray(output.findings)'
```

### Yapılandırılmış Hata Raporu Üretimi

Koddan yapılandırılmış hata raporları oluşturun:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:codex-sdk
    config:
      working_dir: ./test-code
      output_schema:
        type: object
        properties:
          bugs:
            type: array
            items:
              type: object
              properties:
                severity:
                  type: string
                  enum: [critical, high, medium, low]
                file:
                  type: string
                line:
                  type: number
                description:
                  type: string
                fix_suggestion:
                  type: string
              required:
                - severity
                - file
                - description
        required:
          - bugs

prompts:
  - 'Kodu analiz edin ve tüm hataları tanımlayın'
```

### İş Parçacığı Tabanlı Konuşmalar

Çok turlu konuşmalar için kalıcı iş parçacıklarını kullanın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:codex-sdk
    config:
      persist_threads: true
      thread_pool_size: 1

tests:
  - vars:
      request: 'Bir User sınıfı oluştur'
  - vars:
      request: 'E-postayı doğrulamak için bir yöntem ekle'
  - vars:
      request: 'Uygun tip ipuçlarını (type hints) ekle'

prompts:
  - '{{request}}'
```

Her test aynı iş parçacığını yeniden kullanarak bağlamı korur.

## Claude Agent SDK ile Karşılaştırma

Her iki sağlayıcı da kod işlemlerini destekler ancak farklı özelliklere sahiptir:

### OpenAI Codex SDK

- **En iyi kullanım alanı**: Kod üretimi, yapılandırılmış çıktı, akıl yürütme görevleri
- **Özellikler**: JSON şeması desteği, iş parçacığı kalıcılığı, Codex modelleri
- **İş parçacığı yönetimi**: Yerleşik havuzlama ve devam ettirme
- **Çalışma dizini**: Git deposu doğrulaması
- **Yapılandırma**: Kod görevlerine odaklanmış

### Claude Agent SDK

- **En iyi kullanım alanı**: Dosya manipülasyonu, sistem komutları, MCP entegrasyonu
- **Özellikler**: Araç izinleri, MCP sunucuları, CLAUDE.md desteği
- **İş parçacığı yönetimi**: Geçici dizin izolasyonu
- **Çalışma dizini**: Git zorunluluğu yok
- **Yapılandırma**: Araç izinleri ve sistem erişimi için daha fazla seçenek

Kullanım durumunuza göre seçin:

- **Kod üretimi ve analizi** → OpenAI Codex SDK
- **Sistem işlemleri ve araçlar** → Claude Agent SDK

## Örnekler

Eksiksiz uygulamalar için [örnekler dizinine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-codex-sdk) bakın:

- [Temel kullanım](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-codex-sdk/basic) - Basit kod üretimi
- [Agentic SDK karşılaştırması](https://github.com/promptfoo/promptfoo/tree/main/examples/agentic-sdk-comparison) - Claude Agent SDK ile yan yana karşılaştırma

## Ayrıca Bakınız

- [OpenAI Platform Belgeleri](https://platform.openai.com/docs/)
- [Standart OpenAI sağlayıcısı](/docs/providers/openai/) - Sadece metin tabanlı etkileşimler için
- [Claude Agent SDK sağlayıcısı](/docs/providers/claude-agent-sdk/) - Alternatif ajan sağlayıcısı
