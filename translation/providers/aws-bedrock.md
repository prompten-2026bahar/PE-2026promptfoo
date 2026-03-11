---
title: AWS Bedrock
sidebar_label: AWS Bedrock
sidebar_position: 3
description: AWS tarafından yönetilen altyapıyı kullanarak Claude, Llama, Nova ve Mistral modelleriyle LLM değerlendirmeleri için Amazon Bedrock'u yapılandırın
---

# Bedrock

`bedrock` sağlayıcısı, Amazon Bedrock'u değerlendirmelerinizde (evals) kullanmanıza olanak tanır. Bu; Anthropic'in Claude, Meta'nın Llama 3.3, Amazon'un Nova, OpenAI'ın GPT-OSS modelleri, AI21'in Jamba'sı, Alibaba'nın Qwen'i ve diğer modellere erişmenin yaygın bir yoludur. Mevcut tüm modellerin tam listesi [AWS Bedrock model ID belgelerinde](https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html#model-ids-arns) bulunabilir.

## Kurulum

1. **Model Erişimi**: Amazon Bedrock, manuel onay gerektirmeyen sunucusuz temel modellere otomatik erişim sağlar.
   - **Çoğu model**: Amazon, DeepSeek, Mistral, Meta, Qwen ve OpenAI modelleri (GPT-OSS ve Qwen3 dahil) anında kullanılabilir - sadece kullanmaya başlayın.
   - **Anthropic modelleri**: Model kataloğu üzerinden tek seferlik bir kullanım durumu gönderimi gerektirir (erişim gönderimden hemen sonra verilir).
   - **AWS Marketplace modelleri**: Bazı üçüncü taraf modeller `aws-marketplace:Subscribe` ile IAM izinleri gerektirir.
   - **Erişim kontrolü**: Kuruluşlar, IAM politikaları ve Hizmet Kontrol Politikaları (SCP'ler) aracılığıyla kontrolü sürdürür.

2. `@aws-sdk/client-bedrock-runtime` paketini kurun:

   ```sh
   npm install @aws-sdk/client-bedrock-runtime
   ```

3. AWS SDK, kimlik bilgilerini otomatik olarak şu konumlardan çekecektir:
   - EC2 üzerindeki IAM rolleri
   - `~/.aws/credentials`
   - `AWS_ACCESS_KEY_ID` ve `AWS_SECRET_ACCESS_KEY` ortam değişkenleri

   Daha fazla ayrıntı için [Node.js kimlik bilgilerini ayarlama (AWS)](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) sayfasına bakın.

4. Yapılandırma dosyanızı AWS Bedrock sağlayıcısına yönelecek şekilde düzenleyin. İşte bir örnek:

   ```yaml
   providers:
     - id: bedrock:us.anthropic.claude-opus-4-6-v1:0
   ```

   Sağlayıcının `bedrock:` ve ardından modelin [ARN/model id](https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html#model-ids-arns)'sinden oluştuğunu unutmayın.

5. Ek yapılandırma parametreleri şu şekilde iletilir:

   ```yaml
   providers:
     - id: bedrock:anthropic.claude-3-5-sonnet-20241022-v2:0
       config:
         accessKeyId: ERIŞIM_ANAHTARI_KIMLIĞINIZ
         secretAccessKey: GIZLI_ERIŞIM_ANAHTARINIZ
         region: 'us-west-2'
         max_tokens: 256
         temperature: 0.7
   ```

## Uygulama Çıkarım Profilleri (Application Inference Profiles)

AWS Bedrock, farklı bölgelerdeki birden fazla temel modele erişmek için tek bir ARN kullanmanıza olanak tanıyan Uygulama Çıkarım Profillerini destekler. Bu, istikrarlı performansı korurken maliyetleri ve kullanılabilirliği optimize etmeye yardımcı olur.

### Çıkarım Profillerini Kullanma

Bir çıkarım profili ARN'si kullanırken, profilin hangi model ailesi için yapılandırıldığını belirtmek için yapılandırmanızda `inferenceModelType` belirtmelisiniz:

```yaml
providers:
  - id: bedrock:arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/my-profile
    config:
      inferenceModelType: 'claude' # Çıkarım profilleri için gereklidir
      region: 'us-east-1'
      max_tokens: 256
      temperature: 0.7
```

### Desteklenen Model Türleri

`inferenceModelType` yapılandırma seçeneği şu değerleri destekler:

- `claude` - Anthropic Claude modelleri için
- `nova` - Amazon Nova modelleri (v1) için
- `nova2` - Amazon Nova 2 modelleri (akıl yürütme destekli) için
- `llama` - Varsayılan olarak Llama 4 (en yeni sürüm)
- `llama2` - Meta Llama 2 modelleri için
- `llama3` - Meta Llama 3 modelleri için
- `llama3.1` veya `llama3_1` - Meta Llama 3.1 modelleri için
- `llama3.2` veya `llama3_2` - Meta Llama 3.2 modelleri için
- `llama3.3` veya `llama3_3` - Meta Llama 3.3 modelleri için
- `llama4` - Meta Llama 4 modelleri için
- `mistral` - Mistral modelleri için
- `cohere` - Cohere modelleri için
- `ai21` - AI21 modelleri için
- `titan` - Amazon Titan modelleri için
- `deepseek` - DeepSeek modelleri için
- `openai` - OpenAI modelleri için
- `qwen` - Alibaba Qwen modelleri için

### Örnek: Çok Bölgeli Çıkarım Profili

```yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  # Küresel çıkarım profili üzerinden Claude Opus 4.6 (bu model için gereklidir)
  - id: bedrock:arn:aws:bedrock:us-east-2::inference-profile/global.anthropic.claude-opus-4-6-v1
    config:
      inferenceModelType: 'claude'
      region: 'us-east-2'
      max_tokens: 1024
      temperature: 0.7

  # Claude modellerine yönlendiren bir çıkarım profili kullanma
  - id: bedrock:arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/claude-profile
    config:
      inferenceModelType: 'claude'
      max_tokens: 1024
      temperature: 0.7
      anthropic_version: 'bedrock-2023-05-31'

  # Llama modelleri için bir çıkarım profili kullanma
  - id: bedrock:arn:aws:bedrock:us-west-2:123456789012:application-inference-profile/llama-profile
    config:
      inferenceModelType: 'llama3.3'
      max_gen_len: 1024
      temperature: 0.7

  # Nova modelleri için bir çıkarım profili kullanma
  - id: bedrock:arn:aws:bedrock:eu-west-1:123456789012:application-inference-profile/nova-profile
    config:
      inferenceModelType: 'nova'
      interfaceConfig:
        max_new_tokens: 1024
        temperature: 0.7
```

:::tip

Uygulama Çıkarım Profilleri çeşitli avantajlar sağlar:

- **Otomatik yük devretme (failover)**: Bir bölge kullanılamıyorsa, istekler otomatik olarak başka bir bölgeye yönlendirilir.
- **Maliyet optimizasyonu**: Mevcut en uygun maliyetli modele yönlendirir.
- **Basitleştirilmiş yönetim**: Birden fazla model kimliğini yönetmek yerine tek bir ARN kullanın.

Çıkarım profillerini kullanırken, yapılandırma parametreleri model türleri arasında farklılık gösterdiğinden, `inferenceModelType` değerinin profilinizin yapılandırıldığı model ailesiyle eşleştiğinden emin olun.

:::

## Converse API

Converse API, genişletilmiş düşünme (akıl yürütme), araç çağırma ve güvenlik duvarları (guardrails) için yerel desteğe sahip tüm Bedrock modellerinde birleşik bir arayüz sağlar. Bu API'ye erişmek için `bedrock:converse:` önekini kullanın.

### Temel Kullanım

```yaml
providers:
  - id: bedrock:converse:anthropic.claude-3-5-sonnet-20241022-v2:0
    config:
      region: us-east-1
      maxTokens: 4096
      temperature: 0.7
```

### Genişletilmiş Düşünme (Extended Thinking)

Karmaşık akıl yürütme görevleri için Claude'un genişletilmiş düşünme yeteneklerini etkinleştirin:

```yaml
providers:
  - id: bedrock:converse:us.anthropic.claude-sonnet-4-5-20250929-v1:0
    config:
      region: us-west-2
      maxTokens: 20000
      thinking:
        type: enabled
        budget_tokens: 16000
      showThinking: true # Düşünme içeriğini çıktıya dahil et
```

`thinking` yapılandırması Claude'un akıl yürütme davranışını kontrol eder:

- `type: enabled` - Genişletilmiş düşünmeyi etkinleştirir.
- `budget_tokens` - Düşünme için ayrılan maksimum token sayısı (minimum 1024).

Modelin akıl yürütme sürecini çıktıya dahil etmek için `showThinking: true` seçeneğini kullanın veya sadece final yanıtını görmek için `false` yapın.

:::warning
Genişletilmiş düşünme kullanırken `temperature`, `topP` veya `topK` ayarlarını yapmayın. Bu örnekleme parametreleri akıl yürütme moduyla uyumlu değildir.
:::

### Yapılandırma Seçenekleri

| Seçenek               | Açıklama                                       |
| --------------------- | ---------------------------------------------- |
| `maxTokens`           | Maksimum çıktı token sayısı                    |
| `temperature`         | Örnekleme sıcaklığı (0-1)                      |
| `topP`                | Çekirdek örnekleme parametresi                 |
| `stopSequences`       | Durdurma dizileri dizisi                       |
| `thinking`            | Genişletilmiş düşünme yapılandırması (Claude)   |
| `reasoningConfig`     | Akıl yürütme yapılandırması (Amazon Nova 2)    |
| `showThinking`        | Düşünmeyi çıktıya dahil et (varsayılan: false) |
| `performanceConfig`   | Performans ayarları (`latency: optimized`)     |
| `serviceTier`         | Hizmet kademesi (`priority`, `default` veya `flex`) |
| `guardrailIdentifier` | İçerik filtreleme için Güvenlik Duvarı Kimliği |
| `guardrailVersion`    | Güvenlik Duvarı sürümü (varsayılan: DRAFT)      |

### Performans Yapılandırması

Gecikme süresi veya maliyet için optimize edin:

```yaml
providers:
  - id: bedrock:converse:anthropic.claude-3-5-sonnet-20241022-v2:0
    config:
      performanceConfig:
        latency: optimized # veya 'standard'
      serviceTier:
        type: priority # veya 'default', 'flex'
```

### Desteklenen Modeller

Converse API, Converse işlemini destekleyen tüm Bedrock modelleriyle çalışır:

- **Claude**: Tüm Claude 3.x ve 4.x modelleri
- **Amazon Nova**: Lite, Micro, Pro, Premier (Sonic değil)
- **Amazon Nova 2**: Lite (akıl yürütme destekli)
- **Meta Llama**: 3.x, 4.x modelleri
- **Mistral**: Tüm Mistral modelleri
- **Cohere**: Command R ve R+ modelleri
- **AI21**: Jamba modelleri
- **DeepSeek**: R1 ve diğer modeller
- **Qwen**: Qwen3 modelleri

## Kimlik Doğrulama

Amazon Bedrock, basitleştirilmiş erişim için yeni API anahtarı kimlik doğrulaması dahil olmak üzere birden fazla kimlik doğrulama yöntemini destekler. Kimlik bilgileri şu öncelik sırasına göre çözümlenir:

### Kimlik Bilgisi Çözümleme Sırası

Kimlik bilgileri şu öncelik sırasına göre çözümlenir:

1. **Yapılandırmadaki açık kimlik bilgileri** (`accessKeyId`, `secretAccessKey`)
2. **Bedrock API Anahtarı kimlik doğrulaması** (`apiKey`)
3. **SSO profil kimlik doğrulaması** (`profile`)
4. **AWS varsayılan kimlik bilgisi zinciri** (ortam değişkenleri, `~/.aws/credentials`)

Kullanılabilir ilk kimlik bilgisi yöntemi otomatik olarak kullanılır.

### Kimlik Doğrulama Seçenekleri

#### 1. Açık kimlik bilgileri (en yüksek öncelik)

AWS erişim anahtarlarını doğrudan yapılandırmanızda belirtin. **Güvenlik için, kimlik bilgilerini kodun içine yazmak yerine ortam değişkenlerini kullanın:**

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0
    config:
      accessKeyId: '{{env.AWS_ACCESS_KEY_ID}}'
      secretAccessKey: '{{env.AWS_SECRET_ACCESS_KEY}}'
      sessionToken: '{{env.AWS_SESSION_TOKEN}}' # İsteğe bağlı, geçici kimlik bilgileri için
      region: 'us-east-1' # İsteğe bağlı, varsayılan us-east-1
```

**Ortam değişkenleri:**

```bash
export AWS_ACCESS_KEY_ID="erişim_anahtarı_kimliği"
export AWS_SECRET_ACCESS_KEY="gizli_erişim_anahtarı"
export AWS_SESSION_TOKEN="oturum_tokeni"  # İsteğe bağlı
```

:::warning Güvenlik En İyi Uygulaması

**Kimlik bilgilerini sürüm kontrol sistemine (Git vb.) yüklemeyin.** Hassas anahtarları işlemek için ortam değişkenlerini veya özel bir sır (secrets) yönetim sistemini kullanın.

:::

Bu yöntem, EC2 örnek rolleri ve SSO profilleri dahil olmak üzere diğer tüm kimlik bilgisi kaynaklarını geçersiz kılar.

#### 2. API Anahtarı kimlik doğrulaması

Amazon Bedrock API anahtarları, AWS IAM kimlik bilgilerini yönetmeden basitleştirilmiş kimlik doğrulaması sağlar.

**Ortam değişkenlerini kullanma:**

`AWS_BEARER_TOKEN_BEDROCK` ortam değişkenini ayarlayın:

```bash
export AWS_BEARER_TOKEN_BEDROCK="api-anahtarınız-buraya"
```

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0
    config:
      region: 'us-east-1' # İsteğe bağlı, varsayılan us-east-1
```

**Yapılandırma dosyasını kullanma:**

API anahtarını doğrudan yapılandırmanızda belirtin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0
    config:
      apiKey: 'api-anahtarınız-buraya'
      region: 'us-east-1' # İsteğe bağlı, varsayılan us-east-1
```

:::note

API anahtarları Amazon Bedrock ve Amazon Bedrock Runtime işlemleriyle sınırlıdır. Şunlarla kullanılamazlar:

- InvokeModelWithBidirectionalStream işlemleri
- Amazon Bedrock API işlemleri için Ajanlar
- Amazon Bedrock API işlemleri için Veri Otomasyonu

Bu gelişmiş özellikler için bunun yerine geleneksel AWS IAM kimlik bilgilerini kullanın.

:::

#### 3. SSO profil kimlik doğrulaması

AWS SSO kurulumları veya birden fazla AWS hesabını yönetmek için AWS yapılandırmanızdaki adlandırılmış bir profili kullanın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0
    config:
      profile: 'SSO_PROFILINIZ'
      region: 'us-east-1' # İsteğe bağlı, varsayılan us-east-1
```

**SSO profilleri için ön koşullar:**

1. **AWS CLI v2 Kurun**: AWS CLI v2'nin kurulu ve PATH'inizde olduğundan emin olun.

2. **AWS SSO'yu Yapılandırın**: AWS CLI kullanarak AWS SSO'yu kurun:

   ```bash
   aws configure sso
   ```

3. **Profil yapılandırması**: `~/.aws/config` dosyanız profili içermelidir:

   ```ini
   [profile SSO_PROFILINIZ]
   sso_start_url = https://sso-portaliniz.awsapps.com/start
   sso_region = us-east-1
   sso_account_id = 123456789012
   sso_role_name = RolAdiniz
   region = us-east-1
   ```

4. **Aktif SSO oturumu**: Aktif bir SSO oturumunuz olduğundan emin olun:
   ```bash
   aws sso login --profile SSO_PROFILINIZ
   ```

**Şu durumlarda SSO profillerini kullanın:**

- Çok hesaplı AWS ortamlarını yönetirken
- Merkezi AWS SSO'ya sahip kuruluşlarda çalışırken
- Ekibinizin farklı rol tabanlı izinlere ihtiyacı olduğunda
- Farklı AWS bağlamları arasında geçiş yapmanız gerektiğinde

#### 4. Varsayılan kimlik bilgileri (en düşük öncelik)

AWS SDK'nın standart kimlik bilgisi zincirini kullanın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0
    config:
      region: 'us-east-1' # Sadece bölge belirtildi
```

**AWS SDK bu kaynakları sırasıyla kontrol eder:**

1. **Ortam değişkenleri**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`
2. **Paylaşılan kimlik bilgileri dosyası**: `~/.aws/credentials` (`aws configure` ile oluşturulan)
3. **AWS IAM rolleri**: EC2 örnek profilleri, ECS görev rolleri, Lambda yürütme rolleri
4. **Paylaşılan AWS CLI kimlik bilgileri**: Önbelleğe alınmış SSO kimlik bilgileri dahil

**Şu durumlarda varsayılan kimlik bilgilerini kullanın:**

- IAM rollerine sahip AWS altyapısında (EC2, ECS, Lambda) çalışırken
- AWS CLI yapılandırılmış (`aws configure`) olarak yerel geliştirme yaparken
- IAM rolleri veya ortam değişkenleri olan CI/CD ortamlarında çalışırken

**Yerel geliştirme için hızlı kurulum:**

```bash
# Seçenek 1: AWS CLI kullanarak
aws configure

# Seçenek 2: Ortam değişkenlerini kullanarak
export AWS_ACCESS_KEY_ID="erişim_anahtarınız"
export AWS_SECRET_ACCESS_KEY="gizli_anahtarınız"
export AWS_DEFAULT_REGION="us-east-1"
```
## Örnek

Claude, Nova, AI21, Llama 3.3 ve Titan model kullanımının tam örnekleri için [Github](https://github.com/promptfoo/promptfoo/tree/main/examples/amazon-bedrock) sayfasına bakın.

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - '{{topic}} hakkında bir tweet yaz'

providers:
  # Çıkarım profillerini kullanma (inferenceModelType gerektirir)
  - id: bedrock:arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/my-claude-profile
    config:
      inferenceModelType: 'claude'
      region: 'us-east-1'
      temperature: 0.7
      max_tokens: 256

  # Normal model kimliklerini kullanma
  - id: bedrock:meta.llama3-1-405b-instruct-v1:0
    config:
      region: 'us-east-1'
      temperature: 0.7
      max_tokens: 256
  - id: bedrock:us.meta.llama3-3-70b-instruct-v1:0
    config:
      max_gen_len: 256
  - id: bedrock:amazon.nova-lite-v1:0
    config:
      region: 'us-east-1'
      interfaceConfig:
        temperature: 0.7
        max_new_tokens: 256
  - id: bedrock:us.amazon.nova-premier-v1:0
    config:
      region: 'us-east-1'
      interfaceConfig:
        temperature: 0.7
        max_new_tokens: 256
  - id: bedrock:us.anthropic.claude-sonnet-4-5-20250929-v1:0
    config:
      region: 'us-east-1'
      temperature: 0.7
      max_tokens: 256
  - id: bedrock:us.anthropic.claude-opus-4-1-20250805-v1:0
    config:
      region: 'us-east-1'
      temperature: 0.7
      max_tokens: 256
  - id: bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0
    config:
      region: 'us-east-1'
      temperature: 0.7
      max_tokens: 256
  - id: bedrock:us.anthropic.claude-3-5-haiku-20241022-v1:0
    config:
      region: 'us-east-1'
      temperature: 0.7
      max_tokens: 256
  - id: bedrock:us.anthropic.claude-3-opus-20240229-v1:0
    config:
      region: 'us-east-1'
      temperature: 0.7
      max_tokens: 256
  - id: bedrock:openai.gpt-oss-120b-1:0
    config:
      region: 'us-west-2'
      temperature: 0.7
      max_completion_tokens: 256
      reasoning_effort: 'medium'
  - id: bedrock:openai.gpt-oss-20b-1:0
    config:
      region: 'us-west-2'
      temperature: 0.7
      max_completion_tokens: 256
      reasoning_effort: 'low'
  - id: bedrock:qwen.qwen3-coder-480b-a35b-v1:0
    config:
      region: 'us-west-2'
      temperature: 0.7
      max_tokens: 256
      showThinking: true
  - id: bedrock:qwen.qwen3-32b-v1:0
    config:
      region: 'us-east-1'
      temperature: 0.7
      max_tokens: 256

tests:
  - vars:
      topic: Çevre dostu paketlememiz
  - vars:
      topic: Gizli menü öğemize kısa bir bakış
  - vars:
      topic: Son fotoğraf çekimimizden kamera arkası
```

## Modele Özel Yapılandırma

Farklı modeller farklı yapılandırma seçeneklerini destekleyebilir. İşte bazı modele özel parametreler:

### Genel Yapılandırma Seçenekleri

- `inferenceModelType`: (Çıkarım profilleri için gereklidir) Uygulama çıkarım profilleri kullanıldığında model ailesini belirtir. Seçenekler şunlardır: `claude`, `nova`, `nova2`, `llama`, `llama2`, `llama3`, `llama3.1`, `llama3.2`, `llama3.3`, `llama4`, `mistral`, `cohere`, `ai21`, `titan`, `deepseek`, `openai`, `qwen`

### Amazon Nova Modelleri

Amazon Nova modelleri (örn. `amazon.nova-lite-v1:0`, `amazon.nova-pro-v1:0`, `amazon.nova-micro-v1:0`, `amazon.nova-premier-v1:0`) araç kullanımı ve yapılandırılmış çıktılar gibi gelişmiş özellikleri destekler. Bunları aşağıdaki seçeneklerle yapılandırabilirsiniz:

```yaml
providers:
  - id: bedrock:amazon.nova-lite-v1:0
    config:
      interfaceConfig:
        max_new_tokens: 256 # Üretilecek maksimum token sayısı
        temperature: 0.7 # Rastgeleliği kontrol eder (0.0 - 1.0)
        top_p: 0.9 # Çekirdek örnekleme parametresi
        top_k: 50 # Top-k örnekleme parametresi
        stopSequences: ['END'] # İsteğe bağlı durdurma dizileri
      toolConfig: # İsteğe bağlı araç yapılandırması
        tools:
          - toolSpec:
              name: 'calculator'
              description: 'Aritmetik işlemler için temel bir hesap makinesi'
              inputSchema:
                json:
                  type: 'object'
                  properties:
                    expression:
                      description: 'Hesaplanacak aritmetik ifade'
                      type: 'string'
                  required: ['expression']
        toolChoice: # İsteğe bağlı araç seçimi
          tool:
            name: 'calculator'
```

:::note

Nova modelleri, diğer Bedrock modellerine kıyasla biraz farklı bir yapılandırma yapısı kullanır; `interfaceConfig` ve `toolConfig` bölümleri ayrıdır.

:::

### Amazon Nova 2 Modelleri (Akıl Yürütme)

Amazon Nova 2 modelleri, yapılandırılabilir akıl yürütme seviyeleriyle genişletilmiş düşünme yetenekleri sunar. Nova 2 Lite (`amazon.nova-2-lite-v1:0`), 1 milyon tokenlik bağlam penceresiyle adım adım akıl yürütmeyi ve görev ayrıştırmayı destekler.

```yaml
providers:
  # İsteğe bağlı erişim için bölgeler arası model kimliğini (us.) kullanın
  - id: bedrock:us.amazon.nova-2-lite-v1:0
    config:
      interfaceConfig:
        max_new_tokens: 4096
      reasoningConfig:
        type: enabled # Genişletilmiş düşünmeyi etkinleştir
        maxReasoningEffort: medium # low, medium veya high
```

**Akıl Yürütme Yapılandırması:**

- `type`: Genişletilmiş düşünmeyi etkinleştirmek için `enabled`, hızlı yanıtlar için `disabled` (varsayılan) olarak ayarlayın.
- `maxReasoningEffort`: Düşünme derinliğini kontrol eder - `low`, `medium` veya `high`.

Genişletilmiş düşünme etkinleştirildiğinde, modelin akıl yürütme süreci, diğer akıl yürütme modellerine benzer şekilde yanıt çıktısında `<thinking>` etiketleri içinde yakalanır.

:::warning

`reasoningConfig` ile `type: enabled` kullanırken:

- **Tüm akıl yürütme modları için**: `temperature`, `top_p` veya `top_k` parametrelerini ayarlamayın; bunlar akıl yürütme moduyla uyumlu değildir.
- **`maxReasoningEffort: high` için**: Ayrıca `max_new_tokens` parametresini de ayarlamayın; model çıktı uzunluğunu otomatik olarak yönetir.

:::

**Bölgesel Model Kimlikleri:**

Nova 2 modelleri, isteğe bağlı erişim için bölgeler arası çıkarım profilleri gerektirir:

- `us.amazon.nova-2-lite-v1:0` - ABD bölgesi (önerilen)
- `eu.amazon.nova-2-lite-v1:0` - AB bölgesi
- `apac.amazon.nova-2-lite-v1:0` - Asya Pasifik bölgesi
- `global.amazon.nova-2-lite-v1:0` - Küresel bölgeler arası çıkarım

**Nova 2'yi Converse API ile Kullanma:**

Nova 2 akıl yürütme, Bedrock modellerinde birleşik bir arayüz sağlayan Converse API aracılığıyla da desteklenir:

```yaml
providers:
  - id: bedrock:converse:us.amazon.nova-2-lite-v1:0
    config:
      maxTokens: 4096
      reasoningConfig:
        type: enabled
        maxReasoningEffort: medium
```

Converse API kullanılırken de aynı parametre kısıtlamaları geçerlidir.

### Amazon Nova Sonic Modeli

Amazon Nova Sonic modeli (`amazon.nova-sonic-v1:0`), ses girişini ve metin/ses çıkışını araç kullanma yetenekleriyle birlikte destekleyen çok modlu bir modeldir. Diğer Nova modellerinden farklı bir yapılandırma yapısına sahiptir:

```yaml
providers:
  - id: bedrock:amazon.nova-sonic-v1:0
    config:
      inferenceConfiguration:
        maxTokens: 1024 # Üretilecek maksimum token sayısı
        temperature: 0.7 # Rastgeleliği kontrol eder (0.0 - 1.0)
        topP: 0.95 # Çekirdek örnekleme parametresi
      textOutputConfiguration:
        mediaType: text/plain
      toolConfiguration: # İsteğe bağlı araç yapılandırması
        tools:
          - toolSpec:
              name: 'getDateTool'
              description: 'Mevcut tarih hakkında bilgi al'
              inputSchema:
                json: '{"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{},"required":[]}'
      toolUseOutputConfiguration:
        mediaType: application/json
      # İsteğe bağlı ses çıktısı yapılandırması
      audioOutputConfiguration:
        mediaType: audio/lpcm
        sampleRateHertz: 24000
        sampleSizeBits: 16
        channelCount: 1
        voiceId: matthew
        encoding: base64
        audioType: SPEECH
```

Not: Nova Sonic, ses girişi/çıkışı dahil olmak üzere gelişmiş çok modlu yeteneklere sahiptir, ancak ses girişi base64 kodlu veri gerektirir; bu, yapılandırma dosyasından ziyade doğrudan API aracılığıyla daha iyi yönetilebilir.

### Amazon Nova Reel (Video Oluşturma)

Amazon Nova Reel (`amazon.nova-reel-v1:1`), metin istemlerinden stüdyo kalitesinde videolar oluşturur. Videolar 6 saniyelik artışlarla 2 dakikaya kadar oluşturulur.

:::note Ön Koşullar

Nova Reel, video çıktısı için bir Amazon S3 kovası (bucket) gerektirir. AWS kimlik bilgileriniz şunlara sahip olmalıdır:

- `bedrock:InvokeModel` ve `bedrock:StartAsyncInvoke` izinleri
- Çıktı kovası üzerinde `s3:PutObject` izni
- Oluşturulan videoları indirmek için `s3:GetObject` izni

:::

Nova Reel, **us-east-1** bölgesinde mevcuttur.

#### Temel Yapılandırma

```yaml
providers:
  - id: bedrock:video:amazon.nova-reel-v1:1
    config:
      region: us-east-1
      s3OutputUri: s3://kovam/videolar # Gerekli
      durationSeconds: 6 # Varsayılan: 6
      seed: 42 # İsteğe bağlı: tekrarlanabilirlik için
```

#### Görev Türleri

Nova Reel üç görev türünü destekler:

**TEXT_VIDEO (varsayılan)** - Metin isteminden 6 saniyelik bir video oluşturun:

```yaml
providers:
  - id: bedrock:video:amazon.nova-reel-v1:1
    config:
      s3OutputUri: s3://kovam/videolar
      taskType: TEXT_VIDEO
      durationSeconds: 6
```

**MULTI_SHOT_AUTOMATED** - Tek bir istemden daha uzun videolar (12-120 saniye) oluşturun:

```yaml
providers:
  - id: bedrock:video:amazon.nova-reel-v1:1
    config:
      s3OutputUri: s3://kovam/videolar
      taskType: MULTI_SHOT_AUTOMATED
      durationSeconds: 18 # 6'nın katı olmalıdır
```

**MULTI_SHOT_MANUAL** - Ayrı istemlerle bireysel çekimler (shots) tanımlayın:

```yaml
providers:
  - id: bedrock:video:amazon.nova-reel-v1:1
    config:
      s3OutputUri: s3://kovam/videolar
      taskType: MULTI_SHOT_MANUAL
      durationSeconds: 12
      shots:
        - text: 'Yüksek irtifadan bir ormanın drone çekimi'
        - text: 'Kamera bir ormandaki araçların etrafında kavis çiziyor'
```

#### Görüntüden Videoya Oluşturma

Başlangıç karesi olarak bir görüntü kullanın (1280x720 olmalıdır):

```yaml
providers:
  - id: bedrock:video:amazon.nova-reel-v1:1
    config:
      s3OutputUri: s3://kovam/videolar
      image: file://goruntu/yolu.png
```

#### Yapılandırma Seçenekleri

| Seçenek           | Açıklama                                                     | Varsayılan |
| ----------------- | ------------------------------------------------------------ | ---------- |
| `s3OutputUri`     | Çıktı için S3 kovası URI'si (gerekli)                        | -          |
| `taskType`        | `TEXT_VIDEO`, `MULTI_SHOT_AUTOMATED` veya `MULTI_SHOT_MANUAL` | TEXT_VIDEO |
| `durationSeconds` | Video süresi (6 veya 6'nın katları olarak 12-120)            | 6          |
| `seed`            | Rastgele çekirdek (0-2.147.483.646)                          | -          |
| `image`           | Başlangıç karesi görüntüsü (file:// yolu veya base64)        | -          |
| `shots`           | MULTI_SHOT_MANUAL için çekim tanımları                       | -          |
| `pollIntervalMs`  | Ms cinsinden yoklama aralığı                                 | 10000      |
| `maxPollTimeMs`   | Ms cinsinden maksimum yoklama süresi                         | 900000     |
| `downloadFromS3`  | Videoyu yerel blob depolama alanına indir                    | true       |

Oluşturulan videolar, MP4 formatında 24 FPS'de 1280x720 çözünürlüğündedir.

:::warning Oluşturma Süresi
Video oluşturma asenkrondur ve yaklaşık şu kadar sürer:

- 6 saniyelik video: ~90 saniye
- 2 dakikalık video: ~14-17 dakika

Sağlayıcı, tamamlanma durumunu otomatik olarak kontrol eder (polling).
:::

### AI21 Modelleri

AI21 modelleri için (örn. `ai21.jamba-1-5-mini-v1:0`, `ai21.jamba-1-5-large-v1:0`) aşağıdaki yapılandırma seçeneklerini kullanabilirsiniz:

```yaml
config:
  max_tokens: 256
  temperature: 0.7
  top_p: 0.9
  frequency_penalty: 0.5
  presence_penalty: 0.3
```

### Claude Modelleri

Claude modelleri için (örn. `anthropic.claude-sonnet-4-6`, `anthropic.claude-sonnet-4-5-20250929-v1:0`, `anthropic.claude-haiku-4-5-20251001-v1:0`, `anthropic.claude-sonnet-4-20250514-v1:0`, `anthropic.us.claude-3-5-sonnet-20241022-v2:0`) aşağıdaki yapılandırma seçeneklerini kullanabilirsiniz:

**Not**: Claude Opus 4.6 (`anthropic.claude-opus-4-6-v1`) ve Claude Opus 4.5 (`anthropic.claude-opus-4-5-20251101-v1:0`) bir çıkarım profili ARN'si gerektirir ve doğrudan model kimliği olarak kullanılamaz. Kurulum için [Uygulama Çıkarım Profilleri](#uygulama-cikarim-profilleri) bölümüne bakın.

```yaml
config:
  max_tokens: 256
  temperature: 0.7
  anthropic_version: 'bedrock-2023-05-31'
  tools: [...] # İsteğe bağlı: Kullanılabilir araçları belirtin
  tool_choice: { ... } # İsteğe bağlı: Araç seçimini belirtin
  thinking: { ... } # İsteğe bağlı: Claude'un genişletilmiş düşünme yeteneğini etkinleştirin
  showThinking: true # İsteğe bağlı: Düşünme içeriğinin çıktıya dahil edilip edilmeyeceğini kontrol edin
```

Claude'un genişletilmiş düşünme yeteneğini kullanırken şu şekilde yapılandırabilirsiniz:

```yaml
config:
  max_tokens: 20000
  thinking:
    type: 'enabled'
    budget_tokens: 16000 # ≥1024 ve max_tokens değerinden küçük olmalıdır
  showThinking: true # Düşünme içeriğinin çıktıya dahil edilip edilmeyeceği (varsayılan: true)
```

:::tip

`showThinking` parametresi, düşünme içeriğinin yanıt çıktısına dahil edilip edilmeyeceğini kontrol eder:

- `true` (varsayılan) olarak ayarlandığında, düşünme içeriği çıktıya dahil edilecektir.
- `false` olarak ayarlandığında, düşünme içeriği çıktıdan hariç tutulacaktır.

Bu, daha iyi akıl yürütme için düşünmeyi kullanmak istediğiniz ancak düşünme sürecini son kullanıcılara göstermek istemediğiniz durumlarda yararlıdır.

:::

### Titan Modelleri

Titan modelleri için (örn. `amazon.titan-text-express-v1`) aşağıdaki yapılandırma seçeneklerini kullanabilirsiniz:

```yaml
config:
  maxTokenCount: 256
```
  temperature: 0.7
  topP: 0.9
  stopSequences: ['END']
```

### Llama

Llama modelleri (örn. `meta.llama3-1-70b-instruct-v1:0`, `meta.llama3-2-90b-instruct-v1:0`, `meta.llama3-3-70b-instruct-v1:0`, `meta.llama4-scout-17b-instruct-v1:0`, `meta.llama4-maverick-17b-instruct-v1:0`) için aşağıdaki yapılandırma seçeneklerini kullanabilirsiniz:

```yaml
config:
  max_gen_len: 256
  temperature: 0.7
  top_p: 0.9
```

#### Llama 3.2 Vision

Llama 3.2 Vision modelleri (`us.meta.llama3-2-11b-instruct-v1:0`, `us.meta.llama3-2-90b-instruct-v1:0`) görüntü girişlerini destekler. Bunları eski InvokeModel API'si veya Converse API'si ile kullanabilirsiniz:

**InvokeModel API (eski) Kullanımı:**

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:us.meta.llama3-2-11b-instruct-v1:0
    config:
      region: us-east-1
      max_gen_len: 256

prompts:
  - file://llama_vision_prompt.json

tests:
  - vars:
      image: file://yol/goruntu.jpg
```

```json title="llama_vision_prompt.json"
[
  {
    "role": "user",
    "content": [
      {
        "type": "image",
        "source": {
          "type": "base64",
          "media_type": "image/jpeg",
          "data": "{{image}}"
        }
      },
      {
        "type": "text",
        "text": "Bu görüntüde ne var?"
      }
    ]
  }
]
```

**Converse API Kullanımı:**

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:converse:us.meta.llama3-2-11b-instruct-v1:0
    config:
      region: us-east-1
      maxTokens: 256
```

Converse API, [Nova Vision Yetenekleri](#nova-vizyon-yetenekleri) için yukarıda gösterilen aynı istem formatını kullanır.

### Cohere Modelleri

Cohere modelleri (örn. `cohere.command-text-v14`) için aşağıdaki yapılandırma seçeneklerini kullanabilirsiniz:

```yaml
config:
  max_tokens: 256
  temperature: 0.7
  p: 0.9
  k: 0
  stop_sequences: ['END']
```

### Mistral Modelleri

Mistral modelleri (örn. `mistral.mistral-7b-instruct-v0:2`) için aşağıdaki yapılandırma seçeneklerini kullanabilirsiniz:

```yaml
config:
  max_tokens: 256
  temperature: 0.7
  top_p: 0.9
  top_k: 50
```

### DeepSeek Modelleri

DeepSeek modelleri için aşağıdaki yapılandırma seçeneklerini kullanabilirsiniz:

```yaml
config:
  # Deepseek parametreleri
  max_tokens: 256
  temperature: 0.7
  top_p: 0.9

  # Promptfoo kontrol parametreleri
  showThinking: true # İsteğe bağlı: Düşünme içeriğinin çıktıya dahil edilip edilmeyeceğini kontrol edin
```

DeepSeek modelleri genişletilmiş bir düşünme yeteneğini destekler. `showThinking` parametresi, düşünme içeriğinin yanıt çıktısına dahil edilip edilmeyeceğini kontrol eder:

- `true` (varsayılan) olarak ayarlandığında, düşünme içeriği çıktıya dahil edilecektir.
- `false` olarak ayarlandığında, düşünme içeriği çıktıdan hariç tutulacaktır.

Bu, üretim sırasında modelin akıl yürütme sürecine erişmenize olanak tanırken, son kullanıcılara yalnızca final yanıtını sunma seçeneği sunar.

### OpenAI Modelleri

OpenAI'ın açık ağırlıklı (open-weight) modelleri, akıl yürütme yetenekleri ve parametreleri için tam destekle AWS Bedrock üzerinden kullanılabilir. Mevcut modeller şunlardır:

- **`openai.gpt-oss-120b-1:0`**: Güçlü akıl yürütme yeteneklerine sahip 120 milyar parametreli model.
- **`openai.gpt-oss-20b-1:0`**: 20 milyar parametreli model, daha uygun maliyetli.

```yaml
config:
  max_completion_tokens: 1024 # Yanıt için maksimum token (OpenAI tarzı parametre)
  temperature: 0.7 # Rastgeleliği kontrol eder (0.0 - 1.0)
  top_p: 0.9 # Çekirdek örnekleme parametresi
  frequency_penalty: 0.1 # Sık kullanılan tokenlerin tekrarlanmasını azaltır
  presence_penalty: 0.1 # Herhangi bir tokenin tekrarlanmasını azaltır
  stop: ['END', 'STOP'] # Durdurma dizileri
  reasoning_effort: 'medium' # Akıl yürütme derinliğini kontrol eder: 'low', 'medium', 'high'
```

#### Akıl Yürütme Eforu (Reasoning Effort)

OpenAI modelleri, `reasoning_effort` parametresi aracılığıyla ayarlanabilir akıl yürütme eforunu destekler:

- **`low`**: Temel akıl yürütme ile daha hızlı yanıtlar.
- **`medium`**: Dengeli performans ve akıl yürütme derinliği.
- **`high`**: Kapsamlı akıl yürütme, daha yavaş ama daha doğru yanıtlar.

Akıl yürütme eforu, sistem istemi talimatları aracılığıyla uygulanır ve modelin bilişsel işleme derinliğini ayarlamasına olanak tanır.

#### Kullanım Örneği

```yaml
providers:
  - id: bedrock:openai.gpt-oss-120b-1:0
    config:
      region: 'us-west-2'
      max_completion_tokens: 2048
      temperature: 0.3
      top_p: 0.95
      reasoning_effort: 'high'
  - id: bedrock:openai.gpt-oss-20b-1:0
    config:
      region: 'us-west-2'
      max_completion_tokens: 1024
      temperature: 0.5
      reasoning_effort: 'medium'
      stop: ['END', 'FINAL']
```

:::note

OpenAI modelleri, diğer Bedrock modelleri gibi `max_tokens` yerine `max_completion_tokens` kullanır. Bu, OpenAI'ın API spesifikasyonuyla uyumludur ve yanıt uzunluğu üzerinde daha hassas kontrol sağlar.

:::

### Qwen Modelleri

Alibaba'nın Qwen modelleri (örn. `qwen.qwen3-coder-480b-a35b-v1:0`, `qwen.qwen3-coder-30b-a3b-v1:0`, `qwen.qwen3-235b-a22b-2507-v1:0`, `qwen.qwen3-32b-v1:0`); hibrit düşünme modları, araç çağırma ve genişletilmiş bağlam anlama gibi gelişmiş özellikleri destekler.

**Bölgesel Kullanılabilirlik**: Qwen modellerinin hangi bölgelerde mevcut olduğunu doğrulamak için [AWS Bedrock konsolunu](https://console.aws.amazon.com/bedrock/home) kontrol edin veya `aws bedrock list-foundation-models` komutunu kullanın. Kullanılabilirlik model ve bölgeye göre farklılık gösterir.

Bunları aşağıdaki seçeneklerle yapılandırabilirsiniz:

```yaml
config:
  max_tokens: 2048 # Üretilecek maksimum token sayısı
  temperature: 0.7 # Rastgeleliği kontrol eder (0.0 - 1.0)
  top_p: 0.9 # Çekirdek örnekleme parametresi
  frequency_penalty: 0.1 # Sık kullanılan tokenlerin tekrarlanmasını azaltır
  presence_penalty: 0.1 # Herhangi bir tokenin tekrarlanmasını azaltır
  stop: ['END', 'STOP'] # Durdurma dizileri
  showThinking: true # Düşünme içeriğinin çıktıya dahil edilip edilmeyeceğini kontrol edin
  tools: [...] # Araç çağırma yapılandırması (isteğe bağlı)
  tool_choice: 'auto' # Araç seçim stratejisi (isteğe bağlı)
```

#### Hibrit Düşünme Modları (Hybrid Thinking Modes)

Qwen modelleri, modelin final cevabı vermeden önce adım adım akıl yürütme uygulayabildiği hibrit düşünme modlarını destekler. `showThinking` parametresi, düşünme içeriğinin yanıt çıktısına dahil edilip edilmeyeceğini kontrol eder:

- `true` (varsayılan) olarak ayarlandığında, düşünme içeriği çıktıya dahil edilecektir.
- `false` olarak ayarlandığında, düşünme içeriği çıktıdan hariç tutulacaktır.

Bu, üretim sırasında modelin akıl yürütme sürecine erişmenize olanak tanırken, son kullanıcılara yalnızca final yanıtını sunma seçeneği sunar.

#### Araç Çağırma (Tool Calling)

Qwen modelleri, OpenAI uyumlu fonksiyon tanımlarıyla araç çağırmayı destekler.

```yaml
config:
  tools:
    - type: function
      function:
        name: calculate
        description: Aritmetik hesaplamalar yap
        parameters:
          type: object
          properties:
            expression:
              type: string
              description: Hesaplanacak matematiksel ifade
          required: ['expression']
  tool_choice: auto # 'auto', 'none' veya belirli bir fonksiyon adı
```

#### Model Varyantları

- **Qwen3-Coder-480B-A35B**: Toplam 480B parametre ve 35B aktif parametre ile kodlama ve ajantik görevler için optimize edilmiş MoE (Mixture-of-Experts) modeli.
- **Qwen3-Coder-30B-A3B**: Kodlama görevleri için optimize edilmiş, toplam 30B ve 3B aktif parametreli daha küçük MoE modeli.
- **Qwen3-235B-A22B**: Akıl yürütme ve kodlama için toplam 235B ve 22B aktif parametreli genel amaçlı MoE modeli.
- **Qwen3-32B**: Kaynak kısıtlı ortamlarda tutarlı performans için 32B parametreli yoğun (dense) model.

#### Kullanım Örneği

```yaml
providers:
  - id: bedrock:qwen.qwen3-coder-480b-a35b-v1:0
    config:
      region: us-west-2
      max_tokens: 2048
      temperature: 0.7
      top_p: 0.9
      showThinking: true
      tools:
        - type: function
          function:
            name: code_analyzer
            description: Kodda potansiyel sorunları analiz et
            parameters:
              type: object
              properties:
                code:
                  type: string
                  description: Analiz edilecek kod
              required: ['code']
      tool_choice: auto
```

## Model Tarafından Derecelendirilen Testler (Model-graded tests)

Çıktıları derecelendirmek için Bedrock modellerini kullanabilirsiniz. Varsayılan olarak, model tarafından derecelendirilen testler `gpt-5` kullanır ve `OPENAI_API_KEY` ortam değişkeninin ayarlı olmasını gerektirir. Ancak AWS Bedrock kullanırken, [model tarafından derecelendirilen iddialar (assertions)](/docs/configuration/expected-outputs/model-graded/) için derecelendiriciyi (grader) AWS Bedrock veya diğer sağlayıcılara yönlendirecek şekilde geçersiz kılma seçeneğine sahipsiniz.

Derecelendirme için normal model kimliklerini veya uygulama çıkarım profillerini kullanabilirsiniz:

:::warning

Model tarafından derecelendirilen değerlendirmelerin uygulanma şekli nedeniyle, **LLM derecelendirme modelleri sohbet formatındaki istemleri desteklemelidir** (embedding veya sınıflandırma modelleri hariç).

:::

Bunu tüm test durumlarınız için ayarlamak için, yapılandırmanıza [`defaultTest`](/docs/configuration/guide/#default-test-cases) özelliğini ekleyin:

```yaml title="promptfooconfig.yaml"
defaultTest:
  options:
    provider:
      # Normal bir model kimliği kullanarak
      id: bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0
      config:
        temperature: 0
        # Diğer sağlayıcı yapılandırma seçenekleri

      # Veya bir çıkarım profili kullanarak
      # id: bedrock:arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/grading-profile
      # config:
      #   inferenceModelType: 'claude'
      #   temperature: 0
```

Bunu tekil iddialar (assertions) için de yapabilirsiniz:

```yaml
# ...
assert:
  - type: llm-rubric
    value: Yapay zeka veya sohbet asistanı olduğundan bahsetme
    provider:
      text:
        id: provider:chat:modelname
        config:
          region: us-east-1
          temperature: 0
          # Diğer sağlayıcı yapılandırma seçenekleri...
```

Veya tekil testler için:

```yaml
# ...
tests:
  - vars:
      # ...
    options:
      provider:
        id: provider:chat:modelname
        config:
          temperature: 0
          # Diğer sağlayıcı yapılandırma seçenekleri
    assert:
      - type: llm-rubric
        value: Yapay zeka veya sohbet asistanı olduğundan bahsetme
```

## Çok Modlu Yetenekler (Multimodal Capabilities)

Birkaç Bedrock modeli, görüntüler ve metin dahil olmak üzere çok modlu girişleri destekler:

- **Amazon Nova** - Görüntüleri ve videoları destekler.
- **Llama 3.2 Vision** - Görüntüleri destekler (11B ve 90B varyantları).
- **Claude 3+** - Görüntüleri destekler (Converse API aracılığıyla).
- **Pixtral Large** - Görüntüleri destekler (Converse API aracılığıyla).

Bu yetenekleri kullanmak için istemlerinizi hem görüntü verilerini hem de metin içeriğini içerecek şekilde yapılandırın.

### Nova Vizyon Yetenekleri (Nova Vision Capabilities)

Amazon Nova, hem görüntüler hem de videolar için kapsamlı vizyon anlama desteği sunar:

- **Görüntüler**: Base-64 kodlaması yoluyla PNG, JPG, JPEG, GIF, WebP formatlarını destekler. Yük başına birden fazla görüntüye izin verilir (toplamda 25 MB'a kadar).
- **Videolar**: Base-64 (25 MB'tan az) veya Amazon S3 URI (1 GB'a kadar) yoluyla çeşitli formatları (MP4, MKV, MOV, WEBM vb.) destekler.

Çok modlu değerlendirmeler çalıştırmak için örnek bir yapılandırma:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: 'Görüntülerle Bedrock Nova Değerlendirmesi'

prompts:
  - file://nova_multimodal_prompt.json

providers:
  - id: bedrock:amazon.nova-pro-v1:0
    config:
      region: 'us-east-1'
      inferenceConfig:
        temperature: 0.7
        max_new_tokens: 256

tests:
  - vars:
      image: file://yol/goruntu.jpg
```

İstem dosyası (`nova_multimodal_prompt.json`), hem görüntü hem de metin içeriğini içerecek şekilde yapılandırılmalıdır. Bu format, kullandığınız modele göre değişecektir:

```json title="nova_multimodal_prompt.json"
[
  {
    "role": "user",
    "content": [
      {
        "image": {
          "format": "jpg",
          "source": { "bytes": "{{image}}" }
        }
      },
      {
        "text": "Bu neyin resmidir?"
      }
    ]
  }
]
```

Çalıştırılabilir bir örnek için [Github](https://github.com/promptfoo/promptfoo/blob/main/examples/amazon-bedrock/promptfooconfig.nova.multimodal.yaml) sayfasına bakın.

Görüntü dosyalarını değişken olarak yüklerken, Promptfoo bunları model için uygun formata otomatik olarak dönüştürür. Desteklenen görüntü formatları şunlardır:

- jpg/jpeg
- png
- gif
- bmp
- webp
- svg

## Embeddingler

Benzerlik gibi embedding gerektiren tüm iddialar (assertions) için embedding sağlayıcısını geçersiz kılmak üzere `defaultTest` kullanın:

```yaml
defaultTest:
  options:
    provider:
      embedding:
        id: bedrock:embeddings:amazon.titan-embed-text-v2:0
        config:
          region: us-east-1
```

## Güvenlik Duvarları (Guardrails)

Güvenlik duvarlarını kullanmak için sağlayıcı yapılandırmasında `guardrailIdentifier` ve `guardrailVersion` değerlerini ayarlayın.

Örneğin:

```yaml
providers:
  - id: bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0
    config:
      guardrailIdentifier: 'test-guardrail'
      guardrailVersion: 1 # Güvenlik duvarı sürüm numarası. Değer DRAFT da olabilir.
```

## Ortam Değişkenleri

Bedrock sağlayıcısını yapılandırmak için aşağıdaki ortam değişkenleri kullanılabilir:

**Kimlik Doğrulama:**

- `AWS_BEARER_TOKEN_BEDROCK`: Basitleştirilmiş kimlik doğrulaması için Bedrock API anahtarı.

**Yapılandırma:**

- `AWS_BEDROCK_REGION`: Bedrock API çağrıları için varsayılan bölge.
- `AWS_BEDROCK_MAX_TOKENS`: Üretilecek varsayılan maksimum token sayısı.
- `AWS_BEDROCK_TEMPERATURE`: Üretim için varsayılan sıcaklık.
- `AWS_BEDROCK_TOP_P`: Üretim için varsayılan top_p değeri.
- `AWS_BEDROCK_FREQUENCY_PENALTY`: Varsayılan frekans cezası (desteklenen modeller için).
- `AWS_BEDROCK_PRESENCE_PENALTY`: Varsayılan varlık cezası (desteklenen modeller için).
- `AWS_BEDROCK_STOP`: Varsayılan durdurma dizileri (JSON dizesi olarak).
- `AWS_BEDROCK_MAX_RETRIES`: Başarısız API çağrıları için yeniden deneme sayısı (varsayılan: 10).

Modele özel ortam değişkenleri:

- `MISTRAL_MAX_TOKENS`, `MISTRAL_TEMPERATURE`, `MISTRAL_TOP__P`, `MISTRAL_TOP_K`: Mistral modelleri için.
- `COHERE_TEMPERATURE`, `COHERE_P`, `COHERE_K`, `COHERE_MAX_TOKENS`: Cohere modelleri için.

Bu ortam değişkenleri, YAML dosyasında belirtilen yapılandırma ile geçersiz kılınabilir.

## Sorun Giderme (Troubleshooting)

### Kimlik Doğrulama Sorunları

#### "Unable to locate credentials" (Kimlik bilgileri bulunamadı) Hatası

```text
Error: Unable to locate credentials. You can configure credentials by running "aws configure".
```

**Çözümler:**

1. **Kimlik bilgisi önceliğini kontrol edin**: Kimlik bilgilerinin beklenen öncelik sırasında mevcut olduğundan emin olun.
2. **AWS CLI kurulumunu doğrulayın**: Aktif kimlik bilgilerini görmek için `aws configure list` komutunu çalıştırın.
3. **SSO oturum süresi doldu**: `aws sso login --profile PROFILINIZ` komutunu çalıştırın.
4. **Ortam değişkenleri**: `AWS_ACCESS_KEY_ID` ve `AWS_SECRET_ACCESS_KEY` değişkenlerinin ayarlandığından emin olun.

#### "AccessDenied" veya "UnauthorizedOperation" Hataları

**Çözümler:**

1. **IAM izinlerini kontrol edin**: Kimlik bilgilerinizin `bedrock:InvokeModel` iznine sahip olduğundan emin olun.
2. **Model erişimi**: AWS Bedrock konsolunda model erişimini etkinleştirin.
3. **Bölge uyumsuzluğu**: Yapılandırmanızdaki bölgenin, model erişimini etkinleştirdiğiniz bölgeyle eşleştiğinden emin olun.

#### SSO'ya Özel Sorunlar

**"SSO session has expired" (SSO oturum süresi doldu):**

```bash
aws sso login --profile PROFILINIZ
```

**"Profile not found" (Profil bulunamadı):**

- `~/.aws/config` dosyasının profili içerdiğini kontrol edin.
- Profil adının tam olarak eşleştiğinden emin olun (büyük/küçük harfe duyarlıdır).

#### Kimlik Doğrulamayı Hata Ayıklama (Debugging Authentication)

Hangi kimlik bilgilerinin kullanıldığını görmek için hata ayıklama günlüğünü etkinleştirin:

```bash
export AWS_SDK_JS_LOG=1
npx promptfoo eval
```

Bu, kimlik bilgisi çözümlemesi dahil olmak üzere ayrıntılı AWS SDK günlüklerini gösterecektir.

### Model Yapılandırma Sorunları

#### Çıkarım profili (Inference profile) inferenceModelType gerektirir

Bir çıkarım profili ARN'si kullanırken bu hatayı görürseniz:

```text
Error: Inference profile requires inferenceModelType to be specified in config. Options: claude, nova, llama (defaults to v4), llama2, llama3, llama3.1, llama3.2, llama3.3, llama4, mistral, cohere, ai21, titan, deepseek, openai, qwen
```

Bu, bir uygulama çıkarım profili ARN'si kullandığınız ancak hangi model ailesi için yapılandırıldığını belirtmediğiniz anlamına gelir. Yapılandırmanıza `inferenceModelType` ekleyin:

```yaml
providers:
  # Yanlış - inferenceModelType eksik
  - id: bedrock:arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/my-profile

  # Doğru - inferenceModelType içeriyor
  - id: bedrock:arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/my-profile
    config:
      inferenceModelType: 'claude' # Model ailesini belirtin
```

#### ValidationException: On-demand throughput isn't supported (İsteğe bağlı işlem hacmi desteklenmiyor)

Bu hatayı görürseniz:

```text
ValidationException: Invocation of model ID anthropic.claude-3-5-sonnet-20241022-v2:0 with on-demand throughput isn't supported. Retry your request with the ID or ARN of an inference profile that contains this model.
```

Bu genellikle bölgeye özel model kimliğini kullanmanız gerektiği anlamına gelir. Sağlayıcı yapılandırmanızı bölgesel öneki içerecek şekilde güncelleyin:

```yaml
providers:
  # Bunun yerine:
  - id: bedrock:anthropic.claude-sonnet-4-5-20250929-v1:0
  # Bunu kullanın:
  - id: bedrock:us.anthropic.claude-sonnet-4-5-20250929-v1:0 # ABD bölgesi
  # veya
  - id: bedrock:eu.anthropic.claude-sonnet-4-5-20250929-v1:0 # AB bölgesi
  # veya
  - id: bedrock:apac.anthropic.claude-sonnet-4-5-20250929-v1:0 # APAC bölgesi
```

Şunlardan emin olun:

1. AWS bölgenize göre doğru bölgesel öneki (`us.`, `eu.` veya `apac.`) seçtiğinizden.
2. Sağlayıcı yapılandırmanızda ilgili bölgeyi yapılandırdığınızdan.
3. O bölge için AWS Bedrock konsolunuzda model erişiminin etkin olduğundan.

### AccessDeniedException: Belirtilen model kimliğiyle modele erişiminiz yok

Bu hatayı görürseniz, neden hangi model sağlayıcısını kullandığınıza bağlıdır:

**Çoğu sunucusuz model için** (Amazon, DeepSeek, Mistral, Meta, Qwen, OpenAI):

- Bu modeller onay gerektirmeden anında erişilebilir.
- IAM izinlerinizin `bedrock:InvokeModel` içerdiğini doğrulayın.
- Bölge yapılandırmanızın modelin bölgesiyle eşleştiğini kontrol edin.

**Anthropic modelleri (Claude) için**:

- İlk kullanımda Bedrock konsoluna kullanım durumu ayrıntılarının gönderilmesi gerekir.
- Erişim, gönderimden hemen sonra verilir.
- Bu, her AWS hesabı veya kuruluşu için tek seferlik bir adımdır.

**AWS Marketplace modelleri için**:

- IAM izinlerinizin `aws-marketplace:Subscribe` içerdiğinden emin olun.
- AWS Marketplace üzerinden modele abone olun.

## Bilgi Bankası (Knowledge Base)

AWS Bedrock Bilgi Bankaları, bir bilgi bankasını doğal dille sorgulamanıza ve verilerinize dayalı yanıtlar almanıza olanak tanıyan Geri Getirme Artırılmış Üretim (RAG) işlevselliği sağlar.

### Ön Koşullar

Bilgi Bankası sağlayıcısını kullanmak için şunlara ihtiyacınız vardır:

1. AWS Bedrock'ta oluşturulmuş mevcut bir Bilgi Bankası.
2. `@aws-sdk/client-bedrock-agent-runtime` paketini kurun:

   ```sh
   npm install @aws-sdk/client-bedrock-agent-runtime
   ```

### Yapılandırma

Sağlayıcı kimliğinizde `kb` belirterek Bilgi Bankası sağlayıcısını yapılandırın. Model kimliğinin bölgesel öneki (`us.`, `eu.` veya `apac.`) içermesi gerektiğini unutmayın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:kb:us.anthropic.claude-3-7-sonnet-20250219-v1:0
    config:
      region: 'us-east-2'
      knowledgeBaseId: 'BILGI_BANKASI_KIMLIGINIZ'
      temperature: 0.0
      max_tokens: 1000
      numberOfResults: 5 # İsteğe bağlı: getirilecek parça sayısı (belirtilmediğinde AWS varsayılanı)
```

Sağlayıcı kimliği şu deseni izler: `bedrock:kb:[BOLGESEL_MODEL_KIMLIGI]`

Örneğin:

- `bedrock:kb:us.anthropic.claude-3-5-sonnet-20241022-v2:0` (ABD bölgesi)
- `bedrock:kb:eu.anthropic.claude-3-5-sonnet-20241022-v2:0` (AB bölgesi)

Yapılandırma seçenekleri şunları içerir:

- `knowledgeBaseId` (gerekli): AWS Bedrock Bilgi Bankanızın kimliği.
- `region`: Bilgi Bankanızın konuşlandırıldığı AWS bölgesi (örn. 'us-east-1', 'us-east-2', 'eu-west-1').
- `temperature`: Yanıt üretimindeki rastgeleliği kontrol eder (varsayılan: 0.0).
- `max_tokens`: Üretilen yanıttaki maksimum token sayısı.
- `numberOfResults`: Bilgi bankasından getirilecek parça sayısı (isteğe bağlı, belirtilmediğinde AWS varsayılanını kullanır).
- `accessKeyId`, `secretAccessKey`, `sessionToken`: AWS kimlik bilgileri (ortam değişkenleri veya IAM rolleri kullanılmıyorsa).
- `profile`: SSO kimlik doğrulaması için AWS profil adı.

### Bilgi Bankası Örneği

Bilgi bankanızı birkaç soruyla test etmek için tam bir örnek:

```yaml title="promptfooconfig.yaml"
prompts:
  - 'Fransa"nın başkenti neresidir?'
  - 'Kuantum bilişim hakkında bilgi ver.'

providers:
  - id: bedrock:kb:us.anthropic.claude-3-7-sonnet-20250219-v1:0
    config:
      region: 'us-east-2'
      knowledgeBaseId: 'BILGI_BANKASI_KIMLIGINIZ'
      temperature: 0.0
      max_tokens: 1000
      numberOfResults: 10

  # Karşılaştırma için normal Claude modeli
  - id: bedrock:us.anthropic.claude-3-5-sonnet-20241022-v2:0
    config:
      region: 'us-east-2'
      temperature: 0.0
      max_tokens: 1000

tests:
  - description: 'Bilgi bankasından temel olgusal sorular'
```

### Alıntılar (Citations)

Bilgi Bankası sağlayıcısı hem üretilen yanıtı hem de kaynak belgelerden alıntıları döndürür. Bu alıntılar değerlendirme sonuçlarına dahil edilir ve yanıtların doğruluğunu doğrulamak için kullanılabilir.

:::info

Değerlendirme sonuçlarını kullanıcı arayüzünde görüntülerken, her yanıtın ayrıntılar görünümünde alıntılar ayrı bir bölümde görünür. Orijinal belgelere gitmek için kaynak bağlantılarına tıklayabilir veya referans için alıntı içeriğini kopyalayabilirsiniz.

:::

### Yanıt Formatı

Bilgi Bankası sağlayıcısını kullanırken, yanıt şunları içerecektir:

1. **output**: Sorgunuza dayanarak model tarafından üretilen metin yanıtı.
2. **metadata.citations**: Şunları içeren bir alıntı dizisi:
   - `retrievedReferences`: Yanıtı bilgilendiren kaynak belgelere yapılan atıflar.
   - `generatedResponsePart`: Yanıtın belirli alıntılara karşılık gelen kısımları.

### contextTransform ile Bağlam Değerlendirmesi

Bilgi Bankası sağlayıcısı, `contextTransform` özelliğini kullanarak değerlendirme için alıntılardan bağlam çıkarılmasını destekler:

```yaml title="promptfooconfig.yaml"
tests:
  - vars:
      query: 'promptfoo nedir?'
    assert:
      # Tüm alıntılardan bağlamı çıkar
      - type: context-faithfulness
        contextTransform: |
          if (!metadata?.citations) return '';
          return metadata.citations
            .flatMap(citation => citation.retrievedReferences || [])
            .map(ref => ref.content?.text || '')
            .filter(text => text.length > 0)
            .join('\n\n');
        threshold: 0.7

      # Sadece ilk alıntıdan bağlamı çıkar
      - type: context-relevance
        contextTransform: 'metadata?.citations?.[0]?.retrievedReferences?.[0]?.content?.text || ""'
        threshold: 0.6
```

Bu yaklaşım şunları yapmanıza olanak tanır:

- **Gerçek geri getirmeyi değerlendirin**: Bilgi Bankanız tarafından getirilen gerçek bağlama karşı test yapın.
- **Doğruluğu (faithfulness) ölçün**: Yanıtların getirilen içeriğin ötesinde halüsinasyon görmediğini doğrulayın.
- **Uygunluğu (relevance) değerlendirin**: Getirilen bağlamın sorguyla alakalı olup olmadığını kontrol edin.
- **Hatırlamayı (recall) doğrulayın**: Önemli bilgilerin getirilen bağlamda göründüğünden emin olun.

Tam yapılandırma örnekleri için [Bilgi Bankası contextTransform örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/amazon-bedrock) bakın.

## Bedrock Ajanları (Bedrock Agents)

Amazon Bedrock Ajanları; temel modellerin (FM'ler) akıl yürütmesini, API'leri ve verileri kullanarak kullanıcı isteklerini parçalara ayırır, ilgili bilgileri toplar ve görevleri verimli bir şekilde tamamlar; böylece ekiplerin yüksek değerli işlere odaklanmasını sağlar. Konuşlandırılmış ajanları test etme ve değerlendirme hakkında ayrıntılı bilgi için [AWS Bedrock Agents Sağlayıcısı](./bedrock-agents.md) belgelerine bakın.

Hızlı bir örnek:

```yaml
providers:
  - bedrock-agent:AJAN_KIMLIGINIZ
    config:
      agentAliasId: PROD_ALIAS
      region: us-east-1
      enableTrace: true
```

## Video Oluşturma

AWS Bedrock, asenkrone çağırma (asynchronous invoke) API'leri aracılığıyla video oluşturmayı destekler. Videolar bulutta oluşturulur ve belirttiğiniz bir S3 kovasına çıktı olarak verilir.

### Luma Ray 2

Metin istemlerinden veya görüntülerden yüksek kaliteli videolar üreten Luma Ray 2'yi kullanarak videolar oluşturun.

**Sağlayıcı Kimliği:** `bedrock:video:luma.ray-v2:0`

:::note

Luma Ray 2 şu anda yalnızca **us-west-2** bölgesinde mevcuttur.

:::

#### Temel Yapılandırma

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:video:luma.ray-v2:0
    config:
      region: us-west-2
      s3OutputUri: s3://kovam/luma-cikislari/
```

#### Yapılandırma Seçenekleri

| Seçenek          | Tür     | Varsayılan | Açıklama                                       |
| ---------------- | ------- | ---------- | ---------------------------------------------- |
| `s3OutputUri`    | dize    | -          | **Gerekli.** Video çıktısı için S3 kovası      |
| `duration`       | dize    | "5s"       | Video süresi: "5s" veya "9s"                   |
| `resolution`     | dize    | "720p"     | Çıktı çözünürlüğü: "540p" veya "720p"          |
| `aspectRatio`    | dize    | "16:9"     | En boy oranı (desteklenen oranlara aşağıdan bakın) |
| `loop`           | boolean | false      | Videonun sorunsuz bir şekilde döngüye girip girmeyeceği |
| `startImage`     | dize    | -          | Başlangıç karesi görüntüsü (file:// yolu veya base64) |
| `endImage`       | dize    | -          | Bitiş karesi görüntüsü (file:// yolu veya base64) |
| `pollIntervalMs` | sayı    | 10000      | Milisaniye cinsinden yoklama aralığı           |
| `maxPollTimeMs`  | sayı    | 600000     | Maksimum bekleme süresi (varsayılan 10 dk)     |
| `downloadFromS3` | boolean | true       | Oluşturulduktan sonra videoyu S3'ten indir    |

#### Desteklenen En Boy Oranları

- `1:1` - Kare
- `16:9` - Geniş ekran (varsayılan)
- `9:16` - Dikey/Portre
- `4:3` - Standart
- `3:4` - Portre standart
- `21:9` - Ultra geniş
- `9:21` - Ultra uzun

#### Metinden Videoya Örnek

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:video:luma.ray-v2:0
    config:
      region: us-west-2
      s3OutputUri: s3://kovam/videolar/
      duration: '5s'
      resolution: '720p'
      aspectRatio: '16:9'

prompts:
  - 'Altın saatte bulutların arasından süzülen görkemli bir kartal'

tests:
  - vars: {}
```

#### Görüntüden Videoya Örnek

Başlangıç ve/veya bitiş kareleri sağlayarak görüntüleri canlandırın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: bedrock:video:luma.ray-v2:0
    config:
      region: us-west-2
      s3OutputUri: s3://kovam/videolar/
      startImage: file://./baslangic-karesi.jpg
      endImage: file://./bitis-karesi.jpg
      duration: '5s'

prompts:
  - 'Kamera hareketiyle yumuşak geçiş'
```
tests:
  - vars: {}
```

#### İşlem Süresi

- **5 saniyelik videolar:** 2-5 dakika
- **9 saniyelik videolar:** 4-8 dakika

#### Gerekli İzinler

AWS kimlik bilgilerinizin şu IAM izinlerine sahip olması gerekir:

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel", "bedrock:GetAsyncInvoke", "bedrock:StartAsyncInvoke"],
      "Resource": "arn:aws:bedrock:*:*:model/luma.ray-v2:0"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::kovam/*"
    }
  ]
}
```

## Ayrıca Bakınız

- [Amazon SageMaker Sağlayıcısı](./sagemaker.md) - AWS üzerinde özel olarak konuşlandırılmış veya ince ayar yapılmış modeller için.
- [RAG Değerlendirme Klavuzu](../guides/evaluate-rag.md) - Bağlam tabanlı iddialarla RAG sistemlerini değerlendirmek için tam klavuz.
- [Bağlam Tabanlı İddialar (Context-based Assertions)](../configuration/expected-outputs/model-graded/index.md) - context-faithfulness, context-relevance ve context-recall hakkında belgeler.
- [Yapılandırma Referansı](../configuration/reference.md) - contextTransform dahil tüm yapılandırma seçenekleri.
- [Komut Satırı Arayüzü](../usage/command-line.md) - promptfoo'nun komut satırından nasıl kullanılacağı.
- [Sağlayıcı Seçenekleri](../providers/index.md) - Desteklenen tüm sağlayıcıların özeti.
- [Amazon Bedrock Örnekleri](https://github.com/promptfoo/promptfoo/tree/main/examples/amazon-bedrock) - Bilgi Bankası ve contextTransform örnekleri dahil Bedrock entegrasyonunun çalıştırılabilir örnekleri.
