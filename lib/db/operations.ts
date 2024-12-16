// lib/db/operations.ts

import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type ErrorWithMessage = {
  message: string;
  code?: string;
  meta?: Record<string, any>;
};

/**
 * Handle Prisma operation errors
 */
export function handlePrismaError(error: any): ErrorWithMessage {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    switch (error.code) {
      case "P2002":
        return {
          message: "A unique constraint would be violated.",
          code: error.code,
          meta: error.meta,
        };
      case "P2025":
        return {
          message: "Record not found.",
          code: error.code,
          meta: error.meta,
        };
      default:
        return {
          message: "Database operation failed.",
          code: error.code,
          meta: error.meta,
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      message: "Invalid data provided.",
      code: "VALIDATION_ERROR",
    };
  }

  // Handle unknown errors
  return {
    message: "An unexpected error occurred.",
    code: "UNKNOWN_ERROR",
  };
}

/**
 * Safely execute a Prisma operation with error handling
 */
export async function executePrismaOperation<T>(
  operation: () => Promise<T>
): Promise<{ data: T | null; error: ErrorWithMessage | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handlePrismaError(error) };
  }
}

/**
 * Example usage functions for common operations
 */

export async function findUserById(id: string) {
  return executePrismaOperation(() =>
    prisma.user.findUniqueOrThrow({
      where: { id },
    })
  );
}

export async function findUserSignals(userId: string) {
  return executePrismaOperation(() =>
    prisma.signal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  );
}

export async function updateUserPreferences(userId: string, preferences: any) {
  return executePrismaOperation(() =>
    prisma.user.update({
      where: { id: userId },
      data: { preferences },
    })
  );
}

export async function findLatestMarketData(
  symbol: string,
  timeframe: string,
  limit = 100
) {
  return executePrismaOperation(() =>
    prisma.marketData.findMany({
      where: {
        symbol,
        timeframe,
      },
      orderBy: { timestamp: "desc" },
      take: limit,
    })
  );
}
