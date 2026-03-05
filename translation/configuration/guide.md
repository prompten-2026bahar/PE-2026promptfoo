---
sidebar_position: 1
sidebar_label: Kılavuz
title: Yapılandırma Kılavuzu - Promptfoo'ya Başlangıç
description: Promptfoo'yu LLM değerlendirmesi için yapılandırmak için eksiksiz kılavuz. İstemler, sağlayıcılar, test durumları, iddialar ve örnekleriyle gelişmiş özellikleri öğrenin.
keywords:
  [
    promptfoo yapılandırması,
    LLM değerlendirme kurulumu,
    istem testi,
    yapay zeka modeli karşilaştırması,
    değerlendirme çerçevesi,
    başlangıç,
  ]
pagination_next: configuration/reference
---

# Yapılandırma

YAML yapılandırma biçimi, her istemi bir dizi örnek girişi ("İstem durumu" öğesi olarak da adlandırılır) aracılığından çalıştırır ve bunların gereksinimler ("İddialıar" öğesi olarak da adlandırılır) karoşı olup olmadığını kontrol eder.

İddialar _istenel_. Birçok kişi çıktıları manuel olarak gözden geçirerek değer elde eder ve web ara yüzü bunu kolaylaştırır.

## Örnek

Bir dil çevirisi yapan bir uygulama yapıyor olduğumuzu hayal edelim. Bu yapılandırma, her istemi GPT-4.1 ve Gemini’den geçirir ve `language` ve `input` değişkenlerini değiştirir:

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

Bu yapılandırma üzerine `promptfoo eval` çalıştırmak, GPT ve Gemini'nin değerlendirmesi için kullanabileceğiniz bir _matris görünümü_ ile sonuçlanacaktır.

## Çıktıyı doğrulamak için iddiaları kullanın

Sıradı, bir iddianın eklenmesine geldi. Bu, JSON içermeyen herhangi bir çıktıyı otomatik olarak reddeder:

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

Ek testler oluşturabiliriz. Başka bir [iddialıar türü](/docs/configuration/expected-outputs) ekleyelim. Tek bir test durumu için tüm koşulların karşılanmasını sağlamak için bir dizi iddialıar kullanın.

Bu örnekte, `javascript` iddialı LLM çıktısına karşı Javascript çalıştırır. `similar` iddialıar, yerleştirmeler kullanarak semantik benzerliği kontrol eder:

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
İddialar hakkında daha fazla bilgi öğrenmek için bkz. [iddialar ve metrikler](/docs/configuration/expected-outputs) havuzunda yapılandırma dokümantasyonu.
:::

## Ayrı dosyalardan sağlayıcıları içe aktarma

`providers` yapılandırma özelliği, dosya listesine işaret edebilir. Örneğin:

```yaml
providers:
  - file://path/to/provider1.yaml
  - file://path/to/provider2.json
```

Sağlayıcı dosyası şöyle gözükecektir:

```yaml
id: openai:gpt-5-mini
label: Foo bar
config:
  temperature: 0.9
```

## Testleri ayrı dosyalardan içe aktarma

`tests` yapılandırma özelliği, dosya veya dizin yollarının listesini alır. Örneğin:

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

Tek bir dize de geçerlidir:

```yaml
tests: file://tests/*
```

Veya yol listesi:

```yaml
tests:
  - file://tests/accuracy
  - file://tests/creativity
  - file://tests/hallucination
```

