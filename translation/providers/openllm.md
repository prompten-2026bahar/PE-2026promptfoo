---
sidebar_label: OpenLLM
description: "Üretime hazır model çıkarımı için BentoML'nin OpenLLM çerçevesini kullanarak açık kaynaklı LLM'leri verimli bir şekilde dağıtın ve sunun"
---

# OpenLLM

[OpenLLM](https://github.com/bentoml/OpenLLM)'i promptfoo ile kullanmak için, OpenLLM'in [OpenAI uyumlu uç nokta](https://colab.research.google.com/github/bentoml/OpenLLM/blob/main/examples/openllm-llama2-demo/openllm_llama2_demo.ipynb#scrollTo=0G5clTYV_M8J&line=3&uniqifier=1) desteğinden yararlanıyoruz.

1. `openllm start` komutunu kullanarak sunucuyu başlatın.

2. Ortam değişkenlerini ayarlayın:
   - `OPENAI_BASE_URL` değerini `http://localhost:8001/v1` olarak ayarlayın.
   - `OPENAI_API_KEY` değerini rastgele bir değer olan `foo` olarak ayarlayın.

3. Kullanım durumunuza bağlı olarak `chat` veya `completion` model türlerini kullanın.

   **Sohbet (Chat) formatı örneği**:
   Sohbet formatlı istemler kullanarak bir Llama2 değerlendirmesi (eval) çalıştırmak için önce modeli başlatın:

   ```sh
   openllm start llama --model-id meta-llama/Llama-2-7b-chat-hf
   ```

   Ardından promptfoo yapılandırmasını ayarlayın:

   ```yaml
   providers:
     - openai:chat:llama2
   ```

   **Tamamlama (Completion) formatı örneği**:
   Tamamlama formatlı istemler kullanarak bir Flan değerlendirmesi çalıştırmak için önce modeli başlatın:

   ```sh
   openllm start flan-t5 --model-id google/flan-t5-large
   ```

   Ardından promptfoo yapılandırmasını ayarlayın:

   ```yaml
   providers:
     - openai:completion:flan-t5
   ```

4. Daha fazla ayrıntı için [OpenAI sağlayıcı belgelerine](/docs/providers/openai) bakın.
