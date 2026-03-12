"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const MODEL_TAB_VALUES = ["portfolio", "profile", "bookings", "finance"] as const;
type ModelTab = (typeof MODEL_TAB_VALUES)[number];

function isValidTab(t: string | null): t is ModelTab {
  return t !== null && MODEL_TAB_VALUES.includes(t as ModelTab);
}

const TAB_LABELS: Record<ModelTab, string> = {
  profile: "Профиль",
  portfolio: "Портфолио",
  bookings: "Работы",
  finance: "Финансы",
};

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

  const setTab = (v: ModelTab) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", v);
    router.push(`/dashboard?${next.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={value} onValueChange={(v) => setTab(v as ModelTab)} className="space-y-5">
      {/* Custom pill tab bar */}
      <div className="-mx-1 overflow-x-auto overflow-y-hidden px-1 pb-1 sm:mx-0 sm:px-0">
        <div className="inline-flex gap-1 rounded-full border border-white/8 bg-black/50 p-1 backdrop-blur-sm">
          {MODEL_TAB_VALUES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-1.5 font-condensed text-[10px] font-semibold uppercase tracking-[0.22em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                value === t
                  ? "bg-white/12 text-foreground shadow-sm"
                  : "text-muted-foreground/45 hover:text-muted-foreground/75"
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <TabsContent value="portfolio">{portfolioContent}</TabsContent>
      <TabsContent value="profile">{profileContent}</TabsContent>
      <TabsContent value="bookings">{bookingsContent}</TabsContent>
      <TabsContent value="finance">{financeContent}</TabsContent>
    </Tabs>
  );
}
