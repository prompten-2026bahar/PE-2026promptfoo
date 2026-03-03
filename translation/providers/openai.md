---
sidebar_position: 1
description: "GPT-4o, o1, GPT-3.5, gömmeler ve asistanlar dahil olmak üzere OpenAI'ın GPT modellerini kapsamlı yapay zeka değerlendirmeleri için yapılandırın"
---

# OpenAI

OpenAI API'sini kullanmak için `OPENAI_API_KEY` ortam değişkenini ayarlayın, yapılandırma dosyasındaki `apiKey` alanı aracılığıyla belirtin veya API anahtarını kurucuya (constructor) bir argüman olarak iletin.

Örnek:

```sh
export OPENAI_API_KEY=api_anahtarınız_buraya
```

OpenAI sağlayıcısı aşağıdaki model formatlarını destekler:

- `openai:chat:<model name>` - `/v1/chat/completions` uç noktasına karşı herhangi bir model adını kullanır
- `openai:responses:<model name>` - HTTP bağlantıları üzerinden responses API modellerini kullanır
- `openai:assistant:<assistant id>` - bir asistan kullanır
- `openai:<model name>` - belirli bir model adını kullanır (otomatik olarak sohbet veya tamamlama uç noktasına eşlenir)
- `openai:chat` - varsayılan olarak `gpt-5-mini` kullanılır
- `openai:chat:ft:gpt-5-mini:company-name:ID` - ince ayar yapılmış (fine-tuned) bir sohbet tamamlama modeli örneği
- `openai:completion` - varsayılan olarak `text-davinci-003` kullanılır
- `openai:completion:<model name>` - `/v1/completions` uç noktasına karşı herhangi bir model adını kullanır
- `openai:embeddings:<model name>` - `/v1/embeddings` uç noktasına karşı herhangi bir model adını kullanır
- `openai:realtime:<model name>` - WebSocket bağlantıları üzerinden realtime API modellerini kullanır
- `openai:video:<model name>` - Sora video üretim modellerini kullanır

`openai:<endpoint>:<model name>` yapısı, OpenAI yeni bir model yayınladığında veya özel bir modeliniz olduğunda yararlıdır.
Örneğin, OpenAI `gpt-5` sohbet tamamlamayı yayınlarsa, bunu hemen `openai:chat:gpt-5` ile kullanmaya başlayabilirsiniz.

```yaml title="Sadece GPT-5 için: ayrıntı ve minimal akıl yürütme"
providers:
  - id: openai:chat:gpt-5
    config:
      verbosity: high # low | medium | high
      reasoning_effort: minimal
  # Responses API için iç içe geçmiş bir reasoning nesnesi kullanın:
  - id: openai:responses:gpt-5
    config:
      reasoning:
        effort: minimal
```

