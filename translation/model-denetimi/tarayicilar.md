# ModelAudit Tarayicilari

ModelAudit, farkli model formatlari ve dosya turleri icin uzmanlasmis tarayicilar icerir. Her tarayici, ilgili formata ozgu guvenlik sorunlarini belirlemek icin tasarlanmistir.

## Tarayici Secimi

`--list-scanners` ile kurulu surumdeki tarayici kimliklerini gorebilir, `--scanners` ile belirli tarayicilari calistirabilir, `--exclude-scanner` ile varsayilan setten tarayici cikarabilirsiniz.

```bash
promptfoo scan-model --list-scanners
promptfoo scan-model models/ --scanners pickle,tf_savedmodel
promptfoo scan-model models/ --exclude-scanner weight_distribution
```

## Pickle Tarayicisi

**Dosya turleri:** `.pkl`, `.pickle`, `.dill`, `.bin` (pickle verisi icerdiginde), `.pt`, `.pth`, `.ckpt`

**Temel kontroller:**

- Supheli modul importlari (`os`, `subprocess`, `sys`)
- Tehlikeli fonksiyonlar (`eval`, `exec`, `system`)
- Kotu amacli pickle opcode'lari
- Kodlanmis yukler, supheli dizgeler, gomulu calistirilabilirler
- Ag iletisimi desenleri, kimlik bilgileri, JIT/script yurutmeleri

**Neden onemli:** Pickle dosyalari unpickle sirasinda rastgele kod calistirabilir.

## TensorFlow SavedModel Tarayicisi

**Dosya turleri:** `.pb` dosyalari ve SavedModel dizinleri

**Temel kontroller:**

- Dosya sistemi/sistem erisimi yapabilen supheli operasyonlar
- Graf icine gomulu Python cagrilari
- `PyFunc` gibi rastgele kod calistirabilen islevler
- Beklenmeyen file I/O ve komut calistirma desenleri

## TensorFlow Lite Tarayicisi

**Dosya turleri:** `.tflite`

**Temel kontroller:**

- Kotu amacli kod icerebilecek custom op'lar
- Tam TensorFlow op yurutmeyi acan Flex delegate kullanimlari
- Metadata icinde calistirilabilir icerik
- Supheli operator konfigurasyonlari ve buffer tutarsizliklari

## TensorRT Tarayicisi

**Dosya turleri:** `.engine`, `.plan`

**Temel kontroller:**

- Supheli dosya yollari (`/tmp/`, `../`)
- `.so` referanslari
- `exec`/`eval` benzeri script yurutme desenleri
- Yetkisiz plugin referanslari

## Keras H5 Tarayicisi

**Dosya turleri:** `.h5`, `.hdf5`, `.keras`

**Temel kontroller:**

- Guvensiz Lambda katmanlari
- Gömülü kod iceren katman ayarlari
- Kotu amacli custom layer/metric tanimlari
- Tehlikeli string desenleri

## Keras ZIP Tarayicisi

**Dosya turleri:** `.keras`

**Temel kontroller:**

- Base64 Python kodu iceren Lambda katmanlari
- Supheli custom object/layer ayarlari
- ZIP icinde Python dosyalari/ikili calistirilabilirler
- Konfigurasyon JSON'unda tehlikeli desenler

## ONNX Tarayicisi

**Dosya turleri:** `.onnx`

**Temel kontroller:**

- Kotu amacli islev icerebilecek custom operatorler
- Harici data dosyasi referanslari ve path traversal denemeleri
- Tensor boyutu/veri butunlugu dogrulamasi
- Dosya boyutu tutarsizliklari

## OpenVINO Tarayicisi

**Dosya turleri:** `.xml`, `.bin`

**Temel kontroller:**

- Supheli custom layer ayarlari
- Harici veri/path traversal referanslari
- Bozuk XML yapisi veya asiri buyuk dosyalar
- Tehlikeli layer tipleri ve plugin referanslari

## PyTorch ZIP Tarayicisi

**Dosya turleri:** `.pt`, `.pth`

**Temel kontroller:**

- Arsiv icindeki kotu amacli pickle icerik
- Arsive eklenmis Python dosyalari
- Script/ikili calistirilabilirler
- Supheli serilestirme desenleri

## ExecuTorch Tarayicisi

**Dosya turleri:** `.pte`, `.pt`

**Temel kontroller:**

- Arsiv icindeki gomulu pickle dosyalari
- Python kodu/ikili calistirilabilirler
- Supheli serilestirme desenleri
- Tehlikeli metadata ve custom op icerigi

