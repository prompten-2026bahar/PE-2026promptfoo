---
sidebar_label: vllm
description: "PagedAttention ve sürekli gruplama ile vLLM'in optimize edilmiş çıkarım motorunu kullanarak yüksek verimli LLM sunumu sağlayın"
---

# vllm

vllm'in [OpenAI uyumlu sunucusu](https://docs.vllm.ai/en/latest/getting_started/quickstart.html#openai-compatible-server), Huggingface Transformers'tan birçok [desteklenen model](https://docs.vllm.ai/en/latest/models/supported_models.html) için yerel çıkarım erişimi sunar.

vllm'i değerlendirmenizde kullanmak için `apiBaseUrl` değişkenini `http://localhost:8080` (veya vllm'i nerede barındırıyorsanız orası) olarak ayarlayın.

İşte metin tamamlamaları için Mixtral-8x7b kullanan örnek bir yapılandırma:

```yaml
providers:
  - id: openai:completion:mistralai/Mixtral-8x7B-v0.1
    config:
      apiBaseUrl: http://localhost:8080/v1
```

İsterseniz, `apiBaseUrl` yapılandırması yerine `OPENAI_BASE_URL` ortam değişkenini de kullanabilirsiniz.
