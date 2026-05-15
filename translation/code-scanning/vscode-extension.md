# VS Code Eklentisi

Promptfoo VS Code Güvenlik Tarayıcısı, LLM güvenlik açıklarını doğrudan editörünüzde tespit eder. İstem enjeksiyonu risklerini, jailbreak güvenlik açıklarını, PII (Kişisel Tanımlanabilir Bilgi) ifşasını ve diğer güvenlik sorunlarını kod yazdığınız sırada—CI ardışık düzeninize (pipeline) veya üretim ortamınıza ulaşmadan önce—bulur.

![Satır içi güvenlik tanılarını gösteren VS Code eklentisi](..\img\vscode-extension-38461c93227a6b9911d1bfe272e5cd26.png)

> **ℹ️ Kurumsal Özellik**
>
> VS Code eklentisi Promptfoo Enterprise müşterileri için mevcuttur. Kuruluşunuz adına erişim elde etmek için [bizimle iletişime geçin](/contact).


## Özellikler

- **Gerçek zamanlı tarama**: Dosyaları kaydedildiğinde otomatik olarak tarar
- **Satır içi tanılar**: Güvenlik sorunları kodunuzda dalgalı alt çizgiler olarak görünür
- **Sorunlar paneli**: Tüm bulgular VS Code'un Sorunlar (Problems) panelinde listelenir
- **CodeLens ek açıklamaları**: Güvenlik açığı bulunan kodun üstünde satır içi önem derecesi göstergeleri
- **Hızlı düzeltmeler**: Önerilen düzeltmeleri tek tıklamayla uygulayın
- **Yapay zeka asistanı**: Karmaşık sorunları çözmenize yardımcı olması için yapay zeka tarafından oluşturulmuş istemler (prompts) alın
- **Git diff taraması**: Dalınızdaki (branch) tüm değiştirilmiş dosyaları tarayın

## Başlarken

1. Eklenti paketini (`.vsix` dosyası) almak için [bizimle iletişime geçin](/contact)
2. VS Code'da yükleyin: Uzantılar (Extensions) → ⋯ → VSIX'ten Yükle (Install from VSIX)
3. API anahtarınızı yapılandırın: Cmd+Shift+P → **Promptfoo: API Anahtarını Yapılandır (Configure API Key)**

## Kullanım

**Otomatik tarama**: Dosyalarınız siz kaydettiğinizde taranır. Bulgular kodunuzda satır içi tanılar olarak ve Sorunlar (Problems) panelinde görünür.

**Manuel tarama**: Komut Paletini (Cmd+Shift+P) kullanın:

- **Promptfoo: Mevcut Dosyayı Tara (Scan Current File)** — Etkin dosyayı tara
- **Promptfoo: Seçimi Tara (Scan Selection)** — Seçili kodu tara
- **Promptfoo: Git Değişikliklerini Tara (Scan Git Changes)** — Dalınızdaki (branch) tüm değişen dosyaları tara
- **Promptfoo: Tüm Tarama Sonuçlarını Temizle (Clear All Scan Results)** — Tüm tanıları temizle
- **Promptfoo: Çıktıyı Göster (Show Output)** — Eklentinin çıktı kanalını göster

### Klavye Kısayolları

| Kısayol                             | Komut             |
| ----------------------------------- | ----------------- |
| Ctrl+Shift+P F (Mac: Cmd+Shift+P F) | Mevcut dosyayı tara |

### Bağlam Menüsü (Context Menu)

Erişmek için düzenleyicide (editor) sağ tıklayın:

- **Mevcut Dosyayı Tara (Scan Current File)** — Dosyanın tamamını tarar
- **Seçimi Tara (Scan Selection)** — Yalnızca seçili kodu tarar (metin seçiliyken)

## Yapılandırma

Eklentiyi VS Code Ayarlarından (Settings) veya `settings.json` dosyanızda yapılandırın:

| Ayar                             | Açıklama                         | Varsayılan                  |
| -------------------------------- | -------------------------------- | --------------------------- |
| `promptfoo.apiHost`              | Promptfoo API host URL'si        | `https://api.promptfoo.app` |
| `promptfoo.minimumSeverity`      | Görüntülenecek minimum önem derecesi | `low`                       |
| `promptfoo.scanOnSave`           | Dosyaları kaydedildiğinde otomatik tara | `true`                      |
| `promptfoo.scanOnSaveDebounceMs` | Otomatik tarama için bekleme gecikmesi | `1500`                      |
| `promptfoo.diffsOnly`            | Yalnızca kod farklarını (diff) analiz et | `true`                      |
| `promptfoo.showCodeLens`         | Satır içi CodeLens ek açıklamalarını göster | `true`                      |
| `promptfoo.enabledLanguages`     | Taranacak diller                 | Aşağıya bakın               |

### Örnek settings.json

```json
{
  "promptfoo.minimumSeverity": "medium",
  "promptfoo.scanOnSave": true,
  "promptfoo.scanOnSaveDebounceMs": 2000,
  "promptfoo.showCodeLens": true
}
```

### Desteklenen Diller

Varsayılan olarak, eklenti şunları tarar:

- JavaScript / TypeScript (JSX/TSX dahil)
- Python
- Go
- Java
- Rust
- Ruby
- PHP
- C#
- C/C++

`promptfoo.enabledLanguages` ayarıyla özelleştirin. Boş bir dizi, tüm diller için taramayı etkinleştirir.

## Önem Düzeyleri (Severity Levels)

Bulgular önem derecesine göre sınıflandırılır:

| Seviye   | Simge | Açıklama                     |
| -------- | ----- | ---------------------------- |
| Kritik   | 🔴    | Acil güvenlik riski          |
| Yüksek   | 🟠    | Önemli güvenlik açığı        |
| Orta     | 🟡    | Orta düzey endişe            |
| Düşük    | 🔵    | Küçük sorun veya en iyi uygulama kuralı |

Daha düşük önem derecesindeki bulguları filtrelemek için `promptfoo.minimumSeverity` ayarını kullanın.

## Gizlilik

Kod, analiz için Promptfoo'nun sunucularına gönderilir ve analiz tamamlandıktan sonra depolanmaz. Kendi altyapılarında tarama çalıştırması gereken kuruluşlar için eklenti, [Promptfoo Enterprise On-Prem](/docs/enterprise/) ile birlikte çalışır.

## Ayrıca Bakınız

- [Kod Taramaya Genel Bakış](./index.md)
- [GitHub Aksiyonu](./github-aksiyon.md)
- [CLI Komutu](./cli.md)