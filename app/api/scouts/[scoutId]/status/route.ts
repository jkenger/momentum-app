// app/api/scouts/[scoutId]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { z } from "zod";
import ScoutMonitorManager from "@/lib/services/scout-monitor-manager";

const updateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export async function PATCH(req: NextRequest, props: { params: Promise<{ scoutId: string }> }) {
  const params = await props.params;
  const scoutId = params.scoutId;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scout = await prisma.scout.findFirst({
      where: {
        id: scoutId,
        userId: session.user.id,
      },
    });

    if (!scout) {
      return NextResponse.json({ error: "Scout not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status } = updateStatusSchema.parse(body);

    const updatedScout = await prisma.scout.update({
      where: { id: scoutId },
      data: { status },
    });

    if (status === "ACTIVE") {
      await ScoutMonitorManager.startScout(updatedScout);
    } else {
      await ScoutMonitorManager.stopScout(scoutId);
    }

    return NextResponse.json(updatedScout);
  } catch (error) {
    console.error("Error updating scout status:", error);
    return NextResponse.json(
      { error: "Failed to update scout status" },
      { status: 500 }
    );
  }
}
