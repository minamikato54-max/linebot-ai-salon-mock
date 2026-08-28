import { notFound } from "next/navigation";
import { getFaqById } from "@/lib/faq";
import { FaqForm } from "../../FaqForm";
import { updateFaqAction } from "../../actions";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await getFaqById(id);

  if (!faq) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-stone-800">FAQを編集</h1>
      <FaqForm action={updateFaqAction.bind(null, id)} defaultValues={faq} />
    </div>
  );
}
