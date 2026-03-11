---
sidebar_label: WatsonX
description: Kurumsal düzeyde LLM testi için IBM WatsonX'in Granite ve Llama modellerini yapılandırın; kod üretimi, vizyon ve çok dilli görevler için özel destekle
---

# WatsonX

[IBM WatsonX](https://www.ibm.com/watsonx), çeşitli iş kullanım durumları için optimize edilmiş bir dizi kurumsal düzeyde temel model sunar. Bu sağlayıcı, `Granite` ve `Llama` serilerinden birkaç güçlü modelin yanı sıra kod üretimi, çok dilli görevler, vizyon işleme ve daha fazlası için ek modelleri destekler.

## Desteklenen Modeller

IBM watsonx.ai, çıkarım (inference) API'leri aracılığıyla temel modeller sağlar. promptfoo WatsonX sağlayıcısı şu anda doğrudan API aracılığıyla çağrılabilen **metin üretme ve sohbet modellerini** desteklemektedir.

:::tip Mevcut Modelleri Bulma

Bölgenizdeki en yeni modelleri görmek için IBM'in API'sini kullanın:

```bash
curl "https://us-south.ml.cloud.ibm.com/ml/v1/foundation_model_specs?version=2024-05-01" \
  -H "Authorization: Bearer TOKENINIZ"
```

:::

### Şu Anda Mevcut Olan Modeller

Metin üretimi ve sohbet için aşağıdaki modeller mevcuttur:

#### IBM Granite

- `ibm/granite-4-h-small` - En yeni 32B parametreli model
- `ibm/granite-3-3-8b-instruct` - **Önerilen** en yeni 8B talimat (instruct) modeli
- `ibm/granite-3-8b-instruct` - Standart 8B talimat modeli
- `ibm/granite-3-2-8b-instruct` - Akıl yürütme yeteneğine sahip 8B model
- `ibm/granite-3-2b-instruct` - Hafif 2B model (kullanımdan kaldırıldı - 3-3-8b kullanın)
- `ibm/granite-13b-instruct-v2` - 13B model (kullanımdan kaldırıldı - 3-3-8b kullanın)
- `ibm/granite-guardian-3-8b` - Güvenlik/koruma kalkanı (guardrail) modeli
- `ibm/granite-guardian-3-2b` - Daha küçük koruma kalkanı modeli (kullanımdan kaldırıldı)
- `ibm/granite-8b-code-instruct` - Kod üretimi uzmanı
- `ibm/granite-vision-3-2-2b` - Vizyon modeli (kullanımdan kaldırıldı)

#### Meta Llama

- `meta-llama/llama-4-maverick-17b-128e-instruct-fp8` - En yeni Llama 4 modeli
- `meta-llama/llama-3-3-70b-instruct` - En yeni Llama 3.3 (70B)
- `meta-llama/llama-3-405b-instruct` - Amiral gemisi 405B model
- `meta-llama/llama-3-2-11b-vision-instruct` - Vizyon modeli (11B)
- `meta-llama/llama-3-2-90b-vision-instruct` - Vizyon modeli (90B)
- `meta-llama/llama-guard-3-11b-vision` - Vizyon için güvenlik modeli
- `meta-llama/llama-2-13b-chat` - Eski Llama 2 modeli

#### Mistral

- `mistralai/mistral-large` - Amiral gemisi Mistral modeli
- `mistralai/mistral-medium-2505` - Orta seviye model (2025-05 sürümü)
- `mistralai/mistral-small-3-1-24b-instruct-2503` - Daha küçük talimat modeli
- `mistralai/pixtral-12b` - Vizyon modeli (12B)

#### Diğer Modeller

- `google/flan-t5-xl` - Google'ın T5 modeli (kullanımdan kaldırıldı)
- `openai/gpt-oss-120b` - Açık kaynaklı GPT uyumlu model

### Diğer Model Türleri

IBM watsonx.ai ayrıca şunları sunar:

- **İsteğe Bağlı Konuşlandırılan Modeller (Deploy on Demand Models)** - Önce özel bir dağıtım oluşturulmasını gerektiren, `-curated` son ekine sahip küratörlü modeller.
- **Embedding Modelleri** - Metin gömmeleri (embeddings) oluşturmak için (örn. `ibm/granite-embedding-278m-multilingual`).
- **Reranker Modelleri** - Arama sonuçlarını iyileştirmek için (örn. `cross-encoder/ms-marco-minilm-l-12-v2`).

:::info Şu Anda Desteklenmeyen Ek Model Türleri

promptfoo WatsonX sağlayıcısı sadece **metin üretme ve sohbet modellerine** odaklanır. Talep üzerine konuşlandırılan modeller, embedding ve reranker modelleri farklı API uç noktaları ve iş akışları kullanır. Bu model türleri için doğrudan IBM'in API'sini kullanın veya bir [özel sağlayıcı](/docs/providers/custom-api/) oluşturun.

:::

:::note Model Mevcudiyeti

- **Bölgeye özel**: Model mevcudiyeti IBM Cloud bölgesine göre değişir.
- **Sürüm değişiklikleri**: IBM, mevcut modelleri düzenli olarak günceller.
- **Kullanımdan kaldırma**: "Deprecated" (kullanımdan kaldırıldı) olarak işaretlenen modeller gelecekteki sürümlerde kaldırılacaktır.

Her zaman IBM'in API'sini kullanarak mevcut durumu doğrulayın veya watsonx.ai projenizin model kataloğunu kontrol edin.

:::

## Ön Koşullar

WatsonX sağlayıcısını entegre etmeden önce aşağıdakilere sahip olduğunuzdan emin olun:

1. **IBM Cloud Hesabı**: WatsonX modellerine API erişimi elde etmek için bir IBM Cloud hesabına ihtiyacınız olacak.

2. **API Anahtarı veya Taşıyıcı Token ve Proje Kimliği**:
   - **API Anahtarı**: [IBM Cloud Hesabınıza](https://cloud.ibm.com) giriş yapıp "API Keys" (API Anahtarları) bölümüne giderek alabilirsiniz.
   - **Taşıyıcı Token (Bearer Token)**: Taşıyıcı token almak için [bu kılavuzu](https://cloud.ibm.com/docs/account?topic=account-iamtoken_from_apikey) takip edin.
   - **Proje Kimliği (Project ID)**: IBM WatsonX Prompt Lab'a giriş yapın, projenizi seçin ve verilen `curl` komutundaki proje kimliğini bulun.

Devam etmeden önce API anahtarına veya taşıyıcı tokena ve proje kimliğine sahip olduğunuzdan emin olun.

## Kurulum

WatsonX sağlayıcısını kurmak için aşağıdaki adımları izleyin:

1. Gerekli bağımlılıkları kurun:

   ```sh
   npm install @ibm-cloud/watsonx-ai ibm-cloud-sdk-core
   ```

2. Gerekli ortam değişkenlerini ayarlayın:

   İki kimlik doğrulama yöntemi arasından seçim yapabilirsiniz:

   **Seçenek 1: IAM Kimlik Doğrulaması (Önerilen)**

   ```sh
   export WATSONX_AI_APIKEY=ibm-cloud-api-anahtariniz
   export WATSONX_AI_PROJECT_ID=proje-kimliginiz
   ```

   **Seçenek 2: Taşıyıcı Token (Bearer Token) Kimlik Doğrulaması**

   ```sh
   export WATSONX_AI_BEARER_TOKEN=tasiyici-tokeniniz
   export WATSONX_AI_PROJECT_ID=proje-kimliginiz
   ```

   **Belirli Bir Kimlik Doğrulama Yöntemini Zorla (İsteğe Bağlı)**

   ```sh
   export WATSONX_AI_AUTH_TYPE=iam  # veya 'bearertoken'
   ```

   :::note Kimlik Doğrulama Önceliği

   `WATSONX_AI_AUTH_TYPE` ayarlanmamışsa, sağlayıcı otomatik olarak şunları kullanacaktır:
   1. `WATSONX_AI_APIKEY` mevcutsa IAM kimlik doğrulaması.
   2. `WATSONX_AI_BEARER_TOKEN` mevcutsa taşıyıcı token kimlik doğrulaması.

   :::

3. Alternatif olarak, kimlik doğrulama ve proje kimliğini doğrudan yapılandırma dosyasında yapılandırabilirsiniz:

   ```yaml
   providers:
     - id: watsonx:ibm/granite-3-3-8b-instruct
       config:
         # Seçenek 1: IAM Kimlik Doğrulaması
         apiKey: ibm-cloud-api-anahtariniz

         # Seçenek 2: Taşıyıcı Token Kimlik Doğrulaması
         # apiBearerToken: ibm-cloud-tasiyici-tokeniniz

         projectId: ibm-proje-kimliginiz
         serviceUrl: https://us-south.ml.cloud.ibm.com
   ```

### Kullanım Örnekleri

Yapılandırıldıktan sonra, istemlere dayalı metin yanıtları oluşturmak için WatsonX sağlayıcısını kullanabilirsiniz. İşte **Granite 3.3 8B Instruct** modelini kullanan bir örnek:

```yaml
providers:
  - watsonx:ibm/granite-3-3-8b-instruct

prompts:
  - "Şu soruyu cevapla: '{{question}}'"

tests:
  - vars:
      question: 'Fransa"nın başkenti neresidir?'
    assert:
      - type: contains
        value: 'Paris'
```

Model kimliğini değiştirerek diğer modelleri de kullanabilirsiniz:

```yaml
providers:
  # IBM Granite modelleri
  - watsonx:ibm/granite-4-h-small
  - watsonx:ibm/granite-3-8b-instruct

  # Meta Llama modelleri
  - watsonx:meta-llama/llama-3-3-70b-instruct
  - watsonx:meta-llama/llama-3-405b-instruct

  # Mistral modelleri
  - watsonx:mistralai/mistral-large
  - watsonx:mistralai/mixtral-8x7b-instruct-v01
```

## Yapılandırma Seçenekleri

### Metin Üretme Parametreleri

WatsonX sağlayıcısı, IBM SDK'daki tüm metin üretme parametrelerini destekler:

| Parametre             | Tür      | Açıklama                                   |
| --------------------- | -------- | ------------------------------------------ |
| `maxNewTokens`        | sayı     | Üretilecek maksimum token (varsayılan: 100) |
| `minNewTokens`        | sayı     | Durdurma dizileri uygulanmadan önceki min token |
| `temperature`         | sayı     | Örnekleme sıcaklığı (0-2)                  |
| `topP`                | sayı     | Çekirdek örnekleme parametresi (0-1)        |
| `topK`                | sayı     | Top-k örnekleme parametresi                |
| `decodingMethod`      | dize     | `'greedy'` veya `'sample'`                 |
| `stopSequences`       | dize[]   | Üretimin durmasına neden olan diziler      |
| `repetitionPenalty`   | sayı     | Tekrarlanan tokenlar için ceza             |
| `randomSeed`          | sayı     | Tekrarlanabilir çıktılar için çekirdek     |
| `timeLimit`           | sayı     | Milisaniye cinsinden zaman sınırı          |
| `truncateInputTokens` | sayı     | Kırpmadan önceki maksimum giriş tokenı     |
| `includeStopSequence` | boolean  | Çıktıya durdurma dizisini dahil et         |
| `lengthPenalty`       | nesne    | Uzunluk cezası yapılandırması              |

#### Parametrelerle Örnek

```yaml
providers:
  - id: watsonx:ibm/granite-3-3-8b-instruct
    config:
      temperature: 0.7
      topP: 0.9
      topK: 50
      maxNewTokens: 1024
      stopSequences: ['END', 'STOP']
      repetitionPenalty: 1.1
      decodingMethod: sample
```

#### Uzunluk Cezası (Length Penalty)

Çıktı uzunluğu üzerinde daha fazla kontrol için:

```yaml
providers:
  - id: watsonx:ibm/granite-3-3-8b-instruct
    config:
      lengthPenalty:
        decayFactor: 1.5
        startIndex: 10
```

## Sohbet Modu (Chat Mode)

WatsonX ayrıca `textChat` API'sini kullanarak sohbet tarzı etkileşimleri destekler. `watsonx:chat:` önekini kullanın:

```yaml
providers:
  - id: watsonx:chat:ibm/granite-3-3-8b-instruct
    config:
      temperature: 0.7
      maxNewTokens: 1024
```

Sohbet modu, JSON formatındaki mesajları otomatik olarak ayrıştırır:

```yaml
prompts:
  - |
    [
      {"role": "system", "content": "Yardımsever bir asistansınız."},
      {"role": "user", "content": "{{question}}"}
    ]

providers:
  - watsonx:chat:ibm/granite-3-3-8b-instruct
```

Düz metin istemleri için sohbet sağlayıcısı bunları otomatik olarak bir kullanıcı mesajı olarak sarmalar.

### Sohbet vs Metin Üretimi

| Özellik         | Metin Üretimi (`watsonx:`) | Sohbet (`watsonx:chat:`)      |
| --------------- | -------------------------- | ---------------------------- |
| API Yöntemi     | `generateText`             | `textChat`                   |
| Giriş Formatı   | Düz metin                  | Mesaj dizisi veya düz metin  |
| En İyi Kullanım | Tamamlama görevleri        | Konuşma uygulamaları         |
| Sistem Mesajları| Desteklenmiyor             | Destekleniyor                |

## Ortam Değişkenleri

| Değişken                  | Açıklama                                     |
| ------------------------- | -------------------------------------------- |
| `WATSONX_AI_APIKEY`       | IAM kimlik doğrulaması için IBM Cloud API anahtarı |
| `WATSONX_AI_BEARER_TOKEN` | Token tabanlı kimlik doğrulama için taşıyıcı token |
| `WATSONX_AI_PROJECT_ID`   | WatsonX proje kimliği                        |
| `WATSONX_AI_AUTH_TYPE`    | Kimlik denetimi türünü zorla: `iam` veya `bearertoken` |

## IBM BAM'dan Göç Etme

IBM BAM sağlayıcısı kullanımdan kaldırılmıştır (Mart 2025'te sona erdi). Göç etmek için:

1. Sağlayıcı önekini `bam:` yerinden `watsonx:` yerine değiştirin.
2. Kimlik doğrulamasını WatsonX kimlik bilgilerini kullanacak şekilde güncelleyin.
3. Model kimliklerini WatsonX karşılıklarıyla güncelleyin (örn. `ibm/granite-3-3-8b-instruct`).
