# Gelişmiş Kullanım

Bu sayfa, bulut depolama entegrasyonu, CI/CD iş akışları ve programatik kullanım dahil ModelAudit'in gelişmiş özelliklerini kapsar.

## Kimlik Doğrulama ve Yapılandırma

ModelAudit, bulut servisleri ve model kayıtları ile kimlik doğrulaması için ortam değişkenlerini kullanır.

### Bulut ve Artifact Registry Kimlik Doğrulaması

Tüm uzak servislerde kimlik doğrulama artık yalnızca ortam değişkenleri ile yapılır.

#### HuggingFace

- `HF_TOKEN`: Özel modellere erişim için HuggingFace Hub token'ınız.

```bash
# Özel modeller için kimlik doğrulama
export HF_TOKEN=your_token_here
promptfoo scan-model hf://your-org/private-model
```

#### JFrog Artifactory

- `JFROG_URL`: JFrog Artifactory örneğinizin temel URL'si.
- `JFROG_API_TOKEN` veya `JFROG_ACCESS_TOKEN`: API erişim token'ınız.

```bash
# API token ile kimlik doğrulama
export JFROG_URL="https://your-domain.jfrog.io"
export JFROG_API_TOKEN="your-api-token"
promptfoo scan-model "https://your-domain.jfrog.io/artifactory/repo/model.pkl"
```

#### MLflow Model Registry

- `MLFLOW_TRACKING_URI`: MLflow tracking sunucunuzun URI'si.
- `MLFLOW_TRACKING_USERNAME` / `MLFLOW_TRACKING_PASSWORD`: MLflow erişim bilgileri.

```bash
# MLflow ile kimlik doğrulama
export MLFLOW_TRACKING_URI="https://your-mlflow-server.com"
export MLFLOW_TRACKING_USERNAME="your-username"
export MLFLOW_TRACKING_PASSWORD="your-password"
promptfoo scan-model models:/model-name/version
```

#### Amazon S3

- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`: Standart AWS kimlik bilgileri.

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
promptfoo scan-model s3://my-bucket/model.pkl
```

#### Google Cloud Storage

- `GOOGLE_APPLICATION_CREDENTIALS`: Servis hesabı anahtar dosyanızın yolu.

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
promptfoo scan-model gs://my-bucket/model.pt
```

#### Cloudflare R2

- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`: R2 kimlik bilgileriniz.
- `AWS_ENDPOINT_URL`: R2 hesabınızın S3 uyumlu endpoint'i.

```bash
export AWS_ACCESS_KEY_ID="your-r2-access-key"
export AWS_SECRET_ACCESS_KEY="your-r2-secret-key"
export AWS_ENDPOINT_URL="https://your-account.r2.cloudflarestorage.com"
promptfoo scan-model r2://my-bucket/model.safetensors
```

### Kullanımdan Kaldırılan Bayraklardan Geçiş

Aşağıdaki CLI bayrakları **kaldırılmıştır** ve ortam değişkenleriyle değiştirilmiştir. Bu bayrakları kullanmaya çalışmak hata üretir.

| Kaldırılan Bayrak       | Yerine Geçen Ortam Değişkeni     |
| ----------------------- | -------------------------------- |
| `--jfrog-api-token`     | `JFROG_API_TOKEN`                |
| `--jfrog-access-token`  | `JFROG_ACCESS_TOKEN`             |
| `--registry-uri`        | `JFROG_URL` veya `MLFLOW_TRACKING_URI` |

**Neden bu değişiklik?** Sırları CLI bayraklarında geçirmek, shell geçmişi ve süreç listeleri üzerinden ifşa riskini artırır. Ortam değişkenleri sektörün en iyi uygulamalarıyla daha uyumludur.

## Uzak Model Taraması

ModelAudit, modelleri manuel indirme gerektirmeden çeşitli uzak kaynaklardan doğrudan tarayabilir.

### HuggingFace

HuggingFace Hub üzerindeki genel veya özel modelleri tarayın.

```bash
# Genel model
promptfoo scan-model https://huggingface.co/bert-base-uncased

# Özel model (HF_TOKEN gerekli)
promptfoo scan-model hf://your-org/private-model
```

### Bulut Depolama (S3, GCS, R2)

Bulut bucket'larında saklanan modelleri tarayın. Kurulum için [Kimlik Doğrulama](#kimlik-dogrulama-ve-yapilandirma) bölümüne bakın.

```bash
# S3'ten tarama
promptfoo scan-model s3://my-bucket/model.pkl

# Google Cloud Storage'dan tarama
promptfoo scan-model gs://my-bucket/model.pt

# Cloudflare R2'den tarama
promptfoo scan-model r2://my-bucket/model.safetensors
```

