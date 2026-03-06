---
sidebar_position: 60
description: Bellek optimizasyonu, API yapılandırması, Node.js hataları, yerel derlemeler ve ağ/proxy yapılandırması ile promptfoo sorunlarını giderin ve çözün
---

# Sorun Giderme

## Günlük Dosyaları ve Hata Ayıklama

Belirli sorunları gidermeden önce, sorunları teşhis etmeye yardımcı olmak için ayrıntılı günlüklere erişebilirsiniz:

- **Günlükleri doğrudan görüntüleyin**: Günlük dosyaları varsayılan olarak yapılandırma dizininizde `~/.promptfoo/logs` içinde saklanır
- **Özel günlük dizini**: Günlükleri farklı bir dizine yazmak için `PROMPTFOO_LOG_DIR` ortam değişkenini ayarlayın (ör. `PROMPTFOO_LOG_DIR=./logs promptfoo eval`)
- **Günlükleri paylaşmak için dışa aktarın**: Hata ayıklama veya destek için günlük dosyalarınızın sıkıştırılmış bir arşivini oluşturmak üzere `promptfoo export logs` komutunu kullanın

### Canlı Hata Ayıklama Geçişi

`promptfoo redteam run` sırasında, yeniden başlatmaya gerek kalmadan gerçek zamanlı olarak hata ayıklama günlüklerini açıp kapatabilirsiniz:

