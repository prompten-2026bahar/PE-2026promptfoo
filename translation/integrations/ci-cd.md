---
sidebar_label: CI/CD
title: LLM Değerlendirme ve Güvenliği için CI/CD Entegrasyonu
description: Sürekli güvenlik ve kalite kontrolleri için GitHub Actions, GitLab CI ve Jenkins ile CI/CD süreçlerinizde LLM testlerini otomatikleştirmeyi öğrenin
keywords:
  [
    ci/cd,
    sürekli entegrasyon,
    llm testi,
    otomatik değerlendirme,
    güvenlik taraması,
    github actions,
  ]
---

# LLM Değerlendirme ve Güvenliği için CI/CD Entegrasyonu

Deployment öncesinde promptları otomatik olarak değerlendirmek, güvenlik açıklarını test etmek ve kaliteyi sağlamak için promptfoo'yu CI/CD süreçlerinize dahil edin. Bu kılavuz, hem kalite testi hem de güvenlik taraması için modern CI/CD iş akışlarını kapsar.

## LLM Uygulamaları İçin Neden CI/CD?

- **Gerilemeleri erkenden yakalayın** - Prompt değişikliklerini üretime geçmeden önce test edin
- **Güvenlik taraması** - Otomatik kırmızı takım (red teaming) ve güvenlik açığı tespiti
- **Kalite kapıları (Quality gates)** - Minimum performans eşiklerini zorunlu kılın
- **Uyumluluk** - OWASP, NIST ve diğer çerçeveler için raporlar oluşturun
- **Maliyet kontrolü** - Zaman içindeki token kullanımını ve API maliyetlerini takip edin

## Hızlı Başlangıç