### Model Kayıtları (MLflow, JFrog)

MLflow veya JFrog Artifactory'den model tarayın. Kurulum için [Kimlik Doğrulama](#kimlik-dogrulama-ve-yapilandirma) bölümüne bakın.

```bash
# MLflow'dan tarama
promptfoo scan-model models:/MyModel/Latest

# JFrog Artifactory'den tarama
promptfoo scan-model "https://your-domain.jfrog.io/artifactory/models/model.pkl"
```

### DVC Entegrasyonu

ModelAudit, DVC pointer dosyalarını otomatik olarak çözümler:

```bash
# .dvc dosyasının işaret ettiği gerçek model dosyasını tarar
promptfoo scan-model model.pkl.dvc
```

## Yapılandırma Seçenekleri

ModelAudit davranışı komut satırı seçenekleriyle özelleştirilebilir. Yapılandırma dosyası desteği şu anda olmasa da CLI bayraklarıyla benzer sonuç elde edilir:

```bash
# Kara liste desenleri belirleyin
promptfoo scan-model models/ \
  --blacklist "deepseek" \
  --blacklist "qwen" \
  --blacklist "unsafe_model"

# Kaynak limitleri belirleyin
promptfoo scan-model models/ \
  --max-size 1GB \
  --timeout 600

# Birden çok seçeneği birleştirin
promptfoo scan-model models/ \
  --blacklist "suspicious_pattern" \
  --max-size 1GB \
  --timeout 600 \
  --verbose

# Geliştirilmiş güvenlik doğrulaması için katı modu açın
promptfoo scan-model model.pkl --strict

# Kullanılabilir tarayıcı kimlikleri ve sınıf adlarını keşfedin
promptfoo scan-model --list-scanners

# Yalnızca seçili tarayıcıları kimliğe göre çalıştırın
promptfoo scan-model models/ --scanners pickle,tf_savedmodel

# Betiklerde daha açık olması için bayrağı tekrar edin
promptfoo scan-model models/ --scanners pickle --scanners tf_savedmodel

# Varsayılan tarayıcı setinden bir tarayıcıyı hariç tutun
promptfoo scan-model models/ --exclude-scanner weight_distribution

# Katı mod ile ek çıktı seçenekleri
promptfoo scan-model models/ \
  --strict \
  --format sarif \
  --output security-scan.sarif
```

Odaklı triage taramaları için `--scanners`, varsayılan set doğru ama bir tarayıcı gürültülü/ilgisiz ise `--exclude-scanner` kullanın.

### Sonuçları Paylaşma

Promptfoo Cloud'a bağlıyken model audit sonuçları varsayılan olarak paylaşılır. Bu, sonuçları web arayüzünden görüntüleme ve işbirliği olanağı sunar.

```bash
# Cloud etkinken sonuçlar otomatik paylaşılır
promptfoo scan-model models/

# Paylaşımı açıkça etkinleştir
promptfoo scan-model models/ --share

# Bu tarama için paylaşımı kapat
promptfoo scan-model models/ --no-share

# Ortam değişkeniyle global kapat
export PROMPTFOO_DISABLE_SHARING=true
promptfoo scan-model models/
```

## CI/CD Entegrasyonu

### GitHub Actions

```yaml
# .github/workflows/model-security.yml
name: Model Security Scan

on:
  push:
    paths:
      - 'models/**'
      - '**.pkl'
      - '**.h5'
      - '**.pb'
      - '**.pt'
      - '**.pth'

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          npm install -g promptfoo
          pip install modelaudit[all]

      - name: Scan models
        run: promptfoo scan-model models/ --format sarif --output model-scan.sarif

      - name: Upload SARIF to GitHub Advanced Security
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: model-scan.sarif
          category: model-security

      - name: Upload scan results as artifact
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: model-scan-results
          path: model-scan.sarif
```

### GitLab CI

```yaml
# .gitlab-ci.yml
model_security_scan:
  stage: test
  image: python:3.10
  script:
    - pip install modelaudit[all]
    - npm install -g promptfoo
    - promptfoo scan-model models/ --format json --output scan-results.json
    - if grep -q '"severity":"critical"' scan-results.json; then echo "Kritik güvenlik sorunları bulundu!"; exit 1; fi
  artifacts:
    paths:
      - scan-results.json
    when: always
  only:
    changes:
      - models/**
      - '**/*.pkl'
      - '**/*.h5'
      - '**/*.pb'
      - '**/*.pt'
      - '**/*.pth'
```

### Pre-commit Hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: modelaudit
        name: ModelAudit
        entry: promptfoo scan-model
        language: system
        files: '\.(pkl|h5|pb|pt|pth|keras|hdf5|json|yaml|yml|zip|onnx|safetensors|bin|tflite|msgpack|pmml|joblib|npy|gguf|ggml)$'
        pass_filenames: true
