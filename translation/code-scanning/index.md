# Kod Taraması

Promptfoo Kod Taraması, LLM ile ilgili güvenlik açıklarını kod tabanınızda bulmak ve birleştirmeden (merge) önce bunları düzeltmenize yardımcı olmak için yapay zeka ajanlarını kullanır. Özellikle LLM ile ilgili güvenlik açıklarına odaklanarak, daha genel güvenlik tarayıcılarının kaçırabileceği sorunları bulur.

## Nasıl Çalışır?

Tarayıcı, istem enjeksiyonu, PII (Kişisel Tanımlanabilir Bilgi) ifşası ve aşırı yetki dahil olmak üzere yaygın LLM güvenlik risklerini inceler. Yalnızca yüzey düzeyindeki farklılıkları (diff) analiz etmek yerine, veri akışlarını kod tabanınızın derinliklerine takip ederek kullanıcı girdilerinin LLM istemlerine nasıl ulaştığını, çıktıların nasıl kullanıldığını ve LLM'nin hangi yeteneklere erişimi olduğunu anlar.

Bu ajantik yaklaşım, birden fazla dosyaya yayılan ince güvenlik sorunlarını yakalarken, uyarı yorgunluğundan kaçınmak için yüksek bir sinyal-gürültü oranını korur.

## Başlarken

### GitHub Aksiyonu

Bulguların inceleme yorumları olarak gönderilmesiyle çekme isteklerini otomatik olarak tarayın. Kodunuz GitHub'da varsa bunu tarayıcıyı kullanmanın önerilen yoludur. [GitHub Aksiyonunu ayarlayın →](./github-aksiyon.md)

### VS Code Eklentisi (Kurumsal)

Editörünüzde gerçek zamanlı geri bildirim, satır içi tanılar ve hızlı düzeltmelerle kodu doğrudan tarayın. Kurumsal müşteriler için mevcuttur. [Daha fazlasını öğrenin →](./vscode-eklentisi.md)

### CLI Komutu

Yerel olarak veya herhangi bir CI ortamında taramaları çalıştırın. [CLI'yi kullanın →](./cli.md)

## Önem Düzeyleri

Bulgular, önceliklendirmenize yardımcı olmak için önem derecesine göre sınıflandırılır:

- **Kritik** 🔴: Acil güvenlik riski
- **Yüksek** 🟠: Önemli sorun
- **Orta** 🟡: Orta düzey risk
- **Düşük** 🔵: Küçük sorun

Tarama ayarlarınızda minimum önem derecesi eşiklerini yapılandırın.

## Özel Rehberlik

Özel rehberlik sağlayarak taramaları ihtiyaçlarınıza göre uyarlayın:

- Belirli güvenlik açığı türlerine veya kod alanlarına odaklanın
- Önem düzeylerini içeriğinize göre ayarlayın
- Tercih ettiğiniz kütüphaneleri kullanarak düzeltme önerin
- Bilinen yanlış pozitifleri atlayın

**Örnek:**

```yaml
guidance: |
  /examples dizinini göz ardı edin—yalnızca demo kodu içerir.
  Olası PII ifşasını kritik (critical) olarak ele alın.
  Bu uygulama için özel kodu OpenAI veya Claude'e göndermek bir güvenlik açığı değildir.
  Düzeltme önerirken doğrulama için Zod şemalarını kullanın.
```

## Bulut ve Kurumsal

Taramalar varsayılan olarak Promptfoo Cloud'da çalışır. Taramaları kendi altyapılarında çalıştırması gereken kuruluşlar için kod taraması [Promptfoo Enterprise On-Prem'de](../enterprise) mevcuttur.

## Ayrıca Bakınız

- [GitHub Aksiyonu](./github-aksiyon.md)
- [VS Code Eklentisi](./vscode-eklentisi.md)
- [CLI Komutu](./cli.md)
- [Promptfoo Scanner GitHub Uygulaması](https://github.com/apps/promptfoo-scanner)