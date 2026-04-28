# LLM Tedarik Zinciri Güvenliği

Geleneksel yazılım tedarik zinciri güvenliği deterministik doğrulamaya dayanır: Bir ikili dosyayı (binary) hash'le, imzayı kontrol et ve bilinen CVE'ler için tara. Eğer bitler eşleşiyorsa, yazılım beklendiği gibi davranır.






LLM tedarik zincirleri bu modeli bozar. Bir model dosyası tüm statik kontrollerden geçebilir ve yine de tehlikeli davranışlar sergileyebilir. Bir API uç noktası, herhangi bir bildirim olmaksızın davranışını bir gecede değiştirebilir. İnce ayar yapılmış (fine-tuned) bir model, temel modeliyle özdeş görünebilir ancak güvenlik eğitimi zayıflamış olabilir.

OWASP, tedarik zinciri güvenlik açıklarını **LLM Top 10** listesinde **LLM03** olarak tanımlar. Bu kılavuz, LLM tedarik zinciri güvenliği hakkında düşünmek için bir çerçeve oluşturur ve Promptfoo kullanarak savunmaların nasıl uygulanacağını gösterir.
### İki Farklı Tehdit Sınıfı
LLM tedarik zinciri saldırıları, temelden farklı tespit yaklaşımları gerektiren iki kategoriye ayrılır:


| Tehdit Sınıfı | Saldırı Vektörü | Tespit Yöntemi | Kimler İçin Geçerli? |
| :--- | :--- | :--- | :--- |
| **Kod Çalıştırma** | Truva atı içeren model dosyaları, kötü amaçlı serileştirme, gömülü yürütülebilir dosyalar | Model yapıtlarının statik analizi | Açık ağırlıklı (open-weight) model barındıran kuruluşlar |
| **Davranışsal** | Model kayması (drift), zehirleme etkileri, hizalama bozulması, sessiz güncellemeler | Bilinen temel çizgilere (baseline) karşı dinamik testler | LLM kullanan tüm kuruluşlar |
Çoğu güvenlik ekibi, geleneksel yazılım güvenliğinden aşina oldukları için kod çalıştırma risklerine odaklanır. Ancak **davranışsal riskler** genellikle daha tehlikelidir: tespit edilmeleri daha zordur, kademeli olarak ortaya çıkabilirler ve LLM'lerin olasılıksal doğasını istismar ederler.

### Kod Çalıştırma Riskleri
HuggingFace'ten, bir satıcıdan veya dahili bir ML ekibinden model ağırlıklarını indirdiğinizde, bu dosyalar şunları içerebilir:

*   **Kötü amaçlı pickle yükleri:** Python'un pickle formatı, seri durumdan çıkarma (deserialization) sırasında rastgele kod çalıştırır.
*   **Gömülü yürütülebilir dosyalar:** Model yapılarının içine gizlenmiş PE, ELF veya Mach-O ikili dosyaları.
*   **Kimlik bilgisi hasadı:** API anahtarlarını, belirteçleri veya ortam değişkenlerini dışarı sızdıran kodlar.
*   **Ağ arka kapıları:** Model yükleme sırasında saldırgan kontrollü sunuculara yapılan bağlantılar.

Bunlar, ML için uyarlanmış klasik tedarik zinciri saldırılarıdır. Model henüz çalışmadan önce statik analiz yoluyla tespit edilebilirler.

### Davranışsal Riskler
Model dosyaları temiz olsa bile, davranışsal riskler şu durumlardan kaynaklanır:

*   **Sessiz API güncellemeleri:** Sağlayıcılar, modelleri haber vermeden günceller ve bu durum güvenlik eğitimini zayıflatabilir.
*   **İnce ayar (Fine-tuning) bozulması:** Özel eğitimler, temel modelin güvenli davranışlarını aşındırabilir.
*   **Zehirlenmiş eğitim verileri:** İnce ayar veri setlerindeki kötü amaçlı örnekler, hedeflenmiş güvenlik açıkları oluşturur.
*   **RAG doküman enjeksiyonu:** Model çıktılarını manipüle eden ele geçirilmiş bilgi tabanları.
*   **İstem şablonu kayması (Prompt template drift):** Güvenlik kontrollerini zayıflatan sistem istemi değişiklikleri.

Bu saldırılar kod tabanınızda tek bir biti bile değiştirmez. Model dosyası (eğer varsa) aynı kalır. API uç noktası 200 OK döndürür. Ancak modelin davranışı, güvenlik açıkları yaratacak şekilde değişmiştir.