## GGUF/GGML Tarayicisi

**Dosya turleri:** `.gguf`, `.ggml`, `.ggmf`, `.ggjt`, `.ggla`, `.ggsa`

**Temel kontroller:**

- Header dogrulama
- Metadata guvenligi
- Tensor butunlugu
- Kaynak limitleri
- Sikistirma dogrulamasi

## Joblib Tarayicisi

**Dosya turleri:** `.joblib`

**Temel kontroller:**

- Sıkıştırma bombasi tespiti
- Gömülü pickle icerik analizi
- Acilmis boyut limitleri
- ZIP/pickle format dogrulamasi

## Skops Tarayicisi

**Dosya turleri:** `.skops`, `.pkl`

**Temel kontroller:**

- CVE-2025-54412, CVE-2025-54413, CVE-2025-54886 tespiti
- Savunmasiz skops surumu (`< 0.12.0`)
- Tehlikeli sklearn bilesenleri
- Kotu amacli callable argumanlar

## Flax/JAX Tarayicisi

**Dosya turleri:** `.msgpack`, `.flax`, `.orbax`, `.jax`

**Temel kontroller:**

- Supheli MessagePack yapilari
- Gömülü kod nesneleri
- Kaynak tuketimi yaratabilecek bozuk/asiri buyuk yapilar
- Tehlikeli ic ice/recursive nesneler

## JAX Checkpoint Tarayicisi

**Dosya turleri:** `.ckpt`, `.checkpoint`, `.orbax-checkpoint`, `.pickle`

**Temel kontroller:**

- Tehlikeli JAX callback pattern'leri
- Orbax restore function metadata'si
- Pickle opcode guvenligi
- Dizin tabanli checkpoint yapisi
- Kaynak limitleri

## NumPy Tarayicisi

**Dosya turleri:** `.npy`, `.npz`

**Temel kontroller:**

- Dizi boyut/tur manipülasyonu
- Header magic number butunlugu
- Object array gibi tehlikeli turler
- Asiri buyuk dizi yukleme korumalari
- Boyut sinirlarinin denetimi

## OCI Layer Tarayicisi

**Dosya turleri:** `.manifest` (`.tar.gz` katman referanslari)

**Temel kontroller:**

- Katmanlari guvenli cikarma
- JSON/YAML manifest ayrisma
- Katman icindeki model dosyalarini uygun tarayiciyla tarama
- Cikarma sirasinda path traversal onleme

## Manifest Tarayicisi

**Dosya turleri:** `.json`, `.yaml`, `.yml`, `.xml`, `.toml`, `.config`, vb.

**Temel kontroller:**

- Kara liste model isimleri
- Supheli ag, dosya sistemi, kod yurutme ve kimlik bilgisi desenleri
- Framework'e ozel konfigurasyon riskleri

## Metin Tarayicisi

**Dosya turleri:** `.txt`, `.md`, `.markdown`, `.rst`

**Temel kontroller:**

- Olagan disi buyuk metin dosyalari
- Dosya turu tanimlama (vocabulary, labels, dokumantasyon)
- Temel icerik dogrulama

## Jinja2 Sablon Tarayicisi

**Dosya turleri:** `.gguf`, `.json`, `.yaml`, `.yml`, `.jinja`, `.j2`, `.template`

**Temel kontroller:**

- SSTI pattern'leri
- Tehlikeli Jinja2 filtre/fonksiyonlari
- Sinirsiz degisken erisimi
- Kod yurutme desenleri
- CVE-2024-34359 istismar izleri

## Metadata Tarayicisi

**Dosya turleri:** `README.md`, `MODEL_CARD.md`, `METADATA.md`, model card dosyalari

**Temel kontroller:**

- Gömülü API anahtari/kimlik bilgileri
- Supheli URL/indirme baglantilari
- Kotu amacli kod deposu referanslari
- Savunmasiz model surumleri
- Yaniltici icerik veya yetersiz guvenlik aciklamasi

## PyTorch Binary Tarayicisi

**Dosya turleri:** `.bin`

**Temel kontroller:**

- Kod pattern'leri (`import`, `eval`, `exec`)
- PE/ELF/Mach-O imzalari
- Shebang script kaliplari
- Kara liste desenleri
- Tensor yapisi dogrulamasi

## ZIP Arsiv Tarayicisi

**Dosya turleri:** `.zip`, `.npz`

**Temel kontroller:**

