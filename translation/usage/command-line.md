---
sidebar_position: 10
sidebar_label: Komut Satırı
description: Explore promptfoo CLI commands for LLM testing - run evaluations, generate datasets, scan models for vulnerabilities, and automate testing workflows via command line
---

# Komut satırı

`promptfoo` komut satırı yardımcı programı aşağıdaki alt komutları destekler:

- `init [directory]` - Yeni bir projeyi dummy dosyalarla başlatın.
- `eval` - İstemler ve modelleri değerlendirin. Bu, en sık kullanacağınız komuttur!
- `view` - Sonuçların görselleştirilmesi için bir tarayıcı arayüzü başlatın.
- `share` - Çevrimiçi olarak paylaşılabilecek bir URL oluşturun.
- `auth` - Bulut özelliklerine yönelik kimlik doğrulamasını yönetin.
- `cache` - Önbelleği yönetin.
  - `cache clear`
- `config` - Yapılandırma ayarlarını düzenleyin.
  - `config get`
  - `config set`
  - `config unset`
- `debug` - Sorun giderme için hata ayıklama bilgilerini görüntüleyin.
- `generate` - Veri oluşturun.
  - `generate dataset`
  - `generate redteam`
  - `generate assertions`
- `list` - Değerlendirmeler, istemler ve veri setleri gibi çeşitli kaynakları listeleyin.
  - `list evals`
  - `list prompts`
  - `list datasets`
- `logs` - promptfoo günlük dosyalarını görüntüleyin.
  - `logs [file]`
  - `logs list`
- `mcp` - AI aracıları ve geliştirme ortamlarına promptfoo araçlarını açığa çıkarmak için bir Model Context Protocol (MCP) sunucusu başlatın.
- `scan-model` - ML modellerini güvenlik açıkları açısından tarayın.
- `show <id>` - Belirli bir kaynağın ayrıntılarını gösterin (değerlendirme, istem, veri seti).
- `delete <id>` - Bir kaynağı kimliğine göre silin (şu an sadece değerlendirmeler)
- `validate` - Bir promptfoo yapılandırma dosyasını doğrulayın.
- `feedback <message>` - Promptfoo geliştiricilerine geri bildirim gönderin.
- `import <filepath>` - Bir eval dosyasını JSON biçiminden içeri aktarın.
- `export` - Eval kayıtlarını veya günlükleri dışa aktarın.
  - `export eval <evalId>`
  - `export logs`
- `redteam` - LLM uygulamalarına karşı kırmızı ekip çalışması yapın.
  - `redteam init`
  - `redteam setup`
  - `redteam run`
  - `redteam discover`
  - `redteam generate`
  - `redteam poison`
  - `redteam eval`
  - `redteam report`
  - `redteam plugins`

## Yaygın Seçenekler

Çoğu komut aşağıdaki yaygın seçenekleri destekler:

| Seçenek                             | Açıklama                                       |
| ----------------------------------- | ------------------------------------------------- |
| `--env-file, --env-path <paths...>` | .env dosyası(ları)na yol. Birden fazla dosyayı destekler. |
| `-v, --verbose`                     | Hata ayıklama günlüklerini göster                                   |
| `--help`                            | Yardımı göster                                      |

### Birden Fazla Ortam Dosyası

Birden fazla `.env` dosyası yükleyebilirsiniz. Sonraki dosyalar önceki dosyalardan değerleri geçersiz kılar:

```bash
# Boşlukla ayrılmış
promptfoo eval --env-file .env .env.local

# Tekrarlanan bayraklar
promptfoo eval --env-file .env --env-file .env.local
```

Belirtilen tüm dosyalar var olmalı, aksi takdirde bir hata atılır.

## `promptfoo eval`

Varsayılan olarak `eval` komutu geçerli dizininizde `promptfooconfig.yaml` yapılandırma dosyasını okur. Ancak, belirli parametreleri geçersiz kılmak istiyorsanız, isteğe bağlı argümanlar sağlayabilirsiniz:

| Seçenek                             | Açıklama                                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `-a, --assertions <path>`           | İddialı dosyasına yol                                                                                  |
| `-c, --config <paths...>`           | Yapılandırma dosyası(na) yol. Otomatik olarak promptfooconfig.yaml'ı yükler                                  |
| `--delay <number>`                  | Her test arasında gecikme (milisaniye cinsinden)                                                                |
| `--description <description>`       | Eval çalışmasının açıklaması                                                                              |
| `--filter-failing <path or id>`     | Önceki bir değerlendirmede başarısız olan testleri filtreleyin (dosya yolu veya eval ID)                              |
| `--filter-errors-only <path or id>` | Önceki bir değerlendirmede hataya neden olan testleri filtreleyin                                            |
| `-n, --filter-first-n <number>`     | Sadece ilk N testi çalıştır                                                                               |
| `--filter-sample <number>`          | N testin rasgele bir örneğini çalıştır                                                                      |
| `--filter-metadata <key=value>`     | Metadata'sı key=value çiftini eşleşen testleri çalıştır. Ve mantığı için birden fazla kez belirtilebilir. |
| `--filter-pattern <pattern>`        | Açıklaması regex pattern'i eşleşen testleri çalıştır                                                               |
| `--filter-prompts <pattern>`        | ID'si veya etiketi regex pattern'i eşleşen istemlerle testleri çalıştır                                  |
| `--filter-providers <providers>`    | Sadece bu sağlayıcılarla testleri çalıştır (sağlayıcı `id` veya `label` üzerinde regex eşleşmesi)            |
| `--filter-targets <targets>`        | Sadece bu hedeflerle testleri çalıştır (--filter-providers için takma ad)                                         |
| `--grader <provider>`               | Çıktıları notlandıracak model                                                                            |
| `-j, --max-concurrency <number>`    | Maksimum eşzamanlı API çağrısı sayısı                                                                   |
| `--model-outputs <path>`            | LLM çıktısı dizesi içeren JSON dosyasına yol                                                                       |
| `--no-cache`                        | Disk önbelleğinden sonuçları okmayın veya yazını                                                              |
| `--no-progress-bar`                 | İlerleme çubuğunu göstermeyin                                                                                 |
| `--no-table`                        | CLI'da tabloyu çıkarmayın                                                                               |
| `--no-write`                        | Sonuçları promptfoo dizinine yazmayin                                                              |
| `--resume [evalId]`                 | Duraklatılmış/eksik bir değerlendirmeyi devam ettir. EvalId çıkarılırsa en sonuncuyu devam ettir                            |
| `--retry-errors`                    | En son değerlendirmeden tüm ERROR sonuçlarını yeniden deneyin                                                       |
| `-o, --output <paths...>`           | Çıktı dosyası(ana) yolu (csv, txt, json, jsonl, yaml, yml, html, xml)                                     |
| `-p, --prompts <paths...>`          | İstem dosyalarına yollar (.txt)                                                                             |
| `--prompt-prefix <path>`            | Her isteme hazırlanacak önek                                                                         |
| `--prompt-suffix <path>`            | Her isteme eklenen sonek                                                                          |
| `-r, --providers <name or path...>` | Sağlayıcı adları veya özel API çağıran modüllere yollar                                                     |
| `--remote`                          | Mümkün olan her yerde uzaktan çıkarımı zorlayın (kırmızı takımlar için kullanılır)                            |
| `--repeat <number>`                 | Her testi çalıştırma sayısı                                                                         |
| `--share`                           | Paylaşılabilir URL oluştur                                                                                   |
| `--no-share`                        | Paylaşılabilir URL oluşturmayın, bu yapılandırma dosyasını geçersiz kılar                                            |
| `--suggest-prompts <number>`        | N yeni istem oluştur ve istem listesine ekle                                                                |
| `--table`                           | CLI'da tabloyu çıkt                                                                                      |
| `--table-cell-max-length <number>`  | Konsol tablosu hücrelerini bu uzunluğa kırp                                                              |
| `-t, --tests <path>`                | Sınav durumları içeren CSV dosyasına yol                                                                    |
| `--var <key=value>`                 | key=value biçiminde bir değişken set et                                                                       |
| `-v, --vars <path>`                 | Sınav durumları içeren CSV dosyasına yol (testlerin takma adı)                                                          |
| `-w, --watch`                       | Yapılandırmada değişiklikleri izle ve yeniden çalıştır                                                                   |

