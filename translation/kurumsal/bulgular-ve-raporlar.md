# Bulgular ve Raporlar

[Promptfoo Enterprise](/docs/enterprise/), Promptfoo Enterprise uygulaması içinde taramalardan elde edilen bulguları ve raporları incelemenize olanak tanır.

## Puanlama Nasıl Çalışır?

Puanlama, bir red team saldırısının başarısını değerlendirme sürecidir. Promptfoo, bir hedef oluştururken sağlanan uygulama bağlamına göre sonuçları puanlar. Bu sonuçlar ardından kontrol paneli, güvenlik açıkları görünümü, raporlar ve değerlendirmeler bölümlerinde derlenir.

## Kontrol Panelinin İncelenmesi

Kontrol paneli, bulguları ve raporları merkezi bir görünümde incelemek için ana sayfadır. Oluşturulan bulgu ve rapor sayısı dahil olmak üzere çalıştırılmış tüm taramaların bir özetini görüntüler.

![Promptfoo Bulut Kontrol Paneli](../img/findings1.png)

## Güvenlik Açıklarını Görüntüleme

"Güvenlik Açıkları" bölümü, bulunan tüm güvenlik açıklarının bir listesini görüntüler. Hedefe, ciddiyet düzeyine, bulgu durumuna, risk kategorisine veya güvenlik açığı türüne göre filtreleme yapabilirsiniz.

Bir güvenlik açığını seçmek, güvenlik açığının ayrıntılarını gösteren bir bulgu açar; bu ayrıntılar arasında güvenlik açığını istismar etmek için kullanılan strateji türleri, kullanılan probların kayıtları, taramalar sırasında güvenlik açığının tespit edildiği durumlar ve iyileştirme önerileri yer alır.

Bulgunun durumunu "Düzeltildi Olarak İşaretlendi", "Yanlış Pozitif" veya "Yoksay" olarak değiştirebilirsiniz. Ayrıca güvenlik açığı hakkında ek bağlam sağlamak için bulgulara yorum ekleyebilir ve şirketinizin risk değerlendirmesine göre güvenlik açığının ciddiyet düzeyini değiştirebilirsiniz.

### Güvenlik Açıklarını Dışa Aktarma

Güvenlik Açıkları sayfasından bulguları çeşitli formatlarda dışa aktarabilirsiniz:

- **CSV olarak dışa aktar**: Her bulgu, ciddiyet ve iyileştirme önerileri hakkında ayrıntılar içeren bir CSV dosyası olarak güvenlik açığı verilerini dışa aktarın.
- **SARIF olarak dışa aktar**: GitHub Security, SonarQube ve diğer DevOps platformları gibi güvenlik araçlarıyla entegrasyon için güvenlik açıklarını [SARIF formatında](https://sarifweb.azurewebsites.net/) (Statik Analiz Sonuçları Değişim Formatı) dışa aktarın. SARIF, statik analiz sonuçlarını temsil etmek için endüstri standardı bir formattır.
- **Colang v1 olarak dışa aktar**: [NVIDIA NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) ile entegrasyon için güvenlik açıklarını Colang 1.0 koruma bariyerleri olarak dışa aktarın. Bu format, red team testleri sırasında keşfedilen güvenlik açıklarına dayalı savunma bariyerleri uygulamanıza olanak tanır.
- **Colang v2 olarak dışa aktar**: NeMo Guardrails için en son Colang formatını destekleyen Colang 2.x koruma bariyerleri olarak güvenlik açıklarını dışa aktarın.

## Raporları Görüntüleme

Raporlar, bir tarama çalıştırdığınızda oluşturulan hedefinizin anlık taramalarıdır. Bu raporlar, belirli bir taramadan elde edilen bulguları incelemek için kullanılabilir.

![Güvenlik açığı rapor görünümü](../img/findings2.png)

Raporlar, hedefi istismar etmede hangi stratejilerin en başarılı olduğunu ve en kritik güvenlik açıklarının neler olduğunu size söyler. "Günlükleri Görüntüle" düğmesini seçerek, belirli taramanın günlüklerini görüntüleyebileceğiniz değerlendirmeler bölümüne yönlendirilirsiniz.

![Günlükleri görüntüle arayüzü](../img/findings3.png)

Değerlendirmeler bölümü, tarama sırasında çalıştırılan tüm test vakalarını ve sonuçları görüntüler. Sonuçları testin geçip geçmediğine, bir hata olup olmadığına veya eklenti türüne göre filtreleyebilirsiniz. Belirli bir test vakası seçmek, kullanılan düşmanca probu, hedeften gelen yanıtı ve puanlama nedenini gösterir.

![Örnek değerlendirme yanıtı](../img/findings4.png)

Bulgunun durumunu geçti veya başarısız olarak değiştirebilir, bulgu hakkında yorum yapabilir, değerlendirme sonucuyla ilişkili güvenlik açığı raporunu görüntüleyebilir ve değerlendirme sonucunu panonuza kopyalayabilirsiniz.

Bir değerlendirmeyi incelerken, sonuçları dışa aktarmanın birden fazla yolu vardır:

- **CSV'ye dışa aktar**: Değerlendirme sonuçlarını CSV dosyası olarak dışa aktarın.
- **JSON'a dışa aktar**: Değerlendirme sonuçlarını JSON dosyası olarak dışa aktarın.
- **Burp Suite Payload'larını İndir**: Düşmanca probları Burp Suite'e aktarılabilir payload'lar olarak indirin.
- **DPO JSON İndir**: Değerlendirme sonuçlarını DPO JSON dosyası olarak indirin.
- **İnsan Değerlendirmesi Test YAML'ını İndir**: Kod ile ilgili görevlerde performans için değerlendirme sonuçlarını değerlendirin.
- **Başarısız test yapılandırmasını indir**: Yalnızca dikkat gerektiren testlere odaklanmak için yalnızca başarısız testleri içeren bir yapılandırma dosyası indirin.

![Dışa aktarma seçenekleri gösterimi](../img/findings5.gif)

## Bulguları Filtreleme ve Sıralama

"Değerlendirmeler" bölümü tüm değerlendirmeleri görüntüler ve bunları değerlendirme ID'si, tarama oluşturulma tarihi, yazar, açıklama, eklenti, strateji, geçme oranı veya test sayısına göre filtrelemenize ve sıralamanıza olanak tanır. Ardından değerlendirmeleri CSV dosyası olarak indirebilirsiniz.

![Değerlendirmeleri filtreleme arayüzü](../img/findings6.png)

Bulguları [Promptfoo'nun API'sini kullanarak](https://www.promptfoo.dev/docs/api-reference/#tag/default/GET/api/v1/results) da arayabilirsiniz.

## Bulguları Paylaşma

Promptfoo uygulaması dışında bulguları paylaşmanın çeşitli yolları vardır:

- **Güvenlik Açıklarını Dışa Aktar**: "Güvenlik Açıkları" bölümünden güvenlik açığı verilerini CSV, SARIF veya Colang formatında dışa aktarın. Format ayrıntıları için yukarıdaki [Güvenlik Açıklarını Dışa Aktarma](#güvenlik-açıklarını-dışa-aktarma) bölümüne bakın.
- **Değerlendirme Sonuçlarını Dışa Aktar**: "Değerlendirmeler" bölümünden değerlendirme sonuçlarını CSV veya JSON olarak dışa aktarın.
- **Güvenlik Açığı Raporlarını İndir**: "Raporlar" bölümünde her tarama için anlık güvenlik açığı raporlarını indirin. Bu raporlar PDF olarak dışa aktarılır.
- **Promptfoo API'sini Kullanın**: Bulguları, raporları ve değerlendirme sonuçlarını dışa aktarmak için [Promptfoo API'sini](https://www.promptfoo.dev/docs/api-reference/) kullanın.
- **URL ile Paylaş**: `promptfoo share` komutu ile değerlendirme sonuçlarınız için paylaşılabilir URL'ler oluşturun. [Paylaşım seçenekleri hakkında daha fazla bilgi edinin](/docs/usage/sharing.md).

## Ayrıca Bakınız

- [Red Team Çalıştırma](./red-teamler.md)
- [Hizmet Hesapları](./hizmet-hesaplari.md)
- [Kimlik Doğrulama](./kimlik-dogrulama.md)
