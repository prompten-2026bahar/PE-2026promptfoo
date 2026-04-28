# Veri İşleme ve Gizlilik

Bu sayfa, "red team" testi sırasında makinenizden hangi verilerin çıktığını ve bunu nasıl kontrol edebileceğinizi açıklar.

## Veri Akışına Genel Bakış
Red team testi, her biri farklı veri gereksinimlerine sahip üç farklı operasyondan oluşur:


| Operasyon | Çalışma Yeri | Dışarıya Gönderilen Veri |
| :--- | :--- | :--- |
| **Hedef Değerlendirme** | Her zaman yerel (local) | Sadece yapılandırılmış LLM sağlayıcınıza |
| **Test Üretimi** | Yerel veya Uzaktan | Yapılandırmaya bağlıdır (aşağıya bakın) |
| **Sonuç Puanlama** | Yerel veya Uzaktan | Yapılandırmaya bağlıdır (aşağıya bakın) |

Hedef modeliniz her zaman yerel olarak değerlendirilir. Uzaktan puanlama (remote grading) kullanmadığınız sürece, Promptfoo hedefinizin yanıtlarını asla almaz.
### Varsayılan Davranış (API Anahtarı Olmadığında)
Bir `OPENAI_API_KEY` veya kullanılabilir bir Codex/ChatGPT girişi olmadığında, Promptfoo test üretimi ve puanlama için barındırılan çıkarım (hosted inference) hizmetini kullanır. Bu durumda `api.promptfoo.app` adresine aşağıdaki veriler gönderilir:

**Test üretimi için:**
*   Uygulama amacı (yapılandırmanızdaki `purpose` alanından)
*   Eklenti (plugin) yapılandırması ve ayarları
*   E-posta adresiniz (kullanım takibi için)

**Puanlama (grading) için:**
*   Hedefinize gönderilen komut (prompt)
*   Hedefinizin yanıtı
*   Puanlama kriterleri

**Asla gönderilmeyenler:**
*   API anahtarları veya kimlik bilgileri
*   `promptfooconfig.yaml` dosyanızın tamamı
*   Model ağırlıkları veya eğitim verileri
*   Dosya sisteminizdeki dosyalar (komutlarda açıkça yapılandırılmadığı sürece)

### Kendi API Anahtarınızla Kullanım
`OPENAI_API_KEY` ayarlandığında, üretim ve puanlama işlemleri Promptfoo sunucuları yerine kendi OpenAI hesabınız üzerinden yönlendirilir:

```yaml
export OPENAI_API_KEY=sk-...
```
Veya puanlama için farklı bir sağlayıcı yapılandırın:
```yaml
redteam:
  provider: anthropic:messages:claude-sonnet-4-20250514
```
Bu yapılandırma ile Promptfoo sunucuları yalnızca telemetri verilerini alır.

### ChatGPT Aboneliği İle Kullanım
Eğer Codex yüklüyse ve ChatGPT ile oturum açılmışsa; Promptfoo, daha yüksek öncelikli bir API kimlik bilgisi yapılandırılmadığında varsayılan metin üretimi ve puanlama için yerel olarak `openai:codex-sdk` kullanabilir. Ancak, "yalnızca uzaktan çalışan" (remote-only) eklentiler hala barındırılan çıkarımı kullanır ve embedding/moderation (yerleştirme/denetleme) doğrulamaları hala API anahtarı olan bir sağlayıcı tanımı gerektirir.

### Yalnızca Uzaktan Çalışan Eklentiler (Remote-Only Plugins)
Bazı eklentiler Promptfoo'nun barındırılan çıkarım (hosted inference) hizmetini gerektirir ve yerel olarak çalışamazlar. Bu eklentiler dokümantasyonda 🌐 simgesiyle işaretlenmiştir.

**Yalnızca uzaktan çalışan eklentiler şunları içerir:**
*   Zararlı içerik eklentileri (`harmful:*`)
*   Yanlılık (Bias) eklentileri
*   Sektöre özel eklentiler (medikal, finans, sigorta, eczacılık, e-ticaret)
*   Güvenlik eklentileri: `ssrf`, `bola`, `bfla`, `indirect-prompt-injection`, `ascii-smuggling`
*   Diğerleri: `competitors`, `hijacking`, `off-topic`, `system-prompt-override`

