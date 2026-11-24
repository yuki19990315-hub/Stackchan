# サンニー版 Stack-chan

Waveshare ESP32-S3-Touch-LCD-1.28 向け個人用移植。非公式。Pocket-Worldとは独立。元プロジェクトには変更・PRを送らない。

上流: [stack-chan/stack-chan v2.1.0](https://github.com/stack-chan/stack-chan/tree/v2.1.0), commit `b050a44592ab847f0f4c2ceb6eb350a02bcb609a` (Apache-2.0)。表情・行動・MOD等は上流のコードを維持し、端末依存部を移植する。

現状: 移植中。表情診断アプリ、タッチ・IMU、独立I2S音声診断を追加。ビルド・実機未検証。フラッシュ禁止。Pocket-Worldのファイルとフラッシュ全体をバックアップしてから別途実機導入する。

リポジトリが公開設定の間は個人情報、Wi-Fi認証情報、AI APIキーをコミットしない。GitHub Pagesや外部配布は使用しない。

[移植仕様と進捗](docs/PORTING.md) / [音声診断](diagnostics/audio/README.md)
