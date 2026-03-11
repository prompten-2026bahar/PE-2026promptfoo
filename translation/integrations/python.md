---
title: Python Entegrasyonu
sidebar_label: Python
sidebar_position: 1
description: Sağlayıcılar, savlar, test oluşturucular ve promptlar için promptfoo değerlendirmelerinde Python kullanın. LangChain, LangGraph, CrewAI ve daha fazlasıyla entegre olur.
keywords:
  [
    promptfoo python,
    python llm testi,
    python değerlendirme,
    python sağlayıcı,
    langchain testi,
    langgraph testi,
    python llm değerlendirme,
    llm testi python,
    crewai testi,
    pydantic ai testi,
    openai agents sdk,
    google adk,
    strands agents,
    python ajan çerçevesi,
  ]
---

import PythonFileViewer from '@site/src/components/PythonFileViewer';

# Python

Promptfoo TypeScript ile yazılmıştır ve Node.js üzerinden çalışır, ancak birinci sınıf Python desteğine sahiptir. JavaScript yazmanıza gerek kalmadan değerlendirme sürecinizin herhangi bir bölümü için Python'u kullanabilirsiniz.

**Python'u şu amaçlarla kullanın:**

- [**Sağlayıcılar (Providers)**](#providers): Özel modelleri çağırın, API'leri sarmalayın, Hugging Face/PyTorch çalıştırın
- [**Savlar (Assertions)**](#assertions): Özel puanlama mantığıyla çıktıları doğrulayın
- [**Test oluşturucular (Test generators)**](#test-generators): Veritabanlarından, API'lerden test vakaları yükleyin veya bunları programatik olarak oluşturun
- [**Promptlar**](#prompts): Test değişkenlerine dayalı olarak dinamik promptlar oluşturun
- [**Çerçeve (Framework) entegrasyonları**](#framework-integrations): LangChain, LangGraph, CrewAI ve diğer ajan çerçevelerini test edin

`file://` öneki, promptfoo'ya bir Python fonksiyonunu yürütmesini söyler. Promptfoo, Python kurulumunuzu otomatik olarak algılar.

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - file://prompts.py:create_prompt # Python promptu oluşturur

providers:
  - file://provider.py # Python modeli çağırır

tests:
  - file://tests.py:generate_tests # Python test vakalarını oluşturur

defaultTest:
  assert:
    - type: python # Python çıktıyı doğrular
      value: file://assert.py:check
```

<!-- prettier-ignore-start -->
<PythonFileViewer
  defaultOpen="provider.py"
  files={[
    {
      name: 'prompts.py',
      description: 'Promptları oluşturur',
      content: `def create_prompt(context):
    return [
        {"role": "system", "content": "Yardımcı bir asistansın."},
        {"role": "user", "content": f"{context['vars']['topic']} konusunu açıkla"},
    ]`,
    },
    {
      name: 'provider.py',
      description: 'Herhangi bir modeli çağırır',
      content: `from openai import OpenAI

client = OpenAI()

def call_api(prompt, options, context):
    response = client.responses.create(
        model="gpt-5.1-mini",
        input=prompt,
    )
    return {"output": response.output_text}`,
    },
    {
      name: 'tests.py',
      description: 'Testleri oluşturur',
      content: `def generate_tests(config=None):
    return [
        {"vars": {"topic": "dekoratörler"}},
        {"vars": {"topic": "async/await"}},
    ]`,
    },
    {
      name: 'assert.py',
      description: 'Çıktıyı doğrular',
      content: `def check(output, context):
    topic = context["vars"]["topic"]
    if topic.lower() not in output.lower():
        return {"pass": False, "score": 0, "reason": f"Eksik konu: {topic}"}
    return {"pass": True, "score": 1.0}`,
    },
  ]}
/>
<!-- prettier-ignore-end -->

```bash
npx promptfoo@latest init --example python-provider
```

---

## Sağlayıcılar (Providers)

Bir Python dosyasına atıfta bulunmak için `file://` kullanın:

```yaml
providers:
  - file://provider.py # Varsayılan olarak call_api() fonksiyonunu kullanır
  - file://provider.py:custom_function # Bir fonksiyon adı belirtin
```

Fonksiyonunuz üç argüman alır ve bir sözlük (dict) döndürür:

```python title="provider.py"
def call_api(prompt, options, context):  # veya: async def call_api(...)
    # prompt: dize veya JSON formatında kodlanmış mesajlar
    # options: YAML'daki {"config": {...}} bölümü
    # context: test vakasındaki {"vars": {...}} bölümü

    return {
        "output": "yanıt metni",
        # İsteğe bağlı:
        "tokenUsage": {"total": 100, "prompt": 20, "completion": 80},
        "cost": 0.001,
    }
```

→ [Sağlayıcı belgeleri](/docs/providers/python)

---

## Savlar (Assertions)

Özel doğrulama çalıştırmak için `type: python` kullanın:

```yaml
assert:
  # Satır içi (inline) ifade (bool veya 0-1 arası float döndürür)
  - type: python
    value: "'anahtar_kelime' in output.lower()"

  # Harici dosya
  - type: python
    value: file://assert.py
```

Harici dosyalar için bir `get_assert` fonksiyonu tanımlayın:

```python title="assert.py"
def get_assert(output, context):
    # bool, float (0-1) veya ayrıntılı sonuç döndürün
    return {
        "pass": True,
        "score": 0.9,
        "reason": "Kriterleri karşılıyor",
    }
```

→ [Savlar (Assertions) belgeleri](/docs/configuration/expected-outputs/python)

---

## Test Oluşturucular (Test Generators)

Python'dan test vakaları yükleyin veya oluşturun:

```yaml
tests:
  - file://tests.py:generate_tests
```

```python title="tests.py"
def generate_tests(config=None):
    # Veritabanından, API'den, dosyalardan vb. yükleyin
    return [
        {"vars": {"input": "test 1"}, "assert": [{"type": "contains", "value": "beklenen"}]},
        {"vars": {"input": "test 2"}},
    ]
```

Yapılandırmayı YAML'dan iletin:

```yaml
tests:
  - path: file://tests.py:generate_tests
    config:
      max_cases: 100
      category: 'safety'
```

→ [Test vakası belgeleri](/docs/configuration/test-cases#dynamic-test-generation)

---

## Promptlar

Promptları dinamik olarak oluşturun:

```yaml
prompts:
  - file://prompts.py:create_prompt
```

```python title="prompts.py"
def create_prompt(context):
    # Metin veya sohbet mesajları döndürün
    return [
        {"role": "system", "content": "Sen bir uzmansın."},
        {"role": "user", "content": f"{context['vars']['topic']} konusunu açıkla"},
    ]
```

→ [Prompt belgeleri](/docs/configuration/prompts)

---

## Çerçeve (Framework) Entegrasyonları

Python ajan çerçevelerini sağlayıcı olarak sarmalayarak test edin:

| Çerçeve            | Örnek                                                                                                | Kılavuz                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **LangGraph**      | [`langgraph`](https://github.com/promptfoo/promptfoo/tree/main/examples/langgraph)                   | [LangGraph ajanlarını değerlendirme](/docs/guides/evaluate-langgraph) |
| **LangChain**      | [`langchain-python`](https://github.com/promptfoo/promptfoo/tree/main/examples/langchain-python)     | [LLM zincirlerini test etme](/docs/configuration/testing-llm-chains)    |
| **CrewAI**         | [`crewai`](https://github.com/promptfoo/promptfoo/tree/main/examples/crewai)                         | [CrewAI ajanlarını değerlendirme](/docs/guides/evaluate-crewai)       |
| **OpenAI Agents**  | [`openai-agents`](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-agents)           | [Çok turlu ajan iş akışları](/docs/providers/openai-agents)  |
| **PydanticAI**     | [`pydantic-ai`](https://github.com/promptfoo/promptfoo/tree/main/examples/pydantic-ai)               | Pydantic ile tür güvenli ajanlar                             |
| **Google ADK**     | [`google-adk-example`](https://github.com/promptfoo/promptfoo/tree/main/examples/google-adk-example) | Google Ajan Geliştirme Kiti                                  |
| **Strands Agents** | [`strands-agents`](https://github.com/promptfoo/promptfoo/tree/main/examples/strands-agents)         | AWS açık kaynak ajan çerçevesi                               |

Herhangi bir örnekle başlamak için:

```bash
npx promptfoo@latest init --example langgraph
```

---

## Jupyter / Colab

```python
# Kurulum
!npm install -g promptfoo

# Yapılandırma oluşturma
%%writefile promptfooconfig.yaml
prompts:
  - "{{topic}} konusunu açıkla"
providers:
  - openai:gpt-4.1-mini
tests:
  - vars:
      topic: makine öğrenimi

# Çalıştırma
!npx promptfoo eval
```

**[Google Colab'da Aç](https://colab.research.google.com/gist/typpo/734a5f53eb1922f90198538dbe17aa27/promptfoo-example-1.ipynb)**

---

## Yapılandırma

### Python Yolu

Özel bir Python yürütülebilir dosyası ayarlayın:

```bash
export PROMPTFOO_PYTHON=/path/to/python3
```

Veya YAML'da sağlayıcı başına yapılandırın:

```yaml
providers:
  - id: file://provider.py
    config:
      pythonExecutable: ./venv/bin/python
```

### Modül Yolları

Dizinleri Python yoluna ekleyin:

```bash
export PYTHONPATH=/path/to/modules:$PYTHONPATH
```

### Hata Ayıklama

Python yürütme ayrıntılarını görmek için hata ayıklama çıktısını etkinleştirin:

```bash
LOG_LEVEL=debug npx promptfoo eval
```

---

## Sorun Giderme

`Python bulunamadı`, modül içe aktarma hataları ve zaman aşımı sorunları gibi yaygın sorunlar için [Python sağlayıcı sorun giderme](/docs/providers/python#troubleshooting) bölümüne bakın.
