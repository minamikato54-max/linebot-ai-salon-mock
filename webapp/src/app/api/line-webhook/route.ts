import { NextRequest, NextResponse } from "next/server";
import { validateSignature, webhook } from "@line/bot-sdk";
import { lineClient, LINE_CHANNEL_SECRET } from "@/lib/line";
import { supabaseAdmin } from "@/lib/supabase";
import { getAllFaq, getAllMenus } from "@/lib/faq";
import { generateAnswer } from "@/lib/answerGenerator";

export const runtime = "nodejs";

const OWNER_LINE_USER_ID = process.env.OWNER_LINE_USER_ID ?? "";
const ESCALATION_HOLDING_MESSAGE =
  "お問い合わせありがとうございます。担当者が確認の上、改めてご連絡いたします。";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-line-signature");
  const body = await request.text();

  if (!signature || !validateSignature(body, LINE_CHANNEL_SECRET, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const { events } = JSON.parse(body) as webhook.CallbackRequest;

  await Promise.all((events ?? []).map(handleEvent));

  return NextResponse.json({ status: "ok" });
}

async function handleEvent(event: webhook.Event) {
  if (
    event.type !== "message" ||
    event.message.type !== "text" ||
    !event.replyToken
  ) {
    return;
  }

  const userMessage = event.message.text;
  const lineUserId = event.source?.userId ?? "unknown";

  const [faqRows, menuRows] = await Promise.all([getAllFaq(), getAllMenus()]);
  const result = await generateAnswer(userMessage, faqRows, menuRows);

  const escalated = result.confidence === "低";
  const replyText = escalated ? ESCALATION_HOLDING_MESSAGE : result.answer;

  await lineClient.replyMessage({
    replyToken: event.replyToken,
    messages: [{ type: "text", text: replyText }],
  });

  await supabaseAdmin.from("conversations").insert({
    line_user_id: lineUserId,
    user_message: userMessage,
    bot_reply: replyText,
    matched_faq_id: result.matchedFaqId,
    escalated,
  });

  if (escalated && OWNER_LINE_USER_ID) {
    await lineClient.pushMessage({
      to: OWNER_LINE_USER_ID,
      messages: [
        {
          type: "text",
          text: `【未対応質問】\nお客様: ${userMessage}\n\n(Claude回答案・確信度低のため未送信)\n${result.answer}`,
        },
      ],
    });
  }
}
