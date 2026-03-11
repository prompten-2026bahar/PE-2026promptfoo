---
sidebar_label: Webhook Entegrasyonu
description: Promptfoo'nun webhook API'si ile gerçek zamanlı sorun bildirimlerini harici sistemlerle entegre edin. Olay türlerini yapılandırın, uç noktaları yönetin ve imzaları güvenli bir şekilde doğrulayın.
---

# Webhook Entegrasyonu

[Promptfoo Enterprise](/docs/enterprise/), güvenlik açıkları (sorunlar) oluşturulduğunda veya güncellendiğinde harici sistemleri bilgilendirmek için webhook'lar sağlar.

## Sorun Nedir?

Promptfoo Enterprise'da bir "sorun", AI güvenlik testi sırasında tespit edilen bir **güvenlik açığı** veya zayıflığı ifade eder. Sorunlar, red team eklentileri prompt enjeksiyonları, veri sızıntıları, zararlı içerik üretimi veya AI'ya özgü diğer güvenlik açıkları gibi potansiyel güvenlik risklerini tespit ettiğinde oluşturulur.

## Olay Türleri

Aşağıdaki webhook olay türleri kullanılabilir:

- `issue.created`: Yeni bir güvenlik açığı tespit edilip oluşturulduğunda tetiklenir
- `issue.updated`: Bir güvenlik açığı güncellendiğinde (örneğin birden fazla özellik aynı anda değiştiğinde) tetiklenir
- `issue.status_changed`: Bir güvenlik açığının durumu değiştiğinde (örn., açık'tan düzeltildi'ye) tetiklenir
- `issue.severity_changed`: Bir güvenlik açığının ciddiyet düzeyi değiştiğinde tetiklenir
- `issue.comment_added`: Bir güvenlik açığına yorum eklendiğinde tetiklenir

> Not: Bir güvenlik açığının birden fazla özelliği aynı anda güncellendiğinde (örneğin hem durum hem de ciddiyet), ayrı issue.status_changed ve issue.severity_changed olayları yerine tek bir issue.updated olayı gönderilir. Bu, webhook tüketicilerinin mantıksal olarak tek bir güncelleme işlemi olan şey için birden fazla bildirim almasını önlemeye yardımcı olur.

## Webhook'ları Yönetme

Webhook'lar API aracılığıyla yönetilebilir. Her webhook bir organizasyonla ilişkilidir ve belirli olay türlerini dinleyecek şekilde yapılandırılabilir.

### Webhook Oluşturma

```
POST /api/webhooks
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN

{
  "url": "<https://your-webhook-endpoint.com/callback>",
  "name": "SIEM Entegrasyonum",
  "events": ["issue.created", "issue.status_changed"],
  "teamId": "isteğe-bağlı-takım-id",
  "enabled": true
}

```

Oluşturma sırasında, webhook için bir gizli anahtar oluşturulur. Bu gizli anahtar, webhook yüklerini imzalamak için kullanılır ve güvenli bir şekilde saklanmalıdır.

### Webhook Yük Yapısı

Webhook yükleri JSON olarak gönderilir ve aşağıdaki yapıya sahiptir:

```json
{
  "event": "issue.created",
  "timestamp": "2025-03-14T12:34:56Z",
  "data": {
    "issue": {
      "id": "issue-uuid",
      "pluginId": "plugin-id",
      "status": "open",
      "severity": "high",
      "organizationId": "org-id",
      "targetId": "target-id",
      "providerId": "provider-id",
      "createdAt": "2025-03-14T12:30:00Z",
      "updatedAt": "2025-03-14T12:30:00Z",
      "weakness": "display-name-of-plugin",
      "history": [...]
    },
    "eventData": {
      // Olay türüne özgü ek veriler
    }
  }
}

```

`issue.updated` olayları için `eventData` alanı neyin değiştiği hakkında bilgi içerir:

```json
{
  "event": "issue.updated",
  "timestamp": "2025-03-14T14:22:33Z",
  "data": {
    "issue": {
      // Mevcut durumuyla tam sorun verileri
    },
    "eventData": {
      "changes": ["status changed to fixed", "severity changed to low"]
    },
    "userId": "user-123" // Güncelleme bir kullanıcı tarafından yapıldıysa
  }
}
```

Bu yapı şunları yapmanıza olanak tanır:

1. Sorunun tam mevcut durumunu görmek
2. Hangi belirli özelliklerin değiştiğini anlamak
3. Değişikliği kimin yaptığını takip etmek (varsa)

## Webhook İmzalarını Doğrulama

Bir webhook'un Promptfoo Enterprise'dan geldiğini doğrulamak için yük, HMAC SHA-256 kullanılarak imzalanır. İmza, `X-Promptfoo-Signature` başlığına dahil edilir.

Node.js'de imzaları doğrulamanın bir örneği:

```jsx
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

// Webhook işleyicinizde:
app.post('/webhook-endpoint', (req, res) => {
  const payload = req.body;
  const signature = req.headers['x-promptfoo-signature'];
  const webhookSecret = 'your-webhook-secret';

  if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
    return res.status(401).send('Geçersiz imza');
  }

  // Webhook'u işle
  console.log(`${payload.event} olayı alındı`);

  res.status(200).send('Webhook alındı');
});
```

## Örnek Entegrasyon Senaryoları

### SIEM Entegrasyonu

Bir SIEM sistemiyle entegrasyon yaparken, `issue.created` ve `issue.updated` olaylarını dinlemek isteyebilirsiniz. Bu, güvenlik ekibinizin Promptfoo Enterprise tarafından tespit edilen yeni güvenlik açıkları hakkında bilgilendirilmesini ve çözümlerinin takip edilmesini sağlar. Her webhook ile sağlanan tam güvenlik açığı durumu, SIEM sisteminizi senkronize tutmayı kolaylaştırır.

### Görev Takibi Entegrasyonu

JIRA gibi görev takip sistemleri için şunları yapabilirsiniz:

- Güvenlik açıkları için yeni biletler oluşturmak için `issue.created` olayını dinleyin
- Herhangi bir güvenlik açığı özelliği değiştiğinde biletleri güncellemek için `issue.updated` olayını dinleyin
- Yalnızca güvenlik açığı durum geçişlerini önemsiyorsanız `issue.status_changed` olayını dinleyin
- Sistemler arasında yorumları senkronize etmek için `issue.comment_added` olayını dinleyin

`issue.updated` olaylarına dahil edilen `changes` dizisi, görev takip sisteminize uygun yorumlar eklemeyi kolaylaştırır (örn., "Güvenlik açığı durumu açık'tan düzeltildi'ye değiştirildi").

### Özel Bildirim Sistemi

Şunları yapan özel bir bildirim sistemi oluşturabilirsiniz:

1. Olay türlerine göre farklı bildirim kanalları oluşturma
2. Ciddiyet düzeylerine göre bildirimleri farklı takımlara yönlendirme
3. Uygun şekilde ayrıntılı mesajlar oluşturmak için `issue.updated` olaylarındaki `changes` bilgisini kullanma
4. Belirli takımlarla ilgili olmayan belirli değişiklik türlerini filtreleme
