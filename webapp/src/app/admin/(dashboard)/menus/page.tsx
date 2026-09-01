import { getAllMenus } from "@/lib/faq";
import { ButtonLink } from "@/components/Button";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteMenuAction } from "./actions";

export default async function MenusListPage() {
  const menus = await getAllMenus();

  return (
    <div className="flex flex-col gap-3">
      <ButtonLink href="/admin/menus/new">＋ 新しいメニューを追加</ButtonLink>

      {menus.length === 0 && (
        <p className="text-sm text-stone-800">
          まだメニューが登録されていません。
        </p>
      )}

      {menus.map((menu) => (
        <div key={menu.id} className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-1 font-medium text-stone-800">
            {menu.name}　{menu.price.toLocaleString()}円
          </p>
          {menu.description && (
            <p className="mb-3 whitespace-pre-wrap text-sm text-stone-800">
              {menu.description}
            </p>
          )}
          <div className="flex gap-2">
            <ButtonLink
              href={`/admin/menus/${menu.id}/edit`}
              variant="plain"
              className="bg-green-100 text-black"
            >
              編集
            </ButtonLink>
            <DeleteButton action={deleteMenuAction.bind(null, menu.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}
