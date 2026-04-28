### Saldırı Üretimi (Attack Generation)

Bazı durumlarda saldırı senaryoları beklendiği gibi üretilmeyebilir. Bu durum genellikle **Amaç (Purpose)** özelliğinin yeterince açık olmamasından kaynaklanır.

"Amaç" özelliği, saldırı üretim sürecine rehberlik etmek için kullanılır. Bu özelliğin mümkün olduğunca açık ve spesifik olması kritik önem taşır.

**Örneğin:**

> Bir yazılım şirketi için müşteri hizmetleri sohbet botu.

Yukarıdaki ifade oldukça belirsizdir. Daha etkili bir saldırı üretimi için şu bilgileri de ekleyerek daha spesifik hale getirilmelidir:

*   Kullanıcının kim olduğu ve şirketle olan ilişkisi.
*   Kullanıcının hangi verilere erişim izni olduğu.
*   Kullanıcının hangi verilere erişiminin **olmadığı**.
*   Kullanıcının gerçekleştirebileceği işlemler.
*   Kullanıcının gerçekleştirmesine **izin verilmeyen** işlemler.
*   Aracının (agent) hangi sistemlere erişimi olduğu.

**Daha iyi bir örnek:**

> Bir yazılım şirketinin ürünleri hakkındaki soruları yanıtlayan müşteri hizmetleri sohbet botu. Kullanıcı, premium aboneliği olan bir müşteridir.

Bu ifade çok belirsizdir. Daha spesifik hale getirilmelidir.

Aşağıdaki bilgileri mutlaka ekleyin:

*   Kullanıcının kim olduğu ve şirketle olan ilişkisi
*   Kullanıcının hangi verilere erişim izni olduğu
*   Kullanıcının hangi verilere erişiminin **olmadığı**
*   Kullanıcının gerçekleştirebileceği eylemler
*   Kullanıcının gerçekleştirmesine **izin verilmeyen** eylemler
*   Aracının (agent) hangi sistemlere erişimi olduğu

**Örnek İyi Yapılandırılmış Bir Amaç (Purpose):**

> Bir yazılım şirketinin ürünleri hakkındaki soruları yanıtlayan müşteri hizmetleri sohbet botu.
>
> **Kullanıcı:** Premium aboneliği olan bir müşteridir.
>
> **Kullanıcının erişebildiği veriler:**
> - Tüm ürün dokümantasyonu
> - Ürün hakkında genel bilgiler
> - Mevcut abonelik bilgileri
> - Kendine ait açık destek talepleri (tickets)
>
> **Kullanıcının erişemediği veriler:**
> - Şirket içi dahili belgeler
> - Diğer müşteriler hakkındaki bilgiler
>
> **Kullanıcının yapabileceği eylemler:**
> - Bilgi almak için bilgi tabanında (knowledge base) arama yapmak
> - Ürün hakkında soru sormak
> - Destek temsilcisiyle bir görüşme randevusu oluşturmak
> - Destek talebi açmak veya kapatmak
>
> **Kullanıcının yapamayacağı eylemler:**
> - Abonelik bilgilerini güncellemek
> - Diğer müşterilerin bilgilerini güncellemek
> - Diğer müşterilerin destek taleplerini güncellemek
> - Başka bir müşteri adına randevu oluşturmak
>
> **Aracının (Agent) erişimi olan sistemler:**
> - Dahili bilgi tabanı
> - Herkese açık web sitesi
> - Müşteri ilişkileri yönetimi (CRM) sistemi
> - Destek talebi (Ticketing) sistemi
> - Abonelik sistemi

