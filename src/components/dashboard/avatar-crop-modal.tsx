"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PREVIEW_SIZE = 280;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  photoId: string;
  setModelAvatar: (formData: FormData) => Promise<void>;
};

export function AvatarCropModal({
  open,
  onOpenChange,
  imageUrl,
  photoId,
  setModelAvatar,
}: Props) {
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef({ mouseX: 0, mouseY: 0, posX: 50, posY: 50 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      startRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        posX: positionX,
        posY: positionY,
      };
    },
    [positionX, positionY],
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { mouseX, mouseY, posX, posY } = startRef.current;
    const deltaX = e.clientX - mouseX;
    const deltaY = e.clientY - mouseY;
    const scale = 100 / PREVIEW_SIZE;
    setPositionX(Math.min(100, Math.max(0, posX - deltaX * scale)));
    setPositionY(Math.min(100, Math.max(0, posY - deltaY * scale)));
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleOpenChange = (next: boolean) => {
    if (!next) setPositionX(50);
    if (!next) setPositionY(50);
    onOpenChange(next);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("photo_id", photoId);
    formData.set("position_x", String(Math.round(positionX)));
    formData.set("position_y", String(Math.round(positionY)));
    await setModelAvatar(formData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[320px]" showCloseButton>
        <DialogHeader>
          <DialogTitle>Выберите область для аватара</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Перетащите фото, чтобы выбрать, какая часть будет отображаться в кружке.
        </p>
        <div
          className="relative mx-auto aspect-square w-full max-w-[280px] cursor-grab overflow-hidden rounded-full border border-border/70 bg-black/40"
          style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
          onMouseDown={handleMouseDown}
        >
          {isDragging && (
            <div className="pointer-events-none absolute inset-0 z-10 cursor-grabbing" />
          )}
          <Image
            src={imageUrl}
            alt="Область аватара"
            fill
            className="select-none object-cover"
            style={{
              objectPosition: `${positionX}% ${positionY}%`,
            }}
            draggable={false}
            unoptimized
          />
        </div>
        <form onSubmit={handleSubmit}>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit">Сохранить аватар</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
