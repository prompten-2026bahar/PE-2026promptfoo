---
sidebar_label: Özel Betikler
description: promptfoo test çerçevesiyle zincirleri, Python çerçevelerini ve desteklenmeyen API'leri test etmek için özel kabuk komutlarını ve betikleri LLM sağlayıcısı olarak yapılandırın
---

# Özel Betikler (Custom Scripts)

Herhangi bir kabuk (shell) komutunu bir API sağlayıcısı olarak kullanabilirsiniz. Bu, özellikle promptfoo tarafından doğrudan desteklenmeyen bir dil veya kütüphane kullanmak istediğinizde kullanışlıdır.

Betik Sağlayıcıları (Script Providers) zincirleri değerlendirmek için özellikle yararlı olsa da, genellikle Python veya başka bir dilde uygulanmışlarsa istemlerinizi (prompts) test etmek için de kullanılabilirler.

:::tip
**Python kullanıcıları**: Kullanımı daha kolay bulabileceğiniz özel bir [`python` sağlayıcısı](/docs/providers/python) bulunmaktadır.

**Javascript kullanıcıları**: [`ApiProvider`](/docs/providers/custom-api) arayüzünün nasıl uygulanacağına bakın.
:::

Bir betik sağlayıcısı kullanmak için, ilk argümanı olarak bir istem (prompt) alan ve API çağrısının sonucunu döndüren bir çalıştırılabilir dosya oluşturmanız gerekir. Betik, komut satırından çağrılabilmelidir.

Betiğiniz üç argüman alır:

1. **prompt** - İşlenmiş istem dizesi
2. **options** - Sağlayıcı yapılandırmasını içeren JSON dizesi
3. **context** - Test durumu değişkenlerini, meta verileri ve değerlendirme bilgilerini içeren JSON dizesi (tam yapı için [Python sağlayıcı bağlamı](/docs/providers/python#the-context-parameter) sayfasına bakın)

Bir betik sağlayıcısının nasıl kullanılacağına dair bir örnek:

```yaml
providers:
  - 'exec: python chain.py'
```

Veya CLI'da:

```
promptfoo eval -p prompt1.txt prompt2.txt -o results.csv  -v vars.csv -r 'exec: python chain.py'
```

Yukarıdaki örnekte `chain.py`, argüman olarak bir istem alan, bir LLM zincirini yürüten ve sonucu çıktı olarak veren bir Python betiğidir.

Betik sağlayıcısı hakkında daha derinlemesine bir örnek için [LLM Zinciri](/docs/configuration/testing-llm-chains#using-a-script-provider) örneğine bakın.