:::tip
Test dosyaları YAML/JSON, JSONL, [CSV](/docs/configuration/test-cases#csv-format) ve TypeScript/JavaScript’te tanımlanabilir. Ayrıca [Google Sheets](/docs/integrations/google-sheets) CSV veri setlerini destekleriz.
:::

## Ayrı dosyalardan vars'u içe aktarma

`vars` özelliği bir dosya veya dizine işaret edebilir. Örneğin:

```yaml
tests:
  - vars: file://path/to/vars*.yaml
```

`file://` öneki kullanarak dosyadan tek tek değişkenleri yükleyebilirsiniz. Örneğin:

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

Komut dosye değişkenleri, Pinecone, Chroma, Milvus vb. gibi vektör veritabanıları test ederken yararlıdır. İhtiyaç duyduğunuz bağlamı getirmek için veritabanı ile doğrudan iletişim kurabiliriz.

PDF'ler de desteklenir ve belgeden metin çıkarmak için kullanılabilir:

```yaml
tests:
  - vars:
      paper: file://pdfs/arxiv_1.pdf
```

PDF'leri değişken olarak kullanmak için `pdf-parse` paketi kurmanız gerektigini unutmayın:

```
npm install pdf-parse
```

### Javascript değişkenleri

Bir JavaScript dosyasından dinamik olarak bir değişkeni yüklemek için, YAML yapılandırmanızda `file://` öneki kullanın ve bir işlev dışa aktarın bir JavaScript dosyasına işaret edin.

```yaml
tests:
  - vars:
      context: file://path/to/dynamicVarGenerator.js
```

İşlev `varName`, `prompt`, `otherVars` ve `provider` öğeleri öğesi olarak alır:

```js title="dynamicVarGenerator.js"
module.exports = async function (varName, prompt, otherVars, provider) {
  // Test durumundan diğer değişkenlere erişin
  const role = otherVars.role;

  // Dinamik değeri döndür
  return { output: PROMPTS[role] };

  // Veya bir hata döndür
  // return { error: 'Something went wrong' };
};
```

[Dinamik-var örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/dynamic-var) için tam çalışan bir örneğe bakın.

### Python değişkenleri

`var_name`, `prompt` ve `other_vars` öğeleri kabul eden bir `get_var` işlevi tanımla:

```yaml
tests:
  - vars:
      context: file://load_context.py
```

```python title="load_context.py"
def get_var(var_name, prompt, other_vars):
    # Test durumundan diğer değişkenlere erişin
    role = other_vars.get("role")

    # Dinamik değeri döndür
    return {"output": PROMPTS[role]}

    # Veya bir hata döndür
    # return {"error": "Something went wrong"}
```

## Tekrarlamayı Önlemek

### Varsayılan Test Durumları

Tüm testler için özellikleri ayarlamak için `defaultTest`'i kullanın.

Bu örnekte, LLM'nin kendisine bir yapay zeka olarak atfetmemesini sağlamak için `llm-rubric` iddialı kullanırız. Bu kontrol tüm test durumlarına uygulanır:

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
      value: kendisini bir yapay zeka, model veya sohbet botu olarak tarif etmez
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

Her test için kullanılan modeli de geçersiz kılmak için `defaultTest` öğesini de kullanabilirsiniz. Bu, [model tarafından değerlendirilen değerlendirmeler](/docs/configuration/expected-outputs/model-graded) için yararlı olabilir:

```yaml
defaultTest:
  options:
    provider: openai:gpt-5-mini-0613
```

### Varsayılan Değişkenler

Tüm testler arasında paylaşılan değişkenleri tanımlamak için `defaultTest`'i kullanın:

```yaml
defaultTest:
  vars:
    template: 'Yeniden kullanılabilir {{shared_var}} ile bir istem şablonu'
    shared_var: 'paylaşılan içerik'

tests:
  - vars:
      unique_var: value1
  - vars:
      unique_var: value2
      shared_var: 'varsayılanları geçersiz kıl' # İsteğe bağlı olarak varsayılanları geçersiz kıl
```

### Dış Dosyalardan defaultTest Yükleme

Proje genelinde test yapılandırmaları paylaşmak için `defaultTest: file://path/to/config.yaml` kullanarak dış dosyalardan `defaultTest` yapılandırması yükleyebiliriniz.

### YAML Referansları

promptfoo yapılandırmaları, yeniden kullanılabilir blokları tanımlayan JSON şeması [referanslarını](https://opis.io/json-schema/2.x/references.html) destekler.

They iddialarını tam olarak birden fazla kez tanımlamak zorunda kalmadan kullanın. İşte bir örnek:

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

    //Vurgula-başı
assertionTemplates:
    noAIreference:
      type: llm-rubric
      value: kendisini bir yapay zeka, model veya sohbet botu olarak tarif etmez
    startsUpperCase:
      type: javascript
      value: output[0] === output[0].toUpperCase()
// highlight-end
```

:::info
`tools` ve `functions` değerleri provider yapılandırmasında _referans değil_ (dereferenced). Bunun nedeni, kendi dahili referansları olabilecek bağımsız JSON şmalarıdır.
:::

## Tek bir Test Durumunda Birden Çok Değişken

Test içindeki `vars` haritaı, dizi değerleri destekler. Değerler bir dizi ise, test durumu her değer kombinasyonunu çalıştıracaktır.

Örneğin:

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

İ çalıştırmak her `language` x `input` kombinasyonu:

<img alt="Var girdişlerinin birçok kombinasyonu" src="https://user-images.githubusercontent.com/310310/243108917-dab27ca5-689b-4843-bb52-de8d459d783b.png" />

Var'lar glob dosya yollarından da ithal edilebilir. Auto matically olarak bir diziye genişledırirler. Örneğin:

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

## Nunjucks Şablonlarını Kullanma

Nunjucks şablonlarını kullanarak istem şablonlarınza ek kontrol sahibi olun; döngüler, koşullar ve daha fazla.

### Nesneleri Değiştirme

Yukarıdaki örneklerde, `vars` değerleri dizelerdir. Ancak `vars`, nes neler dahil olmak üzere herhangi bir JSON veya YAML öğesi olabilir. Bu nesneleri isteme içinde değiştirebilirsiniz; bunlar [nunjucks](https://mozilla.github.io/nunjucks/) şablonlarıdır:

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
Kullanıcı Profili:
- Adı: {{ user_profile.name }}
- İlgileri: {{ user_profile.interests | join(', ') }}
- Son Aktivite: {{ recent_activity.type }} "{{ recent_activity.details.title }}" tarafından {{ recent_activity.details.author }}

Yukarıdaki kullanıcı profili dayanağında, "{{ recent_activity.details.title }}" benzeri kitaplari içeren ve kullanıcının ilgilerine uyumlu kişiselliktirilmiş bir okuma önerisi listesi olutur.
```

Here's another example. Consider this test case, which lists a handful of user and assistant messages in an OpenAI-compatible format:

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

The corresponding `prompt.txt` file simply passes through the `previous_messages` object using the [dump](https://mozilla.github.io/nunjucks/templating.html#dump) filter to convert the object to a JSON string:

```nunjucks
{{ previous_messages | dump }}
```

Running `promptfoo eval -p prompt.txt -c path_to.yaml` will call the Chat Completion API with the following prompt:

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

### Escaping JSON strings

If the prompt is valid JSON, nunjucks variables are automatically escaped when they are included in strings:

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

You can also manually escape the string using the nunjucks [dump](https://mozilla.github.io/nunjucks/templating.html#dump) filter. This is necessary if your prompt is not valid JSON, for example if you are using nunjucks syntax:

```liquid
{
  "role": {% if 'admin' in message %} "system" {% else %} "user" {% endif %},
  "content": {{ message | dump }}
}
```

### Variable composition

Variables can reference other variables:

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

### Accessing environment variables

You can access environment variables in your templates using the `env` global:

```yaml
prompts:
  - 'file://{{ env.PROMPT_DIR }}/prompt.txt'

tests:
  - vars:
      headline: 'Articles about {{ env.TOPIC }}'
```

Ortam Değişkenleri yapılandırma yükleme zamanında çözülür (çalışma zamanında değil) ve dosya yollarını ve API anahtarlarını kontrol edebilir—onları yalnızca güvenilir ortamlarda kullanın.

:::warning

`ANTHROPIC_API_KEY: '{{ env.ANTHROPIC_API_KEY }}'` gibi şablonlarla `config.env`'ye sırları kopyalamaktan kaçının. Bu, sırrı eval config nesnesine çözer ve dışa aktarılan sonuçlarda görünebilir.

Bir sır zaten shell ortamınızda mevcutsa (veya `--env-file` aracılığıyla yüklenmişse), doğrudan işlem env'den okumayı tercih edin ve `config.env`'yi hassas olmayan bayraklar için tutun.

:::

## Araçlar ve İşlevler

promptfoo, Google, OpenAI ve Anthropic modelleriyle araç kullanımı ve işlev çağrısını destekler; sıcaklık ve token sayısı gibi diğer sağlayıcı özel yapılandırmaların yanı sıra. İşlevleri ve araçları tanımlama hakkında daha fazla bilgi için bkz. [Google Vertex sağlayıcı dokümantasyonu](/docs/providers/vertex/#function-calling-and-tools), [Google AIStudio sağlayıcı dokümantasyonu](/docs/providers/google/#tool-calling), [Google Live sağlayıcı dokümantasyonu](/docs/providers/google#function-calling-example), [OpenAI sağlayıcı dokümantasyonu](/docs/providers/openai#using-tools) ve [Anthropic sağlayıcı dokümantasyonu](/docs/providers/anthropic#tool-calling).

## Düşünme Çıktısı

Anthropik'in Claude ve DeepSeek gibi bažı modeller, modelin son cevap sunmadan önce akl üyönetim sürecini gösterebilecek düşünme/akla dışí İstenileri destekler.

Bu, akl üretim görevleri veya modelin sonuca nasıl vardığını anlamak için yararlıdır.

### Düşünme Çıktısını Kontrol Etme

Varsayılan olarak, düşünme içeriği yanıtta yer alır. `showThinking`'i `false` olarak ayarlayarak gizleyebilirsiniz.

Örneğin, Claude için:

```yaml
providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929
    config:
      thinking:
        type: 'enabled'
        budget_tokens: 16000
      showThinking: false # Düşünme içeriğizini çıktıdan hariç tuı
```

Bu, daha iyi akl ûretim istiyor ancak düşünme süreciğini iddialarınıza maruz bırakmak istemediğinizde yararlıdır.

Geneleştirilmiş düşünme yeteneği hakkında daha fazla bilgi için bkz. [Anthropic sağlayıcı dokümantasyonu](/docs/providers/anthropic#extended-thinking) ve [AWS Bedrock sağlayıcı dokümantasyonu](/docs/providers/aws-bedrock#claude-models).

## Çıktıları Dönüştürme

Dönüşümler, değerlendirme banıtının birden çok düze yinde uygulanabilir:

### Transform çalışma Sırası

1. **Sağlayıcı dönüşümleri** (`transformResponse`) - Her zaman ilk olarak uygulanır
2. **Test dönüşümleri** (`options.transform`) ve **Bağlam dönüşümleri** (`contextTransform`)
   - Her ikisi de sağlayıcı dönüşümünden çıktıyı alır
   - Test dönüşümleri, iddiaları için çıktıyı değiştirir
   - Bağlam dönüşümleri, bağlam tabanlı iddialar için bağlam çıkarır (e.g., `context-faithfulness`)

### Test Dönüşüm Hiyerarşisi

Test dönüşümleri özellikleri için:

1. Varsayılan test dönüşümleri (`defaultTest` belirtilmişse)
2. Bireysel test durumu dönüşümleri (mevcutsa `defaultTest` dönüşümünü geçersiz kılır)

Not: Test durumu düzeyinde, yalnızca bir dönüşüm uygulanır - `defaultTest`'ten veya bireysel test durumundan, her ikisinden değil.

`TestCase.options.transform` alanı, iddiaları çalıştırmadan önce LLM çıktısını değiştiren bir Javascript parçacığıdır.

Bu, bir dize çıktısı ve bağlam nesnesini alan bir işlev:

```typescript
transformFn: (output: string, context: {
  prompt: {
    // Seçilen ilemek işlevinin kimliği varsa
    id?: string;
    // {{variable}} öznitelik akında olmaksızamın test durumunda sağlanan ham istem.
    raw?: string;
    // LLM API ve iddiaları gönderilen istem.
    display?: string;
  };
  vars?: Record<string, any>;
  // Sağlayıcı yanıtında döndürülen Metaveri.
  metadata?: Record<string, any>;
}) => void;
```

Bu, eval'den önce LLM çıktısını dönüştürmen veya temizlemen gerekiyorsa yararlıdır.

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

Aynı zamanda, iddialarda da çalışır; bu, JSON değerleri değerleri seçmek için yararlıdır:

```yaml
tests:
  - vars:
      # ...
    assert:
      - type: equals
        value: 'foo'
        transform: output.category # JSON çıktısından 'category' anahtarını seçin
```

:::tip
Her test durumuna transform seçeneğini uygulamak için `defaultTest` kullanın.
:::

### Ayrı Dosyalardan Dönüşümler

Dönüştürme işlevleri harici JavaScript veya Python dosyalarından çalıştırılabilir. İsteğe bağlı olarak kullanılacak bir işlev adı belirtebilirsiniz.

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

Python dosyaları için işlev adı belirtilmezse, `get_transform` varsayılatır. Özel bir Python işlevini kullanmak için, dosya yolunda belirtin:

```yaml
transform: file://transform.py:custom_python_transform
```

## Giriş Değişkenlerini Dönüştürme

İstemde kullanılmadan önce giriş değişkenlerini `transformVars` seçeneğini kullanarak dönüştürebilirsiniz. Bu özellik, verileri önceden işlemeniz veya harici kaynaklardan içerik yüklemeniz gerektiğinde yararlıdır.

`transformVars` işlevi, dönüştürülen değişken adlarını ve değerlerini içeren bir nesne döndürmelidir. Bu dönüştürülen değişkenler `vars` nesnesine eklenir ve varolan anahtarları geçersiz kılabilir. Örneğin:

```yaml
prompts:
  - 'Aşağıdaki metni {{topic_length}} kelimede özetle: {{processed_content}}'

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
      topic: 'iklim değişikliği'
      content: '  Bu iklim değişikliği hakkında işlenmesi gereken bir metindir.  '
    assert:
      - type: contains
        value: '{{uppercase_topic}}'
```

Dönüştürme işlevleri, bireysel test durumlarında da belirtilebilir.

```yaml
tests:
  - vars:
      url: 'https://example.com/image.png'
    options:
      transformVars: |
        return { ...vars, image_markdown: `![image](${vars.url})` }
```

### Giriş Dönüşümleri Ayrı Dosyalardan

Daha künmçek dönüşümler için `transformVars` için dış dosyaları kullanabilirsiniz:

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
      console.error('transformVars’de hata:', error);
      return {
        error: 'Değişkenleri dönüştürmeyi başarısız oldu',
      };
    }
  },
};
```

Dönüşümleri python’da da tanımlayabilirsiniz.

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

## Yapılandırma Yapısı ve Organizasyonu

Yapılandırma yapısı hakkında ayrıntılı bilgi için bkz. [Yapılandırma Referansı](/docs/configuration/reference).

Birden fazla test seti varsa, onları birden fazla yapılandırma dosyasına bölmek yardımcı olur. Her bireysel yapılandırmayı çalıştırmak için `--config` veya `-c` parametresini kullanın:

```
promptfoo eval -c usecase1.yaml
```

ve

```
promptfoo eval -c usecase2.yaml
```

Birden fazla yapılandırmayı aynı anda çalıştırabilirsiniz, bu da onları tek bir eva olarak birleştirir. Örneğin:

```
promptfoo eval -c my_configs/*
```

veya

```
promptfoo eval -c config1.yaml -c config2.yaml -c config3.yaml
```

## CSV’den Test Yükleme

YAML hoshan, ancak bazı kurumólferin LLM testlerini işbirliğini kolaylanştirator çınb yapraklarında tutarlar. promptfoo, özel [CSV dosyası biçimini](/docs/configuration/test-cases#csv-format) destekler.

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

promptfoo ayrıca bir Google Eçleğiınden test durumları çekebs yeteneğine sahiptir. Başlamanın en kolay yolu sayfayı "bağlantı ile herhangi biri" olarak görünür. Örneğin:

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

Burada [tam örnek](https://github.com/promptfoo/promptfoo/tree/main/examples/google-sheets) yer almaktadır.

promptfoo’yu özel bir spreadsheet'e erişmek için ayarlamakı iŞ hakkında kılavuz için bkz. [Google Eçleği entiegrasyonu](/docs/integrations/google-sheets).