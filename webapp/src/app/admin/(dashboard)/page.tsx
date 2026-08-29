import { ButtonLink } from "@/components/Button";

const menuItems = [
  {
    href: "/admin/faq",
    label: "FAQを編集する",
    desc: "よくある質問の追加・編集・削除",
    cardColor: "border-sky-400 bg-sky-50",
    buttonColor: "bg-sky-500 text-white hover:bg-sky-600",
  },
  {
    href: "/admin/menus",
    label: "メニューを編集する",
    desc: "メニュー・料金の追加・編集・削除",
    cardColor: "border-rose-400 bg-rose-50",
    buttonColor: "bg-rose-500 text-white hover:bg-rose-600",
  },
  {
    href: "/admin/conversations",
    label: "会話ログを見る",
    desc: "botとお客さんのやり取りを確認",
    cardColor: "border-emerald-400 bg-emerald-50",
    buttonColor: "bg-emerald-500 text-white hover:bg-emerald-600",
  },
  {
    href: "/admin/broadcast",
    label: "お知らせを送る",
    desc: "LINE友だち全員にお知らせを配信",
    cardColor: "border-amber-400 bg-amber-50",
    buttonColor: "bg-amber-500 text-white hover:bg-amber-600",
  },
];

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-3">
      {menuItems.map((item) => (
        <div
          key={item.href}
          className={`rounded-xl border-l-4 p-4 shadow-sm ${item.cardColor}`}
        >
          <p className="mb-1 text-sm text-stone-800">{item.desc}</p>
          <ButtonLink
            href={item.href}
            variant="plain"
            className={`w-full ${item.buttonColor}`}
          >
            {item.label}
          </ButtonLink>
        </div>
      ))}
    </div>
  );
}
