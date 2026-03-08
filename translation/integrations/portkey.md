---
sidebar_label: Portkey AI
description: promptfoo ile Portkey AI ağ geçidini entegre edin; prompt yönetimi, gözlemlenebilirlik ve OpenAI modelleri ile API'ları için özel yapılandırmalar dahil LLM testleri yapın.
---

# Portkey AI Entegrasyonu

Portkey; prompt yönetimi yeteneklerini de içeren bir yapay zeka gözlemlenebilirlik paketidir.

Portkey'deki promptlara atıfta bulunmak için:

1. `PORTKEY_API_KEY` ortam değişkenini ayarlayın.

2. Promptlarınız için `portkey://` önekini ve ardından Portkey prompt kimliğini (ID) kullanın. Örneğin:

   ```yaml
   prompts:
     - 'portkey://pp-test-promp-669f48'

   providers:
     - openai:gpt-5-mini

   tests:
     - vars:
         topic: ...
   ```

promptfoo test vakalarınızdaki değişkenler, Portkey promptuna otomatik olarak değişken olarak yerleştirilecektir. Sonuç olarak oluşan prompt işlenecek ve promptfoo'ya geri döndürülecek; ardından test vakası için prompt olarak kullanılacaktır.

promptfoo'nun Portkey'de ayarlanan sıcaklık (temperature), model ve diğer parametreleri izlemediğini unutmayın. Bunları `providers` yapılandırmasında kendiniz ayarlamalısınız.

## Portkey Ağ Geçidini (Gateway) Kullanma

Portkey AI ağ geçidi doğrudan promptfoo tarafından desteklenmektedir. Şunlara da bakın:

- [Portkey'in promptfoo entegrasyonu hakkındaki belgeleri](https://portkey.ai/docs/integrations/libraries/promptfoo)
- [Portkey ve Promptfoo ile Yapay Zekada Güven Oluşturma](/docs/guides/building-trust-in-ai-with-portkey-and-promptfoo) - Gelişmiş kullanım durumları, kırmızı takım (red-teaming) iş akışları ve üretim dağıtım stratejilerini içeren kapsamlı kılavuz

Örnek:

```yaml
providers:
  id: portkey:gpt-5-mini
  config:
    portkeyProvider: openai
```

Daha karmaşık portkey yapılandırmaları da desteklenmektedir.

```yaml
providers:
  id: portkey:gpt-5-mini
  config:
    # Alternatif olarak ortam değişkeni ayarlanabilir, örneğin PORTKEY_API_KEY
    portkeyApiKey: xxx

    # Diğer yapılandırma seçenekleri
    portkeyVirtualKey: xxx
    portkeyMetadata:
      team: xxx
    portkeyConfig: xxx
    portkeyProvider: xxx
    portkeyApiBaseUrl: xxx
```
