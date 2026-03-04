---
title: Başlarken
description: İlk promptfoo yapılandırma dosyanızı nasıl oluşturacağınızı, promptları nasıl yazacağınızı, sağlayıcıları nasıl yapılandıracağınızı ve ilk LLM değerlendirmenizi nasıl çalıştıracağınızı öğrenin.
keywords: [başlarken, kurulum, yapılandırma, promptlar, sağlayıcılar, değerlendirme, llm testleri]
sidebar_position: 5
---

<<<<<<< HEAD:translation/getting-started.md
=======
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

>>>>>>> fc95fef (dosyadaki eksik bölümler eklendi):docs/getting-started.md
# Başlarken

[promptfoo](/docs/installation) yüklendikten sonra ilk yapılandırma dosyanızı birkaç şekilde oluşturabilirsiniz:

## Bir örneği çalıştırma

Hazır bir örnek kullanarak ilk yapılandırma dosyanızı oluşturmak için aşağıdaki komutlardan birini kullanın (örneğin [npx](https://nodejs.org/en/download), [npm](https://nodejs.org/en/download) veya [brew](https://brew.sh/)):

  <Tabs groupId="promptfoo-command">
    <TabItem value="npx" label="npx" default>
      ```bash
      npx promptfoo@latest init --example getting-started
      ```
    </TabItem>
    <TabItem value="npm" label="npm">
      ```bash
      npm install -g promptfoo
      promptfoo init --example getting-started
      ```
    </TabItem>
    <TabItem value="brew" label="brew">
      ```bash
      brew install promptfoo
      promptfoo init --example getting-started
      ```
    </TabItem>
  </Tabs>

Bu komut, farklı modellerde çeviri promptlarını test eden bir [temel örnek](https://github.com/promptfoo/promptfoo/tree/main/examples/getting-started) içeren yeni bir dizin oluşturur. Örnek şunları içerir:

- Örnek promptlar, sağlayıcılar ve test vakalarını içeren `promptfooconfig.yaml` yapılandırma dosyası.
- Örneğin nasıl çalıştığını anlatan bir `README.md` dosyası.

Çoğu sağlayıcı kimlik doğrulaması gerektirir. OpenAI için örnek:

```sh
export OPENAI_API_KEY=sk-abc123
```

Ardından örnek dizine gidin, değerlendirmeyi çalıştırın ve sonuçları görüntüleyin:

<Tabs groupId="promptfoo-command">
  <TabItem value="npx" label="npx" default>
    ```bash
    cd getting-started
    npx promptfoo@latest eval
    npx promptfoo@latest view
    ```
  </TabItem>
  <TabItem value="npm" label="npm">
    ```bash
    cd getting-started
    promptfoo eval
    promptfoo view
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    cd getting-started
    promptfoo eval
    promptfoo view
    ```
  </TabItem>
</Tabs>

## CLI ile kurulum

Sıfırdan başlamak için etkileşimli CLI adımlarını kullanarak bir yapılandırma oluşturmak için `promptfoo init` çalıştırın:

<Tabs groupId="promptfoo-command">
  <TabItem value="npx" label="npx" default>
    ```bash
    npx promptfoo@latest init
    ```
  </TabItem>
  <TabItem value="npm" label="npm">
    ```bash
    promptfoo init
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    promptfoo init
    ```
  </TabItem>
</Tabs>

## Web UI ile kurulum

Görsel bir arayüz tercih ediyorsanız, web tabanlı kurulum ile ilk değerlendirmenizi oluşturmak için `promptfoo eval setup` çalıştırın:

<Tabs groupId="promptfoo-command">
  <TabItem value="npx" label="npx" default>
    ```bash
    npx promptfoo@latest eval setup
    ```
  </TabItem>
  <TabItem value="npm" label="npm">
    ```bash
    promptfoo eval setup
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    promptfoo eval setup
    ```
  </TabItem>
</Tabs>

This opens a browser-based setup flow that walks you through creating prompts, choosing providers, and adding test cases.

<div style={{ textAlign: 'center' }}>   
  <img src="/img/docs/eval-setup.png" alt="Promptfoo eval setup Web UI" style={{ width: '80%' }} />
</div>

<<<<<<< HEAD:translation/getting-started.md
=======
## Yapılandırma

Değerlendirmenizi yapılandırmak için:

1. **Set up your prompts**: Open `promptfooconfig.yaml` and add prompts that you want to test. Use double curly braces for variable placeholders: `{{variable_name}}`. For example:

   ```yaml
   prompts:
     - 'Aşağıdaki İngilizce metni {{language}} diline çevir: {{input}}'
   ```

   [&raquo; Promptları ayarlama hakkında daha fazla bilgi](/docs/configuration/prompts)

2. Test etmek istediğiniz AI modellerini belirtmek için `providers` ekleyin. Promptfoo, OpenAI, Anthropic, Google ve diğer birçok şey de dahil olmak üzere 60+ sağlayıcıyı destekler:

   ```yaml
   providers:
     - openai:gpt-5.2
     - openai:gpt-5-mini
     - anthropic:messages:claude-opus-4-6
     - google:gemini-3-pro-preview
     # Veya kendi özel sağlayıcınızı kullanın
     - file://path/to/custom/provider.py
   ```

   Buna bulut API'leri, [Ollama](/docs/providers/ollama) gibi yerel modeller ve özel [Python](/docs/providers/python) veya [JavaScript](/docs/providers/custom-api) kodu dahildir.

   [&raquo; Tüm sağlayıcıları göster](/docs/providers)

3. **Test giriş verileri ekleyin**: Promptlarınız için bazı örnek giriş verileri ekleyin. İsteğe bağlı olarak, otomatik olarak kontrol edilen çıktı gereksinimlerini ayarlamak için [assertions](/docs/configuration/expected-outputs) ekleyin.

   Örneğin:

   ```yaml
   tests:
     - vars:
         language: French
         input: Hello world
       assert:
         - type: contains
           value: 'Bonjour le monde'
     - vars:
         language: Spanish
         input: Where is the library?
       assert:
         - type: icontains
           value: 'Dónde está la biblioteca'
   ```

   Test durumları yazarken, promptlarınızın doğru şekilde işlemesini sağlamak istediğiniz temel kullanım durumlarını ve potansiyel hataları düşünün.

   [&raquo; Test kurulumu hakkında daha fazla bilgi](/docs/configuration/guide)

4. **Değerlendirmeyi çalıştırın**: `promptfooconfig.yaml` dosyasını içeren dizinde olduğunuzdan emin olun, ardından şunu çalıştırın:

   <Tabs groupId="promptfoo-command">
     <TabItem value="npx" label="npx" default>
       ```bash
       npx promptfoo@latest eval
       ```
     </TabItem>
     <TabItem value="npm" label="npm">
      ```bash
      promptfoo eval
      ```
     </TabItem>
     <TabItem value="brew" label="brew">
      ```bash
      promptfoo eval
      ```
     </TabItem>
   </Tabs>

   Bu, her promptu, modeli ve test durumunu sınar.

5. Değerlendirme tamamlandıktan sonra, çıktıları gözden geçirmek için web görüntüleyiciyi açın:

   <Tabs groupId="promptfoo-command">
     <TabItem value="npx" label="npx" default>
       ```bash
       npx promptfoo@latest view
       ```
     </TabItem>
     <TabItem value="npm" label="npm">
       ```bash
       promptfoo view
       ```
     </TabItem>
     <TabItem value="brew" label="brew">
       ```bash
       promptfoo view
       ```
     </TabItem>
   </Tabs>

![Promptfoo Web UI evaluasyon sonuçlarını gösteriyor](/img/docs/custom-example-view.png)

### Assertions

YAML yapılandırma formatı, her promptu bir dizi test durumundan geçirir ve belirtilen [assertions](/docs/configuration/expected-outputs/) karşılanıp karşılanmadığını kontrol eder.

Assertions _isteğe bağlıdır_. Birçok kişi çıktıları manuel olarak gözden geçirmekten faydalanır ve web arayüzü bunu kolaylaştırır.

:::tip
Ayrıntılı bir rehber için [Yapılandırma belgeleri](/docs/configuration/guide) başlığına bakın.
:::

## Örnekler

### Prompt kalitesi

[Bu örnekte](https://github.com/promptfoo/promptfoo/tree/main/examples/self-grading), yardımcı botun kişiliğine sıfatlar eklemenin yanıtları etkileyip etkilemediğini değerlendiririz.

Aşağıdaki komutu çalıştırarak bu örneği hızlı bir şekilde ayarlayabilirsiniz:

<Tabs groupId="promptfoo-command">
  <TabItem value="npx" label="npx" default>
    ```bash
    npx promptfoo@latest init --example self-grading
    ```
  </TabItem>
  <TabItem value="npm" label="npm">
    ```bash
    promptfoo init --example self-grading
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    promptfoo init --example self-grading
    ```
  </TabItem>
</Tabs>

<details>
<summary>Bu örnek için YAML dosyasını göster</summary>

```yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: LLM rubrik skorlaması kullanarak otomatik yanıt değerlendirmesi

# Promptları yükle
prompts:
  - file://prompts.txt
providers:
  - openai:gpt-5.2
defaultTest:
  assert:
    - type: llm-rubric
      value: Bir AI veya sohbet asistanı olduğunuzu belirtmeyin
    - type: javascript
      # Daha kısa daha iyi
      value: Math.max(0, Math.min(1, 1 - (output.length - 100) / 900));
tests:
  - vars:
      name: Bob
      question: Web sitenizde belirli bir ürünü bulmamda yardımcı olabilir misiniz?
  - vars:
      name: Jane
      question: Şu anda herhangi bir promosyon veya indirim var mı?
  - vars:
      name: Ben
      question: Belirli bir mağaza konumunda ürün bulunabilirliğini kontrol edebilir misiniz?
  - vars:
      name: Dave
      question: Kargo ve iade politikalarınız nelerdir?
  - vars:
      name: Jim
      question: Ürün özellikleri veya özellikleri hakkında daha fazla bilgi verebilir misiniz?
  - vars:
      name: Alice
      question: Baktığım ürünlere benzer ürünler önerebilir misiniz?
  - vars:
      name: Sophie
      question: Şu anda popüler veya trend olan ürünler hakkında herhangi bir öneriniz var mı?
  - vars:
      name: Jessie
      question: Siparişim gönderildikten sonra nasıl takip edebilirim?
  - vars:
      name: Kim
      question: Hangi ödeme yöntemlerini kabul ediyorsunuz?
  - vars:
      name: Emily
      question: Hesabım veya sipariş ile ilgili bir sorunda bana yardımcı olabilir misiniz?
```

</details>

Yeni oluşturulan dizinden, bu örneği çalıştırmak için `npx promptfoo@latest eval` komutunu çalıştırın:

![promptfoo komut satırı](/img/docs/self-grading.gif)

Bu komut, promptları değerlendirecek, değişken değerlerini değiştirecek ve sonuçları terminalinizde çıkaracaktır.

Ayrıca bir [elektronik tablo](https://docs.google.com/spreadsheets/d/1nanoj3_TniWrDl1Sj-qYqIMD6jwm5FBy15xPFdUTsmI/edit?usp=sharing), [JSON](https://github.com/promptfoo/promptfoo/blob/main/examples/simple-cli/output.json), YAML veya HTML biçiminde çıktı alabilirsiniz.

### Model kalitesi

[Bu sonraki örnekte](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-model-comparison), belirli bir prompt için GPT-5 ve GPT-5.2 çıktıları arasındaki farkı değerlendiririz:

Aşağıdaki komutu çalıştırarak bu örneği hızlı bir şekilde ayarlayabilirsiniz:

<Tabs groupId="promptfoo-command">
  <TabItem value="npx" label="npx" default>
    ```bash
    npx promptfoo@latest init --example openai-model-comparison
    ```
  </TabItem>
  <TabItem value="npm" label="npm">
    ```bash
    promptfoo init --example openai-model-comparison
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    promptfoo init --example openai-model-comparison
    ```
  </TabItem>
</Tabs>

<details>
<summary>Bu örneğe ait YAML dosyasını göster</summary>

```yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: OpenAI ana model ve mini model performansını bilmecelerde karşılaştırma

prompts:
  - 'Bu bilmeceyi çöz: {{riddle}}'

providers:
  - openai:gpt-5
  - openai:gpt-5-mini

defaultTest:
  assert:
    # Çıkarım her zaman bundan daha ucuz olmalı (USD)
    - type: cost
      threshold: 0.002
    # Çıkarım her zaman bundan daha hızlı olmalı (milisaniye)
    - type: latency
      threshold: 3000

tests:
  - vars:
      riddle: 'Ağız olmadan konuşurum ve kulaksız işitirim. Bedenim yoktur, fakat rüzgarla hayata gelirim. Ben ne miyim?'
    assert:
      # LLM çıktısının bu kelimeyi içerdiğinden emin olun
      - type: contains
        value: echo
      # Serbest biçimli talimatları uygulamak için model tarafından derecelendirilen assertions kullanın
      - type: llm-rubric
        value: Özür dilemeyin
  - vars:
      riddle: "İnsanlarla dolu bir tekne görürsünüz. Batmamıştır, ancak yeniden baktığınızda teknede tek bir kişi görmüyorsunuz. Neden?"
    assert:
      - type: llm-rubric
        value: tek bir insan olmadığını açıklar (hepsi evli)
  - vars:
      riddle: 'Bundan ne kadar çok varsa, o kadar az görürsünüz. Bu ne?'
    assert:
      - type: contains
        value: darkness
  - vars:
      riddle: >-
        Anahtarım var ama kilidim yok. Alanım var ama odamız yok. Girebilirsin ama
        çıkamaz. Ben ne miyim?
  - vars:
      riddle: >-
        Canlı değilim ama büyürüm; ciğerim yok ama hava gerekli; ağzım yok ama
        su beni öldürür. Ben ne miyim?
  - vars:
      riddle: Dünyanın etrafında dolaşmaya devam ederken bir köşede kalabilir mi?
  - vars:
      riddle: İleri doğru ağırım, ancak geriye doğru değilim. Ben ne miyim?
  - vars:
      riddle: >-
        Onu yapan kişi onu satar. Onu satın alan kişi asla kullanmaz.
        Onu kullanan kişi onu kullandığını bilmez. Bu ne?
  - vars:
      riddle: Çatlamış, yapılmış, söylenmiş ve oynanmış olabilirim. Ben ne miyim?
  - vars:
      riddle: Anahtarı var ama kilit açamaz?  
  - vars:
      riddle: >-
        Bir tüyün kadar hafifim, ancak en güçlü kişi beni bir dakikadan
        uzun süre tutamaz. Ben ne miyim?
  - vars:
      riddle: >-
        Kanatlar olmadan uçabilirim, göz olmadan ağlayabilirim. Nereye gitsem,
        karanlık beni takip eder. Ben ne miyim?
  - vars:
      riddle: >-
        Madenden çıkarılırım ve bir ahşap kutuya kapatılırım, buradan
        asla serbest bırakılmam, ancak yine de hemen hemen her kişi tarafından kullanılırım. Bu ne?
  - vars:
      riddle: >-
        David'in babası üç oğul vardır: Snap, Crackle ve _____? Üçüncü oğulun
        adı ne?
  - vars:
      riddle: >-
        Bir tüyün kadar hafifim, ancak dünyanın en güçlü adamı beni
        çok daha fazlasında tutamaz. Ben ne miyim?
```

</details>

Dizin içerisine gidip `npx promptfoo@latest eval` veya `promptfoo eval` komutunu çalıştırın. Ayrıca komut satırından parametreleri doğrudan geçersiz kılabileceğinizi unutmayın.

Örneğin, şu komutu çalıştırırsanız:

<Tabs groupId="promptfoo-command">
  <TabItem value="npx" label="npx" default>
    ```bash
    npx promptfoo@latest eval -r google:gemini-3-pro-preview google:gemini-2.5-pro
    ```
  </TabItem>
  <TabItem value="npm" label="npm">
    ```bash
    promptfoo eval -r google:gemini-3-pro-preview google:gemini-2.5-pro
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    promptfoo eval -r google:gemini-3-pro-preview google:gemini-2.5-pro
    ```
  </TabItem>
</Tabs>

Bu, konfigürasyondaki GPT modellerinin yerine Gemini modellerinin geçtiği aşağıdaki tabloyu üretir:

![Gemini ve GPT model kalitesi yan yana değerlendirmesi, gemini-3.0-pro vs gemini-2.5](/img/cl-provider-override.png)

Benzer bir yaklaşım diğer model karşılaştırmaları için de kullanılabilir. Örneğin:

- Farklı sıcaklıklardaki modelleri karşılaştırın (bkz. [GPT sıcaklık karşılaştırması](https://github.com/promptfoo/promptfoo/tree/main/examples/gpt-4o-temperature-comparison))
- Llama ile GPT'yi karşılaştırın (bkz. [Llama vs GPT karşılaştırması](/docs/guides/compare-llama2-vs-gpt))
- LangChain ile RAG'i normal GPT-4 ile karşılaştırın (bkz. [LangChain örneği](/docs/configuration/testing-llm-chains))

## Sonraki adımlar

İlk değerlendirmenizi çalıştırdıktan sonra daha derinlemesine incelemek için bazı yollar:

**Kurulumu özelleştirin:**

- [Yapılandırma rehberi](/docs/configuration/guide) - Tüm yapılandırma seçeneklerinin ayrıntılı açıklaması
- [Sağlayıcı belgeleri](/docs/providers) - Desteklenen 60+ AI modeli ve servis
- [Assert'ler & Metrikler](/docs/configuration/expected-outputs) - Çıktıları otomatik olarak geç/kalır şeklinde değerlendirme

**Kullanım senaryolarını keşfedin:**

- [RAG değerlendirmesi](/docs/guides/evaluate-rag) - Retrieval-augmented generation akışlarını test etme
- [Red teaming hızlı başlangıç](/docs/red-team/quickstart) - LLM uygulamanızı güvenlik açısından tarama
- [CI/CD entegrasyonu](/docs/integrations/github-action) - Değerlendirmeleri her PR'da otomatik çalıştırma

**Örneklerden öğrenin:**

- [Daha fazla örnek](https://github.com/promptfoo/promptfoo/tree/main/examples) GitHub deposu içinde