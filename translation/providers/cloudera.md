---
sidebar_label: Cloudera
description: Güvenli kurumsal LLM testi için CDP kimlik doğrulaması ve özel ad alanı dağıtımı ile Cloudera'nın OpenAI uyumlu uç noktalarını ve Llama modellerini yapılandırın
---

# Cloudera

Cloudera sağlayıcısı, OpenAI protokolünü kullanarak Cloudera'nın yapay zeka uç noktalarıyla etkileşim kurmanıza olanak tanır. Cloudera altyapısında barındırılan sohbet tamamlama (chat completion) modellerini destekler.

## Yapılandırma

Cloudera sağlayıcısını kullanmak için şunlara ihtiyacınız olacak:

1. Bir Cloudera alanı (domain)
2. Kimlik doğrulama için bir CDP jetonu (token)
3. (İsteğe bağlı) Bir ad alanı (namespace) ve uç nokta (endpoint) yapılandırması

Ortamınızı ayarlayın:

```sh
export CDP_DOMAIN=your-domain-here
export CDP_TOKEN=your-token-here
```

## Temel Kullanım

İşte Cloudera sağlayıcısının nasıl kullanılacağına dair temel bir örnek:

```yaml title="promptfooconfig.yaml"
providers:
  - id: cloudera:your-model-name
    config:
      domain: your-domain # CDP_DOMAIN ayarlanmışsa isteğe bağlıdır
      namespace: serving-default # İsteğe bağlı, varsayılan olarak 'serving-default'
      endpoint: your-endpoint # İsteğe bağlı, varsayılan olarak model adıdır
```

## Yapılandırma Seçenekleri

Cloudera sağlayıcısı, tüm standart [OpenAI yapılandırma seçeneklerini](/docs/providers/openai#configuring-parameters) ve bu ek Cloudera'ya özgü seçenekleri destekler:

| Parametre   | Açıklama                                                                          |
| ----------- | --------------------------------------------------------------------------------- |
| `domain`    | Kullanılacak Cloudera alanı. Ayrıca `CDP_DOMAIN` ortam değişkeni aracılığıyla da ayarlanabilir. |
| `namespace` | Kullanılacak ad alanı. Varsayılan olarak 'serving-default'tur.                    |
| `endpoint`  | Kullanılacak uç nokta. Belirtilmezse varsayılan olarak model adıdır.              |

Tam yapılandırmalı örnek:

```yaml
providers:
  - id: cloudera:llama-3-1
    config:
      # Cloudera'ya özgü seçenekler
      domain: your-domain
      namespace: serving-default
      endpoint: llama-3-1

      # Standart OpenAI seçenekleri
      temperature: 0.7
      max_tokens: 200
      top_p: 1
      frequency_penalty: 0
      presence_penalty: 0
```

## Ortam Değişkenleri

Aşağıdaki ortam değişkenleri desteklenmektedir:

| Değişken     | Açıklama                                      |
| ------------ | --------------------------------------------- |
| `CDP_DOMAIN` | API istekleri için kullanılacak Cloudera alanı |
| `CDP_TOKEN`  | Cloudera API erişimi için kimlik doğrulama jetonu |

## API Uyumluluğu

Cloudera sağlayıcısı OpenAI protokolü üzerine inşa edilmiştir; bu da OpenAI Chat API'si ile aynı mesaj formatını ve çoğu parametreyi desteklediği anlamına gelir. Şunları içerir:

- Roller (system, user, assistant) ile sohbet mesajı formatlama
- Sıcaklık (temperature) ve diğer üretim parametreleri
- Token limitleri ve diğer kısıtlamalar

Örnek sohbet konuşması:

```yaml title="promptfooconfig.yaml"
prompts:
  - 'Yardımsever bir asistansın. Şu soruyu cevapla: {{user_input}}'

providers:
  - id: cloudera:llama-3-1
    config:
      temperature: 0.7
      max_tokens: 200

tests:
  - vars:
      user_input: 'İspanya'da 4 günlük bir tatil için ne yapmalıyım?'
```

## Sorun Giderme

Sorunlarla karşılaşırsanız:

1. `CDP_TOKEN` ve `CDP_DOMAIN` değişkenlerinizin doğru ayarlandığını doğrulayın
2. Ad alanının ve uç noktanın var olduğunu ve erişilebilir olduğunu kontrol edin
3. Model adınızın uç nokta yapılandırmasıyla eşleştiğinden emin olun
4. Jetonunuzun uç noktaya erişmek için gerekli izinlere sahip olduğunu doğrulayın
