---
sidebar_position: 40
description: promptfoo eval sonuçlarını bulut platformu, kurumsal dağıtım veya self-hosted altyapısı aracılığıyla takımlarla paylaşın
keywords: [eval paylaşımı, model testi, promptfoo paylaşımı, işbirliği, takım paylaşımı]
---

# Paylaşma

`share` komutunu veya web arayüzünü kullanarak değerlendirme sonuçlarını başkalarıyla paylaşın.

## Hızlı Başlangıç (Bulut)

Çoğu kullanıcı promptfoo.app bulutuna paylaşlar:

```sh
# Giriş (tek seferlik kurulum)
# İlk olarak, API anahtarınızı https://promptfoo.app/welcome adresinden alın
promptfoo auth login -k YOUR_API_KEY

# Bir değerlendirme çalıştırın ve paylaşın
promptfoo eval
promptfoo share
```

:::note

Bulut paylaşımı yalnızca sizin ve kuruluşunuzun görebildiği özel bağlantılar oluşturur. Bir hesabınız yoksa, bir tane oluşturmak ve API anahtarınız almak için https://promptfoo.app/welcome adresini ziyaret edin.

:::

## Web Arayüzü Paylaşımı

Değerlendirmeleri web arayüzünden tek bir tıklamayla paylaşın. **Paylaş** düğmesi tüm değerlendirmeler için "Eval eylemü" açılır menüsünde görünür.

![Share button location in web interface](/img/docs/usage/sharing-webui.png)

### Web Arayüzü Üzerinden Bir Değerlendirmeyi Paylaşın

1. Değerlendirme sonuçlarını web arayüzünde açın
2. Üst araç çubuğunda **"Eval eylemü"** tıklayın
3. Açılır menüden **"Paylaş"** seçin
4. Paylaşılabilir URL'niz oluşturmak için istemler takip edin

:::tip

Paylaş düğmesi varsayılan olarak tüm değerlendirmeler için görünürdür. Paylaşım yapılandırılmazsa, hatalara yerine yardımcı kurulum talimatları görüsünüz.

:::

### Kurulum Türüne Göre Paylaşım Davranışı

- **Bulut kullanıcıları**: Özel paylaşım URL'lerini otomatik olarak oluşturur
- **Kurumsal kullanıcılar**: Rol tabanlı izinlerle takım erişilebilir bağlantılar oluşturur
- **Self-hosted kullanıcılar**: Yapılandırılmış paylaşım uç noktalarını kullanır
- **Yapılandırılmayan kurulumlar**: Sonraki adımlarla net kurulum talimatları görüntüler

## Belirli Değerlendirmeleri Paylaşım

```sh
# Mevcut değerlendirmeleri listele
prompfoo list evals

# ID'ye göre paylaş
 promptfoo share my-eval-id
```

## Kurumsal Paylaşım

Bir Promptfoo Kurumsal hesabınız varsa:

```sh
# Kurumsal örneğinize giriş yap
# Profilınþzın "CLI Giriş Bilgileri" bölümünden API anahtarınızı alın
prompfoo auth login --host https://your-company.promptfoo.app -k YOUR_API_KEY

# Değerlendirmenizi paylaşın
prompfoo share
```

Kurumsal paylaşım ek özellikleri içerir:

- Takım tabanlı erişim kontrolleri
- Paylaşılan değerlendirmeler için rol tabanlı izinler
- SSO entegrasyonu (SAML 2.0 ve OIDC)

Kimlik doğrulama ve takım yönetimi hakkında daha fazla bilgi için [Kurumsal belgeleri](/docs/enterprise/authentication.md)'ne bakın.

## CI/CD Entegrasyonu

### API Jetonı Kullanma (Bulut/Kurumsal)

```sh
# API jetonıyle kimlik doğrulanmış yap
export PROMPTFOO_API_KEY=your_api_token

# Çalıştır ve paylaş
prompfoo eval --share
```

API jetonunuzu hesap ayarlarınızda "CLI Giriş Bilgileri" bölümünden alın. Kurumsal kullanıcılar için, CI/CD entegrasyonu için [Hizmet Hesapları](/docs/enterprise/service-accounts.md)nı da kullanabilirsiniz.

## Gelişmiş: Self-Hosted Paylaşımı

Self-hosted örnekleri olan kullanıcılar için:

```sh
# Paylaşımı sunucunuza yapılandırı
export PROMPTFOO_REMOTE_API_BASE_URL=http://your-server:3000
export PROMPTFOO_REMOTE_APP_BASE_URL=http://your-server:3000

# Değerlendirmenizi paylaşın (giriş gerekli değil)
promptfoo share
```

Self-hosted sunucunuzla HTTP Temel Kimlik Doğrulaması kullanmanız gerekiyorsa:

```sh
# Temel kimlik doğrulama kimlik bilgileriyle paylaşımı yapılandır
export PROMPTFOO_REMOTE_API_BASE_URL=http://username:password@your-server:3000
export PROMPTFOO_REMOTE_APP_BASE_URL=http://username:password@your-server:3000
```

Ayrıca bu ayarları `promptfooconfig.yaml` dosyanıza ekleyebilirsiniz:

```yaml title="promptfooconfig.yaml"
sharing:
  apiBaseUrl: http://your-server:3000
  appBaseUrl: http://your-server:3000
```

:::tip

Bu ortam değişkenleri veya yapılandırma ayarları mevcut olduğunda, self-hosted paylaşımı `promptfoo auth login` gerektirmez.

:::

### Yükleme Sorunlarını Sorun Giderme

#### "413 İstek Varlığı Çok Büyük" Hatalarını Ele Alma

Büyük değerlendirme sonuçlarını paylaşırken, NGINX veya diğer proxy'lerden "413 İstek Varlığı Çok Büyük" hataları alabilirsiniz. Bu, istek yükü sunucunun yapılandırılan sınırını aştığında olur.

Bunu iki şekilde çözebilirsiniz:

1. **Yığın boyutunu azaltın** (istemci tarafı):

   ```sh
   # Yükleme yığını başına sonuç sayısını azaltın (varsayılan otomatik olarak hesaplanır)
   # Çok büyük değerlendirmeler için 10-20 gibi küçük bir değerle başlayın
   export PROMPTFOO_SHARE_CHUNK_SIZE=10
   ```

2. **NGINX max gövde boyutunu artırın** (sunucu tarafı):
   ```nginx
   # nginx.conf veya site yapılandırmasında
   client_max_body_size 20M; # Gerektiği gibi ayarlayın
   ```

Çok kiracılı ortamlar için, sunucu sınırlarını artırmaktan daha güvenli olan istemcide yığın boyutunu azaltmaktır.

## Paylaşımı Devre Dışı Bırakma

Paylaşımı tamamen devre dışı bırakmak için:

### Yapılandırma Aracılığıyla Devre Dışı Bırakma

```yaml title="promptfooconfig.yaml"
sharing: false
```

### Ortam Değişkeni Aracılığıyla Devre Dışı Bırakma

```sh
export PROMPTFOO_DISABLE_SHARING=true
```

## Ayrıca Bakın

- [Self-Hosting](/docs/usage/self-hosting.md)
- [Komut Satırı Kullanımı](/docs/usage/command-line.md)
- [Kurumsal Kimlik Doğrulaması](/docs/enterprise/authentication.md)
- [Roller ve Takımları Yönetme](/docs/enterprise/teams.md)