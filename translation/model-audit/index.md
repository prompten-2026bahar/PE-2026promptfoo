# Model Taramasi

## Genel Bakis

ModelAudit, Promptfoo uzerinden erisilebilen, makine ogrenimi modelleri icin hafif bir statik guvenlik tarayicisidir. AI/ML modellerini dagitimdan once olasi guvenlik risklerine karsi tarar.

Promptfoo, ModelAudit tarama yeteneklerini entegre eden `promptfoo scan-model` sarmalayici komutunu saglar.

![ornek model tarama sonuclari](/img/docs/modelaudit/modelaudit-result.png)

Promptfoo ayrica bir tarama yapilandirmaniza olanak taniyan bir arayuz de sunar:

![model tarama](/img/docs/modelaudit/model-audit-setup.png)

Ve sonuclari goruntuler:

![model tarama sonuclari](/img/docs/modelaudit/model-audit-results.png)

## Amac

AI/ML modelleri asagidaki yollarla guvenlik riski olusturabilir:

- Pickle ile serilestirilmis modellere gomulu kotu amacli kod
- Supheli TensorFlow islemleri
- Potansiyel olarak guvensiz Keras Lambda katmanlari
- Tehlikeli pickle opcode'lari
- Model yapilari icinde gizlenmis kodlanmis yukler
- Model mimarilerindeki riskli yapilandirmalar
- ZIP arsivlerindeki kotu amacli icerik
- Ikili model dosyalarina gomulu calistirilabilir dosyalar
- Gizli kimlik bilgileri (API anahtarlari, tokenlar, parolalar)
- Ag iletisimi kaliplari (URL, IP, socket)
- TorchScript ve ONNX modellerinde JIT/script yurutme

ModelAudit, bu riskleri modeller uretim ortamlarina dagitilmadan once belirlemeye yardimci olur ve daha guvenli bir AI hatti saglar.

## Kurulum

### Promptfoo ile Kullanim

ModelAudit kullanmanin en kolay yolu Promptfoo uzerinden kullanmaktir:

```bash
# Promptfoo'yu global olarak kurun
npm install -g promptfoo

# modelaudit bagimliligini kurun
pip install modelaudit
```

### Bagimsiz Kurulum

ModelAudit'i dogrudan da kurabilirsiniz:

```bash
# Temel kurulum
pip install modelaudit

# Belirli model formatlari icin istege bagli bagimliliklarla
pip install modelaudit[tensorflow,h5,pytorch]

# Tum bagimliliklar icin
pip install modelaudit[all]

# Veya belirli bilesenleri kurun:
pip install modelaudit[tensorflow,h5,pytorch]  # Cekirdek ML framework'leri
pip install modelaudit[cloud,mlflow]           # Uzak model erisimi
pip install modelaudit[numpy1]                 # NumPy 1.x uyumlulugu
```

### Docker

```bash
# GitHub Container Registry'den cekin
docker pull ghcr.io/promptfoo/modelaudit:latest

# Belirli varyantlari kullanin
docker pull ghcr.io/promptfoo/modelaudit:latest-full        # Tum ML framework'leri
docker pull ghcr.io/promptfoo/modelaudit:latest-tensorflow  # Yalnizca TensorFlow

# Docker ile calistirin
docker run --rm -v $(pwd):/data ghcr.io/promptfoo/modelaudit:latest scan /data/model.pkl
```

## Kullanim

### Temel Komut Yapisi

```bash
promptfoo scan-model [OPTIONS] PATH...
```

### Ornekler

