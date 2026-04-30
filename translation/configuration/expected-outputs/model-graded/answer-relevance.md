---
sidebar_label: Answer Relevance
description: 'Gelişmiş yapay zeka destekli değerlendirme metrikleri kullanarak LLM yanıtlarının kullanıcı sorgularına uygunluğunu ve tamlığını puanlayın'
---

# Answer Relevance

`answer-relevance` assertion'ı, bir LLM çıktısının orijinal sorguyla ne kadar ilgili olduğunu değerlendirir. Uygunluğu belirlemek için embedding benzerliği ile LLM değerlendirmesinin birleşimini kullanır.

### Nasıl kullanılır

`answer-relevance` assertion türünü kullanmak için, test yapılandırmanıza aşağıdaki gibi ekleyin:

```yaml
assert:
  - type: answer-relevance
    threshold: 0.7 # 0 ile 1 arasında puan
```

### Nasıl çalışır

Yanıt uygunluğu denetleyicisi:

1. Çıktının yanıtlıyor olabileceği olası soruları üretmek için bir LLM kullanır
2. Bu soruları embedding benzerliği kullanarak orijinal sorguyla karşılaştırır
3. Benzerlik puanlarına dayanarak bir uygunluk puanı hesaplar

Daha yüksek bir threshold değeri, çıktının orijinal sorguyla daha yakından ilişkili olmasını gerektirir.

### Örnek Yapılandırma

Aşağıda, answer relevance kullanımını gösteren tam bir örnek yer alır:

```yaml
prompts:
  - '{{topic}} hakkında bilgi ver'
providers:
  - openai:gpt-5
tests:
  - vars:
      topic: kuantum hesaplama
    assert:
      - type: answer-relevance
        threshold: 0.8
```

### Sağlayıcıları Geçersiz Kılma

Answer relevance iki tür sağlayıcı kullanır:

- Soru üretimi için bir metin sağlayıcısı
- Benzerlik hesaplaması için bir embedding sağlayıcısı

Bunlardan birini veya ikisini birden geçersiz kılabilirsiniz:

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

Sağlayıcıları assertion seviyesinde de geçersiz kılabilirsiniz:

```yaml
assert:
  - type: answer-relevance
    threshold: 0.8
    provider:
      text: anthropic:claude-2
      embedding: cohere:embed-english-v3.0
```

  ### Prompt'u Özelleştirme

  Soru üretim prompt'unu `rubricPrompt` özelliğini kullanarak özelleştirebilirsiniz:

```yaml
defaultTest:
  options:
    rubricPrompt: |
      Bu yanıt verildiğinde: {{output}}

      Bu yanıtın uygun olacağı 3 soru üret.
      Soruları belirgin ve içerikle doğrudan ilişkili olacak şekilde yaz.
```

# Daha fazla bilgi

Daha fazla seçenek için [model-graded metrics](/docs/configuration/expected-outputs/model-graded) sayfasına bakın.