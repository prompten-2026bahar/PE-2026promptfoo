---
sidebar_label: Özel Ruby
description: 'Tam esneklik ile gelişmiş model entegrasyonları, değerlendirmeler ve karmaşık test mantığı için özel Ruby betikleri oluşturun'
---

# Ruby Sağlayıcısı

Ruby sağlayıcısı, Ruby betiklerini kullanarak özel değerlendirme mantığı oluşturmanıza olanak tanır. Bu, Promptfoo'yu herhangi bir Ruby tabanlı model, API veya özel mantıkla entegre etmenizi sağlar.

**Yaygın kullanım durumları:**

- Tescilli veya yerel modelleri entegre etme
- Özel ön işleme/son işleme mantığı ekleme
- Karmaşık değerlendirme iş akışlarını uygulama
- Ruby'ye özgü ML kütüphanelerini kullanma
- Test için sahte (mock) sağlayıcılar oluşturma

## Ön Koşullar

Ruby sağlayıcısını kullanmadan önce şunlara sahip olduğunuzdan emin olun:

- Ruby 2.7 veya daha yüksek bir sürüm kurulu
- Promptfoo yapılandırmasına temel aşinalık
- Ruby Hash yapıları ve JSON hakkında bilgi

## Hızlı Başlangıç

Girişi bir önekle geri döndüren basit bir Ruby sağlayıcısı oluşturalım.

### Adım 1: Ruby betiğinizi oluşturun

```ruby
# echo_provider.rb
def call_api(prompt, options, context)
  # İstemi bir önekle geri döndüren basit bir sağlayıcı
  config = options['config'] || {}
  prefix = config['prefix'] || 'Şunun hakkında bilgi ver: '

  {
    'output' => "#{prefix}#{prompt}"
  }
end
```

### Adım 2: Promptfoo'yu yapılandırın

```yaml
# promptfooconfig.yaml
providers:
  - id: 'file://echo_provider.rb'

prompts:
  - 'Bana bir fıkra anlat'
  - '2+2 kaçtır?'
```

### Adım 3: Değerlendirmeyi çalıştırın

```bash
npx promptfoo@latest eval
```

İşte bu kadar! İlk özel Ruby sağlayıcınızı oluşturdunuz.

## Nasıl Çalışır?

Promptfoo, bir Ruby sağlayıcısıyla bir test vakasını değerlendirdiğinde:

1. **Promptfoo**, yapılandırmanıza göre istemi hazırlar.
2. **Ruby Betiği** üç parametre ile çağrılır:
   - `prompt`: Nihai istem dizesi
   - `options`: YAML'ınızdaki sağlayıcı yapılandırması
   - `context`: Mevcut test için değişkenler ve meta veriler
3. **Kodunuz** istemi işler ve bir yanıt döndürür.
4. **Promptfoo** yanıtı doğrular ve değerlendirmeye devam eder.

```text
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ Promptfoo   │────▶│ Sizin Ruby   │────▶│ Sizin       │
│ Değerlendirme│     │ Sağlayıcınız │     │ Mantığınız  │
│             │     │              │     │ (API/Model) │
└─────────────┘     └──────────────┘     └─────────────┘
       ▲                    │
       │                    ▼
       │            ┌──────────────┐
       └────────────│     Yanıt    │
                    └──────────────┘
```

## Temel Kullanım

### Fonksiyon Arayüzü

Ruby betiğiniz bu fonksiyonlardan birini veya birkaçını uygulamalıdır:

```ruby
def call_api(prompt, options, context)
  # Metin üretme görevleri için ana fonksiyon
end

def call_embedding_api(prompt, options, context)
  # Embedding üretme görevleri için
end

def call_classification_api(prompt, options, context)
  # Sınıflandırma görevleri için
end
```

### Parametreleri Anlama

#### `prompt` Parametresi

İstem şunlardan biri olabilir:

- Basit bir dize: `"Fransa'nın başkenti neresidir?"`
- JSON kodlu bir konuşma: `'[{"role": "user", "content": "Merhaba"}]'`