`eval` komutu, en az 1 sınav durumu başarısızlığı olduğunda veya geçiş oranı `PROMPTFOO_PASS_RATE_THRESHOLD` tarafından ayarlanan eşikten aşağıda olduğunda çıkış kodu `100` döndürür. Diğer herhangi bir hata için çıkış kodu `1` döndürür. Başarısız testler için çıkış kodu, `PROMPTFOO_FAILED_TEST_EXIT_CODE` ortam değişkeni ile geçersiz kılınabilir.

### Duraklatma ve Devam Ettirme

```sh
promptfoo eval --resume            # en son değerlendirmeyi devam ettir
promptfoo eval --resume <evalId>   # belirli bir değerlendirmeyi devam ettir
```

- Devam etme sırasında promptfoo, orijinal çalışmanın etkili çalışma zamanı seçeneklerini (ör. `--delay`, `--no-cache`, `--max-concurrency`, `--repeat`) yeniden kullanır, tamamlanan test/istem çiftlerini atlar, test sıralamasını değiştiren CLI bayraklarını yok sayarak endeksleri hizalı tutağını tutar ve izleme modunu devre dışı bırakır.

### Hataları Yeniden Deneyin

```sh
promptfoo eval --retry-errors      # en son eval'dan tüm ERROR sonuçlarını yeniden deneyin
```

- Retry hataları özelliği otomatik olarak en son eval'dan ERROR sonuçlarını bulur ve sadece o test durumlarını yeniden çalıştırır. Bu, eval'lar geçici ağ sorunları, hız sınırları veya API hataları nedeniyle başarısız olduğunda kullanışlıdır.
- **Veri güvenliği**: Yeniden deneme başarısız olursa, orijinal ERROR sonuçlarınız korunur. Eski ERROR sonuçları, yeniden deneme başarılı olduktan sonra kaldırılır. Başarısız olursa `--retry-errors` yeniden çalıştırabilirsiniz.
- `--resume` veya `--no-write` bayraklarıyla birlikte kullanılamaz.
- Tutarlılığı sağlamak için orijinal eval'ın yapılandırmasını ve çalışma zamanı seçeneklerini kullanır.

## `promptfoo init [directory]`

Yeni bir projeyi dummy dosyalarla başlatın.

| Seçenek            | Açıklama                    |
| ------------------ | ------------------------------ |
| `directory`        | Dosya oluşturulacak dizin   |
| `--no-interactive` | İnteraktif modda çalıştırmayın |

## `promptfoo view`

Sonuçların görselleştirilmesi için bir tarayıcı arayüzü başlatın.

| Seçenek               | Açıklama                               |
| --------------------- | ----------------------------------------- |
| `-p, --port <number>` | Yerel sunucu için bağlantı noktası numarası          |
| `-y, --yes`           | Onayı atla ve URL'yi otomatik olarak aç   |
| `-n, --no`            | Onayı atla ve URL'yi açma |

`PROMPTFOO_CONFIG_DIR` kulanarakPromptfoo çıktı dizinini geçersiz kıldıysanız, `promptfoo view [directory]` çalıştırın.

## `promptfoo share [evalId]`

Çevrimiçi olarak paylaşılabilecek bir URL oluşturun.

| Seçenek        | Açıklama                         |
| ------------- | ----------------------------------- |
| `--show-auth` | Paylaşılan URL'de kimlik doğrulama bilgisini dahil et |

## `promptfoo cache`

Önbelleği yönetin.

| Seçenek  | Açıklama     |
| ------- | --------------- |
| `clear` | Önbelleği temizle |

## `promptfoo feedback <message>`

Promptfoo geliştiricilerine geri bildirim gönderin.

| Seçenek    | Açıklama      |
| --------- | ---------------- |
| `message` | Geri bildirim iletisi |

## `promptfoo list`

Değerlendirmeler, istemler ve veri setleri gibi çeşitli kaynakları listeleyin.

| Alt komut | Açıklama      |
| ---------- | ---------------- |
| `evals`    | Değerlendirmeleri listele |
| `prompts`  | İstemler listele     |
| `datasets` | Veri setlerini listele    |

| Seçenek       | Açıklama                                                     |
| ------------ | --------------------------------------------------------------- |
| `-n`         | Oluşturma tarihi açısından azalan sırayla ilk n kayıtları göster |
| `--ids-only` | Açıklamalar olmadan sadece ID'leri göster                              |

## `promptfoo logs`

Promptfoo günlük dosyalarını doğrudan komut satırından görüntüleyin.

| Seçenek                 | Açıklama                                | Varsayılan |
| ---------------------- | ------------------------------------------ | ------- |
| `[file]`               | Görüntülenecek günlük dosyası (ad, yol veya kısmi)  | en sonuncu  |
| `--type <type>`        | Günlük türü: `debug`, `error` veya `all`       | `all`   |
| `-n, --lines <num>`    | Sondan gösterilecek satır sayısı (tail) |         |
| `--head <num>`         | Baştan gösterilecek satır sayısı      |         |
| `-f, --follow`         | Günlük dosyasını gerçek zamanda takip et               | `false` |
| `-l, --list`           | Mevcut günlük dosyalarını listele                   | `false` |
| `-g, --grep <pattern>` | Pattern'i (regex) eşleşen satırları filtrele      |         |
| `--no-color`           | Söz dizimi vurgulamayı devre dışı bırak                |         |

