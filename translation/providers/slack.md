---
title: Slack Sağlayıcısı
sidebar_label: Slack
description: Uzman geri bildirimi toplamak, insan ve yapay zeka yanıtlarını karşılaştırmak ve Slack kanalları veya doğrudan mesajlar aracılığıyla altın veri kümeleri oluşturmak için Slack sağlayıcısı ile döngüde insan (human-in-the-loop) değerlendirmelerini etkinleştirin
---

# Slack Sağlayıcısı

Slack sağlayıcısı, Slack kanallarına veya kullanıcılarına istemler göndererek ve yanıtları toplayarak döngüde insan (human-in-the-loop) değerlendirmelerini mümkün kılar. Bu şunlar için kullanışlıdır:

- Yapay zeka çıktıları hakkında insan geri bildirimi toplama
- İnsan yanıtlarını yapay zeka yanıtlarıyla karşılaştırma
- Uzman geri bildirimlerinden altın veri kümeleri (golden datasets) oluşturma
- Alan uzmanlarıyla değerlendirmeler yürütme

## Ön Koşullar

### Bağımlılıkları Kurun

Slack sağlayıcısı, `@slack/web-api` paketinin ayrı olarak kurulmasını gerektirir:

```bash
npm install @slack/web-api
```

:::note
Bu isteğe bağlı bir bağımlılıktır ve yalnızca Slack sağlayıcısını kullanmak istiyorsanız kurulması gerekir.
:::

### Slack Uygulaması Kurulumu

