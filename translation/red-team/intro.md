---
sidebar_position: 1
sidebar_label: Giriş
title: LLM kırmızı takım kılavuzu (Açık Kaynak)
description: Üretim dağıtımından önce içerik politika ihlallari, bilgi sızıntıları ve API kötüye kullanımını yakalamak için sistematik çekişmeli testler aracılığıyla LLM kırmızı takım sistemleri 
---

# LLM red-teaming

LLM red teaming, simüle edilmiş çekişmeli girdileri kullanarak sistemler uygulanmadan önce yapayzeka sistemlerindeki güvenlik açıklarını bulmanın bir yoludur. 

Günümüzde LLM mimarilerinde birden fazla güvenlik sorunu bulunmaktadır. Sistem tasarımınıza bağlı olarak, örneğin RAG, LLM ajanı yada sohbet robotu, farklı türlerde güvenlik açıklarıyla karşılaşacaksınız.

Hemen hemen her LLM uygulamasında, iş politikalarını veya diğer yönergeleri ihlal eden, konu dışı, uygunsuz veya zararlı içerik üretme potansiyel sorunları vardır. Mimari daha karmaşık hale geldikçe, bilgi sızıntısı ve erişim kontrolü(RAG mimarileri),bağlantılı API'lerin veya veri tabanlarının (ajanlarda) ve dahası gibi sorunlar ortaya çıkabilir.  

Bu tür güvenlik açıklarını üretime geçmeden önce tespit edebilmek için, çok çeşitli çekişmeli girdiler üretmemiz ve LLM'nin yanıtlarını değerlendirmemiz gerekiyor.

LLM uygulamasını sistematik olarak inceleyerek, kötüye kullnım riskinin oranını belirten  ve azaltma önerileri sunan bir rapor hazırlayabiliriz.

:::Öneri
Kırmızı Takımı yönetmeye hazır mısın ? Gitmek için tıkla **[Quickstart](/docs/red-team/quickstart/)**.
:::

<div style={{ maxWidth: 760, margin: '0 auto' }}>
  ![llm red team report](/img/riskreport-1@2x.png)
</div>

## LLM red-teaming niçin önemlidir?

Red-teaming diğer yapay zeka güvenlik yaklaşımlarından farklıdır, çünkü o devreye alınmadan önce riskin niceliksel bir ölçümünü sağlar.

Geliştiriciler, binlerce test çalıştırarak ve yapay zekanın performansını değerlendirerek, çevrim dışı test ortamlarında kabul edilebilir risk seviyeleri hakkında kararlar verebilirler. Birçok kuruluş bunu geliştirme döngüsü ve CI/CD gibi süreçlere entegre eder. 

Bu süreç OpenAI, Anthropic, Microsoft, ve Google gibi büyük kuruluş laboratuvarlarının modellerini halka sunmadan önce değerlendirme yöntemidir.Bir süre boyunca, AI red-teaming ekipleri bu seçkin laboratuvarlarıyla sınırlıydı. Şimdi AI red-teaming araçlar çoğaldıkça ve en iyi uygulamalar ortaya çıktıkça daha yaygın hale geliyor.

