import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Get the first user (for testing)
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    // Get some products
    const products = await db.product.findMany({ take: 2 });
    if (products.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    // Create a test order
    const order = await db.order.create({
      data: {
        userId: user.id,
        stripeSessionId: `test_session_${Date.now()}`,
        status: "pending",
        total: products.reduce((sum, product) => sum + product.price, 0),
        items: {
          create: products.map((product) => ({
            productId: product.id,
            quantity: 1,
            price: product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Test order created successfully",
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        itemsCount: order.items.length,
        items: order.items.map((item) => ({
          productTitle: item.product.title,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
