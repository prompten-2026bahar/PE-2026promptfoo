### Birden Fazla Yanıt Türünü İşleme (Handling Multiple Response Types)

Hedef sisteminizin birden fazla nesne türüyle yanıt verebileceği durumlar vardır. Bu durum genellikle hedef sistem bir güvenlik bariyerine (guardrail) takıldığında gerçekleşir. Örneğin:

```json
{
  "message": "Hello, world!"
}
```
Veya bir güvenlik bariyeri tarafından engellendiğinde bir hata mesajı döndürebilir:
```json
{
  "error": "The content you provided violates our policies."
}
```
### Çözüm

Yukarıdaki basit durum için, birden fazla yanıt türünü işlemek amacıyla küçük bir mantık içeren bir yanıt ayrıştırıcı (response parser) kullanabilirsiniz:

```yaml
- id: http://url.foryour.bot/chat
  label: 'internal-chatbot'
  config:
    method: 'POST'
    headers: { 'Content-Type': 'application/json' }
    body: { 'message': '{{prompt}}' }
    transformResponse: json.response ?? json.error
```
Daha karmaşık durumlar için özel bir sağlayıcı (custom provider) kullanabilirsiniz. Ayrıntılar için [özel sağlayıcı belgelerine](https://promptfoo.dev) göz atın.

Örneğin, yanıtın 400 durum koduyla (status code) döneceği bir senaryoyu ele alalım:

```javascript
const URL = 'özel sağlayıcı URL’nizi buraya girin';

class CustomApiProvider {
  constructor(options) {
    // Çağrıcı, Sağlayıcı Kimliğini (Provider ID) geçersiz kılabilir 
    // (örneğin aynı sağlayıcının birden fazla örneği kullanıldığında)
    this.providerId = options.id || 'custom provider';

    // Config nesnesi, yapılandırma dosyasında sağlayıcıya iletilen tüm seçenekleri içerir.
    this.config = options.config;
  }

  id() {
    return this.providerId;
  }

  async callApi(prompt) {
    const body = {
      message: prompt,
    };

    // Veriyi promptfoo'nun önbelleğini kullanarak API'den çekin. 
    // Tercih ederseniz kendi fetch uygulamanızı da kullanabilirsiniz.
    const response = await fetch(
      URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      10_000 /* 10 saniye zaman aşımı */,
    );

    let message = null;
    let data = {};

    if (response.status === 400) {
      message = 'Request blocked by guardrail';
    } else {
      data = await response.json();
      message = data.message;
    }

    const ret = {
      output: message,
      tokenUsage: {
        total: data.usage?.total_tokens || 0,
        prompt: data.usage?.prompt_tokens || 0,
        completion: data.usage?.completion_tokens || 0,
      },
    };
    return ret;
  }
}

module.exports = CustomApiProvider;
```
