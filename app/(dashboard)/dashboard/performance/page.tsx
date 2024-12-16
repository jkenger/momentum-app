import { PageHeader } from "@/components/dashboard/page-header";

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance"
        description="Track your trading performance and statistics"
      />
      {/* Performance metrics will go here */}
    </div>
  );
}
