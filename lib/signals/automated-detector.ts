// lib/signals/automated-detector.ts
import { prisma } from "@/lib/db";
import { SignalType } from "@prisma/client";

interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class SignalDetector {
  private calculateEMA(prices: number[], period: number): number[] {
    const multiplier = 2 / (period + 1);
    const ema = [prices[0]];

    for (let i = 1; i < prices.length; i++) {
      ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
    }

    return ema;
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period + 1; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }

    gains /= period;
    losses /= period;

    const relativeStrength = gains / losses;
    return 100 - 100 / (1 + relativeStrength);
  }

  private calculateAverageVolume(
    volumes: number[],
    period: number = 20
  ): number {
    return volumes.slice(-period).reduce((sum, vol) => sum + vol, 0) / period;
  }

  private detectEmaCrossover(data: OHLCV[]) {
    const closePrices = data.map((d) => d.close);
    const ema20 = this.calculateEMA(closePrices, 20);
    const ema50 = this.calculateEMA(closePrices, 50);

    const currentEma20 = ema20[ema20.length - 1];
    const previousEma20 = ema20[ema20.length - 2];
    const currentEma50 = ema50[ema50.length - 1];
    const previousEma50 = ema50[ema50.length - 2];

    const bullishCrossover =
      previousEma20 <= previousEma50 && currentEma20 > currentEma50;
    const bearishCrossover =
      previousEma20 >= previousEma50 && currentEma20 < currentEma50;

    return {
      signal: bullishCrossover ? "LONG" : bearishCrossover ? "SHORT" : null,
      indicators: {
        ema20: currentEma20,
        ema50: currentEma50,
      },
    };
  }

  private detectVolumeBreakout(data: OHLCV[]) {
    const volumes = data.map((d) => d.volume);
    const avgVolume = this.calculateAverageVolume(volumes);
    const currentVolume = volumes[volumes.length - 1];
    const volumeBreakout = currentVolume > avgVolume * 2;

    const closePrices = data.map((d) => d.close);
    const priceChange =
      (closePrices[closePrices.length - 1] -
        closePrices[closePrices.length - 2]) /
      closePrices[closePrices.length - 2];

    return {
      signal: volumeBreakout ? (priceChange > 0 ? "LONG" : "SHORT") : null,
      indicators: {
        currentVolume,
        avgVolume,
        priceChange,
      },
    };
  }

  async analyzeMarket(
    data: OHLCV[],
    symbol: string,
    userId: string,
    strategy: SignalType
  ) {
    try {
      const currentPrice = data[data.length - 1].close;
      let signalData;

      switch (strategy) {
        case "EMA_CROSSOVER":
          signalData = this.detectEmaCrossover(data);
          break;
        case "VOLUME_BREAKOUT":
          signalData = this.detectVolumeBreakout(data);
          break;
        // Add other strategies here
        default:
          return null;
      }

      if (!signalData?.signal) return null;

      const direction = signalData.signal;
      const stopLoss =
        direction === "LONG"
          ? currentPrice * 0.98 // 2% below entry for longs
          : currentPrice * 1.02; // 2% above entry for shorts

      const targets =
        direction === "LONG"
          ? [currentPrice * 1.02, currentPrice * 1.04, currentPrice * 1.06]
          : [currentPrice * 0.98, currentPrice * 0.96, currentPrice * 0.94];

      // Create signal
      const signal = await prisma.signal.create({
        data: {
          symbol,
          timeframe: "4h",
          type: strategy,
          direction,
          entryPrice: currentPrice,
          targetPrice: targets,
          stopLoss,
          confidence: 75, // You can calculate this based on strategy
          status: "ACTIVE",
          userId,
          indicators: signalData.indicators,
          notes: `Automated ${strategy} signal generated a ${direction} signal`,
        },
      });

      return signal;
    } catch (error) {
      console.error("Error in signal detection:", error);
      return null;
    }
  }
}

export const signalDetector = new SignalDetector();
