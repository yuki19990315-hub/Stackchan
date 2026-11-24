# 移植の現状

上流 Stack-chan v2.1.0 を git submodule として固定。ソース・素材・MODを改変せず取得する方式。
これはファームウェア移植の初期段階であり、ビルド可能性・実機動作はまだ確認していない。

- 液晶: Moddable GC9A01ドライバー、SPI GPIO10/11、CS9 DC8 RST14 BL2、240x240。
- タッチ: CST816S (0x15)、I2C GPIO6/7、RST13 INT5。ポーリング方式の暫定provider。
- IMU: SDK QMI8658ドライバー、0x6B/0x6A候補。実機の向き・単位を要確認。
- ESP32-S3R2: 16 MiB Flash / 2 MiB PSRAM (quad)。SDKとパーティション適合を確認する。
- 音声: INMP441とMAX98357A。GPIO15 BCLK/16 WS を共有、17入力・18出力の候補。I2Sフルデュプレックスではサンプルレートとスロット幅を揃える必要がある。24-bitマイクを32-bitスロットで取得し、PCM変換を検証する。既存M5Stack用コーデック設定を流用しない。未実装・配線未確認。
- MAX98357A電源は供給電流とスピーカー定格確認後に決定。スピーカー出力のマイナスをGNDに接続しない。
- カメラ/サーボは未接続。サーボdriver none。
- AI: 本家の通常クラウド会話処理を優先。CoreS3専用WebRTC依存部は2 MiBで検証するまで有効化しない。Grok追加は未実装。
- UI: 円形表示で端が欠けないよう本家の表情・設定画面を検証し、必要箇所のみ調整する。

## 取得とビルド試行
`git clone --recurse-submodules <repository>`
または `git submodule update --init --recursive`
上流 firmware/README.md のSDK導入手順を適用し、firmwareでnpm ci。
このリポジトリ直下で `node --test tests/board.test.mjs`。
`node scripts/build-display.mjs` はビルドのみを行う試験用コマンド。ビルド環境は未検証。SDKのバージョン・ターゲット認識・ホストprovider統合・リンク・空きRAMの確認が残る。
自動フラッシュは行わない。実機では先にMicroPythonファイルとフラッシュ全体をバックアップし、復元方法を確認する。

参考: https://docs.waveshare.com/ESP32-S3-Touch-LCD-1.28
上流: https://github.com/stack-chan/stack-chan/tree/v2.1.0
SDK: https://github.com/Moddable-OpenSource/moddable
