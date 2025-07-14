import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Get the first pending order
    const order = await db.order.findFirst({
      where: { status: "pending" },
    });

    if (!order) {
      return NextResponse.json(
        { error: "No pending orders found" },
        { status: 404 }
      );
    }

    console.log("🔄 Test completing order:", order.id);

    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });

    console.log("✅ Order completed successfully:", updatedOrder.id);

    return NextResponse.json({
      message: "Test order completed successfully",
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        completedAt: updatedOrder.completedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error completing test order:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