Eğer GitHub Actions kullanıyorsanız, [özel GitHub Actions kılavuzumuza](/docs/integrations/github-action) veya [GitHub Marketplace aksiyonuna](https://github.com/marketplace/actions/test-llm-outputs) göz atın.

Diğer platformlar için temel bir örnek:

```bash
# Değerlendirmeyi çalıştır (global kurulum gerekmez)
npx promptfoo@latest eval -c promptfooconfig.yaml -o results.json

# Güvenlik taramasını çalıştır (kırmızı takım)
npx promptfoo@latest redteam run
```

## Ön Koşullar

- CI ortamınızda Node.js 20+ kurulu olması
- LLM sağlayıcı API anahtarları (güvenli ortam değişkenleri olarak saklanır)
- Bir promptfoo yapılandırma dosyası (`promptfooconfig.yaml`)
- (İsteğe bağlı) Konteynerli ortamlar için Docker

## Temel Kavramlar

### 1. Değerlendirme (Eval) ve Kırmızı Takım (Red Teaming)

Promptfoo iki ana CI/CD iş akışını destekler:

**Değerlendirme (Eval)** - Prompt kalitesini ve performansını test edin:

```bash
npx promptfoo@latest eval -c promptfooconfig.yaml
```

**Kırmızı Takım (Red Teaming)** - Güvenlik açığı taraması:

```bash
npx promptfoo@latest redteam run
```

Güvenlik testi detayları için [kırmızı takım hızlı başlangıç](/docs/red-team/quickstart) kılavuzumuza bakın.

### 2. Çıktı Formatları

Promptfoo, farklı CI/CD ihtiyaçları için birden fazla çıktı formatını destekler:

```bash
# Programatik işleme için JSON
npx promptfoo@latest eval -o results.json

# İnsan tarafından okunabilir raporlar için HTML
npx promptfoo@latest eval -o report.html

# Kurumsal araçlar için XML
npx promptfoo@latest eval -o results.xml

# Birden fazla format
npx promptfoo@latest eval -o results.json -o report.html
```

[Çıktı formatları ve işleme](/docs/configuration/outputs) hakkında daha fazla bilgi edinin.

:::info Kurumsal Özellik

SonarQube entegrasyonu [Promptfoo Enterprise](/docs/enterprise/) sürümünde mevcuttur. Standart JSON çıktı formatını kullanın ve SonarQube içe aktarımı için işleyin.

:::

### 3. Kalite Kapıları (Quality Gates)

Kalite eşikleri karşılanmadığında derlemeyi (build) durdurun:

```bash
# Herhangi bir test hatasında durdur
npx promptfoo@latest eval --fail-on-error

# Özel eşik kontrolü
npx promptfoo@latest eval -o results.json
PASS_RATE=$(jq '.results.stats.successes / (.results.stats.successes + .results.stats.failures) * 100' results.json)
if (( $(echo "$PASS_RATE < 95" | bc -l) )); then
  echo "Kalite kapısı başarısız oldu: Başarı oranı ${PASS_RATE}% < 95%"
  exit 1
fi
```

Kapsamlı doğrulama seçenekleri için [savlar ve metrikler](/docs/configuration/expected-outputs) sayfasına bakın.

## Platforma Özgü Kılavuzlar

### GitHub Actions

```yaml title=".github/workflows/eval.yml"
name: LLM Değerlendirme
on:
  pull_request:
    paths:
      - 'prompts/**'
      - 'promptfooconfig.yaml'

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Cache promptfoo
        uses: actions/cache@v4
        with:
          path: ~/.cache/promptfoo
          key: ${{ runner.os }}-promptfoo-${{ hashFiles('prompts/**') }}
          restore-keys: |
            ${{ runner.os }}-promptfoo-

      - name: Değerlendirmeyi çalıştır
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          PROMPTFOO_CACHE_PATH: ~/.cache/promptfoo
        run: |
          npx promptfoo@latest eval \
            -c promptfooconfig.yaml \
            --share \
            -o results.json \
            -o report.html

      - name: Kalite kapısını kontrol et
        run: |
          FAILURES=$(jq '.results.stats.failures' results.json)
          if [ "$FAILURES" -gt 0 ]; then
            echo "❌ Değerlendirme $FAILURES hata ile başarısız oldu"
            exit 1
          fi
          echo "✅ Tüm testler geçti!"

      - name: Sonuçları yükle
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: |
            results.json
            report.html
```

CI/CD'de kırmızı takım çalışması için:

```yaml title=".github/workflows/redteam.yml"
name: Güvenlik Taraması
on:
  schedule:
    - cron: '0 0 * * *' # Günlük
  workflow_dispatch:

jobs:
  red-team:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Kırmızı takım taramasını çalıştır
        uses: promptfoo/promptfoo-action@v1
        with:
          type: 'redteam'
          config: 'promptfooconfig.yaml'
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

Ayrıca bakınız: [Bağımsız GitHub Action örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/github-action).

### GitLab CI

[Ayrıntılı GitLab CI kılavuzumuza](/docs/integrations/gitlab-ci) göz atın.

```yaml title=".gitlab-ci.yml"
image: node:20

evaluate:
  script:
    - |
      npx promptfoo@latest eval \
        -c promptfooconfig.yaml \
        --share \
        -o output.json
  variables:
    OPENAI_API_KEY: ${OPENAI_API_KEY}
    PROMPTFOO_CACHE_PATH: .cache/promptfoo
  cache:
    key: ${CI_COMMIT_REF_SLUG}-promptfoo
    paths:
      - .cache/promptfoo
  artifacts:
    reports:
      junit: output.xml
    paths:
      - output.json
      - report.html
```

### Jenkins

[Ayrıntılı Jenkins kılavuzumuza](/docs/integrations/jenkins) göz atın.

```groovy title="Jenkinsfile"
pipeline {
    agent any

    environment {
        OPENAI_API_KEY = credentials('openai-api-key')
        PROMPTFOO_CACHE_PATH = "${WORKSPACE}/.cache/promptfoo"
    }

    stages {
        stage('Değerlendir') {
            steps {
                sh '''
                    npx promptfoo@latest eval \
                        -c promptfooconfig.yaml \
                        --share \
                        -o results.json
                '''
            }
        }

        stage('Kalite Kapısı') {
            steps {
                script {
                    def results = readJSON file: 'results.json'
                    def failures = results.results.stats.failures
                    if (failures > 0) {
                        error("Değerlendirme ${failures} hata ile başarısız oldu")
                    }
                }
            }
        }
    }
}
```

### Diğer Platformlar

- [Azure Pipelines](/docs/integrations/azure-pipelines)
- [CircleCI](/docs/integrations/circle-ci)
- [Bitbucket Pipelines](/docs/integrations/bitbucket-pipelines)
- [Travis CI](/docs/integrations/travis-ci)
- [n8n iş akışları](/docs/integrations/n8n)
- [Looper](/docs/integrations/looper)

## Gelişmiş Desenler

### 1. Docker Tabanlı CI/CD

Promptfoo'nun önceden kurulu olduğu özel bir Docker imajı oluşturun:

```dockerfile title="Dockerfile"
FROM node:20-slim
WORKDIR /app
COPY . .
CMD ["npx", "promptfoo@latest", "eval"]
```

### 2. Paralel Test Yapma

Birden fazla modeli veya yapılandırmayı paralel olarak test edin:

```yaml
# GitHub Actions örneği
strategy:
  matrix:
    model: [gpt-4, gpt-3.5-turbo, claude-3-opus]
steps:
  - name: ${{ matrix.model }} test et
    run: |
      npx promptfoo@latest eval \
        --providers.0.config.model=${{ matrix.model }} \
        -o results-${{ matrix.model }}.json
```

### 3. Zamanlanmış Güvenlik Taramaları

Kapsamlı güvenlik taramalarını bir programa göre çalıştırın:

```yaml
# GitHub Actions
on:
  schedule:
    - cron: '0 2 * * *' # Her gün gece saat 02:00
 
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Tam kırmızı takım taraması
        run: |
          npx promptfoo@latest redteam generate \
            --plugins harmful,pii,contracts \
            --strategies jailbreak,prompt-injection
          npx promptfoo@latest redteam run
```

### 4. SonarQube Entegrasyonu

:::info Kurumsal Özellik

Doğrudan SonarQube çıktı formatı [Promptfoo Enterprise](/docs/enterprise/) sürümünde mevcuttur. Açık kaynak kullanıcıları için sonuçları JSON olarak dışa aktarın ve dönüştürün.

:::

Kurumsal ortamlar için SonarQube ile entegre olun:

```yaml
# SonarQube işlemesi için sonuçları dışa aktar
- name: promptfoo güvenlik taramasını çalıştır
  run: |
    npx promptfoo@latest eval \
      --config promptfooconfig.yaml \
      -o results.json

# SonarQube için sonuçları dönüştür (özel betik gereklidir)
- name: SonarQube için dönüştür
  run: |
    node transform-to-sonarqube.js results.json > sonar-report.json

- name: SonarQube taraması
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
  run: |
    sonar-scanner \
      -Dsonar.externalIssuesReportPaths=sonar-report.json
```

Ayrıntılı kurulum için [SonarQube entegrasyon kılavuzumuza](/docs/integrations/sonarqube) bakın.

## Sonuçları İşleme

### JSON Çıktısını Ayrıştırma

Çıktı JSON'u şu şemayı izler:

```typescript
interface OutputFile {
  evalId?: string;
  results: {
    stats: {
      successes: number;
      failures: number;
      errors: number;
    };
    outputs: Array<{
      pass: boolean;
      score: number;
      error?: string;
      // ... diğer alanlar
    }>;
  };
  config: UnifiedConfig;
  shareableUrl: string | null;
}
```

Örnek işleme betiği:

```javascript title="process-results.js"
const fs = require('fs');
const results = JSON.parse(fs.readFileSync('results.json', 'utf8'));

// Metrikleri hesapla
const passRate =
  (results.results.stats.successes /
    (results.results.stats.successes + results.results.stats.failures)) *
  100;

console.log(`Başarı oranı: ${passRate.toFixed(2)}%`);
console.log(`Paylaşılabilir URL: ${results.shareableUrl}`);

// Belirli hataları kontrol et
const criticalFailures = results.results.outputs.filter(
  (o) => o.error?.includes('security') || o.error?.includes('injection'),
);

if (criticalFailures.length > 0) {
  console.error('Kritik güvenlik hataları tespit edildi!');
  process.exit(1);
}
```

### Sonuçları Paylaşma

Değerlendirme sonuçlarını PR yorumlarına, Slack'e veya diğer kanallara gönderin:

```bash
# Sonuçları çıkar ve paylaş
SHARE_URL=$(jq -r '.shareableUrl' results.json)
PASS_RATE=$(jq '.results.stats.successes / (.results.stats.successes + .results.stats.failures) * 100' results.json)

# GitHub PR'a gönder
gh pr comment --body "
## Promptfoo Değerlendirme Sonuçları
- Başarı oranı: ${PASS_RATE}%
- [Ayrıntılı sonuçları görüntüle](${SHARE_URL})
"
```

## Önbelleğe Alma Stratejileri

Uygun önbelleğe alma ile CI/CD performansını optimize edin:

```yaml
# Önbellek konumunu ayarla
env:
  PROMPTFOO_CACHE_PATH: ~/.cache/promptfoo
  PROMPTFOO_CACHE_TTL: 86400 # 24 saat

# Önbellek yapılandırması
cache:
  key: promptfoo-${{ hashFiles('prompts/**', 'promptfooconfig.yaml') }}
  paths:
    - ~/.cache/promptfoo
```

## Güvenlik En İyi Uygulamaları

1. **API Anahtarı Yönetimi**
   - API anahtarlarını şifrelenmiş sırlar (secrets) olarak saklayın
   - En az ayrıcalıklı erişim kontrollerini kullanın
   - Anahtarları düzenli olarak yenileyin

2. **Ağ Güvenliği**
   - Hassas veriler için özel çalıştırıcılar (private runners) kullanın
   - Dışa giden ağ erişimini kısıtlayın
   - Kurumsal ihtiyaçlar için yerinde kurulumları (on-premise) değerlendirin

3. **Veri Gizliliği**
   - Hassas veriler için çıktı temizlemeyi etkinleştirin:

   ```bash
   export PROMPTFOO_STRIP_RESPONSE_OUTPUT=true
   export PROMPTFOO_STRIP_TEST_VARS=true
   ```

4. **Denetim Günlüğü**
   - Değerlendirme geçmişini tutun
   - Güvenlik taramalarını kimin tetiklediğini takip edin
   - Anormal modelleri izleyin

## Sorun Giderme

### Yaygın Sorunlar

| Sorun                 | Çözüm                                              |
| --------------------- | -------------------------------------------------- |
| Hız sınırları         | Önbelleğe almayı etkinleştirin, `-j 1` ile eşzamanlılığı azaltın |
| Zaman aşımları        | Zaman aşımı değerlerini artırın, `--max-concurrency` kullanın |
| Bellek sorunları      | Akış modunu kullanın, sonuçları yığınlar halinde işleyin |
| Önbellek hataları     | Önbellek anahtarının tüm ilgili dosyaları içerdiğini kontrol edin |

### Hata Ayıklama (Debug) Modu

Ayrıntılı günlük kaydını etkinleştirin:

```bash
LOG_LEVEL=debug npx promptfoo@latest eval -c config.yaml
```

## Gerçek Dünya Örnekleri

### Otomatik Test Örnekleri

- [Kendi kendini puanlama örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/self-grading) - Otomatik LLM değerlendirmesi
- [Özel puanlama promptları](https://github.com/promptfoo/promptfoo/tree/main/examples/custom-grading-prompt) - Karmaşık değerlendirme mantığı
- [Çıktıları sakla ve yeniden kullan](https://github.com/promptfoo/promptfoo/tree/main/examples/store-and-reuse-outputs) - Çok adımlı test

### Güvenlik Örnekleri

- [Kırmızı takım başlangıç](https://github.com/promptfoo/promptfoo/tree/main/examples/redteam-starter) - Temel güvenlik testi
- [RAG zehirleme testleri](https://github.com/promptfoo/promptfoo/tree/main/examples/rag-poisoning) - Belge zehirleme tespiti
- [DoNotAnswer veri kümesi](https://github.com/promptfoo/promptfoo/tree/main/examples/donotanswer) - Zararlı içerik tespiti

### Entegrasyon Örnekleri

- [Bağımsız GitHub Action](https://github.com/promptfoo/promptfoo/tree/main/examples/github-action) - Özel GitHub iş akışları
- [JSON çıktı işleme](https://github.com/promptfoo/promptfoo/tree/main/examples/json-output) - Sonuç ayrıştırma desenleri
- [CSV test verileri](https://github.com/promptfoo/promptfoo/tree/main/examples/simple-test) - Toplu test yönetimi

## İlgili Belgeler

### Yapılandırma ve Test

- [Yapılandırma Rehberi](/docs/configuration/guide) - Tam kurulum talimatları
- [Test Vakaları](/docs/configuration/test-cases) - Etkili testler yazma
- [Savlar ve Metrikler](/docs/configuration/expected-outputs) - Doğrulama stratejileri
- [Python Savları](/docs/configuration/expected-outputs/python) - Özel Python doğrulayıcıları
- [JavaScript Savları](/docs/configuration/expected-outputs/javascript) - Özel JS doğrulayıcıları

### Güvenlik ve Kırmızı Takım

- [Kırmızı Takım Mimarisi](/docs/red-team/architecture) - Güvenlik testi çerçevesi
- [LLM'ler için OWASP Top 10](/docs/red-team/owasp-llm-top-10) - Güvenlik uyumluluğu
- [RAG Güvenlik Testi](/docs/red-team/rag) - Arama sistemlerini test etme
- [MCP Güvenlik Testi](/docs/red-team/mcp-security-testing) - Model Bağlam Protokolü güvenliği

### Kurumsal ve Ölçeklendirme

- [Kurumsal Özellikler](/docs/enterprise/) - Ekip iş birliği ve uyumluluk
- [Kurumda Kırmızı Takımlar](/docs/enterprise/red-teams) - Kuruluş genelinde güvenlik
- [Hizmet Hesapları](/docs/enterprise/service-accounts) - Otomatik erişim

## Ayrıca Bakınız

- [GitHub Actions Entegrasyonu](/docs/integrations/github-action)
- [Kırmızı Takım Hızlı Başlangıç](/docs/red-team/quickstart)
- [Kurumsal Özellikler](/docs/enterprise/)
- [Yapılandırma Referansı](/docs/configuration/reference)
