---
sidebar_label: LLM Sağlayıcıları
description: Kapsamlı yapay zeka değerlendirmesi için standartlaştırılmış test arayüzlerine sahip Claude, GPT ve Gemini modelleri dahil olmak üzere birden fazla LLM sağlayıcısını yapılandırın
---

# LLM Sağlayıcıları

Promptfoo'da sağlayıcılar (providers), çeşitli dil modellerine ve yapay zeka servislerine yönelik arayüzlerdir. Yapılandırmanızda `targets` (hedefler) olarak da belirtilebilirler; bu iki anahtar birbirinin yerine kullanılabilir. Bu kılavuz, promptfoo değerlendirmelerinizde sağlayıcıları nasıl yapılandıracağınızı ve kullanacağınızı anlamanıza yardımcı olacaktır.

## Hızlı Başlangıç

İşte promptfoo YAML yapılandırmanızda sağlayıcıları yapılandırmaya yönelik temel bir örnek:

```yaml
providers:
  - anthropic:messages:claude-opus-4-6
  - openai:gpt-5
  - openai:gpt-5-mini
  - google:gemini-2.5-pro
  - vertex:gemini-2.5-pro
```

## Mevcut Sağlayıcılar

| API Sağlayıcıları                                    | Açıklama                                                     | Sözdizimi ve Örnek                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| [OpenAI](./openai.md)                                | GPT-5.1 ve akıl yürütme modelleri dahil GPT modelleri         | `openai:gpt-5.1` veya `openai:o4-mini`                                          |
| [Anthropic](./anthropic.md)                          | Claude modelleri                                             | `anthropic:messages:claude-opus-4-6`                                            |
| [Claude Agent SDK](./claude-agent-sdk.md)            | Claude Ajan SDK'sı                                           | `anthropic:claude-agent-sdk`                                                    |
| [HTTP](./http.md)                                    | Genel HTTP tabanlı sağlayıcılar                              | `https://api.example.com/v1/chat/completions`                                   |
| [Javascript](./custom-api.md)                        | Özel - JavaScript dosyası                                    | `file://path/to/custom_provider.js`                                             |
| [Python](./python.md)                                | Özel - Python dosyası                                        | `file://path/to/custom_provider.py`                                             |
| [Ruby](./ruby.md)                                    | Özel - Ruby dosyası                                          | `file://path/to/custom_provider.rb`                                             |
| [Shell Komutu](./custom-script.md)                   | Özel - Betik (script) tabanlı sağlayıcılar                   | `exec: python chain.py`                                                         |
| [OpenAI ChatKit](./openai-chatkit.md)                | Agent Builder'dan ChatKit iş akışları                        | `openai:chatkit:wf_xxxxx`                                                       |
| [OpenAI Codex SDK](./openai-codex-sdk.md)            | Kod üretimi ve analizi için OpenAI Codex SDK'sı              | `openai:codex-sdk`                                                              |
| [AI21 Labs](./ai21.md)                               | Jurassic ve Jamba modelleri                                   | `ai21:jamba-1.5-mini`                                                           |
| [AI/ML API](./aimlapi.md)                            | Tek bir API ile 300'den fazla son teknoloji yapay zeka modeline erişin | `aimlapi:chat:deepseek-r1`                                                      |
| [Alibaba Cloud (Qwen)](./alibaba.md)                 | Alibaba Cloud'un Qwen modelleri                              | `alibaba:qwen-max` veya `qwen-plus`                                             |
| [AWS Bedrock](./aws-bedrock.md)                      | Çeşitli sağlayıcılardan AWS'de barındırılan modeller         | `bedrock:us.anthropic.claude-opus-4-6-v1:0`                                     |
| [AWS Bedrock Agents](./bedrock-agents.md)            | Yapay zeka iş akışlarını yönetmek için Amazon Bedrock Ajanları | `bedrock-agent:YOUR_AGENT_ID`                                                   |
| [Amazon SageMaker](./sagemaker.md)                   | SageMaker uç noktalarında yayınlanan modeller                | `sagemaker:my-endpoint-name`                                                    |
| [Azure OpenAI](./azure.md)                           | Azure'da barındırılan OpenAI modelleri                       | `azureopenai:gpt-4o-custom-deployment-name`                                     |
| [Cerebras](./cerebras.md)                            | Llama modelleri için yüksek performanslı çıkarım API'si      | `cerebras:llama-4-scout-17b-16e-instruct`                                       |
| [Cloudflare AI](./cloudflare-ai.md)                  | Cloudflare'in OpenAI uyumlu yapay zeka platformu             | `cloudflare-ai:@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`                    |
| [Cloudflare AI Gateway](./cloudflare-gateway.md)     | İstekleri Cloudflare AI Gateway üzerinden yönlendirin         | `cloudflare-gateway:openai:gpt-5.2`                                             |
| [Cloudera](./cloudera.md)                            | Cloudera Yapay Zeka Çıkarım Servisi                          | `cloudera:llama-2-13b-chat`                                                     |
| [CometAPI](./cometapi.md)                            | Birleşik bir API ile birden fazla sağlayıcıdan 500+ yapay zeka modeli | `cometapi:chat:gpt-5-mini` veya `cometapi:image:dall-e-3`                       |
| [Cohere](./cohere.md)                                | Cohere'in dil modelleri                                      | `cohere:command`                                                                |
| [Databricks](./databricks.md)                        | Databricks Temel Model API'leri                              | `databricks:databricks-meta-llama-3-3-70b-instruct`                             |
| [DeepSeek](./deepseek.md)                            | DeepSeek'in dil modelleri                                    | `deepseek:deepseek-r1`                                                          |
| [Docker Model Runner](./docker.md)                   | Yerel modellerle değerlendirme yapın                         | `docker:ai/llama3.2:3B-Q4_K_M`                                                  |
| [Envoy AI Gateway](./envoy.md)                       | OpenAI uyumlu AI Gateway proxy'si                            | `envoy:my-model`                                                                |
| [F5](./f5.md)                                        | OpenAI uyumlu AI Gateway arayüzü                             | `f5:path-name`                                                                  |
| [fal.ai](./fal.md)                                   | Görüntü Üretim Sağlayıcısı                                   | `fal:image:fal-ai/fast-sdxl`                                                    |
| [Fireworks AI](./fireworks.md)                       | Barındırılan çeşitli modeller                                | `fireworks:accounts/fireworks/models/qwen-v2p5-7b`                              |
| [GitHub](./github.md)                                | GitHub Models - OpenAI, Anthropic, Google ve daha fazlası    | `github:openai/gpt-5` veya `github:anthropic/claude-3.7-sonnet`                 |
| [Google AI Studio](./google.md)                      | Gemini modelleri, Live API ve Imagen görüntü üretimi         | `google:gemini-2.5-pro`, `google:image:imagen-4.0-generate-preview-06-06`       |
| [Google Vertex AI](./vertex.md)                      | Google Cloud'un yapay zeka platformu                         | `vertex:gemini-2.5-pro`, `vertex:gemini-2.5-flash`                              |
| [Groq](./groq.md)                                    | Yüksek performanslı çıkarım API'si                           | `groq:llama-3.3-70b-versatile`                                                  |
| [Helicone AI Gateway](./helicone.md)                 | Birleşik sağlayıcı erişimi için kendi kendine barındırılan yapay zeka ağ geçidi | `helicone:openai/gpt-5`, `helicone:anthropic/claude-sonnet-4`                   |
| [Hyperbolic](./hyperbolic.md)                        | OpenAI uyumlu Llama 3 sağlayıcısı                            | `hyperbolic:meta-llama/Llama-3.3-70B-Instruct`                                  |
| [Hugging Face](./huggingface.md)                     | Binlerce modele erişin                                       | `huggingface:chat:meta-llama/Llama-3.3-70B-Instruct`                            |
| [JFrog ML](./jfrog.md)                               | JFrog'un LLM Model Kütüphanesi                               | `jfrog:llama_3_8b_instruct`                                                     |
| [LiteLLM](./litellm.md)                              | Gömme desteğiyle 400+ LLM için birleşik arayüz               | `litellm:gpt-5`, `litellm:embedding:text-embedding-3-small`                     |
| [Llama API](./llamaApi.md)                           | Meta'nın çok modlu yetenekli barındırılan Llama modelleri    | `llamaapi:Llama-4-Maverick-17B-128E-Instruct-FP8`                               |
| [Mistral AI](./mistral.md)                           | Mistral'in dil modelleri                                     | `mistral:magistral-medium-latest`                                               |
| [Nscale](./nscale.md)                                | Hız sınırı olmayan maliyet etkin sunucusuz yapay zeka çıkarımı | `nscale:openai/gpt-oss-120b`                                                    |
| [OpenClaw](./openclaw.md)                            | Ajan araçlarına sahip kişisel yapay zeka asistanı çerçevesi  | `openclaw:main`                                                                 |
| [OpenLLM](./openllm.md)                              | BentoML'in model sunum çerçevesi                             | OpenAI sözdizimi ile uyumlu                                                     |
| [OpenRouter](./openrouter.md)                        | Birden fazla sağlayıcı için birleşik API                     | `openrouter:mistral/7b-instruct`                                                |
| [Perplexity AI](./perplexity.md)                     | Atıflı arama destekli sohbet                                 | `perplexity:sonar-pro`                                                          |
| [Replicate](./replicate.md)                          | Barındırılan çeşitli modeller                                | `replicate:stability-ai/sdxl`                                                   |
| [Slack](./slack.md)                                  | Slack kanalları/DM'leri üzerinden insan geri bildirimi        | `slack:C0123ABCDEF` veya `slack:channel:C0123ABCDEF`                              |
| [Snowflake Cortex](./snowflake.md)                   | Snowflake'in Claude, GPT ve Llama modellerine sahip yapay zeka platformu | `snowflake:mistral-large2`                                                      |
| [Together AI](./togetherai.md)                       | Barındırılan çeşitli modeller                                | OpenAI sözdizimi ile uyumlu                                                     |
| [TrueFoundry](./truefoundry.md)                      | 1000+ model için birleşik LLM Ağ Geçidi                      | `truefoundry:openai-main/gpt-5`, `truefoundry:anthropic-main/claude-sonnet-4.5` |
| [Vercel AI Gateway](./vercel.md)                     | %0 kâr marjı ve yerleşik hata yedeği ile birleşik yapay zeka ağı geçidi | `vercel:openai/gpt-4o-mini`, `vercel:anthropic/claude-sonnet-4.5`               |
| [Voyage AI](./voyage.md)                             | Uzmanlaşmış gömme (embedding) modelleri                      | `voyage:voyage-3`                                                               |
| [vLLM](./vllm.md)                                    | Yerel                                                        | OpenAI sözdizimi ile uyumlu                                                     |
| [Ollama](./ollama.md)                                | Yerel                                                        | `ollama:chat:llama3.3`                                                          |
| [LocalAI](./localai.md)                              | Yerel                                                        | `localai:gpt4all-j`                                                             |
| [Llamafile](./llamafile.md)                          | OpenAI uyumlu llamafile sunucusu                             | Özel uç nokta ile OpenAI sağlayıcısını kullanır                                 |
| [llama.cpp](./llama.cpp.md)                          | Yerel                                                        | `llama:7b`                                                                      |
| [Transformers.js](./transformers.md)                 | Transformers.js üzerinden yerel ONNX çıkarımı                | `transformers:text-generation:Xenova/gpt2`                                      |
| [MCP (Model Context Protocol)](./mcp.md)             | Ajan sistemlerini test etmek için doğrudan MCP sunucu entegrasyonu | Sunucu yapılandırması ile `mcp`                                               |
| [Text Generation WebUI](./text-generation-webui.md)  | Gradio WebUI                                                 | OpenAI sözdizimi ile uyumlu                                                     |
| [WebSocket](./websocket.md)                          | WebSocket tabanlı sağlayıcılar                               | `ws://example.com/ws`                                                           |
| [Webhook](./webhook.md)                              | Özel - Webhook entegrasyonu                                  | `webhook:http://example.com/webhook`                                            |
| [Echo](./echo.md)                                    | Özel - Test amaçlı                                           | `echo`                                                                          |
| [Manual Input](./manual-input.md)                    | Özel - CLI manuel giriş                                      | `promptfoo:manual-input`                                                        |
| [Go](./go.md)                                        | Özel - Go dosyası                                            | `file://path/to/your/script.go`                                                 |
| [Web Tarayıcısı](./browser.md)                       | Özel - Web tarayıcısı etkileşimlerini otomatikleştirin       | `browser`                                                                       |
| [Sıralama (Sequence)](./sequence.md)                 | Özel - Çoklu istem sıralama                                  | config.inputs dizisi ile `sequence`                                             |
| [Simüle Edilmiş Kullanıcı](./simulated-user.md)      | Özel - Konuşma simülatörü                                    | `promptfoo:simulated-user`                                                      |
| [WatsonX](./watsonx.md)                              | IBM'in WatsonX'i                                             | `watsonx:ibm/granite-3-3-8b-instruct`                                           |
| [X.AI](./xai.md)                                     | X.AI'nin modelleri (metin, görüntü, video, ses)              | `xai:grok-3-beta`, `xai:video:grok-imagine-video`                               |

