---
sidebar_label: HuggingFace
description: OpenAI uyumlu sohbet API'si ve Çıkarım Sağlayıcıları (Inference Providers) aracılığıyla HuggingFace sohbet modellerini, metin sınıflandırmasını, gömmeleri ve NER'i promptfoo ile kullanın
---

# HuggingFace

Promptfoo; HuggingFace'in [OpenAI uyumlu sohbet API'si](https://huggingface.co/docs/huggingface_hub/guides/inference#openai-compatibility), [Çıkarım Sağlayıcıları (Inference Providers)](https://huggingface.co/docs/inference-providers) ve [Veri Setleri (Datasets)](https://huggingface.co/docs/datasets) için destek içerir.

Bir modeli çalıştırmak için görev türünü ve model adını belirtin. Desteklenen görev türleri şunlardır:

- `huggingface:chat:<model adı>` - **LLM sohbet modelleri için önerilir**
- `huggingface:text-generation:<model adı>` - Metin üretimi (Inference API)
- `huggingface:text-classification:<model adı>` - Metin sınıflandırma
- `huggingface:token-classification:<model adı>` - Token sınıflandırma
- `huggingface:feature-extraction:<model adı>` - Özellik çıkarımı (gömmeler için)
- `huggingface:sentence-similarity:<model adı>` - Cümle benzerliği

## Sohbet modelleri (önerilir)

LLM sohbet modelleri için, HuggingFace'in OpenAI uyumlu `/v1/chat/completions` uç noktasına bağlanan `huggingface:chat` sağlayıcısını kullanın:

```yaml
providers:
  - id: huggingface:chat:deepseek-ai/DeepSeek-R1
    config:
      temperature: 0.7
      max_new_tokens: 1000

  - id: huggingface:chat:openai/gpt-oss-120b

  - id: huggingface:chat:Qwen/Qwen2.5-Coder-32B-Instruct

  - id: huggingface:chat:meta-llama/Llama-3.3-70B-Instruct
```

Bu sağlayıcı, OpenAI sağlayıcısını genişletir ve aşağıdakiler dahil olmak üzere OpenAI uyumlu özellikleri destekler:

- Uygun mesaj formatlama
- Araç/fonksiyon çağırma (modele bağlıdır)
- Akışlı (streaming) yanıt (modele bağlıdır)
- Token sayma (sağlayıcı tarafından döndürüldüğünde)

Mevcut sohbet modellerine [huggingface.co/models?other=conversational](https://huggingface.co/models?other=conversational) adresinden göz atabilirsiniz.

### Çıkarım Sağlayıcısı (Inference Provider) yönlendirmesi

HuggingFace, istekleri farklı [Çıkarım Sağlayıcıları](https://huggingface.co/docs/inference-providers) (Cerebras, Together, Fireworks AI vb.) üzerinden yönlendirir. Bazı modeller bir sağlayıcının açıkça belirtilmesini gerektirir.

Model adında `:provider` son ekini kullanarak veya `inferenceProvider` yapılandırma seçeneği aracılığıyla bir sağlayıcı seçebilirsiniz:

```yaml
providers:
  # Model adında sağlayıcı son eki
  - id: huggingface:chat:Qwen/QwQ-32B:featherless-ai

  # Veya yapılandırma seçeneği aracılığıyla
  - id: huggingface:chat:Qwen/QwQ-32B
    config:
      inferenceProvider: featherless-ai
```

Her ikisi de belirtilirse, model adındaki `:provider` son eki, yapılandırmadaki `inferenceProvider` seçeneğine göre öncelik kazanır.

Ayrıca akıllı seçiciler olarak `fastest` (en hızlı) veya `cheapest` (en ucuz) kullanabilirsiniz:

```yaml
providers:
  - id: huggingface:chat:meta-llama/Llama-3.3-70B-Instruct:fastest
```

Mevcut modeller ve sağlayıcılar zamanla değişir. Bir modelin şu anda hangi sağlayıcılar tarafından desteklendiğini bulmak için HuggingFace üzerindeki model sayfasını kontrol edin veya API'yi sorgulayın:

```bash
curl https://huggingface.co/api/models/MODEL_ID?expand[]=inferenceProviderMapping
```

:::note

`huggingface:text-generation` sağlayıcısı, OpenAI uyumlu bir uç nokta ile yapılandırıldığında sohbet tamamlama formatını da destekler (bkz. [Geriye Dönük Uyumluluk](#geriye-donuk-uyumluluk)).

:::

## Çıkarım (Inference) API'si görevleri

:::note

HuggingFace sunucusuz çıkarım API'si (`hf-inference`), öncelikle metin sınıflandırma, gömmeler ve NER gibi CPU çıkarım görevlerine odaklanır. LLM metin üretimi için yukarıdaki [sohbet sağlayıcısını](#sohbet-modelleri-onerilir) kullanın.

Mevcut modellere [huggingface.co/models?inference_provider=hf-inference](https://huggingface.co/models?inference_provider=hf-inference) adresinden göz atabilirsiniz.

:::

## Örnekler

Duygu analizi için metin sınıflandırma:

```text
huggingface:text-classification:cardiffnlp/twitter-roberta-base-sentiment-latest
```

İstem enjeksiyonu (prompt injection) tespiti:

```text
huggingface:text-classification:protectai/deberta-v3-base-prompt-injection
```

Varlık ismi tanıma (Named Entity Recognition - NER):

```text
huggingface:token-classification:dslim/bert-base-NER
```

sentence-transformers ile gömmeler:

```yaml
# Cümle benzerliği
huggingface:sentence-similarity:sentence-transformers/all-MiniLM-L6-v2

# Gömmeler için özellik çıkarımı
huggingface:feature-extraction:BAAI/bge-small-en-v1.5
```

## Yapılandırma

Bu yaygın HuggingFace yapılandırma parametreleri desteklenir:

| Parametre              | Tür     | Açıklama                                                                                                       |
| ---------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `top_k`                | number  | Top-k örnekleme stratejisi aracılığıyla çeşitliliği kontrol eder.                                              |
| `top_p`                | number  | Çekirdek örnekleme (nucleus sampling) aracılığıyla çeşitliliği kontrol eder.                                   |
| `temperature`          | number  | Üretimdeki rastgeleliği kontrol eder.                                                                          |
| `repetition_penalty`   | number  | Tekrar cezası.                                                                                                 |
| `max_new_tokens`       | number  | Oluşturulacak maksimum yeni token sayısı.                                                                      |
| `max_time`             | number  | Modelin yanıt vermesi gereken maksimum süre (saniye).                                                          |
| `return_full_text`     | boolean | Tüm metni mi yoksa sadece yeni metni mi döndüreceği.                                                           |
| `num_return_sequences` | number  | Döndürülecek dizi sayısı.                                                                                      |
| `do_sample`            | boolean | Çıktının örneklenip örneklenmeyeceği.                                                                          |
| `use_cache`            | boolean | Önbelleğe almanın kullanılıp kullanılmayacağı.                                                                 |
| `wait_for_model`       | boolean | Modelin hazır olmasının beklenip beklenmeyeceği. "Model şu anda yükleniyor" hatasını gidermek için yararlıdır. |

Ek olarak, `config` nesnesindeki diğer tüm anahtarlar doğrudan HuggingFace'e iletilir. Kullandığınız model tarafından desteklenen özel parametreleri kontrol ettiğinizden emin olun.

Sağlayıcı ayrıca şu yerleşik promptfoo parametrelerini destekler:

| Parametre           | Tür    | Açıklama                                                                                           |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| `apiKey`            | string | HuggingFace API anahtarınız.                                                                       |
| `apiEndpoint`       | string | Model için özel API uç noktası.                                                                    |
| `inferenceProvider` | string | Belirli bir [Çıkarım Sağlayıcısına](https://huggingface.co/docs/inference-providers) adıyla yönlendir. |

Desteklenen ortam değişkenleri:

- `HF_TOKEN` - HuggingFace API jetonunuz (önerilen)
- `HF_API_TOKEN` - HuggingFace API jetonunuz için alternatif ad

Sağlayıcı, yapılandırma parametrelerini API'ye iletebilir. Göreve özgü parametreler için [HuggingFace Çıkarım API'si belgelerine](https://huggingface.co/docs/api-inference/tasks/overview) bakın.

İşte bu sağlayıcının promptfoo yapılandırmanızda nasıl görünebileceğine dair bir örnek:

```yaml
providers:
  - id: huggingface:text-classification:cardiffnlp/twitter-roberta-base-sentiment-latest
```

İstem enjeksiyonu tespiti için bir iddia (assertion) olarak kullanım:

```yaml
tests:
  - vars:
      input: 'Merhaba, nasılsın?'
    assert:
      - type: classifier
        provider: huggingface:text-classification:protectai/deberta-v3-base-prompt-injection
        value: SAFE
        threshold: 0.9
```

## Geriye dönük uyumluluk {#geriye-donuk-uyumluluk}

`huggingface:text-generation` sağlayıcısı, uç nokta URL'sine göre ne zaman sohbet tamamlama formatını kullanacağını otomatik olarak algılar. Eğer `apiEndpoint` değeriniz `/v1/chat` içeriyorsa, otomatik olarak OpenAI uyumlu formatı kullanacaktır:

```yaml
providers:
  # URL'den sohbet tamamlama formatını otomatik algılar
  - id: huggingface:text-generation:meta-llama/Llama-3.1-8B-Instruct
    config:
      apiEndpoint: https://router.huggingface.co/v1/chat/completions

  # Açık chatCompletion bayrağı (isteğe bağlı)
  - id: huggingface:text-generation:my-model
    config:
      apiEndpoint: https://ozel-uc-noktam.com/api
      chatCompletion: true # Sohbet tamamlama formatını zorla
```

`/v1/chat` uç noktaları için bile `chatCompletion: false` ile sohbet tamamlama formatını açıkça devre dışı bırakabilirsiniz.

## Çıkarım (Inference) uç noktaları

HuggingFace, özel barındırılan çıkarım uç noktaları için ödeme yapma imkanı sunar. Öncelikle, [Yeni Uç Nokta Oluştur](https://ui.endpoints.huggingface.co/new) sayfasına gidin ve bir model ile barındırma kurulumu seçin.

![huggingface çıkarım uç noktası oluşturma](/img/docs/huggingface-create-endpoint.png)

Uç nokta oluşturulduktan sonra, sayfada gösterilen `Endpoint URL`yi alın:

![huggingface çıkarım uç noktası url'si](/img/docs/huggingface-inference-endpoint.png)

Ardından promptfoo yapılandırmanızı şu şekilde kurun:

```yaml
description: 'HF özel çıkarım uç noktası'

prompts:
  - '{{topic}} hakkında bir tweet yaz:'

providers:
  - id: huggingface:text-generation:gemma-7b-it
    config:
      apiEndpoint: https://v9igsezez4ei3cq4.us-east-1.aws.endpoints.huggingface.cloud
      # apiKey: abc123   # Veya HF_API_TOKEN ortam değişkenini ayarlayın

tests:
  - vars:
      topic: muzlar
  - vars:
      topic: patatesler
```

## Yerel çıkarım

Eğer [Huggingface Metin Üretimi Çıkarımı (TGI)](https://github.com/huggingface/text-generation-inference) sunucusunu yerel olarak çalıştırıyorsanız, `apiEndpoint` değerini geçersiz kılın:

```yaml
providers:
  - id: huggingface:text-generation:my-local-model
    config:
      apiEndpoint: http://127.0.0.1:8080/generate
```

## Kimlik Doğrulama

Özel veri setlerine erişmeniz gerekiyorsa veya hız sınırlarınızı artırmak istiyorsanız, HuggingFace jetonunuzu kullanarak kimlik doğrulaması yapabilirsiniz. `HF_TOKEN` ortam değişkenini jetonunuzla ayarlayın:

```bash
export HF_TOKEN=jetonunuz_buraya
```

## Veri Setleri (Datasets)

Promptfoo, test durumlarını doğrudan HuggingFace veri setlerinden içe aktarabilir. Örnekler ve sorgu parametresi detayları için [HuggingFace Veri Setlerinden Test Durumlarını Yükleme](/docs/configuration/huggingface-datasets) sayfasına bakın.
