---
description: Helicone'in birleşik erişim, önbelleğe alma ve kapsamlı gözlemlenebilirlik sunan yapay zeka ağ geçidi aracılığıyla LLM kullanımını izleyin ve optimize edin
---

# Helicone Yapay Zeka Ağ Geçidi (AI Gateway)

[Helicone AI Gateway](https://github.com/Helicone/ai-gateway), 100'den fazla LLM sağlayıcısı için birleşik, OpenAI uyumlu bir arayüz sağlayan açık kaynaklı, kendi kendine barındırılabilen bir yapay zeka ağ geçididir. Promptfoo'daki Helicone sağlayıcısı, istekleri yerel olarak çalışan bir Helicone AI Gateway örneği üzerinden yönlendirmenize olanak tanır.

## Avantajlar

- **Birleşik Arayüz**: 100'den fazla farklı LLM sağlayıcısına erişmek için OpenAI SDK sözdizimini kullanın
- **Yük Dengeleme**: Gecikme süresi, maliyet veya özel stratejilere dayalı akıllı sağlayıcı seçimi
- **Önbelleğe Alma (Caching)**: Maliyetleri azaltmak ve performansı artırmak için akıllı yanıt önbelleğe alma
- **Hız Sınırlama (Rate Limiting)**: Yerleşik hız sınırlama ve kullanım kontrolleri
- **Gözlemlenebilirlik (Observability)**: Helicone'un gözlemlenebilirlik platformuyla isteğe bağlı entegrasyon
- **Kendi Kendine Barındırma**: Tam kontrol için kendi ağ geçidi örneğinizi çalıştırın

## Kurulum

### Helicone AI Gateway'i Başlatın

İlk olarak, yerel bir Helicone AI Gateway örneği başlatın:

```bash
# Sağlayıcı API anahtarlarınızı ayarlayın
export OPENAI_API_KEY=your_openai_key
export ANTHROPIC_API_KEY=your_anthropic_key
export GROQ_API_KEY=your_groq_key

# Ağ geçidini başlatın
npx @helicone/ai-gateway@latest
```

Ağ geçidi varsayılan olarak `http://localhost:8080` adresinde başlayacaktır.

### Yükleme

Ek bir bağımlılık gerekmez. Helicone sağlayıcısı promptfoo içinde yerleşiktir ve çalışan herhangi bir Helicone AI Gateway örneği ile çalışır.

## Kullanım

### Temel Kullanım

İstekleri yerel Helicone AI Gateway'iniz üzerinden yönlendirmek için:

```yaml
providers:
  - helicone:openai/gpt-5-mini
  - helicone:anthropic/claude-3-5-sonnet
  - helicone:groq/llama-3.1-8b-instant
```

Model formatı, Helicone AI Gateway tarafından desteklenen `sağlayıcı/model` şeklindedir.

### Özel Yapılandırma

Daha gelişmiş yapılandırma için:

```yaml
providers:
  - id: helicone:openai/gpt-4o
    config:
      # Ağ geçidi yapılandırması
      baseUrl: http://localhost:8080 # Özel ağ geçidi URL'si
      router: production # Belirli işlemciyi (router) kullan
      # Standart OpenAI seçenekleri
      temperature: 0.7
      max_tokens: 1500
      headers:
        Custom-Header: 'custom-value'
```

### Özel İşlemci (Router) Kullanımı

Helicone AI Gateway'iniz özel işlemcilerle yapılandırılmışsa:

```yaml
providers:
  - id: helicone:openai/gpt-4o
    config:
      router: production
  - id: helicone:openai/gpt-3.5-turbo
    config:
      router: development
```

## Yapılandırma Seçenekleri

### Sağlayıcı Formatı

Helicone sağlayıcısı şu formatı kullanır: `helicone:sağlayıcı/model`

Örnekler:

- `helicone:openai/gpt-4o`
- `helicone:anthropic/claude-3-5-sonnet`
- `helicone:groq/llama-3.1-8b-instant`

### Desteklenen Modeller

Helicone AI Gateway, çeşitli sağlayıcılardan 100'den fazla modeli destekler. Bazı popüler örnekler:

| Sağlayıcı | Örnek Modeller                                                    |
| --------- | ----------------------------------------------------------------- |
| OpenAI    | `openai/gpt-4o`, `openai/gpt-5-mini`, `openai/o1-preview`         |
| Anthropic | `anthropic/claude-3-5-sonnet`, `anthropic/claude-3-haiku`         |
| Groq      | `groq/llama-3.1-8b-instant`, `groq/llama-3.1-70b-versatile`       |
| Meta      | `meta-llama/Llama-3-8b-chat-hf`, `meta-llama/Llama-3-70b-chat-hf` |
| Google    | `google/gemma-7b-it`, `google/gemma-2b-it`                        |

Tam liste için [Helicone AI Gateway belgelerine](https://github.com/Helicone/ai-gateway) bakın.

### Yapılandırma Parametreleri

#### Ağ Geçidi Seçenekleri

- `baseUrl` (string): Helicone AI Gateway URL'si (varsayılan `http://localhost:8080`)
- `router` (string): Özel işlemci adı (isteğe bağlı, belirtilmezse `/ai` uç noktasını kullanır)
- `model` (string): Sağlayıcı spesifikasyonundaki model adını geçersiz kıl
- `apiKey` (string): Özel API anahtarı (varsayılan `placeholder-api-key`)

#### OpenAI Uyumlu Seçenekler

Sağlayıcı OpenAI'ın sohbet tamamlama sağlayıcısını genişlettiği için tüm standart OpenAI seçenekleri desteklenir:

- `temperature`: Rastgeleliği kontrol eder (0.0 - 1.0)
- `max_tokens`: Oluşturulacak maksimum token sayısı
- `top_p`: Çekirdek örnekleme parametresi
- `frequency_penalty`: Sık kullanılan tokenleri cezalandırır
- `presence_penalty`: Varlığa göre yeni tokenleri cezalandırır
- `stop`: Durdurma dizileri
- `headers`: Ek HTTP üstbilgileri

## Örnekler

### Temel OpenAI Entegrasyonu

```yaml
providers:
  - helicone:openai/gpt-5-mini

prompts:
  - "'{{text}}' ifadesini Fransızca'ya çevir"

tests:
  - vars:
      text: 'Hello world'
    assert:
      - type: contains
        value: 'Bonjour'
```

### Gözlemlenebilirlik ile Çoklu Sağlayıcı Karşılaştırması

```yaml
providers:
  - id: helicone:openai/gpt-4o
    config:
      tags: ['openai', 'gpt4']
      properties:
        model_family: 'gpt-4'

  - id: helicone:anthropic/claude-3-5-sonnet-20241022
    config:
      tags: ['anthropic', 'claude']
      properties:
        model_family: 'claude-3'

prompts:
  - '{{topic}} hakkında yaratıcı bir hikaye yaz'

tests:
  - vars:
      topic: 'resim yapmayı öğrenen bir robot'
```

### Tam Yapılandırmalı Özel Sağlayıcı

```yaml
providers:
  - id: helicone:openai/gpt-4o
    config:
      baseUrl: https://custom-gateway.example.com:8080
      router: production
      apiKey: your_custom_api_key
      temperature: 0.7
      max_tokens: 1000
      headers:
        Authorization: Bearer your_target_provider_api_key
        Custom-Header: custom-value

prompts:
  - 'Şu soruyu cevapla: {{question}}'

tests:
  - vars:
      question: 'Yapay zeka nedir?'
```

### Önbelleğe Alma ve Performans Optimizasyonu

```yaml
providers:
  - id: helicone:openai/gpt-3.5-turbo
    config:
      cache: true
      properties:
        cache_strategy: 'aggressive'
        use_case: 'batch_processing'

prompts:
  - 'Özetle: {{text}}'

tests:
  - vars:
      text: 'Özetlenecek büyük metin içeriği...'
    assert:
      - type: latency
        threshold: 2000 # Önbelleğe alma nedeniyle daha hızlı olmalıdır
```

## Özellikler

### İstek İzleme

Helicone üzerinden yönlendirilen tüm istekler otomatik olarak şunlarla günlüğe kaydedilir:

- İstek/yanıt yükleri
- Token kullanımı ve maliyetler
- Gecikme Metrikleri
- Özel özellikler ve etiketler

### Maliyet Analitiği

Farklı sağlayıcılar ve modeller arasındaki maliyetleri takip edin:

- İstek başına maliyet dökümü
- Agrege edilmiş maliyet analitiği
- Maliyet optimizasyon önerileri

### Önbelleğe Alma (Caching)

Akıllı yanıt önbelleğe alma:

- Anlamsal benzerlik eşleşmesi (semantic similarity matching)
- Yapılandırılabilir önbellek süresi
- Önbellek isabetleri (cache hits) yoluyla maliyet düşürme

### Hız Sınırlama (Rate Limiting)

Yerleşik hız sınırlama:

- Kullanıcı başına sınırlar
- Oturum başına sınırlar
- Özel hız sınırlama kuralları

## En İyi Uygulamalar

1. **Anlamlı Etiketler Kullanın**: Daha iyi analitik için isteklerinizi ilgili meta verilerle etiketleyin
2. **Oturumları Takip Edin**: Konuşma akışlarını izlemek için oturum kimlikleri kullanın
3. **Önbelleğe Almayı Etkinleştirin**: Tekrarlanan veya benzer istekler için maliyetleri azaltmak üzere önbelleğe almayı etkinleştirin
4. **Maliyetleri İzleyin**: Helicone panelindeki maliyet analizlerini düzenli olarak gözden geçirin
5. **Özel Özellikler**: Kullanımınızı segmentlere ayırmak ve analiz etmek için özel özellikler kullanın

## Sorun Giderme

### Yaygın Sorunlar

1. **Kimlik Doğrulama Başarısız**: `HELICONE_API_KEY`'inizin doğru ayarlandığından emin olun
2. **Bilinmeyen Sağlayıcı**: Sağlayıcının desteklenenler listesinde olup olmadığını kontrol edin veya özel bir `targetUrl` kullanın
3. **İstek Zaman Aşımı**: Ağ bağlantınızı ve hedef sağlayıcının kullanılabilirliğini kontrol edin

### Hata Ayıklama Modu

Ayrıntılı istek/yanıt bilgilerini görmek için hata ayıklama günlüğünü etkinleştirin:

```bash
LOG_LEVEL=debug promptfoo eval
```

## İlgili Bağlantılar

- [Helicone Belgeleri](https://docs.helicone.ai/)
- [Helicone Paneli](https://helicone.ai/dashboard)
- [Helicone GitHub](https://github.com/Helicone/helicone)
- [promptfoo Sağlayıcı Kılavuzu](/docs/providers/)
