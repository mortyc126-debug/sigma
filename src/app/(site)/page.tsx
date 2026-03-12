import { applyAsModel } from "./submit";
import { HomeContent } from "@/components/site/home-content";

export default function SiteHomePage() {
  // Серверный компонент пробрасывает Server Action в клиентский компонент.
  return <HomeContent action={applyAsModel} />;
}


