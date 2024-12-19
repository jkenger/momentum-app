// app/(dashboard)/scouts/page.tsx
import { auth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/page-header";
import { ScoutsList } from "@/components/scouts/scouts-list";
import { CreateScoutButton } from "@/components/scouts/create-scout-button";

export default async function ScoutsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const scouts = await prisma.scout.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        title="Signal Scouts"
        description="Create and manage your automated signal detection scouts"
      >
        <CreateScoutButton />
      </PageHeader>

      {/* Scout Tiers Information */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Basic Scout</h3>
          <p className="text-sm text-muted-foreground">
            Single indicator strategy scanning. Perfect for beginners.
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Pro Scout</h3>
          <p className="text-sm text-muted-foreground">
            Multi-indicator strategies with advanced signal detection.
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Elite Scout</h3>
          <p className="text-sm text-muted-foreground">
            AI-enhanced strategies with maximum accuracy.
          </p>
        </div>
      </div>

      <ScoutsList scouts={scouts} />
    </div>
  );
}
