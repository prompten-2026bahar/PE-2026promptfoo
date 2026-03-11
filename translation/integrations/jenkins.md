---
sidebar_label: Jenkins
description: Promptfoo'nun LLM testlerini; otomatik değerlendirme, kimlik bilgisi yönetimi ve üretim aşamasındaki yapay zeka dağıtımları için CI/CD iş akışlarıyla Jenkins süreçlerinize dahil edin.
---

# Jenkins ile Promptfoo Kurulumu

Bu kılavuz, Promptfoo'nun LLM değerlendirmesini Jenkins süreçlerinize nasıl dahil edeceğinizi gösterir. Bu kurulum, deponuzda değişiklik yapıldığında promptlarınızın ve modellerinizin otomatik olarak test edilmesini sağlar.

## Ön Koşullar

- İşlem hattı (pipeline) desteği olan Jenkins sunucusu
- Jenkins aracısında (agent) Node.js kurulu olması
- LLM sağlayıcınızın API anahtarları (örneğin, OpenAI API anahtarı)
- Jenkins Pipeline sözdizimi hakkında temel bilgi

## Yapılandırma Adımları

### 1. Jenkinsfile Oluşturun

Deponuzun kök dizininde bir `Jenkinsfile` oluşturun. İşte Promptfoo'yu kuran ve değerlendirmeleri çalıştıran temel bir yapılandırma:

```groovy:Jenkinsfile
pipeline {
    agent any

    environment {
        OPENAI_API_KEY = credentials('openai-api-key')
        PROMPTFOO_CACHE_PATH = '~/.promptfoo/cache'
    }

    stages {
        stage('Kurulum') {
            steps {
                sh 'npm install -g promptfoo'
            }
        }

        stage('Promptları Değerlendir') {
            steps {
                script {
                    try {
                        sh 'promptfoo eval -c promptfooconfig.yaml --prompts prompts/**/*.json --share -o output.json'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error("Prompt değerlendirmesi başarısız oldu: ${e.message}")
                    }
                }
            }
        }

        stage('Sonuçları İşle') {
            steps {
                script {
                    def output = readJSON file: 'output.json'
                    echo "Değerlendirme Sonuçları:"
                    echo "Başarılar: ${output.results.stats.successes}"
                    echo "Hatalar: ${output.results.stats.failures}"

                    if (output.shareableUrl) {
                        echo "Ayrıntılı sonuçları şurada görüntüleyin: ${output.shareableUrl}"
                    }

                    if (output.results.stats.failures > 0) {
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'output.json', fingerprint: true
        }
    }
}
```

### 2. Jenkins Kimlik Bilgilerini Yapılandırın

Kullandığınız tüm LLM sağlayıcıları için API anahtarlarını eklemeniz gerekecektir. Örneğin, OpenAI kullanıyorsanız OpenAI API anahtarını eklemeniz gerekir.

1. Jenkins Panosu → Jenkins'i Yönet (Manage Jenkins) → Kimlik Bilgileri (Credentials) bölümüne gidin
2. Yeni bir kimlik bilgisi ekleyin:
   - Tür (Kind): Secret text
   - Kapsam (Scope): Global
   - Kimlik (ID): openai-api-key
   - Açıklama (Description): OpenAI API Anahtarı
   - Sır (Secret): API anahtarı değeriniz

### 3. Önbelleğe Almayı Ayarlayın

Daha iyi performans ve azaltılmış API maliyetleri için önbelleğe almayı uygulamak üzere:

1. Jenkins aracınızda bir önbellek dizini oluşturun:

```bash
mkdir -p ~/.promptfoo/cache
```

2. Jenkins kullanıcısının yazma izinlerine sahip olduğundan emin olun:

```bash
chown -R jenkins:jenkins ~/.promptfoo/cache
```

### 4. Gelişmiş İşlem Hattı Yapılandırması

Ek özelliklere sahip daha gelişmiş bir işlem hattı örneği:

Gelişmiş yapılandırma birkaç önemli iyileştirme içerir:

