---
sidebar_position: 60
description: Bellek optimizasyonu, API yapılandırması, Node.js hataları, yerel derlemeler ve ağ/proxy kurulumu için ortak promptfoo sorunlarını ayıklayın ve çözün
---

# Sorun Giderme

## Günlük Dosyaları ve Hata Ayıklama

Belirli sorunları gidermeden önce, sorunları teşhis etmeye yardımcı olmak için ayrıntılı günlüklere erişebilirsiniz:

- **Günlükleri doğrudan görüntüle**: Günlük dosyaları yapılandırma dizininizde `~/.promptfoo/logs` konumunda varsayılan olarak depolanır
- **Özel günlük dizini**: Günlükleri farklı bir dizine yazmak için `PROMPTFOO_LOG_DIR` ortam değişkenini ayarlayın (örn. `PROMPTFOO_LOG_DIR=./logs promptfoo eval`)
- **Günlükleri paylaşım için dışarı aktarma**: Hata ayıklama veya destek için günlük dosyalarınızın sıkıştırılmış arşivini oluşturmak için `promptfoo export logs` kullanın

### Canlı Hata Ayıklama Geçişi

`promptfoo redteam run` sırasında, yeniden başlatmadan hata ayıklama günlüğünü gerçek zamanlı olarak açıp kapatabilirsiniz:

