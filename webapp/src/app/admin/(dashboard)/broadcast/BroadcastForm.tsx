"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { SubmitButton } from "@/components/SubmitButton";
import { sendBroadcastAction } from "./actions";

export function BroadcastForm() {
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [text, setText] = useState("");

  if (step === "confirm") {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-2 text-sm text-stone-800">
            この内容を送信します。よろしいですか？
          </p>
          <p className="whitespace-pre-wrap rounded-lg bg-stone-50 p-3 text-base text-stone-800">
            {text}
          </p>
        </div>

        <div className="flex gap-2">
          <form action={sendBroadcastAction} className="flex-1">
            <input type="hidden" name="text" value={text} />
            <SubmitButton>送信する</SubmitButton>
          </form>
          <Button variant="secondary" onClick={() => setStep("input")}>
            内容を直す
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm text-stone-800" htmlFor="text">
          お知らせ本文
        </label>
        <textarea
          id="text"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例：本日は臨時休業とさせていただきます"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-base text-stone-800"
        />
      </div>

      <Button
        disabled={text.trim().length === 0}
        onClick={() => setStep("confirm")}
      >
        内容を確認する
      </Button>
    </div>
  );
}
