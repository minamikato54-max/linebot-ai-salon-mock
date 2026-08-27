# 美容室LINE自動応答bot（練習実装）

美容室オーナー様向けLINE bot案件の練習実装。機能要件は `../proposal.md` に準拠するが、技術スタックはNext.js + Supabase（詳細は `CLAUDE.md` を参照）。

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

プロジェクト直下に `.env.local` を作成し、以下を設定する（`.env.local` は `.gitignore`済みでコミットされない）。

```
LINE_CHANNEL_SECRET=
LINE_CHANNEL_ACCESS_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# conversationsテーブルの読み書き用（RLSをバイパスするサーバー専用シークレット。NEXT_PUBLIC_を付けない）
SUPABASE_SERVICE_ROLE_KEY=
```

### 3. LINE Developersでのチャネル作成・Webhook設定（手動作業）

1. [LINE Developers Console](https://developers.line.biz/console/) にログインし、プロバイダーを作成（既存があれば流用）
2. 新規チャネル作成 → **Messaging API** を選択
3. チャネル基本設定タブから **チャネルシークレット** を取得 → `LINE_CHANNEL_SECRET` に設定
4. Messaging API設定タブから **チャネルアクセストークン（長期）** を発行 → `LINE_CHANNEL_ACCESS_TOKEN` に設定
5. 開発中はローカルサーバーを外部公開する必要があるため、`ngrok` 等で `http://localhost:3000` を公開する
   ```bash
   ngrok http 3000
   ```
6. Messaging API設定タブの **Webhook URL** に `https://<ngrokの発行URL>/api/line-webhook` を設定 → 「検証」で疎通確認
7. 「Webhookの利用」をオンにする
8. 応答メッセージ設定で、LINE公式アカウントのデフォルト応答（あいさつメッセージ等）を必要に応じてオフにする（bot側の応答と重複するため）
9. 本番デプロイ後は、Webhook URLをVercelの本番URL（例: `https://<project>.vercel.app/api/line-webhook`）に更新する

### 4. 開発サーバー起動

```bash
npm run dev
```

Webhookエンドポイント: `POST /api/line-webhook`（現状はEcho実装 = 受信メッセージをそのまま返信）

## 動作確認

1. 上記セットアップ完了後、LINE公式アカウントを友だち追加
2. 任意のテキストメッセージを送信
3. 送信したメッセージがそのまま返信されればOK

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [LINE Messaging API Documentation](https://developers.line.biz/en/docs/messaging-api/)
- [Supabase Documentation](https://supabase.com/docs)
