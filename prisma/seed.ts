import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.tradingHistory.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.marketData.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding database...");

  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@momentum.app",
      name: "Demo User",
      password: await bcrypt.hash("demo123", 10),
      preferences: {
        defaultTimeframe: "4h",
        favoriteSymbols: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
        notifications: {
          email: true,
          push: true,
          signals: true,
        },
      },
    },
  });

  // Create watchlists
  const watchlist = await prisma.watchlist.create({
    data: {
      name: "Top Cryptos",
      symbols: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT"],
      userId: demoUser.id,
    },
  });

  // Create sample signals
  const signals = await Promise.all([
    prisma.signal.create({
      data: {
        symbol: "BTC/USDT",
        timeframe: "4h",
        type: "PRICE_ACTION",
        direction: "LONG",
        entryPrice: 42000.0,
        targetPrice: [43000.0, 44000.0, 45000.0],
        stopLoss: 41000.0,
        confidence: 85,
        status: "ACTIVE",
        indicators: {
          rsi: 65,
          macd: {
            histogram: 25.5,
            signal: 15.2,
            value: 40.7,
          },
          ma: {
            ma20: 41800,
            ma50: 41200,
            ma200: 39500,
          },
        },
        userId: demoUser.id,
        notes: "Strong bullish momentum with MA support",
      },
    }),
    prisma.signal.create({
      data: {
        symbol: "ETH/USDT",
        timeframe: "4h",
        type: "SUPPORT_RESISTANCE",
        direction: "LONG",
        entryPrice: 2200.0,
        targetPrice: [2300.0, 2400.0],
        stopLoss: 2100.0,
        confidence: 75,
        status: "COMPLETED",
        outcome: "TARGET_HIT",
        indicators: {
          rsi: 58,
          supportLevels: [2150, 2100, 2050],
          resistanceLevels: [2300, 2400, 2500],
        },
        userId: demoUser.id,
        actualOutcome: 4.5,
        exitPrice: 2300.0,
        exitTime: new Date("2024-01-10T14:30:00Z"),
      },
    }),
  ]);

  // Create trading history
  const tradingHistory = await Promise.all([
    prisma.tradingHistory.create({
      data: {
        userId: demoUser.id,
        symbol: "BTC/USDT",
        entryPrice: 40000.0,
        exitPrice: 42000.0,
        direction: "LONG",
        profit: 5.0,
        volume: 0.5,
        entryTime: new Date("2024-01-01T10:00:00Z"),
        exitTime: new Date("2024-01-02T15:30:00Z"),
        notes: "Strong breakout trade",
      },
    }),
    prisma.tradingHistory.create({
      data: {
        userId: demoUser.id,
        symbol: "ETH/USDT",
        entryPrice: 2300.0,
        exitPrice: 2250.0,
        direction: "LONG",
        profit: -2.17,
        volume: 1.0,
        entryTime: new Date("2024-01-05T09:15:00Z"),
        exitTime: new Date("2024-01-05T16:45:00Z"),
        notes: "Stopped out on market reversal",
      },
    }),
  ]);

  // Create sample market data
  const now = new Date();
  const marketData = await Promise.all(
    Array.from({ length: 24 }).map((_, i) => {
      const timestamp = new Date(now.getTime() - i * 3600000); // Past 24 hours
      return prisma.marketData.create({
        data: {
          symbol: "BTC/USDT",
          timeframe: "1h",
          timestamp,
          open: 42000 + Math.random() * 1000,
          high: 42500 + Math.random() * 1000,
          low: 41500 + Math.random() * 1000,
          close: 42200 + Math.random() * 1000,
          volume: 1000000 + Math.random() * 500000,
          indicators: {
            rsi: 45 + Math.random() * 20,
            macd: {
              histogram: Math.random() * 50 - 25,
              signal: Math.random() * 50 - 25,
              value: Math.random() * 50 - 25,
            },
          },
        },
      });
    })
  );

  console.log({
    demoUser: { id: demoUser.id, email: demoUser.email },
    watchlistCount: 1,
    signalsCount: signals.length,
    tradingHistoryCount: tradingHistory.length,
    marketDataCount: marketData.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
