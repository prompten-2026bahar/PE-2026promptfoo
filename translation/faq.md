# Sıkça Sorulan Sorular

### Promptfoo nedir?

Promptfoo, büyük dil modellerini (LLM) değerlendirmeye (eval) yardımcı olmak için tasarlanmış, yerel öncelikli, açık kaynaklı bir araçtır. Promptfoo, uygulama geliştiricileri ve iş uygulamaları için tasarlanmıştır. Basit, esnek ve genişletilebilir bir API sunar. Promptfoo ile şunları yapabilirsiniz:

1. Promptları birden fazla LLM sağlayıcısı arasında sistematik olarak test edin.
2. Çeşitli doğrulama türlerini kullanarak LLM çıktılarını değerlendirin.
3. Doğruluk, güvenlik ve performans gibi metrikleri hesaplayın.
4. LLM kırmızı takım çalışması için saldırgan testler oluşturun.
5. Komut satırı aracı olarak, bir kütüphane olarak çalıştırın, test çerçeveleriyle entegre edin, CI/CD pipeline'ınızda çalıştırın ve sonuçları tarayıcıda görüntüleyin.

### LLM kırmızı takım çalışması nedir ve Promptfoo bunu nasıl destekler?

LLM kırmızı takım çalışması, dağıtımdan önce potansiyel güvenlik açıklarını, zayıflıkları ve istenmeyen davranışları belirlemek için LLM'leri sistematik olarak test etme sürecidir. Promptfoo, OWASP LLM İlk 10 ve NIST Yapay Zeka Risk Yönetim Çerçevesi gibi endüstri standartlarıyla uyumlu saldırgan testler oluşturmak ve yürütmek için bir çerçeve sunarak bunu destekler.

Promptfoo'nun kırmızı takım yetenekleri şunları yapmanıza olanak tanır:

1. LLM uygulamanıza özel saldırgan testler oluşturun.
2. Dağıtım öncesi ortamda testleri ölçekte çalıştırın.
3. Yapay zeka sistemi güvenliğini ve güvenilirliğini artırmak için sonuçları analiz edin.
4. Gelişen tehditlere karşı LLM performansını sürekli izleyin.

Daha fazla ayrıntı için [LLM Kırmızı Takım Rehberi](/docs/guides/llm-redteaming) sayfamıza bakın.

### Promptfoo hangi LLM sağlayıcılarını destekler?

Promptfoo, aşağıdakiler dahil geniş bir LLM sağlayıcı yelpazesini destekler:

1. OpenAI (GPT-4o, GPT-3.5)
2. Anthropic (Claude)
3. Google (PaLM, Gemini)
4. Amazon Bedrock (Claude, Llama)
5. Azure OpenAI
6. Replicate
7. Hugging Face
8. Yerel modeller ve özel API entegrasyonları

Promptfoo'nun esnek mimarisi, yeni veya özel LLM sağlayıcılarıyla kolay entegrasyona olanak tanır. En güncel liste ve entegrasyon talimatları için lütfen [Sağlayıcılar dokümantasyonumuza](/docs/providers/) bakın.

### Promptfoo çağrıları bir ara sunucuya yönlendirir mi?

Hayır, kaynak kodu makinenizde çalışır. LLM API'lerine yapılan çağrılar doğrudan ilgili sağlayıcıya gönderilir. Promptfoo ekibi bu isteklere veya yanıtlara erişemez.

### Promptfoo API anahtarlarını saklar mı?

Hayır, API anahtarları yerel ortam değişkenleri olarak saklanır ve LLM API'sine doğrudan gönderilmesinin dışında hiçbir yere iletilmez.

### Promptfoo LLM girdilerini ve çıktılarını saklar mı?

Hayır, Promptfoo yerel olarak çalışır ve tüm veriler makinenizde kalır. Tek istisna, girdileri ve çıktıları iki hafta boyunca Cloudflare KV'de saklayan [paylaşım komutunu](/docs/usage/sharing) açıkça kullandığınız zamandır.

### Kişisel veri topluyor musunuz?

Hayır, kişisel tanımlanabilir bilgi (KTB/PII) toplamıyoruz.

### Kurumsal ağlar veya proxy'ler için Promptfoo'yu nasıl yapılandırırım?

Promptfoo proxy ayarları ortam değişkenleri aracılığıyla yapılandırılır:

1. `HTTP_PROXY`: HTTP istekleri için
2. `HTTPS_PROXY`: HTTPS istekleri için
3. `NO_PROXY`: Proxy'den hariç tutulacak ana bilgisayarların virgülle ayrılmış listesi

