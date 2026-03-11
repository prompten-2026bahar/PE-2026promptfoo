---
sidebar_label: Echo
description: LLM entegrasyonlarını test etmek ve hatalarını ayıklamak için Echo Sağlayıcısını yapılandırın; önceden oluşturulmuş çıktıları yerel olarak doğrulamak için mükemmel olan sıfır maliyetli doğrudan geçişli yanıtlar sunar
---

# Echo Sağlayıcısı

Echo Sağlayıcısı, giriş istemini (input prompt) çıktı olarak döndüren basit bir yardımcı sağlayıcıdır. Özellikle harici API çağrıları yapmadan önceden oluşturulmuş çıktıları test etmek, hatalarını ayıklamak ve doğrulamak için kullanışlıdır.

## Yapılandırma

Echo Sağlayıcısını kullanmak için yapılandırma dosyanızda sağlayıcı kimliğini `echo` olarak ayarlayın:

```yaml
providers:
  - echo
  # veya
  - id: echo
    label: doğrudan geçiş sağlayıcısı
```

## Yanıt Formatı

Echo Sağlayıcısı, aşağıdaki alanlara sahip eksiksiz bir `ProviderResponse` nesnesi döndürür:

- `output`: Orijinal giriş dizesi
- `cost`: Her zaman 0
- `cached`: Her zaman false
- `tokenUsage`: `{ total: 0, prompt: 0, completion: 0 }` olarak ayarlanır
- `isRefusal`: Her zaman false
- `metadata`: Bağlamda sağlanan ek meta veriler

## Kullanım

Echo Sağlayıcısı ek yapılandırma gerektirmez ve herhangi bir değişken değişimini gerçekleştirdikten sonra girişi döndürür.

### Örnek

```yaml
providers:
  - echo
  - openai:chat:gpt-5-mini

prompts:
  - 'Bunu özetle: {{text}}'

tests:
  - vars:
      text: 'Hızlı kahverengi tilki uyuşuk köpeğin üzerinden atlar.'
    assert:
      - type: contains
        value: 'tilki'
      - type: similar
        value: '{{text}}'
        threshold: 0.75
```

Bu örnekte Echo Sağlayıcısı, değişken değişiminden sonra girişin aynısını döndürürken, OpenAI sağlayıcısı bir özet oluşturur.

## Kullanım Durumları ve Önceden Oluşturulmuş Çıktılarla Çalışma

Echo Sağlayıcısı şunlar için kullanışlıdır:

- **İstemlerin Hatalarını Ayıklama ve Test Etme**: Karmaşık sağlayıcıları kullanmadan önce istemlerin ve değişken değişimlerinin doğru çalıştığından emin olun.

- **İddia (Assertion) ve Önceden Oluşturulmuş Çıktı Değerlendirmesi**: Bilinen girişler üzerinde iddia mantığını test edin ve yeni API çağrıları yapmadan önceden oluşturulmuş çıktıları doğrulayın.

- **Dönüşüm Testleri**: LLM yanıtının değişkenliği olmadan dönüşümlerin çıktıyı nasıl etkilediğini test edin.

- **Test Ortamlarında Taklit Etme (Mocking)**: Gerçek API çağrıları yapmak istemediğiniz test ortamlarında diğer sağlayıcıların yerine kullanın.

### Günlüğe Kaydedilmiş Üretim Çıktılarını Değerlendirme

Yaygın bir model, üretimde zaten oluşturulmuş olan LLM çıktılarını değerlendirmektir. Bu, yeni API çağrıları yapmadan gerçek üretim verilerine karşı iddialar (assertions) çalıştırmanıza olanak tanır.

Günlüğe kaydedilmiş çıktınızı doğrudan istem olarak kullanın:

```yaml
prompts:
  - '{{logged_output}}'

providers:
  - echo

tests:
  - vars:
      logged_output: 'Paris, Fransa'nın başkentidir.'
    assert:
      - type: llm-rubric
        value: 'Cevap gerçeklere dayalı olarak doğrudur'
      - type: contains
        value: 'Paris'
```

Echo sağlayıcısı istemi olduğu gibi döndürür, böylece günlüğe kaydedilmiş çıktınız herhangi bir API çağrısı olmadan doğrudan iddialara (assertions) akar.

JSON formatındaki üretim günlükleri için belirli alanları çıkarmak üzere varsayılan bir dönüşüm (transform) kullanın:

```yaml
prompts:
  - '{{logged_output}}'

providers:
  - echo

defaultTest:
  options:
    # Tüm günlük Kaydedilmiş çıktılardan yalnızca 'response' alanını çıkar
    transform: 'JSON.parse(output).response'

tests:
  - vars:
      # Üretim günlükleri genellikle JSON dizeleri içerir
      logged_output: '{"response": "Paris, Fransa'nın başkentidir.", "confidence": 0.95, "model": "gpt-5"}'
    assert:
      - type: llm-rubric
        value: 'Cevap gerçeklere dayalı olarak doğrudur'
  - vars:
      logged_output: '{"response": "Londra İngiltere'dedir.", "confidence": 0.98, "model": "gpt-5"}'
    assert:
      - type: contains
        value: 'Londra'
```

Bu model özellikle şunlar için kullanışlıdır:

- Üretim istemlerinin yayına alım sonrası değerlendirmesi
- Bilinen çıktılara karşı regresyon testi
- Geçmiş veriler üzerinde A/B testi iddia stratejileri
- API maliyetleri olmadan sistem davranışını doğrulama

Büyük hacimli günlüğe kaydedilmiş çıktıları yüklemek için test durumları [CSV dosyaları, Python betikleri, JavaScript işlevleri veya JSON](/docs/configuration/test-cases) dosyalarından dinamik olarak oluşturulabilir.
