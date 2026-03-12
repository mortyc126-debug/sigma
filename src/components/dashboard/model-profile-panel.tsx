"use server";

import { ModelOverviewSection } from "@/components/dashboard/model-overview-section";
import { ModelProfileSection } from "@/components/dashboard/model-profile-section";
import { ModelTipsCard } from "@/components/dashboard/model-tips-card";

export async function ModelProfilePanel() {
  return (
    <div className="space-y-4">
      <ModelOverviewSection />
      <ModelTipsCard />
      <ModelProfileSection />
    </div>
  );
}


