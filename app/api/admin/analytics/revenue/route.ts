import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all order items with product information
    const orderItems = await db.orderItem.findMany({
      where: {
        order: {
          status: { not: "cancelled" },
        },
      },
      include: {
        product: true,
        order: true,
      },
    });

    // Group by product and calculate revenue
    const revenueByProduct = orderItems.reduce((acc, item) => {
      const productName = item.product.title;
      const revenue = item.price * item.quantity;

      if (acc[productName]) {
        acc[productName].revenue += revenue;
        acc[productName].orders += 1;
      } else {
        acc[productName] = {
          product: productName,
          revenue,
          orders: 1,
        };
      }

      return acc;
    }, {} as Record<string, { product: string; revenue: number; orders: number }>);

    // Convert to array and sort by revenue
    const revenueData = Object.values(revenueByProduct).sort(
      (a, b) => b.revenue - a.revenue
    );

    return NextResponse.json(revenueData);
  } catch (error) {
    console.error("Revenue analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
