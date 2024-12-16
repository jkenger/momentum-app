// app/api/test/signal/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth-utils";
import { broadcastSignal } from "../../signals/stream/route";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const signal = await prisma.signal.create({
      data: {
        symbol: "BTC/USDT",
        timeframe: "4h",
        type: "PRICE_ACTION",
        direction: "LONG",
        entryPrice: 42000 + Math.random() * 1000,
        targetPrice: [43000, 44000],
        stopLoss: 41000,
        confidence: 75,
        status: "ACTIVE",
        user: {
          connect: {
            id: user.id,
          },
        },
        indicators: {
          rsi: 65,
          macd: {
            histogram: 25.5,
            signal: 15.2,
            value: 40.7,
          },
        },
        notes: "Test signal created via API",
      },
    });

    // Broadcast the new signal to all clients
    console.log("Broadcasting new signal");
    broadcastSignal({
      type: "new-signal",
      signal,
    });

    return NextResponse.json(signal);
  } catch (error) {
    console.error("Error creating test signal:", error);
    return NextResponse.json(
      { error: "Failed to create test signal" },
      { status: 500 }
    );
  }
}