Proxy URL biçimi: `[protokol://][kullanıcı:şifre@]sunucu[:port]`

Örneğin:

```bash
# Temel proxy
export HTTPS_PROXY=http://proxy.sirket.com:8080

# Kimlik doğrulamalı proxy
export HTTPS_PROXY=http://kullaniciadi:sifre@proxy.sirket.com:8080

# Belirli ana bilgisayarları proxy'den hariç tut
export NO_PROXY=localhost,127.0.0.1,dahili.alan.com
```

Not: Ortam değişkenleri terminal/kabuk örneğinize özeldir. Kalıcı olmasını istiyorsanız, kabuğunuzun başlangıç dosyasına ekleyin (ör. `~/.bashrc`, `~/.zshrc`).

### SSL sertifikalarını ve güvenliği nasıl yapılandırırım?

Özel sertifika yetkililerine sahip ortamlar için (kurumsal ortamlar gibi), aşağıdaki ortam değişkenlerini kullanarak SSL/TLS ayarlarını yapılandırın:

1. `PROMPTFOO_CA_CERT_PATH`: Özel bir CA sertifika paketi yolu. Yol mutlak veya çalışma dizininize göre göreceli olabilir. Geçersiz yollar bir uyarı kaydeder:

   ```bash
   # Mutlak yol
   export PROMPTFOO_CA_CERT_PATH=/yol/ca-bundle.crt

   # Göreceli yol
   export PROMPTFOO_CA_CERT_PATH=./sertifikalar/ca-bundle.crt
   ```

2. `PROMPTFOO_INSECURE_SSL`: SSL sertifika doğrulamasını devre dışı bırakmak için `true` olarak ayarlayın:
   ```bash
   export PROMPTFOO_INSECURE_SSL=true
   ```

Tüm ortam değişkenleri gibi, bu ayarların da terminal/kabuk örneğinize özel olduğunu unutmayın.

### Promptfoo mevcut geliştirme iş akışlarıyla nasıl entegre olur?

Promptfoo, [GitHub Action](https://github.com/promptfoo/promptfoo-action) aracılığıyla CI/CD pipeline'larına entegre edilebilir, Jest ve Vitest gibi test çerçeveleriyle kullanılabilir ve geliştirme sürecinin çeşitli aşamalarına dahil edilebilir.

### Tamamen çevrimdışı bir ortamda Promptfoo'yu nasıl kullanabilirim?

Tüm giden ağ isteklerini devre dışı bırakmak için CLI'yi çalıştırmadan önce aşağıdaki ortam değişkenlerini ayarlayın:

```bash
export PROMPTFOO_DISABLE_TELEMETRY=1
export PROMPTFOO_DISABLE_UPDATE=1
export PROMPTFOO_DISABLE_REMOTE_GENERATION=true
export PROMPTFOO_DISABLE_SHARING=1
export PROMPTFOO_SELF_HOSTED=1
```

CLI'nin harici API'lere ulaşmaya çalışmaması için yalnızca yerel veya kendi barındırdığınız LLM sağlayıcılarını (ör. Ollama) yapılandırın.

### LLMs.txt yayınlıyor musunuz?

Evet. Dokümantasyon web sitesi, otomatik araçların içeriğimizi kolayca dizine ekleyebilmesi için [LLMs.txt spesifikasyonunu](https://llmspec.ai/) takip eder. Dosyalara şu adresten erişebilirsiniz:

- [llms.txt](https://www.promptfoo.dev/llms.txt) - Gezinme ve yapı
- [llms-full.txt](https://www.promptfoo.dev/llms-full.txt) - Tam dokümantasyon içeriği

**Yapay zeka asistanlarıyla kullanım:** LLM değerlendirmeleri, kırmızı takım çalışması veya yapılandırma soruları üzerinde çalışırken kapsamlı promptfoo bağlamı için llms-full.txt içeriğini yapay zeka asistanınıza (ChatGPT, Claude vb.) kopyalayın.

### Ek Okuma

- [Genel Sorun Giderme Rehberi](/docs/usage/troubleshooting) - Bellek optimizasyonu, API anahtarları, zaman aşımları ve hata ayıklama
- [Kırmızı Takım Sorun Giderme Rehberi](/docs/red-team/troubleshooting/overview) - LLM kırmızı takım çalışmasında yaygın sorunlar
- [Yapılandırma Rehberi](/docs/configuration/guide)
- [LLM Kırmızı Takım Rehberi](/docs/guides/llm-redteaming)
