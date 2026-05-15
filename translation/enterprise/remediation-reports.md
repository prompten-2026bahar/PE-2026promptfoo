# İyileştirme Raporları

[Promptfoo Enterprise](/docs/enterprise/), her red team taramasından sonra otomatik olarak iyileştirme raporları oluşturur. Bu raporlar, uygulama rehberliği ile uygulanabilir güvenlik önerileri sağlar.

## Genel Bakış

İyileştirme raporları tarama sonuçlarınızı analiz eder ve şunları sağlar:

- **Yönetici Özeti**: En önemli endişelerle güvenlik duruşunuzun üst düzey değerlendirmesi
- **Güvenlik Açığı-İyileştirme Eşlemesi**: Hangi düzeltmelerin hangi güvenlik açıklarını giderdiğini gösteren hızlı referans
- **Önceliklendirilmiş Eylem Maddeleri**: Etki ve çaba sırasına göre adım adım uygulama rehberliği
- **Kod Örnekleri**: Kullanıma hazır kod parçacıkları ve yapılandırma değişiklikleri
- **Saldırı Bağlamı**: Güvenlik açıklarının nasıl istismar edildiğini gösteren taramanızdan gerçek örnekler

## İyileştirme Raporlarına Erişim

İyileştirme raporları şu durumlarda otomatik olarak oluşturulur:

1. Promptfoo Enterprise kullanıcı arayüzünde bir red team taraması tamamlandığında
2. `promptfoo share` kullanılarak bir CLI taraması sunucuya yüklendiğinde

Bir iyileştirme raporuna erişmek için:

1. Promptfoo Enterprise'da **Raporlar** bölümüne gidin
2. İncelemek istediğiniz değerlendirmeyi seçin
3. İyileştirme raporunu görüntülemek için **İyileştirme** sekmesine tıklayın

![İyileştirme Raporu görünümü](../img/remed1.png)

Alternatif olarak, belirli bir bulguya tıklayarak güvenlik açıkları görünümünden doğrudan iyileştirme raporlarına erişebilirsiniz.

## Rapor Yapısı

### Yönetici Özeti

Yönetici özeti, güvenlik duruşunuzun üst düzey bir genel bakışını sağlar:

- **Genel Risk Düzeyi**: Kritik, Yüksek, Orta veya Düşük sınıflandırması
- **Başlıca Endişeler**: Taramanızda tespit edilen en önemli güvenlik sorunları
- **Güvenlik Duruşu**: Uygulamanızın mevcut güvenlik durumunun anlatısal özeti

Bu bölüm, paydaşların teknik ayrıntılara dalmadan sorunların ciddiyetini hızla anlamasına yardımcı olur.

### Güvenlik Açığı-İyileştirme Eşlemesi

Aşağıdakileri gösteren hızlı referans tablosu:

- Güvenlik açığı kategorisi ve eklenti ID'si
- Başarısız test vakası sayısı
- Risk puanı ve ciddiyet düzeyi
- Her güvenlik açığını hangi iyileştirme eylemlerinin giderdiği

Bu eşleme, güvenlik açıkları ve düzeltmeler arasındaki ilişkiyi anlamanıza yardımcı olarak birden fazla sorunu çözen işleri önceliklendirmenizi kolaylaştırır.

### Önceliklendirilmiş Eylem Maddeleri

Her eylem maddesi şunları içerir:

- **Öncelik Numarası**: Eylemler etki ve uygulanabilirliğe göre sıralanır
- **Eylem Türü**: Düzeltme kategorisi (örn., Sistem Promptu Güçlendirme, Girdi Doğrulama, Çıktı Filtreleme)
- **Başlık ve Açıklama**: Neyin değiştirilmesi gerektiğinin net açıklaması
- **Etki Düzeyi**: Beklenen güvenlik iyileştirmesi (Yüksek, Orta, Düşük)
- **Çaba Düzeyi**: Uygulama zorluğu (Yüksek, Orta, Düşük)
- **Uygulama Ayrıntıları**: Kod örnekleri ile adım adım talimatlar
- **Tahmini Süre**: Uygulamanın ne kadar süreceği
- **Giderilen Güvenlik Açıkları**: Bu eylemin hangi güvenlik sorunlarını düzelteceği

![Uygulama Ayrıntıları ile Önceliklendirilmiş Eylem Maddesi](../img/remed2.png)

#### Eylem Türleri

Yaygın iyileştirme eylem türleri şunlardır:

- **Sistem Promptu Güçlendirme**: Sistem promptlarınızı daha iyi koruma bariyerleri ile güçlendirme
- **Girdi Doğrulama**: İşlemden önce kullanıcı girdilerine doğrulama ekleme
- **Çıktı Filtreleme**: Model yanıtlarını temizlemek için filtreler uygulama
- **Yapılandırma Değişiklikleri**: Model parametrelerini veya API ayarlarını düzenleme
- **Mimari Değişiklikler**: Daha iyi güvenlik için uygulamanızın yapısını değiştirme

### Saldırı Örnekleri

Bir iyileştirme eylemi tarafından giderilen her güvenlik açığı için rapor şunları gösterir:

- Taramanız sırasında başarılı olan gerçek düşmanca problar
- Modelin savunmasız yanıtları
- Testin neden başarısız olarak işaretlendiği

Bu bağlam, her güvenlik açığının gerçek dünya istismarını anlamanıza ve düzeltmelerinizin etkili olduğunu doğrulamanıza yardımcı olur.

## Rapor Özelliklerini Kullanma

### Raporları Yeniden Oluşturma

