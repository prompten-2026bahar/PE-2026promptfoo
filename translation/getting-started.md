---
title: Başlarken
description: İlk promptfoo yapılandırma dosyanızı nasıl oluşturacağınızı, promptları nasıl yazacağınızı, sağlayıcıları nasıl yapılandıracağınızı ve ilk LLM değerlendirmenizi nasıl çalıştıracağınızı öğrenin.
keywords: [başlarken, kurulum, yapılandırma, promptlar, sağlayıcılar, değerlendirme, llm testleri]
sidebar_position: 5
---

# Başlarken

[promptfoo](/docs/installation) yüklendikten sonra ilk yapılandırma dosyanızı birkaç şekilde oluşturabilirsiniz:

## Bir örneği çalıştırma

Hazır bir örnek kullanarak ilk yapılandırma dosyanızı oluşturmak için aşağıdaki komutlardan birini kullanın (örneğin `npx`, `npm` veya `brew`):

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

Bu, prompt oluşturma, sağlayıcı seçme ve test vakası ekleme adımlarında size rehberlik eden tarayıcı tabanlı bir kurulum akışı açar.

<div style={{ textAlign: 'center' }}>   
  <img src="/img/docs/eval-setup.png" alt="Promptfoo eval setup Web UI" style={{ width: '80%' }} />
</div>

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

- GitHub deposundaki [daha fazla örnek](https://github.com/promptfoo/promptfoo/tree/main/examples)