```

## Programatik Kullanım

ModelAudit'i Python kodunuz içinde programatik olarak kullanabilirsiniz:

```python
from modelaudit.core import scan_model_directory_or_file

# Tek bir modeli tarayın
results = scan_model_directory_or_file("path/to/model.pkl")

# HuggingFace model URL'sini tarayın
results = scan_model_directory_or_file("https://huggingface.co/bert-base-uncased")

# Sorunları kontrol edin
if results["issues"]:
    print(f"{len(results['issues'])} sorun bulundu:")
    for issue in results["issues"]:
        print(f"- {issue['severity'].upper()}: {issue['message']}")
else:
    print("Sorun bulunmadı!")

# Özel yapılandırma ile tarayın
config = {
    "blacklist_patterns": ["unsafe_model", "malicious_net"],
    "max_file_size": 1073741824,  # 1GB
    "timeout": 600  # 10 dakika
}

results = scan_model_directory_or_file("path/to/models/", **config)
```

## JSON Çıktı Formatı

`--format json` kullanıldığında ModelAudit yapılandırılmış sonuç üretir:

```json
{
  "scanner_names": ["pickle"],
  "start_time": 1750168822.481906,
  "bytes_scanned": 74,
  "issues": [
    {
      "message": "Found REDUCE opcode - potential __reduce__ method execution",
      "severity": "warning",
      "location": "evil.pickle (pos 71)",
      "details": {
        "position": 71,
        "opcode": "REDUCE"
      },
      "timestamp": 1750168822.482304
    },
    {
      "message": "Suspicious module reference found: posix.system",
      "severity": "critical",
      "location": "evil.pickle (pos 28)",
      "details": {
        "module": "posix",
        "function": "system",
        "position": 28,
        "opcode": "STACK_GLOBAL"
      },
      "timestamp": 1750168822.482378,
      "why": "The 'os' module provides direct access to operating system functions."
    }
  ],
  "has_errors": false,
  "files_scanned": 1,
  "duration": 0.0005328655242919922,
  "assets": [
    {
      "path": "evil.pickle",
      "type": "pickle"
    }
  ]
}
```

## SARIF Çıktı Formatı

ModelAudit, güvenlik araçları ve CI/CD hatlarıyla sorunsuz entegrasyon için SARIF (Static Analysis Results Interchange Format) 2.1.0 çıktısını destekler:

```bash
# SARIF çıktısını stdout'a yaz
promptfoo scan-model model.pkl --format sarif

# SARIF'i dosyaya kaydet
promptfoo scan-model model.pkl --format sarif --output results.sarif

