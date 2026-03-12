"use client";

import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  PORTFOLIO_CATEGORIES,
  POLAROID_SUBCATEGORIES,
  EDITORIAL_SUBCATEGORIES,
} from "@/lib/portfolio-categories";
import { Upload } from "lucide-react";

const ACCEPT = "image/jpeg,image/png,image/webp";

/** Только поля формы. Тег <form action={...}> должен быть в серверном компоненте. */
export function PortfolioUploadFields() {
  const [category, setCategory] = useState<string>("polaroid");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const subcategoriesByCategory: Record<string, { value: string; label: string }[]> = {
    polaroid: [...POLAROID_SUBCATEGORIES],
    editorial: [...EDITORIAL_SUBCATEGORIES],
    nude: [{ value: "", label: "—" }],
    lingerie: [{ value: "", label: "—" }],
  };
  const subcategories = subcategoriesByCategory[category] ?? subcategoriesByCategory.polaroid;

  function setFile(file: File | null) {
    if (!inputRef.current) return;
    if (!file) {
      setFileName(null);
      inputRef.current.value = "";
      return;
    }
    const dt = new DataTransfer();
    dt.items.add(file);
    inputRef.current.files = dt.files;
    setFileName(file.name);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setFile(file);
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 sm:items-end">
          <div className="w-full space-y-1.5 sm:max-w-[200px]">
            <Label htmlFor="category">Категория</Label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {PORTFOLIO_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full space-y-1.5 sm:max-w-[200px]">
            <Label htmlFor="subcategory">Подкатегория</Label>
            <select
              id="subcategory"
              name="subcategory"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {subcategories.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="w-full space-y-1.5 sm:max-w-sm">
            <Label>Файл</Label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-border/70 bg-muted/20 hover:border-border hover:bg-muted/30"
              }`}
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">
                {fileName || "Выберите файл или перетащите сюда"}
              </span>
              <span className="text-xs text-muted-foreground/80">
                JPG, PNG или WebP до 10 МБ
              </span>
            </div>
            <input
              ref={inputRef}
              id="photo"
              name="photo"
              type="file"
              accept={ACCEPT}
              required
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button type="submit" size="sm" className="w-full sm:w-auto">
            Загрузить
          </Button>
        </div>
    </>
  );
}
