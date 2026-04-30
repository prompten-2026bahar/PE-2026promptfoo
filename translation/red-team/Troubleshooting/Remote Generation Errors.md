### Uzaktan Üretim Hataları (Remote Generation Errors)

Kurumsal güvenlik duvarları veya güvenlik politikaları nedeniyle bağlantı sorunlarıyla karşılaşabilirsiniz. Hizmetimiz, test amaçlı olarak potansiyel olarak zararlı çıktılar ürettiğinden, bazı kuruluşların güvenlik politikaları API uç noktalarımıza (endpoints) erişimi engelleyebilir.

#### Bağlantıyı Kontrol Etme

API'mize ulaşıp ulaşamadığınızı doğrulamak için Promptfoo'nun sürüm uç noktasına erişmeyi deneyin:

```bash
curl https://api.promptfoo.app/version
```
Eğer bu istek başarısız olur veya zaman aşımına uğrarsa, bu durum muhtemelen ağınızın API'mize erişimi engellediği anlamına gelir. Sayfaya ulaşıp ulaşamadığınızı görmek için tarayıcınızda [https://api.promptfoo.app/version](https://api.promptfoo.app/version) adresini açmayı da deneyebilirsiniz.

#### Yaygın Çözümler

**BT Birimi ile Görüşün:** Promptfoo, güvenlik testleri için saldırgan (adversarial) içerikler ürettiğinden, API uç noktalarımız kurumsal güvenlik politikaları tarafından engellenebilir. Şunları talep etmek için BT departmanınızla iletişime geçin:
*   `api.promptfoo.app` adresinin beyaz listeye (allowlist) eklenmesi.
*   Uç noktalarımıza gelen HTTPS trafiğine izin verilmesi.
*   Engellenen istekler için güvenlik günlüklerinin (logs) incelenmesi.

**Farklı Bir Ağ Kullanın:** Promptfoo'yu şuralarda çalıştırmayı deneyin:
*   Kişisel bir ağ.
*   Mobil erişim noktası (hotspot).
*   Kurumsal ağ dışındaki bir geliştirme ortamı.

**Proxy Yapılandırın:** Kurumsal bir proxy kullanmanız gerekiyorsa, bunu ortam değişkenlerini kullanarak yapılandırabilirsiniz. Promptfoo, proxy yapılandırmasını yönetmek için Node.js'in **Undici** kütüphanesini kullanır. Standart proxy ortam değişkenlerini otomatik olarak algılar ve kullanır. Proxy URL formatı şöyledir: `[protokol://][kullanıcı:şifre@]ana_makine[:port]`

```bash
export HTTPS_PROXY=http://proxy.company.com:8080
promptfoo eval
```
### Alternatif Seçenekler

Uzaktan üretim servisimize ağ erişimi sağlayamıyorsanız şunları yapabilirsiniz:

*   Yerel bir LLM ile **yerel üretim** (local generation) kullanın.
*   Kendi üretim servisinizi kurun.
*   Manuel istem (prompt) oluşturma yöntemini kullanın.

Bu seçenekler hakkında daha fazla ayrıntı için [yapılandırma kılavuzumuza](https://promptfoo.dev) göz atın.

### Yardım Alma

Sorun yaşamaya devam ederseniz, kurumsal destek için bizimle iletişime geçin.