Tarama verileriniz değiştiyse veya yeni öneriler istiyorsanız:

1. Rapor başlığındaki **Yeniden Oluştur** düğmesine tıklayın
2. Rapor durumu "Oluşturuluyor" olarak değişecektir
3. Sayfa otomatik olarak yoklar ve oluşturma tamamlandığında güncellenir

Rapor oluşturma, taramanızın boyutuna bağlı olarak genellikle 1-3 dakika sürer.

### Raporları İndirme

Raporları ekibiniz veya paydaşlarınızla paylaşmak için:

1. Rapor başlığındaki **PDF İndir** düğmesine tıklayın
2. Rapor yazdırma için biçimlendirilecek ve yazdırma iletişim kutusunda açılacaktır
3. PDF olarak kaydedin veya doğrudan yazdırın

PDF formatı, teknik ve teknik olmayan kitlelerle paylaşım için optimize edilmiştir.

### Sistem Promptu Güçlendirme

Sistem promptu güvenlik açıkları için **Promptu Güçlendir** özelliğini kullanın:

1. Rapor başlığındaki **Promptu Güçlendir** düğmesine tıklayın
2. Tespit edilen güvenlik açıklarını gideren yapay zeka tarafından oluşturulan güçlendirilmiş promptu inceleyin
3. Güçlendirilmiş promptu tarama sonuçlarınıza karşı test edin
4. İyileştirilmiş promptu uygulamanıza kopyalayıp uygulayın

![Sistem Promptu Güçlendirme İletişim Kutusu](../img/remed3.png)

Bu özellik, taramanızda bulunan belirli güvenlik açıklarına dayalı olarak sistem promptlarınızda anında uygulanabilir iyileştirmeler sağlar.

## Rapor Durumları

İyileştirme raporları farklı durumlarda olabilir:

- **Beklemede**: Rapor oluşturma sıraya alınmış ancak henüz başlamamış
- **Oluşturuluyor**: Yapay zeka şu anda taramanızı analiz ediyor ve öneriler oluşturuyor
- **Tamamlandı**: Rapor görüntülenmeye hazır
- **Başarısız**: Oluşturmada bir hata oluştu (yeniden denemek için Yeniden Oluştur'u kullanın)

Rapor sayfası, bir rapor oluşturulurken güncellemeler için otomatik olarak yoklar, bu nedenle manuel olarak yenilemenize gerek yoktur.

## Güncelliğini Yitirmiş Raporlar

Bir iyileştirme raporu oluşturulduktan sonra yeni bir tarama çalıştırırsanız, rapor **Güncelliğini Yitirmiş** olarak işaretlenir. En son sonuçları dahil etmek için raporu yeniden oluşturmanızı isteyen bir uyarı görünecektir.

Yeniden oluşturma, iyileştirme önerilerinizin mevcut güvenlik duruşunuzu yansıtmasını sağlar.

## En İyi Uygulamalar

### Uygulama İş Akışı

1. **Yönetici Özetini İnceleyin**: Genel riski ve başlıca endişeleri anlayın
2. **Güvenlik Açığı Eşlemesini Kontrol Edin**: En fazla kapsamı sağlayan düzeltmeleri belirleyin
3. **Yüksek Etki, Düşük Çaba ile Başlayın**: Hızlı kazanımları önce ele alın
4. **Değişiklikleri Aşamalı Olarak Uygulayın**: Her seferinde bir eylem maddesini düzeltin
5. **Her Düzeltmeden Sonra Yeniden Tarayın**: İyileştirmenizin etkili olduğunu doğrulayın
6. **İlerlemeyi Takip Edin**: Bulguları düzeltildi olarak işaretlemek için güvenlik açıkları sayfasını kullanın

### Önceliklendirme Stratejisi

Önceliklendirirken hem etkiyi hem de çabayı göz önünde bulundurun:

- **Yüksek Etki, Düşük Çaba**: Anında güvenlik kazanımları için bunları önce uygulayın
- **Yüksek Etki, Yüksek Çaba**: Bunları daha uzun vadeli girişimler olarak planlayın
- **Düşük Etki, Düşük Çaba**: Boş kapasiteniz olduğunda iyi adaylar
- **Düşük Etki, Yüksek Çaba**: Uyumluluk için gerekli olmadıkça önceliği düşürün

### Doğrulama

İyileştirme eylemlerini uyguladıktan sonra:

1. Aynı yapılandırma ile yeni bir tarama çalıştırın
2. Yeni raporu öncekiyle karşılaştırın
3. Giderilen güvenlik açıklarının artık görünmediğini doğrulayın
4. Genel risk düzeyinin iyileşip iyileşmediğini kontrol edin
5. Kalan sorunları belirlemek için yeni bir iyileştirme raporu oluşturun

## Bulgular İş Akışı ile Entegrasyon

İyileştirme raporları güvenlik açıkları iş akışını tamamlar:

- **Güvenlik Açıkları Sayfası**: Taramalar boyunca bireysel bulguları takip edin
- **İyileştirme Raporları**: Düzeltmeler için uygulama rehberliği alın
- **Raporlar Sayfası**: Anlık tarama sonuçlarını inceleyin

Sorunları _nasıl_ düzelteceğinizi anlamak için iyileştirme raporlarını kullanın, ardından ilerlemenizi güvenlik açıkları sayfasında takip edin.

## Ayrıca Bakınız

- [Bulgular ve Raporlar](./bulgular-ve-raporlar.md)
- [Red Team Çalıştırma](./red-teamler.md)
- [API Referansı](https://www.promptfoo.dev/docs/api-reference/)
