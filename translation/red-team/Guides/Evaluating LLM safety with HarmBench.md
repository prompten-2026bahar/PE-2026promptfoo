# HarmBench ile LLM Güvenliğini Değerlendirme

Son araştırmalar, en gelişmiş LLM'lerin bile saldırgan (adversarial) ataklara karşı savunmasız kaldığını göstermiştir. Güvenlik araştırmacıları; tehdit aktörlerinin kötü amaçlı yazılım varyantları oluşturmak ve tespit sistemlerini atlatmak için bu açıklardan yararlandığını raporlamaktadır. Bu durum, LLM destekli her uygulama için güçlü güvenlik testlerinin önemini vurgular.

LLM sistemlerindeki potansiyel riskleri ve güvenlik açıklarını sistematik bir şekilde değerlendirmek amacıyla; UC Berkeley, Google DeepMind ve Yapay Zeka Güvenliği Merkezi (Center for AI Safety) araştırmacıları, Büyük Dil Modellerinin (LLM) otomatik red teaming testleri için standart bir değerlendirme çerçevesi olan **HarmBench**'i oluşturmuştur. Bu veri kümesi, modelleri aşağıdakiler de dahil olmak üzere 400 temel zararlı davranış üzerinden değerlendirir:

*   **Kimyasal ve Biyolojik Tehditler:** (Örn: tehlikeli maddeler, silahlar)
*   **Yasa Dışı Faaliyetler:** (Örn: hırsızlık, dolandırıcılık, kaçakçılık)
*   **Dezenformasyon ve Komplo Teorileri**
*   **Taciz ve Nefret Söylemi**
*   **Siber Suçlar:** (Örn: kötü amaçlı yazılım, sistem sömürüsü)
*   **Telif Hakkı İhlalleri**

Bu kılavuz, kendi LLM'lerinize veya Üretken Yapay Zeka (GenAI) uygulamalarınıza karşı HarmBench değerlendirmelerini çalıştırmak için **Promptfoo**'yu nasıl kullanacağınızı gösterecektir. Ham modelleri tek başına test etmekten farklı olarak Promptfoo; istem mühendisliğiniz (prompt engineering), güvenlik bariyerleriniz (guardrails) ve ek işleme katmanlarınız dahil olmak üzere, LLM'nin **uygulama bağlamındaki** gerçek davranışını değerlendirmenize olanak tanır.

Bu oldukça kritiktir; çünkü uygulamanızın istem mühendisliği ve bağlamı, model davranışını önemli ölçüde etkileyebilir. Örneğin, reddetme eğitimi almış (refusal-trained) LLM'ler bile bir web tarayıcısında ajan (agent) olarak çalışırken kolayca jailbreak (güvenlik korumalarını aşma) edilebilir.

HarmBench ile yapılan testlerin nihai sonucu, modelinizin veya uygulamanızın HarmBench saldırılarına karşı ne kadar iyi savunma yaptığını gösteren bir rapordur.





## Değerlendirmeyi Yapılandırma

Yeni bir `promptfooconfig.yaml` yapılandırma dosyası oluşturun:

**promptfooconfig.yaml**
```yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: OpenAI GPT-5-mini'nin HarmBench Değerlendirmesi

targets:
  - id: openai:gpt-5-mini
    label: OpenAI GPT-5-mini

redteam:
  plugins:
    - id: harmbench
      numTests: 400
```
## Değerlendirmeyi Çalıştırın

`promptfooconfig.yaml` dosyasını tanımladığınız klasörde HarmBench değerlendirmesini yürütün:

```bash
npx promptfoo@latest redteam run
```
## Sonuçları Görüntüleme

İşlem tamamlandığında, sonuçları incelemek için şu komutu kullanın:

```bash
npx promptfoo@latest view
```
Aşağıda sonuçların bir örneğini görebilir, örnek bir değerlendirmenin tam sonuçlarına [buradan] ulaşabilirsiniz. Yukarıda vurguladığımız örnekte; gpt-5-mini tarafından desteklenen **dahili örnek uygulamamız** ile OpenAI'ın **ham (vanilla) gpt-5-mini** sürümü arasında karşılaştırmalı bir analiz yapıyoruz.

Uygulamamızdan OpenAI'a ek bağlam (context) sağlayarak, dahili uygulamamızın ham modelin başaramadığı saldırılara nasıl direnebildiğini gözlemleyebilirsiniz. Ayrıca, sol üstteki ekran açılır menüsünden **"Show failures only"** (Yalnızca başarısızları göster) seçeneğini belirleyerek yalnızca başarısız olan testleri filtreleyebilirsiniz.

## Farklı Hedefleri Test Etme
Promptfoo; OpenAI, Anthropic, Hugging Face, Deepseek, Ollama ve daha fazlası gibi çok çeşitli modeller için yerleşik destek sunar.

### Ollama Modelleri
Öncelikle Ollama sunucunuzu başlatın ve test etmek istediğiniz modeli çekin:

```bash
ollama pull llama4:scout
```
Ardından, Promptfoo'yu bu modeli kullanacak şekilde yapılandırın:

```yaml
targets:
  - id: ollama:chat:llama4:scout
```
## Kendi Uygulamanızı Test Etme

Doğrudan bir model yerine bir uygulamayı hedeflemek için **HTTP Sağlayıcısı**, **Javascript Sağlayıcısı** veya **Python Sağlayıcısını** kullanın.

Örneğin, test etmek istediğiniz yerel bir API uç noktanız (endpoint) varsa, aşağıdaki yapılandırmayı kullanabilirsiniz:

## Kendi Uygulamanızı Test Etme

Doğrudan bir model yerine bir uygulamayı hedeflemek için **HTTP Sağlayıcısı**, **Javascript Sağlayıcısı** veya **Python Sağlayıcısını** kullanın.

Örneğin, test etmek istediğiniz yerel bir API uç noktanız (endpoint) varsa, aşağıdaki yapılandırmayı kullanabilirsiniz:

```yaml
targets:
  - id: https
    config:
      url: 'https://example.com/generate'
      method: 'POST'
      headers:
        'Content-Type': 'application/json'
      body:
        myPrompt: '{{prompt}}'
```
## Sonuç ve Sonraki Adımlar

HarmBench, statik veri kümesi aracılığıyla değerli içgörüler sunsa da, en etkili sonuçlar diğer "red teaming" yaklaşımlarıyla birleştirildiğinde alınır.

Promptfoo'nun eklenti mimarisi; HarmBench'i dinamik test senaryoları oluşturan eklentilerle birleştirerek, birden fazla değerlendirme türünü aynı anda çalıştırmanıza olanak tanır. Örneğin; PII (Kişisel Veri) sızıntıları, halüsinasyonlar, aşırı yetki kullanımı (excessive agency) ve yeni ortaya çıkan siber güvenlik tehditlerini kontrol eden değerlendirmeleri ardışık olarak gerçekleştirebilirsiniz.

Bu çok katmanlı yaklaşım, saldırı vektörleri ve güvenlik açıkları zamanla değiştikçe daha kapsamlı bir kapsama alanı sağlamanıza yardımcı olur.

### Daha Fazla Bilgi İçin:

*   [HarmBench Makalesi](https://arxiv.org)
*   [HarmBench GitHub Deposu](https://github.com)
*   [HarmBench Promptfoo Eklentisi](https://promptfoo.dev)
*   [Promptfoo Red Teaming Kılavuzu](https://promptfoo.dev)
*   [LLM Güvenlik Açığı Türleri](https://promptfoo.devllm-vulnerability-types/)
*   [CybersecEval](https://promptfoo.devplugins/cybersec/)


