// app/(dashboard)/learn/platform/page.tsx
import { LearnHeader } from "@/components/learn/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Bell, Signal, BarChart3 } from "lucide-react";

export default function PlatformOverviewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-8 py-6">
      <LearnHeader
        title="Platform Overview"
        description="Learn how to use Momentum's features and interface"
      />

      {/* Main Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Main Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signal className="h-5 w-5" />
                Signal Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The main dashboard displays active signals, performance metrics,
                and market trends. Monitor all your trading activities from one
                central location.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Technical Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View detailed charts with technical indicators, price action
                patterns, and automated signal markers for thorough market
                analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Real-time Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Receive instant notifications for new signals, price alerts, and
                important market events to never miss a trading opportunity.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track your trading performance with detailed statistics, win
                rates, and profit/loss analysis across different strategies.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Navigation Guide */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Navigation Guide</h2>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Dashboard</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your main workspace showing active signals, performance metrics,
              and quick actions. Access this from the home icon in the sidebar.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Signals</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              View and manage all your trading signals. Filter by strategy type,
              status, or performance to find exactly what you&apos;re looking
              for.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Analytics</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Deep dive into your trading performance with detailed charts,
              statistics, and historical data analysis.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Settings</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Customize your trading preferences, notification settings, and
              account details to optimize your trading experience.
            </p>
          </div>
        </div>
      </section>

      {/* Tips for Getting Started */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Tips for Getting Started</h2>
        <div className="space-y-4">
          <ul className="list-disc pl-6 space-y-2">
            <li>Start by familiarizing yourself with the dashboard layout</li>
            <li>Set up your notification preferences to stay informed</li>
            <li>Begin with demo trading to understand signal mechanics</li>
            <li>Review the performance analytics regularly</li>
            <li>Customize your view settings for optimal trading</li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section className="mt-12 rounded-lg bg-muted p-6">
        <h2 className="text-xl font-semibold">Next Steps</h2>
        <p className="mt-2 text-muted-foreground">
          Now that you understand the platform basics, dive into our EMA
          Crossover strategy guide to start trading with confidence.
        </p>
      </section>
    </div>
  );
}
