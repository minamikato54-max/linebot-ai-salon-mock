-- faq / menus / conversations テーブルを作成する
-- 美容室LINE自動応答bot: FAQ自動応答・メニュー案内・会話ログ（未対応時のオーナー転送判定用）

-- faq: よくある質問と回答（自動応答の元データ）
create table if not exists public.faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  keywords text[] not null default '{}', -- キーワードマッチ用（例: {"営業時間","何時"}）
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.faq is 'よくある質問と回答。bot応答のキーワードマッチ元データ';
comment on column public.faq.keywords is 'キーワードマッチに使う語のリスト';

-- keywords配列に対する検索を高速化
create index if not exists faq_keywords_idx on public.faq using gin (keywords);

-- menus: メニュー・料金一覧
create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price integer not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.menus is 'メニュー・料金一覧（半年に1回程度改定想定）';
comment on column public.menus.price is '税込価格（円）';

-- conversations: LINEでのやり取りログ（未対応質問のオーナー転送判定に使用）
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  line_user_id text not null,
  user_message text not null,
  bot_reply text,
  matched_faq_id uuid references public.faq (id) on delete set null,
  escalated boolean not null default false, -- botで回答できずオーナーへ転送したか
  created_at timestamptz not null default now()
);

comment on table public.conversations is 'LINEでのやり取りログ。escalated=trueはオーナーへ転送済みの未対応質問';
comment on column public.conversations.matched_faq_id is 'マッチしたFAQ（未対応の場合はnull）';

create index if not exists conversations_line_user_id_idx on public.conversations (line_user_id);
create index if not exists conversations_matched_faq_id_idx on public.conversations (matched_faq_id);
create index if not exists conversations_escalated_idx on public.conversations (escalated) where escalated = true;

-- Row Level Security
alter table public.faq enable row level security;
alter table public.menus enable row level security;
alter table public.conversations enable row level security;

-- faq / menus: 誰でも閲覧可（bot・将来の案内ページ等から参照するため）。書き込みはservice_role経由のみ（Supabase StudioまたはAPIから管理）
create policy "faq is publicly readable"
  on public.faq for select
  to anon, authenticated
  using (true);

create policy "menus is publicly readable"
  on public.menus for select
  to anon, authenticated
  using (true);

-- conversations: 顧客とのやり取りログのため anon/authenticated には一切の権限を与えない。
-- LINE Webhook（サーバー側）は SUPABASE_SERVICE_ROLE_KEY を使い、RLSをバイパスして読み書きする。
