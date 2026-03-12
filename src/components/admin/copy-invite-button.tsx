"use client";

import { Button } from "@/components/ui/button";

type Props = {
  value: string;
};

export function CopyInviteButton({ value }: Props) {
  async function handleClick() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // no-op, в проде можно добавить toast
    }
  }

  return (
    <Button
      type="button"
      size="xs"
      variant="outline"
      onClick={handleClick}
    >
      Скопировать ссылку
    </Button>
  );
}

