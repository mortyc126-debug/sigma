"use client";

import { useState, useRef } from "react";
import { useTransition } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Banknote, Upload, X, ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export type JobItem = {
  id: string;
  title: string;
  type: string;
  location: string;
  status: string;
  fee: string;
  details?: string | null;
  admin_comment?: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Подтверждена",
  pending: "В процессе",
  completed: "Завершена",
  cancelled: "Отменена",
  materials_submitted: "Материалы отправлены",
};

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

type JobCardProps = {
  job: JobItem;
  confirmJob: (formData: FormData) => void;
  declineJob: (formData: FormData) => void;
  submitJobMaterials: (formData: FormData) => void;
};

export function JobCard({ job, confirmJob, declineJob, submitJobMaterials }: JobCardProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const statusLabel = getStatusLabel(job.status);
  const hasLocation = job.location?.trim();
  const hasFee = job.fee?.trim();
  const hasDetails = Boolean(job.details?.trim());
  const isPendingStatus = job.status === "pending";
  const isConfirmed = job.status === "confirmed";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...list].slice(0, 20));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitMaterials = () => {
    if (files.length === 0) return;
    const fd = new FormData();
    fd.set("job_id", job.id);
    files.forEach((f) => fd.append("files", f));
    startTransition(() => submitJobMaterials(fd));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-border/80 hover:bg-card/70"
      suppressHydrationWarning
    >
      <div className="space-y-1.5">
        <h4 className="text-base font-semibold tracking-tight text-foreground">
          {job.title || "Без названия"}
        </h4>
        {job.type?.trim() && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4 shrink-0 opacity-80" />
            <span>{job.type}</span>
          </div>
        )}
        {hasLocation && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 opacity-80" />
            <span>{job.location}</span>
          </div>
        )}
      </div>

      {/* Блок загрузки материалов — только при статусе «Подтверждена» */}
      {isConfirmed && (
        <div className="rounded-lg border border-border/50 bg-background/30 p-3">
          {job.admin_comment && (
            <div className="mb-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200/95">
              <span className="font-medium">Замечания от агентства: </span>
              <span className="whitespace-pre-wrap">{job.admin_comment}</span>
            </div>
          )}
          <Label className="text-sm font-medium text-foreground">Материалы для заказчика</Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Загрузите фото и/или видео по работе. После отправки карточка исчезнет у вас и попадёт в архив админу.
          </p>
          <div className="mt-3 space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 h-4 w-4" />
                Добавить файлы
              </Button>
              {files.length > 0 && (
                <Button
                  type="button"
                  size="sm"
                  className="text-sm"
                  disabled={isPending}
                  onClick={handleSubmitMaterials}
                >
                  {isPending ? "Отправка…" : "Отправить материалы"}
                </Button>
              )}
            </div>
            {files.length > 0 && (
              <ul className="space-y-1.5 text-xs">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 rounded border border-border/40 bg-background/50 px-2 py-1.5">
                    <span className="flex items-center gap-1.5 truncate">
                      {f.type.startsWith("video/") ? <Video className="h-3.5 w-3.5 shrink-0" /> : <ImageIcon className="h-3.5 w-3.5 shrink-0" />}
                      {f.name}
                    </span>
                    <button type="button" onClick={() => removeFile(i)} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label="Удалить">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-sm font-medium text-foreground/90">
            {statusLabel}
          </span>
          {hasFee && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-200/95">
              <Banknote className="h-4 w-4 shrink-0 opacity-90" />
              {job.fee}
            </span>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {isPendingStatus && (
            <>
              <form action={confirmJob} className="inline-block">
                <input type="hidden" name="id" value={job.id} />
                <Button type="submit" size="sm" variant="default" className="h-9 text-sm">
                  Подтвердить
                </Button>
              </form>
              <form action={declineJob} className="inline-block">
                <input type="hidden" name="id" value={job.id} />
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
                  <DialogTitle className="text-base">{job.title || "Подробности"}</DialogTitle>
                </DialogHeader>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {job.details}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </motion.div>
  );
}
