import { getAllFaq } from "@/lib/faq";
import { ButtonLink } from "@/components/Button";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteFaqAction } from "./actions";

export default async function FaqListPage() {
  const faqRows = await getAllFaq();

  return (
    <div className="flex flex-col gap-3">
      <ButtonLink href="/admin/faq/new">＋ 新しいFAQを追加</ButtonLink>

      {faqRows.length === 0 && (
        <p className="text-sm text-stone-800">まだFAQが登録されていません。</p>
      )}

      {faqRows.map((faq) => (
        <div key={faq.id} className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-1 font-medium text-stone-800">{faq.question}</p>
          <p className="mb-3 whitespace-pre-wrap text-sm text-stone-800">
            {faq.answer}
          </p>
          {faq.keywords.length > 0 && (
            <p className="mb-3 text-xs text-stone-500">
              キーワード: {faq.keywords.join(" / ")}
            </p>
          )}
          <div className="flex gap-2">
            <ButtonLink href={`/admin/faq/${faq.id}/edit`} variant="secondary">
              編集
            </ButtonLink>
            <DeleteButton action={deleteFaqAction.bind(null, faq.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}
