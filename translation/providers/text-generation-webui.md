---
sidebar_label: Gradio WebUI
description: "Gelişmiş örnekleme ve üretim seçenekleriyle esnek yerel model barındırma için Oobabooga'nın text-generation-webui'si ile arayüz oluşturun"
---

# text-generation-webui

promptfoo, oobabooga'nın gradio tabanlı [text-generation-webui](https://github.com/oobabooga/text-generation-webui) üzerinde barındırılan modelleri üzerinde [OpenAPI API eklentisi](https://github.com/oobabooga/text-generation-webui/wiki/12-%E2%80%90-OpenAI-API) aracılığıyla değerlendirmeler çalıştırabilir.

text-gen-webui eklentisi, kullanıcı arayüzü üzerinden veya komut satırı aracılığıyla etkinleştirilebilir. İşte komut satırı kullanımına bir örnek:

```sh
python server.py --loader <LOADER-ADI> --model <MODEL-ADI> --api
# Basit yükleyici kullanılıyorsa `python server.py` yerine ./start_linux yazın
```

Kullanımı [OpenAI API'si](/docs/providers/openai) ile uyumludur.

promptfoo'da API'yi aşağıdaki gibi tanımlayabiliriz:

```yaml
providers:
  - openai:chat:<MODEL-ADI>:
      id: <MODEL-ID>
      config:
        apiKey: placeholder
        apiBaseUrl: http://localhost:5000/v1
        temperature: 0.8
        max_tokens: 1024
        passthrough: # Bu yapılandırma değerleri doğrudan API'ye iletilir
          mode: instruct
          instruction_template: LLama-v2
```

İsterseniz, `apiBaseUrl` ve `apiKey` yapılandırmaları yerine `OPENAI_BASE_URL` ve `OPENAI_API_KEY` ortam değişkenlerini de kullanabilirsiniz.