```ruby
require 'json'

def call_api(prompt, options, context)
  # İstemin bir konuşma olup olmadığını kontrol et
  begin
    messages = JSON.parse(prompt)
    # Sohbet mesajları olarak işle
    messages.each do |msg|
      puts "#{msg['role']}: #{msg['content']}"
    end
  rescue JSON::ParserError
    # Basit dize olarak işle
    puts "İstem: #{prompt}"
  end
end
```

#### `options` Parametresi

Sağlayıcı yapılandırmanızı ve meta verilerinizi içerir:

```ruby
{
  'id' => 'file://my_provider.rb',
  'config' => {
    # promptfooconfig.yaml içindeki özel yapılandırmanız
    'model_name' => 'gpt-3.5-turbo',
    'temperature' => 0.7,
    'max_tokens' => 100,

    # promptfoo tarafından otomatik olarak eklenir:
    'basePath' => '/absolute/path/to/config'  # Yapılandırmanızı içeren dizin (promptfooconfig.yaml)
  }
}
```

#### `context` Parametresi

Mevcut test vakası hakkında bilgi sağlar:

```ruby
{
  'vars' => {
    'user_input' => 'Merhaba dünya',
    'system_prompt' => 'Yardımsever bir asistansınız'
  },
  'prompt' => {
    'raw' => '...',
    'label' => '...',
  },
  'test' => {
    'vars' => { ... },
    'metadata' => {
      'pluginId' => '...',   # Redteam eklentisi (örn. "promptfoo:redteam:harmful:hate")
      'strategyId' => '...',  # Redteam stratejisi (örn. "jailbreak", "prompt-injection")
    },
  },
}
```

Kırmızı takım (redteam) değerlendirmeleri için, test vakasını hangi eklentinin ve stratejinin oluşturduğunu belirlemek üzere `context['test']['metadata']['pluginId']` ve `context['test']['metadata']['strategyId']` kullanın.

:::note

Serileştirilemeyen alanlar (`logger`, `getCache`, `filters`, `originalProvider`), context Ruby'ye iletilmeden önce kaldırılır. `evaluationId`, `testCaseId`, `testIdx`, `promptIdx` ve `repeatIndex` gibi ek alanlar da mevcuttur.

:::

### Dönüş Formatı

Fonksiyonunuz şu alanları içeren bir Hash döndürmelidir:

```ruby
def call_api(prompt, options, context)
  # Gerekli alan
  result = {
    'output' => 'Yanıtınız buraya'
  }

  # İsteğe bağlı alanlar
  result['tokenUsage'] = {
    'total' => 150,
    'prompt' => 50,
    'completion' => 100
  }

  result['cost'] = 0.0025  # dolar cinsinden
  result['cached'] = false
  result['logProbs'] = [-0.5, -0.3, -0.1]

  # Hata yönetimi
  if bir_seyler_ters_gitti
    result['error'] = 'Neyin ters gittiğine dair açıklama'
  end

  result
end
```

### Türler (Types)

Ruby betiği fonksiyonuna iletilen türler ve `ProviderResponse` dönüş türü şu şekilde tanımlanmıştır:

```ruby
# ProviderOptions
{
  'id' => String (isteğe bağlı),
  'config' => Hash (isteğe bağlı)
}

# CallApiContextParams
{
  'vars' => Hash[String, String],
  'prompt' => Hash (isteğe bağlı),       # İstem şablonu (raw, label, config)
  'test' => Hash (isteğe bağlı),         # Meta veriler dahil tam test vakası
}

# TokenUsage
{
  'total' => Integer,
  'prompt' => Integer,
  'completion' => Integer
}

# ProviderResponse
{
  'output' => String veya Hash (isteğe bağlı),
  'error' => String (isteğe bağlı),
  'tokenUsage' => TokenUsage (isteğe bağlı),
  'cost' => Float (isteğe bağlı),
  'cached' => Boolean (isteğe bağlı),
  'logProbs' => Array[Float] (isteğe bağlı),
  'metadata' => Hash (isteğe bağlı)
}

# ProviderEmbeddingResponse
{
  'embedding' => Array[Float],
  'tokenUsage' => TokenUsage (isteğe bağlı),
  'cached' => Boolean (isteğe bağlı)
}

# ProviderClassificationResponse
{
  'classification' => Hash,
  'tokenUsage' => TokenUsage (isteğe bağlı),
  'cached' => Boolean (isteğe bağlı)
}
```

