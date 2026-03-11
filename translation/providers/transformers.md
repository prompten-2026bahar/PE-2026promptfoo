---
sidebar_label: Transformers.js
description: Harici API'ler olmadan gömmeler ve metin üretimi için Transformers.js kullanarak yerel LLM çıkarımı yapın
---

# Transformers.js

Transformers.js sağlayıcısı, [Transformers.js](https://huggingface.co/docs/transformers.js) kullanarak tamamen yerel çıkarım yapılmasına olanak tanır. Harici API'lere veya GPU kurulumuna gerek duymadan ONNX optimize edilmiş modelleri doğrudan Node.js üzerinde çalıştırır.

## Kurulum

Transformers.js isteğe bağlı bir bağımlılıktır (ONNX çalışma zamanı için yaklaşık 200MB):

```bash
npm install @huggingface/transformers
```

## Hızlı Başlangıç

### Gömmeler (Embeddings)

```yaml
providers:
  - transformers:feature-extraction:Xenova/all-MiniLM-L6-v2
```

Popüler modeller: `Xenova/all-MiniLM-L6-v2` (384d), `Xenova/bge-small-en-v1.5` (384d), `nomic-ai/nomic-embed-text-v1.5` (768d)

### Metin Üretimi

```yaml
providers:
  - transformers:text-generation:Xenova/gpt2
```

Popüler modeller: `Xenova/gpt2`, `onnx-community/Qwen3-0.6B-ONNX`, `onnx-community/Llama-3.2-1B-Instruct-ONNX`

:::note
Metin üretimi CPU üzerinde çalışır ve test yapmak için en iyisidir. Üretim (production) için [Ollama](/docs/providers/ollama) veya bulut API'lerini değerlendirin.
:::

## Yapılandırma

### Ortak Seçenekler

Bu seçenekler hem gömme hem de metin üretim sağlayıcıları için geçerlidir:

| Seçenek          | Açıklama                                                            | Varsayılan      |
| ---------------- | ------------------------------------------------------------------- | --------------- |
| `device`         | `'auto'`, `'cpu'`, `'gpu'`, `'wasm'`, `'webgpu'`, `'cuda'`, `'dml'` | `'auto'`        |
| `dtype`          | Nicemleme (Quantization): `'fp32'`, `'fp16'`, `'q8'`, `'q4'`          | `'auto'`        |
| `cacheDir`       | Model önbellek dizinini geçersiz kıl                                | Sistem varsayılanı |
| `localFilesOnly` | İndirmeleri atla, sadece önbelleğe alınmış modelleri kullan           | `false`         |
| `revision`       | Model sürümü/dalı                                                   | `'main'`        |

### Gömme Seçenekleri

```yaml
providers:
  - id: transformers:feature-extraction:Xenova/bge-small-en-v1.5
    config:
      prefix: 'query: ' # BGE, E5 modelleri için gereklidir
      pooling: mean # 'mean', 'cls', 'first_token', 'eos', 'last_token', 'none'
      normalize: true # Gömmeleri L2 ile normalleştir
      dtype: q8
```

**Model önekleri:** BGE ve E5 modelleri, sorgular için `prefix: 'query: '` veya belgeler için `prefix: 'passage: '` gerektirir. MiniLM modelleri önek gerektirmez.

:::tip
`transformers:embeddings:<model>` ifadesi, `transformers:feature-extraction:<model>` için bir takma addır.
:::

### Metin Üretim Seçenekleri

```yaml
providers:
  - id: transformers:text-generation:onnx-community/Qwen3-0.6B-ONNX
    config:
      maxNewTokens: 256
      temperature: 0.7
      topK: 50
      topP: 0.9
      doSample: true
      repetitionPenalty: 1.1
      noRepeatNgramSize: 3
      numBeams: 1
      returnFullText: false
      dtype: q4
```

## Benzerlik İddiaları (Similarity Assertions) İçin Kullanım

`similar` iddiaları için yerel gömmeleri bir değerlendirme sağlayıcısı olarak kullanın:

```yaml
defaultTest:
  options:
    provider:
      embedding:
        id: transformers:feature-extraction:Xenova/all-MiniLM-L6-v2

providers:
  - openai:gpt-4o-mini

tests:
  - vars:
      question: 'Fotosentez nedir?'
    assert:
      - type: similar
        value: 'Fotosentez, bitkilerde ışık enerjisini kimyasal enerjiye dönüştürür'
        threshold: 0.8
```

Veya her iddia için geçersiz kılın:

```yaml
assert:
  - type: similar
    value: 'Beklenen çıktı'
    threshold: 0.75
    provider: transformers:feature-extraction:Xenova/all-MiniLM-L6-v2
```

## Performans

- **Önbelleğe Alma:** İşlem hatları (pipelines) ilk yüklemeden sonra önbelleğe alınır. İlk model indirme zaman alabilir, ancak sonraki çalışmalar hızlıdır.
- **Nicemleme (Quantization):** Daha hızlı çıkarım ve daha düşük bellek kullanımı için `dtype: q4` veya `dtype: q8` kullanın.
- **Eşzamanlılık:** Sınırlı RAM için, sıralı çalıştırmak üzere `promptfoo eval -j 1` kullanın.

## Sorun Giderme

| Sorun                           | Çözüm                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bağımlılık yüklü değil           | `npm install @huggingface/transformers` komutunu çalıştırın                                                                                             |
| Model bulunamadı                | Modelin [HuggingFace](https://huggingface.co/models?library=transformers.js) üzerinde ONNX ağırlıklarıyla mevcut olduğunu doğrulayın. `Xenova` veya `onnx-community` modellerini deneyin. |
| Bellek yetersiz (Out of memory) | `dtype: q4` kullanın, `-j 1` ile çalıştırın veya daha küçük modeller deneyin                                                                           |
| İlk çalışma yavaş               | Modeller ilk kullanımda indirilir. `await pipeline('feature-extraction', 'model-adi')` ile önceden indirin                                              |

## Desteklenen Modeller

Uyumlu modellere [huggingface.co/models?library=transformers.js](https://huggingface.co/models?library=transformers.js) adresinden göz atın.

Ana organizasyonlar: **Xenova** (optimize edilmiş ONNX modelleri), **onnx-community** (topluluk dışa aktarımları)
