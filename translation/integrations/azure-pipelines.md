---
sidebar_label: Azure Pipelines
description: Adım adım kurulum, ortam değişkenleri ve otomatik yapay zeka değerlendirmesi için matris test yapılandırmalarını kullanarak promptfoo LLM testini Azure Pipelines CI/CD ile entegre edin
---

# Azure Pipelines Entegrasyonu

Bu kılavuz, CI hattınızın bir parçası olarak değerlendirmeleri çalıştırmak için promptfoo'nun Azure Pipelines ile nasıl kurulacağını gösterir.

## Ön Koşullar

- Bir promptfoo projesi içeren GitHub veya Azure DevOps deposu
- İşlem hattı (pipeline) oluşturma iznine sahip bir Azure DevOps hesabı
- [Azure Pipeline değişkenleri](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/variables) olarak saklanan LLM sağlayıcılarınız için API anahtarları

## Azure Pipeline Kurulumu

Deponuzun kök dizininde aşağıdaki yapılandırmaya sahip `azure-pipelines.yml` adında yeni bir dosya oluşturun:

```yaml
trigger:
  - main
  - master # Eğer ana dalınız master ise dahil edin

pool:
  vmImage: 'ubuntu-latest'

variables:
  npm_config_cache: $(Pipeline.Workspace)/.npm

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'
    displayName: 'Node.js Kurulumu'

  - task: Cache@2
    inputs:
      key: 'npm | "$(Agent.OS)" | package-lock.json'
      restoreKeys: |
        npm | "$(Agent.OS)"
      path: $(npm_config_cache)
    displayName: 'npm paketlerini önbelleğe al'

  - script: |
      npm ci
      npm install -g promptfoo
    displayName: 'Bağımlılıkları kur'

  - script: |
      npx promptfoo eval
    displayName: 'promptfoo değerlendirmelerini çalıştır'
    env:
      OPENAI_API_KEY: $(OPENAI_API_KEY)
      ANTHROPIC_API_KEY: $(ANTHROPIC_API_KEY)
      # Gerektiğinde diğer API anahtarlarını ekleyin

  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'promptfoo-results.xml'
      mergeTestResults: true
      testRunTitle: 'Promptfoo Değerlendirme Sonuçları'
    condition: succeededOrFailed()
    displayName: 'Test sonuçlarını yayınla'

  - task: PublishBuildArtifacts@1
    inputs:
      pathtoPublish: 'promptfoo-results.json'
      artifactName: 'promptfoo-results'
    condition: succeededOrFailed()
    displayName: 'Değerlendirme sonuçlarını yayınla'
```

## Ortam Değişkenleri

LLM sağlayıcı API anahtarlarınızı Azure DevOps'ta [gizli işlem hattı değişkenleri](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/variables#secret-variables) olarak saklayın:

1. Azure DevOps'taki projenize gidin
2. İşlem Hatları (Pipelines) > İşlem Hattınız > Düzenle (Edit) > Değişkenler (Variables) bölümüne gidin
3. Her sağlayıcı API anahtarı için değişkenler ekleyin (örneğin, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`)
4. Günlüklerde (logs) görüntülenmediklerinden emin olmak için bunları gizli (secret) olarak işaretleyin

## Gelişmiş Yapılandırma

### Başarısız Savlar (Assertions) Durumunda İşlem Hattını Durdur

Betik (script) adımını değiştirerek, promptfoo savları başarılı olmadığında işlem hattının başarısız olmasını sağlayabilirsiniz:

```yaml
- script: |
    npx promptfoo eval --fail-on-error
  displayName: 'promptfoo değerlendirmelerini çalıştır'
  env:
    OPENAI_API_KEY: $(OPENAI_API_KEY)
```

### Özel Çıktı Konumunu Yapılandırma

Sonuçların nerede saklanacağını özelleştirmek isterseniz:

```yaml
- script: |
    npx promptfoo eval --output-path $(Build.ArtifactStagingDirectory)/promptfoo-results.json
  displayName: 'promptfoo değerlendirmelerini çalıştır'
```

### Pull Request'lerde Çalıştırma

Değerlendirmeleri pull request'lerde çalıştırmak için bir PR tetikleyicisi ekleyin:

```yaml
trigger:
  - main
  - master

pr:
  - main
  - master
# İşlem hattı yapılandırmasının kalanı
```

### Koşullu Yürütme

promptfoo'yu yalnızca belirli dosyalar değiştiğinde çalıştırın:

```yaml
steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'
    displayName: 'Node.js Kurulumu'

  - script: |
      npm ci
      npm install -g promptfoo
    displayName: 'Bağımlılıkları kur'

  - script: |
      npx promptfoo eval
    displayName: 'promptfoo değerlendirmelerini çalıştır'
    condition: |
      and(
        succeeded(),
        or(
          eq(variables['Build.SourceBranch'], 'refs/heads/main'),
          eq(variables['Build.Reason'], 'PullRequest')
        ),
        or(
          eq(variables['Build.Reason'], 'PullRequest'),
          contains(variables['Build.SourceVersionMessage'], '[run-eval]')
        )
      )
    env:
      OPENAI_API_KEY: $(OPENAI_API_KEY)
```

## Matris Testi ile Kullanım

Birden fazla yapılandırmada veya modelde paralel olarak test yapın:

```yaml
strategy:
  matrix:
    gpt:
      MODEL: 'gpt-5.1'
    claude:
      MODEL: 'claude-sonnet-4-5-20250929'

steps:
  - script: |
      npx promptfoo eval --providers.0.config.model=$(MODEL)
    displayName: '$(MODEL) ile test et'
    env:
      OPENAI_API_KEY: $(OPENAI_API_KEY)
      ANTHROPIC_API_KEY: $(ANTHROPIC_API_KEY)
```

## Sorun Giderme

Azure Pipelines entegrasyonunuzla ilgili sorunlarla karşılaşırsanız:

- **Günlükleri kontrol edin**: Hataları belirlemek için Azure DevOps'taki ayrıntılı günlükleri inceleyin
- **API anahtarlarını doğrulayın**: API anahtarlarınızın işlem hattı değişkenleri olarak doğru ayarlandığından emin olun
- **İzinler**: İşlem hattının yapılandırma dosyalarınızı okuma erişimine sahip olduğundan emin olun
- **Node.js sürümü**: Promptfoo, Node.js >= 20.0.0 sürümünü gerektirir

Değerlendirmeler sırasında zaman aşımı yaşıyorsanız, işlem hattı zaman aşımı ayarlarını yapmanız veya uzun süreli değerlendirmelerde daha iyi kararlılık için bir [kendi kendine barındırılan aracı (self-hosted agent)](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/agents) kullanmayı düşünmeniz gerekebilir.
