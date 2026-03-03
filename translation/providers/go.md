---
sidebar_label: Özel Go (Golang)
description: Kendi Go tabanlı LLM istemcilerinizi, modellerinizi ve API'lerinizi promptfoo'nun test çerçevesiyle entegre etmek için özel Go sağlayıcıları yapılandırın
---

# Özel Go Sağlayıcısı

Go (`golang`) sağlayıcısı, istemleri (prompts) değerlendirmek için bir API sağlayıcısı olarak Go kodunu kullanmanıza olanak tanır. Bu, Go ile uygulanmış özel mantığınız, API istemcileriniz veya modelleriniz olduğunda ve bunları test paketinizle entegre etmek istediğinizde kullanışlıdır.

:::info
Go sağlayıcısı şu anda deneysel aşamadadır.
:::

## Hızlı Başlangıç

Aşağıdaki komutu kullanarak yeni bir Go sağlayıcı projesi başlatabilirsiniz:

```sh
promptfoo init --example golang-provider
```

## Sağlayıcı Arayüzü

Go kodunuz, şu imzaya sahip `CallApi` fonksiyonunu uygulamalıdır:

```go
func CallApi(prompt string, options map[string]interface{}, ctx map[string]interface{}) (map[string]interface{}, error)
```

Fonksiyon şunları yapmalıdır:

- Bir istem (prompt) dizesi ve yapılandırma seçeneklerini kabul etmeli
- Yanıtı içeren "output" anahtarına sahip bir harita (map) döndürmeli
- İşlem başarısız olursa bir hata döndürmeli

## Yapılandırma

Go sağlayıcısını yapılandırmak için Go betiğinizin yolunu ve betiğe iletmek istediğiniz ek seçenekleri belirtmeniz gerekir. İşte YAML formatında bir yapılandırma örneği:

```yaml
providers:
  - id: 'file://path/to/your/script.go'
    label: 'Go Sağlayıcısı' # Bu sağlayıcı için isteğe bağlı görünüm etiketi
    config:
      additionalOption: 123
```

## Örnek Uygulama

İşte OpenAI API'sini kullanan eksiksiz bir örnek:

```go
// Package main, OpenAI'nin API'sini kullanan bir promptfoo sağlayıcısı uygular.
package main

import (
    "fmt"
    "os"
    "github.com/sashabaranov/go-openai"
)

// client, paylaşılan OpenAI istemci örneğidir.
var client = openai.NewClient(os.Getenv("OPENAI_API_KEY"))

// CallApi, yapılandırılabilir seçeneklerle istemleri işler.
func CallApi(prompt string, options map[string]interface{}, ctx map[string]interface{}) (map[string]interface{}, error) {
    // Yapılandırmayı çıkar
    temp := 0.7
    if val, ok := options["config"].(map[string]interface{})["temperature"].(float64); ok {
        temp = val
    }

    // API'yi çağır
    resp, err := client.CreateChatCompletion(
        context.Background(),
        openai.ChatCompletionRequest{
            Model: openai.GPT4o,
            Messages: []openai.ChatCompletionMessage{
                {
                    Role:    openai.ChatMessageRoleUser,
                    Content: prompt,
                },
            },
            Temperature: float32(temp),
        },
    )

    if err != nil {
        return nil, fmt.Errorf("sohbet tamamlama hatası: %v", err)
    }

    return map[string]interface{}{
        "output": resp.Choices[0].Message.Content,
    }, nil
}
```

## Sağlayıcıyı Kullanma

Go sağlayıcısını promptfoo yapılandırmanızda kullanmak için:

```yaml
providers:
  - id: 'file://path/to/your/script.go'
    config:
      # Herhangi bir ek yapılandırma seçeneği
```

Veya CLI'da:

```
promptfoo eval -p prompt1.txt prompt2.txt -o results.csv -v vars.csv -r 'file://path/to/your/script.go'
```
