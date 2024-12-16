// app/(dashboard)/dashboard/test/page.tsx
import { PageHeader } from "@/components/dashboard/page-header";
import { TestStrategies } from "@/components/signals/test-strategies";
import { Suspense } from "react";

export default async function TestPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Signals"
        description="Test different signal strategies"
      />

      <Suspense fallback={<div>Loading strategies...</div>}>
        <TestStrategies />
      </Suspense>
    </div>
  );
}
