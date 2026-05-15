# CLI Komutu

`promptfoo code-scans` komutu, LLM ile ilgili güvenlik açıkları için kod değişikliklerini tarayarak, üretim ortamına ulaşmadan önce istem enjeksiyonu risklerini, jailbreak'leri, PII (Kişisel Tanımlanabilir Bilgi) ifşasını ve diğer güvenlik sorunlarını belirlemenize yardımcı olur.

## Hızlı Başlangıç

promptfoo'yu global olarak yükleyin:

```bash
npm install -g promptfoo
```

promptfoo hesabınızla kimlik doğrulaması yapın:

```bash
promptfoo auth login
```

Mevcut dalınızda (branch) bir tarama çalıştırın:

```bash
promptfoo code-scans run
```

## Çalışma Süresi

PR'ınızın ve kod tabanınızın boyutuna bağlı olarak tarama bir veya iki dakikadan 20 dakikaya kadar veya daha fazla sürebilir. Bununla birlikte, çoğu PR 3 ila 10 dakika sürer.

## Komut Seçenekleri

### Temel Kullanım

```bash
promptfoo code-scans run [repo-yolu] [seçenekler]
```

### Seçenekler

| Seçenek                           | Açıklama                                                                                                   | Varsayılan                                           |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `repo-path`                       | Depo (repository) yolu                                                                                     | Geçerli dizin (`.`)                                  |
| `--api-key <anahtar>`             | Promptfoo API anahtarı                                                                                     | `promptfoo auth` veya `PROMPTFOO_API_KEY` env var    |
| `--base <ref>`                    | Karşılaştırılacak temel dal/commit                                                                         | main veya master'ı otomatik algılar                  |
| `--compare <ref>`                 | Taranacak dal/commit                                                                                       | `HEAD`                                               |
| `--config <yol>`                  | Yapılandırma dosyasının yolu                                                                               | `.promptfoo-code-scan.yaml`                          |
| `--guidance <metin>`              | Taramayı uyarlamak için özel rehberlik                                                                     | Yok                                                  |
| `--guidance-file <yol>`           | Rehberliği bir dosyadan yükler                                                                             | Yok                                                  |
| `--api-host <url>`                | Promptfoo API host URL'si                                                                                  | `https://api.promptfoo.app`                          |
| `--diffs-only`                    | Yalnızca PR farklarını (diff) tarar, tüm depoyu keşfetmez                                                  | false                                                |
| `--json`                          | Sonuçları JSON olarak çıkarır ([şemaya bakın](#json-cikti-semasi))                                         | false                                                |
| `--github-pr <sahip/repo#numara>` | GitHub PR'ına yorum gönderir ([Promptfoo GitHub Action](./github-aksiyon.md) ile kullanılır) | Yok                                                  |

### Örnekler

**Ana dala (main veya master) karşı karşılaştırarak mevcut dalın diff'lerini tarayın:**

```bash
promptfoo code-scans run
```

**Belirli bir dalın diff'lerini main'e karşı tarayın:**

```bash
promptfoo code-scans run --compare feature/yeni-llm-entegrasyonu
```

**İki commit arasındaki diff'leri tarayın:**

```bash
promptfoo code-scans run --base ffa1b2d3 --compare a9c7e5b6
```

**Özel yapılandırma ile tarayın:**

```bash
promptfoo code-scans run --config ozel-tarama-yapilandirmasi.yaml
```

**JSON çıktısı alın:**

```bash
promptfoo code-scans run --json
```

Yanıt formatı için [JSON Çıktı Şemasına](#json-cikti-semasi) bakın.

## Yapılandırma Dosyası

Deponuzun kök dizininde bir `.promptfoo-code-scan.yaml` dosyası oluşturun:

```yaml
# Raporlanacak minimum önem düzeyi (low|medium|high|critical)
# Hem minSeverity hem de minimumSeverity desteklenir
minSeverity: medium

# Dosya sistemi keşfi yapmadan yalnızca PR farklarını (diff) tarar (varsayılan: false = tüm depoyu keşfet)
diffsOnly: false

# İsteğe bağlı: Taramayı ihtiyaçlarınıza göre uyarlamak için özel rehberlik
guidance: |
  Kimlik doğrulama ve yetkilendirme güvenlik açıklarına odaklanın.
  Herhangi bir PII ifşasını yüksek (high) önem derecesi olarak ele alın.

# Veya rehberliği bir dosyadan yükleyin (yapılandırma dosyasına göre göreceli yol)
# guidanceFile: ./tarama-rehberligi.md

# İsteğe bağlı: Promptfoo API host URL'si
# apiHost: https://api.promptfoo.dev
```

## Özel Rehberlik

Taramaları özel ihtiyaçlarınıza uyarlamak için özel rehberlik sağlayabilirsiniz. Rehberliğin neler yapabileceği için [genel bakışa](./index.md#özel-rehberlik) bakın.

**Komut satırı üzerinden:**

```bash
# Satır içi rehberlik
promptfoo code-scans run --guidance "/src/auth dizinindeki kimlik doğrulama güvenlik açıklarına odaklanın"

# Dosyadan yükle
promptfoo code-scans run --guidance-file ./tarama-rehberligi.md
```

**Yapılandırma dosyası üzerinden:**

```yaml
# Satır içi rehberlik
guidance: |
  Kimlik doğrulama ve yetkilendirme güvenlik açıklarına odaklanın.
  Herhangi bir PII ifşasını yüksek (high) önem derecesi olarak ele alın.

# Veya dosyadan yükle
guidanceFile: ./tarama-rehberligi.md
```

## Kimlik Doğrulama

Kod tarayıcı çoklu kimlik doğrulama yöntemlerini destekler (sırayla kontrol edilir):

1. **CLI argümanı**: `--api-key <anahtar>`
2. **Ortam değişkeni**: `PROMPTFOO_API_KEY=<anahtar>`
3. **Promptfoo kimlik doğrulaması**: `promptfoo auth login`
4. **GitHub OIDC** ([Promptfoo GitHub Action](./github-aksiyon.md) içinde kullanıldığında): Otomatik

### promptfoo auth kullanarak

```bash
# Bir kez giriş yapın
promptfoo auth login

# Ardından --api-key olmadan taramaları çalıştırın
promptfoo code-scans run
```

### Ortam değişkeni kullanarak

```bash
export PROMPTFOO_API_KEY=api-anahtariniz
promptfoo code-scans run
```

### --api-key argümanını kullanarak

```bash
promptfoo code-scans run --api-key api-anahtariniz
```

## JSON Çıktı Şeması

`--json` kullanıldığında, tarama stdout'a aşağıdaki yapıya sahip bir JSON nesnesi çıkarır:

### Yanıt Nesnesi

| Alan             | Tür         | Açıklama                                       |
| ---------------- | ----------- | ---------------------------------------------- |
| `success`        | `boolean`   | Taramanın başarıyla tamamlanıp tamamlanmadığı |
| `review`         | `string`    | Taramanın genel inceleme özeti                 |
| `comments`       | `Comment[]` | Bulgular dizisi (aşağıya bakın)                |
| `commentsPosted` | `boolean`   | Bir PR'a yorum gönderilip gönderilmediği       |
| `error`          | `string`    | Tarama başarısız olursa hata mesajı            |

### Yorum Nesnesi

| Alan            | Tür      | Açıklama                                             |
| --------------- | -------- | ---------------------------------------------------- |
| `file`          | `string` | Sorunun bulunduğu dosya yolu veya null               |
| `line`          | `number` | Bulgunun satır numarası veya null                    |
| `startLine`     | `number` | Çok satırlı bulgular için başlangıç satırı veya null |
| `finding`       | `string` | Güvenlik sorununun açıklaması                        |
| `fix`           | `string` | Sorun için önerilen düzeltme                         |
| `severity`      | `string` | `critical`, `high`, `medium`, `low` veya `none`      |
| `aiAgentPrompt` | `string` | Sorunu düzeltmek için yapay zeka kodlama araçları için istem |

### Örnek

```json
{
  "success": true,
  "review": "PR, LLM destekli bir destek sohbeti özelliği sunar. Temel güvenlik endişeleri, kullanıcı mesajları yoluyla istem enjeksiyonu ve yetersiz çıktı doğrulaması etrafındadır.",
  "comments": [
    {
      "file": "src/chat/handler.ts",
      "line": 42,
      "startLine": 40,
      "finding": "Kullanıcı girdisi doğrudan temizlenmeden LLM istemine iletilir ve bu da istem enjeksiyonu saldırılarına izin verir.",
      "fix": "Kullanıcı girdisini temizleyin ve modele enjekte edilen talimatları yoksaymasını emreden bir sistem istemi kullanın.",
      "severity": "critical",
      "aiAgentPrompt": "src/chat/handler.ts dosyasında 42. satır civarında, kullanıcı mesajlarını LLM'ye iletmeden önce girdi temizleme ekleyin. Enjeksiyona dayanıklı talimatlara sahip bir sistem istemi kullanın."
    },
    {
      "file": "src/chat/handler.ts",
      "line": 87,
      "startLine": null,
      "finding": "LLM yanıtları ham HTML olarak kaçış yapılmadan (unescaped) oluşturulur, bu da model manipüle edilirse siteler arası komut dosyası çalıştırmaya (XSS) izin verebilir.",
      "fix": "UI'de oluşturmadan önce LLM çıktısını kaçış yapın (escape) veya temizleyin.",
      "severity": "high",
      "aiAgentPrompt": "src/chat/handler.ts dosyasında 87. satırda, XSS'i önlemek için DOM'a eklemeden önce LLM yanıt çıktısını kaçış yapın (escape)."
    }
  ]
}
```

## Ayrıca Bakınız

- [Kod Taramaya Genel Bakış](./index.md)
- [GitHub Aksiyonu](./github-aksiyon.md)
- [VS Code Eklentisi](./vscode-eklentisi.md)