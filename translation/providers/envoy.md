---
sidebar_label: Envoy AI Gateway
description: "Birleşik API yönetimi ve yönlendirme yeteneklerine sahip Envoy AI Gateway'in OpenAI uyumlu proxy'si aracılığıyla yapay zeka modellerine bağlanın"
---

# Envoy AI Gateway

[Envoy AI Gateway](https://aigateway.envoyproxy.io/), çeşitli yapay zeka model sağlayıcılarına erişmek için birleşik bir proxy katmanı sağlayan açık kaynaklı bir yapay zeka ağ geçididir. [OpenAI uyumlu](/docs/providers/openai/) uç noktalar sunar.

## Kurulum

1. [Resmi kurulum kılavuzunu](https://aigateway.envoyproxy.io/docs/getting-started/basic-usage) takip ederek Envoy AI Gateway'inizi yayınlayın ve yapılandırın.
2. Ağ geçidi URL'nizi ortam değişkeni aracılığıyla veya yapılandırmanızda ayarlayın.
3. Ağ geçidi yapılandırmanız gerektiriyorsa kimlik doğrulamayı ayarlayın.

## Sağlayıcı Formatı

Envoy sağlayıcısı şu formatı kullanır:

- `envoy:<model_adi>` - Belirtilen model adını kullanarak ağ geçidinize bağlanır

## Yapılandırma

### Temel Yapılandırma

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: envoy:my-model
    config:
      apiBaseUrl: 'https://your-envoy-gateway.com/v1'
```

### Ortam Değişkeni ile

Ağ geçidi URL'nizi ortam değişkeni olarak ayarlayın:

```bash
export ENVOY_API_BASE_URL="https://your-envoy-gateway.com"
```

Ardından, URL belirtmeden sağlayıcıyı kullanın:

```yaml
providers:
  - id: envoy:my-model
```

### Üstbilgi (Header) Üzerinden Kimlik Doğrulama

Envoy kimlik doğrulaması genellikle `x-api-key` üstbilgisi ile yapılır. Bunu nasıl yapılandıracağınıza dair bir örnek:

```yaml
providers:
  - id: envoy:my-model
    config:
      apiBaseUrl: 'https://your-envoy-gateway.com/v1'
      headers:
        x-api-key: 'foobar'
```

## Ayrıca Bakınız

- [OpenAI Sağlayıcısı](/docs/providers/openai) - Envoy AI Gateway tarafından kullanılan uyumlu API formatı
- [Yapılandırma Referansı](/docs/configuration/reference.md) - Sağlayıcılar için tam yapılandırma seçenekleri
- [Envoy AI Gateway Belgeleri](https://aigateway.envoyproxy.io/docs/) - Resmi ağ geçidi belgeleri
- [Envoy AI Gateway GitHub](https://github.com/envoyproxy/ai-gateway) - Kaynak kod ve örnekler
