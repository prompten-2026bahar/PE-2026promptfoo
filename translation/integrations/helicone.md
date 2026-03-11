---
sidebar_label: Helicone
description: Promptfoo'daki Helicone entegrasyonu ile LLM testlerini izleyin ve optimize edin. Açık kaynaklı bir gözlemlenebilirlik platformu üzerinden kullanım, maliyet ve gecikme süresini takip ederken promptları yönetin.
---

# Helicone Entegrasyonu

[Helicone](https://helicone.ai/), LLM isteklerinize vekillik (proxy) yapan ve kullanımınız, harcamalarınız, gecikme süreniz ve daha fazlası hakkında temel bilgiler sağlayan açık kaynaklı bir gözlemlenebilirlik platformudur.

Helicone'daki promptlara atıfta bulunmak için:

1. [Helicone](https://www.helicone.ai) sistemine giriş yapın veya bir hesap oluşturun. Hesabınız olduktan sonra bir [API anahtarı](https://helicone.ai/developer) oluşturabilirsiniz.

2. `HELICONE_API_KEY` değişkenini ve isterseniz diğer ortam değişkenlerini ayarlayın.

3. Promptlarınız için `helicone://` ön ekini, ardından Helicone prompt kimliğini ve sürümünü kullanın. Örneğin:

   ```yaml
   prompts:
     - 'helicone://my-cool-prompt:5.2'

   providers:
     - openai:gpt-5-mini

   tests:
     - vars:
         # ...
   ```

promptfoo test vakalarınızdaki değişkenler, otomatik olarak Helicone promptuna değişken olarak aktarılacaktır.

Helicone kullanarak bir Prompt oluşturmak için [bu kılavuzu](https://docs.helicone.ai/features/prompts#prompts-and-experiments) takip edebilirsiniz.