OpenAI sağlayıcısı; modelin davranışını özelleştirmek için kullanılabilecek `temperature`, `functions` ve `tools` gibi bir avuç [yapılandırma seçeneğini](https://github.com/promptfoo/promptfoo/blob/main/src/providers/openai/types.ts#L112-L185) destekler:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:gpt-5-mini
    config:
      temperature: 0
      max_tokens: 1024
```

> **Not:** OpenAI modellerine, ek kurumsal özellikler, uyumluluk seçenekleri ve bölgesel kullanılabilirlik sunan [Azure OpenAI](/docs/providers/azure/) aracılığıyla da erişilebilir.

## Sohbet mesajlarını formatlama

Sohbet konuşması ayarlama hakkında bilgi için bkz. [sohbet iş parçacıkları (chat threads)](/docs/configuration/chat).

## Parametreleri yapılandırma

`providers` listesi, `temperature`, `max_tokens` ve [diğerleri](https://platform.openai.com/docs/api-reference/chat/create#chat/create-temperature) gibi parametreleri ayarlamanıza olanak tanıyan bir `config` anahtarı alır. Örneğin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:gpt-5-mini
    config:
      temperature: 0
      max_tokens: 128
      apiKey: sk-abc123
```

Desteklenen parametreler şunları içerir:

| Parametre               | Açıklama                                                                                                                                                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiBaseUrl`            | OpenAI API'sinin temel URL'si, lütfen aşağıdaki `OPENAI_BASE_URL` bölümünü de okuyun.                                                                                                                                                                                                              |
| `apiHost`               | OpenAI API'sinin ana makine adı, lütfen aşağıdaki `OPENAI_API_HOST` bölümünü de okuyun.                                                                                                                                                                                                             |
| `apiKey`                | OpenAI API anahtarınız, `OPENAI_API_KEY` ortam değişkenine eşdeğerdir.                                                                                                                                                                                                                             |
| `apiKeyEnvar`           | API anahtarını içeren bir ortam değişkeni.                                                                                                                                                                                                                                                        |
| `best_of`               | Oluşturulacak ve aralarından seçim yapılacak alternatif çıktıların sayısını kontrol eder.                                                                                                                                                                                                           |
| `frequency_penalty`     | Sık kullanılan tokenlara ceza uygulayarak çıktı da görünme olasılıklarını azaltır.                                                                                                                                                                                                                |
| `function_call`         | Yapay zekanın fonksiyonları çağırıp çağırmayacağını kontrol eder. 'none', 'auto' veya çağrılacak fonksiyonu belirten `name` içeren bir nesne olabilir.                                                                                                                                             |
| `functions`             | Özel fonksiyonlar tanımlamanıza olanak tanır. Her fonksiyon `name`, isteğe bağlı `description` ve `parameters` içeren bir nesne olmalıdır.                                                                                                                                                        |
| `functionToolCallbacks` | Fonksiyon aracı adlarının fonksiyon geri çağırmalarına (callbacks) eşlenmesi. Her geri çağırma bir dize kabul etmeli ve bir dize veya `Promise<string>` döndürmelidir.                                                                                                                            |
| `headers`               | İsteğe dahil edilecek ek başlıklar.                                                                                                                                                                                                                                                               |
| `max_tokens`            | Çıktının token cinsinden maksimum uzunluğunu kontrol eder. Akıl yürütme modelleri (o1, o3, o3-pro, o3-mini, o4-mini) için geçerli değildir.                                                                                                                                                       |
| `maxRetries`            | Başarısız API istekleri için maksimum yeniden deneme sayısı. Varsayılan olarak 4'tür. Yeniden denemeleri devre dışı bırakmak için 0'a ayarlayın.                                                                                                                                                  |
| `metadata`              | İstek etiketleme ve düzenleme için anahtar-değer çiftleri.                                                                                                                                                                                                                                        |
| `organization`          | OpenAI organizasyon anahtarınız.                                                                                                                                                                                                                                                                  |
| `passthrough`           | Herhangi bir parametrenin doğrudan OpenAI API istek gövdesine iletilmesine olanak tanıyan esnek bir nesne. promptfoo'da henüz açıkça desteklenmeyen deneysel, yeni veya sağlayıcıya özel parametreler için kullanışlıdır. Bu parametre nihai API isteğine eklenir ve diğer ayarları geçersiz kılabilir. |
| `presence_penalty`      | Yeni tokenlara (girişte görünmeyen tokenlar) ceza uygulayarak çıktıda görünme olasılıklarını azaltır.                                                                                                                                                                                             |
| `reasoning`             | o-serisi modeller için geliştirilmiş akıl yürütme yapılandırması. `effort` ('low', 'medium', 'high') ve isteğe bağlı `summary` ('auto', 'concise', 'detailed') alanlarını içeren nesne.                                                                                                            |
| `response_format`       | `json_object` ve `json_schema` dahil olmak üzere istenen çıktı formatını belirtir. İstem (prompt) yapılandırmasında da belirtilebilir. Her ikisinde de belirtilirse, istem yapılandırması öncelikli olur.                                                                                             |
| `seed`                  | Deterministik çıktı için kullanılan tohum.                                                                                                                                                                                                                                                        |
| `stop`                  | Çıktının sonunu bildiren tokenların listesini tanımlar.                                                                                                                                                                                                                                             |
| `store`                 | Konuşmanın gelecekte geri alınmak üzere saklanıp saklanmayacağı (boolean).                                                                                                                                                                                                                        |
| `temperature`           | Yapay zeka çıktısının rastgeleliğini kontrol eder. Daha yüksek değerler (1'e yakın) çıktıyı daha rastgele yaparken, daha düşük değerler (0'a yakın) daha deterministik yapar.                                                                                                                      |
| `tool_choice`           | Yapay zekanın bir araç kullanıp kullanmayacağını kontrol eder. Bkz. [OpenAI Araçları belgeleri](https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools)                                                                                                                     |
| `tools`                 | Özel araçlar tanımlamanıza olanak tanır. Bkz. [OpenAI Araçları belgeleri](https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools)                                                                                                                                           |
| `top_p`                 | Yapay zeka çıktısının rastgeleliğini kontrol etmeye yardımcı olan bir yöntem olan çekirdek örneklemeyi (nucleus sampling) kontrol eder.                                                                                                                                                           |
| `user`                  | Takip ve suistimali önleme amacıyla son kullanıcınızı temsil eden benzersiz bir tanımlayıcı.                                                                                                                                                                                                       |
| `max_completion_tokens` | Akıl yürütme modelleri (o1, o3, o3-pro, o3-mini, o4-mini) için oluşturulacak maksimum token sayısı.                                                                                                                                                                                                |

İşte `config` parametrelerinin tür tanımları:

```typescript
interface OpenAiConfig {
  // Tamamlama parametreleri
  temperature?: number;
  max_tokens?: number;
  max_completion_tokens?: number;
  reasoning?: {
    effort?: 'low' | 'medium' | 'high' | null;
    summary?: 'auto' | 'concise' | 'detailed' | null;
  };
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  best_of?: number;
  functions?: OpenAiFunction[];
  function_call?: 'none' | 'auto' | { name: string };
  tools?: OpenAiTool[];
  tool_choice?: 'none' | 'auto' | 'required' | { type: 'function'; function?: { name: string } };
  response_format?: { type: 'json_object' | 'json_schema'; json_schema?: object };
  stop?: string[];
  seed?: number;
  user?: string;
  metadata?: Record<string, string>;
  store?: boolean;
  passthrough?: object;

  // Fonksiyon araç geri çağırmaları
  functionToolCallbacks?: Record<
    OpenAI.FunctionDefinition['name'],
    (arg: string) => Promise<string>
  >;

  // Genel OpenAI parametreleri
  apiKey?: string;
  apiKeyEnvar?: string;
  apiHost?: string;
  apiBaseUrl?: string;
  organization?: string;
  headers?: { [key: string]: string };
  maxRetries?: number;
}
```

## Modeller

### GPT-4.1

GPT-4.1, 1.047.576 tokenlık bağlam penceresi ve 32.768 maksimum çıktı tokenı ile karmaşık görevler için OpenAI'ın amiral gemisi modelidir. Farklı fiyat noktalarına sahip üç varyantı mevcuttur:

| Model        | Açıklama                                     | Giriş Fiyatı         | Çıkış Fiyatı        |
| ------------ | -------------------------------------------- | ------------------- | ------------------- |
| GPT-4.1      | Karmaşık görevler için amiral gemisi model    | 1 milyon token için 2,00 $ | 1 milyon token için 8,00 $ |
| GPT-4.1 Mini | Daha uygun fiyatlı, güçlü genel yetenekler   | 1 milyon token için 0,40 $ | 1 milyon token için 1,60 $ |
| GPT-4.1 Nano | En ekonomik, yüksek hacimli görevler için iyi | 1 milyon token için 0,10 $ | 1 milyon token için 0,40 $ |

Tüm varyantlar metin ve görüntü girişini metin çıktısı ile destekler ve 31 Mayıs 2024 bilgi kesme tarihine sahiptir.

#### Kullanım Örnekleri

Standart model:

```yaml
providers:
  - id: openai:chat:gpt-5 # veya openai:responses:gpt-5
    config:
      temperature: 0.7
```

Daha uygun fiyatlı varyantlar:

```yaml
providers:
  - id: openai:chat:gpt-5-mini # veya -nano varyantı
```

Belirli anlık görüntü (snapshot) sürümleri de mevcuttur:

```yaml
providers:
  - id: openai:chat:gpt-5-2025-08-07 # Standart
  - id: openai:chat:gpt-5-mini-2025-08-07 # Mini
  - id: openai:chat:gpt-5-nano-2025-08-07 # Nano
```

### GPT-5.1

GPT-5.1, GPT-5 model ailesinin bir parçası olan OpenAI'ın en yeni amiral gemisi modelidir. Geliştirilmiş yönlendirilebilirlik (steerability), daha hızlı yanıtlar için yeni bir `none` akıl yürütme modu ve kodlama kullanım durumları için yeni araçlarla kodlama ve ajan görevlerinde mükemmeldir.

#### Kullanılabilir Modeller

| Model               | Açıklama                                            | En İyi Kullanım Alanı                       |
| ------------------- | -------------------------------------------------- | ------------------------------------------- |
| gpt-5.1             | En son amiral gemisi modeli                         | Karmaşık akıl yürütme ve geniş dünya bilgisi |
| gpt-5.1-2025-11-13  | Tarihli anlık görüntü sürümü                        | Üretim için sabitlenmiş davranış             |
| gpt-5.1-mini        | Maliyet optimize edilmiş akıl yürütme              | Dengeli hız, maliyet ve yetenek             |
| gpt-5.1-nano        | Yüksek verimli model                                | Basit talimat izleme görevleri              |
| gpt-5.1-codex       | Codex ortamlarındaki kodlama görevleri için uzmanlaşmış | Ajan kodlama iş akışları                    |
| gpt-5.1-codex-max   | Sıkıştırmalı (compaction) öncü ajan kodlama modeli | Uzun süreli kodlama görevleri ve refaktörler |
| gpt-5.1-chat-latest | Sohbet için optimize edilmiş takma ad              | Konuşmaya dayalı uygulamalar                |

#### Temel Özellikler

GPT-5.1, GPT-5'e göre birkaç iyileştirme sunar:

- **`none` akıl yürütme modu**: Düşük gecikmeli etkileşimler için yeni en düşük akıl yürütme ayarı (varsayılan ayar)
- **Artırılmış yönlendirilebilirlik**: Kişilik, ton ve çıktı formatı üzerinde daha iyi kontrol
- **Yapılandırılabilir ayrıntı (verbosity)**: `low`, `medium` veya `high` ayarlarıyla çıktı uzunluğunu kontrol edin (varsayılan: `medium`)

#### Kullanım Örnekleri

Hızlı, düşük gecikmeli yanıtlar:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5.1
    config:
      reasoning:
        effort: 'none' # Varsayılan ayar - akıl yürütme tokenı yok
      verbosity: 'low' # Özlü çıktılar
```

Karmaşık kodlama ve akıl yürütme görevleri:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5.1
    config:
      reasoning:
        effort: 'high' # Karmaşık görevler için maksimum akıl yürütme
      verbosity: 'medium' # Dengeli çıktı uzunluğu
      max_output_tokens: 4096
```

#### Akıl Yürütme Modları

GPT-5.1 dört akıl yürütme çabası seviyesini destekler:

- **`none`** (varsayılan): Akıl yürütme tokenı yok, en hızlı yanıtlar, akıl yürütme yapmayan modellere benzer
- **`low`**: Basit görevler için minimal akıl yürütme
- **`medium`**: Orta karmaşıklık için dengeli akıl yürütme
- **`high`**: Karmaşık problem çözme için maksimum akıl yürütme

#### GPT-5'ten Yükseltme

Varsayılan ayarlara (`none` akıl yürütme) sahip GPT-5.1, GPT-5'in doğrudan yerine geçecek şekilde tasarlanmıştır. Temel farklar:

- GPT-5.1 varsayılan olarak `none` akıl yürütme çabasını kullanır (GPT-5 varsayılanı `low` idi)
- GPT-5.1 daha iyi kalibre edilmiş akıl yürütme token tüketimine sahiptir
- Geliştirilmiş talimat izleme ve çıktı formatlama

Akıl yürütme gerektiren görevler için `medium` çaba ile başlayın ve gerekirse `high` seviyesine çıkarın.

### GPT-5.1-Codex-Max

GPT-5.1-Codex-Max, yazılım mühendisliği, matematik, araştırma ve daha fazlasında ajan görevleri üzerinde eğitilmiş güncellenmiş bir temel akıl yürütme modeli üzerine inşa edilmiş, OpenAI'ın öncü ajan kodlama modelidir. Uzun süreli, ayrıntılı kodlama çalışmaları için tasarlanmıştır.

#### Temel Yetenekler

- **Sıkıştırma (Compaction)**: Sıkıştırma yoluyla birden fazla bağlam penceresi arasında çalışmak üzere yerel olarak eğitilmiş, tek bir görevde milyonlarca token üzerinde tutarlı bir şekilde çalışan ilk model
- **Uzun süreli görevler**: Proje ölçeğinde refaktörleri, derin hata ayıklama oturumlarını ve çok saatli ajan döngülerini destekler
- **Token verimliliği**: Aynı akıl yürütme çabası seviyesinde GPT-5.1-Codex'e göre %30 daha az düşünme tokenı
- **Windows desteği**: Windows ortamlarında çalışmak üzere eğitilmiş ilk model
- **Geliştirilmiş iş birliği**: CLI ortamlarında bir kodlama ortağı olarak daha iyi performans

#### Kullanım Örnekleri

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5.1-codex-max
    config:
      reasoning:
        effort: 'medium' # Çoğu görev için önerilir
      max_output_tokens: 25000 # Akıl yürütme ve çıktılar için yer ayırın
```

Maksimum kalite gerektiren gecikmeye duyarsız görevler için:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5.1-codex-max
    config:
      reasoning:
        effort: 'xhigh' # En iyi sonuçlar için ekstra yüksek akıl yürütme
      max_output_tokens: 40000
```

:::warning
GPT-5.1-Codex-Max yalnızca Responses API (`openai:responses:`) aracılığıyla kullanılabilir. Sohbet Tamamlama API'si (`openai:chat:`) ile çalışmaz.
:::

#### Akıl Yürütme Çabası Seviyeleri

- **`low`**: Basit görevler için minimal akıl yürütme
- **`medium`**: Dengeli akıl yürütme, günlük kullanım için önerilir
- **`high`**: Karmaşık problem çözme için maksimum akıl yürütme
- **`xhigh`**: En iyi sonuçları gerektiren, gecikmeye duyarsız görevler için ekstra yüksek akıl yürütme

#### En İyi Uygulamalar

- Codex veya Codex benzeri ortamlardaki ajan kodlama görevleri için kullanın
- Başlarken akıl yürütme ve çıktılar için en az 25.000 token ayırın
- Çoğu görev için `medium` akıl yürütme çabasıyla başlayın
- `xhigh` çabasını yalnızca gecikmenin sorun olmadığı karmaşık görevler için kullanın
- Üretime almadan önce ajanın çalışmasını gözden geçirin

:::note
GPT-5.1-Codex-Max yalnızca ajan kodlama ortamlarında kullanım için önerilir ve GPT-5.1 gibi genel amaçlı bir model değildir.
:::

### GPT-5.2

GPT-5.2, OpenAI'ın kodlama ve ajan görevleri için amiral gemisi modelidir. GPT-5.1'e kıyasla güvenlik, talimat izleme ve azaltılmış aldatma konularında önemli iyileştirmeler sunar.

#### Kullanılabilir Modeller

| Model              | Açıklama                                       | En İyi Kullanım Alanı                      |
| ------------------ | --------------------------------------------- | ------------------------------------------ |
| gpt-5.2            | Kodlama ve ajan görevleri için amiral gemisi   | Karmaşık akıl yürütme ve kodlama görevleri |
| gpt-5.2-2025-12-11 | Anlık görüntü sürümü                           | Üretim için sabitlenmiş davranış            |

#### Temel Özellikler

- **Bağlam penceresi**: 400.000 token
- **Maksimum çıktı tokenı**: 128.000 token
- **Akıl yürütme desteği**: Yapılandırılabilir çaba seviyeleriyle tam akıl yürütme token desteği
- **Fiyatlandırma**: 1 milyon giriş tokenı için 1,75 $, 1 milyon çıkış tokenı için 14 $

#### Kullanım Örnekleri

GPT-5.2 hem Sohbet Tamamlama API'si hem de Responses API aracılığıyla kullanılabilir:

**Sohbet Tamamlama API'si:**

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:chat:gpt-5.2
    config:
      max_completion_tokens: 4096

  # Akıl yürütme çabası ile
  - id: openai:chat:gpt-5.2
    config:
      reasoning_effort: 'medium'
      max_completion_tokens: 4096
```

**Responses API:**

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5.2
    config:
      max_output_tokens: 4096

  # Akıl yürütme çabası ile (iç içe geçmiş format)
  - id: openai:responses:gpt-5.2
    config:
      reasoning:
        effort: 'medium'
      max_output_tokens: 4096
```

Hızlı, düşük gecikmeli yanıtlar (akıl yürütme yok):

```yaml title="promptfooconfig.yaml"
providers:
  # Sohbet API
  - id: openai:chat:gpt-5.2
    config:
      reasoning_effort: 'none'
      max_completion_tokens: 2048

  # Responses API
  - id: openai:responses:gpt-5.2
    config:
      reasoning:
        effort: 'none'
      max_output_tokens: 2048
```

#### GPT-5.1'e Göre Temel İyileştirmeler

- **Azaltılmış aldatma**: Üretim trafiğinde önemli ölçüde daha düşük aldatma oranları
- **Daha iyi güvenlik uyumu**: Geliştirilmiş siber güvenlik politikası uyumu
- **İyileştirilmiş istem enjeksiyonu direnci**: Bilinen istem enjeksiyonu saldırılarına karşı artırılmış dayanıklılık
- **Gelişmiş hassas konu yönetimi**: Ruh sağlığı ve duygusal bağımlılık değerlendirmelerinde daha iyi performans

#### Akıl Yürütme Çabası Seviyeleri

- **`none`**: Akıl yürütme tokenı yok, en hızlı yanıtlar
- **`low`**: Basit görevler için minimal akıl yürütme
- **`medium`**: Orta karmaşıklık için dengeli akıl yürütme
- **`high`**: Karmaşık problem çözme için maksimum akıl yürütme

### Akıl Yürütme Modelleri (o1, o3, o3-pro, o3-mini, o4-mini)

`o1`, `o3`, `o3-pro`, `o3-mini` ve `o4-mini` gibi akıl yürütme modelleri, karmaşık akıl yürütme gerçekleştirmek için pekiştirmeli öğrenme (reinforcement learning) ile eğitilmiş büyük dil modelleridir. Bu modeller karmaşık problem çözme, kodlama, bilimsel akıl yürütme ve ajan iş akışları için çok adımlı planlamada mükemmeldir.

Akıl yürütme modellerini kullanırken tokenların nasıl işlendiğine dair önemli farklar vardır:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:o1
    config:
      reasoning:
        effort: 'medium' # "low", "medium" veya "high" olabilir
      max_completion_tokens: 25000 # OPENAI_MAX_COMPLETION_TOKENS ortam değişkeni ile de ayarlanabilir
```

`max_tokens` kullanan standart modellerin aksine, akıl yürütme modelleri şunları kullanır:

- `max_completion_tokens`: Üretilen toplam tokenları (hem akıl yürütme hem de görünür çıktı) kontrol etmek için
- `reasoning`: Modelin yanıt vermeden önce ne kadar kapsamlı düşüneceğini kontrol etmek için (`effort`: none (sadece GPT-5.1), low, medium, high)

#### Akıl Yürütme Modelleri Nasıl Çalışır?

Akıl yürütme modelleri "cevap vermeden önce düşünür" ve şu özelliklere sahip dahili akıl yürütme tokenları üretir:

- Çıktıda görünmezler
- Token kullanımı ve faturalandırmada hesaba katılırlar
- Bağlam penceresinde yer kaplarlar

Hem `o1` hem de `o3-mini` modelleri 128.000 tokenlık bir bağlam penceresine sahipken, `o3-pro` ve `o4-mini` 200.000 tokenlık bir bağlam penceresine sahiptir. OpenAI bu modellerle başlarken akıl yürütme ve çıktılar için en az 25.000 token ayrılmasını önerir.

## Görüntüler

### İstemlerde görüntü gönderme

İçerik bloklarını kullanarak isteme görüntü dahil edebilirsiniz. Örneğin, işte bir örnek yapılandırma:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - file://prompt.json

providers:
  - openai:gpt-5

tests:
  - vars:
      question: 'Ne görüyorsun?'
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg'
  # ...
```

Ve bir örnek `prompt.json`:

```json title="prompt.json"
[
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "{{question}}"
      },
      {
        "type": "image_url",
        "image_url": {
          "url": "{{url}}"
        }
      }
    ]
  }
]
```

Bkz. [OpenAI görme (vision) örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-vision).

### Görüntü üretme

OpenAI, `openai:image:<model>` aracılığıyla görüntü üretimini destekler. Desteklenen modeller şunları içerir:

- `gpt-image-1.5` - En iyi talimat izleme özelliğine sahip OpenAI'ın en gelişmiş görüntü üretim modeli
- `gpt-image-1` - Yüksek kaliteli görüntü üretim modeli
- `gpt-image-1-mini` - GPT Image 1'in maliyet etkin sürümü
- `dall-e-3` - Daha büyük çözünürlük desteğine sahip yüksek kaliteli görüntü üretimi
- `dall-e-2` - Eşzamanlı istek desteğine sahip daha düşük maliyetli seçenek

Bkz. [OpenAI görüntü üretim örneği](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-images).

#### GPT Image 1.5

GPT Image 1.5, üstün talimat izleme, isteme sadakat ve fotogerçekçi kalite ile OpenAI'ın en gelişmiş görüntü üretim modelidir. Daha esnek maliyet kontrolü için token tabanlı fiyatlandırma kullanır.

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:image:gpt-image-1.5
    config:
      size: 1024x1024 # 1024x1024, 1024x1536, 1536x1024 veya auto
      quality: low # low, medium, high veya auto
      background: transparent # transparent, opaque veya auto
      output_format: png # png, jpeg veya webp
      output_compression: 80 # 0-100, sadece jpeg/webp için
      moderation: auto # auto veya low
```