- **`v` tuşuna** herhangi bir zamanda basarak ayrıntılı/hata ayıklama çıktısını geçiş yapın
- Bu yalnızca etkileşimli terminal modunda çalışır (CI'da veya çıktının yönlendirildiği durumlarda değil)
- Bir tarama sırasında sorunları incelerken veya belirli bir test durumunda neler olup bittiğini anlamak istediğinizde yararlıdır

Bir taramaya başladığınızda şunu görürsünüz:

```
  Tip: Hata ayıklama çıktısını geçiş için v tuşuna basın
```

`v` tuşuna basarak ayrıntılı günlükleri etkinleştirin ve API isteklerini, sağlayıcı yanıtlarını ve derecelendirme sonuçlarını görün. Tekrar `v` tuşuna basarak temiz çıktıya geri dönün.

:::tip
Bir tarama takılı kaldıysa veya belirli bir test durumu ile neler olup bittiğini anlamak istiyorsanız bu özellikle faydalıdır.
:::

## Bellek yetersizliği hatası

Çok sayıda testiniz varsa veya testleriniz büyük çıktılar üretiyorsa, bellek yetersizliği hatası alabilirsiniz. Bunu yönetmenin birkaç yolu vardır:

### Temel yapılandırma

**Tüm** bu adımları izleyin:

1. `--no-write` bayrağını kullanmayın. Bellek sorunlarını önlemek için diske yazmamız gerekiyor.
2. `--no-table` bayrağını kullanın.
3. **JSONL formatını kullanın**: `--output results.jsonl`

:::tip
JSONL formatı sonuçları partiler halinde işler ve büyük veri setlerinde JSON dışa aktarmasının başarısız olmasına neden olan bellek sınırlarından kaçınır.
:::

### Hassas bellek optimizasyonu

Sonuçlardan ağır verileri seçici olarak çıkarmak için aşağıdaki ortam değişkenlerini kullanabilirsiniz:

```bash
# İstem metnini çıkart (istençleriniz büyük miktarda metin veya resim içeriyorsa kullanışlıdır)
export PROMPTFOO_STRIP_PROMPT_TEXT=true

# Model çıktılarının çıkartılması (modeliniz büyük yanıtlar üretiyorsa kullanışlıdır)
export PROMPTFOO_STRIP_RESPONSE_OUTPUT=true

# Test değişkenlerini çıkart (test durumlarınız büyük veri setleri içeriyorsa kullanışlıdır)
export PROMPTFOO_STRIP_TEST_VARS=true

# Derecelendirme sonuçlarını çıkart (model derecelendirmeli iddialar kullanıyorsanız kullanışlıdır)
export PROMPTFOO_STRIP_GRADING_RESULT=true

# Meta veriyi çıkart (büyük miktarda özel meta veri saklıyorsanız kullanışlıdır)
export PROMPTFOO_STRIP_METADATA=true
```

İhtiyacınız olan verileri korurken bellek kullanımını optimize etmek için bu değişkenlerin herhangi bir kombinasyonunu kullanabilirsiniz.

### Node.js bellek sınırını artırma

Yukarıdaki seçeneklerden sonra hala bellek sorunları yaşıyorsanız, promptfoo'nun kullanabileceği bellek miktarını `NODE_OPTIONS` ortam değişkenini ayarlayarak artırabilirsiniz:

```bash
# 8192 MB 8 GB'dir. Makineniz için uygun bir değere ayarlayın.
NODE_OPTIONS="--max-old-space-size=8192" npx promptfoo eval
```

## Nesne şablonu işlemleri

Şablonlarda karmaşık veri yapılarıyla çalışırken, nesnelerin çıktılarda veya derecelendirme sonuçlarında nasıl görüntülendiği veya erişildiği konusunda sorunlarla karşılaşabilirsiniz.

### `[object Object]` görünmesi

LLM çıktılarınızda veya derecelendirme sonuçlarında `[object Object]` görürseniz, bu JavaScript nesnelerinin uygun seri hale getirme olmadan stringe çevrildiği anlamına gelir. Varsayılan olarak promptfoo bu sorunu önlemek için nesneleri otomatik olarak string hale getirir.

**Örnek sorun:**

```yaml
prompts:
  - 'Product: {{product}}'
tests:
  - vars:
      product:
        name: 'Headphones'
        price: 99.99
# Sonuç: çıktılarda "Product: [object Object]" 
```

**Varsayılan çözüm:** Nesneler otomatik olarak JSON dizelerine dönüştürülür:

```text
Product: {"name":"Headphones","price":99.99}
```

### Şablonlarda nesne özelliklerine erişme

Şablonlarınızda nesnelerin belirli özelliklerine (ör. `{{ product.name }}`) erişmeniz gerekiyorsa, doğrudan nesne erişimini etkinleştirebilirsiniz:

```bash
export PROMPTFOO_DISABLE_OBJECT_STRINGIFY=true
promptfoo eval
```

Bu ayar etkinleştirildiğinde şablonlarda nesne özelliklerine erişebilirsiniz:

```yaml
prompts:
  - 'Product: {{ product.name }} costs ${{ product.price }}'
# Sonuç: "Product: Headphones costs $99.99"
```

### Hangi yaklaşımı ne zaman kullanmalı

**Varsayılan davranışı (stringleştirilmiş nesneler) şu durumlarda kullanın:**

- Nesneleri istemlerinizde JSON dizeleri olarak istiyorsunuz
- JSON dizeleri bekleyen mevcut şablonlarla çalışıyorsunuz
- Maksimum uyumluluk istiyor ve `[object Object]` görmek istemiyorsunuz

**Nesne özellik erişimi (`PROMPTFOO_DISABLE_OBJECT_STRINGIFY=true`) şu durumlarda kullanın:**

- `{{ product.name }}` gibi belirli özelliklere erişmeniz gerekiyorsa
- Nesne gezinimi için tasarlanmış yeni şablonlar oluşturuyorsunuz
- Karmaşık iç içe veri yapılarıyla çalışıyorsunuz

## Node.js sürüm uyuşmazlığı hatası

`npx promptfoo@latest` çalıştırırken şu hatayla karşılaşabilirsiniz:

```text
Error: The module '/path/to/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 115. This version of Node.js requires
NODE_MODULE_VERSION 127. Please try re-compiling or re-installing
 the module (for instance, using `npm rebuild` or `npm install`).
```

Bu hata, promptfoo'nun kullandığı native kod modüllerinin (better-sqlite3 gibi) Node.js sürümünüz için özel olarak derlenmesi gerektiği için oluşur.

### Çözüm: npx önbelleğini kaldırın ve yeniden yükleyin

Bu sorunu düzeltmek için bu tek komutu çalıştırın:

```bash
rm -rf ~/.npm/_npx && npx -y promptfoo@latest
```

Bu, npx önbellek dizinindeki tüm npm paketlerini kaldırır ve promptfoo'nun güncel sürümünün yeniden indirilmesini ve yüklenmesini sağlar; böylece native modüller mevcut Node.js sürümünüz için doğru şekilde derlenir.

## Yerel derleme hataları

[better-sqlite3](https://github.com/WiseLibs/better-sqlite3) gibi bazı bağımlılıklar yerel olarak derlenmesi gereken native kod içerir. Makinenizde bir C/C++ derleme araç zinciri olduğundan emin olun:

- **Ubuntu/Debian**: `sudo apt-get install build-essential`
- **macOS**: `xcode-select --install`
- **Windows**: [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

Önceden derlenmiş ikili dosyalar başarısız olursa yerel derleme zorlayın:

```bash
npm install --build-from-source
# veya
npm rebuild
```

## Ağ ve proxy sorunları

Kurumsal bir proxy veya güvenlik duvarının arkasındaysanız ve LLM API'larına bağlanırken sorun yaşıyorsanız:

### Proxy ayarlarını yapılandırma

promptfoo'yu çalıştırmadan önce standart proxy ortam değişkenlerini ayarlayın:

```bash
# HTTPS istekleri için proxy ayarlayın (en yaygın)
export HTTPS_PROXY=http://proxy.company.com:8080

# Gerekirse kimlik doğrulama ile
export HTTPS_PROXY=http://username:password@proxy.company.com:8080

# Belirli ana makineleri proxy dışında tutun
export NO_PROXY=localhost,127.0.0.1,internal.domain.com
```

### Özel CA sertifikaları

Özel sertifika otoriteleri olan ortamlarda:

```bash
export PROMPTFOO_CA_CERT_PATH=/path/to/ca-bundle.crt
```

### Yapılandırmanızı doğrulayın

Algılanan proxy ayarlarını görmek ve ağ yapılandırmanızın doğru olduğunu doğrulamak için `promptfoo debug` çalıştırın.

Tam proxy ve SSL yapılandırma ayrıntıları için [SSS](/docs/faq/#how-do-i-configure-promptfoo-for-corporate-networks-or-proxies) bölümüne bakın.

## OpenAI API anahtarı ayarlı değil

OpenAI kullanıyorsanız, `OPENAI_API_KEY` ortam değişkenini ayarlayın veya sağlayıcı yapılandırmasına `apiKey` ekleyin.

OpenAI kullanmıyorsanız ancak bu mesajı almaya devam ediyorsanız, muhtemelen `llm-rubric` veya `similar` gibi [model-derecelendirmeli bir metrik](/docs/configuration/expected-outputs/model-graded/) kullanıyorsunuzdur ve derecelendiriciyi [geçersiz kılmanız](/docs/configuration/expected-outputs/model-graded/#overriding-the-llm-grader) gerekir.

Örneğin derecelendiriciyi `defaultTest` özelliğini kullanarak geçersiz kılma talimatlarını izleyin:

```yaml
defaultTest:
  options:
    provider:
      text:
        id: azureopenai:chat:gpt-4o-deployment
        config:
          apiHost: xxx.openai.azure.com
      embedding:
        id: azureopenai:embeddings:text-embedding-ada-002-deployment
        config:
          apiHost: xxx.openai.azure.com
```

## Python/JavaScript araç dosyaları fonksiyon adı gerektirir

Python veya JavaScript dosyalarından araçları yüklerken `Python files require a function name` gibi hatalar görürseniz, araç tanımlarını döndüren fonksiyon adını belirtmeniz gerekir.

### Çözüm

Python ve JavaScript araç dosyaları `file://path:function_name` formatını kullanarak bir fonksiyon adı belirtmelidir:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:chat:gpt-4.1-mini
    config:
      # Correct - specifies function name
      tools: file://./tools.py:get_tools
      # or for JavaScript/TypeScript
      tools: file://./tools.js:getTools
```

Fonksiyon senkron veya asenkron olabilir; araç tanımları dizisi döndürmelidir:

```python title="tools.py"
def get_tools():
    return [
        {
            "type": "function",
            "function": {
                "name": "get_current_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        }
                    },
                    "required": ["location"]
                }
            }
        }
    ]
```

```javascript title="tools.js"
function getTools() {
  return [
    {
      type: 'function',
      function: {
        name: 'get_current_weather',
        description: 'Get the current weather in a given location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA',
            },
          },
          required: ['location'],
        },
      },
    },
  ];
}

