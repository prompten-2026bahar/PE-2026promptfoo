---
sidebar_label: Yanıt Alaka Düzeyi
description: 'Kullanıcı sorgularına karşı LLM yanıtlarının alaka düzeyini ve bütünlüğünü gelişmiş AI tabanlı değerlendirme metrikleriyle puanlayın'
---

# Yanıt Alaka Düzeyi

`answer-relevance` assertion'ı, bir LLM çıktısının orijinal sorguyla ne kadar alakalı olduğunu değerlendirir. Alaka tayini için embedding benzerliği ile LLM değerlendirmesinin birleşimini kullanır.

### Nasıl kullanılır

`answer-relevance` assertion türünü kullanmak için test yapılandırmanıza şu şekilde ekleyin:

```yaml
assert:
  - type: answer-relevance
    threshold: 0.7 # 0 ile 1 arasında puan
```

### Nasıl çalışır

Yanıt alaka denetleyicisi şunları yapar:

1. Çıktının hangi soruları cevaplamaya uygun olabileceğini üretmek için bir LLM kullanır
2. Bu soruları embedding benzerliği ile orijinal sorgu ile karşılaştırır
3. Benzerlik puanlarına dayanarak bir alaka skoru hesaplar

Daha yüksek bir `threshold`, çıktının orijinal sorguyla daha yakından ilişkili olmasını gerektirir.

### Örnek Yapılandırma

Aşağıda `answer-relevance` kullanımını gösteren eksiksiz bir örnek bulunmaktadır:

```yaml
prompts:
  - 'Bana {{topic}} hakkında bilgi ver'
providers:
  - openai:gpt-5
tests:
  - vars:
      topic: quantum computing
    assert:
      - type: answer-relevance
        threshold: 0.8
```

### Sağlayıcıları Geçersiz Kılma

Answer relevance iki tür sağlayıcı kullanır:

- Soru üretimi için bir metin sağlayıcısı
- Benzerlik hesaplamak için bir embedding sağlayıcısı

Her ikisini de veya yalnızca birini geçersiz kılabilirsiniz:

```yaml
defaultTest:
  options:
    provider:
      text:
        id: gpt-5
        config:
          temperature: 0
      embedding:
        id: openai:text-embedding-ada-002
```

Ayrıca sağlayıcıları assertion düzeyinde de geçersiz kılabilirsiniz:

```yaml
assert:
  - type: answer-relevance
    threshold: 0.8
    provider:
      text: anthropic:claude-2
      embedding: cohere:embed-english-v3.0
```

### Prompt'u Özelleştirme

`rubricPrompt` özelliğini kullanarak soru üretme prompt'unu özelleştirebilirsiniz:

```yaml
defaultTest:
  options:
    rubricPrompt: |
      Verilen bu cevap: {{output}}

      Bu cevabın uygun olacağı 3 soru üretin.
      Soruları içeriğe özgü ve doğrudan ilişkili olacak şekilde oluşturun.
```

# Daha fazla okuma

[model-graded metrics](/docs/configuration/expected-outputs/model-graded) sayfasına bakın for daha fazla seçenek.