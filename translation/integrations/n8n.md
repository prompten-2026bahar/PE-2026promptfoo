---
sidebar_label: n8n
title: n8n İş Akışlarında Promptfoo Kullanımı
description: Otomatik testler, güvenlik ve kalite eşikleri ve sonuç paylaşımı için Promptfoo'nun LLM değerlendirmesini n8n iş akışlarınıza nasıl dahil edeceğinizi öğrenin
---

# n8n İş Akışlarında Promptfoo Kullanımı

Bu kılavuz, aşağıdakileri yapabilmeniz için bir **n8n** iş akışından Promptfoo değerlendirmelerini nasıl çalıştıracağınızı gösterir:

- Gece yarısı veya isteğe bağlı LLM testleri planlamak,
- Alt akış adımlarını (Slack/Teams uyarıları, birleştirme onayları vb.) başarı oranlarına göre denetlemek ve
- Promptfoo tarafından oluşturulan zengin sonuç bağlantılarını yayınlamak.

## Ön Koşullar

| Ne                                                                                            | Neden                                                                 |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Kendi kendine barındırılan (Self‑hosted) n8n ≥ v1** (Docker veya bare‑metal)               | "Execute Command" düğmesine erişim sağlar.                            |
| **Promptfoo CLI** (konteynerde veya ana bilgisayarda mevcut olmalı)                           | `promptfoo eval` komutunu çalıştırmak için gereklidir.                |
| (İsteğe bağlı) **LLM sağlayıcı API anahtarları** (ortam değişkeni veya n8n kimlik bilgisi)    | Örnek: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, …                       |
| (İsteğe bağlı) **Aynı iş akışında Slack / e-posta / GitHub düğümleri**                        | Değerlendirme bittiğinde bildirimler veya yorumlar için kullanılır.   |

### Özel bir Docker imajı oluşturma (önerilen)

En kolay yol, her iş akışı çalışmasında CLI'nın hazır olması için Promptfoo'yu n8n imajınıza dahil etmektir:

```dockerfile
# Dockerfile
FROM n8nio/n8n:latest          # veya sabit bir etiket
USER root                      # paket yüklemek için yetki al
RUN npm install -g promptfoo   # CLI'yı sistem genelinde kurar
USER node                      # kök olmayan kullanıcıya geri dön
```

**`docker‑compose.yml`** dosyasını güncelleyin:

```yaml
services:
  n8n:
    build: .
    env_file: .env # OPENAI_API_KEY'inizin bulunduğu yer
    volumes:
      - ./data:/data # promptlar ve yapılandırmalar burada bulunur
```

İmajı yeniden oluşturmayı tercih etmiyorsanız, Promptfoo'yu **Execute Command** düğmesi içinde anında kurabilirsiniz, ancak bu her çalıştırmaya 10‑15 saniye ekler.

## Temel "Çalıştır ve Uyarla" iş akışı

Aşağıda çoğu ekibin başladığı minimum model yer almaktadır:

| #   | Düğüm (Node)                       | Amaç                                                                   |
| --- | ---------------------------------- | ---------------------------------------------------------------------- |
| 1   | **Giriş** (Cron veya Webhook)      | Ne zaman değerlendirme yapılacağına karar verir (gece, Git push vb.).  |
| 2   | **Execute Command**                | Promptfoo'yu çalıştırır ve ham stdout / stderr yayar.                  |
| 3   | **Code / Set**                     | Sonuç JSON'unu ayrıştırır, başarı/hata sayılarını ve paylaşım URL'sini alır. |
| 4   | **IF**                             | "hatalar > 0" durumuna göre dallara ayrılır.                          |
| 5   | **Slack / Email / GitHub**         | Eşik (gate) geçilemediğinde uyarı veya PR yorumu gönderir.             |

### Execute Command düğmesi yapılandırması

```sh
promptfoo eval \
 -c /data/promptfooconfig.yaml \
 --prompts "/data/prompts/**/*.json" \
 --output /tmp/pf-results.json \
 --share --fail-on-error
cat /tmp/pf-results.json
```

Çalışma dizinini `/data` olarak ayarlayın (Docker birimi ile bağlayın) ve bir kez yürütülecek şekilde (tetikleyici başına bir çalışma) yapılandırın.

Düğüm, makine tarafından okunabilir bir sonuç dosyası yazar **ve** bunu stdout'a yazdırır, böylece bir sonraki düğüm basitçe `JSON.parse($json["stdout"])` işlemini yapabilir.

