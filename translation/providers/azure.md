---
sidebar_position: 4
title: Azure OpenAI Sağlayıcısı
description: GPT-4, akıl yürütme modelleri, asistanlar, Azure AI Foundry ve vizyon yetenekleri dahil olmak üzere Azure OpenAI modellerini değerlendirmeler için promptfoo ile yapılandırın ve kullanın
keywords: [azure, openai, gpt-4, vision, akıl yürütme modelleri, asistanlar, azure ai foundry, değerlendirme]
---

# Azure

`azure` sağlayıcısı, Azure OpenAI Servis modellerini Promptfoo ile kullanmanıza olanak tanır. Yapılandırma ayarlarını [OpenAI sağlayıcısı](/docs/providers/openai) ile paylaşır.

## Kurulum

Azure OpenAI ile kimlik doğrulaması yapmanın üç yolu vardır:

### Seçenek 1: API Anahtarı ile Kimlik Doğrulama

`AZURE_API_KEY` ortam değişkenini ayarlayın ve dağıtımınızı (deployment) yapılandırın:

```yaml
providers:
  - id: azure:chat:DagitimAdinizBuraya
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
```

### Seçenek 2: İstemci Kimlik Bilgileri (Hizmet Sorumlusu) ile Kimlik Doğrulama {#service-principal}

API anahtarı yerine bir Azure Entra ID (eski adıyla Azure AD) **Hizmet Sorumlusu (Service Principal)** kullanın. Bu, üretim ortamları, CI/CD işlem hatları ve API anahtarlarını doğrudan yönetmekten kaçınmak istediğiniz her senaryo için önerilen yaklaşımdır.

