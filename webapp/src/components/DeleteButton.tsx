"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { SubmitButton } from "@/components/SubmitButton";

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="secondary" onClick={() => setConfirming(true)}>
        削除
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-stone-800">本当に削除しますか？</span>
      <form action={action}>
        <SubmitButton variant="danger">削除する</SubmitButton>
      </form>
      <Button variant="secondary" onClick={() => setConfirming(false)}>
        キャンセル
      </Button>
    </div>
  );
}
