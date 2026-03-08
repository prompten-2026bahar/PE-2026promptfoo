---
sidebar_label: Google Sheets
description: Google Sheets entegrasyonu ile LLM test vakalarını içe ve dışa aktarmayı öğrenin. Herkese açık veya kimlik doğrulamalı erişimi yapılandırın, değerlendirme sonuçlarını yazın ve model tabanlı metrikleri çalıştırın.
---

# Google Sheets Entegrasyonu

promptfoo, değerlendirme test vakalarını doğrudan Google Sheets'ten içe aktarmanıza olanak tanır. Bu işlem, ya kimlik doğrulamasız (eğer tablo herkese açıksa) ya da genellikle programatik erişim için bir hizmet hesabı (service account) kullanılarak Google'ın Varsayılan Uygulama Kimlik Bilgileri (Default Application Credentials) ile kimlik doğrulamalı olarak yapılabilir.

## Google Sheets'ten Test Vakalarını İçe Aktarma

### Herkese Açık Tablolar (Kimlik Doğrulamasız)

"Bağlantıya sahip olan herkes" tarafından erişilebilen tablolar için, yapılandırmanızda paylaşım URL'sini belirtmeniz yeterlidir:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: 'Herkese Açık Google Tablosu Örneği'
prompts:
  - 'Lütfen şu metni {{language}} diline çevir: {{input}}'
providers:
  - anthropic:messages:claude-3-5-sonnet-20241022
  - openai:chat:gpt-5
// highlight-start
tests: https://docs.google.com/spreadsheets/d/1eqFnv1vzkPvS7zG-mYsqNDwOzvSaiIAsKB3zKg9H18c/edit?usp=sharing
// highlight-end
```

Yukarıdaki Google Tablosu, test vakalarını tanımlayan sütunlarla yapılandırılmıştır. İşte tablonun bir kopyası:

```csv title="Google Tablosu"
language,input,__expected
French,Hello world,icontains: bonjour
German,I'm hungry,llm-rubric: is german
Swahili,Hello world,similar(0.8):hello world
```

> 💡 Beklenen format için [örnek tablomuza](https://docs.google.com/spreadsheets/d/1eqFnv1vzkPvS7zG-mYsqNDwOzvSaiIAsKB3zKg9H18c/edit#gid=0) göz atın. Tablo yapısı hakkındaki ayrıntılar için [CSV'den savları yükleme](/docs/configuration/expected-outputs/#load-assertions-from-csv) bölümüne bakın.

### Özel Tablolar (Kimlik Doğrulamalı)

Özel tablolar için Google'ın Varsayılan Uygulama Kimlik Bilgilerini (Default Application Credentials) ayarlamanız gerekir:

1. **Bağımlılıkları Kurun**

   ```bash
   npm install googleapis
   ```

2. **Kimlik Doğrulamayı Ayarlayın**
   - Google Cloud'da bir [hizmet hesabı](https://console.cloud.google.com/iam-admin/serviceaccounts) oluşturun
   - JSON anahtar dosyasını indirin
   - [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com) (`sheets.googleapis.com`) özelliğini etkinleştirin
   - Tablonuzu, en az görüntüleyici (viewer) yetkisiyle hizmet hesabı e-postasıyla (`your-service-account@project-name.iam.gserviceaccount.com`) paylaşın

3. **Kimlik Bilgilerini Yapılandırın**

   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-file.json"
   ```

4. **Aynı URL Formatını Kullanın**
   ```yaml
   tests: https://docs.google.com/spreadsheets/d/1eqFnv1vzkPvS7zG-mYsqNDwOzvSaiIAsKB3zKg9H18c/edit?usp=sharing
   ```
   Tablo herkese açık olmadığında sistem otomatik olarak kimlik doğrulamalı erişimi kullanacaktır.

## Değerlendirme Sonuçlarını Google Sheets'e Yazma

`outputPath` parametresi (`--output` veya `-o` komut satırında), değerlendirme sonuçlarının doğrudan Google Sheets'e yazılmasını destekler. Bu, yazma erişimi yapılandırılmış Varsayılan Uygulama Kimlik Bilgilerini gerektirir.

### Temel Kullanım

```yaml
prompts:
  - ...
providers:
  - ...
tests:
  - ...
// highlight-start
outputPath: https://docs.google.com/spreadsheets/d/1eqFnv1vzkPvS7zG-mYsqNDwOzvSaiIAsKB3zKg9H18c/edit?usp=sharing
// highlight-end
```

### Belirli Tabloları Hedefleme

Sonuçları bir Google Tablosu'na yazarken iki seçeneğiniz vardır:

1. **URL'ye tablonun `gid` parametresini ekleyerek mevcut bir sayfaya yazın**:

    ```yaml
    outputPath: https://docs.google.com/spreadsheets/d/1eqFnv1vzkPvS7zG-mYsqNDwOzvSaiIAsKB3zKg9H18c/edit#gid=123456789
    ```

    > 💡 Bir sayfanın `gid` değerini bulmak için tabloyu tarayıcınızda açın ve URL'ye bakın; `gid` değeri `#gid=` kısmından sonra görünür.

2. **`gid` parametresini atlayarak otomatik olarak yeni bir sayfa oluşturun**. Sistem şunları yapacaktır:
   - Zaman damgası tabanlı bir ada sahip (örneğin, "Sheet1234567890") yeni bir sayfa oluşturur
   - Sonuçları bu yeni sayfaya yazar
   - Mevcut sayfaları ve verilerini korur

Bu davranış, değerlendirme sonuçlarınızı aynı Google Sheets belgesi içinde düzenli tutarken verilerin yanlışlıkla üzerine yazılmasını önlemeye yardımcı olur.

### Çıktı Formatı

Sonuçlar; test değişkenleri sütunları ve ardından prompt çıktıları ile yazılır. Prompt sütunları, başlıktaki sağlayıcıyı `[sağlayıcı] prompt-etiketi` biçimini kullanarak içerir. Örneğin, aynı promptu test eden iki sağlayıcı ile:

| language | input       | [openai:gpt-5] Çevir | [anthropic:claude-4.5-sonnet] Çevir |
| -------- | ----------- | ------------------------ | --------------------------------------- |
| French   | Hello world | Bonjour le monde         | Bonjour monde                           |

## Model Tabanlı Metrikler İçin Özel Sağlayıcılar Kullanma

Test vakaları için Google Sheets kullanırken, `llm-rubric` veya `similar` gibi model tabanlı metrikler için hala özel sağlayıcılar kullanabilirsiniz. Bunu yapmak için yapılandırmanıza bir `defaultTest` özelliği ekleyerek varsayılan LLM puanlayıcısını geçersiz kılın:

```yaml
prompts:
  - file://prompt1.txt
  - file://prompt2.txt
providers:
  - anthropic:messages:claude-3-5-sonnet-20241022
  - openai:chat:gpt-5-mini
tests: https://docs.google.com/spreadsheets/d/1eqFnv1vzkPvS7zG-mYsqNDwOzvSaiIAsKB3zKg9H18c/edit?usp=sharing
defaultTest:
  options:
    provider:
      text:
        id: ollama:chat:llama3.3:70b
      embedding:
        id: ollama:embeddings:mxbai-embed-large
```

LLM puanlayıcısını özelleştirme hakkında daha fazla ayrıntı için [model tabanlı metrikler belgelerine](/docs/configuration/expected-outputs/model-graded/#overriding-the-llm-grader) bakın.
