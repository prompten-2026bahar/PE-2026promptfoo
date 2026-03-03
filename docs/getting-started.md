title: Baþlarken description: Ýlk promptfoo yapýlandýrma dosyanýzý nasýl kuracaðýnýzý, istemler (prompts) oluþturmayý, saðlayýcýlarý (providers) yapýlandýrmayý ve ilk LLM deðerlendirmenizi nasýl çalýþtýracaðýnýzý öðrenin. keywords: [baþlarken, kurulum, yapýlandýrma, istemler, saðlayýcýlar, deðerlendirme, llm testi] sidebar_position: 5
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Baþlarken
promptfoo kurulumunu tamamladýktan sonra, ilk yapýlandýrma dosyanýzý birkaç farklý yolla oluþturabilirsiniz:

Bir Örnek Çalýþtýrma
Önceden oluþturulmuþ bir örnekle ilk yapýlandýrma dosyanýzý kurmak için npx, npm veya brew kullanarak þu komutu çalýþtýrýn:

  <Tabs groupId="promptfoo-command">
    <TabItem value="npx" label="npx" default>
      bash       npx promptfoo@latest init --example getting-started       
    </TabItem>
    <TabItem value="npm" label="npm">
      bash       npm install -g promptfoo       promptfoo init --example getting-started       
    </TabItem>
    <TabItem value="brew" label="brew">
      bash       brew install promptfoo       promptfoo init --example getting-started       
    </TabItem>
  </Tabs>

Bu komut, farklý modeller arasýnda çeviri istemlerini test eden temel bir örnek içeren yeni bir dizin oluþturacaktýr. Örnek þunlarý içerir:

Örnek istemler, saðlayýcýlar ve test senaryolarý içeren bir promptfooconfig.yaml yapýlandýrma dosyasý.

Örneðin nasýl çalýþtýðýný açýklayan bir README.md dosyasý.

Çoðu saðlayýcý kimlik doðrulama gerektirir. OpenAI için:

Bash
export OPENAI_API_KEY=sk-abc123
Ardýndan örnek dizinine gidin, deðerlendirmeyi (eval) çalýþtýrýn ve sonuçlarý görüntüleyin:

<Tabs groupId="promptfoo-command">
  <TabItem value="npx" label="npx" default>
    bash     cd getting-started     npx promptfoo@latest eval     npx promptfoo@latest view     
  </TabItem>
  <TabItem value="npm" label="npm">
    bash     cd getting-started     promptfoo eval     promptfoo view     
  </TabItem>
  <TabItem value="brew" label="brew">
    bash     cd getting-started     promptfoo eval     promptfoo view     
  </TabItem>
</Tabs>

CLI Üzerinden Kurulum
Sýfýrdan baþlamak için, etkileþimli bir CLI rehberliði aracýlýðýyla yapýlandýrma oluþturmak üzere promptfoo init komutunu çalýþtýrýn:

<Tabs groupId="promptfoo-command">
  <TabItem value="npx" label="npx" default>
    bash     npx promptfoo@latest init     
  </TabItem>
  <TabItem value="npm" label="npm">
    bash     promptfoo init     
  </TabItem>
  <TabItem value="brew" label="brew">
    bash     promptfoo init     
  </TabItem>
</Tabs>

Web Arayüzü (UI) Üzerinden Kurulum
Görsel bir arayüzü tercih ederseniz, ilk deðerlendirmenizi web arayüzü üzerinden yapýlandýrmak için promptfoo eval setup komutunu çalýþtýrýn:

<Tabs groupId="promptfoo-command">
  <TabItem value="npx" label="npx" default>
    bash     npx promptfoo@latest eval setup     
  </TabItem>
  <TabItem value="npm" label="npm">
    bash     promptfoo eval setup     
  </TabItem>
  <TabItem value="brew" label="brew">
    bash     promptfoo eval setup     
  </TabItem>
</Tabs>

Bu, istemler oluþturma, saðlayýcýlarý seçme ve test senaryolarý ekleme konularýnda size rehberlik eden tarayýcý tabanlý bir kurulum akýþý açar.

<div style={{ textAlign: 'center' }}>

<img src="/img/docs/eval-setup.png" alt="Promptfoo eval setup Web UI" style={{ width: '80%' }} />

</div>

Yapýlandýrma
Deðerlendirmenizi yapýlandýrmak için:

Ýstemlerinizi (prompts) ayarlayýn: promptfooconfig.yaml dosyasýný açýn ve test etmek istediðiniz istemleri ekleyin. Deðiþken yer tutucularý için çift süslü parantez kullanýn: {{degisken_adi}}. Örneðin:

YAML
prompts:
  - 'Aþaðýdaki Ýngilizce metni {{language}} diline çevir: {{input}}'
» Ýstemleri ayarlama hakkýnda daha fazla bilgi

Test etmek istediðiniz AI modellerini belirtmek için providers ekleyin. Promptfoo; OpenAI, Anthropic, Google ve diðerleri dahil olmak üzere 60'tan fazla saðlayýcýyý destekler:

YAML
providers:
  - openai:gpt-5.2
  - openai:gpt-5-mini
  - anthropic:me