[Azure Portalı](https://portal.azure.com) üzerindeki Hizmet Sorumlusu uygulama kaydınızdan üç değere ihtiyacınız olacak:

- **İstemci Kimliği (Client ID)** – uygulama kaydınızın Uygulama (istemci) kimliği
- **İstemci Sırrı (Client Secret)** – _Sertifikalar ve sırlar_ altında oluşturulan bir sır
- **Kiracı Kimliği (Tenant ID)** – Azure AD / Entra ID dizin (kiracı) kimliğiniz

Bunları ortam değişkeni olarak ayarlayın:

```bash
export AZURE_CLIENT_ID="uygulama-istemci-kimliginiz"
export AZURE_CLIENT_SECRET="istemci-sirri-degeriniz"
export AZURE_TENANT_ID="dizin-kiraci-kimliginiz"
```

Veya bunları sağlayıcı `config` kısmında ayarlayın (bkz. [aşağıdaki tam örnek](#using-client-credentials)):

- `azureClientId`
- `azureClientSecret`
- `azureTenantId`

İsteğe bağlı olarak şunları da ayarlayabilirsiniz:

- `AZURE_AUTHORITY_HOST` / `azureAuthorityHost` (varsayılan: `https://login.microsoftonline.com`)
- `AZURE_TOKEN_SCOPE` / `azureTokenScope` (varsayılan: `https://cognitiveservices.azure.com/.default`)

Ardından dağıtımınızı yapılandırın:

```yaml
providers:
  - id: azure:chat:DagitimAdinizBuraya
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
```

:::tip

Hizmet Sorumlusunun, Azure OpenAI kaynağınızda **Cognitive Services OpenAI User** rolüne (veya eşdeğerine) sahip olması gerekir. Bunu Azure Portalı'nda kaynağınızın **Access control (IAM)** sekmesi altından atayabilirsiniz.

:::

### Seçenek 3: Azure CLI ile Kimlik Doğrulama

promptfoo'yu çalıştırmadan önce `az login` kullanarak Azure CLI ile kimlik doğrulaması yapın. Bu, önceki seçenekler için gerekli parametreler sağlanmadığında kullanılan geri dönüş (fallback) seçeneğidir.

İsteğe bağlı olarak şunu da ayarlayabilirsiniz:

- `AZURE_TOKEN_SCOPE` / `azureTokenScope` (varsayılan: 'https://cognitiveservices.azure.com/.default')

Ardından dağıtımınızı yapılandırın:

```yaml
providers:
  - id: azure:chat:DagitimAdinizBuraya
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
```

## Sağlayıcı Türleri

- `azure:chat:<dağıtım adı>` - Sohbet uç noktaları için (örn. gpt-5.1, gpt-5.1-mini, gpt-5.1-nano, gpt-5, gpt-4o)
- `azure:completion:<dağıtım adı>` - Tamamlama uç noktaları için (örn. gpt-35-turbo-instruct)
- `azure:embedding:<dağıtım adı>` - Embedding modelleri için (örn. text-embedding-3-small, text-embedding-3-large)
- `azure:responses:<dağıtım adı>` - Responses API'si için (örn. gpt-4.1, gpt-5.1)
- `azure:assistant:<asistan kimliği>` - Azure OpenAI Asistanları için (Azure OpenAI API kullanarak)
- `azure:foundry-agent:<asistan kimliği>` - Azure AI Foundry Ajanları için (Azure AI Projects SDK kullanarak)
- `azure:video:<dağıtım adı>` - Video oluşturma için (Sora)

Görüntü işleme yeteneği olan modeller (GPT-5.1, GPT-4o, GPT-4.1) standart `azure:chat:` sağlayıcı türünü kullanır.

## Mevcut Modeller

Azure hem OpenAI modellerine hem de Azure AI Foundry (Microsoft Foundry) aracılığıyla üçüncü taraf modellere erişim sağlar.

### OpenAI Modelleri

| Kategori              | Modeller                                                                       |
| --------------------- | ------------------------------------------------------------------------------ |
| **GPT-5 Serisi**      | `gpt-5.1`, `gpt-5.1-mini`, `gpt-5.1-nano`, `gpt-5`, `gpt-5-mini`, `gpt-5-nano` |
| **GPT-4.1 Serisi**    | `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`                                      |
| **GPT-4o Serisi**     | `gpt-4o`, `gpt-4o-mini`, `gpt-4o-realtime`                                     |
| **Akıl Yürütme Modelleri** | `o1`, `o1-mini`, `o1-pro`, `o3`, `o3-mini`, `o3-pro`, `o4-mini`                |
| **Özelleşmiş Modeller** | `computer-use-preview`, `gpt-image-1`, `codex-mini-latest`                     |
| **Derin Araştırma**   | `o3-deep-research`, `o4-mini-deep-research`                                    |
| **Embeddingler**      | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`   |

### Üçüncü Taraf Modeller (Azure AI Foundry)

Azure AI Foundry, birden fazla sağlayıcıdan modellere erişim sağlar:

| Sağlayıcı            | Modeller                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Anthropic Claude** | `claude-opus-4-6-20260205` (Claude Opus 4.6), `claude-sonnet-4-6` (Claude Sonnet 4.6), `claude-opus-4-5-20251101` (Claude Opus 4.5), `claude-sonnet-4-5-20250929` (Claude Sonnet 4.5), `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022` |
| **Meta Llama**       | `Llama-4-Scout-17B-16E-Instruct`, `Llama-4-Maverick-17B-128E-Instruct-FP8`, `Llama-3.3-70B-Instruct`, `Meta-Llama-3.1-405B-Instruct`, `Meta-Llama-3.1-70B-Instruct`, `Meta-Llama-3.1-8B-Instruct`                                                |
| **DeepSeek**         | `DeepSeek-R1` (akıl yürütme), `DeepSeek-V3`, `DeepSeek-R1-Distill-Llama-70B`, `DeepSeek-R1-Distill-Qwen-32B`                                                                                                                                      |
| **Mistral**          | `Mistral-Large-2411`, `Pixtral-Large-2411`, `Ministral-3B-2410`, `Mistral-Nemo-2407`                                                                                                                                                             |
| **Cohere**           | `Cohere-command-a-03-2025`, `command-r-plus-08-2024`, `command-r-08-2024`                                                                                                                                                                        |
| **Microsoft Phi**    | `Phi-4`, `Phi-4-mini-instruct`, `Phi-4-reasoning`, `Phi-4-mini-reasoning`                                                                                                                                                                        |
| **xAI Grok**         | `grok-3`, `grok-3-mini`, `grok-3-reasoning`, `grok-3-mini-reasoning`, `grok-2-vision-1212`                                                                                                                                                       |
| **AI21**             | `AI21-Jamba-1.5-Large`, `AI21-Jamba-1.5-Mini`                                                                                                                                                                                                    |
| **Core42**           | `JAIS-70b-chat`, `Falcon3-7B-Instruct`                                                                                                                                                                                                           |

Fiyatlandırması ile birlikte 200'den fazla modelin tam listesi için [Azure model kataloğu](https://azure.microsoft.com/en-us/products/ai-services/ai-foundry/) sayfasına bakın.

## Azure Responses API

Azure OpenAI Responses API, sohbet tamamlama (chat completions) ve asistan API yeteneklerini tek bir birleşik deneyimde birleştiren durum bilgili (stateful) bir API'dir. MCP sunucuları, kod yorumlayıcı ve arka plan görevleri gibi gelişmiş özellikler sağlar.

### Responses API Kullanımı

Azure Responses API'sini promptfoo ile kullanmak için `azure:responses` sağlayıcı türünü kullanın:

```yaml
providers:
  # azure:responses takma adını kullanma (önerilen)
  # Not: dağıtım adı model adıyla değil, Azure dağıtımınızla eşleşmelidir
  - id: azure:responses:gpt-4-1-dagitimim
    config:
      temperature: 0.7
      instructions: 'Yardımsever bir asistansın.'
      response_format: file://./response-schema.json
      # Yeni v1 API için 'preview' (varsayılan) kullanın
      # Eski API için '2025-04-01-preview' gibi belirli bir sürüm kullanın
      apiVersion: 'preview'

  # Veya Azure yapılandırmasıyla openai:responses kullanma (eski yöntem)
  - id: openai:responses:gpt-4.1
    config:
      apiHost: 'kaynaginiz.openai.azure.com'
      apiKey: '{{ env.AZURE_API_KEY }}' # veya OPENAI_API_KEY ortam değişkenini ayarlayın
      temperature: 0.7
      instructions: 'Yardımsever bir asistansın.'
```

### Desteklenen Responses Modelleri

Responses API tüm Azure OpenAI modellerini destekler:

- **GPT-5 Serisi**: `gpt-5.1`, `gpt-5.1-mini`, `gpt-5.1-nano`, `gpt-5`, `gpt-5-mini`, `gpt-5-nano`
- **GPT-4 Serisi**: `gpt-4o`, `gpt-4o-mini`, `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`
- **Akıl Yürütme Modelleri**: `o1`, `o1-mini`, `o1-pro`, `o3`, `o3-mini`, `o3-pro`, `o4-mini`
- **Özelleşmiş Modeller**: `computer-use-preview`, `gpt-image-1`, `codex-mini-latest`
- **Derin Araştırma Modelleri**: `o3-deep-research`, `o4-mini-deep-research`

### Responses API Özellikleri

#### Dış Dosyalarla Yanıt Formatı (Response Format)

Daha iyi bir düzen için karmaşık JSON şemalarını dış dosyalardan yükleyin:

```yaml
providers:
  - id: openai:responses:gpt-4.1
    config:
      apiHost: 'kaynaginiz.openai.azure.com'
      response_format: file://./schemas/response-schema.json
```

Örnek `response-schema.json`:

```json
{
  "type": "json_schema",
  "name": "structured_output",
  "schema": {
    "type": "object",
    "properties": {
      "result": { "type": "string" },
      "confidence": { "type": "number" }
    },
    "required": ["result", "confidence"],
    "additionalProperties": false
  }
}
```

Şemanın kendisi için iç içe geçmiş dosya referansları da kullanabilirsiniz:

```json
{
  "type": "json_schema",
  "name": "structured_output",
  "schema": "file://./schemas/output-schema.json"
}
```

Dosya yollarında değişken işleme (rendering) desteklenir:

```yaml
config:
  response_format: file://./schemas/{{ schema_name }}.json
```

#### Gelişmiş Yapılandırma

**Talimatlar (Instructions)**: Model davranışına rehberlik etmek için sistem düzeyinde talimatlar sağlayın:

```yaml
config:
  instructions: 'Teknik dokümantasyon konusunda uzmanlaşmış yardımsever bir asistansın.'
```

**Arka Plan Görevleri (Background Tasks)**: Uzun süren görevler için asenkron işlemeyi etkinleştirin:

```yaml
config:
  background: true
  store: true
```

**Yanıtları Zincirleme (Chaining Responses)**: Çok turlu konuşmalar için birden fazla yanıtı birbirine bağlayın:

```yaml
config:
  previous_response_id: '{{previous_id}}'
```

**MCP Sunucuları**: Gelişmiş araç yetenekleri için uzak MCP sunucularına bağlanın:

```yaml
config:
  tools:
    - type: mcp
      server_label: github
      server_url: https://example.com/mcp-server
      require_approval: never
      headers:
        Authorization: 'Bearer {{ env.MCP_API_KEY }}'
```

**Kod Yorumlayıcı (Code Interpreter)**: Kod yürütme yeteneklerini etkinleştirin:

```yaml
config:
  tools:
    - type: code_interpreter
      container:
        type: auto
```

**Web Araması**: Web araması yeteneklerini etkinleştirin:

```yaml
config:
  tools:
    - type: web_search_preview
```

**Görüntü Oluşturma**: Desteklenen modellerle görüntü oluşturmayı kullanın:

```yaml
config:
  tools:
    - type: image_generation
      partial_images: 2 # Akış halindeki kısmi görüntüler için
```

### Tam Responses API Örneği

Birden fazla Azure Responses API özelliğini kullanan kapsamlı bir örnek:

```yaml
# promptfooconfig.yaml
description: Azure Responses API değerlendirmesi

providers:
  # Yeni azure:responses takma adını kullanma (önerilen)
  - id: azure:responses:gpt-4.1-dagitimi
    label: azure-gpt-4.1
    config:
      temperature: 0.7
      max_output_tokens: 2000
      instructions: 'Yardımsever bir yapay zeka asistanısın.'
      response_format: file://./response-format.json
      tools:
        - type: code_interpreter
          container:
            type: auto
        - type: web_search_preview
      metadata:
        session: 'eval-001'
        user: 'test-user'
      store: true

  # Akıl yürütme modeli örneği
  - id: azure:responses:o3-mini-dagitimi
    label: azure-reasoning
    config:
      reasoning_effort: medium
      max_completion_tokens: 4000

prompts:
  - 'Bu verileri analiz et ve içgörüler sağla: {{data}}'
  - 'Şu problemi çözmek için bir Python fonksiyonu yaz: {{problem}}'

tests:
  - vars:
      data: 'Satışlar 3. çeyrekte 2. çeyreğe göre %25 arttı'
    assert:
      - type: contains
        value: 'büyüme'
      - type: contains
        value: '%25'

  - vars:
      problem: 'n terime kadar fibonacci dizisini hesapla'
    assert:
      - type: javascript
        value: 'output.includes("def fibonacci") || output.includes("function fibonacci")'
      - type: contains
        value: 'recursive'
```

### Ek Responses API Yapılandırması

**Akış (Streaming)**: Gerçek zamanlı çıktı için akışı etkinleştirin:

```yaml
config:
  stream: true
```

**Paralel Araç Çağrıları (Parallel Tool Calls)**: Aynı anda birden fazla araç çağrısına izin verin:

```yaml
config:
  parallel_tool_calls: true
  max_tool_calls: 5
```

**Kısaltma (Truncation)**: Giriş limitleri aştığında nasıl kısaltılacağını yapılandırın:

```yaml
config:
  truncation: auto # veya 'disabled'
```

**Webhook URL**: Asenkron bildirimler için bir webhook ayarlayın:

```yaml
config:
  webhook_url: 'https://webhook-adresiniz.com/callback'
```

### Responses API Sınırlamaları

- Web arama aracı desteği henüz geliştirme aşamasındadır.
- `purpose: user_data` ile PDF dosyası yükleme geçici bir çözüm gerektirir (`purpose: assistants` kullanın).
- Arka plan modu `store: true` gerektirir.
- Bazı özellikler bölgeye özel kullanılabilirliğe sahip olabilir.

## Ortam Değişkenleri

Azure OpenAI sağlayıcısı aşağıdaki ortam değişkenlerini destekler:

| Ortam Değişkeni         | Yapılandırma Anahtarı | Açıklama                           | Gerekli |
| ----------------------- | -------------------- | ---------------------------------- | -------- |
| `AZURE_API_KEY`         | `apiKey`             | Azure OpenAI API anahtarınız       | Hayır\*  |
| `AZURE_API_HOST`        | `apiHost`            | API ana bilgisayarı                | Hayır    |
| `AZURE_API_BASE_URL`    | `apiBaseUrl`         | API temel URL'si                   | Hayır    |
| `AZURE_BASE_URL`        | `apiBaseUrl`         | Alternatif API temel URL'si        | Hayır    |
| `AZURE_DEPLOYMENT_NAME` | -                    | Varsayılan dağıtım adı             | Evet     |
| `AZURE_CLIENT_ID`       | `azureClientId`      | Azure AD uygulama istemci kimliği  | Hayır\*  |
| `AZURE_CLIENT_SECRET`   | `azureClientSecret`  | Azure AD uygulama istemci sırrı    | Hayır\*  |
| `AZURE_TENANT_ID`       | `azureTenantId`      | Azure AD kiracı kimliği            | Hayır\*  |
| `AZURE_AUTHORITY_HOST`  | `azureAuthorityHost` | Azure AD otorite ana bilgisayarı   | Hayır    |
| `AZURE_TOKEN_SCOPE`     | `azureTokenScope`    | Azure AD token kapsamı             | Hayır    |

\* Ya `AZURE_API_KEY` YA DA `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` ve `AZURE_TENANT_ID` kombinasyonu sağlanmalıdır.

Not: API URL'leri için `AZURE_API_HOST`, `AZURE_API_BASE_URL` veya `AZURE_BASE_URL` değişkenlerinden sadece birini ayarlamanız yeterlidir. Birden fazlası ayarlanmışsa, sağlayıcı bunları bu tercih sırasına göre kullanacaktır.

### Varsayılan Dağıtım (Default Deployment)

Eğer `AZURE_DEPLOYMENT_NAME` ayarlanmışsa, başka bir sağlayıcı yapılandırılmadığında otomatik olarak varsayılan dağıtım olarak kullanılacaktır. Bu durum, şu koşullarda Azure OpenAI'yı varsayılan sağlayıcı yapar:

1. OpenAI API anahtarı mevcut değilse (`OPENAI_API_KEY` ayarlanmamışsa)
2. Azure kimlik doğrulaması yapılandırılmışsa (API anahtarı veya istemci kimlik bilgileri yoluyla)
3. `AZURE_DEPLOYMENT_NAME` ayarlanmışsa

Örneğin, şu ortam değişkenleriniz ayarlanmışsa:

```bash
AZURE_DEPLOYMENT_NAME=gpt-4o
AZURE_API_KEY=api-anahtarınız
AZURE_API_HOST=ana-bilgisayariniz.openai.azure.com
```

Veya şu istemci kimlik bilgisi ortam değişkenleri:

```bash
AZURE_DEPLOYMENT_NAME=gpt-4o
AZURE_CLIENT_ID=istemci-kimliginiz
AZURE_CLIENT_SECRET=istemci-sirriniz
AZURE_TENANT_ID=kiraci-kimliginiz
AZURE_API_HOST=ana-bilgisayariniz.openai.azure.com
```

O zaman Azure OpenAI, aşağıdakiler dahil tüm işlemler için varsayılan sağlayıcı olarak kullanılacaktır:

- Veri seti oluşturma
- Derecelendirme (Grading)
- Öneriler
- Sentez

### Embedding Modelleri

Eembedding modelleri metin oluşturma modellerinden farklı olduğu için, varsayılan bir embedding sağlayıcısı ayarlamak için `AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME` değişkenini belirtmelisiniz.

Bu ortam değişkenini embedding modelinizin dağıtım adına ayarlayın:

```bash
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME=text-embedding-3-small
```

Bu dağıtım, benzerlik karşılaştırmaları veya veri seti oluşturma gibi embedding gerektiren her durumda otomatik olarak kullanılacaktır. Ayrıca yapılandırmanızda embedding sağlayıcısını geçersiz kılabilirsiniz:

```yaml title="promptfooconfig.yaml"
defaultTest:
  options:
    provider:
      embedding:
        id: azure:embedding:text-embedding-3-small-dagitimi
        config:
          apiHost: 'kaynaginiz.openai.azure.com'
```

Moderasyon görevlerinin hala OpenAI API'sini kullanacağını unutmayın.

## Yapılandırma

YAML yapılandırması ortam değişkenlerini geçersiz kılabilir ve ek parametreler ayarlayabilir:

```yaml
providers:
  - id: azure:chat:DagitimAdinizBuraya
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
      # Kimlik Doğrulama (Seçenek 1: API Anahtarı)
      apiKey: 'api-anahtarınız'

      # Kimlik Doğrulama (Seçenek 2: İstemci Kimlik Bilgileri)
      azureClientId: 'azure-istemci-kimliginiz'
      azureClientSecret: 'azure-istemci-sirriniz'
      azureTenantId: 'azure-kiraci-kimliginiz'
      azureAuthorityHost: 'https://login.microsoftonline.com' # İsteğe bağlı
      azureTokenScope: 'https://cognitiveservices.azure.com/.default' # İsteğe bağlı

      # OpenAI parametreleri
      temperature: 0.5
      max_tokens: 1024
```

:::tip

Diğer tüm [OpenAI sağlayıcısı](/docs/providers/openai) ortam değişkenleri ve yapılandırma özellikleri desteklenir.

:::

## İstemci Kimlik Bilgilerini (Hizmet Sorumlusu) Kullanma {#using-client-credentials}

API anahtarı yerine bir **Hizmet Sorumlusu (SPN)** ile kimlik doğrulaması yapmak istiyorsanız şu adımları izleyin.

### Ön Koşullar

1. Bir Hizmet Sorumlusu oluşturmak için [Azure Entra ID](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps) (eski adıyla Azure AD) üzerinden **bir uygulama kaydedin**.
2. _Sertifikalar ve sırlar_ altında uygulama kaydı için **bir istemci sırrı oluşturun**.
3. Azure OpenAI kaynağınızda Hizmet Sorumlusuna `Cognitive Services OpenAI User` (veya `Cognitive Services Contributor`) **rolünü atayın**. Kaynağınızın **Access control (IAM)** > **Add role assignment** kısmına gidin.
4. **`@azure/identity` paketini kurun** — promptfoo bunu Azure Entra ID'den token almak için kullanır:

```sh
npm install @azure/identity
```

### Yapılandırma

Hizmet Sorumlusu kimlik bilgilerini **ortam değişkenleri** aracılığıyla veya doğrudan YAML **yapılandırmasında** sağlayabilirsiniz.

**Ortam değişkenlerini kullanma** (CI/CD ve üretim için önerilir):

```bash
export AZURE_CLIENT_ID="00000000-0000-0000-0000-000000000000"   # Uygulama (istemci) kimliği
export AZURE_CLIENT_SECRET="istemci-sirri-degeriniz"             # İstemci sırrı
export AZURE_TENANT_ID="00000000-0000-0000-0000-000000000000"   # Dizin (kiracı) kimliği
```

```yaml
providers:
  - id: azure:chat:gpt-4o-dagitimim
    config:
      apiHost: 'kaynaginiz.openai.azure.com'
```

**Satır içi yapılandırmayı kullanma** (yerel testler için kullanışlıdır):

```yaml
providers:
  - id: azure:chat:gpt-4o-dagitimim
    config:
      apiHost: 'kaynaginiz.openai.azure.com'
      azureClientId: '00000000-0000-0000-0000-000000000000'
      azureClientSecret: 'istemci-sirri-degeriniz'
      azureTenantId: '00000000-0000-0000-0000-000000000000'
      azureAuthorityHost: 'https://login.microsoftonline.com' # İsteğe bağlı
      azureTokenScope: 'https://cognitiveservices.azure.com/.default' # İsteğe bağlı
```

### Nasıl Çalışır?

İstemci kimlik bilgileri sağlandığında, promptfoo `@azure/identity` kütüphanesini kullanarak bir `ClientSecretCredential` oluşturur ve Azure Bilişsel Hizmetler (`https://cognitiveservices.azure.com/.default`) kapsamına sahip bir erişim tokeni ister. Token daha sonra API anahtarı yerine `Authorization` başlığında bir `Bearer` token olarak gönderilir.

Eğer ne bir API anahtarı ne de istemci kimlik bilgileri sağlanmışsa, promptfoo `AzureCliCredential` (yani `az login` oturumunuz) kullanmaya geri döner — bkz. [Seçenek 3](#option-3-azure-cli-authentication).

Belirtilmemişse `azureAuthorityHost` varsayılan olarak `https://login.microsoftonline.com` değerini alır. `azureTokenScope` ise Azure Bilişsel Hizmetler ile kimlik doğrulaması yapmak için gereken kapsam olan `https://cognitiveservices.azure.com/.default` değerini alır. Egemen bir bulutla (örneğin Azure Government veya Azure China) çalışmıyorsanız genellikle bunları değiştirmeniz gerekmez.

## Model Tarafından Derecelendirilen Testler (Model-Graded Tests)

`factuality` veya `llm-rubric` gibi [model tarafından derecelendirilen iddialar (assertions)](/docs/configuration/expected-outputs/model-graded/) varsayılan olarak `gpt-5` kullanır. `AZURE_DEPLOYMENT_NAME` ayarlandığında (ve `OPENAI_API_KEY` ayarlanmadığında), promptfoo derecelendirme için otomatik olarak belirtilen Azure dağıtımını kullanır. Ayrıca aşağıda gösterildiği gibi derecelendiriciyi açıkça geçersiz kılabilirsiniz.

Bunu _tüm_ test durumlarınız için yapmanın en kolay yolu, yapılandırmanıza [`defaultTest`](/docs/configuration/guide/#default-test-cases) özelliğini eklemektir:

```yaml title="promptfooconfig.yaml"
defaultTest:
  options:
    provider:
      id: azure:chat:gpt-4o-dagitimi
      config:
        apiHost: 'xxxxxxx.openai.azure.com'
```

Ancak bunu tekil iddialar (assertions) için de yapabilirsiniz:

```yaml
# ...
assert:
  - type: llm-rubric
    value: Yapay zeka veya sohbet asistanı olduğunuzdan bahsetmeyin
    provider:
      id: azure:chat:xxxx
      config:
        apiHost: 'xxxxxxx.openai.azure.com'
```

Veya tekil testler için:

```yaml
# ...
tests:
  - vars:
      # ...
    options:
      provider:
        id: azure:chat:xxxx
        config:
          apiHost: 'xxxxxxx.openai.azure.com'
    assert:
      - type: llm-rubric
        value: Yapay zeka veya sohbet asistanı olduğunuzdan bahsetmeyin
```

### Farklı İddia Türleri İçin Metin ve Embedding Sağlayıcılarını Kullanma

Hem metin tabanlı (ör. `llm-rubric`, `answer-relevance`) hem de embedding tabanlı (ör. `similar`) iddiaların kullanıldığı testleriniz olduğunda, **sağlayıcı türü haritası (provider type map)** desenini kullanarak her tür için farklı Azure dağıtımları yapılandırabilirsiniz:

```yaml title="promptfooconfig.yaml"
defaultTest:
  options:
    provider:
      # llm-rubric, answer-relevance, factuality vb. için metin sağlayıcısı.
      text:
        id: azure:chat:o4-mini-dagitimi
        config:
          apiHost: 'text-models.openai.azure.com'

      # Benzerlik iddiaları için embedding sağlayıcısı
      embedding:
        id: azure:embedding:text-embedding-3-large
        config:
          apiHost: 'embedding-models.openai.azure.com'
```

### Benzerlik (Similarity)

`similar` iddia türü, `text-embedding-3-large` veya `text-embedding-3-small` gibi bir embedding modeli gerektirir. Derecelendiriciyi geçersiz kılarken sohbet modeli değil, bir embedding modeli içeren dağıtım belirttiğinizden emin olun.

Örneğin, yapılandırmanızda embedding dağıtımını geçersiz kılın:

```yaml title="promptfooconfig.yaml"
defaultTest:
  options:
    provider:
      embedding:
        id: azure:embedding:text-embedding-3-small-dagitimi
        config:
          apiHost: 'kaynaginiz.openai.azure.com'
```

Herhangi bir moderasyon görevinin hala OpenAI API'sini kullanacağını unutmayın.

## Yapay Zeka Servisleri (AI Services)

[Azure AI Search API](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/references/on-your-data) ile entegrasyon için `data_sources` belirtebilirsiniz.

```yaml
providers:
  - id: azure:chat:DagitimAdinizBuraya
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
      deployment_id: 'abc123'
data_sources:
 - type: azure_search
  parameters:
   endpoint: https://xxxxxxxx.search.windows.net
    index_name: index123
     authentication:
      type: api_key
       key: ''
```

:::note

2024-02-15-preview öncesi eski Azure OpenAI API sürümleri için, [Azure AI Search API](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/use-your-data#conversation-history-for-better-results) ile entegre olmak için kullanılan `deployment_id` ve `dataSources` da belirtebilirsiniz.

```yaml
providers:
  - id: azure:chat:DagitimAdinizBuraya
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
      deployment_id: 'abc123'
      dataSources:
        - type: AzureCognitiveSearch
          parameters:
            endpoint: '...'
            key: '...'
            indexName: '...'
```

:::

## Yapılandırma Referansı

Bu özellikler sağlayıcı `config` anahtarı altında ayarlanabilir:

### Genel Yapılandırma

| Ad         | Açıklama                                                  |
| ---------- | --------------------------------------------------------- |
| apiHost    | API ana bilgisayarı (örn. `kaynaginiz.openai.azure.com`)  |
| apiBaseUrl | API'nin temel URL'si (ana bilgisayar yerine kullanılır)   |
| apiKey     | Kimlik doğrulaması için API anahtarı                      |
| apiVersion | API sürümü. Vizyon desteği için `2024-10-21` veya yenisini kullanın |

### Azure'a Özgü Yapılandırma

| Ad                 | Açıklama                                                       |
| ------------------ | -------------------------------------------------------------- |
| azureClientId      | Azure kimlik istemci kimliği                                   |
| azureClientSecret  | Azure kimlik istemci sırrı                                     |
| azureTenantId      | Azure kimlik kiracı kimliği                                    |
| azureAuthorityHost | Azure kimlik otorite ana bilgisayarı                           |
| azureTokenScope    | Azure kimlik token kapsamı                                     |
| deployment_id      | Azure bilişsel hizmetler dağıtım kimliği                       |
| dataSources        | Veri kaynaklarını belirtmek için Azure bilişsel hizmetler parametresi |

### OpenAI Yapılandırması

| Ad                    | Açıklama                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| o1                    | Azure dağıtımınız bir o1 modeli kullanıyorsa `true` olarak ayarlayın. **(Kullanımdan kaldırıldı, yerine `isReasoningModel` kullanın)** |
| isReasoningModel      | Azure dağıtımınız bir akıl yürütme modeli (o1, o3, o3-mini, o4-mini) kullanıyorsa `true` olarak ayarlayın. **Akıl yürütme modelleri için gereklidir** |
| max_completion_tokens | Akıl yürütme modelleri için üretilecek maksimum token sayısı. Yalnızca `isReasoningModel`, `true` olduğunda kullanılır        |
| reasoning_effort      | Akıl yürütme derinliğini kontrol eder: 'low', 'medium' veya 'high'. Yalnızca `isReasoningModel`, `true` olduğunda kullanılır |
| temperature           | Rastgeleliği kontrol eder (0-2). Akıl yürütme modelleri için desteklenmez                                                   |
| max_tokens            | Üretilecek maksimum token sayısı. Akıl yürütme modelleri için desteklenmez                                                  |
| top_p                 | Çekirdek örneklemeyi kontrol eder (0-1)                                                                                     |
| frequency_penalty     | Tekrarlanan tokenleri cezalandırır (-2 ile 2 arası)                                                                         |
| presence_penalty      | Varlığa bağlı olarak yeni tokenleri cezalandırır (-2 ile 2 arası)                                                           |
| best_of               | Birden fazla çıktı üretir ve en iyisini döndürür                                                                            |
| functions             | Modelin çağırabileceği fonksiyonlar dizisi                                                                                  |
| function_call         | Modelin fonksiyonları nasıl çağıracağını kontrol eder                                                                       |
| response_format       | Çıktı formatını belirtir (örn. `{ type: "json_object" }`)                                                                   |
| stop                  | Modelin üretimi durduracağı diziler dizisi                                                                                  |
| passthrough           | İstekle birlikte gönderilecek ek parametreler                                                                               |

## Akıl Yürütme Modellerini (o1, o3, o3-mini, o4-mini) Kullanma

Azure OpenAI artık `o1`, `o3`, `o3-mini` ve `o4-mini` gibi akıl yürütme modellerini desteklemektedir. Bu modeller standart modellerden farklı şekilde ve belirli gereksinimlerle çalışır:

1. `max_tokens` yerine `max_completion_tokens` kullanırlar.
2. `temperature` parametresini desteklemezler (yok sayılır).
3. Bir `reasoning_effort` parametresi ('low', 'medium', 'high') kabul ederler.

Azure, alttaki model türünü mutlaka yansıtmayan özel dağıtım adlarına izin verdiğinden, akıl yürütme modellerini kullanırken yapılandırmanızda `isReasoningModel` bayrağını açıkça `true` olarak ayarlamalısınız. Bu, hem sohbet (chat) hem de tamamlama (completion) uç noktalarıyla çalışır:

```yaml
# Sohbet uç noktaları için
providers:
  - id: azure:chat:o4-mini-dagitimim
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
      # Akıl yürütme modelleri (o1, o3, o3-mini, o4-mini) için bu bayrağı true yapın
      isReasoningModel: true
      # max_tokens yerine max_completion_tokens kullanın
      max_completion_tokens: 25000
      # İsteğe bağlı: Akıl yürütme eforunu ayarlayın (varsayılan 'medium')
      reasoning_effort: 'medium'

# Tamamlama uç noktaları için
providers:
  - id: azure:completion:my-o3-deployment
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
      isReasoningModel: true
      max_completion_tokens: 25000
      reasoning_effort: 'high'
```

> Not: `o1` bayrağı geriye dönük uyumluluk için hala desteklenmektedir ancak amacını daha net belirttiği için `isReasoningModel` tercih edilir.

### Değişkenlerle Akıl Yürütme Eforunu Kullanma

Test durumlarınıza bağlı olarak akıl yürütme eforunu dinamik olarak ayarlamak için yapılandırmanızda değişkenleri kullanabilirsiniz:

```yaml
# Test değişkenlerine göre farklı akıl yürütme eforlarını yapılandırın
prompts:
  - 'Bu karmaşık matematik problemini çöz: {{problem}}'

providers:
  - id: azure:chat:o4-mini-dagitimim
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
      isReasoningModel: true
      max_completion_tokens: 25000
      # Bu değer test durumu değişkenlerinden doldurulacaktır
      reasoning_effort: '{{effort_level}}'

tests:
  - vars:
      problem: 'x²"nin integrali nedir?'
      effort_level: 'low'
  - vars:
      problem: 'Riemann hipotezini kanıtla'
      effort_level: 'high'
```

### Sorun Giderme

Akıl yürütme modellerini kullanırken bu hatayla karşılaşırsanız:

```
API response error: unsupported_parameter Unsupported parameter: 'max_tokens' is not supported with this model. Use 'max_completion_tokens' instead.
```

Bu, `isReasoningModel` bayrağını ayarlamadan bir akıl yürütme modeli kullandığınız anlamına gelir. Yapılandırmanızı yukarıda gösterildiği gibi güncelleyin.

## Vizyon Modellerini Kullanma

Azure OpenAI; GPT-5.1, GPT-4o ve GPT-4.1 gibi vizyon özellikli modelleri görüntü analizi için destekler.

### Yapılandırma

```yaml
providers:
  - id: azure:chat:gpt-4o
    config:
      apiHost: 'kaynak-adiniz.openai.azure.com'
      apiVersion: '2024-10-21' # vizyon desteği için bu veya daha yenisi
```

### Görüntü Girişi

Vizyon modelleri belirli bir mesaj formatı gerektirir. Görüntüler şu şekillerde sağlanabilir:

- **URL'ler**: Doğrudan görüntü bağlantıları
- **Yerel dosyalar**: `file://` yollarını kullanarak (otomatik olarak base64'e dönüştürülür)
- **Base64**: `data:image/jpeg;base64,VERI` formatındaki veri URI'leri

```yaml
prompts:
  - |
    [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Bu görüntüde ne görüyorsun?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "{{image_url}}"
            }
          }
        ]
      }
    ]

tests:
  - vars:
      image_url: https://example.com/image.jpg # URL
  - vars:
      image_url: file://assets/image.jpg # Yerel dosya (otomatik base64)
  - vars:
      image_url: data:image/jpeg;base64,/9j/4A... # Base64
```

### Örnek

Görüntü analizi içeren tam ve çalışan bir örnek için [Azure OpenAI örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/openai) bakın. Vizyona özel özellikler için `promptfooconfig.vision.yaml` dosyasını kullanın.

## Claude Modellerini Kullanma

Azure AI Foundry, Anthropic Claude modellerine erişim sağlar. Bu modeller standart Azure sohbet uç noktasını kullanır:

```yaml title="promptfooconfig.yaml"
providers:
  - id: azure:chat:claude-opus-4-6-20260205
    config:
      apiHost: 'dağıtımınız.services.ai.azure.com'
      apiVersion: '2025-04-01-preview'
      max_tokens: 4096
      temperature: 0.7
```

Azure'da mevcut Claude modelleri:

| Model                        | Açıklama                                 |
| ---------------------------- | ---------------------------------------- |
| `claude-opus-4-6-20260205`   | Claude Opus 4.6 - En yetenekli model     |
| `claude-sonnet-4-6`          | Claude Sonnet 4.6 - Dengeli performans   |
| `claude-opus-4-5-20251101`   | Claude Opus 4.5                          |
| `claude-sonnet-4-5-20250929` | Claude Sonnet 4.5 - Dengeli performans   |
| `claude-3-5-sonnet-20241022` | Claude 3.5 Sonnet                        |
| `claude-3-5-haiku-20241022`  | Claude 3.5 Haiku - Hızlı ve verimli      |

### Claude Yapılandırma Örneği

```yaml title="promptfooconfig.yaml"
description: Azure Claude değerlendirmesi

providers:
  - id: azure:chat:claude-sonnet-4-5-20250929
    label: claude-sonnet
    config:
      apiHost: 'dağıtımınız.services.ai.azure.com'
      apiVersion: '2025-04-01-preview'
      max_tokens: 4096
      temperature: 0.7

prompts:
  - '{{concept}} kavramını basit terimlerle açıkla.'

tests:
  - vars:
      concept: kuantum bilişim
    assert:
      - type: contains-any
        value: ['qubit', 'superposition', 'kuantum', 'kubit']
```

## Llama Modellerini Kullanma

Azure AI Foundry, Llama 4 dahil olmak üzere Meta'nın Llama modellerine erişim sağlar:

```yaml title="promptfooconfig.yaml"
providers:
  - id: azure:chat:Llama-4-Maverick-17B-128E-Instruct-FP8
    config:
      apiHost: 'dağıtımınız.services.ai.azure.com'
      apiVersion: '2025-04-01-preview'
      max_tokens: 4096
```

Mevcut Llama modelleri şunları içerir:

- `Llama-4-Maverick-17B-128E-Instruct-FP8` - Llama 4 Maverick (128 uzmanlı)
- `Llama-4-Scout-17B-16E-Instruct` - Llama 4 Scout (16 uzmanlı)
- `Llama-3.3-70B-Instruct` - Llama 3.3 70B
- `Meta-Llama-3.1-405B-Instruct` - Llama 3.1 405B
- `Meta-Llama-3.1-70B-Instruct` - Llama 3.1 70B
- `Meta-Llama-3.1-8B-Instruct` - Llama 3.1 8B

## DeepSeek Modellerini Kullanma

Azure AI, DeepSeek-R1 gibi DeepSeek modellerini destekler. Diğer akıl yürütme modelleri gibi, bunlar da özel yapılandırma gerektirir:

1. `isReasoningModel: true` olarak ayarlayın.
2. `max_tokens` yerine `max_completion_tokens` kullanın.
3. API sürümünü '2025-04-01-preview' (veya mevcut en son sürüm) olarak ayarlayın.

```yaml title="promptfooconfig.yaml"
providers:
  - id: azure:chat:DeepSeek-R1
    config:
      apiHost: 'dağıtım-adınız.services.ai.azure.com'
      apiVersion: '2025-04-01-preview'
      isReasoningModel: true
      max_completion_tokens: 2048
      reasoning_effort: 'medium' # Seçenekler: low, medium, high
```

Model tarafından derecelendirilen iddialar (assertions) için `defaultTest` kısmını aynı sağlayıcıyı kullanacak şekilde yapılandırabilirsiniz:

```yaml
defaultTest:
  options:
    provider:
      id: azure:chat:DeepSeek-R1
      config:
        apiHost: 'dağıtım-adınız.services.ai.azure.com'
        apiVersion: '2025-04-01-preview'
        isReasoningModel: true
        max_completion_tokens: 2048
```

Yanıt kalitesi ile hız arasındaki dengeyi kontrol etmek için `reasoning_effort` değerini ayarlayın: Daha hızlı yanıtlar için `low`, dengeli performans için `medium` (varsayılan) veya karmaşık görevlerde daha kapsamlı akıl yürütme için `high`.

## Asistanlar (Assistants)

Azure üzerinde bir OpenAI asistanını değerlendirmek için:

1. Azure portalında asistan için bir dağıtım oluşturun.
2. Azure web arayüzünde bir asistan oluşturun.
3. `@azure/openai-assistants` paketini kurun:

```sh
npm i @azure/openai-assistants
```

4. Sağlayıcınızı asistan kimliği (assistant ID) ile yapılandırın:

```yaml
providers:
  - id: azure:assistant:asst_E4GyOBYKlnAzMi19SZF2Sn8I
    config:
      apiHost: dagitimadiniz.openai.azure.com
```

Asistan kimliğini ve dağıtım adını kendi değerlerinizle değiştirin.

### Asistanlarla Fonksiyon Araçları (Function Tools)

Azure OpenAI Asistanları araç çağırmayı destekler. `tools` (araçlar) aracılığıyla araç şemalarını tanımlayın ve çağrıları işlemek için `functionToolCallbacks` aracılığıyla geri çağırma (callback) uygulamaları sağlayın.

```yaml
providers:
  - id: azure:assistant:asistan_kimliginiz
    config:
      apiHost: kaynak-adiniz.openai.azure.com
      # Fonksiyon aracı tanımını yükle
      tools: file://tools/weather-function.json
      # Fonksiyon geri çağırmasını satır içinde tanımla
      functionToolCallbacks:
        # Dış bir dosya kullan
        get_weather: file://callbacks/weather.js:getWeather
        # Veya satır içi bir fonksiyon kullan
        get_weather: |
          async function(args) {
            try {
              const parsedArgs = JSON.parse(args);
              const location = parsedArgs.location;
              const unit = parsedArgs.unit || 'celsius';
              // Fonksiyon uygulaması...
              return JSON.stringify({
                location,
                temperature: 22,
                unit,
                condition: 'sunny'
              });
            } catch (error) {
              return JSON.stringify({ error: String(error) });
            }
          }
```

### Asistanlarla Vektör Depolarını (Vector Stores) Kullanma

Azure OpenAI Asistanları, gelişmiş dosya arama yetenekleri için vektör depolarını destekler. Bir vektör deposu kullanmak için:

1. Azure Portalı'nda veya API aracılığıyla bir vektör deposu oluşturun.
2. Asistanınızı onu kullanacak şekilde yapılandırın:

```yaml
providers:
  - id: azure:assistant:asistan_kimliginiz
    config:
      apiHost: kaynak-adiniz.openai.azure.com
      # Dosya araması için araçlar ekle
      tools:
        - type: file_search
      # Vektör deposu kimliklerini yapılandır
      tool_resources:
        file_search:
          vector_store_ids:
            - 'vektör_deposu_kimliginiz'
      # İsteğe bağlı parametreler
      temperature: 1
      top_p: 1
      apiVersion: '2025-04-01-preview'
```

Temel gereksinimler:

- `type: file_search` olan bir araç kurun.
- `tool_resources.file_search.vector_store_ids` dizisini vektör deposu kimliklerinizle yapılandırın.
- Uygun `apiVersion` değerini ayarlayın (önerilen: `2025-04-01-preview` veya sonrası).

### Basit Örnek

İşte basit ve tam bir asistan değerlendirme örneği:

```yaml
prompts:
  - '{{topic}} hakkında bir tweet yaz'

providers:
  - id: azure:assistant:asistan_kimliginiz
    config:
      apiHost: kaynak-adiniz.openai.azure.com

tests:
  - vars:
      topic: muzlar
```

Çeşitli araç yapılandırmalarına sahip Azure OpenAI Asistanlarının çalışan tam örnekleri için [Azure Asistan örnek dizinine](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/assistant) göz atın.

Farklı modelleri, talimatları ve daha fazlasını nasıl karşılaştıracağınız hakkında daha fazla bilgi için [OpenAI asistanları nasıl değerlendirilir](/docs/guides/evaluate-openai-assistants/) kılavuzuna bakın.

## Azure AI Foundry Ajanları (Azure AI Foundry Agents)

Azure AI Foundry Ajanları, Azure AI Projeleri SDK'sı (`@azure/ai-projects`) aracılığıyla Azure OpenAI Asistanlarını kullanmanın alternatif bir yolunu sunar. Bu sağlayıcı yerel Azure SDK kimlik doğrulamasını kullanır ve Azure AI Foundry projeleriyle kullanılmak üzere tasarlanmıştır.

### Standart Azure Asistanlarından Temel Farklar

| Özellik             | Azure Asistanı                               | Azure Foundry Ajanı                                                           |
| ------------------- | -------------------------------------------- | ----------------------------------------------------------------------------- |
| **API Türü**        | Azure OpenAI API'sine doğrudan HTTP çağrıları | Azure AI Projeleri SDK (`@azure/ai-projects`)                                  |
| **Kimlik Doğrulama**| API anahtarı veya Azure kimlik bilgileri     | `DefaultAzureCredential` (Azure CLI, ortam değişkenleri, yönetilen kimlik)     |
| **Uç Nokta**        | Azure OpenAI uç noktası (`*.openai.azure.com`) | Azure AI Proje URL'si (`*.services.ai.azure.com/api/projects/*`)               |
| **Sağlayıcı Formatı** | `azure:assistant:<asistan_kimliği>`          | `azure:foundry-agent:<asistan_kimliği>`                                       |

### Kurulum

1. Gerekli Azure SDK paketlerini kurun:

```bash
npm install @azure/ai-projects @azure/identity
```

2. Şu yöntemlerden biriyle kimlik doğrulaması yapın:
   - **Azure CLI** (yerel geliştirme için önerilir): `az login` komutunu çalıştırın.
   - **Ortam değişkenleri**: Azure hizmet sorumlusu (service principal) kimlik bilgilerini ayarlayın.
   - **Yönetilen Kimlik (Managed Identity)**: Azure üzerinde barındırılan ortamlarda otomatiktir.
   - **Hizmet Sorumlusu (Service Principal)**: Ortam değişkenleri üzerinden yapılandırın.

3. Azure AI Proje URL'nizi ayarlayın:

```bash
export AZURE_AI_PROJECT_URL="https://projeniz.services.ai.azure.com/api/projects/proje-kimliginiz"
```

Alternatif olarak, yapılandırma dosyanızda `projectUrl` sağlayabilirsiniz.

### Temel Yapılandırma

Sağlayıcı `azure:foundry-agent:<asistan_kimliği>` formatını kullanır:

```yaml
providers:
  - id: azure:foundry-agent:asst_E4GyOBYKlnAzMi19SZF2Sn8I
    config:
      projectUrl: 'https://projeniz.services.ai.azure.com/api/projects/proje-kimliginiz'
      temperature: 0.7
      max_tokens: 150
      instructions: 'Net ve kısa cevaplar veren yardımsever bir asistansın.'
```

### Yapılandırma Seçenekleri

Azure Foundry Ajanı sağlayıcısı, standart Azure Asistanı sağlayıcısıyla aynı yapılandırma seçeneklerini destekler:

| Parametre               | Açıklama                                                                         |
| ----------------------- | -------------------------------------------------------------------------------- |
| `projectUrl`            | Azure AI Proje URL'si (gereklidir, `AZURE_AI_PROJECT_URL` ortam değişkeni de kullanılabilir) |
| `temperature`           | Rastgeleliği kontrol eder (0.0 ile 2.0 arası)                                    |
| `max_tokens`            | Yanıttaki maksimum token sayısı                                                  |
| `top_p`                 | Çekirdek örnekleme parametresi                                                   |
| `tools`                 | Fonksiyon araçları yapılandırması (aşağıya bakın)                                |
| `tool_choice`           | Araç seçim stratejisi (`auto`, `none` veya belirli bir araç)                     |
| `tool_resources`        | Kaynak yapılandırması (dosya arama, kod yorumlayıcı vb.)                         |
| `instructions`          | Asistan için sistem talimatlarını geçersiz kılın                                 |
| `functionToolCallbacks` | Araç yürütme için özel fonksiyon geri çağırmaları (callbacks)                    |
| `modelName`             | Asistanın varsayılan modelini geçersiz kılacak model adı                         |
| `maxPollTimeMs`         | Tamamlanma için en fazla yoklama süresi (varsayılan: 300000ms / 5 dakika)          |
| `response_format`       | Yanıt formatı spesifikasyonu                                                     |

### Azure Foundry Ajanları ile Fonksiyon Araçları

Fonksiyon araçları, standart Azure Asistanları ile aynı şekilde çalışır. Fonksiyonlar tanımlayabilir ve geri çağırma (callback) uygulamaları sağlayabilirsiniz:

```yaml
providers:
  - id: azure:foundry-agent:asistan_kimliginiz
    config:
      projectUrl: 'https://projeniz.services.ai.azure.com/api/projects/proje-kimliginiz'
      # Fonksiyon aracı tanımlarını yükle
      tools: file://tools/weather-function.json
      # Fonksiyon geri çağırmalarını tanımla
      functionToolCallbacks:
        # Dış bir dosya kullan
        get_current_weather: file://callbacks/weather.js:getCurrentWeather
        # Veya satır içi bir fonksiyon kullan
        get_forecast: |
          async function(args) {
            try {
              const parsedArgs = JSON.parse(args);
              const location = parsedArgs.location;
              const days = parsedArgs.days || 7;
              
              // Uygulamanız burada
              return JSON.stringify({
                location,
                forecast: [
                  { day: 'Pazartesi', temperature: 22, condition: 'güneşli' },
                  { day: 'Salı', temperature: 20, condition: 'bulutlu' }
                ]
              });
            } catch (error) {
              return JSON.stringify({ error: String(error) });
            }
          }
```

Fonksiyon geri çağırmaları iki parametre alır:

- `args`: JSON kodlu fonksiyon argümanlarını içeren dize.
- `context`: Gelişmiş kullanım durumları için `{ threadId, runId, assistantId, provider }` içeren nesne.

### Azure Foundry Ajanları ile Vektör Depolarını Kullanma

Vektör depoları, standart Azure Asistanları ile aynı şekilde çalışır:

```yaml
providers:
  - id: azure:foundry-agent:asistan_kimliginiz
    config:
      projectUrl: 'https://projeniz.services.ai.azure.com/api/projects/proje-kimliginiz'
      # Dosya araması için araçlar ekle
      tools:
        - type: file_search
      # Vektör deposu kimliklerini yapılandır
      tool_resources:
        file_search:
          vector_store_ids:
            - 'vektör_deposu_kimliginiz'
      # İsteğe bağlı parametreler
      temperature: 1
      top_p: 1
```

### Ortam Değişkenleri

| Değişken               | Açıklama                                                        |
| ---------------------- | --------------------------------------------------------------- |
| `AZURE_AI_PROJECT_URL` | Azure AI Proje URL'niz (yapılandırmada geçersiz kılınabilir)    |
| `AZURE_CLIENT_ID`      | Azure hizmet sorumlusu istemci kimliği (hizmet sorumlusu kimlik doğrulaması için) |
| `AZURE_CLIENT_SECRET`  | Azure hizmet sorumlusu sırrı (hizmet sorumlusu kimlik doğrulaması için) |
| `AZURE_TENANT_ID`      | Azure kiracı kimliği (hizmet sorumlusu kimlik doğrulaması için) |

### Tam Örnek

İşte eksiksiz bir yapılandırma örneği:

```yaml
description: 'Azure Foundry Agent değerlendirmesi'

providers:
  - id: azure:foundry-agent:asst_uRGMedGFDehLkjJJaq51J9GY
    config:
      projectUrl: 'https://projem.services.ai.azure.com/api/projects/proje-kimligim'
      temperature: 0.7
      max_tokens: 150
      instructions: 'Net ve kısa cevaplar veren yardımsever bir asistansın.'

prompts:
  - '{{question}}'

tests:
  - vars:
      question: 'Fransa"nın başkenti neresidir?'
    assert:
      - type: contains
        value: 'Paris'

  - vars:
      question: 'Fotosentezin ne olduğunu basit terimlerle açıkla.'
    assert:
      - type: contains
        value: 'bitkiler'
      - type: contains
        value: 'güneş ışığı'
```

### Hata Yönetimi

Azure Foundry Ajanı sağlayıcısı kapsamlı hata yönetimi içerir:

- **İçerik Filtreleme Tespiti**: Güvenlik duvarı (guardrails) meta verileri ile içerik filtreleme olaylarını otomatik olarak algılar ve raporlar.
- **Hız Sınırı (Rate Limit) Yönetimi**: Uygun yeniden deneme işlemi için hız sınırı hatalarını tanımlar.
- **Servis Hatası Tespiti**: Geçici servis hatalarını (500, 502, 503, 504) algılar.
- **Zaman Aşımı Yönetimi**: `maxPollTimeMs` aracılığıyla yapılandırılabilir yoklama zaman aşımı.

### Önbelleğe Alma (Caching)

Sağlayıcı, performansı artırmak ve API çağrılarını azaltmak için önbelleğe almayı destekler. Sonuçlar şunlara göre önbelleğe alınır:

- Asistan yapılandırması (talimatlar, model, sıcaklık vb.)
- Araç tanımları
- Giriş istemi

Önbelleğe alma varsayılan olarak etkindir. Yapılandırmanızda açıkça ayarlamak için:

```yaml
evaluateOptions:
  cache: true

providers:
  - id: azure:foundry-agent:asistan_kimliginiz
    config:
      projectUrl: 'https://projeniz.services.ai.azure.com/api/projects/proje-kimliginiz'
```

### Azure Foundry Ajanları Ne Zaman Kullanılmalıdır?

Şu durumlarda Azure Foundry Ajanlarını kullanın:

- Azure AI Foundry projeleri içinde çalışıyorsanız.
- Yerel Azure SDK kimlik doğrulamasını (`DefaultAzureCredential`) tercih ediyorsanız.
- Kimlik doğrulama için yönetilen kimlikler veya hizmet sorumluları kullanıyorsanız.
- Azure AI Projeleri özelliklerinden yararlanmak istiyorsanız.

Şu durumlarda standart Azure Asistanlarını kullanın:

- Azure OpenAI Servisini doğrudan (AI Foundry aracılığıyla değil) kullanıyorsanız.
- Mevcut bir Azure OpenAI kaynağınız ve uç noktanız varsa.
- API anahtarı tabanlı kimlik doğrulamasını tercih ediyorsanız.

### Örnek Deposu

Çalışan tam örnekler için [Azure Foundry Agent örnek dizinine](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/foundry-agent) göz atın.

## Video Oluşturma (Sora)

Azure AI Foundry, metinden videoya ve görüntüden videoya oluşturma için OpenAI'ın Sora video oluşturma modeline erişim sağlar.

### Ön Koşullar

1. Desteklenen bir bölgede (`eastus2` veya `swedencentral`) bir Azure AI Foundry kaynağı.
2. Bir Sora model dağıtımı.

### Yapılandırma

```yaml
providers:
  - id: azure:video:sora
    config:
      apiBaseUrl: https://kaynaginiz.cognitiveservices.azure.com
      # Kimlik Doğrulama (birini seçin):
      apiKey: ${AZURE_API_KEY} # Veya AZURE_API_KEY ortam değişkenini kullanın
      # Veya Entra ID (DefaultAzureCredential) kullanın

      # Video parametreleri
      width: 1280 # 480, 720, 854, 1080, 1280, 1920
      height: 720 # 480, 720, 1080
      n_seconds: 5 # 5, 10, 15, 20

      # Yoklama (Polling)
      poll_interval_ms: 10000
      max_poll_time_ms: 600000
```

### Desteklenen Boyutlar

| Boyut     | En Boy Oranı     |
| --------- | ---------------- |
| 480x480   | 1:1 (Kare)       |
| 720x720   | 1:1 (Kare)       |
| 1080x1080 | 1:1 (Kare)       |
| 854x480   | 16:9 (Yatay)     |
| 1280x720  | 16:9 (Yatay)     |
| 1920x1080 | 16:9 (Yatay)     |

### Desteklenen Süreler

- 5 saniye
- 10 saniye
- 15 saniye
- 20 saniye

### Örnek

```yaml
providers:
  - azure:video:sora

prompts:
  - 'Bir gölette yüzen koi balıklarının olduğu huzurlu bir Japon bahçesi'

tests:
  - vars: {}
    assert:
      - type: is-video
```

### Ortam Değişkenleri

| Değişken              | Açıklama                                            |
| --------------------- | --------------------------------------------------- |
| `AZURE_API_KEY`       | Azure API anahtarı                                  |
| `AZURE_API_BASE_URL`  | Kaynak uç nokta URL'si                              |
| `AZURE_CLIENT_ID`     | Entra ID istemci kimliği (hizmet sorumlusu için)    |
| `AZURE_CLIENT_SECRET` | Entra ID istemci sırrı (hizmet sorumlusu için)      |
| `AZURE_TENANT_ID`     | Entra ID kiracı kimliği (hizmet sorumlusu için)     |

## Ayrıca Bakınız

- [OpenAI Sağlayıcısı](/docs/providers/openai) - Azure'un yapılandırmasını paylaştığı temel sağlayıcı.
- [Asistanları Değerlendirme](/docs/guides/evaluate-openai-assistants/) - Farklı modelleri ve talimatları nasıl karşılaştıracağınızı öğrenin.
- [Azure Örnekleri](https://github.com/promptfoo/promptfoo/tree/main/examples/azure) - Tüm Azure örnekleri bir arada:
  - [OpenAI](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/openai) - Sohbet, vizyon ve embedding örnekleri.
  - [Claude](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/claude) - Azure AI Foundry üzerinde Anthropic Claude.
  - [Llama](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/llama) - Meta Llama modelleri.
  - [DeepSeek](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/deepseek) - DeepSeek akıl yürütme modelleri.
  - [Mistral](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/mistral) - Mistral modelleri.
  - [Comparison](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/comparison) - Çoklu sağlayıcı karşılaştırması.
  - [Assistants](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/assistant) - Araçlı asistan örnekleri.
  - [Foundry Agent](https://github.com/promptfoo/promptfoo/tree/main/examples/azure/foundry-agent) - Azure AI Foundry Ajanları.
