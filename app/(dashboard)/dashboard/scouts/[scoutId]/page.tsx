// app/(dashboard)/scouts/[scoutId]/page.tsx
import { auth } from "@/lib/auth-utils";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ScoutActions } from "@/components/scouts/scouts-action";

interface ScoutDetailPageProps {
  params: {
    scoutId: string;
  };
}

export default async function ScoutDetailPage({
  params,
}: ScoutDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const scout = await prisma.scout.findUnique({
    where: {
      id: params.scoutId,
      userId: session.user.id, // Ensure user owns this scout
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!scout) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: "bg-green-500",
      INACTIVE: "bg-yellow-500",
      ERROR: "bg-red-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        title={scout.name}
        description={scout.description || "Scout Details"}
      >
        <ScoutActions scout={scout} />
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Scout Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(scout.status)}`}
                >
                  {scout.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tier</span>
                <Badge>{scout.tier}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Strategy</span>
                <Badge variant="outline">{scout.strategy}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Interval</span>
                <span>{scout.interval}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created</span>
                <span>{formatDistanceToNow(scout.createdAt)} ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Signals</span>
                <span>{scout.totalSignals}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Success Rate</span>
                <span>
                  {scout.successRate ? `${scout.successRate}%` : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Signal</span>
                <span>
                  {scout.lastSignalAt
                    ? formatDistanceToNow(scout.lastSignalAt)
                    : "Never"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Monitored Symbols</h4>
                <div className="flex flex-wrap gap-2">
                  {scout.symbols.map((symbol) => (
                    <Badge key={symbol} variant="outline">
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Strategy Config</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(scout.config, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
