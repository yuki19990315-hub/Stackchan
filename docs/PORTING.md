# 移植の現状

上流 Stack-chan v2.1.0 を git submodule として固定。ソース・素材・MODを改変せず取得する方式。
これはファームウェア移植の初期段階であり、ビルド可能性・実機動作はまだ確認していない。

- 液晶: Moddable GC9A01ドライバー、SPI GPIO10/11、CS9 DC8 RST14 BL2、240x240。
- タッチ: CST816S (0x15)、I2C GPIO6/7、RST13、INT5（Rev3回路図確認済み・使用しない）。ポーリング方式の暫定provider。
- IMU: SDK QMI8658ドライバー、0x6B/0x6A候補。実機の向き・単位を要確認。
- ESP32-S3R2: 16 MiB Flash / 2 MiB PSRAM (quad)。SDKとパーティション適合を確認する。
- 音声: INMP441とMAX98357A。独立ESP-IDF診断を diagnostics/audio に追加（未ビルド）。GPIO15 BCLK/16 WS を共有、17入力・18出力の候補。I2Sフルデュプレックスではサンプルレートとスロット幅を揃える必要がある。24-bitマイクを32-bitスロットで取得し、PCM変換を検証する。既存M5Stack用コーデック設定を流用しない。未実装・配線未確認。
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

## 追加検証
Rev3回路図ではGPIO5がTP_INTとオプションのMOSFET回路に接続される。GPIO5は予約済みとし、駆動せずタッチはポーリング。CST816Sの不正サンプルを無視する。音声の標準SDKドライバーはそれぞれI2Sクロックを所有するため、共通クロックのフルデュプレックス診断は独立したネイティブI2Sにする。`node --test tests/*.test.mjs` でホストテスト。正式な上流ビルド、円形UI、音声ブリッジ、実機確認は未完了。Rev3回路図のP2コネクタ7=GPIO15、8=GPIO16、9=GPIO17、10=GPIO18、11=GPIO21、12=GPIO33、6=3V3、1/5=GND、2=VSYS。現物の基板リビジョンと向き・電源は要確認。USB給電中にVSYS/3V3へ外部電源を入力しない。出典: https://files.waveshare.com/wiki/ESP32-S3-Touch-LCD-1.28/ESP32-S3-Touch-LCD-1.28-Sch.pdf

## 表情の独立テスト
`npm run build:face` は本家SimpleFace、FaceBehavior（瞬き・呼吸・視線）をそのまま利用し、左20・上60に配置する円形液晶向けの診断アプリ。タッチで通常と喜びを切替える。音声・モーター・ネットなし。`npm run build:host` は全体ホストのビルド試行用で、音声GPIOを安全に統合するまで実機書き込み禁止。どちらもビルド未実行。SDKは上流CIの指定10.1.0を使用する。`bash scripts/test-host.sh` でJSとPCMのPCテストを実行。

## 固定SDKと円形表示の追加対策
ビルドスクリプトは上流コミットとSDKバージョンを確認し、不一致なら終了する。全体ホストはコンパイル試行のみ。上流AudioOut/AudioInの既定GPIOがサンニーの液晶等に衝突する可能性があるため、I2S統合と未対応機器の能力制御が完了するまで全体ホストを書き込まない。`port/sanny/circle-layout.js` は円形表示の安全領域を計算する独立モジュール。固定位置のメニューやQR、設定画面を調整する際に使用する。現段階では全体UIに未統合。端末の実際の光学表示範囲・方向は実機確認が必要。
