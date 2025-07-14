import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    console.log("🔍 Debugging user orders for:", session.user.email);
    console.log("👤 User ID:", session.user.id);

    // Get all orders for this user
    const userOrders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("📦 Found orders:", userOrders.length);

    // Also get all orders in the database
    const allOrders = await db.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      currentUser: {
        id: session.user.id,
        email: session.user.email,
      },
      userOrdersCount: userOrders.length,
      userOrders: userOrders.map((order) => ({
        id: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        itemsCount: order.items.length,
        items: order.items.map((item) => ({
          productTitle: item.product.title,
          quantity: item.quantity,
          price: item.price,
        })),
      })),
      allOrdersCount: allOrders.length,
      allOrders: allOrders.map((order) => ({
        id: order.id,
        userId: order.userId,
        userEmail: order.user.email,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
