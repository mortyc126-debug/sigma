import type { Metadata } from "next";
import { BranchesContent } from "@/components/site/branches-content";

export const metadata: Metadata = {
  title: "Филиалы",
  description:
    "Sigma Models в Москве, Санкт-Петербурге, Казани, Екатеринбурге, Новосибирске и Сочи. Единые стандарты работы в каждом городе.",
};

export default function BranchesPage() {
  return <BranchesContent />;
}