:::tip

Hata oluştuğunda boş bir dize olsa bile yanıtınıza her zaman `output` alanını dahil edin.

:::

## Tam Örnekler

### Örnek 1: OpenAI Uyumlu Sağlayıcı

```ruby
# openai_provider.rb
require 'json'
require 'net/http'
require 'uri'

def call_api(prompt, options, context)
  # OpenAI API'sini çağıran sağlayıcı
  config = options['config'] || {}

  # Gerekirse mesajları ayrıştır
  begin
    messages = JSON.parse(prompt)
  rescue JSON::ParserError
    messages = [{ 'role' => 'user', 'content' => prompt }]
  end

  # API isteğini hazırla
  uri = URI.parse(config['base_url'] || 'https://api.openai.com/v1/chat/completions')
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Post.new(uri.path)
  request['Content-Type'] = 'application/json'
  request['Authorization'] = "Bearer #{ENV['OPENAI_API_KEY']}"

  request.body = JSON.generate({
    model: config['model'] || 'gpt-3.5-turbo',
    messages: messages,
    temperature: config['temperature'] || 0.7,
    max_tokens: config['max_tokens'] || 150
  })

  # API çağrısı yap
  begin
    response = http.request(request)
    data = JSON.parse(response.body)

    {
      'output' => data['choices'][0]['message']['content'],
      'tokenUsage' => {
        'total' => data['usage']['total_tokens'],
        'prompt' => data['usage']['prompt_tokens'],
        'completion' => data['usage']['completion_tokens']
      }
    }
  rescue StandardError => e
    {
      'output' => '',
      'error' => e.message
    }
  end
end
```

### Örnek 2: Test İçerikli Sahte (Mock) Sağlayıcı

```ruby
# mock_provider.rb
def call_api(prompt, options, context)
  # Değerlendirme hatlarını test etmek için sahte sağlayıcı
  config = options['config'] || {}

  # İşleme süresini simüle et
  delay = config['delay'] || 0.1
  sleep(delay)

  # Farklı yanıt türlerini simüle et
  if prompt.downcase.include?('error')
    return {
      'output' => '',
      'error' => 'Test için simüle edilmiş hata'
    }
  end

  # Sahte yanıt oluştur
  responses = config['responses'] || [
    'Bu sahte bir yanıttır.',
    'Sahte sağlayıcı doğru çalışıyor.',
    'Test yanıtı başarıyla oluşturuldu.'
  ]

  response = responses.sample
  mock_tokens = prompt.split.size + response.split.size

  {
    'output' => response,
    'tokenUsage' => {
      'total' => mock_tokens,
      'prompt' => prompt.split.size,
      'completion' => response.split.size
    },
    'cost' => mock_tokens * 0.00001
  }
end
```

### Örnek 3: Ön İşlemeli Yerel İşleme

```ruby
# text_processor.rb
def preprocess_prompt(prompt, context)
  # Context'e özel ön işleme ekle
  template = context['vars']['template'] || '{prompt}'
  template.gsub('{prompt}', prompt)
end

def call_api(prompt, options, context)
  # Özel ön işlemeli sağlayıcı
  config = options['config'] || {}

  # Ön işleme
  processed_prompt = preprocess_prompt(prompt, context)

  # İşlemeyi simüle et
  result = "İşlendi: #{processed_prompt.upcase}"

  {
    'output' => result,
    'cached' => false
  }
end
```

## Yapılandırma

### Temel Yapılandırma

