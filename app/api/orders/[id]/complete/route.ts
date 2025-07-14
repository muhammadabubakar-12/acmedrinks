import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🔄 Completing order:", params.id);

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("❌ Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("👤 User:", session.user.email);

    // First check if the order exists and belongs to the user
    const existingOrder = await db.order.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingOrder) {
      console.log("❌ Order not found or doesn't belong to user");
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    console.log(
      "📋 Found order:",
      existingOrder.id,
      "Status:",
      existingOrder.status
    );

    const updatedOrder = await db.order.update({
      where: { id: params.id },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });

    console.log("✅ Order completed:", updatedOrder.id);
    return NextResponse.json({ message: "Order marked as completed" });
  } catch (error) {
    console.error("❌ Error completing order:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
