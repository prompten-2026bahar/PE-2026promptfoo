---
title: Python Sağlayıcısı
sidebar_label: Python Sağlayıcısı
sidebar_position: 50
description: 'Gelişmiş model entegrasyonları, değerlendirmeler (evals) ve karmaşık test mantığı için özel Python betikleri oluşturun'
---

# Python Sağlayıcısı

Python sağlayıcısı, Python betiklerini kullanarak özel değerlendirme mantığı oluşturmanıza olanak tanır. Bu, Promptfoo'yu herhangi bir Python tabanlı model, API veya özel mantıkla entegre etmenizi sağlar.

:::tip Python Genel Bakış

Tüm Python entegrasyonlarına (sağlayıcılar, iddialar, test üreticileri, istemler) genel bir bakış için [Python entegrasyon kılavuzuna](/docs/integrations/python) bakın.

:::

**Yaygın kullanım durumları:**

- Tescilli veya yerel modelleri entegre etme
- Özel ön işleme/son işleme mantığı ekleme
- Karmaşık değerlendirme iş akışlarını uygulama
- Python'a özel ML kütüphanelerini kullanma
- Test için sahte (mock) sağlayıcılar oluşturma

## Ön Koşullar

Python sağlayıcısını kullanmadan önce şunlara sahip olduğunuzdan emin olun:

- Python 3.7 veya daha yüksek bir sürüm kurulu
- Promptfoo yapılandırmasına temel aşinalık
- Python sözlükleri (dictionaries) ve JSON hakkında bilgi

## Hızlı Başlangıç

Girişi bir önekle geri döndüren basit bir Python sağlayıcısı oluşturalım.

### Adım 1: Python betiğinizi oluşturun

```python
# echo_provider.py
def call_api(prompt, options, context):
    """İstemi bir önekle geri döndüren basit bir sağlayıcı."""
    config = options.get('config', {})
    prefix = config.get('prefix', 'Şunun hakkında bilgi ver: ')

    return {
        "output": f"{prefix}{prompt}"
    }
```

### Adım 2: Promptfoo'yu yapılandırın

```yaml
# promptfooconfig.yaml
providers:
  - id: 'file://echo_provider.py'

prompts:
  - 'Bana bir fıkra anlat'
  - '2+2 kaçtır?'
```

### Adım 3: Değerlendirmeyi çalıştırın

```bash
npx promptfoo@latest eval
```

İşte bu kadar! İlk özel Python sağlayıcınızı oluşturdunuz.

## Nasıl Çalışır?

Python sağlayıcıları kalıcı çalışan (worker) süreçleri kullanır. Betiğiniz, her çağrıda değil, çalışan başladığında bir kez yüklenir. Bu, özellikle ML modelleri gibi ağır içe aktarmaları olan betikler için sonraki çağrıları çok daha hızlı hale getirir.

Promptfoo, bir Python sağlayıcısıyla bir test vakasını değerlendirdiğinde:

1. **Promptfoo**, yapılandırmanıza göre istemi hazırlar.
2. **Python Betiği** üç parametre ile çağrılır:
   - `prompt`: Nihai istem dizesi
   - `options`: YAML'ınızdaki sağlayıcı yapılandırması
   - `context`: Mevcut test için değişkenler ve meta veriler
3. **Kodunuz** istemi işler ve bir yanıt döndürür.
4. **Promptfoo** yanıtı doğrular ve değerlendirmeye devam eder.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ Promptfoo   │────▶│ Sizin Python │────▶│ Sizin       │
│ Değerlendirme│     │ Sağlayıcınız │     │ Mantığınız  │
│             │     │              │     │ (API/Model) │
└─────────────┘     └──────────────┘     └─────────────┘
       ▲                    │
       │                    ▼
       │            ┌──────────────┐
       └────────────│     Yanıt    │
                    └──────────────┘
```

## Temel Kullanım

### Fonksiyon Arayüzü

Python betiğiniz bu fonksiyonlardan birini veya birkaçını uygulamalıdır. Hem senkron hem de asenkron sürümler desteklenir:

**Senkron Fonksiyonlar:**

```python
def call_api(prompt: str, options: dict, context: dict) -> dict:
    """Metin üretme görevleri için ana fonksiyon."""
    pass

def call_embedding_api(prompt: str, options: dict, context: dict) -> dict:
    """Embedding üretme görevleri için."""
    pass

def call_classification_api(prompt: str, options: dict, context: dict) -> dict:
    """Sınıflandırma görevleri için."""
    pass