- **`v` basın** istediğiniz zaman ayrıntılı/hata ayıklama çıktısını değiştirmek için
- Yalnızca etkileşimli terminal modunda çalışır (CI'da veya çıktı boru hattıyla verildiğinde değil)
- Günlük çıktıyı fazla yüklemeden sorunları araştırmak için yararlı

Bir tarama başlattığınızda şunu göreceksiniz:

```
  İpucu: Hata ayıklama çıktısını değiştirmek için v tuşuna basın
```

Ayrıntılı API isteklerini, sağlayıcı yanıtlarını ve notlandırma sonuçlarını görmek için hata ayıklama günlüklerini etkinleştirmek üzere `v` tuşuna basın. Temiz çıktıya dönmek için `v` tuşuna tekrar basın.

:::tip
Bu, bir taramanın takılmış görünmesi veya belirli bir test durumunda neler olup bittiğini anlamak istediğinizde özellikle yararlıdır.
:::

## Bellek dışı hata

Birçok test veya testleriniz büyük çıktılara sahipse, bellek dışı hata ile karşılaşabilirsiniz. Bunu ele almanın birkaç yolu vardır:

### Temel kurulum

Aşağıdaki adımların **tümünü** izleyin:

1. `--no-write` bayrağını kullanmayın. Bellek sorunlarından kaçınmak için diske yazmamız gerekir.
2. `--no-table` bayrağını kullanın.
3. **JSONL biçimini kullanın**: `--output results.jsonl`

:::tip
JSONL biçimi, sonuçları toplu olarak işler ve büyük veri kümeleri için JSON dışarı aktarmayı başarısız kılan bellek sınırlarından kaçınır.
:::

### Granüler bellek optimizasyonu

Ortam değişkenlerini kullanarak sonuçlardan seçici olarak ağır verileri çıkarabilirsiniz:

```bash
# İstem metnini çıkart (isteminiz büyük miktarda metin veya resim içeriyorsa yararlı)
export PROMPTFOO_STRIP_PROMPT_TEXT=true

# Model çıktılarını çıkart (modeliniz büyük yanıtlar üretiyorsa yararlı)
export PROMPTFOO_STRIP_RESPONSE_OUTPUT=true

# Test değişkenlerini çıkart (test durumlarınız büyük veri kümeleri içeriyorsa yararlı)
export PROMPTFOO_STRIP_TEST_VARS=true

# Notlandırma sonuçlarını çıkart (model tarafından notlandırılmış iddiaları kullanıyorsanız yararlı)
export PROMPTFOO_STRIP_GRADING_RESULT=true

# Meta verilerini çıkart (büyük miktarda özel meta veri depoluyorsanız yararlı)
export PROMPTFOO_STRIP_METADATA=true
```

İhtiyacınız olan verileri korurken bellek kullanımını optimize etmek için bu değişkenlerin herhangi bir kombinasyonunu kullanabilirsiniz.

### Node.js bellek sınırını artır

Yukarıdaki seçenekleri denedikten sonra hala bellek sorunlarıyla karşılaşıyorsanız, `NODE_OPTIONS` ortam değişkenini ayarlayarak promptfoo'ya sunulan hafızanın miktarını artırabilirsiniz:

```bash
# 8192 MB, 8 GB'dir. Bunu makineniz için uygun bir değere ayarlayın.
NODE_OPTIONS="--max-old-space-size=8192" npx promptfoo eval
```

## Object template handling

When working with complex data structures in templates, you might encounter issues with how objects are displayed or accessed in your prompts and grading rubrics.

### `[object Object]` appears in outputs

If you see `[object Object]` in your LLM outputs or grading results, this means JavaScript objects are being converted to their string representation without proper serialization. By default, promptfoo automatically stringifies objects to prevent this issue.

**Example problem:**

```yaml
prompts:
  - 'Product: {{product}}'
tests:
  - vars:
      product:
        name: 'Headphones'
        price: 99.99
# Results in: "Product: [object Object]" in outputs
```

**Default solution:** Objects are automatically converted to JSON strings:

```text
Product: {"name":"Headphones","price":99.99}
```

### Accessing object properties in templates

If you need to access specific properties of objects in your templates (like `{{ product.name }}`), you can enable direct object access:

```bash
export PROMPTFOO_DISABLE_OBJECT_STRINGIFY=true
promptfoo eval
```

With this setting enabled, you can use object property access in templates:

```yaml
prompts:
  - 'Product: {{ product.name }} costs ${{ product.price }}'
# Results in: "Product: Headphones costs $99.99"
```

### When to use each approach

**Use default behavior (stringified objects) when:**

- You want objects as JSON strings in your prompts
- Working with existing templates that expect JSON strings
- You need maximum compatibility and don't want to see `[object Object]`

**Use object property access (`PROMPTFOO_DISABLE_OBJECT_STRINGIFY=true`) when:**

- You need to access specific properties like `{{ product.name }}`
- Building new templates designed for object navigation
- Working with complex nested data structures

## Node.js sürümü uyumsuzluğu hatası

`npx promptfoo@latest` çalıştırırken, bu hatayı alabilirsiniz:

```text
Error: The module '/path/to/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 115. This version of Node.js requires
NODE_MODULE_VERSION 127. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
```

Bu, promptfoo'nun Node.js sürümünüz için özel olarak derlenmelesi gereken yerel kod modülleri (better-sqlite3 gibi) kullandığı için olur.

### Çözüm: npx önbelleğini kaldırın ve yeniden yükle

Bu sorunu çözmek için bu tek komutu çalıştırın:

```bash
rm -rf ~/.npm/_npx && npx -y promptfoo@latest
```

Bu, npx önbelleği dizininde önbelleklenen npm paketlerini kaldırır ve promptfoo'nun taze bir ünden indirilmesini ve kurulumunu zorlayarak yerel modülerin mevcut Node.js sürümünüz için doğru şekilde derlenmesini sağlar.

## Yerel derleme hatalari

[better-sqlite3](https://github.com/WiseLibs/better-sqlite3) gibi bazı bağımlılıklar yerel olarak derlenmesi gereken yerel kod içerir. Makinenizin bir C/C++ derleme araçları zincirine sahip olduğundan emin olun:

- **Ubuntu/Debian**: `sudo apt-get install build-essential`
- **macOS**: `xcode-select --install`
- **Windows**: [Visual Studio Derleme Araçları](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

Önceden derlenmiş ikililer başarısız olursa, yerel bir derlemeyi zorlayın:

```bash
npm install --build-from-source
# veya
npm rebuild
```

## Ağ ve proxy sorunları

Kurumsal bir proxy veya güvenleme duvarının arkasındaysanız ve LLM API'lerine bağlanmada sorun yaşıyorsanız:

### Proxy ayarlarını yapılandır

Prompfoo çalıştırmadan önce standart proxy ortam değişkenlerini ayarlayın:

```bash
# HTTPS istekleri için proxy'yi ayarla (çoğu yaygın)
export HTTPS_PROXY=http://proxy.company.com:8080

# Gerekirse kimlik doğrulama ile
export HTTPS_PROXY=http://username:password@proxy.company.com:8080

# Belirli sunucuları proxy'den dışı tut
export NO_PROXY=localhost,127.0.0.1,internal.domain.com
```

### Özel CA sertifikaları

Özel sertifika yetkililerine sahip ortamlar için:

```bash
export PROMPTFOO_CA_CERT_PATH=/path/to/ca-bundle.crt
```

### Yapılandırmanızı doğrulayın

Algılanan proxy ayarlarını görmek ve ağ yapılandırmanızın doğru olduğunu doğrulamak için `promptfoo debug` çalıştırın.

Tamamen proxy ve SSL yapılandırması ayrıntıları için [SSS](/docs/faq/#how-do-i-configure-promptfoo-for-corporate-networks-or-proxies)'e bakın.

## OpenAI API anahtarı ayarlanmadı

OpenAI kullanıyorsanız, `OPENAI_API_KEY` ortam değişkenini ayarlayın veya sağlayıcı yapılandırmasına `apiKey` ekleyin.

OpenAI kullanmıyorsanız ancak yine de bu mesajı alıyorsanız, muhtemelen [model tarafından notlandırılan metrik](/docs/configuration/expected-outputs/model-graded/) gibi `llm-rubric` veya `similar` gibi bir metrik var, bu da [notlandıranı geçersiz kılmanızı](/docs/configuration/expected-outputs/model-graded/#overriding-the-llm-grader) gerektirir.

Notlandıranı geçersiz kılmak için talimatları izleyin, örneğin `defaultTest` özelliğini kullanarak:

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

## Python/JavaScript araç dosyaları işlev adı gerektir

Python veya JavaScript dosyalarından araçlar yüklerken `Python dosyaları bir ışlev adı gerektirir` gibi hatalar görüyorsanız, araç tanımlarını veren ışlev adını belirtmeniz gerekir.

### Çözüm

Python ve JavaScript araç dosyaları `file://path:function_name` biçimini kullanarak bir ışlev adı belirtmelidir:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:chat:gpt-4.1-mini
    config:
      # Doğru - işlev adını belirtir
      tools: file://./tools.py:get_tools
      # veya JavaScript/TypeScript için
      tools: file://./tools.js:getTools
```

İşlev araç tanımları dizisini döndürümü gerekir (senkron veya eş zaman sız olabilir):

```python title="tools.py"
def get_tools():
    return [
        {
            "type": "function",
            "function": {
                "name": "get_current_weather",
                "description": "Belirli bir yerdeki mevcut hava durumunu al",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "Şehir ve eyalet, örneğin San Francisco, CA"
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
        description: 'Belirli bir yerdeki mevcut hava durumunu al',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'Şehir ve eyalet, örneğin San Francisco, CA',
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

## Taşıı ilgisi ış değerlendirmeleri nasıl ışıԟırım

Bu değerlendirmeleri çalıştırırken, özellikle yerel sağlayıcılar kullanırken veya çok sayıda eş zaman lı istek çalıştırırken zaman aşımı hatalarıyla karşılaşabilirsiniz. Bunları çözümlemek için burada nasıl yapılır:

**Yaygın kullanım durumları:**

- Değerlendirmelerin bir zaman sınırı içinde tamamlanmasını sağlayın (CI/CD için yararlı)
- Özel sağlayıcıları veya takılı kalan sağlayıcıları ele alın
- Uzun süren değerlendirmelerden kaynaklanabilecek harcamaları önleyin

İki ayarı kontrol edebilirsiniz: bireysel test durumları için zaman aşımı ve tüm değerlendirme için zaman aşımı.

### Hızlı düzeltmeler

**Bireysel istekler ve toplam değerlendirme süresine yönelik zaman aşımları ayarla:**

```bash
export PROMPTFOO_EVAL_TIMEOUT_MS=30000  # İstek başına 30 saniye
export PROMPTFOO_MAX_EVAL_TIME_MS=300000  # Toplam sınır 5 dakika

npx promptfoo eval
```

Bu değerleri `.env` dosyanızda veya Promptfoo yapılandırıcı dosyasında da ayarlayabilirsiniz:

```yaml title="promptfooconfig.yaml"
env:
  PROMPTFOO_EVAL_TIMEOUT_MS: 30000
  PROMPTFOO_MAX_EVAL_TIME_MS: 300000
```

## Python Hata Ayıklaması

Özel Python sağlayıcıları, istemler, kancalar, iddialar vb. kullanırken, Python kodunuzu ayıklamanız gerekebilir. İşte sorun gidermede size yardımcı olacak bazı ipuçları:

### Python çıktısını görüntüleme

Python komut dosyanızından çıktıyı görmek için, print deyimleri de dahil olmak üzere, değerlendirmeyi çalıştırırken `LOG_LEVEL` ortam değişkenini `debug` olarak ayarlayın:

```bash
LOG_LEVEL=debug npx promptfoo eval
```

Alternatif olarak, `--verbose` bayrağını kullanabilirsiniz:

```bash
npx promptfoo eval --verbose
```

### Python ayıklayıcısını kullama (pdb)

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

`spawn py -3 ENOENT` veya `Python 3 bulunamadı` gibi hatalarla karşılaşırsanız, promptfoo Python kurulumunuzu bulamıyor. Bunu çözmek için burada nasıl:

#### Özel Python Yolu Ayarlama

Python yürütülebilir dosyasını belirtmek için `PROMPTFOO_PYTHON` ortam değişkenini kullanın:

```bash
# Windows (Özel bir konumda Python kuruluysa)
export PROMPTFOO_PYTHON=C:\Python\3_11\python.exe

# macOS/Linux
export PROMPTFOO_PYTHON=/usr/local/bin/python3

# İşetim sisteminizi çalıştırın
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

#### Windows Özel Sorunlar

Windows'ta, promptfoo Python'u bu sırayla tespit çalmaya çalışır:

1. `PROMPTFOO_PYTHON` ortam değişkeni (
ayarlanmışsa)
2. Sağlayıcıya özel `pythonExecutable` yapılandırması (
ayarlanmışsa)
3. **Windows akıllı algılama**: `where python` komutunu kullanır ve Microsoft Mağazosı saplarcılarını filtreler
4. `python -c "import sys; print(sys.executable)"` (gerçek Python yolunu almak için)
5. Yaygın bu komutlar: `python`, `python3`, `py -3`, `py`

Python başlatıcısı (`py.exe`) yüklemeden ancak Python doğrudan w vardır için, `python` komutunun komut satırından işe yaradığından emin olun. Değilse, ya:

- Python kurulumu dizininizi PATH'e ekleyin
- `PROMPTFOO_PYTHON`'u `python.exe`'nizin tam yoluna ayarlayın

**Yaygın Windows Python Konumları:**

- Microsoft Mağazası: `%USERPROFILE%\AppData\Local\Microsoft\WindowsApps\python.exe`
- Doğrudan yükleyici: `C:\Python3X\python.exe` (X sürümdür)
- Anaconda: `C:\Users\YourName\anaconda3\python.exe`

#### Python Yapılandırmanızı Test Etme

Python'unuzun doğru yapılandırıldığını doğrulamak için:

```bash
# Promptfoo'nun Python'unuzu bulabildiğini test edin
python -c "import sys; print(sys.executable)"

# Bu işe yarıyor ama promptfoo hala sorun varsa, PROMPTFOO_PYTHON'u ayarlayın:
export PROMPTFOO_PYTHON=$(python -c "import sys; print(sys.executable)")
```

### Hataları Ele Alma

Python komut dosyanızda hatalarla karşılaşırsanız, hata mesajı ve istif izleri promptfoo çıktısında görüntülenecektir. Kodunuzda neler yanlış olabileceğine dair ipuçları için bu bilgilere bakın.

Promptfoo Python komut dosyanızı ayrı bir işlemde çalıştırdığı için, bazı standart hata ayıklama teknikleri bekleneceği gibi çalışmayabilir. Yukarıda açıklandığı gibi günlüğü ve uzaktan hata ayıklamayı kullanmak, Python sağlayıcılarında sorunları gidermek için en güvenilir yollarıdır.

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

Promptfoo, hata ve ayrıntılı günlükleri varsayılan olarak `~/.promptfoo/logs` dizinine kaydetmektedir.

Konumu değiştirmek için `PROMPTFOO_LOG_DIR`'i farklı bir dizine ayarlayın.

Her çalıştırma için bir hata günlüğü ve bir hata ayıklama günlüğü oluşturulur.