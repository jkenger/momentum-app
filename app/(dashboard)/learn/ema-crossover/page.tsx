// app/(dashboard)/learn/ema-crossover/page.tsx

import { LearnHeader } from "@/components/learn/header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { EmaChart } from "@/components/learn/ema-diagram";
import { SignalPattern } from "@/components/learn/signal-patterns";
import { Separator } from "@/components/ui/separator";

export default function EmaCrossoverPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-8 py-6">
      <LearnHeader
        title="EMA Crossover Strategy"
        description="Learn how to trade using the EMA Crossover strategy"
      />

      {/* Live Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Strategy Visualization</h2>
        <p className="text-muted-foreground">
          This chart shows how the EMA Crossover strategy works in practice.
          Notice how the 20 EMA (blue) crossing above/below the 50 EMA (red)
          generates trading signals.
        </p>
        <EmaChart className="mt-4 rounded-lg border p-4" />
      </section>

      {/* Signal Patterns */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Signal Patterns</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <SignalPattern type="bullish" />
          <SignalPattern type="bearish" />
        </div>
      </section>

      <Separator />

      {/* Strategy Details */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Buy Signal (Long)</h3>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>20 EMA crosses above 50 EMA</li>
              <li>Price is above both EMAs</li>
              <li>Volume increases during the crossover</li>
              <li>RSI is not in overbought territory (&lt;70)</li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Sell Signal (Short)</h3>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>20 EMA crosses below 50 EMA</li>
              <li>Price is below both EMAs</li>
              <li>Volume increases during the crossover</li>
              <li>RSI is not in oversold territory (&gt;30)</li>
            </ul>
          </div>
        </div>

        <Alert className="bg-yellow-50 border-yellow-200 flex items-center">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Remember: EMA crossovers work best in trending markets. Be cautious
            of false signals in ranging markets.
          </AlertDescription>
        </Alert>
      </section>

      {/* Trade Management */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Trade Management</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Entry Rules</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Wait for the crossover to complete</li>
            <li>Confirm trend direction on higher timeframe</li>
            <li>Check for nearby support/resistance levels</li>
            <li>Enter on market or limit order</li>
          </ul>

          <h3 className="text-xl font-medium">Position Size</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Risk maximum 1-2% of account per trade</li>
            <li>Calculate position size based on stop loss distance</li>
            <li>Consider reducing size in high volatility</li>
          </ul>

          <h3 className="text-xl font-medium">Take Profit Levels</h3>
          <div className="rounded-lg border p-4">
            <ul className="space-y-2">
              <li>First Target: 2% (Take 1/3 of position)</li>
              <li>Second Target: 4% (Take 1/3 of position)</li>
              <li>Final Target: 6% (Close remaining position)</li>
            </ul>
          </div>

          <h3 className="text-xl font-medium">Stop Loss</h3>
          <div className="rounded-lg border p-4">
            <ul className="space-y-2">
              <li>Initial Stop: 2% from entry</li>
              <li>Move to breakeven after first target hit</li>
              <li>Trail stop using the 50 EMA for remaining position</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tips for Success */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Tips for Success</h2>
        <div className="space-y-4">
          <ul className="list-disc pl-6 space-y-2">
            <li>Don&apos;t trade against the major trend</li>
            <li>Avoid trading during major news events</li>
            <li>Keep track of your trades in a journal</li>
            <li>Practice on a demo account first</li>
            <li>Be patient waiting for proper setups</li>
          </ul>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Common Mistakes to Avoid</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Jumping the Gun</h3>
            <p className="text-muted-foreground">
              Entering before the crossover is complete can lead to false
              signals.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Ignoring Volume</h3>
            <p className="text-muted-foreground">
              Volume confirms the strength of a move. Low volume signals are
              less reliable.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Moving Stops Too Soon</h3>
            <p className="text-muted-foreground">
              Moving stops to breakeven too quickly can result in missed
              opportunities.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Overtrading</h3>
            <p className="text-muted-foreground">
              Taking every signal without considering market conditions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
