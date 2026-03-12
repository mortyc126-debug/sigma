"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

export type CastingItem = {
  id: string;
  brand: string;
  type: string;
  location: string;
  date: string;
  time: string;
  status?: "pending" | "confirmed" | "declined";
  details?: string | null;
};

type CastingCardProps = {
  casting: CastingItem;
  confirmCasting: (formData: FormData) => void;
  declineCasting: (formData: FormData) => void;
};

const CASTING_STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждён",
  declined: "Отклонён",
};

export function CastingCard({ casting, confirmCasting, declineCasting }: CastingCardProps) {
  const [open, setOpen] = useState(false);
  const hasDetails = Boolean(casting.details?.trim());
  const isPending = casting.status === "pending";
  const statusLabel = casting.status ? CASTING_STATUS_LABELS[casting.status] ?? casting.status : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-border/80 hover:bg-card/70 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium tracking-tight text-foreground">
          {casting.brand} · {casting.type}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {casting.location || "—"} · {casting.date}
          {casting.time ? ` · ${casting.time}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {statusLabel && (
          <span className="rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-sm font-medium text-foreground/90">
            {statusLabel}
          </span>
        )}
        {isPending && (
          <>
            <form action={confirmCasting} className="inline-block">
              <input type="hidden" name="id" value={casting.id} />
              <Button type="submit" size="sm" variant="default" className="h-9 text-sm">
                Подтвердить
              </Button>
            </form>
            <form action={declineCasting} className="inline-block">
              <input type="hidden" name="id" value={casting.id} />
              <Button type="submit" size="sm" variant="outline" className="h-9 text-sm">
                Отклонить
              </Button>
            </form>
          </>
        )}
        {hasDetails && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-9 text-sm text-muted-foreground">
                Подробнее
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border-border/60 bg-card">
              <DialogHeader>
                <DialogTitle className="text-base">
                  {casting.brand} · {casting.type}
                </DialogTitle>
              </DialogHeader>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {casting.details}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </motion.div>
  );
}
