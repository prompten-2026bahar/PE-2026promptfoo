---
sidebar_label: CircleCI
description: Promptfoo ile CircleCI süreçlerinizde LLM testlerini otomatikleştirmeyi öğrenin. CI/CD ortamlarında promptları ve modelleri doğrulamak için önbelleğe alma, API anahtarları ve değerlendirme iş akışlarını yapılandırın.
---

# CircleCI ile Promptfoo Kurulumu

Bu kılavuz, promptfoo'nun LLM değerlendirmesini CircleCI süreçlerinize nasıl dahil edeceğinizi gösterir. Bu sayede, deponuzda değişiklik yapıldığında promptlarınızı ve modellerinizi otomatik olarak test edebilirsiniz.

## Ön Koşullar

- Deponuza bağlı bir CircleCI hesabı
- LLM sağlayıcınızın API anahtarları (örneğin, OpenAI API anahtarı)
- CircleCI yapılandırması hakkında temel bilgi

## Yapılandırma Adımları

### 1. CircleCI Yapılandırmasını Oluşturun

Deponuzda bir `.circleci/config.yml` dosyası oluşturun. İşte promptfoo'yu kuran ve değerlendirmeleri çalıştıran temel bir yapılandırma:

    ```yaml
    version: 2.1
    jobs:
      evaluate_prompts:
        docker:
          - image: cimg/node:20.0.0
        steps:
          - checkout

          - restore_cache:
              keys:
                - promptfoo-cache-v1-{{ .Branch }}-{{ checksum "prompts/**/*" }}
                - promptfoo-cache-v1-{{ .Branch }}
                - promptfoo-cache-v1-

          - run:
              name: promptfoo'yu Kur
              command: npm install -g promptfoo

          - run:
              name: Prompt değerlendirmesini çalıştır
              command: promptfoo eval -c promptfooconfig.yaml --prompts prompts/**/*.json --share -o output.json
              environment:
                OPENAI_API_KEY: ${OPENAI_API_KEY}
                PROMPTFOO_CACHE_PATH: ~/.promptfoo/cache

          - save_cache:
              key: promptfoo-cache-v1-{{ .Branch }}-{{ checksum "prompts/**/*" }}
              paths:
                - ~/.promptfoo/cache

          - store_artifacts:
              path: output.json
              destination: evaluation-results

    workflows:
      version: 2
      evaluate:
        jobs:
          - evaluate_prompts:
              filters:
                paths:
                  - prompts/**/*
    ```

### 2. Ortam Değişkenlerini Ayarlayın

1. CircleCI'daki proje ayarlarınıza gidin
2. Ortam Değişkenleri (Environment Variables) bölümüne gidin
3. LLM sağlayıcınızın API anahtarlarını ekleyin:
   - örneğin, OpenAI kullanıyorsanız `OPENAI_API_KEY` ekleyin

### 3. Önbelleğe Almayı Yapılandırın (İsteğe Bağlı ama Önerilir)

Yukarıdaki yapılandırma, zamandan ve API maliyetlerinden tasarruf etmek için önbelleğe almayı içerir. Önbellek:

- LLM API yanıtlarını saklar
- Dal (branch) ve içerik karmasına (hash) göre anahtarlanır
- `~/.promptfoo/cache` dizinine kaydedilir

### 4. Sonuçları Saklama

Yapılandırma, değerlendirme sonuçlarını yapıt (artifact) olarak saklar:

- Sonuçlar `output.json` dosyasına kaydedilir
- CircleCI bunları Artifacts sekmesinde erişilebilir hale getirir
- `--share` bayrağı, sonuçlar için paylaşılabilir bir web URL'si oluşturur

## Gelişmiş Yapılandırma

### Özel Test Adımları Ekleme

Değerlendirme sonuçlarını işlemek için özel adımlar ekleyebilirsiniz:

    ```yaml
    - run:
        name: Değerlendirme sonuçlarını kontrol et
        command: |
          if jq -e '.results.stats.failures > 0' output.json; then
            echo "Değerlendirme hatalar içeriyor"
            exit 1
          fi
    ```

### Paralel Değerlendirme

Büyük test paketleri için değerlendirmeleri paralelleştirebilirsiniz:

    ```yaml
    jobs:
      evaluate_prompts:
        parallelism: 3
        steps:
          - run:
              name: Testleri böl
              command: |
                prompts=$(find prompts -name "*.json" | circleci tests split)
                promptfoo eval -c promptfooconfig.yaml --prompts $prompts
    ```

## Örnek Çıktı

Değerlendirme çalıştıktan sonra şunları göreceksiniz:

- CircleCI kullanıcı arayüzünde test sonuçları
- Tam değerlendirme verilerini içeren yapıtlar (artifacts)
- Sonuçları promptfoo web görüntüleyicisinde görmek için paylaşılabilir bir bağlantı
- Herhangi bir test hatası CircleCI görevinin başarısız olmasına neden olur

## Sorun Giderme

Yaygın sorunlar ve çözümleri:

1. **Önbellek çalışmıyor:**
   - Önbellek anahtarının yapılandırmanızla eşleştiğini doğrulayın
   - Önbellek yolunun mevcut olduğunu kontrol edin
   - Dosya izinlerinin doğru olduğundan emin olun

2. **API anahtarı hataları:**
   - Ortam değişkenlerinin CircleCI'da ayarlandığını onaylayın
   - Değişken adlarındaki yazım hatalarını kontrol edin
   - API anahtarı izinlerini doğrulayın

3. **Değerlendirme zaman aşımı:**
   - Görevinizdeki `no_output_timeout` ayarını yapın
   - Testleri daha küçük yığınlara bölmeyi düşünün

Promptfoo yapılandırması hakkında daha fazla ayrıntı için [yapılandırma referansı](/docs/configuration/reference) sayfasına bakın.
