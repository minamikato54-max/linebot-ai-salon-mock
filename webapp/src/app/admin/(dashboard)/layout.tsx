import Link from "next/link";
import { logout } from "@/app/admin/logout-action";

const navItems = [
  { href: "/admin", label: "ホーム" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/menus", label: "メニュー" },
  { href: "/admin/conversations", label: "会話ログ" },
  { href: "/admin/broadcast", label: "お知らせ配信" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-stone-50 pb-28">
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
        <span className="text-base font-semibold text-stone-800">管理画面</span>
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

      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-stone-200 bg-white">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-11 flex-1 items-center justify-center px-1 py-2 text-center text-xs text-stone-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