```yaml
providers:
  - id: 'file://my_provider.rb'
    label: 'Özel Sağlayıcım' # İsteğe bağlı görünüm adı
    config:
      # Sağlayıcınızın ihtiyaç duyduğu herhangi bir yapılandırma
      api_key: '{{ env.CUSTOM_API_KEY }}'
      endpoint: https://api.example.com
      model_params:
        temperature: 0.7
        max_tokens: 100
```

### Harici Yapılandırma Dosyalarını Kullanma

Yapılandırmayı harici dosyalardan yükleyebilirsiniz:

```yaml
providers:
  - id: 'file://my_provider.rb'
    config:
      # Tüm yapılandırmayı JSON'dan yükle
      settings: file://config/model_settings.json

      # Belirli bir fonksiyonla YAML'dan yükle
      prompts: file://config/prompts.yaml

      # İç içe geçmiş dosya referansları
      models:
        primary: file://config/primary_model.json
        fallback: file://config/fallback_model.yaml
```

Desteklenen formatlar:

- **JSON** (`.json`) - Nesne/dizi olarak ayrıştırılır
- **YAML** (`.yaml`, `.yml`) - Nesne/dizi olarak ayrıştırılır
- **Metin** (`.txt`, `.md`) - Dize (string) olarak yüklenir

### Ortam Yapılandırması

#### Özel Ruby Yürütülebilir Dosyası

Özel bir Ruby yürütülebilir dosyasını birkaç şekilde belirtebilirsiniz:

**Seçenek 1: Sağlayıcı başına yapılandırma**

```yaml
providers:
  - id: 'file://my_provider.rb'
    config:
      rubyExecutable: /path/to/ruby
```

**Seçenek 2: Küresel ortam değişkeni**

```bash
# Belirli bir Ruby sürümünü küresel olarak kullan
export PROMPTFOO_RUBY=/usr/local/bin/ruby
npx promptfoo@latest eval
```

#### Ruby Algılama Süreci

Promptfoo, Ruby kurulumunuzu şu öncelik sırasına göre otomatik olarak algılar:

1. **Ortam değişkeni**: `PROMPTFOO_RUBY` (ayarlanmışsa)
2. **Sağlayıcı yapılandırması**: Yapılandırmanızdaki `rubyExecutable`
3. **Windows algılama**: `where ruby` kullanır (sadece Windows)
4. **Akıllı algılama**: Gerçek Ruby yolunu bulmak için `ruby -e "puts RbConfig.ruby"` kullanır
5. **Yedek (fallback) komutlar**:
   - Windows: `ruby`
   - macOS/Linux: `ruby`

## Gelişmiş Özellikler

### Özel Fonksiyon İsimleri

Varsayılan fonksiyon ismini geçersiz kılın:

```yaml
providers:
  - id: 'file://my_provider.rb:generate_response'
    config:
      model: 'custom-model'
```

```ruby
# my_provider.rb
def generate_response(prompt, options, context)
  # Özel fonksiyonunuz
  { 'output' => 'Özel yanıt' }
end
```

### Farklı Giriş Türlerini Yönetme

```ruby
require 'json'

def call_api(prompt, options, context)
  # Çeşitli istem formatlarını yönet

  # Metin istemi
  if prompt.is_a?(String)
    begin
      # JSON olarak ayrıştırmayı dene
      data = JSON.parse(prompt)
      if data.is_a?(Array)
        # Sohbet formatı
        return handle_chat(data, options)
      elsif data.is_a?(Hash)
        # Yapılandırılmış istem
        return handle_structured(data, options)
      end
    rescue JSON::ParserError
      # Düz metin
      return handle_text(prompt, options)
    end
  end
end
```

### Koruma Kalkanları (Guardrails) Uygulama

