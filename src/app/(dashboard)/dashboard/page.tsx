import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground sm:tracking-[0.28em]">
            Личный кабинет
          </p>
          <h1 className="text-xl font-medium tracking-[0.15em] sm:text-2xl sm:tracking-[0.2em] md:text-3xl">
            Sigma Models
          </h1>
        </div>
        {isAdmin && (
          <div className="text-right text-xs text-muted-foreground">
            <p className="font-medium uppercase tracking-[0.22em] text-primary">
              Режим администратора
            </p>
            <p>Переключение между режимом модели и админ-панелью появится позже.</p>
          </div>
        )}
      </header>

      <Tabs defaultValue="model" className="space-y-4">
        <div className="-mx-1 overflow-x-auto overflow-y-hidden px-1 pb-1 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-max flex-nowrap">
            <TabsTrigger value="model" className="shrink-0 py-2.5 sm:py-0.5">Режим модели</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin" className="shrink-0 py-2.5 sm:py-0.5">Админ-панель</TabsTrigger>}
          </TabsList>
        </div>

        <TabsContent value="model" className="space-y-4">
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

        {isAdmin && (
          <TabsContent value="admin" className="space-y-4">
            <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
              <h2 className="text-sm font-medium tracking-tight">
                Админ-панель агентства
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Здесь находятся разделы: все модели, балансы, запросы на
                вывод, приглашения, кастинги и работы, подключения VK.
              </p>
            </Card>
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

