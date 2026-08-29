# 進捗ログ（美容室LINE自動応答bot）

## 2026-08-29

### やったこと

- devサーバー・ngrokを再起動し、動作確認できる状態に復旧
- オーナー通知メッセージのラベル表記ミス（Claude回答案→AI回答案）を修正・コミット
- 管理画面のデザインを試行錯誤しながら調整
  - アイコン・タイル型グリッド・グラデーションヘッダー等を使った大きめのデザイン刷新を一度実施→「見づらい」とのフィードバックで前回の作りまで完全に差し戻し
  - そこから小さな変更を1つずつ積み重ねる方針に切り替え
  - ホーム画面の4項目（FAQ/メニュー/会話ログ/お知らせ配信）に、それぞれ異なる色（水色・ピンク・グリーン・アンバー）の背景＋左枠線を追加
  - 各項目のボタンの色を、背景色に合わせた同系色（水色背景→水色ボタン、等）に変更。ボタンの色味は薄すぎ（見えない）→濃すぎ（主張が強い）を経て、背景と揃える形に着地
  - 管理画面下部のタブバーを削除（ホーム画面の4項目と内容が重複するため）。ヘッダーの「管理画面」タップでホームに戻れるように変更
  - `Button`コンポーネントに`variant="plain"`を追加し、呼び出し側で自由に色指定できるようにした（ホーム画面の個別配色に使用）
- 型チェック・ESLintは各変更のたびに確認、いずれも問題なし

### 次にやること

- お知らせ配信の確認ボタン・メニュー削除ボタンについて、実機での最終確認（今回のデザイン調整中に触れられていないため、次回リマインドして確認する）
- `OWNER_LINE_USER_ID`の設定（未対応質問のオーナー通知を実際に使う場合）

### 困っていること / 質問

- 特になし

### 使用した Claude Code 機能

- Plan Mode

## 2026-08-28

### やったこと

- FAQ回答生成をClaude Haiku 4.5からOpenAI API（gpt-4o-mini、モデル名は環境変数化）に切り替え
  - `src/lib/openai.ts`新規、`src/lib/answerGenerator.ts`をOpenAI Chat Completions（json_object + Zod手動バリデーション）方式に書き換え
- LINE Webhookの原因不明の応答なし不具合を調査・解消（devサーバー初回リクエスト時のTurbopack起因の一過性エラーと判明。実際のWebhookリクエストを自前で組み立てて再現・切り分け）
- オーナー向け管理画面（`/admin`）を新規実装
  - 共通パスワードによる簡易ログイン（`ADMIN_PASSWORD`、Cookieセッション）
  - FAQ CRUD・メニューCRUD・会話ログ閲覧・お知らせ一斉配信（LINE `broadcast`）の4画面
  - スマホ操作を前提に、タップ領域44px以上・処理中スピナー表示・一斉配信の2段階確認を実装
  - Next.js 16の`middleware`→`proxy`への名称変更に対応（Node.jsランタイムで`crypto`使用可能に）
- 管理画面から実際にFAQトップ5・メニュー3件を投入し、bot回答が確信度「高」で返ることを確認（無関係な質問は確信度「低」でエスカレーションされることも確認）
- ユーザーからの実機フィードバックに基づき2件を修正
  - 入力欄の文字色が薄く読みにくい問題 → 原因はcreate-next-app初期テンプレートのダークモード設定の残存。`globals.css`から削除し、各入力欄にも明示的に文字色指定
  - お知らせ配信画面の「内容を確認する」ボタンが反応しない問題 → スマホのキーボード表示時に下部固定ナビと重なる可能性を修正（`min-h-dvh`化、余白調整）。**要・実機再確認**
- ngrok接続が不安定になった際の切り分け・再起動対応

### 次にやること

- お知らせ配信の確認ボタン不具合が直ったか、キーボード有無それぞれで実機確認
- メニュー一覧の削除ボタンが反応しない不具合の原因調査・修正
- 「答えられない質問時のオーナーへの通知内容」についての質問に回答する（現状：LINEのpushメッセージでオーナー個人アカウントに質問内容とAIの回答案が届く仕様。`OWNER_LINE_USER_ID`未設定のため実地確認はまだ）

### 困っていること / 質問

- 特になし（ユーザーからの質問「答えられない質問へのオーナー通知」は次回回答予定）

### 使用した Claude Code 機能

- Plan Mode / Supabase MCP / claude-apiスキル

## 2026-08-27

### やったこと

- SUPABASE_SERVICE_ROLE_KEYを`.env.local`に設定
- LINE Developersチャネル接続：ngrokでlocalhost:3000を公開し、Webhook URLをLINE Developers Consoleに設定・検証
- Echo応答の実機動作確認（LINEアプリから送信したメッセージがそのまま返信されることを確認、devサーバーログでも200応答を確認）
- Claude API連携によるFAQ自動応答を実装
  - `src/lib/claude.ts`：Anthropicクライアント初期化
  - `src/lib/faq.ts`：Supabaseからfaq/menus全件取得
  - `src/lib/answerGenerator.ts`：Claude Haiku 4.5 + 構造化出力（Zod）でcategory/confidence（高中低）/answer/matchedFaqIdを生成
  - `src/app/api/line-webhook/route.ts`：Echo実装から本実装（FAQ検索→Claude回答生成→確信度が低い場合はオーナーへpush通知＋顧客には保留メッセージ、それ以外はClaude回答をそのまま返信、いずれもconversationsテーブルへ記録）に置き換え
  - 型チェック（`tsc --noEmit`）通過を確認
- 使用モデルはClaude Haiku 4.5を選定（低コスト重視の当初予算方針に合わせてユーザーが選択）

### 次にやること

- `ANTHROPIC_API_KEY` / `OWNER_LINE_USER_ID` を `.env.local` に設定
- LINEアプリからの実機テスト（FAQ該当質問／メニュー質問／該当なし質問の3パターンでconfidence判定とエスカレーションを確認）

### 困っていること / 質問

- 特になし

### 使用した Claude Code 機能

- Plan Mode / Supabase MCP / claude-apiスキル

## 2026-08-26

### やったこと

- Supabaseにfaq / menus / conversationsテーブルを作成（RLS有効、migration適用）
- faq/menusはanon・authenticatedに公開読み取り権限を付与、conversationsはservice_role専用に設定
- テーブル作成後、Supabase側で3テーブルが想定通り反映されていることを確認

### 次にやること

- FAQ判定ロジック（キーワードマッチ）の実装（wbs.md 3-2）
- Supabaseのfaqテーブルからのデータ取得処理の実装（wbs.md 3-3）

### 困っていること / 質問

- 特になし

### 使用した Claude Code 機能

- Supabase MCP