| Parametre            | Açıklama                                | Seçenekler                                    |
| -------------------- | --------------------------------------- | --------------------------------------------- |
| `size`               | Görüntü boyutları                        | `1024x1024`, `1024x1536`, `1536x1024`, `auto` |
| `quality`            | Oluşturma kalitesi                       | `low`, `medium`, `high`, `auto`               |
| `background`         | Arka plan şeffaflığı (sadece png/webp)  | `transparent`, `opaque`, `auto`               |
| `output_format`      | Çıktı görüntü formatı                    | `png`, `jpeg`, `webp`                         |
| `output_compression` | Sıkıştırma seviyesi (sadece jpeg/webp)   | `0-100`                                       |
| `moderation`         | İçerik denetleme katılığı                | `auto`, `low`                                 |

**Fiyatlandırma:**

GPT Image 1.5; 1 milyon giriş metni tokenı için 5 $, 1 milyon çıkış metni tokenı için 10 $, 1 milyon giriş görüntü tokenı için 8 $ ve 1 milyon çıkış görüntü tokenı için 32 $ üzerinden token tabanlı fiyatlandırma kullanır. Görüntü başına tahmini maliyetler:

| Kalite | 1024x1024 | 1024x1536 | 1536x1024 |
| ------- | --------- | --------- | --------- |
| Düşük   | ~$0.064   | ~$0.096   | ~$0.096   |
| Orta    | ~$0.128   | ~$0.192   | ~$0.192   |
| Yüksek  | ~$0.192   | ~$0.288   | ~$0.288   |

#### GPT Image 1

GPT Image 1; üstün talimat izleme, metin oluşturma ve gerçek dünya bilgisine sahip yüksek kaliteli bir görüntü üretim modelidir.

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:image:gpt-image-1
    config:
      size: 1024x1024 # 1024x1024, 1024x1536, 1536x1024 veya auto
      quality: low # low, medium, high veya auto
      background: transparent # transparent, opaque veya auto
      output_format: png # png, jpeg veya webp
      output_compression: 80 # 0-100, sadece jpeg/webp için
      moderation: auto # auto veya low
```

| Parametre            | Açıklama                                | Seçenekler                                    |
| -------------------- | --------------------------------------- | --------------------------------------------- |
| `size`               | Görüntü boyutları                        | `1024x1024`, `1024x1536`, `1536x1024`, `auto` |
| `quality`            | Oluşturma kalitesi                       | `low`, `medium`, `high`, `auto`               |
| `background`         | Arka plan şeffaflığı (sadece png/webp)  | `transparent`, `opaque`, `auto`               |
| `output_format`      | Çıktı görüntü formatı                    | `png`, `jpeg`, `webp`                         |
| `output_compression` | Sıkıştırma seviyesi (sadece jpeg/webp)   | `0-100`                                       |
| `moderation`         | İçerik denetleme katılığı                | `auto`, `low`                                 |

**Fiyatlandırma:**

| Kalite | 1024x1024 | 1024x1536 | 1536x1024 |
| ------- | --------- | --------- | --------- |
| Düşük   | 0,011 $   | 0,016 $   | 0,016 $   |
| Orta    | 0,042 $   | 0,063 $   | 0,063 $   |
| Yüksek  | 0,167 $   | 0,25 $    | 0,25 $    |

#### GPT Image 1 Mini

GPT Image 1 Mini, daha düşük maliyetle aynı yeteneklere sahip GPT Image 1'in maliyet etkin bir sürümüdür.

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:image:gpt-image-1-mini
    config:
      size: 1024x1024 # 1024x1024, 1024x1536, 1536x1024 veya auto
      quality: low # low, medium, high veya auto
      background: transparent # transparent, opaque veya auto
      output_format: png # png, jpeg veya webp
      output_compression: 80 # 0-100, sadece jpeg/webp için
      moderation: auto # auto veya low
```

**Fiyatlandırma:**

| Kalite | 1024x1024 | 1024x1536 | 1536x1024 |
| ------- | --------- | --------- | --------- |
| Düşük   | 0,005 $   | 0,006 $   | 0,006 $   |
| Orta    | 0,011 $   | 0,015 $   | 0,015 $   |
| Yüksek  | 0,036 $   | 0,052 $   | 0,052 $   |

#### DALL-E 3

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:image:dall-e-3
    config:
      size: 1024x1024 # 1024x1024, 1792x1024, 1024x1792
      quality: standard # standard veya hd
      style: vivid # vivid veya natural
```

#### DALL-E 2

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:image:dall-e-2
    config:
      size: 512x512 # 256x256, 512x512, 1024x1024
      response_format: url # url veya b64_json
```

#### Örnek

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - 'Van Gogh tarzında: {{subject}}'
  - 'Dali tarzında: {{subject}}'

providers:
  - openai:image:gpt-image-1.5

tests:
  - vars:
      subject: muzlar
  - vars:
      subject: new york şehri
```

Web görüntüleyicisinde görüntüleri görüntülemek için, değişkenleri veya çıktıları şu şekilde markdown görüntü etiketleri içine alın:

```markdown
![](/path/to/myimage.png)
```

Ardından, Table Settings (Tablo Ayarları) altında 'Render markdown'ı etkinleştirin.
## Video Üretimi (Sora)

OpenAI, `openai:video:<model>` aracılığıyla video üretimini destekler. Desteklenen modeller şunları içerir:

- `sora-2` - OpenAI'ın video üretim modeli (saniye başına 0,10 $)
- `sora-2-pro` - Daha yüksek kaliteli video üretimi (saniye başına 0,30 $)

### Temel Kullanım

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:video:sora-2
    config:
      size: 1280x720 # 1280x720 (yatay) veya 720x1280 (dikey)
      seconds: 8 # Süre: 4, 8 veya 12 saniye
```

### Yapılandırma Seçenekleri

| Parametre              | Açıklama                                           | Varsayılan |
| ---------------------- | -------------------------------------------------- | ---------- |
| `size`                 | Video boyutları                                    | `1280x720` |
| `seconds`              | Saniye cinsinden süre (4, 8 veya 12)               | `8`        |
| `input_reference`      | Görüntüden videoya için Base64 görüntü verisi veya dosya yolu | -          |
| `remix_video_id`       | Yeniden düzenlenecek (remix) önceki bir Sora video kimliği | -          |
| `poll_interval_ms`     | İş durumu için yoklama aralığı                     | `10000`    |
| `max_poll_time_ms`     | Video üretimi için beklenecek maksimum süre        | `600000`   |
| `download_thumbnail`   | Küçük resim önizlemesini indir                     | `true`     |
| `download_spritesheet` | Spritesheet önizlemesini indir                     | `true`     |

### Örnek Yapılandırma

```yaml title="promptfooconfig.yaml"
prompts:
  - 'Sinematik bir çekim: {{scene}}'

providers:
  - id: openai:video:sora-2
    config:
      size: 1280x720
      seconds: 4
  - id: openai:video:sora-2-pro
    config:
      size: 720x1280
      seconds: 8

tests:
  - vars:
      scene: bir şehirde kaykay yapan kedi
  - vars:
      scene: gün batımında sahilde kırılan dalgalar
```

### Görüntüden Videoya Üretim

`input_reference` kullanarak bir kaynak görüntüden başlayan videolar oluşturun:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:video:sora-2
    config:
      input_reference: file://assets/start-image.png
      seconds: 4

prompts:
  - 'Bu görüntüyü hareketlendir: karakter yavaşça öne doğru yürüyor'
```

`input_reference` hem bir `file://` yolunu hem de base64 kodlu görüntü verisini kabul eder.

### Video Yeniden Düzenleme (Remixing)

