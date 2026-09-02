import { BroadcastForm } from "./BroadcastForm";
import { BackToHomeButton } from "@/components/BackToHomeButton";

export default async function BroadcastPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <div className="flex flex-col gap-4 pb-20">
      <BackToHomeButton />
      <h1 className="text-lg font-semibold text-stone-800">お知らせを送る</h1>
      <p className="text-sm text-stone-800">
        入力した内容がLINE友だち全員に届きます。送信前に必ず内容を確認してください。
      </p>

      {sent && (
        <p className="rounded-lg bg-rose-100 p-3 text-sm text-rose-700">
          送信しました。
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
          送信できませんでした。時間をおいてもう一度お試しください。
        </p>
      )}

      <BroadcastForm />
    </div>
  );
}