```bash
# Tek bir model dosyasini tarayin
promptfoo scan-model model.pkl

# HuggingFace'ten indirmeden dogrudan model tarayin
promptfoo scan-model https://huggingface.co/bert-base-uncased
promptfoo scan-model hf://microsoft/resnet-50

# Bulut depolamadan tarayin
promptfoo scan-model s3://my-bucket/model.pt
promptfoo scan-model gs://my-bucket/model.h5

# MLflow kayit defterinden tarayin
promptfoo scan-model models:/MyModel/1

# Birden cok model ve dizin tarayin
promptfoo scan-model model.pkl model2.h5 models_directory

# Sonuclari JSON'a aktarin
promptfoo scan-model model.pkl --format json --output results.json

# Guvenlik araci entegrasyonu icin sonuclari SARIF'e aktarin
promptfoo scan-model model.pkl --format sarif --output results.sarif

# Ozel kara liste desenleri ekleyin
promptfoo scan-model model.pkl --blacklist "unsafe_model" --blacklist "malicious_net"

# Ayrintili ciktiyi etkinlestirin
promptfoo scan-model model.pkl --verbose

# Dosya boyutu limitleri belirleyin
promptfoo scan-model models/ --max-size 1GB

# Yazilim Malzeme Listesi (SBOM) uretin
promptfoo scan-model model.pkl --sbom sbom.json

# Guvenlik-kritik taramalar icin kati modu etkinlestirin
promptfoo scan-model model.pkl --strict

# Tarayici kimliklerini listeleyin ve yalniz secili tarayicilari calistirin
promptfoo scan-model --list-scanners
promptfoo scan-model models/ --scanners pickle,tf_savedmodel

# Gercek islem yapmadan taramayi onizleyin
promptfoo scan-model model.pkl --dry-run
```

Bulut depolama, JFrog ve diger uzak kaynaklar icin ayrintili kimlik dogrulama kurulumu icin [Gelismis Kullanim](./gelismis-kullanim.md) rehberine bakin.

:::info Alternatif Kurulum ve Kullanim

- **Bagimsiz**: `pip install modelaudit` ile modelaudit'i dogrudan kurun. `modelaudit scan`, `promptfoo scan-model` ile ayni davranir.
- **Web Arayuzu**: GUI deneyimi icin `promptfoo view` komutunu calistirin ve gorsel tarama/yapilandirma icin `/model-audit` yoluna gidin.

:::

### Secenekler

