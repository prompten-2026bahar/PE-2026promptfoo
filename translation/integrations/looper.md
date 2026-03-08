---
sidebar_label: Looper
description: Promptfoo'yu Looper iş akışlarıyla entegre ederek CI/CD süreçlerinde LLM testlerini otomatikleştirmeyi öğrenin. Üretim aşamasındaki yapay zeka işlem hatları için kalite eşikleri, önbelleğe alma ve çoklu ortam değerlendirmelerini yapılandırın.
---

# Looper ile Promptfoo Kurulumu

Bu kılavuz, her pull request'te (ve isteğe bağlı gecelik görevlerde) prompt testlerinizin otomatik olarak çalışması için **Promptfoo** değerlendirmelerini bir Looper CI/CD iş akışına nasıl dahil edeceğinizi gösterir.

## Ön Koşullar

- İş akışı yürütme özelliği etkinleştirilmiş, çalışan bir Looper kurulumu
- **Node 22+** ve **jq 1.6+** sağlayan bir derleme görüntüsü (veya tanımlanmış araçlar)
- Depoya gönderilmiş (commit edilmiş) `promptfooconfig.yaml` ve prompt örnekleriniz (`prompts/**/*.json`)

## `.looper.yml` Oluşturun

Deponuzun kök dizinine şu dosyayı ekleyin:

```yaml
language: workflow # isteğe bağlı ama yaygın
 
tools:
  nodejs: 22 # Looper, Node.js sağlar
  jq: 1.7
 
envs:
  global:
    variables:
      PROMPTFOO_CACHE_PATH: '${HOME}/.promptfoo/cache'
 
triggers:
  - pr # her pull request'te çalıştır
  - manual: 'Gecelik Prompt Testleri' # Arayüzdeki manuel düğme
    call: nightly # aşağıdaki gecelik (nightly) akışı çağırır
 
flows:
  # ---------- varsayılan PR akışı ----------
  default:
    - (name Promptfoo'yu Kur) npm install -g promptfoo
 
    - (name Promptları Değerlendir) |
      promptfoo eval \
      -c promptfooconfig.yaml \
      --prompts "prompts/**/*.json" \
      --share \
      -o output.json
 
    - (name Kalite eşiği) |
      SUCC=$(jq -r '.results.stats.successes' output.json)
      FAIL=$(jq -r '.results.stats.failures' output.json)
      echo "✅ $SUCC  ❌ $FAIL"
      test "$FAIL" -eq 0 # sıfır olmayan çıkış, derlemeyi başarısız kılar
 
  # ---------- gecelik zamanlanmış akış ----------
  nightly:
    - call: default # yukarıdaki mantığı yeniden kullan
    - (name Yapıtları yükle) |
      aws s3 cp output.json s3://your-bucket/promptfoo/output.json
```

### Nasıl Çalışır?

| Bölüm | Amaç |
| ----------------------- | ------------------------------------------------------------------- |
| `tools` | Looper'ın sağlaması gereken araç sürümlerini tanımlar. |
| `envs.global.variables` | Her adımda kullanılabilen ortam değişkenleri. |
| `triggers` | İş akışının ne zaman çalışacağını belirler (`pr`, `manuel`, `cron` vb.). |
| `flows` | Sıralı kabuk komutları; yürütme, sıfır olmayan ilk çıkışta durur. |

## Promptfoo Sonuçlarını Önbelleğe Alma

Looper, birinci sınıf bir önbellek API'sine sahip değildir. İki yaygın yaklaşım şunlardır:

1. **Kalıcı birim (Persistent volume)** – `${HOME}/.promptfoo/cache` dizinini yeniden kullanılabilir bir birime bağlayın (mount).
2. **Kalıcılık görevleri (Persistence tasks)** – Akışın başında ve sonunda önbelleği çekin/itin (pull/push):

## Kalite Eşiklerini Ayarlama

```yaml
    - (name Başarı oranı eşiği) |
        TOTAL=$(jq '.results.stats.successes + .results.stats.failures' output.json)
        PASS=$(jq '.results.stats.successes' output.json)
        RATE=$(echo "scale=2; 100*$PASS/$TOTAL" | bc)
        echo "Başarı oranı: %$RATE"
        test $(echo "$RATE >= 95" | bc) -eq 1   # %95'in altındaysa başarısız say
```

## Çoklu Ortam Değerlendirmeleri

Hem hazırlık (staging) hem de üretim yapılandırmalarını değerlendirin ve hataları karşılaştırın:

```yaml
flows:
  compare-envs:
    - (name Üretim-Değerlendirmesi) |
      promptfoo eval \
      -c promptfooconfig.prod.yaml \
      --prompts "prompts/**/*.json" \
      -o output-prod.json
 
    - (name Hazırlık-Değerlendirmesi) |
      promptfoo eval \
      -c promptfooconfig.staging.yaml \
      --prompts "prompts/**/*.json" \
      -o output-staging.json
 
    - (name Karşılaştır) |
      PROD_FAIL=$(jq '.results.stats.failures' output-prod.json)
      STAGE_FAIL=$(jq '.results.stats.failures' output-staging.json)
      if [ "$STAGE_FAIL" -gt "$PROD_FAIL" ]; then
      echo "⚠️  Hazırlık ortamında üretimden daha fazla hata var!"
      fi
```

## Değerlendirme Sonuçlarını GitHub/GitLab'a Gönderme

Değerlendirme sonuçlarını başka yerlere göndermek için şunları kullanın:

- **GitHub görevi**
  ```yaml
  - github --add-comment \
    --repository "$CI_REPOSITORY" \
    --issue "$PR_NUMBER" \
    --body "$(cat comment.md)" # yorumu uygun şekilde ayarlayın
  ```
- REST API'ye karşı bir Kişisel Erişim Jetonu (PAT) ile **cURL**.

## Sorun Giderme

| Sorun | Çözüm |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `npm: komut bulunamadı` | `tools` altına `nodejs:` ekleyin veya Node'un önceden kurulu olduğu bir görüntü kullanın. |
| Önbellek geri yüklenmedi | Yolu ve `files pull` görevinin başarılı olduğunu doğrulayın. |
| Uzun süren görevler | Prompt setlerini ayrı akışlara bölün veya derleme tanımındaki `timeoutMillis` değerini artırın. |
| API hız sınırları | Promptfoo önbelleğini etkinleştirin ve/veya API anahtarını döndürün. |

## En İyi Uygulamalar

1. **Artımlı test** – Yalnızca değişen promptları test etmek için `looper diff --name-only prompts/` çıktısını `promptfoo eval` komutuna aktarın.
2. **Anlamsal sürüm etiketleri** – Kolayca geri dönebilmek için prompt setlerini/yapılandırmalarını etiketleyin.
3. **Sır yönetimi** – API anahtarlarını bir sır deposunda (secret store) saklayın ve bunları ortam değişkenleri olarak enjekte edin.
4. **Yeniden kullanılabilir kütüphane akışları** – Birden fazla depo aynı değerlendirmeye ihtiyaç duyuyorsa, akış tanımını merkezi bir depoda barındırın ve `import` edin.
