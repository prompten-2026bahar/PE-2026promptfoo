---
sidebar_label: Manuel Giriş
description: 'Hızlı prototipleme, hata ayıklama ve temel değerlendirme testleri için LLM API çağrıları olmadan test yanıtlarını manuel olarak sağlayın'
---

# Manuel Giriş Sağlayıcısı (Manual Input Provider)

Manuel Giriş Sağlayıcısı, değerlendirme süreci sırasında her bir istem (prompt) için yanıtları manuel olarak girmenize olanak tanır. Bu, test yapma, hata ayıklama veya otomatik bir API'ye güvenmeden özel yanıtlar sağlamak istediğinizde yararlı olabilir.

## Yapılandırma

Bu sağlayıcıyı kullanmak için yapılandırma dosyanızda sağlayıcı kimliğini (id) `promptfoo:manual-input` olarak ayarlayın:

```yaml
providers:
  - promptfoo:manual-input
```

Varsayılan olarak sağlayıcı, kullanıcıdan CLI üzerinden tek satırlık bir çıktı girmesini isteyecektir. Çok satırlı girişi destekleyen bir düzenleyici açmak için:

```yaml
providers:
  - id: promptfoo:manual-input
    config:
      multiline: true
```

## Kullanım

Komut satırında manuel girişi kolaylaştırmak için eşzamanlılığı (concurrency) 1 olarak ayarlayın ve ilerleme çubuklarını devre dışı bırakın:

```sh
promptfoo eval -j 1 --no-progress-bar
```
