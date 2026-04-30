# LLM'leri Jailbreak Yapmak İçin GOAT Tekniği

GOAT (Generative Offensive Agent Tester - Üretken Ofansif Ajan Test Cihazı) stratejisi, bir hedef modelin güvenlik önlemlerini atlatmayı amaçlayan çok turlu konuşmaları dinamik olarak oluşturmak için bir "saldırgan" LLM kullanan gelişmiş bir otomatik "red teaming" tekniğidir.

Meta araştırmacıları tarafından 2024 yılında tanıtılan bu yöntem, gerçek kullanıcıların yapay zeka sistemleriyle nasıl etkileşime girdiğini simüle ederek modern LLM'lere karşı yüksek başarı oranları elde eder. JailbreakBench veri setinde Llama 3.1'e karşı %97 ve GPT-4-Turbo'ya karşı %88 Saldırı Başarı Oranına (ASR@10) ulaşmıştır.

## Uygulama
Stratejiler kullanıcı arayüzünden seçerek veya yapılandırma dosyanızı düzenleyerek kullanabilirsiniz:

```yaml
# promptfooconfig.yaml
strategies:
  - id: goat
    config:
      maxTurns: 5    # Maksimum konuşma turu (varsayılan)
      stateful: false # Her turda tüm konuşma geçmişini gönderir (varsayılan)
```
## Nasıl Çalışır?



GOAT, hedef modelle çok turlu konuşmalar yürüten bir saldırgan (attacker) LLM kullanır.

Saldırgan; çıktı manipülasyonu, güvenli yanıt dikkat dağıtıcıları ve kurgusal senaryolar gibi birden fazla saldırı tekniğini takip eder. Daha basit yaklaşımların aksine GOAT, stratejisini hedef modelin yanıtlarına göre uyarlar; bu yönüyle gerçek "red team" uzmanlarının çalışma biçimine benzer.

Her konuşma turu, yapılandırılmış üç adımlı bir akıl yürütme sürecini izler:

*   **Gözlem (Observation):** Hedef modelin önceki yanıtını analiz eder ve tetiklenen güvenlik mekanizmalarını belirler.
*   **Stratejik Planlama (Strategic Planning):** Konuşmanın ilerleyişi üzerine düşünür ve bir sonraki yaklaşımı geliştirir.
*   **Saldırı Oluşturma (Attack Generation):** Bir sonraki istemi oluşturmak için uygun teknikleri seçer ve birleştirir.





Bu süreç, ya hedefe ulaşılana ya da maksimum tur sayısına varılana kadar bir döngü halinde devam eder.

GOAT'un etkinliği, teknik karmaşıklığı korurken gerçekçi kullanıcı davranışlarını simüle edebilme yeteneğinden kaynaklanır.

Kaba kuvvet (brute-force) yaklaşımlarına veya statik istemlere dayanmak yerine, dinamik konuşma ve akıl yürütme yapısı sayesinde LLM uygulamalarındaki zafiyetleri tespit etmede özellikle etkilidir.

## İlgili Kavramlar

*   **Çok Turlu (Multi-turn) Jailbreak'ler**
*   **Ağaç Tabanlı (Tree-based) Jailbreak'ler**
*   **Yinelemeli (Iterative) Jailbreak'ler**

LLM zafiyetleri ve "red teaming" stratejileri hakkında kapsamlı bir genel bakış için [LLM Zafiyet Türleri](Types of LLM Vulnerabilities) sayfamızı ziyaret edin.
