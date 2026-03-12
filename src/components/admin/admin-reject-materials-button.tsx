"use client";

import { useState } from "react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { adminRejectMaterials } from "@/lib/actions/admin-castings-actions";

type AdminRejectMaterialsButtonProps = {
  jobId: string;
};

export function AdminRejectMaterialsButton({ jobId }: AdminRejectMaterialsButtonProps) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const fd = new FormData();
    fd.set("job_id", jobId);
    fd.set("comment", comment.trim());
    startTransition(() => {
      adminRejectMaterials(fd).then(() => {
        setOpen(false);
        setComment("");
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="secondary" className="text-xs">
          Отклонить с комментарием
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/60 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Отклонить материалы</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Комментарий увидит модель; работа вернётся в статус «Подтверждена», она сможет загрузить материалы заново.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="admin-reject-comment" className="text-sm">
              Комментарий для модели
            </Label>
            <textarea
              id="admin-reject-comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Например: нужны фото в другом разрешении, добавьте ещё видео..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" size="sm" disabled={isPending || !comment.trim()}>
              {isPending ? "Отправка…" : "Отклонить и отправить комментарий"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
