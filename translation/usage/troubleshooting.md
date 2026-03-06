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

The function must return a tool definitions array (can be synchronous or asynchronous):

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
## Python/JavaScript tool files require function name

If you see errors like `Python files require a function name` when loading tools from Python or JavaScript files, you need to specify the function name that returns the tool definitions.

### Solution

Python and JavaScript tool files must specify a function name using the `file://path:function_name` format:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:chat:gpt-4.1-mini
    config:
      # Correct - specifies function name
      tools: file://./tools.py:get_tools
      # or for JavaScript/TypeScript
      tools: file://./tools.js:getTools
```

The function must return a tool definitions array (can be synchronous or asynchronous):

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

## How to triage stuck evals

When running evals, you may encounter timeout errors, especially when using local providers or when running many concurrent requests. Here's how to fix them:

**Common use cases:**

- Ensure evaluations complete within a time limit (useful for CI/CD)
- Handle custom providers or providers that get stuck
- Prevent runaway costs from long-running evaluations

You can control two settings: timeout for individual test cases and timeout for the entire evaluation.

### Quick fixes

**Set timeouts for individual requests and total evaluation time:**

```bash
export PROMPTFOO_EVAL_TIMEOUT_MS=30000  # 30 seconds per request
export PROMPTFOO_MAX_EVAL_TIME_MS=300000  # 5 minutes total limit

npx promptfoo eval
```

You can also set these values in your `.env` file or Promptfoo config file:

```yaml title="promptfooconfig.yaml"
env:
  PROMPTFOO_EVAL_TIMEOUT_MS: 30000
  PROMPTFOO_MAX_EVAL_TIME_MS: 300000
```

## Debugging Python

When using custom Python providers, prompts, hooks, assertions, etc., you may need to debug your Python code. Here are some tips to help you troubleshoot issues:

### Viewing Python output

To see the output from your Python script, including print statements, set the `LOG_LEVEL` environment variable to `debug` when running your eval:

```bash
LOG_LEVEL=debug npx promptfoo eval
```

Alternatively, you can use the `--verbose` flag:

```bash
npx promptfoo eval --verbose
```

### Using the Python debugger (pdb)

Promptfoo now supports native Python debugging with pdb. To enable it:

```bash
export PROMPTFOO_PYTHON_DEBUG_ENABLED=true
```

Then add breakpoints in your Python code:

```python
import pdb

def call_api(prompt, options, context):
    pdb.set_trace()  # Debugger will pause here
    # Your code...
```

### Python Installation and Path Issues

If you encounter errors like `spawn py -3 ENOENT` or `Python 3 not found`, promptfoo cannot locate your Python installation. Here's how to resolve this:

#### Setting a Custom Python Path

Use the `PROMPTFOO_PYTHON` environment variable to specify your Python executable:

```bash
# Windows (if Python is installed at a custom location)
export PROMPTFOO_PYTHON=C:\Python\3_11\python.exe

# macOS/Linux
export PROMPTFOO_PYTHON=/usr/local/bin/python3

# Then run your evaluation
npx promptfoo eval
```

#### Per-Provider Python Configuration

You can also set the Python path for specific providers in your config:

```yaml
providers:
  - id: 'file://my_provider.py'
    config:
      pythonExecutable: /path/to/specific/python
```

#### Windows-Specific Issues

On Windows, promptfoo tries to detect Python in this order:

1. `PROMPTFOO_PYTHON` environment variable (if set)
2. Provider-specific `pythonExecutable` config (if set)
3. **Windows smart detection**: Uses `where python` command and filters out Microsoft Store stubs
4. `python -c "import sys; print(sys.executable)"` (to get the actual Python path)
5. Common fallback commands: `python`, `python3`, `py -3`, `py`

If you don't have the Python launcher (`py.exe`) installed but have Python directly, make sure the `python` command works from your command line. If not, either:

- Add your Python installation directory to your PATH
- Set `PROMPTFOO_PYTHON` to the full path of your `python.exe`

**Common Windows Python locations:**

- Microsoft Store: `%USERPROFILE%\AppData\Local\Microsoft\WindowsApps\python.exe`
- Direct installer: `C:\Python3X\python.exe` (where X is the version)
- Anaconda: `C:\Users\YourName\anaconda3\python.exe`

#### Testing Your Python Configuration

To verify your Python is correctly configured:

```bash
# Test that promptfoo can find your Python
python -c "import sys; print(sys.executable)"

# If this works but promptfoo still has issues, set PROMPTFOO_PYTHON:
export PROMPTFOO_PYTHON=$(python -c "import sys; print(sys.executable)")
```

### Handling errors

If you encounter errors in your Python script, the error message and stack trace will be displayed in the promptfoo output. Make sure to check this information for clues about what might be going wrong in your code.

Remember that promptfoo runs your Python script in a separate process, so some standard debugging techniques may not work as expected. Using logging and remote debugging as described above are the most reliable ways to troubleshoot issues in your Python providers.

## Debugging the Database

1. Set environment variables:

   ```bash
   export PROMPTFOO_ENABLE_DATABASE_LOGS=true
   export LOG_LEVEL=debug
   ```

2. Run your command:

   ```bash
   npx promptfoo eval
   ```

3. Disable logging when done:

   ```bash
   unset PROMPTFOO_ENABLE_DATABASE_LOGS
   ```

## Finding log files

Promptfoo logs errors and verbose logs to `~/.promptfoo/logs` by default.

Change the location by setting `PROMPTFOO_LOG_DIR` to a different directory.

For each run an error log and a debug log will be created.