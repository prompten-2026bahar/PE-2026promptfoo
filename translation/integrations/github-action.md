---
sidebar_label: GitHub Actions
description: GitHub Actions entegrasyonu ile CI/CD süreçlerinde LLM prompt testlerini otomatikleştirmeyi öğrenin. Promptfoo'yu kullanarak prompt değişikliklerini karşılaştırın, farkları görüntüleyin ve sonuçları doğrudan pull request'lerde analiz edin.
---

# GitHub Actions ile Prompt Testi

Bu kılavuz, [promptfoo GitHub Action](https://github.com/promptfoo/promptfoo-action/) kullanarak düzenlenen promptların "öncesi vs. sonrası" değerlendirmesinin nasıl otomatik olarak çalıştırılacağını açıklar.

Bir promptu değiştiren her pull request'te (PR), aksiyon otomatik olarak tam bir karşılaştırma çalıştıracaktır:

![GitHub Action modified LLM prompt comment](/img/docs/github-action-comment.png)

Sağlanan bağlantı, öncesi ve sonrasını etkileşimli olarak keşfetmenize olanak tanıyan [web görüntüleyici](/docs/usage/web-ui) arayüzünü açar:

![promptfoo web viewer](https://user-images.githubusercontent.com/310310/244891219-2b79e8f8-9b79-49e7-bffb-24cba18352f2.png)

## GitHub Action Kullanımı

İşte bir PR'daki değişiklikleri izleyen örnek bir aksiyon. Eğer `prompts/` dizinindeki herhangi bir dosya değiştirilirse, `promptfoo/promptfoo-action@v1` kullanarak değerlendirmeyi otomatik olarak çalıştırır ve sonuçlara giden bir bağlantı paylaşırız:

```yml
name: 'Prompt Değerlendirmesi'

on:
  pull_request:
    paths:
      - 'prompts/**'

jobs:
  evaluate:
    runs-on: ubuntu-latest
    permissions:
      # Bu izin, Pull Request'lere yorum göndermek için kullanılır
      pull-requests: write
    steps:
      # Bu önbellek isteğe bağlıdır, ancak kurarak hem paradan hem zamandan tasarruf edersiniz!
      - name: Promptfoo önbelleğini ayarla
        uses: actions/cache@v4
        with:
          path: ~/.cache/promptfoo
          key: ${{ runner.os }}-promptfoo-v1
          restore-keys: |
            ${{ runner.os }}-promptfoo-

      # Bu adım aslında öncesi/sonrası değerlendirmesini çalıştıracaktır
      - name: Promptfoo değerlendirmesini çalıştır
        uses: promptfoo/promptfoo-action@v1
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          prompts: 'prompts/**/*.json'
          config: 'prompts/promptfooconfig.yaml'
          cache-path: ~/.cache/promptfoo
```

## Yapılandırma

Bu GitHub Action'ın projenizde çalışması için birkaç şey yapmanız gerekecek:

1. **Yolları ayarlayın**: `'prompts/**'` kısmını, değişiklikler için izlemek istediğiniz dosyaların yoluyla değiştirin. Bu, tek tek dosyaların listesi veya promptlarınızın saklandığı bir dizin olabilir.

   "Promptfoo değerlendirmesini çalıştır" adımındaki yolları da kendi promptlarınıza ve `promptfooconfig.yaml` yapılandırma dosyanıza işaret edecek şekilde güncellemeyi unutmayın.

2. **OpenAI API anahtarını ayarlayın**: Eğer bir OpenAI API'si kullanıyorsanız, GitHub deponuzda `OPENAI_API_KEY` sırrını (secret) ayarlamanız gerekir.

   Bunu yapmak için deponuzun Settings > Secrets and variables > Actions > New repository secret bölümüne gidin ve `OPENAI_API_KEY` adında bir tane oluşturun.

3. **Ortam değişkenlerini ayarlayın**: Aksiyon, dosya sistemindeki durumu kaydetmek için `PROMPTFOO_CONFIG_DIR` ve `PROMPTFOO_CACHE_PATH` değişkenlerini kullanır.

4. **Projenize ekleyin**: GitHub, `.github/workflows` dizinindeki iş akışlarını otomatik olarak çalıştırır, bu nedenle dosyayı `.github/workflows/prompt-eval.yml` gibi bir adla kaydedin.

Desteklenen parametreler şunlardır:

| Parametre        | Açıklama                                                                                                               | Gerekli |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| `github-token`   | GitHub jetonu. GitHub API'sine yapılan isteklerin kimliğini doğrulamak için kullanılır.                                | Evet     |
| `prompts`        | Prompt dosyaları için glob desenleri. Aksiyonun değerlendirmesi gereken dosyaları bulmak için kullanılır.             | Evet     |
| `config`         | Yapılandırma dosyasının yolu. Bu dosya, aksiyon için ayarları içerir.                                                 | Evet     |
| `openai-api-key` | OpenAI API anahtarı. OpenAI API'sine yapılan isteklerin kimliğini doğrulamak için kullanılır.                         | Hayır    |
| `cache-path`     | Önbellek yolu. Aksiyonun geçici verileri sakladığı yerdir.                                                            | Hayır    |

## Nasıl Çalışır?

1. **Önbelleğe Alma**: Sonraki çalışmaları hızlandırmak için önbelleğe almayı kullanıyoruz. Önbellek, LLM isteklerini ve çıktılarını saklar; bunlar maliyet tasarrufu sağlamak için gelecekteki çalışmalarda yeniden kullanılabilir.

2. **Promptfoo Değerlendirmesini Çalıştırma**: İşin sırrı buradadır. Yapılandırma dosyasını ve değerlendirmek istediğimiz promptları aktararak değerlendirmeyi çalıştırıyoruz. Bu adımın sonuçları otomatik olarak pull request'e gönderilir.

Promptfoo yapılandırmasının nasıl kurulacağı hakkında daha fazla bilgi için [Başlarken](/docs/getting-started) belgelerine bakın.

## Kırmızı Takım (Red Teaming) İçin

Kırmızı takım entegrasyonları için, iş akışınıza daha ayrıntılı raporlar eklemenizi öneririz.

İşte bir örnek:

```yaml
- name: Promptfoo kırmızı takım çalıştır
  run: |
    start=$(date +%s)
    npx promptfoo@latest redteam run \
      -c 9d32de26-7926-44f1-af13-bd06cb86f691 \
      -t 213c2235-865c-4aa4-90cc-a002256e0a94 \
      -j 5 \
      -o output.json || true
    end=$(date +%s)
    echo "DURATION_SECONDS=$((end-start))" >> $GITHUB_ENV
    test -f output.json || { echo 'output.json not found'; exit 1; }

- name: Kırmızı takım özeti oluştur (JS)
  run: |
    node .github/scripts/redteam-summary.js --input output.json --out comment.md --print
```

> **💡 İpucu**: Derlemeleri hızlandırmak için, her seferinde indirmek yerine promptfoo'yu önbelleğe alabilirsiniz:
>
> **Başlarken**: Eğer henüz bir `package.json` dosyanız yoksa, önce bir tane oluşturun:
>
> ```bash
> npm init -y
> ```
>
> **package.json ile**: Promptfoo'yu bağımlılık olarak ekleyin, ardından önbelleğe alma ile setup-node kullanın:
>
> ```bash
> npm install --save-dev promptfoo
> ```
>
> ```yaml
> steps:
>   - uses: actions/checkout@v5
>   - uses: actions/setup-node@v4
>     with:
>       node-version: '22'
>       cache: 'npm'
>   - run: npm ci
>   - name: Promptfoo kırmızı takım çalıştır
>     run: npx promptfoo redteam run -c config.yaml -o output.json
> ```
>
> **package.json olmadan**: İş akışı dosyalarını önbellek anahtarı olarak kullanarak npx indirmelerini önbelleğe alın:
>
> ```yaml
> steps:
>   - uses: actions/checkout@v5
>   - uses: actions/setup-node@v4
>     with:
>       node-version: '22'
>       cache: 'npm'
>       cache-dependency-path: '**/.github/workflows/*.yml'
>   - name: Promptfoo kırmızı takım çalıştır
>     run: npx promptfoo@latest redteam run -c config.yaml -o output.json
> ```

Bu örnekte, [redteam-summary.js](https://gist.github.com/MrFlounder/2d9c719873ad9f221db5f87efb13ece9) dosyası kırmızı takım sonuçlarını ayrıştırır ve bir özet oluşturur:

![llm red team github action](/img/docs/github-action-redteam.png)

PR'da paylaşılan sonuçlar; eklenti, strateji ve hedef performansı hakkında daha fazla ayrıntılı bilgi içerir.
