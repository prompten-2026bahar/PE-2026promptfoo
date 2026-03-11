---
sidebar_label: JFrog ML
description: "Yapay zeka modellerinin güvenli taranması, sürümlendirilmesi ve DevSecOps uyumluluğu için JFrog'un ML model yönetim platformunu entegre edin"
---

# JFrog ML

:::note JFrog Artifactory Değildir
Bu belgeler, yapay zeka model çıkarımı (inference) için kullanılan **JFrog ML** sağlayıcısını (eski adıyla Qwak) kapsar. Bu, yapı havuzu (artifact repository) içinde saklanan modelleri taramak için [ModelAudit](/docs/model-audit/usage#jfrog-artifactory) kısmında desteklenen **JFrog Artifactory**'den farklıdır.
:::

JFrog ML sağlayıcısı (eski adıyla Qwak), OpenAI protokolünü kullanarak JFrog ML'in LLM Model Kütüphanesi ile etkileşime girmenize olanak tanır. JFrog ML'in altyapısında barındırılan sohbet tamamlama (chat completion) modellerini destekler.

## Kurulum

JFrog ML sağlayıcısını kullanmak için şunlara ihtiyacınız olacaktır:

1. Bir JFrog ML hesabı
2. Kimlik doğrulama için bir JFrog ML jetonu (token)
3. JFrog ML Model Kütüphanesinden yayınlanmış bir model

Ortamınızı ayarlayın:

```sh
export QWAK_TOKEN="jetonunuz_buraya"
```

## Temel Kullanım

JFrog ML sağlayıcısının nasıl kullanılacağına dair temel bir örnek:

```yaml title="promptfooconfig.yaml"
providers:
  - id: jfrog:llama_3_8b_instruct
    config:
      temperature: 1.2
      max_tokens: 500
```

Eski `qwak:` önekini de kullanabilirsiniz:

```yaml title="promptfooconfig.yaml"
providers:
  - id: qwak:llama_3_8b_instruct
```

## Yapılandırma Seçenekleri

JFrog ML sağlayıcısı, tüm standart [OpenAI yapılandırma seçeneklerini](/docs/providers/openai#configuring-parameters) ve bu ek JFrog ML'e özgü seçenekleri destekler:

| Parametre | Açıklama                                                                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `baseUrl` | İsteğe bağlı. Model uç noktanızın tam URL'si. Belirtilmezse, model adı kullanılarak oluşturulacaktır: `https://models.qwak-prod.qwak.ai/v1` |

Tam yapılandırma ile örnek:

```yaml title="promptfooconfig.yaml"
providers:
  - id: jfrog:llama_3_8b_instruct
    config:
      # JFrog ML'e özgü seçenekler
      baseUrl: https://models.qwak-prod.qwak.ai/v1

      # Standart OpenAI seçenekleri
      temperature: 1.2
      max_tokens: 500
      top_p: 1
      frequency_penalty: 0
      presence_penalty: 0
```

## Ortam Değişkenleri

Aşağıdaki ortam değişkenleri desteklenir:

| Değişken     | Açıklama                                           |
| ------------ | -------------------------------------------------- |
| `QWAK_TOKEN` | JFrog ML API erişimi için kimlik doğrulama jetonu |

## API Uyumluluğu

JFrog ML sağlayıcısı, OpenAI protokolü üzerine inşa edilmiştir; bu da OpenAI Sohbet API'si ile aynı mesaj formatını ve çoğu aynı parametreyi desteklediği anlamına gelir. Buna şunlar dahildir:

- Roller (system, user, assistant) ile sohbet mesajı formatlama
- Sıcaklık (temperature) ve diğer üretim parametreleri
- Token sınırları ve diğer kısıtlamalar

Örnek sohbet konuşması:

```yaml title="prompts.yaml"
- role: system
  content: 'Siz yardımsever bir asistansınız.'
- role: user
  content: '{{user_input}}'
```

```yaml title="promptfooconfig.yaml"
prompts:
  - file://prompts.yaml

providers:
  - id: jfrog:llama_3_8b_instruct
    config:
      temperature: 1.2
      max_tokens: 500

tests:
  - vars:
      user_input: 'İspanya'da 4 günlük bir tatil için ne yapmalıyım?'
```
