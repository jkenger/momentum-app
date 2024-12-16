// components/dashboard/stats-overview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Signal } from "@prisma/client";
import { BarChart, LineChart, PieChart } from "lucide-react";

interface StatsOverviewProps {
  signals: Signal[];
}

export function StatsOverview({ signals }: StatsOverviewProps) {
  // Calculate stats
  const totalSignals = signals.length;
  const completedSignals = signals.filter(
    (signal) => signal.status === "COMPLETED"
  );
  const successfulSignals = completedSignals.filter(
    (signal) =>
      signal.outcome === "TARGET_HIT" || signal.outcome === "PARTIAL_PROFIT"
  );

  const winRate =
    totalSignals > 0
      ? ((successfulSignals.length / completedSignals.length) * 100).toFixed(1)
      : "0";

  const averageProfit =
    completedSignals.length > 0
      ? (
          completedSignals.reduce(
            (acc, signal) => acc + (signal.actualOutcome || 0),
            0
          ) / completedSignals.length
        ).toFixed(2)
      : "0";

  const stats = [
    {
      title: "Total Signals",
      value: totalSignals,
      icon: BarChart,
      description: "All-time signals generated",
    },
    {
      title: "Win Rate",
      value: `${winRate}%`,
      icon: PieChart,
      description: "Success rate of completed signals",
    },
    {
      title: "Average Profit",
      value: `${averageProfit}%`,
      icon: LineChart,
      description: "Average profit per completed trade",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
