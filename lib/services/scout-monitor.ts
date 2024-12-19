// lib/services/scout-monitoring.ts
import { Scout, Signal } from "@prisma/client";
import { prisma } from "@/lib/db";
import MarketDataManager from "./market-data-manager";
import { SignalDetector } from "../signals/automated-detector";
import { EventEmitter } from "events";

export class ScoutMonitor extends EventEmitter {
  private activeScouts: Map<string, NodeJS.Timer> = new Map();
  private marketDataCache: Map<string, any[]> = new Map();
  private signalDetector: SignalDetector;

  constructor() {
    super();
    this.signalDetector = new SignalDetector();
  }

  async startScout(scout: Scout) {
    if (this.activeScouts.has(scout.id)) {
      console.log(`Scout ${scout.id} is already running`);
      return;
    }

    try {
      // Initialize market data for each symbol
      for (const symbol of scout.symbols) {
        // Get initial historical data
        const historicalData = await MarketDataManager.getHistoricalData(
          symbol
        );
        this.marketDataCache.set(symbol, historicalData);

        // Subscribe to real-time updates
        MarketDataManager.subscribeToSymbol(symbol, (data) => {
          this.handleMarketData(scout, symbol, data);
        });
      }

      // Start interval for regular analysis
      const intervalMs = this.parseInterval(scout.interval);
      const timer = setInterval(() => this.analyzeMarkets(scout), intervalMs);
      this.activeScouts.set(scout.id, timer);

      console.log(`Started scout ${scout.id} with interval ${intervalMs}ms`);
    } catch (error) {
      console.error(`Error starting scout ${scout.id}:`, error);
      await this.handleScoutError(scout.id, error);
    }
  }

  async stopScout(scoutId: string) {
    const timer = this.activeScouts.get(scoutId);
    if (timer) {
      clearInterval(timer);
      this.activeScouts.delete(scoutId);

      try {
        const scout = await prisma.scout.findUnique({ where: { id: scoutId } });
        if (scout) {
          // Unsubscribe from market data
          scout.symbols.forEach((symbol) => {
            MarketDataManager.unsubscribeFromSymbol(symbol);
          });
        }
      } catch (error) {
        console.error(`Error cleaning up scout ${scoutId}:`, error);
      }

      console.log(`Stopped scout ${scoutId}`);
    }
  }

  private handleMarketData(scout: Scout, symbol: string, newData: any) {
    // Update market data cache
    let data = this.marketDataCache.get(symbol) || [];
    data.push(newData);

    // Keep only last 100 candles
    if (data.length > 100) {
      data = data.slice(-100);
    }

    this.marketDataCache.set(symbol, data);
  }

  private async analyzeMarkets(scout: Scout) {
    try {
      for (const symbol of scout.symbols) {
        const marketData = this.marketDataCache.get(symbol);
        if (!marketData || marketData.length < 50) {
          console.log(`Insufficient data for ${symbol}`);
          continue;
        }

        const signal = await this.signalDetector.analyzeMarket(
          marketData,
          symbol,
          scout.userId,
          scout.strategy
        );

        if (signal) {
          await this.handleNewSignal(signal, scout);
        }
      }
    } catch (error) {
      console.error(`Error analyzing markets for scout ${scout.id}:`, error);
      await this.handleScoutError(scout.id, error);
    }
  }

  private async handleNewSignal(signal: Signal, scout: Scout) {
    try {
      // Save signal to database
      const savedSignal = await prisma.signal.create({
        data: signal,
      });

      // Update scout metrics
      await prisma.scout.update({
        where: { id: scout.id },
        data: {
          totalSignals: { increment: 1 },
          lastSignalAt: new Date(),
        },
      });

      // Emit event for real-time updates
      this.emit("newSignal", savedSignal);
    } catch (error) {
      console.error("Error handling new signal:", error);
    }
  }

  private async handleScoutError(scoutId: string, error: any) {
    try {
      await prisma.scout.update({
        where: { id: scoutId },
        data: {
          status: "ERROR",
        },
      });

      await this.stopScout(scoutId);
    } catch (dbError) {
      console.error("Error updating scout status:", dbError);
    }
  }

  private parseInterval(interval: string): number {
    const value = parseInt(interval.slice(0, -1));
    const unit = interval.slice(-1);

    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      default:
        return 15000; // default to 15 seconds
    }
  }
}
