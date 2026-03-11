---
sidebar_label: Sıralı (Sequence)
description: Veri dönüşümü ve yönlendirme ile gelişmiş değerlendirme iş akışları oluşturmak için birden fazla yapay zeka sağlayıcısını sıralı olarak zincirleyin
---

# Sıralı Sağlayıcı (Sequence Provider)

Sıralı Sağlayıcı, bir başka sağlayıcıya ardışık olarak bir dizi istem göndermenize, tüm yanıtları toplamanıza ve birleştirmenize olanak tanır. Bu; çok adımlı etkileşimler, konuşma akışları veya karmaşık istemleri daha küçük parçalara ayırmak için kullanışlıdır.

## Yapılandırma

Sıralı Sağlayıcıyı kullanmak için sağlayıcı `id` değerini `sequence` olarak ayarlayın ve bir `inputs` dizisi içeren bir yapılandırma nesnesi sağlayın:

```yaml
providers:
  - id: sequence
    config:
      inputs:
        - 'İlk soru: {{prompt}}'
        - 'Takip sorusu: Bu konuda biraz daha detay verebilir misiniz?'
        - 'Son olarak: Düşüncelerinizi özetleyebilir misiniz?'
      separator: "\n---\n" # İsteğe bağlı, varsayılan: "\n---\n"
```

## Nasıl Çalışır?

Sıralı Sağlayıcı:

1. `inputs` dizisindeki her bir istem dizesini alır.
2. Nunjucks şablonlamayı kullanarak istemleri işler (orijinal isteme ve test değişkenlerine erişim sağlar).
3. Bunları orijinal sağlayıcıya gönderir.
4. Tüm yanıtları toplar.
5. Belirtilen ayırıcıyı (separator) kullanarak yanıtları birleştirir.

## Kullanım Örneği

İşte çok turlu bir konuşma oluşturmak için Sıralı Sağlayıcıyı nasıl kullanacağınızı gösteren tam bir örnek:

```yaml
providers:
  - openai:chat:gpt-4
  - id: sequence
    config:
      inputs:
        - '{{prompt}} nedir?'
        - '{{prompt}} konusunun potansiyel dezavantajları nelerdir?'
        - '{{prompt}} konusunun artılarını ve eksilerini özetleyebilir misiniz?'
      separator: "\n\n=== Sonraki Yanıt ===\n\n"

prompts:
  - 'yapay zeka'

tests:
  - vars:
      prompt: yapay zeka
    assert:
      - type: contains
        value: dezavantajlar
      - type: contains
        value: artılar ve eksiler
```

## Değişkenler ve Şablonlama

Her giriş dizesi Nunjucks şablonlamayı destekler ve şunlara erişimi vardır:

- Orijinal `prompt` (istem)
- Test bağlamında tanımlanan tüm değişkenler
- Tanımladığınız tüm özel filtreler

Örneğin:

```yaml
providers:
  - id: sequence
    config:
      inputs:
        - '{{topic}} hakkında soru: {{prompt}}'
        - 'Takip: {{topic}}, {{industry}} sektörü ile nasıl ilişkilidir?'
tests:
  - vars:
      topic: Yapay Zeka
      industry: sağlık hizmetleri
      prompt: Temel uygulamalar nelerdir?
```

## Yapılandırma Seçenekleri

| Seçenek   | Tür      | Gerekli | Varsayılan | Açıklama                                       |
| --------- | -------- | ------- | ---------- | ---------------------------------------------- |
| inputs    | string[] | Evet    | -          | Sıralı olarak gönderilecek istem şablonları dizisi |
| separator | string   | Hayır   | "\n---\n" | Yanıtları birleştirmek için kullanılan dize     |
