---
sidebar_position: 1
sidebar_label: Kılavuz
title: Yapılandırma Kılavuzu - Promptfoo ile Başlayın
description: promptfoo'yu LLM değerlendirmesi için yapılandırma konusunda eksiksiz kılavuz. İstemler, sağlayıcılar, test durumları, iddialar ve ileri özellikler örnekler ile öğren.
keywords:
  [
    promptfoo yapılandırması,
    LLM değerlendirme kurulumu,
    istem testi,
    AI modeli karşılaştırması,
    değerlendirme çerçevesi,
    başlangıç,
  ]
pagination_next: configuration/reference
---

# Yapılandırma

YAML yapılandırma formatı, her istemi bir dizi örnek girdi (aka "test durumu") aracılığıyla çalıştırır ve gereksinimler (aka "iddialar") karşılayıp karşılamadığını kontrol eder.

İddiaları _isteğe bağlıdır_. Birçok kişi çıktıları manuel olarak incelemekten ve web kullanıcı arayüzünün bunu kolaylaştırmasından faydalanır.

## Örnek

Dil çevirisi yapan bir uygulama geliştirdiğimizi düşünelim. Bu yapılandırma her istemi GPT-4.1 ve Gemini aracılığıyla çalıştırarak `language` ve `input` değişkenlerini değiştiriyor:

```yaml
prompts:
  - file://prompt1.txt
  - file://prompt2.txt
providers:
  - openai:gpt-5-mini
  - vertex:gemini-2.0-flash-exp
tests:
  - vars:
      language: French
      input: Hello world
  - vars:
      language: German
      input: How's it going?
```

:::tip

İstem dosyasını ayarlama hakkında daha fazla bilgi için bkz. [giriş ve çıkış dosyaları](/docs/configuration/prompts).

:::

`promptfoo eval` komutunu bu yapılandırma üzerinde çalıştırmak, GPT'yi Gemini ile değerlendirmek için kullanabileceğiniz bir _matrix view_ (matris görünümü) sonucu verecektir.

## Çıktıyı doğrulamak için iddialar kullanın

İleri gidelim ve bir iddia ekleyelim. Bu otomatik olarak JSON içermeyen çıktıları reddeder:

```yaml
prompts:
  - file://prompt1.txt
  - file://prompt2.txt
providers:
  - openai:gpt-5-mini
  - vertex:gemini-2.0-flash-exp
tests:
  - vars:
      language: French
      input: Hello world
    // highlight-start
    assert:
      - type: contains-json
    // highlight-end
  - vars:
      language: German
      input: How's it going?
```

Ek testler oluşturabiliriz. [İddiaların diğer türlerini](/docs/configuration/expected-outputs) ekleyelim. Tüm koşulların karşılanmasını sağlamak için tek bir test durumu için iddia dizisini kullanın.

Bu örnekte, `javascript` iddiası LLM çıktısına karşı Javascript çalıştırır. `similar` iddiası embedding'leri kullanarak anlamsal benzerliği kontrol eder:

```yaml
prompts:
  - file://prompt1.txt
  - file://prompt2.txt
providers:
  - openai:gpt-5-mini
  - vertex:gemini-2.0-flash-exp
tests:
  - vars:
      language: French
      input: Hello world
    assert:
      - type: contains-json
      // highlight-start
      - type: javascript
        value: output.toLowerCase().includes('bonjour')
      // highlight-end
  - vars:
      language: German
      input: How's it going?
    assert:
      // highlight-start
      - type: similar
        value: was geht
        threshold: 0.6   # cosine similarity
      // highlight-end
```

:::tip
İddiaları yapılandırma hakkında daha fazla bilgi edinmek için bkz. [iddialar ve metrikler](/docs/configuration/expected-outputs) belgeleri.
:::

## Sağlayıcıları ayrı dosyalardan içe aktarın

`providers` yapılandırma özelliği, bir dosya listesini gösterebilir. Örneğin:

```yaml
providers:
  - file://path/to/provider1.yaml
  - file://path/to/provider2.json
```