```

**Asenkron Fonksiyonlar:**

```python
async def call_api(prompt: str, options: dict, context: dict) -> dict:
    """Metin üretme görevleri için asenkron ana fonksiyon."""
    pass

async def call_embedding_api(prompt: str, options: dict, context: dict) -> dict:
    """Embedding üretme görevleri için asenkron fonksiyon."""
    pass

async def call_classification_api(prompt: str, options: dict, context: dict) -> dict:
    """Sınıflandırma görevleri için asenkron fonksiyon."""
    pass
```

### Parametreleri Anlama

#### `prompt` Parametresi

İstem şunlardan biri olabilir:

- Basit bir dize: `"Fransa'nın başkenti neresidir?"`
- JSON kodlu bir konuşma: `'[{"role": "user", "content": "Merhaba"}]'`

```python
def call_api(prompt, options, context):
    # İstemin bir konuşma olup olmadığını kontrol et
    try:
        messages = json.loads(prompt)
        # Sohbet mesajları olarak işle
        for msg in messages:
            print(f"{msg['role']}: {msg['content']}")
    except:
        # Basit dize olarak işle
        print(f"İstem: {prompt}")
```

#### `options` Parametresi

Sağlayıcı yapılandırmanızı ve meta verilerinizi içerir:

```python
{
    "id": "file://my_provider.py",
    "config": {
        # promptfooconfig.yaml içindeki özel yapılandırmanız
        "model_name": "gpt-3.5-turbo",
        "temperature": 0.7,
        "max_tokens": 100,

        # promptfoo tarafından otomatik olarak eklenir:
        "basePath": "/absolute/path/to/config"  # Yapılandırmanızı içeren dizin (promptfooconfig.yaml)
    }
}
```

#### `context` Parametresi

Mevcut test vakası hakkında bilgi sağlar:

```python
{
    "vars": {
        "user_input": "Merhaba dünya",
        "system_prompt": "Yardımsever bir asistansınız"
    },
    "prompt": {
        "raw": "...",
        "label": "...",
    },
    "test": {
        "vars": { ... },
        "metadata": {
            "pluginId": "...",   # Redteam eklentisi (örn. "promptfoo:redteam:harmful:hate")
            "strategyId": "...", # Redteam stratejisi (örn. "jailbreak", "prompt-injection")
        },
    },
}
```

Kırmızı takım (redteam) değerlendirmeleri için, test vakasını hangi eklentinin ve stratejinin oluşturduğunu belirlemek üzere `context['test']['metadata']['pluginId']` ve `context['test']['metadata']['strategyId']` kullanın.

:::note

Serileştirilemeyen alanlar (`logger`, `getCache`, `filters`, `originalProvider`), context Python'a iletilmeden önce kaldırılır. `evaluationId`, `testCaseId`, `testIdx`, `promptIdx` ve `repeatIndex` gibi ek alanlar da mevcuttur.

:::

### Dönüş Formatı

Fonksiyonunuz şu alanları içeren bir sözlük döndürmelidir:

```python
def call_api(prompt, options, context):
    # Gerekli alan
    result = {
        "output": "Yanıtınız buraya"
    }

    # İsteğe bağlı alanlar
    result["tokenUsage"] = {
        "total": 150,
        "prompt": 50,
        "completion": 100
    }

    result["cost"] = 0.0025  # dolar cinsinden
    result["cached"] = False
    result["logProbs"] = [-0.5, -0.3, -0.1]
    result["latencyMs"] = 150  # milisaniye cinsinden özel gecikme
    
    # Hata yönetimi
    if bir_seyler_ters_gitti:
        result["error"] = "Neyin ters gittiğine dair açıklama"

    return result
```

### Türler (Types)

Python betiği fonksiyonuna iletilen türler ve `ProviderResponse` dönüş türü şu şekilde tanımlanmıştır:

```python
class ProviderOptions:
    id: Optional[str]
    config: Optional[Dict[str, Any]]

class CallApiContextParams:
    vars: Dict[str, str]
    prompt: Optional[Dict[str, Any]]       # İstem şablonu (raw, label, config)
    test: Optional[Dict[str, Any]]         # Meta veriler dahil tam test vakası

class TokenUsage:
    total: int
    prompt: int
    completion: int

class ProviderResponse:
    output: Optional[Union[str, Dict[str, Any]]]
    error: Optional[str]
    tokenUsage: Optional[TokenUsage]
    cost: Optional[float]
    cached: Optional[bool]
    logProbs: Optional[List[float]]
    latencyMs: Optional[int]  # ölçülen gecikmeyi geçersiz kılar
    metadata: Optional[Dict[str, Any]]