| Secenek             | Aciklama                                                                 |
| ------------------- | ------------------------------------------------------------------------ |
| `--blacklist`, `-b` | Model adlarina karsi kontrol edilecek ek kara liste desenleri            |
| `--format`, `-f`    | Cikti formati (`text` \| `json` \| `sarif`) [varsayilan: text]          |
| `--output`, `-o`    | Cikti dosya yolu (belirtilmezse stdout'a yazdirir)                       |
| `--timeout`, `-t`   | Saniye cinsinden tarama zaman asimi [varsayilan: 300]                    |
| `--verbose`, `-v`   | Ayrintili ciktiyi etkinlestirir                                          |
| `--max-size`        | Taranacak toplam en buyuk boyut (orn. `500MB`, `1GB`)                    |
| `--sbom`            | Lisans bilgili CycloneDX Yazilim Malzeme Listesi uretir                  |
| `--strict`          | Uyarilarda basarisiz say; daha siki dogrulama uygular                    |
| `--dry-run`         | Dosyalari islemden gecirmeden taramayi onizler                           |
| `--scanners`        | Yalnizca secilen tarayicilari calistirir                                 |
| `--exclude-scanner` | Varsayilan tarayici setinden tarayici haric tutar                        |
| `--list-scanners`   | Kullanilabilir tarayici kimlikleri ve sinif adlarini yazdirir            |
| `--quiet`           | Kritik olmayan ciktIyi bastirir                                          |
| `--progress`        | Ilerleme raporlamasini zorla etkinlestirir                               |
| `--no-cache`        | Indirilen dosyalarin onbellege alinmasini devre disi birakir             |
| `--no-write`        | Sonuclarin veritabanina yazilmasini atlar                                |

## Web Arayuzu

Promptfoo, `/model-audit` adresinde gorsel yol secimi, gercek zamanli ilerleme takibi ve ayrintili sonuc gorsellestirmesi iceren bir ModelAudit web arayuzu sunar.

**Erisim:** `promptfoo view` komutunu calistirin ve `http://localhost:15500/model-audit` adresine gidin.

**Temel Ozellikler:**

- Gecerli calisma dizini baglami ile gorsel dosya/dizin secimi
- Tum tarama secenekleri icin GUI yapilandirmasi (kara liste desenleri, zaman asimi, dosya limitleri)
- Canli tarama ilerlemesi ve onem derecesine gore renk kodlu sekmeli sonuc gorunumu
- Tarama gecmisi ve otomatik kurulum algilama

## Desteklenen Formatlar

ModelAudit, ana ML framework'leri genelinde 30+'dan fazla uzmanlasmis dosya formati tarayicisini destekler.

### Model Formatlari

| Format                    | Uzantilar                                             | Aciklama                                                      |
| ------------------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| **PyTorch**               | `.pt`, `.pth`, `.bin`                                 | PyTorch model dosyalari ve checkpoint'ler                     |
| **TensorFlow SavedModel** | `.pb`, dizinler                                       | TensorFlow'un standart model formati                          |
| **TensorFlow Lite**       | `.tflite`                                             | Mobil icin optimize edilmis TensorFlow modelleri              |
| **TensorRT**              | `.engine`, `.plan`                                    | NVIDIA GPU optimize cikarim motorlari                         |
| **Keras**                 | `.h5`, `.keras`, `.hdf5`                              | HDF5 formatindaki Keras/TensorFlow modelleri                  |
| **ONNX**                  | `.onnx`                                               | Open Neural Network Exchange formati                          |
| **SafeTensors**           | `.safetensors`                                        | Hugging Face'in guvenli tensor formati                        |
| **GGUF/GGML**             | `.gguf`, `.ggml`, `.ggmf`, `.ggjt`, `.ggla`, `.ggsa` | Nicemlenmis modeller (LLaMA, Mistral vb.)                     |
| **Flax/JAX**              | `.msgpack`, `.flax`, `.orbax`, `.jax`                 | JAX tabanli model formatlari                                  |
| **JAX Checkpoints**       | `.ckpt`, `.checkpoint`, `.orbax-checkpoint`           | JAX egitim checkpoint'leri                                    |
| **Pickle**                | `.pkl`, `.pickle`, `.dill`                            | Python serilestirme (Dill dahil)                              |
| **Joblib**                | `.joblib`                                             | Scikit-learn ve genel ML serilestirme                         |
| **NumPy**                 | `.npy`, `.npz`                                        | NumPy dizi depolama formatlari                                |
| **PMML**                  | `.pmml`                                               | Predictive Model Markup Language (XML)                        |
| **ZIP Arsivleri**         | `.zip`                                                | Ozyinelemeli tarama ile sikistirilmis model arsivleri         |
| **Konteyner Manifestleri**| `.manifest`                                           | OCI/Docker katman taramasi                                    |
| **Ikili Dosyalar**        | `.bin`                                                | Otomatik algilanan format (PyTorch, ONNX, SafeTensors vb.)    |

### Uzak Kaynaklar

| Kaynak                   | URL Formati                                           | Ornek                                                           |
| ------------------------ | ----------------------------------------------------- | --------------------------------------------------------------- |
| **HuggingFace Hub**      | `https://huggingface.co/`, `https://hf.co/`, `hf://` | `hf://microsoft/resnet-50`                                      |
| **Amazon S3**            | `s3://`                                               | `s3://my-bucket/model.pt`                                       |
| **Google Cloud Storage** | `gs://`                                               | `gs://my-bucket/model.h5`                                       |
| **Cloudflare R2**        | `r2://`                                               | `r2://my-bucket/model.safetensors`                              |
| **MLflow Registry**      | `models:/`                                            | `models:/MyModel/1`                                             |
| **JFrog Artifactory**    | `https://*.jfrog.io/`                                 | `https://company.jfrog.io/artifactory/models/model.pkl`         |
| **DVC**                  | `.dvc` dosyalari                                      | `model.pkl.dvc`                                                 |

## Yapilan Guvenlik Kontrolleri

Tarayici asagidakiler dahil cesitli guvenlik sorunlarini arar:

- **Kotu Amacli Kod**: Pickle ile serilestirilmis modellerde potansiyel tehlikeli kodu tespit etme
- **Supheli Islemler**: Riskli TensorFlow islemlerini ve ozel ONNX operatorlerini belirleme
- **Guvensiz Katmanlar**: Potansiyel olarak guvensiz Keras Lambda katmanlarini bulma
- **Kara Liste Adlari**: Supheli desenlerle eslesen ada sahip modelleri kontrol etme
- **Tehlikeli Serilestirme**: Guvensiz pickle opcode'lari, ic ice pickle yukleri ve decode-exec zincirlerini tespit etme
- **Gelismis Dill/Joblib Guvenligi**: Format dogrulama ve atlatma onleme ile ML farkindalikli tarama
- **Kodlanmis Yukler**: Gizli kodu isaret edebilecek supheli dizgeleri arama
- **Riskli Yapilandirmalar**: Model mimarilerindeki tehlikeli ayarlari belirleme
- **XML Guvenligi**: PMML dosyalarinda XXE saldirilari ve kotu amacli icerik tespiti
- **Gomulu Calistirilabilirler**: Windows PE, Linux ELF ve macOS Mach-O dosyalarini tespit etme
- **Konteyner Guvenligi**: OCI/Docker konteyner katmanlari icindeki model dosyalarini tarama
- **Sikistirma Saldirilari**: Zip bombalari ve acma saldirilarini tespit etme
- **Agirlik Anomalileri**: Potansiyel arka kapilari tespit icin istatistiksel analiz
- **Format Butunlugu**: Dosya formati yapisini dogrulama
- **Lisans Uyumlulugu**: AGPL yukumlulukleri ve ticari kisitlari tespit etme
- **DVC Entegrasyonu**: DVC ile takip edilen modelleri otomatik cozumleme ve tarama
- **Gizli Bilgi Tespiti**: Gomulu API anahtarlari, tokenlar ve kimlik bilgilerini bulma
- **Ag Analizi**: Veri sizdirmayi mumkun kilabilecek URL, IP ve socket kullanimini tespit etme
- **JIT Kod Tespiti**: TorchScript, ONNX custom op ve diger JIT derlenmis kodlari tarama

## Sonuclari Yorumlama

Tarama sonuclari onem derecesine gore siniflandirilir:

- **CRITICAL**: Hemen ele alinmasi gereken kesin guvenlik sorunlari
- **WARNING**: Inceleme gerektiren potansiyel sorunlar
- **INFO**: Bilgilendirici bulgular (zorunlu olarak guvenlik sorunu olmayabilir)
- **DEBUG**: Ek ayrintilar (`--verbose` ile gosterilir)

Bazi sorunlarda guvenlik riskini anlamaya yardimci olmak icin "Why" aciklamasi bulunur:

```
1. suspicious_model.pkl (pos 28): [CRITICAL] Suspicious module reference found: posix.system
   Why: The 'os' module provides direct access to operating system functions.
```

## Is Akislarina Entegrasyon

ModelAudit, Promptfoo ile CI/CD hatlarina eklendiginde ozellikle faydalidir:

```bash
# Ornek CI/CD betik parcasi
npm install -g promptfoo
pip install modelaudit
promptfoo scan-model --format json --output scan-results.json ./models/
if [ $? -ne 0 ]; then
  echo "Modellerde guvenlik sorunlari bulundu! scan-results.json dosyasini kontrol edin"
  exit 1
fi
```

### Cikis Kodlari

ModelAudit otomasyon icin belirli cikis kodlari dondurur:

- **0**: Guvenlik sorunu bulunmadi
- **1**: Guvenlik sorunlari tespit edildi (warning veya critical)
- **2**: Tarama hatalari olustu (kurulum, dosya erisimi vb.)

:::tip CI/CD En Iyi Uygulamasi
CI/CD hatlarinda cikis kodu 1, gozden gecirilmesi gereken bulgular oldugunu gosterir ancak dagitimi zorunlu olarak engellemez. Yalnizca cikis kodu 2 gercek tarama basarisizligini temsil eder.
:::

## Gereksinimler

ModelAudit Promptfoo ile birlikte gelir, ancak belirli model formatlari ek bagimliliklar gerektirebilir:

```bash
# TensorFlow modelleri icin
pip install tensorflow

# PyTorch modelleri icin
pip install torch

# HDF5 kullanan Keras modelleri icin
pip install h5py

# YAML yapilandirma taramasi icin
pip install pyyaml

# SafeTensors destegi icin
pip install safetensors

# HuggingFace URL taramasi icin
pip install huggingface-hub

# Bulut depolama taramasi icin
pip install boto3 google-cloud-storage

# MLflow kayit defteri taramasi icin
pip install mlflow
```

### NumPy Uyumlulugu

ModelAudit hem NumPy 1.x hem de 2.x surumlerini destekler. NumPy uyumluluk sorunlari yasarsaniz:

```bash
# Gerekirse tam uyumluluk icin NumPy 1.x'i zorlayin
pip install modelaudit[numpy1]
```

## Ayrica Bakiniz

- [Gelismis Kullanim](./gelismis-kullanim.md)
- [Tarayici Referansi](./tarayicilar.md)
