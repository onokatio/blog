人生15回目ぐらいの#ArchlinuxInstallBattle設計
===

/で`sudo rm -rf *`を実行してしまい、OSが吹き飛んだので再インストールします。
これで何回目になるか…。
毎回OSをインストールする際には、前回のArchlinuxInstallBattle時には使わなかった機能などを有効にしているため、今回も初めて使ってみる構成や機能が追加されています。

# ディスク設計

NVMe SSD 256GBが積んであります。

メインの構成として、btrfs over LVM over LUKS構成を採用します。 
理由として、暗号化が手軽、管理が手軽という点が挙げられます。

## 暗号化について

LUKSでLVM全体を暗号化します。

また、initramfsやkernel、micro codeを置くパーティションと、grubをインストールするパーティションを分割し、前者を暗号化、後者をSecure Bootします。

## パーティション設計

nvme直下に、EFIパーティション、ext4パーティション、lvmパーティションをそれぞれ作ります。
最初がgrubインストール用、2つ目がカーネル/initramfs用、最後がメインのOS保存用です。

また、暗号化するためにLVMをluksで開き、スワップパーティションとルート用パーティションを論理ボリュームとして作ります。

ルート用パーティションには、先述した様にbtrfsを採用します。

btrfsのサブボリュームとして、/、/.snapshot、/var、/home等を作成し、OSをインストールします。

# OS

インストールするOSはArchlinuxです。

## 他のOSと比較してやめた理由

- Chromium OS: 正規のChrome OSではないのでOSアップデートが手間、もしくはオープンソースでない企業の派生OSを入れる必要がある
- Gentoo : USEフラグは魅力があるが、パッケージをビルドし直すのは結構時間の損失だと思う
- Windows: いっそのことWindowsをインストールすることを考えたが、そもそも生活上Linuxが必要になることが多いため諦めた。WSL2.0もあるが、そこまでするならLinuxをインストールしたほうが早い。
今のところWindowsでしか動かないソフトは日常で使用していないので問題ない。

- Android x86:
そもそもChrome OSを検討した理由はAndroidが動くことと、システムに込み入ったことがあまりできない（壊しにくい）点だった。そのためAndroid x86も検討したが、経験がないのとバグが多そうなことによりやめ。

# バックアップ/障害対策

etcにはetckeeperを入れ、定期的にリモートにpushします。

サブボリュームである/や/homeは、snapperで差分inode管理し、定期的なバックアップを取得します。
また、ここで取得したバックアップは外部HDDやDVDに保管するものとします。

# OSを利用する上で選んだ各パッケージ

ネットワーク: NetworkManager
GUI: X11
音: pulseaudio

# ウィンドウマネージャ

xfce + comptonを採用。理由は特にない。

# カーネル

特に理由はなくArch標準のcore/linuxを使用します。
