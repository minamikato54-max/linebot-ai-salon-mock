import { supabaseAdmin } from "@/lib/supabase";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
};

export type Menu = {
  id: string;
  name: string;
  price: number;
  description: string | null;
};

export async function getAllFaq(): Promise<Faq[]> {
  const { data, error } = await supabaseAdmin
    .from("faq")
    .select("id, question, answer, keywords");

  if (error) {
    throw new Error(`faq取得に失敗しました: ${error.message}`);
  }

  return data ?? [];
}

export async function getAllMenus(): Promise<Menu[]> {
  const { data, error } = await supabaseAdmin
    .from("menus")
    .select("id, name, price, description");

  if (error) {
    throw new Error(`menus取得に失敗しました: ${error.message}`);
  }

  return data ?? [];
}
