---
sidebar_label: LocalAI
description: 'Özel, çevrimdışı LLM dağıtımı ve test ortamları için LocalAI ile yerel olarak kendi kendine barındırılan OpenAI uyumlu API"leri çalıştırın'
---

# Local AI

LocalAI, açık kaynaklı LLM'ler için OpenAI ile uyumlu bir API sarmalayıcısıdır. Llama, Alpaca, Vicuna, GPT4All, RedPajama ve ggml formatıyla uyumlu diğer birçok modelle uyumluluk için LocalAI'yı çalıştırabilirsiniz.

Tüm uyumlu modellere [buradan](https://github.com/go-skynet/LocalAI#model-compatibility-table) göz atabilirsiniz.

LocalAI'yı kurup çalıştırdıktan sonra, seçtiğiniz modele göre şunlardan birini belirtin:

- `localai:chat:<model adi>`, [LocalAI sohbet tamamlama uç noktasını](https://localai.io/features/text-generation/#chat-completions) kullanarak modelleri çağırır
- `localai:completion:<model adi>`, [LocalAI tamamlama uç noktasını](https://localai.io/features/text-generation/#completions) kullanarak modelleri çağırır
- `localai:<model adi>`, varsayılan olarak sohbet tipi modele geçer
- `localai:embeddings:<model adi>`, [LocalAI gömme (embeddings) uç noktasını](https://localai.io/features/embeddings/) kullanarak modelleri çağırır

Model adı genellikle LocalAI'da modeli kurmak için indirdiğiniz `.bin` dosyasının adıdır. Örneğin, `ggml-vic13b-uncensored-q5_1.bin`. LocalAI, modelleri listelemek için `curl http://localhost:8080/v1/models` komutuyla sorgulanabilen bir `/models` uç noktasına da sahiptir.

## Parametreleri yapılandırma

`temperature` ve `apiBaseUrl` gibi parametreleri ayarlayabilirsiniz ([tam listeye buradan ulaşabilirsiniz](https://github.com/promptfoo/promptfoo/blob/main/src/providers/localai.ts#L7)). Örneğin, [LocalAI'nın lunademo'sunu](https://localai.io/docs/getting-started/models/) kullanarak:

```yaml title="promptfooconfig.yaml"
providers:
  - id: localai:lunademo
    config:
      temperature: 0.5
```

Desteklenen ortam değişkenleri:

- `LOCALAI_BASE_URL` - varsayılan olarak `http://localhost:8080/v1`
- `REQUEST_TIMEOUT_MS` - milisaniye cinsinden maksimum istek süresi. Varsayılan olarak 60000.