### `promptfoo logs list`

Logs dizinindeki mevcut günlük dosyalarını listeleyin.

| Seçenek          | Açıklama                          | Varsayılan |
| --------------- | ------------------------------------ | ------- |
| `--type <type>` | Günlük türü: `debug`, `error` veya `all` | `all`   |

### Örnekler

```sh
# En son günlük dosyasını görüntüle (veya bir CLI oturumu sırasında çalıştırılırsa geçerli oturumun günlüğü)
promptfoo logs

# Son 50 satırı görüntüle
promptfoo logs -n 50

# İlk 20 satırı görüntüle
promptfoo logs --head 20

# Günlüğü gerçek zamanda takip et (tail -f gibi)
promptfoo logs -f

# Mevcut tüm günlük dosyalarını listele
promptfoo logs --list

# Belirli bir günlük dosyasını ad veya kısmi eşleşmeyle görüntüle
promptfoo logs promptfoo-debug-2024-01-15_10-30-00.log
promptfoo logs 2024-01-15

# Sadece hata günlüklerini görüntüle
promptfoo logs --type error

# Pattern'e göre günlükleri filtrele (büyük/küçük harf duyarsız regex)
promptfoo logs --grep "error|warn"
promptfoo logs --grep "openai"
```

Günlük dosyaları varsayılan olarak `~/.promptfoo/logs` içinde depolanır. Özel bir dizin kullanmak için `PROMPTFOO_LOG_DIR` ayarlayın.

## `promptfoo mcp`

AI aracıları ve geliştirme ortamlarının kullanabileceği araçlar olarak promptfoo'nun eval ve test yeteneğini açığa çıkarmak için bir Model Context Protocol (MCP) sunucusu başlatın.

| Seçenek               | Açıklama                       | Varsayılan |
| --------------------- | --------------------------------- | ------- |
| `-p, --port <number>` | HTTP aktarımı için bağlantı noktası numarası    | 3100    |
| `--transport <type>`  | Aktarım türü: "http" veya "stdio" | http    |

### Aktarım Türleri

- **STDIO**: Standart giriş/çıkış aracılığıyla iletişim kuran Cursor, Claude Desktop ve yerel AI aracıları gibi masaüstü AI araçları için en iyi
- **HTTP**: HTTP uç noktaları gerektiren web uygulamaları, API'ler ve uzak entegrasyonlar için en iyi

### Örnekler

```sh
# STDIO aktarımıyla MCP sunucusu başlat (Cursor, Claude Desktop vb. için)
npx promptfoo@latest mcp --transport stdio

# Varsayılan bağlantı noktasında HTTP aktarımıyla MCP sunucusu başlat
npx promptfoo@latest mcp --transport http

# Özel bağlantı noktasında HTTP aktarımıyla MCP sunucusu başlat
npx promptfoo@latest mcp --transport http --port 8080
```

### Mevcut Araçlar

MCP sunucusu AI aracıları için 9 araç sağlar:

**Temel Değerlendirme Araçları:**

- **`list_evaluations`** - Değerlendirme çalışmalarınızı isteğe bağlı veri seti filtrelemesiyle gezin
- **`get_evaluation_details`** - Belirli bir değerlendirme için kapsamlı sonuçlar, metrikler ve test durumlarını alın
- **`run_evaluation`** - Özel parametreler, test durumu filtreleme ve eşzamanlılık kontrolü ile değerlendirmeleri yürütün
- **`share_evaluation`** - Değerlendirme sonuçları için herkese açık paylaşılabilir URL'ler oluşturun

**Kırmızı Ekip Güvenlik Araçları:**

- **`redteam_run`** - Dinamik saldırı araştırmaları ile AI uygulamalarına karşı kapsamlı güvenlik testi gerçekleştirin
- **`redteam_generate`** - Yapılandırılabilir eklentiler ve stratejiler ile redteam güvenlik testi için olumsuz test durumları oluşturun

**Yapılandırma ve Test Etme:**

- **`validate_promptfoo_config`** - CLI ile aynı mantığı kullanarak yapılandırma dosyalarını doğrulayın
- **`test_provider`** - AI sağlayıcı bağlantısını, kimlik bilgilerini ve yanıt kalitesini test edin
- **`run_assertion`** - Hata ayıklama için çıktılara karşı bireysel iddia kurallarını test edin

Ayrıntılı kurulum talimatları ve entegrasyon örnekleri için [MCP Sunucusu belgelerine](/docs/integrations/mcp-server) bakın.

## `promptfoo show <id>`

Belirli bir kaynağın ayrıntılarını gösterin.

| Seçenek        | Açıklama                           |
| -------------- | ------------------------------------- |
| `eval <id>`    | Belirli bir değerlendirmenin ayrıntılarını göster |
| `prompt <id>`  | Belirli bir istemenin ayrıntılarını göster     |
| `dataset <id>` | Belirli bir veri setinin ayrıntılarını göster    |

## `promptfoo delete <id>`

Belirli bir kaynağı siler.

| Seçenek      | Açıklama                |
| ----------- | -------------------------- |
| `eval <id>` | Bir değerlendirmeyi kimliğine göre sil |

## `promptfoo retry <evalId>`

Belirli bir eval'dan tüm ERROR sonuçlarını yeniden deneyin. Bu komut, hatalara neden olan test durumlarını (ör. ağ sorunları, hız sınırları veya API hataları) bulur ve sadece o test durumlarını yeniden çalıştırır. Sonuçlar, orijinal eval'da yerinde güncellenir.

