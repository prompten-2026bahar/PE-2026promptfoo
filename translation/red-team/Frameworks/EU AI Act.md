# AB Yapay Zekâ Yasası (EU AI Act)

AB Yapay Zekâ Yasası (AI Act), yapay zekâ sistemlerini özel olarak düzenleyen dünyanın ilk kapsamlı yasal çerçevesidir. 2024 yılında yürürlüğe girmiş olup, Avrupa Birliği içinde yapay zekâ sistemlerinin geliştirilmesi, piyasaya sunulması ve kullanımı için uyumlaştırılmış kurallar belirler.

AI Act, risk temelli bir yaklaşım kullanır ve yapay zekâ sistemlerini temel haklar ve güvenlik açısından oluşturdukları risk düzeyine göre sınıflandırır. Bazı yapay zekâ uygulamalarını tamamen yasaklar, yüksek riskli sistemleri sıkı biçimde düzenler ve sınırlı ile düşük riskli sistemler için daha hafif gereklilikler getirir.

---

## Risk Kategorileri

AB AI Act, yapay zekâ sistemlerini dört risk düzeyine ayırır:

- **Kabul Edilemez Risk (Yasaklı)** — Madde 5  
- **Yüksek Risk** — Ek III  
- **Sınırlı Risk** — Şeffaflık gereklilikleri  
- **Asgari Risk** — Ek gereklilik yok  

Promptfoo’nun red teaming (saldırı simülasyonu) yetenekleri, yasaklı uygulamaları (Madde 5) ve yüksek riskli sistem gerekliliklerini (Ek III) test etmeye odaklanır.

---

## Madde 5: Yasaklı Yapay Zekâ Uygulamaları

Madde 5, temel haklar açısından kabul edilemez risk taşıdığı için AB’de yasaklanan yapay zekâ uygulamalarını listeler:

- Bilinçaltı Manipülasyon  
- Kırılganlıkların İstismarı  
- Sosyal Puanlama  
- Biyometrik Sınıflandırma  
- Gerçek Zamanlı Uzaktan Biyometrik Tanımlama  
- Sonradan Uzaktan Biyometrik Tanımlama  

---

## Ek III: Yüksek Riskli Yapay Zekâ Sistemleri

Ek III, sıkı gerekliliklere tabi olan yüksek riskli yapay zekâ sistemlerinin kategorilerini tanımlar:

- Biyometrik Tanımlama  
- Kritik Altyapı  
- Eğitim ve Mesleki Eğitim  
- İstihdam ve Çalışan Yönetimi  
- Temel Hizmetler  
- Kolluk Kuvvetleri  
- Göç, İltica ve Sınır Kontrolü  
- Adalet ve Demokrasi Yönetimi  

---

## AB AI Act Uyumluluğu için Tarama

Promptfoo, red teaming yoluyla AB AI Act uyumluluk sorunlarını tespit etmeye yardımcı olur:

```yaml
redteam:
  plugins:
    - eu:ai-act
  strategies:
    - jailbreak
    - prompt-injection
```

Belirli maddeleri veya risk kategorilerini hedeflemek de mümkündür:

```yaml
redteam:
  plugins:
    - eu:ai-act:art5:subliminal-manipulation
    - eu:ai-act:annex3:biometric-id
    - eu:ai-act:annex3:law-enforcement
```