---
sidebar_label: Travis CI
description: Promptfoo ile Travis CI işlem hatlarında otomatik LLM testlerini kurun. AI promptlarını ve çıktılarını sürekli değerlendirmek için ortam değişkenlerini, yapıt (artifact) depolamayı yapılandırın.
---

# Travis CI Entegrasyonu

Bu kılavuz, CI işlem hattınızın bir parçası olarak değerlendirmeleri çalıştırmak için promptfoo'nun Travis CI ile nasıl kurulacağını gösterir.

## Ön Koşullar

- Bir promptfoo projesi içeren GitHub deposu
- Deponuza bağlı bir Travis CI hesabı
- [Travis CI ortam değişkenleri](https://docs.travis-ci.com/user/environment-variables/) olarak saklanan LLM sağlayıcılarınız için API anahtarları

## Travis CI Kurulumu

Deponuzun kök dizininde aşağıdaki yapılandırmaya sahip `.travis.yml` adında yeni bir dosya oluşturun:

```yaml
language: node_js
node_js:
  - 18

cache:
  directories:
    - node_modules

before_install:
  - npm install -g promptfoo

install:
  - npm ci

script:
  - npx promptfoo eval

after_success:
  - echo "Prompt değerlendirmesi başarıyla tamamlandı"

after_failure:
  - echo "Prompt değerlendirmesi başarısız oldu"

# Değerlendirme sonuçlarını yapıt (artifact) olarak kaydet
before_deploy:
  - mkdir -p artifacts
  - cp promptfoo-results.json artifacts/

deploy:
  provider: s3
  bucket: 'bucket-adiniz' # Kendi bucket adınızla değiştirin
  skip_cleanup: true
  local_dir: artifacts
  on:
    branch: main
```

## Ortam Değişkenleri

LLM sağlayıcı API anahtarlarınızı Travis CI'da ortam değişkenleri olarak saklayın:

1. Travis CI'da deponuza gidin
2. More options > Settings > Environment Variables bölümüne gidin
3. Her sağlayıcı API anahtarı için değişkenler ekleyin (örneğin, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`)
4. Günlüklerde görüntülenmediklerinden emin olmak için bunları "secure" (güvenli) olarak işaretleyin

## Gelişmiş Yapılandırma

### Başarısız Savlar Durumunda Derlemeyi Durdur

Promptfoo savları başarılı olmadığında işlem hattının başarısız olmasını sağlayabilirsiniz:

```yaml
script:
  - npx promptfoo eval --fail-on-error
```

### Birden Fazla Node.js Sürümünde Test Etme

Değerlendirmelerinizi farklı Node.js sürümlerinde test edin:

```yaml
language: node_js
node_js:
  - 18
  - 20

script:
  - npx promptfoo eval
```

### Farklı Platformlarda Çalıştırma

Birden fazla işletim sisteminde değerlendirme yapın:

```yaml
language: node_js
node_js:
  - 18

os:
  - linux
  - osx

script:
  - npx promptfoo eval
```

### Koşullu Derlemeler

Değerlendirmeleri yalnızca belirli dallarda (branch) veya koşullarda çalıştırın:

```yaml
language: node_js
node_js:
  - 18

# Değerlendirmeleri yalnızca ana dalda ve pull request'lerde çalıştır
if: branch = main OR type = pull_request

script:
  - npx promptfoo eval
```

### Özel Derleme Aşamaları (Stages)

Derleme süreciniz için farklı aşamalar kurun:

```yaml
language: node_js
node_js:
  - 18

stages:
  - test
  - evaluate

jobs:
  include:
    - stage: test
      script: npm test
    - stage: evaluate
      script: npx promptfoo eval
      env:
        - MODEL=gpt-4
    - stage: evaluate
      script: npx promptfoo eval
      env:
        - MODEL=claude-3-opus-20240229
```

## Sorun Giderme

Travis CI entegrasyonunuzla ilgili sorunlarla karşılaşırsanız:

- **Günlükleri kontrol edin**: Hataları belirlemek için Travis CI'daki ayrıntılı günlükleri inceleyin
- **Ortam değişkenlerini doğrulayın**: API anahtarlarınızın doğru ayarlandığından emin olun
- **Derleme zaman aşımları**: Travis CI'ın görevler için varsayılan 50 dakikalık bir zaman aşımı süresi vardır. Uzun süreli değerlendirmeler için [görev zaman aşımlarını](https://docs.travis-ci.com/user/customizing-the-build/#build-timeouts) yapılandırmanız gerekebilir
- **Kaynak kısıtlamaları**: Kaynak sınırlarına takılıyorsanız büyük değerlendirmeleri daha küçük parçalara ayırmayı düşünün
