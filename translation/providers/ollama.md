---
sidebar_label: Ollama
description: "Hızlı prototipleme ve çevrimdışı model değerlendirmesi için Ollama'nın kolaylaştırılmış arayüzünü kullanarak açık kaynaklı LLM'leri yerel olarak çalıştırın"
---

# Ollama

`ollama` sağlayıcısı; Llama, Mixtral, Mistral ve daha fazlasına erişim sağlayan [Ollama](https://github.com/jmorganca/ollama) ile uyumludur.

[Ollama kütüphanesinden](https://ollama.ai/library) aşağıdaki sağlayıcılardan herhangi birini belirterek `/api/generate` uç noktasını kullanabilirsiniz:

- `ollama:completion:llama3.2`
- `ollama:completion:llama3.3`
- `ollama:completion:phi4`
- `ollama:completion:qwen2.5`
- `ollama:completion:granite3.2`
- `ollama:completion:deepcoder`
- `ollama:completion:codellama`
- `ollama:completion:llama2-uncensored`
- ...

Veya sohbet formatındaki istemler için `/api/chat` uç noktasını kullanın:

- `ollama:chat:llama3.2`
- `ollama:chat:llama3.2:1b`
- `ollama:chat:llama3.2:3b`
- `ollama:chat:llama3.3`
- `ollama:chat:llama3.3:70b`
- `ollama:chat:phi4`
- `ollama:chat:phi4-mini`
- `ollama:chat:qwen2.5`
- `ollama:chat:qwen2.5:14b`
- `ollama:chat:qwen2.5:72b`
- `ollama:chat:qwq:32b`
- `ollama:chat:granite3.2`
- `ollama:chat:granite3.2:2b`
- `ollama:chat:granite3.2:8b`
- `ollama:chat:deepcoder`
- `ollama:chat:deepcoder:1.5b`
- `ollama:chat:deepcoder:14b`
- `ollama:chat:mixtral:8x7b`
- `ollama:chat:mixtral:8x22b`
- ...

Ayrıca, [benzerlik (similarity)](/docs/configuration/expected-outputs/similar/) gibi model bazlı değerlendirmeler (model-graded assertions) için `ollama:embeddings:<model adi>` aracılığıyla `/api/embeddings` uç noktasını destekliyoruz.

Desteklenen ortam değişkenleri:

- `OLLAMA_BASE_URL` - protokol, ana bilgisayar adı ve bağlantı noktası (varsayılan: `http://localhost:11434`)
- `OLLAMA_API_KEY` - (isteğe bağlı) API'yi çağırırken Yetkilendirme Başlığında (Authorization Header) Bearer jetonu olarak iletilen API anahtarı
- `REQUEST_TIMEOUT_MS` - milisaniye cinsinden istek zaman aşımı

Yapılandırma seçeneklerini Ollama'ya iletmek için `config` anahtarını şu şekilde kullanın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: ollama:chat:llama3.3
    config:
      num_predict: 1024
      temperature: 0.7
      top_p: 0.9
      think: true # Düşünme/akıl yürütme modunu etkinleştir (üst düzey API parametresi)
```

Ayrıca `passthrough` seçeneğini kullanarak doğrudan Ollama API'sine isteğe bağlı alanlar iletebilirsiniz:

```yaml title="promptfooconfig.yaml"
providers:
  - id: ollama:chat:llama3.3
    config:
      passthrough:
        keep_alive: '5m'
        format: 'json'
        # Diğer tüm Ollama API alanları
```

## Fonksiyon Çağırma (Function Calling)

Fonksiyon çağırmayı destekleyen Ollama sohbet modelleri (Llama 3.1, Llama 3.3, Qwen ve diğerleri gibi), `tools` yapılandırmasıyla araçları kullanabilir:

```yaml title="promptfooconfig.yaml"
prompts:
  - '{{city}} şehrinde hava nasıl?'

providers:
  - id: ollama:chat:llama3.3
    config:
      tools:
        - type: function
          function:
            name: get_current_weather
            description: Belirli bir konumdaki mevcut hava durumunu al
            parameters:
              type: object
              properties:
                location:
                  type: string
                  description: Şehir ve eyalet/ülke, örn. İstanbul, TR
                unit:
                  type: string
                  enum: [celsius, fahrenheit]
              required: [location]

tests:
  - vars:
      city: Boston
    assert:
      - type: is-valid-openai-tools-call
```

## Ollama'yı Yerel Değerlendirme Sağlayıcısı Olarak Kullanma

### Model Bazlı Değerlendirmeler İçin Ollama Kullanımı

Ollama, dil modeli değerlendirmesi gerektiren iddialar için yerel bir değerlendirme sağlayıcısı olarak kullanılabilir. Hem metne dayalı iddiaları (`llm-rubric`, `answer-relevance`) hem de gömme tabanlı iddiaları (`similar`) kullanan testleriniz olduğunda, her tür için farklı Ollama modelleri yapılandırabilirsiniz:

```yaml title="promptfooconfig.yaml"
defaultTest:
  options:
    provider:
      # llm-rubric, answer-relevance, factuality vb. için metin sağlayıcısı.
      text:
        id: ollama:chat:gemma3:27b
        config:
          temperature: 0.1

      # Benzerlik iddiaları için gömme sağlayıcısı
      embedding:
        id: ollama:embeddings:nomic-embed-text
        config:
          # gerekirse gömmeye özel yapılandırma

providers:
  - ollama:chat:llama3.3
  - ollama:chat:qwen2.5:14b

tests:
  - vars:
      question: 'Fransa"nın başkenti neresidir?'
    assert:
      # Metin sağlayıcısını kullanır (gemma3:27b)
      - type: llm-rubric
        value: 'Yanıt, Paris"i başkent olarak doğru bir şekilde tanımlıyor'

      # Gömme sağlayıcısını kullanır (nomic-embed-text)
      - type: similar
        value: 'Paris, Fransa"nın başkentidir'
        threshold: 0.85
```

### Benzerlik İddiaları İçin Ollama Gömme Modellerini Kullanma

Çıktılar ile beklenen değerler arasındaki anlamsal benzerliği kontrol etmek için Ollama'nın gömme modelleri `similar` iddiasıyla kullanılabilir:

```yaml title="promptfooconfig.yaml"
providers:
  - ollama:chat:llama3.2

defaultTest:
  assert:
    - type: similar
      value: 'Beklenen yanıt kavramı açıkça açıklamalıdır'
      threshold: 0.8
      # Ollama kullanmak için varsayılan gömme sağlayıcısını geçersiz kılın
      provider: ollama:embeddings:nomic-embed-text

tests:
  - vars:
      question: 'Fotosentez nedir?'
    assert:
      - type: similar
        value: 'Fotosentez, bitkilerin ışık enerjisini kimyasal enerjiye dönüştürdüğü süreçtir'
        threshold: 0.85
```

Ayrıca gömme sağlayıcısını tüm benzerlik iddiaları için küresel olarak ayarlayabilirsiniz:

```yaml title="promptfooconfig.yaml"
defaultTest:
  options:
    provider:
      embedding:
        id: ollama:embeddings:nomic-embed-text
  assert:
    - type: similar
      value: 'Beklenen anlamsal içerik'
      threshold: 0.75

providers:
  - ollama:chat:llama3.2

tests:
  # Test durumlarınız buraya
```

Popüler Ollama gömme modelleri şunları içerir:

- `ollama:embeddings:nomic-embed-text` - Genel amaçlı gömmeler
- `ollama:embeddings:mxbai-embed-large` - Yüksek kaliteli gömmeler
- `ollama:embeddings:all-minilm` - Hafif ve hızlı gömmeler

## `localhost` ve IPv4 - IPv6 Karşılaştırması

Yerel olarak `localhost` (promptfoo'nun varsayılanı) ile geliştirme yapıyorsanız ve Ollama API çağrıları `ECONNREFUSED` ile başarısız oluyorsa, `localhost` ile ilgili bir IPv4 ve IPv6 sorunu olabilir.
Ollama'nın varsayılan ana bilgisayarı bir IPv4 adresi olan [`127.0.0.1`](https://github.com/jmorganca/ollama/blob/main/api/client.go#L19) adresini kullanır.
Olası sorun, `localhost`un işletim sisteminin `hosts` dosyası tarafından yapılandırıldığı üzere bir IPv6 adresine bağlı olmasından kaynaklanır.
Bu sorunu araştırmak ve düzeltmek için birkaç olası çözüm vardır:

1. Ollama sunucusunu başlatmadan önce `export OLLAMA_HOST=":11434"` komutunu çalıştırarak Ollama sunucusunu IPv6 adreslemesini kullanacak şekilde değiştirin. Not: Bu IPv6 desteği Ollama sürüm `0.0.20` veya daha yenisini gerektirir.
2. `export OLLAMA_BASE_URL="http://127.0.0.1:11434"` yapılandırmasını yaparak promptfoo'nun doğrudan bir IPv4 adresi kullanmasını sağlayın.
3. İşletim sisteminizin [`hosts`](<https://en.wikipedia.org/wiki/Hosts_(file)>) dosyasını `localhost`u IPv4'e bağlayacak şekilde güncelleyin.

## Modelleri Sıralı Olarak Değerlendirme

Varsayılan olarak promptfoo, her istem için tüm sağlayıcıları eşzamanlı olarak değerlendirir. Ancak `-j 1` seçeneğini kullanarak değerlendirmeleri sıralı olarak çalıştırabilirsiniz:

```bash
promptfoo eval -j 1
```

Bu, eşzamanlılığı 1 olarak ayarlar; bu da şu anlama gelir:

1. Değerlendirmeler her seferinde bir sağlayıcı, ardından her seferinde bir istem olacak şekilde gerçekleşir.
2. Belleğe aynı anda yalnızca bir model yüklenir ve sistem kaynakları korunur.
3. Çakışma olmadan değerlendirmeler arasında modelleri kolayca değiştirebilirsiniz.

bu yaklaşım özellikle şunlar için yararlıdır:

- Sınırlı RAM'e sahip yerel kurulumlar
- Çok sayıda kaynak yoğunluklu modeli test etme
- Sağlayıcıya özel sorunları giderme
