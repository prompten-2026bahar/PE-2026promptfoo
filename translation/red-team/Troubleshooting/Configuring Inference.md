# Çıkarım Yapılandırması (Inference Configuration)

**Promptfoo** açık kaynaklı kırmızı takım (red teaming) araçları, araştırma (probe) üretmek ve sonuçları derecelendirmek için çıkarım (inference) mekanizmasını kullanır. Promptfoo'nun açık kaynaklı çözümünü kullandığınızda, kullanımınız Promptfoo’nun gizlilik politikasına tabidir. Varsayılan olarak tüm çıkarım süreci Promptfoo tarafından yönetilir ve bu hizmet, yüksek kaliteli, çeşitli test senaryoları için optimize edilmiştir.

`red team generate` komutunu çalıştırdığınızda, Promptfoo API'si kullanıcı arayüzündeki (UI) "Uygulama Detayları" veya YAML dosyasındaki "Amaç" (Purpose) kısmında sağlanan bilgileri işler. Bu, belirtilen detaylara özel dinamik test senaryoları oluşturur.

`redteam run` komutunu yürüttüğünüzde, Promptfoo’nun çıkarım motoru hedef sisteminize saldırılar düzenler ve sonuçları puanlar. Bu sonuçlar yerel arayüzünüzde (localhost UI) görüntülenebilir.

Promptfoo varsayılan olarak tüm çıkarımı yönettiği için, tüm kullanıcıların adil erişimini sağlamak amacıyla bu hizmetlerde kullanım limitleri bulunur. Açık kaynak sürümü, hedef sisteminize karşı çalıştırılan **sonda (probe)** sayısına göre limit uygular. Kırmızı takım değerlendirmesi sırasında Promptfoo hedef sisteminize her istek gönderdiğinde bu bir "sonda" olarak sayılır. Dahili üretim ve derecelendirme çağrıları sonda olarak sayılmaz. Limitlere ulaştığınızda bir uyarı mesajı veya bulut tabanlı çıkarımı engelleyen bir hata alırsınız.

## Kendi Çıkarım Sürecinizi Yönetme

Uzaktan üretim gerektirmeyen belirli Promptfoo eklentileri için kendi çıkarım sürecinizi yönetmeniz mümkündür. Ancak unutmayın; çıkarım yapılandırması ne olursa olsun **sonda limitleri** geçerli olmaya devam eder.

Bunu yapmanın en basit yolu kendi OpenAI API anahtarınızı tanımlamaktır:

```bash
export OPENAI_API_KEY=sk-...
```
Bu ortam değişkeni ayarlandığında Promptfoo, uzaktan üretim gerektirmeyen eklentiler için yerleşik hizmet yerine kendi OpenAI hesabınızı kullanır.
Ayrıca, varsayılan kırmızı takım sağlayıcılarını kendi modellerinizle geçersiz kılabilirsiniz:
```yaml
redteam:
  providers:
    - id: some-other-model
      # ...
```
Ayrıntılı kurulum talimatları için [Kırmızı Takım Yapılandırması (Red Team Configuration)](https://promptfoo.dev) belgelerine bakın.

Diğer bir alternatif ise modelleri yerel olarak (locally) çalıştırmaktır:

```yaml
redteam:
  providers:
    - id: local-llama
      type: ollama
      model: llama3
```
Bu durum daha fazla hesaplama kaynağı gerektirir ancak bulut çıkarım (cloud inference) bağımlılıklarını ortadan kaldırır. Yerel olarak barındırılan modeller için de kullanım sınırları geçerli olmaya devam eder.

### Uzaktan Üretimi Devre Dışı Bırakma (Disabling Remote Generation)

Promptfoo eklentilerinin bir kısmı, Promptfoo API'si aracılığıyla uzaktan üretim gerektirir ve kendi LLM'nizi sağladığınızda yürütülemez.

Bu eklentiler, eklenti belgelerimizde "🌐" simgesiyle işaretlenmiştir ve aşağıdaki test senaryolarını içerir:

*   Hizalanmamış Zararlı İçerik Eklentileri (Unaligned Harmful Content)
*   Önyargı Eklentileri (Bias)
*   Yalnızca Uzaktan Çalışan Eklentiler (Remote-Only)
*   Tıbbi Eklentiler (Medical)
*   Finansal Eklentiler (Financial)

Bu eklentilerin kullanımını engelleyecek şekilde uzaktan üretimi devre dışı bırakmak mümkündür. Bunu yapmak için aşağıdaki ortam değişkenini ayarlayın:

```bash
PROMPTFOO_DISABLE_REMOTE_GENERATION=1
```
## Özel Sağlayıcı Yapılandırma (Configuring a Custom Provider)
Ayrıca, üretim için Promptfoo'yu kullanmanıza izin veren ancak değerlendirmeyi (evaluation) geçersiz kılan özel bir redteam.provider yapılandırabilirsiniz. redteam.provider alanı, sondaların nasıl oluşturulduğunu değil, kırmızı takım sonuçlarının nasıl derecelendirildiğini kontrol eder. Bu, test senaryolarını Promptfoo'nun çıkarımıyla oluşturmanıza ancak çıktıları kendi LLM'nizi kullanarak yerel olarak değerlendirmenize olanak tanır. Aşağıda bunun nasıl yapılandırılacağına dair bir örnek bulunmaktadır:
```yaml
# Test edilen sağlayıcı (hedef sistem)
providers:
  - id: openai:gpt-4
    # Güvenlik açısından değerlendirdiğiniz sistem budur

# Kırmızı takım yapılandırması
redteam:
  # Kırmızı takım sonuçlarını DERECELENDİRMEK için özel sağlayıcı
  provider: file://./custom-redteam-grader-provider.ts

  # VEYA derecelendirme için yerleşik bir sağlayıcı kullanın
  # provider: openai:gpt-4  # Sonuçları derecelendirmek için GPT-4 kullanın

  # Uzaktan üretim (açık kaynak)
  numTests: 10
  strategies:
    - jailbreak
    - prompt-injection
  plugins:
    - harmful:hate
    - harmful:hate
```
Bu yapılandırmayı kullandığınızda iş akışı şu şekilde olacaktır:

1. **Promptfoo**, kırmızı takım sondalarını (stratejiler/eklentiler) oluşturur.
2. **Hedef sistem** (`openai:gpt-4`), her bir sondaya yanıt verir.
3. **Özel `redteam.provider`**'ınız her bir yanıtı derecelendirir.

### Kurumsal Çözümler (Enterprise Solutions)

Yüksek hacimli ihtiyaçları olan kurumsal kullanıcılar, özel çıkarım planlarını görüşmek için bizimle iletişime geçebilir.

**Promptfoo Enterprise** ayrıca, çıkarımın tamamen dahili olarak yönetilebildiği, tamamen internetten yalıtılmış (air-gapped) ve yerinde (on-premise) çözümleri de destekler.