class ProviderEmbeddingResponse:
    embedding: List[float]
    tokenUsage: Optional[TokenUsage]
    cached: Optional[bool]

class ProviderClassificationResponse:
    classification: Dict[str, Any]
    tokenUsage: Optional[TokenUsage]
    cached: Optional[bool]

```

:::tip
Hata oluştuğunda boş bir dize olsa bile yanıtınıza her zaman `output` alanını dahil edin.
:::

## Tam Örnekler

### Örnek 1: OpenAI Uyumlu Sağlayıcı

```python
# openai_provider.py
import os
import json
from openai import OpenAI

def call_api(prompt, options, context):
    """OpenAI API'sini çağıran sağlayıcı."""
    config = options.get('config', {})

    # İstemciyi başlat
    client = OpenAI(
        api_key=os.getenv('OPENAI_API_KEY'),
        base_url=config.get('base_url', 'https://api.openai.com/v1')
    )

    # Gerekirse mesajları ayrıştır
    try:
        messages = json.loads(prompt)
    except:
        messages = [{"role": "user", "content": prompt}]

    # API çağrısı yap
    try:
        response = client.chat.completions.create(
            model=config.get('model', 'gpt-3.5-turbo'),
            messages=messages,
            temperature=config.get('temperature', 0.7),
            max_tokens=config.get('max_tokens', 150)
        )

        return {
            "output": response.choices[0].message.content,
            "tokenUsage": {
                "total": response.usage.total_tokens,
                "prompt": response.usage.prompt_tokens,
                "completion": response.usage.completion_tokens
            }
        }
    except Exception as e:
        return {
            "output": "",
            "error": str(e)
        }
```

### Örnek 2: Ön İşlemeli Yerel Model

```python
# local_model_provider.py
import torch
from transformers import pipeline

# Modeli bir kez başlat
generator = pipeline('text-generation', model='gpt2')

def preprocess_prompt(prompt, context):
    """Context'e özel ön işleme ekle."""
    template = context['vars'].get('template', '{prompt}')
    return template.format(prompt=prompt)

def call_api(prompt, options, context):
    """Yerel bir Hugging Face modeli kullanan sağlayıcı."""
    config = options.get('config', {})

    # Ön işleme
    processed_prompt = preprocess_prompt(prompt, context)

    # Üretim
    result = generator(
        processed_prompt,
        max_length=config.get('max_length', 100),
        temperature=config.get('temperature', 0.7),
        do_sample=True
    )

    return {
        "output": result[0]['generated_text'],
        "cached": False
    }
```

### Örnek 3: Test İçerikli Sahte (Mock) Sağlayıcı

```python
# mock_provider.py
import time
import random

def call_api(prompt, options, context):
    """Değerlendirme hatlarını test etmek için sahte sağlayıcı."""
    config = options.get('config', {})

    # İşleme süresini simüle et
    delay = config.get('delay', 0.1)
    time.sleep(delay)

    # Farklı yanıt türlerini simüle et
    if "error" in prompt.lower():
        return {
            "output": "",
            "error": "Test için simüle edilmiş hata"
        }

    # Sahte yanıt oluştur
    responses = config.get('responses', [
        "Bu sahte bir yanıttır.",
        "Sahte sağlayıcı doğru çalışıyor.",
        "Test yanıtı başarıyla oluşturuldu."
    ])

    response = random.choice(responses)
    mock_tokens = len(prompt.split()) + len(response.split())

    return {
        "output": response,
        "tokenUsage": {
            "total": mock_tokens,
            "prompt": len(prompt.split()),
            "completion": len(response.split())
        },
        "cost": mock_tokens * 0.00001
    }
```

## Yapılandırma

### Temel Yapılandırma

```yaml
providers:
  - id: 'file://my_provider.py'
    label: 'Özel Sağlayıcım' # İsteğe bağlı görünüm adı
    config:
      # Sağlayıcınızın ihtiyaç duyduğu herhangi bir yapılandırma
      api_key: '{{ env.CUSTOM_API_KEY }}'
      endpoint: https://api.example.com
      model_params:
        temperature: 0.7
        max_tokens: 100
