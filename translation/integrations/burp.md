---
sidebar_label: Burp Suite
description: Promptfoo'nun kırmızı takım (red teaming) yeteneklerini Burp Suite Intruder ile entegre ederek, LLM uygulamalarını hapis kırma (jailbreak) açıklarına karşı test edin ve otomatik güvenlik taramaları yapın
---

# Burp Suite ile LLM Hapis Kırma (Jailbreak) Açıklarını Bulma

Bu kılavuz, LLM tabanlı uygulamaların güvenlik testi için Promptfoo'nun uygulama düzeyinde hapis kırma (jailbreak) oluşturma özelliğini Burp Suite'in Intruder özelliği ile nasıl entegre edeceğinizi gösterir.

Sonuç olarak, LLM hapis kırma açıklarını test etmek için kullanılabilecek bir Burp Suite Intruder yapılandırması elde edeceksiniz.

![Burp Suite Intruder](/img/docs/burp/burp-jailbreak-intruder.png)

(Yukarıdaki örnekte, doğrudan OpenAI API'sine hapis kırma uygulayarak dengesiz bir yanıt döndürmesini sağladık.)

## Genel Bakış

Burp Suite entegrasyonu şunları yapmanıza olanak tanır:

1. Promptfoo'nun kırmızı takım (red teaming) yeteneklerini kullanarak çekişmeli test vakaları oluşturun
2. Bu test vakalarını Burp Intruder ile uyumlu bir formatta dışa aktarın
3. Test vakalarını Burp Suite'te güvenlik testi için yük (payload) olarak kullanın

## Ön Koşullar

- Burp Suite Community Edition veya Professional Edition
- Promptfoo'nun kurulu olması (`npm install -g promptfoo`)

## Yapılandırma Adımları

### Seçenek 1: Web Arayüzünü Kullanma

Eğer zaten test vakaları içeren bir değerlendirme çalıştırdıysanız, bunları doğrudan web arayüzünden dışa aktarabilirsiniz:

1. Değerlendirme sonuçlarını tarayıcınızda açın
2. Sağ üstteki "Değerlendirme İşlemleri" (Evaluation Actions) > "İndir" (Download) menüsüne tıklayın
3. "Gelişmiş Seçenekler" (Advanced Options) altında "Burp Suite Yüklerini İndir" (Download Burp Suite Payloads) seçeneğine tıklayın

Bu işlem, değerlendirmenizdeki tüm benzersiz test girişlerini içeren, uygun JSON kaçış karakterleri ve URL kodlamasına sahip bir `.burp` dosyası oluşturacaktır.

![Burp Suite export](/img/docs/burp/burp-export-frontend.png)

### Seçenek 2: Komut Satırını Kullanma

İlk olarak, çekişmeli test vakaları oluşturun ve bunları Burp formatında dışa aktarın:

```bash
promptfoo redteam generate -o payloads.burp --burp-escape-json
```

:::tip
`--burp-escape-json` bayrağı, yükleriniz JSON isteklerine ekleneceği zaman önemlidir. Geçerli JSON sözdizimini korumak için özel karakterlerin uygun şekilde kaçış karakterleriyle işaretlenmesini sağlar.
:::

#### Burp Intruder'a Aktarma

1. Burp Suite'te LLM destekli uç noktanıza giden bir isteği yakalayın (intercept)
2. Sağ tıklayın ve "Send to Intruder" (Intruder'a Gönder) seçeneğini seçin
3. Intruder sekmesinde:
   - Saldırı türünü ayarlayın (genellikle "Sniper" veya "Pitchfork")
   - Yükleri test etmek istediğiniz enjeksiyon noktalarını işaretleyin
   - "Payloads" (Yükler) sekmesine gidin
   - "Load" (Yükle) düğmesine tıklayın ve `payloads.burp` dosyanızı seçin
4. "Payload processing" (Yük işleme) altında URL kod çözmeyi (URL-decoding) etkinleştirin (promptfoo'nun .burp çıktısı, çok satırlı yükleri desteklemek için URL kodludur)

![Burp Intruder LLM kırmızı takım yapılandırması](/img/docs/burp/burp-jailbreak-intruder-setup.png)

#### Örnek Yapılandırma

Hedeflenmiş test vakaları oluşturmaya yönelik bir örnek. `promptfooconfig.yaml` dosyasında:

```yaml
redteam:
  plugins:
    - harmful
  strategies:
    - jailbreak
    - jailbreak:composite
    - prompt-injection
```

Burp uyumlu yükler oluşturun:

```bash
promptfoo redteam generate -o payloads.burp --burp-escape-json
```

Bu, Burp Intruder'da kullanıma hazır yüklerin bulunduğu bir dosya oluşturacaktır.
