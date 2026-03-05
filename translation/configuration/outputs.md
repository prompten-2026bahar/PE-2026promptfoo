---
sidebar_position: 31
sidebar_label: Çıktı Biçimleri
title: Çıktı Biçimleri - Sonuçlar Dışa Aktarma ve Analiz
description: LLM değerlendirme sonuçları için çıktı biçimlerini yapılandırın. Analiz, raporlama ve veri işleme için HTML, JSON, CSV ve YAML biçimlerine dışa aktarın.
keywords:
  [
    çıktı biçimleri,
    değerlendirme sonuçları,
    dışa aktarma seçenekleri,
    HTML raporları,
    JSON dışa aktarma,
    CSV analizi,
    sonuç görselleştirmesi,
  ]
pagination_prev: configuration/huggingface-datasets
pagination_next: configuration/chat
---

# Çıktı Biçimleri

Değerlendirme sonuçlarınızı çeşitli biçimlerde kaydedin ve analiz edin.

## Hızlı Başlangıç

```bash
# İnteraktif web görüntüleyici (varsayılan)
promptfoo eval

# HTML raporu olarak kaydet
promptfoo eval --output results.html

# İleri işleme için JSON'a dışa aktar
promptfoo eval --output results.json

# Elektronik tablo analizi için CSV oluştur
promptfoo eval --output results.csv

# Diğer araçlarla entegrasyon için XML oluştur
promptfoo eval --output results.xml
```

## Kullanılabilir Biçimler

### HTML Raporu

Görsel, paylaşılabilir bir rapor oluşturun:

```bash
promptfoo eval --output report.html
```

**Özellikler:**

- Sıralama ve filtreleme ile etkileşimli tablo
- Yan yana çıktı karşılaştırması
- Geçme/başarısızlık istatistikleri
- Paylaşılabilir bağımsız dosya

**Şu durumlarda kullanın:** Sonuçları paydaşlara sunmak veya çıktıları görsel olarak gözden geçirmek.

### JSON Çıktısı

Tam değerlendirme verilerini dışa aktarın:

```bash
promptfoo eval --output results.json
```

**Yapı:**

```json
{
  "version": 3,
  "timestamp": "2024-01-15T10:30:00Z",
  "results": {
    "prompts": [...],
    "providers": [...],
    "outputs": [...],
    "stats": {...}
  }
}
```

**Şu durumlarda kullanın:** Diğer araçlarla entegrasyon veya özel analiz gerçekleştirme.

### CSV Dışa Aktarma

Elektronik tablo uyumlu verileri oluşturun:

```bash
promptfoo eval --output results.csv
```

**Sütunlar şunları içerir:**

- Test değişkenleri
- Kullanılan istem
- Model çıktıları
- Geçme/başarısızlık durumu
- Gecikme süresi
- Token kullanımı

**Şu durumlarda kullanın:** Sonuçları Excel, Google Sheets veya veri bilimi araçlarında analiz etme.

### YAML Biçimi

İnsan tarafından okunabilir yapılandırılmış veriler:

```bash
promptfoo eval --output results.yaml
```

**Şu durumlarda kullanın:** Sonuçları metin editöründe gözden geçirme veya sürüm kontrolü.

### JSONL Biçimi

Her satır bir JSON sonucu içerir:

```bash
promptfoo eval --output results.jsonl
```

**Şu durumlarda kullanın:** Çok büyük değerlendirmelerle çalışma veya JSON dışa aktarma bellek hataları verirse.

```jsonl
{"testIdx": 0, "promptIdx": 0, "output": "Response 1", "success": true, "score": 1.0}
{"testIdx": 1, "promptIdx": 0, "output": "Response 2", "success": true, "score": 0.9}
```

### XML Biçimi

Kurumsal entegrasyon için yapılandırılmış veriler:

```bash
promptfoo eval --output results.xml
```

**Yapı:**

```xml
<promptfoo>
  <evalId>abc-123-def</evalId>
  <results>
    <version>3</version>
    <timestamp>2024-01-15T10:30:00Z</timestamp>
    <prompts>...</prompts>
    <providers>...</providers>
    <outputs>...</outputs>
    <stats>...</stats>
  </results>
  <config>...</config>
  <shareableUrl>...</shareableUrl>
</promptfoo>
```

**Şu durumlarda kullanın:** Kurumsal sistemlerle, XML tabanlı iş akışlarıyla entegrasyon veya XML gereksinimleriyse.

## Yapılandırma Seçenekleri

### Yapılandırmada Çıktı Yolunu Ayarlama

```yaml title="promptfooconfig.yaml"
# Varsayılan çıktı dosyasını belirtin
outputPath: evaluations/latest_results.html

prompts:
  - '...'
tests:
  - '...'
```

### Birden Fazla Çıktı Biçimi

Aynı anda birden fazla biçim oluşturun:

```bash
# Komut satırı
promptfoo eval --output results.html --output results.json

# Veya kabuk komutlarını kullanın
promptfoo eval --output results.json && \
promptfoo eval --output results.csv
```

## Çıktı İçeriği

### Standart Alanlar

Tüm biçimler şunları içerir:

| Alan        | Açıklama                     |
| ----------- | ---------------------------- |
| `timestamp` | Değerlendirmenin ne zaman çalıştığı |
| `prompts`   | Değerlendirmede kullanılan istemler |
| `providers` | Test edilen LLM sağlayıcıları |
| `tests`     | Değişkenlerle test durumları |
| `outputs`   | Ham LLM yanıtları |
| `results`   | Her iddia için geçme/başarısızlık |
| `stats`     | Özet istatistikleri |

:::warning

`json`, `yaml`, `yml`, `txt`, `html` ve `xml` çıktıları eval `config`'i içerir. Hassas alanlar, Promptfoo'nun sanitizasyon kurallarına göre en iyi çabayla düzeltilir (kapsamlı değildir). Hassas olmayan `config.env` değerleri yine de dışa aktarmalarda görünebilir.

:::

### Ayrıntılı Metrikler

Mevcut olduğunda, çıktılar şunları içerir:

- **Gecikme Süresi**: Milisaniye cinsinden yanıt süresi
- **Token Kullanımı**: Giriş/çıkış token sayıları
- **Maliyet**: Tahmini API maliyetleri
- **Hata Ayrıntıları**: Başarısızlık nedenleri ve yığın izleri

## Sonuçları Analiz Etme

### JSON İşleme Örneği

```javascript
const fs = require('fs');

// Sonuçları yükle
const results = JSON.parse(fs.readFileSync('results.json', 'utf8'));

// Sağlayıcıya göre geçme oranlarını analiz et
const providerStats = {};
results.results.outputs.forEach((output) => {
  const provider = output.provider;
  if (!providerStats[provider]) {
    providerStats[provider] = { pass: 0, fail: 0 };
  }

  if (output.pass) {
    providerStats[provider].pass++;
  } else {
    providerStats[provider].fail++;
  }
});

console.log('Sağlayıcıya göre geçme oranları:', providerStats);
```

### Pandas ile CSV Analizi

```python
import pandas as pd

# Sonuçları yükle
df = pd.read_csv('results.csv')

# Sağlayıcıya göre grupla ve metrikleri hesapla
summary = df.groupby('provider').agg({
    'pass': 'mean',
    'latency': 'mean',
    'cost': 'sum'
})

print(summary)
```

## En İyi Uygulamalar

### 1. Çıktı Dosyalarını Organize Edin

```text
project/
├── promptfooconfig.yaml
├── evaluations/
│   ├── 2024-01-15-baseline.html
│   ├── 2024-01-16-improved.html
│   └── comparison.json
```

### 2. Açıklayıcı Dosya Adları Kullanın

```bash
# Tarih ve deney adını ekleyin
promptfoo eval --output "results/$(date +%Y%m%d)-gpt4-temperature-test.html"
```

### 3. Sürüm Kontrolü Hususları

```gitignore
# .gitignore
# Büyük çıktı dosyalarını hariç tut
evaluations/*.html
evaluations/*.json

# Ama özet raporlarını sakla
!evaluations/summary-*.csv
```

### 4. Rapor Oluşturmayı Otomatikleştir

```bash
#!/bin/bash
# run_evaluation.sh

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
promptfoo eval \
  --output "reports/${TIMESTAMP}-full.json" \
  --output "reports/${TIMESTAMP}-summary.html"
```

## Sonuçları Paylaşma

### Web Görüntüleyici

Varsayılan web görüntüleyici (`promptfoo view`) şunları sağlar:

- Değerlendirme sırasında gerçek zamanlı güncellemeler
- Etkileşimli keşif
- Yalnızca yerel (veri dışarıya gönderilmez)

### HTML Raporlarını Paylaşma

HTML çıktıları bağımsızdır:

```bash
# Rapor oluştur
promptfoo eval --output team-review.html

# E-posta, Slack vb. üzerinden paylaş
# Harici bağımlılık gerekli değil
```

### Promptfoo Paylaşım

İşbirliğine dayalı gözden geçirilmesi için:

```bash
# Sonuçları ekibinizle paylaş
promptfoo share
```

Şunları içeren paylaşılabilir bir bağlantı oluşturur:

- Salt okunur erişim
- Yorum yapma yetenekleri
- Görüntüleyenler için kurulum gerekmez

## Sorun Giderme

### Büyük Çıktı Dosyaları

Kapsamlı değerlendirmeler için:

```yaml
# Çıktı boyutunu sınırla
outputPath: results.json
sharing:
  # Dosyadan ham çıktıları hariç tut
  includeRawOutputs: false
```

### Kodlama Sorunları

Uluslararası içerik için uygun kodlamayı sağlayın:

```bash
# Kodlamayı açıkça ayarla
LANG=en_US.UTF-8 promptfoo eval --output results.csv
```

### Performans İpuçları

1. **Büyük veri setleri için JSONL kullanın** - bellek sorunlarından kaçınır
2. **Standart veri setleri için JSON kullanın** - tam veri yapısı
3. **Sunumlar için HTML oluşturun** - en iyi görsel biçim
4. **Veri analizi için CSV kullanın** - Excel/Sheets uyumlu

## İlgili Belgeler

- [Yapılandırma Referansı](/docs/configuration/reference) - Tüm çıktı seçenekleri
- [Entegrasyonlar](/docs/category/integrations/) - Çıktıları diğer araçlarla kullanma
- [Komut Satırı Kılavuzu](/docs/usage/command-line) - CLI seçenekleri