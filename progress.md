# 進捗ログ（美容室LINE自動応答bot）

## 2026-09-02

### やったこと

- **管理画面で「色が全く表示されない」不具合の調査・解決**
  - サーバー・コード側は完全に正常（curl・Playwrightでの自動ブラウザ再現テストいずれも問題なし）と判明
  - ユーザー側の切り分け（プライベートタブ、Safari「気を散らす項目を非表示」、Wi-Fi/回線）を一つずつ実施するも改善せず
  - Plan Modeで再調査 → Exploreサブエージェントによるコードの網羅的再監査でも原因見つからず（UA判定・CSPヘッダー・Service Worker等いずれも問題なし）
  - 調査中に見つけた軽微な実害のある不具合（`globals.css`のbodyルールがTailwind v4のcascade layer外にあり、フォント指定を無条件に上書きしていた）は修正
  - 最終的に、**devサーバー＋ngrokトンネルという一時的な構成自体が根本原因**と判断し、Vercelへの本番デプロイに切り替えることで解決
- **Vercelへの初回デプロイ**
  - Vercel CLIログイン、プロジェクトリンク（`mim2543/webapp`）
  - 必要な環境変数（LINE関連・Supabase・OpenAI・OWNER_LINE_USER_ID・ADMIN_PASSWORD）をすべてVercelのProduction/Preview環境に設定
  - ビルドエラー（`/admin/conversations`をビルド時に静的生成しようとしてSupabase接続エラー）を発見・修正。管理画面配下を`force-dynamic`に変更
  - Vercelのデフォルト保護機能（Vercel Authentication、SSOログイン要求）が有効だったため、ユーザーにダッシュボードで無効化してもらった上で本番デプロイ完了
  - **新しい本番URL: `https://webapp-six-omega-78.vercel.app`**（今後はこちらを使用。devサーバー・ngrokへの依存がなくなった）
- **UI改善**：FAQ一覧・メニュー一覧・会話ログ・お知らせ配信の各ページ左下に、画面に固定表示される「← 戻る」ボタンを追加（管理画面トップへ迷わず戻れるように）

### 次にやること

- **LINE Developers ConsoleのWebhook URLを新しいVercel本番URLに変更する必要あり**（`https://webapp-six-omega-78.vercel.app/api/line-webhook`）。これをやらないとLINEからのメッセージが届かない → ユーザーに依頼済み、実施状況は次回確認
- 今後の開発・確認作業は、devサーバー・ngrokではなくVercelへの都度デプロイ（`vercel deploy --prod`）で行う想定

### 困っていること / 質問

- 特になし

### 使用した Claude Code 機能

- Plan Mode（色消失バグの原因調査、根本原因が確認できるまで実装に進まないため）
- Exploreサブエージェント（コードベースの網羅的再監査）
- Playwright（本番/プレビュー環境の自動ブラウザ検証）
- Vercel CLI / MCP

## 2026-09-01

### やったこと

- devサーバー・ngrokを再起動して作業再開
- `OWNER_LINE_USER_ID`を設定（Supabaseのconversationsログから、過去のテスト送信者のLINE user IDを取得して設定）
- 削除ボタンを薄い赤色、編集ボタンを薄い緑色に変更（文字色は黒字を明示指定）
- オーナー通知メッセージから内部向けの注記文言（AI回答案・確信度低のため未送信）を削除。お客様向けと誤解される恐れがあったため
- 「お知らせ配信の確認ボタンが反応しない」不具合の根本原因を特定・修正
  - devサーバーを長期間再起動していなかったことによるキャッシュ破損を疑い、一度クリーン再起動 → メニュー削除ボタンは解消したが、配信確認ボタンだけ再現し続けた
  - Playwrightを導入し、実際にモバイル環境をエミュレートしてブラウザを自動操作・再現テストを実施
  - ローカル（localhost）では正常動作、**ngrok経由でのみ**発生することが判明。ブラウザのconsoleログに403エラーとHMR WebSocketの503エラーを発見
  - 原因はNext.jsの開発サーバーが持つセキュリティ機能（`allowedDevOrigins`）で、ngrokなどの未知のオリジンからのJSチャンク取得・HMR接続がブロックされ、クライアント側の状態更新（React hydration）が正しく動作していなかったこと
  - `next.config.ts`に`allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app"]`を追加して解消
  - Playwright等のデバッグ用ツール・スクリプトは作業後に削除済み（package.jsonへの影響なし）
- 修正後、実機で「お知らせ配信」を実際に送信し、LINEに届くことを確認（動作確認完了）

### 次にやること

- 特になし（今回予定していた不具合修正はすべて完了）
- 今後、新しいFAQ・メニューの追加や、追加機能の要望があれば都度対応

### 困っていること / 質問

- 特になし

### 使用した Claude Code 機能

- Supabase MCP（OWNER_LINE_USER_ID取得のためのログ確認）
- Bash経由でのPlaywright導入・自動ブラウザテスト（根本原因の特定に使用）

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
