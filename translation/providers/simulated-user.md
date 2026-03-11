---
sidebar_label: Simüle Edilmiş Kullanıcı (Simulated User)
description: Diyalog bazlı yapay zeka sistemlerinin ve sohbet robotlarının kapsamlı testi için gerçekçi kullanıcı etkileşimlerini ve davranışlarını simüle edin
---

# Simüle Edilmiş Kullanıcı (Simulated User)

Simüle Edilmiş Kullanıcı Sağlayıcı, bir yapay zeka ajanı ile simüle edilmiş bir kullanıcı arasındaki çok turlu konuşmaların test edilmesini sağlar. Bu, özellikle sohbet robotlarını, sanal asistanları ve diğer diyalog bazlı yapay zeka uygulamalarını gerçekçi senaryolarda test etmek için kullanışlıdır.

Hem basit metin tabanlı ajanlarla hem de gelişmiş fonksiyon çağırma (function-calling) ajanlarıyla çalışır; bu da onu yapılandırılmış API'ler kullanan modern yapay zeka sistemlerini test etmek için ideal kılar.

Araç destekli ajanları değerlendirmek için bir kıyaslama aracı olan [Tau-bench](https://github.com/sierra-research/tau-bench)'ten esinlenilmiştir.

## Yapılandırma

Simüle Edilmiş Kullanıcı Sağlayıcıyı kullanmak için sağlayıcı `id` değerini `promptfoo:simulated-user` olarak ayarlayın ve yapılandırma seçeneklerini sağlayın:

```yaml
tests:
  - provider:
      id: 'promptfoo:simulated-user'
      config:
        maxTurns: 10
        instructions: 'Siz mia_li_3668 kullanıcısınız. 20 Mayıs"ta New York"tan Seattle"a uçmak istiyorsunuz (tek yön). EST saatiyle sabah 11"den önce uçmak istemiyorsunuz. Ekonomi sınıfında uçmak istiyorsunuz. Direkt uçuşları tercih edersiniz ancak bir aktarma da kabul edilebilir. Birden fazla seçenek varsa, en düşük fiyatlı olanı tercih edersiniz. 3 çantanız var. Sigorta istemiyorsunuz. Ödeme yapmak için iki sertifikanızı kullanmak istiyorsunuz. Sadece bir sertifika kullanılabiliyorsa büyük olanı kullanmayı tercih edersiniz ve geri kalanını 7447 kartınızla ödersiniz. Ajana karşı reaktifsiniz ve sorulmayan hiçbir şeyi söylemezsiniz. Doğum gününüz kullanıcı profilinizde var, bu yüzden onu ayrıca belirtmeyi tercih etmezsiniz.'
```

Sağlayıcıyı `defaultTest` üzerinde ayarlamak en kolayı olabilir; bu, `instructions` (talimatlar) değişkenini kullanarak her testi simüle edilmiş bir kullanıcı konuşmasına dönüştürür:

```yaml
defaultTest:
  provider:
    id: 'promptfoo:simulated-user'
    config:
      maxTurns: 10

tests:
  - vars:
      instructions: 'Siz mia_li_3668 kullanıcısınız...'
```

## Nasıl Çalışır?

Simüle Edilmiş Kullanıcı Sağlayıcı, şunlar arasında karşılıklı bir konuşma sağlar:

1. Simüle edilmiş bir kullanıcı (promptfoo tarafından kontrol edilir)
2. Yapay zeka ajanınız (test edilen sağlayıcı)

Her tur için:

1. Simüle edilmiş kullanıcının mesajı ajana gönderilir.
2. Ajandan gelen yanıt simüle edilmiş kullanıcıya geri gönderilir.
3. Simüle edilmiş kullanıcı, talimatlarına göre bir sonraki mesajı oluşturur.
4. Bu süreç şunlardan biri gerçekleşene kadar devam eder:
   - Maksimum tur sayısına (`maxTurns`) ulaşılması.
   - Ajansın, konuşmanın doğal bir sonuca ulaştığına karar vermesi.

## Yapılandırma Seçenekleri

| Seçenek           | Tür                  | Açıklama                                                                                                                       |
| ----------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `instructions`    | dize (string)        | Kullanıcı talimatları için şablon. Test değişkenlerine erişimi olan Nunjucks şablonlamayı destekler.                            |
| `maxTurns`        | sayı (number)        | Maksimum konuşma turu sayısı. Varsayılan değer 10'dur.                                                                         |
| `initialMessages` | Message[] veya dize | İsteğe bağlı. Başlanacak önceden tanımlanmış konuşma geçmişi. Bir mesaj dizisi veya `file://` yolu (JSON/YAML formatları) olabilir. |

## Başlangıç Mesajları (Initial Messages)

Önceden tanımlanmış bir konuşma geçmişi sağlayarak konuşmaları belirli bir durumdan başlatın. Konuşma ortası senaryolarını test etmek, hataları yeniden oluşturmak veya gereksiz simüle edilmiş turlardan kaçınmak için kullanışlıdır.

Mesajları taslak haline getirmek ve tekrardan kaçınmak için değişkenler kullanın:

```yaml
defaultTest:
  provider:
    id: 'promptfoo:simulated-user'
    config:
      maxTurns: 3
      initialMessages:
        - role: user
          content: Uçuşumu seçtim ve rezervasyon yapmaya hazırım
        - role: assistant
          content: Harika! Nasıl ödeme yapmak istersiniz?
        - role: user
          content: {{payment_method}} ile ödeme yapmak istiyorum # Değişken

tests:
  - vars:
      payment_method: kredi kartı # {{payment_method}} yerine geçer
      instructions: Kredi kartı ile ödemeyi tamamla

  - vars:
      payment_method: PayPal # {{payment_method}} yerine geçer
      instructions: PayPal ile ödemeyi tamamla
```

Başlangıç mesajları hem `role` hem de `content` alanlarında Nunjucks şablonlamayı destekler. Bunları `config.initialMessages` (paylaşılan) veya `vars.initialMessages` (test başına, önceliklidir) içinde tanımlayın.

### Dosyalardan Yükleme

Daha uzun konuşma geçmişlerini JSON veya YAML dosyalarından yükleyin:

```yaml
tests:
  - vars:
      initialMessages: file://./conversation-history.json
      instructions: Bir uçuş seçtiniz ve seyahat sertifikalarıyla ödeme yapmak istiyorsunuz
```

```json
[
  { "role": "user", "content": "NYC'den Seattle'a bir uçuşa ihtiyacım var" },
  { "role": "assistant", "content": "325 $'a direkt bir uçuş buldum" },
  { "role": "user", "content": "Evet, bu benim için uygun" }
]
```

Dosya tabanlı mesajlar da değişken şablonlamayı destekler.

:::info Başlangıç Mesajları ile maxTurns Nasıl Çalışır?

`maxTurns`, başlangıç mesajlarından SONRA simüle edilecek **yeni** konuşma turlarının sayısını kontrol eder. Başlangıç mesajları `maxTurns` sayısına dahil edilmez.

Örneğin:

- `initialMessages`: 4 mesaj (2 kullanıcı + 2 asistan = 2 değişim)
- `maxTurns`: 3
- **Sonuç**: 4 başlangıç mesajı + 3'e kadar yeni tur = toplamda 10'a kadar mesaj

Bu, belirli bir konuşma durumundan test yaparken ne kadar yeni etkileşim gerçekleşeceğini kontrol etmenizi sağlar.

:::

## Örnek

Müşteri hizmetleri ajanını test eden basit bir örnek:

```yaml title="promptfooconfig.yaml"
prompts:
  - Siz yardımsever bir müşteri hizmetleri ajanısınız. Soruları nazikçe yanıtlayın ve sorunları çözmeye çalışın.

providers:
  - openai:gpt-5-mini

defaultTest:
  provider:
    id: 'promptfoo:simulated-user'
    config:
      maxTurns: 5

tests:
  - vars:
      instructions: Siz paketi yanlış adrese teslim edilmiş hayal kırıklığına uğramış bir müşterisiniz. Para iadesi istiyorsunuz ancak teklif edilirse mağaza kredisini kabul etmeye hazırsınız.
```

### Gelişmiş Fonksiyon Çağırma (Advanced Function Calling)

Fonksiyon çağırma içeren karmaşık senaryolar için sahte (mock) uygulamalarla yapılandırılmış API'ler tanımlayabilirsiniz:

```yaml
providers:
  - id: openai:gpt-5-mini
    config:
      tools:
        - file://functions/search_flights.json
      functionToolCallbacks:
        search_flights: file://callbacks/airline-functions.js:searchFlights
```

Burada `functions/search_flights.json` fonksiyon şemasını tanımlar ve `callbacks/airline-functions.js` gerçekçi veriler döndüren sahte uygulamayı içerir.

Çıktı, her turun "---" ile ayrıldığı tam konuşma geçmişini gösterecektir:

```
Kullanıcı: 20 Mayıs'ta New York'tan Seattle'a uçuş rezervasyonu yapmak için yardıma ihtiyacım var
Asistan: Memnuniyetle yardımcı olurum! Profilinize erişebilmem için kullanıcı kimliğinizi verebilir misiniz?

---

Kullanıcı: mia_li_3668
Asistan: [uçuşları aramak için fonksiyon çağrısı yapar]
20 Mayıs'ta New York'tan Seattle'a olan uçuşları arayayım...

---

Kullanıcı: Direkt uçuşları tercih ederim ama daha ucuzsa aktarma da olabilir ###STOP###
```

### Değerlendirme ve İddialar (Assertions)

Konuşma kalitesini otomatik olarak değerlendirmek için iddialar ekleyebilirsiniz:

```yaml
tests:
  - vars:
      instructions: Siz 350 $'ın altında ekonomi uçuşu isteyen bütçe dostu bir gezginsiniz
    assert:
      - type: llm-rubric
        value: |
          Bütçe dostu gezgin istediğini aldı mı?
          Geçer: 350 $'ın altında ekonomi uçuşu aldı ve ödeme için sertifikaları kullandı
          Kalır: Ekonomi sınıfı rezervasyon yapamadı veya 400 $'ın üzerinde pahalı bir uçuş aldı
```

Bu, ajanınızın farklı müşteri tiplerini ve senaryolarını başarılı bir şekilde yönetip yönetmediğinin otomatik olarak değerlendirilmesini sağlar.

31 müşteri personası ve kapsamlı iddialar içeren eksiksiz bir çalışan örnek için [Simüle Edilmiş Kullanıcı örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/tau-simulated-user) bakın.

### Özel Sağlayıcılar (Custom Providers) ile Kullanım

Simüle Edilmiş Kullanıcı Sağlayıcı, özel sağlayıcılarla (Python, JavaScript vb.) sorunsuz çalışır. Tüm test düzeyi `vars` değişkenleri otomatik olarak özel sağlayıcınızın bağlamına (context) aktarılır; bu da konuşmalar sırasında kullanıcı kimlikleri, oturum verileri veya yönlendirme bilgileri gibi dinamik değerlere erişmenize olanak tanır.

```yaml
providers:
  - id: file://my_custom_agent.py
    config:
      base_url: https://api.example.com

defaultTest:
  provider:
    id: 'promptfoo:simulated-user'
    config:
      maxTurns: 5

tests:
  - vars:
      workflow_id: 'wf-123'
      session_id: 'sess-456'
      instructions: |
        Uçuş rezervasyonu yapıyorsunuz. İsteğinizi takip etmek için iş akışı kimliğini (workflow ID) isteyin.
```

Özel sağlayıcınızda bu değişkenlere erişebilirsiniz:

```python
def call_api(prompt, options, context):
    # Simüle edilmiş konuşmadan değişkenlere erişin
    workflow_id = context['vars']['workflow_id']  # "wf-123"
    session_id = context['vars']['session_id']    # "sess-456"

    # Bunları mantığınızda kullanın
    response = f"Bunu iş akışı {workflow_id} olarak takip edeceğim..."
    return {"output": response}
```

Bu, özel sağlayıcınızın şunları yapabildiği gelişmiş test senaryolarını mümkün kılar:

- İstekleri bağlam değişkenlerine göre yönlendirmek
- Oturum kimliklerini (session ID) kullanarak konuşma durumunu korumak
- Kişiselleştirilmiş yanıtlar için kullanıcıya özel verilere erişmek
- Çok turlu konuşmaları test ederken karmaşık iş mantığını uygulamak

## Kütüphane Olarak Kullanma

Promptfoo'yu bir Node kütüphanesi olarak kullanırken eşdeğer yapılandırmayı sağlayın:

```js
{
  providers: [
    {
      id: 'promptfoo:simulated-user',
      config: {
        instructions: 'Şu sorunu olan bir müşterisiniz: {{problem}}',
        maxTurns: 5,
      },
    },
  ];
}
```

## Durdurma Koşulları (Stop Conditions)

Konuşma şu durumlarda otomatik olarak duracaktır:

- `maxTurns` sınırına ulaşıldığında
- Ajan yanıtına herhangi bir yerde `###STOP###` eklediğinde
- Konuşma sırasında bir hata oluştuğunda

`###STOP###` işareti, bir konuşmanın ne zaman doğal bir sonuca ulaştığını (örneğin görev tamamlandı, kullanıcı memnun) belirleyebilen ajanlar için kullanışlıdır.

## Uzaktan Üretim (Remote Generation)

Varsayılan olarak Simüle Edilmiş Kullanıcı, Promptfoo'nun barındırılan konuşma modellerini kullanır. Hedef modeliniz her zaman yerel olarak çalışır; sadece simüle edilmiş kullanıcı yanıtları uzaktan üretilir.

Uzaktan üretimi devre dışı bırakmak için `PROMPTFOO_DISABLE_REMOTE_GENERATION=true` ayarını yapın. Hangi verilerin gönderildiğine dair ayrıntılar için [Gizlilik Politikası](/privacy#remote-generation) sayfasına bakın.

## Sınırlamalar

Simüle edilmiş kullanıcı sağlayıcı, hedef uç noktanın mesajları OpenAI sohbet formatında kabul ettiğini varsayar:

```ts
type Messages = {
  role: 'user' | 'assistant' | 'system';
  content: string;
}[];
```

Orijinal istem, ajanın davranışını başlatmak için bir sistem mesajı olarak gönderilir. Fonksiyon çağıran ajanlar için fonksiyon tanımlarınızı sağlayıcı yapılandırmasına ekleyin.

## Hata Ayıklama (Debugging)

Ajan ile simüle edilmiş kullanıcı arasında gönderilen her mesaj dahil olmak üzere konuşma akışının ayrıntılı günlüklerini görmek için `LOG_LEVEL=debug` ortam değişkenini ayarlayın.

```bash
LOG_LEVEL=debug promptfoo eval
```