module.exports = { getTools };
```


## Takılan değerlendirmeleri nasıl sınıflandırabilirsiniz

Değerlendirmeleri çalıştırırken, özellikle yerel sağlayıcılar kullanıyorsanız veya birçok eşzamanlı isteği yürütüyorsanız zaman aşımı hataları ile karşılaşabilirsiniz. İşte bunları nasıl düzelteceğiniz:

**Yaygın kullanım durumları:**

- Değerlendirmelerin bir zaman sınırı içinde tamamlanmasını sağlamak (CI/CD için kullanışlıdır)
- Takılan özel sağlayıcıları veya sağlayıcıları ele almak
- Uzun süre çalışan değerlendirmelerin yol açtığı maliyet artışlarını önlemek

Bireysel test vakaları için zaman aşımı ve tüm değerlendirme için zaman aşımı olmak üzere iki ayarı kontrol edebilirsiniz.

### Hızlı düzeltmeler

**Bireysel istekler ve toplam değerlendirme süresi için zaman aşımı ayarlayın:**

```bash
export PROMPTFOO_EVAL_TIMEOUT_MS=30000  # her istek için 30 saniye
export PROMPTFOO_MAX_EVAL_TIME_MS=300000  # 5 dakika toplam limit

npx promptfoo eval
```

Bu değerleri aynı zamanda `.env` dosyanıza veya Promptfoo yapılandırma dosyanıza da ekleyebilirsiniz:

```yaml title="promptfooconfig.yaml"
env:
  PROMPTFOO_EVAL_TIMEOUT_MS: 30000
  PROMPTFOO_MAX_EVAL_TIME_MS: 300000
