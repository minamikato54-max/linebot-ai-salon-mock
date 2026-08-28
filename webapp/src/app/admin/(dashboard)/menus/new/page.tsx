import { MenuForm } from "../MenuForm";
import { createMenuAction } from "../actions";

export default function NewMenuPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-stone-800">
        メニューを追加
      </h1>
      <MenuForm action={createMenuAction} />
    </div>
  );
}