```

### Bulut Hedefine Bağlama (Link to Cloud Target)

:::info Promptfoo Cloud Özelliği
[Promptfoo Cloud](/docs/enterprise) dağıtımlarında mevcuttur.
:::

Yerel sağlayıcı yapılandırmanızı `linkedTargetId` kullanarak bir bulut hedefine bağlayın:

```yaml
providers:
  - id: 'file://my_provider.py'
    config:
      linkedTargetId: 'promptfoo://provider/12345678-1234-1234-1234-123456789abc'
```

Kurulum talimatları için [Yerel Hedefleri Buluta Bağlama](/docs/red-team/troubleshooting/linking-targets/) bölümüne bakın.

### Harici Yapılandırma Dosyalarını Kullanma

Yapılandırmayı harici dosyalardan yükleyebilirsiniz:

```yaml
providers:
  - id: 'file://my_provider.py'
    config:
      # Tüm yapılandırmayı JSON'dan yükle
      settings: file://config/model_settings.json

      # Belirli bir fonksiyonla YAML'dan yükle
      prompts: file://config/prompts.yaml

      # Python fonksiyonundan yükle
      preprocessing: file://config/preprocess.py:get_config

      # İç içe geçmiş dosya referansları
      models:
        primary: file://config/primary_model.json
        fallback: file://config/fallback_model.yaml
```

Desteklenen formatlar:

- **JSON** (`.json`) - Nesne/dizi olarak ayrıştırılır
- **YAML** (`.yaml`, `.yml`) - Nesne/dizi olarak ayrıştırılır
- **Metin** (`.txt`, `.md`) - Dize (string) olarak yüklenir
- **Python** (`.py`) - Yapılandırma döndüren bir fonksiyon dışa aktarmalıdır
- **JavaScript** (`.js`, `.mjs`) - Yapılandırma döndüren bir fonksiyon dışa aktarmalıdır

### Çalışan (Worker) Yapılandırması

Python sağlayıcıları, çağrılar arasında canlı kalan kalıcı çalışan süreçleri kullanır ve sonraki çağrıları daha hızlı hale getirir.

#### Paralellik

Sağlayıcı başına çalışan sayısını kontrol edin:

```yaml
providers:
  # Varsayılan: 1 çalışan
  - id: file://my_provider.py

  # Paralel yürütme için birden fazla çalışan
  - id: file://api_wrapper.py
    config:
      workers: 4
```

Veya küresel olarak ayarlayın:

```bash
export PROMPTFOO_PYTHON_WORKERS=4
```

**Ne zaman 1 çalışan kullanılmalı** (varsayılan):

- GPU'ya bağlı ML modelleri
- Ağır içe aktarmaları (import) olan betikler (bunları birden fazla kez yüklemeyi önler)
- Oturum durumu gerektiren konuşma akışları

**Ne zaman birden fazla çalışan kullanılmalı:**

- Paralelliğin yardımcı olduğu CPU'ya bağlı görevler
- Hafif API sarmalayıcıları (wrappers)

Küresel durumun (global state) çalışanlar arasında paylaşılmadığını unutmayın. Betiğiniz oturum yönetimi için küresel değişkenler kullanıyorsa (kırmızı takım değerlendirmeleri gibi konuşma akışlarında yaygındır), tüm isteklerin aynı çalışana gitmesini sağlamak için `workers: 1` kullanın.

#### Zaman Aşımları (Timeouts)

Varsayılan zaman aşımı 5 dakikadır (300 saniye). Gerekirse artırın:

```yaml
providers:
  - id: file://slow_model.py
    config:
      timeout: 300000 # milisaniye
```

Veya tüm sağlayıcılar için küresel olarak ayarlayın:

```bash
export REQUEST_TIMEOUT_MS=600000  # 10 dakika
```

### Ortam Yapılandırması

#### Özel Python Yürütülebilir Dosyası

Özel bir Python yürütülebilir dosyasını birkaç şekilde belirtebilirsiniz:

**Seçenek 1: Sağlayıcı başına yapılandırma**

```yaml
providers:
  - id: 'file://my_provider.py'
    config:
      pythonExecutable: /path/to/venv/bin/python
