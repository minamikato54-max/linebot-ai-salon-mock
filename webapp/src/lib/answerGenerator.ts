import { z } from "zod";
import { openai } from "@/lib/openai";
import type { Faq, Menu } from "@/lib/faq";

const AnswerSchema = z.object({
  category: z
    .enum(["faq", "menu", "other"])
    .describe(
      "質問の種類。faq=よくある質問（営業時間・予約可否など）、menu=メニュー・料金に関する質問、other=どちらにも該当しない質問",
    ),
  confidence: z
    .enum(["高", "中", "低"])
    .describe(
      "回答の確信度。渡されたFAQ/メニューデータに直接該当する記述がある場合のみ「高」、部分的にしか根拠がない場合は「中」、根拠がない場合は「低」",
    ),
  answer: z
    .string()
    .describe(
      "お客様への回答文（confidenceが低の場合は空文字でよい。この文面はconfidenceが低のときは実際には送信されない）",
    ),
  matchedFaqId: z
    .string()
    .uuid()
    .nullable()
    .describe("直接回答の根拠にしたFAQのid。該当がなければnull"),
});

export type GeneratedAnswer = z.infer<typeof AnswerSchema>;

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `あなたは美容室の公式LINEアカウントでお客様からの質問に自動応答するアシスタントです。

# 厳守事項
- 回答は必ず、渡された「FAQデータ」「メニューデータ」に直接書かれている内容のみを根拠にしてください。データにない情報を推測・創作して回答してはいけません（ハルシネーション禁止）。
- 敬語で、簡潔にお客様への返信文として自然な文面を作成してください。

# confidence（確信度）の判定基準
- 「高」: 質問がFAQまたはメニューデータの記述に直接該当し、その内容だけで正確に回答できる
- 「中」: 関連はするが、部分的にしか該当データがない、または複数の解釈があり得る
- 「低」: FAQ・メニューデータのどこにも直接該当する記述がない場合。この場合は必ず「低」にしてください。曖昧な場合や自信がない場合も甘く判定せず「低」を選んでください。

# category（分類）
- faq: 営業時間・予約可否・駐車場など、メニュー価格以外のよくある質問
- menu: メニュー内容・料金に関する質問
- other: 上記どちらにも当てはまらない質問（世間話、無関係な質問など）

# 出力形式
必ず以下のキーを持つ有効なJSONオブジェクトのみを出力してください。説明文・前置き・コードブロック記法（\`\`\`）は一切含めないこと。
{
  "category": "faq" | "menu" | "other",
  "confidence": "高" | "中" | "低",
  "answer": string,
  "matchedFaqId": string または null（根拠にしたFAQのid。UUID形式）
}`;

function formatFaqData(faqRows: Faq[], menuRows: Menu[]): string {
  const faqText = faqRows
    .map((f) => `- id: ${f.id}\n  質問: ${f.question}\n  回答: ${f.answer}`)
    .join("\n");

  const menuText = menuRows
    .map(
      (m) =>
        `- id: ${m.id}\n  名前: ${m.name}\n  価格: ${m.price}円${m.description ? `\n  説明: ${m.description}` : ""}`,
    )
    .join("\n");

  return `# FAQデータ\n${faqText || "（登録なし）"}\n\n# メニューデータ\n${menuText || "（登録なし）"}`;
}

export async function generateAnswer(
  userMessage: string,
  faqRows: Faq[],
  menuRows: Menu[],
): Promise<GeneratedAnswer> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `${formatFaqData(faqRows, menuRows)}\n\n# お客様からの質問\n${userMessage}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAIからの応答が空でした");
  }

  const parsedJson: unknown = JSON.parse(content);
  return AnswerSchema.parse(parsedJson);
}