```

## Python Hata Ayıklaması

Özel Python sağlayıcıları, istemler, kancalar, iddialar vb. kullanırken, Python kodunuzu ayıklamanız gerekebilir. İşte sorun gidermede size yardımcı olacak bazı ipuçları:

### Python çıktısını görüntüleme

Python komut dosyanızdan çıktıyı görmek için, print deyimleri de dahil olmak üzere, değerlendirmeyi çalıştırırken `LOG_LEVEL` ortam değişkenini `debug` olarak ayarlayın:

```bash
LOG_LEVEL=debug npx promptfoo eval
```

Alternatif olarak, `--verbose` bayrağını kullanabilirsiniz:

```bash
npx promptfoo eval --verbose
```

### Python ayıklayıcısını (pdb) kullanma

Promptfoo artık pdb ile yerel Python hata ayıklamasını desteklemektedir. Bunu etkinleştirmek için:

```bash
export PROMPTFOO_PYTHON_DEBUG_ENABLED=true
```

Ardından Python kodunuzda kesme noktaları ekleyin:

```python
import pdb

def call_api(prompt, options, context):
    pdb.set_trace()  # Hata ayıklayıcı burada duracak
    # Kodunuz...
```

### Python Kurulumu ve Yol Sorunları

`spawn py -3 ENOENT` veya `Python 3 bulunamadı` gibi hatalarla karşılaşırsanız, promptfoo Python kurulumunuzu bulamıyor. Bunu çözmek için aşağıdaki adımları izleyin:

#### Özel Python Yolu Ayarlama

Python yürütülebilir dosyasını belirtmek için `PROMPTFOO_PYTHON` ortam değişkenini kullanın:

```bash
# Windows (Özel bir konumda Python kuruluysa)
export PROMPTFOO_PYTHON=C:\Python\3_11\python.exe

