import { notFound } from "next/navigation";
import { getMenuById } from "@/lib/faq";
import { MenuForm } from "../../MenuForm";
import { updateMenuAction } from "../../actions";

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const menu = await getMenuById(id);

  if (!menu) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-stone-800">
        メニューを編集
      </h1>
      <MenuForm action={updateMenuAction.bind(null, id)} defaultValues={menu} />
    </div>
  );
}
