import type { Metadata } from "next";
import { ContactsContent } from "@/components/site/contacts-content";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты Sigma Models. Головной офис в Москве, кастинг, коммерческие запросы и сотрудничество с брендами.",
};

export default function ContactsPage() {
  return <ContactsContent />;
}
