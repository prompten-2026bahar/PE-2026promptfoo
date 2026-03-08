---
sidebar_label: GitLab CI
description: Promptfoo ile GitLab CI süreçlerinizde LLM testlerini otomatikleştirmeyi öğrenin. CI/CD sürecinizde promptları ve modelleri doğrulamak için önbelleğe alma, API anahtarları ve değerlendirme iş akışlarını yapılandırın.
---

# GitLab CI ile Promptfoo Kurulumu

Bu kılavuz, Promptfoo'nun LLM değerlendirmesini GitLab CI süreçlerinize nasıl dahil edeceğinizi gösterir. Bu sayede, deponuzda değişiklik yapıldığında promptlarınızı ve modellerinizi otomatik olarak test edebilirsiniz.

## Ön Koşullar

- Bir GitLab deposu
- LLM sağlayıcınızın API anahtarları (örneğin, OpenAI API anahtarı)
- GitLab CI/CD yapılandırması hakkında temel bilgi

## Yapılandırma Adımları

### 1. GitLab CI Yapılandırmasını Oluşturun

Deponuzun kök dizininde bir `.gitlab-ci.yml` dosyası oluşturun. İşte Promptfoo'yu kuran ve değerlendirmeleri çalıştıran temel bir yapılandırma:

```yaml
image: node:20

evaluate_prompts:
  script:
    - npm install -g promptfoo
    - promptfoo eval -c promptfooconfig.yaml --prompts prompts/**/*.json --share -o output.json
  variables:
    OPENAI_API_KEY: ${OPENAI_API_KEY}
    PROMPTFOO_CACHE_PATH: .promptfoo/cache
  cache:
    key:
      files:
        - prompts/**/*
    paths:
      - .promptfoo/cache
  artifacts:
    paths:
      - output.json
    reports:
      json: output.json
  rules:
    - changes:
        - prompts/**/*
```

### 2. Ortam Değişkenlerini Ayarlayın

1. GitLab projenizde Ayarlar (Settings) > CI/CD bölümüne gidin
2. Değişkenler (Variables) bölümünü genişletin
3. LLM sağlayıcınızın API anahtarlarını ekleyin:
   - "Add Variable" (Değişken Ekle) düğmesine tıklayın
   - `OPENAI_API_KEY` (veya diğer sağlayıcı anahtarlarını) maskelenmiş ve korunmuş (masked and protected) değişkenler olarak ekleyin

### 3. Önbelleğe Almayı Yapılandırın (İsteğe Bağlı ama Önerilir)

Yukarıdaki yapılandırma, zamandan ve API maliyetlerinden tasarruf etmek için önbelleğe almayı içerir. Önbellek:

- LLM API yanıtlarını saklar
- Prompt dosyalarınızın içeriğine göre anahtarlanır
- `.promptfoo/cache` dizinine kaydedilir

### 4. Sonuçları Saklama

Yapılandırma, değerlendirme sonuçlarını yapıt (artifact) olarak saklar:

- Sonuçlar `output.json` dosyasına kaydedilir
- GitLab bunları görev yapıtlarında (job artifacts) erişilebilir hale getirir
- `--share` bayrağı, sonuçlar için paylaşılabilir bir web URL'si oluşturur

## Gelişmiş Yapılandırma

### Özel Test Adımları Ekleme

Değerlendirme sonuçlarını işlemek için özel adımlar ekleyebilirsiniz:

```yaml
evaluate_prompts:
  script:
    - npm install -g promptfoo
    - promptfoo eval -c promptfooconfig.yaml --prompts prompts/**/*.json --share -o output.json
    - |
      if jq -e '.results.stats.failures > 0' output.json; then
        echo "Değerlendirme hatalar içeriyor"
        exit 1
      fi
```

### Paralel Değerlendirme

Büyük test paketleri için GitLab'ın paralel özelliğini kullanabilirsiniz:

```yaml
evaluate_prompts:
  parallel: 3
  script:
    - |
      prompts=$(find prompts -name "*.json" | awk "NR % $CI_NODE_TOTAL == $CI_NODE_INDEX")
      promptfoo eval -c promptfooconfig.yaml --prompts $prompts
```

### GitLab Merge Request'leri ile Entegrasyon

Görevi, sonuçları merge request yorumu olarak gönderecek şekilde yapılandırabilirsiniz:

```yaml
evaluate_prompts:
  script:
    - npm install -g promptfoo
    - |
      OUTPUT=$(promptfoo eval -c promptfooconfig.yaml --prompts prompts/**/*.json --share)
      SHARE_URL=$(echo "$OUTPUT" | grep "View results:" | cut -d' ' -f3)
      echo "Değerlendirme Sonuçları: $SHARE_URL" | tee merge_request_comment.txt
  artifacts:
    reports:
      junit: output.json
    paths:
      - merge_request_comment.txt
  after_script:
    - |
      if [ -n "$CI_MERGE_REQUEST_IID" ]; then
        curl --request POST \
          --header "PRIVATE-TOKEN: ${GITLAB_API_TOKEN}" \
          --data-urlencode "body=$(cat merge_request_comment.txt)" \
          "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes"
      fi
```

## Örnek Çıktı

Değerlendirme çalıştıktan sonra şunları göreceksiniz:

- GitLab CI/CD işlem hattı arayüzünde test sonuçları
- Tam değerlendirme verilerini içeren yapıtlar (artifacts)
- Sonuçları promptfoo web görüntüleyicisinde görmek için paylaşılabilir bir bağlantı
- Herhangi bir test hatası GitLab görevinin başarısız olmasına neden olur

## Sorun Giderme

Yaygın sorunlar ve çözümleri:

1. **Önbellek çalışmıyor:**
   - Yapılandırmanızdaki önbellek anahtarını ve yollarını doğrulayın
   - Önbellek yolunun mevcut olduğunu kontrol edin
   - Dosya izinlerinin doğru olduğundan emin olun

2. **API anahtarı hataları:**
   - Değişkenlerin GitLab CI/CD ayarlarında tanımlandığını onaylayın
   - Değişkenlerin düzgün şekilde maskelendiğini kontrol edin
   - API anahtarı izinlerini doğrulayın

3. **Görev zaman aşımına uğruyor:**
   - Görev yapılandırmanıza bir zaman aşımı geçersiz kılması (timeout override) ekleyin:
     ```yaml
     evaluate_prompts:
       timeout: 2 hours
     ```

Promptfoo yapılandırması hakkında daha fazla ayrıntı için [yapılandırma referansı](/docs/configuration/reference) sayfasısına bakın.
