# Red Team Sorun Giderme Kılavuzu

Promptfoo ile LLM uygulamalarına yönelik "red teaming" çalışmaları sırasında karşılaşılan yaygın sorunlar ve çözümleri.


| Sorun | Açıklama |
| :--- | :--- |
| **Saldırı Üretimi** | Sistem kapsamı (scope), izinler veya kullanılabilir eylemlerdeki yapılandırma hataları, etkili saldırı üretimini engelleyebilir. |
| **Bağlantı Sorunları** | Kimlik doğrulama hataları, hız sınırlama (rate limiting) sorunları ve yanlış uç nokta (endpoint) yapılandırması başarılı API bağlantılarını engelleyebilir. |
| **Veri İşleme** | Red team testi sırasında makinenizden hangi verilerin çıktığını, uzaktan üretim ve telemetrinin nasıl yapılandırılacağını kapsar. |
| **Hedefleri İlişkilendirme** | Bulguları konsolide etmek ve zaman içindeki performansı takip etmek için `linkedTargetId` kullanarak özel sağlayıcıları bulut hedeflerine bağlayın. |
| **Yanlış Pozitifler (False Positives)** | Yetersiz sistem bağlamı veya yanlış yapılandırılmış puanlayıcı (grader) ayarları, hatalı zafiyet değerlendirmelerine yol açabilir. |
| **Çıkarım Limitleri** | Bulut tabanlı çıkarım servislerindeki kullanım limitleri; test senaryosu üretimini, saldırı yürütmeyi ve değerlendirmeyi kısıtlayabilir. |
| **Çok Turlu Oturumlar** | Oturum yönetimi sorunları, hem istemci hem de sunucu tarafı uygulamalarında konuşma bağlamını bozabilir. |
| **Çoklu Yanıt Türleri** | Standart olmayan formatlar, koruma duvarları (guardrails) veya hata durumları işlenirken yanıt ayrıştırma (parsing) hataları oluşur. |
| **Uzaktan Üretim** | Kurumsal güvenlik duvarları, saldırgan içeriklerle ilgili güvenlik politikaları nedeniyle uzaktan üretim uç noktalarına erişimi engelleyebilir. |

## İlgili Dokümantasyon
*   [Yapay Zeka Red Teaming Yapılandırması İçin En İyi Uygulamalar](#)
*   [Red Team Hızlı Başlangıç Kılavuzu](#)
*   [Yapılandırma Rehberi](#)
