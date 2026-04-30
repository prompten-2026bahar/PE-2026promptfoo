# Oturum Yönetimi (Session Management)

Oturum yönetimi; Crescendo ve GOAT gibi çok turlu (multi-turn) stratejilerimiz için önemlidir. Bu durumlarda, hedef sistemin turlar arasında bağlamı (context) koruyabildiğinden emin olmanız gerekir.

Oturumların oluşturulabileceği iki yöntem vardır:

1.  İstemci Taraflı Oturum (Client Side Session)
2.  Sunucu Taraflı Oturum (Server Side Session)

## İstemci Taraflı Oturum Yönetimi

HTTP veya WebSocket gibi bir Promptfoo sağlayıcısı kullanıyorsanız, Promptfoo her bir test senaryosu için benzersiz bir UUID oluşturmak üzere yerleşik bir işleve sahiptir. Bu UUID, turlar arasındaki bağlamı sürdürmek için kullanılabilir.

Ayrıntılar için [İstemci Taraflı Oturum Yönetimi (Client Side Session Management)](https://promptfoo.dev) belgelerindeki talimatları izleyin.

## Sunucu Taraflı Oturum Yönetimi

Promptfoo, yanıttan Oturum Kimliğini (Session ID) ayıklamak ve bunu bir sonraki tura aktarmak için araçlar sağlar.

Ayrıntılar için [Sunucu Taraflı Oturum Yönetimi (Server Side Session Management)](https://promptfoo.dev) belgelerindeki talimatları izleyin.
