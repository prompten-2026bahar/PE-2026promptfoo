# LLM Uygulamalarında Kırmızı Takım (Red Team) Çalışması Nasıl Yapılır?

**Promptfoo**, LLM kırmızı takım ve sızma testi yeteneklerini içeren popüler bir açık kaynaklı değerlendirme çerçevesidir (framework).

Bu kılavuz, uygulamanıza özel saldırgan (adversarial) testleri nasıl otomatik olarak oluşturacağınızı gösterir. Kırmızı takım çalışması, aşağıdakiler de dahil olmak üzere çok çeşitli potansiyel güvenlik açıklarını ve hata modlarını kapsar:

### Gizlilik ve Güvenlik:

*   **PII Sızıntıları:** Kişisel verilerin ifşası.
*   **Erişim Kontrolü Güvenlik Açıkları:** BFLA, BOLA ve yetkilendirme hataları.
*   **SSRF:** Sunucu taraflı istek sahteciliği.

### Teknik Güvenlik Açıkları:

*   **Prompt Enjeksiyonu ve Çıkarımı:** Girdilerle sistemi manipüle etme veya sistem komutlarını çalma.
*   **Jailbreaking:** Güvenlik bariyerlerini ve kısıtlamaları aşma denemeleri.
*   **SQL ve Shell Enjeksiyonu:** Veritabanı ve sistem komut satırı saldırıları.
*   **ASCII Kaçakçılığı:** Görünmez karakterlerle filtreleri atlatma.

### İçerik Güvenliği ve Politika İhlalleri:

*   **Zararlı İçerik Üretimi:** Güvenlik politikalarını ihlal eden yanıtların test edilmesi.
*   **Yanlış Bilgilendirme:** Halüsinasyon ve dezenformasyon risklerinin değerlendirilmesi.
*   **Telif Hakkı ve Marka Riskleri:** Lisanslı materyallerin veya istenmeyen marka onaylarının kontrolü.
*   **Aşırı Yetki (Excessive Agency):** Modelin beklenmedik veya kontrol dışı aksiyonlar alması.

Araç ayrıca, özel kullanım durumunuza göre uyarlanmış **özel politika ihlallerine** de izin verir. Desteklenen tüm güvenlik açığı türlerinin tam listesi için resmi belgelere göz atabilirsiniz.

Sürecin sonunda, LLM uygulamanızın güvenlik açıklarını özetleyen bir rapor elde edilir.




Ayrıca, kırmızı takım (red team) çalışmalarındaki belirli hata vakalarını (failure cases) derinlemesine inceleyebilirsiniz:




### Ön Koşullar

Öncelikle, **Node.js 20+** sürümünü yükleyin.

Ardından, kırmızı takım (red team) ihtiyaçlarınız için yeni bir proje oluşturun:

```bash
npx promptfoo@latest redteam init my-redteam-project --no-gui
```
`init` komutu, kullanım durumunuza uygun bir kırmızı takım (red team) yapılandırması oluşturmanız için size rehberlik eder ve hızlıca başlamanızı sağlayacak birkaç yararlı varsayılan ayar içerir.

Bu komut, kurulumun çoğunu gerçekleştireceğimiz bir `promptfooconfig.yaml` yapılandırma dosyası oluşturacaktır.

### Başlarken

Test etmek istediğiniz istemi (prompt) ve LLM'yi ayarlamak için `my-redteam-project/promptfooconfig.yaml` dosyasını düzenleyin. Daha fazla bilgi için yapılandırma kılavuzuna bakabilirsiniz.

Değerlendirmeyi (eval) çalıştırın:

```bash
cd my-redteam-project
npx promptfoo@latest redteam run
```
bu komut, saldırgan test senaryolarını içeren bir redteam.yaml dosyası oluşturacak ve bunları uygulamanız üzerinden çalıştıracaktır.
Sonuçları görüntüleyin:
```bash
npx promptfoo@latest redteam report
```
### 1. Adım: İstemlerinizi (Prompts) Yapılandırın

Başlamanın en kolay yolu, `promptfooconfig.yaml` dosyasını istemlerinizi içerecek şekilde düzenlemektir.

Bu örnekte, bir gezi planlama uygulaması oluşturduğumuzu varsayalım. Bir istem belirleyeceğim ve kullanıcı girdileriyle değiştirilecek yer tutucuları belirtmek için `{{variables}}` (değişkenler) ekleyeceğim:

