---
sidebar_label: Voyage AI
description: "Gelişmiş semantik arama, geri getirme ve benzerlik karşılaştırmaları için Voyage AI'nın alana özgü embedding modellerinden yararlanın"
---

# Voyage AI

[Voyage AI](https://www.voyageai.com/), Anthropic'in [önerdiği](https://docs.anthropic.com/en/docs/embeddings) embedding sağlayıcısıdır. [Tüm modelleri](https://docs.voyageai.com/docs/embeddings) destekler. En yeni modeller şunlardır:

- voyage-3-large (en gelişmiş genel amaçlı model, Ocak 2025)
- voyage-3.5 ve voyage-3.5-lite (iyileştirilmiş kalite, Mayıs 2025)
- voyage-3 ve voyage-3-lite (32K bağlamlı genel amaçlı model)
- voyage-multimodal-3 (metin + görüntüler)
- voyage-context-3 (bağlamlandırılmış parçalar)
- voyage-code-3 (koda özgü geri getirme)

Kullanmak için `VOYAGE_API_KEY` ortam değişkenini ayarlayın.

Şu şekilde kullanın:

```yaml
provider: voyage:voyage-3-large
```

`defaultTest` özelliğini kullanarak her benzerlik karşılaştırması için etkinleştirebilirsiniz:

```yaml
defaultTest:
  options:
    provider:
      embedding: voyage:voyage-3-large
```

Ayrıca API anahtarını veya temel API URL'sini geçersiz kılabilirsiniz:

```yaml
provider:
  id: voyage:voyage-3-large
  config:
    apiKey: XXX
    apiKeyEnvar: VOYAGE_API_KEY # ayarlanırsa, API anahtarını bu ortam değişkeninden alacaktır
    apiBaseUrl: https://api.voyageai.com/v1
```
