---
sidebar_label: Langfuse
description: LLM testleri için Langfuse promptlarını Promptfoo ile entegre edin. Ortam değişkenleri ve SDK kurulumunu kullanarak sürüm kontrolü, etiketler ve iş birliğine dayalı prompt yönetimini yapılandırın.
---

# Langfuse Entegrasyonu

[Langfuse](https://langfuse.com), iş birliğine dayalı prompt yönetimi, izleme (tracing) ve değerlendirme yeteneklerini içeren açık kaynaklı bir LLM mühendislik platformudur.

## Kurulum

1. Langfuse SDK'sını kurun:

   ```bash
   npm install langfuse
   ```

2. Gerekli ortam değişkenlerini ayarlayın:
   ```bash
   export LANGFUSE_PUBLIC_KEY="your-public-key"
   export LANGFUSE_SECRET_KEY="your-secret-key"
   export LANGFUSE_HOST="https://cloud.langfuse.com"  # veya kendi barındırdığınız URL
   ```

## Langfuse Promptlarını Kullanma

Langfuse'da yönetilen promptlara atıfta bulunmak için promptfoo yapılandırmanızda `langfuse://` ön ekini kullanın.

### Prompt Formatları

Promptlara iki farklı sözdizimi kullanarak sürüm veya etiket bazlı atıfta bulunabilirsiniz:

#### 1. Açık @ sözdizimi (netlik için önerilir)

```yaml
# Etikete göre
langfuse://prompt-name@label:type

# Örnekler
langfuse://my-prompt@production        # "production" etiketli metin (text) promptu
langfuse://chat-prompt@staging:chat    # "staging" etiketli sohbet (chat) promptu
```

#### 2. : sözdizimi ile otomatik algılama

```yaml
# Sürüme veya etikete göre (otomatik algılanır)
langfuse://prompt-name:version-or-label:type
```

Ayrıştırıcı şunları otomatik olarak algılar:

- **Sayısal değerler** → sürüm olarak değerlendirilir (örneğin, `1`, `2`, `3`)
- **Dize değerleri** → etiket olarak değerlendirilir (örneğin, `production`, `staging`, `latest`)

Açıklamalar:

- `prompt-name`: Langfuse'daki promptunuzun adı
- `version`: Belirli sürüm numarası (örneğin, `1`, `2`, `3`)
- `label`: Bir prompt sürümüne atanan etiket (örneğin, `production`, `staging`, `latest`)
- `type`: `text` veya `chat` (belirtilmezse varsayılan olarak `text` kullanılır)

### Örnekler

```yaml
prompts:
  # Etiketler için açık @ sözdizimi (önerilir)
  - 'langfuse://my-prompt@production' # Production etiketi, metin promptu
  - 'langfuse://chat-prompt@staging:chat' # Staging etiketi, sohbet promptu
  - 'langfuse://my-prompt@latest:text' # Latest etiketi, metin promptu

  # : sözdizimi ile otomatik algılama
  - 'langfuse://my-prompt:production' # Dize → etiket olarak değerlendirilir
  - 'langfuse://chat-prompt:staging:chat' # Dize → etiket olarak değerlendirilir
  - 'langfuse://my-prompt:latest' # "latest" → etiket olarak değerlendirilir

  # Sürüm atıfları (yalnızca sayısal değerler)
  - 'langfuse://my-prompt:3:text' # Sayısal → sürüm 3
  - 'langfuse://chat-prompt:2:chat' # Sayısal → sürüm 2

providers:
  - openai:gpt-5-mini

tests:
  - vars:
      user_query: 'Fransa'nın başkenti neresidir?'
      context: 'Avrupa coğrafyası'
```

### Değişken Değişimi

promptfoo test vakalarınızdaki değişkenler otomatik olarak Langfuse promptlarına aktarılır. Eğer Langfuse promptunuz `{{user_query}}` veya `{{context}}` gibi değişkenler içeriyorsa, bunlar test vakalarınızdaki karşılık gelen değerlerle değiştirilecektir.

### Etiket Tabanlı Dağıtım

Üretim senaryoları için etiket kullanılması önerilir, çünkü şunları yapmanıza olanak tanır:

- promptfoo yapılandırmanızı değiştirmeden yeni prompt sürümlerini dağıtmak
- Farklı ortamlar (üretim, hazırlık, geliştirme) için farklı promptlar kullanmak
- Farklı prompt sürümlerini A/B testine tabi tutmak
- Langfuse'da önceki sürümlere hızlıca geri dönmek

Yaygın etiket desenleri:

- `production` - Mevcut üretim sürümü
- `staging` - Üretim öncesi test
- `latest` - En son oluşturulan sürüm
- `experiment-a`, `experiment-b` - A/B testi
- `tenant-xyz` - Çok kiracılı (multi-tenant) senaryolar

### En İyi Uygulamalar

1. Yapılandırmanızda sürüm numaralarını kodlamaktan kaçınmak için üretim dağıtımlarında sürüm numaraları yerine **etiketleri kullanın**.
2. Amacını açıkça belirten **açıklayıcı prompt adları kullanın**.
3. Promptları üretime almadan önce **hazırlık (staging) ortamında test edin**.
4. Promptlar Langfuse'da yönetilse bile **promptfoo yapılandırmalarınızı sürüm kontrol sisteminde (Git vb.) tutun**.

### Sınırlamalar

- `@` sembolü içeren prompt kimlikleri desteklense de, netlik açısından bunlardan kaçınmanızı öneririz. Ayrıştırıcı, prompt kimliği ile etiketi birbirinden ayırmak için bir etiket deseni tarafından takip edilen son `@` sembolüne bakar.
- Etiket adlarınızda `@` kullanmanız gerekiyorsa, farklı bir adlandırma kuralı kullanmayı düşünün.
