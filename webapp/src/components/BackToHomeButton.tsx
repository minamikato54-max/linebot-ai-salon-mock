import Link from "next/link";

// 各セクションの入り口ページ（FAQ一覧・メニュー一覧・会話ログ・お知らせ配信）で、
// 管理画面トップへ迷わず戻れるように画面左下に固定表示するボタン
export function BackToHomeButton() {
  return (
    <Link
      href="/admin"
      className="fixed bottom-4 left-4 z-20 inline-flex min-h-11 items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-md ring-1 ring-stone-200"
    >
      ← 戻る
    </Link>
  );
}
