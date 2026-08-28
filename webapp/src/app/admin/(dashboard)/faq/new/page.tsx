import { FaqForm } from "../FaqForm";
import { createFaqAction } from "../actions";

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-stone-800">FAQを追加</h1>
      <FaqForm action={createFaqAction} />
    </div>
  );
}
