import { supabaseAdmin } from "@/lib/supabase";

export type Conversation = {
  id: string;
  line_user_id: string;
  user_message: string;
  bot_reply: string | null;
  matched_faq_id: string | null;
  escalated: boolean;
  created_at: string;
};

export async function getRecentConversations(
  limit = 50,
): Promise<Conversation[]> {
  const { data, error } = await supabaseAdmin
    .from("conversations")
    .select(
      "id, line_user_id, user_message, bot_reply, matched_faq_id, escalated, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`conversations取得に失敗しました: ${error.message}`);
  }

  return data ?? [];
}
