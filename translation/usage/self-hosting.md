---
sidebar_position: 50
title: Self-Hosting
description: Docker, Docker Compose veya Helm kullanarak promptfoo'yu self-host etmeyi öğrenin. Bu kapsamlı kılavuz sizi kurulum, yapılandırma ve sorun giderme konusunda yol gösterir.
keywords:
  - AI testi
  - yapılandırma
  - Docker
  - Docker Compose
  - Helm
  - Kubernetes
  - LLM eval
  - LLM değerlendirmesi
  - promptfoo
  - self-hosting
  - kurulum kılavuzu
  - takım işbirliği
---

# Promptfoo Self-Hosting

Promptfoo, değerlendirmeleri depolayan bir sunucu barındırmanıza olanak sağlayan temel bir Docker görüntüsü sağlar. Bu kılavuz çeşitli dağıtım yöntemlerini kapsar.

Self-hosting size şunları yapmanızı sağlar:

- Özel bir örneği değerlendirmeleri paylaşma
- CI/CD işlem hattınızda değerlendirmeleri çalıştırma ve sonuçları toplama
- Hassas verileri yerel makinenizin dışında tutma

:::caution Kurumsal Müşteriler
Bir kurumsal müşteriyseniz, lütfen bu sürümü yüklemeyin. Bunun yerine kurumsal görüntü kimlik bilgileri için bize başvurun.
:::

Self-hosted uygulama, web UI ve API'yi sunan bir Express sunucusudur.

:::warning
**Self-hosting, üretim kullanım durumları için önerilmez.**