## Sağlayıcı Sözdizimi

Sağlayıcılar çeşitli sözdizimi seçenekleri kullanılarak belirtilir:

1. Basit dize formatı:

   ```yaml
   saglayici_adi:model_adi
   ```

   Örnek: `openai:gpt-5` veya `anthropic:claude-opus-4-6`

2. Yapılandırmalı nesne formatı:

   ```yaml
   - id: saglayici_adi:model_adi
     config:
       secenek1: deger1
       secenek2: deger2
   ```

   Örnek:

   ```yaml
   - id: openai:gpt-5
     config:
       temperature: 0.7
       max_tokens: 150
   ```

3. Dosya tabanlı yapılandırma:

   Tek bir sağlayıcı yükleyin:

   ```yaml title="provider.yaml"
   id: openai:chat:gpt-5
   config:
     temperature: 0.7
   ```

   Veya birden fazla sağlayıcı:

   ```yaml title="providers.yaml"
   - id: openai:gpt-5
     config:
       temperature: 0.7
   - id: anthropic:messages:claude-opus-4-6
     config:
       max_tokens: 1000
   ```

   Yapılandırmanızda referans verin:

   ```yaml title="promptfooconfig.yaml"
   providers:
     - file://provider.yaml # nesne olarak tek bir sağlayıcı
     - file://providers.yaml # dizi olarak birden fazla sağlayıcı
   ```