1. **Bir Slack Uygulaması Oluşturun**
   - [api.slack.com/apps](https://api.slack.com/apps) adresine gidin.
   - "Create New App" → "From scratch" seçeneğine tıklayın.
   - Uygulamanıza bir isim verin ve çalışma alanınızı (workspace) seçin.

2. **Bot Token Kapsamlarını (Scopes) Yapılandırın**
   - Uygulama ayarlarınızda "OAuth & Permissions" bölümüne gidin.
   - "Scopes" → "Bot Token Scopes" altında şu GEREKLİ kapsamları ekleyin:
     - `chat:write` - mesaj göndermek için
     - `channels:history` - genel kanal mesajlarını okumak için
     - `groups:history` - özel kanal mesajlarını okumak için
     - `im:history` - doğrudan mesajları okumak için
     - `channels:read` - genel kanal bilgilerine erişmek için
     - `groups:read` - özel kanal bilgilerine erişmek için
     - `im:read` - doğrudan mesaj bilgilerine erişmek için

    **Not**: Sağlayıcının farklı kanal türlerinde düzgün çalışması için tüm kapsamlar gereklidir.

3. **Uygulamayı Çalışma Alanına Kurun**
   - Uygulama ayarlarınızda "Install App" bölümüne gidin.
   - "Install to Workspace" butonuna tıklayın.
   - "Bot User OAuth Token" değerini kopyalayın (`xoxb-` ile başlar).

4. **Botu Kanala Davet Edin**
   - Slack'te botu kullanmak istediğiniz kanala gidin.
   - `/invite @BotAdınız` yazın.

## Yapılandırma

### Ortam Değişkenleri

```bash
export SLACK_BOT_TOKEN="xoxb-bot-tokeniniz"
```

### Temel Yapılandırma

```yaml
providers:
  - id: slack
    config:
      channel: 'C0123456789' # Kanal kimliğiniz
```

### Sağlayıcı Formatları

Slack sağlayıcısı birden fazla formatı destekler:

```yaml
# Yapılandırmada kanal içeren temel format
providers:
  - id: slack  # SLACK_BOT_TOKEN ortam değişkenini kullanır
    config:
      # token: "{{ env.SLACK_BOT_TOKEN }}"  # isteğe bağlı, otomatik algılanır
      channel: "C0123456789"

# Kısa format - kanal kimliği doğrudan sağlayıcı dizesinde
providers:
  - slack:C0123456789

# Açık kanal formatı
providers:
  - slack:channel:C0123456789

# Bir kullanıcıya doğrudan mesaj
providers:
  - slack:user:U0123456789
```

## Yapılandırma Seçenekleri

| Seçenek            | Tür      | Gerekli | Varsayılan                | Açıklama                                                       |
| ------------------ | -------- | ------- | ------------------------- | -------------------------------------------------------------- |
| `token`            | string   | Evet\*  | `SLACK_BOT_TOKEN`         | Slack Bot Kullanıcısı OAuth Token'ı                            |
| `channel`          | string   | Evet    | -                         | Kanal Kimliği (C...) veya Kullanıcı Kimliği (U...)             |
| `responseStrategy` | string   | Hayır   | `'first'`                 | Yanıtların nasıl toplanacağı: `'first'`, `'user'` veya `'timeout'` |
| `waitForUser`      | string   | Hayır   | -                         | Beklenecek Kullanıcı Kimliği (`'user'` stratejisi kullanırken) |
| `timeout`          | number   | Hayır   | 60000                     | Milisaniye cinsinden zaman aşımı                               |
| `includeThread`    | boolean  | Hayır   | false                     | Çıktı meta verilerine iş parçacığı (thread) zaman damgasını ekle |
| `formatMessage`    | function | Hayır   | -                         | Özel mesaj formatlama fonksiyonu                               |
| `threadTs`         | string   | Hayır   | -                         | Yanıtlanacak iş parçacığı zaman damgası                        |

\*Token, ya yapılandırmada ya da ortam değişkeni olarak gereklidir.

## Yanıt Stratejileri

### İlk Yanıt (Varsayılan)

İstemden sonraki ilk bot olmayan mesajı yakalar:

```yaml
providers:
  - id: slack
    config:
      channel: 'C0123456789'
      responseStrategy: 'first'
```

### Belirli Kullanıcı

Belirli bir kullanıcıdan yanıt bekler:

```yaml
providers:
  - id: slack
    config:
      channel: 'C0123456789'
      responseStrategy: 'user'
      waitForUser: 'U9876543210'
```

### Zaman Aşımı Koleksiyonu

Zaman aşımına kadar tüm yanıtları toplar:

```yaml
providers:
  - id: slack
    config:
      channel: 'C0123456789'
      responseStrategy: 'timeout'
      timeout: 300000 # 5 dakika
```

## Kanal ve Kullanıcı Kimliklerini Bulma

### Kanal Kimlikleri

1. Slack'te, başlıktaki kanal adına tıklayın.
2. "About" sekmesine tıklayın.
3. En altta Kanal Kimliğini (C ile başlar) göreceksiniz.

### Kullanıcı Kimlikleri

1. Bir kullanıcının profiline tıklayın.
2. "..." menüsüne tıklayın.
3. "Copy member ID" (U ile başlar) seçeneğini seçin.

### Alternatif Yöntem

1. Yan menüdeki bir kanala veya kullanıcıya sağ tıklayın.
2. "Copy link" seçeneğini seçin.
3. Kimlik (ID), URL'nin sonundadır.

### Kanal Kimliği Formatları

- `C...` - Genel kanallar
- `G...` - Özel kanallar/gruplar
- `D...` - Doğrudan mesajlar
- `W...` - Paylaşılan/Connect kanalları

## Örnekler

### Temel İnsan Geri Bildirimi Toplama

```yaml
description: Yapay zeka yanıtları hakkında insan geri bildirimi toplayın

providers:
  - id: openai:gpt-5
  - id: slack:C0123456789
    config:
      timeout: 300000 # 5 dakika

prompts:
  - '{{topic}} konusunu basit terimlerle açıklayın'

tests:
  - vars:
      topic: 'kuantum hesaplama'
  - vars:
      topic: 'makine öğrenimi'
  - vars:
      topic: 'blok zinciri teknolojisi'
# Şu komutla çalıştırın: promptfoo eval -j 1
```

### Belirli Kullanıcı ile Uzman İncelemesi

```yaml
description: Belirli bir ekip üyesinden uzman geri bildirimi alın

providers:
  - id: slack
    config:
      channel: 'C0123456789'
      responseStrategy: 'user'
      waitForUser: 'U9876543210' # Uzmanın kullanıcı kimliği
      timeout: 600000 # 10 dakika

prompts:
  - file://prompts/technical-review.txt

tests:
  - vars:
      code: |
        def factorial(n):
          if n == 0:
            return 1
          return n * factorial(n-1)
```

### İş Parçacığı (Thread) Tabanlı Konuşmalar

```yaml
description: Konuşmaya iş parçacığında devam edin

providers:
  - id: slack
    config:
      channel: 'C0123456789'
      threadTs: '1234567890.123456' # Mevcut iş parçacığı
      includeThread: true

prompts:
  - 'Takip sorusu: {{question}}'
```

### Özel Mesaj Formatlama

```javascript
// promptfooconfig.js
module.exports = {
  providers: [
    {
      id: 'slack',
      config: {
        channel: 'C0123456789',
        formatMessage: (prompt) => {
          return `🤖 *Yapay Zeka Değerlendirme İsteği*\n\n${prompt}\n\n_Lütfen geri bildiriminizi sağlayın_`;
        },
      },
    },
  ],
};
```

## En İyi Uygulamalar

1. **Eşzamanlılık**: Mesajların sıralı gönderilmesini sağlamak için Slack değerlendirmelerini `-j 1` ile çalıştırın.

   ```bash
   promptfoo eval -j 1
   ```

2. **Zaman Aşımı**: Beklenen yanıt süresine göre uygun zaman aşımları ayarlayın.
   - Hızlı geri bildirim: 60-120 saniye
   - Detaylı inceleme: 5-10 dakika
   - Asenkron toplama: 30+ dakika

3. **Kanal Seçimi**:
   - Gereksiz bildirimleri (spam) önlemek için özel değerlendirme kanalları kullanın.
   - Hassas değerlendirmeler için özel kanalları düşünün.
   - Bireysel uzman geri bildirimi için doğrudan mesajları kullanın.

4. **Mesaj Formatlama**:
   - Net ve yapılandırılmış istemler kullanın.
   - Bağlam ve talimatları dahil edin.
   - Daha iyi okunabilirlik için Slack'in markdown formatını kullanın.

5. **Hız Limitleri**: Slack'in hız limitlerinin farkında olun.
   - Web API: Yöntem başına saniyede yaklaşık 1 istek.
   - Toplu değerlendirmeler için gecikmeler eklemeyi düşünün.

## Diğer Slack Botlarını Test Etme

Slack sağlayıcısı, diğer Slack botlarını kendi doğal ortamlarında test etmek için mükemmeldir. Bu şunları yapmanıza olanak tanır:

- Çeşitli istemlere verilen bot yanıtlarını değerlendirmek
- Farklı bot uygulamalarını karşılaştırmak
- Regresyon testi yapmak
- Farklı senaryolar altında bot davranışını test etmek

### Bot Testi İçin Kurulum

1. **Her iki botu da bir test kanalına davet edin**:

   ```
   /invite @test-edilecek-bot
   /invite @degerlendirme-botu
   ```

2. **Sağlayıcıyı hedef botu etiketleyecek şekilde yapılandırın**:

   ```yaml
   providers:
     - id: slack
       config:
         channel: C123456789
         timeout: 10000
         responseStrategy: first
         # İsteğe bağlı: botu etiketlemek için mesajları formatlayın
         messageFormatter: |
           @test-edilecek-bot {{prompt}}
   ```

3. **Yalnızca hedef botu yakalamak için yanıtları filtreleyin**:
   ```yaml
   providers:
     - id: slack
       config:
         channel: C123456789
         timeout: 10000
         responseStrategy: user
         userId: U_BOT_KIMLIGINIZ # Botun kullanıcı kimliği
   ```

### Örnek: Müşteri Destek Botunu Test Etme

```yaml
description: Müşteri destek botumuzu test edin

providers:
  - id: slack
    label: destek-botu-testi
    config:
      channel: C_TEST_KANALI
      timeout: 15000
      responseStrategy: user
      userId: U_DESTEK_BOTU_KIMLIGI
      messageFormatter: |
        <@U_DESTEK_BOTU_KIMLIGI> {{prompt}}

prompts:
  - 'Şifremi nasıl sıfırlarım?'
  - 'Çalışma saatleriniz nedir?'
  - 'Bir insanla konuşmam gerekiyor'
  - 'Siparişim henüz gelmedi, sipariş no #12345'

tests:
  - vars:
      expected_intent: sifre_sifirlama
    assert:
      - type: contains
        value: 'sıfırla'
      - type: contains
        value: 'şifre'

  - vars:
      expected_intent: calisma_saatleri
    assert:
      - type: contains-any
        value: ['saat', 'açık', 'kapalı', 'Pazartesi', 'program']

  - vars:
      expected_intent: insan_devri
    assert:
      - type: contains-any
        value: ['temsilci', 'aktar', 'insan', 'müşteri hizmetleri']

  - vars:
      expected_intent: siparis_durumu
    assert:
      - type: contains
        value: '12345'
      - type: javascript
        value: |
          // Botun daha fazla bilgi isteyip istemediğini veya durum sağlayıp sağlamadığını kontrol edin
          return output.includes('takip') || output.includes('durum') || output.includes('teslimat');
```

### Gelişmiş Bot Test Desenleri

#### 1. Çok Turlu Konuşmalar

İstemleri zincirleyerek konuşma akışlarını test edin:

```yaml
prompts:
  - 'Merhaba, bir pizza sipariş etmek istiyorum'
  - 'Evet, büyük boy sucuklu olsun'
  - 'Adresim Merkez Mah. Atatürk Cad. No:1'
```

#### 2. Hata Yönetimi

Botun geçersiz girişleri nasıl işlediğini test edin:

```yaml
prompts:
  - 'HEMEN YARDIM ET!!!!!!'
  - 'asdfghjkl'
  - "' OR 1=1 --"
  - ''
```

#### 3. Yük Testi

Bot performansını test etmek için birden fazla paralel değerlendirme kullanın:

```bash
promptfoo eval -c bot-test-config.yaml -j 10
```

#### 4. Farklı Botların A/B Testi

Birden fazla bot uygulamasını karşılaştırın:

```yaml
providers:
  - id: slack
    label: bot-v1
    config:
      channel: C_KANAL_V1
      userId: U_BOT_V1

  - id: slack
    label: bot-v2
    config:
      channel: C_KANAL_V2
      userId: U_BOT_V2

prompts:
  - 'İade politikanız nedir?'

assert:
  - type: llm-rubric
    value: 'Yanıt yardımcı, doğru olmalı ve 30 günlük iade penceresinden bahsetmelidir'
```

### Bot Testi İçin En İyi Uygulamalar

1. Üretimi aksatmamak için **özel test kanalları kullanın**.
2. **Uygun zaman aşımları ayarlayın** - botların yanıt vermesi insanlardan daha uzun sürebilir.
3. Hatalı biçimlendirilmiş girişler ve istem enjeksiyonu denemeleri dahil olmak üzere **uç durumları test edin**.
4. Çok sayıda test çalıştırırken **hız limitlerini izleyin**.
5. Yanıtların hem içeriğini hem de formatını doğrulamak için **iddialar (assertions) kullanın**.
6. Tutarlı performansı sağlamak için **farklı zamanlarda test edin**.

### Bot Kullanıcı Kimliklerini Bulma

Bir botun kullanıcı kimliğini bulmak için:

```javascript
// Bunu test kanalınızda çalıştırın
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

async function findBotId() {
  const members = await client.conversations.members({
    channel: 'C_KANAL_KIMLIGINIZ',
  });

  for (const userId of members.members) {
    const user = await client.users.info({ user: userId });
    if (user.user.is_bot) {
      console.log(`Bot: ${user.user.name} - Kimlik (ID): ${userId}`);
    }
  }
}
```

## Sorun Giderme

### Bot yanıt vermiyor

- Botun kanala davet edildiğinden emin olun.
- Botun gerekli izinlere sahip olduğunu kontrol edin.
- Token'ın geçerli olduğunu doğrulayın.

### Zaman aşımı hataları

- Zaman aşımı değerini artırın.
- Kanaldaki kullanıcıların aktif olup olmadığını kontrol edin.
- Farklı bir yanıt stratejisi kullanmayı düşünün.

### Eksik mesajlar

- Botun `channels:history` iznine sahip olduğundan emin olun.
- Mesajların iş parçacıklarında (threads) olup olmadığını kontrol edin.
- Kanal kimliğinin doğru olduğunu doğrulayın.

## Güvenlik Mülahazaları

- Token'ları yapılandırma dosyalarında değil, ortam değişkenlerinde saklayın.
- Hassas veriler için özel kanallar kullanın.
- Bot token'larını düzenli olarak yenileyin.
- Bot izinlerini gerekli olan minimum düzeyle sınırlayın.
- Kullanılmadığında botu kanallardan çıkarın.

## Tam Örnek

```yaml
# Müşteri hizmetleri yanıtlarının insan tarafından değerlendirilmesi
description: Yapay zeka ve insan müşteri hizmetleri yanıtlarını karşılaştırın

providers:
  - id: openai:gpt-5
    config:
      temperature: 0.7

  - id: anthropic:messages:claude-sonnet-4-5-20250929

  - id: slack:C0123456789
    config:
      responseStrategy: 'first'
      timeout: 180000 # 3 dakika
      formatMessage: (prompt) =>
        `📋 *Müşteri Hizmetleri Değerlendirmesi*\n\n${prompt}\n\n_Bu müşteriye nasıl yanıt verirdiniz?_`

prompts:
  - |
    Müşteri mesajı: "{{message}}"

    Lütfen yardımcı ve empatik bir yanıt sağlayın.

tests:
  - vars:
      message: "İki haftadır siparişimi bekliyorum ve e-postalarıma kimse yanıt vermiyor!"
    assert:
      - type: llm-rubric
        value: Yanıt gecikmeyi kabul eder ve somut sonraki adımları sağlar

  - vars:
      message: 'Aldığım ürün hasarlı ve değişim yapılması gerekiyor'
    assert:
      - type: llm-rubric
        value: Yanıt anında çözüm sunar ve rahatsızlık için özür diler

  - vars:
      message: 'Abonelik planımı nasıl yükseltebilirim?'
    assert:
      - type: contains
        value: yükselt
# Değerlendirmeyi çalıştır
# promptfoo eval -j 1 --no-progress-bar
```

## Kurulumunuzu Test Etme

### Hızlı Test

1. Slack'te bir test kanalı oluşturun.
2. Botunuzu kanala davet edin: `/invite @BotAdınız`
3. Basit bir test yapılandırması oluşturun:

   ```yaml
   providers:
     - id: slack:KANAL_KIMLIGINIZ
       config:
         timeout: 30000

   prompts:
     - "Test mesajı - lütfen 'başarılı' şeklinde yanıtlayın"

   tests:
     - assert:
         - type: contains
           value: başarılı
   ```

4. Çalıştırın: `npx promptfoo eval -j 1`
5. 30 saniye içinde Slack'ten yanıt verin.

### Yaygın Sorunlar

- **Bot kanalda değil**: Her zaman önce botu `/invite @BotAdınız` ile davet edin.
- **Yanıt yakalanmadı**: Botun tüm gerekli kapsamlarına (scopes) sahip olup olmadığını kontrol edin.
- **Hız limitleri**: Sağlayıcı her 1 saniyede bir kontrol yapar. Katı hız limitleri olan uygulamalar için zaman aşımlarını artırmayı ve daha uzun kontrol aralıkları kullanmayı düşünün.

## Ayrıca Bakınız

- [Manuel Giriş Sağlayıcı](/docs/providers/manual-input) - Terminal tabanlı insan girişi için
- [Webhook Sağlayıcısı](/docs/providers/webhook) - Programlı entegrasyonlar için
- [Yapılandırma Kılavuzu](/docs/configuration/guide) - Genel sağlayıcı kurulumu
