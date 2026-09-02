import Link from "next/link";
import { logout } from "@/app/admin/logout-action";

// ログイン必須の管理画面はビルド時に静的生成すべきではない（常に最新データを表示する必要があり、
// ビルド環境からのSupabase接続がエラーになるとビルド自体が失敗してしまうため）
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-stone-50">
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
        <Link href="/admin" className="text-base font-semibold text-stone-800">
          管理画面
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="min-h-11 rounded-lg px-3 text-sm text-stone-800 underline"
          >
            ログアウト
          </button>
        </form>
      </header>

      <main className="px-4 py-4">{children}</main>
    </div>
  );
}
