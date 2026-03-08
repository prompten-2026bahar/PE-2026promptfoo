---
sidebar_label: Bitbucket Pipelines
description: Yerleşik savları kullanarak değerlendirmeleri otomatikleştirmek, sonuçları takip etmek ve yapay zeka modellerinizdeki gerilemeleri yakalamak için promptfoo LLM testini Bitbucket Pipelines CI/CD ile entegre edin
---

# Bitbucket Pipelines Entegrasyonu

Bu kılavuz, CI hattınızın bir parçası olarak değerlendirmeleri çalıştırmak için promptfoo'nun Bitbucket Pipelines ile nasıl kurulacağını gösterir.

## Ön Koşullar

- Bir promptfoo projesi içeren Bitbucket deposu
- Deponuz için Bitbucket Pipelines'ın etkinleştirilmiş olması
- [Bitbucket depo değişkenleri](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/) olarak saklanan LLM sağlayıcılarınız için API anahtarları

## Bitbucket Pipelines Kurulumu

Deponuzun kök dizininde aşağıdaki yapılandırmaya sahip `bitbucket-pipelines.yml` adında yeni bir dosya oluşturun:

```yaml
image: node:20

pipelines:
  default:
    - step:
        name: Promptfoo Değerlendirmesi
        caches:
          - node
        script:
          - npm ci
          - npm install -g promptfoo
          - npx promptfoo eval
        artifacts:
          - promptfoo-results.json
          - promptfoo-results.xml
```

## Ortam Değişkenleri

LLM sağlayıcı API anahtarlarınızı Bitbucket'ta depo değişkenleri olarak saklayın:

1. Bitbucket'taki deponuza gidin
2. Depo ayarları (Repository settings) > İşlem Hatları (Pipelines) > Depo değişkenleri (Repository variables) bölümüne gidin
3. Her sağlayıcı API anahtarı için değişkenler ekleyin (örneğin, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`)
4. Günlüklerde görüntülenmediklerinden emin olmak için bunları "Secured" (Güvenli) olarak işaretleyin

## Gelişmiş Yapılandırma

### Başarısız Savlar Durumunda İşlem Hattını Durdur

promptfoo savları başarılı olmadığında işlem hattının başarısız olmasını sağlayabilirsiniz:

```yaml
script:
  - npm ci
  - npm install -g promptfoo
  - npx promptfoo eval --fail-on-error
```

### Özel Değerlendirme Yapılandırmaları

Değerlendirmeleri belirli yapılandırma dosyalarıyla çalıştırın:

```yaml
script:
  - npm ci
  - npm install -g promptfoo
  - npx promptfoo eval --config custom-config.yaml
```

### Pull Request'lerde Çalıştırma

Pull request'ler için farklı davranışlar yapılandırın:

```yaml
pipelines:
  default:
    - step:
        name: Promptfoo Değerlendirmesi
        script:
          - npm ci
          - npm install -g promptfoo
          - npx promptfoo eval
  pull-requests:
    '**':
      - step:
          name: Promptfoo PR Değerlendirmesi
          script:
            - npm ci
            - npm install -g promptfoo
            - npx promptfoo eval --fail-on-error
```

### Programlanmış Değerlendirmeler

Değerlendirmeleri bir programa göre çalıştırın:

```yaml
pipelines:
  default:
    - step:
        name: Promptfoo Değerlendirmesi
        script:
          - npm ci
          - npm install -g promptfoo
          - npx promptfoo eval
  custom:
    nightly-evaluation:
      - step:
          name: Gece Değerlendirmesi
          script:
            - npm ci
            - npm install -g promptfoo
            - npx promptfoo eval
  schedules:
    - cron: '0 0 * * *' # Her gün gece yarısı (UTC) çalıştır
      pipeline: custom.nightly-evaluation
      branches:
        include:
          - main
```

### Paralel Test Yapma

Birden fazla yapılandırmada paralel olarak test yapın:

```yaml
image: node:20

pipelines:
  default:
    - parallel:
        - step:
            name: GPT-4 ile Değerlendir
            script:
              - npm ci
              - npm install -g promptfoo
              - npx promptfoo eval --providers.0.config.model=gpt-4
            artifacts:
              - promptfoo-results-gpt4.json
        - step:
            name: Claude ile Değerlendir
            script:
              - npm ci
              - npm install -g promptfoo
              - npx promptfoo eval --providers.0.config.model=claude-3-opus-20240229
            artifacts:
              - promptfoo-results-claude.json
```

### Pipe Kullanımı

Daha kısa bir yapılandırma için Bitbucket Pipes özelliklerinden yararlanın:

```yaml
image: node:20

pipelines:
  default:
    - step:
        name: Promptfoo Değerlendirmesi
        script:
          - npm ci
          - npm install -g promptfoo
          - npx promptfoo eval
        after-script:
          - pipe: atlassian/junit-report:0.3.0
            variables:
              REPORT_PATHS: 'promptfoo-results.xml'
```

## Sorun Giderme

Bitbucket Pipelines entegrasyonunuzla ilgili sorunlarla karşılaşırsanız:

- **Günlükleri kontrol edin**: Hataları belirlemek için Bitbucket'taki ayrıntılı günlükleri inceleyin
- **Depo değişkenlerini doğrulayın**: API anahtarlarınızın doğru ayarlandığından emin olun
- **İşlem hattı zaman aşımları**: Bitbucket Pipelines'ın zaman aşımı sınırları vardır. Uzun süreli değerlendirmeler için bunları parçalara ayırmayı veya [zaman aşımını artırmayı](https://support.atlassian.com/bitbucket-cloud/docs/build-timeouts/) düşünün
- **SSH ile hata ayıklama**: Karmaşık sorunlar için, işlem hattı ortamında doğrudan hata ayıklamak üzere [SSH erişimini etkinleştirin](https://support.atlassian.com/bitbucket-cloud/docs/debug-your-pipelines-with-ssh/)