- Manuel ısrar yönetimi gerektiren ve çoğaltmalar arasında paylaşılamayan yerel bir SQLite veritabanı kullanır
- Bireysel veya deneysel kullanım için oluşturulmuş
- Çok ekip desteği veya rol tabanlı erişim kontrolü yok.
- Yatay ölçeklenebilirlik desteği yok. Değerlendirme işleri her sunucunun belleğinde yaşar ve birden fazla pod SQLite veritabanını paylaşamaz, bu nedenle birden fazla kopya (örneğin Kubernetes'te) çalıştırmak "İş bulunamadı" hatalarına yol açar.
- Yerleşik kimlik doğrulama veya SSO özellikleri yok

Yatay ölçekleme, paylaşılan veritabanlar veya çok ekip desteği gerektiren üretim dağıtımları için [Kurumsal platform](/docs/enterprise/)'umuza bakın.
:::

## Yöntem 1: Önceden Oluşturulmuş Docker Görüntülerini Kullanma (Önerilen Başlangıç)

Önceden oluşturulmuş bir görüntü kullanarak hızlı başlayın.

### 1. Görüntüyü Çekin

En son görüntüyü çekin veya belirli bir sürüme sabitlenin (örn. `0.109.1`):

```bash
# En sonuncuyu çek
docker pull ghcr.io/promptfoo/promptfoo:latest

# Veya belirli bir sürümü çek
# docker pull ghcr.io/promptfoo/promptfoo:0.109.1

# Görüntü ozgünlüğünü şu şekilde doğrulayabilirsiniz:
# gh attestation verify oci://ghcr.io/promptfoo/promptfoo:latest --owner promptfoo
```

### 2. Konteynırı Çalıştır

Konteynırı çalıştırın, veri kalıcılığı için yerel bir dizini eşleştirin:

```bash
docker run -d \
  --name promptfoo_container \
  -p 3000:3000 \
  -v /path/to/local_promptfoo:/home/promptfoo/.promptfoo \
  -e OPENAI_API_KEY=sk-abc123 \
  ghcr.io/promptfoo/promptfoo:latest
```

:::info
`~/.promptfoo/` varsayılan veri dizinidir.
:::

**Temel Parametreler:**

- **`-d`**: Ayrıldırılmış modda çalıştır (arka planda).
- **`--name promptfoo_container`**: Konteynıra bir ad atayın.
- **`-p 3000:3000`**: Sunucu baęlantı noktası 3000'i konteyner baęlantı noktası 3000'e eşleştirin.
- **`-v /path/to/local_promptfoo:/home/promptfoo/.promptfoo`**: **Kalıcılık için kritik.** Konteyner'in veri dizinini (`/home/promptfoo/.promptfoo`, `promptfoo.db` içeren) yerel dosya sisteminize eşleştirin. `/path/to/local_promptfoo`'u tercih ettiğiniz sunucu yolunuzla değiştirin (örn. `./promptfoo_data`). **Bu hacim eşleştirmesi atlanırsa veriler kaybolur.**
- **`-e OPENAI_API_KEY=sk-abc123`**: Bir ortam değişkeni ayarlama örneği. Kullanıcıların web arayüzünden doğrudan değerlendirmeleri çalıştırabilmesi için gerekli API anahtarını buraya ekleyin. `sk-abc123`'ü gerçek anahtarınızla değiştirin.

UI'ya `http://localhost:3000` adresinde erişin.

## Yöntem 2: Docker Compose Kullanma

Çok konteynırlı kurulumları yönetmek veya yapılandırmaları bildirimsel olarak tanımlamak için Docker Compose kullanın.

### 1. `docker-compose.yml` Oluştur

Proje dizininizde bir `docker-compose.yml` dosyası oluşturun:

```yaml title="docker-compose.yml"
version: '3.8'

services:
  promptfoo_container: # Tutarlı hizmet ve konteyner adı
    image: ghcr.io/promptfoo/promptfoo:latest # Veya belirli bir sürüm etiketine sabitle
    ports:
      - '3000:3000' # Sunucu baęlantı noktası 3000'i konteyner baęlantı noktası 3000'e eşleştir
    volumes:
      # Kalıcılık için sunucu dizinini konteyner veri dizinine eşleştir
      # Önce sunucunuzda ./promptfoo_data yaratın!
      - ./promptfoo_data:/home/promptfoo/.promptfoo
    environment:
      # Seçme: Büyük değerlendirmeler için yığın boyutunu ayarla (Sorun Giderme'ye bakın)
      - PROMPTFOO_SHARE_CHUNK_SIZE=10
      # Diğer gerekli ortam değişkenlerini ekle (örəğin, API tuşları)
      - OPENAI_API_KEY=your_key_here
      # Örnek: Google API Anahtarı
      # - GOOGLE_API_KEY=your_google_key_here
# Seçme: Docker tarafından yönetilen adlı bir hacim tanımla (sunucu yolu eşleştirmesine alternatif)
# volumes:
#   promptfoo_data:
#     driver: local
# Adlı bir hacim kullanırysanız, hizmet hacim eşleştirmesini şa şekilde değiştirin:
#     volumes:
#       - promptfoo_data:/home/promptfoo/.promptfoo
```

:::info Sunucu Yolları vs. Adlı Hacimler
Yukarıdaki örnek, oluşturduğunuz bir dizine açıkça eşleştiren bir sunucu yolu eşleştirmesi (`./promptfoo_data:/home/promptfoo/.promptfoo`) kullanır. Alternatif olarak, Docker adlı hacimlerini kullanabilirsiniz (`volumes:` bölümünün yorumunu kaldırın ve hizmet `volumes:` bölümünü ayarlayın).
:::

### 2. Sunucu Dizinini Oluştur (sunucu yolu kullanılıyorsa)

`docker-compose.yml` dosyanızda `./promptfoo_data` kullandıysanız, onu oluşturun:

```bash
mkdir -p ./promptfoo_data
```

### 3. Docker Compose ile Çalıştır

Konteynırı ayrıldırılmış modda başlat:

```bash
docker compose up -d
```

Konteynırı durdur (veriler `./promptfoo_data` veya adlı hacimdedir):

```bash
docker compose stop
```

Konteynırı durdur ve kaldır (veriler kalır):

```bash
docker compose down
```

## Yöntem 3: Kubernetes ile Helm Kullanma

:::warning
Helm desteği şu anda deneyseldir. Lütfen karşılaştığınız herhangi bir sorunu bildirin.
:::

Sağlanan Helm çizelgesini kullanarak promptfoo'yu Kubernetes'e dağıtın.

:::info
`replicaCount: 1` tutun (
varayılan) çünkü self-hosted sunucu yerel bir SQLite veritabanı ve birden fazla kopya arasında paylaşılamayan bellek içi iş kuyruğu kullanır.
:::

### Ön Koşullar

- Bir Kubernetes kümesi (örəğin, Minikube, K3s, GKE, EKS, AKS)
- Helm v3 kurulu (`brew install helm` veya [Helm belgeleri](https://helm.sh/docs/intro/install/)ne bakın)
- `kubectl` küyesi bağlanacak şekilde yapılandırıldı
- Git kurulu

### Yükleme

1. **Promptfoo Depo'sunu Klonla:**
   Hatırla, promptfoo ana depo'sunu klonla:

   ```bash
   git clone https://github.com/promptfoo/promptfoo.git
   cd promptfoo
   ```

2. **Çizelgeyi Yükle:**
   Klonlanan depo'nun kökünden, yerel yolunu kullanarak çizelgeyi yükle. Bir yayın adı sağla (örəğin, `my-promptfoo`):
   ```bash
   # Varsayılan değerleri kullanarak yükle
   helm install my-promptfoo ./helm/chart/promptfoo
   ```

### Yapılandırma

Helm çizelgesi veri kalıcılığı için SaticiVolumetaleplerini (PVC'ler) kullanır. Varsayılan olarak, varsayılan StorageClass'ı kullanarak 1Gi depolama talep eden `promptfoo` adında bir PVC oluşturur.

Bir `values.yaml` dosyası veya `--set` bayrakları kullanarak yüklemeyi özelleştirin.

**Örnek (`my-values.yaml`):**

```yaml title="my-values.yaml"
image:
  tag: v0.54.0 # Belirli bir sürüme sabitle

persistentVolumeClaims:
  - name: promptfoo
    size: 10Gi # Depolama boyutunu artır
    # Seçme: Varsayılana uygun değilse bir StorageClass belirt
    # storageClassName: my-ssd-storage

service:
  type: LoadBalancer # LoadBalancer aracılığıyla ortaya koyuҬ (küyenize/gereksinimlerinize göre ayarla)


# Seçme: Bir giriş denetleyiciniz varsa girişi yapılandır
# ingress:
#   enabled: true
#   className: "nginx" # Veya giriş denetleyici sınıfınız
#   hosts:
#     - host: promptfoo.example.com
#       paths:
#         - path: /
#           pathType: ImplementationSpecific
#   tls: []
#   #  - secretName: promptfoo-tls
#   #    hosts:
#   #      - promptfoo.example.com
```

Özel değerlerle yükle:

```bash
# Klonlanan promptfoo depo'sunun kökünde olduğunuzdan emin olun
helm install my-promptfoo ./helm/chart/promptfoo -f my-values.yaml
```

Veya hızlı değişiklikleri için `--set` kullanın:

```bash
# Klonlanan promptfoo depo'sunun kökünde olduğunuzdan emin olun
helm install my-promptfoo ./helm/chart/promptfoo \
  --set image.tag=0.109.1 \
  --set service.type=NodePort
```

Tüm mevcut seçenekler için [çizelgenin `values.yaml`](https://github.com/promptfoo/promptfoo/blob/main/helm/chart/promptfoo/values.yaml) dosyasına bakın.

### Kalıcılık Hususları

Kubernetes küyesinin bir varsayılan StorageClass'ı yapılandırılmış olduğundan emin olun veya PVC için `ReadWriteOnce` erişim modunu destekleyen bir `storageClassName` açıkça belirtün.

## Alternatif: Kaynaktan Derleme

Görüntünün kendiniz derlemek istiyorsanız:

### 1. Depo'yu Klonla

```sh
git clone https://github.com/promptfoo/promptfoo.git
cd promptfoo
```

### 2. Docker Görüntüsünü Derle

```sh
# Geçerli mimariniz için derle
docker build -t promptfoo:custom .

# Veya linux/amd64 gibi belirli bir platform için derle
# docker build --platform linux/amd64 -t promptfoo:custom .
```

### 3. Özel Docker Konteynırını Çalıştır

Yöntem 1'deki `docker run` komutunu kullanın, ancak görüntü adını değiştirin:

```bash
docker run -d \
  --name promptfoo_custom_container \
  -p 3000:3000 \
  -v /path/to/local_promptfoo:/home/promptfoo/.promptfoo \
  promptfoo:custom
```

Veri kalıcılığı için hacim monte ısdırması (`-v`) dahil etmeyi unutmayın.

## CLI'yi Yapılandır

Self-hosting yaparken, `promptfoo` CLI'yi varsayılan bulut hizmeti yerine örneğinizle iletişim kurmak için yapılandırın. Bu `promptfoo share` gibi komutlar için gereklidir.

`promptfoo` komutlarını çalıştırmadan önce bu ortam değişkenlerini ayarlayın:

```sh
export PROMPTFOO_REMOTE_API_BASE_URL=http://your-server-address:3000
export PROMPTFOO_REMOTE_APP_BASE_URL=http://your-server-address:3000
```

`http://your-server-address:3000`'i self-hosted örneğinizin gerçek URL'siyle değiştirin (örəğin, yerel olarak çalıştırılıyorsa `http://localhost:3000`).

CLI'yi yapılandırdıktan sonra, değerlendirme sonuçlarını self-hosted örneğinize açıkça yüklemek gerekir:

1. Değerlendirme çalıştırmak için `promptfoo eval` çalıştırın
2. Sonuçları yüklemek için `promptfoo share` çalıştırın
3. Veya her iki işlemi tek bir komutta yapmak için `promptfoo eval --share` kullanın

Alternatif olarak, bu URL'leri `promptfooconfig.yaml` dosyanızda kalıcı olarak yapılandırın:

```yaml title="promptfooconfig.yaml"
# Self-hosted örneğinize paylaşım yapılandırın
sharing:
  apiBaseUrl: http://your-server-address:3000
  appBaseUrl: http://your-server-address:3000

prompts:
  - 'Tell me about {{topic}}'

providers:
  - openai:o4-mini
# ... config'in geri kalanı ...
```

### Yapılandırma Öncelik Sırası

promptfoo paylaşma hedef URL'sini bu sırayla çözümler (en yüksek öncelik ilk):

1. Yapılandırma dosyası (`sharing.apiBaseUrl` ve `sharing.appBaseUrl`)
2. Ortam değişkenleri (`PROMPTFOO_REMOTE_API_BASE_URL`, `PROMPTFOO_REMOTE_APP_BASE_URL`)
3. Bulut yapılandırması (`promptfoo auth login` aracılığıyla ayarlanır)
4. Varsayılan promptfoo bulut URL'leri

### Beklenen URL Formatı

Doğru şekilde yapılandırıldığında, self-hosted sunucunuz şu şekildeyer istekleri ele alır:

- **API Bitiş Noktası**: `http://your-server:3000/api/eval`
- **Web UI Bağlantısı**: `http://your-server:3000/eval/{evalId}`

## Gelişmiş Yapılandırma

### Eval Depolama Yolu

Varsayılan olarak, promptfoo SQLite veritabanını (`promptfoo.db`) `/home/promptfoo/.promptfoo` _konteyner içinde_ depolar. Konteyner yeniden başlatmaları arasında değerlendirmeleriniz kaydetmek için bu dizini hacimler kullanarak kalıcı depolamaya eşleştiğinden emin olun (Docker ve Docker Compose örneklerinde gösterildiği gibi).

Varsayılan olarak, promptfoo büyük ikili çıktıları (örneğin, görseller/ses) yerel dosya sistemine `/home/promptfoo/.promptfoo/blobs` altına dışsallaştırır ve satır içi base64'ü basit başvurularla değiştirir. Medyayı satır içi tutmak istiyorsanız (eski davranış), `PROMPTFOO_INLINE_MEDIA=true` ayarlayın. Medya yeniden başlatmaları arasında kalıcı olması için hacim eşleşmesinin `/home/promptfoo/.promptfoo/blobs`'ı içerdiğinden emin olun.

### Özel Yapılandırma Dizini

Varsayılan iç yapılandırma dizinini (`/home/promptfoo/.promptfoo`) `PROMPTFOO_CONFIG_DIR` ortam değişkenini kullanarak geçersiz kılabilirsiniz. Ayarlanırsa, promptfoo bu yolu _konteyner içinde_ hem yapılandırma dosyaları hem de `promptfoo.db` veritabanı için kullanır. Yine de bu özel yolu kalıcı bir hacme eşleştirmeniz gerekir.

**Örnek:** Verileri konteyner içinde `/app/data` depolayın, sunucu'da `./my_custom_data`'ya eşleyin.

```bash
# Sunucu dizinini oluştur
mkdir -p ./my_custom_data

# Konteyneri çalıştır
docker run -d --name promptfoo_container -p 3000:3000 \
  -v ./my_custom_data:/app/data \
  -e PROMPTFOO_CONFIG_DIR=/app/data \
  ghcr.io/promptfoo/promptfoo:latest
```

### Sağlayıcı Özelleştirmesi

Değerlendirme oluşturucu UI'sinde hangi LLM sağlayıcıların görünüdüğünü maliyet kontrolü, uyumluluk veya dahili ağ geçitleri yardımıyla yeniden yönlendirme için özelleştirin.

`.promptfoo` dizininizde (promptfoo.db` ile aynı konum) bir `ui-providers.yaml` dosyası koyun. Bu dosya bulunduğunda, UI'da yalnızca listelenen sağlayıcılar görünür.

**Örnek yapılandırma:**

```yaml title="ui-providers.yaml"
providers:
  # Basit sağlayıcı ID'leri
  - openai:gpt-5.1-mini
  - anthropic:messages:claude-sonnet-4-5-20250929

  # Etiketler ve Varsayılanlarla
  - id: openai:gpt-5.1
    label: GPT-5.1 (şirket Tarafından Onaylandı)
    config:
      temperature: 0.7
      max_tokens: 4096

  # Özel HTTP sağlayıcısı env var kimlik bilgileri ile
  - id: 'http://llm-gateway.company.com/v1'
    label: İç Ağ Geçidi
    config:
      method: POST
      headers:
        Authorization: 'Bearer {{ env.INTERNAL_API_KEY }}'
```

**Docker dağıtımı:**

```bash
docker run -d \
  --name promptfoo_container \
  -p 3000:3000 \
  -v ./promptfoo_data:/home/promptfoo/.promptfoo \
  -e INTERNAL_API_KEY=your-key \
  ghcr.io/promptfoo/promptfoo:latest

# ui-providers.yaml'u ./promptfoo_data/ dizinine koyun
cp ui-providers.yaml ./promptfoo_data/
```

**Kubernetes ConfigMap:**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: promptfoo-providers
data:
  ui-providers.yaml: |
    providers:
      - openai:gpt-5.1
      - anthropic:messages:claude-sonnet-4-5-20250929
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: promptfoo
spec:
  template:
    spec:
      containers:
        - name: promptfoo
          image: promptfoo/promptfoo:latest
          volumeMounts:
            - name: config
              mountPath: /home/promptfoo/.promptfoo/ui-providers.yaml
              subPath: ui-providers.yaml
      volumes:
        - name: config
          configMap:
            name: promptfoo-providers
```

:::info Davranış Değişiklikleri

`ui-providers.yaml` bulunduğunda:

- Yalnızca yapılandırılmış sağlayıcılar görünür (varsayılan ~600 sağlayıcının yerine)
- Değerlendirme oluşturucu'da "Yerel Sağlayıcıyı Referans Al" düğmesi gizlidir
- Yapılandırma önbelleklenmeleştirilir - değişikliklerin sonra yeniden başlatma gerekir: `docker restart promptfoo_container`

:::

:::caution Güvenlik - Kimlik Bilgileri

**API anahtarlarını ui-providers.yaml dosyasında SAKLAMAYIN**. Nunjucks sintiāksıyle ortam değişkenlerini kullanın:

```yaml
# ui-providers.yaml
providers:
  - id: 'http://internal-api.com/v1'
    config:
      headers:
        Authorization: 'Bearer {{ env.INTERNAL_API_KEY }}'
```

```bash
# Ortam aracılığıyla iletin
docker run -e INTERNAL_API_KEY=your-key ...
```

Kubernetes için, hassas veriler için Secrets kullanın (ConfigMaps değil).

:::

**Yapılandırma alanları:**

```yaml
providers:
  - id: string # Gerekli - Sağlayıcı tanımlıyıcı
    label: string # Seçme - Görüntülenecek ad
    config: # Seçme - Varsayılan ayarlar
      temperature: number # 0.0-2.0
      max_tokens: number
      # HTTP sağlayıcıları
      method: string # POST, GET, vb.
      headers: object # Özel başlıklar
      # Bulut sağlayıcıları
      region: string # AWS bölgesi, vb.
```

**Sağlayıcı ID biçimleri:**

- **OpenAI:** `openai:gpt-5.1`, `openai:gpt-5.1-mini`
- **Anthropic:** `anthropic:messages:claude-sonnet-4-5-20250929`
- **AWS Bedrock:** `bedrock:us.anthropic.claude-sonnet-4-5-20250929-v1:0`
- **Azure OpenAI:** `azureopenai:chat:deployment-name`
- **Özel HTTP:** `http://your-api.com/v1` veya `https://...`

Tam liste için [Sağlayıcı Belgeleri](/docs/providers/)'ne bakın.

**Sorun Giderme:**

**Sağlayıcılar güncellenmiyor:** Yapılandırma değişiklikleri sonra yeniden başlatma gerekir.

```bash
docker restart promptfoo_container
# veya: docker compose restart
# veya: kubectl rollout restart deployment/promptfoo
```

**Sağlayıcılar eksik:** Valdasyon hataları için günlükleri kontrol et:

```bash
docker logs promptfoo_container | grep "Invalid provider"
```

Yaygın sorunlar: eksik `id` alanı, geçersiz sağlayıcı ID biçimi, YAML sintiāksı hataları.

**Yapılandırma algılanmadı:** Dosya konumunu ve izinlerini doğruıla:

```bash
docker exec promptfoo_container ls -la /home/promptfoo/.promptfoo/
docker exec promptfoo_container cat /home/promptfoo/.promptfoo/ui-providers.yaml
```

Dosya adı `ui-providers.yaml` veya `ui-providers.yml` (Linux'ta büyük/küçük harf duyarlı) olmalıdır.

## Ters Vekil ile Taban Yolu Arkas\u0131nda Da\u011f\u0131t\u0131m

Promptfoo'yu bir URL \u00f6nekog gibi serve etmek i\u00e7in (`https://example.com/promptfoo/`), Docker g\u00f6r\u00fcnt\u00fcs\u00fcn\u00fc `VITE_PUBLIC_BASENAME` ile yeniden derle ve ters vekili\u0131 \u00f6nekog k\u0131rmas\u0131 i\u00e7in yap\u0131land\u0131r.

### G\u00f6r\u00fcnt\u00fcy\u00fc Derle

```bash
docker build --build-arg VITE_PUBLIC_BASENAME=/promptfoo -t my-promptfoo .
```

### Nginx Yapılandırması

```nginx
location /promptfoo/ {
    proxy_pass http://localhost:3000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### Traefik Yapılandırması

```yaml
http:
  routers:
    promptfoo:
      rule: 'PathPrefix(`/promptfoo`)'
      middlewares:
        - strip-promptfoo
      service: promptfoo
  middlewares:
    strip-promptfoo:
      stripPrefix:
        prefixes:
          - '/promptfoo'
  services:
    promptfoo:
      loadBalancer:
        servers:
          - url: 'http://promptfoo:3000'
```

`VITE_PUBLIC_BASENAME` yapı argumentı ön kurulușu yönlendirme, API çağrıları ve WebSocket bağlantıları için doğru yolları kullanacak şekilde yapılandırır.

## Özellikleri

### İstemci Gereksinimleri (Promptfoo CLI Çalıştırma)

- **İşletim Sistemi**: Linux, macOS, Windows
- **CPU**: 2+ çekirdek, 2.0GHz+ önerilir
- **GPU**: Gerekli değil
- **RAM**: 4 GB+
- **Depolama**: 10 GB+
- **Bağımlılıklar**: Node.js 20+, npm

### Sunucu Gereksinimleri (Web UI/API Barındırma)

Sunucu bileşeni opsiyoneldir; değerlendirmeleri yerel olarak veya CI/CD olmadan çalıştırabilirsiniz.

**Sunucu Makinesi:**

- **İşletim Sistemi**: Docker/Kubernetes çalıştırmak için çıktı herhangi bir İşletim Sistemi
- **CPU**: 4+ çekirdek önerilir
- **RAM**: 8GB+ (ağır kullanım için 16GB önerilir)
- **Depolama**: Konteyner hacimler ve veritabanı için 100GB+ önerilir (veritabanı hacmi için SSD önerilir)

## Sorun Giderme

### Konteyner Yeniden Başlattıktan Sonra Kayıp Veriler

**Sorun**: `docker compose down` veya konteyner yeniden başlatmalarından sonra değerlendirmeler kaybolur.

**Çözüm**: Bu, eksik veya yanlış hacim eşleştirmesini gösterir. `docker run` komutunuzun veya `docker-compose.yml` dosyanızın bir sunucu dizinini veya adlı hacmi konteyner içinde `/home/promptfoo/.promptfoo` (
veya `PROMPTFOO_CONFIG_DIR` ayarlanmışsa) eşlediğinden emin olun. Yukarıdaki örneklerde `volumes:` bölümünü inceleyin.

### Sonuçlar Self-Hosted UI'ında Görünümü Yok

**Sorun**: `promptfoo eval` çalıştırmak sonuçları yerel olarak depolar, self-hosted UI'da göstermez.

**Çözüm**:

1. Varsayılan olarak, `promptfoo eval` sonuçları yerel olarak depolar (`promptfoo view` çalıştırarak görün)
2. Sonuçları self-hosted örneğinize yükleme için, değerlendirmeden sonra `promptfoo share` çalıştırın
3. Bu yöntemlerden BİRİNİ kullanarak self-hosted örneğinizi yapılandırın:

   **Seçenek A: Ortam Değişkenleri (geçici)**

   ```bash
   export PROMPTFOO_REMOTE_API_BASE_URL=http://your-server:3000
   export PROMPTFOO_REMOTE_APP_BASE_URL=http://your-server:3000
   ```

   **Seçenek B: Yapılandırma Dosyası (kalıcı - önerilir)**

   ```yaml title="promptfooconfig.yaml"
   sharing:
     apiBaseUrl: http://your-server:3000
     appBaseUrl: http://your-server:3000
   ```

   `your-server`'i gerçek sunucu adresini ile değiştirin (örn. `192.168.1.100`, `promptfoo.internal.company.com`, vb.)

4. Şu çekilte çalıştırın: `promptfoo eval` bunu `promptfoo share`

:::tip Neler Bekleyin
`promptfoo share` çalıştırdıktan sonra şöyle bir çıktı görmelisiniz:

```
View results: http://192.168.1.100:3000/eval/abc-123-def
```

Bu URL'si self-hosted örneğinizi işaret eder, yerel görüntüleyiciyi değil.
:::

## Ayrıca Bakın

- [Yapılandırma Referansı](../configuration/reference.md)
- [Komut Satırı Arayüzü](./command-line.md)
- [Sonuçları Paylaşma](./sharing.md)