---
sidebar_label: Cohere
description: Web arama konektörleri ve esnek istem kısaltma kontrolleriyle, RAG için optimize edilmiş sohbet çıkarımı için Cohere'in Command-R ve Command modellerini yapılandırın
---

# Cohere

`cohere` sağlayıcısı, Cohere AI'nın [sohbet çıkarım API'sine](https://docs.cohere.com/reference/chat) erişim sağlayan bir arayüzdür. Command R gibi modeller RAG ve araç kullanımı için optimize edilmiştir.

## Kurulum

İlk olarak, `COHERE_API_KEY` ortam değişkenini Cohere API anahtarınızla ayarlayın.

Ardından, promptfoo yapılandırma dosyasını Cohere sağlayıcısını gösterecek şekilde düzenleyin.

- `cohere:<model_adi>` - Belirtilen Cohere modelini kullanır (örneğin, `command`, `command-light`).

Aşağıdaki modellerin desteklendiği onaylanmıştır. Desteklenen modellerin güncel listesi için [Cohere Modelleri](https://docs.cohere.com/docs/models) sayfasına bakın.

- command-light
- command-light-nightly
- command
- command-nightly
- command-r
- command-r-plus

İşte bir yapılandırma örneği:

```yaml
providers:
  - id: cohere:command
    config:
      temperature: 0.5
      max_tokens: 256
      prompt_truncation: 'AUTO'
      connectors:
        - id: web-search
```

## İstem (Prompt) Üzerinde Kontrol

Varsayılan olarak, normal bir dize istemi uygun sohbet formatına otomatik olarak sarılacak ve `message` alanı aracılığıyla Cohere API'sine gönderilecektir:

```yaml
prompts:
  - '{{topic}} hakkında bir tweet yaz'

providers:
  - cohere:command

tests:
  - vars:
      topic: muzlar
```

İstenirse, isteminiz daha karmaşık bir API parametre setine sahip bir YAML veya JSON dosyasına başvurabilir. Örneğin:

```yaml
prompts:
  - file://prompt1.yaml

providers:
  - cohere:command

tests:
  - vars:
      question: Hangi yılda doğdu?
  - vars:
      question: Kahvaltıda ne yemeyi severdi?
```

Ve `prompt1.yaml` dosyasında:

```yaml
chat_history:
  - role: USER
    message: 'Yerçekimini kim keşfetti?'
  - role: CHATBOT
    message: 'Isaac Newton'
message: '{{question}}'
connectors:
  - id: web-search
```

## Gömme (Embedding) Yapılandırması

Cohere, benzerlik karşılaştırmaları da dahil olmak üzere çeşitli doğal dil işleme görevleri için kullanılabilecek gömme yetenekleri sağlar. Değerlendirmelerinizde Cohere'in gömme modelini kullanmak için şu şekilde yapılandırabilirsiniz:

1. `promptfooconfig.yaml` dosyanızda `defaultTest` bölümü altına gömme yapılandırmasını ekleyin:

```yaml
defaultTest:
  options:
    provider:
      embedding:
        id: cohere:embedding:embed-english-v3.0
```

Bu yapılandırma, gömme gerektiren tüm testler (benzerlik iddiaları gibi) için varsayılan gömme sağlayıcısını Cohere'in `embed-english-v3.0` modelini kullanacak şekilde ayarlar.

2. Bireysel iddialar (assertions) için de gömme sağlayıcısını belirtebilirsiniz:

```yaml
assert:
  - type: similar
    value: Bazı referans metinler
    provider:
      embedding:
        id: cohere:embedding:embed-english-v3.0
```

3. Gömme sağlayıcısına ek yapılandırma seçenekleri iletilebilir:

```yaml
defaultTest:
  options:
    provider:
      embedding:
        id: cohere:embedding:embed-english-v3.0
        config:
          apiKey: your_api_key_here # Ortam değişkeni ile ayarlanmamışsa
          truncate: NONE # Seçenekler: NONE, START, END
```

## Aramaları ve Belgeleri Görüntüleme

Cohere API çağrıldığında, sağlayıcı isteğe bağlı olarak arama sorgularını ve belgeleri çıktıya dahil edebilir. Bu, `showSearchQueries` ve `showDocuments` yapılandırma parametreleri tarafından kontrol edilir. True ise içerik çıktıya eklenecektir.

## Yapılandırma

Cohere parametreleri

| Parametre             | Açıklama                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `apiKey`              | Ortam değişkeni kullanmıyorsanız Cohere API anahtarınız.                                           |
| `chatHistory`         | Rol, mesaj ve isteğe bağlı olarak kullanıcı adı ve konuşma kimliği içeren sohbet geçmişi nesneleri dizisi. |
| `connectors`          | Harici sistemlerle entegrasyon için konektör nesneleri dizisi.                                     |
| `documents`           | Modele referans materyal sağlamak için belge nesneleri dizisi.                                     |
| `frequency_penalty`   | Yeni tokenleri, metinde şu ana kadar ne sıklıkta göründüklerine göre cezalandırır.                |
| `k`                   | Top-k örnekleme yoluyla çıktının çeşitliliğini kontrol eder.                                      |
| `max_tokens`          | Oluşturulan metnin maksimum uzunluğu.                                                              |
| `modelName`           | Sohbet tamamlama için kullanılacak model adı.                                                      |
| `p`                   | Çekirdek (top-p) örnekleme yoluyla çıktının çeşitliliğini kontrol eder.                           |
| `preamble_override`   | Model tarafından kullanılan varsayılan girişi (preamble) geçersiz kılmak için bir dize.            |
| `presence_penalty`    | Yeni tokenleri, metinde şu ana kadar var olup olmadıklarına göre cezalandırır.                    |
| `prompt_truncation`   | İstemlerin nasıl kısaltılacağını kontrol eder ('AUTO' veya 'OFF').                                 |
| `search_queries_only` | True ise yalnızca arama sorguları işlenir.                                                         |
| `temperature`         | Çıktının rastgeleliğini kontrol eder.                                                              |

Özel parametreler

| Parametre           | Açıklama                                                  |
| ------------------- | --------------------------------------------------------- |
| `showSearchQueries` | True ise çıktıda kullanılan arama sorgularını içerir.     |
| `showDocuments`     | True ise çıktıda kullanılan belgeleri içerir.             |
