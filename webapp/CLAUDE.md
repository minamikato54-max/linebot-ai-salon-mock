@AGENTS.md

# プロジェクトルール（美容室LINE自動応答bot）

## このプロジェクトについて

美容室オーナー様向けLINE自動応答botの**練習実装**。クライアント向け提案書（`../proposal.md`）とは技術構成が異なる点に注意。

- **提案書（`../proposal.md`, `../sample_hearing_qa.md`）**: クライアントへの提案用文書。Python(FastAPI) + Google Cloud Run + Googleスプレッドシートという構成を提示している。
- **本実装（このディレクトリ）**: 練習・ポートフォリオ用に、普段使い慣れたNext.js + Supabaseスタックで構築する。**機能要件（FAQ自動応答・未対応時のオーナー転送等）は提案書に準拠するが、技術スタックは異なる**。この違いを他の資料で混同しないこと。

## 技術スタック

- Next.js（App Router）+ TypeScript + Tailwind CSS
- Supabase（DB: faq / menus / conversations テーブル）
- LINE Messaging API（Webhook）
- デプロイ: Vercel想定

## 命名規則

- **コンポーネント**: PascalCase、ファイル名もコンポーネント名と一致させる（例: `FaqList.tsx`）
- **関数・変数**: camelCase（例: `getFaqByKeyword`）
- **DBテーブル・カラム**: snake_case（Postgres/Supabase標準に合わせる。例: `faq`, `created_at`）
- **APIルート**: kebab-case（例: `src/app/api/line-webhook/route.ts`）
- **環境変数**: UPPER_SNAKE_CASE、`.env.local` に定義し絶対にコミットしない

## 配色（プレースホルダー）

クライアントからのブランドカラー指定がないため、美容室らしい落ち着いた配色を仮設定。実際の案件では要ヒアリング。

| 用途             | Tailwindクラス | カラーコード |
| ---------------- | -------------- | ------------ |
| プライマリ       | `rose-500`     | `#f43f5e`    |
| プライマリ（濃） | `rose-700`     | `#be123c`    |
| 背景             | `stone-50`     | `#fafaf9`    |
| テキスト         | `stone-800`    | `#292524`    |
| アクセント       | `amber-400`    | `#fbbf24`    |
| エラー           | `red-500`      | `#ef4444`    |

## コーディング規約

- デフォルトはServer Components。クライアント側の状態・イベントが必要な場合のみ `'use client'` を付与
- TypeScriptは `any` を使わない。Supabaseの型は `mcp__supabase__generate_typescript_types` 等で生成して利用
- Supabaseクライアントは `src/lib/supabase.ts` に集約し、各所で個別に初期化しない
- APIルート（Webhook等）は `src/app/api/` 配下に配置
- 外部秘密情報（LINEチャネルシークレット、Supabase Service Roleキー等）は必ず環境変数経由。コード直書き禁止
- コミットメッセージは日本語で `<スコープ>: <内容>`（例: `webapp: Echo応答のWebhook実装`）。親リポジトリ（AIテスト）の既存コミット規約に合わせる
