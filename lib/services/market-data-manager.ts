// lib/services/market-data-manager.ts
import { MarketDataService } from "./market-data";

class MarketDataManager {
  private static instance: MarketDataService | null = null;
  private static activeSymbols = new Set<string>();

  static getInstance(): MarketDataService {
    if (!this.instance) {
      this.instance = new MarketDataService();
      this.instance.connect();
    }
    return this.instance;
  }

  static subscribeToSymbol(symbol: string, callback: (data: any) => void) {
    const service = this.getInstance();
    this.activeSymbols.add(symbol);
    service.subscribe(symbol, callback);
  }

  static unsubscribeFromSymbol(symbol: string) {
    if (!this.instance) return;
    this.activeSymbols.delete(symbol);
    this.instance.unsubscribe(symbol);
  }

  static async getHistoricalData(
    symbol: string,
    interval?: string,
    limit?: number
  ) {
    const service = this.getInstance();
    return await service.fetchHistoricalData(symbol, interval, limit);
  }

  static getActiveSymbols() {
    return Array.from(this.activeSymbols);
  }

  static cleanup() {
    if (this.instance) {
      this.instance.disconnect();
      this.instance = null;
    }
    this.activeSymbols.clear();
  }
}

export default MarketDataManager;