```yaml
prompts:
  - 'Bir seyahat acentesi olarak hareket et ve kullanıcının {{destination}} seyahatini planlamasına yardımcı ol. Nazik ve kısa cevaplar ver. Kullanıcı sorgusu: {{query}}'
```
# Ya bir "Prompt"unuz (İstem) Yoksa?

Bazı test uzmanları, doğrudan bir API uç noktasını (endpoint) veya web sitesini "redteam" (güvenlik testi) yapmayı tercih eder. Bu durumda, istemi (prompt) atlayıp aşağıdaki hedeflerinizi belirlemeye geçebilirsiniz.

## Sohbet Tarzı İstemler (Chat-style prompts)

Çoğu durumda isteminiz daha karmaşık olacaktır; bu tür durumlarda bir `prompt.json` dosyası oluşturabilirsiniz:

```json
[
  {
    "role": "system",
    "content": "Bir seyahat acentesi gibi davranın ve kullanıcının {{destination}} seyahatini planlamasına yardımcı olun. Nazik ve kısa cevaplar verin."
  },
  { 
    "role": "user", 
    "content": "{{query}}" 
  }
]
```
Ardından bu dosyayı promptfooconfig.yaml dosyasından referans gösterebilirsiniz:
```yaml
prompts:
  - file://prompt.json
```
## Dinamik Olarak Oluşturulan İstemler (Dynamically generated prompts)

Bazı uygulamalar, istemlerini değişkenlere bağlı olarak dinamik bir şekilde oluşturur. Örneğin, istemi kullanıcının varış noktasına göre belirlemek istediğimizi varsayalım:

```python
def get_prompt(context):
  if context['vars']['destination'] == 'Australia':
    return f"Bir seyahat acentesi gibi davran dostum: {{query}}"

  return f"Bir seyahat acentesi gibi davranın ve kullanıcının seyahatini planlamasına yardımcı olun. Nazik ve kısa olun. Kullanıcı sorgusu: {{query}}"
```
Bu istemi yapılandırma dosyanıza şu şekilde dahil edebiliriz:

```yaml
prompts:
  - file://rag_agent.py:get_prompt
```
Aynı şekilde Javascript karşılığı da desteklenmektedir:

```javascript
function getPrompt(context) {
  if (context.vars.destination === 'Australia') {
    return `Bir seyahat acentesi gibi davran dostum: ${context.query}`;
  }

  return `Bir seyahat acentesi gibi davranın ve kullanıcının seyahatini planlamasına yardımcı olun. Nazik ve kısa olun. Kullanıcı sorgusu: ${context.query}`;
}
```
## Adım 2: Hedeflerinizi Yapılandırın (Step 2: Configure your targets)

LLM'ler, `promptfooconfig.yaml` dosyasındaki `targets` özelliği ile yapılandırılır. Bir LLM hedefi; bilinen bir LLM API'si (OpenAI, Anthropic, Ollama vb.) veya kendi oluşturduğunuz özel bir RAG ya da ajan akışı olabilir.

### LLM API'leri
Promptfoo; OpenAI, Anthropic, Mistral, Azure, Groq, Perplexity, Cohere ve daha fazlası dahil olmak üzere birçok LLM sağlayıcısını destekler. Çoğu durumda yapmanız gereken tek şey, uygun API anahtarı çevre değişkenini (environment variable) ayarlamaktır.

En az bir hedef seçmelisiniz. İsterseniz, "red team" değerlendirmesindeki performanslarını karşılaştırmak için birden fazla hedef belirleyebilirsiniz. Bu örnekte GPT, Claude ve Llama performanslarını karşılılaştırıyoruz:

```yaml
targets:
  - openai:gpt-5
  - anthropic:claude-sonnet-4-6
  - ollama:chat:llama4:scout
```
Daha fazla bilgi edinmek için tercih ettiğiniz **LLM sağlayıcısını** buradan bulabilirsiniz.

### Özel Akışlar (Custom flows)

Eğer özel bir RAG veya ajan akışınız varsa, bunları projenize şu şekilde dahil edebilirsiniz:

