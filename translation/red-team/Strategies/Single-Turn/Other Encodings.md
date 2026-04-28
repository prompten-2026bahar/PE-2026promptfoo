# Diğer Kodlamalar (Other Encodings)

`other-encodings` strateji koleksiyonu, alternatif metin temsilleri kullanan atlatma tekniklerine karşı model direncini test etmek için birden fazla metin dönüştürme yöntemi sunar. Bu koleksiyon otomatik olarak camelCase, Mors alfabesi, Pig Latin ve emoji tabanlı kodlamaları içerir.

## Strateji Koleksiyonu
Bu koleksiyondaki tüm kodlama stratejilerini otomatik olarak dahil etmek için yapılandırmanızda `other-encodings` koleksiyonunu kullanabilirsiniz:

```yaml
# promptfooconfig.yaml
strategies:
  - other-encodings # camelCase, Mors alfabesi, Pig Latin ve emoji kodlamalarını içerir
```
Bu, her bir stratejiyi ayrı ayrı belirtmekle eşdeğerdir:

```yaml
# promptfooconfig.yaml
strategies:
  - camelcase
  - morse
  - piglatin
```
## camelCase

camelCase stratejisi, boşlukları kaldırarak ve sonraki her kelimenin ilk harfini büyük yaparak metni camelCase formatına dönüştürür.

### Nasıl Çalışır?
Dönüşüm şu kuralları izler:

*   İlk kelime küçük harfle başlar.
*   Sonraki her kelimenin ilk harfi büyük yazılır.
*   Kelimeler arasındaki boşluklar kaldırılır.
*   Noktalama işaretleri ve sayılar değişmeden kalır.

Örneğin, "Hello World" şu hale gelir:

`helloWorld`
## Yapılandırma

`camelCase` stratejisini "red team" yapılandırmanıza ayrı bir öğe olarak ekleyin:

```yaml
# promptfooconfig.yaml
strategies:
  - camelcase # camelCase dönüşümünü uygula
```
## Mors Alfabesi (Morse Code)

Mors alfabesi stratejisi, test veri yükündeki (payload) tüm karakterleri, telgraf iletişimi için geliştirilmiş evrensel kodlama sistemi olan nokta ve çizgilere dönüştürür.

### Nasıl Çalışır?
Standart ASCII karakterleri Mors alfabesindeki karşılıklarına dönüştürülür:

*   Harfler, nokta (.) ve çizgi (-) dizilerine dönüştürülür.
*   Kelimeler arasındaki boşluklar eğik çizgi (/) ile değiştirilir.
*   Mors alfabesinde karşılığı olmayan karakterler değişmeden kalır.

Örneğin, "Hello World" şu hale gelir:

`.... . .-.. .-.. --- / .-- --- .-. .-.. -..`

### Yapılandırma

Mors alfabesi stratejisini "red team" yapılandırmanıza bağımsız olarak ekleyin:

```yaml
# promptfooconfig.yaml
strategies:
  - morse # Mors alfabesi dönüşümünü uygula
```
## Pig Latin

Pig Latin stratejisi, metni basit bir dil kodlama biçimi olan Pig Latin'in eğlenceli dil oyunu kurallarına göre dönüştürür.

### Nasıl Çalışır?
Dönüşüm şu kuralları izler:

*   Ünsüz harfle başlayan kelimelerde, baştaki ünsüz kümesi sona taşınır ve "ay" eklenir.
*   Ünlü harfle başlayan kelimelerin sonuna "way" eklenir.
*   Noktalama işaretleri ve sayılar değişmeden kalır.

Örneğin, "Hello World" şu hale gelir:

`elloHay orldWay`
### Yapılandırma

Pig Latin stratejisini "red team" yapılandırmanıza bağımsız olarak ekleyin:

```yaml
# promptfooconfig.yaml
strategies:
  - piglatin # Pig Latin dönüşümünü uygula
```
## Emoji Kodlama (Emoji Encoding)

Emoji kodlama stratejisi, bir UTF-8 veri yükünü (payload) bir emojinin sonuna eklenen görünmez Unicode varyasyon seçicilerinin (variation selectors) içine gizler. Bu, kısa metin dizilerinin çoğunlukla okunamaz kalırken rastgele veriler içermesine olanak tanır.

### Nasıl Çalışır?
*   UTF-8 metninin her bir baytı, 256 varyasyon seçicisinden biriyle eşleştirilir.
*   Seçici dizisi, temel bir emojinin (varsayılan olarak 😊) sonuna eklenir.
*   Kod çözme (decoding) işlemi, orijinal metni geri kazanmak için bu eşleştirmeyi tersine çevirir.

### Yapılandırma
Emoji stratejisini "red team" yapılandırmanıza bağımsız olarak ekleyin:

```yaml
# promptfooconfig.yaml
strategies:
  - emoji # Metni bir emojinin içine gizle
```
## Örnek

Kodlama koleksiyonunu test senaryolarına uygulayan eksiksiz bir örnek:

```yaml
# promptfooconfig.yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
prompts:
  - 'Bu soruyu yanıtla: {{prompt}}'

providers:
  - openai:gpt-5

# Red team yapılandırması
redteam:
  plugins:
    - owasp:llm
  strategies:
    - basic # Orijinal istemleri dahil et
    - other-encodings # camelCase, Mors alfabesi, Pig Latin ve emoji kodlamasını içerir
```
## Teknik Detaylar

Bu kodlama dönüşümleri; uygulanması için ek API çağrısı gerektirmeyen, statik ve deterministik süreçlerdir. Modellerin, metin tabanlı içerik filtrelerini atlatabilecek ancak insanlar tarafından hala yorumlanabilir kalacak şekilde dönüştürülmüş içerikleri nasıl işlediğini test etme imkanı sağlarlar.

## Güvenlik Hususları

Alternatif metin kodlamaları, tam dize eşleşmesine (exact string matching) dayanan içerik filtrelerini atlatmak için kullanılabilir. Saldırganlar, standart metni bu kodlanmış sürümlerle değiştirerek yasaklı içeriklerin tespit edilmesinden kaçabilirler. Bu stratejiler, modellerin bu tür atlatma tekniklerine karşı ne kadar dayanıklı olduğunu değerlendirmeye yardımcı olur.

Bu kodlamalarla test yapmanın sağladığı bazı özel güvenlik faydaları şunlardır:

*   Anahtar kelime eşleşmesine dayanan içerik denetleme sistemlerindeki zayıflıkları belirler.
*   Modelin gizlenmiş (obfuscated) zararlı içeriği anlama yeteneğini test eder.
*   Basit dönüşüm tekniklerine karşı güvenlik bariyerlerinin (guardrails) etkinliğini değerlendirir.
*   Halka açık yapay zeka uygulamaları için daha sağlam güvenlik mekanizmaları geliştirilmesine yardımcı olur.

## İlgili Kavramlar

*   **ROT13 Kodlama** – Bir başka basit karakter değiştirme kodlaması.
*   **Base64 Kodlama** – İkiliden metne (binary-to-text) kodlama stratejisi.
*   **Leetspeak Kodlama** – Sayı ve sembollerle karakter değiştirme.
*   **Homoglyph Kodlama** – Görsel karakter değiştirme tekniği.