`remix_video_id` kullanarak mevcut bir Sora videosunu yeni bir istemle yeniden düzenleyin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:video:sora-2
    config:
      remix_video_id: video_abc123def456

prompts:
  - 'Fırtınalı hava ile sahneyi daha dramatik hale getir'
```

`remix_video_id`, önceki bir Sora üretiminden döndürülen video kimliğidir (`response.video.id` içinde bulunur).

:::note
Yeniden düzenlenen videolar önbelleğe alınmaz çünkü her yeniden düzenleme, aynı istemle bile benzersiz sonuçlar üretir.
:::

### Üretilen Videoları Görüntüleme

Videolar, oynatma kontrolleriyle birlikte web görüntüleyicisinde otomatik olarak görüntülenir. Görüntüleyici şunları gösterir:

- Kontrollere sahip video oynatıcı
- Video meta verileri (model, boyut, süre)
- Küçük resim önizlemesi (etkinleştirilmişse)

Videolar promptfoo'nun medya deposunda (`~/.promptfoo/media/`) saklanır ve web arayüzü üzerinden sunulur.

### Fiyatlandırma

| Model      | Saniye Başına Maliyet |
| ---------- | --------------------- |
| sora-2     | 0,10 $                |
| sora-2-pro | 0,30 $                |

## Web Araması Desteği

OpenAI Responses API, `search-rubric` iddia türünü etkinleştiren `web_search_preview` aracı aracılığıyla web arama yeteneklerini destekler. Bu, modellerin güncel bilgiler için web'de arama yapmasına ve gerçekleri doğrulamasına olanak tanır.

### Web Aramasını Etkinleştirme

OpenAI Responses API ile web aramasını etkinleştirmek için `openai:responses` sağlayıcı formatını kullanın ve yapılandırmanıza `web_search_preview` aracını ekleyin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5.1
    config:
      tools:
        - type: web_search_preview
```

### Web Araması İddialarını Kullanma

`search-rubric` iddia türü, güncel bilgileri hızlı bir şekilde doğrulamak için web aramasını kullanır:

- Gerçek zamanlı veriler (hava durumu, hisse senedi fiyatları, haberler)
- Güncel olaylar ve istatistikler
- Zamana duyarlı bilgiler
- Hızlı gerçek doğrulaması

Örnek yapılandırma:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - '{{city}} şehrinde şu anki sıcaklık nedir?'

providers:
  - id: openai:responses:gpt-5.1
    config:
      tools:
        - type: web_search_preview

tests:
  - vars:
      city: İstanbul
    assert:
      - type: search-rubric
        value: İstanbul şehrindeki mevcut sıcaklık
```

### Maliyet Konuları

:::info
Responses API'deki web arama çağrıları normal tokenlardan ayrı olarak faturalandırılır:

- Web arama aracı maliyeti; standart araç için **1.000 çağrı başına 10 $** ve önizleme varyantları için **1.000 çağrı başına 10-25 $**'dır, ayrıca geçerli olduğunda arama içeriği tokenları eklenir.
- Her `search-rubric` iddiası bir veya daha fazla arama gerçekleştirebilir.
- Önbelleğe alma varsayılan olarak etkindir; geliştirme sırasında taze aramaları zorunlu kılmak için `--no-cache` kullanın.
- Güncel oranlar için [OpenAI'ın fiyatlandırma sayfasını](https://openai.com/api/pricing/) inceleyin.
:::

### En İyi Uygulamalar

1. **Belirli arama sorguları kullanın**: Daha belirli sorgular daha iyi doğrulama sonuçları verir.
2. **Önbelleğe almayı kullanın**: Önbelleğe alma varsayılan olarak etkindir; tekrarlanan aramalardan kaçınmak için sonuçlar yeniden kullanılır.
3. **Uygun modelleri kullanın**: Maliyet etkin web araması için gpt-5.1-mini önerilir.
4. **Kullanımı izleyin**: Özellikle CI/CD hatlarında API maliyetlerini takip edin.

Arama-rubrik iddialarını kullanma hakkında daha fazla ayrıntı için [Search-Rubric belgelerine](/docs/configuration/expected-outputs/model-graded/search-rubric) bakın.

## Araç Çağırma (Tool Calling)

### Araçları kullanma

Bir OpenAI sağlayıcısında `tools` ayarlamak için sağlayıcının `config` anahtarını kullanın. Model, araç çağrılarını iki formatta döndürebilir:

1. Bir araç çağrıları dizisi: `[{type: 'function', function: {...}}]`
2. Araç çağrıları içeren bir mesaj: `{content: '...', tool_calls: [{type: 'function', function: {...}}]}`

Araçlar satır içi tanımlanabilir veya harici bir dosyadan yüklenebilir:

:::info Desteklenen dosya formatları

Araçlar, birden fazla formatta harici dosyalardan yüklenebilir:

```yaml
# Statik veri dosyaları
tools: file://./tools.yaml
tools: file://./tools.json