# macOS/Linux
export PROMPTFOO_PYTHON=/usr/local/bin/python3

# Ardından değerlendirmeyi çalıştırın
npx promptfoo eval
```

#### Sağlayıcıya Özel Python Yapılandırması

Ayrıca yapılandırmanızda belirli sağlayıcılar için Python yolunu ayarlayabilirsiniz:

```yaml
providers:
  - id: 'file://my_provider.py'
    config:
      pythonExecutable: /path/to/specific/python
```

#### Windows Özel Sorunları

Windows'ta promptfoo Python'u aşağıdaki sırayla tespit etmeye çalışır:

1. `PROMPTFOO_PYTHON` ortam değişkeni (ayarlıysa)
2. Sağlayıcıya özel `pythonExecutable` yapılandırması (ayarlıysa)
3. **Windows akıllı algılama**: `where python` komutunu kullanır ve Microsoft Mağazası başlatıcılarını filtreler
4. `python -c "import sys; print(sys.executable)"` (gerçek Python yolunu almak için)
5. Yaygın yedek komutlar: `python`, `python3`, `py -3`, `py`

Python başlatıcısı (`py.exe`) yüklü değilse ancak Python doğrudan yüklüyse, komut satırında `python` komutunun çalıştığından emin olun. Değilse ya:

- Python kurulum dizininizi PATH'e ekleyin
- Ya da `PROMPTFOO_PYTHON`'u `python.exe`'nizin tam yoluna ayarlayın

**Yaygın Windows Python Konumları:**

- Microsoft Mağazası: `%USERPROFILE%\AppData\Local\Microsoft\WindowsApps\python.exe`
- Doğrudan yükleyici: `C:\Python3X\python.exe` (X sürüm numarasıdır)
- Anaconda: `C:\Users\YourName\anaconda3\python.exe`

#### Python Yapılandırmanızı Test Etme

Python'unuzun doğru yapılandırıldığını doğrulamak için:

```bash
# Promptfoo'nun Python'unuzu bulabildiğini test edin
python -c "import sys; print(sys.executable)"

# Bu işe yarıyor ama promptfoo hala sorun yaşarsa, PROMPTFOO_PYTHON'u ayarlayın:
export PROMPTFOO_PYTHON=$(python -c "import sys; print(sys.executable)")
```

### Hataları Ele Alma

Python komut dosyanızda hatalarla karşılaşırsanız, hata mesajı ve istif izleri promptfoo çıktısında görüntülenecektir. Kodunuzda neler yanlış olabileceğine dair ipuçları için bu bilgilere bakın.

Promptfoo Python komut dosyanızı ayrı bir işlemde çalıştırdığı için, bazı standart hata ayıklama teknikleri beklendiği gibi çalışmayabilir. Yukarıda açıklandığı gibi günlüğü ve uzaktan hata ayıklamayı kullanmak, Python sağlayıcılarında sorunları gidermek için en güvenilir yollardır.

## Veritabanını Hata Ayıklama

1. Ortam değişkenlerini ayarlayın:

   ```bash
   export PROMPTFOO_ENABLE_DATABASE_LOGS=true
   export LOG_LEVEL=debug
   ```

2. Komutunuzu çalıştırın:

   ```bash
   npx promptfoo eval
   ```

3. İşlem bittiğinde günlüğü devre dışı bırakın:

   ```bash
   unset PROMPTFOO_ENABLE_DATABASE_LOGS
   ```

## Günlük Dosyalarını Bulma

Promptfoo günlüklerini `~/.promptfoo/logs` klasöründe depolar. PROMPTFOO_LOG_DIR ortam değişkenini kullanarak bunu değiştirebilirsiniz.

Her çalıştırma için bir hata günlüğü ve bir hata ayıklama günlüğü oluşturulur.