Bu nedenle geleneksel tedarik zinciri güvenliği LLM'lerde başarısız olur. **Davranışsal özellikleri hash'leyemezsiniz; onları sadece test edebilirsiniz.**

### Statik Analiz: Model Dosyalarını Tarama
Statik analiz, model ağırlıklarını yerel olarak indirip barındırdığınızda geçerlidir. Dağıtımdan önce model dosyalarını taramak için `ModelAudit` kullanın.

#### Statik Tarama Ne Zaman Kullanılmalı?
Aşağıdaki durumlarda model dosyalarını tarayın:
*   HuggingFace, Civitai veya diğer depolardan model indirirken.
*   Satıcılardan veya dahili ekiplerden ince ayar yapılmış modeller alırken.
*   Bulut depolama alanlarından (S3, GCS, Azure Blob) model çekerken.
*   Model ağırlıklarını içeren konteyner imajları oluştururken.

#### Taramaları Çalıştırma
```bash
# Yerel bir model dosyasını tara
promptfoo scan-model ./models/llama-3-8b.pt

# İndirmeden doğrudan HuggingFace üzerinden tara
promptfoo scan-model hf://meta-llama/Llama-3-8B

# Bulut depolama üzerinden tara
promptfoo scan-model s3://my-bucket/models/custom-finetune.safetensors

# Güvenlik açısından kritik dağıtımlar için katı modda tara
promptfoo scan-model ./models/ --strict
```
### Statik Tarama Neleri Tespit Eder?
ModelAudit şunları kontrol eder:

*   **Tehlikeli pickle işlem kodları** ve seri durumdan çıkarma (deserialization) saldırıları.
*   Şüpheli **TensorFlow işlemleri** ve Keras Lambda katmanları.
*   Gömülü **yürütülebilir dosyalar** (PE, ELF, Mach-O).
*   Gizlenmiş **kimlik bilgileri** (API anahtarları, belirteçler, şifreler).
*   **Ağ modelleri** (URL'ler, IP'ler, soket işlemleri).
*   Kodlanmış veri yükleri (payload) ve **gizlenmiş (obfuscated) kodlar**.
*   Potansiyel arka kapıları işaret eden **ağırlık anomalileri**.

### CI/CD Entegrasyonu
Taranmamış veya şüpheli modeller içeren dağıtımları engelleyin:

`.github/workflows/model-scan.yml`
```yaml
name: Model Güvenlik Taraması

on:
  push:
    paths:
      - 'models/**'
  pull_request:
    paths:
      - 'models/**'

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Bağımlılıkları yükle
        run: |
          npm install -g promptfoo
          pip install modelaudit

      - name: Modelleri tara
        run: |
          promptfoo scan-model ./models/ \
            --strict \
            --format sarif \
            --output model-scan-results.sarif

      - name: Sonuçları yükle
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: model-scan-results.sarif
```
### Statik Analizin Sınırları
Statik tarama şunları tespit edemez:

*   Modelin çıkarım (inference) anında gerçekte nasıl davranacağını.
*   Güvenlik eğitiminin zayıflayıp zayıflamadığını.
*   Belirli girdilerle tetiklenen ince davranışsal arka kapıları.
*   Modelin güvenlik gereksinimlerinizi karşılayıp karşılamadığını.

Statik analizden geçen bir modelin dağıtılması hala tehlikeli olabilir. Statik tarama **gereklidir ancak yeterli değildir.**

### Dinamik Analiz: Davranışsal Testler
Dinamik analiz, modellerin gerçekte nasıl davrandığını test eder. Bu yöntem; statik analizin yakalayamadığı kayma (drift), zehirlenme etkileri, hizalama bozulması ve güvenlik gerilemeleri gibi riskleri tespit eder.

Statik analizin aksine dinamik testler; ister açık ağırlıklı modeller barındırın, ister üçüncü taraf API'leri çağırın, tüm LLM dağıtımları için geçerlidir.

#### Temel Sorun
Şu senaryoyu düşünün: Uygulamanız OpenAI API'si üzerinden `gpt-4o` kullanıyor. Geçen ay, zararlı içerik taleplerini doğru bir şekilde reddediyordu. Bu ay, size bildirilmeyen bir sağlayıcı güncellemesinden sonra bu ret yanıtlarının bir kısmı zayıfladı.

Kod değişmedi. Dosyalar değişmedi. Testleriniz geçiyor. Ancak güvenlik duruşunuz bozuldu.

Dinamik analiz, model davranışını belirlenmiş temel çizgilerle (**baseline**) sürekli olarak test ederek bu durumu tespit eder.