Sağlayıcı dosyası şöyle görünür:

```yaml
id: openai:gpt-5-mini
label: Foo bar
config:
  temperature: 0.9
```

## Testleri ayrı dosyalardan içe aktarın

`tests` yapılandırma özelliği, dosya veya dizinlere bir yol listesi alır. Örneğin:

```yaml
prompts: file://prompts.txt
providers: openai:gpt-5-mini

# Load & runs all test cases matching these filepaths
tests:
  # You can supply an exact filepath
  - file://tests/tests2.yaml

  # Or a glob (wildcard)
  - file://tests/*

  # Mix and match with actual test cases
  - vars:
      var1: foo
      var2: bar
```

Tek bir string de geçerlidir:

```yaml
tests: file://tests/*
```

Veya bir yol listesi:

```yaml
tests:
  - file://tests/accuracy
  - file://tests/creativity
  - file://tests/hallucination
```

:::tip
Test dosyaları YAML/JSON, JSONL, [CSV](/docs/configuration/test-cases#csv-format) ve TypeScript/JavaScript'te tanımlanabilir. Ayrıca [Google Sheets](/docs/integrations/google-sheets) CSV veri setlerini de destekliyoruz.
:::

## Değişkenleri ayrı dosyalardan içe aktarın

`vars` özelliği bir dosya veya dizini gösterebilir. Örneğin:

```yaml
tests:
  - vars: file://path/to/vars*.yaml
```

Ayrıca dosyadan bireysel değişkenleri `file://` öneki kullanarak yükleyebilirsiniz. Örneğin:

```yaml
tests:
  - vars:
      var1: some value...
      var2: another value...
      var3: file://path/to/var3.txt
```

Javascript ve Python değişken dosyaları desteklenir. Örneğin:

```yaml
tests:
  - vars:
      context: file://fetch_from_vector_database.py
```

Komut dosyalı değişkenler, Pinecone, Chroma, Milvus gibi vektör veritabanlarını test ederken yararlıdır. Ihtiyacınız olan bağlamı almak için doğrudan veritabanıyla iletişim kurabilirsiniz.

PDF'ler de desteklenir ve bir belgeden metin çıkarmak için kullanılabilir:

```yaml
tests:
  - vars:
      paper: file://pdfs/arxiv_1.pdf
```

PDF'leri değişken olarak kullanmak için `pdf-parse` paketini yüklemeniz gerektiğini unutmayın:

```
npm install pdf-parse
```

### Javascript değişkenleri

Bir JavaScript dosyasından dinamik olarak bir değişken yüklemek için YAML yapılandırmanuzda `file://` öneki kullanın, bir işın veya fonksiyonu dışa aktan bir JavaScript dosyasına gösterileyin.

```yaml
tests:
  - vars:
      context: file://path/to/dynamicVarGenerator.js
```

Fonksiyon, arguman olarak `varName`, `prompt`, `otherVars` ve `provider` alır:

```js title="dynamicVarGenerator.js"
module.exports = async function (varName, prompt, otherVars, provider) {
  // Access other variables from the test case
  const role = otherVars.role;

  // Return the dynamic value
  return { output: PROMPTS[role] };

  // Or return an error
  // return { error: 'Something went wrong' };
};
```

Komple bir çalışan örnek için [dynamic-var example](https://github.com/promptfoo/promptfoo/tree/main/examples/dynamic-var) adresine bakın.

### Python değişkenleri

`var_name`, `prompt` ve `other_vars` kabul eden bir `get_var` fonksiyonu tanımlayın:

```yaml
tests:
  - vars:
      context: file://load_context.py
```

```python title="load_context.py"
def get_var(var_name, prompt, other_vars):
    # Access other variables from the test case
    role = other_vars.get("role")

    # Return the dynamic value
    return {"output": PROMPTS[role]}

    # Or return an error
    # return {"error": "Something went wrong"}
```

## Tekrarı önlemek

### Varsayılan test durumları

Tüm testler için özellikleri ayarlamak için `defaultTest` kullanın.

Bu örnekte, LLM'in kendisini bir AI olarak adlandırmadığını sağlamak için bir `llm-rubric` iddiası kullanıyoruz. Bu kontrol tüm test durumlarına uygulanır:

```yaml
prompts:
  - file://prompt1.txt
  - file://prompt2.txt
providers:
  - openai:gpt-5-mini
  - vertex:gemini-2.0-flash-exp
// highlight-start
defaultTest:
  assert:
    - type: llm-rubric
      value: does not describe self as an AI, model, or chatbot
// highlight-end
tests:
  - vars:
      language: French
      input: Hello world
    assert:
      - type: contains-json
      - type: javascript
        value: output.toLowerCase().includes('bonjour')
  - vars:
      language: German
      input: How's it going?
    assert:
      - type: similar
        value: was geht
        threshold: 0.6
```

Ayrıca her test için kullanılan modeli geçersiz kılmak için `defaultTest`'i kullanabilirsiniz. Bu, [model-graded evals](/docs/configuration/expected-outputs/model-graded) için yararlı olabilir:

```yaml
defaultTest:
  options:
    provider: openai:gpt-5-mini-0613
```

### Varsayılan değişkenler

Tüm testler arasında paylaşılan değişkenleri tanımlamak için `defaultTest`'i kullanın:

```yaml
defaultTest:
  vars:
    template: 'A reusable prompt template with {{shared_var}}'
    shared_var: 'some shared content'

tests:
  - vars:
      unique_var: value1
  - vars:
      unique_var: value2
      shared_var: 'override shared content' # Optionally override defaults
```

### Dış dosyalardan defaultTest yükleme

Projeler arasında test yapılandırmalarını paylaşmak için `defaultTest: file://path/to/config.yaml` kullanarak dış dosyalardan `defaultTest` yapılandırmasını yükleyebilirsiniz.

### YAML referansları

promptfoo yapılandırmaları yeniden kullanılabilir blokları tanımlayan JSON schema [referanslarını](https://opis.io/json-schema/2.x/references.html) destekler.

İddiaları birden fazla kez tam olarak tanımlamak zorunda kalmadan yeniden kullanmak için `$ref` anahtarını kullanın. İşte bir örnek:

```yaml
prompts:
  - file://prompt1.txt
  - file://prompt2.txt
providers:
  - openai:gpt-5-mini
  - vertex:gemini-2.0-flash-exp
tests:
  - vars:
      language: French
      input: Hello world
    assert:
      - $ref: '#/assertionTemplates/startsUpperCase'
  - vars:
      language: German
      input: How's it going?
    assert:
      - $ref: '#/assertionTemplates/noAIreference'
      - $ref: '#/assertionTemplates/startsUpperCase'

// highlight-start
assertionTemplates:
    noAIreference:
      type: llm-rubric
      value: does not describe self as an AI, model, or chatbot
    startsUpperCase:
      type: javascript
      value: output[0] === output[0].toUpperCase()
// highlight-end
```

:::info
Sağlayıcı yapılandırmasındaki `tools` ve `functions` değerleri dereferenceılenmiyor. Bunun nedeni, kendi iç bağlantılarında bulunabilecek bağımsız JSON şemaları olmalarıdır.
:::

## Tek bir test durumunda birden fazla değişken

Test'teki `vars` haritası dizi değerlerini de destekler. Değerler bir diziyse, test durumu değerlerin her kombinasyonunu çalıştırır.

For example:

```yaml
prompts: file://prompts.txt
providers:
  - openai:gpt-5-mini
  - openai:gpt-5
tests:
  - vars:
      // highlight-start
      language:
        - French
        - German
        - Spanish
      input:
        - 'Hello world'
        - 'Good morning'
        - 'How are you?'
      // highlight-end
    assert:
      - type: similar
        value: 'Hello world'
        threshold: 0.8
```

Her `language` x `input` kombinasyonunu değerlendiri:

<img alt="Multiple combinations of var inputs" src="https://user-images.githubusercontent.com/310310/243108917-dab27ca5-689b-4843-bb52-de8d459d783b.png" />

Vars can also be imported from globbed filepaths. They are automatically expanded into an array. For example:

```yaml
  - vars:
      language:
        - French
        - German
        - Spanish
      // highlight-start
      input: file://path/to/inputs/*.txt
      // highlight-end
```

## Nunjucks şablonları kullanma

İstem şablonlarınız üzerinde ek kontrol sağlamak için Nunjucks şablonlarını kullanın; döngüler, koşullar ve daha fazlasını içerir.

### Nesneleri işleme

Yukarıdaki örneklerde, `vars` değerleri string'dir. Ancak `vars`, iç içe nesneler de dahil olmak üzere herhangi bir JSON veya YAML varlığı olabilir. Bu nesneleri istemde [nunjucks](https://mozilla.github.io/nunjucks/) şablonları olan istemde işleyebilirsiniz:

promptfooconfig.yaml:

```yaml
tests:
  - vars:
      user_profile:
        name: John Doe
        interests:
          - reading
          - gaming
          - hiking
      recent_activity:
        type: reading
        details:
          title: 'The Great Gatsby'
          author: 'F. Scott Fitzgerald'
```

prompt.txt:

```liquid
User Profile:
- Name: {{ user_profile.name }}
- Interests: {{ user_profile.interests | join(', ') }}
- Recent Activity: {{ recent_activity.type }} on "{{ recent_activity.details.title }}" by {{ recent_activity.details.author }}

Based on the above user profile, generate a personalized reading recommendation list that includes books similar to "{{ recent_activity.details.title }}" and aligns with the user's interests.
```

İşte bir başka örnek. Bir OpenAI uyumlu formatında bir avuç kullanıcı ve asistan iletisiyle bir test durumu düşünün:

```yaml
tests:
  - vars:
      previous_messages:
        - role: user
          content: hello world
        - role: assistant
          content: how are you?
        - role: user
          content: great, thanks
```

Uygun `prompt.txt` dosyası, `previous_messages` nesnesini [dump](https://mozilla.github.io/nunjucks/templating.html#dump) filtresi kullanarak JSON dizesine dönüştürmek için geçiş yapı yardımcısı kullanır:

```nunjucks
{{ previous_messages | dump }}
```

`promptfoo eval -p prompt.txt -c path_to.yaml` komutunu çalıştırmak, Chat Completion API'sini aşağıdaki istemle çağıracaktır:

```json
[
  {
    "role": "user",
    "content": "hello world"
  },
  {
    "role": "assistant",
    "content": "how are you?"
  },
  {
    "role": "user",
    "content": "great, thanks"
  }
]
```

### JSON dizelerini kaçırma

İstem geçerli JSON ise, nunjucks değişkenleri dizelere eklendiğinde otomatik olarak kaçırılır:

```yaml
tests:
  - vars:
      system_message: >
        This multiline "system message" with quotes...
        Is automatically escaped in JSON prompts!
```

```json
{
  "role": "system",
  "content": "{{ system_message }}"
}
```

Ayrıca nunjucks [dump](https://mozilla.github.io/nunjucks/templating.html#dump) filtresini kullanarak dizesini manuel olarak kaçırabilirsiniz. İstem geçerli JSON değilse, örneğin nunjucks söz dizimini kullanıyorsanız bu gereklidir:

```liquid
{
  "role": {% if 'admin' in message %} "system" {% else %} "user" {% endif %},
  "content": {{ message | dump }}
}
```

### Değişken bestesi

Değişkenler diğer değişkenlere başvurabilir:

```yaml
prompts:
  - 'Write a {{item}}'

tests:
  - vars:
      item: 'tweet about {{topic}}'
      topic: 'bananas'

  - vars:
      item: 'instagram about {{topic}}'
      topic: 'theoretical quantum physics in alternate dimensions'
```

### Ortam değişkenlerine erişim

Şablonlarınızda `env` global'ını kullırarak ortam değişkenlerine erişebilirsiniz:

```yaml
prompts:
  - 'file://{{ env.PROMPT_DIR }}/prompt.txt'

tests:
  - vars:
      headline: 'Articles about {{ env.TOPIC }}'
```

Ortam değişkenleri yapılandırma yükleme zamanında (çalışma zamanında değil) çözülür ve dosya yollarını ve API anahtarlarını kontrol edebilir—onları yalnızca güvenilen ortamlarda kullanın.

:::warning

`ANTHROPIC_API_KEY: '{{ env.ANTHROPIC_API_KEY }}'` gibi şablonlarıyla `config.env`'ye sırları kopyalamaktan kaçının. Bu, sırrı eval yapılandırma nesnesine çözer ve dışa aktarılan sonuçlarda görünebilir.

Bir sır zaten kabuk ortamınızda mevcutsa (veya `--env-file` aracılığıyla yüklenirse), doğrudan işlem ortamından okurmayı tercih edin ve `config.env`'yi hassas olmayan bayraklar için tutun.

:::

## Araçlar ve İşlevler

promptfoo, Google, OpenAI ve Anthropic modelleriyle araç kullanımı ve işlev çağrısını destekler; sıcaklık ve token sayısı gibi diğer sağlayıcıya özel yapılandırmalara ek olarak. İşlevleri ve araçları tanımlama hakkında daha fazla bilgi için bkz. [Google Vertex sağlayıcı belgeler](/docs/providers/vertex/#function-calling-and-tools), [Google AIStudio sağlayıcı belgeler](/docs/providers/google/#tool-calling), [Google Live sağlayıcı belgeler](/docs/providers/google#function-calling-example), [OpenAI sağlayıcı belgeler](/docs/providers/openai#using-tools) ve [Anthropic sağlayıcı belgeler](/docs/providers/anthropic#tool-calling).

## Düşünme Çıkışı

Anthropic's Claude ve DeepSeek gibi bazı modeller, modelin son bir cevap vermeden önce akıl yürütme sürecini göstermesine izin veren düşünme/akıl yürütme yeteneklerini destekler.

Bu, akıl yürütme görevleri için veya modelin nasıl bir sonuca ulaştığını anlamak için yararlıdır.

### Düşünme Çıkışını Kontrol Etme

Varsayılan olarak, düşünme içeriği yanıta dahil edilir. `showThinking`'i `false`'a ayarlayarak bunu gizleyebilirsiniz.

Örneğin, Claude için:

```yaml
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      thinking:
        type: 'enabled'
        budget_tokens: 16000
      showThinking: false # Düşünme içeriğini çıktıdan hariç tut
```

Bu, daha iyi akıl yürütme istediğinizde ancak düşünme sürecini iddialarınıza göstermek istemediğinizde yararlıdır.

Genişletilmiş düşünme yetenekleri hakkında daha fazla ayrıntı için bkz. [Anthropic sağlayıcı belgeler](/docs/providers/anthropic#extended-thinking) ve [AWS Bedrock sağlayıcı belgeler](/docs/providers/aws-bedrock#claude-models).

## Çıktıları dönüştürme

Dönüştürmeler, değerlendirme işlem hattının birden fazla seviyesinde uygulanabilir:

### Dönüşüm yürütme sırası

1. **Sağlayıcı dönüştürmeleri** (`transformResponse`) - Her zaman ilk uygulanır
2. **Test dönüştürmeleri** (`options.transform`) ve **Bağlam dönüştürmeleri** (`contextTransform`)
   - Her ikisi de sağlayıcı dönüşümünden çıktı alır
   - Test dönüştürmeleri, çıktıyı iddialar için değiştir
   - Bağlam dönüştürmeleri, bağlam tabanlı iddialar (örn. `context-faithfulness`) için bağlamları çıkarır

### Test dönüştürme hiyerarşisi

Test dönüştürmeleri özellikle için:

1. Varsayılan test dönüştürmeleri (eğer `defaultTest`'te belirtilmişse)
2. Bireysel test case dönüştürmeleri (`defaultTest` dönüşümünü geçersiz kılar, varsa)

Yalnızca bir dönüşümün test duruşu seviyesinde uygulanacağını unutmayın - `defaultTest`'ten veya bireysel test durumundan, both değil.

`TestCase.options.transform` alanı, test iddialarından önce LLM çıktısını değiştiren bir Javascript snippet'idir.

Bir dize çıktısı ve bağlam nesnesi alan bir işlevdir:

```typescript
transformFn: (output: string, context: {
  prompt: {
    // Kimliği atanmışsa, istemi kimliği.
    id?: string;
    // {{variable}} ikamesiz test durumunda sağlanan ham istem.
    raw?: string;
    // LLM API'sine ve iddialarına gönderilen istem.
    display?: string;
  };
  vars?: Record<string, any>;
  // Sağlayıcı yanıtında döndürülen meta veriler.
  metadata?: Record<string, any>;
}) => void;
```

Bir eval çalıştırmadan önce LLM çıktısını dönüştürmen veya temizlemen gerekirse bu yararlıdır.

Örneğin:

```yaml
# ...
tests:
  - vars:
      language: French
      body: Hello world
    options:
      // highlight-start
      transform: output.toUpperCase()
      // highlight-end
    # ...
```

Veya çok satırlı:

```yaml
# ...
tests:
  - vars:
      language: French
      body: Hello world
    options:
      // highlight-start
      transform: |
        output = output.replace(context.vars.language, 'foo');
        const words = output.split(' ').filter(x => !!x);
        return JSON.stringify(words);
      // highlight-end
    # ...
```

Ayrıca iddialar içinde çalışır; bu JSON'dan değerleri seçmek için yararlıdır:

```yaml
tests:
  - vars:
      # ...
    assert:
      - type: equals
        value: 'foo'
        transform: output.category # Çıktı json'dan 'category' anahtarını seç
```

:::tip
`defaultTest` test paketinizdeki her test durumuna dönüşüm seçeneğini uygulamak i\u00e7in kullan\u0131n.
:::

### Dosyalardan dönüşümler

Dönüştürme işlevleri, harici JavaScript veya Python dosyalarından yürütülebilir. İsteğe bağlı olarak kullanılacak bir işlev adı belirtebilirsiniz.

JavaScript için:

```yaml
defaultTest:
  options:
    transform: file://transform.js:customTransform
```

```js title="transform.js"
module.exports = {
  customTransform: (output, context) => {
    // context.vars, context.prompt
    return output.toUpperCase();
  },
};
```

Python için:

```yaml
defaultTest:
  options:
    transform: file://transform.py
```

```python title="transform.py"
def get_transform(output, context):
    # context['vars'], context['prompt']
    return output.upper()
```

Python dosyaları için işlev adı belirtilmemişse, `get_transform` değerine varsayılan olur. Özel bir Python işlevi kullanmak için dosya yolunda belirtin:

```yaml
transform: file://transform.py:custom_python_transform
```

## Giriş değişkenlerini dönüştürme

Ayrıca `transformVars` seçeneğini kullanarak giriş değişkenlerini isteminde kullanılmadan önce dönüştürebilirsiniz. Bu özellik, veri ön işleme veya harici kaynaklardan içerik yüklemeniz gerektiğinde yararlıdır.

`transformVars` işlevi, dönüştürülen değişken adları ve değerleriyle bir nesne döndürmelidir. Bu dönüştürülen değişkenler, `vars` nesnesine eklenir ve mevcut anahtarları geçersiz kılabilir. Örneğin:

```yaml
prompts:
  - 'Summarize the following text in {{topic_length}} words: {{processed_content}}'

defaultTest:
  options:
    transformVars: |
      return {
        uppercase_topic: vars.topic.toUpperCase(),
        topic_length: vars.topic.length,
        processed_content: vars.content.trim()
      };

tests:
  - vars:
      topic: 'climate change'
      content: '  This is some text about climate change that needs processing.  '
    assert:
      - type: contains
        value: '{{uppercase_topic}}'
```

Dönüştürme işlevleri, bireysel test durumları içinde de belirtilebilir.

```yaml
tests:
  - vars:
      url: 'https://example.com/image.png'
    options:
      transformVars: |
        return { ...vars, image_markdown: `![image](${vars.url})` }
```

### Dosyalardan giriş dönüştürmeleri

Daha karmaşık dönüştürmeler için `transformVars` için harici dosyaları kullanabilirsiniz:

```yaml
defaultTest:
  options:
    transformVars: file://transformVars.js:customTransformVars
```

```js title="transformVars.js"
const fs = require('fs');

module.exports = {
  customTransformVars: (vars, context) => {
    try {
      return {
        uppercase_topic: vars.topic.toUpperCase(),
        topic_length: vars.topic.length,
        file_content: fs.readFileSync(vars.file_path, 'utf-8'),
      };
    } catch (error) {
      console.error('Error in transformVars:', error);
      return {
        error: 'Failed to transform variables',
      };
    }
  },
};
```

Python'da da dönüştürmeler tanımlayabilirsiniz.

```yaml
defaultTest:
  options:
    transformVars: file://transform_vars.py
```

```python title="transform_vars.py"
import os

def get_transform(vars, context):
    with open(vars['file_path'], 'r') as file:
        file_content = file.read()

    return {
        'uppercase_topic': vars['topic'].upper(),
        'topic_length': len(vars['topic']),
        'file_content': file_content,
        'word_count': len(file_content.split())
    }
```

## Yapılandırma yapısı ve düzenleme

Yapılandırma yapısı hakkında detaylı bilgi için bkz. [Yapılandırma Referansı](/docs/configuration/reference).

Birden fazla test seti varsa, bunları birden fazla yapılandırma dosyasına bölmek yardımcı olur. Her bireysel yapılandırmayı çalıştırmak için `--config` veya `-c` parametresini kullanın:

```
promptfoo eval -c usecase1.yaml
```

ve

```
promptfoo eval -c usecase2.yaml
```

Birden fazla yapılandırmayı aynı anda çalıştırabilirsiniz; bunlar tek bir eval'de birleştirilecektir. Örneğin:

```
promptfoo eval -c my_configs/*
```

veya

```
promptfoo eval -c config1.yaml -c config2.yaml -c config3.yaml
```

## CSV'den testleri yükleme

YAML güzeldir, ancak bazı kuruluşlar işbirliğini kolaylaştırmak için LLM testlerini elektronik tablolarda tutar. promptfoo özel bir [CSV dosya biçimini](/docs/configuration/test-cases#csv-format) destekler.

```yaml
prompts:
  - file://prompt1.txt
  - file://prompt2.txt
providers:
  - openai:gpt-5-mini
  - vertex:gemini-2.0-flash-exp
// highlight-next-line
tests: file://tests.csv
```

promptfoo ayrıca Google Sheet'ten test durumları çekmek için yerleşik yeteneklere sahiptir. Başlamak için en kolay yol, sayfayı "bağlantısı olan herkes" e görünür yapmaktır. Örneğin:

```yaml
prompts:
  - file://prompt1.txt
  - file://prompt2.txt
providers:
  - openai:gpt-5-mini
  - vertex:gemini-2.0-flash-exp
// highlight-next-line
tests: https://docs.google.com/spreadsheets/d/1eqFnv1vzkPvS7zG-mYsqNDwOzvSaiIAsKB3zKg9H18c/edit?usp=sharing
```

[Tam örnek](https://github.com/promptfoo/promptfoo/tree/main/examples/google-sheets) burada yer almaktadır.

Promptfoo'yu özel bir elektronik tabloyu erişecek şekilde ayarlamak hakkında ayrıntılar için bkz. [Google Sheets entegrasyonu](/docs/integrations/google-sheets).