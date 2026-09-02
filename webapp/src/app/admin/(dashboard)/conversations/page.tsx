import { getRecentConversations } from "@/lib/conversations";
import { BackToHomeButton } from "@/components/BackToHomeButton";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function ConversationsPage() {
  const conversations = await getRecentConversations(50);

  return (
    <div className="flex flex-col gap-3 pb-20">
      <BackToHomeButton />
      <p className="text-sm text-stone-800">直近50件を表示しています</p>

      {conversations.length === 0 && (
        <p className="text-sm text-stone-800">まだやり取りがありません。</p>
      )}

      {conversations.map((c) => (
        <div key={c.id} className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              {formatDateTime(c.created_at)}
            </span>
            {c.escalated && (
              <span className="rounded-full bg-amber-400 px-2 py-1 text-xs font-medium text-stone-800">
                要対応
              </span>
            )}
          </div>
          <p className="mb-1 text-sm text-stone-800">
            <span className="font-medium">お客様: </span>
            {c.user_message}
          </p>
          <p className="text-sm text-stone-800">
            <span className="font-medium">bot: </span>
            {c.bot_reply ?? "（返信なし）"}
          </p>
        </div>
      ))}
    </div>
  );
}
