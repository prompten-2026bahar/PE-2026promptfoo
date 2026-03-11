---
title: SharePoint Entegrasyonu
sidebar_label: SharePoint
description: Microsoft SharePoint'ten LLM test vakalarını içe aktarın. Sertifika tabanlı kimlik doğrulamayı yapılandırın ve SharePoint CSV dosyalarından test verilerini yükleyin.
---

# SharePoint Entegrasyonu

promptfoo, Azure AD ile sertifika tabanlı kimlik doğrulamayı kullanarak eval test vakalarını doğrudan Microsoft SharePoint CSV dosyalarından içe aktarmanıza olanak tanır.

## Ön Koşullar

1. **Eş Bağımlılıkları (Peer Dependencies) Kurun**

   ```bash
   npm install @azure/msal-node
   ```

2. **Azure AD Uygulamasını Kurun**
   - [Azure Portalı](https://portal.azure.com/) üzerinden "Azure Active Directory" > "App registrations" (Uygulama kayıtları) bölümünde bir uygulama kaydedin
   - SharePoint `Sites.Read.All` izni ile API izinlerini yapılandırın
   - Bir PEM sertifikası (hem özel anahtar hem de sertifika içeren) oluşturup uygulamanıza yükleyerek sertifika tabanlı kimlik doğrulamayı kurun
   - Uygulamanızın SharePoint sitelerine erişmek için gerekli izinlere sahip olduğundan emin olun

   Ayrıntılı kurulum adımları için IT/DevOps ekibinize veya [Microsoft belgelerine](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/register-sharepoint-add-ins) danışın.

3. **Ortam Değişkenlerini Yapılandırın**

   Aşağıdaki ortam değişkenlerini ayarlayın:

   ```bash
   export SHAREPOINT_CLIENT_ID="uygulama-istemci-kimliginiz"
   export SHAREPOINT_TENANT_ID="azure-kiraci-kimliginiz"
   export SHAREPOINT_CERT_PATH="/yol/sharepoint-sertifikasi.pem"
   export SHAREPOINT_BASE_URL="https://sirketiniz.sharepoint.com"
   ```

   Veya projenizin kök dizininde bir `.env` dosyası oluşturun:

   ```bash title=".env"
   SHAREPOINT_CLIENT_ID=uygulama-istemci-kimliginiz
   SHAREPOINT_TENANT_ID=azure-kiraci-kimliginiz
   SHAREPOINT_CERT_PATH=/yol/sharepoint-sertifikasi.pem
   SHAREPOINT_BASE_URL=https://sirketiniz.sharepoint.com
   ```

   :::caution
   `.env` dosyasını `.gitignore` dosyanıza eklemeyi unutmayın!
   :::

## SharePoint'ten Test Vakalarını İçe Aktarma

Kimlik doğrulama yapılandırıldıktan sonra, yapılandırmanızda SharePoint CSV dosyasının URL'sini belirtin:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: 'SharePoint CSV İçe Aktarma Örneği'
prompts:
  - 'Lütfen aşağıdaki metni {{language}} diline çevir: {{input}}'
providers:
  - openai:gpt-5
  - anthropic:claude-sonnet-4-5-20250929
# highlight-start
tests: https://sirketiniz.sharepoint.com/sites/siteniz/Shared%20Documents/test-vakalariniz.csv
# highlight-end
```

SharePoint CSV dosyası, test vakalarını tanımlayan sütunlarla yapılandırılmalıdır:

```csv title="test-vakalariniz.csv"
language,input,__expected
French,Hello world,icontains: bonjour
German,I'm hungry,llm-rubric: is german
Swahili,Hello world,similar(0.8):hello world
```

> 💡 CSV yapısı hakkındaki ayrıntılar için [CSV'den savları yükleme (load assertions from CSV)](/docs/configuration/expected-outputs/#load-assertions-from-csv) bölümüne bakın.

## Ortam Değişkenleri

| Değişken               | Açıklama                                                  | Gerekli |
| ---------------------- | --------------------------------------------------------- | ------- |
| `SHAREPOINT_CLIENT_ID` | Uygulama kaydından alınan Azure AD uygulama (istemci) ID'si | Evet    |
| `SHAREPOINT_TENANT_ID` | Azure AD kiracı (dizin) ID'si                             | Evet    |
| `SHAREPOINT_CERT_PATH` | Özel anahtar ve sertifikayı içeren PEM dosyasının yolu    | Evet    |
| `SHAREPOINT_BASE_URL`  | SharePoint sitenizin temel URL'si                         | Evet    |

## Model Dereceli Metrikler için Özel Sağlayıcılar Kullanma

Test vakaları için SharePoint kullanırken, `llm-rubric` veya `similar` gibi model dereceli metrikler için hala özel sağlayıcılar kullanabilirsiniz. Bunu yapmak için yapılandırmanıza bir `defaultTest` özelliği ekleyerek varsayılan LLM derecelendiriciyi (grader) geçersiz kılın:

```yaml
prompts:
  - file://prompt1.txt
  - file://prompt2.txt
providers:
  - openai:gpt-5
  - anthropic:claude-sonnet-4-5-20250929
tests: https://sirketiniz.sharepoint.com/sites/siteniz/Shared%20Documents/test-vakalariniz.csv
defaultTest:
  options:
    provider:
      text:
        id: ollama:chat:llama3.3:70b
      embedding:
        id: ollama:embeddings:mxbai-embed-large
```

LLM derecelendiriciyi özelleştirme hakkında daha fazla ayrıntı için [model dereceli metrikler belgelerine (model-graded metrics documentation)](/docs/configuration/expected-outputs/model-graded/#overriding-the-llm-grader) bakın.
