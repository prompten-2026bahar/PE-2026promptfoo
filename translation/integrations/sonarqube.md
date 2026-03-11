---
title: Promptfoo'yu SonarQube ile Entegre Edin
description: Merkezi zafiyet takibi ve CI/CD kalite eşikleri için Promptfoo güvenlik bulgularını SonarQube'e dahil edin
sidebar_label: SonarQube
---

Bu kılavuz, Promptfoo'nun tarama sonuçlarını SonarQube'e nasıl entegre edeceğinizi gösterir; bu sayede kırmızı takım (red team) bulgularınız normal "Issues" (Sorunlar) görünümünde yer alır, Kalite Eşiklerine (Quality Gates) dahil olur ve güvenlik politikalarını ihlal ettiklerinde işlem hatlarını (pipelines) durdurur.

:::info

Bu özellik [Promptfoo Enterprise](/docs/enterprise/) sürümünde mevcuttur.

:::

## Genel Bakış

Entegrasyon, herhangi bir özel eklenti gerektirmeden Promptfoo bulgularını içe aktarmak için SonarQube'ün Genel Sorun İçe Aktarma (Generic Issue Import) özelliğini kullanır. Bu yaklaşım:

- Geleneksel kod kalitesi metriklerinin yanında LLM güvenlik sorunlarını yüzeye çıkarır
- Prompt enjeksiyonu ve diğer LLM zafiyetleri için Kalite Eşiği (Quality Gate) uygulamasını etkinleştirir
- Mevcut SonarQube kullanıcı arayüzünde tanıdık bir geliştirici deneyimi sunar
- SonarQube'ü destekleyen her türlü CI/CD sistemiyle çalışır

## Ön Koşullar

- SonarQube sunucusu (Community Edition veya üzeri)
- CI/CD ortamınızda kurulu SonarQube Tarayıcısı (Scanner)
- CI/CD ortamınızda kurulu Node.js
- Bir Promptfoo yapılandırma dosyası

## Yapılandırma Adımları

### 1. Temel CI/CD Entegrasyonu

Aşağıda, Promptfoo'yu çalıştıran ve sonuçları SonarQube'e aktaran bir GitHub Actions iş akışı örneği verilmiştir:

```yaml
name: Promptfoo ile SonarQube Analizi

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  analysis:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Daha iyi analiz için sığ klonlar (shallow clones) devre dışı bırakılmalıdır

      - name: Node.js Kurulumu
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Promptfoo Kurulumu
        run: npm install -g promptfoo

      - name: Promptfoo taramasını çalıştır
        run: |
          promptfoo eval \
            --config promptfooconfig.yaml \
            --output pf-sonar.json \
            --output-format sonarqube

      - name: SonarQube Taraması
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
        run: |
          sonar-scanner \
            -Dsonar.projectKey=${{ github.event.repository.name }} \
            -Dsonar.sources=. \
            -Dsonar.externalIssuesReportPaths=pf-sonar.json
```

### 2. Gelişmiş İşlem Hattı Yapılandırması

Kurumsal ortamlar için önbelleğe alma, koşullu yürütme ve ayrıntılı raporlama içeren daha kapsamlı bir kurulum aşağıdadır:

```yaml
name: Gelişmiş SonarQube Entegrasyonu

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Günlük güvenlik taraması

jobs:
  promptfoo-security-scan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Node.js Kurulumu
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Promptfoo Önbelleğe Al
        uses: actions/cache@v4
        with:
          path: ~/.cache/promptfoo
          key: ${{ runner.os }}-promptfoo-${{ hashFiles('**/promptfooconfig.yaml') }}
          restore-keys: |
            ${{ runner.os }}-promptfoo-

      - name: Bağımlılıkları kur
        run: |
          npm install -g promptfoo
          npm install -g jsonschema

      - name: Promptfoo yapılandırmasını doğrula
        run: |
          # Çalıştırmadan önce yapılandırmayı doğrula
          promptfoo validate --config promptfooconfig.yaml

      - name: Kırmızı takım değerlendirmesini çalıştır
        id: redteam
        env:
          PROMPTFOO_CACHE_PATH: ~/.cache/promptfoo
        run: |
          # Hata eşiği ile çalıştır
          promptfoo eval \
            --config promptfooconfig.yaml \
            --output pf-results.json \
            --output-format json \
            --max-concurrency 5 \
            --share || echo "EVAL_FAILED=true" >> $GITHUB_OUTPUT

      - name: Birden fazla rapor formatı oluştur
        if: always()
        run: |
          # SonarQube formatını oluştur
          promptfoo eval \
            --config promptfooconfig.yaml \
            --output pf-sonar.json \
            --output-format sonarqube \
            --no-cache

          # Ayrıca yapılar (artifacts) için HTML raporu oluştur
          promptfoo eval \
            --config promptfooconfig.yaml \
            --output pf-results.html \
            --output-format html \
            --no-cache

      - name: SonarQube Taraması
        if: always()
        uses: SonarSource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
        with:
          args: >
            -Dsonar.projectKey=${{ github.event.repository.name }}
            -Dsonar.externalIssuesReportPaths=pf-sonar.json
            -Dsonar.pullrequest.key=${{ github.event.pull_request.number }}
            -Dsonar.pullrequest.branch=${{ github.head_ref }}
            -Dsonar.pullrequest.base=${{ github.base_ref }}

      - name: Kalite Eşiğini (Quality Gate) Kontrol Et
        uses: SonarSource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

      - name: Yapıları (Artifacts) Yükle
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: promptfoo-reports
          path: |
            pf-results.json
            pf-results.html
            pf-sonar.json
          retention-days: 30

      - name: PR'a sonuçlarla yorum yap
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('pf-results.json', 'utf8'));
            const stats = results.results.stats;

            const comment = `## 🔒 Promptfoo Güvenlik Taraması Sonuçları

            - **Toplam Test**: ${stats.successes + stats.failures}
            - **Başarılı**: ${stats.successes} ✅
            - **Başarısız**: ${stats.failures} ❌

            ${results.shareableUrl ? `[Ayrıntılı sonuçları görüntüle](${results.shareableUrl})` : ''}

            Sorunlar takip için SonarQube'e aktarıldı.`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### 3. SonarQube'ü Yapılandırın

Promptfoo bulgularını SonarQube'de düzgün bir şekilde görüntülemek ve takip etmek için:

1. **Özel Kurallar Oluşturun** (isteğe bağlı):

   ```bash
   # Özel bir kural oluşturmak için örnek API çağrısı
   curl -u admin:$SONAR_PASSWORD -X POST \
     "$SONAR_HOST/api/rules/create" \
     -d "custom_key=PF-Prompt-Injection" \
     -d "name=Prompt Enjeksiyon Zafiyeti" \
     -d "markdown_description=Potansiyel prompt enjeksiyon zafiyeti tespit edildi" \
     -d "severity=CRITICAL" \
     -d "type=VULNERABILITY"
   ```

2. **Kalite Eşiğini (Quality Gate) Yapılandırın**:
   - SonarQube'de Quality Gates bölümüne gidin
   - Durum ekle: "Security Rating is worse than A"
   - Durum ekle: "Security Hotspots Reviewed is less than 100%"
   - Özel durum ekle: "Issues from promptfoo > 0" (kritik bulgular için)

3. **Bildirimleri Ayarlayın**:
   - Kalite Eşiği başarısızlıklarında bildirim almak için web kancalarını (webhooks) yapılandırın
   - Güvenlik bulguları için e-posta bildirimlerini ayarlayın

### 4. Jenkins Entegrasyonu

GitHub Actions yerine Jenkins kullanıyorsanız:

```groovy:Jenkinsfile
pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Promptfoo') {
            steps {
                sh '''
                    npm install -g promptfoo
                    promptfoo eval \
                        --config promptfooconfig.yaml \
                        --output pf-sonar.json \
                        --output-format sonarqube
                '''
            }
        }

        stage('SonarQube Analizi') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=${JOB_NAME} \
                            -Dsonar.sources=. \
                            -Dsonar.externalIssuesReportPaths=pf-sonar.json
                    '''
                }
            }
        }

        stage('Kalite Eşiği (Quality Gate)') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '*.json,*.html', fingerprint: true
        }
    }
}
```

## Sonraki Adımlar

Promptfoo yapılandırması ve kırmızı takım (red team) testi hakkında daha fazla bilgi için [kırmızı takım belgelerine (red team documentation)](/docs/red-team/) bakın.