#### Davranışsal Temel Çizgiler Oluşturma
Gereksinimlerinizi kodlayan bir güvenlik test paketi oluşturun:

`security-baseline.yaml`
```yaml
description: Üretim modelleri için güvenlik temel çizgisi

targets:
  - id: openai:gpt-4o
    label: production-model

redteam:
  purpose: |
    Bir finansal hizmetler şirketi için müşteri hizmetleri sohbet botu.
    Kimlik doğrulaması olmadan hesap ayrıntıları taleplerini reddetmeli,
    asla finansal tavsiye vermemeli ve PII (Kişisel Veri) gizliliğini korumalıdır.

  plugins:
    - owasp:llm
    - pii:direct
    - pii:session
    - harmful:privacy
    - harmful:specialized-advice
    - rbac
    - bola
    - prompt-extraction

  strategies:
    - jailbreak:composite
    - prompt-injection
```
Temel çizgiyi çalıştırın ve sonuçları kaydedin:

```bash
promptfoo redteam run -c security-baseline.yaml --output baseline-results.json
```
### Model Kaymasını (Drift) Tespit Etme
Mevcut davranışı temel çizginizle karşılaştıran düzenli kayma kontrolleri planlayın:

`.github/workflows/drift-detection.yml`
```yaml
name: Model Kayması Tespiti

on:
  schedule:
    - cron: '0 6 * * *' # Günlük
  workflow_dispatch:

jobs:
  detect-drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Güvenlik testlerini çalıştır
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          npx promptfoo redteam run -c security-baseline.yaml \
            --output current-results.json

      - name: Temel çizgi ile karşılaştır
        run: |
          # Hata oranı %5'ten fazla arttıysa işlemi durdur
          npx promptfoo redteam compare \
            --baseline baseline-results.json \
            --current current-results.json \
            --threshold 0.05

      - name: Kayma durumunda uyar
        if: failure()
        run: echo "Model davranışsal kayması tespit edildi - sonuçları inceleyin"
```
### Satıcı Kabul Testi (Vendor Acceptance Testing)
Yeni bir modeli veya sağlayıcıyı etkinleştirmeden önce, güvenlik gereksinimlerinizi karşıladığını doğrulayın:

`vendor-acceptance.yaml`
```yaml
description: Satıcı modeli kabul testi

targets:
  - id: '{{CANDIDATE_MODEL}}'
    label: candidate

redteam:
  purpose: |
    Hasta girişi ve randevu planlaması için sağlık asistanı.
    Hasta gizliliğini korumalı ve tıbbi tavsiye vermeyi reddetmelidir.

  numTests: 25

  plugins:
    # Mevzuata uygunluk
    - owasp:llm
    - nist:ai:measure

    # Sağlık sektörüne özel
    - harmful:privacy
    - harmful:specialized-advice
    - pii

    # Erişim kontrolü
    - rbac
    - bola
    - bfla

  strategies:
    - jailbreak:composite
    - prompt-injection
    - crescendo
```
Dağıtımdan önce kabul testlerini çalıştırın:

```bash
promptfoo redteam run -c vendor-acceptance.yaml \
  --var CANDIDATE_MODEL=anthropic:claude-sonnet-4-20250514
```
### Modelleri Yan Yana Karşılaştırma
Sağlayıcı değiştirirken veya model yükseltirken, her iki model için de aynı testleri çalıştırın:

`model-comparison.yaml`
```yaml
description: Güvenlik karşılaştırması - Mevcut vs. Aday

targets:
  - id: openai:gpt-4o
    label: mevcut-uretim
  - id: anthropic:claude-sonnet-4-20250514
    label: aday

redteam:
  purpose: Yan haklar ve politika soruları için dahili İK asistanı

  plugins:
    - owasp:llm
    - pii
    - rbac
    - harmful:privacy

  strategies:
    - jailbreak:composite
    - prompt-injection
```
Rapor, güvenlik açığı oranlarını yan yana gösterir:
### İnce Ayar Yapılmış (Fine-Tuned) Modelleri Test Etme
İnce ayar işlemleri, modelin güvenlik eğitimini zayıflatabilir. İnce ayar yapılmış modelleri her zaman temel modelleriyle karşılaştırın:

`finetune-regression.yaml`
```yaml
description: İnce ayar güvenlik regresyon testi

targets:
  - id: openai:gpt-4o
    label: temel-model
  - id: openai:ft:gpt-4o:my-org:support-agent:abc123
    label: ince-ayarli-model

redteam:
  purpose: |
    Şirket dökümantasyonu üzerinde ince ayar yapılmış müşteri destek temsilcisi.
    Temel modeldeki tüm güvenlik davranışlarını korumalıdır.

  plugins:
    - harmful
    - pii
    - prompt-extraction
    - excessive-agency

  strategies:
    - jailbreak:composite
    - prompt-injection
```
İnce ayar yapılmış (fine-tuned) modeldeki önemli ölçüde yüksek hata oranı, ince ayar sürecinin güvenlik eğitimini zayıflattığını gösterir.

### Komşu Tedarik Zincirlerini Güvenli Hale Getirme
Modelin kendisinin ötesinde, LLM uygulamaları bağlı sistemlerde de tedarik zinciri riskleri taşır.

#### RAG Veri Kaynakları
Ele geçirilmiş doküman depoları model çıktılarını zehirleyebilir:

```yaml
redteam:
  plugins:
    - rag-poisoning
    - rag-document-exfiltration
    - indirect-prompt-injection

  strategies:
    - prompt-injection
```
Kapsamlı bilgi için **RAG güvenlik kılavuzuna** bakabilirsiniz.

#### MCP Araçları (Model Context Protocol)
Üçüncü taraf MCP sunucuları veri sızdırabilir veya yetki yükseltebilir:

```yaml
redteam:
  plugins:
    - mcp
    - tool-discovery
    - excessive-agency
    - ssrf

  strategies:
    - jailbreak:composite
    - prompt-injection
```
Detaylar için **MCP güvenlik testi kılavuzuna** bakabilirsiniz.

### Tedarik Zinciri Güvenliğini Operasyonel Hale Getirme
#### Dağıtım Öncesi Geçitler (Pre-Deployment Gates)
Güvenlik testlerinden geçemeyen üretim (production) dağıtımlarını engelleyin:

`.github/workflows/deploy.yml`
```yaml
name: Güvenlik Geçidi ile Dağıtım

on:
  push:
    branches: [main]

jobs:
  security-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Statik tarama (varsa)
        if: hashFiles('models/**') != ''
        run: |
          pip install modelaudit
          promptfoo scan-model ./models/ --strict

      - name: Dinamik güvenlik testleri
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: npx promptfoo redteam run -c security-baseline.yaml

  deploy:
    needs: security-gate
    runs-on: ubuntu-latest
    steps:
      - name: Üretime dağıt
        run: ./deploy.sh
```
### Olay Müdahalesi (Incident Response)
Bir kayma (drift) tespit edildiğinde:

*   Belirli gerilemeleri (regressions) tanımlamak için mevcut sonuçları temel çizgiyle (baseline) karşılaştırın.
*   Değişikliğin sağlayıcı kaynaklı mı yoksa dahili mi olduğunu belirleyin.
*   Geriye mi dönüleceğine (roll back), koruma duvarı (guardrails) mı ekleneceğine yoksa riskin mi kabul edileceğine karar verin.
*   Değişiklik kabul edilebilir düzeydeyse temel çizgiyi güncelleyin.

### Özet
LLM tedarik zinciri güvenliği birbirini tamamlayan iki yaklaşım gerektirir:


| Yaklaşım | Neyi Tespit Eder? | Kimler İçin Geçerli? | Araç |
| :--- | :--- | :--- | :--- |
| **Statik Analiz** | Truva atı içeren dosyalar, kötü amaçlı kodlar, gömülü yürütülebilir dosyalar | Açık ağırlıklı model barındıran kuruluşlar | ModelAudit |
| **Dinamik Analiz** | Davranışsal kayma, zehirleme etkileri, güvenlik gerilemesi | Tüm LLM dağıtımları | Red Teaming |
Statik analiz tanıdıktır ancak sınırlıdır. Dinamik analiz temeldir; çünkü LLM riskleri özünde davranışsaldır: Dosya içeriklerinde değil, çıkarım (inference) anında kendilerini gösterirler.

### İlgili Dokümantasyon
*   **[OWASP LLM Top 10](https://owasp.org)** - LLM03 dahil olmak üzere LLM güvenlik risklerinin tam kapsamı.
*   **[Temel Model Testleri (Foundation Model Testing)](https://promptfoo.dev)** - Temel model güvenliğinin değerlendirilmesi.
*   **[RAG Güvenliği](https://promptfoo.dev)** - Veri alma ile artırılmış üretimin (RAG) güvenli hale getirilmesi.
*   **[ModelAudit](https://github.com)** - Statik model dosyası taraması.
*   **[Yapılandırma Referansı](https://promptfoo.dev)** - Tüm kırmızı ekip (red team) yapılandırma seçenekleri.




