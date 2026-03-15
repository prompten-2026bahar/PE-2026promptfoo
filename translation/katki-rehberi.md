# promptfoo'ya Katkıda Bulunma

promptfoo'yu daha iyi hale getirmek için topluluktan gelen katkıları memnuniyetle karşılıyoruz. Bu rehber, başlamanıza yardımcı olacaktır. Herhangi bir sorunuz varsa, lütfen [Discord](https://discord.gg/promptfoo) üzerinden veya bir [GitHub sorunu](https://github.com/promptfoo/promptfoo/issues/new) aracılığıyla bize ulaşın.

## Projeye Genel Bakış

Promptfoo, LLM uygulamalarını test etmek ve değerlendirmek için MIT lisanslı bir araçtır.

### Nasıl Katkıda Bulunulur

promptfoo'ya katkıda bulunmanın birkaç yolu vardır:

1. **Pull Request Gönderin**: Herkes depoyu forklayarak ve pull request göndererek katkıda bulunabilir. Kod veya dokümantasyon değişiklikleri için katkıda bulunmak üzere bir iş birlikçi olmanız gerekmez.

2. **Sorun Bildirin**: GitHub sorunları veya [Discord](https://discord.gg/promptfoo) aracılığıyla hataları bildirerek veya iyileştirmeler önererek bize yardımcı olun.

3. **Dokümantasyonu İyileştirin**: Yazım hatalarını düzeltmek, örnekler eklemek veya rehberler yazmak dahil olmak üzere dokümantasyon iyileştirmeleri her zaman memnuniyetle karşılanır.

Özellikle aşağıdaki alanlardaki katkıları memnuniyetle karşılıyoruz:

- Hata düzeltmeleri
- Örnekler ve rehberler dahil dokümantasyon güncellemeleri
- Yeni modeller, yeni yetenekler (araç kullanımı, fonksiyon çağırma, JSON modu, dosya yüklemeleri vb.) dahil sağlayıcı güncellemeleri
- Özellikle RAG'lar, Ajanlar ve sentetik veri üretimi ile ilgili olarak promptfoo kullanıcı deneyimini iyileştiren özellikler.

## Başlarken

1. [promptfoo deposunun](https://github.com/promptfoo/promptfoo) sağ üst köşesindeki "Fork" düğmesine tıklayarak GitHub'da depoyu forklayın.
2. Forkunuzu yerel olarak klonlayın:

   ```bash
   git clone https://github.com/[kullanici-adiniz]/promptfoo.git
   cd promptfoo
   ```

3. Geliştirme ortamınızı kurun:

   3.1. Yerel kurulum

   ```bash
   # .nvmrc dosyasında belirtilen Node.js sürümünü kullanın (Node.js >= 20.0.0 gereklidir)
   nvm use

   # Bağımlılıkları yükleyin (npm, pnpm veya yarn hepsi çalışır)
   npm install
   ```

   3.2 `devcontainer` kullanarak kurulum (Docker ve VSCode gerektirir)

   Depoyu VSCode'da açın ve "Reopen in Container" düğmesine tıklayın. Bu, gerekli tüm bağımlılıkları içeren bir Docker konteyneri oluşturacaktır.

   Şimdi node tabanlı bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

4. Her şeyin çalıştığından emin olmak için testleri çalıştırın:

   ```bash
   npm test
   ```

5. Projeyi derleyin:

   ```bash
   npm run build
   ```

6. Projeyi çalıştırın:

   ```bash
   npm run dev
   ```

   Bu, express sunucusunu 15500 portunda ve web arayüzünü 3000 portunda çalıştıracaktır.
   Değişiklik yaptığınızda hem API hem de arayüz otomatik olarak yeniden yüklenecektir.

   :::info

   Geliştirme deneyimi, üretimde çalışma şeklinden biraz farklıdır. Geliştirmede, web arayüzü bir Vite sunucusu kullanılarak sunulur. Diğer tüm ortamlarda, ön yüz derlenir ve Express sunucusu aracılığıyla statik bir site olarak sunulur.

   :::

Nereden başlayacağınızdan emin değilseniz, [ilk iyi sorunlarımıza](https://github.com/promptfoo/promptfoo/issues?q=state%3Aopen%20label%3Agood-first-issue%20is%3Aissue) göz atın veya rehberlik için [Discord topluluğumuza](https://discord.gg/promptfoo) katılın.

## Geliştirme İş Akışı

1. Özellik veya hata düzeltmeniz için yeni bir dal oluşturun:

   ```bash
   git checkout -b ozellik/ozellik-adiniz
   ```

2. Değişikliklerinizi yapın ve kaydedin. `main` dalına birleştirirken PR başlıkları için [Conventional Commits](https://www.conventionalcommits.org/) spesifikasyonunu takip ediyoruz. Tüm PR'ları conventional commit mesajı ile squash merge yaptığımız için bireysel commitler herhangi bir format kullanabilir.

   :::note

   Tüm pull request'ler conventional commit mesajı ile squash-merge edilir.

   :::

3. Dalınızı forkunuza gönderin:

   ```bash
   git push origin dal-adiniz
   ```

4. promptfoo deposunun `main` dalına karşı bir [pull request açın](https://github.com/promptfoo/promptfoo/compare) (PR).

Pull request açarken:

- Değişiklikleri küçük ve odaklı tutun. Yeniden düzenlemeleri yeni özelliklerle karıştırmaktan kaçının.
- Yeni kod veya hata düzeltmeleri için test kapsamı sağlayın.
- Sorunu yeniden oluşturmak veya yeni özelliği test etmek için net talimatlar sağlayın.
- Geri bildirimlere duyarlı olun ve istenirse değişiklik yapmaya hazır olun.
- Testlerinizin geçtiğinden ve kodunuzun düzgün bir şekilde lintlendiğinden ve biçimlendirildiğinden emin olun. Bunu sırasıyla `npm run lint -- --fix` ve `npm run format` komutlarını çalıştırarak yapabilirsiniz.

:::tip

Bir şeyi nasıl uygulayacağınızdan emin değilseniz, erken geri bildirim almak için taslak bir PR açmaktan çekinmeyin.

:::

Yardım istemekten çekinmeyin. Sizi desteklemek için buradayız. PR'ınızın kabul edilip edilmeyeceğinden endişeleniyorsanız, lütfen önce bizimle konuşun (bkz. [Yardım Alma](#yardım-alma)).

## Testler

### Testleri Çalıştırma

Hem Vitest hem de Jest kullanıyoruz. Test paketini çalıştırmak için:

```bash
npm test
```

İzleme modunda testleri çalıştırmak için:

```bash
npm run test:watch
```

Belirli testleri de çalıştırabilirsiniz:

```bash
# Vitest
npx vitest [kalıp]

# Jest
npx jest [kalıp]

# Örnek:
# Tüm sağlayıcı testlerini çalıştırır
npx vitest providers
```

### Test Yazma

Test yazarken lütfen:

- **Yeni test dosyaları için Vitest kullanın.** Mevcut dosyaları değiştirirken, o dosyanın kullandığı çerçeveyi kullanın.
- Uygun test izolasyonunu sağlayın:
  - Mock'ları kurmak ve temizlemek için `beforeEach` ve `afterEach` kullanın
  - Vitest için `vi.clearAllMocks()` veya `vi.restoreAllMocks()` çağırın (Jest için `jest.clearAllMocks()`)
  - Testler arasında paylaşılan durumdan kaçının
- Değişikliklerinizin kapsandığından emin olmak için kapsam raporunu kontrol edin.
- Konsola ek loglar eklememekten kaçının.

## Linting ve Biçimlendirme

JavaScript/TypeScript linting ve biçimlendirme için Biome, CSS/HTML/Markdown için Prettier kullanıyoruz. Pull request göndermeden önce lütfen şunları çalıştırın:

```bash
npm run format
npm run lint
```

Bazı linting hatalarını otomatik olarak düzeltmek için lint komutunu `npm run lint -- --fix` olarak çalıştırmak iyi bir fikirdir.

## Projeyi Derleme

Projeyi derlemek için:

```bash
npm run build
```

Geliştirme sırasında API'nin sürekli derlenmesi için:

```bash
npm run build:watch
```

## CLI'ye Katkıda Bulunma

### Geliştirme Sırasında CLI'yi Çalıştırma

Yerel `promptfoo` paketinizi global `promptfoo` komutuna bağlamak için `npm link` kullanmanızı öneririz:

```bash
npm link
promptfoo eval --config examples/provider-cloudflare/ai/chat_config.yaml
```

Alternatif olarak, yerel derlemenizi doğrudan çalıştırmak için `npm run local` kullanabilirsiniz:

```bash
npm run local -- eval --config examples/provider-cloudflare/ai/chat_config.yaml
```

**Önemli:** Bayrakların npm'e değil promptfoo'ya iletilmesi için her zaman `--` kullanın.

Yeni bir özellik üzerinde çalışırken, özelliğinizi test eden yerel bir `promptfooconfig.yaml` oluşturmanızı öneririz. Bunu özelliğiniz için uçtan uca bir test olarak düşünün.

İşte basit bir örnek:

```yaml title="promptfooconfig.yaml"
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
providers:
  - id: openai:gpt-5
prompts:
  - "{{input}}" ifadesini {{language}} diline çevir
tests:
  - vars:
      input: 'Merhaba, dünya!'
      language: 'Türkçe'
    assert:
      - type: new-assertion-type
```

## Yeni Bir Sağlayıcı Ekleme

Sağlayıcılar TypeScript'te tanımlanır. Python ve Go için de dil bağlantıları sağlıyoruz. Yeni bir sağlayıcı eklemek için:

1. Sağlayıcınızın promptfoo'da zaten mevcut olmadığından ve kapsamına uyduğundan emin olun. OpenAI uyumlu sağlayıcılar için, openai sağlayıcısını yeniden kullanarak temel URL'yi ve diğer ayarları geçersiz kılabilirsiniz. Sağlayıcınız OpenAI uyumluysa, 4. adıma geçmekten çekinmeyin.

2. Sağlayıcıyı [Özel API Sağlayıcı Dokümanlarımızı](/docs/providers/custom-api/) takip ederek `src/providers/saglaiciAdiniz.ts` dosyasında uygulayın. Lütfen yanıtları depolamak için önbelleğimizi (`src/cache.ts`) kullanın. Sağlayıcınız yeni bir bağımlılık gerektiriyorsa, lütfen onu isteğe bağlı bir bağımlılık olarak ekleyin.

3. `test/providers/saglaiciAdiniz.test.ts` dosyasında birim testleri yazın ve `examples/` dizininde bir örnek oluşturun.

4. Sağlayıcınızı `site/docs/providers/saglaiciAdiniz.md` dosyasında açıklama, kurulum talimatları, yapılandırma seçenekleri ve kullanım örnekleri dahil olmak üzere belgeleyin. `examples/` dizinine de örnekler ekleyebilirsiniz. Sağlayıcınızı diğerleriyle karşılaştıran veya benzersiz özellikleri ya da avantajları vurgulayan bir rehber yazmayı düşünün.

5. Yeni sağlayıcınızı eklemek için `src/providers/index.ts` ve `site/docs/providers/index.md` dosyalarını güncelleyin. Sağlayıcınızın ihtiyaç duyabileceği yeni ortam değişkenlerini eklemek için `src/envars.ts` dosyasını güncelleyin.

6. Tüm testlerin geçtiğinden (`npm test`) ve linting sorunlarını düzelttiğinizden (`npm run lint`) emin olun.

## Yeni Bir Doğrulama (Assertion) Ekleme

Doğrulamalar, bir LLM'nin çıktısını beklenen sonuçlarla karşılaştırmanın ve doğrulamanın farklı yollarını tanımlar. Yeni bir doğrulama eklemek için:

1. **Doğrulama Türünü Tanımlayın**:
   - `src/types/index.ts` dosyasındaki `BaseAssertionTypesSchema` enum'una yeni doğrulama türünüzü ekleyin.
   - `site/static/config-schema.json` konumundaki JSON şemasını güncellemek için `npm run jsonSchema:generate` komutunu çalıştırın

2. **Doğrulama İşleyicisini Uygulayın**:
   - Doğrulama mantığınız için `src/assertions/` dizininde yeni bir dosya oluşturun.
   - `AssertionParams` alan ve `GradingResult` döndüren bir işleyici fonksiyonu uygulayın.

   Temel işleyici yapısı:

   ```typescript
   import type { AssertionParams, GradingResult } from '../types';
   import invariant from '../util/invariant';

   export function handleYourAssertion({
     assertion,
     inverse,
     outputString,
     renderedValue,
     provider, // Doğrulamanız sağlayıcıya özgü mantık gerektiriyorsa kullanın
     test,     // Test durumu verilerine erişim
   }: AssertionParams): GradingResult {
     // Girdileri doğrulayın
     invariant(
       typeof renderedValue === 'string' || Array.isArray(renderedValue),
       '"your-assertion" doğrulaması bir string veya dizi değerine sahip olmalıdır'
     );

     // Uygulama mantığı
     const threshold = assertion.threshold ?? 0.5; // Mantıklı bir varsayılan belirleyin

     // Puanı hesaplayın
     const score = /* puanlama mantığınız */;

     // Testin geçip geçmediğini belirleyin
     const pass = (score >= threshold) !== inverse;

     return {
       pass,
       score: inverse ? 1 - score : score,
       reason: pass
         ? 'Doğrulama geçti'
         : `Doğrulamanız ${score.toFixed(2)} puan aldı, eşik değeri ${threshold}`,
       assertion,
     };
   }
   ```

3. **Doğrulama İşleyicisini Kaydedin**:
   - `src/assertions/index.ts` dosyasında işleyici fonksiyonunuzu içe aktarın ve işleyici eşlemesine ekleyin.

   ```typescript
   import { handleYourAssertion } from './yourAssertion';

   // İşleyici eşlemesinde
   'your-assertion': handleYourAssertion,
   ```

4. **Doğrulamanızı Belgeleyin**:
   - İlgili dokümantasyon dosyalarını güncelleyin:
     - Standart doğrulamalar için `site/docs/configuration/expected-outputs/deterministic.md` dosyasına ayrıntılar ekleyin
     - Doğrulamanızı `site/docs/configuration/expected-outputs/index.md` dosyasındaki referans tablosuna ekleyin

   - Model değerlendirmeli doğrulamalar için:
     - `site/docs/configuration/expected-outputs/model-graded/index.md` dosyasındaki listeye bir giriş ekleyin
     - `site/docs/configuration/expected-outputs/model-graded/your-assertion.md` adresinde özel bir dokümantasyon sayfası oluşturun

5. **Testler Yazın**:
   - `test/assertions/yourAssertion.test.ts` dosyasında bir test dosyası oluşturun.
   - Aşağıdakileri içeren test senaryoları:
     - Standart kullanım durumları
     - Uç durumlar ve hata işleme
     - Sağlayıcıya özgü davranış (varsa)
     - Şema doğrulama (varsa)
     - Geriye dönük uyumluluk (mevcut doğrulamaları yeniden düzenliyorsanız)

## Web Arayüzüne Katkıda Bulunma

Web arayüzü bir React uygulaması olarak yazılmıştır. Statik bir site olarak dışa aktarılır ve paketlendiğinde yerel bir express sunucusu tarafından barındırılır.

Web arayüzünü geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Bu, web arayüzünü http://localhost:3000 adresinde barındıracaktır. Bu, React uygulaması üzerinde hızlı bir şekilde çalışmanıza olanak tanır (hızlı yenileme ile). Web arayüzünü express sunucusu olmadan çalıştırmak istiyorsanız, şunu çalıştırabilirsiniz:

```bash
npm run dev:app
```

Her şeyi uçtan uca test etmek için projeyi derleyin ve çalıştırın:

```bash
npm run build
promptfoo view
# Veya: npm run dev
```

:::note

Kodda başka değişiklikler yaparsanız web arayüzünü güncellemez. Tekrar `npm run build` komutunu çalıştırmanız gerekir.

:::

## Python Katkıları

promptfoo öncelikle TypeScript ile yazılmış olsa da, özel Python promptları, sağlayıcılar, doğrulamalar ve Python'da birçok örneği destekliyoruz. Python kod tabanımızı harici bağımlılıklar olmadan basit ve minimal tutmaya çalışıyoruz. Lütfen bu yönergelere uyun:

- Python 3.9 veya üzeri kullanın
- Linting ve biçimlendirme için `ruff` kullanın. Değişiklikleri göndermeden önce `ruff check --fix` ve `ruff format` komutlarını çalıştırın
- [Google Python Stil Rehberi](https://google.github.io/styleguide/pyguide.html)'ni takip edin
- Kod okunabilirliğini artırmak ve olası hataları yakalamak için tür ipuçları kullanın
- Yeni Python fonksiyonları için yerleşik `unittest` modülünü kullanarak birim testleri yazın
- Bir örneğe yeni Python bağımlılıkları eklerken, ilgili `requirements.txt` dosyasını güncelleyin

## Dokümantasyon

Yeni özellikler ekliyorsanız veya mevcut olanları değiştiriyorsanız, lütfen ilgili dokümantasyonu güncelleyin. Dokümantasyonumuz için [Docusaurus](https://docusaurus.io/) kullanıyoruz. Örnekleri ve rehberleri de güçlü bir şekilde teşvik ediyoruz.

### Dokümantasyon Standartları

Dokümantasyonumuz erişilebilirliği sağlamak için çeşitli standartları takip eder:

- **İnsan tarafından okunabilir**: Temiz, iyi yapılandırılmış markdown ve net gezinme
- **LLM dostu**: Yapay zeka araç entegrasyonu için otomatik [LLMs.txt dosyaları](https://llmstxt.org) oluşturma
- **Aranabilir**: Uygun başlıklar, etiketler ve çapraz referanslar
- **Örnek odaklı**: Gerçek dünya örnekleri ve kullanım durumları

### Geliştirme İş Akışı

Dokümantasyonu geliştirme modunda çalıştırmak için:

```bash
cd site
npm start
```

Bu, Docusaurus geliştirme sunucusunu varsayılan olarak 3100 portunda başlatacaktır (veya `PORT` ortam değişkenini ayarlarsanız özel bir portta). Daha sonra dokümantasyonu http://localhost:3100 adresinde görüntüleyebilirsiniz.

Dokümantasyonu üretim için derlemek üzere:

```bash
cd site
npm run build
```

Bu, herhangi bir statik içerik barındırma hizmeti kullanılarak sunulabilecek `build` dizininde statik içerik oluşturacaktır. Dokümantasyonu derlemek, `npm start` çalıştırılırken ortaya çıkmayan hataları bazen yakalar.

## İleri Konular

### Veritabanı

Promptfoo, Drizzle ORM aracılığıyla yönetilen varsayılan veritabanı olarak SQLite kullanır. Varsayılan olarak veritabanı `~/.promptfoo/` dizininde depolanır. `PROMPTFOO_CONFIG_DIR` ayarlayarak bu konumu geçersiz kılabilirsiniz. Veritabanı şeması `src/database/schema.ts` dosyasında tanımlanmıştır ve migration'lar `drizzle/` dizininde depolanır. Migration'ların hepsinin oluşturulmuş olduğunu ve bu dosyalara doğrudan erişmemeniz gerektiğini unutmayın.

#### Ana Tablolar

- `evals`: Sonuçlar ve yapılandırma dahil değerlendirme ayrıntılarını depolar.
- `prompts`: Farklı promptlar hakkında bilgileri depolar.
- `datasets`: Veri seti bilgilerini ve test yapılandırmalarını depolar.
- `evalsToPrompts`: Değerlendirmeler ve promptlar arasındaki ilişkiyi yönetir.
- `evalsToDatasets`: Değerlendirmeler ve veri setleri arasındaki ilişkiyi yönetir.

Bu tabloların her birinin içeriğini, bir web sunucusu başlatacak olan `npx drizzle-kit studio` komutunu çalıştırarak görüntüleyebilirsiniz.

#### Migration Ekleme

1. **Şemayı Değiştirin**: `src/database/schema.ts` dosyasında şemanızda değişiklikler yapın.
2. **Migration Oluşturun**: Yeni bir migration oluşturmak için komutu çalıştırın:

   ```bash
   npm run db:generate
   ```

   Bu komut, `drizzle/` dizininde yeni bir SQL dosyası oluşturacaktır.

3. **Migration'ı İnceleyin**: Oluşturulan migration dosyasını, amaçladığınız değişiklikleri yakaladığından emin olmak için inceleyin.
4. **Migration'ı Uygulayın**: Migration'ı şu komutla uygulayın:

   ```bash
   npm run db:migrate
   ```

### Sürüm Yayınlama Süreci

Bu proje otomatik sürümler için [release-please](https://github.com/googleapis/release-please) kullanır:

1. Conventional commit mesajları ile PR'ları main dalına birleştirin
2. release-please, changelog girişleri, sürüm güncellemeleri ve güncellenmiş `package.json` ile bir sürüm PR'ı oluşturur/günceller
3. Birleştirildiğinde, bir GitHub sürümü oluşturulur ve npm paketi yayınlanır

Acil sürümler için [Discord](https://discord.gg/promptfoo) üzerinden bakıcılarla iletişime geçin.

## Yapay Zeka Destekli Katkılar

Yapay zeka destekli geliştirmeyi memnuniyetle karşılıyoruz. Daha iyi iş çıkarmanıza yardımcı olan her aracı kullanın.

Katkıları nasıl üretildiklerine göre değerlendirmiyoruz. Sonucun kalitesine göre değerlendiriyoruz. Her karakteri kendiniz yazmış olsanız da Copilot, Cursor, Claude Code veya başka herhangi bir araç kullanmış olsanız da aynı standartlar geçerlidir.

:::tip Değişikliğin sorumluluğu sizindir

Bir pull request açarsanız, gönderdiğiniz şeyden siz sorumlusunuz. Yapay zeka daha hızlı kod yazmanıza yardımcı olabilir, ancak doğruluk, güvenlik veya sürdürülebilirlik konusunda sorumluluk alamaz. Bu sizde kalır.

:::

### Değişikliğin çalıştığını kanıtlayın

Bir pull request, inceleyicinin kodu yerel olarak çalıştırarak doğruluğu doğrulayabilmesi için net talimatlar içermelidir. İnceleyicilerin değişikliğinizi nasıl test edeceklerini tersine mühendislik yapmasına neden olmayın.

**Dahil edilmesi gerekenler:**

- Ne değişti ve neden (birkaç cümle yeterli)
- Değişikliği yeniden oluşturmak veya doğrulamak için adımlar (komutlar, yapılandırma dosyaları, beklenen çıktı)
- Değerlendirdiğiniz ödünleşimler veya uç durumlar

Değişikliğin gösterilmesi zorsa, somut bir şey ekleyin: minimal bir yeniden üretim, bir log çıktısı, bir ekran görüntüsü veya kısa bir kayıt.

### Farkı açıklayabilin

Her karakteri yazmış olmanız gerekmez. Ancak değişiklikleriniz hakkındaki inceleyici sorularını yanıtlayabilmeniz gerekir:

- Bu neden bu şekilde uygulandı?
- Hangi alternatifleri değerlendirdiniz?
- Ne test ettiniz?
- Ne bozulabilir?

PR'ınızın önemsiz olmayan bir bölümünü açıklayamıyorsanız, açıklayabilene kadar revize edin.

### Varsayımsal platform desteği yok

Gerçekten çalıştıramadığınız veya test edemediğiniz ortamlar için değişiklikler göndermeyin. Erişiminiz olmayan bir platform için destek eklemek istiyorsanız, neye ihtiyacınız olduğunu ve bugün neyi doğrulayabileceğinizi açıklayan bir sorun veya tartışma açın.

### Ajan rehber dosyalarını güncel tutun

Bu depo, yapay zeka kodlama asistanlarına bağlam sağlamak için `AGENTS.md` dosyalarını kullanır. Değişiklikleriniz, ajanların belirli bir alanda nasıl çalışması gerektiğini etkiliyorsa (yeni kalıplar, kurallar veya tuzaklar), mevcut kalıpları takip ederek ilgili `AGENTS.md` dosyasını güncelleyin. Dizin yapısı ve kurallar için kök `AGENTS.md` dosyasına bakın.

### Açıklama

Yapay zeka kullanımının açıklanması isteğe bağlıdır. Yapay zeka kullanıp kullanmadığınızı tahmin etmeye çalışmayacağız.

Bununla birlikte, bir bakıcı süreciniz hakkında sorarsa, lütfen samimi bir şekilde yanıtlayın. Bir ajan değişikliğin büyük bir bölümünü ürettiyse, çıktıyı nasıl doğruladığınızı açıklayan kısa bir not, inceleyicilere yardımcı olabilir ve süreci hızlandırabilir.

## Değişiklik Günlüğü

**`CHANGELOG.md` dosyasını manuel olarak düzenlemeyin.** release-please, conventional commit mesajlarından girişler oluşturur.

PR başlıkları için [Conventional Commits](https://www.conventionalcommits.org/) biçimini kullanın (squash-merge commit mesajları olurlar).

## Yardım Alma

Yardıma ihtiyacınız varsa veya sorularınız varsa:

- GitHub'da bir sorun açın.
- [Discord topluluğumuza](https://discord.gg/promptfoo) katılın.

## Davranış Kuralları

[Contributor Covenant Davranış Kuralları](https://www.contributor-covenant.org/)'nı takip ediyoruz. Topluluğumuz içindeki tüm etkileşimlerinizde lütfen bunu okuyun ve buna uyun.
