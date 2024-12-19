// app/api/scouts/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createScoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  tier: z.enum(["BASIC", "PRO", "ELITE"]),
  strategy: z.enum([
    "EMA_CROSSOVER",
    "RSI_DIVERGENCE",
    "SUPPORT_RESISTANCE",
    "VOLUME_BREAKOUT",
  ]),
  symbols: z.array(z.string()),
  interval: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createScoutSchema.parse(body);

    const scout = await prisma.scout.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        status: "INACTIVE",
        config: getDefaultConfig(validatedData.strategy),
      },
    });

    return NextResponse.json(scout);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating scout:", error);
    return NextResponse.json(
      { error: "Failed to create scout" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scouts = await prisma.scout.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(scouts);
  } catch (error) {
    console.error("Error fetching scouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch scouts" },
      { status: 500 }
    );
  }
}

function getDefaultConfig(strategy: string) {
  switch (strategy) {
    case "EMA_CROSSOVER":
      return {
        fastEMA: 20,
        slowEMA: 50,
        volumeThreshold: 1.5,
        minimumConfidence: 75,
      };
    case "RSI_DIVERGENCE":
      return {
        rsiPeriod: 14,
        overbought: 70,
        oversold: 30,
        divergencePeriods: 10,
      };
    case "SUPPORT_RESISTANCE":
      return {
        periods: 20,
        sensitivity: 2,
        minTouchPoints: 3,
      };
    case "VOLUME_BREAKOUT":
      return {
        volumeMultiplier: 2,
        priceChangeThreshold: 1,
        consolidationPeriods: 5,
      };
    default:
      return {};
  }
}
