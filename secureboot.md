Linuxでセキュアブートを使う
===

悪意あるメイドから身を守るために。

# セキュアブートって？

電源が投入されると、いわゆるファームウエア/BIOSと呼ばれるものが、ブートローダーを起動します。
ブートローダーは、OSを起動するときの引数や詳細設定、起動するOSを選択する役割を持ちます。

Windowsなどでは、「コンピューターの修復」などの場合を除き、特に画面には何も表示されずブートローダーがOSを起動します。

信頼していないOSを、パソコンで実行しないための仕組みがSecure Bootです。
Secure Bootは、ブートローダーを起動する前に、ブートローダーが特定の証明書を持っているか（電子署名されているか）を判断したのちに、ブートローダーを起動します。

これにより、信頼できないブートローダー（改ざんされたブートローダー）を起動しない仕組みになっています。
信頼しているブートローダーであれば、信頼しているOSを実行する、ということが前提となっています。

# Secure Bootの現状
ほとんどのパソコンは、工場出荷時にMicrosoft Windowsがインストールされています。
またSecure Bootも、Microsoftの署名のみ受け付けるような設定が埋め込んであります。

つまり、その時点ではLinuxなどWindows以外のOSを起動するためにはSecure Bootを無効化する必要があります。
Linuxをインストールする際に無効化した覚えのある方は多いのではないでしょうか。

今回は、Linux環境でSecure Bootを有効化する手法を説明していきます。

両方共、実際の設定方法やコマンドなどは、Archwikiや英語ドキュメントが充実しているため、あえてここでは説明しません。

- https://wiki.archlinux.jp/index.php/%E3%82%BB%E3%82%AD%E3%83%A5%E3%82%A2%E3%83%96%E3%83%BC%E3%83%88
- https://www.rodsbooks.com/efi-bootloaders/secureboot.html

# 方法1. 署名済みブートローダーを使う

Microsoftが署名している、他のブートローダーをチェインブートできるブートローダーが存在します。

PreLoader と Shim の2つがそれに当たります。

この方式は、カーネルやブートローダーをアップデートするたびにハッシュを更新し登録します。

# 方法2. 自分でカーネルとブートローダーに署名する

証明局方式で、鍵を生成したあとに、BIOSで証明書の設定を行います。

その後、その鍵で署名した別の鍵でカーネル vmlinuzとgrub.efiに署名を行います。
カーネルやブートローダーをアップデートするたびに、署名を更新します。

BIOSに証明証を登録する作業は、BIOSにパスワードが設定されていないと誰でも上書きできてしまいます。

# トラストチェーンの考え方

両方とも、事前にOS起動時に、暗号的に署名した/ハッシュ登録したバイナリを、OS起動前のシステムで認証させています。
そのため、OS全体をハードウェア暗号化している場合は、ブートローダーで解除することになります。

このおかげで、
暗号化されたファイルシステムとOSがブートローダーを、
改ざんされていないブートローダーが安全な復号化のプロンプトの表示とカーネルの固定を、
パスワードを設定したBIOSがSecure Boot電子証明証の管理と、ブートローダーが改ざんされていない証明を行います。

そのため、互いに安全な状態を作り出せます。

# 悪意あるメイド攻撃(Evil Maid Attack)とは

物理的にドライブを盗む攻撃とは違い、ブートローダーやOSに改ざんを加えられたあとに持ち主が気づかずにそのまま起動してしまう攻撃です。

通常、ドライブを盗む攻撃では、暗号化されている場合に復号化パスフレーズを総当りなどで特定する必要があります。

しかし、悪意あるメイド攻撃では、ブートローダーのパスワード入力画面を改ざんし、キーロガーを介入させることができます。そのため、しばらくしたのちメイドはパソコンを回収し総当りなくハードドライブの復号化を行えます。