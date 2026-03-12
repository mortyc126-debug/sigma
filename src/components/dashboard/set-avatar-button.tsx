"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AvatarCropModal } from "./avatar-crop-modal";

type SetModelAvatar = (formData: FormData) => Promise<void>;

type Props = {
  photoId: string;
  imageUrl: string;
  setModelAvatar: SetModelAvatar;
};

export function SetAvatarButton({ photoId, imageUrl, setModelAvatar }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 w-full border-border/70 px-2 text-xs"
        onClick={() => setOpen(true)}
      >
        Сделать аватаром
      </Button>
      <AvatarCropModal
        open={open}
        onOpenChange={setOpen}
        imageUrl={imageUrl}
        photoId={photoId}
        setModelAvatar={setModelAvatar}
      />
    </>
  );
}