**Yalnızca uzaktan çalışan stratejiler şunları içerir:** `audio`, `citation`, `gcg`, `goat`, `jailbreak:composite`, `jailbreak:hydra`, `jailbreak:likert`, `jailbreak:meta`

### Uzaktan Üretimi Devre Dışı Bırakma
Tamamen yerel olarak çalışmak için:

```bash
export PROMPTFOO_DISABLE_REMOTE_GENERATION=true
```
Bu komut, yalnızca uzaktan çalışan tüm eklenti ve stratejileri devre dışı bırakır. Bu durumda kendi OPENAI_API_KEY anahtarınızı sağlamalı veya üretim ve puanlama işlemleri için yerel bir model yapılandırmalısınız.
Red Team çalışmalarına özel kontrol için (SimulatedUser uzaktan üretimini aktif tutar):
```bash
export PROMPTFOO_DISABLE_REDTEAM_REMOTE_GENERATION=true
```
Ayrıntılı kurulum için Çıkarım Yapılandırması (Configuring Inference) bölümüne bakabilirsiniz.
### Telemetri (Telemetry)
Promptfoo anonim kullanım telemetrisi toplar:

*   Çalıştırılan komutlar (`redteam generate`, `redteam run` vb.)
*   Kullanılan eklenti ve strateji türleri (içerik değil, sadece tür bilgisi)
*   Doğrulama (assertion) türleri

**İstem (prompt) içeriği, yanıtlar veya kişisel olarak tanımlanabilir bilgiler (PII) kesinlikle dahil edilmez.**

Telemetriyi devre dışı bırakmak için:

```bash
export PROMPTFOO_DISABLE_TELEMETRY=1
```
Ayrıntılar için Telemetri Yapılandırması (Telemetry Configuration) bölümüne bakabilirsiniz.
### Ağ Gereksinimleri
Uzaktan üretim (remote generation) özelliğini kullanırken, Promptfoo'nun şu adreslere erişimi olması gerekir:


| Alan Adı (Domain) | Kullanım Amacı |
| :--- | :--- |
| **api.promptfoo.app** | Test üretimi ve puanlama (grading) |
| **api.promptfoo.dev** | Zararlı eklentiler için onay takibi |
| **a.promptfoo.app** | Telemetri (PostHog) |

Eğer bu adresler güvenlik duvarınız (firewall) tarafından engelleniyorsa, **Uzaktan Üretim Sorun Giderme** bölümüne göz atın.

### Kurumsal Dağıtım (Enterprise Deployment)
Tam ağ izolasyonu gerektiren kuruluşlar için:

**Promptfoo Enterprise On-Prem** şunları sağlar:
*   Ağ sınırlarınız içerisinde çalışan özel bir yürütücü (dedicated runner).
*   Tamamen internetten bağımsız (air-gapped) çalışma özelliği.
*   Tüm eklentiler için kendi sunucunuzda barındırılan (self-hosted) çıkarım hizmeti.
*   Dış sunuculara hiçbir veri aktarımı yapılmaması.

Dağıtım seçenekleri için **Kurumsal Genel Bakış (Enterprise Overview)** sayfasına bakabilirsiniz.
### Yapılandırma Özeti


| Gereksinim | Yapılandırma |
| :--- | :--- |
| **Promptfoo sunucularına veri gitmesin** | Her üretim, puanlama, yerleştirme (embedding) ve denetleme adımı için kendi API anahtarınızı/yerel sağlayıcınızı kullanın; yalnızca uzaktan çalışan eklentilerden kaçının; `PROMPTFOO_DISABLE_TELEMETRY=1` değerini ayarlayın. |
| **Sadece yerel üretim yapılsın** | `PROMPTFOO_DISABLE_REMOTE_GENERATION=true` değerini ayarlayın + yerel bir sağlayıcı (provider) yapılandırın. |
| **Tamamen izole (Air-gapped) dağıtım** | Kurumsal Yerleşik (Enterprise On-Prem) sürümünü kullanın. |

## İlgili Dokümantasyon
*   [Gizlilik Politikası](#)
*   [Telemetri Yapılandırması](#)
*   [Uzaktan Üretim Yapılandırması](#)
*   [Çıkarım (Inference) Yapılandırması](#)
*   [Kendi Sunucunda Barındırma (Self-Hosting)](#)