- Dizin gecisi (`..`, mutlak yol)
- Zip bombasi (`>100x` oran)
- Ic ice arsiv derinlik kontrolu
- Arsiv icindeki dosyalara uygun tarayici uygulama
- Giris sayisi/boyut kaynak limitleri

## TAR Tarayicisi

**Dosya turleri:** `.tar`, `.tar.gz`, `.tgz`, `.tar.bz2`

**Temel kontroller:**

- Dizin gecisi ve symlink saldirilari
- TAR bombasi davranislari
- Arsiv icindeki kotu amacli icerik
- Kaynak limitleri

## 7-Zip Tarayicisi

**Dosya turleri:** `.7z`

**Temel kontroller:**

- Dizin gecisi
- Sıkıştırma bombasi
- Sifreli arsivlerin risk analizi
- Ic ice arsiv ve kaynak limitleri
- Arsiv ici kotu amacli icerik

## Agirlik Dagilimi Tarayicisi

**Dosya turleri:** `.pt`, `.pth`, `.h5`, `.keras`, `.hdf5`, `.pb`, `.onnx`, `.safetensors`

**Temel kontroller:**

- Aykiri nöronlar (z-score)
- Düsuk benzerlikli agirlik vektörleri (cosine similarity)
- Asiri agirlik degerleri
- Son katman/klasifikasyon head odakli analiz

**Yapilandirma:** `z_score_threshold`, `cosine_similarity_threshold`, `weight_magnitude_threshold`, `llm_vocab_threshold`, `enable_llm_checks`

## SafeTensors Tarayicisi

**Dosya turleri:** `.safetensors`, `.bin` (SafeTensors verisi)

**Temel kontroller:**

- Header ve JSON butunlugu
- Metadata guvenligi
- Tensor offset/boyut/tur tutarliligi
- Offset sinirlari

## PaddlePaddle Tarayicisi

**Dosya turleri:** `.pdmodel`, `.pdiparams`

**Temel kontroller:**

- Supheli operasyonlar
- Gömülü pickle icerigi
- Tehlikeli custom operatorler
- Script/ikili icerik

## XGBoost Tarayicisi

**Dosya turleri:** `.bst`, `.model`, `.json`, `.ubj`

**Temel kontroller:**

- Supheli objective/metric/callback tanimlari
- JSON icinde kod desenleri
- Path traversal ve bozuk model yapisi
- Ikili modelde pickle tabanli custom function riskleri

## PMML Tarayicisi

**Dosya turleri:** `.pmml`

**Temel kontroller:**

- XXE aciklari (`<!DOCTYPE>`, `<!ENTITY>`, vb.)
- Guvenli XML parser kullanimi
- Script/komut desenleri
- Harici kaynak URL'leri
- PMML surum ve kok eleman dogrulamasi
- `<Extension>` iceriklerinin derin analizi

## Otomatik Format Tespiti

ModelAudit, ozellikle `.bin` dosyalarinda icerige bakarak format tespiti yapar:

- Pickle magic byte
- SafeTensors JSON header
- ONNX protobuf imzalari
- PyTorch ZIP (`PK`) imzalari
- Taninmiyorsa genel binary fallback

## Lisans Kontrolu ve Uyumluluk

ModelAudit tum formatlarda lisans tespiti yapar:

- Lisans, AGPL, ticari kisit ve lisanssiz icerik uyarilari
- CycloneDX uyumlu SBOM uretimi

```bash
promptfoo scan-model ./models/ --sbom model-sbom.json
```

## Ag Iletisimi Tespiti

Tespit edilen pattern'ler:

- URL, IP, domain ve port kaliplari
- `socket`, `urllib`, `requests` vb. kutuphaneler
- C2 pattern'leri (`beacon_url`, `callback_url`, `exfil_endpoint`)

## Gizli Bilgi Tespiti

Tarayici su hassas verileri arar:

- API anahtarlari (AWS/Azure/GCP/OpenAI vb.)
- Tokenlar (JWT, OAuth, GitHub)
- Parolalar, private key'ler, DB credentials
- Webhook URL'leri

## JIT/Script Tespiti

- TorchScript, ONNX custom op, TensorFlow eager pattern'leri
- `eval()`, `exec()`, `compile()` cagrilari
- JS/Python/shell script enjeksiyon pattern'leri

## HuggingFace URL Destegi

ModelAudit, HuggingFace URL verildiginde modeli gecici dizine indirir, tum dosyalari uygun tarayicilarla tarar ve is bitince temizler.

**Desteklenen URL formatlari:**

- `https://huggingface.co/user/model`
- `https://hf.co/user/model`
- `hf://user/model`