| Seçenek                       | Açıklama                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `-c, --config <path>`        | Yapılandırma dosyasına yol (isteğe bağlı, sağlanmadıysa orijinal eval config'i kullanır)       |
| `-v, --verbose`              | Ayrıntılı çıktı                                                                         |
| `--max-concurrency <number>` | Maksimum eşzamanlı eval sayısı                                                     |
| `--delay <number>`           | Eval'lar arasında milisaniye cinsinden gecikme                                                    |
| `--share/--no-share`         | Sonuçları buluta paylaş (bulut yapılandırıldığında otomatik paylaş, --no-share ile devre dışı bırak) |

Örnekler:

```sh
# Belirli bir eval'dan hataları yeniden deneyin
promptfoo retry eval-abc123

# Farklı bir config dosyasıyla yeniden deneyin
promptfoo retry eval-abc123 -c updated-config.yaml

# Ayrıntılı çıktı ve sınırlı eşzamanlılıkla yeniden deneyin
promptfoo retry eval-abc123 -v --max-concurrency 2

# Yeniden deneyin ve sonuçları buluta paylaşın
promptfoo retry eval-abc123 --share
```

:::tip Veri Güvenliği
Yeniden deneme işlemi başarısız olursa (ağ hatası, API zaman aşımı, vb.), orijinal ERROR sonuçlarınız korunur. Devam etmek için yeniden deneme komutunu basitçe çalıştırabilirsiniz. Eski ERROR sonuçları, yeniden deneme başarılı olduktan sonra kaldırılır.
:::

:::tip
`--filter-errors-only` yeni bir değerlendirme oluştururken, `promptfoo retry` orijinal değerlendirmeyi yerinde günceller. Mevcut eval'da hataları düzeltmek istediğinizde ve yinelemeler oluşturmak istemediğinizde `retry` kullanın.
:::

## `promptfoo import <filepath>`

Bir eval dosyasını JSON biçiminden içeri aktarın.

| Seçenek     | Açıklama                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| `--new-id` | Orijinalini korumak yerine yeni bir eval ID oluştur (yinelenmiş eval oluşturur) |
| `--force`  | Aynı ID'ye sahip mevcut eval'i değiştir                                            |

Bir eval içeri aktarırken, export'tan aşağıdaki veriler korunur:

- **Eval ID** - Varsayılan olarak korunur. Yeni bir ID oluşturmak için `--new-id` kullanın veya mevcut bir eval'i değiştirmek için `--force` kullanın.
- **Zaman Damgası** - Orijinal oluşturma zaman damgası her zaman korunur (`--new-id` veya `--force` ile bile)
- **Yazar** - Orijinal yazar her zaman korunur (`--new-id` veya `--force` ile bile)
- **Yapılandırma, sonuçlar ve tüm test verileri** - Tamamen korunur

Aynı ID'ye sahip bir eval zaten varsa, `--new-id` (yeni ID ile yinelenmiş bir çift oluşturmak için) veya `--force` (mevcut eval'i değiştirmek için) belirtmedikçe içeri aktarma hata ile başarısız olur.

Örnek:

```sh
# Orijinal ID'yi koruyarak eval'i içeri aktarın
promptfoo import my-eval.json

# Bu ID'ye sahip bir eval varsa bile içeri aktarın (yeni ID'ye sahip yinelenmiş olarak oluşturur)
promptfoo import --new-id my-eval.json

# Mevcut eval'i güncellenmiş verilerle değiştirin
promptfoo import --force my-eval.json
```

## `promptfoo export`

Eval kayıtlarını veya günlükleri dışa aktarın.

### `promptfoo export eval <evalId>`

Bir eval kaydını JSON biçimine dışa aktarın. En sonuncuyu dışa aktarmak için eval ID'si olarak `latest` kullanın.

| Seçenek                   | Açıklama                                 |
| ------------------------- | ------------------------------------------- |
| `-o, --output <filepath>` | Yazılacak dosya. Varsayılan olarak stdout'a yazar. |

### `promptfoo export logs`

Hata ayıklama amacıyla günlük dosyalarını toplayın ve sıkıştırın.

| Seçenek                   | Açıklama                                          |
| ------------------------- | ---------------------------------------------------- |
| `-n, --count <number>`    | Dahil edilecek son günlük dosyası sayısı (varsayılan: tümü) |
| `-o, --output <filepath>` | Sıkıştırılmış günlük dosyası için çıktı yolu              |

Bu komut, promptfoo günlük dosyalarınızı içeren sıkıştırılmış bir tar.gz arşivi oluşturarak hata ayıklama amacıyla bunları paylaşmayı kolaylaştırır. Çıktı yolu belirtilmezse otomatik olarak zaman damgalı bir dosya adı oluşturur.

Günlük dosyaları varsayılan olarak `~/.promptfoo/logs` içinde depolanır. Özel bir günlük dizini kullanmak için `PROMPTFOO_LOG_DIR` ortam değişkenini ayarlayın.

## `promptfoo validate`

Promptfoo yapılandırma dosyasını doğru şema ve yapıyı takip ettiğinden emin olmak için doğrulayın.

| Seçenek                   | Açıklama                                                             |
| ------------------------- | ----------------------------------------------------------------------- |
| `-c, --config <paths...>` | Yapılandırma dosyası(na) yol. Otomatik olarak promptfooconfig.yaml'ı yükler |

Bu komut, yapılandırma dosyasını ve test paketini beklenen şemaya uyduğundan emin olmak için doğrular. Yapılandırma sorunlarını düzeltmenize yardımcı olacak ayrıntılı iletilerle herhangi bir doğrulama hatasını raporlayacaktır.

Örnekler:

```sh
# Varsayılan promptfooconfig.yaml'ı doğrula
promptfoo validate

# Belirli bir yapılandırma dosyasını doğrula
promptfoo validate -c my-config.yaml

# Birden fazla yapılandırma dosyasını doğrula
promptfoo validate -c config1.yaml config2.yaml
```

Doğrulama başarısız olursa komut `1` ile çıkış yapacak, bu da CI/CD boru hatlarında yapılandırma hatalarını erkenden yakalaması için yararlıdır.

## `promptfoo scan-model`

ML modellerini güvenlik açıkları açısından tarayın. Bir veya daha fazla model dosyası veya dizine yol sağlayın.