# Koddan dinamik araç tanımları (fonksiyon adı gerektirir)
tools: file://./tools.py:get_tools
tools: file://./tools.js:getTools
tools: file://./tools.ts:getTools
```

Python ve JavaScript dosyaları, araç tanımları dizisini döndüren bir fonksiyon dışa aktarmalıdır. Fonksiyon senkron veya asenkron olabilir.

**Asenkron örnek:**

```javascript
// tools.js - Çalışma zamanında API'den araç tanımlarını al
export async function getTools() {
  const apiKey = process.env.INTERNAL_API_KEY;
  const response = await fetch('https://api.internal.com/tool-definitions', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const tools = await response.json();
  return tools;
}
```
:::

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - file://prompt.txt
providers:
  - id: openai:chat:gpt-5-mini
    config:
      # Araçları harici dosyadan yükle
      tools: file://./weather_tools.yaml
      # Veya satır içi tanımla
      tools: [
        {
        "type": "function",
          "function": {
            "name": "get_current_weather",
            "description": "Belirli bir konumdaki mevcut hava durumunu al",
            "parameters": {
              "type": "object",
                "properties": {
                  "location": {
                    "type": "string",
                      "description": "Şehir ve eyalet/ülke, örn. İstanbul, TR"
                    },
                    "unit": {
                      "type": "string",
                      "enum": ["celsius", "fahrenheit"]
                    }
                  },
              "required": ["location"]
            }
          }
        }
      ]
      tool_choice: 'auto'

tests:
   - vars:
        city: İstanbul
     assert:
        - type: is-json
        - type: is-valid-openai-tools-call
        - type: javascript
          value: output[0].function.name === 'get_current_weather'
        - type: javascript
          value: JSON.parse(output[0].function.arguments).location === 'İstanbul, TR'
```

Bazen OpenAI fonksiyon çağrıları `tools` şemalarıyla eşleşmez. Araçlar ve fonksiyon tanımı arasında tam bir şema eşleşmesi zorunlu kılmak için [`is-valid-openai-tools-call`](/docs/configuration/expected-outputs/deterministic/#is-valid-openai-function-call) veya [`is-valid-openai-tools-call`](/docs/configuration/expected-outputs/deterministic/#is-valid-openai-tools-call) iddialarını kullanın.

`tools` tanımlarını daha fazla test etmek için `javascript` iddiasını ve/veya `transform` direktiflerini kullanabilirsiniz. Örneğin:

```yaml title="promptfooconfig.yaml"
tests:
  - vars:
      city: İstanbul
    assert:
      - type: is-json
      - type: is-valid-openai-tools-call
      - type: javascript
        value: output[0].function.name === 'get_current_weather'
      - type: javascript
        value: JSON.parse(output[0].function.arguments).location === 'İstanbul, TR'

  - vars:
      city: Ankara
      # transform sadece 'name' özelliğini döndürür
    transform: output[0].function.name
    assert:
      - type: is-json
      - type: similar
        value: Ankara
```

:::tip
Fonksiyonlar test vakalarındaki değişkenleri kullanabilir:

```js
{
  type: "function",
  function: {
    description: "{{city}} şehrindeki sıcaklığı al"
    // ...
  }
}
```

Ayrıca değişkenlere dinamik olarak başvuran fonksiyonlar da içerebilirler:

```js
{
  type: "function",
  function: {
    name: "get_temperature",
    parameters: {
      type: "object",
        properties: {
          unit: {
            type: "string",
            enum: (vars) => vars.units,
          }
        },
    }
  }
}
```
:::

### Fonksiyonları kullanma

> `functions` ve `function_call`, `tools` ve `tool_choice` lehine kullanımdan kaldırılmıştır, ayrıntılar için [OpenAI API referansına](https://platform.openai.com/docs/api-reference/chat/create#chat-create-function_call) bakın.

Özel fonksiyonlar tanımlamak için `functions` yapılandırmasını kullanın. Her fonksiyon `name`, isteğe bağlı `description` ve `parameters` içeren bir nesne olmalıdır. Örneğin:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - file://prompt.txt
providers:
  - id: openai:chat:gpt-5-mini
    config:
      functions:
        [
          {
            'name': 'get_current_weather',
            'description': 'Belirli bir konumdaki mevcut hava durumunu al',
            'parameters':
              {
                'type': 'object',
                'properties':
                  {
                    'location':
                      {
                        'type': 'string',
                        'description': 'Şehir ve eyalet/ülke, örn. İstanbul, TR',
                      },
                    'unit': { 'type': 'string', 'enum': ['celsius', 'fahrenheit'] },
                  },
                'required': ['location'],
              },
          },
        ]
tests:
  - vars:
      city: İstanbul
    assert:
      - type: is-valid-openai-function-call
```

Bazen OpenAI fonksiyon çağrıları `functions` şemalarıyla eşleşmez. Fonksiyon çağrıları ve fonksiyon tanımı arasında tam bir şema eşleşmesi zorunlu kılmak için [`is-valid-openai-function-call`](/docs/configuration/expected-outputs/deterministic#is-valid-openai-function-call) iddialarını kullanın.

Fonksiyon çağrı tanımlarını daha fazla test etmek için `javascript` iddiasını ve/veya `transform` direktiflerini kullanabilirsiniz. Örneğin:

```yaml title="promptfooconfig.yaml"
tests:
  - vars:
      city: İstanbul
    assert:
      - type: is-valid-openai-function-call
      - type: javascript
        value: output.name === 'get_current_weather'
      - type: javascript
        value: JSON.parse(output.arguments).location === 'İstanbul, TR'

  - vars:
      city: Ankara
    # transform bu test vakası için sadece 'name' özelliğini döndürür
    transform: output.name
    assert:
      - type: is-json
      - type: similar
        value: Ankara
```

### Araçları/fonksiyonları bir dosyadan yükleme

Fonksiyon tanımlarını birden fazla yapılandırmada çoğaltmak yerine, fonksiyonlarınızı içeren harici bir YAML (veya JSON) dosyasına atıfta bulunabilirsiniz. Bu, özellikle birden fazla sürümünüz varsa veya tanımlarda düzenli değişiklikler yapıyorsanız yararlı olan, fonksiyonlarınız için tek bir doğruluk kaynağı (source of truth) sürdürmenize olanak tanır.

:::tip
Araç tanımları JSON, YAML, Python veya JavaScript dosyalarından yüklenebilir. Python/JS dosyaları için, araç tanımlarını döndüren bir fonksiyon adı belirtin: `file://tools.py:get_tools`
:::

Fonksiyonlarınızı bir dosyadan yüklemek için sağlayıcı yapılandırmanızda dosya yolunu şu şekilde belirtin:

```yaml title="promptfooconfig.yaml"
providers:
  - file://./path/to/provider_with_function.yaml
```

Birden fazla dosyayı yüklemek için bir desen (pattern) de kullanabilirsiniz:

```yaml title="promptfooconfig.yaml"
providers:
  - file://./path/to/provider_*.yaml
```

İşte `provider_with_function.yaml` dosyanızın nasıl görünebileceğine dair bir örnek:

```yaml title="provider_with_function.yaml"
id: openai:chat:gpt-5-mini
config:
  functions:
    - name: get_current_weather
      description: Belirli bir konumdaki mevcut hava durumunu al
      parameters:
        type: object
        properties:
          location:
            type: string
            description: Şehir ve eyalet/ülke, örn. İstanbul, TR
          unit:
            type: string
            enum:
              - celsius
              - fahrenheit
            description: Sıcaklığın döndürüleceği birim
        required:
          - location
```

## `response_format` Kullanımı

Promptfoo, beklenen çıktı formatını belirtmenize olanak tanıyan `response_format` parametresini destekler.

`response_format`, sağlayıcı yapılandırmasına veya istem yapılandırmasına dahil edilebilir.

#### İstem yapılandırma örneği

```yaml title="promptfooconfig.yaml"
prompts:
  - label: 'İstem #1'
    raw: 'Yardımsever bir matematik öğretmenisiniz. {{problem}} problemini çözün'
    config:
      response_format:
        type: json_schema
        json_schema: ...
```

#### Sağlayıcı yapılandırma örneği

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:chat:gpt-5-mini
    config:
      response_format:
        type: json_schema
        json_schema: ...
```

#### Harici dosya referansları

Büyük JSON şemalarını yönetmeyi kolaylaştırmak için hem Sohbet hem de Responses API'lerinde `response_format` için harici dosya referansları desteklenir. Bu özellik özellikle şunlar için yararlıdır:

- Karmaşık JSON şemalarını birden fazla yapılandırmada yeniden kullanma
- Daha iyi düzenleme için büyük şemaları ayrı dosyalarda yönetme
- Şemaları yapılandırma dosyalarından bağımsız olarak sürümleme

```yaml
config:
  response_format: file://./path/to/response_format.json
```

Harici dosya, tam `response_format` yapılandırma nesnesini içermelidir:

```json title="response_format.json"
{
  "type": "json_schema",
  "name": "event_extraction",
  "schema": {
    "type": "object",
    "properties": {
      "event_name": { "type": "string" },
      "date": { "type": "string" },
      "location": { "type": "string" }
    },
    "required": ["event_name", "date", "location"],
    "additionalProperties": false
  }
}
```

Şemanın kendisi için de iç içe geçmiş dosya referanslarını kullanabilirsiniz, bu da şemaları birden fazla yanıt formatı arasında paylaşmak için yararlıdır:

```json title="response_format.json"
{
  "type": "json_schema",
  "name": "event_extraction",
  "schema": "file://./schemas/event-schema.json"
}
```

Dosya yollarında Nunjucks sözdizimi kullanılarak değişken işleme desteklenir:

```yaml
config:
  response_format: file://./schemas/{{ schema_name }}.json
```

Sohbet API'si ile tam bir örnek için [OpenAI Yapılandırılmış Çıktı örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-structured-output) bakın veya şunu kullanarak başlatın:

```bash
npx promptfoo@latest init --example openai-structured-output
```

Responses API'si ile bir örnek için [OpenAI Responses API örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-responses) bakın ve şunu çalıştırın:

```bash
npx promptfoo@latest init --example openai-responses
cd openai-responses
npx promptfoo@latest eval -c promptfooconfig.external-format.yaml
```

#### Test başına yapılandırılmış çıktı

`test.options` alanını kullanarak farklı test vakaları için farklı JSON şemaları kullanabilirsiniz. Bu, tek bir istemin teste bağlı olarak farklı yapılandırılmış çıktı formatları üretmesine olanak tanır:

```yaml title="promptfooconfig.yaml"
prompts:
  - 'Bu soruyu yanıtla: {{question}}'

providers:
  - openai:gpt-4o-mini

# İddiaların özelliklere doğrudan erişebilmesi için JSON çıktısını ayrıştır
defaultTest:
  options:
    transform: JSON.parse(output)

tests:
  # Matematik problemleri matematik şemasını kullanır
  - vars:
      question: '15 * 7 kaçtır?'
    options:
      response_format: file://./schemas/math-response-format.json
    assert:
      - type: javascript
        value: output.answer === 105

  # Karşılaştırma soruları karşılaştırma şemasını kullanır
  - vars:
      question: 'Elma ve portakalı karşılaştır'
    options:
      response_format: file://./schemas/comparison-response-format.json
    assert:
      - type: javascript
        value: output.winner === 'item1' || output.winner === 'item2' || output.winner === 'tie'
```

Her şema dosyası tam `response_format` nesnesini içerir. Tam çalışan bir yapılandırma için [test başına şema örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-structured-output/per-test-schema.yaml) bakın.

## Desteklenen ortam değişkenleri

Şu OpenAI ile ilgili ortam değişkenleri desteklenir:

| Değişken                       | Açıklama                                                                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OPENAI_TEMPERATURE`           | Sıcaklık model parametresi, varsayılan 0'dır. Akıl yürütme modelleri tarafından desteklenmez.                                                                  |
| `OPENAI_MAX_TOKENS`            | Max_tokens model parametresi, varsayılan 1024'tür. Akıl yürütme modelleri tarafından desteklenmez.                                                           |
| `OPENAI_MAX_COMPLETION_TOKENS` | Max_completion_tokens model parametresi, varsayılan 1024'tür. Akıl yürütme modelleri tarafından kullanılır.                                                    |
| `OPENAI_REASONING_EFFORT`      | Akıl yürütme modelleri için akıl yürütme çabası parametresi, varsayılan "medium"dur. Seçenekler "low", "medium" veya "high"dır. `reasoning.effort` yapılandırma parametresine eşlenir. |
| `OPENAI_API_HOST`              | Kullanılacak ana makine adı (bir API proxy'si kullanıyorsanız kullanışlıdır). `OPENAI_BASE_URL` değişkenine göre önceliklidir.                               |
| `OPENAI_BASE_URL`              | Kullanılacak temel URL (protokol + ana makine adı + port); bu, `OPENAI_API_HOST` seçeneğinden daha genel bir seçenektir.                                      |
| `OPENAI_API_KEY`               | OpenAI API anahtarı.                                                                                                                                             |
| `OPENAI_ORGANIZATION`          | Kullanılacak OpenAI organizasyon anahtarı.                                                                                                                         |
| `PROMPTFOO_DELAY_MS`           | API çağrıları arasında geciktirilecek milisaniye sayısı. OpenAI hız sınırlarına takılıyorsanız kullanışlıdır (varsayılan 0'dır).                                   |
| `PROMPTFOO_REQUEST_BACKOFF_MS` | Bir istek başarısız olursa bekleme ve yeniden deneme için temel milisaniye sayısı (varsayılan 5000'dir).                                                        |

## Asistanları değerlendirme

OpenAI'ın Asistanlar (Assistants) API'si aracılığıyla bir asistanı test etmek için önce [API oyun alanında (playground)](https://platform.openai.com/playground) bir asistan oluşturun.

Gerektiğinde fonksiyonları, kod yorumlayıcısını (code interpreter) ve veri alma (retrieval) dosyalarını ayarlayın.

Ardından, asistanı yapılandırmanıza dahil edin:

```yaml
prompts:
  - '{{topic}} hakkında bir tweet yaz'
providers:
  - openai:assistant:asst_fEhNN3MClMamLfKLkIaoIpgZ
tests:
  - vars:
      topic: muzlar
```

Kod yorumlayıcısı, fonksiyon çağrıları ve veri alımları, sohbet mesajlarıyla birlikte çıktıda yer alacaktır. Değerlendiricinin her değerlendirme (eval) için yeni bir iş parçacığı oluşturduğunu unutmayın.

Aşağıdaki özellikler sağlayıcı yapılandırmasında geçersiz kılınabilir:

- `model`: Kullanılacak OpenAI modeli
- `instructions`: Sistem istemi
- `tools`: Etkinleştirilmiş [araçlar](https://platform.openai.com/docs/api-reference/runs/createRun)
- `thread.messages`: İş parçacığının oluşturulduğu mesaj nesnelerinin bir listesi
- `temperature`: Model için sıcaklık
- `toolChoice`: Yapay zekanın bir araç kullanıp kullanmayacağını kontrol eder
- `tool_resources`: İş parçacığına dahil edilecek araç kaynakları - bkz. [Asistan v2 araç kaynakları](https://platform.openai.com/docs/assistants/migration)
- `attachments`: Mesajlara dahil edilecek dosya ekleri - bkz. [Asistan v2 ekleri](https://platform.openai.com/docs/assistants/migration)

İşte daha ayrıntılı bir yapılandırma örneği:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - '{{topic}} hakkında bir tweet yaz'
providers:
  - id: openai:assistant:asst_fEhNN3MClMamLfKLkIaoIpgZ
    config:
      model: gpt-5
      instructions: "Her zaman bir korsan gibi konuşursun"
      temperature: 0.2
      toolChoice:
        type: file_search
      tools:
        - type: code_interpreter
        - type: file_search
      thread:
        messages:
          - role: user
            content: "Merhaba dünya"
          - role: assistant
            content: "Engin denizlerden selamlar"
tests:
  - vars:
      topic: muzlar
```

### Fonksiyon araç çağrılarını otomatik olarak yönetme

Bir fonksiyon aracı çağrısının çıktısını oluşturmak için otomatik olarak çağrılan JavaScript geri çağırmaları belirtebilirsiniz.

Bu, yapılandırmanızı YAML yerine bir JavaScript dosyasında tanımlamanızı gerektirir.

```js
module.exports = /** @type {import('promptfoo').TestSuiteConfig} */ ({
  prompts: 'Lütfen şu sayıları toplayın: {{a}} ve {{b}}',
  providers: [
    {
      id: 'openai:assistant:asst_fEhNN3MClMamLfKLkIaoIpgZ',
      config: {
        model: 'gpt-5',
        instructions: '`addNumbers` aracını kullanarak iki sayıyı toplayabilirsiniz',
        tools: [
          {
            type: 'function',
            function: {
              name: 'addNumbers',
              description: 'İki sayıyı birbiriyle topla',
              parameters: {
                type: 'object',
                properties: {
                  a: { type: 'number' },
                  b: { type: 'number' },
                },
                required: ['a', 'b'],
                additionalProperties: false,
              },
              strict: true,
            },
          },
        ],
        /**
         * Fonksiyon aracı adlarının fonksiyon geri çağırmasına eşlenmesi.
         */
        functionToolCallbacks: {
          // bu fonksiyon JSON ile ayrıştırılmış bir değer kabul etmeli ve bir dize
          // veya bir `Promise<string>` döndürmelidir.
          addNumbers: (parameters) => {
            const { a, b } = parameters;
            return JSON.stringify(a + b);
          },
        },
      },
    },
  ],
  tests: [
    {
      vars: { a: 5, b: 6 },
    },
  ],
});
```

## Ses yetenekleri

Ses desteği olan OpenAI modelleri (`gpt-audio`, `gpt-audio-mini`, `gpt-4o-audio-preview` ve `gpt-4o-mini-audio-preview` gibi) ses girişlerini işleyebilir ve ses çıktıları üretebilir. Bu, konuşmayı metne dönüştürme (STT), metni konuşmaya dönüştürme (TTS) ve konuşmadan konuşmaya (speech-to-speech) yeteneklerinin test edilmesini sağlar.

**Kullanılabilir ses modelleri:**

- `gpt-audio`: En son ses modeli (1 milyon metin tokenı için 2,50 $ / 10 $, 1 milyon ses tokenı için 40 $ / 80 $)
- `gpt-audio-mini`: Maliyet etkin ses modeli (1 milyon metin tokenı için 0,60 $ / 2,40 $, 1 milyon ses tokenı için 10 $ / 20 $)
- `gpt-4o-audio-preview`: Önizleme ses modeli
- `gpt-4o-mini-audio-preview`: Önizleme mini ses modeli

### Ses girişlerini kullanma

Şu formatı kullanarak istemlerinize ses dosyaları dahil edebilirsiniz:

```json title="audio-input.json"
[
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "Yardımsever bir müşteri destek ajanısınız. Müşterinin talebini dinleyin ve faydalı bir cevap verin."
      },
      {
        "type": "input_audio",
        "input_audio": {
          "data": "{{audio_file}}",
          "format": "mp3"
        }
      }
    ]
  }
]
```

Bu girişle uyumlu bir yapılandırma:

```yaml title="promptfooconfig.yaml"
prompts:
  - id: file://audio-input.json
    label: Ses Girişi

providers:
  - id: openai:chat:gpt-4o-audio-preview
    config:
      modalities: ['text'] # 'audio' yu da destekler

tests:
  - vars:
      audio_file: file://assets/transcript1.mp3
    assert:
      - type: llm-rubric
        value: Müşterinin sorunu çözüldü
```

Desteklenen ses dosyası formatları şunları içerir: WAV, MP3, OGG, AAC, M4A ve FLAC.

### Ses yapılandırma seçenekleri

Ses yapılandırması şu parametreleri destekler:

| Parametre | Açıklama                        | Varsayılan | Seçenekler                              |
| --------- | ------------------------------- | ---------- | --------------------------------------- |
| `voice`   | Ses üretimi için kullanılacak ses | alloy      | alloy, echo, fable, onyx, nova, shimmer |
| `format`  | Üretilecek ses formatı           | wav        | wav, mp3, opus, aac                     |
| `speed`   | Konuşma hızı çarpanı            | 1.0        | 0,25 ile 4,0 arasında herhangi bir sayı |
| `bitrate` | Sıkıştırılmış formatlar için bit hızı | -          | örn. "128k", "256k"                     |

Web arayüzünde, ses çıktıları gömülü bir oynatıcı ve döküm (transcript) ile görüntülenir. Tam çalışan bir örnek için [OpenAI ses örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-audio) bakın veya şunu kullanarak başlatın:

```bash
npx promptfoo@latest init --example openai-audio
```

### Ses dökümü (transcription)

OpenAI, konuşmayı metne dönüştürmek için özel döküm modelleri sunar. Bu modeller token başına değil, sesin dakikası başına ücretlendirilir.
**Kullanılabilir döküm modelleri:**

| Model                       | Açıklama                                    | Dakika başı maliyet |
| --------------------------- | ------------------------------------------- | ------------------- |
| `whisper-1`                 | Orijinal Whisper döküm modeli               | 0,006 $             |
| `gpt-4o-transcribe`         | Döküm için optimize edilmiş GPT-4o          | 0,006 $             |
| `gpt-4o-mini-transcribe`    | Daha hızlı, daha maliyet etkin seçenek      | 0,003 $             |
| `gpt-4o-transcribe-diarize` | Farklı konuşmacıları tanımlar               | 0,006 $             |

Döküm modellerini kullanmak için `openai:transcription:<model name>` sağlayıcı formatını belirtin:

```yaml title="promptfooconfig.yaml"
prompts:
  - file://sample-audio.mp3

providers:
  - id: openai:transcription:whisper-1
    config:
      language: en # İsteğe bağlı: daha iyi doğruluk için dili belirtin
      temperature: 0 # İsteğe bağlı: daha deterministik çıktı için 0

  - id: openai:transcription:gpt-4o-transcribe
    config:
      language: en
      prompt: Bu, yapay zeka ve makine öğrenimi hakkında teknik bir tartışmadır.

  - id: openai:transcription:gpt-4o-transcribe-diarize
    config:
      num_speakers: 2 # İsteğe bağlı: beklenen konuşmacı sayısı
      speaker_labels: ['Ali', 'Ayşe'] # İsteğe bağlı: konuşmacı isimlerini sağlayın

tests:
  - assert:
      - type: contains
        value: beklenen döküm içeriği
```

#### Döküm yapılandırma seçenekleri

| Parametre                 | Açıklama                                  | Seçenekler             |
| ------------------------- | ----------------------------------------- | ---------------------- |
| `language`                | Sesin dili (ISO-639-1)                    | örn. 'tr', 'en', 'fr'  |
| `prompt`                  | Döküm doğruluğunu artırmak için bağlam    | Herhangi bir metin dizesi |
| `temperature`             | Rastgeleliği kontrol eder (0-1)           | 0 ile 1 arasında sayı  |
| `timestamp_granularities` | Kelime veya bölüm düzeyinde zaman damgaları al | ['word', 'segment']    |
| `num_speakers`            | Beklenen konuşmacı sayısı (diarization)  | Sayı                   |
| `speaker_labels`          | Konuşmacılar için isimler (diarization)  | Dizi (string array)    |

Desteklenen ses formatları şunları içerir: MP3, MP4, MPEG, MPGA, M4A, WAV ve WEBM.

#### Diarization (Konuşmacı Ayırma) örneği

Diarization modeli, sesteki farklı konuşmacıları tanımlar:

```yaml title="promptfooconfig.yaml"
prompts:
  - file://roportaj.mp3

providers:
  - id: openai:transcription:gpt-4o-transcribe-diarize
    config:
      num_speakers: 2
      speaker_labels: ['Röportaj Yapan', 'Konuk']

tests:
  - assert:
      - type: contains
        value: Röportaj Yapan
      - type: contains
        value: Konuk
```

Tam çalışan bir örnek için [OpenAI ses dökümü örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-audio-transcription) bakın veya şunu kullanarak başlatın:

```bash
npx promptfoo@latest init --example openai-audio-transcription
```

## Realtime API Modelleri

Realtime API; hem metin hem de ses giriş/çıkışlarını akışlı (streaming) yanıtlarla destekleyerek, WebSockets kullanarak GPT-4o sınıfı modellerle gerçek zamanlı iletişime olanak tanır.

### Desteklenen Realtime Modelleri

- `gpt-realtime`: En son realtime model (1 milyon metin tokenı için 4 $ / 16 $, 1 milyon ses tokenı için 40 $ / 80 $)
- `gpt-realtime-mini`: Maliyet etkin realtime model (1 milyon metin tokenı için 0,60 $ / 2,40 $, 1 milyon ses tokenı için 10 $ / 20 $)
- `gpt-4o-realtime-preview-2024-12-17`
- `gpt-5-mini-realtime-preview-2024-12-17`

### Realtime API Kullanımı

OpenAI Realtime API'sini kullanmak için `openai:realtime:<model name>` sağlayıcı formatını kullanın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:realtime:gpt-4o-realtime-preview-2024-12-17
    config:
      modalities: ['text', 'audio']
      voice: 'alloy'
      instructions: 'Yardımsever bir asistansınız.'
      temperature: 0.7
      websocketTimeout: 60000 # 60 saniye
      # İsteğe bağlı: özel/proxy uç noktalarına yönlendirin; WS URL'si otomatik olarak türetilir
      # https:// → wss://, http:// → ws://
      # Örnek: wss://ozel-api.com/v1/realtime
      # apiBaseUrl: 'https://ozel-api.com/v1'
```

### Realtime-Özel Yapılandırma Seçenekleri

Realtime API yapılandırması, standart OpenAI parametrelerine ek olarak şu parametreleri destekler:

| Parametre                    | Açıklama                                            | Varsayılan             | Seçenekler                              |
| ---------------------------- | --------------------------------------------------- | ---------------------- | --------------------------------------- |
| `modalities`                 | Modelin işleyebileceği ve üretebileceği içerik türleri | ['text', 'audio']      | 'text', 'audio'                         |
| `voice`                      | Ses üretimi için kullanılacak ses                   | 'alloy'                | alloy, echo, fable, onyx, nova, shimmer |
| `instructions`               | Model için sistem talimatları                        | 'You are a helpful...' | Herhangi bir metin dizesi                |
| `input_audio_format`         | Ses giriş formatı                                   | 'pcm16'                | 'pcm16', 'g711_ulaw', 'g711_alaw'       |
| `output_audio_format`        | Ses çıkış formatı                                   | 'pcm16'                | 'pcm16', 'g711_ulaw', 'g711_alaw'       |
| `websocketTimeout`           | WebSocket bağlantısı için zaman aşımı (milisaniye)     | 30000                  | Herhangi bir sayı                       |
| `max_response_output_tokens` | Model yanıtındaki maksimum token sayısı            | 'inf'                  | Sayı veya 'inf'                         |
| `tools`                      | Fonksiyon çağırma için araç tanımları dizisi        | []                     | Araç nesneleri dizisi                   |
| `tool_choice`                | Araçların nasıl seçileceğini kontrol eder           | 'auto'                 | 'none', 'auto', 'required' veya nesne   |

#### Özel uç noktalar ve proxyler (Realtime)

Realtime sağlayıcısı, diğer OpenAI sağlayıcılarıyla aynı temel URL yapılandırmasına uyar. WebSocket URL'si, protokoller dönüştürülerek `getApiUrl()`'den türetilir: `https://` → `wss://` ve `http://` → `ws://`.

Bunu Azure uyumlu uç noktaları, proxyleri veya yerel geliştirme sunucularını hedeflemek için kullanabilirsiniz:

```yaml
providers:
  - id: openai:realtime:gpt-4o-realtime-preview
    config:
      apiBaseUrl: 'https://ozel-api.com/v1' # wss://ozel-api.com/v1/realtime adresine bağlanır
      modalities: ['text']
      temperature: 0.7
```

`OPENAI_API_BASE_URL` ve `OPENAI_BASE_URL` ortam değişkenleri ayrıca Realtime WebSocket bağlantıları için de geçerlidir.

### Realtime API ile Fonksiyon Çağırma

Realtime API, Sohbet API'sine benzer şekilde araçlar üzerinden fonksiyon çağırmayı destekler. İşte bir örnek yapılandırma:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:realtime:gpt-4o-realtime-preview-2024-12-17
    config:
      tools:
        - type: function
          name: get_weather
          description: Bir konumun mevcut hava durumunu al
          parameters:
            type: object
            properties:
              location:
                type: string
                description: Şehir ve eyalet/ülke, örn. İstanbul, TR
            required: ['location']
      tool_choice: 'auto'
```

### Tam Örnek

Realtime API yeteneklerini gösteren tam çalışan bir örnek için [OpenAI Realtime API örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-realtime) bakın veya şunu kullanarak başlatın:

```bash
npx promptfoo@latest init --example openai-realtime
```

Bu örnek şunları içerir:

- Realtime API ile temel tek turlu etkileşimler
- Kalıcı bağlamlı çok turlu konuşmalar
- Ayrı konuşma kimlikleri (conversation IDs) ile konuşma dizileri
- Mesajları düzgün şekilde formatlamak için JavaScript istem fonksiyonu
- Realtime API ile fonksiyon çağırma
- İçerik türlerini doğru şekilde işleme konusunda ayrıntılı belgeler

### Giriş ve Mesaj Formatı

Realtime API'yi promptfoo ile kullanırken, istemi JSON formatında belirtebilirsiniz:

```json title="realtime-input.json"
[
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "{{question}}"
      }
    ]
  }
]
```

Realtime API, Sohbet API'si ile aynı multimedya formatlarını destekleyerek istemlerinize görüntü ve ses dahil etmenize olanak tanır.

### Çok Turlu Konuşmalar

Realtime API, kalıcı bağlamlı çok turlu konuşmaları destekler. Uygulama ayrıntıları ve örnekler için, `conversationId` meta veri özelliğini kullanarak hem tek turlu etkileşimleri hem de konuşma dizilerini gösteren [OpenAI Realtime örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-realtime) bakın.

> **Önemli**: Çok turlu konuşmaları uygularken, kullanıcı girişleri için `type: "input_text"` ve asistan yanıtları için `type: "text"` kullanın.

## Responses API

OpenAI'ın Responses API'si; metin ve görüntü girişlerini, fonksiyon çağırmayı ve konuşma durumunu destekleyen, model yanıtları oluşturmak için en gelişmiş arayüzdür. o1, o3 ve o4 serisi gibi akıl yürütme modelleri de dahil olmak üzere OpenAI'ın tüm özellik paketine erişim sağlar.

### Desteklenen Responses Modelleri

Responses API, aşağıdakiler dahil olmak üzere geniş bir model yelpazesini destekler:

- `gpt-5`: OpenAI'ın en yetenekli görme (vision) modeli
- `o1`: Güçlü akıl yürütme modeli
- `o1-mini`: Daha küçük, daha uygun fiyatlı akıl yürütme modeli
- `o1-pro`: Daha fazla hesaplama ile geliştirilmiş akıl yürütme modeli
- `o3-pro`: En üst düzey akıl yürütme modeli
- `o3`: OpenAI'ın en güçlü akıl yürütme modeli
- `o3-mini`: Daha küçük, daha uygun fiyatlı akıl yürütme modeli
- `o4-mini`: En son hızlı, maliyet etkin akıl yürütme modeli
- `codex-mini-latest`: Codex CLI için optimize edilmiş hızlı akıl yürütme modeli
- `gpt-5-codex`: Kod üretimi için optimize edilmiş GPT-5 tabanlı kodlama modeli
- `gpt-5-pro`: En yüksek akıl yürütme yeteneğine sahip premium GPT-5 modeli (1 milyon token için 15 $ / 120 $)

### Responses API Kullanımı

OpenAI Responses API'sini kullanmak için `openai:responses:<model name>` sağlayıcı formatını kullanın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5
    config:
      temperature: 0.7
      max_output_tokens: 500
      instructions: 'Siz yardımsever, yaratıcı bir yapay zeka asistansınız.'
```

### Responses-Özel Yapılandırma Seçenekleri

Responses API yapılandırması, standart OpenAI parametrelerine ek olarak şu parametreleri destekler:

| Parametre              | Açıklama                                          | Varsayılan | Seçenekler                          |
| ---------------------- | ------------------------------------------------- | ---------- | ----------------------------------- |
| `instructions`         | Model için sistem talimatları                      | Yok        | Herhangi bir metin dizesi            |
| `max_output_tokens`    | Yanıtta oluşturulacak maksimum token sayısı       | 1024       | Herhangi bir sayı                   |
| `metadata`             | Model yanıtına eklenen anahtar-değer çiftleri     | Yok        | Dize anahtarlarının dize değerlere eşlenmesi |
| `parallel_tool_calls`  | Modelin araç çağrılarını paralel olarak yürütmesine izin ver | true       | Boolean                             |
| `previous_response_id` | Çok turlu bağlam için önceki bir yanıtın kimliği  | Yok        | Dize                                |
| `store`                | Yanıtın daha sonra geri alınmak üzere saklanıp saklanmayacağı | true       | Boolean                             |
| `truncation`           | Bağlam penceresi taşmasını yönetme stratejisi      | 'disabled' | 'auto', 'disabled'                  |
| `reasoning`            | Akıl yürütme modelleri için yapılandırma          | Yok        | `effort` alanına sahip nesne        |

### MCP (Model Bağlam Protokolü - Model Context Protocol) Desteği

Responses API, modellerin görevleri yerine getirmek için uzak MCP sunucularını kullanmasına olanak tanıyan OpenAI'ın MCP entegrasyonunu destekler. MCP araçları, standartlaştırılmış bir protokol üzerinden harici hizmetlere ve API'lere erişim sağlar.

#### Temel MCP Yapılandırması

Responses API ile MCP araçlarını kullanmak için bunları `tools` dizisine ekleyin:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5
    config:
      tools:
        - type: mcp
          server_label: deepwiki
          server_url: https://mcp.deepwiki.com/mcp
          require_approval: never
```

#### MCP Araç Yapılandırma Seçenekleri

| Parametre          | Açıklama                                  | Gerekli | Seçenekler                               |
| ------------------ | ----------------------------------------- | -------- | ---------------------------------------- |
| `type`             | Araç türü ('mcp' olmalıdır)               | Evet     | 'mcp'                                    |
| `server_label`     | MCP sunucusunu tanımlamak için etiket     | Evet     | Herhangi bir dize                        |
| `server_url`       | Uzak MCP sunucusunun URL'si               | Evet     | Geçerli URL                              |
| `require_approval` | Araç çağrıları için onay ayarları         | Hayır    | 'never' veya onay ayarlarını içeren nesne |
| `allowed_tools`    | Sunucudan izin verilecek belirli araçlar   | Hayır    | Araç adları dizisi                       |
| `headers`          | Kimlik doğrulama için özel başlıklar     | Hayır    | Başlık anahtar-değer çiftlerini içeren nesne |

#### MCP Sunucuları ile Kimlik Doğrulama

Çoğu MCP sunucusu kimlik doğrulama gerektirir. API anahtarlarını veya tokenları sağlamak için `headers` parametresini kullanın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5
    config:
      tools:
        - type: mcp
          server_label: stripe
          server_url: https://mcp.stripe.com
          headers:
            Authorization: 'Bearer sk-test_...'
          require_approval: never
```

#### MCP Araçlarını Filtreleme

Bir MCP sunucusundan hangi araçların kullanılabileceğini sınırlamak için `allowed_tools` parametresini kullanın:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5
    config:
      tools:
        - type: mcp
          server_label: deepwiki
          server_url: https://mcp.deepwiki.com/mcp
          allowed_tools: ['ask_question']
          require_approval: never
```

#### Onay Ayarları

Varsayılan olarak OpenAI, verileri MCP sunucularıyla paylaşmadan önce onay gerektirir. Onay ayarlarını yapılandırabilirsiniz:

```yaml title="promptfooconfig.yaml"
# Tüm araçlar için asla onay gerektirme
providers:
  - id: openai:responses:gpt-5
    config:
      tools:
        - type: mcp
          server_label: deepwiki
          server_url: https://mcp.deepwiki.com/mcp
          require_approval: never

# Sadece belirli araçlar için asla onay gerektirme
providers:
  - id: openai:responses:gpt-5
    config:
      tools:
        - type: mcp
          server_label: deepwiki
          server_url: https://mcp.deepwiki.com/mcp
          require_approval:
            never:
              tool_names: ["ask_question", "read_wiki_structure"]
```

#### Tam MCP Örneği

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - '{{repo}} için MCP spesifikasyonunda desteklenen taşıma protokolleri nelerdir?'

providers:
  - id: openai:responses:gpt-5
    config:
      tools:
        - type: mcp
          server_label: deepwiki
          server_url: https://mcp.deepwiki.com/mcp
          require_approval: never
          allowed_tools: ['ask_question']

tests:
  - vars:
      repo: modelcontextprotocol/modelcontextprotocol
    assert:
      - type: contains
        value: 'transport protocols'
```

Tam çalışan bir örnek için [OpenAI MCP örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-mcp) bakın veya şunu kullanarak başlatın:

```bash
npx promptfoo@latest init --example openai-mcp
```

### Akıl Yürütme Modelleri

`o1`, `o1-pro`, `o3`, `o3-pro`, `o3-mini` veya `o4-mini` gibi akıl yürütme modellerini kullanırken akıl yürütme çabasını kontrol edebilirsiniz:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:o3
    config:
      reasoning:
        effort: 'medium' # "low", "medium" veya "high" olabilir
      max_output_tokens: 1000
```

Akıl yürütme modelleri "cevap vermeden önce düşünür" ve çıktıda görünmeyen ancak token kullanımı ve faturalandırmada hesaba katılan dahili akıl yürütme üretir.

### o3 ve o4-mini Modelleri

OpenAI, o-serisinde gelişmiş akıl yürütme modelleri sunar:

#### o3 ve o4-mini

Bu akıl yürütme modelleri farklı performans ve verimlilik profilleri sunar:

- **o3**: Karmaşık matematiksel, bilimsel ve kodlama görevleri için optimize edilmiş güçlü akıl yürütme modeli
- **o4-mini**: Daha düşük maliyetle kodlama ve görsel görevlerde güçlü performansa sahip verimli akıl yürütme modeli

Her iki modelin özellikleri:

- Büyük bağlam penceresi (200.000 token)
- Yüksek maksimum çıktı tokenı (100.000 token)

Güncel özellikler ve fiyatlandırma bilgileri için [OpenAI'ın fiyatlandırma sayfasına](https://openai.com/pricing) bakın.

Örnek yapılandırma:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:o3
    config:
      reasoning:
        effort: 'high'
      max_output_tokens: 2000

  - id: openai:responses:o4-mini
    config:
      reasoning:
        effort: 'medium'
      max_output_tokens: 1000
```

### Derin Araştırma (Deep Research) Modelleri (Sadece Responses API)

Derin araştırma modelleri (`o3-deep-research`, `o4-mini-deep-research`), web arama yetenekleri gerektiren karmaşık araştırma görevleri için tasarlanmış özel akıl yürütme modelleridir.

Kullanılabilir modeller:

- `o3-deep-research`: En güçlü derin araştırma modeli (giriş 1M için 10 $, çıkış 1M için 40 $)
- `o3-deep-research-2025-06-26`: Anlık görüntü sürümü
- `o4-mini-deep-research`: Daha hızlı, daha uygun fiyatlı (giriş 1M için 2 $, çıkış 1M için 8 $)
- `o4-mini-deep-research-2025-06-26`: Anlık görüntü sürümü

Tüm derin araştırma modelleri:

- `web_search_preview` aracının yapılandırılmış olmasını **gerektirir**.
- 200.000 tokenlık bağlam penceresini destekler.
- 100.000'e kadar çıktı tokenını destekler.
- Araştırma görevlerini tamamlamak 2-10 dakika sürebilir.
- Çıktı üretmeden önce akıl yürütme için önemli miktarda token kullanır.

Örnek yapılandırma:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:o4-mini-deep-research
    config:
      max_output_tokens: 50000 # Yüksek limit önerilir
      tools:
        - type: web_search_preview # Gerekli
```

#### Gelişmiş Yapılandırma

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:o3-deep-research
    config:
      max_output_tokens: 100000
      max_tool_calls: 50 # Maliyeti/gecikmeyi kontrol etmek için aramaları sınırlayın
      background: true # Uzun süreli görevler için önerilir
      store: true # Konuşmayı 30 gün boyunca sakla
      tools:
        - type: web_search_preview # Gerekli
        - type: code_interpreter # İsteğe bağlı: Veri analizi için
          container:
            type: auto
        - type: mcp # İsteğe bağlı: Özel verilere bağlanın
          server_label: sirket_verileri
          server_url: https://api.sirketim.com/mcp
          require_approval: never # Derin araştırma için 'never' olmalıdır
```

#### Yanıt Formatı

Derin araştırma modelleri özel çıktı öğeleri döndürür:

- **web_search_call**: Web arama eylemleri (search, open_page, find_in_page)
- **code_interpreter_call**: Analiz için kod yürütme
- **message**: Satır içi alıntılar ve açıklamalar içeren son cevap

Örnek yanıt yapısı:

```json
{
  "output": [
    {
      "type": "web_search_call",
      "action": {
        "type": "search",
        "query": "en son yapay zeka araştırma kağıtları 2025"
      }
    },
    {
      "type": "message",
      "content": [
        {
          "type": "output_text",
          "text": "Araştırmama dayanarak...",
          "annotations": [
            {
              "url": "https://arxiv.org/...",
              "title": "Makale Başlığı",
              "start_index": 123,
              "end_index": 145
            }
          ]
        }
      ]
    }
  ]
}
```

#### En İyi Uygulamalar

1. **Arka Plan Modunu Kullanın**: Üretim için, uzun yanıt sürelerini yönetmek üzere her zaman `background: true` kullanın.
2. **Yüksek Token Limitleri Ayarlayın**: `max_output_tokens: 50000` veya daha fazlasını kullanın.
3. **Zaman Aşımlarını Yapılandırın**: 10 dakikalık zaman aşımları için `PROMPTFOO_EVAL_TIMEOUT_MS=600000` ayarlayın.
4. **Maliyetleri Kontrol Edin**: Arama sayısını sınırlamak için `max_tool_calls` kullanın.
5. **İstemleri Geliştirin**: Derin araştırmadan önce istemleri netleştirmek/yeniden yazmak için daha hızlı bir model kullanmayı düşünün.

#### Zaman Aşımı Yapılandırması

Derin araştırma modelleri otomatik olarak uygun zaman aşımlarını kullanır:

- `PROMPTFOO_EVAL_TIMEOUT_MS` ayarlanmışsa, API çağrısı için bu kullanılır.
- Aksi takdirde, derin araştırma modelleri varsayılan olarak 10 dakikalık bir zaman aşımına (600.000 ms) sahiptir.
- Normal modeller standart 5 dakikalık zaman aşımını kullanmaya devam eder.

Örnek:

```bash
# Tüm değerlendirmeler için özel bir zaman aşımı ayarlayın
export PROMPTFOO_EVAL_TIMEOUT_MS=900000  # 15 dakika

# Veya varsayılan API zaman aşımını ayarlayın (tüm sağlayıcıları etkiler)
export REQUEST_TIMEOUT_MS=600000  # 10 dakika
```

:::tip
Derin araştırma modelleri yüksek `max_output_tokens` değerleri (50.000+) ve uzun zaman aşımları gerektirir. 10 dakikalık zaman aşımları için `PROMPTFOO_EVAL_TIMEOUT_MS=600000` ayarlayın.
:::

:::warning
Derin araştırma modelleri için `web_search_preview` aracı **gereklidir**. Bu araç yapılandırılmamışsa sağlayıcı bir hata döndürecektir.
:::

### GPT-5-pro Zaman Aşımı Yapılandırması

GPT-5-pro, gelişmiş akıl yürütme yetenekleri nedeniyle genellikle uzatılmış zaman aşımları gerektiren uzun süreli bir moeldir. Derin araştırma modelleri gibi, GPT-5-pro da standart 5 dakikalık zaman aşımı yerine **otomatik olarak** 10 dakikalık bir zaman aşımı (600.000 ms) alır.

**Otomatik zaman aşımı davranışı:**

- GPT-5-pro otomatik olarak 10 dakikalık bir zaman aşımı (600.000 ms) alır - **yapılandırma gerekmez**.
- Daha fazlasına ihtiyacınız varsa `PROMPTFOO_EVAL_TIMEOUT_MS` ayarlayın (örn. 15 dakika için 900000).
- `REQUEST_TIMEOUT_MS`, GPT-5-pro için **yok sayılır** (otomatik zaman aşımı önceliklidir).

**Çoğu kullanıcının herhangi bir zaman aşımı yapılandırmasına ihtiyacı olmayacaktır** - otomatik 10 dakikalık zaman aşımı çoğu GPT-5-pro isteği için yeterlidir.

**Zaman aşımı yaşarsanız şunları yapılandırın:**

```bash
# Sadece otomatik 10 dakikadan fazlasına ihtiyacınız varsa
export PROMPTFOO_EVAL_TIMEOUT_MS=1200000   # 20 dakika

# Altyapı güvenilirliği için (önerilir)
export PROMPTFOO_RETRY_5XX=true            # 502 Bad Gateway hatalarını yeniden dene
export PROMPTFOO_REQUEST_BACKOFF_MS=10000  # Daha uzun yeniden deneme bekleme süresi

# Hız sınırlarından kaçınmak için eşzamanlılığı azaltın
promptfoo eval --max-concurrency 2
```

**Yaygın GPT-5-pro hataları ve çözümleri:**

GPT-5-pro ile hatalarla karşılaşırsanız:

1. **Request timed out** - GPT-5-pro'nun otomatik 10 dakikadan fazlasına ihtiyacı varsa `PROMPTFOO_EVAL_TIMEOUT_MS=1200000` (20 dakika) ayarlayın.
2. **502 Bad Gateway** - Cloudflare/OpenAI altyapı zaman aşımlarını yeniden denemek için `PROMPTFOO_RETRY_5XX=true` ayarlayın.
3. **getaddrinfo ENOTFOUND** - Geçici DNS hataları; `--max-concurrency 2` ile eşzamanlılığı azaltın.
4. **Upstream connection errors** - OpenAI yük dengeleyici sorunları; `PROMPTFOO_REQUEST_BACKOFF_MS=10000` ile bekleme süresini artırın.

:::tip
GPT-5-pro otomatik olarak 10 dakikalık bir zaman aşımı alır - muhtemelen herhangi bir zaman aşımı yapılandırmasına ihtiyacınız yoktur. Altyapı hataları (502, DNS hataları) görürseniz `PROMPTFOO_RETRY_5XX=true` etkinleştirin ve eşzamanlılığı azaltın.
:::

### İstemlerde Görüntü Gönderme

Responses API, metin ve görüntü girişli yapılandırılmış istemleri destekler. Örnek:

```json title="prompt.json"
[
  {
    "type": "message",
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "{{topic}} hakkındaki bu görüntüde ne gördüğünüzü açıklayın."
      },
      {
        "type": "image_url",
        "image_url": {
          "url": "{{image_url}}"
        }
      }
    ]
  }
]
```

### Fonksiyon Çağırma

Responses API, Sohbet API'sine benzer şekilde araç ve fonksiyon çağırmayı destekler:

```yaml title="promptfooconfig.yaml"
providers:
  - id: openai:responses:gpt-5
    config:
      tools:
        - type: function
          function:
            name: get_weather
            description: Bir konumun mevcut hava durumunu al
            parameters:
              type: object
              properties:
                location:
                  type: string
                  description: Şehir ve eyalet/ülke, örn. İstanbul, TR
              required: ['location']
      tool_choice: 'auto'
```

### Azure ile Kullanım

Responses API, `apiHost` yapılandırılarak Azure OpenAI uç noktalarıyla da kullanılabilir:

```yaml
providers:
  - id: openai:responses:gpt-4.1
    config:
      apiHost: 'kaynaginiz.openai.azure.com'
      apiKey: '{{ env.AZURE_API_KEY }}' # veya OPENAI_API_KEY ortam değişkenini ayarlayın
      temperature: 0.7
      instructions: 'Yardımsever bir asistansınız.'
      response_format: file://./response-schema.json
```

Kapsamlı Azure Responses API belgeleri için [Azure sağlayıcı belgelerine](/docs/providers/azure#azure-responses-api) bakın.

### Tam Örnek

Tam çalışan bir örnek için [OpenAI Responses API örneğine](https://github.com/promptfoo/promptfoo/tree/main/examples/openai-responses) bakın veya şunu kullanarak başlatın:

```bash
npx promptfoo@latest init --example openai-responses
```

## Sorun Giderme

### OpenAI hız sınırları (rate limits)

Promptfoo, OpenAI hız sınırlarını yeniden deneme ve uyarlamalı eşzamanlılık ile otomatik olarak yönetir. Ayrıntılar için [Rate Limits](/docs/configuration/rate-limits) belgelerine bakın.

Manuel kontrole ihtiyacınız varsa şunları yapabilirsiniz:

1. CLI'da `--max-concurrency 1` veya yapılandırmada `evaluateOptions.maxConcurrency` ile **eşzamanlılığı azaltın**.
2. CLI'da `--delay 3000` (milisaniye) veya yapılandırmada `evaluateOptions.delay` ile **sabit gecikmeler ekleyin**.
3. `PROMPTFOO_REQUEST_BACKOFF_MS` ortam değişkeni ile **bekleme süresini ayarlayın** (varsayılan: 5000ms).

### OpenAI tutarsızlığı

Dahili Sunucu hataları (Internal Server Errors) olan HTTP isteklerini yeniden denemek için `PROMPTFOO_RETRY_5XX` ortam değişkenini `1` olarak ayarlayın.

## Ajan (Agentic) Sağlayıcılar

OpenAI, farklı kullanım durumları için birkaç ajan sağlayıcı sunar:

### Agents SDK

[OpenAI Agents sağlayıcısı](/docs/providers/openai-agents) ile çok turlu ajan iş akışlarını test edin. Bu sağlayıcı; araçlar, devir teslimler ve izleme ile [@openai/agents](https://github.com/openai/openai-agents-js) SDK'sını destekler.

```yaml
providers:
  - openai:agents:my-agent
    config:
      agent: file://./agents/support-agent.ts
      tools: file://./tools/support-tools.ts
      maxTurns: 10
```

Tam yapılandırma seçenekleri ve örnekler için [OpenAI Agents belgelerine](/docs/providers/openai-agents) bakın.

### Codex SDK

Çalışma dizini erişimi ve yapılandırılmış JSON çıktısı olan ajan kodlama görevleri için [OpenAI Codex SDK sağlayıcısını](/docs/providers/openai-codex-sdk) kullanın. Bu sağlayıcı, kod üretimi için optimize edilmiş `gpt-5.1-codex` modellerini destekler:

```yaml
providers:
  - id: openai:codex-sdk
    config:
      model: gpt-5.1-codex
      working_dir: ./src
      output_schema:
        type: object
        properties:
          code: { type: string }
          explanation: { type: string }
```

İş parçacığı yönetimi, yapılandırılmış çıktı ve Git uyumlu işlemler için [OpenAI Codex SDK belgelerine](/docs/providers/openai-codex-sdk) bakın.