## Sağlayıcıları Yapılandırma

Çoğu sağlayıcı, kimlik doğrulama için ortam değişkenlerini kullanır:

```sh
export OPENAI_API_KEY=api_anahtarınız_buraya
export ANTHROPIC_API_KEY=api_anahtarınız_buraya
```

API anahtarlarını yapılandırma dosyanızda da belirtebilirsiniz:

```yaml
providers:
  - id: openai:gpt-5
    config:
      apiKey: api_anahtarınız_buraya
```

## Özel Entegrasyonlar

promptfoo birkaç tür özel entegrasyonu destekler:

1. Dosya tabanlı sağlayıcılar:

   ```yaml
   providers:
     - file://path/to/provider_config.yaml
   ```

2. JavaScript sağlayıcılar:

   ```yaml
   providers:
     - file://path/to/custom_provider.js
   ```

3. Python sağlayıcılar:

   ```yaml
   providers:
     - id: file://path/to/custom_provider.py
   ```

4. HTTP/HTTPS API:

   ```yaml
   providers:
     - id: https://api.example.com/v1/chat/completions
       config:
         headers:
           Authorization: 'Bearer api_anahtarınız'
   ```

5. WebSocket:

   ```yaml
   providers:
     - id: ws://example.com/ws
       config:
         messageTemplate: '{"prompt": "{{prompt}}"}'
   ```

