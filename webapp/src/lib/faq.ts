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

export async function getFaqById(id: string): Promise<Faq | null> {
  const { data, error } = await supabaseAdmin
    .from("faq")
    .select("id, question, answer, keywords")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`faq取得に失敗しました: ${error.message}`);
  }

  return data;
}

export async function createFaq(input: {
  question: string;
  answer: string;
  keywords: string[];
}): Promise<void> {
  const { error } = await supabaseAdmin.from("faq").insert(input);

  if (error) {
    throw new Error(`faq追加に失敗しました: ${error.message}`);
  }
}

export async function updateFaq(
  id: string,
  input: { question: string; answer: string; keywords: string[] },
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("faq")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`faq更新に失敗しました: ${error.message}`);
  }
}

export async function deleteFaq(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("faq").delete().eq("id", id);

  if (error) {
    throw new Error(`faq削除に失敗しました: ${error.message}`);
  }
}

export async function getMenuById(id: string): Promise<Menu | null> {
  const { data, error } = await supabaseAdmin
    .from("menus")
    .select("id, name, price, description")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`menus取得に失敗しました: ${error.message}`);
  }

  return data;
}

export async function createMenu(input: {
  name: string;
  price: number;
  description: string | null;
}): Promise<void> {
  const { error } = await supabaseAdmin.from("menus").insert(input);

  if (error) {
    throw new Error(`menu追加に失敗しました: ${error.message}`);
  }
}

export async function updateMenu(
  id: string,
  input: { name: string; price: number; description: string | null },
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("menus")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`menu更新に失敗しました: ${error.message}`);
  }
}

export async function deleteMenu(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("menus").delete().eq("id", id);

  if (error) {
    throw new Error(`menu削除に失敗しました: ${error.message}`);
  }
}
