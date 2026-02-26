---
sidebar_position: 1
description: LLM uygulamalarını otomatik testler, red teaming ve benchmark ile değerlendirin ve güvence altına alın. 50+ sağlayıcı arasında çıktıları karşılaştırın.
---

# Giriş

`promptfoo`, LLM uygulamalarını değerlendirmek ve red-teaming yapmak için bir [açık kaynak](https://github.com/promptfoo/promptfoo) CLI ve kütüphanedir.  

Promptfoo ile şunları yapabilirsiniz:

- **Güvenilir promptlar, modeller ve RAG’ler oluşturun**; kullanım senaryonuza özel benchmark’lar ile  
- **Uygulamalarınızı güvence altına alın**; otomatik [red teaming](/docs/red-team) ve pentesting ile  
- **Değerlendirmeleri hızlandırın**; önbellekleme, eşzamanlılık ve canlı yeniden yükleme ile  
- **Çıktıları otomatik puanlayın**; [metrikler](/docs/configuration/expected-outputs) tanımlayarak  
- [CLI](/docs/usage/command-line), [kütüphane](/docs/usage/node-package) veya [CI/CD entegrasyonlarında](/docs/integrations/github-action) kullanın  
- OpenAI, Anthropic, Azure, Google, HuggingFace, Llama gibi açık kaynak modeller veya kendi özel API sağlayıcılarınızı [herhangi bir LLM API için](/docs/providers) entegre edin  

Amaç: **deneme-yanılma yerine test odaklı LLM geliştirme**.

:::tip Başlarken

- [**Red teaming**](/docs/red-team/quickstart) - Güvenlik açıklarını ve uyumluluk risklerini tarayın  
- [**Değerlendirmeler**](/docs/getting-started) - Promptlarınızın, modellerinizin ve uygulamalarınızın kalitesini ve doğruluğunu test edin  

:::

Promptfoo, birden fazla promptun çıktısını hızlıca değerlendirebileceğiniz matris görünümleri üretir.  

İşte birden fazla prompt ve girişin yan yana karşılaştırılması örneği:

![Yan yana LLM prompt kalite değerlendirmesi](https://github.com/promptfoo/promptfoo/assets/310310/ce5a7817-da82-4484-b26d-32474f1cabc5)

Komut satırında da çalışır:

![PASS/FAIL beklentileri ile LLM prompt kalite değerlendirmesi](https://user-images.githubusercontent.com/310310/236690475-b05205e8-483e-4a6d-bb84-41c2b06a1247.png)

Promptfoo ayrıca üst düzey güvenlik açıkları ve risk raporları üretir:

![gen ai red team](./img/riskreport-1@2x-4c0fbea80c8816901144bc951702ed91.png)

## Neden promptfoo?

Promptları değerlendirmek için birçok farklı yöntem var. İşte promptfoo’yu tercih etmeniz için bazı sebepler:

- **Geliştirici dostu**: Promptfoo hızlıdır ve canlı yeniden yükleme ile önbellekleme gibi yaşam kalitesi özellikleri sunar.  
- **Test edilmiş**: Başlangıçta, üretimde 10 milyonun üzerinde kullanıcıya hizmet veren LLM uygulamaları için geliştirilmiştir. Araçlarımız esnektir ve birçok farklı kuruluma uyarlanabilir.  
- **Basit, deklaratif test vakaları**: Kod yazmadan veya ağır notebook’larla uğraşmadan değerlendirme tanımlayın.  
- **Dil bağımsız**: Python, JavaScript veya başka bir dil kullanın.  
- **Paylaş & iş birliği yap**: Yerleşik paylaşım özelliği ve web görüntüleyici ile ekip arkadaşlarınızla çalışın.  
- **Açık kaynak**: LLM değerlendirmeleri bir emtia gibidir ve %100 açık kaynak projeler tarafından sunulmalıdır, hiçbir ek koşul olmadan.  
- **Özel**: Bu yazılım tamamen yerel olarak çalışır. Değerlendirmeler sizin makinenizde gerçekleşir ve LLM ile doğrudan iletişim kurar.  

## İş akışı ve felsefe

Test odaklı prompt mühendisliği, deneme-yanılma yönteminden çok daha etkilidir.  

[Ciddi LLM geliştirme, sistematik bir prompt mühendisliği yaklaşımı gerektirir](https://www.ianww.com/blog/2023/05/21/prompt-engineering-framework). Promptfoo, dil modeli performansını değerlendirme ve geliştirme sürecini kolaylaştırır.

1. **Test vakalarını tanımlayın**: Temel kullanım senaryolarını ve hata modlarını belirleyin. Bu senaryoları temsil eden prompt ve test vakaları hazırlayın.  
2. **Değerlendirmeyi yapılandırın**: Promptları, test vakalarını ve API sağlayıcılarını belirleyerek değerlendirmeyi kurun.  
3. **Değerlendirmeyi çalıştırın**: Komut satırı aracı veya kütüphaneyi kullanarak değerlendirmeyi çalıştırın ve her prompt için model çıktısını kaydedin.  
4. **Sonuçları analiz edin**: Otomatik gereksinimler oluşturun veya sonuçları yapılandırılmış format/web UI’da inceleyin. Bu sonuçları, kullanım senaryonuza en uygun model ve promptu seçmek için kullanın.  
5. **Geri bildirim döngüsü**: Daha fazla örnek ve kullanıcı geri bildirimi topladıkça, test vakalarınızı genişletmeye devam edin.  

<div style={{backgroundColor: 'var(--ifm-background-surface-color)', padding: '1rem', borderRadius: '8px'}}>

![llm değerlendirme akışı](./img/riskreport-1@2x-4c0fbea80c8816901144bc951702ed91.svg)

</div>