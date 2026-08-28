import { SubmitButton } from "@/components/SubmitButton";

export function MenuForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: { name: string; price: number; description: string | null };
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm text-stone-800" htmlFor="name">
          メニュー名
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className="min-h-11 w-full rounded-lg border border-stone-300 px-3 text-base text-stone-800"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-800" htmlFor="price">
          価格（円・税込）
        </label>
        <input
          id="price"
          name="price"
          type="number"
          inputMode="numeric"
          min={0}
          required
          defaultValue={defaultValues?.price}
          className="min-h-11 w-full rounded-lg border border-stone-300 px-3 text-base text-stone-800"
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm text-stone-800"
          htmlFor="description"
        >
          説明（任意）
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-base text-stone-800"
        />
      </div>

      <SubmitButton>保存する</SubmitButton>
    </form>
  );
}
