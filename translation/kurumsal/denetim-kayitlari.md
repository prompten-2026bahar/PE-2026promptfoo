# Denetim Günlüğü

Denetim Günlüğü, [Promptfoo Enterprise](/docs/enterprise/) özelliğidir ve organizasyon düzeyinde, kullanıcı düzeyinde, takım düzeyinde ve hizmet hesabı düzeyinde adli erişim bilgileri sağlar.

Denetim Günlüğü, promptfoo kaynakları hakkında "kim, ne zaman ve ne" sorularını yanıtlar. Bu yanıtlar organizasyonunuzun güvenliğini değerlendirmenize yardımcı olabilir ve denetim ile uyumluluk gereksinimlerini karşılamak için ihtiyaç duyduğunuz bilgileri sağlayabilir.

## Denetim Günlüğü tarafından hangi olaylar desteklenir?

Denetim Günlüğü, promptfoo platformundaki yönetim işlemlerini yakalar. Sistem, organizasyonunuzdaki kullanıcılar, takımlar, roller, izinler ve hizmet hesaplarındaki değişiklikleri takip eder.

Denetim Günlüğü'nün promptfoo kontrol düzlemindeki işlemleri ve yönetim eylemlerini yakaladığını lütfen unutmayın. Değerlendirme çalıştırmaları, prompt testleri ve diğer veri düzlemi işlemleri ayrı olarak izlenir.

## Yönetim İşlemi olayları

Aşağıdaki liste, desteklenen olayları ve bunlara karşılık gelen eylemleri belirtir:

### Kimlik Doğrulama

- **Kullanıcı Girişi**: `login` - Kullanıcıların platforma başarıyla kimlik doğrulaması yaptığını takip eder

### Kullanıcı Yönetimi

- **Kullanıcı Eklendi**: `user_added` - Yeni kullanıcıların organizasyona davet edilmesini veya eklenmesini kaydeder
- **Kullanıcı Kaldırıldı**: `user_removed` - Kullanıcıların organizasyondan kaldırılmasını günlüğe kaydeder

### Rol Yönetimi

- **Rol Oluşturuldu**: `role_created` - Yeni özel rollerin oluşturulmasını yakalar
- **Rol Güncellendi**: `role_updated` - Mevcut rol izinlerindeki değişiklikleri kaydeder
- **Rol Silindi**: `role_deleted` - Özel rollerin silinmesini günlüğe kaydeder

### Takım Yönetimi

- **Takım Oluşturuldu**: `team_created` - Yeni takımların oluşturulmasını kaydeder
- **Takım Silindi**: `team_deleted` - Takım silme işlemini günlüğe kaydeder
- **Takıma Kullanıcı Eklendi**: `user_added_to_team` - Kullanıcıların takımlara katılmasını takip eder
- **Takımdan Kullanıcı Kaldırıldı**: `user_removed_from_team` - Kullanıcıların takımlardan ayrılmasını kaydeder
- **Takımdaki Kullanıcı Rolü Değiştirildi**: `user_role_changed_in_team` - Takım içindeki rol değişikliklerini günlüğe kaydeder

### İzin Yönetimi

- **Sistem Yöneticisi Eklendi**: `org_admin_added` - Sistem yöneticisi izinlerinin verilmesini kaydeder
- **Sistem Yöneticisi Kaldırıldı**: `org_admin_removed` - Sistem yöneticisi izinlerinin iptal edilmesini günlüğe kaydeder

### Hizmet Hesabı Yönetimi

- **Hizmet Hesabı Oluşturuldu**: `service_account_created` - API hizmet hesaplarının oluşturulmasını takip eder
- **Hizmet Hesabı Silindi**: `service_account_deleted` - Hizmet hesaplarının silinmesini kaydeder

## Denetim Günlüğü formatı

Denetim günlüğü girişleri aşağıdaki yapıda JSON formatında saklanır:

```json
{
  "id": "benzersiz-gunluk-girisi-id",
  "description": "Eylemin okunabilir açıklaması",
  "actorId": "Eylemi gerçekleştiren kullanıcının ID'si",
  "actorName": "Eylemi gerçekleştiren kullanıcının adı",
  "actorEmail": "Eylemi gerçekleştiren kullanıcının e-postası",
  "action": "Makine tarafından okunabilir eylem tanımlayıcısı",
  "actionDisplayName": "İnsan tarafından okunabilir eylem adı",
  "target": "Etkilenen kaynak türü",
  "targetId": "Etkilenen belirli kaynağın ID'si",
  "metadata": {
    // Ek bağlama özgü bilgiler
  },
  "organizationId": "Eylemin gerçekleştiği organizasyonun ID'si",
  "teamId": "Takımın ID'si (varsa)",
  "createdAt": "Eylemin kaydedildiği ISO zaman damgası"
}
```

### Denetim Günlüğü Hedefleri

Sistem aşağıdaki kaynak türlerindeki değişiklikleri takip eder:

- `USER` - Kullanıcı hesapları ve profilleri
- `ROLE` - Özel roller ve izinler
- `TEAM` - Takım yapıları ve üyelikleri
- `SERVICE_ACCOUNT` - API hizmet hesapları
- `ORGANIZATION` - Organizasyon düzeyinde ayarlar

## Örnek Denetim Günlüğü Girişleri

Aşağıdaki örnekler, çeşitli denetim günlüğü girişlerinin içeriklerini gösterir:

