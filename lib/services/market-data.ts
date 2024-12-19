// lib/services/market-data.ts
import WebSocket from "ws";

interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class MarketDataService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, (data: OHLCV) => void> = new Map();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private readonly BINANCE_WS_URL = "wss://stream.binance.com:9443/ws";

  private formatSymbol(symbol: string): string {
    // Convert BTC/USDT to BTCUSDT format
    return symbol.replace("/", "").toUpperCase();
  }

  connect() {
    this.ws = new WebSocket(this.BINANCE_WS_URL);

    this.ws.on("open", () => {
      console.log("Connected to Binance WebSocket");
      this.subscribeToAllSymbols();
    });

    this.ws.on("message", (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.e === "kline") {
          const ohlcv: OHLCV = {
            timestamp: message.k.t,
            open: parseFloat(message.k.o),
            high: parseFloat(message.k.h),
            low: parseFloat(message.k.l),
            close: parseFloat(message.k.c),
            volume: parseFloat(message.k.v),
          };

          const symbol = this.formatSymbol(message.s);
          const callback = this.subscriptions.get(symbol);
          if (callback) {
            callback(ohlcv);
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    this.ws.on("close", () => {
      console.log("WebSocket connection closed");
      this.reconnect();
    });

    this.ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      this.reconnect();
    });
  }

  private reconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log("Attempting to reconnect...");
      this.connect();
    }, 5000);
  }

  subscribe(symbol: string, callback: (data: OHLCV) => void) {
    const formattedSymbol = this.formatSymbol(symbol);
    this.subscriptions.set(formattedSymbol, callback);

    if (this.ws?.readyState === WebSocket.OPEN) {
      const subscribeMsg = {
        method: "SUBSCRIBE",
        params: [`${formattedSymbol.toLowerCase()}@kline_1m`],
        id: Date.now(),
      };
      this.ws.send(JSON.stringify(subscribeMsg));
    }
  }

  private subscribeToAllSymbols() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const symbols = Array.from(this.subscriptions.keys());
    if (symbols.length === 0) return;

    const subscribeMsg = {
      method: "SUBSCRIBE",
      params: symbols.map((symbol) => `${symbol.toLowerCase()}@kline_1m`),
      id: Date.now(),
    };
    this.ws.send(JSON.stringify(subscribeMsg));
  }

  unsubscribe(symbol: string) {
    const formattedSymbol = this.formatSymbol(symbol);
    this.subscriptions.delete(formattedSymbol);

    if (this.ws?.readyState === WebSocket.OPEN) {
      const unsubscribeMsg = {
        method: "UNSUBSCRIBE",
        params: [`${formattedSymbol.toLowerCase()}@kline_1m`],
        id: Date.now(),
      };
      this.ws.send(JSON.stringify(unsubscribeMsg));
    }
  }

  async fetchHistoricalData(
    symbol: string,
    interval: string = "1m",
    limit: number = 100
  ): Promise<OHLCV[]> {
    const formattedSymbol = this.formatSymbol(symbol);
    const url = `https://api.binance.com/api/v3/klines?symbol=${formattedSymbol}&interval=${interval}&limit=${limit}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from Binance API");
      }

      return data.map((item: any[]) => ({
        timestamp: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      }));
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      throw error;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscriptions.clear();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
  }
}