- **Derleme zaman aşımları**: `timeout` seçeneği, derlemelerin süresiz çalışmamasını sağlar (1 saat sınırı)
- **Zaman damgaları**: Daha iyi hata ayıklama için konsol çıktısına zaman damgaları ekler
- **SCM yoklaması**: `pollSCM` kullanarak her 15 dakikada bir değişiklikleri otomatik olarak kontrol eder
- **Koşullu yürütme**: Değerlendirmeleri yalnızca `prompts/` dizinindeki dosyalar değiştiğinde çalıştırır
- **E-posta bildirimleri**: İşlem hattı hatalarında geliştiricilere e-posta gönderir
- **Çalışma alanı temizliği**: Her çalışmadan sonra çalışma alanını otomatik olarak temizler
- **Yapıt yönetimi**: Hem JSON hem de HTML raporlarını parmak iziyle (fingerprinting) arşivler
- **Daha iyi hata yönetimi**: Daha sağlam hata yakalama ve derleme durumu yönetimi

```groovy:Jenkinsfile
pipeline {
    agent any

    environment {
        OPENAI_API_KEY = credentials('openai-api-key')
        PROMPTFOO_CACHE_PATH = '~/.promptfoo/cache'
    }

    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
    }

    triggers {
        pollSCM('H/15 * * * *')
    }

    stages {
        stage('Kurulum') {
            steps {
                sh 'npm install -g promptfoo'
            }
        }

        stage('Promptları Değerlendir') {
            when {
                changeset 'prompts/**'
            }
            steps {
                script {
                    try {
                        sh '''
                            promptfoo eval \
                                -c promptfooconfig.yaml \
                                --prompts prompts/**/*.json \
                                --share \
                                -o output.json
                        '''
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error("Prompt değerlendirmesi başarısız oldu: ${e.message}")
                    }
                }
            }
        }

        stage('Sonuçları İşle') {
            steps {
                script {
                    def output = readJSON file: 'output.json'

                    // HTML raporu oluştur
                    writeFile file: 'evaluation-report.html', text: """
                        <html>
                            <body>
                                <h1>Prompt Değerlendirme Sonuçları</h1>
                                <p>Başarılar: ${output.results.stats.successes}</p>
                                <p>Hatalar: ${output.results.stats.failures}</p>
                                <p>Ayrıntılı sonuçları görüntüleyin: <a href="${output.shareableUrl}">${output.shareableUrl}</a></p>
                            </body>
                        </html>
                    """

                    // HTML raporunu yayınla
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: '.',
                        reportFiles: 'evaluation-report.html',
                        reportName: 'Prompt Değerlendirme Raporu'
                    ])

                    if (output.results.stats.failures > 0) {
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'output.json,evaluation-report.html', fingerprint: true
            cleanWs()
        }
        failure {
            emailext (
                subject: "Başarısız İşlem Hattı: ${currentBuild.fullDisplayName}",
                body: "Prompt değerlendirmesi başarısız oldu. Konsol çıktısını şurada kontrol edin: ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
    }
}
```

## Sorun Giderme

Yaygın sorunlar ve çözümleri:

1. **İzin sorunları:**
   - Jenkins'in küresel npm paketlerini kurmak için uygun izinlere sahip olduğundan emin olun
   - Önbellek dizini izinlerini doğrulayın
   - API anahtarı kimlik bilgisi izinlerini kontrol edin

2. **İşlem hattı zaman aşımı:**
   - İşlem hattı seçeneklerindeki zaman aşımını ayarlayın
   - Değerlendirmeleri daha küçük yığınlara bölmeyi düşünün
   - API hız sınırlarını izleyin

3. **Önbellek sorunları:**
   - Önbellek yolunun mevcut ve yazılabilir olduğunu doğrulayın
   - Disk alanı kullanılabilirliğini kontrol edin
   - Gerekirse önbelleği temizleyin: `rm -rf ~/.promptfoo/cache/*`

4. **Node.js sorunları:**
   - Jenkins aracısında Node.js'in kurulu olduğundan emin olun
   - npm'in PATH içinde mevcut olduğunu doğrulayın
   - Jenkins'teki `nodejs` araç yükleyicisini (tool installer) kullanmayı düşünün

Promptfoo yapılandırması ve kullanımı hakkında daha fazla bilgi için [yapılandırma referansı](/docs/configuration/guide/) sayfasına bakın.
