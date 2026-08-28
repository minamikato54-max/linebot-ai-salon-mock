"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createMenu, deleteMenu, updateMenu } from "@/lib/faq";

function parsePrice(raw: string): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export async function createMenuAction(formData: FormData) {
  const description = String(formData.get("description") ?? "").trim();

  await createMenu({
    name: String(formData.get("name") ?? ""),
    price: parsePrice(String(formData.get("price") ?? "")),
    description: description.length > 0 ? description : null,
  });

  revalidatePath("/admin/menus");
  redirect("/admin/menus");
}

export async function updateMenuAction(id: string, formData: FormData) {
  const description = String(formData.get("description") ?? "").trim();

  await updateMenu(id, {
    name: String(formData.get("name") ?? ""),
    price: parsePrice(String(formData.get("price") ?? "")),
    description: description.length > 0 ? description : null,
  });

  revalidatePath("/admin/menus");
  redirect("/admin/menus");
}

export async function deleteMenuAction(id: string) {
  await deleteMenu(id);
  revalidatePath("/admin/menus");
}