```ruby
def call_api(prompt, options, context)
  # Güvenlik koruma kalkanları olan sağlayıcı
  config = options['config'] || {}

  # Yasaklanmış içeriği kontrol et
  prohibited_terms = config['prohibited_terms'] || []
  prohibited_terms.each do |term|
    if prompt.downcase.include?(term.downcase)
      return {
        'output' => 'Bu isteği işleyemiyorum.',
        'guardrails' => {
          'flagged' => true,
          'reason' => 'Yasaklanmış içerik saptandı'
        }
      }
    end
  end

  # Normal şekilde işle
  result = generate_response(prompt)

  # İşlem sonrası kontroller
  if check_output_safety(result)
    { 'output' => result }
  else
    {
      'output' => '[İçerik filtrelendi]',
      'guardrails' => { 'flagged' => true }
    }
  end
end
```

## Sorun Giderme

### Yaygın Sorunlar ve Çözümleri

| Sorun                         | Çözüm                                                                |
| ----------------------------- | -------------------------------------------------------------------- |
| "Ruby not found" hataları     | `PROMPTFOO_RUBY` ortam değişkenini ayarlayın veya yapılandırmada `rubyExecutable` kullanın |
| "cannot load such file" hataları | Gerekli gem'lerin `gem install` ile kurulu olduğundan emin olun veya bundler kullanın |
| Betik yürütülmüyor            | Dosya yolunun `promptfooconfig.yaml` dosyasına göre göreli olduğunu kontrol edin |
| Çıktı görünmüyor              | Yazdırılan ifadeleri görmek için `LOG_LEVEL=debug` kullanın            |
| JSON ayrıştırma hataları      | İstem formatının ayrıştırma mantığınızla eşleştiğinden emin olun |
| Zaman aşımı hataları          | Başlatma kodunu optimize edin, kaynakları bir kez yükleyin           |

### Hata Ayıklama İpuçları

1. **Hata ayıklama günlüğünü etkinleştirin:**

   ```bash
   LOG_LEVEL=debug npx promptfoo@latest eval
   ```

2. **Sağlayıcınıza günlük tutma (logging) ekleyin:**

   ```ruby
   def call_api(prompt, options, context)
     $stderr.puts "Alınan istem: #{prompt}"
     $stderr.puts "Yapılandırma: #{options['config'].inspect}"
     # Mantığınız burada
   end
   ```

3. **Sağlayıcınızı bağımsız olarak test edin:**

   ```ruby
   # test_provider.rb
   require_relative 'my_provider'

   result = call_api(
     'Test istemi',
     { 'config' => { 'model' => 'test' } },
     { 'vars' => {} }
   )
   puts result.inspect
   ```

## Göç (Migration) Kılavuzu

### HTTP Sağlayıcısından

Şu anda bir HTTP sağlayıcısı kullanıyorsanız, API çağrılarınızı sarmalayabilirsiniz:

```ruby
# http_wrapper.rb
require 'net/http'
require 'json'
require 'uri'

def call_api(prompt, options, context)
  config = options['config'] || {}
  uri = URI.parse(config['url'])

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = (uri.scheme == 'https')

  request = Net::HTTP::Post.new(uri.path)
  request['Content-Type'] = 'application/json'
  config['headers']&.each { |k, v| request[k] = v }
  request.body = JSON.generate({ 'prompt' => prompt })

  response = http.request(request)
  JSON.parse(response.body)
end
```

### Python Sağlayıcısından

Ruby sağlayıcısı, Python sağlayıcılarıyla aynı arayüzü takip eder:

```python
# Python
def call_api(prompt, options, context):
    return {"output": f"Yankı: {prompt}"}
```

```ruby
# Ruby eşdeğeri
def call_api(prompt, options, context)
  { 'output' => "Yankı: #{prompt}" }
end
```

## Ayrıca Bakınız

- [Özel iddialar](/docs/configuration/expected-outputs/) - Beklenen çıktıları ve doğrulama kurallarını tanımlayın
- [Python Sağlayıcısı](/docs/providers/python) - Python için benzer betik sağlayıcısı
- [Özel Betik Sağlayıcısı](/docs/providers/custom-script) - JavaScript/TypeScript sağlayıcı alternatifi
