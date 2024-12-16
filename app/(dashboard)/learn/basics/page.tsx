// app/(dashboard)/learn/basics/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { BasicChart } from "@/components/learn/basic-chart";
import { LearnHeader } from "@/components/learn/header";

export default function BasicsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-8 py-6">
      <LearnHeader
        title="Trading Basics"
        description="Learn the fundamental concepts of trading"
      />

      {/* Market Understanding */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Understanding Markets</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Types of Markets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">Spot Market</h3>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground">
                    <li>Immediate buying and selling</li>
                    <li>Direct ownership of assets</li>
                    <li>Most straightforward form of trading</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Futures Market</h3>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground">
                    <li>Contracts for future delivery</li>
                    <li>Higher leverage available</li>
                    <li>Used for hedging and speculation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Long Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/9] mb-4">
                  <BasicChart type="long-position" />
                </div>
                <ul className="list-disc pl-6 text-sm text-muted-foreground">
                  <li>Buy low, sell high</li>
                  <li>Profit from price increases</li>
                  <li>Limited risk (can't lose more than investment)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Short Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/9] mb-4">
                  <BasicChart type="short-position" />
                </div>
                <ul className="list-disc pl-6 text-sm text-muted-foreground">
                  <li>Sell high, buy low</li>
                  <li>Profit from price decreases</li>
                  <li>Higher risk (potential unlimited loss)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Terms */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Key Trading Terms</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Price Action Terms</h3>
                <ul className="space-y-3">
                  <li>
                    <span className="font-medium block">Support</span>
                    <span className="text-sm text-muted-foreground">
                      Price level where buying pressure typically overcomes
                      selling pressure
                    </span>
                  </li>
                  <li>
                    <span className="font-medium block">Resistance</span>
                    <span className="text-sm text-muted-foreground">
                      Price level where selling pressure typically overcomes
                      buying pressure
                    </span>
                  </li>
                  <li>
                    <span className="font-medium block">Trend</span>
                    <span className="text-sm text-muted-foreground">
                      Overall direction of price movement (uptrend, downtrend,
                      sideways)
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Trade Management Terms</h3>
                <ul className="space-y-3">
                  <li>
                    <span className="font-medium block">Stop Loss</span>
                    <span className="text-sm text-muted-foreground">
                      Price point to exit a losing trade to limit losses
                    </span>
                  </li>
                  <li>
                    <span className="font-medium block">Take Profit</span>
                    <span className="text-sm text-muted-foreground">
                      Price point to exit a winning trade to secure profits
                    </span>
                  </li>
                  <li>
                    <span className="font-medium block">Risk:Reward Ratio</span>
                    <span className="text-sm text-muted-foreground">
                      Comparison between potential loss and potential profit
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Risk Management */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Risk Management Principles</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Position Sizing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-muted-foreground">
                  <span className="font-medium text-foreground">1% Rule: </span>
                  Risk only 1% of your account per trade
                </li>
                <li className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Calculation:{" "}
                  </span>
                  Account size × Risk percentage
                </li>
                <li className="text-muted-foreground">
                  <span className="font-medium text-foreground">Example: </span>
                  $10,000 account = $100 max risk per trade
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Management Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Always use stop losses</li>
                <li>Never risk more than you can afford to lose</li>
                <li>Consider risk:reward ratio (minimum 1:2)</li>
                <li>Don't overtrade or chase losses</li>
                <li>Keep a trading journal</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Before moving on to trading strategies, make sure you understand these
          basic concepts thoroughly. Practice calculating position sizes and
          identifying potential trades without real money first.
        </AlertDescription>
      </Alert>
    </div>
  );
}