:::info
Güvendiğimiz **Execute Command** düğmesi yalnızca **kendi kendine barındırılan (self-hosted)** n8n sürümlerinde mevcuttur. n8n Cloud henüz bu özelliği sunmamaktadır.
:::

### Örnek "Ayrıştır ve uyar" parçası (Code düğümü, TypeScript)

```ts
// Girdi: önceki düğümden gelen ham JSON dizesi
const output = JSON.parse(items[0].json.stdout as string);

const { successes, failures } = output.results.stats;
items[0].json.passRate = successes / (successes + failures);
items[0].json.failures = failures;
items[0].json.shareUrl = output.shareableUrl;

return items;
```

Bir **IF** düğümü daha sonra yürütmeyi yönlendirebilir:

- **failures = 0** → _yeşil_ yolu izle (belki sonuçları arşivle).
- **failures > 0** → Slack'e gönder veya pull request'e yorum yap.

## Gelişmiş modeller

### Farklı yapılandırmaları paralel çalıştırma

İlk **Execute Command** düğmesini bir model kimlikleri veya yapılandırma dosyaları dizisi üzerinde döngüye sokun ve her çalışmayı ayrı bir öğe olarak iletin. Alt akış düğümleri otomatik olarak dağılacak ve her sonucu bağımsız olarak işleyecektir.

### Sürüm kontrollü promptlar

Promptlar dizininizi ve yapılandırma dosyanızı konteyner içindeki `/data` yoluna bağlayın. Git'e yeni promptlar gönderdiğinizde, CI/CD sisteminiz hemen yeniden değerlendirme yapmak için **n8n REST API**'sini veya bir **Webhook tetikleyicisini** çağırabilir.

### Tüm iş akışını otomatik olarak başarısız yapma

n8n'i `n8n start --tunnel` aracılığıyla **headless** olarak çalıştırıyorsanız, bu iş akışını CI işlem hatlarından (GitHub Actions, GitLab vb.) [`n8n execute` CLI komutuyla](https://docs.n8n.io/hosting/cli-commands/) çağırabilir ve ardından HTTP yanıt kodunu kontrol edebilirsiniz; Execute Command düğmesinden `exit 1` döndürmek hatayı yayacaktır.

## Güvenlik ve en iyi uygulamalar

- **API anahtarlarını gizli tutun** – Bunları n8n kimlik bilgisi deposunda (credential store) saklayın veya Docker gizli yerlerinden (secrets) ortam değişkeni olarak ekleyin; iş akışlarına sabit kodlamayın.
- **Kaynak kullanımı** – Promptfoo, `PROMPTFOO_CACHE_PATH` aracılığıyla önbelleğe almayı destekler; çalışmalar arasında kalıcı olması için bu dizini bağlayın.
- **Zaman aşımları** – Sert yürütme sınırlarına ihtiyacınız varsa `promptfoo eval` komutunu `timeout --signal=SIGKILL 15m …` (Linux) ile sarmalayın.
- **Günlüğe kaydetme (Logging)** – Yığın izlemelerini (stack traces) kaçırmamak için Execute Command'ın `stderr` alanını özel bir günlük kanalına yönlendirin.

## Sorun Giderme

| Belirti                                           | Olası neden / çözüm                                                                                                        |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **`Execute Command node not available`**          | n8n Cloud kullanıyorsunuz; kendi kendine barındırılan sürüme geçin.                                                        |
| **`promptfoo: command not found`**                | Promptfoo konteyner içinde kurulu değil. Docker imajınızı yeniden oluşturun veya bir kurulum adımı ekleyin.                |
| **Yapılandırma yollarında `ENOENT` ile hata**     | Prompt/yapılandırma biriminin, komutta referans verdiğiniz yola bağlandığından emin olun.                                  |
| **Büyük değerlendirmeler zaman aşımına uğruyor** | Düğümün "Timeout (s)" ayarını artırın _veya_ test vakalarınızı gruplandırın (chunk) ve iş akışı içinde yineleyin (iterate). |

## Sonraki adımlar

1. Değerlendirmeleri çok adımlı RAG işlem hatlarına bağlamak için Promptfoo'yu **n8n AI Transform** düğümü ile birleştirin.
2. Geçmiş başarı oranlarını izlemek ve gerilemeleri (regressions) tespit etmek için **n8n Insights**'ı (kendi kendine barındırılan EE) kullanın.
3. İlham almak için diğer [CI entegrasyonlarına](/docs/integrations/ci-cd) ([GitHub Actions](/docs/integrations/github-action), [CircleCI](/docs/integrations/circle-ci) vb.) göz atın.

İyi otomatikleştirmeler!