Bu yeni bir alan ve standartlar dünya çapında ortaya çıkmaktadır, [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/) 'dan [NIST's AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) kadar değişen ve [EU AI Act](https://www.europarl.europa.eu/topics/en/article/20230601STO93804/eu-ai-act-first-regulation-on-artificial-intelligence).

Şimdiye kadar gördüklerimize göre, çoğu düzenleme ve standartlar yayınlamadan önce testler yoluyla riski ölçensistematik bir kıyasalama/red-teaming sürecini destekliyor.

## LLM red-teaming nasıl işliyor

LLM'lerin red-teaming tarafından incelenmesi süreci, geniş kapsamlı bir değerlendirme için genellikle bir miktar otomasyon gerektirir. Bunun nedeni, LLM'lerin çok geniş bir saldırı yüzeyine sahip olması ve doğaları gereği stokastik olmalarıdır (yani, onlar bir nesilden diğerine tutarlı değiller).

Sistematik bir yaklaşım şu şekildedir:

1. **Çekişkili Girişler Oluşturma**: Potansiyel güvenlik açıklarını hedefleyen çeşitli kötü amaçlı niyetler oluşturun veya derleyin.Her bir niyet için, hedefi istismar etmeye çalışan bir komut istemi ekleyin. Bu adımda komut istemi enjeksiyonu ve jailbreak gibi yöntemleri dahil edebilirsiniz.

2. **Yanıtları Değerlendirin**: Bu girdileri modelin davranışını gözlemlemek için  LLM uygulamanızdan geçirin. Bu adım otomasyon için mükemmel bir adaydır.

3. **Güvenlik Açıklarını Analiz Edin**: LLM'nin çıktılarını deterministik ve model dereceli ölçütler kullanarak otomatik olarak değerlendirin ve zayıf noktaları veya istenmeyen davranışları belirlemek için yanıtları inceleyin.

Bir süreç oluşturulduktan sonra, iki temel şekilde uygulanabilir: 

- **Tek seferlik çalıştırmalar**: Güvenlik açıklarını ve önerilen önlemleri incelemenizi sağlayan kapsamlı bir rapor oluşturun.
- **CI/CD Entegrasyonu**: Uygulamanız geliştikçe sürekli güvenliği sağlamak için dağıtım hattınızdaki güvenlik açıklarını sürekli olarak izleyin.

Yapay zekâ riskini yönetmek için sihirli an genellikle bir kuruluşun yapay zekâ riskinin sürekli ölçümünü sağlayacak bir mekanizma kurabilmesinden sonra gelir: bu mekanizma CI/CD , iç gereksinimler yada planlanmış çalışmaların başka bir biçimi olabilir.

<div style={{ maxWidth: 760, margin: '0 auto' }}>
  ![llm security continuous monitoring](/img/continuous-monitoring.png)
</div>

## Model ve uygulama katmanı tehditleri

Genel olarak, tehditler iki ana kategoriye ayrılır: model ("temel") veya uygulama katmanı. Bazı çakışmalar olsa da, red-teaming hangi tarafı test etmek istediğinizi açıkça belirtmek faydalı olacaktır.

OpenAI veya Anthropic gibi araştırma laboratuvarları yeni bir model eğittiklerinde, güvenlik ve araştırma amaçları için sohbet odaklı modeli dahili (ve harici) test uzmanlarına stres testinden geçirirler. Model katmanı güvenlik açıkları şunları içerebilir:

- Hızlı enjeksiyonlar ve hapishaneden kaçışlar
- Nefret söylemi, önyargı, zehirlilik ve diğer zararlı sonuçlar
- Halüsinasyonlar
- Telif hakkı ihlalleri
- Uzman tavsiyeler (tıbbi, finansal)
- Aşırı özerklik sergileyen veya aşırı güveni istismar eden sonuçlar
- Kişisel bilgilerin sızdırılması (eğitim verilerinden)

Öte yandan, modeli daha büyük bir uygulama ortamına bağladıktan sonra ortaya çıkan güvenlik açığı sınıfları da vardır. Bunlar şunları içerir:

- Dolaylı komut istemi enjeksiyonları
- Kişisel verilerin sızdırılması (bağlamdan, örneğin RAG mimarilerinde)
- Araç tabanlı güvenlik açıkları (örneğin yetkisiz veri erişimi, ayrıcalık yükseltmeleri, SQL enjeksiyonları - API ve veritabanı erişimine bağlı olarak)
- Konu dışı kullanım (yani konu dışı kullanım)
- Veri/sohbet sızdırma teknikleri (örneğin markdown resimleri, bağlantı açma)

Çoğu uygulama, kendi özel modellerine ihtiyaç duymak yerine mevcut modelleri entegre eder. Bu nedenle, uygulama katmanı tehditleri, LLM tabanlı yazılımlar için red-teaming'in odak noktasıdır, çünkü en büyük teknik risklere neden olma olasılıkları yüksektir.

## Beyaz kuru ve kara kutu testi

LLM'lerin beyaz kutu testi, modelin mimarisine, eğitim verilerine ve iç ağırlıklarına tam erişime sahip olmayı içerir. Bu, [açgözlü koordinat inişi](https://github.com/llm-attacks/llm-attacks) and [AutoDAN](https://arxiv.org/abs/2310.04451).  gibi son derece etkili saldırı algoritmalarını mümkün kılar.

Bu beyaz kutu saldırılarının dezavantajı, yavaş olma eğiliminde olmaları ve modelin belirli özelliklerine uyarlanmış olmalarıdır. Ek olarak, çoğu geliştirici, ağırlıkları aracılığıyla açığa çıkarılan modellerle çalışmadığından, bu yaklaşım çoğu kullanım durumu için pratik değildir.

Öte yandan, kara kutu testi, LLM'yi yalnızca girdilerin ve çıktıların gözlemlenebildiği kapalı bir sistem olarak ele alır. Bu yaklaşım, saldırganların içeriden bilgiye sahip olmadığı gerçek dünya senaryolarını simüle eder.

Her iki yöntemin de red-teaming için avantajları vardır:

Beyaz kutu testi, daha derin, yapısal güvenlik açıklarını ortaya çıkarabilir.

Kara kutu testi, gerçek dünya saldırı senaryolarını daha iyi temsil eder ve beklenmedik davranışları ortaya çıkarabilir.

Çoğu geliştiriciler ve uygulama güvenliği ekipleri için kara kutu testi daha pratik bir yaklaşımdır, çünkü çoğu durumda test uzmanlarının modelin iç yapısına erişimi yoktur. Kara kutu yaklaşımı, RAG'ler ve ajanlarla ilişkili gerçek dünya altyapısını daha kolay bir şekilde entegre eder.



<div style={{ maxWidth: 760, margin: '0 auto' }}>
  ![llm testing: white-box vs black-box](/img/docs/llm-testing-diagram.svg)
</div>

## Genel Tehditler

Yapay zeka uygulamalarının karşılaştığı tehdit sayısı oldukça fazla olabilir çünkü yapay zeka uygulamaları, tanımları gereği, öngörülemeyen sonuçlar veren üretken özellikler sunar. Theory'de Girişim Sermayecisi olan Tomasz Tunguz'un belirttiği gibi,  [written](https://www.linkedin.com/posts/tomasztunguz_product-managers-designers-working-with-activity-7183149701674807296-4fAn/), "Yapay zeka ile kurallar değişti. Belirsiz makine öğrenimi modelleri belirsizlik ve kaotik davranış getiriyor."

Bu deterministik olmayan davranışın ürün tarafında etkileri vardır,ancak aynı zamanda daha paranoyak olanlarımız için de etkileri vardır.

### Gizlilik İhlalleri

Açıkça belirtmek gerekirse: Genel amaçlı yapay zeka uygulamaları, tanım gereği, büyük veri kaynaklarına bağımlıdır ve bu veri kaynaklarına erişim sağlayabilecek rakipler, uygulamaların arkasındaki şirketler için büyük tehditler oluşturacaktır.

Kullanıcı gizliliği doğrudan ihlal edilmese bile, yapay zeka uygulamalarına sahip şirketler, kullandıkları eğitim verilerinin dışarıdan kişiler tarafından bilinmesini muhtemelen istemezler. Ancak,  [2022 paper](https://arxiv.org/pdf/2202.03286) 2022'de yayınlanan bir makalede, araştırmacılar, rakip bir LLM kullanarak başka bir LLM'nin eğitim verilerini ortaya çıkarmanın nispeten kolay olduğunu bulmuşlardır (bu durum yalnızca temel modeller ve ince ayarlar için geçerli olsa da, ek verilerle birlikte bağlam içinde yer alan RAG'ler için de önemlidir).

<div style={{ maxWidth: 250, margin: '0 auto' }}>
  ![Training data leakage](/img/docs/training-data-leakage.png)
</div>

Ancak aynı makale, benzer yöntemlerle gizlilik ihlallerinin çok daha doğrudan olabileceğini gösteriyor; bu ihlaller, bir LLM'nin paylaşmaması gereken telefon numaralarını paylaşmasından, bireysel e-posta adreslerini paylaşmaya kadar uzanabilir.
<div style={{ maxWidth: 600, margin: '0 auto' }}>
  ![Training data leakage 2](/img/docs/training-data-leakage2.png)
</div>

Kişisel olarak tanımlanabilir bilgilerin (PII) sızdırılması başlı başına kötü bir durumdur, ancak rakipler bu PII'ye sahip olduktan sonra, çalınan kimlikleri kullanarak şirketlerin iç kaynaklarına yetkisiz erişim sağlayabilir; kaynakları çalabilir, şirkete şantaj yapabilir veya kötü amaçlı yazılım yerleştirebilirler.

Yapay zekâ uygulamalarının en iyi kullanım alanlarının çoğu, genel amaçlı modelleri belirli veri kaynakları üzerinde ince ayar yaparak özel bağlamlara uyarlamayı içerir. Şirketler özel veri kaynaklarını savunmasız yapay zekâ uygulamalarına bağlamaktan rahatsızlık duyarlarsa, bu kullanım alanının tamamı ortadan kalkabilir.

### Prompt Enjeksiyonları

LLM'ler, birçok güvenlik ekibine tanıdık gelebilecek ancak yeni riskler ve bunlarla başa çıkmak için yeni stratejiler sunan yepyeni bir dizi güvenlik açığı ortaya koyuyor.

Prompt enjeksiyonları,SQL enjeksiyonlarına benzerler ancak farklı şekillerde ortaya çıkarlar. Prompt injections  güvenilmeyen kullanıcı girdilerini güvenilir bir geliştirici tarafından oluşturulan güvenilir istemlerle birleştiren bir saldırı türüdür. (Önemli olan, bu sonraki bölümde ele alınacaktır[jailbreaking'den farklı](https://simonwillison.net/2024/Mar/5/prompt-injection-jailbreaking/)).

2023 [Black Hat sunumunda](https://i.blackhat.com/BH-US-23/Presentations/US-23-Greshake-Compromising-LLMS.pdf), güvenlik araştırmacıları, gerçek dünyada çalışan çok sayıda promt enjeksiyon örneğini inceledi. Araştırmacılar prompt enjeksiyonun birtanesiyle bir LLM'yi ele geçirdiler, kullanıcıyı adlarını açıklamaya ikna ettiler, ve kullanıcının kötü amaçlı yazılım içeren bir web sitesine yönlendiren bir bağlantıya tıklamasını sağladılar.

<div style={{ maxWidth: 650, margin: '0 auto' }}>
  <img src="/img/docs/prompt-injection-example.png" />
</div>

Elbette, araştırmacılar prompt enjeksiyonlarını daha geleneksel SQL ve shell enjeksiyonlarına benzetseler de, yapay zeka tabanlı SQL ve shell enjeksiyonları da hala mümkündür.

[2023 yayınında](https://arxiv.org/abs/2308.01990), başka bir araştırma ekibi, prompt-to-SQL enjeksiyonlarının çok etkili olabileceğini gösterdi. Makalede, bu ekip 7 LLM modelini değerlendirdi ve "P2SQL saldırılarının dil modelleri genelinde yaygınlığını" gösterdi.

Kabuk enjeksiyonlartı da benzer şekilde çalışır. Red-teaming testlerinden geçmemiş  AI uygulamaları, yetkisiz kabuk komutlarını çalıştıran saldırılara karşı sıklıkla savunmasızdır.

### Jailbreaking

Jailbreaking refers to attacks that intentionally subvert the foundational safety filters and guardrails built into the LLMs supporting AI apps. These attacks aim to make the model depart from its core constraints and behavioral limitations.

Even the newest, least technical ChatGPT user becomes an adversary in at least one sense when they eventually think: "How can I make this thing ignore its rules?"

Jailbreaking can be surprisingly simple—sometimes as easy as copying and pasting a carefully crafted prompt to make a Gen AI app do things it's fundamentally not supposed to do.

For example, Chris Bakke, founder of Interviewed, convinced a Chevrolet dealer's ChatGPT-powered customer service app to sell him a 2024 Chevy Tahoe for $1 with a simple prompt that [gave the bot a new objective](https://x.com/ChrisJBakke/status/1736533308849443121).

<div style={{ maxWidth: 400, margin: '0 auto' }}>
  ![Chevy chatbot conversation 1](/img/docs/chevy1.png) ![Chevy chatbot conversation
  2](/img/docs/chevy2.png)
</div>

The example is funny, but this situation demonstrates a much deeper issue: the ability to override the model's core constraints.

Research shows that automated methods can go much deeper and present much worse risks. In a [2023 paper](https://arxiv.org/abs/2312.02119), researchers found that a Tree of Attacks with Pruning (TAP) method, which involves iteratively refining prompts using tree-of-thought reasoning, can successfully jailbreak targets without requiring impractical brute force.

"In empirical evaluations," the researchers write, "We observe that TAP generates prompts that jailbreak state-of-the-art LLMs (including GPT4 and GPT4-Turbo) for more than 80% of the prompts using only a small number of queries."

In a [different paper](https://arxiv.org/abs/2307.15043), other researchers demonstrate a similar vulnerability by finding and adding suffixes to queries that make it more likely LLMs will respond to requests for objectionable content, bypassing their built-in ethical constraints.

And it's not just about wording inputs differently. In a [2024 paper](https://arxiv.org/pdf/2402.11753), researchers showed that ASCII art could successfully get around AI guardrails, demonstrating yet another method to subvert foundational safety measures.

<div style={{ maxWidth: 650, margin: '0 auto' }}>
  ![ASCII art prompt injection](/img/docs/artprompt.png)
</div>

### Generation of Unwanted Content

Separate from jailbreaking, AI apps can sometimes generate unwanted or unsavory content simply due to the broad knowledge base of the foundation model, which may not be limited to the specific use case of the app.

When AI apps generate such content, it can seem like a relatively small problem when isolated – similar to blaming Google for your searches. But at scale, in terms of access to the content and distribution of the content, more severe risks start to emerge.

Content promoting criminal activities, for example, can make the AI app that generated the content (and the company behind it) look bad. Google might point the way to crime-related information that someone posted, but the issue is much worse when your company gives criminals step-by-step instructions.

Similarly, misinformation can feel small on one level and cataclysmic on another. At a big enough scale, users relying on a hallucinating AI app could amount to mass delusion. But the steps in between are dangerous, too, ranging from merely incorrect information (that makes the company look foolish) to misleading, unsafe information (that could really hurt users).

<div style={{ maxWidth: 650, margin: '0 auto' }}>
  ![Eating glue pizza](/img/docs/eating-glue.png)
</div>

AI developers work to ensure these kinds of results don't emerge, but it's always a tight race between implementing safeguards and the model's vast knowledge base potentially producing undesired outputs.

And yes, someone did actually [eat the glue pizza](https://www.businessinsider.com/google-ai-glue-pizza-i-tried-it-2024-5).

## Best practices

Based on our experience as practitioners deploying LLMs, we recommend the following best practices for effective red teaming:

### Step 1: Define your strategy

Before running a red team, define a systematic process that encompasses:

1. **Vulnerability focus**: Identify which types of vulnerabilities are most critical for your application. This will depend on your use case (e.g., [RAG](/docs/red-team/rag/), [agents](/docs/red-team/agents/), chatbots) and industry.

2. **Timing in development cycle**: Decide where in your process red teaming will occur. Checkpoints to consider include:
   - **Model testing**, which can happen even before you start building the application, and is especially important when fine tuning.
   - **Pre-deployment testing**, once the model has been hooked up to the application, tools, databases, etc.
   - **Continuous integration/deployment (CI/CD) checks** to catch regressions and anomalies.
   - **Post-deployment monitoring** to establish a feedback loop and maintain an understanding of how your application is behaving in production.

3. **Resource allocation**: Balance the depth of testing with available time and resources. Certain automated attack strategies consume a large number of tokens, and a single red team can range anywhere from a few cents to hundreds of dollars!

4. **Regulatory compliance**: Consider any industry-specific or regional requirements (e.g., GDPR, HIPAA) as well as standards (e.g. NIST AI RMF, OWASP LLM).

### Step 2: Implementation

Once you've defined your objectives, your process will probably look like this:

1. **Generate diverse adversarial inputs**:
   - Create a wide range of inputs targeting your identified vulnerability types.
   - Automated generation tools are a huge help, especially to cover a breadth of use cases. But human ingenuity is still useful, especially for known problem areas.

2. **Set up evaluation framework**:
   - Choose or develop a tool for systematic LLM testing.
   - Integrate with your development pipeline if applicable.

3. **Execute tests**:
   - Run your adversarial inputs through your LLM application.
   - Ensure you're testing in an environment that closely mimics production. It's best to test end-to-end - so you can stress-test full tool access and/or guardrails.

4. **Collect and organize results**:
   - Store outputs in a structured format that can be subsequently analyzed. Most evaluation frameworks will do this for you.

### Step 3: Analysis and remediation

1. **Review flagged outputs**:
   - Set a regular cadence for reviewing test results. This could involve both the security and development teams in the review process.

2. **Prioritize vulnerabilities**:
   - Not all issues are created equal. There's a fuzzy line between AI security and AI safety issues, and as alluded to above, some fall on the model side versus the application side.
   - Most teams we talk to find it most productive to focus on technical security vulnerabilities, as the foundation model problems are improving over time as AI research advances and tend to have smaller impact.

3. **Develop mitigation strategies**:
   - For each priority vulnerability, brainstorm potential fixes.
   - This might include prompt engineering, additional safeguards, or architectural changes.

4. **Implement and verify fixes**:
   - Apply chosen mitigations and re-run the evaluation suite to confirm the effectiveness of your solutions.

5. **Continuous improvement**:
   - Regularly update your test suite with new adversarial inputs, and regenerate the redteam inputs to test variations and updated methods.

## Case Study: Discord's Clyde AI

Discord's launch of Clyde AI in March 2023 is a perfect example of why thorough red teaming is important. Clyde, an OpenAI-powered chatbot, was meant to help users by answering questions and facilitating conversations. But its high-profile rollout also came with lessons learned.

### Deployment

Discord played it safe by introducing Clyde gradually. They only made it available to a small percentage of servers at first, which allowed them to test and refine as they went. At first, things looked promising. A [survey](https://subo.ai/blog/discord-survey-clyde-mysterious-disappearance/) found that 74% of Discord moderators who used Clyde were happy with it.

### Vulnerabilities in the wild

It didn't take long for users to find ways to game the system. Famously, a Discord user discovered the GPT "[grandma exploit](https://www.polygon.com/23690187/discord-ai-chatbot-clyde-grandma-exploit-chatgpt)," a classic jailbreak attack. Users figured out they could trick Clyde into spitting out forbidden content by framing requests as roleplaying scenarios. For instance:

![clyde jailbreak](/img/docs/clyde-jailbreak.jpg)

This kind of prompt let users sidestep OpenAI's alignment and Clyde's content filters, posing several risks:

- **Policy Violations**: Clyde generated content that breached Discord's guidelines, potentially exposing users to harmful or inappropriate material.
- **Reputational Damage**: The exploit gained attention, leading to negative publicity and raising concerns about Discord's commitment to user safety.
- **User Trust Erosion**: Users began to question the reliability of Clyde and Discord's ability to protect them from harmful content.

### Red teaming and evaluation

There were many teams involved in this report and others in the same vein: engineering, product, security, legal, policy, and marketing.

- Adopting an evaluation framework (in fact, they used an early version of Promptfoo!). An evaluation framework is a way to automatically run inputs through an LLM and test its outputs.
- Setting a convention in which every prompt/workflow change required an evaluation.
- Making evaluations as automatic and frictionless as possible.

This gave all stakeholders a quantitative, data-driven way to measure changes in risk and flag unusual fluctuations.

In addition to red teaming, Discord deployed passive moderation and observability tools to detect trends in adversarial inputs, and developed dedicated reporting mechanisms.

### Key Takeaways

This case highlights several practical aspects of AI red teaming:

1. **Comprehensive pre-deployment testing**: Test a wide range of adversarial inputs to uncover potential exploits before launch.
2. **Gradual rollouts**: Limit potential damage and gather real-world usage data through controlled, incremental deployment.
3. **Continuous monitoring**: Develop a culture of continuous testing and risk monitoring to catch regressions.
4. **User feedback loop**: Encourage users to report issues and feed these issues back into your red teaming setup.

### Other examples

Promptfoo is an open-source software that breaks down LLM failure modes into adversarial testers known as "[plugins](/docs/red-team/plugins/)". Here are some examples of plugins:

- [Harmful content](/docs/red-team/plugins/harmful/#examples): Examples of hate speech, offensive content, and other harmful outputs triggered in leading AI models.
- [Broken object-level authorization (BOLA)](/docs/red-team/plugins/bola/#example-test-cases): Test cases for unauthorized access to resources belonging to other users.
- [Broken function-level authorization (BFLA)](/docs/red-team/plugins/bfla/#how-it-works): Prompts attempting to perform actions beyond authorized scope or role.
- [Competitor endorsement](/docs/red-team/plugins/competitors/#example-test-cases): Scenarios where AI might inadvertently promote competing products or services.

See [LLM vulnerability types](/docs/red-team/llm-vulnerability-types/) for more info on model and application vulnerabilities.

## What's next?

To get started and run your first red team, see the [quickstart guide](/docs/red-team/quickstart/).