6. Özel betikler:

   ```yaml
   providers:
     - 'exec: python chain.py'
   ```

## Ortak Yapılandırma Seçenekleri

Birçok sağlayıcı şu ortak yapılandırma seçeneklerini destekler:

- `temperature`: Rastgeleliği kontrol eder (0.0 - 1.0)
- `max_tokens`: Oluşturulacak maksimum token sayısı
- `top_p`: Çekirdek örnekleme (nucleus sampling) parametresi
- `frequency_penalty`: Sık kullanılan tokenleri cezalandırır
- `presence_penalty`: Metinde bulunup bulunmadığına bağlı olarak yeni tokenleri cezalandırır
- `stop`: API'nin daha fazla token üretmeyi durduracağı diziler

Örnek:

```yaml
providers:
  - id: openai:gpt-5
    config:
      temperature: 0.7
      max_tokens: 150
      top_p: 0.9
      frequency_penalty: 0.5
      presence_penalty: 0.5
      stop: ["\n", 'İnsan:', 'Yapay Zeka:']
```

## Model Bağlam Protokolü (Model Context Protocol - MCP)

Promptfoo, LLM sağlayıcılarında gelişmiş araç kullanımı ve ajan yeteneklerini etkinleştirmek için Model Bağlam Protokolü (MCP)'nü destekler. MCP, araç orkestrasyonu, bellek ve daha fazlasını etkinleştirmek için sağlayıcıları harici MCP sunucularına bağlamanıza olanak tanır.

