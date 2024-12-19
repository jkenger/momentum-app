// app/api/scouts/[scoutId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  props: { params: Promise<{ scoutId: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scout = await prisma.scout.findFirst({
      where: {
        id: params.scoutId,
        userId: session.user.id,
      },
    });

    if (!scout) {
      return NextResponse.json({ error: "Scout not found" }, { status: 404 });
    }

    return NextResponse.json(scout);
  } catch (error) {
    console.error("Error fetching scout:", error);
    return NextResponse.json(
      { error: "Failed to fetch scout" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ scoutId: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scout = await prisma.scout.findFirst({
      where: {
        id: params.scoutId,
        userId: session.user.id,
      },
    });

    if (!scout) {
      return NextResponse.json({ error: "Scout not found" }, { status: 404 });
    }

    await prisma.scout.delete({
      where: { id: params.scoutId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting scout:", error);
    return NextResponse.json(
      { error: "Failed to delete scout" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ scoutId: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scout = await prisma.scout.findFirst({
      where: {
        id: params.scoutId,
        userId: session.user.id,
      },
    });

    if (!scout) {
      return NextResponse.json({ error: "Scout not found" }, { status: 404 });
    }

    const body = await req.json();

    const updatedScout = await prisma.scout.update({
      where: { id: params.scoutId },
      data: {
        name: body.name,
        description: body.description,
        config: body.config,
        symbols: body.symbols,
        interval: body.interval,
      },
    });

    return NextResponse.json(updatedScout);
  } catch (error) {
    console.error("Error updating scout:", error);
    return NextResponse.json(
      { error: "Failed to update scout" },
      { status: 500 }
    );
  }
}
