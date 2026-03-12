"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MODEL_TAB_VALUES = ["portfolio", "profile", "bookings", "finance"] as const;
type ModelTab = (typeof MODEL_TAB_VALUES)[number];

function isValidTab(t: string | null): t is ModelTab {
  return t !== null && MODEL_TAB_VALUES.includes(t as ModelTab);
}

type Props = {
  initialTab: ModelTab;
  portfolioContent: React.ReactNode;
  profileContent: React.ReactNode;
  bookingsContent: React.ReactNode;
  financeContent: React.ReactNode;
};

export function ModelTabsWithUrl({
  initialTab,
  portfolioContent,
  profileContent,
  bookingsContent,
  financeContent,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = (searchParams.get("tab") as ModelTab) || initialTab;
  const value = isValidTab(tab) ? tab : "profile";

  const setTab = (v: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", v);
    router.push(`/dashboard?${next.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={value} onValueChange={setTab} className="space-y-4">
      <div className="-mx-1 overflow-x-auto overflow-y-hidden px-1 pb-1 sm:mx-0 sm:px-0">
        <TabsList className="inline-flex w-max flex-nowrap">
          <TabsTrigger value="portfolio" className="shrink-0 py-2.5 sm:py-0.5">Портфолио</TabsTrigger>
          <TabsTrigger value="profile" className="shrink-0 py-2.5 sm:py-0.5">Профиль</TabsTrigger>
          <TabsTrigger value="bookings" className="shrink-0 py-2.5 sm:py-0.5">Работы и букинги</TabsTrigger>
          <TabsTrigger value="finance" className="shrink-0 py-2.5 sm:py-0.5">Финансы</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="portfolio">{portfolioContent}</TabsContent>
      <TabsContent value="profile">{profileContent}</TabsContent>
      <TabsContent value="bookings">{bookingsContent}</TabsContent>
      <TabsContent value="finance">{financeContent}</TabsContent>
    </Tabs>
  );
}
