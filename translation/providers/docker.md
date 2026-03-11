---
title: Docker Model Runner
sidebar_label: Docker Model Runner
description: Konteyner tabanlı test, dağıtım ve kıyaslama için Docker Model Runner ile yapay zeka modellerini yerel olarak çalıştırın ve değerlendirin
---

# Docker Model Runner

[Docker Model Runner](https://docs.docker.com/ai/model-runner/), Docker kullanarak yapay zeka modellerini yönetmeyi, çalıştırmayı ve dağıtmayı kolaylaştırır. Geliştiriciler için tasarlanan Docker Model Runner; büyük dil modellerini (LLM'ler) ve diğer yapay zeka modellerini doğrudan Docker Hub'dan veya herhangi bir OCI uyumlu kayıt defterinden çekme, çalıştırma ve sunma sürecini kolaylaştırır.

## Hızlı Başlangıç

1. Docker Desktop veya Docker Engine'de Docker Model Runner'ı etkinleştirin: https://docs.docker.com/ai/model-runner/#enable-docker-model-runner.
2. `ai/llama3.2:3B-Q4_K_M` modelini çekmek için Docker Model Runner CLI'yı kullanın:

```bash
docker model pull ai/llama3.2:3B-Q4_K_M
```

3. Kurulumunuzu çalışan örneklerle test edin:

```bash
npx promptfoo@latest eval -c https://raw.githubusercontent.com/promptfoo/promptfoo/main/examples/docker/promptfooconfig.comparison.simple.yaml
```

Birkaç modeli `llm-rubric` ve `similar` iddiaları (assertions) ile karşılaştıran bir değerlendirme için şu adrese bakın: https://raw.githubusercontent.com/promptfoo/promptfoo/main/examples/docker/promptfooconfig.comparison.advanced.yaml.

## Modeller

```
docker:chat:<model_adi>
docker:completion:<model_adi>
docker:embeddings:<model_adi>
docker:embedding:<model_adi>  # Embeddings için takma ad
docker:<model_adi>            # Varsayılan olarak chat moduna geçer
```

Not: Gömme (embedding) modelleri için hem `docker:embedding:` hem de `docker:embeddings:` önekleri desteklenir ve tamamen aynı şekilde çalışır.

Docker Hub üzerindeki küratörlü modellerin listesi için [Docker Hub Modelleri sayfasını](https://hub.docker.com/u/ai) ziyaret edin.

### Hugging Face Modelleri

Docker Model Runner, Hugging Face üzerindeki desteklenen modelleri (yani GGUF formatındaki modelleri) çekebilir. Hugging Face'te desteklenen tüm modellerin tam listesi için bu [HF arama sayfasını](https://huggingface.co/models?apps=docker-model-runner&sort=trending) ziyaret edin.

```
docker:chat:hf.co/<model_adi>
docker:completion:hf.co/<model_adi>
docker:embeddings:hf.co/<model_adi>
docker:embedding:hf.co/<model_adi>  # Embeddings için takma ad
docker:hf.co/<model_adi>             # Varsayılan olarak chat moduna geçer
```

## Yapılandırma

Sağlayıcıyı promptfoo yapılandırma dosyanızda yapılandırın:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: docker:ai/smollm3:Q4_K_M
    config:
      temperature: 0.7
```

### Yapılandırma Seçenekleri

Desteklenen ortam değişkenleri:

- `DOCKER_MODEL_RUNNER_BASE_URL` - (isteğe bağlı) protokol, ana bilgisayar adı ve bağlantı noktası. Varsayılan `http://localhost:12434`. Bir konteyner içinde çalışırken `http://model-runner.docker.internal` olarak ayarlayın.
- `DOCKER_MODEL_RUNNER_API_KEY` - (isteğe bağlı) API çağrılırken Yetkilendirme Üstbilgisinde (Authorization Header) Bearer jetonu olarak iletilen API anahtarı. OpenAI API doğrulamasını karşılamak için varsayılan olarak `dmr` değerini alır (Docker Model Runner tarafından kullanılmaz).

Standart OpenAI parametreleri desteklenir:

| Parametre           | Açıklama                                      |
| ------------------- | --------------------------------------------- |
| `temperature`       | Rastgeleliği kontrol eder (0.0 - 2.0)         |
| `max_tokens`        | Oluşturulacak maksimum token sayısı           |
| `top_p`             | Çekirdek örnekleme (nucleus sampling) parametresi |
| `frequency_penalty` | Sık kullanılan tokenleri cezalandırır         |
| `presence_penalty`  | Varlığa göre yeni tokenleri cezalandırır      |
| `stop`              | API'nin üretimi durduracağı diziler           |
| `stream`            | Akış yanıtlarını etkinleştir                  |

## Notlar

- Sistem kaynaklarını korumak için, değerlendirmeleri `promptfoo eval -j 1` komutuyla seri olarak çalıştırmayı düşünebilirsiniz.
