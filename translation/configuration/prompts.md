---
sidebar_position: 11
sidebar_label: İstemler
title: İstem Yapılandırması - Metin, Sohbet ve Dinamik İstemler
description: Metin istemler, sohbet konuşmaları, dosya tabanlı istemler ve değişkenlerle dinamik istem oluşturma dahil olmak üzere LLM değerlendirmesi için istemler yapılandırın.
keywords:
  [
    istem yapılandırması,
    LLM istemler,
    sohbet konuşmaları,
    dinamik istemler,
    şablon değişkenleri,
    istem mühendisliği,
  ]
pagination_prev: configuration/reference
pagination_next: configuration/test-cases
---

# İstem Yapılandırması

LLM'lerinize söylediklerinizi tanımlayın - basit dizelerden karmaşık çok turlu konuşmalara.

## Metin İstemler

İstemler tanımlamanın en basit yolu düz metin kullanmaktır:

```yaml title="promptfooconfig.yaml"
prompts:
  - 'Translate the following text to French: "{{text}}"'
  - 'Summarize this article: {{article}}'
```

### Çok Satırlı İstemler

Daha uzun istemler için YAML'ın çok satırlı sözdizimini kullanın:

```yaml title="promptfooconfig.yaml"
prompts:
  - |-
    You are a helpful assistant.

    Please answer the following question:
    {{question}}

    Provide a detailed explanation.
```

### Değişkenler ve Şablonlar

