---
title: Promptfoo MCP Sunucusu
description: Harici yapay zeka ajanlarının değerlendirme ve kırmızı takım yeteneklerine erişmesini sağlamak için promptfoo'yu bir Model Context Protocol sunucusu olarak dağıtın
sidebar_label: MCP Sunucusu
sidebar_position: 21
---

# Promptfoo MCP Sunucusu

promptfoo'nun değerlendirme araçlarını Model Context Protocol (MCP) aracılığıyla yapay zeka ajanlarına sunun.

:::info Ön Koşullar

- Sisteminizde Node.js kurulu olması
- Bazı değerlendirmeler içeren bir promptfoo projesi (bağlantıyı test etmek için)
- Cursor IDE, Claude Desktop veya başka bir MCP uyumlu yapay zeka aracı

:::

## Hızlı Başlangıç

### 1. Sunucuyu Başlatın

```bash
# Cursor, Claude Desktop için (STDIO taşıma protokolü)
npx promptfoo@latest mcp --transport stdio

# Web araçları için (HTTP taşıma protokolü)
npx promptfoo@latest mcp --transport http --port 3100
```

### 2. Yapay Zeka Aracınızı Yapılandırın

**Cursor**: Projenizin kök dizininde `.cursor/mcp.json` dosyasını oluşturun

```json title=".cursor/mcp.json"
{
  "mcpServers": {
    "promptfoo": {
      "command": "npx",
      "args": ["promptfoo@latest", "mcp", "--transport", "stdio"],
      "description": "LLM değerlendirmesi ve testi için Promptfoo MCP sunucusu"
    }
  }
}
```

:::warning Geliştirme vs Üretim Yapılandırması

**Normal kullanım için:** Her zaman yukarıda gösterildiği gibi `npx promptfoo@latest` kullanın.

**promptfoo katkıda bulunanlar için:** Depodaki `.cursor/mcp.json`, geliştirme için kaynak koddan çalışır. Deponun geliştirme bağımlılıklarını gerektirir ve başka yerlerde çalışmaz.

:::

**Claude Desktop**: Yapılandırma dosyasına ekleyin

Yapılandırma dosyası konumları:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

```json title="claude_desktop_config.json"
{
  "mcpServers": {
    "promptfoo": {
      "command": "npx",
      "args": ["promptfoo@latest", "mcp", "--transport", "stdio"],
      "description": "LLM değerlendirmesi ve testi için Promptfoo MCP sunucusu"
    }
  }
}
```

Yapılandırmayı ekledikten sonra **yapay zeka aracınızı yeniden başlatın**.

### 3. Bağlantıyı Test Edin

Yapay zeka aracınızı yeniden başlattıktan sonra promptfoo araçlarının kullanılabilir olduğunu görmelisiniz. Şunu sormayı deneyin:

> "Promptfoo araçlarını kullanarak son değerlendirmelerimi listele"

## Mevcut Araçlar

### Temel Değerlendirme Araçları

- **`list_evaluations`** - İsteğe bağlı veri kümesi filtrelemesi ile değerlendirme çalışmalarınıza göz atın
- **`get_evaluation_details`** - Belirli bir değerlendirme için kapsamlı sonuçlar, metrikler ve test vakaları alın
- **`run_evaluation`** - Özel parametreler, test vakası filtreleme ve eşzamanlılık kontrolü ile değerlendirmeleri yürütün
- **`share_evaluation`** - Değerlendirme sonuçları için herkese açık paylaşılabilir URL'ler oluşturun

### Üretim Araçları

- **`generate_dataset`** - Kapsamlı değerlendirme kapsamı için yapay zeka kullanarak test veri kümeleri oluşturun
- **`generate_test_cases`** - Mevcut promptlar için savlar (assertions) içeren test vakaları oluşturun
- **`compare_providers`** - Performans ve kalite için birden fazla yapay zeka sağlayıcısını yan yana karşılaştırın

### Kırmızı Takım (Redteam) Güvenlik Araçları