```

**Seçenek 2: Küresel ortam değişkeni**

```bash
# Belirli bir Python sürümünü küresel olarak kullan
export PROMPTFOO_PYTHON=/usr/bin/python3.11
npx promptfoo@latest eval
```

#### Python Algılama Süreci

Promptfoo, Python kurulumunuzu şu öncelik sırasına göre otomatik olarak algılar:

1. **Ortam değişkeni**: `PROMPTFOO_PYTHON` (ayarlanmışsa)
2. **Sağlayıcı yapılandırması**: Yapılandırmanızdaki `pythonExecutable`
3. **Windows akıllı algılama**: `where python` kullanır ve Microsoft Store saplamalarını (stubs) filtreler (sadece Windows)
4. **Akıllı algılama**: Gerçek Python yolunu bulmak için `python -c "import sys; print(sys.executable)"` kullanır
5. **Yedek (fallback) komutlar**:
   - Windows: `python`, `python3`, `py -3`, `py`
   - macOS/Linux: `python3`, `python`

Bu gelişmiş algılama, özellikle Python başlatıcısının (`py.exe`) mevcut olmayabileceği Windows'ta yardımcı olur.

#### Ortam Değişkenleri

```bash
# Belirli Python sürümünü kullan
export PROMPTFOO_PYTHON=/usr/bin/python3.11

# Özel modül yolları ekle
export PYTHONPATH=/path/to/my/modules:$PYTHONPATH

# pdb ile Python hata ayıklamayı etkinleştir
export PROMPTFOO_PYTHON_DEBUG_ENABLED=true

# Değerlendirmeyi çalıştır
npx promptfoo@latest eval
```

## Gelişmiş Özellikler

### Özel Fonksiyon İsimleri

Varsayılan fonksiyon ismini geçersiz kılın:

```yaml
providers:
  - id: 'file://my_provider.py:generate_response'
    config:
      model: 'custom-model'
```

```python
# my_provider.py
def generate_response(prompt, options, context):
    # Özel fonksiyonunuz
    return {"output": "Özel yanıt"}
```

### Farklı Giriş Türlerini Yönetme

```python
def call_api(prompt, options, context):
    """Çeşitli istem formatlarını yönet."""

    # Metin istemi
    if isinstance(prompt, str):
        try:
            # JSON olarak ayrıştırmayı dene
            data = json.loads(prompt)
            if isinstance(data, list):
                # Sohbet formatı
                return handle_chat(data, options)
            elif isinstance(data, dict):
                # Yapılandırılmış istem
                return handle_structured(data, options)
        except:
            # Düz metin
            return handle_text(prompt, options)
```

### Koruma Kalkanları (Guardrails) Uygulama

```python
def call_api(prompt, options, context):
    """Güvenlik koruma kalkanları olan sağlayıcı."""

    # Yasaklanmış içeriği kontrol et
    prohibited_terms = config.get('prohibited_terms', [])
    for term in prohibited_terms:
        if term.lower() in prompt.lower():
            return {
                "output": "Bu isteği işleyemiyorum.",
                "guardrails": {
                    "flagged": True,
                    "reason": "Yasaklanmış içerik saptandı"
                }
            }

    # Normal şekilde işle
    result = generate_response(prompt)

    # İşlem sonrası kontroller
    if check_output_safety(result):
        return {"output": result}
    else:
        return {
            "output": "[İçerik filtrelendi]",
            "guardrails": {"flagged": True}
        }
```

### OpenTelemetry İzleme (Tracing)

İzleme etkinleştirildiğinde Python sağlayıcıları otomatik olarak OpenTelemetry aralıkları (spans) yayar. Bu, değerlendirme izlerinizin bir parçası olarak Python sağlayıcı yürütmesine görünürlük sağlar.

**Gereksinimler:**

```bash
pip install opentelemetry-api opentelemetry-sdk opentelemetry-exporter-otlp-proto-http
```

**İzlemeyi etkinleştir:**

```yaml title="promptfooconfig.yaml"
tracing:
  enabled: true
  otlp:
    http:
      enabled: true
```

İzleme etkinleştirildiğinde (`PROMPTFOO_ENABLE_OTEL=true`), Python sağlayıcı sarmalayıcısı otomatik olarak:

- Üst değerlendirme izine bağlı alt aralıklar oluşturur.
- İstek/yanıt gövde niteliklerini kaydeder.
- Yanıtınızdaki `tokenUsage` alanından token kullanımını yakalar.
- Değerlendirme ve test vakası meta verilerini dahil eder.

Aralıklar, `gen_ai.request.model`, `gen_ai.usage.input_tokens` ve `gen_ai.usage.output_tokens` gibi niteliklerle [GenAI semantik kurallarını](https://opentelemetry.io/docs/specs/semconv/gen-ai/) takip eder.

### Yeniden Denemeleri (Retries) Yönetme

Harici API'leri çağırırken, hız sınırlarını ve geçici hataları yönetmek için betiğinizde yeniden deneme mantığı uygulayın:

```python
import time
import requests

