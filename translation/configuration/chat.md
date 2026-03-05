---
sidebar_label: Sohbet İş Parçacıkları
sidebar_position: 32
title: Sohbet Konuşmaları ve Çok Turlu İş Parçacıkları
description: LLM değerlendirmesi için sohbet konuşmalarını ve çok turlu iş parçacıklarını yapılandırın. Konuşma geçmişi, çok atışlı istemler ve sohbet akışı testini öğrenin.
keywords:
  [
    sohbet konuşmaları,
    çok turlu değerlendirme,
    konuşma geçmişi,
    sohbet iş parçacıkları,
    diyalog testi,
    konuşmacı yapay zeka,
    sohbet akışı,
  ]
pagination_prev: configuration/outputs
pagination_next: configuration/caching
---

# Sohbet konuşmaları / iş parçacıkları

[İstem dosyası](/docs/configuration/prompts#file-based-prompts) OpenAI'nin JSON istem biçiminde bir iletiyi destekler. Bu, sistem istemine dahil olmak üzere birden fazla ileti ayarlamanızı sağlar. Örneğin:

```json
[
  { "role": "system", "content": "You are a helpful assistant." },
  { "role": "user", "content": "Who won the world series in {{ year }}?" }
]
```

Eşdeğer yaml da desteklenmektedir:

```yaml
- role: system
  content: You are a helpful assistant.
- role: user
  content: Who won the world series in {{ year }}?
```

## Çok Atışlı Konuşmalar

Çoğu sağlayıcı, birden fazla asistan, kullanıcı ve sistem istemine dahil olmak üzere tam "çok atışlı" sohbet konuşmalarını destekler.

OpenAI biçimini kullanıyorsanız, bunu yapmanın bir yolu `{role, content}` nesnelerinin bir listesini oluşturmaktır. İşte bir örnek:

```yaml title="promptfooconfig.yaml"
prompts:
  - file://prompt.json

providers:
  - openai:gpt-5-mini

tests:
  - vars:
      messages:
        - role: system
          content: Respond as a pirate
        - role: user
          content: Who founded Facebook?
        - role: assistant
          content: Mark Zuckerberg
        - role: user
          content: Did he found any other companies?
```

Ardından, istem kendisi sadece `messages` öğesinin JSON dökümüdür:

```liquid title="prompt.json"
{{ messages | dump }}
```

## Basitleştirilmiş Sohbet İşaretlemesi

Alternatif olarak, şunun gibi `role: message` listesini belirtmeyi tercih edebilirsiniz:

```yaml
tests:
  - vars:
      messages:
        - user: Who founded Facebook?
        - assistant: Mark Zuckerberg
        - user: Did he found any other companies?
```

Bu, yapılandırmayı basitleştirir, ancak istem şablonunda biraz sihir yapmamız gerekir:

```liquid title="prompt.json"
[
{% for message in messages %}
  {% set outer_loop = loop %}
  {% for role, content in message %}
  {
    "role": "{{ role }}",
    "content": "{{ content }}"
  }{% if not (loop.last and outer_loop.last) %},{% endif %}
  {% endfor %}
{% endfor %}
]
```

## Konuşma Geçmişi Sabiti Oluşturma

Nunjucks şablonlarını kullanarak, birden fazla sohbet iletisini birleştirebiliriz. Bir örnek, önceki konuşmanın _tüm_ testler için sabit olduğu. Her durum farklı bir takip iletisini test eder:

```yaml title="promptfooconfig.yaml"
# Konuşma geçmişini ayarla
defaultTest:
  vars:
    system_message: Answer concisely
    messages:
      - user: Who founded Facebook?
      - assistant: Mark Zuckerberg
      - user: What's his favorite food?
      - assistant: Pizza

# Çoklu takipleri test et
tests:
  - vars:
      question: Did he create any other companies?
  - vars:
      question: What is his role at Internet.org?
  - vars:
      question: Will he let me borrow $5?
```

İstem şablonunda, konuşma geçmişini ve ardından `question` içeren bir kullanıcı iletisini oluştururuz:

```liquid title="prompt.json"
[
  {
    "role": "system",
    "content": {{ system_message | dump }}
  },
  {% for message in messages %}
    {% for role, content in message %}
      {
        "role": "{{ role }}",
        "content": {{ content | dump }}
      },
    {% endfor %}
  {% endfor %}
  {
    "role": "user",
    "content": {{ question | dump }}
  }
]
```

::::info
Birden fazla satır ve tırnak işareti içeren değişkenler JSON istem dosyalarında otomatik olarak kaçılır.

Dosya geçerli JSON değilse (yukarıdaki durumda olduğu gibi, nunjucks `{% for %}` döngüleri nedeniyle), nesneyi JSON olarak dönüştürmek için yerleşik nunjucks filtresi [`dump`](https://mozilla.github.io/nunjucks/templating.html#dump) kullanın.
:::

## `_conversation` Değişkenini Kullanma {#using-the-conversation-variable}

Yerleşik `_conversation` değişkeni, bir konuşmanın tam istemine ve önceki turlarını içerir. Önceki çıktılara başvurmak ve devam eden bir sohbet konuşmasını test etmek için kullanın.

The `_conversation` variable has the following type signature:

```ts
type Completion = {
  prompt: string | object;
  input: string;
  output: string;
};

type Conversation = Completion[];
```

Çoğu durumda, `_conversation` değişkeni arasında dolaşacak ve her `Completion` nesnesini kullanacaksınız.

Önceki konuşmaya başvurmak için `completion.prompt` öğesini kullanın. Örneğin, sohbet biçimindeki bir istekteki ileti sayısını almak için:

```
{{ completion.prompt.length }}
```

Veya konuşmadaki ilk iletiyi almak için:

```
{{ completion.prompt[0] }}
```

Son kullanıcı iletisini almak için kısayol olarak `completion.input` öğesini kullanın. Sohbet biçimindeki bir istekte, `input` son kullanıcı iletisine ayarlanır. `completion.prompt[completion.prompt.length - 1].content` eşdeğeridir.

İşte bir örnek test yapılandırması. Her sorunun önceki çıktıdan bağlam nasıl aldığını unutmayın:

```yaml title="promptfooconfig.yaml"
tests:
  - vars:
      question: Who founded Facebook?
  - vars:
      question: Where does he live?
  - vars:
      question: Which state is that in?
```

İşte karşılık gelen istem:

```json title="prompt.json"
[
  // highlight-start
  {% for completion in _conversation %}
    {
      "role": "user",
      "content": "{{ completion.input }}"
    },
    {
      "role": "assistant",
      "content": "{{ completion.output }}"
    },
  {% endfor %}
  // highlight-end
  {
    "role": "user",
    "content": "{{ question }}"
  }
]
```

İstem, önceki konuşmayı test durumuna ekler ve tur tur tam bir konuşma oluşturur:

![multiple turn conversation eval](https://github.com/promptfoo/promptfoo/assets/310310/70048ae5-34ce-46f0-bd28-42d3aa96f03e)

[Tam örnek yapılandırmasını](https://github.com/promptfoo/promptfoo/tree/main/examples/multiple-turn-conversation) kullanarak kendiniz deneyin.

:::info
`_conversation` değişkeni mevcut olduğunda, değerlendirme tek iş parçacığında çalışacaktır (eşzamanlılık 1).
:::

## Sohbet Konuşmalarını Ayırma

Her benzersiz `conversationId`, kendi ayrı konuşma geçmişini tutar. Senaryolar, varsayılan olarak konuşmaları otomatik olarak yalıtır.

Test metaverisine bir `conversationId` ekleyerek konuşma gruplandırmasını açıkça kontrol edebilirsiniz:

```yaml
tests:
  - vars:
      question: 'Who founded Facebook?'
    metadata:
      conversationId: 'conversation1'
  - vars:
      question: 'Where does he live?'
    metadata:
      conversationId: 'conversation1'
  - vars:
      question: 'Where is Yosemite National Park?'
    metadata:
      conversationId: 'conversation2'
  - vars:
      question: 'What are good hikes there?'
    metadata:
      conversationId: 'conversation2'
```

### İstem İçeriğine JSON Ekleme

Bazı durumlarda, OpenAI `content` alanı _içinde_ JSON göndermek isteyebilirsiniz. Bunu yapmak için, JSON'ın düzgün bir şekilde kaçırıldığından emin olmanız gerekir.

Burada, `{query: string, history: {reply: string}[]}` yapısının bir JSON nesnesi ile OpenAI'ye istem yapan bir örnek yer almaktadır. Önce bu JSON nesnesini `input` değişkeni olarak oluşturur. Ardından, `input` öğesini isteme uygun JSON kaçış ile ekler:

```json title="prompt.json"
{% set input %}
{
    "query": "{{ query }}",
    "history": [
      {% for completion in _conversation %}
        {"reply": "{{ completion.output }}"} {% if not loop.last %},{% endif %}
      {% endfor %}
    ]
}
{% endset %}

[{
  "role": "user",
  "content": {{ input | trim | dump }}
}]
```

İşte ilgili yapılandırma:

```yaml title="promptfooconfig.yaml"
prompts:
  - file://prompt.json
providers:
  - openai:gpt-5-mini
tests:
  - vars:
      query: how you doing
  - vars:
      query: need help with my passport
```

Bu, konuşma geçmişini istem içeriği _içinde_ ekleme etkisine sahiptir. İkinci test durumu için OpenAI'ye gönderilen şey şudur:

```json
[
  {
    "role": "user",
    "content": "{\n    \"query\": \"how you doing\",\n    \"history\": [\n      \n    ]\n}"
  }
]
```

## `storeOutputAs` Kullanma

`storeOutputAs` seçeneği, çok turlu konuşmalarda önceki çıktılara başvurmayı mümkün kılar. Ayarlandığında, LLM çıktısını sonraki sohbetlerde kullanılabilecek bir değişken olarak kaydeder.

İşte bir örnek:

```yaml title="promptfooconfig.yaml"
prompts:
  - 'Respond to the user: {{message}}'

providers:
  - openai:gpt-5

tests:
  - vars:
      message: "What's your favorite fruit? You must pick one. Output the name of a fruit only"
    options:
      storeOutputAs: favoriteFruit
  - vars:
      message: 'Why do you like {{favoriteFruit}} so much?'
    options:
      storeOutputAs: reason
  - vars:
      message: 'Write a snarky 2 sentence rebuttal to this argument for loving {{favoriteFruit}}: \"{{reason}}\"'
```

Bu, sohbet botu soruları yanıtlarken anında `favoriteFruit` ve `reason` varları oluşturur.

### Çıktıları `transform` ile Değiştirme

Çıktılar, `transform` özelliği kullanılarak depolanmadan önce değiştirilebilir:

```yaml title="promptfooconfig.yaml"
tests:
  - vars:
      message: "What's your favorite fruit? You must pick one. Output the name of a fruit only"
    options:
      storeOutputAs: favoriteFruit
      // highlight-start
      transform: output.split(' ')[0]
      // highlight-end
  - vars:
      message: "Why do you like {{favoriteFruit}} so much?"
    options:
      storeOutputAs: reason
  - vars:
      message: 'Write a snarky 2 sentence rebuttal to this argument for loving {{favoriteFruit}}: \"{{reason}}\"'
```

Dönüşümler Javascript parçacıkları olabilir veya tamamen ayrı Python veya Javascript dosyaları olabilirler. [Transform hakkında dokümentasyona](/docs/configuration/guide/#transforming-outputs) bakın.

## Ayrıca Bkz.

- [İstem Parametreleri](/docs/configuration/prompts) - İstemlenileri tanımlamanın farklı yolları hakkında bilgi edinin
- [Test Yapılandırması](/docs/configuration/guide) - Test yapılandırmalarını ayarlama için tam kılavuz
- [Dönüştürücü İşlevleri](/docs/configuration/guide/#transforming-outputs) - Test durumları arasında çıktıları dönüştürme
- [Nunjucks Şablonları](https://mozilla.github.io/nunjucks/templating.html) - İstem dosyalarında kullanılan şablon dili için dokümantasyon
- [Çok Turlu Konuşma Örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/multiple-turn-conversation) - Çok turlu konuşmaların tam örneği