```yaml
targets:
  # JS ve Python yerel olarak desteklenir
  - file://path/to/js_agent.js
  - file://path/to/python_agent.py
  # Herhangi bir yürütülebilir dosya `exec:` direktifi ile çalıştırılabilir
  - exec:/path/to/shell_agent
  # HTTP istekleri `webhook:` direktifi ile yapılabilir
  - webhook:http://localhost:8000/api/agent
```
Daha fazlasını öğrenmek için şunlara göz atabilirsiniz:

* **Javascript sağlayıcısı** (Javascript provider)
* **Python sağlayıcısı** (Python provider)
* **Exec sağlayıcısı** (Herhangi bir programlama dilindeki yürütülebilir dosyayı çalıştırmak için kullanılır)
* **Webhook sağlayıcısı** (HTTP istekleri; çevrimiçi veya yerel olarak çalışan bir uygulamayı test etmek için kullanışlıdır)

### HTTP Uç Noktaları (HTTP endpoints)

Canlı bir API uç noktasına sızma testi (pentest) yapmak için sağlayıcı kimliğini (provider id) bir URL olarak ayarlayın. Bu, uç noktaya bir HTTP isteği gönderecektir. LLM veya ajan çıktısının HTTP yanıtı (response) içerisinde olması beklenir.

```yaml
targets:
  - id: 'https://example.com/generate'
    config:
      method: 'POST'
      headers:
        'Content-Type': 'application/json'
      body:
        my_prompt: '{{prompt}}'
      transformResponse: 'json.path[0].to.output'
```
Sızma testi (pentest) sırasında nihai istemle değiştirilecek olan `{{prompt}}` yer tutucu değişkenini kullanarak HTTP isteğini özelleştirin.

Eğer API'niz bir JSON nesnesiyle yanıt veriyorsa ve siz belirli bir değeri seçmek istiyorsanız, sağlanan JSON nesnesini işleyen bir Javascript parçacığı ayarlamak için `transformResponse` anahtarını kullanın.

Örneğin, `json.nested.output` ifadesi aşağıdaki API yanıtındaki çıktıya referans verecektir:

```json
{ 
  "nested": { 
    "output": "..." 
  } 
}
```
Ayrıca iç içe geçmiş nesnelere de atıfta bulunabilirsiniz. Örneğin, json.choices[0].message.content ifadesi, standart bir OpenAI sohbet yanıtındaki oluşturulan metne referans verir.

Bu **JSON yolları** veya **Javascript parçacıkları** için başka bir örnek eklememi ister misin?
### Değerlendiricinin Yapılandırılması (Configuring the grader)

Red team sonuçları bir model tarafından derecelendirilir. Varsayılan olarak `gpt-5` kullanılır ve test, bir `OPENAI_API_KEY` çevre değişkeni tanımlanmış olmasını bekler.

`defaultTest` için bir sağlayıcı geçersiz kılma (provider override) ekleyerek değerlendiriciyi değiştirebilirsiniz; bu işlem tüm test durumlarına uygulanacaktır. İşte yerel olarak bir derecelendirici olarak Llama3'ü kullanmaya dair bir örnek:

```yaml
defaultTest:
  options:
    provider: 'ollama:chat:llama4:scout'
```
Bu örnekte ise değerlendirici (grader) olarak Azure OpenAI kullanıyoruz:

```yaml
defaultTest:
  options:
    provider:
      id: azureopenai:chat:gpt-4-deployment-name
      config:
        apiHost: 'xxxxxxx.openai.azure.com'
```
Daha fazla bilgi için **LLM Değerlendiricisini Geçersiz Kılma (Overriding the LLM grader)** bölümüne bakabilirsiniz.

## Adım 3: Saldırgan Test Durumları Oluşturun (Step 3: Generate adversarial test cases)

Her şeyi yapılandırdığınıza göre, bir sonraki adım "red team" girdilerini (inputs) oluşturmaktır. Bu işlem `promptfoo redteam generate` komutu çalıştırılarak yapılır:

```bash
npx promptfoo@latest redteam generate
```
Bu komut, istemlerinizi ve hedeflerinizi okuyarak çalışır; ardından istemlerinizi/modellerinizi çeşitli durumlarda stres testine tabi tutan bir dizi saldırgan girdi (adversarial inputs) oluşturur. Test oluşturma işlemi genellikle yaklaşık 5 dakika sürer.

Saldırgan testler şunları içerir:

*   **Prompt Enjeksiyonu** (OWASP LLM01)
*   **Jailbreaking** (Sınırları aşma/Hacking - OWASP LLM01)
*   **Aşırı Yetkilendirme** (Excessive Agency - OWASP LLM08)
*   **Aşırı Güven** (Overreliance - OWASP LLM09)
*   **Halüsinasyon** (LLM'nin gerçek dışı cevaplar vermesi)
*   **Ele geçirme / Hijacking** (LLM'nin amaç dışı kullanılması)
*   **PII Sızıntıları** (Modelin yanlışlıkla kişisel verileri ifşa etmemesinin sağlanması)
*   **Rakip Tavsiyeleri** (LLM'nin işletmenize alternatifler önermesi)
*   **İstenmeyen Sözleşmeler** (LLM'nin istenmeyen taahhütlerde veya anlaşmalarda bulunması)
*   **Siyasi Beyanlar**
*   **Bir kişi, marka veya kuruluşun taklit edilmesi**

Ayrıca, ML Commons Safety Working Group ve HarmBench çerçevesinden çeşitli zararlı girdi ve çıktı senaryolarını da test eder:

[Zararlı kategorileri görüntüleyin]

Varsayılan olarak, yukarıdakilerin tümü "redteam" kapsamına dahil edilecektir. Belirli test türlerini kullanmak için `--plugins` parametresini kullanın:
```bash
npx promptfoo@latest redteam generate --plugins 'harmful,jailbreak,hijacking'
```
Aşağıdaki eklentiler (plugins) varsayılan olarak etkindir:


| Eklenti Adı | Açıklama |
| :--- | :--- |
| **contracts** | Modelin istenmeyen taahhütlerde veya anlaşmalarda bulunup bulunmadığını test eder. |
| **excessive-agency** | Modelin çok fazla özerklik sergileyip sergilemediğini veya kendi başına kararlar alıp almadığını test eder. |
| **hallucination** | Modelin yanlış veya yanıltıcı içerik oluşturup oluşturmadığını test eder. |
| **harmful** | Zararlı veya saldırgan içerik oluşturulup oluşturulmadığını test eder. |
| **imitation** | Modelin bir kişiyi, markayı veya kuruluşu taklit edip etmediğini test eder. |
| **hijacking** | Modelin amaç dışı görevler için kullanılmaya karşı savunmasızlığını test eder. |
| **jailbreak** | Modelin güvenlik mekanizmalarını devre dışı bırakacak şekilde manipüle edilip edilemediğini test eder. |
| **overreliance** | Denetim olmaksızın LLM çıktılarına aşırı güvenilip güvenilmediğini test eder. |
| **pii** | Kişisel verilerin (PII) yanlışlıkla ifşa edilip edilmediğini test eder. |
| **politics** | Siyasi görüşleri ve siyasi figürler hakkındaki beyanları test eder. |
| **prompt-injection** | Modelin "prompt injection" (istem enjeksiyonu) saldırılarına karşı duyarlılığını test eder. |
Aşağıdaki ek eklentiler isteğe bağlı olarak etkinleştirilebilir:


| Eklenti Adı | Açıklama |
| :--- | :--- |
| **competitors** | Modelin hizmetinize alternatifler önerip önermediğini test eder. |

Saldırgan test durumları (adversarial test cases) `promptfooconfig.yaml` dosyasına yazılacaktır.
## Adım 4: Sızma Testini Çalıştırın (Step 4: Run the pentest)

Artık tüm "red team" testleri hazır olduğuna göre, değerlendirmeyi (eval) başlatın:

```bash
npx promptfoo@latest redteam eval
```
Bu işlem, seçtiğiniz eklenti sayısına bağlı olarak genellikle yaklaşık 15 dakika kadar sürecektir.

## Adım 5: Sonuçları İnceleyin (Step 5: Review results)

Bayraklı (işaretlenmiş) çıktıları incelemek ve başarısız durumları anlamak için web görüntüleyiciyi kullanın:

```bash
npx promptfoo@latest view
```
Bu komut, "red team" test sonuçlarını görüntüleyen ve belirli zafiyetlerin (vulnerabilities) derinliklerine inmenize olanak tanıyan bir ekran açacaktır:





Zafiyetleri özetleyen bir rapor görünümünü açmak için **"Vulnerability Report"** (Zafiyet Raporu) butonuna tıklayın:

