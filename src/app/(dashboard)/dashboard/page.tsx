import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VkConnectionsSection } from "@/components/admin/vk-connections-section";
import { BalancesSection } from "@/components/admin/balances-section";
import { ModelsSection } from "@/components/admin/models-section";
import { InvitesSection } from "@/components/admin/invites-section";
import { PayoutsSection } from "@/components/admin/payouts-section";
import { CastingsJobsSection } from "@/components/admin/castings-jobs-section";
import { BookingsStatusSection } from "@/components/admin/bookings-status-section";
import { ModelQuickStats } from "@/components/dashboard/model-quick-stats";
import { ModelTabsWithUrl } from "@/components/dashboard/model-tabs-with-url";
import { ModelPortfolioSection } from "@/components/dashboard/model-portfolio-section";
import { ModelProfilePanel } from "@/components/dashboard/model-profile-panel";
import { ModelBookingsPlaceholder } from "@/components/dashboard/model-bookings-placeholder";
import { ModelBalanceSection } from "@/components/dashboard/model-balance-section";
import { BookingsSkeleton } from "@/components/dashboard/bookings-skeleton";
import { Suspense } from "react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role ?? "model";
  const isAdmin = role === "admin";
  const params = await searchParams;
  const tabParam = params.tab;
  const initialTab =
    tabParam === "portfolio" || tabParam === "bookings" || tabParam === "finance" || tabParam === "profile"
      ? tabParam
      : "profile";

  const fullName = (session.user as any).name || session.user.email || "Модель";
  const firstName = fullName.split(" ")[0];

  return (
    <div className="space-y-7">
      {/* ─── Page header ─── */}
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-gradient-to-r from-amber-400/60 to-transparent" />
            <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.4em] text-amber-300/55">
              Личный кабинет
            </p>
          </div>
          <h1
            className="text-3xl font-light leading-none tracking-[0.08em] text-foreground md:text-4xl"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            {firstName}
          </h1>
          <p className="font-condensed text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground/40">
            Sigma Models · {isAdmin ? "Администратор" : "Модель"}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/[0.06] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
            <span className="font-condensed text-[9px] font-semibold uppercase tracking-[0.3em] text-amber-300/80">
              Режим администратора
            </span>
          </div>
        )}
      </header>

      {/* ─── Mode switcher tabs ─── */}
      <Tabs defaultValue="model" className="space-y-6">
        <div className="-mx-1 overflow-x-auto overflow-y-hidden px-1 pb-1 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex gap-1 rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-sm">
            <TabsTrigger
              value="model"
              className="rounded-full px-5 py-1.5 font-condensed text-[10px] font-semibold uppercase tracking-[0.22em] transition-all data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground/45 data-[state=inactive]:hover:text-muted-foreground/70"
            >
              Режим модели
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger
                value="admin"
                className="rounded-full px-5 py-1.5 font-condensed text-[10px] font-semibold uppercase tracking-[0.22em] transition-all data-[state=active]:bg-amber-400/15 data-[state=active]:text-amber-200 data-[state=inactive]:text-muted-foreground/45 data-[state=inactive]:hover:text-muted-foreground/70"
              >
                Админ-панель
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* MODEL mode */}
        <TabsContent value="model" className="space-y-5">
          <ModelQuickStats />
          <ModelTabsWithUrl
            initialTab={initialTab}
            portfolioContent={<ModelPortfolioSection />}
            profileContent={<ModelProfilePanel />}
            bookingsContent={
              <Suspense fallback={<BookingsSkeleton />}>
                <ModelBookingsPlaceholder />
              </Suspense>
            }
            financeContent={<ModelBalanceSection />}
          />
        </TabsContent>

        {/* ADMIN mode */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-5">
            <div className="gradient-border rounded-2xl bg-white/[0.03] p-px">
              <div className="rounded-2xl bg-black/50 px-5 py-4">
                <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-300/60">
                  Панель управления агентством
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/55">
                  Модели, балансы, выплаты, приглашения, кастинги, букинги, VK-подключения.
                </p>
              </div>
            </div>
            <BalancesSection />
            <PayoutsSection />
            <ModelsSection />
            <CastingsJobsSection />
            <BookingsStatusSection />
            <InvitesSection />
            <VkConnectionsSection />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
