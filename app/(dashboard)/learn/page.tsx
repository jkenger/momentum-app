// app/(dashboard)/learn/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LineChart, ShieldAlert, Zap } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LearnHeader } from "@/components/learn/header";

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-8 py-6">
      <LearnHeader
        title="Mastering Momentum Trading"
        description="Discover profitable trading through automated signal detection and risk management"
      />

      {/* Overview */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>About Momentum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Momentum is a professional trading platform that combines
              technical analysis with automated signal detection. We focus on
              high-probability trading setups using proven strategies like EMA
              Crossover and Volume Analysis.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Key Benefits</h3>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  <li>Automated signal detection</li>
                  <li>Risk-managed trade setups</li>
                  <li>Real-time market analysis</li>
                  <li>Clear entry and exit points</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Perfect For</h3>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  <li>Active day traders</li>
                  <li>Swing traders</li>
                  <li>Technical analysts</li>
                  <li>Risk-conscious traders</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Trading Tracks */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Choose Your Path</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Start Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Recommended For:</h3>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  <li>New traders</li>
                  <li>Market beginners</li>
                  <li>Technical analysis learners</li>
                </ul>
              </div>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/learn/basics">Trading Basics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Start Trading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Recommended For:</h3>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  <li>Experienced traders</li>
                  <li>Technical analysts</li>
                  <li>Active market participants</li>
                </ul>
              </div>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/learn/ema-crossover">Trading Strategies</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Core Features</h2>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automated Signal Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    EMA Crossover Strategy:{" "}
                  </span>
                  Uses 20/50 EMA crossovers with volume confirmation
                </li>
                <li className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Support/Resistance:{" "}
                  </span>
                  Identifies key price levels and breakout opportunities
                </li>
                <li className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Volume Analysis:{" "}
                  </span>
                  Detects significant volume spikes and trends
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Position Sizing:{" "}
                  </span>
                  Calculate optimal trade sizes based on risk
                </li>
                <li className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Stop Loss:{" "}
                  </span>
                  Automatic stop loss placement based on market structure
                </li>
                <li className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Take Profit:{" "}
                  </span>
                  Multiple take profit levels for optimal exit management
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Get Started */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Ready to Start?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Quick Start Steps:</h3>
              <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-1">
                <li>Learn platform navigation and features</li>
                <li>Understand our trading strategies</li>
                <li>Set up your first signal alerts</li>
                <li>Start with small, manageable trades</li>
              </ol>
            </div>
            <Alert>
              <AlertDescription>
                New to trading? Start with our Trading Basics guide to build a
                solid foundation.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/learn/platform">Platform Overview</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/learn/basics">Trading Basics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
