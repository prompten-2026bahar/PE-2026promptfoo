# Müşteri Yorumları Prompt Mühendisliği Analizi

## Problem Tanımı
E-ticaret sitelerindeki müşteri yorumlarını analiz ederek ürünlerin hangi özelliklerinin (batarya, kargo, ekran vb.) müşteriler tarafından nasıl algılandığını otomatik olarak ayrıştırmak karmaşık bir süreçtir. Bu proje, "Metin Madenciliği" sorununu çözmek için Büyük Dil Modellerinin (LLM) yorumların "duygusunu" (sentiment) algılama yeteneğini ve doğru formatta çıktı verebilme becerilerini test etmektedir. Geleneksel yazılımla haftalarca sürecek bu özellik/duygu eşleştirmesi, doğru prompt (istemi) mühendisliği ile anlık hale getirilmektedir.

## Prompt Stratejisi
Projede aynı müşteri yorumlarını çözümlemek için birbirinden farklı 3 yaklaşım (prompt tekniği) kullanılmıştır:
1. **Zero-Shot Prompt:** Modele ne yapması gerektiği doğrudan söylendi, hiçbir örnek verilmedi.
2. **Few-Shot Prompt:** Modelin JSON yapısını daha iyi kavraması için, görevin altına 2 adet farklı çözülmüş örnek (girdi-çıktı) eklendi.
3. **Instruction (Chain-of-Thought) Prompt:** Modele önce bir "Uzman Analist" rolü verildi, daha sonra adım adım nasıl düşünmesi gerektiği (1. Adım: Duyguyu bul, 2. Adım: Özellikleri ayır ...) talimat şeklinde aktarıldı.

Bu üç farklı teknik sayesinde prompt mühendisliğinin modelin doğruluğunu nasıl artırdığı gözlemlenmiştir.

## Teknik Mimari
- **LLM Modelleri:** Projede iki dev yapay zeka modelinin karşılaştırması yapılmıştır. Hem Google'ın amiral gemisi `gemini-2.5-flash` modeli, hem de Meta'nın açık kaynaklı efsanesi Llama 3 (`llama-3.1-8b-instant` Groq API üzerinden) entegre edilerek hız, doğruluk ve anlama kapasiteleri kıyaslanmıştır. Özel olarak karmaşık ve emojili müşteri yorumları verilerek modellerin zorluk altındaki davranışları gözlemlenmiştir.
- **Kullanılan Kütüphane / Araç:** Ana değerlendirme ölçütü olarak `promptfoo` kütüphanesi kullanılmıştır. Bu araç, JSON konfigürasyon dosyaları ile birden çok modeli (`providers`) ve prompt dosyasını alıp dev bir matris oluşturarak belirlediğimiz test/onay (`assert`) senaryolarını eşzamanlı olarak LLM'lere devredebilmemizi sağlar. Beklenen anahtar kelimeler ve çıktı formatları tamamen otomatik test ile puanlanarak hocaya sunulmuştur.

## Ekran Görüntüsü/Demo
*(Promptfoo değerlendirme arayüzünün ekran görüntüsünü bu kısıma eklenecek)*

![Promptfoo Sonuç Görseli](./ekran_goruntuleri/demo1.png)
