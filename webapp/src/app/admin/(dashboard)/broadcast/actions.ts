"use server";

import { redirect } from "next/navigation";
import { lineClient } from "@/lib/line";

export async function sendBroadcastAction(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim();

  if (!text) {
    redirect("/admin/broadcast?error=1");
  }

  try {
    await lineClient.broadcast({
      messages: [{ type: "text", text }],
    });
  } catch {
    redirect("/admin/broadcast?error=1");
  }

  redirect("/admin/broadcast?sent=1");
}