İstemler [Nunjucks](https://mozilla.github.io/nunjucks/) şablonlaması kullanır:

```yaml
prompts:
  - 'Hello {{name}}, welcome to {{company}}!'
  - 'Product: {{product | upper}}' # Using filters
  - '{% if premium %}Priority support: {% endif %}{{issue}}' # Conditionals
```

## Dosya Tabanlı İstemler

Daha iyi organizasyon için istemleri harici dosyalarda saklayın:

```yaml title="promptfooconfig.yaml"
prompts:
  - file://prompts/customer_service.txt
  - file://prompts/technical_support.txt
```

```txt title="prompts/customer_service.txt"
You are a friendly customer service representative for {{company}}.

Customer query: {{query}}

Please provide a helpful and professional response.
```

### Desteklenen Dosya Biçimleri

#### Metin Dosyaları (.txt)

Değişken değiştirme ile basit metin istemler.

#### Markdown Dosyaları (.md)

```markdown title="prompt.md"
# System Instructions

You are an AI assistant for {{company}}.

## Your Task

{{task}}
```

#### Jinja2 Şablonları (.j2)

```jinja title="prompt.j2"
You are assisting with {{ topic }}.
{% if advanced_mode %}
Provide technical details and code examples.
{% else %}
Keep explanations simple and clear.
{% endif %}
```

#### CSV Dosyaları (.csv)

Bir CSV dosyasında birden fazla istem tanımlayın:

```csv title="prompts.csv"
prompt,label
"Translate to French: {{text}}","French Translation"
"Translate to Spanish: {{text}}","Spanish Translation"
"Translate to German: {{text}}","German Translation"
```

### Bir Dosyada Birden Fazla İstem

Birden fazla istemi `---` ile ayırın:

```text title="prompts.txt"
Translate to French: {{text}}
---
Translate to Spanish: {{text}}
---
Translate to German: {{text}}
```

### Glob Kullanma

Glob desenleriyle birden fazla dosya yükleyin:

```yaml
prompts:
  - file://prompts/*.txt
  - file://scenarios/**/*.json
```

`path/to/prompts/**/*.py:func_name` gibi joker karakterler de desteklenmektedir.

## Sohbet Biçimi (JSON)

Sohbet tarzı etkileşimler için JSON biçimini kullanın:

```yaml title="promptfooconfig.yaml"
prompts:
  - file://chat_prompt.json
```

```json title="chat_prompt.json"
[
  {
    "role": "system",
    "content": "You are a helpful coding assistant."
  },
  {
    "role": "user",
    "content": "Write a function to {{task}}"
  }
]
```

### Çok Turlu Konuşmalar

```json title="conversation.json"
[
  {
    "role": "system",
    "content": "You are a tutoring assistant."
  },
  {
    "role": "user",
    "content": "What is recursion?"
  },
  {
    "role": "assistant",
    "content": "Recursion is a programming technique where a function calls itself."
  },
  {
    "role": "user",
    "content": "Can you show me an example in {{language}}?"
  }
]
```

## Dinamik İstemler (Fonksiyonlar)

Özel mantıkla istemler oluşturmak için JavaScript veya Python kullanın:

### JavaScript Fonksiyonları

```yaml title="promptfooconfig.yaml"
prompts:
  - file://generate_prompt.js
```

```javascript title="generate_prompt.js"
module.exports = async function ({ vars, provider }) {
  // Access variables and provider info
  const topic = vars.topic;
  const complexity = vars.complexity || 'medium';

  // Build prompt based on logic
  if (complexity === 'simple') {
    return `Explain ${topic} in simple terms.`;
  } else {
    return `Provide a detailed explanation of ${topic} with examples.`;
  }
};
```

### Python Fonksiyonları

```yaml title="promptfooconfig.yaml"
prompts:
  - file://generate_prompt.py:create_prompt
```

```python title="generate_prompt.py"
def create_prompt(context):
    vars = context['vars']
    provider = context['provider']

    # Dynamic prompt generation
    if vars.get('technical_audience'):
        return f"Provide a technical analysis of {vars['topic']}"
    else:
        return f"Explain {vars['topic']} for beginners"
```

### Yapılandırma ile Fonksiyon

Hem istem hem de sağlayıcı yapılandırması döndürün:

```javascript title="prompt_with_config.js"
module.exports = async function ({ vars }) {
  const complexity = vars.complexity || 'medium';

  return {
    prompt: `Analyze ${vars.topic}`,
    config: {
      temperature: complexity === 'creative' ? 0.9 : 0.3,
      max_tokens: complexity === 'detailed' ? 1000 : 200,
    },
  };
};
```

## Yürütülebilir Betikler

İstemler oluşturmak için dinamik olarak herhangi bir betiği veya ikilisini çalıştırın. Bu, mevcut araçlarınızı ve herhangi bir programlama dilini kullanmanıza olanak tanır.

Betik, test bağlamını birinci argümanda JSON olarak alır ve istemi stdout'a çıkarır.

### Kullanım

Açıkça yürütülebilir olarak işaretleyin:

```yaml title="promptfooconfig.yaml"
prompts:
  - exec:./generate-prompt.sh
  - exec:/usr/bin/my-prompt-tool
```

Veya betiğe doğrudan başvurun (`.sh`, `.bash`, `.rb`, `.pl` ve diğer yaygın betik uzantıları için otomatik olarak algılanır):

```yaml title="promptfooconfig.yaml"
prompts:
  - ./generate-prompt.sh
  - ./prompt_builder.rb
```

:::note
Python dosyaları (`.py`) yürütülebilir dosyalar değil, Python istem şablonları olarak işlenir. Bir Python betiğini yürütülebilir istem olarak çalıştırmak için `exec:` önekini kullanın: `exec:./generator.py`
:::

Gerekirse yapılandırma geçirin:

```yaml title="promptfooconfig.yaml"
prompts:
  - label: 'Technical Prompt'
    raw: exec:./generator.sh
    config:
      style: technical
      verbose: true
```

### Örnekler

Veritabanından okuyan kabuk betiği:

```bash title="fetch-context.sh"
#!/bin/bash
CONTEXT=$1
USER_ID=$(echo "$CONTEXT" | jq -r '.vars.user_id')

# Fetch user history from database
HISTORY=$(psql -h localhost -U myapp -t -v user_id="$USER_ID" -c \
  "SELECT prompt_context FROM users WHERE id = :'user_id'")

echo "Based on your previous interactions: $HISTORY

How can I help you today?"
```

Ruby betiği:

```ruby title="ab-test.rb"
#!/usr/bin/env ruby
require 'json'
require 'digest'

context = JSON.parse(ARGV[0])
user_id = context['vars']['user_id']

# Call LLM API here...
puts "\nUser query: #{context['vars']['query']}"
```

### Güvenlik Konuları

:::warning
Yürütülebilir betikler promptfoo sürecinin tam izinleriyle çalışır. Şunlara dikkat edin:

- **Kullanıcı Girişi**: Betikler kullanıcı tarafından kontrol edilen `vars`'ı JSON olarak alır. Bunları komutlarda kullanmadan önce her zaman doğrulayın ve temizleyin.
- **Güvenilmeyen Betikler**: Yalnızca güvenilir kaynaklardan gelen betikleri çalıştırın. Betikler dosyalara erişebilir, ağ çağrıları yapabilir ve komutları yürütebilir.
- **Ortam Erişimi**: Betikler API anahtarları da dahil olmak üzere ortam değişkenlerine erişebilir.
- **Zaman Aşımı**: Asılı kalan betikleri önlemek için `config.timeout` aracılığıyla bir zaman aşımı yapılandırın (varsayılan: 60 saniye).
  :::

### Kullanım Zamanı

Bu yaklaşım, istem oluşturma için zaten betikleri kullanıyor olduğunuzda, harici sistemleri (veritabanları, API'ler) sorgulamanız gerektiğinde veya JavaScript veya Python dışındaki dillerde yazılmış kodu yeniden kullanmak istediğinizde iyi çalışır.

Betikler herhangi bir dilde - Bash, Go, Rust veya hatta derlenmiş ikili dosyalar - argv'den JSON okuduğu ve stdout'a yazdığı sürece yazılabilir.

Python ve Javascript için özel işleyicilerin bulunduğunu unutmayın (yukarıda bakın).

## Model Spesifik İstemler

Farklı sağlayıcılar için farklı istemler:

```yaml title="promptfooconfig.yaml"
prompts:
  - id: file://prompts/gpt_prompt.json
    label: gpt_prompt
  - id: file://prompts/claude_prompt.txt
    label: claude_prompt

providers:
  - id: openai:gpt-4
    prompts: [gpt_prompt]
  - id: anthropic:claude-3
    prompts: [claude_prompt]
```

İstem filtreleri etiketlerle tam olarak eşleşir, grup önekleri destekler (örneğin `group`, `group:...` ile eşleşir) ve `group:*` gibi joker karakterli öneklere izin verir.

`prompts` alanı, sağlayıcılar harici dosyalarda tanımlandığında da çalışır (`file://provider.yaml`).

## Harici İstem Yönetim Sistemleri

Promptfoo, harici istem yönetim platformlarıyla entegre olur ve istemlerinizi merkezi hale getirmenize ve sürüm kontrolü yapmanıza olanak tanır:

### Langfuse

[Langfuse](/docs/integrations/langfuse), işbirliğine dayalı istem yönetimiyle açık kaynaklı bir LLM mühendisliği platformudur:

```yaml
prompts:
  # Reference by version (numeric values)
  - langfuse://my-prompt:3:text
  - langfuse://chat-prompt:1:chat

  # Reference by label using @ syntax (recommended for clarity)
  - langfuse://my-prompt@production
  - langfuse://chat-prompt@staging:chat
  - langfuse://email-template@latest:text

  # Reference by label using : syntax (auto-detected strings)
  - langfuse://my-prompt:production # String detected as label
  - langfuse://chat-prompt:staging:chat # String detected as label
```

### Portkey

[Portkey](/docs/integrations/portkey), istem yönetimi yetenekleriyle AI gözlemlenebilirliği sağlar:

```yaml
prompts:
  - portkey://pp-customer-support-v2
  - portkey://pp-email-generator-prod
```

### Helicone

[Helicone](/docs/integrations/helicone), gözlemlenebilirlik özelliklerinin yanı sıra istem yönetimi sunar:

```yaml
prompts:
  - helicone://greeting-prompt:1.0
  - helicone://support-chat:2.5
```

Test durumlarınızdaki değişkenler otomatik olarak bu harici istemler geçirilir.

## Gelişmiş Özellikler

### Özel Nunjucks Filtreleri

İstem işleme için özel filtreler oluşturun:

```js title="uppercase_first.js"
module.exports = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
```

```yaml title="promptfooconfig.yaml"
nunjucksFilters:
  uppercaseFirst: ./uppercase_first.js

prompts:
  - 'Dear {{ name | uppercaseFirst }}, {{ message }}'
```

### İstem Etiketleri ve Kimlikler

İstemle etiketleri organize edin:

```yaml
prompts:
  - id: file://customer_prompt.txt
    label: 'Customer Service'
  - id: file://technical_prompt.txt
    label: 'Technical Support'
```

### Varsayılan İstem

Hiçbir istem belirtilmezse, promptfoo `{{prompt}}`'i bir geçiş olarak kullanır.

## En İyi Uygulamalar

1. **Basit Başlayın**: Temel durumlar için satır içi metni kullanın
2. **Karmaşık İstemler Organize Edin**: Daha uzun istemler dosyalara taşıyın
3. **Sürüm Kontrolü Kullanın**: İstem dosyalarını Git'te takip edin
4. **Şablonlardan Yararlanın**: Yeniden kullanılabilir istemler için değişkenler kullanın
5. **Varyasyonları Test Edin**: Performansı karşılaştırmak için birden fazla sürüm oluşturun

## Yaygın Desenler

### Sistem + Kullanıcı Mesajı

```json
[
  { "role": "system", "content": "You are {{role}}" },
  { "role": "user", "content": "{{query}}" }
]
```

### Az Atışlı Örnekler

```yaml
prompts:
  - |-
    Classify the sentiment:

    Text: "I love this!" → Positive
    Text: "This is terrible" → Negative
    Text: "{{text}}" →
```

### Düşünce Zinciri

```yaml
prompts:
  - |-
    Question: {{question}}

    Let's think step by step:
    1. First, identify what we know
    2. Then, determine what we need to find
    3. Finally, solve the problem

    Answer:
```

## Son İstemler Görüntüleme

Son oluşturulmuş istemler görmek için:

1. `promptfoo view` komutunu çalıştırın
2. **Tablo Ayarları** > **Çıkış hücresinde tam istemi göster** seçeneğini etkinleştirin

Bu, değişken değiştirmeden sonra her sağlayıcıya tam olarak gönderilen belirtileri gösterir.