def call_api(prompt, options, context):
    """Harici API çağrıları için yeniden deneme mantığı olan sağlayıcı."""
    config = options.get('config', {})
    max_retries = config.get('max_retries', 3)

    for attempt in range(max_retries):
        try:
            response = requests.post(
                config['api_url'],
                json={'prompt': prompt},
                timeout=30
            )

            # Hız sınırlarını yönet
            if response.status_code == 429:
                wait_time = int(response.headers.get('Retry-After', 2 ** attempt))
                time.sleep(wait_time)
                continue

            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                return {"output": "", "error": f"{max_retries} denemeden sonra başarısız oldu: {str(e)}"}
            time.sleep(2 ** attempt)  # Üstel geri çekilme (Exponential backoff)
```

## Sorun Giderme

### Yaygın Sorunlar ve Çözümleri

| Sorun                         | Çözüm                                                               |
| ----------------------------- | ------------------------------------------------------------------- |
| `spawn py -3 ENOENT` hataları | `PROMPTFOO_PYTHON` ortam değişkenini ayarlayın veya yapılandırmada `pythonExecutable` kullanın |
| `Python 3 not found` hataları | `python` komutunun çalıştığından emin olun veya `PROMPTFOO_PYTHON` ayarını yapın |
| "Module not found" hataları   | `PYTHONPATH` ayarını yapın veya sanal ortamlar için `pythonExecutable` kullanın |
| Betik yürütülmüyor            | Dosya yolunun `promptfooconfig.yaml` dosyasına göre göreli olduğunu kontrol edin |
| Çıktı görünmüyor              | Yazdırılan ifadeleri görmek için `LOG_LEVEL=debug` kullanın           |
| JSON ayrıştırma hataları      | İstem formatının ayrıştırma mantığınızla eşleştiğinden emin olun |
| Zaman aşımı hataları          | Başlatma kodunu optimize edin, modelleri bir kez yükleyin           |

### Hata Ayıklama İpuçları

1. **Hata ayıklama günlüğünü etkinleştirin:**

   ```bash
   LOG_LEVEL=debug npx promptfoo@latest eval
   ```

2. **Sağlayıcınıza günlük tutma (logging) ekleyin:**

   ```python
   import sys

   def call_api(prompt, options, context):
       print(f"Alınan istem: {prompt}", file=sys.stderr)
       print(f"Yapılandırma: {options.get('config', {})}", file=sys.stderr)
       # Mantığınız burada
   ```

3. **Sağlayıcınızı bağımsız olarak test edin:**

   ```python
   # test_provider.py
   from my_provider import call_api

   result = call_api(
       "Test istemi",
       {"config": {"model": "test"}},
       {"vars": {}}
   )
   print(result)
   ```

4. **Etkileşimli hata ayıklama için Python hata ayıklayıcısını (pdb) kullanın:**

   ```bash
   export PROMPTFOO_PYTHON_DEBUG_ENABLED=true
   ```

   Bu ortam değişkeni ayarlandığında, Python kodunuzda kesme noktaları (breakpoints) ayarlamak için `import pdb; pdb.set_trace()` kullanabilirsiniz:

   ```python
   def call_api(prompt, options, context):
       import pdb; pdb.set_trace()  # Yürütme burada duracaktır
       # Sağlayıcı mantığınız
       return {"output": result}
   ```

   Bu, değerlendirme çalışmaları sırasında terminalinizde doğrudan etkileşimli hata ayıklamaya olanak tanır.

## Göç (Migration) Kılavuzu

### HTTP Sağlayıcısından

Şu anda bir HTTP sağlayıcısı kullanıyorsanız, API çağrılarınızı sarmalayabilirsiniz:

```python
# http_wrapper.py
import requests

def call_api(prompt, options, context):
    config = options.get('config', {})
    response = requests.post(
        config.get('url'),
        json={"prompt": prompt},
        headers=config.get('headers', {})
    )
    return response.json()
```

### JavaScript Sağlayıcısından

Python sağlayıcısı, JavaScript sağlayıcılarıyla aynı arayüzü takip eder:

```javascript
// JavaScript
module.exports = {
  async callApi(prompt, options, context) {
    return { output: `Yankı: ${prompt}` };
  },
};
```

```python
# Python eşdeğeri
def call_api(prompt, options, context):
    return {"output": f"Yankı: {prompt}"}
```

## Sonraki Adımlar

- [Özel iddialar](/docs/configuration/expected-outputs/) hakkında bilgi edinin.
- [CI/CD entegrasyonu](/docs/integrations/github-action.md) kurun.