# Çoklu model taramasını SARIF ile kaydet
promptfoo scan-model models/ --format sarif --output scan-results.sarif
```

### SARIF Yapısı

SARIF çıktısı şunları içerir:

- **Kurallar**: Tespit edilen benzersiz güvenlik desenleri (örn. pickle sorunları, tehlikeli importlar)
- **Sonuçlar**: Önem düzeyi, konum ve fingerprint içeren tekil bulgular
- **Artifacts**: Taranan dosyalara dair hash dahil bilgiler
- **Araç Bilgisi**: ModelAudit sürümü ve yetenekleri
- **Invocation Ayrıntıları**: Komut satırı argümanları ve tarama istatistikleri

Örnek SARIF çıktısı:

```json
{
  "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
  "version": "2.1.0",
  "runs": [
    {
      "tool": {
        "driver": {
          "name": "ModelAudit",
          "version": "0.2.3",
          "rules": [
            {
              "id": "MA-PICKLE-ISSUE",
              "name": "Pickle Security Issue",
              "defaultConfiguration": {
                "level": "error",
                "rank": 90.0
              }
            }
          ]
        }
      },
      "results": [
        {
          "ruleId": "MA-PICKLE-ISSUE",
          "level": "error",
          "message": {
            "text": "Suspicious module reference found: os.system"
          },
          "locations": [
            {
              "physicalLocation": {
                "artifactLocation": {
                  "uri": "model.pkl"
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Önem Düzeyi Eşlemesi

ModelAudit önem seviyeleri SARIF düzeylerine şu şekilde eşlenir:

- `CRITICAL` → `error`
- `WARNING` → `warning`
- `INFO` → `note`
- `DEBUG` → `none`

### Güvenlik Araçları ile Entegrasyon

SARIF çıktısı aşağıdakilerle entegrasyonu destekler:

#### GitHub Advanced Security

```yaml
# .github/workflows/security.yml
- name: Scan models
  run: promptfoo scan-model models/ --format sarif --output model-scan.sarif

- name: Upload SARIF to GitHub
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: model-scan.sarif
    category: model-security
```

#### Azure DevOps

```yaml
# azure-pipelines.yml
- script: |
    promptfoo scan-model models/ --format sarif --output $(Build.ArtifactStagingDirectory)/model-scan.sarif
  displayName: 'Scan models'

- task: PublishSecurityAnalysisLogs@3
  inputs:
    ArtifactName: 'CodeAnalysisLogs'
    ArtifactType: 'Container'
    AllTools: false
    ToolLogsNotFoundAction: 'Standard'
```

#### VS Code SARIF Viewer

```bash
# Yerelde görüntülemek için SARIF üretin
promptfoo scan-model . --format sarif --output scan.sarif

# VS Code'da SARIF Viewer eklentisiyle açın
code scan.sarif
```

#### Statik Analiz Platformları

SARIF çıktısı şu platformlarla uyumludur:

- SonarQube/SonarCloud (içe aktarma ile)
- Fortify
- Checkmarx
- CodeQL
- Snyk
- Ve SARIF uyumlu birçok diğer araç

## Yazılım Malzeme Listesi (SBOM)

Lisans bilgisi içeren CycloneDX uyumlu SBOM üretin:

```bash
promptfoo scan-model models/ --sbom model-sbom.json
```

SBOM içeriği:

- Bileşen bilgileri (dosya, tür, boyut, checksum)
- Lisans metadata'sı (tespit edilen lisanslar, telif sahipleri)
- Tarama bulgularına dayalı risk puanı
- Model/veri seti sınıflandırması

## Sorun Giderme

### Yaygın Sorunlar

1. **Eksik Bağımlılıklar**

   ```
   Error: h5py not installed, cannot scan Keras H5 files
   ```

   Çözüm: Gerekli bağımlılıkları kurun.

   ```bash
   pip install h5py tensorflow
   ```

2. **Zaman Aşımı Hataları**

   ```
   Error: Scan timeout after 300 seconds
   ```

   Çözüm: Zaman aşımını artırın.

   ```bash
   promptfoo scan-model model.pkl --timeout 7200  # Çok büyük modeller için 2 saat
   ```

3. **Dosya Boyutu Limitleri**

   ```
   Warning: File too large to scan
   ```

   Çözüm: En büyük dosya boyutu sınırını artırın.

   ```bash
   promptfoo scan-model model.pkl --max-size 3GB
   ```

4. **Bilinmeyen Format**

   ```
   Warning: Unknown or unhandled format
   ```

   Çözüm: Dosyanın desteklenen bir formatta olduğundan emin olun.

## ModelAudit'i Genişletme

### Özel Tarayıcı Oluşturma

`BaseScanner` sınıfını genişleterek özel tarayıcılar oluşturabilirsiniz:

```python
from modelaudit.scanners.base import BaseScanner, ScanResult, IssueSeverity

class CustomModelScanner(BaseScanner):
    """Özel model formatı için tarayıcı"""
    name = "custom_format"
    description = "Özel model formatını güvenlik sorunları için tarar"
    supported_extensions = [".custom", ".mymodel"]

    @classmethod
    def can_handle(cls, path: str) -> bool:
        """Bu tarayıcının verilen yolu işleyip işleyemeyeceğini kontrol eder"""
        return path.endswith(tuple(cls.supported_extensions))

    def scan(self, path: str) -> ScanResult:
        """Model dosyasını güvenlik sorunları için tarar"""
        result = self._create_result()

        try:
            # Özel tarama mantığınız
            with open(path, 'rb') as f:
                content = f.read()

            if b'malicious_pattern' in content:
                result.add_issue(
                    "Şüpheli desen bulundu",
                    severity=IssueSeverity.WARNING,
                    location=path,
                    details={"pattern": "malicious_pattern"}
                )

        except Exception as e:
            result.add_issue(
                f"Dosya taranırken hata: {str(e)}",
                severity=IssueSeverity.CRITICAL,
                location=path,
                details={"exception": str(e)}
            )

        result.finish(success=True)
        return result
```

Özel tarayıcıyı entegre etmek için `modelaudit/scanners/__init__.py` içindeki tarayıcı kayıt defterine ekleyin:

```python
# modelaudit/scanners/__init__.py içinde
from .custom_scanner import CustomModelScanner

# Kayıt defterine ekleme
registry.register(
    "custom_format",
    lambda: CustomModelScanner,
    description="Özel model formatı tarayıcısı",
    module="modelaudit.scanners.custom_scanner"
)
```

Özel tarayıcılar çalışma anında dinamik olarak kayıt edilemez; ModelAudit paket yapısına entegre edilmelidir. Üretim kullanımı için tarayıcınızı ModelAudit projesine katkı olarak sunmayı değerlendirin.