### Temel MCP Yapılandırması

Sağlayıcınızın yapılandırmasına `mcp` bloğunu ekleyerek bir sağlayıcı için MCP'yi etkinleştirin:

```yaml
providers:
  - id: openai:gpt-5
    config:
      temperature: 0.7
      mcp:
        enabled: true
        server:
          command: npx
          args: ['-y', '@modelcontextprotocol/server-memory']
          name: memory
```

### Çoklu MCP Sunucuları

Tek bir sağlayıcıyı birden fazla MCP sunucusuna bağlayabilirsiniz:

```yaml
providers:
  - id: openai:gpt-5
    config:
      mcp:
        enabled: true
        servers:
          - command: npx
            args: ['-y', '@modelcontextprotocol/server-memory']
            name: sunucu_a
          - url: http://localhost:8001
            name: sunucu_b
```

Ayrıntılı MCP belgeleri ve gelişmiş yapılandırmalar için [MCP Entegrasyon Kılavuzu](../integrations/mcp.md)na bakın.

## Gelişmiş Kullanım

### Özel Sağlayıcıları Bulut Hedeflerine Bağlama (Promptfoo Cloud)

:::info Promptfoo Cloud Özelliği
Bu özellik [Promptfoo Cloud](/docs/enterprise) dağıtımlarında mevcuttur.
:::

Özel sağlayıcıları ([Python](/docs/providers/python/), [JavaScript](/docs/providers/custom-api/), [HTTP](/docs/providers/http/)) `linkedTargetId` kullanarak bulut hedeflerine bağlayın. Bu, birden fazla değerlendirme çalışmasından elde edilen bulguları tek bir panoda birleştirerek performansı zaman içinde izlemenize ve kapsamlı raporlamayı görüntülemenize olanak tanır.

```yaml
providers:
  - id: 'file://my_provider.py'
    config:
      linkedTargetId: 'promptfoo://provider/12345678-1234-1234-1234-123456789abc'
```

Kurulum talimatları için [Yerel Hedefleri Buluta Bağlama](/docs/red-team/troubleshooting/linking-targets/) sayfasına bakın.

### Yerel Yapılandırma Geçersiz Kılmalarıyla Bulut Hedeflerini Kullanma

:::info Promptfoo Cloud Özelliği

Bu özellik [Promptfoo Cloud](/docs/enterprise) dağıtımlarında mevcuttur.

:::

Bulut hedefleri, sağlayıcı yapılandırmalarını (API anahtarları, temel ayarlar) Promptfoo Cloud'da saklar. Bunlara `promptfoo://provider/` protokolünü kullanarak atıfta bulunun ve isteğe bağlı olarak belirli yapılandırma değerlerini yerel olarak geçersiz kılın.

**Temel kullanım:**

```yaml
providers:
  - promptfoo://provider/12345-abcd-uuid
```

**Bulut yapılandırmasını yerel olarak geçersiz kılma:**

```yaml
providers:
  - id: promptfoo://provider/12345-abcd-uuid
    config:
      temperature: 0.9 # Bulut sıcaklık değerini geçersiz kıl
      max_tokens: 2000 # Bulut max_tokens değerini geçersiz kıl
    label: 'Özel Etiket' # Görünen adı geçersiz kıl
```

Yerel yapılandırma önceliklidir ve şunları yapmanıza olanak tanır:

- API anahtarlarını bulutta merkezi olarak saklamak
- Değerlendirme başına model parametrelerini (temperature, max_tokens vb.) geçersiz kılmak
- Bulut hedefini değiştirmeden farklı yapılandırmaları test etmek
- Etiketleri ve diğer meta verileri yerel olarak özelleştirmek

Açıkça geçersiz kılınmadığı sürece bulut sağlayıcısından gelen tüm alanlar korunur.
