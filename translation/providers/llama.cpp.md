---
sidebar_label: Llama.cpp
description: "Kaynak kısıtlı dağıtımlar için llama.cpp'nin optimize edilmiş çıkarım motorunu kullanarak kuantize edilmiş LLM'leri CPU'larda verimli bir şekilde çalıştırın"
---

# Llama.cpp

`llama` sağlayıcısı, [llama.cpp](https://github.com/ggerganov/llama.cpp) ile birlikte gelen HTTP sunucusu ile uyumludur. Bu, `llama.cpp` modellerinin gücünü Promptfoo içinde kullanmanıza olanak tanır.

## Yapılandırma

`llama` sağlayıcısını kullanmak için `promptfooconfig.yaml` dosyanızda sağlayıcı olarak `llama` belirleyin.

Desteklenen ortam değişkenleri:

- `LLAMA_BASE_URL` - Şema, ana bilgisayar adı ve bağlantı noktası (varsayılan: `http://localhost:8080`)

Promptfoo'nun `llama.cpp` ile nasıl kullanılacağına dair yapılandırma ve kurulumu içeren ayrıntılı bir örnek için [GitHub üzerindeki örneğe](https://github.com/promptfoo/promptfoo/tree/main/examples/llama-cpp) bakın.
