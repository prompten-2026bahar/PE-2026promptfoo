---
title: AWS Bedrock Agents
description: Kurulum, kimlik doğrulama, oturum yönetimi, bilgi tabanları ve izleme seçenekleri dahil olmak üzere promptfoo'da Amazon Bedrock Agents'ı yapılandırın ve test edin.
sidebar_label: AWS Bedrock Agents
---

# AWS Bedrock Agents

AWS Bedrock Agents sağlayıcısı, Amazon Bedrock Agents ile oluşturulmuş yapay zeka ajanlarını test etmenize ve değerlendirmenize olanak tanır. Amazon Bedrock Agents; kullanıcı isteklerini parçalara ayırmak, ilgili bilgileri toplamak ve görevleri verimli bir şekilde tamamlamak için temel modellerin (FM'ler) akıl yürütme yeteneğini, API'leri ve verileri kullanır; böylece ekiplerin yüksek değerli işlere odaklanmasını sağlar.

## Ön Koşullar

- Bedrock Agents erişimine sahip AWS hesabı
- Etkin bir takma ada (alias) sahip, yayına alınmış bir Bedrock ajanı
- Kurulu AWS SDK: `npm install @aws-sdk/client-bedrock-agent-runtime`
- `bedrock:InvokeAgent` için IAM izinleri

## Temel Yapılandırma

```yaml
providers:
  - bedrock-agent:YOUR_AGENT_ID
    config:
      agentAliasId: PROD_ALIAS_ID  # Gereklidir
      region: us-east-1
```

## Tam Yapılandırma Seçenekleri

Bedrock Agents sağlayıcısı, AWS Bedrock ajanlarının tüm özelliklerini destekler:

```yaml
providers:
  - id: bedrock-agent:my-agent
    config:
      # Gereklidir
      agentId: ABCDEFGHIJ
      agentAliasId: PROD_ALIAS_ID

      # AWS Kimlik Doğrulama (isteğe bağlı - sağlanmazsa varsayılan zinciri kullanır)
      region: us-east-1
      accessKeyId: YOUR_ACCESS_KEY
      secretAccessKey: YOUR_SECRET_KEY
      sessionToken: YOUR_SESSION_TOKEN # Geçici kimlik bilgileri için
      profile: my-aws-profile # AWS SSO profilini kullanın

      # Oturum Yönetimi
      sessionId: user-session-123 # Konuşma durumunu koruyun
      sessionState:
        sessionAttributes:
          userId: 'user-123'
          department: 'engineering'
        promptSessionAttributes:
          context: 'teknik destek'
        invocationId: 'inv-456' # Belirli çağrıları takip edin

      # Bellek Yapılandırması
      memoryId: LONG_TERM_MEMORY # veya SHORT_TERM_MEMORY

      # Yürütme Seçenekleri
      enableTrace: true # Ayrıntılı yürütme izlerini alın
      endSession: false # Oturumu açık tutun

      # Çıkarım Yapılandırması (Inference Configuration)
      inferenceConfig:
        temperature: 0.7
        topP: 0.9
        topK: 50
        maximumLength: 2048
        stopSequences: ['END', 'STOP']

      # Koruma Duvarları (Guardrails)
      guardrailConfiguration:
        guardrailId: GUARDRAIL_ID
        guardrailVersion: '1'

      # Bilgi Tabanı Yapılandırması
      knowledgeBaseConfigurations:
        - knowledgeBaseId: KB_ID_1
          retrievalConfiguration:
            vectorSearchConfiguration:
              numberOfResults: 5
              overrideSearchType: HYBRID # veya SEMANTIC
              filter:
                category: 'teknik'
        - knowledgeBaseId: KB_ID_2

      # Eylem Grupları (Araçlar)
      actionGroups:
        - actionGroupName: 'hesap_makinesi'
          actionGroupExecutor:
            lambda: 'arn:aws:lambda:...'
          description: 'Matematik işlemleri'
        - actionGroupName: 'veritabani'
          actionGroupExecutor:
            customControl: RETURN_CONTROL
          apiSchema:
            s3:
              s3BucketName: 'my-bucket'
              s3ObjectKey: 'api-schema.json'

      # İstem Geçersiz Kılma (Prompt Override)
      promptOverrideConfiguration:
        promptConfigurations:
          - promptType: PRE_PROCESSING
            promptCreationMode: OVERRIDDEN
            basePromptTemplate: 'Özel ön işleme: {input}'
            inferenceConfiguration:
              temperature: 0.5
          - promptType: ORCHESTRATION
            promptState: DISABLED

      # İçerik Filtreleme
      inputDataConfig:
        bypassLambdaParsing: false
        filters:
          - name: 'pii-filter'
            type: PREPROCESSING
            inputType: TEXT
            outputType: TEXT
```

## Özellikler

### Oturum Yönetimi

Birden fazla etkileşim boyunca konuşma bağlamını koruyun:

```yaml
tests:
  - vars:
      query: "Sipariş numaram 12345"
    providers:
      - bedrock-agent:support-agent
        config:
          sessionId: "customer-session-001"

  - vars:
      query: "Siparişim ne durumda?"
    providers:
      - bedrock-agent:support-agent
        config:
          sessionId: "customer-session-001"  # Aynı oturum
    assert:
      - type: contains
        value: "12345"  # Ajan sipariş numarasını hatırlamalıdır
```

### Bellek Türleri

Farklı kullanım durumları için ajan belleğini yapılandırın:

```yaml
# Kısa süreli bellek (oturum tabanlı)
config:
  memoryId: SHORT_TERM_MEMORY

# Uzun süreli bellek (kalıcı)
config:
  memoryId: LONG_TERM_MEMORY
```

### Bilgi Tabanı Entegrasyonu

RAG yetenekleri için ajanları bilgi tabanlarına bağlayın:

```yaml
config:
  knowledgeBaseConfigurations:
    - knowledgeBaseId: 'technical-docs-kb'
      retrievalConfiguration:
        vectorSearchConfiguration:
          numberOfResults: 10
          overrideSearchType: HYBRID
          filter:
            documentType: 'manual'
            product: 'widget-pro'
```

### Eylem Grupları (Araçlar)

Ajanların araçları ve API'leri kullanmasını sağlayın:

```yaml
config:
  actionGroups:
    - actionGroupName: 'weather-api'
      actionGroupExecutor:
        lambda: 'arn:aws:lambda:us-east-1:123456789:function:WeatherAPI'
      description: 'Hava durumu bilgisini al'

    - actionGroupName: 'database-query'
      actionGroupExecutor:
        customControl: RETURN_CONTROL # Ajan kontrolü arayana geri verir
```

### Koruma Duvarları (Guardrails)

İçerik filtreleme ve güvenlik önlemleri uygulayın:

```yaml
config:
  guardrailConfiguration:
    guardrailId: 'content-filter-001'
    guardrailVersion: '2'
```

### Çıkarım Kontrolü (Inference Control)

Ajan yanıt üretimini hassaslaştırın:

```yaml
config:
  inferenceConfig:
    temperature: 0.3 # Daha deterministik yanıtlar için daha düşük
    topP: 0.95
    topK: 40
    maximumLength: 4096
    stopSequences: ['END_RESPONSE', "\n\n"]
```

### İzleme Bilgisi (Trace Information)

Hata ayıklama için ayrıntılı yürütme izleri alın:

```yaml
config:
  enableTrace: true

tests:
  - vars:
      query: '25 * 4 işlemini hesapla'
    assert:
      - type: javascript
        value: |
          // Araç kullanımı için izlemeyi kontrol edin
          metadata?.trace?.some(t => 
            t.actionGroupTrace?.actionGroupName === 'hesap_makinesi'
          )
```

## Kimlik Doğrulama

Sağlayıcı birden fazla kimlik doğrulama yöntemini destekler:

1. **Ortam Değişkenleri** (önerilir):

   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export AWS_REGION=us-east-1
   ```

2. **AWS Profili**:

   ```yaml
   config:
     profile: my-aws-profile
   ```

3. **Açık Kimlik Bilgileri**:

   ```yaml
   config:
     accessKeyId: YOUR_ACCESS_KEY
     secretAccessKey: YOUR_SECRET_KEY
   ```

4. **IAM Rolü** (AWS altyapısında çalışırken)

## Yanıt Formatı

Sağlayıcı şu yapıya sahip yanıtlar döndürür:

```typescript
{
  output: string;           // Ajanın yanıt metni
  metadata?: {
    sessionId?: string;     // Oturum tanımlayıcısı
    memoryId?: string;      // Kullanılan bellek türü
    trace?: Array<any>;     // Yürütme izleri (enableTrace: true ise)
    guardrails?: {          // Guardrail uygulama bilgisi
      applied: boolean;
      guardrailId: string;
      guardrailVersion: string;
    };
  };
  cached?: boolean;         // Yanıtın önbelleğe alınıp alınmadığı
  error?: string;           // Başarısız olursa hata mesajı
}
```

## Test Örnekleri

### Temel Ajan Testi

```yaml
description: 'Müşteri destek ajanını test et'

providers:
  - id: support-agent
    provider: bedrock-agent:SUPPORT_AGENT_ID
    config:
      agentAliasId: PROD_ALIAS
      enableTrace: true

prompts:
  - 'Şifremi nasıl sıfırlarım?'
  - 'Çalışma saatleriniz nedir?'
  - 'Bir yöneticiyle görüşmem gerekiyor'

tests:
  - vars:
      query: '{{prompt}}'
    assert:
      - type: not-empty
      - type: latency
        threshold: 5000
```

### Çok Turlu Konuşma Testi

```yaml
tests:
  # İlk tur - bağlam sağla
  - vars:
      query: "SKU-123 ürünüyle ilgili sorun yaşıyorum"
    providers:
      - id: agent-session-1
        provider: bedrock-agent:AGENT_ID
        config:
          sessionId: 'test-session-001'
          sessionState:
            sessionAttributes:
              customerId: 'CUST-456'

  # İkinci tur - bağlam korumasını test et
  - vars:
      query: 'Hangi garanti seçenekleri mevcut?'
    providers:
      - id: agent-session-1
        provider: bedrock-agent:AGENT_ID
        config:
          sessionId: 'test-session-001' # Aynı oturum
    assert:
      - type: contains
        value: 'SKU-123' # Ürünü hatırlamalıdır
```

### Bilgi Tabanı Doğrulaması

```yaml
tests:
  - vars:
      query: "Maksimum dosya yükleme boyutu nedir?"
    providers:
      - bedrock-agent:AGENT_ID
        config:
          knowledgeBaseConfigurations:
            - knowledgeBaseId: "docs-kb"
              retrievalConfiguration:
                vectorSearchConfiguration:
                  numberOfResults: 3
    assert:
      - type: contains-any
        value: ["10MB", "10 megabayt", "on megabayt"]
```

### Araç Kullanımı Doğrulaması

```yaml
tests:
  - vars:
      query: "Seattle'da hava nasıl?"
    providers:
      - bedrock-agent:AGENT_ID
        config:
          enableTrace: true
          actionGroups:
            - actionGroupName: "weather-api"
    assert:
      - type: javascript
        value: |
          // Hava durumu API'sinin çağrıldığını doğrulayın
          metadata?.trace?.some(trace =>
            trace.actionGroupTrace?.actionGroupName === 'weather-api'
          )
```

## Hata Yönetimi

Sağlayıcı, yaygın sorunlar için özel hata mesajları içerir:

- **ResourceNotFoundException**: Ajan veya takma ad bulunamadı
- **AccessDeniedException**: IAM izin sorunları
- **ValidationException**: Geçersiz yapılandırma
- **ThrottlingException**: Hız sınırı aşıldı

## Performans Optimizasyonu

1. Özdeş sorgular için **Önbelleğe Almayı** kullanın:

   ```yaml
   providers:
     - bedrock-agent:AGENT_ID
       config:
         cache: true  # Yanıtlar varsayılan olarak önbelleğe alınır
   ```

2. **Bilgi Tabanı Sorgularını Optimize Etin**:

   ```yaml
   knowledgeBaseConfigurations:
     - knowledgeBaseId: KB_ID
       retrievalConfiguration:
         vectorSearchConfiguration:
           numberOfResults: 3 # Yalnızca gerekli sonuçlarla sınırlandırın
   ```

3. **Yanıt Uzunluğunu Kontrol Edin**:

   ```yaml
   inferenceConfig:
     maximumLength: 1024 # Yanıt boyutunu sınırlandırın
   ```

## Sorun Giderme

### Ajan Yanıt Vermiyor

1. Ajanın yayına alındığını ve takma adın etkin olduğunu doğrulayın:

   ```bash
   aws bedrock-agent get-agent --agent-id YOUR_AGENT_ID
   aws bedrock-agent get-agent-alias --agent-id YOUR_AGENT_ID --agent-alias-id YOUR_ALIAS_ID
   ```

2. IAM izinlerinin şunları içerdiğinden emin olun:

   ```json
   {
     "Effect": "Allow",
     "Action": "bedrock:InvokeAgent",
     "Resource": "arn:aws:bedrock:*:*:agent/*"
   }
   ```

### Oturum/Bellek Çalışmıyor

Tutarlı oturum kimlikleri ve doğru bellek türü kullandığınızdan emin olun:

```yaml
config:
  sessionId: 'consistent-session-id'
  memoryId: 'LONG_TERM_MEMORY' # Ajan yapılandırmasıyla eşleşmelidir
```

### Bilgi Tabanı Sonuç Döndürmüyor

Bilgi tabanının senkronize edildiğini ve erişilebilir olduğunu doğrulayın:

```bash
aws bedrock-agent list-agent-knowledge-bases --agent-id YOUR_AGENT_ID
```

## Ayrıca Bakınız

- [AWS Bedrock Agents Belgeleri](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html)
- [Ajan API Referansı](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html)
- [Bilgi Tabanı Kurulumu](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html)
- [Koruma Duvarı Yapılandırması](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)
- [AWS Bedrock Sağlayıcısına Genel Bakış](./aws-bedrock.md)
- [Yapılandırma Referansı](../configuration/reference.md)
