---
sidebar_label: llamafile
description: 'OpenAI uyumlu API uç noktalarıyla çevrimdışı test için llamafile kullanarak LLM'leri taşınabilir tek dosyalı yürütülebilir dosyalar olarak dağıtın'
---

# llamafile

Llamafile'ın [OpenAI uyumlu bir HTTP uç noktası](https://github.com/Mozilla-Ocho/llamafile?tab=readme-ov-file#json-api-quickstart) vardır, bu nedenle llamafile sunucunuzla konuşmak için [OpenAI sağlayıcısını](/docs/providers/openai/) geçersiz kılabilirsiniz.

Değerlendirmenizde llamafile kullanmak için `apiBaseUrl` değişkenini `http://localhost:8080` (veya llamafile'ı nerede barındırıyorsanız orası) olarak ayarlayın.

Metin tamamlamaları için LLaMA_CPP kullanan örnek bir yapılandırma:

```yaml
providers:
  - id: openai:chat:LLaMA_CPP
    config:
      apiBaseUrl: http://localhost:8080/v1
```

İsterseniz `apiBaseUrl` yapılandırması yerine `OPENAI_BASE_URL` ortam değişkenini de kullanabilirsiniz.
