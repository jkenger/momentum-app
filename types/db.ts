// types/db.ts
import { Prisma } from "@prisma/client";

// User with preferences type
export type UserWithPreferences = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    preferences: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

// Signal with full details type
export type SignalWithDetails = Prisma.SignalGetPayload<{
  include: {
    user: true;
  };
}>;

// Market data with indicators type
export type MarketDataWithIndicators = Prisma.MarketDataGetPayload<{
  select: {
    id: true;
    symbol: true;
    timeframe: true;
    timestamp: true;
    open: true;
    high: true;
    low: true;
    close: true;
    volume: true;
    indicators: true;
  };
}>;

// Trading history with details type
export type TradingHistoryWithDetails = Prisma.TradingHistoryGetPayload<{
  include: {
    user: true;
  };
}>;

// API response types
export type ApiResponse<T> = {
  data: T | null;
  error: {
    message: string;
    code?: string;
    meta?: Record<string, any>;
  } | null;
};

// Query parameters types
export type MarketDataParams = {
  symbol: string;
  timeframe: string;
  limit?: number;
  startTime?: Date;
  endTime?: Date;
};

export type SignalParams = {
  userId: string;
  status?: string;
  type?: string;
  limit?: number;
};
