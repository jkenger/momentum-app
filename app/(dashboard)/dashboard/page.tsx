// app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { SignalsContainer } from "@/components/signals/signals-container";
import { TestSignalButton } from "@/components/signals/test-signal-button";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { prisma } from "@/lib/db";
import { DetectSignalButton } from "@/components/signals/detect-signal-button";

async function getSignals() {
  const signals = await prisma.signal.findMany({
    orderBy: { createdAt: "desc" },
    take: 100, // Increased to get more data for stats
  });
  return signals;
}

export default async function DashboardPage() {
  const signals = await getSignals();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Trading Dashboard"
        description="Monitor your trading performance and signals"
      >
        <div className="flex space-x-2">
          <DetectSignalButton />
          <TestSignalButton />
        </div>
      </PageHeader>

      <Suspense fallback={<div>Loading stats...</div>}>
        <StatsOverview signals={signals} />
      </Suspense>
      {/* 
      <Suspense fallback={<div>Loading chart...</div>}>
        <PerformanceChart signals={signals} />
      </Suspense> */}

      <Suspense fallback={<div>Loading signals...</div>}>
        <SignalsContainer initialSignals={signals} />
      </Suspense>
    </div>
  );
}