| Seçenek                      | Açıklama                                                | Varsayılan |
| --------------------------- | ---------------------------------------------------------- | ------- |
| `-b, --blacklist <pattern>` | Model adlarına karşı kontrol edilecek ek kara liste pattern'leri |         |
| `-f, --format <format>`     | Çıkış biçimi (`text` veya `json`)                           | `text`  |
| `-o, --output <path>`       | Çıktı dosyası yolu (belirtilmezse stdout'e yazdırır)       |         |
| `-t, --timeout <seconds>`   | Tarama zaman aşımı (saniye cinsinden)                                    | `300`   |
| `--max-file-size <bytes>`   | Taranacak maksimum dosya boyutu (bayt cinsinden)                         |         |

## `promptfoo auth`

Bulut özelliklerine yönelik kimlik doğrulamasını yönetin.

### `promptfoo auth login`

Promptfoo bulutunda oturum açın.

| Seçenek               | Açıklama                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| `-o, --org <orgId>`   | Oturum açılacak kuruluş kimliği                                           |
| `-h, --host <host>`   | Promptfoo örneğinin ana bilgisayarı (app URL'i isinden farklıysa API URL) |
| `-k, --api-key <key>` | API anahtarı kullanarak oturum açın                                    |

Oturum açtıktan sonra, birden fazla ekibiniz varsa, `teams` alt komutunu kullanarak aralarında geçiş yapabilirsiniz.

### `promptfoo auth logout`

Promptfoo bulutundan çıkış yapın.

### `promptfoo auth whoami`

Geçerli kimlik doğrulama durumunu kullanıcı, kuruluş ve aktif ekip dahil olmak üzere görüntüleyin.

**Çıktı şunları içerir:**

- Kullanıcı e-postası
- Kuruluş adı
- Geçerli ekip (çok ekipli bir kuruluşta oturum açıldıysa)
- Uygulama URL'si

Örnek:

```sh
promptfoo auth whoami
```

Çıktı:

```
Currently logged in as:
User: user@company.com
Organization: Acme Corp
Current Team: Engineering Team
App URL: https://www.promptfoo.app
```

### `promptfoo auth teams`

Birden fazla ekibe sahip kuruluşlar için ekip geçişini yönetin.

#### `promptfoo auth teams list`

Geçerli kuruluşta erişiminiz olan tüm ekipleri listeleyin.

#### `promptfoo auth teams current`

Şu anda etkin olan ekibi gösterin.

#### `promptfoo auth teams set <teamIdentifier>`

Belirli bir ekibe geçin. Ekip tanımlayıcısı şu olabilir:

- Ekip adı (örn. "Engineering")
- Ekip slug'ı (örn. "engineering")
- Ekip ID'si (örn. "team_12345")

Örnekler:

```sh
# Ada göre ekibe geç
promptfoo auth teams set "Engineering Team"

# Slug'a göre ekibe geç
promptfoo auth teams set engineering

# ID'ye göre ekibe geç
promptfoo auth teams set team_12345
```

Ekip seçiminiz CLI oturumları arasında hatırlanır ve değerlendirmeler ve kırmızı ekip testi dahil olmak üzere tüm promptfoo işlemleri için geçerli olur.

#### Kuruluşlar Arasında Ekip Seçimi

Birden fazla kuruluşa erişiminiz varsa, ekip seçimleri **kuruluş başına izole edilmiştir**. Bu şu anlama gelir:

- Her kuruluş kendi ekip seçimini hatırlar
- Kuruluşlar arasında geçiş yapmak her org'de takım seçiminizi korur
- Bir kuruluşta oturum açtığınızda, daha önce seçilen takımınız otomatik olarak geri yüklenir

Örnek akış:

```sh
# Organization A'da oturum aç
promptfoo auth login --api-key <org-a-key>
promptfoo auth teams set "Engineering"     # Org A'da takım ayarla

# Organization B'de oturum aç
promptfoo auth login --api-key <org-b-key>
promptfoo auth teams set "Marketing"       # Org B'de takım ayarla

# Organization A'ya geri dön
promptfoo auth login --api-key <org-a-key>
promptfoo auth teams current              # "Engineering"'i göster (korundu!)
```

Takım seçiminiz aynı kuruluş içindeki oturum açma oturumları arasında devam eder.

## `promptfoo config`

Yapılandırma ayarlarını düzenleyin.

### `promptfoo config get email`

Kullanıcının e-postasını alın.

### `promptfoo config set email <email>`

Kullanıcının e-postasını ayarlayın.

### `promptfoo config unset email`

Kullanıcının e-postasını kaldırın.

| Seçenek        | Açıklama                      |
| ------------- | -------------------------------- |
| `-f, --force` | Onay olmadan kaldırma işlemini zorla |

## `promptfoo debug`

Sorun giderme için hata ayıklama bilgilerini görüntüleyin.

| Seçenek               | Açıklama                                                  |
| --------------------- | ------------------------------------------------------------ |
| `-c, --config [path]` | Yapılandırma dosyasına yol. Varsayılan promptfooconfig.yaml |

## `promptfoo generate dataset`

BETA: Mevcut istemler ve değişkenlere dayalı olarak sentetik test durumları oluşturun.

| Seçenek                             | Açıklama                                                | Varsayılan              |
| ----------------------------------- | ---------------------------------------------------------- | -------------------- |
| `-c, --config <path>`               | Yapılandırma dosyasına yol                             | promptfooconfig.yaml |
| `-w, --write`                       | Oluşturulan test durumlarını doğrudan config dosyasına yazın | false                |
| `-i, --instructions <text>`         | Test durumu oluşturmak için özel talimatlar               |                      |
| `-o, --output <path>`               | Oluşturulan test durumlarının yazılacağı yol                     | stdout               |
| `--numPersonas <number>`            | Oluşturulacak persona sayısı                             | 5                    |
| `--numTestCasesPerPersona <number>` | Persona başına test durumu sayısı                           | 3                    |
| `--provider <provider>`             | Test durumlarını oluşturmak için kullanılacak sağlayıcı                  | varsayılan grader       |
| `--no-cache`                        | Disk önbelleğinden sonuçları okmayın veya yazını                 | false                |

Örneğin, bu komut varsayılan config dosyanızı (genellikle `promptfooconfig.yaml`) yeni test durumlarıyla değiştirecektir:

```sh
promptfoo generate dataset -w
```

Bu komut belirli bir config için test durumları oluşturacak ve bunları bir dosyaya yazacak, özel talimatları takip ederken:

```sh
promptfoo generate dataset -c my_config.yaml -o new_tests.yaml -i 'All test cases for {{location}} must be European cities'
```

## `promptfoo generate assertions`

Mevcut istemler ve iddialara dayalı olarak ek nesnel/öznellik iddiaları oluşturun.

- Bu komut, eğer hiç yoksa ilk iddia setini oluşturmak için kullanılabilir.
- Sadece örtüşmeyen, bağımsız iddiaları ekleyecektir
- Hem python hem de doğal dil iddiaları oluşturur.

İddiaları beyin fırtınası yaparken:

- Herhangi bir nesnel iddia için python kodu oluşturur
- Herhangi bir öznel iddia için belirtilen doğal dil iddia türünü (pi, llm-rubric veya g-eval) kullanır.

| Seçenek                      | Açıklama                                                     | Varsayılan              |
| --------------------------- | --------------------------------------------------------------- | -------------------- |
| `-t, --type <type>`         | Oluşturulan öznel iddiaları kullanılacak iddia türü.  | pi                   |
| `-c, --config <path>`       | En az 1 istem içeren yapılandırma dosyasına yol. | promptfooconfig.yaml |
| `-w, --write`               | Oluşturulan iddiaları doğrudan config dosyasına yazın      | false                |
| `-i, --instructions <text>` | İddia oluşturmak için özel talimatlar                    |                      |
| `-o, --output <path>`       | Oluşturulan iddiaların yazılacağı yol                          | stdout               |
| `--numAssertions <number>`  | Oluşturulacak iddia sayısı                                | 5                    |
| `--provider <provider>`     | İddiaları oluşturmak için kullanılacak sağlayıcı                       | varsayılan grader       |
| `--no-cache`                | Disk önbelleğinden sonuçları okmayın veya yazını                      | false                |

Örneğin, bu komut varsayılan config dosyanızı (genellikle `promptfooconfig.yaml`) yeni test durumlarıyla değiştirecektir:

```sh
promptfoo generate assertions -w
```

Bu komut belirli bir config için `pi` ve `python` iddiaları oluşturacak ve bunları bir dosyaya yazacak, özel talimatları takip ederken:

```sh
promptfoo generate assertions -c my_config.yaml -o new_tests.yaml -i 'I need assertions about pronunciation'
```

## `promptfoo generate redteam`

[`promptfoo redteam generate`](#promptfoo-redteam-generate) için takma ad.

## `promptfoo redteam init`

Kırmızı ekip projesini başlatın.

| Seçenek        | Açıklama                            | Varsayılan |
| ------------- | -------------------------------------- | ------- |
| `[directory]` | Projenin başlatılacağı dizin | .       |
| `--no-gui`    | Tarayıcı arayüzünü açma             |         |

Örnek:

```sh
promptfoo redteam init my_project
```

:::danger
Olumsuz test, saldırgan, toksik ve zararlı test girişleri üretir ve sisteminizin zararlı çıktılar üretmesine neden olabilir.
:::

Daha fazla ayrıntı için [kırmızı ekip yapılandırmasına](/docs/red-team/configuration/) bakın.

## `promptfoo redteam setup`

Tarayıcı arayüzünü başlatın ve kırmızı ekip kurulumuna açın.

| Seçenek               | Açıklama                              | Varsayılan |
| --------------------- | ---------------------------------------- | ------- |
| `[configDirectory]`   | Yapılandırma dosyalarını içeren dizin |         |
| `-p, --port <number>` | Yerel sunucu için bağlantı noktası numarsı         | 15500   |

## `promptfoo redteam run`

Tam kırmızı ekip sürecini çalıştırın (başlatma, oluşturma ve değerlendirme).

| Seçenek                                             | Açıklama                                                             | Varsayılan              |
| -------------------------------------------------- | ----------------------------------------------------------------------- | -------------------- |
| `-c, --config [path]`                              | Yapılandırma dosyasına yol                                              | promptfooconfig.yaml |
| `-o, --output [path]`                              | Oluşturulan testler için çıktı dosyasına yol                                 | redteam.yaml         |
| `-d, --description <text>`                         | Bu tarama çalışması için özel açıklama/ad                               |                      |
| `--no-cache`                                       | Disk önbelleğinden sonuçları okmayın veya yazını                              | false                |
| `-j, --max-concurrency <number>`                   | Maksimum eşzamanlı API çağrısı sayısı                                  |                      |
| `--delay <number>`                                 | API çağrıları arasında milisaniye cinsinden gecikme                                 |                      |
| `--remote`                                         | Mümkün olduğu yerde uzaktan çıkarımı zorlayın                                | false                |
| `--force`                                          | Hiçbir değişiklik algılanmasa bile oluşturmayı zorla                        | false                |
| `--no-progress-bar`                                | İlerleme çubuğunu göstermeyin                                                |                      |
| `--strict`                                         | Herhangi bir eklenti test durumları oluşturamazsa başarısız ol                         | false                |
| `--filter-prompts <pattern>`                       | ID'si veya etiketi regex pattern'i eşleşen istemlerle testleri çalıştır |                      |
| `--filter-providers, --filter-targets <providers>` | Bu sağlayıcılarla testleri çalıştır (regex eşleşmesi)                       |                      |
| `-t, --target <id>`                                | Taramayı çalıştıracak bulut sağlayıcısı hedefi kimliği                             |                      |

## `promptfoo redteam discover`

Uygulamanıza karşı [Hedef Bulma Ajanını](/docs/red-team/discovery) çalıştırın.

:::info

Sadece bir yapılandırma dosyası veya hedef belirtilebilir

:::

| Seçenek               | Açıklama                                          | Varsayılan |
| --------------------- | ---------------------------------------------------- | ------- |
| `-c, --config <path>` | `promptfooconfig.yaml` yapılandırma dosyasına yol.   |         |
| `-t, --target <id>`   | Taranacak Promptfoo Cloud'da tanımlanan hedefin UUID'si. |         |

## `promptfoo redteam generate`

İstemleriniz ve modellerinizi zorlayacak olumsuz test durumları oluşturun.

| Seçenek                           | Açıklama                                                          | Varsayılan              |
| -------------------------------- | -------------------------------------------------------------------- | -------------------- |
| `-c, --config <path>`            | Yapılandırma dosyasına yol                                           | promptfooconfig.yaml |
| `-o, --output <path>`            | Oluşturulan test durumlarının yazılacağı yol                               | redteam.yaml         |
| `-d, --description <text>`       | Oluşturulan testler için özel açıklama/ad                      |                      |
| `-w, --write`                    | Oluşturulan test durumlarını doğrudan config dosyasına yazın           | false                |
| `-t, --target <id>`              | Taramayı çalıştıracak bulut sağlayıcısı hedefi kimliği                          |                      |
| `--purpose <purpose>`            | Sistemin amacının üst düzey açıklaması                       | Config'den çıkarıldı |
| `--provider <provider>`          | Olumsuz testler oluşturmak için kullanılacak sağlayıcı                     |                      |
| `--injectVar <varname>`          | Prompt'ta kullanıcı girişini temsil eden `{{variable}}`'i geçersiz kıl | `prompt`             |
| `--plugins <plugins>`            | Kullanılacak eklentilerin virgülle ayrılmış listesi                               | varsayılan              |
| `--strategies <strategies>`      | Kullanılacak stratejilerin virgülle ayrılmış listesi                            | varsayılan              |
| `-n, --num-tests <number>`       | Eklenti başına oluşturulacak test durumu sayısı                          |                      |
| `--language <language>`          | Oluşturulan testler için dili belirt                             | İngilizce              |
| `--no-cache`                     | Disk önbelleğinden sonuçları okmayın veya yazını                           | false                |
| `-j, --max-concurrency <number>` | Maksimum eşzamanlı API çağrısı sayısı                               |                      |
| `--delay <number>`               | Eklenti API çağrıları arasında milisaniye cinsinden gecikme                       |                      |
| `--remote`                       | Mümkün olduğu yerde uzaktan çıkarımı zorlayın                             | false                |
| `--force`                        | Hiçbir değişiklik algılanmasa bile oluşturmayı zorla                     | false                |
| `--no-progress-bar`              | İlerleme çubuğunu göstermeyin                                             |                      |
| `--strict`                       | Herhangi bir eklenti test durumları oluşturamazsa başarısız ol              | false                |
| `--burp-escape-json`             | JSON yükleri için .burp çıktısında özel karakterleri kaçır          | false                |

Örneğin, aşağıdaki `promptfooconfig.yaml`'ye sahip olduğumuzu varsayalım:

```yaml
prompts:
  - 'Act as a trip planner and help the user plan their trip'

providers:
  - openai:gpt-5-mini
  - openai:gpt-5
```

Bu komut olumsuz test durumları oluşturacak ve bunları `redteam.yaml`'ye yazacaktır.

```sh
promptfoo redteam generate
```

Bu komut sistem amacını ve olumsuz kullanıcı girişini enjekte etmek için değişkeni geçersiz kılar:

```sh
promptfoo redteam generate --purpose 'Travel agent that helps users plan trips' --injectVar 'message'
```

## `promptfoo redteam poison`

RAG testi için zehirli belgeleri oluşturun.

| Seçenek                   | Açıklama                                       | Varsayılan                |
| ------------------------- | ------------------------------------------------- | ---------------------- |
| `documents`               | Zehirlenecek belgeler, dizinler veya metin içeriği |                        |
| `-g, --goal <goal>`       | Zehirlenmenin hedefi/amaçlanan sonucu             |                        |
| `-o, --output <path>`     | Çıktı YAML dosyası yolu                             | `poisoned-config.yaml` |
| `-d, --output-dir <path>` | Bireysel zehirli belgeleri yazacak dizin  | `poisoned-documents`   |

## `promptfoo redteam eval`

[`promptfoo eval`](#promptfoo-eval) ile aynı şekilde çalışır, ancak varsayılan olarak `redteam.yaml` yükler.

## `promptfoo redteam report`

Tarayıcı arayüzünü başlatın ve kırmızı ekip raporuna açın.

| Seçenek               | Açıklama                                        | Varsayılan |
| --------------------- | -------------------------------------------------- | ------- |
| `[directory]`         | Kırmızı ekip yapılandırmasını içeren dizin | .       |
| `-p, --port <number>` | Sunucu için bağlantı noktası numarası                         | 15500   |

Örnek:

```sh
promptfoo redteam report -p 8080
```

## `promptfoo redteam plugins`

Mevcut tüm kırmızı ekip eklentilerini listeleyin.

| Seçenek       | Açıklama                               |
| ------------ | ----------------------------------------- |
| `--ids-only` | Açıklamalar olmadan sadece eklenti ID'lerini göster |
| `--default`  | Sadece varsayılan eklentileri göster             |

## Yapılandırmada Komut Satırı Seçeneklerini Belirtme

Birçok komut satırı seçeneği, `commandLineOptions` bölümü kullanılarak doğrudan `promptfooconfig.yaml` dosyanızda belirtilebilir. Bu, sık sık kullandığınız veya projeniz için varsayılan olarak ayarlamak istediğiniz seçenekler için kullanışlıdır.

Örnek:

```yaml title="promptfooconfig.yaml"
prompts:
  - Write a funny tweet about {{topic}}
providers:
  - openai:o3-mini
tests:
  - file://test_cases.csv

# Varsayılan olarak komut satırı seçenekleri
commandLineOptions:
  maxConcurrency: 5
  verbose: true
  table: true
  share: false
  cache: true
  tableCellMaxLength: 500
```

Bu yapılandırmayla, komut satırında seçenekleri belirtmeden sadece `promptfoo eval` çalıştırabilirsiniz. Komutu çalıştırırken ilgili bayrağı sağlayarak herhangi bir ayarı yine de geçersiz kılabilirsiniz.

## Sadece ASCII çıktıları

Yazdırılan çıktılar için terminal renklerini devre dışı bırakmak için `FORCE_COLOR=0` ayarlayın (bu [chalk](https://github.com/chalk/chalk) kütüphanesi tarafından desteklenir).

`eval` komutu için, özel karakterler kullandığından ilerleme çubuğunu ve tabloyu da devre dışı bırakmak isteyebilirsiniz:

```sh
FORCE_COLOR=0 promptfoo eval --no-progress-bar --no-table
```

# Ortam değişkenleri

Bu genel amaçlı ortam değişkenleri desteklenir:

| Ad                                            | Açıklama                                                                                                                                                                                                                                                                       | Varsayılan                       |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `FORCE_COLOR`                                 | Yazdırılan çıktılar için terminal renklerini devre dışı bırakmak için 0 olarak ayarlayın                                                                                                                                                                                                                           |                               |
| `PROMPTFOO_ASSERTIONS_MAX_CONCURRENCY`        | Aynı anda kaç iddia çalıştırılacağı                                                                                                                                                                                                                              | 3                             |
| `PROMPTFOO_CACHE_ENABLED`                     | LLM istek/yanıt önbelleğini etkinleştir                                                                                                                                                                                                                                               | `false`                       |
| `PROMPTFOO_CONFIG_DIR`                        | Eval geçmişini depolayan dizin                                                                                                                                                                                                                                                | `~/.promptfoo`                |
| `PROMPTFOO_CSRF_ALLOWED_ORIGINS`              | Promptfoo sunucusuna çapraz site istekleri yapmasına izin verilen güvenilir kaynakların virgülle ayrılmış listesi (örn. `https://app.example.com,https://admin.example.com`). Standart localhost veya aynı kaynaktan gelenler için gerekli değildir.                                                         |                               |
| `PROMPTFOO_DISABLE_AJV_STRICT_MODE`           | Ayarlanırsa, JSON şema doğrulaması için AJV kesin modunu devre dışı bırakır                                                                                                                                                                                                                                       |                               |
| `PROMPTFOO_DISABLE_CONVERSATION_VAR`          | `_conversation` değişkeninin ayarlanmasını önler                                                                                                                                                                                                                              |                               |
| `PROMPTFOO_DISABLE_ERROR_LOG`                 | Hata günlüklerinin bir dosyaya yazılmasını önler                                                                                                                                                                                                                                  |                               |
| `PROMPTFOO_DISABLE_DEBUG_LOG`                 | Hata ayıklama günlüklerinin bir dosyaya yazılmasını önler                                                                                                                                                                                                                                                                                                                  |                               |
| `PROMPTFOO_DISABLE_JSON_AUTOESCAPE`           | Ayarlanırsa, JSON istekleri içinde akıllı değişken yerine koymayı devre dışı bırakır                                                                                                                                                                                                                                                                                                                  |                               |
| `PROMPTFOO_DISABLE_OBJECT_STRINGIFY`          | Şablonlarda nesne stringification'ını devre dışı bırakın. False (varsayılan) olduğunda, nesneler `[object Object]` sorunlarını önlemek için stringifie edilir. True olduğunda, doğrudan özellik erişimine izin verir (örn. `{{output.property}}`).                                                           | `false`                       |
| `PROMPTFOO_DISABLE_REF_PARSER`                | JSON şema dereferencelenmasini önler                                                                                                                                                                                                                                                |                               |
| `PROMPTFOO_DISABLE_REMOTE_GENERATION`         | TÜM uzaktan oluşturmayı devre dışı bırakır (SimulatedUser ve kırmızı ekip özelliklerini dahil). `1`, `true` veya `yes` olarak ayarlandığında, tüm işlemler yerel olarak çalışır. Bu `PROMPTFOO_DISABLE_REDTEAM_REMOTE_GENERATION`'ın üst seti. Örnek: `PROMPTFOO_DISABLE_REMOTE_GENERATION=true`           | `false`                       |
| `PROMPTFOO_DISABLE_REDTEAM_REMOTE_GENERATION` | Sadece kırmızı ekip özelliklerine yönelik uzaktan oluşturmayı devre dışı bırakır (zararlı içerik, kırmızı ekip stratejileri, kırmızı ekip simüle edilmiş kullanıcıları). Düzenli SimulatedUser kullanımını ETKİLEMEZ. `PROMPTFOO_DISABLE_REMOTE_GENERATION`'ın alt seti. Örnek: `PROMPTFOO_DISABLE_REDTEAM_REMOTE_GENERATION=true` | `false`                       |
| `PROMPTFOO_DISABLE_TEMPLATE_ENV_VARS`         | Şablonlarda işletim sistemi ortam değişkenlerini devre dışı bırakır. True olduğunda, sadece yapılandırma `env:` değişkenleri şablonlarda kullanılabilir.                                                                                                                                                               | `false` (self-hosted'de true) |
| `PROMPTFOO_DISABLE_TEMPLATING`                | Nunjucks şablon işlemesini devre dışı bırakır                                                                                                                                                                                                                                             | `false`                       |
| `PROMPTFOO_DISABLE_VAR_EXPANSION`             | Array-tipi değişkenlerin birden fazla test durumuna genişletilmesini önler                                                                                                                                                                                                                             |                               |
| `PROMPTFOO_FAILED_TEST_EXIT_CODE`             | En az 1 sınav durumu başarısızlığı olduğunda veya geçiş oranı PROMPTFOO_PASS_RATE_THRESHOLD 'dan düşük olduğunda çıkış kodunu geçersiz kıl                                                                                                                                                                    | 100                           |
| `PROMPTFOO_LOG_DIR`                           | Günlük dosyalarını yazacak dizin (hem hata ayıklama hem de hata günlükleri). Varsayılan `~/.promptfoo/logs` dizinini geçersiz kılar.                                                                                                                                                                                                                    | `~/.promptfoo/logs`           |
| `PROMPTFOO_PASS_RATE_THRESHOLD`               | Minimum geçiş oranı eşiğini ayarla (yüzde olarak). Ayarlanmazsa varsayılan %100 (başarısızlığa izin yok)                                                                                                                                                                           | 100                           |
| `PROMPTFOO_REQUIRE_JSON_PROMPTS`              | Varsayılan olarak sohbet tamamlama sağlayıcısı JSON olmayan mesajları tek bir kullanıcı mesajında saracaktır. Bu envar'ı true olarak ayarlamak bu davranışı devre dışı bırakır.                                                                                                                                  |                               |
| `PROMPTFOO_SHARE_CHUNK_SIZE`                  | Her yığında gönderilecek sonuç sayısı. Bu, sonuçların boyutunu tahmin etmek ve gönderilecek yığın sayısını belirlemek için kullanılır.                                                                                                                                                                                                                          |                               |
| `PROMPTFOO_EVAL_TIMEOUT_MS`                   | Her bir test durumu/sağlayıcı API çağrısı için milisaniye cinsinden zaman aşımı. Belirtildiğinde, o belirli test bir hata olarak işaretlenir.                                                                                                                                                                  |                               |
| `PROMPTFOO_MAX_EVAL_TIME_MS`                  | Tüm değerlendirme süreci için milisaniye cinsinden maksimum toplam çalışma süresi. Belirtildiğinde, kalan tüm testler hatalar olarak işaretlenir ve eval sona erer.                                                                                                                                |                               |
| `PROMPTFOO_STRIP_GRADING_RESULT`              | Bellek kullanımını azaltmak için notlandırma sonuçlarını şeritlendir                                                                                                                                                                                                                                         | false                         |
| `PROMPTFOO_STRIP_METADATA`                    | Bellek kullanımını azaltmak için metadata'yı şeritlendir                                                                                                                                                                                                                                                | false                         |
| `PROMPTFOO_STRIP_PROMPT_TEXT`                 | Bellek kullanımını azaltmak için istem metnini şeritlendir                                                                                                                                                                                                                                             | false                         |
| `PROMPTFOO_STRIP_RESPONSE_OUTPUT`             | Bellek kullanımını azaltmak için model yanıt çıktılarını şeritlendir                                                                                                                                                                                                                                                                                                                  | false                         |
| `PROMPTFOO_STRIP_TEST_VARS`                   | Bellek kullanımını azaltmak için test değişkenlerini şeritlendir                                                                                                                                                                                                                                                                                                                  | false                         |
| `PROMPTFOO_SELF_HOSTED`                       | Self-hosted modunu etkinleştirir. True olduğunda, şablonlarda işletim sistemi ortam değişkenlerini devre dışı bırakır (sadece yapılandırma `env:` değerleri kullanılabilir), telemetriyi devre dışı bırakır ve kontrollü ortamlar için diğer davranışları değiştirir                                           | `false`                       |

:::tip
promptfoo geçerli çalışma dizininizdeki `.env` dosyasından ortam değişkenlerini yükler.
:::

:::tip
Zaman aşımı özelliklerini kullanma hakkında ayrıntılı bilgi, yapılandırma örnekleri ve sorun giderme ipuçları için [sorun giderme kılavuzunda Zaman aşımı hataları](/docs/usage/troubleshooting#how-to-triage-stuck-evals) bölümüne bakın.
:::