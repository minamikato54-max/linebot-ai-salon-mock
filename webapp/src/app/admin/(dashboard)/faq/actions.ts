"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createFaq, deleteFaq, updateFaq } from "@/lib/faq";

function parseKeywords(raw: string): string[] {
  return raw
    .split(/[,、\n]/)
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
}

export async function createFaqAction(formData: FormData) {
  await createFaq({
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
    keywords: parseKeywords(String(formData.get("keywords") ?? "")),
  });

  revalidatePath("/admin/faq");
  redirect("/admin/faq");
}

export async function updateFaqAction(id: string, formData: FormData) {
  await updateFaq(id, {
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
    keywords: parseKeywords(String(formData.get("keywords") ?? "")),
  });

  revalidatePath("/admin/faq");
  redirect("/admin/faq");
}

export async function deleteFaqAction(id: string) {
  await deleteFaq(id);
  revalidatePath("/admin/faq");
}
