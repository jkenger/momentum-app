// app/api/signals/detect/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-utils";
import { signalDetector } from "@/lib/signals/automated-detector";
import { broadcastSignal } from "../stream/route";
import { logger } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      logger.log("Unauthorized access attempt", "error");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { symbol = "BTC/USDT", strategy = "EMA_CROSSOVER" } =
      await req.json();

    logger.log(`Analyzing ${symbol} with ${strategy} strategy`, "info");

    const marketData = await fetchMarketData(symbol);
    const signal = await signalDetector.analyzeMarket(
      marketData,
      symbol,
      session.user.id,
      strategy
    );

    if (signal) {
      logger.log("Signal generated successfully", "success", {
        ...signal,
      });

      broadcastSignal({
        type: "new-signal",
        signal,
      });

      return NextResponse.json({ signal });
    }

    logger.log("No signal conditions met", "warning");
    return NextResponse.json({ message: "No signal generated" });
  } catch (error) {
    logger.log("Error in signal detection", "error", error);
    return NextResponse.json(
      { error: "Failed to analyze market" },
      { status: 500 }
    );
  }
}

// Mock market data function (replace with real API)
async function fetchMarketData(symbol: string) {
  const now = Date.now();
  return Array.from({ length: 100 }, (_, i) => ({
    timestamp: now - (99 - i) * 4 * 60 * 60 * 1000,
    open: 40000 + Math.random() * 1000,
    high: 41000 + Math.random() * 1000,
    low: 39000 + Math.random() * 1000,
    close: 40500 + Math.random() * 1000,
    volume: 1000000 + Math.random() * 500000,
  }));
}
