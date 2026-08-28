import { ButtonLink } from "@/components/Button";

const menuItems = [
  {
    href: "/admin/faq",
    label: "FAQを編集する",
    desc: "よくある質問の追加・編集・削除",
  },
  {
    href: "/admin/menus",
    label: "メニューを編集する",
    desc: "メニュー・料金の追加・編集・削除",
  },
  {
    href: "/admin/conversations",
    label: "会話ログを見る",
    desc: "botとお客さんのやり取りを確認",
  },
  {
    href: "/admin/broadcast",
    label: "お知らせを送る",
    desc: "LINE友だち全員にお知らせを配信",
  },
];

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-3">
      {menuItems.map((item) => (
        <div key={item.href} className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-1 text-sm text-stone-800">{item.desc}</p>
          <ButtonLink href={item.href} className="w-full">
            {item.label}
          </ButtonLink>
        </div>
      ))}
    </div>
  );
}