- **`redteam_run`** - Dinamik saldırı probları ile yapay zeka uygulamalarına karşı kapsamlı güvenlik testleri yürütün
- **`redteam_generate`** - Yapılandırılabilir eklentiler ve stratejilerle kırmızı takım güvenlik testi için saldırgan test vakaları oluşturun

### Yapılandırma ve Test

- **`validate_promptfoo_config`** - CLI ile aynı mantığı kullanarak yapılandırma dosyalarını doğrulayın
- **`test_provider`** - Yapay zeka sağlayıcı bağlantısını, kimlik bilgilerini ve yanıt kalitesini test edin
- **`run_assertion`** - Hata ayıklama için çıktılara karşı bireysel sav kurallarını test edin

## Örnek İş Akışları

### 1. Temel Değerlendirme İş Akışı

Yapay zeka asistanınıza sorun:

> "Bir değerlendirme yapmama yardım et. Önce yapılandırmamı doğrula, ardından son değerlendirmeleri listele ve son olarak sadece ilk 5 test vakasıyla yeni bir değerlendirme çalıştır."

Yapay zeka bu araçları sırasıyla kullanacaktır:

1. `validate_promptfoo_config` - Yapılandırmanızı kontrol eder
2. `list_evaluations` - Son çalışmaları gösterir
3. `run_evaluation` - Test vakası filtreleme ile yürütür

### 2. Sağlayıcı Karşılaştırması

> "Müşteri destek promptumda GPT-4, Claude 3 ve Gemini Pro'nun performansını karşılaştır."

Yapay zeka şunları yapacaktır:

1. `test_provider` - Her sağlayıcının çalıştığını doğrular
2. `compare_providers` - Yan yana karşılaştırma yapar
3. Sonuçları analiz eder ve öneriler sunar

### 3. Güvenlik Testi

> "Sohbet robotu promptumda hapis kırma (jailbreak) açıklarını kontrol etmek için bir güvenlik denetimi yap."

Yapay zeka şunları yapacaktır:

1. `redteam_generate` - Saldırgan test vakaları oluşturur
2. `redteam_run` - Güvenlik testlerini yürütür
3. `get_evaluation_details` - Bulunan açıkları analiz eder

### 4. Veri Kümesi Oluşturma

> "E-posta sınıflandırma promptum için uç vakalar dahil 20 farklı test vakası oluştur."

Yapay zeka şunları yapacaktır:

1. `generate_dataset` - Yapı zeka ile test verisi oluşturur
2. `generate_test_cases` - Uygun savları ekler
3. `run_evaluation` - Oluşturulan vakaları test eder

## Taşıma Türleri

Kullanım durumunuza göre uygun taşıma protokolünü seçin:

- **STDIO (`--transport stdio`)**: stdin/stdout üzerinden iletişim kuran masaüstü yapay zeka araçları (Cursor, Claude Desktop) için
- **HTTP (`--transport http`)**: HTTP uç noktalarına ihtiyaç duyan web uygulamaları, API'ler ve uzak entegrasyonlar için

## En İyi Uygulamalar

### 1. Küçükten Başlayın

Daha karmaşık işlemlere geçmeden önce `list_evaluations` ve `validate_promptfoo_config` gibi basit araçlarla başlayın.

### 2. Filtreleme Kullanın

Büyük veri kümeleriyle çalışırken:

- Değerlendirmeleri veri kümesi kimliğine göre filtreleyin
- Kısmi değerlendirmeler çalıştırmak için test vakası dizinlerini kullanın
- Odaklanmış testler için prompt/sağlayıcı filtreleri uygulayın

### 3. Yinelemeli Test

1. Önce yapılandırmayı doğrulayın
2. Karşılaştırmalardan önce sağlayıcıları tek tek test edin
3. Tam çalışmalardan önce küçük değerlendirme alt kümeleri çalıştırın
4. Sonuçları `get_evaluation_details` ile inceleyin

### 4. Önce Güvenlik

Kırmızı takım araçlarını kullanırken:

- Gelişmiş saldırılardan önce temel eklentilerle başlayın
- Çalıştırmadan önce oluşturulan test vakalarını inceleyin
- Sonuçları her zaman kapsamlı bir şekilde analiz edin

## Sorun Giderme

### Sunucu Sorunları

**Sunucu başlamıyor:**

```bash
# promptfoo kurulumunu doğrulayın
npx promptfoo@latest --version

# Geçerli bir promptfoo projeniz olup olmadığını kontrol edin
npx promptfoo@latest validate

# MCP sunucusunu manuel olarak test edin
npx promptfoo@latest mcp --transport stdio
```

**Bağlantı noktası çakışmaları (HTTP modu):**

```bash
# Farklı bir bağlantı noktası kullanın
npx promptfoo@latest mcp --transport http --port 8080

# 3100 bağlantı noktasını neyin kullandığını kontrol edin
lsof -i :3100  # macOS/Linux
netstat -ano | findstr :3100  # Windows
```

### Yapay Zeka Aracı Bağlantı Sorunları

**Yapay zeka aracı bağlanamıyor:**

1. **Yapılandırma sözdizimini doğrulayın:** JSON yapılandırmanızın yukarıdaki örneklerle tam olarak eşleştiğinden emin olun
2. **Dosya yollarını kontrol edin:** Yapılandırma dosyalarının doğru konumlarda olduğunu onaylayın
3. **Tamamen yeniden başlatın:** Yapay zeka aracınızı tamamen kapatın ve yeniden açın
4. **HTTP uç noktasını test edin:** HTTP taşıma protokolü için `curl http://localhost:3100/health` ile doğrulayın

**Araçlar görünmüyor:**

1. Yapay zeka aracınızın arayüzünde MCP veya "araçlar" (tools) göstergelerini arayın
2. Açıkça sormayı deneyin: "Hangi promptfoo araçlarına erişimin var?"
3. MCP bağlantı hataları için yapay zeka aracınızın günlüklerini kontrol edin

### Araca Özel Hatalar

**"Değerlendirme bulunamadı" (Eval not found):**

- Mevcut değerlendirme kimliklerini görmek için önce `list_evaluations` kullanın
- promptfoo değerlendirme verilerinin bulunduğu bir dizinde olduğunuzdan emin olun

**"Yapılandırma hatası" (Config error):**

- Yapılandırmanızı kontrol etmek için `validate_promptfoo_config` çalıştırın
- `promptfooconfig.yaml` dosyasının mevcut ve geçerli olduğunu doğrulayın

**"Sağlayıcı hatası" (Provider error):**

- Bağlantı ve kimlik doğrulama sorunlarını teşhis etmek için `test_provider` kullanın
- API anahtarlarınızı ve sağlayıcı yapılandırmalarınızı kontrol edin

## İleri Seviye Kullanım

### Özel HTTP Entegrasyonları

HTTP taşıma protokolü için, HTTP destekleyen herhangi bir sistemle entegre olabilirsiniz:

```javascript
// Örnek: Node.js'den MCP sunucusunu çağırma
const response = await fetch('http://localhost:3100/mcp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    method: 'tools/call',
    params: {
      name: 'list_evaluations',
      arguments: { datasetId: 'my-dataset' },
    },
  }),
});
```

### Ortam Değişkenleri

MCP sunucusu tüm promptfoo ortam değişkenlerine uyar:

```bash
# Sağlayıcı API anahtarlarını ayarlayın
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...

# promptfoo davranışını yapılandırın
export PROMPTFOO_CONFIG_DIR=/path/to/configs
export PROMPTFOO_OUTPUT_DIR=/path/to/outputs

# Sunucuyu ortamla başlatın
npx promptfoo@latest mcp --transport stdio
```

## Kaynaklar

- [MCP Protokol Belgeleri](https://modelcontextprotocol.io)
- [Promptfoo Belgeleri](https://promptfoo.dev)
- [Örnek Yapılandırmalar](https://github.com/promptfoo/promptfoo/tree/main/examples)
