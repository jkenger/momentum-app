// app/api/test/market/route.ts
import { NextResponse } from "next/server";
import { MockMarketData } from "@/lib/services/mock-market-data";
import { signalDetector } from "@/lib/signals/automated-detector";

// Keep mock market instance in memory
let mockMarket: MockMarketData | null = null;

export async function POST(req: Request) {
  try {
    const { action, params } = await req.json();

    if (!mockMarket) {
      mockMarket = new MockMarketData();
    }

    switch (action) {
      case "init":
        const { initialPrice, volatility, trend } = params;
        mockMarket = new MockMarketData(initialPrice, volatility, trend);
        return NextResponse.json({
          success: true,
          data: mockMarket.getCurrentData(),
        });

      case "next":
        const newCandle = mockMarket.generateNextCandle();
        const currentData = mockMarket.getCurrentData();

        // Test signal detection with new data
        const signal = await signalDetector.analyzeMarket(
          currentData,
          params.symbol || "BTC/USDT",
          params.userId,
          params.strategy || "EMA_CROSSOVER"
        );

        return NextResponse.json({
          success: true,
          data: currentData,
          lastCandle: newCandle,
          signal: signal,
        });

      case "scenario":
        mockMarket.generateScenario(params.scenario);
        return NextResponse.json({
          success: true,
          message: `Started ${params.scenario} scenario`,
        });

      case "reset":
        mockMarket.reset(params.price);
        return NextResponse.json({
          success: true,
          data: mockMarket.getCurrentData(),
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in market test:", error);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
