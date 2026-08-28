import { SubmitButton } from "@/components/SubmitButton";

export function FaqForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: { question: string; answer: string; keywords: string[] };
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm text-stone-800" htmlFor="question">
          質問
        </label>
        <input
          id="question"
          name="question"
          type="text"
          required
          defaultValue={defaultValues?.question}
          className="min-h-11 w-full rounded-lg border border-stone-300 px-3 text-base text-stone-800"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-800" htmlFor="answer">
          回答
        </label>
        <textarea
          id="answer"
          name="answer"
          required
          rows={4}
          defaultValue={defaultValues?.answer}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-base text-stone-800"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-800" htmlFor="keywords">
          キーワード（カンマ区切り。この質問に関連する言葉を入れてください）
        </label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          placeholder="例：営業時間, 何時"
          defaultValue={defaultValues?.keywords.join(", ")}
          className="min-h-11 w-full rounded-lg border border-stone-300 px-3 text-base text-stone-800"
        />
      </div>

      <SubmitButton>保存する</SubmitButton>
    </form>
  );
}