### Kullanıcı Girişi

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "description": "john.doe@example.com logged in",
  "actorId": "user-123",
  "actorName": "John Doe",
  "actorEmail": "john.doe@example.com",
  "action": "login",
  "actionDisplayName": "User Login",
  "target": "USER",
  "targetId": "user-123",
  "metadata": null,
  "organizationId": "org-456",
  "teamId": null,
  "createdAt": "2023-11-08T08:06:40Z"
}
```

### Takım Oluşturma

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "description": "jane.smith@example.com created team Engineering",
  "actorId": "user-789",
  "actorName": "Jane Smith",
  "actorEmail": "jane.smith@example.com",
  "action": "team_created",
  "actionDisplayName": "Team Created",
  "target": "TEAM",
  "targetId": "team-101",
  "metadata": null,
  "organizationId": "org-456",
  "teamId": "team-101",
  "createdAt": "2023-11-08T09:15:22Z"
}
```

### Rol Güncelleme

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "description": "admin@example.com updated role Developer",
  "actorId": "user-456",
  "actorName": "Admin User",
  "actorEmail": "admin@example.com",
  "action": "role_updated",
  "actionDisplayName": "Role Updated",
  "target": "ROLE",
  "targetId": "role-202",
  "metadata": {
    "input": {
      "permissions": ["read", "write"],
      "description": "Updated developer permissions"
    }
  },
  "organizationId": "org-456",
  "teamId": null,
  "createdAt": "2023-11-08T10:30:15Z"
}
```

## Denetim Günlüklerine Erişim

Denetim günlüklerine promptfoo API'si aracılığıyla erişilebilir. Kapsamlı API belgeleri için [API Referansı](https://www.promptfoo.dev/docs/api-reference/#tag/audit-logs) sayfasına bakın.

### API Uç Noktası

```
GET /api/v1/audit-logs
```

### Sorgu Parametreleri

- `limit` (isteğe bağlı): Döndürülecek günlük sayısı (1-100, varsayılan: 20)
- `offset` (isteğe bağlı): Sayfalama için atlanacak günlük sayısı (varsayılan: 0)
- `createdAtGte` (isteğe bağlı): Bu ISO zaman damgasından sonra oluşturulan günlükleri filtrele
- `createdAtLte` (isteğe bağlı): Bu ISO zaman damgasından önce oluşturulan günlükleri filtrele
- `action` (isteğe bağlı): Belirli eylem türüne göre filtrele
- `target` (isteğe bağlı): Belirli hedef türüne göre filtrele
- `actorId` (isteğe bağlı): Eylemi gerçekleştiren belirli kullanıcıya göre filtrele

### Kimlik Doğrulama

Denetim günlüğü erişimi şunları gerektirir:

- Geçerli kimlik doğrulama belirteci
- Organizasyon yöneticisi ayrıcalıkları

### Örnek API İsteği

```bash
curl -X GET \
  "https://your-promptfoo-domain.com/api/v1/audit-logs?limit=50&action=login" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Örnek API Yanıtı

```json
{
  "total": 150,
  "limit": 50,
  "offset": 0,
  "logs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "description": "john.doe@example.com logged in",
      "actorId": "user-123",
      "actorName": "John Doe",
      "actorEmail": "john.doe@example.com",
      "action": "login",
      "actionDisplayName": "User Login",
      "target": "USER",
      "targetId": "user-123",
      "metadata": null,
      "organizationId": "org-456",
      "teamId": null,
      "createdAt": "2023-11-08T08:06:40Z"
    }
    // ... daha fazla günlük girişi
  ]
}
```

## Uyumluluk Kullanımı

Promptfoo'daki denetim günlükleri çeşitli uyumluluk gereksinimlerini karşılamaya yardımcı olabilir:

- **SOC 2**: Ayrıntılı erişim günlükleri ve yönetimsel değişiklik takibi sağlar
- **ISO 27001**: Erişim kontrolü izleme ve değişiklik yönetimi gereksinimlerini destekler
- **GDPR**: Veri erişimi ve kullanıcı yönetimi faaliyetlerinin izlenmesini sağlar
- **HIPAA**: Korunan sağlık bilgilerini içeren sistemlere erişim için denetim izi sağlar

## Sorun Giderme

Denetim günlüklerine erişimde sorun yaşıyorsanız:

1. Organizasyon yöneticisi ayrıcalıklarına sahip olduğunuzu doğrulayın
2. API belirtecinizin geçerli olduğunu ve süresinin dolmadığını kontrol edin
3. Sorgu parametrelerinizin düzgün biçimlendirildiğinden emin olun

Ek destek için, kullanım senaryonuz ve aldığınız hata mesajları hakkında ayrıntılarla birlikte promptfoo destek ekibiyle iletişime geçin.

## Ayrıca Bakınız

- [Hizmet Hesapları](hizmet-hesaplari.md) - Denetim günlüklerine erişim için API belirteçleri oluşturun
- [Takımlar](takimlar.md) - Takım yönetimi ve izinler hakkında bilgi edinin
- [Kimlik Doğrulama](kimlik-dogrulama.md) - Kurumsal kimlik doğrulama ve güvenlik özellikleri
- [API Referansı](https://www.promptfoo.dev/docs/api-reference/#tag/audit-logs) - Kapsamlı denetim günlükleri API belgeleri
